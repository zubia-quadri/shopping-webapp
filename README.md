# KENT Luxury Water Purifiers — Storefront & Showcase

A modern, high-performance shopping webapp and digital showcase for **KENT Mineral RO™** purifiers. Engineered with zero external libraries to achieve sub-1.2s Largest Contentful Paint, fluid responsive interactions, and an architectural luxury aesthetic.

---

## Highlights

- **Zero-Dependency Vanilla Stack**: Pure HTML5, tokenized CSS, and modular ES6 JavaScript. No React, jQuery, Bootstrap, or heavy carousel libraries.
- **Adaptive Product Carousel**:
  - *Desktop*: Finite 3-card spotlight showcase with strict boundary clamping and active-card scale elevation.
  - *Mobile*: Touch-swipe enabled, full-bleed centered carousel with symmetrical side-peeking neighbor cards and compact 2-line clamped copy.
- **Quick-View Product Modal**:
  - Semantic `<picture>` markup with dynamic JS hydration.
  - Seamless container blending via `mix-blend-mode: multiply` on pure `#FFFFFF` rounded media wrap—eliminating square photo borders and bounding-box shadows.
  - 100% uncropped silhouette preservation (`object-fit: contain`) across all form factors.
- **Dual Conversion Engine**: Fast "Add to Cart" / "Buy Now" flow integrated with an In-Home Water Quality Audit booking form that auto-syncs user product interest.
- **Production-Ready Netlify Config**: Pre-configured `netlify.toml` with strict security headers (`X-Frame-Options`, `X-Content-Type-Options`) and immutable 1-year asset caching.

---

## Project Structure

```
kent-landing/
├── index.html            # Semantic storefront layout & modal templates
├── css/
│   └── styles.css        # Tokenized design system (3,500+ lines, BEM-inspired)
├── js/
│   └── main.js           # Carousel logic, modal hydration, touch events, form sync
├── assets/
│   └── images/           # WebP/PNG/JPG product imagery, logos, and textures
├── PRD.md                # Product Requirements Document
├── DRD.md                # Design Requirements Document & Design System
├── netlify.toml          # Netlify build, security headers & CDN caching rules
├── .gitignore            # Secret & environment protection (.env*, credentials)
└── README.md
```

---

## Quick Start

### Local Preview
Run any local static server from the project directory:

```bash
# Python
python -m http.server 8080

# Or Node.js
npx serve .
```
Then open `http://localhost:8080` in your browser.

### Deploying to Netlify
1. **Fastest**: Drag & drop this entire folder into [app.netlify.com/drop](https://app.netlify.com/drop).
2. **Via Git**: Push to GitHub and link to Netlify (base directory: `.` / publish directory: `.`). The included `netlify.toml` automatically configures headers and routing.

---

## Environment & Security

Sensitive configuration files (`.env`, `.env.local`, credentials) are excluded from version control via `.gitignore`. If integrating backend APIs (payment gateways, CRM webhooks, SMS dispatch), declare keys in Netlify's **Site settings > Environment variables** rather than committing them to source.

