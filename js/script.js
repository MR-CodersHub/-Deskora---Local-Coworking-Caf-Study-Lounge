/**
 * The Atelier – Coworking Café & Study Lounge
 * Unified Vanilla JS · v2.0
 */

/* ── Helpers ──────────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function showToast(msg, icon = '✓') {
  let container = $('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${icon}</span> ${msg}`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(8px)'; toast.style.transition = 'all .3s'; setTimeout(() => toast.remove(), 320); }, 2800);
}

/* ── Theme ────────────────────────────────────────────────────── */
const THEME_KEY = 'atelier-theme';

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeBtn(saved);
}

function updateThemeBtn(theme) {
  const isDark = theme === 'dark';
  $$('.theme-toggle').forEach(btn => {
    const moon = btn.querySelector('.theme-icon-moon');
    const sun = btn.querySelector('.theme-icon-sun');
    if (moon && sun) {
      moon.style.display = isDark ? 'none' : 'block';
      sun.style.display = isDark ? 'block' : 'none';
    } else {
      btn.textContent = isDark ? '☀ Light' : '☽ Dark';
    }
  });
}

function toggleTheme() {
  const curr = document.documentElement.getAttribute('data-theme') || 'light';
  const next = curr === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(THEME_KEY, next);
  updateThemeBtn(next);
}

/* ── RTL Direction Toggle ─────────────────────────────────────── */
const RTL_KEY = 'atelier-dir';

function initRtl() {
  const saved = localStorage.getItem(RTL_KEY) || 'ltr';
  document.documentElement.setAttribute('dir', saved);
  updateRtlBtn(saved);

  $$('.rtl-toggle').forEach(btn => {
    btn.addEventListener('click', toggleRtl);
  });
}

function updateRtlBtn(dir) {
  const isRtl = dir === 'rtl';
  $$('.rtl-toggle').forEach(btn => {
    const label = btn.querySelector('.rtl-badge-text') || btn;
    label.textContent = isRtl ? 'LTR' : 'RTL';
    btn.setAttribute('title', isRtl ? 'Switch to Left-to-Right' : 'Switch to Right-to-Left');
  });
}

function toggleRtl() {
  const curr = document.documentElement.getAttribute('dir') || 'ltr';
  const next = curr === 'rtl' ? 'ltr' : 'rtl';
  document.documentElement.setAttribute('dir', next);
  localStorage.setItem(RTL_KEY, next);
  updateRtlBtn(next);
  showToast(next === 'rtl' ? 'Switched to RTL mode' : 'Switched to LTR mode', '⇄');
}

/* ── Sticky Header ────────────────────────────────────────────── */
function initStickyHeader() {
  const header = $('.site-header');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ── Active Nav Link ──────────────────────────────────────────── */
function initActiveNav() {
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  $$('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    const isHome = (href === 'index.html' || href === './') && (currentFile === 'index.html' || currentFile === '');
    const isDashboard = (href === 'user-dashboard.html' || href === 'dashboard.html' || link.id === 'nav-dashboard' || link.id === 'mobile-nav-dashboard') &&
      (currentFile === 'user-dashboard.html' || currentFile === 'admin-dashboard.html' || currentFile === 'dashboard.html');
    if (href === currentFile || isHome || isDashboard) {
      link.classList.add('active');
    }
  });
}

/* ── Mobile Drawer ────────────────────────────────────────────── */
function initMobileDrawer() {
  const burgerBtn = $('.burger-btn');
  const drawer = $('.mobile-drawer');
  const closeBtn = $('.mobile-drawer-close');
  const backdrop = $('.mobile-drawer-backdrop');
  if (!burgerBtn || !drawer) return;

  function openDrawer() { drawer.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeDrawer() { drawer.classList.remove('open'); document.body.style.overflow = ''; }

  burgerBtn.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
  $$('.mobile-nav-link').forEach(link => link.addEventListener('click', closeDrawer));
}

/* ── Booking Modal ────────────────────────────────────────────── */
function initBookingModal() {
  const modal = $('#bookingModal');
  if (!modal) return;
  const closeBtns = $$('[data-close-modal]');

  function openModal() { modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeModal() { modal.classList.remove('open'); document.body.style.overflow = ''; }

  $$('[data-open-booking]').forEach(btn => btn.addEventListener('click', openModal));
  closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // Form submit
  const form = $('#bookingForm');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    closeModal();
    showToast('Booking request sent! We\'ll confirm within 30 minutes.', '📅');
  });
}

