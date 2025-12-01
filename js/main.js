document.addEventListener('DOMContentLoaded', () => {
    
    // --- FEATURE 1: Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('nav-scrolled');
            navbar.classList.remove('py-4');
        } else {
            navbar.classList.remove('nav-scrolled');
            navbar.classList.add('py-4');
        }
    });

    // --- FEATURE 2: Mobile Menu Toggle ---
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('flex');
    });

    // --- FEATURE 3: Resume Simulator Logic ---
    const checkboxes = document.querySelectorAll('.sim-toggle');
    const scoreDisplay = document.getElementById('sim-score');
    const progressBar = document.getElementById('sim-bar');
    const messageDisplay = document.getElementById('sim-message');

    // Base score matches the "5%" text in HTML
    let currentScore = 5; 

    function updateSimulator() {
        let score = 5; // Reset to base

        checkboxes.forEach(box => {
            if (box.checked) {
                score += parseInt(box.getAttribute('data-value'));
            }
        });

        // Animation for numbers
        animateValue(currentScore, score, 500);
        currentScore = score;

        // Visual Updates
        progressBar.style.width = `${score}%`;
        
        // Color Logic
        if (score < 40) {
            progressBar.className = 'h-full bg-red-500 transition-all duration-700';
            scoreDisplay.className = 'text-5xl font-bold text-red-500 mb-2 transition-all';
            messageDisplay.innerText = "Resume Rejected by ATS";
            messageDisplay.className = "text-red-500 text-sm mt-2 font-bold";
        } else if (score < 80) {
            progressBar.className = 'h-full bg-yellow-500 transition-all duration-700';
            scoreDisplay.className = 'text-5xl font-bold text-yellow-500 mb-2 transition-all';
            messageDisplay.innerText = "Needs Improvement";
            messageDisplay.className = "text-yellow-600 text-sm mt-2 font-bold";
        } else {
            progressBar.className = 'h-full bg-green-500 transition-all duration-700';
            scoreDisplay.className = 'text-5xl font-bold text-green-500 mb-2 transition-all';
            messageDisplay.innerText = "Interview Ready!";
            messageDisplay.className = "text-green-600 text-sm mt-2 font-bold";
        }
    }

    // Number Animation Helper
    function animateValue(start, end, duration) {
        if (start === end) return;
        const range = end - start;
        let current = start;
        const increment = end > start ? 1 : -1;
        const stepTime = Math.abs(Math.floor(duration / range));
        const obj = document.getElementById('sim-score');
        
        const timer = setInterval(function() {
            current += increment;
            obj.innerHTML = current + "%";
            if (current == end) {
                clearInterval(timer);
            }
        }, stepTime > 20 ? stepTime : 20); // Cap speed
    }

    checkboxes.forEach(box => {
        box.addEventListener('change', updateSimulator);
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
});
