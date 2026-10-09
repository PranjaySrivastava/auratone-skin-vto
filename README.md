# AuraTone — Outfit + Skin Harmony Engine
> **Devpost Perfect Corp YouCam API Skin AI & eCommerce VTO Hackathon Submission**

🌐 **Live Web App:** [https://auratone-skin-vto.vercel.app](https://auratone-skin-vto.vercel.app)  
🔌 **Live API Backend:** [https://auratone-skin-vto.onrender.com](https://auratone-skin-vto.onrender.com)  
🎬 **Demo Video Script:** [docs/VIDEO_SUBMISSION_SCRIPT.md](docs/VIDEO_SUBMISSION_SCRIPT.md)  
📸 **Showcase Gallery (3:2):** [docs/GALLERY_IMAGES.md](docs/GALLERY_IMAGES.md)

AuraTone is an AI-powered, luxury e-commerce styling platform that bridges the disconnect between beauty dermatological analysis and fashion retail. By analyzing an individual's skin tone, undertone, and facial contrast using **YouCam Skin AI**, AuraTone synthesizes **Personal Color Theory** (Seasonal Palettes) with an **Agentic AI Fashion Stylist**. It dynamically curates, explains, and renders high-fidelity complete looks (apparel + complementary makeup and metallic jewelry) with **YouCam Generative Apparel Virtual Try-On (VTO)** and one-click bundle checkout.

---

## 🚀 Key Features

1. **Biometric Melanin & Undertone Diagnostics (YouCam Skin AI):**
   - Detects skin tone depth and warm/cool/neutral sub-pigment balance.
   - Maps user directly into a Seasonal Archetype: *True Winter Cool*, *Deep Autumn Warm*, *Soft Summer Cool*, or *Bright Spring Warm*.
   - Identifies 5 harmonious wardrobe color frequencies and flags clashing colors that cause sallow appearance fatigue.

2. **Generative Apparel Virtual Try-On (YouCam Apparel VTO):**
   - High-fidelity virtual try-on render directly on the user's portrait.
   - Interactive **Before / After Split Slider** allowing users and judges to inspect the color contrast live.

3. **Cross-Category E-Commerce Bundling Engine:**
   - 3 Curated Occasion Looks: *Executive Power*, *Evening Gala*, and *Minimalist Casual*.
   - Coordinates 3-in-1 ensembles: **Hero Apparel + Cosmetic Shade + Metallic Jewelry Accent**.
   - Applies an automatic **15% Bundle Discount** with dynamic pricing recalculation.

4. **Agentic Stylist Copilot ("Ask the Stylist"):**
   - Editorial AI colorist (powered by LLaMA 3) that explains *why* specific fabric wavelengths and makeup pigments flatter the user's complexion.
   - Interactive glassmorphic chat drawer answering user styling questions in real-time.

5. **Judge-Ready Zero-Friction Test Personas:**
   - Pre-loaded with 3 diverse test personas (*Elena Rostova: Cool Fair, Marcus Vance: Warm Deep, Priya Sharma: Golden Olive*) for instant evaluation without camera barriers.
   - Full support for live webcam capture and photo uploads.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 19, Vite, Zustand, Lucide Icons, Vanilla CSS with custom luxury obsidian tokens (`#090A0F` obsidian canvas, Champagne Gold `#D4AF37`, Electric Violet `#8B5CF6`).
- **Backend:** Node.js (v18+), Express, Multer, Axios.
- **APIs:** 
  - Perfect Corp YouCam Skin AI S2S API (`/task/skin-analysis`)
  - YouCam Generative Apparel VTO S2S API (`/task/apparel-vto`)
  - Groq LLaMA 3 AI Stylist (`/api/stylist/ask`)
- **Deployment:** Vercel (Client SPA) & Render (Node API Service)

---

## 🏃 Quick Start Guide

### 1. Environment Configuration

Create a `.env` file in the `server` directory:
```env
PORT=5000
YOUCAM_API_KEY=your_perfect_corp_api_key_here
GROQ_API_KEY=your_groq_api_key_here
```

Create a `.env` file in the `client` directory (optional for local):
```env
VITE_API_URL=http://localhost:5000
```

### 2. Start the Backend API (Port 5000)
```bash
cd server
npm install
npm start
```

### 3. Start the Frontend Client (Port 5173)
```bash
cd client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📂 Documentation & Submission Assets

- [Product Requirements Document (PRD)](docs/PRD.md)
- [Technical Requirements Document (TRD)](docs/TRD.md)
- [Application Flow Map](docs/APP_FLOW.md)
- [UI/UX Design Brief](docs/UI_UX_DESIGN_BRIEF.md)
- [Video Submission Script](docs/VIDEO_SUBMISSION_SCRIPT.md)
- [Devpost 3:2 Gallery Catalog](docs/GALLERY_IMAGES.md)
