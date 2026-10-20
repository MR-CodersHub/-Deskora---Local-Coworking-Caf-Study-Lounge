/**
 * The Atelier — Unified Dashboard Logic & LocalStorage Store
 * Powers Member User Dashboard & Operations Admin Dashboard
 * Vanilla JavaScript · Zero Dependencies
 */

/* ── Initial Seed Data Generator ────────────────────────────────── */
const DEFAULT_PROFILE = {
  name: 'Maya Krishnan',
  email: 'maya@theatelier.space',
  phone: '+91 98765 43210',
  bio: 'Independent AI Researcher & Product Designer',
  role: 'Dedicated Desk Member',
  plan: 'Dedicated Desk Tier',
  keycard: 'ATL-RFID-8821 (Active)',
  podHoursRemaining: 28,
  podHoursTotal: 40,
  printPagesRemaining: 358,
  printPagesTotal: 500,
  cafeCredit: 1450,
  renewDate: '01 Nov 2026',
  joinDate: '01 Sep 2026'
};

const DEFAULT_BOOKINGS = [
  { id: 'ATL-8921', member: 'Maya Krishnan', email: 'maya@theatelier.space', space: 'Silent Study Pod #04', deskId: 'POD-04', date: 'Tomorrow (Oct 2, 2026)', time: '09:00 AM – 12:00 PM', hours: 3, price: '₹637', status: 'Confirmed', upcoming: true },
  { id: 'ATL-8910', member: 'Maya Krishnan', email: 'maya@theatelier.space', space: 'Hot Desk Café Zone #12', deskId: 'DESK-12', date: 'Oct 5, 2026', time: '02:00 PM – 06:00 PM', hours: 4, price: '₹510', status: 'Confirmed', upcoming: true },
  { id: 'ATL-8922', member: 'Rahul Verma', email: 'rahul@matrixlabs.in', space: 'Standing Desk Oasis #02', deskId: 'STAND-02', date: 'Today (Oct 1, 2026)', time: '10:00 AM – 02:00 PM', hours: 4, price: '₹720', status: 'Checked In', upcoming: true },
  { id: 'ATL-8923', member: 'Sarah Jenkins', email: 'sarah@globalnomad.io', space: '4-Person Discussion Pod #01', deskId: 'CONF-01', date: 'Today (Oct 1, 2026)', time: '03:00 PM – 05:00 PM', hours: 2, price: '₹1,500', status: 'Confirmed', upcoming: true },
  { id: 'ATL-8420', member: 'Maya Krishnan', email: 'maya@theatelier.space', space: 'Standing Desk Oasis #01', deskId: 'STAND-01', date: '26 Sep 2026', time: '10:00 AM – 02:00 PM', hours: 4, price: '₹612', status: 'Completed', upcoming: false },
  { id: 'ATL-8109', member: 'Maya Krishnan', email: 'maya@theatelier.space', space: 'Silent Study Pod #01', deskId: 'POD-01', date: '15 Sep 2026', time: '11:00 AM – 01:00 PM', hours: 2, price: '₹425', status: 'Completed', upcoming: false }
];

