# Meridian Compliance & Advisory Website

A premium static website for Meridian Compliance & Advisory, focused on tax, SARS, diesel refund, customs/excise, compliance, operational controls, data and AI advisory work.

## Files

- `index.html` — main one-page site
- `diesel-refund-compliance.html` — SEO landing page (expanded with FAQs)
- `sars-dispute-support.html` — SEO landing page (expanded with FAQs)
- `customs-excise-advisory.html` — SEO landing page (expanded with FAQs)
- `insights/` — articles for long-tail SEO
- `sitemap.xml` — submit to Google Search Console
- `robots.txt` — crawler directives
- `netlify.toml` — deploy config
- `thank-you.html` — Netlify form success page
- `styles.css` — responsive visual design
- `script.js` — navigation, scroll state, animations, analytics hook
- `favicon.svg` / `og-image.svg` — branding assets

## SEO checklist (do after deploy)

1. **Google Search Console** — verify domain, submit `https://meridianconsulting.co.za/sitemap.xml`
2. **Google Business Profile** — if you serve clients in specific regions
3. **Domain & canonical URLs** — update if live domain differs from `meridianconsulting.co.za`
4. **OG image PNG** — export `og-image.svg` to 1200×630 PNG for LinkedIn/WhatsApp
5. **Principal bio** — replace placeholder in About section with name, photo and credentials
6. **Analytics** — set `ANALYTICS_DOMAIN` in `script.js` (e.g. `'meridianconsulting.co.za'`)
7. **LinkedIn** — company page linking to site; post insights articles monthly
8. **Backlinks** — guest posts, professional directories, referrer relationships

## Contact form

Uses [Netlify Forms](https://docs.netlify.com/forms/setup/). On localhost, form submits via `mailto:` fallback. Success redirect: `/thank-you.html`.

## Publishing

Upload to Netlify (recommended for forms), Vercel, Cloudflare Pages, or any static host.
