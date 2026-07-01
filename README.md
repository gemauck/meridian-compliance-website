# Meridian Compliance & Advisory Website

Static website for Meridian Compliance & Advisory, tax, SARS, diesel refund, customs/excise, and operational compliance advisory.

## Hosting: Netlify

Live site: **https://www.meridianconsulting.co.za**

### Deploy

1. Connect this GitHub repo at [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
2. Build settings: **publish directory** = `.` (root), no build command
3. Push to `main` → Netlify deploys automatically

Form submissions are sent via `/api/enquiry` (Cloudflare Pages function) or FormSubmit. On localhost, forms use a `mailto:` fallback. Success redirect: `/thank-you.html`.

### Custom domain DNS (domains.co.za)

Keep domain registration at domains.co.za. In Netlify → **Domain management**, add `meridianconsulting.co.za` and `www.meridianconsulting.co.za`.

**Action checklist — do these in order:**

| Step | Where | Action |
|------|-------|--------|
| 1 | domains.co.za DNS | Set `@` A record → `75.2.60.5` (Netlify load balancer) |
| 2 | domains.co.za DNS | Set `www` CNAME → `meridian-compliance.netlify.app` |
| 3 | domains.co.za DNS | Remove old A/AAAA records for `@` (dead GitHub Pages / old host IPs) |
| 4 | Netlify | Domain management → set `www.meridianconsulting.co.za` as **primary domain** |
| 5 | Netlify | Enable HTTPS; confirm apex redirects to www |
| 6 | Browser | Test `https://meridianconsulting.co.za` and `https://www.meridianconsulting.co.za` both load |

If domains.co.za supports ALIAS/ANAME, you can point `@` to `apex-loadbalancer.netlify.com` instead of the A record.

### Google Search Console

**Action checklist:**

1. Open [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://www.meridianconsulting.co.za/`
3. Verify ownership:
   - **DNS TXT** (recommended): add the TXT record at domains.co.za, or
   - **HTML tag**: already present in `index.html` (`google-site-verification`)
4. Submit sitemap: `https://www.meridianconsulting.co.za/sitemap.xml`
5. **URL inspection** → **Request indexing** for:
   - Homepage
   - `diesel-refund-compliance.html`
   - `fuel-systems-controls.html`
   - `operational-risk-reviews.html`
   - `sars-dispute-support.html`
   - `insights/sars-new-diesel-refund-platform-2026.html`
   - `downloads/sars-objection-evidence-checklist.html`

### Google Business Profile (GBP)

**Action checklist:**

1. Go to [Google Business Profile](https://business.google.com)
2. Create or claim a profile for **Meridian Compliance & Advisory**
3. Category: e.g. *Tax consultant*, *Business management consultant*, or *Legal services* (pick closest fit)
4. Add website: `https://www.meridianconsulting.co.za`
5. Add email: `info@meridianconsulting.co.za`
6. Service area: South Africa (or specific provinces/cities served)
7. Add services matching site pages (diesel refund, SARS disputes, customs/excise, etc.)
8. Upload logo (`favicon.svg` or `og-image.png`) and a professional photo
9. Request verification (postcard, phone or email — Google decides)
10. After verification: add a short description matching site positioning; post the 2026 diesel refund platform article as an update

GBP helps branded searches (“Meridian Compliance Advisory”) and local trust signals. It does not replace SEO for “diesel refund consultant” type queries.

### SEO — already in place

- `robots.txt` allows crawlers and links the sitemap
- `sitemap.xml` lists all public pages (15 URLs)
- Canonical URLs, Open Graph (`og-image.png`), and structured data
- `llms.txt` for AI discovery
- `thank-you.html` is `noindex`
- Plausible analytics in `script.js` for `www.meridianconsulting.co.za`

### Contact form fields

The enquiry form collects: name, email, company, phone (optional), matter type, urgency, and message. Chat widget uses the same fields.

## Files

- `index.html` — main site
- `fuel-systems-controls.html`, `operational-risk-reviews.html` — service landing pages
- `diesel-refund-compliance.html`, `sars-dispute-support.html`, `customs-excise-advisory.html`, `data-analytics-advisory.html`
- `downloads/sars-objection-evidence-checklist.html` — printable lead magnet
- `insights/` — articles
- `images/hero-operations.jpg`, `og-image.png` — hero and social preview images
- `sitemap.xml`, `robots.txt`, `llms.txt`
- `netlify.toml`, `functions/api/enquiry.js`
