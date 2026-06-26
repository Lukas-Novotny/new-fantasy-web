/* ============================================================
   NEW FANTASY – main.js
   Navigation · Gallery · Menu · Animations · Accessibility
   ============================================================ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────
     DOM REFERENCES
  ───────────────────────────────────────────────────────── */
  const header      = document.getElementById('site-header');
  const navToggle   = document.getElementById('nav-toggle');
  const mobileMenu  = document.getElementById('mobile-menu');
  const menuClose   = document.getElementById('mobile-menu-close');
  const overlay     = document.getElementById('mobile-overlay');
  const mobileLinks = mobileMenu?.querySelectorAll('.mobile-nav-link');
  const footerYear  = document.getElementById('footer-year');

  /* ─────────────────────────────────────────────────────────
     FOOTER YEAR
  ───────────────────────────────────────────────────────── */
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  /* ─────────────────────────────────────────────────────────
     NAVIGATION SCROLL BEHAVIOR
  ───────────────────────────────────────────────────────── */
  let lastScroll = 0;

  function onScroll() {
    const y = window.scrollY;
    if (y > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = y;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─────────────────────────────────────────────────────────
     HERO IMAGE LOAD TRIGGER
  ───────────────────────────────────────────────────────── */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    const hero = document.querySelector('.hero');
    if (heroBg.complete) {
      hero.classList.add('loaded');
    } else {
      heroBg.addEventListener('load', () => hero.classList.add('loaded'));
    }
  }

  /* ─────────────────────────────────────────────────────────
     MOBILE MENU
  ───────────────────────────────────────────────────────── */
  function openMenu() {
    mobileMenu.hidden = false;
    mobileMenu.classList.add('is-open');
    overlay.classList.add('is-visible');
    navToggle.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    menuClose.focus();
  }

  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    overlay.classList.remove('is-visible');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    // Wait for animation to finish before hiding
    setTimeout(() => {
      mobileMenu.hidden = true;
    }, 450);
    navToggle.focus();
  }

  navToggle?.addEventListener('click', () => {
    if (mobileMenu.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menuClose?.addEventListener('click', closeMenu);
  overlay?.addEventListener('click', closeMenu);

  // Close on mobile link click
  mobileLinks?.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Escape key closes menu
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (mobileMenu?.classList.contains('is-open')) closeMenu();
      if (!lightboxEl.hidden) closeLightbox();
    }
  });

  /* ─────────────────────────────────────────────────────────
     SMOOTH SCROLL (offset for fixed nav)
  ───────────────────────────────────────────────────────── */
  const NAV_HEIGHT = 80;

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ─────────────────────────────────────────────────────────
     REVEAL ON SCROLL (Intersection Observer)
  ───────────────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show all immediately
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ─────────────────────────────────────────────────────────
     GALLERY LIGHTBOX
  ───────────────────────────────────────────────────────── */
  const galleryItems  = Array.from(document.querySelectorAll('.gallery-item'));
  const lightboxEl    = document.getElementById('lightbox');
  const lightboxBack  = document.getElementById('lightbox-backdrop');
  const lightboxImg   = document.getElementById('lightbox-img');
  const lightboxCap   = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev  = document.getElementById('lightbox-prev');
  const lightboxNext  = document.getElementById('lightbox-next');
  const lightboxCount = document.getElementById('lightbox-counter');

  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightboxEl.hidden = false;
    lightboxBack.style.display = 'block';
    document.body.classList.add('menu-open');
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightboxEl.hidden = true;
    lightboxBack.style.display = 'none';
    document.body.classList.remove('menu-open');
    galleryItems[currentIndex]?.focus();
  }

  function updateLightbox() {
    const item = galleryItems[currentIndex];
    if (!item) return;
    const src = item.dataset.src || item.querySelector('img')?.src;
    const cap = item.dataset.caption || item.querySelector('img')?.alt || '';
    lightboxImg.src = src;
    lightboxImg.alt = cap;
    lightboxCap.textContent = cap;
    lightboxCount.textContent = `${currentIndex + 1} / ${galleryItems.length}`;
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    updateLightbox();
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    updateLightbox();
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(i);
      }
    });
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxBack?.addEventListener('click', closeLightbox);
  lightboxPrev?.addEventListener('click', showPrev);
  lightboxNext?.addEventListener('click', showNext);

  document.addEventListener('keydown', e => {
    if (lightboxEl?.hidden) return;
    if (e.key === 'ArrowLeft')  showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  // Touch swipe support for lightbox
  let touchStartX = 0;
  lightboxEl?.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  lightboxEl?.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      if (dx < 0) showNext();
      else showPrev();
    }
  }, { passive: true });

  /* ─────────────────────────────────────────────────────────
     DAILY MENU – FETCH & RENDER
  ───────────────────────────────────────────────────────── */
  const menuContent = document.getElementById('menu-content');
  const menuDate    = document.getElementById('menu-date');

  async function loadMenu() {
    if (!menuContent) return;

    try {
      // Timestamp busts both browser cache and Netlify CDN
      const url = '/content/menu.json?_=' + Date.now();
      const response = await fetch(url, { cache: 'no-store' });

      if (!response.ok) throw new Error('HTTP ' + response.status);

      const text = await response.text();
      let menu;
      try {
        menu = JSON.parse(text);
      } catch (parseErr) {
        console.error('[Menu] JSON parse failed. First 300 chars:', text.slice(0, 300));
        throw parseErr;
      }
      renderMenu(menu);
    } catch (err) {
      console.error('[Menu] Load error:', err);
      renderMenuError();
    }
  }

  function formatCzechDate(dateStr) {
    try {
      // Parse YYYY-MM-DD safely (avoid timezone issues with new Date('YYYY-MM-DD'))
      const parts = dateStr.split('-');
      if (parts.length !== 3) throw new Error('bad date');
      const d = new Date(
        parseInt(parts[0], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[2], 10)
      );
      return d.toLocaleDateString('cs-CZ', {
        weekday: 'long',
        day:     'numeric',
        month:   'long',
        year:    'numeric',
      });
    } catch {
      return dateStr;
    }
  }

  function renderMenu(menu) {
    if (menuDate && menu.date) {
      menuDate.textContent = formatCzechDate(menu.date);
    }

    let html = '';

    // ── Soups: support both new array format and legacy single-object format ──
    const soups = Array.isArray(menu.soups)
      ? menu.soups
      : (menu.soup && menu.soup.name ? [menu.soup] : []);

    if (soups.length > 0) {
      html += '<span class="menu-soup-label">Polévka</span>';
      soups.forEach(soup => {
        html += `
          <div class="menu-course">
            <div class="menu-course-info">
              <p class="menu-course-name">${escHtml(soup.name)}</p>
              ${soup.allergens ? `<p class="menu-course-desc">Alergeny: ${escHtml(soup.allergens)}</p>` : ''}
            </div>
            ${soup.price ? `<span class="menu-course-price">${soup.price} Kč</span>` : ''}
          </div>
        `;
      });
    }

    // ── Categories: new named-section format ──
    if (menu.categories && menu.categories.length > 0) {
      menu.categories.forEach(category => {
        html += `<hr class="menu-divider"><span class="menu-courses-label">${escHtml(category.name)}</span>`;
        (category.items || []).forEach(item => {
          html += `
            <div class="menu-course">
              <div class="menu-course-info">
                <p class="menu-course-name">${escHtml(item.name)}</p>
                ${item.description ? `<p class="menu-course-desc">${escHtml(item.description)}</p>` : ''}
                ${item.allergens ? `<p class="menu-course-desc">Alergeny: ${escHtml(item.allergens)}</p>` : ''}
              </div>
              <span class="menu-course-price">${item.price} Kč</span>
            </div>
          `;
        });
      });
    } else if (menu.courses && menu.courses.length > 0) {
      // ── Legacy flat-courses format ──
      html += '<hr class="menu-divider"><span class="menu-courses-label">Hlavní jídla</span>';
      menu.courses.forEach(course => {
        html += `
          <div class="menu-course">
            <div class="menu-course-info">
              <p class="menu-course-name">${escHtml(course.name)}</p>
              ${course.description ? `<p class="menu-course-desc">${escHtml(course.description)}</p>` : ''}
              ${course.allergens ? `<p class="menu-course-desc">Alergeny: ${escHtml(course.allergens)}</p>` : ''}
            </div>
            <span class="menu-course-price">${course.price} Kč</span>
          </div>
        `;
      });
    }

    // ── Note ──
    if (menu.note) {
      html += `<div class="menu-note">${escHtml(menu.note)}</div>`;
    }

    menuContent.innerHTML = html;
  }

  function renderMenuError() {
    if (menuDate) menuDate.textContent = 'Menu není k dispozici';
    if (menuContent) {
      menuContent.innerHTML = `
        <div class="menu-error">
          <p>Dnešní menu není momentálně dostupné online.</p>
          <p>Zavolejte nám na <a href="tel:+420727973354">+420 727 973 354</a></p>
        </div>
      `;
    }
  }

  function escHtml(str) {
    if (typeof str !== 'string') return String(str);
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  loadMenu();

  /* ─────────────────────────────────────────────────────────
     ACTIVE NAV LINK HIGHLIGHT
  ───────────────────────────────────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  function highlightNav() {
    let active = '';
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top <= NAV_HEIGHT + 80) active = section.id;
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href').slice(1);
      link.classList.toggle('nav-link--active', href === active);
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

  /* ─────────────────────────────────────────────────────────
     LAZY LOADING POLYFILL (for older browsers)
  ───────────────────────────────────────────────────────── */
  if (!('loading' in HTMLImageElement.prototype)) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
      const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) img.src = img.dataset.src;
            imgObserver.unobserve(img);
          }
        });
      });
      lazyImages.forEach(img => imgObserver.observe(img));
    }
  }

  /* ─────────────────────────────────────────────────────────
     STAGGER REVEAL CHILDREN
     Assigns --delay CSS custom property to groups of cards
  ───────────────────────────────────────────────────────── */
  const staggerParents = document.querySelectorAll(
    '.features-grid, .dishes-grid, .reviews-grid'
  );
  staggerParents.forEach(parent => {
    const children = parent.querySelectorAll('.reveal:not([style*="--delay"])');
    children.forEach((child, i) => {
      child.style.setProperty('--delay', `${i * 0.08}s`);
    });
  });

})();
