/* ============================================================================
   É·STORE — LUXURY E-COMMERCE JAVASCRIPT
   Vanilla JS interactions, animations, and cart logic.
   ============================================================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. HEADER SCROLL STATE ---
    const header = document.querySelector('.header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    if (header) {
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Init state on load
    }

    // --- 2. MOBILE NAVIGATION ---
    const hamburger = document.querySelector('.hamburger');
    const navMobile = document.querySelector('.nav-mobile');
    const navOverlay = document.querySelector('.nav-overlay');
    const body = document.body;

    const toggleNav = () => {
        if (hamburger) hamburger.classList.toggle('active');
        if (navMobile) navMobile.classList.toggle('open');
        if (navOverlay) navOverlay.classList.toggle('active');
        body.classList.toggle('no-scroll');
    };

    if (hamburger && navOverlay) {
        hamburger.addEventListener('click', toggleNav);
        navOverlay.addEventListener('click', toggleNav);
    }

    // Mobile Nav Submenus
    const submenus = document.querySelectorAll('.has-submenu');
    submenus.forEach(menu => {
        menu.addEventListener('click', (e) => {
            e.preventDefault();
            const submenu = menu.nextElementSibling;
            const icon = menu.querySelector('i');
            
            if (submenu) {
                submenu.classList.toggle('open');
                
                if (icon) {
                    if (submenu.classList.contains('open')) {
                        icon.classList.remove('ri-add-line');
                        icon.classList.add('ri-subtract-line');
                    } else {
                        icon.classList.remove('ri-subtract-line');
                        icon.classList.add('ri-add-line');
                    }
                }
            }
        });
    });

    // --- 3. SEARCH OVERLAY ---
    const searchTriggers = document.querySelectorAll('.t-search');
    const searchClose = document.querySelector('.search-overlay__close');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchInput = document.querySelector('.search-overlay__form input');

    const openSearch = (e) => {
        e.preventDefault();
        if (searchOverlay) {
            searchOverlay.classList.add('active');
            body.classList.add('no-scroll');
            if (searchInput) {
                setTimeout(() => searchInput.focus(), 300);
            }
        }
    };

    const closeSearch = (e) => {
        e.preventDefault();
        if (searchOverlay) {
            searchOverlay.classList.remove('active');
            body.classList.remove('no-scroll');
        }
    };

    searchTriggers.forEach(trigger => trigger.addEventListener('click', openSearch));
    if (searchClose) searchClose.addEventListener('click', closeSearch);

    // Close search on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay && searchOverlay.classList.contains('active')) {
            closeSearch(e);
        }
    });

    // --- 4. SCROLL REVEAL ANIMATIONS (IntersectionObserver) ---
    const revealElements = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale');
    
    if ('IntersectionObserver' in window) {
        const revealOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };

        const revealOnScroll = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Reveal only once
            });
        }, revealOptions);

        revealElements.forEach(el => revealOnScroll.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('visible'));
    }

    // --- 5. SWIPER SLIDERS ---
    
    // Hero Slider
    if (document.querySelector('.myslider')) {
        new Swiper('.myslider', {
            loop: true,
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            speed: 1000,
            autoplay: {
                delay: 6000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });
    }

    // Product Gallery Slider (for single product page)
    if (document.querySelector('.product-gallery__main-slider')) {
        const thumbs = new Swiper('.product-gallery__thumbs-slider', {
            spaceBetween: 10,
            slidesPerView: 4,
            freeMode: true,
            watchSlidesProgress: true,
        });
        
        new Swiper('.product-gallery__main-slider', {
            spaceBetween: 10,
            effect: 'fade',
            fadeEffect: { crossFade: true },
            thumbs: {
                swiper: thumbs
            }
        });
    }

    // --- 6. CART LOGIC (Vanilla JS) ---
    const cartCounts = document.querySelectorAll('#cart-count, #mobile-cart-count');
    const cartTotalEl = document.getElementById('cart-total');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    
    // Simple state
    let cartItemCount = 0;
    let cartTotalValue = 0;

    // Load from local storage if exists
    if (localStorage.getItem('luxury_cart_count')) {
        cartItemCount = parseInt(localStorage.getItem('luxury_cart_count'));
        cartTotalValue = parseFloat(localStorage.getItem('luxury_cart_total'));
        updateCartUI();
    }

    function updateCartUI() {
        cartCounts.forEach(el => {
            if(el) el.textContent = cartItemCount;
        });
        if (cartTotalEl) {
            cartTotalEl.textContent = `$${cartTotalValue.toFixed(2)}`;
        }
        
        // Save to LS
        localStorage.setItem('luxury_cart_count', cartItemCount);
        localStorage.setItem('luxury_cart_total', cartTotalValue);
    }

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const price = parseFloat(btn.getAttribute('data-price') || 0);
            
            // Increment
            cartItemCount++;
            cartTotalValue += price;
            
            // Update UI
            updateCartUI();

            // Button feedback animation
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="ri-check-line"></i> Added to Bag';
            btn.style.background = 'var(--success)';
            btn.style.color = '#fff';
            btn.style.borderColor = 'var(--success)';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.style.color = '';
                btn.style.borderColor = '';
            }, 2000);
            
            // Pop badge animation
            cartCounts.forEach(el => {
                if(el) {
                    el.style.transform = 'scale(1.5)';
                    setTimeout(() => el.style.transform = 'scale(1)', 300);
                }
            });
        });
    });

    // --- 7. PARALLAX EFFECT ON HERO ---
    const heroImage = document.querySelector('.hero__slide-image img');
    if (heroImage && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY;
            if (scrollPos < window.innerHeight) {
                // Subtle move down
                heroImage.style.transform = `translate3d(0, ${scrollPos * 0.15}px, 0) scale(1.05)`;
            }
        }, { passive: true });
    }

    // --- 8. PRODUCT ACCORDION (Single Page) ---
    const accordions = document.querySelectorAll('.accordion-trigger');
    accordions.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.parentElement;
            const content = item.querySelector('.accordion-content');
            
            item.classList.toggle('active');
            
            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = null;
            }
        });
    });

    // --- 9. QUANTITY CONTROLS (Cart/Single Page) ---
    const qtyControls = document.querySelectorAll('.qty-control');
    qtyControls.forEach(control => {
        const minusBtn = control.querySelector('.minus');
        const plusBtn = control.querySelector('.plus');
        const input = control.querySelector('input');
        
        if (minusBtn && plusBtn && input) {
            minusBtn.addEventListener('click', (e) => {
                e.preventDefault();
                let val = parseInt(input.value);
                if (val > 1) {
                    input.value = val - 1;
                    // Trigger custom event if needed for cart total recalculation
                    input.dispatchEvent(new Event('change'));
                }
            });
            
            plusBtn.addEventListener('click', (e) => {
                e.preventDefault();
                let val = parseInt(input.value);
                if (val < 99) {
                    input.value = val + 1;
                    input.dispatchEvent(new Event('change'));
                }
            });
        }
    });

});
