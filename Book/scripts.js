// ── Cursor ──
const cursor = document.querySelector('.cursor');
const cursorRing = document.querySelector('.cursor-ring');
const touchQuery = window.matchMedia('(hover: none) and (pointer: coarse)');

if (!cursor || !cursorRing) {
  console.log('Cursor elements not found');
}

const INTERACTIVE_SELECTOR = 'a, button, .extra-item, .switcher-tab';
const DEFAULT_CURSOR_SIZE = '12px';
const HOVER_CURSOR_SIZE = '20px';

function isTouchMode() {
  return touchQuery.matches;
}

// Hide cursor on mobile
function disableCursor() {
  cursor.style.display = 'none';
  cursorRing.style.display = 'none';
}

// Enable cursor for desktop
function enableCursor() {
  cursor.style.display = 'block';
  cursorRing.style.display = 'block';
}

// Reset based on device
function resetCursorMode() {
  if (isTouchMode()) {
    disableCursor();
  } else {
    enableCursor();
  }
}

// Desktop mouse movement
document.addEventListener('mousemove', e => {
  if (isTouchMode()) return;

  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;

  cursorRing.style.left = `${e.clientX}px`;
  cursorRing.style.top = `${e.clientY}px`;
});

// Hover effects
document.querySelectorAll(INTERACTIVE_SELECTOR).forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (isTouchMode()) return;
    cursor.style.width = HOVER_CURSOR_SIZE;
    cursor.style.height = HOVER_CURSOR_SIZE;
  });

  el.addEventListener('mouseleave', () => {
    if (isTouchMode()) return;
    cursor.style.width = DEFAULT_CURSOR_SIZE;
    cursor.style.height = DEFAULT_CURSOR_SIZE;
  });
});

// React to device changes (DevTools toggle, resize)
touchQuery.addEventListener('change', resetCursorMode);
window.addEventListener('resize', resetCursorMode);

// Initial setup
resetCursorMode();
// Navbar
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 80);
  document.getElementById('scrollTop').classList.toggle('visible', window.scrollY > 400);
});
// Hamburger menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// ── Tour Data ──
const TOURS = {
  'island-complete': {
    name: 'The Island Complete',
    price: 89,
    duration: '8 Hours',
    tag: '⭐ Most Popular',
    desc: "The ultimate full-day Bermuda experience. From St. George's UNESCO World Heritage Site to the crystal blue waters of Horseshoe Bay — stories only locals can tell.",
    img: '../Assets/dockyard-s-cruise-port.jpg',
    meta: ['🕐 8 Hours', '👥 Max 12', '🗺️ Island-Wide', '🥃 Refreshments'],
    includes: ['Hotel pickup & dropoff', 'Certified local guide', 'Rum swizzle & snacks', 'All entrance fees']
  },
  'pink-sands': {
    name: 'Pink Sands & Crystal Caves',
    price: 59,
    duration: '4 Hours',
    tag: '🏖️ Beaches',
    desc: "A half-day journey to Bermuda's most famous pink-sand beaches and the breathtaking Crystal Caves.",
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80',
    meta: ['🕐 4 Hours', '👥 Max 12', '🏖️ Beaches & Caves'],
    includes: ['Hotel pickup & dropoff', 'Certified local guide', 'Cave entrance included', 'Refreshment stop']
  },
  'heritage': {
    name: 'Heritage & History',
    price: 55,
    duration: '5 Hours',
    tag: '🏛️ History',
    desc: "Colonial fortresses, the oldest town in the Western Hemisphere, and centuries of fascinating maritime history.",
    img: '../Assets/heritage.jpg',
    meta: ['🕐 5 Hours', '👥 Max 12', '🏛️ Historic Sites'],
    includes: ['Hotel pickup & dropoff', 'Historian guide', 'Fort entrance fees', 'Old Town walking map']
  },
  'sunset': {
    name: 'Sunset Dockyard Experience',
    price: 65,
    duration: '4 Hours',
    tag: '🌅 Evening',
    desc: "Watch the sun sink into the Atlantic from the Royal Naval Dockyard, with artisan shopping and dinner recommendations.",
    img: '../Assets/sunsetdockyard.png',
    meta: ['🕐 4 Hours', '👥 Max 12', '🌅 Evening Tour'],
    includes: ['Hotel pickup & dropoff', 'Local guide', 'Sunset viewing spot', 'Artisan market time']
  }
};

