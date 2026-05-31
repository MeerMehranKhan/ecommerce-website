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
    // --- 10. SLIDE-OUT CART DRAWER ---
    const cartTriggers = document.querySelectorAll('.iscart, .add-to-cart');
    const bodyEl = document.body;
    let cartDrawer = document.querySelector('.cart-drawer');
    let cartDrawerOverlay = document.querySelector('.cart-drawer-overlay');

    // Create Drawer DOM if it doesn't exist
    if (!cartDrawer) {
        cartDrawer = document.createElement('div');
        cartDrawer.className = 'cart-drawer';
        cartDrawer.innerHTML = `
            <div class="cart-drawer__header">
                <h3>Your Bag</h3>
                <button class="cart-drawer__close" aria-label="Close Bag"><i class="ri-close-line"></i></button>
            </div>
            <div class="cart-drawer__body" id="cart-drawer-items">
                <!-- Items inject here -->
            </div>
            <div class="cart-drawer__footer">
                <div class="flex-between mb-md">
                    <span>Subtotal</span>
                    <strong class="cart-drawer-total">$0.00</strong>
                </div>
                <a href="#" class="btn btn--primary" style="width:100%">Checkout</a>
            </div>
        `;
        bodyEl.appendChild(cartDrawer);

        cartDrawerOverlay = document.createElement('div');
        cartDrawerOverlay.className = 'cart-drawer-overlay';
        bodyEl.appendChild(cartDrawerOverlay);
    }

    const closeCartDrawer = () => {
        cartDrawer.classList.remove('open');
        cartDrawerOverlay.classList.remove('active');
        bodyEl.classList.remove('no-scroll');
    };

    const openCartDrawer = () => {
        cartDrawer.classList.add('open');
        cartDrawerOverlay.classList.add('active');
        bodyEl.classList.add('no-scroll');
        
        // Update Drawer UI
        const drawerTotal = cartDrawer.querySelector('.cart-drawer-total');
        if (drawerTotal) {
            drawerTotal.textContent = `$${cartTotalValue.toFixed(2)}`;
        }
    };

    cartDrawer.querySelector('.cart-drawer__close').addEventListener('click', closeCartDrawer);
    cartDrawerOverlay.addEventListener('click', closeCartDrawer);

    // Override existing add to cart logic to also open the drawer and add items visually
    addToCartBtns.forEach(btn => {
        // Remove existing click to avoid duplicate bindings if needed, but since it's anonymous we'll just handle drawer logic here
        btn.addEventListener('click', (e) => {
            const price = parseFloat(btn.getAttribute('data-price') || 0);
            const name = btn.getAttribute('data-name') || 'Premium Item';
            const img = btn.getAttribute('data-image') || 'assets/products/watch.png';

            const itemsContainer = document.getElementById('cart-drawer-items');
            if (itemsContainer) {
                // If cart was previously empty, clear any empty state messages
                if (itemsContainer.innerHTML.includes('Your bag is empty')) {
                    itemsContainer.innerHTML = '';
                }

                const itemHTML = `
                    <div class="cart-drawer-item">
                        <div class="cart-drawer-item__image">
                            <img src="${img}" alt="${name}">
                        </div>
                        <div class="cart-drawer-item__details">
                            <h4 class="cart-drawer-item__title">${name}</h4>
                            <span class="cart-drawer-item__price">$${price.toFixed(2)}</span>
                            <div class="cart-drawer-item__actions">
                                <button class="cart-drawer-item__remove">Remove</button>
                            </div>
                        </div>
                    </div>
                `;
                itemsContainer.insertAdjacentHTML('beforeend', itemHTML);
            }
            
            // Open drawer after a slight delay
            setTimeout(openCartDrawer, 200);
        });
    });

    // Also bind header cart icons to open drawer
    document.querySelectorAll('.iscart').forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            openCartDrawer();
        });
    });

    // --- 11. QUICK VIEW MODAL ---
    const quickViewBtns = document.querySelectorAll('.action-btn[aria-label="Quick View"]');
    let quickViewModal = document.querySelector('.quick-view-modal');

    if (!quickViewModal) {
        quickViewModal = document.createElement('div');
        quickViewModal.className = 'quick-view-modal';
        quickViewModal.innerHTML = `
            <div class="quick-view-modal__overlay"></div>
            <div class="quick-view-modal__content">
                <button class="quick-view-modal__close"><i class="ri-close-line"></i></button>
                <div class="quick-view-modal__image">
                    <img src="" alt="Product" id="qv-image">
                </div>
                <div class="quick-view-modal__info">
                    <span class="overline" id="qv-category">Category</span>
                    <h2 class="mt-sm mb-md" id="qv-title">Product Name</h2>
                    <h3 class="mb-md" style="color:var(--accent)" id="qv-price">$0.00</h3>
                    <p class="body-large mb-lg">A quick glance at this premium item. Experience the pinnacle of design and craftsmanship.</p>
                    <button class="btn btn--primary add-to-cart" id="qv-add-btn" data-price="0" data-name="Product" data-image="">Add to Bag</button>
                </div>
            </div>
        `;
        bodyEl.appendChild(quickViewModal);
    }

    const closeQV = () => {
        quickViewModal.classList.remove('active');
        bodyEl.classList.remove('no-scroll');
    };

    quickViewModal.querySelector('.quick-view-modal__close').addEventListener('click', closeQV);
    quickViewModal.querySelector('.quick-view-modal__overlay').addEventListener('click', closeQV);

    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.product-card');
            if(card) {
                const title = card.querySelector('.product-card__title a').textContent;
                const priceText = card.querySelector('.product-card__price .current').textContent;
                const category = card.querySelector('.product-card__category').textContent;
                const imgStr = card.querySelector('.product-card__image img').getAttribute('src');

                const numPrice = parseFloat(priceText.replace('$', '').replace(',', ''));

                document.getElementById('qv-title').textContent = title;
                document.getElementById('qv-price').textContent = priceText;
                document.getElementById('qv-category').textContent = category;
                document.getElementById('qv-image').setAttribute('src', imgStr);
                
                const addBtn = document.getElementById('qv-add-btn');
                addBtn.setAttribute('data-price', numPrice);
                addBtn.setAttribute('data-name', title);
                addBtn.setAttribute('data-image', imgStr);

                quickViewModal.classList.add('active');
                bodyEl.classList.add('no-scroll');
            }
        });
    });

    // --- 12. DYNAMIC FILTERING (Category Pages) ---
    const filterLinks = document.querySelectorAll('.filter-list a');
    const productCards = document.querySelectorAll('.category-content .product-card');

    if (filterLinks.length > 0 && productCards.length > 0) {
        filterLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update active state
                filterLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Get filter criteria from text (simplified for demo)
                const filterText = link.textContent.toLowerCase();
                
                productCards.forEach(card => {
                    const category = card.querySelector('.product-card__category').textContent.toLowerCase();
                    
                    // Start animation
                    card.classList.add('filtering');
                    
                    setTimeout(() => {
                        if (filterText.includes('all') || filterText.includes(category) || category.includes(filterText.split(' ')[0])) {
                            card.classList.remove('hidden');
                        } else {
                            card.classList.add('hidden');
                        }
                        
                        // End animation
                        setTimeout(() => {
                            card.classList.remove('filtering');
                        }, 50);
                    }, 350); // wait for fade out
                });
            });
        });
    }

});
