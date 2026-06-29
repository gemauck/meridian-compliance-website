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

### Contact form

Forms POST to `contact.php`, which sends email to `info@meridianconsulting.co.za` via PHP `mail()`.

If emails don't arrive:
- Confirm `noreply@meridianconsulting.co.za` exists on your hosting (or change the `From` address in `contact.php` to a mailbox on your domain)
- Check domains.co.za spam filters and hosting mail logs
- Contact domains.co.za support to confirm PHP `mail()` is enabled

### SEO after upload

1. **Google Search Console** — verify `meridianconsulting.co.za`, submit `https://meridianconsulting.co.za/sitemap.xml`
2. **Google Business Profile** — for local/branded search
3. **Analytics** — set `ANALYTICS_DOMAIN` in `script.js` to `'meridianconsulting.co.za'`
4. **Principal bio** — update the About section with name, photo and credentials

## Files

- `index.html` — main site
- `contact.php` — form handler for domains.co.za hosting
- `.htaccess` — redirects and security headers
- `diesel-refund-compliance.html`, `sars-dispute-support.html`, `customs-excise-advisory.html` — SEO landing pages
- `insights/` — articles
- `sitemap.xml`, `robots.txt` — search engines

## GitHub mirror (optional)

A copy is also on GitHub Pages for preview only:  
https://github.com/gemauck/meridian-compliance-website

Your live site should be **meridianconsulting.co.za** on domains.co.za.
