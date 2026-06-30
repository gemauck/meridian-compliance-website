# Meridian Compliance & Advisory Website

Static website for Meridian Compliance & Advisory — tax, SARS, diesel refund, customs/excise, and operational compliance advisory.

## Hosting: domains.co.za

Live site: **https://meridianconsulting.co.za** (domains.co.za shared hosting, `public_html`).

### Deploy via GitHub Actions

Pushing to `main` deploys automatically via FTP (`.github/workflows/deploy.yml`).

**Automatic:** merge or push to `main` — the workflow uploads all site files to `public_html/`.

**Manual:** GitHub repo → Actions → **Deploy to domains.co.za** → **Run workflow**.

Required repository secrets: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`.

No manual FTP upload needed from local machines.

### DNS (required for live domain)

The domain must point at **domains.co.za hosting**, not GitHub Pages.

In the domains.co.za control panel → DNS for `meridianconsulting.co.za`:

| Record | Type | Value |
|--------|------|-------|
| `@` (root) | **A** | Your hosting server IP (see cPanel → Server Information; often matches `webmail.` subdomain) |
| `www` | **A** or **CNAME** | Same hosting IP, or `meridianconsulting.co.za` |

**Remove** any records pointing to GitHub Pages:

- A records to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- CNAME `www` → `gemauck.github.io`
- AAAA records to `2606:50c0:8000::153` / `2606:50c0:8002::153`

After DNS changes, allow up to 24 hours to propagate. The SSL certificate should then be issued by your hosting provider (not `*.github.io`).

GitHub Pages is **not** used for the live site — only FTP deploy to `public_html/` on domains.co.za.

### Contact form

Forms POST to `contact.php`, which sends email to `info@meridianconsulting.co.za` via PHP `mail()`.

If emails don't arrive:
- Confirm `noreply@meridianconsulting.co.za` exists on your hosting (or change the `From` address in `contact.php` to a mailbox on your domain)
- Check domains.co.za spam filters and hosting mail logs
- Contact domains.co.za support to confirm PHP `mail()` is enabled

### SEO after upload

1. **Google Search Console** (one-time setup)
   - Go to [search.google.com/search-console](https://search.google.com/search-console)
   - Add property: `meridianconsulting.co.za`
   - Verify via DNS TXT record (domains.co.za control panel) or HTML file upload
   - After verification: **Sitemaps** → submit `https://meridianconsulting.co.za/sitemap.xml`
   - Use **URL inspection** on the homepage to request indexing
2. **Google Business Profile** — create or claim a profile for branded and local search
3. **Plausible analytics** — enabled in `script.js` for `meridianconsulting.co.za`. Register the domain at [plausible.io](https://plausible.io) (free trial or paid) to see real visitor stats
4. **Principal bio** — update the About section with name, photo and credentials

## Files

- `index.html` — main site
- `contact.php` — form handler for domains.co.za hosting
- `.htaccess` — redirects and security headers
- `diesel-refund-compliance.html`, `sars-dispute-support.html`, `customs-excise-advisory.html` — SEO landing pages
- `insights/` — articles
- `sitemap.xml`, `robots.txt` — search engines

Repository: https://github.com/gemauck/meridian-compliance-website