const DEFAULT_INVENTORY = [
  { id: 'POD-01', name: 'Silent Study Pod #01', zone: 'pod', capacity: 1, rate: 250, status: 'Available', amenities: '4K Display · Acoustic Isolators · USB-C Hub' },
  { id: 'POD-02', name: 'Silent Study Pod #02', zone: 'pod', capacity: 1, rate: 250, status: 'Occupied', amenities: '4K Display · Acoustic Isolators · Dual Outlet' },
  { id: 'POD-03', name: 'Silent Study Pod #03', zone: 'pod', capacity: 1, rate: 250, status: 'Available', amenities: '4K Display · Mechanical Keyboard · Ergo Mesh' },
  { id: 'POD-04', name: 'Silent Study Pod #04', zone: 'pod', capacity: 1, rate: 250, status: 'Available', amenities: '4K Display · Studio Microphone · Focus Light' },
  { id: 'DESK-10', name: 'Hot Desk Café Zone #10', zone: 'cafe', capacity: 1, rate: 150, status: 'Available', amenities: 'Espresso Bar Proximity · Natural Skylight' },
  { id: 'DESK-11', name: 'Hot Desk Café Zone #11', zone: 'cafe', capacity: 1, rate: 150, status: 'Occupied', amenities: 'Power Hub · Oak Surface · High Stool' },
  { id: 'DESK-12', name: 'Hot Desk Café Zone #12', zone: 'cafe', capacity: 1, rate: 150, status: 'Available', amenities: 'Power Hub · Herman Miller Chair' },
  { id: 'STAND-01', name: 'Standing Desk Oasis #01', zone: 'standing', capacity: 1, rate: 180, status: 'Available', amenities: 'Motorized Height Adjust · Anti-fatigue Mat' },
  { id: 'STAND-02', name: 'Standing Desk Oasis #02', zone: 'standing', capacity: 1, rate: 180, status: 'Occupied', amenities: 'Motorized Height Adjust · Dual 27" Displays' },
  { id: 'STAND-03', name: 'Standing Desk Oasis #03', zone: 'standing', capacity: 1, rate: 180, status: 'Available', amenities: 'Motorized Height Adjust · Ambient Light Bar' },
  { id: 'CONF-01', name: 'Discussion Pod Suite A', zone: 'meeting', capacity: 4, rate: 750, status: 'Available', amenities: '55" 4K Smart Display · Conference Cam' },
  { id: 'BOOTH-01', name: 'Acoustic Phone Booth #01', zone: 'booth', capacity: 1, rate: 120, status: 'Available', amenities: 'Soundproof Glass · Ring Light · Charging Pad' }
];

const DEFAULT_PASSES = [
  { id: 'PASS-501', title: '5-Day Flex Pass Bundle', purchased: '18 Sep 2026', validUntil: '18 Dec 2026', totalUses: 5, remaining: 3, status: 'Active' },
  { id: 'PASS-480', title: 'Weekend Focus Pass', purchased: '20 Sep 2026', validUntil: '21 Sep 2026', totalUses: 2, remaining: 0, status: 'Used' },
  { id: 'PASS-312', title: 'Single Day Pass', purchased: '10 Aug 2026', validUntil: '10 Aug 2026', totalUses: 1, remaining: 0, status: 'Used' }
];

const DEFAULT_PAYMENTS = [
  { id: 'TXN-94021', date: '28 Sep 2026', desc: 'Dedicated Desk Monthly Membership', method: 'Visa •••• 4242', amount: '₹2,499.00', status: 'Paid' },
  { id: 'TXN-91840', date: '18 Sep 2026', desc: '5-Day Flex Pass Bundle', method: 'UPI / GPay', amount: '₹1,299.00', status: 'Paid' },
  { id: 'TXN-88102', date: '02 Sep 2026', desc: 'Café Member Wallet Top-up', method: 'Apple Pay', amount: '₹1,500.00', status: 'Paid' },
  { id: 'TXN-84091', date: '28 Aug 2026', desc: 'Dedicated Desk Monthly Membership', method: 'Visa •••• 4242', amount: '₹2,499.00', status: 'Paid' }
];

