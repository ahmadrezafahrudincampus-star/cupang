---
name: Obsidian & Gilded Fin
colors:
  surface: '#131410'
  surface-dim: '#131410'
  surface-bright: '#393935'
  surface-container-lowest: '#0e0e0b'
  surface-container-low: '#1b1c18'
  surface-container: '#1f201c'
  surface-container-high: '#2a2a27'
  surface-container-highest: '#353531'
  on-surface: '#e4e2dd'
  on-surface-variant: '#d1c5b4'
  inverse-surface: '#e4e2dd'
  inverse-on-surface: '#30312d'
  outline: '#9a8f80'
  outline-variant: '#4e4639'
  surface-tint: '#e9c176'
  primary: '#e9c176'
  on-primary: '#412d00'
  primary-container: '#c5a059'
  on-primary-container: '#4e3700'
  inverse-primary: '#775a19'
  secondary: '#c6c7c4'
  on-secondary: '#2f312f'
  secondary-container: '#454746'
  on-secondary-container: '#b5b5b3'
  tertiary: '#c5c7c2'
  on-tertiary: '#2e312d'
  tertiary-container: '#a4a6a1'
  on-tertiary-container: '#393c38'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdea5'
  primary-fixed-dim: '#e9c176'
  on-primary-fixed: '#261900'
  on-primary-fixed-variant: '#5d4201'
  secondary-fixed: '#e2e3e0'
  secondary-fixed-dim: '#c6c7c4'
  on-secondary-fixed: '#1a1c1b'
  on-secondary-fixed-variant: '#454746'
  tertiary-fixed: '#e2e3dd'
  tertiary-fixed-dim: '#c5c7c2'
  on-tertiary-fixed: '#1a1c19'
  on-tertiary-fixed-variant: '#454743'
  background: '#131410'
  on-background: '#e4e2dd'
  surface-variant: '#353531'
typography:
  display-lg:
    fontFamily: Bodoni Moda
    fontSize: 72px
    fontWeight: '600'
    lineHeight: 80px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Bodoni Moda
    fontSize: 48px
    fontWeight: '500'
    lineHeight: 56px
  headline-lg-mobile:
    fontFamily: Bodoni Moda
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
  headline-md:
    fontFamily: Bodoni Moda
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  title-lg:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0.05em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 32px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 28px
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 32px
  margin-desktop: 64px
  margin-mobile: 24px
  section-gap: 128px
---

## Brand & Style
The design system establishes a high-end editorial atmosphere tailored for premium aquatic breeders and collectors. The brand personality is calm, sophisticated, and deeply rooted in a "Natural Luxury" aesthetic that treats the betta fish as living art. 

The visual style departs from standard SaaS or marketplace tropes, utilizing a **Cinematic Minimalism** approach. It focuses on the interplay between deep, obsidian-like voids and precise, high-contrast typography. Layouts should feel like a high-fashion magazine or a curated gallery catalogue—prioritizing breathability, intentional asymmetry, and large-scale photography over information density.

## Colors
The palette is built on a "Deep Obsidian" foundation to ensure that the vibrant, iridescent colors of the fish are the primary focus.

- **Primary (Gold/Bronze):** Used sparingly for high-value accents, active states, or brand signatures.
- **Background & Surface:** The interface utilizes two levels of darkness to create subtle depth without relying on traditional shadows.
- **Typography:** The off-white "Parchment" text prevents the harsh contrast of pure white, providing a softer, more organic reading experience.
- **Muted (Sage Gray):** Used for metadata, secondary labels, and supporting information to maintain visual hierarchy.

## Typography
The typography pairing is the core of the editorial identity. 

- **Bodoni Moda** serves as the display face. Its high contrast and vertical stress evoke the world of luxury publishing. Large headlines should use a tighter letter-spacing for a cinematic feel.
- **Hanken Grotesk** provides a contemporary, clean counter-balance. It is used for all functional UI and body copy.
- **Hierarchy Notes:** Use uppercase and wide tracking for `title-lg` and `label-sm` to create a "structured" and "architectural" feel within the UI. Body copy should always maintain a generous line-height (1.6x or higher) to ensure a relaxed reading pace.

## Layout & Spacing
This design system utilizes a **Fixed Grid** model for large screens to maintain editorial control over line lengths and image placement.

- **Grid:** A 12-column grid with a maximum container width of 1440px. 
- **Rhythm:** Spacing follows a strict 8pt scale. However, the system encourages "Over-spacing"—using significantly more margin than functional necessity to convey luxury.
- **Section Gaps:** Significant vertical breaks (128px+) should be used between major content blocks to allow the eye to rest.
- **Mobile Adaptivity:** On mobile, margins reduce to 24px, and typography scales aggressively. Section gaps should reduce to 64px to maintain momentum on smaller vertical viewports.

## Elevation & Depth
Depth in this system is conveyed through **Tonal Layers** and **Low-Contrast Outlines**.

- **Surfaces:** Elements do not "float" with heavy shadows. Instead, elevated elements use the `#121514` surface color against the `#0B0D0C` background.
- **Borders:** Define containers with a 1px solid border using `rgba(255, 255, 255, 0.08)`. This creates a subtle "ghost" perimeter that feels precise and architectural.
- **Interactivity:** On hover, a border may shift to the primary gold or increase in opacity. 
- **Imagery:** Photos are treated as the highest elevation. They should be presented with clean edges, occasionally using a subtle 1px inner stroke to "seat" the image into the dark UI.

## Shapes
The shape language is **Soft (Level 1)**, leaning towards sharp to maintain a professional and premium feel. 

- **Standard Radius:** 4px (0.25rem). Used for buttons, input fields, and small containers.
- **Image Containers:** May remain at 0px (sharp) for a more classical gallery appearance, or use the 4px radius for a subtle modern touch.
- **Icons:** Should use thin strokes (1px to 1.5px) with sharp or slightly rounded corners to match the secondary typeface.

## Components

### Buttons
- **Primary:** Outline-style with `#C5A059` border and text. On hover, a subtle gold wash background (low opacity).
- **Secondary:** Text-only with uppercase `label-sm` styling and a simple 1px underline that expands on hover.

### Cards & Image Containers
- **Portfolio Cards:** Full-bleed imagery with metadata overlaying the bottom in a gradient scrim. 
- **Borders:** Every card uses the thin `rgba(255,255,255,0.08)` border to define its bounds against the dark background.

### Input Fields
- **Minimalist Design:** Only a bottom border (1px) in the default state. On focus, the border transitions to the primary gold. 
- **Typography:** Labels use `label-sm` positioned above the input.

### Lists & Accordions
- **Editorial Lists:** Items separated by full-width thin rules. 
- **Accordions:** Clean horizontal lines with a simple `+` or `-` toggle. No box containers; the content exists within the flow of the page.

### Navigation
- **Desktop:** Centered logo with wide-tracked navigation links. Transparent background that blurs slightly (`backdrop-filter`) when scrolling over content.