# Meridian Compliance & Advisory Website

Static website for Meridian Compliance & Advisory — tax, SARS, diesel refund, customs/excise, and operational compliance advisory.

## Hosting: Netlify

Live site: **https://www.meridianconsulting.co.za**

### Deploy

1. Connect this GitHub repo at [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
2. Build settings: **publish directory** = `.` (root), no build command
3. Push to `main` → Netlify deploys automatically

Form submissions appear in Netlify → **Forms**. Set email notifications to `info@meridianconsulting.co.za`.

### Custom domain DNS (domains.co.za)

Keep domain registration at domains.co.za. In Netlify → **Domain management**, add `meridianconsulting.co.za` and `www.meridianconsulting.co.za`. Netlify shows the DNS records to add.

Typically:

| Record | Type | Value |
|--------|------|-------|
| `@` | A | Netlify load balancer IP (from Netlify dashboard) |
| `www` | CNAME | your-site.netlify.app |

Remove old GitHub Pages and domains.co.za hosting A/AAAA records when switching.

### Contact form

Uses [Netlify Forms](https://docs.netlify.com/forms/setup/). On localhost, form submits via `mailto:` fallback. Success redirect: `/thank-you.html`.

### SEO

1. **Google Search Console** — verify `meridianconsulting.co.za`, submit `https://www.meridianconsulting.co.za/sitemap.xml`
2. **Google Business Profile** — for local/branded search
3. **Plausible analytics** — enabled in `script.js` for `meridianconsulting.co.za`
4. **Principal bio** — update the About section with name, photo and credentials

## Files

- `index.html` — main site
- `netlify.toml` — deploy config, headers, redirects
- `thank-you.html` — form success page
- `diesel-refund-compliance.html`, `sars-dispute-support.html`, `customs-excise-advisory.html` — SEO landing pages
- `insights/` — articles
- `sitemap.xml`, `robots.txt` — search engines

Repository: https://github.com/gemauck/meridian-compliance-website