const DEFAULT_MEMBERS = [
  { id: 'MEM-101', name: 'Maya Krishnan', email: 'maya@theatelier.space', phone: '+91 98765 43210', plan: 'Dedicated Desk', joined: '01 Sep 2026', keycard: 'Active', status: 'Active' },
  { id: 'MEM-102', name: 'Rahul Verma', email: 'rahul@matrixlabs.in', phone: '+91 98111 22334', plan: 'Private Studio Suite', joined: '15 Jul 2026', keycard: 'Active', status: 'Active' },
  { id: 'MEM-103', name: 'Sarah Jenkins', email: 'sarah@globalnomad.io', phone: '+1 415 555 2671', plan: 'Flex Roaming', joined: '10 Aug 2026', keycard: 'Active', status: 'Active' },
  { id: 'MEM-104', name: 'Arjun Nambiar', email: 'arjun@quantumgrowth.co', phone: '+91 99002 88471', plan: 'Dedicated Desk', joined: '01 Jun 2026', keycard: 'Active', status: 'Active' },
  { id: 'MEM-105', name: 'Devika Sengupta', email: 'devika.design@gmail.com', phone: '+91 97410 55192', plan: 'Student Focus', joined: '20 Sep 2026', keycard: 'Active', status: 'Active' },
  { id: 'MEM-106', name: 'Marcus Vance', email: 'marcus@hyperdrive.ai', phone: '+44 7911 123456', plan: 'Flex Roaming', joined: '05 Sep 2026', keycard: 'Suspended', status: 'Paused' }
];

const DEFAULT_ENQUIRIES = [
  { id: 'TKT-1082', name: 'Sarah Jenkins', email: 'sarah@globalnomad.io', category: 'Wi-Fi & Tech', subject: 'Connecting 5GHz Wi-Fi to Apple TV in Discussion Pod', priority: 'Normal', date: 'Yesterday', status: 'Open', message: 'Hello! I am hosting a design critique tomorrow and need help pairing the display wireless stream.' },
  { id: 'TKT-1079', name: 'Marcus Vance', email: 'marcus@hyperdrive.ai', category: 'Billing & Invoices', subject: 'Requesting GST Tax Invoice for Annual Plan', priority: 'High', date: '28 Sep 2026', status: 'In Progress', message: 'Please provide corporate GST invoice for our Singapore entity reconciliation.' },
  { id: 'TKT-1075', name: 'Devika Sengupta', email: 'devika.design@gmail.com', category: 'Keycard & Access', subject: 'Keycard RFID not reading on rear bike storage gate', priority: 'Normal', date: '25 Sep 2026', status: 'Resolved', message: 'Keycard works on main entrance but not the bicycle gate. Thanks!' }
];

const DEFAULT_CAFE_ITEMS = [
  { id: 'CAF-01', name: 'Cold Brew Nitro Reserve', cat: 'Coffee', price: '₹220', tag: 'Signature', status: 'In Stock' },
  { id: 'CAF-02', name: 'Pour Over — Ethiopia Yirgacheffe', cat: 'Coffee', price: '₹240', tag: 'Single Origin', status: 'In Stock' },
  { id: 'CAF-03', name: 'Oat Milk Flat White', cat: 'Coffee', price: '₹190', tag: 'Dairy-Free', status: 'In Stock' },
  { id: 'CAF-04', name: 'Japanese Ceremonial Matcha Latte', cat: 'Tea', price: '₹260', tag: 'Organic', status: 'In Stock' },
  { id: 'CAF-05', name: 'Almond Frangipane Croissant', cat: 'Bakery', price: '₹180', tag: 'Fresh Baked', status: 'Low Stock' },
  { id: 'CAF-06', name: 'Avocado Tartine with Microgreens', cat: 'Meals', price: '₹290', tag: 'Vegan', status: 'In Stock' },
  { id: 'CAF-07', name: 'Truffle Mushroom Sourdough Toastie', cat: 'Meals', price: '₹340', tag: 'Gourmet', status: 'In Stock' },
  { id: 'CAF-08', name: 'Valrhona Dark Chocolate Babka', cat: 'Bakery', price: '₹210', tag: 'Artisan', status: 'Sold Out' }
];

