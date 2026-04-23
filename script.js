document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenu');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    const hideMenu = () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    closeMenu.addEventListener('click', hideMenu);
    mobileLinks.forEach(link => link.addEventListener('click', hideMenu));

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(el => observer.observe(el));

    // Stats Counter Animation (Simulated)
    const stats = document.querySelectorAll('.stat-item h3');
    const animateStats = () => {
        stats.forEach(stat => {
            const target = parseInt(stat.innerText);
            let count = 0;
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps

            const updateCount = () => {
                if (count < target) {
                    count += increment;
                    stat.innerText = Math.ceil(count) + (stat.innerText.includes('+') ? '+' : (stat.innerText.includes('%') ? '%' : ''));
                    requestAnimationFrame(updateCount);
                } else {
                    stat.innerText = target + (stat.innerText.includes('+') ? '+' : (stat.innerText.includes('%') ? '%' : ''));
                }
            };
            // Only start if visible
            const statObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    updateCount();
                    statObserver.disconnect();
                }
            });
            statObserver.observe(stat);
        });
    };
    // Note: The logic above is slightly simplified for text containing symbols like + or %
    // Better implementation below
    const startCounter = (el) => {
        const text = el.innerText;
        const target = parseFloat(text.replace(/[^0-9.]/g, ''));
        const suffix = text.replace(/[0-9.]/g, '');
        let count = 0;
        const duration = 1500;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            el.innerText = Math.floor(progress * target) + suffix;
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        let startTime = null;
        requestAnimationFrame(step);
    };

    const statItems = document.querySelectorAll('.stat-item h3');
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(entry.target);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statItems.forEach(item => statObserver.observe(item));

    // Navbar scroll effect
    const nav = document.querySelector('.glass-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.padding = '12px 0';
            nav.style.background = 'rgba(255, 255, 255, 0.95)';
        } else {
            nav.style.padding = '16px 0';
            nav.style.background = 'rgba(255, 255, 255, 0.8)';
        }
    });

    // Modal Logic
    const modals = {
        privacy: {
            el: document.getElementById('privacyModal'),
            open: document.getElementById('openPrivacy'),
            close: document.getElementById('closePrivacy')
        },
        terms: {
            el: document.getElementById('termsModal'),
            open: document.getElementById('openTerms'),
            close: document.getElementById('closeTerms')
        }
    };

    const toggleModal = (modalKey, show) => {
        const modal = modals[modalKey].el;
        if (show) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
            document.body.style.overflow = 'hidden';
        } else {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
        }
    };

    Object.keys(modals).forEach(key => {
        modals[key].open.addEventListener('click', () => toggleModal(key, true));
        modals[key].close.addEventListener('click', () => toggleModal(key, false));
        
        // Close on clicking overlay
        modals[key].el.addEventListener('click', (e) => {
            if (e.target === modals[key].el) toggleModal(key, false);
        });
    });
});
