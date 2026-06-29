const header = document.querySelector('[data-header]');
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('[data-nav-links]');
const mobileCta = document.querySelector('[data-mobile-cta]');
const year = document.getElementById('year');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ANALYTICS_DOMAIN = ''; // e.g. 'meridianconsulting.co.za' for Plausible

if (year) year.textContent = new Date().getFullYear();

function updateHeader() {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 20);
}
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

function closeNav() {
  if (!navLinks || !toggle) return;
  navLinks.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
}

if (toggle && navLinks) {
  toggle.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = navLinks.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('click', (event) => {
    if (!navLinks.classList.contains('is-open')) return;
    if (navLinks.contains(event.target) || toggle.contains(event.target)) return;
    closeNav();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNav();
  });
}

const sectionIds = ['top', 'expertise', 'services', 'proof', 'approach', 'about', 'contact'];
const navSectionLinks = document.querySelectorAll('[data-nav-section]');

function setActiveNav(sectionId) {
  navSectionLinks.forEach((link) => {
    const isActive = link.dataset.navSection === sectionId;
    link.classList.toggle('is-active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

if (navSectionLinks.length) {
  const navObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setActiveNav(visible.target.id);
  }, { rootMargin: '-40% 0px -45% 0px', threshold: [0.1, 0.35, 0.6] });

  sectionIds.forEach((id) => {
    const section = document.getElementById(id);
    if (section) navObserver.observe(section);
  });
}

const revealElements = document.querySelectorAll('.reveal');
if (prefersReducedMotion) {
  revealElements.forEach((el) => el.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  revealElements.forEach((el) => observer.observe(el));
}

if (mobileCta) {
  const hero = document.getElementById('top');
  const showMobileCta = () => {
    const pastHero = hero ? window.scrollY > hero.offsetHeight * 0.55 : window.scrollY > 500;
    const isMobile = window.matchMedia('(max-width: 900px)').matches;
    const shouldShow = pastHero && isMobile;
    mobileCta.hidden = !shouldShow;
    mobileCta.classList.toggle('is-visible', shouldShow);
    document.body.classList.toggle('has-mobile-cta', shouldShow);
  };
  showMobileCta();
  window.addEventListener('scroll', showMobileCta, { passive: true });
  window.addEventListener('resize', showMobileCta);
}

function trackEvent(name) {
  if (typeof window.plausible === 'function') {
    window.plausible(name);
  }
}

document.querySelectorAll('[data-track]').forEach((el) => {
  el.addEventListener('click', () => trackEvent(el.dataset.track));
});

if (ANALYTICS_DOMAIN) {
  const script = document.createElement('script');
  script.defer = true;
  script.dataset.domain = ANALYTICS_DOMAIN;
  script.src = 'https://plausible.io/js/script.js';
  document.head.appendChild(script);
}

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    const { hostname, protocol } = window.location;
    const isLocal = protocol === 'file:' || hostname === 'localhost' || hostname === '127.0.0.1';
    if (!isLocal) return;

    event.preventDefault();
    const data = new FormData(contactForm);
    const subject = encodeURIComponent(`Website enquiry - ${data.get('matter') || 'General'}`);
    const body = encodeURIComponent(
      `Name: ${data.get('name')}\nEmail: ${data.get('email')}\nMatter: ${data.get('matter')}\n\n${data.get('message')}`
    );
    window.location.href = `mailto:info@meridianconsulting.co.za?subject=${subject}&body=${body}`;
  });
}

(function loadChatbot() {
  if (document.querySelector('script[data-chatbot]')) return;
  const script = document.createElement('script');
  script.src = 'chatbot.js';
  script.defer = true;
  script.dataset.chatbot = '';
  document.body.appendChild(script);
})();
