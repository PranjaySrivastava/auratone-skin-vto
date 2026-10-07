# UI/UX Design Brief
## Project: AuraTone (Outfit + Skin Harmony)
**Design Direction:** High-End Luxury Fashion Tech / Cyber-Elegance & Glassmorphism  
**Target Atmosphere:** Premium, elevated, editorial, tactile, and scientifically authoritative  

---

## 1. Design Philosophy & Aesthetic Pillars

AuraTone merges the scientific precision of dermatological computer vision with the opulent elegance of high-fashion digital editorial platforms (e.g., *Vogue, SSENSE, Net-a-Porter*).

### The Three Core Pillars:
1. **Editorial Chic:** High contrast, deliberate negative space, razor-sharp typographic hierarchy, and refined micro-borders (`1px solid rgba(255, 255, 255, 0.1)`).
2. **Atmospheric Glassmorphism:** Deep twilight backgrounds illuminated by luminous, glowing seasonal color accents, backdrop blur filters (`backdrop-filter: blur(16px)`), and subtle ambient grain.
3. **Tactile Micro-Interactions:** Fluid spring transitions, interactive side-by-side try-on sliders, radiant hover glows, and responsive live feedback indicators.

---

## 2. Color System & Palettes

The core interface employs a sleek, midnight-obsidian dark canvas that allows vibrant clothing swatches and skin tones to pop with maximum fidelity.

### 2.1 Interface Base Tokens (Dark Canvas)
- **Obsidian Dark (Canvas Base):** `#090A0F`
- **Surface Elevation 1 (Card Background):** `rgba(18, 20, 29, 0.75)`
- **Surface Elevation 2 (Interactive Floating Elements):** `rgba(28, 32, 48, 0.85)`
- **Glass Border Stroke:** `rgba(255, 255, 255, 0.08)`
- **High-Contrast Text (Headings):** `#F8FAFC` (Pure Pearl White)
- **Subdued Text (Body/Labels):** `#94A3B8` (Cool Slate)
- **Muted Text (Captions/Meta):** `#64748B` (Deep Muted Slate)

### 2.2 Accent & Harmony Tokens (The "Aura" System)
- **Champagne Gold (Luxury Primary):** `#D4AF37` / `#F3E5AB`
- **Electric Violet (AI Agent Aura):** `#8B5CF6` / `#A78BFA`
- **Rose Quartz (Radiance / Warm Indicator):** `#FB7185`
- **Cerulean Cyan (Cool Undertone Indicator):** `#38BDF8`
- **Emerald Mint (High Harmony Badge):** `#10B981`

### 2.3 Seasonal Color Palette Indicators
| Season Matrix | Representative Accents | Emotional Tone |
| :--- | :--- | :--- |
| **Bright Spring** | Coral `#FF6F61`, Sunny Marigold `#FFB300`, Aqua `#48CAE4` | Luminous, energetic, warm |
| **Soft Summer** | Powder Blue `#90E0EF`, Lavender `#CDB4DB`, Dusty Rose `#D8A48F` | Gentle, muted, aristocratic cool |
| **Deep Autumn** | Terracotta `#C85A17`, Forest Moss `#2D5A27`, Rich Camel `#C19A6B` | Earthy, sultry, rich warmth |
| **True Winter** | Royal Sapphire `#0F52BA`, Deep Emerald `#046307`, Bold Crimson `#9A031E` | High contrast, jewel-tone, icy |

---

## 3. Typography Hierarchy

We adopt a dual-font pairing combining an editorial serif/avant-garde display typeface with a crisp, ultra-legible modern sans-serif:

- **Display & Headings Font:** `Plus Jakarta Sans` or `Outfit` (Geometric, contemporary luxury) paired with optional editorial accents via `Syne` or `Playfair Display`.
- **Interface & Monospace Metrics:** `Inter` (UI elements, buttons, body copy) + `JetBrains Mono` (Color hex values, confidence ratings, technical API metrics).

### Scale & Weight Specifications:
- **Hero Title (`H1`):** `40px` (Desktop: `56px`), Weight `700`, Line-height `1.1`, Letter-spacing `-0.03em`.
- **Section Heading (`H2`):** `28px` (Desktop: `36px`), Weight `600`, Letter-spacing `-0.02em`.
- **Card Subheading (`H3`):** `20px`, Weight `600`.
- **Body Regular:** `15px`, Weight `400`, Line-height `1.6`.
- **Badge & Metric Tag:** `11px`, Weight `600`, Uppercase, Letter-spacing `+0.08em`.

---

## 4. Key Component Specs & Interaction Design

### 4.1 The Biometric Capture Studio
- **Layout:** Central spotlight viewfinder card with subtle glowing gold boundary scan line animation during processing.
- **Dual Mode Input:**
  1. High-fidelity Live Webcam / Mobile Camera trigger.
  2. One-click **"Sample Personas" Bar** (3 distinct diverse real-world models) for zero-barrier judge interaction.
- **Scanning State:** Pulsing radar aura with real-time status telemetry (`"Extracting Melanin Index..."`, `"Calculating Undertone Resonance..."`, `"Mapping Seasonal Quadrant..."`).

### 4.2 The Personal Color Profile Card
- Floating luxury glassmorphism badge displayed directly adjacent to user photo.
- **Visuals:**
  - Radial Undertone Compass (Warm vs. Cool axis).
  - 5 Swatch Circles showing the user's best complimentary wardrobe hex colors.
  - Overall Personal Color Badge (e.g., `DEEP WINTER COOL` with an emerald harmony rating `98% MATCH`).

### 4.3 The Interactive VTO Look Showcase
- **Split-Screen Interactive Comparison:** A draggable slider or seamless click-to-toggle button between raw user portrait and AI apparel try-on render.
- **Bundle Anatomy Shelf:** 3 floating micro-cards pinned below the main visual:
  1. **Apparel Piece** (e.g. *Italian Wool Navy Blazer* - `$185`)
  2. **Harmonized Lip/Cheek Shade** (e.g. *Velvet Mulberry Matte* - `$32`)
  3. **Accessory Piece** (e.g. *Chunky Platinum Chain* - `$48`)
- **Bundle Discount Bar:** Shows original separate total (`$265`) crossed out, displaying the Bundle Offer (`$219 - Save 17%`).

### 4.4 The "Why This Works" AI Stylist Drawer
- A collapsible bottom or side drawer featuring the Agent's reasoning.
- Explains the exact optical mechanics of why the selected fabric tone elevates the user's complexion.

---

## 5. Micro-Animations & Sensory Details
- **Button Hover:** Smooth scale `1.02` with an ambient glow shadow (`box-shadow: 0 0 20px rgba(212, 175, 55, 0.3)`).
- **Tab Switching:** Fluid sliding pill indicator using CSS transitions (`cubic-bezier(0.16, 1, 0.3, 1)`).
- **Cart Trigger:** Haptic pulse animation on badge counter with a toast confirmation notification.