// ── State ──
let currentTour = 'island-complete';
let guests = 2;
let currentStep = 1;
let selectedExtras = {}; // { extraKey: { name, pricePerPerson } }

// ── Init ──
function init() {
  const params = new URLSearchParams(window.location.search);
  const tourParam = params.get('tour');
  currentTour = TOURS[tourParam] ? tourParam : 'island-complete';
  renderTour();
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('tourDate').min = today;
  document.getElementById('tourDate').value = today;
  updateSummary();
}
// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Animate total number when it updates
function animateTotal(newVal) {
  const el = document.getElementById('osTotalNum');
  el.style.opacity = '0';
  setTimeout(() => {
    el.textContent = newVal;
    el.style.opacity = '1';
  }, 150);
}
function renderTour() {
  const t = TOURS[currentTour];
  document.title = `Book ${t.name} — Sanssouci Tours`;
  document.getElementById('previewImg').src = t.img;
  document.getElementById('previewImg').alt = t.name;
  document.getElementById('previewTag').textContent = t.tag;
  document.getElementById('previewName').textContent = t.name;
  document.getElementById('previewDesc').textContent = t.desc;
  document.getElementById('previewMeta').innerHTML = t.meta.map(m => `<span class="tp-meta-item">${m}</span>`).join('');
  document.getElementById('previewIncludes').innerHTML = t.includes.map(i => `<div class="tp-include">${i}</div>`).join('');
  document.getElementById('osTourName').textContent = t.name;
  document.getElementById('osDuration').textContent = t.duration;
  document.querySelectorAll('.switcher-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tour === currentTour);
  });
  updateSummary();
}

function switchTour(tourKey) {
  currentTour = tourKey;
  selectedExtras = {};
  document.querySelectorAll('.extra-item').forEach(el => el.classList.remove('selected'));
  renderTour();
}

// ── Guests ──
function changeGuests(delta) {
  guests = Math.max(1, Math.min(12, guests + delta));
  document.getElementById('guestCount').textContent = guests;
  updateSummary();
}

// ── Extras ──
function toggleExtra(el, name, pricePerPerson) {
  const key = el.dataset.extra;
  el.classList.toggle('selected');
  if (el.classList.contains('selected')) {
    selectedExtras[key] = { name, pricePerPerson };
  } else {
    delete selectedExtras[key];
  }
  updateSummary();
}

// ── Summary calc ──
function updateSummary() {
  const t = TOURS[currentTour];
  const baseTotal = t.price * guests;
  let extrasTotal = 0;
  let extrasHTML = '';
  for (const key in selectedExtras) {
    const ex = selectedExtras[key];
    const exTotal = ex.pricePerPerson * guests;
    extrasTotal += exTotal;
    extrasHTML += `<div class="os-row"><span class="os-row-label">${ex.name}</span><span class="os-row-val">$${exTotal}</span></div>`;
  }
  const grandTotal = baseTotal + extrasTotal;

  document.getElementById('osBaseLabel').textContent = `${guests} × $${t.price}`;
  document.getElementById('osBaseTotal').textContent = `$${baseTotal}`;
  document.getElementById('osExtrasRows').innerHTML = extrasHTML;
        animateTotal(grandTotal);
  document.getElementById('osGuests').textContent = guests + (guests === 1 ? ' guest' : ' guests');
  document.getElementById('finalTotal').textContent = '$' + grandTotal;

  // Date
  const dateVal = document.getElementById('tourDate')?.value;
  if (dateVal) {
    const d = new Date(dateVal + 'T12:00:00');
    document.getElementById('osDate').textContent = d.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' });
  }
  // Time
  const timeEl = document.getElementById('tourTime');
  if (timeEl) document.getElementById('osTime').textContent = timeEl.options[timeEl.selectedIndex]?.text || '—';
  // Pickup
  const pickup = document.getElementById('pickupInput')?.value.trim();
  document.getElementById('osPickup').textContent = pickup || '—';
}

