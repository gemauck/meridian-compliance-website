# Meridian Compliance & Advisory Website

Static website for Meridian Compliance & Advisory — tax, SARS, diesel refund, customs/excise, and operational compliance advisory.

## Hosting: Cloudflare Pages

Live site: **https://www.meridianconsulting.co.za**

### Deploy

Push to `main` → GitHub Actions deploys to Cloudflare Pages (`meridian-compliance-website`).

Form submissions are sent via `/api/enquiry` (Cloudflare Pages function) or FormSubmit. On localhost, forms use a `mailto:` fallback. Success redirect: `/thank-you.html`.

### Custom domain DNS

**Current setup (working):**

| Record | Type | Value |
|--------|------|-------|
| `www` | CNAME | `meridian-compliance-website.pages.dev` |
| `@` (apex) | A | Hosting IP (cPanel redirect to www) **or** Cloudflare nameservers |

**Recommended long-term fix:** Move DNS to Cloudflare, then in **Pages → meridian-compliance-website → Custom domains** add both `meridianconsulting.co.za` and `www.meridianconsulting.co.za`. Cloudflare handles apex via CNAME flattening and can 301 apex → www.

**If apex is broken** (non-www times out): run the **Fix apex domain redirect** workflow in GitHub Actions. It configures Cloudflare Pages domains (when the zone is on Cloudflare) and falls back to cPanel redirect + FTP upload.

### Google Search Console

**Action checklist:**

1. Open [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://www.meridianconsulting.co.za/`
3. Verify ownership:
   - **DNS TXT** (recommended): add the TXT record at domains.co.za, or
   - **HTML tag**: already present in `index.html` (`google-site-verification`)
4. Submit sitemap: `https://www.meridianconsulting.co.za/sitemap.xml`
5. **URL inspection** → **Request indexing** for homepage and key service pages after deploys

### Google Business Profile (GBP)

1. Go to [Google Business Profile](https://business.google.com)
2. Create or claim a profile for **Meridian Compliance & Advisory**
3. Add website: `https://www.meridianconsulting.co.za`
4. Add email: `info@meridianconsulting.co.za`
5. Service area: South Africa

### SEO — already in place

- `robots.txt` allows crawlers and links the sitemap
- `sitemap.xml` lists all public pages (15 URLs)
- Canonical URLs, Open Graph (`og-image.png`), and structured data (including founder/Person schema)
- `llms.txt` for AI discovery
- IndexNow key at `bb991d6cd7d319cfa06a160c20c97671.txt` — submitted on each deploy
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
- `functions/api/enquiry.js` — Cloudflare Pages form handler
