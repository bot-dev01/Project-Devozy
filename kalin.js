
        // Global state management
        const state = {
            currentSection: 'home',
            isMenuOpen: false,
            formData: {},
            stats: {
                campaigns: 0,
                satisfaction: 0,
                roi: 0,
                support: 0
            },
            targetStats: {
                campaigns: 500,
                satisfaction: 95,
                roi: 3,
                support: 24
            }
        };

        // Utility functions
        const utils = {
            debounce: (func, wait) => {
                let timeout;
                return function executedFunction(...args) {
                    const later = () => {
                        clearTimeout(timeout);
                        func(...args);
                    };
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                };
            },
            
            throttle: (func, limit) => {
                let inThrottle;
                return function() {
                    const args = arguments;
                    const context = this;
                    if (!inThrottle) {
                        func.apply(context, args);
                        inThrottle = true;
                        setTimeout(() => inThrottle = false, limit);
                    }
                }
            },

            easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
            
            animateNumber: (element, start, end, duration, suffix = '') => {
                const startTime = performance.now();
                const animate = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easedProgress = utils.easeOutCubic(progress);
                    const current = Math.floor(start + (end - start) * easedProgress);
                    element.textContent = current + suffix;
                    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                };
                requestAnimationFrame(animate);
            }
        };

        // Mobile menu functionality
        const mobileMenu = {
            init() {
                this.createMobileMenuButton();
                this.bindEvents();
            },

            createMobileMenuButton() {
                const nav = document.querySelector('nav .container');
                const menuButton = document.createElement('button');
                menuButton.className = 'mobile-menu-btn';
                menuButton.innerHTML = `
                    <span class="hamburger-line"></span>
                    <span class="hamburger-line"></span>
                    <span class="hamburger-line"></span>
                `;
                
                // Add mobile menu styles
                const style = document.createElement('style');
                style.textContent = `
                    .mobile-menu-btn {
                        display: none;
                        flex-direction: column;
                        background: none;
                        border: none;
                        cursor: pointer;
                        padding: 0.5rem;
                        gap: 0.25rem;
                    }
                    
                    .hamburger-line {
                        width: 25px;
                        height: 3px;
                        background: #d4af37;
                        transition: all 0.3s ease;
                        border-radius: 2px;
                    }
                    
                    .mobile-menu-btn.active .hamburger-line:nth-child(1) {
                        transform: rotate(45deg) translate(7px, 7px);
                    }
                    
                    .mobile-menu-btn.active .hamburger-line:nth-child(2) {
                        opacity: 0;
                    }
                    
                    .mobile-menu-btn.active .hamburger-line:nth-child(3) {
                        transform: rotate(-45deg) translate(7px, -7px);
                    }
                    
                    @media (max-width: 768px) {
                        .mobile-menu-btn { display: flex; }
                        .nav-links { 
                            display: none;
                            position: absolute;
                            top: 100%;
                            left: 0;
                            width: 100%;
                            background: rgba(0, 0, 0, 0.95);
                            flex-direction: column;
                            padding: 2rem;
                            gap: 1rem;
                        }
                        .nav-links.active { display: flex; }
                    }
                `;
                document.head.appendChild(style);
                nav.appendChild(menuButton);
            },

            bindEvents() {
                const menuBtn = document.querySelector('.mobile-menu-btn');
                const navLinks = document.querySelector('.nav-links');
                
                menuBtn?.addEventListener('click', () => {
                    state.isMenuOpen = !state.isMenuOpen;
                    menuBtn.classList.toggle('active', state.isMenuOpen);
                    navLinks.classList.toggle('active', state.isMenuOpen);
                });

                // Close menu when clicking nav links
                navLinks.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', () => {
                        state.isMenuOpen = false;
                        menuBtn.classList.remove('active');
                        navLinks.classList.remove('active');
                    });
                });
            }
        };

        // Advanced smooth scrolling with section tracking
        const navigation = {
            init() {
                this.bindSmoothScroll();
                this.bindScrollSpy();
                this.bindNavbarEffects();
            },

            bindSmoothScroll() {
                document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                    anchor.addEventListener('click', (e) => {
                        e.preventDefault();
                        const targetId = anchor.getAttribute('href');
                        const target = document.querySelector(targetId);
                        
                        if (target) {
                            const headerOffset = 80;
                            const elementPosition = target.offsetTop;
                            const offsetPosition = elementPosition - headerOffset;
                            
                            window.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth'
                            });
                        }
                    });
                });
            },

            bindScrollSpy() {
                const sections = document.querySelectorAll('section[id]');
                const navLinks = document.querySelectorAll('.nav-links a');
                
                const updateActiveSection = utils.throttle(() => {
                    const scrollPos = window.scrollY + 100;
                    
                    sections.forEach(section => {
                        const sectionTop = section.offsetTop;
                        const sectionHeight = section.offsetHeight;
                        const sectionId = section.getAttribute('id');
                        
                        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                            if (state.currentSection !== sectionId) {
                                state.currentSection = sectionId;
                                
                                navLinks.forEach(link => {
                                    link.classList.remove('active');
                                    if (link.getAttribute('href') === `#${sectionId}`) {
                                        link.classList.add('active');
                                    }
                                });
                            }
                        }
                    });
                }, 100);
                
                window.addEventListener('scroll', updateActiveSection);
            },

            bindNavbarEffects() {
                const navbar = document.getElementById('navbar');
                let lastScrollTop = 0;
                
                const handleScroll = utils.throttle(() => {
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    
                    // Add/remove scrolled class
                    navbar.classList.toggle('scrolled', scrollTop > 100);
                    
                    // Hide/show navbar on scroll
                    if (scrollTop > lastScrollTop && scrollTop > 200) {
                        navbar.style.transform = 'translateY(-100%)';
                    } else {
                        navbar.style.transform = 'translateY(0)';
                    }
                    
                    lastScrollTop = scrollTop;
                }, 100);
                
                window.addEventListener('scroll', handleScroll);
            }
        };

        // Enhanced form handling with validation
        const formHandler = {
            init() {
                this.bindFormEvents();
                this.setupValidation();
            },

            bindFormEvents() {
                const form = document.getElementById('contactForm');
                const inputs = form.querySelectorAll('input, textarea');
                
                form.addEventListener('submit', this.handleSubmit.bind(this));
                
                inputs.forEach(input => {
                    input.addEventListener('input', this.handleInputChange.bind(this));
                    input.addEventListener('blur', this.validateField.bind(this));
                    input.addEventListener('focus', this.clearErrors.bind(this));
                });
            },

            handleInputChange(e) {
                const { name, value } = e.target;
                state.formData[name] = value;
                
                // Real-time character count for textarea
                if (e.target.tagName === 'TEXTAREA') {
                    this.updateCharCount(e.target);
                }
            },

            updateCharCount(textarea) {
                let counter = textarea.parentNode.querySelector('.char-counter');
                if (!counter) {
                    counter = document.createElement('div');
                    counter.className = 'char-counter';
                    counter.style.cssText = `
                        position: absolute;
                        bottom: -25px;
                        right: 15px;
                        font-size: 0.8rem;
                        color: rgba(255, 255, 255, 0.6);
                    `;
                    textarea.parentNode.style.position = 'relative';
                    textarea.parentNode.appendChild(counter);
                }
                
                const maxLength = 500;
                const currentLength = textarea.value.length;
                counter.textContent = `${currentLength}/${maxLength}`;
                counter.style.color = currentLength > maxLength ? '#ff6b6b' : 'rgba(255, 255, 255, 0.6)';
            },

            validateField(e) {
                const field = e.target;
                const value = field.value.trim();
                let isValid = true;
                let message = '';

                // Clear previous errors
                this.clearFieldError(field);

                switch (field.type) {
                    case 'email':
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (value && !emailRegex.test(value)) {
                            isValid = false;
                            message = 'Please enter a valid email address';
                        }
                        break;
                    case 'text':
                        if (field.required && !value) {
                            isValid = false;
                            message = 'This field is required';
                        }
                        break;
                    default:
                        if (field.required && !value) {
                            isValid = false;
                            message = 'This field is required';
                        }
                        break;
                }

                if (!isValid) {
                    this.showFieldError(field, message);
                }

                return isValid;
            },

            showFieldError(field, message) {
                field.style.borderColor = '#ff6b6b';
                
                let errorDiv = field.parentNode.querySelector('.error-message');
                if (!errorDiv) {
                    errorDiv = document.createElement('div');
                    errorDiv.className = 'error-message';
                    errorDiv.style.cssText = `
                        color: #ff6b6b;
                        font-size: 0.85rem;
                        margin-top: 0.5rem;
                        opacity: 0;
                        transform: translateY(-10px);
                        transition: all 0.3s ease;
                    `;
                    field.parentNode.appendChild(errorDiv);
                }
                
                errorDiv.textContent = message;
                setTimeout(() => {
                    errorDiv.style.opacity = '1';
                    errorDiv.style.transform = 'translateY(0)';
                }, 10);
            },

            clearFieldError(field) {
                field.style.borderColor = 'rgba(212, 175, 55, 0.2)';
                const errorDiv = field.parentNode.querySelector('.error-message');
                if (errorDiv) {
                    errorDiv.remove();
                }
            },

            clearErrors(e) {
                this.clearFieldError(e.target);
            },

            setupValidation() {
                // Add required attributes
                const requiredFields = ['firstName', 'lastName', 'email', 'message'];
                requiredFields.forEach(fieldName => {
                    const field = document.querySelector(`[name="${fieldName}"]`);
                    if (field) field.required = true;
                });
            },

            async handleSubmit(e) {
                e.preventDefault();
                const form = e.target;
                const submitBtn = form.querySelector('.submit-btn');
                const inputs = form.querySelectorAll('input, textarea');
                
                // Validate all fields
                let isFormValid = true;
                inputs.forEach(input => {
                    if (!this.validateField({ target: input })) {
                        isFormValid = false;
                    }
                });

                if (!isFormValid) {
                    this.showFormError('Please fix the errors above');
                    return;
                }

                // Disable form and show loading
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                inputs.forEach(input => input.disabled = true);

                try {
                    // Simulate API call
                    await this.simulateFormSubmission(state.formData);
                    
                    // Success state
                    submitBtn.textContent = 'Message Sent! 🎉';
                    submitBtn.style.background = 'linear-gradient(45deg, #10b981, #34d399)';
                    
                    // Show success message
                    this.showSuccessMessage();
                    
                    // Reset form after delay
                    setTimeout(() => {
                        form.reset();
                        state.formData = {};
                        submitBtn.textContent = originalText;
                        submitBtn.style.background = 'linear-gradient(45deg, #d4af37, #ffd700)';
                        submitBtn.disabled = false;
                        inputs.forEach(input => input.disabled = false);
                        this.clearSuccessMessage();
                    }, 3000);
                    
                } catch (error) {
                    // Error state
                    submitBtn.textContent = 'Failed to send. Try again.';
                    submitBtn.style.background = 'linear-gradient(45deg, #ef4444, #f87171)';
                    
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.style.background = 'linear-gradient(45deg, #d4af37, #ffd700)';
                        submitBtn.disabled = false;
                        inputs.forEach(input => input.disabled = false);
                    }, 3000);
                }
            },

            simulateFormSubmission(data) {
                return new Promise((resolve, reject) => {
                    // Simulate network delay
                    setTimeout(() => {
                        // Simulate 90% success rate
                        if (Math.random() > 0.1) {
                            console.log('Form submitted:', data);
                            resolve(data);
                        } else {
                            reject(new Error('Network error'));
                        }
                    }, 2000);
                });
            },

            showFormError(message) {
                const form = document.getElementById('contactForm');
                let errorDiv = form.querySelector('.form-error');
                
                if (!errorDiv) {
                    errorDiv = document.createElement('div');
                    errorDiv.className = 'form-error';
                    errorDiv.style.cssText = `
                        background: rgba(239, 68, 68, 0.1);
                        color: #ff6b6b;
                        padding: 1rem;
                        border-radius: 10px;
                        border: 1px solid rgba(239, 68, 68, 0.3);
                        margin-bottom: 1rem;
                        text-align: center;
                    `;
                    form.insertBefore(errorDiv, form.firstChild);
                }
                
                errorDiv.textContent = message;
            },

            showSuccessMessage() {
                const form = document.getElementById('contactForm');
                const successDiv = document.createElement('div');
                successDiv.className = 'success-message';
                successDiv.style.cssText = `
                    background: rgba(16, 185, 129, 0.1);
                    color: #10b981;
                    padding: 1rem;
                    border-radius: 10px;
                    border: 1px solid rgba(16, 185, 129, 0.3);
                    margin-top: 1rem;
                    text-align: center;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.3s ease;
                `;
                successDiv.textContent = 'Thank you! We\'ll get back to you within 24 hours.';
                
                form.appendChild(successDiv);
                
                setTimeout(() => {
                    successDiv.style.opacity = '1';
                    successDiv.style.transform = 'translateY(0)';
                }, 100);
            },

            clearSuccessMessage() {
                const successMsg = document.querySelector('.success-message');
                if (successMsg) {
                    successMsg.style.opacity = '0';
                    successMsg.style.transform = 'translateY(20px)';
                    setTimeout(() => successMsg.remove(), 300);
                }
            }
        };

        // Enhanced animations with intersection observer
        const animations = {
            init() {
                this.setupIntersectionObserver();
                this.animateStats();
                this.setupParallaxEffects();
                this.setupHoverEffects();
            },

            setupIntersectionObserver() {
                const observerOptions = {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                };

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('animate-in');
                            
                            // Special handling for stats
                            if (entry.target.classList.contains('stat')) {
                                this.animateStatNumber(entry.target);
                            }
                        }
                    });
                }, observerOptions);

                // Add animation styles
                const style = document.createElement('style');
                style.textContent = `
                    .animate-element {
                        opacity: 0;
                        transform: translateY(50px);
                        transition: all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    }
                    
                    .animate-element.animate-in {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    
                    .service-card.animate-element {
                        transition-delay: calc(var(--delay, 0) * 0.1s);
                    }
                `;
                document.head.appendChild(style);

                // Setup elements for animation
                document.querySelectorAll('.service-card, .stat, .about-content > div:first-child').forEach((el, index) => {
                    el.classList.add('animate-element');
                    if (el.classList.contains('service-card')) {
                        el.style.setProperty('--delay', index);
                    }
                    observer.observe(el);
                });
            },

            animateStats() {
                let statsAnimated = false;
                
                const statsObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && !statsAnimated) {
                            statsAnimated = true;
                            this.startStatsAnimation();
                        }
                    });
                }, { threshold: 0.5 });

                const statsSection = document.querySelector('.stats');
                if (statsSection) {
                    statsObserver.observe(statsSection);
                }
            },

            startStatsAnimation() {
                const stats = document.querySelectorAll('.stat-number');
                
                stats.forEach((stat, index) => {
                    const targetValue = state.targetStats[Object.keys(state.targetStats)[index]];
                    const suffix = index === 1 ? '%' : (index === 2 ? 'x' : (index === 3 ? '/7' : '+'));
                    
                    setTimeout(() => {
                        utils.animateNumber(stat, 0, targetValue, 2000, suffix);
                    }, index * 200);
                });
            },

            animateStatNumber(statElement) {
                const numberElement = statElement.querySelector('.stat-number');
                if (numberElement && !numberElement.dataset.animated) {
                    numberElement.dataset.animated = 'true';
                    
                    const text = numberElement.textContent;
                    const number = parseInt(text);
                    const suffix = text.replace(number.toString(), '');
                    
                    utils.animateNumber(numberElement, 0, number, 1500, suffix);
                }
            },

            setupParallaxEffects() {
                const parallaxElements = document.querySelectorAll('.particle');
                
                const handleParallax = utils.throttle(() => {
                    const scrolled = window.pageYOffset;
                    const rate = scrolled * -0.5;
                    
                    parallaxElements.forEach(element => {
                        element.style.transform = `translateY(${rate}px)`;
                    });
                }, 16);

                window.addEventListener('scroll', handleParallax);
            },

            setupHoverEffects() {
                // Enhanced service card interactions
                document.querySelectorAll('.service-card').forEach(card => {
                    card.addEventListener('mouseenter', (e) => {
                        // Add ripple effect
                        this.createRipple(e, card);
                        
                        // Enhance neighboring cards
                        const allCards = document.querySelectorAll('.service-card');
                        allCards.forEach(otherCard => {
                            if (otherCard !== card) {
                                otherCard.style.opacity = '0.7';
                                otherCard.style.transform = 'scale(0.95)';
                            }
                        });
                    });
                    
                    card.addEventListener('mouseleave', () => {
                        // Reset all cards
                        const allCards = document.querySelectorAll('.service-card');
                        allCards.forEach(otherCard => {
                            otherCard.style.opacity = '1';
                            otherCard.style.transform = 'scale(1)';
                        });
                    });
                });
            },

            createRipple(e, element) {
                const ripple = document.createElement('div');
                const rect = element.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple-animation 0.6s ease-out;
                    pointer-events: none;
                    z-index: 1;
                `;
                
                // Add ripple animation
                if (!document.querySelector('#ripple-styles')) {
                    const style = document.createElement('style');
                    style.id = 'ripple-styles';
                    style.textContent = `
                        @keyframes ripple-animation {
                            to {
                                transform: scale(2);
                                opacity: 0;
                            }
                        }
                    `;
                    document.head.appendChild(style);
                }
                
                element.style.position = 'relative';
                element.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            }
        };

        // Performance monitoring
        const performance = {
            init() {
                this.monitorFPS();
                this.optimizeAnimations();
            },

            monitorFPS() {
                let frames = 0;
                let lastTime = Date.now();
                
                const tick = () => {
                    frames++;
                    const now = Date.now();
                    
                    if (now - lastTime >= 1000) {
                        const fps = Math.round((frames * 1000) / (now - lastTime));
                        
                        // Reduce animations if FPS is low
                        if (fps < 30) {
                            document.body.classList.add('reduced-motion');
                        } else {
                            document.body.classList.remove('reduced-motion');
                        }
                        
                        frames = 0;
                        lastTime = now;
                    }
                    
                    requestAnimationFrame(tick);
                };
                
                requestAnimationFrame(tick);
                
                // Add reduced motion styles
                const style = document.createElement('style');
                style.textContent = `
                    .reduced-motion * {
                        animation-duration: 0.1s !important;
                        transition-duration: 0.1s !important;
                    }
                `;
                document.head.appendChild(style);
            },

            optimizeAnimations() {
                // Pause animations when tab is not visible
                document.addEventListener('visibilitychange', () => {
                    if (document.hidden) {
                        document.body.classList.add('paused-animations');
                    } else {
                        document.body.classList.remove('paused-animations');
                    }
                });
            }
        };

        // Initialize all functionality when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            mobileMenu.init();
            navigation.init();
            formHandler.init();
            animations.init();
            performance.init();
            
            // Add loading complete class for final animations
            setTimeout(() => {
                document.body.classList.add('loaded');
            }, 100);
            
            console.log('🚀 DEVOZY website fully initialized with premium functionality!');
        });

        // Handle page unload
        window.addEventListener('beforeunload', () => {
            // Save form data to sessionStorage as backup
            if (Object.keys(state.formData).length > 0) {
                try {
                    // Note: We can't actually use sessionStorage in Claude artifacts
                    console.log('Form data would be saved:', state.formData);
                } catch (e) {
                    console.log('Session storage not available');
                }
            }
        });