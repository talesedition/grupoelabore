/* ========================================
   GRUPO ELABORE — SCRIPT.JS
   Interações Premium & Performance
   ======================================== */

(function() {
    'use strict';

    // ========================================
    // DOM Ready Handler
    // ========================================

    document.addEventListener('DOMContentLoaded', function() {
        initNavbar();
        initScrollReveal();
        initCounterAnimation();
        initMobileMenu();
        initSmoothScroll();
        initHeroParallax();
        initLeadFormPhoneMask();
    });

    // ========================================
    // NAVBAR SCROLL EFFECT
    // ========================================

    function initNavbar() {
        const navbar = document.getElementById('navbar');
        let lastScroll = 0;
        let ticking = false;

        function updateNavbar() {
            const currentScroll = window.pageYOffset;

            // Add/remove scrolled class
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Hide/show on scroll direction (optional, subtle)
            if (currentScroll > lastScroll && currentScroll > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }

            lastScroll = currentScroll;
            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        }, { passive: true });

        // Initial check
        updateNavbar();
    }

    // ========================================
    // SCROLL REVEAL ANIMATION
    // ========================================

    function initScrollReveal() {
        const revealElements = document.querySelectorAll('[data-reveal]');

        if (!revealElements.length) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -80px 0px',
            threshold: 0.1
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add staggered delay based on element index within parent
                    const parent = entry.target.parentElement;
                    if (parent) {
                        const siblings = Array.from(parent.querySelectorAll('[data-reveal]'));
                        const index = siblings.indexOf(entry.target);
                        entry.target.style.transitionDelay = `${index * 0.08}s`;
                    }

                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // ========================================
    // COUNTER ANIMATION
    // ========================================

    function initCounterAnimation() {
        const counters = document.querySelectorAll('[data-count]');

        if (!counters.length) return;

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = parseInt(target.getAttribute('data-count'));
                    animateCounter(target, finalValue);
                    counterObserver.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    function animateCounter(element, target) {
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        const startValue = 0;

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing: easeOutQuart
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(startValue + (target - startValue) * eased);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // ========================================
    // MOBILE MENU
    // ========================================

    function initMobileMenu() {
        const toggle = document.getElementById('navToggle');
        const menu = document.getElementById('navMenu');
        const links = menu.querySelectorAll('.nav-link');

        if (!toggle || !menu) return;

        toggle.addEventListener('click', function() {
            this.classList.toggle('active');
            menu.classList.toggle('active');
            document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        links.forEach(link => {
            link.addEventListener('click', function() {
                toggle.classList.remove('active');
                menu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && menu.classList.contains('active')) {
                toggle.classList.remove('active');
                menu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ========================================
    // SMOOTH SCROLL
    // ========================================

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();

                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }

    // ========================================
    // HERO PARALLAX & MOUSE EFFECT
    // ========================================

    function initHeroParallax() {
        const hero = document.querySelector('.hero');
        const heroGrid = document.querySelector('.hero-grid');
        const heroGradient = document.querySelector('.hero-gradient');

        if (!hero) return;

        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;
        let isHeroVisible = true;
        let rafId = null;

        // Check visibility
        const heroObserver = new IntersectionObserver((entries) => {
            isHeroVisible = entries[0].isIntersecting;
        }, { threshold: 0 });

        heroObserver.observe(hero);

        // Mouse tracking (desktop only)
        if (window.matchMedia('(pointer: fine)').matches) {
            hero.addEventListener('mousemove', function(e) {
                const rect = hero.getBoundingClientRect();
                mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
                mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            }, { passive: true });

            function animateParallax() {
                if (!isHeroVisible) {
                    rafId = requestAnimationFrame(animateParallax);
                    return;
                }

                // Smooth interpolation
                currentX += (mouseX - currentX) * 0.05;
                currentY += (mouseY - currentY) * 0.05;

                if (heroGrid) {
                    heroGrid.style.transform = `translate(${currentX * 10}px, ${currentY * 10}px)`;
                }

                if (heroGradient) {
                    heroGradient.style.transform = `translate(${currentX * 20}px, ${currentY * 20}px)`;
                }

                rafId = requestAnimationFrame(animateParallax);
            }

            rafId = requestAnimationFrame(animateParallax);
        }

        // Scroll parallax for hero content
        let scrollTicking = false;

        window.addEventListener('scroll', function() {
            if (!scrollTicking && isHeroVisible) {
                requestAnimationFrame(() => {
                    const scrollY = window.pageYOffset;
                    const heroContent = document.querySelector('.hero-content');

                    if (heroContent && scrollY < window.innerHeight) {
                        const parallaxAmount = scrollY * 0.3;
                        const opacityAmount = 1 - (scrollY / (window.innerHeight * 0.6));

                        heroContent.style.transform = `translateY(${parallaxAmount}px)`;
                        heroContent.style.opacity = Math.max(0.3, opacityAmount);
                    }

                    scrollTicking = false;
                });
                scrollTicking = true;
            }
        }, { passive: true });
    }

    // ========================================
    // LEAD FORM PHONE MASK
    // ========================================

    function initLeadFormPhoneMask() {
        const leadPhone = document.getElementById('leadTelefone');
        if (leadPhone) {
            leadPhone.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 11) value = value.slice(0, 11);
                if (value.length >= 2) {
                    value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
                }
                if (value.length >= 10) {
                    const parts = value.split(' ');
                    if (parts[1] && parts[1].length > 5) {
                        value = `${parts[0]} ${parts[1].slice(0, 5)}-${parts[1].slice(5)}`;
                    }
                }
                e.target.value = value;
            });
        }
    }

    // ========================================
    // MODAL FUNCTIONS (Global)
    // ========================================

    window.openModal = function() {
        const overlay = document.getElementById('modalOverlay');
        if (overlay) {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Focus first input
            setTimeout(() => {
                const firstInput = overlay.querySelector('input');
                if (firstInput) firstInput.focus();
            }, 300);
        }
    };

    window.closeModal = function() {
        const overlay = document.getElementById('modalOverlay');
        if (overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // Close modal on overlay click
    document.addEventListener('click', function(e) {
        const overlay = document.getElementById('modalOverlay');
        if (overlay && e.target === overlay) {
            closeModal();
        }
    });

    // Close on escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // ========================================
    // FORM HANDLER (Modal)
    // ========================================

    window.handleFormSubmit = function(e) {
        e.preventDefault();

        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span>Enviando...</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20">
                    <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
                </circle>
            </svg>
        `;

        // Simulate submission (replace with actual API call)
        setTimeout(() => {
            submitBtn.innerHTML = `
                <span>Enviado com sucesso!</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
            `;
            submitBtn.style.background = '#22c55e';

            // Reset after delay
            setTimeout(() => {
                form.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                closeModal();
            }, 2000);
        }, 1500);
    };

    // ========================================
    // LEAD FORM HANDLER
    // ========================================

    window.handleLeadFormSubmit = function(e) {
        e.preventDefault();

        const form = e.target;
        const btn = form.querySelector('.btn-lead');
        const originalText = btn.innerHTML;

        // Loading state
        btn.disabled = true;
        btn.innerHTML = `<span>Enviando...</span>`;

        // Simulate submission (replace with actual API call)
        setTimeout(() => {
            btn.innerHTML = `<span>Enviado com sucesso!</span>`;
            btn.style.background = '#22c55e';

            // Reset after delay
            setTimeout(() => {
                form.reset();
                btn.disabled = false;
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 2000);
        }, 1500);
    };

    // ========================================
    // WHATSAPP INPUT MASK (Modal)
    // ========================================

    document.addEventListener('DOMContentLoaded', function() {
        const whatsappInput = document.getElementById('whatsapp');
        if (whatsappInput) {
            whatsappInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');

                if (value.length > 11) value = value.slice(0, 11);

                if (value.length >= 2) {
                    value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
                }
                if (value.length >= 10) {
                    const parts = value.split(' ');
                    if (parts[1] && parts[1].length > 5) {
                        value = `${parts[0]} ${parts[1].slice(0, 5)}-${parts[1].slice(5)}`;
                    }
                }

                e.target.value = value;
            });
        }
    });

    // ========================================
    // PREFERS REDUCED MOTION
    // ========================================

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Disable parallax and complex animations
        document.querySelectorAll('[data-reveal]').forEach(el => {
            el.classList.add('revealed');
        });
    }

})();