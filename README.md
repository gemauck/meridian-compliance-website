# Meridian Compliance & Advisory Website

Static website for Meridian Compliance & Advisory, tax, SARS, diesel refund, customs/excise, and operational compliance advisory.

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

Google can crawl `www.meridianconsulting.co.za` today once DNS and Search Console are set up.

**1. Fix apex DNS at domains.co.za (required)**

`www` already points to Netlify. The bare domain (`meridianconsulting.co.za`) currently points to a dead IP and does not load.

| Record | Type | Value |
|--------|------|-------|
| `@` | A | `75.2.60.5` (or ALIAS/ANAME to `apex-loadbalancer.netlify.com` if supported) |
| `www` | CNAME | `meridian-compliance.netlify.app` |

Remove any other A or AAAA records for `@`. In Netlify → **Domain management**, set `www.meridianconsulting.co.za` as the primary domain so apex redirects to www.

**2. Google Search Console (required for indexing today)**

1. Open [Google Search Console](https://search.google.com/search-console)
2. Add property `https://www.meridianconsulting.co.za/`
3. Verify via DNS TXT record (recommended) or HTML meta tag — paste the verification meta tag into `index.html` `<head>` if using HTML method
4. Submit sitemap: `https://www.meridianconsulting.co.za/sitemap.xml`
5. Use **URL inspection** → **Request indexing** on the homepage and key service pages

**3. Already in place**

- `robots.txt` allows all crawlers and links the sitemap
- `sitemap.xml` lists all public pages (8 URLs)
- Canonical URLs, Open Graph, and structured data on all service pages
- `thank-you.html` is `noindex` (form confirmation only)

**4. Optional**

- **Google Business Profile** for local/branded search
- **Plausible analytics**, enabled in `script.js` for `meridianconsulting.co.za`
- **Principal bio**, update the About section with name, photo and credentials

## Files

- `index.html`, main site
- `netlify.toml`, deploy config, headers, redirects
- `thank-you.html`, form success page
- `diesel-refund-compliance.html`, `sars-dispute-support.html`, `customs-excise-advisory.html`, SEO landing pages
- `insights/`, articles
- `sitemap.xml`, `robots.txt`, search engines

Repository: https://github.com/gemauck/meridian-compliance-website
