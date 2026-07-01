const CONTACT_EMAIL = 'info@meridianconsulting.co.za';
const FORM_ENDPOINT = '/api/enquiry';
const THANK_YOU_URL = '/thank-you.html';

function isLocalHost() {
  const { hostname, protocol } = window.location;
  return protocol === 'file:' || hostname === 'localhost' || hostname === '127.0.0.1';
}

function mailtoFallback({ name, email, company, phone, urgency, matter, message, source }) {
  const prefix = source === 'chat' ? 'Website chat enquiry' : 'Website enquiry';
  const subject = encodeURIComponent(`${prefix} - ${matter || 'General'}`);
  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    company ? `Company: ${company}` : null,
    phone ? `Phone: ${phone}` : null,
    urgency ? `Urgency: ${urgency}` : null,
    `Matter: ${matter}`,
    '',
    message,
  ].filter(Boolean);
  const body = encodeURIComponent(lines.join('\n'));
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

async function submitEnquiry({ name, email, company, phone, urgency, matter, message, source = 'contact' }) {
  const response = await fetch(FORM_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ name, email, company, phone, urgency, matter, message, source }),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.error || `HTTP ${response.status}`);
  }

  const result = await response.json();
  if (!result.ok) throw new Error(result.error || 'Form rejected');
  return result;
}

async function handleEnquiryForm(form, options = {}) {
  const { source = 'contact', onSuccess, onError } = options;
  const honeypot = form.querySelector('[name="bot-field"], [name="chat-bot-field"]');
  if (honeypot && honeypot.value) return;

  const data = new FormData(form);
  const name = String(data.get('name') || '').trim();
  const email = String(data.get('email') || '').trim();
  const company = String(data.get('company') || '').trim();
  const phone = String(data.get('phone') || '').trim();
  const urgency = String(data.get('urgency') || '').trim();
  const matter = String(data.get('matter') || '').trim();
  const message = String(data.get('message') || '').trim();
  if (!name || !email || !matter || !message) return;

  if (isLocalHost()) {
    mailtoFallback({ name, email, company, phone, urgency, matter, message, source });
    return;
  }

  const submitBtn = form.querySelector('[type="submit"]');
  const originalText = submitBtn?.textContent;
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
  }

  try {
    await submitEnquiry({ name, email, company, phone, urgency, matter, message, source });
    if (typeof window.plausible === 'function') {
      window.plausible(source === 'chat' ? 'chat-form-submit' : 'contact-form-submit');
    }
    if (onSuccess) {
      onSuccess({ name, email, company, phone, urgency, matter, message });
    } else {
      window.location.href = THANK_YOU_URL;
    }
  } catch (err) {
    if (onError) {
      onError(err);
    } else {
      mailtoFallback({ name, email, company, phone, urgency, matter, message, source });
    }
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      if (originalText) submitBtn.textContent = originalText;
    }
  }
}
