# Application Flow & Interaction Architecture
## Project: AuraTone (Outfit + Skin Harmony)
**Document Version:** 1.0.0  
**Status:** Approved for Implementation  

---

## 1. High-Level User Journey Diagram

```
[Phase 1: Welcome & Persona Onboarding]
                     │
                     ▼
  ┌─────────────────────────────────────┐
  │ Option A: Live Camera / Photo Upload │
  │ Option B: 1-Click Sample Model      │
  └──────────────────┬──────────────────┘
                     │
                     ▼ (Trigger "Analyze Skin & Harmony")
[Phase 2: Real-Time Biometric Analysis]
  - Animated scanning viewfinder
  - YouCam Skin AI API call
                     │
                     ▼
[Phase 3: Personal Color Diagnostic Reveal]
  - Undertone breakdown (Warm/Cool/Neutral)
  - Seasonal Palette Matrix assignment
  - Style Vibe Selector (Minimalist, Gala, Casual, Business)
                     │
                     ▼ (Trigger "Generate AI Wardrobe Bundles")
[Phase 4: Agentic Stylist Curated Showcase]
  - Agentic LLM queries catalog & coordinates bundles
  - YouCam Apparel VTO rendering
  - 3 Bundles Generated (Signature, Bold, Capsule)
                     │
                     ▼
[Phase 5: Interactive Look Experience & Co-Pilot]
  - Side-by-side try-on preview vs. original photo
  - "Why This Works" Stylist explanation drawer
  - Chat copilot ("Adjust to semi-formal")
                     │
                     ▼
[Phase 6: 1-Click Bundle Checkout & Style Dossier Export]
  - Add Complete Bundle to Cart (AOV Boost)
  - Download / Share "Personal Color & Wardrobe Dossier"
```

---

## 2. Phase-by-Phase Screen States & User Actions

### Phase 1: Hero Landing & Input Selection Screen
- **Initial View:**
  - Dynamic ambient header with animated brand title *"AuraTone: Skin AI & Wardrobe Harmony"*.
  - Hero subhead: *"Discover outfits and cosmetics calibrated to your exact skin undertone. Powered by YouCam AI."*
  - Prominent Call-to-Action Card:
    - **Tab 1: Live Webcam** (With "Allow Camera" button).
    - **Tab 2: Upload Photo** (Drag-and-drop zone supporting PNG/JPEG).
    - **Tab 3: Instant Demo Personas** (3 pre-configured diverse models: *Elena - Cool Fair*, *Aaliyah - Warm Deep*, *Maya - Neutral Olive*).
- **User Action:**
  - User clicks any sample model OR uploads/snaps a selfie.
  - The photo immediately renders in the studio viewport with a glowing frame.
  - Button state activates: **"Analyze My Skin Harmony ✨"** (Enabled, pulsing gold gradient).

---

### Phase 2: Scanning & Processing State
- **Trigger:** User clicks **"Analyze My Skin Harmony"**.
- **Interface Behavior:**
  - Viewfinder displays an illuminated horizontal laser-scan effect moving across the photo.
  - Telemetry badge updates smoothly:
    1. *"Connecting to YouCam Skin AI..."*
    2. *"Detecting Melanin Density & Luminance..."*
    3. *"Determining Undertone Axis..."*
- **Backend Action:**
  - Calls `POST /api/analyze-skin` $\rightarrow$ forwards to YouCam API or executes cached persona payload.
  - Duration: ~1.2s to 2.5s.

---

### Phase 3: Diagnostic Reveal & Vibe Selector
- **Interface Transition:**
  - Viewfinder smoothly shrinks to a compact circular preview on the left.
  - Right panel expands with the **Personal Color Dossier**:
    - **Seasonal Category Banner:** e.g., *"True Winter Cool"* or *"Deep Autumn Warm"*.
    - **Melanin & Undertone Meters:** Visual gauge showing undertone position (e.g. `82% Cool Spectrum`).
    - **Harmonious Palette Swatches:** 5 clickable hex color swatches that complement their undertone.
    - **Clashing Colors Alert:** 2 swatches that drain or wash out their complexion with short educational notes.
  - **Occasion / Vibe Selector Buttons:**
    - `[ 🏢 Executive Power ]` `[ ☕ Minimalist Casual ]` `[ ✨ Evening Gala ]` `[ 🌿 Weekend Boho ]`
- **User Action:**
  - User selects their desired vibe (e.g. *Executive Power*).
  - Clicks **"Curate Coordinated Looks"**.

---

### Phase 4 & 5: Wardrobe Showcase & VTO Try-On Canvas
- **Interface Transition:**
  - The main stage transforms into an interactive **Split-Screen Studio**:
    - **Left Screen Canvas:**
      - High-definition portrait displaying the **YouCam Apparel VTO** result.
      - **"Before / After" Split Slider** or **"Hold to Compare"** button to toggle between raw photo and styled look.
    - **Right Screen Details:**
      - **Look Selector Tabs:**
        - `Tab 1: Signature Harmony (Score: 98%)`
        - `Tab 2: High-Contrast Chic (Score: 94%)`
        - `Tab 3: Effortless Capsule (Score: 91%)`
      - **Bundle Breakdown Card:**
        1. *Top/Dress:* Item title, color swatch, price.
        2. *Cosmetic:* Complementary lip/blush shade name, hex swatch, price.
        3. *Accessory:* Metallic tone matched (e.g. Platinum/Silver for Cool, Gold for Warm), price.
      - **Pricing Summary:** Shows individual item sum (`$245.00`), bundle savings tag (`-$35.00`), and final bundle price (`$210.00`).
      - **AI Stylist Rationale Badge:**
        - An expandable accordion: *"Why this flatters you: The jewel navy tone reflects light onto cool undertones, preventing sallow shadows, while the berry lip balances facial contrast."*
- **User Action:**
  - User clicks between Tab 1, 2, and 3: The left VTO canvas updates smoothly with a cross-fade transition.
  - User can toggle individual bundle items on/off to recalculate bundle total.

---

### Phase 6: Checkout Modal & Style Card Sharing
- **Action A: "Add Complete Harmony Bundle to Bag"**:
  - Button triggers a micro-animation with green checkmark.
  - Floating slide-in Cart Drawer appears showing all 3 items grouped together with the applied bundle discount.
  - Mock "Instant Checkout" button simulates order completion with order confirmation toast.
- **Action B: "Export Color & Style Dossier"**:
  - Generates a beautifully formatted visual digital style card (combining user portrait, personal color matrix, top 3 color swatches, and curated look).
  - Triggers browser print/download or copyable share link.
- **Action C: "Start Over / Try New Photo"**:
  - Resets state cleanly and navigates back to Phase 1.
