# BRAIN.MD — AuraTone (Outfit + Skin Harmony)
> **AI Context & Project Knowledge Base**  
> *Read this file first to understand the architecture, data models, API integrations, and business logic of the AuraTone project.*

---

## 1. Project Overview & Core Mission
- **Project Name:** AuraTone (Outfit + Skin Harmony)
- **Hackathon:** Devpost Perfect Corp YouCam API Skin AI & eCommerce VTO Hackathon (Deadline: November 2026).
- **Primary Value Proposition:** Merges dermatological computer vision (**YouCam Skin AI**) with generative fashion (**YouCam Apparel VTO**) and an **Agentic LLM Stylist**. Solves the ~65% return rate in online fashion caused by color/appearance mismatches by recommending and rendering personalized, color-harmonized clothing + cosmetic bundles.
- **Key Metric Focus:** Increases Average Order Value (AOV) via 3-piece curated bundles (Apparel + Cosmetic + Accessory) and slashes e-commerce return rates.

---

## 2. System Architecture & Tech Stack

```
youcam-ai/
├── brain.md                     # AI Context & Knowledge Anchor (This file)
├── docs/                        # Complete Engineering Documentation
│   ├── PRD.md                   # Product Requirements Document
│   ├── TRD.md                   # Technical Requirements Document
│   ├── UI_UX_DESIGN_BRIEF.md    # Luxury Dark Glassmorphism Design System
│   ├── APP_FLOW.md              # Screen transitions, user journey, state map
│   └── IMPLEMENTATION_PLAN.md   # Phased step-by-step engineering roadmap
├── client/                      # Frontend Application (React 18 + Vite)
│   ├── src/
│   │   ├── components/          # Reusable UI Components
│   │   │   ├── Navbar.jsx       # Header & Cart trigger
│   │   │   ├── CaptureStudio.jsx# Camera / Upload / Preset Persona selector
│   │   │   ├── ColorReport.jsx  # Seasonal Matrix & Undertone meter
│   │   │   ├── VTOCanvas.jsx    # Interactive before/after try-on canvas
│   │   │   ├── BundleShelf.jsx  # 3-Item bundle breakdown & cart action
│   │   │   ├── StylistChat.jsx  # Agentic reasoning & why-it-works drawer
│   │   │   └── CartDrawer.jsx   # Slide-out bundle checkout
│   │   ├── store/               # Zustand Global State store
│   │   ├── data/                # Sample personas, catalog products, palettes
│   │   ├── styles/              # Vanilla CSS Design System & Token variables
│   │   ├── App.jsx              # Main stage router & phase manager
│   │   └── main.jsx
│   └── package.json
└── server/                      # Backend Microservice (Node.js + Express)
    ├── routes/                  # Express route handlers
    │   ├── skin.js              # YouCam Skin AI proxy & fallback simulator
    │   ├── vto.js               # YouCam Apparel VTO proxy & cache layer
    │   └── stylist.js           # Agentic LLM orchestrator & recommendation engine
    ├── services/                # API wrappers & caching utilities
    ├── data/                    # JSON catalog database (Products & Bundles)
    ├── server.js                # Express entry point
    └── package.json
```

### Stack Details
- **Frontend:** React 18, Vite, Zustand, Vanilla CSS with CSS Custom Tokens (Glassmorphism, Midnight `#090A0F`, Champagne Gold `#D4AF37`, Violet `#8B5CF6`).
- **Backend:** Node.js (v18+), Express, Sharp (image handling), Axios.
- **External APIs:**
  - Perfect Corp YouCam Skin AI API (`/api/v1/skin-analysis`).
  - Perfect Corp YouCam Generative Apparel VTO API (`/api/v1/apparel-vto`).
  - Google Gemini / Anthropic API (for dynamic Agentic styling rationale).

---

## 3. Core Logic & Color Theory Matrix

### 3.1 Personal Color Mapping Rules
The system maps YouCam skin tone, undertone, and contrast score into 4 primary Seasonal Archetypes:

| Season | Undertone | Contrast / Depth | Flattering Palettes | Clashing Palettes to Avoid |
| :--- | :--- | :--- | :--- | :--- |
| **Spring Warm** | Warm (Yellow/Peach) | Light to Medium, Clear | Coral, Camel, Peach, Marigold, Aqua | Dull Greys, Icy Slate, Muddy Brown |
| **Summer Cool** | Cool (Pink/Blue) | Light to Medium, Soft | Powder Blue, Lavender, Rose, Sage, Soft Plum | Stark Orange, Mustard, Lime Yellow |
| **Autumn Warm** | Warm (Golden/Olive) | Medium to Deep, Rich | Terracotta, Olive Moss, Burnt Orange, Warm Bronze | Neon Pink, Stark White, Icy Blue |
| **Winter Cool** | Cool (Blue/Contrast) | Medium to Deep, High | Royal Sapphire, Emerald, Deep Magenta, Pure Black | Peachy Salmon, Warm Khaki, Camel |

### 3.2 3-Piece Bundle Architecture
Every curated bundle includes:
1. **Apparel Hero Piece:** Top, blazer, or gown with high color-harmony score ($100–$250).
2. **Cosmetic Accent:** Lipstick or cheek pigment matching the skin undertone and complementing the clothing ($25–$45).
3. **Metallic Accessory:** Jewelry piece matched by undertone (Silver/Platinum for Cool, Yellow Gold/Bronze for Warm) ($35–$65).
- **Bundle Economics:** 15% discount when purchased together.

---

## 4. Built-in Test Personas (Fail-Safe Demo System)
To guarantee 100% demo uptime and eliminate judge friction (e.g. low-light webcam issues or lack of camera permissions), the app includes 3 pre-computed hero models:

1. **Persona 1: Elena (Cool Fair / True Winter)**
   - *Undertone:* Cool | *Tone:* Fair | *Palette:* Royal Sapphire, Emerald, Silver.
   - *Featured Bundle:* Midnight Silk Blazer + Velvet Plum Lipstick + Platinum Choker.
2. **Persona 2: Aaliyah (Warm Deep / Deep Autumn)**
   - *Undertone:* Warm | *Tone:* Deep | *Palette:* Terracotta, Forest Green, Warm Gold.
   - *Featured Bundle:* Terracotta Draped Trench + Bronze Berry Gloss + Hammered Gold Hoops.
3. **Persona 3: Maya (Neutral Olive / Soft Summer)**
   - *Undertone:* Neutral-Cool | *Tone:* Medium Olive | *Palette:* Sage Green, Dusty Rose, Rose Gold.
   - *Featured Bundle:* Sage Linen Slip Dress + Dusty Rose Satin Lip + Rose Gold Cuff.

---

## 5. API Resilience & Unit Preservation
- **Credit Allocation:** Hackathon users receive 1,000 units.
- **Deduplication:** Hash incoming photos via SHA-256. If a photo or persona matches previously cached runs, results return instantly without calling the external API.
- **Graceful Simulation:** If `YOUCAM_API_KEY` is not set or the rate limit triggers (HTTP 429), the server seamlessly transitions to the high-definition simulation engine, ensuring zero crashes during live demos or video recording.

---

## 6. How to Develop & Run the App
```bash
# 1. Start the Backend Server (Port 5000)
cd server
npm install
npm run dev

# 2. Start the Frontend Client (Port 5173)
cd client
npm install
npm run dev
```

*Refer to `docs/PRD.md` and `docs/TRD.md` for extended specifications.*
