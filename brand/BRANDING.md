# Resonance Brand Guidelines

## Brand Philosophy

Resonance represents **acoustic intelligence, not surveillance**. The brand communicates precision, transparency, and spatial awareness while deliberately distancing itself from law enforcement, military, or surveillance aesthetics. Every visual element should evoke scientific instrumentation, wave physics, and probabilistic reasoning — never authority or control.

---

## Primary Mark

The Resonance logo mark consists of:

- **Four node points** arranged at the corners of a softened (rounded) square, representing the spatial cell — the fundamental unit of multi-sensor coverage
- **Three concentric quarter-arc waves** emanating from center-right, representing directional acoustic propagation and the probabilistic nature of detection
- The overall composition suggests a sensor network observing an expanding wavefront, capturing the core technology concept in a single geometric image

The mark is abstract, scientific, and neutral. It must never be mistaken for a targeting reticle, badge, or weapon sight.

---

## Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Deep Graphite | `#111318` | Primary background, dark mode surfaces, text on light |
| Signal Cyan | `#5AD7FF` | Primary accent, wave elements, interactive highlights |
| Resonance Violet | `#7667FF` | Secondary accent, node points, links, emphasis |
| Mist | `#EEF2F5` | Light mode background, secondary surfaces |
| Signal White | `#FFFFFF` | Text on dark, card surfaces |
| Accent Warm | `#FF6B4A` | Alerts, warnings, high-confidence indicators |

### Color Relationships
- **Signal Cyan** is the primary brand color — used for the wave arcs in the logo and key UI accents
- **Resonance Violet** is the secondary brand color — used for node dots and secondary interactive elements
- **Deep Graphite + Signal Cyan** is the primary dark-mode pairing
- **Mist + Resonance Violet** is the primary light-mode pairing
- **Accent Warm** is used sparingly for alerts and never as a primary element

---

## Typography

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Body text | Inter | Regular (400), Medium (500) | All UI text, documentation |
| Headings | Inter | Semibold (600), Bold (700) | Section headers, titles |
| Code / data | IBM Plex Mono | Regular (400), Medium (500) | Code blocks, confidence values, IDs |
| Wordmark | Inter | Bold (700) | Tracked +2% for the "Resonance" logotype |

### Font Sizes (base 16px)
- Body: 16px / 1.6 line-height
- Small: 14px / 1.5
- Code: 14px / 1.4 (monospace)
- H1: 32px / 1.2
- H2: 24px / 1.3
- H3: 20px / 1.4

---

## Usage Rules

### The logo must NOT resemble:
- Firearms, gun sights, or crosshairs
- Police badges, shields, or law enforcement insignia
- Military insignia, chevrons, or rank markers
- Surveillance cameras or "all-seeing eye" motifs
- Targeting reticles or heads-up display elements
- Handcuffs, batons, or restraint devices

### Required Practices
- Always maintain minimum clear space (see below)
- Never rotate the logo mark
- Never stretch or distort
- Never apply effects (drop shadows, gradients, bevels)
- Never place on busy photographic backgrounds without a container
- Never redraw or approximate — always use the provided SVG assets

---

## Minimum Clear Space

The minimum clear space around the logo mark equals the width of one node dot (corner point) on all sides. For the wordmark lockup, clear space is measured as 1× the cap height of the "R" in Resonance.

```
    ┌─────────────────────────┐
    │     ·              ·    │
    │                         │
    │         [clear]         │
    │                         │
    │     ·              ·    │
    └─────────────────────────┘
         ↕ = node dot width
```

---

## Dark Mode / Light Mode Variants

### Dark Mode (on Deep Graphite or dark surfaces)
- Node dots: Signal White (`#FFFFFF`)
- Wave arcs: Signal Cyan (`#5AD7FF`)
- Wordmark text: Signal White (`#FFFFFF`)
- File: `logo-dark.svg`

### Light Mode (on Mist or white surfaces)
- Node dots: Deep Graphite (`#111318`)
- Wave arcs: Resonance Violet (`#7667FF`)
- Wordmark text: Deep Graphite (`#111318`)
- File: `logo-light.svg`

### Default / Brand (neutral contexts)
- Node dots: Resonance Violet (`#7667FF`)
- Wave arcs: Signal Cyan (`#5AD7FF`)
- File: `logo.svg`

---

## Favicon Guidelines

The favicon uses a simplified version of the mark:
- Four node dots (same corner arrangement)
- Single wave arc (the outermost arc only)
- Optimized for 32×32, 16×16, and 180×180 (Apple touch) rendering
- At small sizes, line weights increase to maintain visibility
- File: `favicon.svg`

### Favicon Sizes to Generate
| Size | Format | Usage |
|------|--------|-------|
| 16×16 | .ico | Browser tab (legacy) |
| 32×32 | .svg / .png | Browser tab (modern) |
| 180×180 | .png | Apple touch icon |
| 192×192 | .png | Android / PWA |
| 512×512 | .png | PWA splash |

---

## Social Card

The social media preview card (1200×630):
- Deep Graphite background
- Logo mark centered in the upper third
- "Resonance" wordmark below the mark
- "Spatial Acoustic Intelligence" tagline in Mist color
- Subtle dot-grid pattern at 5% opacity covering the background
- File: `social-card.svg`

Used for Open Graph (`og:image`), Twitter Card, and link preview contexts.

---

## Asset Files

| File | Description |
|------|-------------|
| `logo.svg` | Primary mark (Violet dots, Cyan arcs) |
| `logo-dark.svg` | Dark background variant (White dots, Cyan arcs) |
| `logo-light.svg` | Light background variant (Graphite dots, Violet arcs) |
| `wordmark.svg` | Logo + "Resonance" text lockup |
| `favicon.svg` | Simplified mark for small sizes |
| `social-card.svg` | 1200×630 social media card |
