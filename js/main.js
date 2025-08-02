// Vida Tea - Main Application Module

class VidaTeaApp {
    constructor() {
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.initializeSmoothScrolling();
        this.initializeAnimations();
        console.log('Vida Tea app initialized');
    }
    
    bindEvents() {
        // Navigation smooth scrolling
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    this.smoothScrollTo(targetSection);
                }
            });
        });
        
        // Hero section buttons
        const exploreBtn = document.getElementById('exploreBtn');
        const customArrangementsBtn = document.getElementById('customArrangementsBtn');
        
        if (exploreBtn) {
            exploreBtn.addEventListener('click', () => {
                this.smoothScrollTo(document.getElementById('teas'));
            });
        }
        
        if (customArrangementsBtn) {
            customArrangementsBtn.addEventListener('click', () => {
                this.smoothScrollTo(document.getElementById('custom-arrangements'));
            });
        }
        
        // Mobile navigation toggle
        this.initializeMobileNav();
        
        // Scroll effects
        this.initializeScrollEffects();
        
        // Form handling
        this.initializeForms();
    }
    
    smoothScrollTo(element) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const elementPosition = element.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
    
    initializeSmoothScrolling() {
        // Add smooth scrolling to all internal links
        const internalLinks = document.querySelectorAll('a[href^="#"]');
        internalLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    this.smoothScrollTo(target);
                }
            });
        });
    }
    
    initializeMobileNav() {
        // Create mobile menu button if it doesn't exist
        if (!document.querySelector('.mobile-nav-toggle')) {
            const navContainer = document.querySelector('.nav-container');
            const mobileToggle = document.createElement('button');
            mobileToggle.className = 'mobile-nav-toggle';
            mobileToggle.innerHTML = '☰';
            mobileToggle.style.cssText = `
                display: none;
                background: none;
                border: none;
                font-size: 1.5rem;
                color: var(--primary-green);
                cursor: pointer;
                padding: var(--spacing-xs);
            `;
            
            navContainer.appendChild(mobileToggle);
            
            mobileToggle.addEventListener('click', () => {
                const navMenu = document.querySelector('.nav-menu');
                navMenu.classList.toggle('active');
                mobileToggle.innerHTML = navMenu.classList.contains('active') ? '✕' : '☰';
            });
        }
        
        // Show mobile menu button on small screens
        const mobileToggle = document.querySelector('.mobile-nav-toggle');
        if (mobileToggle) {
            const mediaQuery = window.matchMedia('(max-width: 767px)');
            
            const handleMediaChange = (e) => {
                mobileToggle.style.display = e.matches ? 'block' : 'none';
            };
            
            mediaQuery.addListener(handleMediaChange);
            handleMediaChange(mediaQuery);
        }
    }
    
    initializeScrollEffects() {
        // Header background on scroll
        const header = document.querySelector('.header');
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add/remove background based on scroll position
            if (scrollTop > 50) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
            }
            
            // Hide/show header on scroll (optional)
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
        
        // Intersection Observer for animations
        this.initializeIntersectionObserver();
    }
    
    initializeIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animateElements = document.querySelectorAll('.tea-card, .wellness-card, .partner-card, .founder');
        animateElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    initializeForms() {
        // Handle any additional form functionality
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                // Prevent default for demo purposes
                // In production, this would handle form submission
                console.log('Form submitted:', form.id);
            });
        });
        
        // Handle custom arrangements form
        const customBuilderForm = document.getElementById('customBuilderForm');
        if (customBuilderForm) {
            customBuilderForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCustomArrangementSubmission(customBuilderForm);
            });
        }
        
        // Handle custom order button
        const customOrderBtn = document.getElementById('customOrderBtn');
        if (customOrderBtn) {
            customOrderBtn.addEventListener('click', () => {
                this.smoothScrollTo(document.querySelector('.custom-builder'));
            });
        }
    }
    
    handleCustomArrangementSubmission(form) {
        const formData = new FormData(form);
        const eventType = form.querySelector('#eventType').value;
        const selectedTeas = Array.from(form.querySelectorAll('input[name="teas"]:checked')).map(cb => cb.value);
        const container = form.querySelector('input[name="container"]:checked')?.value;
        const quantity = form.querySelector('#quantity').value;
        const specialInstructions = form.querySelector('#specialInstructions').value;
        const contactName = form.querySelector('#contactName').value;
        const contactEmail = form.querySelector('#contactEmail').value;
        const contactPhone = form.querySelector('#contactPhone').value;
        
        // Validate required fields
        if (!eventType || selectedTeas.length === 0 || !container || !contactName || !contactEmail) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }
        
        // Create order summary
        const orderSummary = {
            eventType,
            selectedTeas,
            container,
            quantity: parseInt(quantity),
            specialInstructions,
            contact: {
                name: contactName,
                email: contactEmail,
                phone: contactPhone
            },
            timestamp: new Date().toISOString()
        };
        
        // In production, this would save to Firebase
        console.log('Custom arrangement order:', orderSummary);
        
        // Show success message
        this.showToast('Thank you! Your custom arrangement request has been submitted. We\'ll contact you within 24 hours.', 'success');
        
        // Reset form
        form.reset();
    }
    
    initializeAnimations() {
        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            .tea-card, .wellness-card, .partner-card, .founder {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .tea-card.animate-in, .wellness-card.animate-in, .partner-card.animate-in, .founder.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            .header {
                transition: all 0.3s ease;
            }
            
            .mobile-nav-toggle {
                transition: all 0.3s ease;
            }
            
            @media (max-width: 767px) {
                .nav-menu {
                    transition: transform 0.3s ease;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Utility functions
    showToast(message, type = 'info') {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => toast.remove());
        
        // Create new toast
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 5000);
        
        // Click to dismiss
        toast.addEventListener('click', () => {
            toast.remove();
        });
    }
    
    // Performance optimization
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Initialize lazy loading for images (if needed)
    initializeLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }
    
    // Handle window resize
    handleResize() {
        const debouncedResize = this.debounce(() => {
            // Handle responsive behavior
            const mobileToggle = document.querySelector('.mobile-nav-toggle');
            const navMenu = document.querySelector('.nav-menu');
            
            if (window.innerWidth > 767) {
                navMenu.classList.remove('active');
                if (mobileToggle) {
                    mobileToggle.innerHTML = '☰';
                }
            }
        }, 250);
        
        window.addEventListener('resize', debouncedResize);
    }
    
    // Initialize all app functionality
    start() {
        this.handleResize();
        this.initializeLazyLoading();
        
        // Add loading state management
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });
        
        console.log('Vida Tea app started successfully');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.vidaTeaApp = new VidaTeaApp();
    window.vidaTeaApp.start();
});

// Service worker registration removed - not needed for basic functionality
// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('/sw.js')
//             .then(registration => {
//                 console.log('SW registered: ', registration);
//             })
//             .catch(registrationError => {
//                 console.log('SW registration failed: ', registrationError);
//             });
//     });
// }

console.log('Main module loaded'); 