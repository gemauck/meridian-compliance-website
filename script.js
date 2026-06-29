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
  if (window.__meridianChatReady) return;
  window.__meridianChatReady = true;

  const KNOWLEDGE = [
    { id: 'services', keywords: ['service', 'services', 'offer', 'help with', 'what do you', 'what can you', 'advisory', 'support'], reply: 'Meridian provides advisory support across:\n\n• SARS, tax and dispute strategy\n• Diesel refund compliance\n• Fuel systems and operational controls\n• Customs and excise matters\n• Data, AI and workflow improvement\n• Operational risk reviews\n\nWhich area is closest to your situation?' },
    { id: 'diesel', keywords: ['diesel', 'refund', 'eligible use', 'logbook', 'fuel claim', 'litre', 'liters'], reply: 'Diesel refund work typically covers eligible use analysis, logbooks, source documents, fuel records, site controls and claim support.\n\nThe focus is making sure the position is provable — not just theoretically correct.' },
    { id: 'sars', keywords: ['sars', 'audit', 'dispute', 'objection', 'appeal', 'assessment', 'tax dispute'], reply: 'SARS and tax dispute support includes audit response, evidence preparation, legal and factual submissions, objection and appeal strategy, and structured engagement with SARS.\n\nIf you are already in a dispute, it helps to map the evidence early.' },
    { id: 'customs', keywords: ['customs', 'excise', 'import', 'export', 'duty'], reply: 'Customs and excise advisory covers interpretation, evidence mapping, dispute strategy, response letters and preparation for scrutiny — especially where records and operational reality need to align.' },
    { id: 'mining', keywords: ['mining', 'industrial', 'site', 'fuel management', 'dispensing', 'meters', 'reconciliation'], reply: 'Mining and industrial work often involves fuel management systems, site-level controls, receiving and dispensing records, meters, asset allocation and reconciliations — the practical side of compliance.' },
    { id: 'approach', keywords: ['approach', 'how do you work', 'process', 'method', 'engage', 'engagement'], reply: 'The approach is calm and structured:\n\n1. Frame the issue (legal, tax, factual, operational, commercial)\n2. Map the evidence\n3. Build a defensible, practical strategy\n4. Improve systems, records and controls\n\nAdvisory is project-based and evidence-led.' },
    { id: 'fit', keywords: ['who', 'client', 'good fit', 'work with', 'industries', 'mining companies'], reply: 'Meridian is a good fit for mining companies, fuel-intensive businesses, industrial operators, tax and compliance teams, business owners, attorneys and consultants dealing with complex, evidence-heavy matters.' },
    { id: 'contact', keywords: ['contact', 'email', 'reach', 'call', 'speak', 'enquiry', 'inquiry', 'get in touch', 'talk to'], reply: null, action: 'contact' },
    { id: 'fees', keywords: ['fee', 'fees', 'cost', 'price', 'rate', 'quote', 'budget', 'charge'], reply: 'Fees depend on the matter — scope, urgency, evidence complexity and the level of support needed. Share a short outline of the issue and Meridian can discuss whether advisory support is appropriate.', action: 'contact' },
    { id: 'ai', keywords: ['ai', 'artificial intelligence', 'automation', 'workflow', 'data'], reply: 'Meridian also advises on practical AI adoption for documents, reports, analysis, exception identification and internal workflows — where it genuinely improves evidence management and decision support.' },
    { id: 'disclaimer', keywords: ['legal advice', 'attorney', 'lawyer', 'guarantee', 'liable'], reply: 'This chat provides general information about Meridian\'s advisory services only. It is not legal or tax advice. Substantive matters should be discussed directly so the facts can be reviewed properly.' },
  ];

  const GREETING = 'Hello — I can help you understand how Meridian advises on tax, SARS, diesel refund, customs/excise, fuel controls and operational compliance matters.\n\nWhat would you like to explore?';
  const QUICK_REPLIES = ['What services do you offer?', 'Diesel refund support', 'SARS dispute help', 'How to get in touch'];
  const FALLBACK = 'I may not have a precise answer for that here. For a substantive matter, it is best to speak directly — use the enquiry form below and Meridian will respond by email.';
  const EMAIL = 'info@meridianconsulting.co.za';
  const MATTER_OPTIONS = [
    { value: 'SARS / tax dispute', label: 'SARS / tax dispute' },
    { value: 'Diesel refund', label: 'Diesel refund' },
    { value: 'Customs / excise', label: 'Customs / excise' },
    { value: 'Fuel systems / controls', label: 'Fuel systems / controls' },
    { value: 'Operational review', label: 'Operational review' },
    { value: 'Other', label: 'Other' },
  ];

  function defaultMatter() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('diesel')) return 'Diesel refund';
    if (path.includes('sars')) return 'SARS / tax dispute';
    if (path.includes('customs') || path.includes('excise')) return 'Customs / excise';
    return '';
  }

  function matterOptionsHtml() {
    const selected = defaultMatter();
    const options = MATTER_OPTIONS.map((opt) => `<option value="${opt.value}"${opt.value === selected ? ' selected' : ''}>${opt.label}</option>`);
    return `<option value="">Select a matter type</option>${options.join('')}`;
  }

  function thankYouPath() {
    return '/contact.php';
  }

  let widget = document.querySelector('[data-chat-widget]');
  if (!widget || !widget.querySelector('[data-chat-panel]')) {
    if (widget) widget.remove();
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="chat-widget" data-chat-widget>
        <div class="chat-panel" data-chat-panel hidden>
          <header class="chat-header">
            <div class="chat-header-brand">
              <span class="chat-avatar" aria-hidden="true">M</span>
              <div><strong>Quick enquiry</strong><small>General information about Meridian</small></div>
            </div>
            <button class="chat-close" type="button" data-chat-close aria-label="Close chat">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M4 4l10 10M14 4L4 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            </button>
          </header>
          <div class="chat-messages" data-chat-messages role="log" aria-live="polite" aria-relevant="additions"></div>
          <div class="chat-quick-replies" data-chat-quick-replies aria-label="Suggested questions"></div>
          <form class="chat-contact-form" data-chat-contact-form name="chat-enquiry" method="POST" action="${thankYouPath()}" hidden>
            <input type="hidden" name="form-name" value="chat-enquiry" />
            <p class="hidden" aria-hidden="true"><label>Don't fill this out: <input name="chat-bot-field" tabindex="-1" autocomplete="off" /></label></p>
            <p class="chat-contact-label">Send an enquiry</p>
            <label><span>Name</span><input type="text" name="name" required autocomplete="name" /></label>
            <label><span>Email</span><input type="email" name="email" required autocomplete="email" /></label>
            <label><span>Matter type</span><select name="matter" required data-chat-matter>${matterOptionsHtml()}</select></label>
            <label><span>Your message</span><textarea name="message" rows="3" required placeholder="Briefly describe your matter…"></textarea></label>
            <div class="chat-contact-actions">
              <button class="button button-primary chat-send-enquiry" type="submit" data-track="chat-form-submit">Send enquiry</button>
              <button class="button button-ghost chat-cancel-enquiry" type="button" data-chat-contact-cancel>Cancel</button>
            </div>
          </form>
          <form class="chat-input-bar" data-chat-form>
            <label class="sr-only" for="chat-input">Message</label>
            <input id="chat-input" type="text" data-chat-input placeholder="Ask about services, SARS, diesel refund…" autocomplete="off" maxlength="500" />
            <button class="chat-send" type="submit" aria-label="Send message" data-track="chat-message-send">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 10h14M11 4l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </form>
        </div>
        <button class="chat-toggle" type="button" data-chat-toggle aria-expanded="false" aria-label="Open enquiry helper" data-track="chat-open">
          <svg class="chat-toggle-icon chat-toggle-icon--open" width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8A2.5 2.5 0 0 1 17.5 16H9l-5 4v-4H6.5A2.5 2.5 0 0 1 4 13.5v-8Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
          <svg class="chat-toggle-icon chat-toggle-icon--close" width="22" height="22" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M4 4l10 10M14 4L4 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          <span class="chat-toggle-label">Ask a question</span>
        </button>
      </div>`;
    widget = wrapper.firstElementChild;
    document.body.appendChild(widget);
  }

  const toggle = widget.querySelector('[data-chat-toggle]');
  const panel = widget.querySelector('[data-chat-panel]');
  const closeBtn = widget.querySelector('[data-chat-close]');
  const messagesEl = widget.querySelector('[data-chat-messages]');
  const form = widget.querySelector('[data-chat-form]');
  const input = widget.querySelector('[data-chat-input]');
  const quickRepliesEl = widget.querySelector('[data-chat-quick-replies]');
  const contactForm = widget.querySelector('[data-chat-contact-form]');

  let isOpen = false;
  let greeted = false;

  function setOpen(open) {
    isOpen = open;
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    widget.classList.toggle('is-open', open);
    if (open) {
      if (!greeted) {
        greeted = true;
        addBotMessage(GREETING);
        renderQuickReplies();
      }
      input.focus();
    }
  }

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function createMessageEl(role, text) {
    const el = document.createElement('div');
    el.className = `chat-message chat-message--${role}`;
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = text;
    el.appendChild(bubble);
    return el;
  }

  function addUserMessage(text) {
    messagesEl.appendChild(createMessageEl('user', text));
    scrollToBottom();
  }

  function addBotMessage(text) {
    messagesEl.appendChild(createMessageEl('bot', text));
    scrollToBottom();
  }

  function showTyping() {
    const el = document.createElement('div');
    el.className = 'chat-message chat-message--bot chat-typing';
    el.innerHTML = '<div class="chat-bubble chat-bubble--typing" aria-label="Assistant is typing"><span></span><span></span><span></span></div>';
    messagesEl.appendChild(el);
    scrollToBottom();
    return el;
  }

  function removeTyping(el) {
    if (el?.parentNode) el.parentNode.removeChild(el);
  }

  function matchIntent(text) {
    const lower = text.toLowerCase();
    let best = null;
    let bestScore = 0;
    for (const item of KNOWLEDGE) {
      let score = 0;
      for (const kw of item.keywords) {
        if (lower.includes(kw)) score += kw.split(' ').length;
      }
      if (score > bestScore) { bestScore = score; best = item; }
    }
    return bestScore > 0 ? best : null;
  }

  function renderQuickReplies() {
    quickRepliesEl.innerHTML = '';
    QUICK_REPLIES.forEach((label) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chat-quick-reply';
      btn.textContent = label;
      btn.addEventListener('click', () => handleUserMessage(label));
      quickRepliesEl.appendChild(btn);
    });
  }

  function showContactForm(prefillMessage) {
    contactForm.hidden = false;
    if (prefillMessage) {
      const messageField = contactForm.querySelector('[name="message"]');
      if (messageField && !messageField.value.trim()) messageField.value = prefillMessage;
    }
    scrollToBottom();
  }

  function hideContactForm() {
    contactForm.hidden = true;
    contactForm.reset();
    const matterField = contactForm.querySelector('[data-chat-matter]');
    if (matterField) matterField.innerHTML = matterOptionsHtml();
  }

  function respondTo(text) {
    const intent = matchIntent(text);
    if (intent?.action === 'contact' && !intent.reply) {
      addBotMessage(`You can reach Meridian at ${EMAIL}, or send an enquiry using the form below. Include the type of matter, your sector and any key deadlines.`);
      showContactForm(text);
      renderQuickReplies();
      return;
    }
    if (intent?.reply) {
      addBotMessage(intent.reply);
      if (intent.action === 'contact') {
        addBotMessage('Would you like to send an enquiry? Use the form below and Meridian will respond by email.');
        showContactForm(text);
      }
      renderQuickReplies();
      return;
    }
    addBotMessage(FALLBACK);
    showContactForm(text);
    renderQuickReplies();
  }

  function handleUserMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    quickRepliesEl.innerHTML = '';
    addUserMessage(trimmed);
    input.value = '';
    const typing = showTyping();
    window.setTimeout(() => {
      removeTyping(typing);
      respondTo(trimmed);
    }, 500 + Math.min(trimmed.length * 12, 800));
  }

  toggle.addEventListener('click', () => {
    if (!isOpen) trackEvent('chat-open');
    setOpen(!isOpen);
  });
  closeBtn.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) setOpen(false);
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    trackEvent('chat-message-send');
    handleUserMessage(input.value);
  });

  const { hostname, protocol } = window.location;
  const isLocal = protocol === 'file:' || hostname === 'localhost' || hostname === '127.0.0.1';

  contactForm.addEventListener('submit', (e) => {
    if (!isLocal) {
      trackEvent('chat-form-submit');
      return;
    }
    e.preventDefault();
    const data = new FormData(contactForm);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const matter = String(data.get('matter') || '').trim();
    const message = String(data.get('message') || '').trim();
    if (!name || !email || !matter || !message) return;
    addUserMessage(`Enquiry from ${name}`);
    addBotMessage('Opening your email client with your message ready to send…');
    trackEvent('chat-form-submit');
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`Website chat enquiry - ${matter}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\nMatter: ${matter}\n\nMessage:\n${message}\n\n(Sent via website chat)`)}`;
    hideContactForm();
    renderQuickReplies();
  });

  widget.querySelector('[data-chat-contact-cancel]')?.addEventListener('click', () => {
    hideContactForm();
    renderQuickReplies();
  });
})();
