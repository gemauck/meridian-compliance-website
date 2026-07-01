const CONTACT_EMAIL = 'info@meridianconsulting.co.za';

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

export async function onRequestPost(context) {
  const contentType = context.request.headers.get('content-type') || '';
  let payload;

  if (contentType.includes('application/json')) {
    payload = await context.request.json();
  } else {
    const form = await context.request.formData();
    payload = Object.fromEntries(form.entries());
  }

  if (payload['bot-field'] || payload['chat-bot-field']) {
    return jsonResponse({ ok: true });
  }

  const name = String(payload.name || '').trim();
  const email = String(payload.email || '').trim();
  const company = String(payload.company || '').trim();
  const phone = String(payload.phone || '').trim();
  const urgency = String(payload.urgency || '').trim();
  const matter = String(payload.matter || '').trim();
  const message = String(payload.message || '').trim();
  const source = String(payload.source || 'contact').trim();

  if (!name || !email || !matter || !message) {
    return jsonResponse({ error: 'Missing required fields' }, 400);
  }

  const prefix = source === 'chat' ? 'Website chat enquiry' : 'Website enquiry';
  const subject = `${prefix} - ${matter}`;
  const origin = new URL(context.request.url).origin;
  const detailLines = [
    message,
    company ? `Company: ${company}` : '',
    phone ? `Phone: ${phone}` : '',
    urgency ? `Urgency: ${urgency}` : '',
  ].filter(Boolean).join('\n\n');

  const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      company,
      phone,
      urgency,
      matter,
      message: detailLines,
      _subject: subject,
      _replyto: email,
      _template: 'table',
      _captcha: 'false',
      _next: `${origin}/thank-you.html`,
    }),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok || (result.success !== 'true' && result.success !== true)) {
    return jsonResponse(
      {
        error: result.message || 'Unable to send enquiry',
      },
      502
    );
  }

  return jsonResponse({ ok: true });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
