# Design Requirements Document (DRD) & Design System Architecture
## Project: KENT Luxury Water Purifiers Flagship Landing Page
**Document Version:** 2.0  
**Status:** Approved & Implemented  
**Target Resolution Support:** Responsive Mobile (375px–430px), Tablet (768px–1024px), Desktop (1280px–1920px+)  
**Design Paradigm:** Architectural Luxury, Pristine Bio-Mineral Vitality, Fluid Precision  

---

## 1. Design System Philosophy & Visual Identity

### 1.1 The Aesthetic Formula
The design system fuses **clinical water purity** with **contemporary European interior minimalism**. By combining deep organic teal, refined mineral sand accents, and airy porcelain white canvas, the interface shifts consumer mindset from routine filtration appliances to a luxury health and lifestyle focal point.

```
[ Clinical Purity ]  +  [ Architectural Luxury ]  =  [ KENT Gold Standard ]
  • Multi-Stage Mineral RO™     • Deep Pure Teal (#0E544A)      • Aspirational Wellness Authority
  • Live TDS Digital Readout    • Warm Sand Accent (#C5A880)    • 25+ Years Legacy of Purity
  • Zero Water Wastage          • Porcelain Stone (#FAF9F6)     • Architectural Precision
```

### 1.2 Core Design Principles
1. **Continuous Surface Harmony**: Elimination of jarring image cutouts or rectangular photo edges. Studio product photos blend directly into curved porcelain containers via `mix-blend-mode: multiply`.
2. **Restrained Luxury Spacing**: Generous breathing room (utilizing an 8-point spatial rhythm) that gives flagship products gallery-like prestige.
3. **Deliberate Depth & Glassmorphism**: Multi-layered ambient occlusion shadows paired with subtle frosted-glass surfaces (`backdrop-filter: blur(14px)`).
4. **Zero-Lag Fluidity**: Fluid CSS transitions (`cubic-bezier(0.16, 1, 0.3, 1)`) with zero layout shift (CLS < 0.02).

---

## 2. Design System Foundations (Tokens & Primitives)

### 2.1 Color Palette
```css
:root {
  /* Brand Primary & Secondary */
  --color-teal:            #0E544A; /* Deep Pure Purity Teal */
  --color-teal-dark:       #083831; /* Deep Forest Shadow */
  --color-teal-light:      #166D60; /* Interactive Teal Hover */
  --color-teal-subtle:     rgba(14, 84, 74, 0.08); /* Frosted Pill Tints */
  
  /* Mineral & Luxury Metallic Accents */
  --color-sand:            #C5A880; /* Warm Mineral Sand / Champagne Gold */
  --color-sand-hover:      #B3946C; /* Interactive Gold Hover */
  --color-sand-light:      rgba(197, 168, 128, 0.15); /* Badge Backdrops */
  
  /* Canvas & Neutral Backgrounds */
  --color-canvas-porcelain:#FAF9F6; /* Luxury Warm Stone Canvas */
  --color-surface-pure:    #FFFFFF; /* Crisp Studio White Surface */
  --color-surface-alt:     #F4F3EE; /* Subtle Accent Paneling */
  
  /* Typographic Hierarchy */
  --color-text-title:      #111827; /* Near Black / Dark Charcoal */
  --color-text-body:       #4B5563; /* Refined Neutral Slate */
  --color-text-muted:      #9CA3AF; /* Subtle Secondary Info */
  
  /* Functional & Borders */
  --color-border-subtle:   rgba(14, 84, 74, 0.08);
  --color-border-focus:    #C5A880;
  --color-success:         #059669;
}
```

### 2.2 Typography Hierarchy
- **Primary Serif Display (`--font-display`)**: `Playfair Display`, `Cinzel`, serif — Used for high-impact emotional headings (e.g., *"Pure Water. Essential Purity."*).
- **Secondary Technical Heading (`--font-heading`)**: `Space Grotesk`, -apple-system, sans-serif — Used for category kickers, specs, badges, and numeric pricing.
- **Body & Interface (`--font-body`)**: `Inter`, `Plus Jakarta Sans`, sans-serif — Engineered for high legibility across dense product descriptions and form inputs.

| Typographic Role | Font Family | Size (Desktop) | Size (Mobile) | Weight | Letter Spacing | Line Height |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Display H1** | Serif Display | 3.75rem (60px) | 2.15rem (34px) | 700 | -0.02em | 1.12 |
| **Section Title H2** | Serif Display | 2.50rem (40px) | 1.85rem (30px) | 700 | -0.01em | 1.20 |
| **Card Title H3** | Space Grotesk | 1.35rem (22px) | 1.05rem (17px) | 700 | -0.01em | 1.25 |
| **Category Kicker** | Space Grotesk | 0.82rem (13px) | 0.66rem (10.5px) | 700 | +0.12em | 1.30 |
| **Body Paragraph** | Inter Sans | 1.00rem (16px) | 0.85rem (13.5px) | 400 | normal | 1.65 |
| **Clamped Desc** | Inter Sans | — | 0.76rem (12px) | 400 | normal | 1.42 |
| **Button Text** | Space Grotesk | 0.88rem (14px) | 0.72rem (11.5px) | 600 | +0.02em | 1.00 |