// Pickup live update
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('pickupInput').addEventListener('input', updateSummary);
});

// ── Step navigation ──
function goToStep(n) {
  // Validate
  if (n > 1 && currentStep === 1) {
    const first = document.getElementById('firstName').value.trim();
    const email = document.getElementById('emailInput').value.trim();
    const pickup = document.getElementById('pickupInput').value.trim();
    if (!first) { shake('firstName'); return; }
    if (!email || !email.includes('@')) { shake('emailInput'); return; }
    if (!pickup) { shake('pickupInput'); return; }
  }

  document.getElementById('step' + currentStep).classList.remove('active');
  currentStep = n;
  document.getElementById('step' + currentStep).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update step indicators
  for (let i = 1; i <= 4; i++) {
    const ind = document.getElementById('stepIndicator' + i);
    ind.classList.remove('active', 'done');
    if (i < n) ind.classList.add('done');
    else if (i === n) ind.classList.add('active');
  }
  updateSummary();
}

function shake(id) {
  const el = document.getElementById(id);
  el.classList.add('error');
  el.style.animation = 'none';
  setTimeout(() => { el.style.animation = ''; }, 10);
  el.focus();
  setTimeout(() => el.classList.remove('error'), 2000);
}

// ── Card formatting ──
function formatCard(el) {
  let v = el.value.replace(/\D/g,'').substring(0,16);
  el.value = v.replace(/(.{4})/g,'$1  ').trim();
  const label = document.getElementById('cardTypeLabel');
  if (v.startsWith('4')) label.textContent = 'VISA';
  else if (v.startsWith('5')) label.textContent = 'MC';
  else if (v.startsWith('3')) label.textContent = 'AMEX';
  else label.textContent = '';
}
function formatExpiry(el) {
  let v = el.value.replace(/\D/g,'').substring(0,4);
  if (v.length > 2) v = v.substring(0,2) + ' / ' + v.substring(2);
  el.value = v;
}

// ── Payment ──
function handlePayment() {
  const name = document.getElementById('cardName').value.trim();
  const num = document.getElementById('cardNum').value.replace(/\s/g,'');
  const exp = document.getElementById('cardExpiry').value;
  const cvv = document.getElementById('cardCvv').value;
  if (!name) { shake('cardName'); return; }
  if (num.length < 13) { shake('cardNum'); return; }
  if (exp.length < 7) { shake('cardExpiry'); return; }
  if (cvv.length < 3) { shake('cardCvv'); return; }

  // Generate confirmation
  const ref = 'SST-' + Math.random().toString(36).substring(2,7).toUpperCase();
  const t = TOURS[currentTour];
  const dateEl = document.getElementById('tourDate');
  const timeEl = document.getElementById('tourTime');
  const dateStr = dateEl.value ? new Date(dateEl.value + 'T12:00:00').toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' }) : 'Date TBC';
  const timeStr = timeEl.options[timeEl.selectedIndex]?.text || '—';
  const gTotal = parseInt(document.getElementById('osTotalNum').textContent);

  document.getElementById('successRef').textContent = 'Booking ' + ref;
  document.getElementById('successDetails').innerHTML = `
    <div class="success-detail-row"><span class="success-detail-label">Tour</span><span class="success-detail-val">${t.name}</span></div>
    <div class="success-detail-row"><span class="success-detail-label">Date</span><span class="success-detail-val">${dateStr}</span></div>
    <div class="success-detail-row"><span class="success-detail-label">Time</span><span class="success-detail-val">${timeStr}</span></div>
    <div class="success-detail-row"><span class="success-detail-label">Guests</span><span class="success-detail-val">${guests}</span></div>
    <div class="success-detail-row"><span class="success-detail-label">Total Paid</span><span class="success-detail-val" style="color:var(--ocean)">$${gTotal}</span></div>
  `;

  document.getElementById('bookingUI').style.display = 'none';
  document.getElementById('successPage').classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

init();