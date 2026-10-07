# Product Requirements Document (PRD)
## Project: AuraTone (Outfit + Skin Harmony)
**Hackathon Target:** Perfect Corp YouCam API Skin AI & eCommerce VTO Hackathon (Devpost)  
**Document Version:** 1.0.0  
**Status:** Approved for Implementation  

---

## 1. Executive Summary & Product Vision

### 1.1 The Vision
**AuraTone (Outfit + Skin Harmony)** is an AI-powered, luxury-grade e-commerce shopping copilot that bridges the fragmented worlds of beauty dermatological analysis and fashion retail. By analyzing an individual's unique skin tone, undertone, and facial contrast using **YouCam Skin AI**, AuraTone synthesizes Korean/Global Personal Color Theory (Seasonal Palettes) with an **Agentic AI Fashion Stylist**. It dynamically curates, explains, and renders high-fidelity complete looks (apparel + complementary makeup/accessories) with **YouCam Generative Apparel Virtual Try-On (VTO)** and one-click bundle checkout.

### 1.2 Target Audience
1. **The Hesitant Online Shopper:** Consumers paralyzed by online shade and outfit color mismatches who frequently experience "buyer's remorse."
2. **Fashion & Beauty Enthusiasts:** Individuals seeking personalized styling advice based on seasonal color analysis (Spring Warm, Summer Cool, Autumn Warm, Winter Cool).
3. **Retailers & Brands (B2B SaaS Angle):** E-commerce merchants looking to drastically lower expensive return logistics while increasing Average Order Value (AOV) via intelligent cross-vertical bundling.

### 1.3 Strategic Value Proposition
- **For Consumers:** Zero-guesswork shopping. Users see exactly how curated apparel and makeup complement their natural undertone on their own photo before buying.
- **For Retailers:**
  - **Slash Returns:** Eliminates the #1 cause of fashion returns: "fit, color, and appearance mismatch" (which represents ~65% of returns).
  - **Lift AOV (Average Order Value):** Shifts the paradigm from single-item purchase to curated 3-piece harmony bundles (Top/Dress + Makeup Shade + Accessory) with 1-click cart addition.

---

## 2. Core Problem Statement & Market Opportunity

### 2.1 The Problem
- **Siloed Retail:** Consumers buy clothing on one site and cosmetics on another. There is zero synergy to verify whether an emerald satin dress clashes or harmonizes with their complexion and lip shade.
- **The "Model Bias" Trap:** A camel trench coat looks radiant on a warm-toned model, but washes out a cool-undertone customer, leading to disappointment and return shipping costs.
- **Static Quiz Fatigue:** Standard e-commerce recommendation engines rely on crude survey quizzes and generic clickstream popularity, lacking real biometric and computer vision grounding.

### 2.2 Market Opportunity (TAM & Impact)
- **Global Fashion E-Commerce:** $960B+
- **Global Beauty E-Commerce:** $460B+
- **Online Return Rate:** 30–40% average in apparel (costing the industry over $200B annually). A 5% reduction in color-mismatch returns saves millions for enterprise retailers.

---

## 3. Product Goals & Success Metrics

### 3.1 Hackathon & Demo Goals
- **API Completeness:** Seamless integration of YouCam Skin AI API with YouCam Apparel Virtual Try-On (VTO) and LLM-driven Agentic Orchestration.
- **Speed to Value:** Under 4 seconds from selfie/sample selection to deep color diagnosis and tailored outfit generation.
- **Fail-Safe Judge Experience:** Instant "Sample Model Persona" switchers (Diverse Skin Profiles: Fair Cool, Olive Warm, Deep Warm/Cool) so judges can evaluate the app in low light or without camera permissions.
- **Demo WOW Factor:** Polished luxury aesthetics, interactive before/after try-on sliders, and an interactive Agentic Stylist chat drawer explaining the color science.

### 3.2 Product KPIs (Real-World Metric Model)
- **Conversion Rate:** Target 3.8x lift vs. static product catalog pages.
- **AOV Increase:** Target +35% through 3-in-1 bundled checkout.
- **Return Rate Reduction:** Projected 28% drop in color-related returns.

---

## 4. Feature Specifications & Requirements

### Feature 1: Biometric Skin & Undertone Diagnostics
- **Input:** Live camera snapshot or photo upload; instant preset selector for test personas.
- **Engine:** YouCam Skin AI API (`/skin-analysis`).
- **Extracted Attributes:**
  - Skin Tone (Fair, Light, Medium, Tan, Deep)
  - Undertone (Cool, Warm, Neutral)
  - Complexion Characteristics (Clarity, Glow, Radiance, Oiliness/Dryness notes)
- **Personal Color Classification:** Automatically maps results to Seasonal Color Matrix:
  - *Bright Spring*, *Soft Summer*, *Deep Autumn*, *True Winter*.

### Feature 2: Agentic Stylist AI Orchestration
- **Input:** Biometric profile + User Occasion/Style Preference (e.g., "Parisian Minimalist", "Executive Chic", "Casual Weekend", "Cocktail Gala").
- **Agent Roles & Reasoning:**
  1. **Colorist Tool:** Determines optimal hexadecimal color families, contrast ratios, and metallic undertone pairings (Gold vs. Silver).
  2. **Catalog Curator Tool:** Queries product database for silhouettes matching undertone filters.
  3. **Cosmetic Harmonizer Tool:** Selects precise lipstick/blush shades that balance the apparel color without overpowering facial undertones.
  4. **Explainer Tool:** Generates crisp, educational justification ("Why this works for your tone").

### Feature 3: Generative Apparel Virtual Try-On (VTO)
- **Engine:** YouCam Apparel VTO API.
- **Display:**
  - High-resolution try-on preview showing recommended apparel fitted to the user photo.
  - Interactive split-screen / toggle between raw photo and styled try-on.
  - Harmonized makeup swatch overlay card and accessory preview.

### Feature 4: Interactive Multi-Look Wardrobe Carousel
- Curates 3 distinct look bundles:
  1. **Signature Look:** Maximum color harmony (exact contrast & undertone match).
  2. **Bold Contrast Look:** Elevated statement piece with balancing neutral makeup.
  3. **Everyday Capsule Look:** Versatile, effortless everyday aesthetic.
- Interactive switching with price breakdown and individual item toggles.

### Feature 5: One-Click Bundle Checkout & Style Card Export
- **Bundle Cart:** "Add All 3 Items to Bag" (Top + Cosmetic Shade + Accessory) with bundle savings discount.
- **Personal Style Dossier Export:** Shareable, downloadable high-res "Color Harmony Profile Card" featuring the user's seasonal badge, color swatches, and styled look.

---

## 5. Non-Functional Requirements
- **Performance:** Asynchronous API task polling with responsive skeleton states; response time < 5s for full pipeline.
- **Resilience:** Graceful fallback to pre-rendered high-definition assets if YouCam API experiences network timeout or credit exhaustion.
- **Security & Privacy:** Ephemeral image processing; no user biometric photos permanently persisted without consent.
- **Cross-Platform:** Zero layout breakages on mobile screens (iOS Safari, Android Chrome) and desktop viewports.

---

## 6. Future Scope (Phase 2 & Commercial Roadmap)
- Real-time video AR try-on stream via WebRTC.
- Direct Shopify App Store & WooCommerce 1-click plugin integration.
- Wardrobe upload ("Digi-Closet"): Analyze existing clothes in user's wardrobe to suggest color-correcting makeup pairings.