/* ── Accordions ───────────────────────────────────────────────── */
function initAccordions() {
  $$('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const wasOpen = item.classList.contains('open');
      // close all in same group
      const siblings = $$(`.accordion-item`, item.closest('.accordion-wrap, section'));
      siblings.forEach(s => s.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

/* ── Pricing Switcher (Monthly / Annual) ──────────────────────── */
function initPricingSwitcher() {
  const tabs = $$('.price-tab');
  if (!tabs.length) return;
  const monthlyPrices = {
    'price-day':      { month: 15,  annual: 12 },
    'price-flex':     { month: 89,  annual: 71 },
    'price-dedicated':{ month: 249, annual: 199 },
    'price-studio':   { month: 649, annual: 519 },
  };

  function setTab(mode) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === mode));
    Object.entries(monthlyPrices).forEach(([id, vals]) => {
      const el = $(`#${id}`);
      if (el) el.textContent = mode === 'annual' ? vals.annual : vals.month;
    });
    const saveEl = $('.annual-save-note');
    if (saveEl) saveEl.style.display = mode === 'annual' ? 'block' : 'none';
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => setTab(tab.dataset.tab));
  });
}

/* ── Blog Filter ──────────────────────────────────────────────── */
function initBlogFilter() {
  const filterBtns = $$('.filter-btn');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      const cards = $$('.blog-card[data-cat]');
      cards.forEach(card => {
        const show = cat === 'all' || card.dataset.cat === cat;
        card.style.display = show ? '' : 'none';
      });
      const visible = cards.filter(c => c.style.display !== 'none');
      const noRes = $('.no-results');
      if (noRes) noRes.style.display = visible.length === 0 ? 'block' : 'none';
    });
  });
}

/* ── Blog Search ──────────────────────────────────────────────── */
function initBlogSearch() {
  const searchInput = $('.search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();
    const cards = $$('.blog-card');
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = !q || text.includes(q) ? '' : 'none';
    });
  });
}

/* ── Contact Form ─────────────────────────────────────────────── */
function initContactForm() {
  const form = $('#contactForm');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Message sent! We\'ll get back to you within 2 hours.', '✉');
    form.reset();
  });
}

/* ── Newsletter Form ──────────────────────────────────────────── */
function initNewsletterForms() {
  $$('.newsletter-form, .footer-newsletter').forEach(form => {
    const btn = form.querySelector('button');
    const input = form.querySelector('input[type="email"]');
    if (!btn || !input) return;
    btn.addEventListener('click', e => {
      e.preventDefault();
      if (!input.value || !input.value.includes('@')) {
        input.focus();
        return;
      }
      showToast('Subscribed! Welcome to The Atelier community.', '🎉');
      input.value = '';
    });
  });
}

/* ── Smooth Animate-in on Scroll ──────────────────────────────── */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;
  const targets = $$('[data-reveal]');
  if (!targets.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  targets.forEach(el => obs.observe(el));
}

/* ── Counter Animation ────────────────────────────────────────── */
function animateCounters() {
  const counters = $$('[data-count]');
  if (!counters.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const isFloat = String(target).includes('.');
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();
      const update = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        const val = target * ease;
        el.textContent = (isFloat ? val.toFixed(1) : Math.round(val)) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => obs.observe(el));
}

/* ── Menu Tabs (Services page / Café menu) ────────────────────── */
function initMenuTabs() {
  const tabs = $$('.menu-tab');
  if (!tabs.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const group = tab.dataset.group;
      $$('.menu-tab').forEach(t => t.classList.toggle('active', t.dataset.group === group));
      $$('.menu-section[data-group]').forEach(sec => {
        sec.style.display = sec.dataset.group === group ? '' : 'none';
      });
    });
  });
  // Show first
  const firstTab = tabs[0];
  if (firstTab) firstTab.click();
}

/* ── Amenity Category Filter ──────────────────────────────────── */
function initAmenityFilter() {
  const btns = $$('.amenity-filter-btn');
  const cards = $$('.amenity-showcase-card');
  if (!btns.length || !cards.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.cat === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.transition = 'all 0.35s ease';
            card.style.opacity = '1';
            card.style.transform = 'none';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ── Cart / Day-Pass Quick Add ────────────────────────────────── */
function initQuickAdd() {
  $$('[data-add-cart]').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.addCart;
      showToast(`${name} added to your cart!`, '🛒');
    });
  });
}

