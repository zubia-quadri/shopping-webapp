// =========================================================
// KENT WATER PURIFIERS — main.js
// Vanilla JS. Zero External Dependencies.
// =========================================================

(function () {
  'use strict';

  /* ── 1. Sticky Navigation Shadow ────────────────────────── */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  /* ── 2. Mobile Hamburger Menu ───────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── 2.1 Account & Cart Dropdown Popovers ───────────────── */
  const accountBtn   = document.getElementById('accountBtn');
  const accountPanel = document.getElementById('accountPanel');
  const cartBtn      = document.getElementById('cartBtn');
  const cartPanel    = document.getElementById('cartPanel');

  function setupPopover(btn, panel, otherPanel, otherBtn) {
    if (!btn || !panel) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = panel.classList.toggle('show');
      btn.setAttribute('aria-expanded', isOpen);
      if (otherPanel) {
        otherPanel.classList.remove('show');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  setupPopover(accountBtn, accountPanel, cartPanel, cartBtn);
  setupPopover(cartBtn, cartPanel, accountPanel, accountBtn);

  document.addEventListener('click', function (e) {
    if (accountPanel && !accountPanel.contains(e.target) && e.target !== accountBtn && !accountBtn.contains(e.target)) {
      accountPanel.classList.remove('show');
      if (accountBtn) accountBtn.setAttribute('aria-expanded', 'false');
    }
    if (cartPanel && !cartPanel.contains(e.target) && e.target !== cartBtn && !cartBtn.contains(e.target)) {
      cartPanel.classList.remove('show');
      if (cartBtn) cartBtn.setAttribute('aria-expanded', 'false');
    }
  });

  /* ── 3. Smooth Anchor Scrolling ─────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navHeight = navbar ? navbar.offsetHeight : 70;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

  /* ── 4. Product 3-Card Finite Bounded Carousel ──────────── */
  const productTrack     = document.getElementById('productCarouselTrack');
  const productViewport  = document.getElementById('productCarouselViewport');
  const productPrevBtn   = document.getElementById('productCarouselPrev');
  const productNextBtn   = document.getElementById('productCarouselNext');
  const productDotsWrap  = document.getElementById('productCarouselDots');
  const filterBtns       = document.querySelectorAll('.filter-btn');

  if (productTrack && productViewport) {
    const cards    = Array.from(productTrack.querySelectorAll('.catalog-card'));
    const numCards = cards.length; // 6 flagship models
    let activeIndex = 1; // Start with card 1 (KENT Grand IoT) in center spotlight

    // Render 6 pagination dots
    if (productDotsWrap) {
      productDotsWrap.innerHTML = '';
      cards.forEach(function (card, i) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === activeIndex ? ' active' : '');
        dot.setAttribute('aria-label', 'View ' + (card.querySelector('.catalog-card-title')?.textContent || ('product ' + (i + 1))));
        dot.setAttribute('type', 'button');
        dot.addEventListener('click', function () {
          updateCarousel(i, true);
        });
        productDotsWrap.appendChild(dot);
      });
    }

    // Helper: compute card width and gap
    function getCardMetrics() {
      const card = cards[0];
      if (!card) return { cardWidth: 360, gap: 28 };
      const cardWidth = card.offsetWidth;
      const computedTrack = window.getComputedStyle(productTrack);
      const gap = parseFloat(computedTrack.gap) || 28;
      return { cardWidth: cardWidth, gap: gap };
    }

    // Update track position with strict boundary clamping (FINITE CAROUSEL)
    function updateCarousel(idx, animate) {
      if (idx < 0) idx = 0;
      if (idx >= numCards) idx = numCards - 1;
      activeIndex = idx;

      const metrics   = getCardMetrics();
      const step      = metrics.cardWidth + metrics.gap;
      const vpWidth   = productViewport.clientWidth;

      // Target offset to center the active card in the viewport
      let targetOffset = -(activeIndex * step) + (vpWidth - metrics.cardWidth) / 2;

      // On desktop (3-card bounded showcase), apply strict boundary clamping
      // On mobile (center-focused side-peeking carousel), always center the active card with equal left/right peeks
      const isMobile = window.innerWidth <= 768;
      if (!isMobile) {
        const maxOffset = 0;
        const totalTrackWidth = (numCards * step) - metrics.gap;
        const minOffset = -(totalTrackWidth - vpWidth);

        if (minOffset < 0) {
          if (targetOffset > maxOffset) targetOffset = maxOffset;
          if (targetOffset < minOffset) targetOffset = minOffset;
        } else {
          targetOffset = 0;
        }
      }

      productTrack.style.transition = animate ? 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)' : 'none';
      productTrack.style.transform  = 'translateX(' + targetOffset + 'px)';

      // Mark the active center card
      cards.forEach(function (card, i) {
        if (i === activeIndex) {
          card.classList.add('is-center');
          card.setAttribute('aria-current', 'true');
        } else {
          card.classList.remove('is-center');
          card.removeAttribute('aria-current');
        }
      });

      // Update dots
      if (productDotsWrap) {
        const dots = productDotsWrap.querySelectorAll('.carousel-dot');
        dots.forEach(function (dot, dIdx) {
          dot.classList.toggle('active', dIdx === activeIndex);
        });
      }

      // Finite Arrow States: disable when hitting start or end
      if (productPrevBtn) {
        const isStart = activeIndex === 0;
        productPrevBtn.disabled = isStart;
        productPrevBtn.classList.toggle('disabled', isStart);
      }
      if (productNextBtn) {
        const isEnd = activeIndex === numCards - 1;
        productNextBtn.disabled = isEnd;
        productNextBtn.classList.toggle('disabled', isEnd);
      }
    }

    // Step navigation
    function nextSlide() {
      if (activeIndex < numCards - 1) {
        updateCarousel(activeIndex + 1, true);
      }
    }

    function prevSlide() {
      if (activeIndex > 0) {
        updateCarousel(activeIndex - 1, true);
      }
    }

    // Arrow Button Clicks
    if (productPrevBtn) {
      productPrevBtn.addEventListener('click', prevSlide);
    }
    if (productNextBtn) {
      productNextBtn.addEventListener('click', nextSlide);
    }

    // Clicking any card directly brings it into focus
    cards.forEach(function (card, idx) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('a, button')) return;
        if (idx !== activeIndex) {
          updateCarousel(idx, true);
        }
      });
    });

    // Touch Swipe & Drag Support
    let touchStartX = 0;
    let touchDiffX  = 0;
    let isDragging  = false;

    productViewport.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
      isDragging  = true;
      touchDiffX  = 0;
    }, { passive: true });

    productViewport.addEventListener('touchmove', function (e) {
      if (!isDragging) return;
      touchDiffX = e.touches[0].clientX - touchStartX;
    }, { passive: true });

    productViewport.addEventListener('touchend', function () {
      if (!isDragging) return;
      isDragging = false;
      if (Math.abs(touchDiffX) > 40) {
        if (touchDiffX < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      touchStartX = 0;
      touchDiffX  = 0;
    });

    // Keyboard Arrow Left/Right Navigation
    window.addEventListener('keydown', function (e) {
      const prodSec = document.getElementById('products');
      if (!prodSec) return;
      const rect = prodSec.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    });

    // Responsive Window Resize recalculation
    let resizeTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        updateCarousel(activeIndex, false);
      }, 60);
    });

    // Initial setup positioning
    updateCarousel(activeIndex, false);
    setTimeout(function () {
      updateCarousel(activeIndex, false);
    }, 60);
    window.addEventListener('load', function () {
      updateCarousel(activeIndex, false);
    });

    // Filter Tabs Integration by Wellness Series
    if (filterBtns.length) {
      filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          const filter = this.getAttribute('data-filter');
          filterBtns.forEach(function (b) {
            const match = b.getAttribute('data-filter') === filter;
            b.classList.toggle('active', match);
            b.setAttribute('aria-selected', match ? 'true' : 'false');
          });

          if (filter === 'all') {
            updateCarousel(1, true); // Default to Grand IoT
          } else {
            const matchIdx = cards.findIndex(function (c) {
              return c.getAttribute('data-category') === filter;
            });
            if (matchIdx !== -1) {
              updateCarousel(matchIdx, true);
            }
          }
        });
      });
    }

    // Nav Search Input Live Integration
    const navSearchInput = document.querySelector('.nav-search-input');
    if (navSearchInput) {
      navSearchInput.addEventListener('input', function () {
        const q = this.value.trim().toLowerCase();
        if (!q) return;
        const matchIdx = cards.findIndex(function (c) {
          return c.textContent.toLowerCase().includes(q);
        });
        if (matchIdx !== -1) {
          updateCarousel(matchIdx, true);
        }
      });

      navSearchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          const prodSec = document.getElementById('products');
          if (prodSec) {
            prodSec.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    }
  }

  /* ── 4.1 Card Wishlist Interaction ────────────────────────── */
  document.addEventListener('click', function (e) {
    const wishBtn = e.target.closest('.card-action-wishlist');
    if (wishBtn) {
      e.preventDefault();
      e.stopPropagation();
      wishBtn.classList.toggle('active');
      const isFav = wishBtn.classList.contains('active');
      wishBtn.title = isFav ? 'Remove from Wishlist' : 'Save to Wishlist';

      // Update mobile drawer wishlist counter
      const activeFavs = document.querySelectorAll('.card-action-wishlist.active').length;
      const mobWishlistBadge = document.getElementById('mobileWishlistCount');
      if (mobWishlistBadge) {
        mobWishlistBadge.textContent = activeFavs;
      }

      // Header Wishlist icon pulse
      const headerWishlist = document.getElementById('wishlistBtn');
      if (headerWishlist) {
        headerWishlist.style.transform = 'scale(1.2)';
        setTimeout(function () { headerWishlist.style.transform = ''; }, 220);
      }
    }
  });

  /* ── 4.2 Card Add to Cart Interaction ─────────────────────── */
  document.addEventListener('click', function (e) {
    const addBtn = e.target.closest('.btn-add-cart');
    if (addBtn) {
      e.preventDefault();
      e.stopPropagation();
      const originalHtml = addBtn.innerHTML;
      addBtn.classList.add('added');
      addBtn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Added ✓</span>';

      // Increment Nav Cart Counter
      const cartCountBadge = document.querySelector('.cart-count');
      if (cartCountBadge) {
        const currentCount = parseInt(cartCountBadge.textContent, 10) || 0;
        cartCountBadge.textContent = currentCount + 1;
        cartCountBadge.style.transform = 'scale(1.3)';
        setTimeout(function () { cartCountBadge.style.transform = ''; }, 250);
      }

      setTimeout(function () {
        addBtn.classList.remove('added');
        addBtn.innerHTML = originalHtml;
      }, 1300);
    }
  });

  /* ── 4.2 Wishlist Toggle Interaction ─────────────────────── */
  const wishlistBtn = document.getElementById('wishlistBtn');
  if (wishlistBtn) {
    let isWishlisted = false;
    wishlistBtn.addEventListener('click', function () {
      isWishlisted = !isWishlisted;
      const svg = this.querySelector('svg');
      if (svg) {
        svg.style.fill = isWishlisted ? '#EF4444' : 'none';
        svg.style.stroke = isWishlisted ? '#EF4444' : 'currentColor';
      }
      this.title = isWishlisted ? 'Saved to Wishlist' : 'Wishlist';
    });
  }

  /* ── 5. Product Card "Book Free Demo" Integration ───────── */
  const productInterestSelect = document.getElementById('product-interest');
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-book-card');
    if (btn) {
      const prodCode = btn.getAttribute('data-product');
      if (prodCode && productInterestSelect) {
        productInterestSelect.value = prodCode;
      }
    }
  });

  /* ── 6. "Why Kent" Testimonials Marquee Slider (3s Auto) ── */
  const sliderContainer = document.getElementById('testimonial-slider-container');
  const sliderTrack     = document.getElementById('testimonial-track');
  const prevBtn         = document.getElementById('slider-prev');
  const nextBtn         = document.getElementById('slider-next');
  const dotsContainer   = document.getElementById('slider-dots');

  if (sliderContainer && sliderTrack) {
    const cards = sliderTrack.querySelectorAll('.testimonial-card');
    const totalCards = cards.length;
    let currentIndex = 0;
    let autoSlideTimer = null;
    let isHovered = false;

    // Determine how many cards are visible per view
    function getVisibleCount() {
      const w = window.innerWidth;
      if (w <= 640) return 1;
      if (w <= 1023) return 2;
      return 3;
    }

    function getMaxIndex() {
      const visible = getVisibleCount();
      return Math.max(0, totalCards - visible);
    }

    // Build indicator dots
    function renderDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      const maxIdx = getMaxIndex();
      for (let i = 0; i <= maxIdx; i++) {
        const dot = document.createElement('button');
        dot.className = 'slider-dot' + (i === currentIndex ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to testimonial slide ' + (i + 1));
        dot.addEventListener('click', function () {
          goToSlide(i);
          resetAutoSlide();
        });
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      if (!dotsContainer) return;
      const dots = dotsContainer.querySelectorAll('.slider-dot');
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    // Move track smoothly
    function goToSlide(index) {
      const maxIdx = getMaxIndex();
      if (index > maxIdx) {
        currentIndex = 0;
      } else if (index < 0) {
        currentIndex = maxIdx;
      } else {
        currentIndex = index;
      }

      if (cards.length > 0) {
        const firstCard = cards[0];
        const cardWidth = firstCard.offsetWidth;
        const gap = 24; // 24px gap defined in CSS
        const offset = currentIndex * (cardWidth + gap);
        sliderTrack.style.transform = 'translateX(-' + offset + 'px)';
      }

      updateDots();
    }

    function nextSlide() {
      const maxIdx = getMaxIndex();
      if (currentIndex >= maxIdx) {
        goToSlide(0);
      } else {
        goToSlide(currentIndex + 1);
      }
    }

    function prevSlide() {
      const maxIdx = getMaxIndex();
      if (currentIndex <= 0) {
        goToSlide(maxIdx);
      } else {
        goToSlide(currentIndex - 1);
      }
    }

    // 3-second auto-slide interval effect
    function startAutoSlide() {
      stopAutoSlide();
      autoSlideTimer = setInterval(function () {
        if (!isHovered) {
          nextSlide();
        }
      }, 3000); // exact 3 seconds
    }

    function stopAutoSlide() {
      if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
        autoSlideTimer = null;
      }
    }

    function resetAutoSlide() {
      stopAutoSlide();
      startAutoSlide();
    }

    // Manual navigation click handlers
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        nextSlide();
        resetAutoSlide();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        prevSlide();
        resetAutoSlide();
      });
    }

    // Pause on hover
    sliderContainer.addEventListener('mouseenter', function () {
      isHovered = true;
    });

    sliderContainer.addEventListener('mouseleave', function () {
      isHovered = false;
    });

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    sliderContainer.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
      isHovered = true;
    }, { passive: true });

    sliderContainer.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      isHovered = false;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        resetAutoSlide();
      }
    }, { passive: true });

    // Handle responsive resize recalculations
    window.addEventListener('resize', function () {
      renderDots();
      goToSlide(currentIndex);
    });

    // Initialize
    renderDots();
    goToSlide(0);
    startAutoSlide();
  }

  /* ── 7. Demo Booking Form Validation & Submit ───────────── */
  const demoForm       = document.getElementById('demo-form');
  const formSubmitBtn  = document.getElementById('form-submit');
  const formContent    = document.getElementById('form-content');
  const successBox     = document.getElementById('demo-success');
  const bookAnotherBtn = document.getElementById('btn-book-another');

  function validateInput(input) {
    const val   = input.value.trim();
    let isValid = true;

    if (input.hasAttribute('required') && val === '') {
      isValid = false;
    }

    if (input.id === 'phone' && val !== '') {
      isValid = /^[6-9]\d{9}$/.test(val);
    }

    if (input.type === 'date' && val !== '') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const chosen = new Date(val);
      if (chosen <= today) isValid = false;
    }

    if (isValid) {
      input.classList.remove('error');
    } else {
      input.classList.add('error');
    }

    return isValid;
  }

  if (demoForm) {
    // Set minimum date to tomorrow
    const dateInput = document.getElementById('demo-date');
    if (dateInput) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.min = tomorrow.toISOString().split('T')[0];
    }

    demoForm.querySelectorAll('.form-control').forEach(function (inp) {
      inp.addEventListener('blur', function () {
        validateInput(this);
      });
      inp.addEventListener('input', function () {
        if (this.classList.contains('error')) {
          validateInput(this);
        }
      });
    });

    demoForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const requiredInputs = demoForm.querySelectorAll('.form-control[required]');
      let formOk = true;

      requiredInputs.forEach(function (inp) {
        if (!validateInput(inp)) {
          formOk = false;
        }
      });

      if (!formOk) return;

      // Simulated submission
      formSubmitBtn.disabled = true;
      const originalText = formSubmitBtn.innerHTML;
      formSubmitBtn.innerHTML = '<span>Scheduling Free Demo…</span>';

      setTimeout(function () {
        formContent.style.display = 'none';
        successBox.classList.add('visible');
        formSubmitBtn.disabled = false;
        formSubmitBtn.innerHTML = originalText;
      }, 1200);
    });

    if (bookAnotherBtn) {
      bookAnotherBtn.addEventListener('click', function () {
        demoForm.reset();
        successBox.classList.remove('visible');
        formContent.style.display = 'block';
      });
    }
  }

  /* ── 8. Stat Number Counter Animation ───────────────────── */
  const statElements = document.querySelectorAll('[data-count]');

  function animateStatCount(el) {
    const targetVal = parseInt(el.getAttribute('data-count'), 10);
    const suffix    = el.getAttribute('data-suffix') || '';
    const duration  = 1600;
    const start     = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // Cubic ease out
      const current  = Math.round(eased * targetVal);

      if (targetVal >= 10000000) {
        el.textContent = '1Cr' + suffix;
      } else {
        el.textContent = current.toLocaleString('en-IN') + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateStatCount(entry.target);
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    statElements.forEach(function (el) {
      statsObserver.observe(el);
    });
  }

  /* ── 9. Scroll Reveal Animations ────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');

  function checkVisibleNow() {
    reveals.forEach(function (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 150) {
        el.classList.add('visible');
      }
    });
  }

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px 80px 0px' }
    );

    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
    // Run an immediate check on load & hashchange
    checkVisibleNow();
    window.addEventListener('hashchange', checkVisibleNow);
  } else {
    reveals.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ── 10. Product Quick-View Modal Interaction ─────────────── */
  const productModal        = document.getElementById('productModal');
  const modalCloseBtn       = document.getElementById('modalCloseBtn');
  const modalProductPicture = document.getElementById('modalProductPicture');
  const modalProductSource  = document.getElementById('modalProductSource');
  const modalProductImg     = document.getElementById('modalProductImg');
  const modalProductKicker  = document.getElementById('modalProductKicker');
  const modalProductTitle   = document.getElementById('modalProductTitle');
  const modalProductPrice   = document.getElementById('modalProductPrice');
  const modalProductMrp     = document.getElementById('modalProductMrp');
  const modalProductDiscount= document.getElementById('modalProductDiscount');
  const modalProductDesc    = document.getElementById('modalProductDesc');
  const modalAddToCartBtn   = document.getElementById('modalAddToCartBtn');
  const modalBuyNowBtn      = document.getElementById('modalBuyNowBtn');

  const productData = {
    'grand-star': {
      title: 'KENT Grand Star',
      kicker: 'KENT MINERAL RO™',
      price: '₹21,999',
      mrp: '₹25,000',
      discount: '12% OFF',
      image: 'assets/images/product_grand_star.jpg',
      desc: 'Digital purity display with real-time TDS tracking, patented Mineral RO™ multi-stage filtration, and in-tank UV disinfection for uninterrupted mineral-rich safety.'
    },
    'grand-iot': {
      title: 'KENT Grand IoT',
      kicker: 'SMART IOT CONNECTED',
      price: '₹23,499',
      mrp: '₹27,000',
      discount: '13% OFF',
      image: 'assets/images/product_grand_iot.jpg',
      desc: 'Next-generation smart connectivity with live purity metrics, automated filter health monitoring, and doorstep service requests straight through your smartphone.'
    },
    'supreme-plus': {
      title: 'KENT Supreme Plus',
      kicker: 'BIO-ALKALINE ANTIOXIDANT',
      price: '₹18,499',
      mrp: '₹21,500',
      discount: '14% OFF',
      image: 'assets/images/kent-supreme.png',
      desc: 'Bio-alkaline infusion maintaining optimal pH 8.0–9.5 to neutralize acidity, paired with active copper and zinc for daily cellular immunity and hydration.'
    },
    'ace-copper': {
      title: 'KENT Ace Copper',
      kicker: 'PURE ACTIVE COPPER+',
      price: '₹15,499',
      mrp: '₹18,000',
      discount: '14% OFF',
      image: 'assets/images/product_ace_copper.jpg',
      desc: 'Time-tested Ayurvedic wellness modernised with Mineral RO™ technology. Charges every drop of water with 99.9% pure active copper ions that support metabolism and digestive wellness.'
    },
    'sterling-star': {
      title: 'KENT Sterling Star',
      kicker: 'CONCEALED UNDER-COUNTER RO',
      price: '₹22,999',
      mrp: '₹26,500',
      discount: '13% OFF',
      image: 'assets/images/product_sterling_undersink.jpg',
      desc: 'Concealed under-sink installation paired with an elegant stainless steel swan faucet, preserving luxury minimalist kitchen counter aesthetics with zero compromise.'
    },
    'marvel': {
      title: 'KENT Marvel',
      kicker: 'ZERO WATER WASTAGE RO',
      price: '₹12,499',
      mrp: '₹14,500',
      discount: '14% OFF',
      image: 'assets/images/product_marvel_compact.jpg',
      desc: 'High-recovery RO technology with an ultra-compact footprint, producing 20 liters/hr of mineral-balanced water with zero water wastage.'
    }
  };

  let currentModalProductKey = 'grand-star';

  function openProductModal(prodKey) {
    if (!productModal) return;
    const data = productData[prodKey] || productData['grand-star'];
    currentModalProductKey = prodKey;

    if (modalProductSource) {
      modalProductSource.srcset = data.image;
      if (data.image.endsWith('.png')) {
        modalProductSource.type = 'image/png';
      } else if (data.image.endsWith('.webp')) {
        modalProductSource.type = 'image/webp';
      } else {
        modalProductSource.type = 'image/jpeg';
      }
    }
    if (modalProductImg) {
      modalProductImg.src = data.image;
      modalProductImg.alt = data.title;
    }
    if (modalProductKicker) modalProductKicker.textContent = data.kicker;
    if (modalProductTitle) modalProductTitle.textContent = data.title;
    if (modalProductPrice) modalProductPrice.textContent = data.price;
    if (modalProductMrp) modalProductMrp.textContent = data.mrp;
    if (modalProductDiscount) modalProductDiscount.textContent = data.discount;
    if (modalProductDesc) modalProductDesc.textContent = data.desc;

    productModal.classList.add('open');
    productModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProductModal() {
    if (!productModal) return;
    productModal.classList.remove('open');
    productModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Open modal on clicking "View Product" buttons
  document.addEventListener('click', function (e) {
    const viewBtn = e.target.closest('.btn-view-product');
    if (viewBtn) {
      e.preventDefault();
      e.stopPropagation();
      const prodKey = viewBtn.getAttribute('data-product') || 'grand-star';
      openProductModal(prodKey);
      return;
    }

    const cardMedia = e.target.closest('.catalog-card-media');
    if (cardMedia) {
      const card = cardMedia.closest('.catalog-card');
      if (card) {
        const btn = card.querySelector('.btn-view-product');
        if (btn) {
          const prodKey = btn.getAttribute('data-product') || 'grand-star';
          openProductModal(prodKey);
        }
      }
    }
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProductModal);
  }

  if (productModal) {
    productModal.addEventListener('click', function (e) {
      if (e.target === productModal) {
        closeProductModal();
      }
    });
  }

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && productModal && productModal.classList.contains('open')) {
      closeProductModal();
    }
  });

  // Modal "Add to Cart"
  if (modalAddToCartBtn) {
    modalAddToCartBtn.addEventListener('click', function () {
      const originalText = modalAddToCartBtn.innerHTML;
      modalAddToCartBtn.classList.add('added');
      modalAddToCartBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Added to Cart ✓</span>';

      // Update Nav Cart Counter
      const cartCountBadge = document.querySelector('.cart-pill-count');
      if (cartCountBadge) {
        const currentCount = parseInt(cartCountBadge.textContent, 10) || 0;
        cartCountBadge.textContent = currentCount + 1;
        cartCountBadge.style.transform = 'scale(1.3)';
        setTimeout(function () { cartCountBadge.style.transform = ''; }, 250);
      }

      // Update cart panel preview
      const cartPanelBody = document.querySelector('.cart-panel-body');
      const prod = productData[currentModalProductKey];
      if (cartPanelBody && prod) {
        cartPanelBody.innerHTML = `
          <img src="${prod.image}" alt="${prod.title}" class="cart-panel-thumb" width="44" height="44">
          <div class="cart-panel-info">
            <strong>${prod.title}</strong>
            <span class="cart-panel-price">${prod.price}</span>
            <span class="cart-panel-tag">${prod.kicker}</span>
          </div>
        `;
      }

      setTimeout(function () {
        modalAddToCartBtn.classList.remove('added');
        modalAddToCartBtn.innerHTML = originalText;
      }, 1500);
    });
  }

  // Modal "Buy Now"
  if (modalBuyNowBtn) {
    modalBuyNowBtn.addEventListener('click', function () {
      closeProductModal();
      const productInterestSelect = document.getElementById('product-interest');
      if (productInterestSelect && currentModalProductKey) {
        productInterestSelect.value = currentModalProductKey;
      }
      const demoSec = document.getElementById('demo');
      if (demoSec) {
        const navHeight = navbar ? navbar.offsetHeight : 70;
        const targetTop = demoSec.getBoundingClientRect().top + window.scrollY - navHeight - 12;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    });
  }

  // URL Query Param / Hash Deep Linking for Modal
  function checkUrlForModal() {
    const urlParams = new URLSearchParams(window.location.search);
    const modalParam = urlParams.get('modal') || urlParams.get('product');
    if (modalParam && productData[modalParam]) {
      openProductModal(modalParam);
    } else if (window.location.hash.startsWith('#product-')) {
      const key = window.location.hash.replace('#product-', '');
      if (productData[key]) {
        openProductModal(key);
      }
    }
  }
  checkUrlForModal();
  window.addEventListener('hashchange', checkUrlForModal);

})();
