const CONTACT_EMAIL = 'info@meridianconsulting.co.za';
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;
const THANK_YOU_URL = '/thank-you.html';

function isLocalHost() {
  const { hostname, protocol } = window.location;
  return protocol === 'file:' || hostname === 'localhost' || hostname === '127.0.0.1';
}

function mailtoFallback({ name, email, matter, message, source }) {
  const prefix = source === 'chat' ? 'Website chat enquiry' : 'Website enquiry';
  const subject = encodeURIComponent(`${prefix} - ${matter || 'General'}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nMatter: ${matter}\n\n${message}`);
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

async function submitEnquiry({ name, email, matter, message, source = 'contact' }) {
  const prefix = source === 'chat' ? 'Website chat enquiry' : 'Website enquiry';
  const origin = window.location.origin || 'https://www.meridianconsulting.co.za';
  const response = await fetch(FORM_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      matter,
      message,
      _subject: `${prefix} - ${matter}`,
      _replyto: email,
      _template: 'table',
      _captcha: 'false',
      _next: `${origin}${THANK_YOU_URL}`,
    }),
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const result = await response.json();
  if (result.success !== 'true' && result.success !== true) {
    throw new Error(result.message || 'Form rejected');
  }
  return result;
}

async function handleEnquiryForm(form, options = {}) {
  const { source = 'contact', onSuccess, onError } = options;
  const honeypot = form.querySelector('[name="bot-field"], [name="chat-bot-field"]');
  if (honeypot && honeypot.value) return;

  const data = new FormData(form);
  const name = String(data.get('name') || '').trim();
  const email = String(data.get('email') || '').trim();
  const matter = String(data.get('matter') || '').trim();
  const message = String(data.get('message') || '').trim();
  if (!name || !email || !matter || !message) return;

  if (isLocalHost()) {
    mailtoFallback({ name, email, matter, message, source });
    return;
  }

  const submitBtn = form.querySelector('[type="submit"]');
  const originalText = submitBtn?.textContent;
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
  }

  try {
    await submitEnquiry({ name, email, matter, message, source });
    if (typeof window.plausible === 'function') {
      window.plausible(source === 'chat' ? 'chat-form-submit' : 'contact-form-submit');
    }
    if (onSuccess) {
      onSuccess({ name, email, matter, message });
    } else {
      window.location.href = THANK_YOU_URL;
    }
  } catch (err) {
    if (onError) {
      onError(err);
    } else {
      mailtoFallback({ name, email, matter, message, source });
    }
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      if (originalText) submitBtn.textContent = originalText;
    }
  }
}