/* ── Data Store Helper ──────────────────────────────────────────── */
const AtelierStore = {
  get(key, fallback) {
    try {
      const data = localStorage.getItem('atelier_' + key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem('atelier_' + key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  },
  init() {
    if (!localStorage.getItem('atelier_user_profile')) this.set('user_profile', DEFAULT_PROFILE);
    if (!localStorage.getItem('atelier_bookings')) this.set('bookings', DEFAULT_BOOKINGS);
    if (!localStorage.getItem('atelier_inventory')) this.set('inventory', DEFAULT_INVENTORY);
    if (!localStorage.getItem('atelier_passes')) this.set('passes', DEFAULT_PASSES);
    if (!localStorage.getItem('atelier_payments')) this.set('payments', DEFAULT_PAYMENTS);
    if (!localStorage.getItem('atelier_members')) this.set('members', DEFAULT_MEMBERS);
    if (!localStorage.getItem('atelier_enquiries')) this.set('enquiries', DEFAULT_ENQUIRIES);
    if (!localStorage.getItem('atelier_cafe_menu')) this.set('cafe_menu', DEFAULT_CAFE_ITEMS);
  }
};

AtelierStore.init();

/* ── Generic Helpers ────────────────────────────────────────────── */
function showToast(msg, icon = '✓') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span style="font-size:1.1rem;display:inline-block">${icon}</span> <span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'all .3s';
    setTimeout(() => toast.remove(), 320);
  }, 2800);
}

/* ── Section Switcher ───────────────────────────────────────────── */
function initSectionSwitcher() {
  const navItems = document.querySelectorAll('.dash-nav-item[data-section]');
  const sections = document.querySelectorAll('.dash-section');
  if (!navItems.length) return;

  function switchSection(targetId) {
    navItems.forEach(item => {
      const match = item.dataset.section === targetId;
      item.classList.toggle('active', match);
      if (match) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    });

    sections.forEach(sec => {
      sec.classList.toggle('active', sec.id === targetId);
    });

    // Close mobile sidebar if open
    document.querySelector('.dash-sidebar')?.classList.remove('sidebar-open');
    document.querySelector('.dash-sidebar-backdrop')?.classList.remove('open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      switchSection(item.dataset.section);
      if (history.pushState) {
        history.pushState(null, null, '#' + item.dataset.section);
      }
    });
  });

  // Handle direct hash navigation
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById(hash)) {
    switchSection(hash);
  }
}

/* ── Mobile Sidebar Drawer ──────────────────────────────────────── */
function initMobileSidebar() {
  const toggleBtn = document.querySelector('.dash-mobile-toggle');
  const sidebar = document.querySelector('.dash-sidebar');
  const closeBtn = document.querySelector('.dash-sidebar-close');
  let backdrop = document.querySelector('.dash-sidebar-backdrop');

  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'dash-modal-backdrop dash-sidebar-backdrop';
    document.body.appendChild(backdrop);
  }

  function openSidebar() {
    sidebar?.classList.add('sidebar-open');
    backdrop?.classList.add('open');
  }

  function closeSidebar() {
    sidebar?.classList.remove('sidebar-open');
    backdrop?.classList.remove('open');
  }

  toggleBtn?.addEventListener('click', openSidebar);
  closeBtn?.addEventListener('click', closeSidebar);
  backdrop?.addEventListener('click', closeSidebar);
}

/* ── Popovers (Notifications & Profile) ─────────────────────────── */
function initPopovers() {
  document.querySelectorAll('[data-popover-target]').forEach(btn => {
    const targetId = btn.dataset.popoverTarget;
    const popover = document.getElementById(targetId);
    if (!popover) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = popover.classList.contains('open');
      document.querySelectorAll('.dash-popover').forEach(p => p.classList.remove('open'));
      if (!isOpen) popover.classList.add('open');
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dash-popover') && !e.target.closest('[data-popover-target]')) {
      document.querySelectorAll('.dash-popover').forEach(p => p.classList.remove('open'));
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.dash-popover').forEach(p => p.classList.remove('open'));
    }
  });
}

