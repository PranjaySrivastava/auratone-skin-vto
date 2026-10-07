# Technical Requirements Document (TRD)
## Project: AuraTone (Outfit + Skin Harmony)
**Hackathon Target:** Perfect Corp YouCam API Skin AI & eCommerce VTO Hackathon  
**Document Version:** 1.0.0  
**Status:** Approved for Engineering Implementation  

---

## 1. System Architecture Overview

AuraTone utilizes a decoupled client-server architecture designed for high responsiveness, API resilience, and fluid user interactions.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React 18 + Vite)                       │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌─────────────┐ │
│  │ Camera / Photo Upload │  │ Personal Color Drawer │  │ VTO Canvas  │ │
│  └───────────────────────┘  └───────────────────────┘  └─────────────┘ │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌─────────────┐ │
│  │ Preset Persona Switch │  │ Stylist Agent Chat    │  │ Bundle Cart │ │
│  └───────────────────────┘  └───────────────────────┘  └─────────────┘ │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ HTTPS / JSON API
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      BACKEND (Node.js + Express API)                   │
│                                                                        │
│  ┌───────────────────────────┐       ┌──────────────────────────────┐  │
│  │   API Controller Router   │ ◄───► │  Agentic Orchestrator (LLM)  │  │
│  └─────────────┬─────────────┘       └──────────────┬───────────────┘  │
│                │                                    │                  │
│                ▼                                    ▼                  │
│  ┌───────────────────────────┐       ┌──────────────────────────────┐  │
│  │ In-Memory / SQLite Cache  │       │ Curated Catalog Store (JSON) │  │
│  └───────────────────────────┘       └──────────────────────────────┘  │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ External REST Calls
                    ┌────────────────┴────────────────┐
                    ▼                                 ▼
┌────────────────────────────────────┐  ┌────────────────────────────────┐
│      PERFECT CORP YOUCAM APIS      │  │        LLM INFERENCE API       │
│  1. Skin AI Analysis Endpoint      │  │  - Google Gemini 1.5/2.0 Flash │
│  2. Apparel Generative VTO API     │  │  - Structured Function Calling │
└────────────────────────────────────┘  └────────────────────────────────┘
```

---

## 2. Technology Stack Selection & Rationale

### 2.1 Frontend
- **Framework:** **React 18 + Vite** (Ultra-fast HMR, lightweight bundle size, fast startup).
- **Styling Architecture:** Modern **Vanilla CSS with CSS Design Tokens** (custom variables for glassmorphism, harmonious luxury gradients, responsive typography).
- **State Management:** **Zustand** (lightweight, zero boilerplate, effortless cross-component syncing for analysis profile, current look, and cart items).
- **Camera & Media Capture:** Native HTML5 `navigator.mediaDevices.getUserMedia` with fallback file upload and drag-and-drop.
- **Icons & Visuals:** `lucide-react` for clean luxury UI iconography.
- **HTTP Client:** Fetch API with custom resilient retry wrapper.

### 2.2 Backend
- **Runtime:** **Node.js (v18+)**
- **Framework:** **Express.js** (Standard REST microservice).
- **Image Handling:** `multer` (multipart/form-data parsing) + `sharp` (client/server-side image compression and resizing to optimize API latency and bandwidth).
- **Agentic Engine:** Gemini / Anthropic API SDK with structured JSON tool-calling capabilities.
- **Data & Caching Layer:**
  - Lightweight embedded storage (**SQLite** / High-speed In-Memory Cache via `node-cache`).
  - Cache keys hashed from `(image_sha256 + product_id)` to prevent redundant YouCam API credit consumption.

---

## 3. External API Specifications & Integrations

### 3.1 YouCam Skin AI API
- **Endpoint:** `POST https://yce.perfectcorp.com/api/v1/skin-analysis` *(or regional endpoint e.g., makeupar.com)*
- **Headers:**
  - `Authorization: Bearer <YOUCAM_API_KEY>`
  - `Content-Type: multipart/form-data`
- **Payload:**
  ```json
  {
    "image": "<binary_image_data_or_url>",
    "return_details": true
  }
  ```