### 2.3 Elevation & Shadow Tokens
- **Elevation 1 (Cards & Badges)**: `0 4px 14px rgba(0, 0, 0, 0.04)`
- **Elevation 2 (Active Center Spotlight)**: `0 16px 36px -8px rgba(14, 84, 74, 0.22), 0 8px 20px rgba(0, 0, 0, 0.06)`
- **Elevation 3 (Modal Surface)**: `0 24px 64px -12px rgba(0, 0, 0, 0.18), 0 8px 24px rgba(14, 84, 74, 0.08)`
- **Glassmorphism**: `backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); background: rgba(255, 255, 255, 0.88);`

---

## 3. Component Design & Technical Specifications

### 3.1 Global Sticky Navigation Bar (`#navbar`)
- **Desktop Layout**: 
  - Brand Logo left (`85px` width), centered search bar with inner search icon (`width: 320px`), right actions (Wishlist heart with badge count, Cart bag with badge count, Account profile avatar).
- **Mobile Layout (≤ 768px)**:
  - Top bar contains: Brand Logo left, Wishlist icon, Cart bag, Account icon, and Hamburger toggle right.
  - Search bar rendered as a clean, single-pill container (`.nav-search-wrap`) with an in-flow SVG icon and transparent input background, eliminating duplicate inner border boxes.
  - Off-canvas drawer (`#mobile-nav`) slides down smoothly with navigation links and contact hotline.

### 3.2 Hero Section & Image Alignment (`#hero`)
- **Desktop Architecture**:
  - Two-column split layout (`1fr 1fr`).
  - Left: Refined kicker pill, Serif H1 headline, multi-sentence authority narrative, 3-column proof-point metrics (`1 Crore+`, `25+ Years`, `100% Minerals`), dual primary/secondary action buttons.
  - Right: Studio pedestal showcase with water splash graphic perfectly aligned with the left column's baseline grid to prevent vertical drift.
- **Mobile Architecture (≤ 768px)**:
  - Stacked layout.
  - Headline copy streamlined to 2 high-impact lines for mobile readability without vertical congestion.
  - Ultra-HD mobile background image with tailored aspect ratio ensuring the purifier pedestal sits naturally above the fold.

### 3.3 Flagship Product Carousel (`#products`)

```
DESKTOP (Finite 3-Card Showcase):
┌──────────────┐   ┌────────────────────────┐   ┌──────────────┐
│  Card 0      │   │  Card 1 (ACTIVE CENTER)│   │  Card 2      │
│  Scale: 0.96 │   │  Scale: 1.02           │   │  Scale: 0.96 │
│  Opacity: 0.8│   │  Gold Border, High-Z   │   │  Opacity: 0.8│
└──────────────┘   └────────────────────────┘   └──────────────┘

MOBILE (Centered Side-Peeking Carousel):
| [PEEK ~31px] |  [       ACTIVE CENTER CARD      ]  | [PEEK ~31px] |
| Scale: 0.92  |  Scale: 1.0, Full Opacity,       | Scale: 0.92  |
| Opacity: 0.72|  Elevated Shadow, Gold Border    | Opacity: 0.72|
```

- **Desktop Specifications**:
  - Viewport bounds 3 cards (`gap: 28px`).
  - Active card receives `.is-center` with gold accent border and elevated shadow.
  - Arrow buttons conditionally disable when reaching boundary limits (finite showcase).
- **Mobile Specifications (≤ 768px)**:
  - `.product-carousel-wrapper`: Full-bleed `100vw` container breakout via `margin-left: calc(-50vw + 50%); margin-right: calc(-50vw + 50%); width: 100vw !important;`.
  - `.catalog-card`: Sized to `flex: 0 0 75vw !important; max-width: 290px !important;` with `16px` gap.
  - Centering Algorithm in JS:
    ```javascript
    let targetOffset = -(activeIndex * step) + (vpWidth - metrics.cardWidth) / 2;
    // Bounded clamp applied strictly on desktop; mobile preserves pure centering for symmetrical peeks
    ```
  - Visual Hierarchy:
    - Active `.is-center`: `transform: scale(1) translateY(-3px) !important; opacity: 1 !important; z-index: 5;`
    - Inactive neighbors: `transform: scale(0.92) !important; opacity: 0.72 !important;`
  - Compact Content & Trimming:
    - Media box height: `148px` with `object-fit: contain`.
    - Description paragraph: `-webkit-line-clamp: 2 !important; line-clamp: 2 !important; overflow: hidden;`
    - Action footer: Single row (`flex-wrap: nowrap; gap: 6px;`) containing Wishlist, "View Product" (`flex: 1`), and "Add to Cart" (`flex: 1.2`).