/* ── Global Theme & RTL Synchronization ─────────────────────────── */
function initDashThemeRtl() {
  const THEME_KEY = 'atelier-theme';
  const RTL_KEY = 'atelier-dir';

  // Theme
  const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  document.querySelectorAll('.dash-theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const curr = document.documentElement.getAttribute('data-theme') || 'light';
      const next = curr === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem(THEME_KEY, next);
      showToast(next === 'dark' ? 'Dark theme enabled' : 'Light theme enabled', '◐');
    });
  });

  // RTL
  const savedRtl = localStorage.getItem(RTL_KEY) || 'ltr';
  document.documentElement.setAttribute('dir', savedRtl);

  document.querySelectorAll('.dash-rtl-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const curr = document.documentElement.getAttribute('dir') || 'ltr';
      const next = curr === 'rtl' ? 'ltr' : 'rtl';
      document.documentElement.setAttribute('dir', next);
      localStorage.setItem(RTL_KEY, next);
      showToast(next === 'rtl' ? 'Switched to RTL mode' : 'Switched to LTR mode', '⇄');
    });
  });
}

/* ── Shared Receipt Modal ───────────────────────────────────────── */
function openReceiptModal(record) {
  let modal = document.getElementById('receiptModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'dash-modal-backdrop';
    modal.id = 'receiptModal';
    modal.innerHTML = `
      <div class="dash-modal-box" style="max-width: 480px">
        <button class="dash-modal-close" onclick="closeModal('receiptModal')">✕</button>
        <div style="text-align:center;margin-bottom:20px;padding-bottom:16px;border-bottom:1px dashed var(--clr-border)">
          <div style="font-family:var(--ff-serif);font-size:1.6rem;font-weight:700">The Atelier</div>
          <div style="font-family:var(--ff-mono);font-size:0.75rem;color:var(--clr-ink-muted)">Official Tax Receipt &amp; Voucher</div>
          <div style="font-size:0.75rem;color:var(--clr-ink-muted)">12 Crescent Lane, Koramangala, Bengaluru</div>
        </div>
        <div id="receiptModalContent" style="display:flex;flex-direction:column;gap:12px;font-size:0.88rem;margin-bottom:24px"></div>
        <div style="display:flex;gap:10px">
          <button class="btn btn-primary" style="flex:1" onclick="window.print()">Print / Save PDF</button>
          <button class="btn btn-secondary" style="flex:1" onclick="closeModal('receiptModal')">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const content = document.getElementById('receiptModalContent');
  content.innerHTML = `
    <div class="summary-row"><span style="color:var(--clr-ink-muted)">Reference ID:</span> <strong>${record.id}</strong></div>
    <div class="summary-row"><span style="color:var(--clr-ink-muted)">Date / Time:</span> <span>${record.date || record.purchased || 'Recent'}</span></div>
    <div class="summary-row"><span style="color:var(--clr-ink-muted)">Description:</span> <span>${record.desc || record.space || record.title || 'Workspace Service'}</span></div>
    <div class="summary-row"><span style="color:var(--clr-ink-muted)">Payment Method:</span> <span>${record.method || 'Member Account Balance'}</span></div>
    <div class="summary-row"><span style="color:var(--clr-ink-muted)">Status:</span> <span class="badge badge-confirmed">Settled &amp; Verified</span></div>
    <div class="summary-row total"><span style="color:var(--clr-ink-muted)">Total Amount:</span> <strong>${record.price || record.amount || '₹0.00'}</strong></div>
  `;
  modal.classList.add('open');
}

function closeModal(modalId) {
  document.getElementById(modalId)?.classList.remove('open');
}

/* ── Exports for page-specific controllers ──────────────────────── */
window.AtelierStore = AtelierStore;
window.showToast = showToast;
window.openReceiptModal = openReceiptModal;
window.closeModal = closeModal;

document.addEventListener('DOMContentLoaded', () => {
  initSectionSwitcher();
  initMobileSidebar();
  initPopovers();
  initDashThemeRtl();
});
