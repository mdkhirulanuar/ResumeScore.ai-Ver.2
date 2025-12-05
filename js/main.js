document.addEventListener('DOMContentLoaded', () => {
    
    // --- FEATURE 1: Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('nav-scrolled');
                navbar.classList.remove('py-4');
            } else {
                navbar.classList.remove('nav-scrolled');
                navbar.classList.add('py-4');
            }
        });
    }

    // --- FEATURE 2: Mobile Menu Toggle ---
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex', !isHidden);
            menuBtn.setAttribute('aria-expanded', String(!isHidden));
        });
    }

    // --- FEATURE 3: Requirement match simulator ---
    const matchOptions = document.querySelectorAll('.match-option');
    const simScore = document.getElementById('sim-score');
    const simBar = document.getElementById('sim-bar');
    const simMessage = document.getElementById('sim-message');
    const simStrong = document.getElementById('sim-strong');
    const simPartial = document.getElementById('sim-partial');
    const simGaps = document.getElementById('sim-gaps');

    function calculateMatch() {
        let strongCount = 0;
        let partialCount = 0;
        let gapCount = 0;
        let total = 0;
        const rows = document.querySelectorAll('.requirement-row');

        rows.forEach(row => {
            const active = row.querySelector('.match-option.active');
            if (active) {
                const level = active.dataset.level;
                if (level === 'yes') {
                    strongCount++;
                    total += 20;
                } else if (level === 'partial') {
                    partialCount++;
                    total += 10;
                } else {
                    gapCount++;
                }
            } else {
                // Nothing selected counts as a gap
                gapCount++;
            }
        });

        // Update counts
        if (simStrong) simStrong.textContent = strongCount;
        if (simPartial) simPartial.textContent = partialCount;
        if (simGaps) simGaps.textContent = gapCount;

        // Update score and bar
        const score = total;
        if (simBar) simBar.style.width = `${score}%`;
        if (simScore) simScore.textContent = `${score}%`;

        // Colour and message logic
        if (score < 40) {
            simBar.className = 'h-full bg-red-500 transition-all duration-700';
            simScore.className = 'text-5xl font-bold text-red-500 mb-2 transition-all';
            simMessage.textContent = 'Resume Rejected by ATS';
            simMessage.className = 'text-red-500 text-sm mt-2 font-bold';
        } else if (score < 80) {
            simBar.className = 'h-full bg-yellow-500 transition-all duration-700';
            simScore.className = 'text-5xl font-bold text-yellow-500 mb-2 transition-all';
            simMessage.textContent = 'Needs Improvement';
            simMessage.className = 'text-yellow-600 text-sm mt-2 font-bold';
        } else {
            simBar.className = 'h-full bg-green-500 transition-all duration-700';
            simScore.className = 'text-5xl font-bold text-green-500 mb-2 transition-all';
            simMessage.textContent = 'Interview Ready!';
            simMessage.className = 'text-green-600 text-sm mt-2 font-bold';
        }
    }

    matchOptions.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const row = e.target.closest('.requirement-row');
            if (!row) return;
            // Remove active from siblings
            row.querySelectorAll('.match-option').forEach(opt => opt.classList.remove('active'));
            // Mark clicked as active
            e.target.classList.add('active');
            calculateMatch();
        });
    });

    // --- FEATURE 4: FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const button = item.querySelector('button');
        const content = item.querySelector('div');
        const icon = item.querySelector('i');

        button.addEventListener('click', () => {
            // Close others (optional)
            /* faqItems.forEach(otherItem => {
                if(otherItem !== item) {
                    otherItem.querySelector('div').classList.add('hidden');
                    otherItem.querySelector('i').style.transform = 'rotate(0deg)';
                }
            });
            */

            content.classList.toggle('hidden');
            content.classList.toggle('faq-content-visible');
            
            if (content.classList.contains('hidden')) {
                icon.style.transform = 'rotate(0deg)';
            } else {
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });

    // --- FEATURE 5: WhatsApp lead form generation ---
    const waForm = document.getElementById('waLeadForm');
    const waBtn = document.getElementById('generateWaBtn');
    const waError = document.getElementById('waFormError');
    const waClearBtn = document.getElementById('clearWaDataBtn');

    // TODO: Replace with your real WhatsApp number in international format without plus sign (e.g. 6019XXXXXXX)
    const waNumber = '60182523255';

    if (waForm && waBtn) {
        // Restore saved data if present
        try {
            const saved = localStorage.getItem('careerAlignLead');
            if (saved) {
                const data = JSON.parse(saved);
                ['leadName','leadEmail','leadWhatsapp','leadSituation','leadTargetRole','leadPackage','leadPaymentRef','leadJobInfo','leadNotes'].forEach(key => {
                    const el = document.getElementById(key);
                    if (el && data[key]) {
                        el.value = data[key];
                    }
                });
            }
        } catch (err) {
            console.warn('Unable to restore lead data', err);
        }

        // Clear saved details
        if (waClearBtn) {
            waClearBtn.addEventListener('click', () => {
                try {
                    localStorage.removeItem('careerAlignLead');
                } catch (err) {
                    console.warn('Unable to clear lead data', err);
                }
                waForm.reset();
                if (waError) waError.classList.add('hidden');
            });
        }

        waBtn.addEventListener('click', () => {
            const getVal = id => {
                const el = document.getElementById(id);
                return el ? el.value.trim() : '';
            };

            const leadName = getVal('leadName');
            const leadWhatsapp = getVal('leadWhatsapp');
            const leadTargetRole = getVal('leadTargetRole');
            const leadPackage = getVal('leadPackage');
            const leadPaymentRef = getVal('leadPaymentRef');
            const leadJobInfo = getVal('leadJobInfo');

            // Basic validation
            if (!leadName || !leadWhatsapp || !leadTargetRole || !leadPackage || !leadPaymentRef || !leadJobInfo) {
                if (waError) waError.classList.remove('hidden');
                return;
            } else if (waError) {
                waError.classList.add('hidden');
            }

            const leadEmail = getVal('leadEmail');
            const leadSituation = getVal('leadSituation');
            const leadNotes = getVal('leadNotes');

            // Save to localStorage
            const payload = {
                leadName,
                leadEmail,
                leadWhatsapp,
                leadSituation,
                leadTargetRole,
                leadPackage,
                leadPaymentRef,
                leadJobInfo,
                leadNotes
            };

            try {
                localStorage.setItem('careerAlignLead', JSON.stringify(payload));
            } catch (err) {
                console.warn('Unable to save lead data', err);
            }

            // Build the WhatsApp message
            const lines = [
                'CareerAlign – New JobMatch request',
                '',
                `Name: ${leadName}`,
                leadEmail ? `Email: ${leadEmail}` : '',
                `WhatsApp: ${leadWhatsapp}`,
                leadSituation ? `Current situation: ${leadSituation}` : '',
                '',
                `Target role / industry: ${leadTargetRole}`,
                `Package paid: ${leadPackage}`,
                `Payment reference / proof: ${leadPaymentRef}`,
                '',
                'Job posting / key responsibilities:',
                leadJobInfo,
                '',
                leadNotes ? 'Additional notes:' : '',
                leadNotes || ''
            ].filter(Boolean);

            const message = encodeURIComponent(lines.join('\n'));
            const url = `https://wa.me/${waNumber}?text=${message}`;
            window.open(url, '_blank');
        });
    }


    // --- Smooth scroll for in-page navigation links ---
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            if (!href || href === '#' || href.length === 1) return;
            const target = document.querySelector(href);
            if (!target) return;
            // Let browser handle if user middle-clicks etc.
            if (event.button !== 0 || event.metaKey || event.ctrlKey) return;
            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').catch(function (err) {
            console.log('Service worker registration failed from main.js:', err);
        });
    }

});
