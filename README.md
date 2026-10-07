# AuraTone — Outfit + Skin Harmony Engine
> **Devpost Perfect Corp YouCam API Skin AI & eCommerce VTO Hackathon Submission**

AuraTone is an AI-powered, luxury e-commerce styling platform that bridges the disconnect between beauty dermatological analysis and fashion retail. By analyzing an individual's skin tone, undertone, and facial contrast using **YouCam Skin AI**, AuraTone synthesizes **Personal Color Theory** (Seasonal Palettes) with an **Agentic AI Fashion Stylist**. It dynamically curates, explains, and renders high-fidelity complete looks (apparel + complementary makeup and metallic jewelry) with **YouCam Generative Apparel Virtual Try-On (VTO)** and one-click bundle checkout.

---

## 🚀 Key Features

1. **Biometric Melanin & Undertone Diagnostics (YouCam Skin AI):**
   - Detects skin tone depth and warm/cool/neutral sub-pigment balance.
   - Maps user directly into a Seasonal Archetype: *True Winter Cool*, *Deep Autumn Warm*, *Soft Summer Cool*, or *Bright Spring Warm*.
   - Identifies 5 harmonious wardrobe color frequencies and flags clashing colors that cause sallow appearance fatigue.

2. **Generative Apparel Virtual Try-On (YouCam Apparel VTO):**
   - High-fidelity virtual try-on render on the user's portrait.
   - Interactive **Before / After Split Slider** allowing users and judges to inspect the color contrast live.

3. **Cross-Category E-Commerce Bundling Engine:**
   - 3 Curated Occasion Looks: *Executive Power*, *Evening Gala*, and *Minimalist Casual*.
   - Coordinates 3-in-1 ensembles: **Hero Apparel + Cosmetic Shade + Metallic Jewelry Accent**.
   - Applies an automatic **15% Bundle Discount** with dynamic pricing recalculation.

4. **Agentic Stylist Copilot ("Ask the Stylist"):**
   - Editorial AI colorist that explains *why* specific fabric wavelengths and makeup pigments flatter the user's complexion.
   - Interactive chat drawer answering user styling questions in real-time.

5. **Judge-Ready Zero-Friction Test Personas:**
   - Pre-loaded with 3 diverse test personas (*Elena: Cool Fair, Aaliyah: Warm Deep, Maya: Neutral Olive*) for instant, sub-second testing in any environment.
   - Full support for live webcam capture and image uploads.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 18, Vite, Zustand, Vanilla CSS with custom luxury design tokens (`#090A0F` obsidian canvas, Champagne Gold `#D4AF37`, Electric Violet `#8B5CF6`, and glassmorphism).
- **Backend:** Node.js (v18+), Express, Multer, Axios.
- **APIs:** Perfect Corp YouCam Skin AI API (`/api/v1/skin-analysis`), YouCam Generative Apparel VTO API (`/api/v1/apparel-vto`), and LLM Agentic tool-calling.

---

## 🏃 Quick Start Guide

### 1. Start the Backend API (Port 5000)
```bash
cd server
npm install
npm start
```

### 2. Start the Frontend Client (Port 5173)
```bash
cd client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📂 Documentation

- [Product Requirements Document (PRD)](file:///c:/Users/Pranjay/Desktop/hackathon/youcam-ai/docs/PRD.md)
- [Technical Requirements Document (TRD)](file:///c:/Users/Pranjay/Desktop/hackathon/youcam-ai/docs/TRD.md)
- [UI/UX Design Brief](file:///c:/Users/Pranjay/Desktop/hackathon/youcam-ai/docs/UI_UX_DESIGN_BRIEF.md)
- [Application Flow Map](file:///c:/Users/Pranjay/Desktop/hackathon/youcam-ai/docs/APP_FLOW.md)
- [Complete Implementation Plan](file:///c:/Users/Pranjay/Desktop/hackathon/youcam-ai/docs/IMPLEMENTATION_PLAN.md)
- [Project Knowledge Anchor (brain.md)](file:///c:/Users/Pranjay/Desktop/hackathon/youcam-ai/docs/brain.md)
