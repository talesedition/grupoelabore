/* ========================================
   GRUPO ELABORE - SCRIPT.JS
   Interações Premium & Performance
   ========================================

*/

(function() {
    'use strict';

    // ========================================
    // CONFIGURAÇÃO GOOGLE SHEETS
    // ========================================
    const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxVPvUkVBKRreNagrk6Wur7O5_WuRY7PVaRih6hgjftuKZubxx11-d46Htsx3dZbjEANw/exec'; // Cole aqui a URL do seu Web App do Google Apps Script

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
        initClientsCarousel();
        initScrollSpy();
    });

    // ========================================
    // NAVBAR SCROLL EFFECT
    // ========================================

    function initNavbar() {
        const navbar = document.getElementById('navbar');
        let ticking = false;

        function updateNavbar() {
            const currentScroll = window.pageYOffset;

            // Add/remove scrolled class
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Menu sempre visível - removido hide/show
            navbar.style.transform = 'translateY(0)';

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
    // SCROLL SPY - Menu Active State
    // ========================================

    function initScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

        if (!sections.length || !navLinks.length) return;

        const observerOptions = {
            root: null,
            rootMargin: '-40% 0px -40% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
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
    // CLIENTS CAROUSEL
    // ========================================

    function initClientsCarousel() {
        const carousel = document.getElementById('clientsCarousel');
        const track = document.getElementById('carouselTrack');
        const prevBtn = carousel.querySelector('.carousel-prev');
        const nextBtn = carousel.querySelector('.carousel-next');
        const dotsContainer = document.getElementById('carouselDots');

        if (!carousel || !track) return;

        const cards = Array.from(track.children);
        if (cards.length === 0) return;

        let currentIndex = 0;
        let slidesPerView = getSlidesPerView();
        let totalSlides = Math.ceil(cards.length / slidesPerView);
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationID = 0;

        // Create dots
        function createDots() {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                dot.setAttribute('aria-label', `Slide ${i + 1}`);
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
        }

        function getSlidesPerView() {
            const width = window.innerWidth;
            if (width <= 480) return 1;
            if (width <= 768) return 2;
            if (width <= 1024) return 3;
            return 4;
        }

        function updateCarousel() {
            slidesPerView = getSlidesPerView();
            totalSlides = Math.ceil(cards.length / slidesPerView);

            // Recreate dots if total changed
            const currentDots = dotsContainer.children.length;
            if (currentDots !== totalSlides) {
                createDots();
            }

            // Clamp index
            if (currentIndex >= totalSlides) currentIndex = totalSlides - 1;
            if (currentIndex < 0) currentIndex = 0;

            const cardStyle = getComputedStyle(cards[0]);
            const cardWidth = cards[0].offsetWidth;
            const gap = parseFloat(cardStyle.marginRight) || 20; // fallback
            // Use exact gap from CSS (20px)
            const gapSize = 20;
            const slideWidth = cardWidth + gapSize;
            const offset = currentIndex * slideWidth * slidesPerView;

            track.style.transform = `translateX(-${offset}px)`;

            // Update dots
            Array.from(dotsContainer.children).forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });

            // Update buttons
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= totalSlides - 1;
        }

        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
        }

        function nextSlide() {
            if (currentIndex < totalSlides - 1) {
                currentIndex++;
                updateCarousel();
            }
        }

        function prevSlide() {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        }

        // Touch / Drag support
        function getPositionX(event) {
            return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
        }

        function touchStart(index) {
            return function(event) {
                isDragging = true;
                startPos = getPositionX(event);
                animationID = requestAnimationFrame(animation);
                track.style.transition = 'none';
                carousel.style.cursor = 'grabbing';
            };
        }

        function touchMove(event) {
            if (isDragging) {
                const currentPosition = getPositionX(event);
                const diff = currentPosition - startPos;
                currentTranslate = prevTranslate + diff;
                track.style.transform = `translateX(${currentTranslate}px)`;
            }
        }

        function touchEnd() {
            isDragging = false;
            cancelAnimationFrame(animationID);
            track.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            carousel.style.cursor = 'grab';

            const movedBy = currentTranslate - prevTranslate;
            const threshold = 50;

            if (movedBy < -threshold && currentIndex < totalSlides - 1) {
                currentIndex++;
            } else if (movedBy > threshold && currentIndex > 0) {
                currentIndex--;
            }

            updateCarousel();
        }

        function animation() {
            if (isDragging) requestAnimationFrame(animation);
        }

        // Event listeners
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);

        // Touch events
        track.addEventListener('touchstart', touchStart(currentIndex), { passive: true });
        track.addEventListener('touchend', touchEnd);
        track.addEventListener('touchmove', touchMove, { passive: true });

        // Mouse drag events
        track.addEventListener('mousedown', touchStart(currentIndex));
        track.addEventListener('mouseup', touchEnd);
        track.addEventListener('mouseleave', () => {
            if (isDragging) touchEnd();
        });
        track.addEventListener('mousemove', touchMove);

        // Prevent context menu on right click during drag
        track.addEventListener('contextmenu', e => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });

        // Resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                updateCarousel();
            }, 150);
        });

        // Init
        createDots();
        updateCarousel();

        // Accessibility: keyboard navigation
        carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        });
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
    // LEAD FORM HANDLER + GOOGLE SHEETS
    // ========================================

    window.handleLeadFormSubmit = function(e) {
        e.preventDefault();

        const form = e.target;
        const btn = form.querySelector('.btn-lead');
        const originalText = btn.innerHTML;

        // Loading state
        btn.disabled = true;
        btn.innerHTML = `<span>Enviando...</span>`;

        // Coletar dados
        const formData = {
            nome: form.nome.value,
            telefone: form.telefone.value,
            email: form.email.value,
            empresa: form.empresa.value,
            faturamento: form.faturamento.value,
            segmento: form.segmento.value
        };

        // Função para finalizar o envio (sucesso ou erro)
        function finishSubmit(success, message) {
            if (success) {
                btn.innerHTML = `<span>${message || 'Enviado com sucesso!'}</span>`;
                btn.style.background = '#22c55e';
            } else {
                btn.innerHTML = `<span>${message || 'Erro ao enviar'}</span>`;
                btn.style.background = '#dc2626';
            }

            setTimeout(() => {
                form.reset();
                btn.disabled = false;
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 2500);
        }

        // Se não tiver URL configurada, simula o envio
        if (!GOOGLE_SHEETS_URL) {
            console.warn('GOOGLE_SHEETS_URL não configurada. Configure a URL do Web App no topo do script.js');
            setTimeout(() => finishSubmit(true, 'Enviado com sucesso! (modo simulação)'), 1500);
            return;
        }

        // Enviar para Google Sheets - usa text/plain para evitar preflight CORS
        fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                finishSubmit(true, 'Enviado com sucesso!');
            } else {
                finishSubmit(false, 'Erro ao salvar. Tente novamente.');
            }
        })
        .catch(error => {
            console.error('Erro ao enviar para Google Sheets:', error);
            finishSubmit(false, 'Erro de conexão. Tente novamente.');
        });
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