/* ── Image Fallback ───────────────────────────────────────────── */
function initImgFallback() {
  const fallbacks = {
    'coffee': 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    'lounge': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
    'hotdesk': 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=900&q=80',
    'dedicated': 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=900&q=80',
    'studio': 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80',
    'study': 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=900&q=80',
    'conf': 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=900&q=80',
    'avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'team': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    'default': 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
  };
  $$('img').forEach(img => {
    img.addEventListener('error', function onErr() {
      img.removeEventListener('error', onErr);
      const src = (img.getAttribute('src') || '').toLowerCase();
      const matchKey = Object.keys(fallbacks).find(k => k !== 'default' && src.includes(k));
      img.src = matchKey ? fallbacks[matchKey] : fallbacks.default;
    });
  });
}

/* ── Dashboard Nav Dropdown ───────────────────────────────────── */
function initDashboardNavDropdown() {
  // Progressive enhancement: auto-upgrade desktop #nav-dashboard if static markup is simple link
  const desktopDashboardLink = $('#nav-dashboard:not(.nav-dropdown-toggle)');
  if (desktopDashboardLink && !desktopDashboardLink.closest('.nav-item-dropdown')) {
    const parentLi = desktopDashboardLink.parentElement;
    if (parentLi) {
      parentLi.className = 'nav-item-dropdown';
      parentLi.id = 'navDashboardDropdown';
      parentLi.innerHTML = `
        <a href="user-dashboard.html" class="nav-link nav-dropdown-toggle" id="nav-dashboard" aria-haspopup="true" aria-expanded="false">
          <span>Dashboard</span>
          <svg class="nav-dropdown-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </a>
        <div class="nav-dropdown-menu" id="dashboardDropdownMenu" role="menu" aria-label="Dashboard options">
          <a href="admin-dashboard.html" class="nav-dropdown-item" role="menuitem">
            <span class="nav-dropdown-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="9" rx="1"></rect>
                <rect x="14" y="3" width="7" height="5" rx="1"></rect>
                <rect x="14" y="12" width="7" height="9" rx="1"></rect>
                <rect x="3" y="16" width="7" height="5" rx="1"></rect>
              </svg>
            </span>
            <div class="nav-dropdown-text">
              <span class="nav-dropdown-title">Admin Dashboard</span>
              <span class="nav-dropdown-sub">Management &amp; occupancy</span>
            </div>
          </a>
          <a href="user-dashboard.html" class="nav-dropdown-item" role="menuitem">
            <span class="nav-dropdown-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </span>
            <div class="nav-dropdown-text">
              <span class="nav-dropdown-title">User Dashboard</span>
              <span class="nav-dropdown-sub">Bookings &amp; membership</span>
            </div>
          </a>
        </div>
      `;
    }
  }

  // Progressive enhancement: auto-upgrade mobile #mobile-nav-dashboard if static markup is simple link
  const mobileDashboardLink = $('#mobile-nav-dashboard:not(.mobile-nav-dropdown-toggle)');
  if (mobileDashboardLink && !mobileDashboardLink.closest('.mobile-nav-item-dropdown')) {
    const parentLi = mobileDashboardLink.parentElement;
    if (parentLi) {
      parentLi.className = 'mobile-nav-item-dropdown';
      parentLi.innerHTML = `
        <button class="mobile-nav-link mobile-nav-dropdown-toggle" id="mobile-nav-dashboard" type="button" aria-haspopup="true" aria-expanded="false">
          <span>Dashboard</span>
          <svg class="mobile-dropdown-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <div class="mobile-nav-submenu" id="mobileDashboardSubmenu">
          <a href="admin-dashboard.html" class="mobile-nav-sublink">
            <span class="mobile-sublink-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="9" rx="1"></rect>
                <rect x="14" y="3" width="7" height="5" rx="1"></rect>
                <rect x="14" y="12" width="7" height="9" rx="1"></rect>
                <rect x="3" y="16" width="7" height="5" rx="1"></rect>
              </svg>
            </span>
            <span>Admin Dashboard</span>
          </a>
          <a href="user-dashboard.html" class="mobile-nav-sublink">
            <span class="mobile-sublink-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </span>
            <span>User Dashboard</span>
          </a>
        </div>
      `;
    }
  }

  const dropdownWraps = $$('.nav-item-dropdown');

  dropdownWraps.forEach(wrap => {
    const toggle = wrap.querySelector('.nav-dropdown-toggle');
    const menu = wrap.querySelector('.nav-dropdown-menu');
    if (!toggle || !menu) return;

    function openDropdown() {
      // Close other dropdowns
      $$('.nav-item-dropdown.open').forEach(w => {
        if (w !== wrap) {
          w.classList.remove('open');
          w.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
        }
      });
      $$('.user-account-dropdown-wrap.open').forEach(w => {
        w.classList.remove('open');
        w.querySelector('.user-account-btn')?.setAttribute('aria-expanded', 'false');
      });
      wrap.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
    }

    function closeDropdown() {
      wrap.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    function toggleDropdown(e) {
      e.preventDefault();
      e.stopPropagation();
      wrap.classList.contains('open') ? closeDropdown() : openDropdown();
    }

    toggle.addEventListener('click', toggleDropdown);

    // Desktop hover support
    wrap.addEventListener('mouseenter', () => {
      if (window.innerWidth > 992) {
        openDropdown();
      }
    });

    wrap.addEventListener('mouseleave', () => {
      if (window.innerWidth > 992) {
        closeDropdown();
      }
    });

    menu.querySelectorAll('.nav-dropdown-item').forEach(item => {
      item.addEventListener('click', closeDropdown);
    });
  });

  // Mobile drawer submenu
  const mobileDropdowns = $$('.mobile-nav-item-dropdown');
  mobileDropdowns.forEach(wrap => {
    const toggle = wrap.querySelector('.mobile-nav-dropdown-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = wrap.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', e => {
    dropdownWraps.forEach(wrap => {
      if (!wrap.contains(e.target)) {
        wrap.classList.remove('open');
        wrap.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      dropdownWraps.forEach(wrap => {
        wrap.classList.remove('open');
        wrap.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

/* ── User Account Dropdown ────────────────────────────────────── */
function initAccountDropdown() {
  const wraps = $$('.user-account-dropdown-wrap');
  if (!wraps.length) return;

  wraps.forEach(wrap => {
    const btn  = wrap.querySelector('.user-account-btn');
    const menu = wrap.querySelector('.account-dropdown-menu');
    if (!btn || !menu) return;

    function openDropdown() {
      // Close nav dropdown if open
      $$('.nav-item-dropdown.open').forEach(w => {
        w.classList.remove('open');
        w.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
      });
      wrap.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }

    function closeDropdown() {
      wrap.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }

    function toggleDropdown(e) {
      e.stopPropagation();
      wrap.classList.contains('open') ? closeDropdown() : openDropdown();
    }

    btn.addEventListener('click', toggleDropdown);

    // Close when clicking a menu item
    $$('.account-dropdown-item', menu).forEach(item => {
      item.addEventListener('click', closeDropdown);
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!wrap.contains(e.target)) closeDropdown();
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeDropdown();
    });
  });
}

/* ── Init All ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initStickyHeader();
  initActiveNav();
  initMobileDrawer();
  initDashboardNavDropdown();
  initAccountDropdown();
  initBookingModal();
  initAccordions();
  initPricingSwitcher();
  initBlogFilter();
  initBlogSearch();
  initContactForm();
  initNewsletterForms();
  initScrollReveal();
  animateCounters();
  initMenuTabs();
  initAmenityFilter();
  initQuickAdd();
  initImgFallback();

  // Theme & RTL toggles
  $$('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });
  initRtl();

  // Reveal styles
  const style = document.createElement('style');
  style.textContent = `
    [data-reveal] {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1),
                  transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
    }
    [data-reveal].revealed {
      opacity: 1;
      transform: none;
    }
    [data-reveal][data-delay="1"] { transition-delay: 0.1s; }
    [data-reveal][data-delay="2"] { transition-delay: 0.2s; }
    [data-reveal][data-delay="3"] { transition-delay: 0.3s; }
    [data-reveal][data-delay="4"] { transition-delay: 0.4s; }
    [data-reveal][data-delay="5"] { transition-delay: 0.5s; }
  `;
  document.head.appendChild(style);
});

