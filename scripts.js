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

function closeMenu() {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', false);
  document.body.style.overflow = '';
}

// Close on scroll
window.addEventListener('scroll', () => {
  if (mobileMenu.classList.contains('open')) closeMenu();
});
// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) setTimeout(() => entry.target.classList.add('visible'), i * 80);
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

function handleContactSubmit() {
  alert("Thank you! We'll be in touch within 24 hours. 🌊");
}