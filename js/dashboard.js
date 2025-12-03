// js/dashboard.js
// Phase 2 front-end dashboard logic.
// NOTE: Currently uses a fake login for demo. Replace fakeLoginApi with real backend calls when ready.

// Simulated login API - accept any non-empty credentials.
// Later, replace this with fetch() to your real backend /auth/login endpoint.
function fakeLoginApi(email, password, passkey) {
  return new Promise((resolve, reject) => {
    if (email && password && passkey) {
      const demoUser = {
        email,
        packageName: "Career Pack",
        packageCode: "CAREER_PACK",
        quotas: {
          match: { used: 0, total: 5 },
          resume: { used: 0, total: 5 },
          cover: { used: 0, total: 5 },
          interview: { used: 0, total: 1 }
        }
      };
      setTimeout(() => resolve(demoUser), 600);
    } else {
      setTimeout(() => reject(new Error("Invalid credentials")), 400);
    }
  });
}

function saveAuthState(user) {
  try {
    localStorage.setItem("careerAlignUser", JSON.stringify(user));
  } catch (e) {
    // Ignore storage errors
  }
}

function loadAuthState() {
  try {
    const raw = localStorage.getItem("careerAlignUser");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function clearAuthState() {
  try {
    localStorage.removeItem("careerAlignUser");
  } catch {
    // ignore
  }
}

function setActiveView(view) {
  document.querySelectorAll(".dashboard-view").forEach((el) => {
    el.classList.add("hidden");
  });
  const target = document.getElementById(`view-${view}`);
  if (target) target.classList.remove("hidden");

  document.querySelectorAll(".dashboard-nav-item").forEach((btn) => {
    btn.classList.remove("dashboard-nav-item-active");
    if (btn.dataset.view === view) {
      btn.classList.add("dashboard-nav-item-active");
    }
  });
}

function renderUserInfo(user) {
  const email = user.email || "user@example.com";
  const packageName = user.packageName || "Paid package";

  const userChip = document.getElementById("userChip");
  const userEmailLabel = document.getElementById("userEmailLabel");
  const userPackageLabel = document.getElementById("userPackageLabel");
  const accountEmail = document.getElementById("accountEmail");
  const accountPackage = document.getElementById("accountPackage");

  if (userChip) userChip.classList.remove("hidden");
  if (userEmailLabel) userEmailLabel.textContent = email;
  if (userPackageLabel) userPackageLabel.textContent = packageName;
  if (accountEmail) accountEmail.textContent = email;
  if (accountPackage) accountPackage.textContent = packageName;

  const quotas = user.quotas || {};

  const summaryMatchUsed = document.getElementById("summaryMatchUsed");
  const summaryMatchTotal = document.getElementById("summaryMatchTotal");
  const summaryResumeUsed = document.getElementById("summaryResumeUsed");
  const summaryResumeTotal = document.getElementById("summaryResumeTotal");

  const overviewMatchRemaining = document.getElementById("overviewMatchRemaining");
  const overviewResumeRemaining = document.getElementById("overviewResumeRemaining");
  const overviewCoverRemaining = document.getElementById("overviewCoverRemaining");
  const overviewInterviewRemaining = document.getElementById("overviewInterviewRemaining");

  if (summaryMatchUsed && quotas.match) {
    summaryMatchUsed.textContent = quotas.match.used;
    summaryMatchTotal.textContent = quotas.match.total;
    if (overviewMatchRemaining) {
      overviewMatchRemaining.textContent = quotas.match.total - quotas.match.used;
    }
  }
  if (summaryResumeUsed && quotas.resume) {
    summaryResumeUsed.textContent = quotas.resume.used;
    summaryResumeTotal.textContent = quotas.resume.total;
    if (overviewResumeRemaining) {
      overviewResumeRemaining.textContent = quotas.resume.total - quotas.resume.used;
    }
  }
  if (overviewCoverRemaining && quotas.cover) {
    overviewCoverRemaining.textContent = quotas.cover.total - quotas.cover.used;
  }
  if (overviewInterviewRemaining && quotas.interview) {
    overviewInterviewRemaining.textContent = quotas.interview.total - quotas.interview.used;
  }

  const summaryPackageName = document.getElementById("summaryPackageName");
  const summaryPackageLabel = document.getElementById("summaryPackageLabel");
  if (summaryPackageName) summaryPackageName.textContent = packageName;
  if (summaryPackageLabel) summaryPackageLabel.textContent = "Paid access • credits available";
}

function showLoginView() {
  const loginView = document.getElementById("loginView");
  const dashboardView = document.getElementById("dashboardView");
  if (loginView) loginView.classList.remove("hidden");
  if (dashboardView) dashboardView.classList.add("hidden");
}

function showDashboardView() {
  const loginView = document.getElementById("loginView");
  const dashboardView = document.getElementById("dashboardView");
  if (loginView) loginView.classList.add("hidden");
  if (dashboardView) dashboardView.classList.remove("hidden");
}

function handleLogout() {
  clearAuthState();
  showLoginView();
  setActiveView("overview");
  const mobilePanel = document.getElementById("dashboardMobilePanel");
  if (mobilePanel) mobilePanel.classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  // Register service worker for PWA (shared with landing)
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // ignore registration failure
    });
  }

  const existingUser = loadAuthState();
  if (existingUser) {
    renderUserInfo(existingUser);
    showDashboardView();
    setActiveView("overview");
  } else {
    showLoginView();
  }

  // Login form handling
  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");
  const loginBtnLabel = document.getElementById("loginBtnLabel");
  const loginBtnSpinner = document.getElementById("loginBtnSpinner");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!loginBtnLabel || !loginBtnSpinner) return;

      if (loginError) loginError.classList.add("hidden");

      const email = (document.getElementById("loginEmail") || {}).value?.trim() || "";
      const password = (document.getElementById("loginPassword") || {}).value?.trim() || "";
      const passkey = (document.getElementById("loginPasskey") || {}).value?.trim() || "";

      loginBtnLabel.textContent = "Signing in...";
      loginBtnSpinner.classList.remove("hidden");

      fakeLoginApi(email, password, passkey)
        .then((user) => {
          saveAuthState(user);
          renderUserInfo(user);
          showDashboardView();
          setActiveView("overview");
        })
        .catch(() => {
          if (loginError) loginError.classList.remove("hidden");
        })
        .finally(() => {
          loginBtnLabel.textContent = "Sign in";
          loginBtnSpinner.classList.add("hidden");
        });
    });
  }

  // Sidebar & mobile navigation
  document.querySelectorAll(".dashboard-nav-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const view = btn.dataset.view;
      if (view) {
        setActiveView(view);
      }
    });
  });

  document.querySelectorAll("[data-view-jump]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const view = btn.dataset.viewJump;
      if (view) {
        setActiveView(view);
      }
    });
  });

  const dashboardMenuToggle = document.getElementById("dashboardMenuToggle");
  const dashboardMobilePanel = document.getElementById("dashboardMobilePanel");

  if (dashboardMenuToggle && dashboardMobilePanel) {
    dashboardMenuToggle.addEventListener("click", () => {
      dashboardMobilePanel.classList.toggle("hidden");
    });

    dashboardMobilePanel.querySelectorAll(".dashboard-nav-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        dashboardMobilePanel.classList.add("hidden");
      });
    });
  }

  // Logout buttons
  const logoutBtn = document.getElementById("logoutBtn");
  const logoutBtnMobile = document.getElementById("logoutBtnMobile");
  if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
  if (logoutBtnMobile) logoutBtnMobile.addEventListener("click", handleLogout);
});
