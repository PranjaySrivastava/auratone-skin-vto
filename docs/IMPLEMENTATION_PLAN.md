# Complete Implementation Plan
## Project: AuraTone (Outfit + Skin Harmony)
**Target:** Perfect Corp YouCam API Skin AI & eCommerce VTO Hackathon  
**Document Version:** 1.0.0  
**Status:** Ready for Execution  

---

## Roadmap & Milestones Overview

```
[Phase 1: Project Setup & Monorepo Scaffolding]
  ├── Frontend: Vite + React 18 + Zustand + Lucide Icons
  └── Backend: Express REST Server + Image Processing + Middleware
                           │
                           ▼
[Phase 2: Luxury Design System & Data Foundations]
  ├── Vanilla CSS Tokens (Obsidian #090A0F, Champagne Gold, Glassmorphism)
  ├── 3 Hero Diverse Personas (Elena: Winter, Aaliyah: Autumn, Maya: Summer)
  └── Curated Multi-Category Product Catalog (Apparel + Makeup + Accessories)
                           │
                           ▼
[Phase 3: Backend API Engine & Agentic Orchestrator]
  ├── YouCam Skin AI Client + SHA-256 Cache + Offline Fallback Simulator
  ├── YouCam Apparel VTO Integration + Result Caching
  └── Agentic Stylist Engine (Seasonal Color Math + LLM Reasoning)
                           │
                           ▼
[Phase 4: Frontend Component Suite & State Machine]
  ├── Stage 1: Onboarding Studio (Camera / Upload / 1-Click Personas)
  ├── Stage 2: Biometric Scanner (Animated Laser & Telemetry)
  ├── Stage 3: Diagnostic Report (Seasonal Badge, Undertone Compass)
  ├── Stage 4: VTO Studio (Before/After Interactive Split Slider)
  ├── Stage 5: Bundle Shelf (3 Looks, Item Toggles, Savings Calculator)
  └── Stage 6: Cart Drawer & Exportable Personal Color Dossier
                           │
                           ▼
[Phase 5: Polish, End-to-End Verification & Hackathon Submission]
  ├── Mobile / Desktop Responsive Audit
  ├── Live API Unit Conservation & Zero-Failure Demo Mode Verification
  └── 1-3 Minute Demo Video Script & Devpost Submission Checklist
```

---

## Phase 1: Project Setup & Scaffolding

### 1.1 Directory Structure Initialization
Set up client and server workspaces under the root directory:
```
youcam-ai/
├── client/          # Vite + React application
├── server/          # Express API server
├── docs/            # Specifications & guides
└── brain.md         # Context anchor
```

### 1.2 Frontend Setup
- Initialize Vite React project (`npm create vite@latest client -- --template react`).
- Install core client packages:
  - `zustand` (Predictable global state management)
  - `lucide-react` (Crisp minimalist luxury iconography)
  - `canvas-confetti` (Celebratory bundle checkout micro-interaction)

### 1.3 Backend Setup
- Initialize Express server in `server/`.
- Install core backend packages:
  - `express`, `cors`, `dotenv`
  - `multer` (Handling image file uploads)
  - `sharp` (High-performance image optimization & resizing)
  - `axios` (HTTP communication with YouCam & LLM endpoints)
  - `crypto` (SHA-256 hashing for instant cache hits)

---

## Phase 2: Design System & Mock Data Architecture

### 2.1 CSS Luxury Design System (`client/src/styles/index.css`)
- Configure CSS custom property tokens:
  - Background: `--bg-canvas: #090a0f`, `--bg-card: rgba(18, 20, 29, 0.75)`
  - Borders: `--border-glass: rgba(255, 255, 255, 0.08)`
  - Accents: `--gold-primary: #d4af37`, `--violet-agent: #8b5cf6`, `--emerald-match: #10b981`
  - Blur filters: `backdrop-filter: blur(16px)`
  - Typography: Import `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');`

### 2.2 Curated Product & Catalog Database (`server/data/catalog.json`)
Construct a rich 30+ item inventory categorized with metadata:
- **Apparel Items:** Silhouettes (Blazers, Slip Dresses, Trench Coats, Structured Shirts) with hex color codes, seasonal tags (`winter`, `autumn`, `summer`, `spring`), and prices.
- **Cosmetics:** Pigment shades (Lipsticks, Glosses, Cheek Stains) keyed to matching undertones (`cool`, `warm`, `neutral`).
- **Accessories:** Metallic jewelry (Silver/Platinum, Yellow Gold, Rose Gold, Pearls) matching undertone temperature.

### 2.3 Built-in Diverse Test Personas (`server/data/personas.json`)
Pre-configure 3 high-resolution sample models for instant judging:
1. **Elena (Cool Fair / True Winter):** High facial contrast, cool undertone, jewel-toned palette.
2. **Aaliyah (Warm Deep / Deep Autumn):** Rich warm undertone, earthy terracotta & golden moss palette.
3. **Maya (Neutral-Cool Olive / Soft Summer):** Soft contrast, sage green & dusty rose palette.

---

## Phase 3: Backend API Integration & Agentic Engine

### 3.1 YouCam Skin AI Proxy (`server/routes/skin.js`)
- Route: `POST /api/skin/analyze`
- Accepts multipart form data (image upload) or persona ID.
- Checks SHA-256 hash against in-memory cache to conserve units.
- Calls YouCam endpoint `https://yce.perfectcorp.com/api/v1/skin-analysis`.
- **Resilience Engine:** If API key is unconfigured or returns HTTP 429/500, seamlessly returns realistic, scientifically accurate biometric metrics (tone, undertone, depth, contrast, skin hydration).