- **Extracted Fields Normalized in Backend:**
  ```typescript
  interface SkinAnalysisResult {
    skinTone: "fair" | "light" | "medium" | "tan" | "deep";
    undertone: "cool" | "warm" | "neutral";
    contrastLevel: "low" | "medium" | "high";
    seasonalPalette: "Spring Warm" | "Summer Cool" | "Autumn Warm" | "Winter Cool";
    confidenceScore: number;
    recommendedColorHexes: string[];
    avoidColorHexes: string[];
  }
  ```

### 3.2 YouCam Generative Apparel VTO API
- **Endpoint:** `POST https://yce.perfectcorp.com/api/v1/apparel-vto`
- **Headers:**
  - `Authorization: Bearer <YOUCAM_API_KEY>`
  - `Content-Type: application/json`
- **Payload:**
  ```json
  {
    "user_image_url": "https://storage.cdn/user_temp.jpg",
    "apparel_id": "app_velvet_emerald_01",
    "apparel_image_url": "https://storage.cdn/catalog/velvet_emerald.jpg",
    "return_format": "url"
  }
  ```
- **Response Format:**
  ```json
  {
    "status": "success",
    "vto_preview_url": "https://api-vto.perfectcorp.com/preview/res_8923.jpg",
    "confidence": 0.94,
    "processing_time_ms": 1820
  }
  ```

---

## 4. Agentic AI Stylist Architecture

### 4.1 Orchestrator State Flow
The Agent does not simply execute static lookups; it performs autonomous reasoning through tool definitions:

1. **Tool 1: `evaluateColorHarmony(skinProfile, targetVibe)`**  
   Calculates color theory compatibility scores between the user's natural melanin undertones and the clothing color palette.
2. **Tool 2: `filterCatalog(season, occasion, undertone)`**  
   Queries internal product inventory for high-scoring apparel garments.
3. **Tool 3: `pairComplementaryCosmetics(outfitColor, skinTone)`**  
   Selects matching lip, blush, or eyeshadow pigments that balance the outfit without color-clashing.
4. **Tool 4: `generateStylistNarrative(bundle, skinProfile)`**  
   Writes an insightful, editorial-grade explanation of *why* this combination flatters the user.

---

## 5. Data Models & Schemas

### 5.1 Product Schema (`products.json`)
```typescript
interface Product {
  id: string;
  name: string;
  category: "apparel" | "cosmetic" | "accessory";
  subcategory: "dress" | "blazer" | "top" | "lipstick" | "palette" | "jewelry";
  colorName: string;
  colorHex: string;
  seasonMatch: ("spring" | "summer" | "autumn" | "winter")[];
  undertoneCompatibility: ("cool" | "warm" | "neutral")[];
  price: number;
  imageUrl: string;
  vtoAssetUrl?: string;
  brand: string;
}
```

### 5.2 Bundle Schema
```typescript
interface StyleBundle {
  id: string;
  title: string;
  tagline: string;
  harmonyScore: number; // e.g. 96 (%)
  apparel: Product;
  cosmetic: Product;
  accessory: Product;
  totalPrice: number;
  bundlePrice: number; // e.g. 15% discount
  vtoRenderUrl: string;
  stylistReasoning: string;
}
```

---

## 6. Credit Optimization & Contingency Strategy

Because hackathon API accounts receive **1,000 units**, conservative usage is built directly into the engineering design:

1. **Tier 1 (Instant Cache Hit):** Every unique image is hashed with SHA-256. If a judge tests the sample model photos, results load instantly (0ms latency, 0 units deducted).
2. **Tier 2 (On-Demand Live VTO):** The app only generates the VTO render for the active hero look initially, lazy-rendering subsequent bundle looks upon user click.
3. **Tier 3 (Mock Resilience Fallback):** If API keys are empty, rate-limited (HTTP 429), or network fails, the backend seamlessly switches to an automated high-fidelity simulator mode with pre-baked YouCam analysis data and high-res try-on renders.

---

## 7. Deployment & DevOps
- **Frontend Hosting:** Vercel / Netlify.
- **Backend Hosting:** Render / Railway / Local Node process.
- **Environment Variables:**
  - `YOUCAM_API_KEY`: Perfect Corp developer token.
  - `YOUCAM_API_URL`: Base API URL.
  - `GEMINI_API_KEY`: LLM inference key.
  - `PORT`: Server port (default 5000).