### 3.4 Minimalist Quick-View Product Modal (`#productModal`)
- **Container Structure**:
  - Glassmorphism backdrop (`background: rgba(10, 25, 22, 0.65); backdrop-filter: blur(8px)`).
  - Floating modal card with rounded corners (`border-radius: 24px; background: #FFFFFF`).
  - Brand header with official KENT logo left and circular close button right (`rotate(90deg)` on hover).
- **Product Media Container (`.modal-product-media-wrap`)**:
  - Surface: Pure `#FFFFFF` studio canvas with rounded corners (`border-radius: 20px`), subtle border (`1px solid rgba(14, 84, 74, 0.08)`), and soft elevation.
  - Container Grid Alignment: `.modal-content-grid` uses `align-items: stretch` so media matches the right column's height.
- **Responsive `<picture>` Implementation**:
  ```html
  <picture class="modal-product-picture" id="modalProductPicture">
    <source id="modalProductSource" srcset="assets/images/product_grand_star.jpg" type="image/jpeg" />
    <img src="assets/images/product_grand_star.jpg" alt="KENT Grand Star" id="modalProductImg" class="modal-product-img" />
  </picture>
  ```
- **Seamless Blending Engine**:
  ```css
  .modal-product-picture {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .modal-product-img {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    object-position: center;
    display: block;
    mix-blend-mode: multiply;
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    filter: none !important;
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }
  ```
  - *Result*: Zero inner rectangular borders, zero bounding box shadow artifacts, and uncropped representation of all units (from compact countertops to tall swan faucets).
- **Actions & Reassurance**:
  - Dual CTAs: Luxury Gold `"Add to Cart"` with instant confirmation checkmark + Deep Teal `"Buy Now"` with arrow icon.
  - Guarantees Grid: 3 clean minimalist tiles (*30-Day Return*, *4-Year Warranty*, *Free 24h Setup*).

### 3.5 Architectural Bento Grid (`#why-kent`)
- **Layout Rhythm**: Asymmetric 3-column / 2-row grid.
- **Card Styling**: Rounded corners (`border-radius: 22px`), luxury border stroke (`1px solid rgba(14, 84, 74, 0.06)`), and subtle ambient gradient (`#FAF9F6` to `#FFFFFF`).
- **Typography & Accents**: High-contrast gold badges, real-world lifestyle photography, and clean technical schematics.

### 3.6 In-Home Water Quality Audit Booking Form (`#demo`)
- **Layout**: Centered luxury booking module flanked by certified lab testing benefits.
- **Input Tokens**: Rounded inputs (`border-radius: 12px; border: 1.5px solid #E5E7EB; background: #FFFFFF;`).
- **Focus State**: `border-color: var(--color-sand); box-shadow: 0 0 0 3px rgba(197, 168, 128, 0.25); outline: none;`.
- **Dynamic Preselection**: Automatically binds to `#product-interest` select element whenever a user clicks "Buy Now" on any modal or catalog card.

---

## 4. Responsive Breakpoint Matrix

| Viewport Category | Width Range | Layout Behavior & Grid Adjustments |
| :--- | :--- | :--- |
| **Large Desktop / 4K** | `≥ 1440px` | Max container width `1280px`; 3-card bounded carousel with full copy; 2-column modal (`1fr 1.2fr`). |
| **Standard Desktop** | `1025px – 1439px` | Container padding `24px`; standard 3-card showcase; standard bento grid. |
| **Tablet Landscape** | `769px – 1024px` | 2-card carousel view; 2-column bento grid collapse; modal switches to compact 2-column. |
| **Mobile Standard** | `481px – 768px` | Full-bleed side-peeking carousel (`75vw` cards, `16px` gap); modal converts to stacked 1-column (`220px` image container); drawer menu active. |
| **Mobile Compact** | `375px – 480px` | Symmetrical ~31px peeks from neighboring cards; 2-line clamped descriptions; single-row button actions; 2-line hero headline. |

---

## 5. Technical Frontend Architecture & Implementation Rules

### 5.1 Zero-Dependency Vanilla Architecture
- No external heavy runtime libraries (no Swiper, Slick, React, Vue, jQuery, Bootstrap, or Tailwind).
- All interactions driven by performant vanilla JavaScript (`IIFE`, `requestAnimationFrame`, passive scroll listeners, and event delegation).

### 5.2 Performance & Rendering Standards
1. **Hardware Acceleration**: All carousel transitions and modal animations use GPU-accelerated CSS properties (`transform: translateX(...) scale(...)`, `opacity`). Zero manipulation of `left`, `margin-left`, or `top` during animations.
2. **Layout Shifts**: Fixed aspect ratios, explicit `width` and `height` attributes on images, and container queries prevent Cumulative Layout Shifts (CLS < 0.02).
3. **Paint Optimization**: `will-change: transform` utilized judiciously on active carousel tracks; `contain: content` applied to independent sections.