### 3.2 YouCam Apparel VTO Proxy (`server/routes/vto.js`)
- Route: `POST /api/vto/try-on`
- Forwards user image and apparel asset to YouCam VTO API.
- Caches rendered try-on image URL.
- **Simulator Mode:** Provides pre-rendered try-on pairs for the 3 built-in personas so judges experience sub-second responses even without external network delays.

### 3.3 Agentic Stylist Orchestrator (`server/routes/stylist.js`)
- Route: `POST /api/stylist/curate-bundles`
- Executes color harmony calculation:
  $$\text{Harmony Score} = f(\text{Undertone Match}, \text{Contrast Delta}, \text{Color Temperature})$$
- Generates 3 cohesive bundles:
  1. **Signature Harmony Look:** Optimal undertone resonance.
  2. **High-Contrast Chic Look:** Elevated contrast statement.
  3. **Capsule Minimalist Look:** Everyday versatile harmony.
- Generates editorial "Why this works for your skin" narrative.

---

## Phase 4: Frontend Components & State Management

### 4.1 Global State Store (`client/src/store/useStore.js`)
- Manages:
  - Current phase: `ONBOARDING` $\rightarrow$ `SCANNING` $\rightarrow$ `DIAGNOSTIC` $\rightarrow$ `SHOWCASE` $\rightarrow$ `CHECKOUT`
  - Active user image / active persona
  - Biometric skin analysis result
  - Active occasion / style vibe
  - Curated look bundles
  - Active bundle look selection
  - Cart items and total discount

### 4.2 Component Architecture
1. **`Navbar.jsx`:**
   - Brand logo with glowing jewel badge, phase breadcrumbs, and floating Cart trigger with item badge.
2. **`CaptureStudio.jsx`:**
   - Live camera viewfinder, image file uploader, and quick-select Persona Cards for instant demo.
3. **`ScanningOverlay.jsx`:**
   - Visual scan line, rotating radial rings, and dynamic telemetry status text.
4. **`ColorReport.jsx`:**
   - Personal Color quadrant badge (e.g., `DEEP WINTER COOL 98% MATCH`), undertone gauge, 5 complimentary color swatches, and clashing color warnings.
   - Occasion selector: *Executive Power, Minimalist Casual, Evening Gala, Weekend Boho*.
5. **`VTOCanvas.jsx`:**
   - Interactive Before/After image comparison slider (raw photo vs. apparel try-on).
   - Zoom/Inspect controls.
6. **`BundleShelf.jsx`:**
   - 3-Look tab switcher (*Signature*, *Bold*, *Capsule*).
   - Breakdown cards for Apparel, Cosmetic, and Accessory with checkboxes to toggle individual items.
   - Dynamic Price breakdown: Retail Sum, Bundle Savings (15% off), and final Price.
   - "Add Bundle to Bag" primary action.
7. **`StylistDrawer.jsx`:**
   - "Why this flatters your complexion" analysis badge with color theory breakdown.
8. **`CartDrawer.jsx`:**
   - Slide-in shopping bag with bundled discount breakdown and simulated 1-click checkout.
9. **`DossierExportModal.jsx`:**
   - Formats a digital "Personal Color & Wardrobe Dossier" for downloading or sharing.

---

## Phase 5: Testing, Polish & Hackathon Delivery

### 5.1 Verification Checklist
- [ ] **Zero-Failure Check:** Verify the application operates seamlessly with or without live `YOUCAM_API_KEY`.
- [ ] **Instant Persona Demo:** Ensure clicking Elena, Aaliyah, or Maya loads full analysis and try-on in < 1 second.
- [ ] **Live Camera Test:** Test browser webcam capture and image upload parsing.
- [ ] **Responsive Design:** Verify fluid layout on desktop (1920x1080), tablet, and mobile (390x844).
- [ ] **Cross-Vertical Economics:** Validate cart correctly discounts 15% when all 3 bundle items are selected.

### 5.2 Hackathon Submission Assets
- [ ] **Repository Setup:** Clean README with setup instructions, architecture diagram, and MIT/Apache license.
- [ ] **1-3 Minute Demo Video:**
  - `0:00 - 0:25`: The Problem (65% returns due to color mismatch, disconnected beauty vs fashion).
  - `0:25 - 1:15`: The Solution (Skin AI scan $\rightarrow$ Seasonal Palette $\rightarrow$ Generative Apparel VTO).
  - `1:15 - 2:00`: Interactive Before/After slider & Agentic Stylist rationale.
  - `2:00 - 2:40`: 3-piece bundle cart checkout (+35% AOV boost).
  - `2:40 - 3:00`: Architecture recap & Perfect Corp API synergy.
- [ ] **Devpost Copy:** Narrative highlighting API orchestration, agentic reasoning, and retail impact.

---

## Action Plan: Immediate Next Steps
1. **Step 1:** Initialize `server/` with Express, routes, catalog data, and sample personas.
2. **Step 2:** Initialize `client/` with Vite, Zustand, and luxury dark glassmorphism CSS tokens.
3. **Step 3:** Implement end-to-end flow from persona capture to VTO preview and bundle checkout.
4. **Step 4:** Launch and verify locally.
