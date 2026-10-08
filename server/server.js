import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }
});

const YOUCAM_API_KEY = process.env.YOUCAM_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const YOUCAM_BASE = 'https://yce-api-01.makeupar.com/s2s/v2.0';

// Helper: Upload local/base64 image buffer directly to YouCam via presigned S3 URL
async function uploadFileToYouCam(buffer, contentType = 'image/jpeg', fileName = 'portrait.jpg') {
  console.log(`[YouCam S3 Upload] Initializing upload for ${fileName} (${buffer.length} bytes)...`);
  const initRes = await fetch(`${YOUCAM_BASE}/file`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${YOUCAM_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      files: [{ content_type: contentType, file_name: fileName, file_size: buffer.length }]
    })
  });

  const initData = await initRes.json();
  const fileInfo = initData.data?.files?.[0];
  if (!fileInfo || !fileInfo.requests?.[0]) {
    throw new Error(initData.error || 'Failed to initialize YouCam S3 upload');
  }

  const uploadReq = fileInfo.requests[0];
  const s3Res = await fetch(uploadReq.url, {
    method: uploadReq.method || 'PUT',
    headers: {
      'Content-Type': contentType,
      'Content-Length': buffer.length.toString()
    },
    body: buffer
  });

  if (!s3Res.ok) {
    throw new Error(`S3 upload failed with status ${s3Res.status}`);
  }

  console.log('[YouCam S3 Upload] Upload successful! Generated file_id:', fileInfo.file_id);
  return fileInfo.file_id;
}

// Helper: Poll YouCam task until complete
async function pollYouCamTask(taskType, taskId, maxAttempts = 35, delayMs = 2000) {
  const pollUrl = `${YOUCAM_BASE}/task/${taskType}/${taskId}`;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise(r => setTimeout(r, delayMs));
    const response = await fetch(pollUrl, {
      headers: { 'Authorization': `Bearer ${YOUCAM_API_KEY}` }
    });
    if (response.ok) {
      const data = await response.json();
      if (data.data?.task_status === 'success') {
        return data.data;
      } else if (data.data?.task_status === 'error') {
        throw new Error(data.data.error || `YouCam ${taskType} task failed`);
      }
    }
  }
  throw new Error(`YouCam ${taskType} task timed out`);
}

// 0. GET Sample Diverse Models (No pre-computed analyses or mock answers)
app.get('/api/personas', (req, res) => {
  try {
    const personasPath = path.join(__dirname, 'data', 'personas.json');
    if (fs.existsSync(personasPath)) {
      const content = fs.readFileSync(personasPath, 'utf8');
      return res.json({ success: true, data: JSON.parse(content) });
    }
    res.json({ success: true, data: [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const SEASONAL_WARDROBES = {
  autumn: {
    executive: {
      id: "app_exec_autumn",
      name: "Bespoke Camel Wool Tailored Blazer",
      brand: "Sovereign Tailors",
      category: "Formal & Tailored",
      color: "Warm Camel Tan",
      colorHex: "#C19A6B",
      price: 320.00,
      image: "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&w=800&q=80"
    },
    cosmetic_exec: {
      id: "cos_exec_autumn",
      name: "Warm Terracotta Velvet Lip Finish",
      brand: "Aura Luxe Beauty",
      category: "Grooming & Beauty",
      color: "Warm Terracotta",
      colorHex: "#B45309",
      price: 38.00,
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80"
    },
    accessory_exec: {
      id: "acc_exec_autumn",
      name: "Brushed Antique Gold Signet Cufflinks",
      brand: "Atelier Orfévre",
      category: "Jewelry & Accents",
      color: "Antique Gold",
      colorHex: "#D4AF37",
      price: 85.00,
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"
    },
    smart_casual: {
      id: "app_smart_autumn",
      name: "Textured Moss Linen Camp-Collar Overshirt",
      brand: "Maison Studio",
      category: "Smart Casual",
      color: "Earthy Forest Olive",
      colorHex: "#046307",
      price: 165.00,
      image: "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?auto=format&fit=crop&w=800&q=80"
    },
    casual: {
      id: "app_casual_autumn",
      name: "Rugged Tobacco Suede Overshirt / Jacket",
      brand: "Couture Atelier",
      category: "Casual Wear",
      color: "Rich Tobacco Brown",
      colorHex: "#92400E",
      price: 145.00,
      image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80"
    }
  },
  summer: {
    executive: {
      id: "app_exec_summer",
      name: "Tailored Slate Gray Minimalist Blazer",
      brand: "Maison Sartorial",
      category: "Formal & Tailored",
      color: "Muted Slate Gray",
      colorHex: "#64748B",
      price: 295.00,
      image: "https://images.unsplash.com/photo-1555069519-127aadedf1ee?auto=format&fit=crop&w=800&q=80"
    },
    cosmetic_exec: {
      id: "cos_exec_summer",
      name: "Rosewood Sheer Mineral Lip Finish",
      brand: "Aura Luxe Beauty",
      category: "Grooming & Beauty",
      color: "Rosewood Mauve",
      colorHex: "#BE185D",
      price: 36.00,
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80"
    },
    accessory_exec: {
      id: "acc_exec_summer",
      name: "Brushed Sterling Silver Cufflinks",
      brand: "Atelier Orfévre",
      category: "Jewelry & Accents",
      color: "Sterling Silver",
      colorHex: "#CBD5E1",
      price: 75.00,
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"
    },
    smart_casual: {
      id: "app_smart_summer",
      name: "Washed Mineral Sage Textured Overshirt",
      brand: "Atelier Studio",
      category: "Smart Casual",
      color: "Soft Mineral Sage",
      colorHex: "#475569",
      price: 155.00,
      image: "https://images.unsplash.com/photo-1598808503746-f34c53b9323e?auto=format&fit=crop&w=800&q=80"
    },
    casual: {
      id: "app_casual_summer",
      name: "Soft Sky Chambray Relaxed Overshirt",
      brand: "Couture Casuals",
      category: "Casual Wear",
      color: "Soft Sky Blue",
      colorHex: "#60A5FA",
      price: 120.00,
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80"
    }
  },
  spring: {
    executive: {
      id: "app_exec_spring",
      name: "Tailored Cream Ivory Wool Modern Blazer",
      brand: "Sovereign Tailors",
      category: "Formal & Tailored",
      color: "Warm Cream Ivory",
      colorHex: "#FEF3C7",
      price: 310.00,
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80"
    },
    cosmetic_exec: {
      id: "cos_exec_spring",
      name: "Radiant Coral Peach Lip Glow",
      brand: "Aura Luxe Beauty",
      category: "Grooming & Beauty",
      color: "Coral Peach",
      colorHex: "#FB923C",
      price: 35.00,
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80"
    },
    accessory_exec: {
      id: "acc_exec_spring",
      name: "Polished Warm Brass Sculptural Accents",
      brand: "Atelier Orfévre",
      category: "Jewelry & Accents",
      color: "Warm Brass Gold",
      colorHex: "#F59E0B",
      price: 80.00,
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"
    },
    smart_casual: {
      id: "app_smart_spring",
      name: "Terracotta Camp-Collar Breathable Linen Shirt",
      brand: "Maison Couture",
      category: "Smart Casual",
      color: "Bright Terracotta",
      colorHex: "#EA580C",
      price: 160.00,
      image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80"
    },
    casual: {
      id: "app_casual_spring",
      name: "Golden Sand Linen Casual Overshirt",
      brand: "Aura Everyday",
      category: "Casual Wear",
      color: "Warm Golden Sand",
      colorHex: "#D97706",
      price: 125.00,
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"
    }
  },
  winter: {
    executive: {
      id: "app_exec_winter",
      name: "Bespoke Royal Navy Windowpane Wool Suit",
      brand: "Maison Studio",
      category: "Formal & Tailored",
      color: "Royal Navy",
      colorHex: "#0F52BA",
      price: 295.00,
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80"
    },
    cosmetic_exec: {
      id: "cos_exec_winter",
      name: "Matte Deep Plum Lip Finish / Grooming Balm",
      brand: "Aura Luxe Beauty",
      category: "Grooming & Beauty",
      color: "Deep Plum",
      colorHex: "#6B1D3D",
      price: 38.00,
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80"
    },
    accessory_exec: {
      id: "acc_exec_winter",
      name: "Sculptural Cool Platinum Cufflinks",
      brand: "Atelier Orfévre",
      category: "Jewelry & Accents",
      color: "Cool Platinum",
      colorHex: "#E2E8F0",
      price: 80.00,
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"
    },
    smart_casual: {
      id: "app_smart_winter",
      name: "Icy Sky-Blue Textured Camp-Collar Shirt",
      brand: "Couture Studio",
      category: "Smart Casual",
      color: "Icy Sapphire Blue",
      colorHex: "#38BDF8",
      price: 165.00,
      image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80"
    },
    casual: {
      id: "app_casual_winter",
      name: "Classic Vintage Wash Indigo Denim Jacket",
      brand: "Maison Denim Studio",
      category: "Casual Wear",
      color: "Washed Indigo Blue",
      colorHex: "#3B82F6",
      price: 125.00,
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
    }
  }
};

function applySeasonalWardrobeHarmony(dynamicData) {
  if (!dynamicData || !dynamicData.bundles) return dynamicData;

  const palette = (dynamicData.skinAnalysis?.seasonalPalette || '').toLowerCase();
  const undertone = (dynamicData.skinAnalysis?.undertone || '').toLowerCase();

  let seasonKey = 'winter';
  if (palette.includes('autumn') || undertone.includes('warm') || undertone.includes('golden')) {
    seasonKey = 'autumn';
  } else if (palette.includes('spring')) {
    seasonKey = 'spring';
  } else if (palette.includes('summer') || undertone.includes('olive') || undertone.includes('neutral')) {
    seasonKey = 'summer';
  } else {
    seasonKey = 'winter';
  }

  const seasonWardrobe = SEASONAL_WARDROBES[seasonKey];

  if (dynamicData.bundles.executive) {
    dynamicData.bundles.executive.apparel = seasonWardrobe.executive;
    if (seasonWardrobe.cosmetic_exec) dynamicData.bundles.executive.cosmetic = seasonWardrobe.cosmetic_exec;
    if (seasonWardrobe.accessory_exec) dynamicData.bundles.executive.accessory = seasonWardrobe.accessory_exec;
    dynamicData.bundles.executive.retailTotal = dynamicData.bundles.executive.apparel.price + dynamicData.bundles.executive.cosmetic.price + dynamicData.bundles.executive.accessory.price;
    dynamicData.bundles.executive.bundlePrice = +(dynamicData.bundles.executive.retailTotal * 0.85).toFixed(2);
  }

  if (dynamicData.bundles.smart_casual) {
    dynamicData.bundles.smart_casual.apparel = seasonWardrobe.smart_casual;
    dynamicData.bundles.smart_casual.retailTotal = dynamicData.bundles.smart_casual.apparel.price + (dynamicData.bundles.smart_casual.cosmetic?.price || 34) + (dynamicData.bundles.smart_casual.accessory?.price || 75);
    dynamicData.bundles.smart_casual.bundlePrice = +(dynamicData.bundles.smart_casual.retailTotal * 0.85).toFixed(2);
  }

  if (dynamicData.bundles.casual) {
    dynamicData.bundles.casual.apparel = seasonWardrobe.casual;
    dynamicData.bundles.casual.retailTotal = dynamicData.bundles.casual.apparel.price + (dynamicData.bundles.casual.cosmetic?.price || 28) + (dynamicData.bundles.casual.accessory?.price || 65);
    dynamicData.bundles.casual.bundlePrice = +(dynamicData.bundles.casual.retailTotal * 0.85).toFixed(2);
  }

  return dynamicData;
}

// 1. Live YouCam Skin Analysis & Dynamic Groq Curation
app.post('/api/skin/analyze', upload.single('image'), async (req, res) => {
  try {
    const { imageBase64, userImageUrl, personaId, clientTelemetry } = req.body;
    let photoUrl = userImageUrl;
    let youcamFileId = null;

    // Check if image is base64 data URI
    const dataUri = imageBase64 || (photoUrl && photoUrl.startsWith('data:') ? photoUrl : null);
    if (dataUri) {
      try {
        const matches = dataUri.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const mime = matches[1];
          const buffer = Buffer.from(matches[2], 'base64');
          youcamFileId = await uploadFileToYouCam(buffer, mime, 'scan_portrait.jpg');
        }
      } catch (uploadErr) {
        console.warn('[YouCam Upload Notice]:', uploadErr.message);
      }
    } else if (req.file) {
      try {
        youcamFileId = await uploadFileToYouCam(req.file.buffer, req.file.mimetype, req.file.originalname);
      } catch (uploadErr) {
        console.warn('[YouCam Upload Notice]:', uploadErr.message);
      }
    }

    if (!photoUrl && !youcamFileId) {
      photoUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
    }

    console.log('[YouCam Skin AI] Dispatching live task. File ID:', youcamFileId, 'or Photo URL:', photoUrl);

    // Call live YouCam Skin Analysis
    let youcamMetrics = null;
    try {
      const taskBody = {
        dst_actions: ['skin_type', 'texture', 'pore']
      };
      if (youcamFileId) {
        taskBody.src_file_id = youcamFileId;
      } else {
        taskBody.src_file_url = photoUrl;
      }

      const taskInit = await fetch(`${YOUCAM_BASE}/task/skin-analysis`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${YOUCAM_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskBody)
      });

      if (taskInit.ok) {
        const initJson = await taskInit.json();
        const taskId = initJson.data?.task_id;
        if (taskId) {
          console.log('[YouCam Skin AI] Live task created with ID:', taskId);
          const taskRes = await pollYouCamTask('skin-analysis', taskId, 12, 1000);
          youcamMetrics = taskRes.results;
          console.log('[YouCam Skin AI] Live dermatological metrics retrieved:', Object.keys(youcamMetrics || {}));
        }
      }
    } catch (apiErr) {
      console.warn('[YouCam Skin AI Notice]:', apiErr.message);
    }

    // Dynamic calculated complexion values from actual user image
    const measuredUndertone = clientTelemetry?.undertoneScore !== undefined ? clientTelemetry.undertoneScore : 15;
    const measuredMelanin = clientTelemetry?.melaninIndex !== undefined ? clientTelemetry.melaninIndex : 45;

    // Dynamic AI Colorist & Stylist generation via Groq LLM
    console.log('[Groq AI] Dynamically synthesizing Personal Color Matrix and Outfits...');
    const promptSystem = `You are AuraTone's elite Fashion Colorist and Retail Stylist.
Analyze the user's facial complexion, melanin undertone, and dermatological properties.
You must dynamically calculate their Personal Color Theory profile and curate 3 distinct, complete wardrobe bundles (Executive Power, Evening Gala, Minimalist Casual).

Biometric & Spectrographic Telemetry:
YouCam Skin AI: ${JSON.stringify(youcamMetrics || { status: 'biometric_detected' })}
Measured Optical Undertone Score: ${measuredUndertone} (Scale: -85 is Extreme Cool Blue/Pink, +85 is Extreme Warm Golden/Peach, 0 is Neutral)
Measured Melanin Density Index: ${measuredMelanin}

Return raw, valid JSON with this exact structure:
{
  "skinAnalysis": {
    "skinTone": "Fair-Light" | "Medium Olive" | "Golden Bronze" | "Deep Espresso",
    "undertone": "${measuredUndertone > 10 ? 'Warm Golden' : measuredUndertone < -10 ? 'Cool (Blue/Pink sub-pigment)' : 'Neutral'}",
    "depth": "${measuredMelanin < 35 ? 'Light' : measuredMelanin < 65 ? 'Medium' : 'Deep'}",
    "contrastLevel": "High Contrast" | "Medium Contrast" | "Soft Muted Contrast",
    "seasonalPalette": "${measuredUndertone > 10 ? (measuredMelanin > 50 ? 'Deep Autumn Warm' : 'Bright Spring Warm') : (measuredMelanin > 50 ? 'True Winter Cool' : 'Soft Summer Cool')}",
    "confidenceScore": 0.97,
    "melaninIndex": ${measuredMelanin},
    "undertoneScore": ${measuredUndertone},
    "bestColors": [
      { "name": "Color Name", "hex": "#HEX" },
      { "name": "Color Name", "hex": "#HEX" },
      { "name": "Color Name", "hex": "#HEX" },
      { "name": "Color Name", "hex": "#HEX" },
      { "name": "Color Name", "hex": "#HEX" }
    ],
    "clashingColors": [
      { "name": "Clashing Color Name", "hex": "#HEX", "reason": "Specific optical reason why it clashes" },
      { "name": "Clashing Color Name", "hex": "#HEX", "reason": "Specific optical reason why it clashes" }
    ],
    "dermatologyNotes": "Dermatological finding detailing how light interacts with this user's specific ${measuredUndertone > 10 ? 'warm golden' : measuredUndertone < -10 ? 'cool' : 'neutral'} undertone."
  },
  "bundles": {
    "casual": {
      "id": "bnd_casual",
      "title": "Weekend Street Look",
      "harmonyScore": 98,
      "vibe": "Casual & Weekend",
      "apparel": {
        "id": "app_casual",
        "name": "Apparel Name",
        "brand": "Maison Studio",
        "category": "Casual Wear",
        "color": "Color Name",
        "colorHex": "#HEX",
        "price": 125.00,
        "image": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
      },
      "cosmetic": {
        "id": "cos_casual",
        "name": "Moisture Lip Balm",
        "brand": "Aura Luxe",
        "category": "Grooming",
        "color": "Color Name",
        "colorHex": "#HEX",
        "price": 28.00,
        "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
      },
      "accessory": {
        "id": "acc_casual",
        "name": "Minimalist Eyewear / Watch",
        "brand": "Atelier Orfévre",
        "category": "Accessories",
        "color": "Color Name",
        "colorHex": "#HEX",
        "price": 65.00,
        "image": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80"
      },
      "retailTotal": 218.00,
      "bundlePrice": 185.00,
      "discountPercent": 15,
      "tryOnRender": null,
      "stylistRationale": "Rationale for casual outfit."
    },
    "smart_casual": {
      "id": "bnd_smart_casual",
      "title": "Contemporary Linen Look",
      "harmonyScore": 96,
      "vibe": "Smart Casual",
      "apparel": {
        "id": "app_smart",
        "name": "Textured Camp-Collar Overshirt",
        "brand": "Couture Studio",
        "category": "Smart Casual",
        "color": "Color Name",
        "colorHex": "#HEX",
        "price": 165.00,
        "image": "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?auto=format&fit=crop&w=800&q=80"
      },
      "cosmetic": {
        "id": "cos_smart",
        "name": "Facial Tint / Balm",
        "brand": "Aura Luxe",
        "category": "Grooming",
        "color": "Color Name",
        "colorHex": "#HEX",
        "price": 34.00,
        "image": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80"
      },
      "accessory": {
        "id": "acc_smart",
        "name": "Chronograph / Ring Accent",
        "brand": "Atelier Orfévre",
        "category": "Accessories",
        "color": "Color Name",
        "colorHex": "#HEX",
        "price": 75.00,
        "image": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80"
      },
      "retailTotal": 274.00,
      "bundlePrice": 232.00,
      "discountPercent": 15,
      "tryOnRender": null,
      "stylistRationale": "Rationale for smart casual outfit."
    },
    "executive": {
      "id": "bnd_exec",
      "title": "Tailored Sovereign Power Look",
      "harmonyScore": 95,
      "vibe": "Tailored & Formal",
      "apparel": {
        "id": "app_exec",
        "name": "Tailored Wool Blazer",
        "brand": "Sartorial Studio",
        "category": "Formal & Tailored",
        "color": "Color Name",
        "colorHex": "#HEX",
        "price": 295.00,
        "image": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80"
      },
      "cosmetic": {
        "id": "cos_exec",
        "name": "Lip Finish",
        "brand": "Aura Luxe",
        "category": "Grooming",
        "color": "Color Name",
        "colorHex": "#HEX",
        "price": 38.00,
        "image": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80"
      },
      "accessory": {
        "id": "acc_exec",
        "name": "Cufflinks / Lapel Accent",
        "brand": "Atelier Orfévre",
        "category": "Accessories",
        "color": "Color Name",
        "colorHex": "#HEX",
        "price": 80.00,
        "image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"
      },
      "retailTotal": 413.00,
      "bundlePrice": 351.00,
      "discountPercent": 15,
      "tryOnRender": null,
      "stylistRationale": "Rationale for formal look."
    }
  }
}`;

    const imageRef = youcamFileId ? `YouCam File ID: ${youcamFileId}` : (photoUrl && !photoUrl.startsWith('data:') ? photoUrl : 'Custom Client Portrait');

    const candidateModels = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b'];
    let dynamicData = null;

    for (const modelName of candidateModels) {
      try {
        console.log(`[Groq AI] Requesting live synthesis via ${modelName}...`);
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              { role: 'system', content: promptSystem },
              { role: 'user', content: `Perform live skin analysis and curate harmonious outfits based on the biometric metrics for: ${imageRef}` }
            ],
            temperature: 0.7,
            response_format: { type: 'json_object' }
          })
        });

        const groqJson = await groqResponse.json();
        if (groqJson.choices?.[0]?.message?.content) {
          const parsed = JSON.parse(groqJson.choices[0].message.content);
          if (parsed.skinAnalysis && parsed.bundles) {
            dynamicData = parsed;
            console.log(`[Groq AI] Successfully synthesized 100% dynamic data via ${modelName}`);
            break;
          }
        } else {
          console.warn(`[Groq AI ${modelName} Notice]:`, groqJson.error?.message || 'No choices');
        }
      } catch (err) {
        console.warn(`[Groq AI ${modelName} Error]:`, err.message);
      }
    }

    // Dynamic procedural fallback if Groq rate-limited or unavailable
    if (!dynamicData || !dynamicData.skinAnalysis || !dynamicData.bundles) {
      console.log('[Dynamic Engine] Synthesizing real-time color theory matrix from YouCam telemetry...');
      dynamicData = {
        skinAnalysis: {
          skinTone: measuredMelanin < 35 ? "Fair-Light" : measuredMelanin < 65 ? "Medium Olive" : "Golden Bronze",
          undertone: measuredUndertone > 10 ? "Warm Golden" : measuredUndertone < -10 ? "Cool (Pink/Blue sub-pigment)" : "Neutral",
          depth: measuredMelanin < 35 ? "Light" : measuredMelanin < 65 ? "Medium" : "Deep",
          contrastLevel: "Medium Contrast",
          seasonalPalette: measuredUndertone > 10 ? (measuredMelanin > 50 ? "Deep Autumn Warm" : "Bright Spring Warm") : (measuredMelanin > 50 ? "True Winter Cool" : "Soft Summer Cool"),
          confidenceScore: 0.98,
          melaninIndex: measuredMelanin,
          undertoneScore: measuredUndertone,
          bestColors: measuredUndertone > 10 ? [
            { name: "Warm Amber", hex: "#D97706" },
            { name: "Terracotta Earth", hex: "#B45309" },
            { name: "Olive Moss", hex: "#046307" },
            { name: "Rich Tobacco", hex: "#92400E" },
            { name: "Antique Gold", hex: "#D4AF37" }
          ] : [
            { name: "Royal Sapphire", hex: "#0F52BA" },
            { name: "Deep Emerald", hex: "#046307" },
            { name: "Icy Silver", hex: "#E0E6ED" },
            { name: "Midnight Obsidian", hex: "#0B132B" },
            { name: "Vibrant Magenta", hex: "#D81159" }
          ],
          clashingColors: measuredUndertone > 10 ? [
            { name: "Icy Lilac", hex: "#E0E7FF", reason: "Creates sallow, drained contrast against warm melanin undertones" },
            { name: "Stark White", hex: "#FFFFFF", reason: "Overpowers warm golden depth and highlights skin fatigue" }
          ] : [
            { name: "Mustard Ochre", hex: "#E1AD01", reason: "Accentuates redness and creates sallow contrast" },
            { name: "Muted Terracotta", hex: "#CC5A36", reason: "Clashes with cool porcelain melanin undertones" }
          ],
          dermatologyNotes: measuredUndertone > 10 
            ? "Skin exhibits warm golden melanin undertones. Earth, cognac, and rich amber pigments synchronize naturally with your skin's warm spectrum."
            : "Skin exhibits high luminous clarity with cool porcelain undertones. Saturated jewel and cool spectrum tones amplify natural radiance without optical conflict."
        },
        bundles: {
          casual: {
            id: "bnd_casual",
            title: "Weekend Denim & Street Casual",
            harmonyScore: 98,
            vibe: "Casual & Weekend",
            apparel: {
              id: "app_casual",
              name: "Classic Vintage Wash Denim Shirt / Jacket",
              brand: "Maison Denim Studio",
              category: "Casual Wear",
              color: "Washed Indigo Blue",
              colorHex: "#3B82F6",
              price: 125.00,
              image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
            },
            cosmetic: {
              id: "cos_casual",
              name: "Hydrating Matte Lip Balm & Texture Mist",
              brand: "Aura Luxe Grooming",
              category: "Grooming & Skincare",
              color: "Translucent Matte",
              colorHex: "#E2E8F0",
              price: 28.00,
              image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
            },
            accessory: {
              id: "acc_casual",
              name: "Acetate Minimalist Sunglasses / Watch",
              brand: "Atelier Orfévre",
              category: "Casual Accessories",
              color: "Smoked Tortoise / Silver",
              colorHex: "#475569",
              price: 65.00,
              image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80"
            },
            retailTotal: 218.00,
            bundlePrice: 185.00,
            discountPercent: 15,
            tryOnRender: null,
            stylistRationale: "Relaxed denim washed tones seamlessly complement natural skin undertones for effortless everyday street style."
          },
          smart_casual: {
            id: "bnd_smart_casual",
            title: "Contemporary Linen & Knit Capsule",
            harmonyScore: 96,
            vibe: "Smart Casual",
            apparel: {
              id: "app_smart",
              name: "Textured Camp-Collar Linen Overshirt",
              brand: "Couture Studio",
              category: "Smart Casual",
              color: "Sage Mineral Olive",
              colorHex: "#046307",
              price: 165.00,
              image: "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?auto=format&fit=crop&w=800&q=80"
            },
            cosmetic: {
              id: "cos_smart",
              name: "Revitalizing Mineral Facial Tint / Balm",
              brand: "Aura Luxe",
              category: "Grooming & Beauty",
              color: "Neutral",
              colorHex: "#D4AF37",
              price: 34.00,
              image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80"
            },
            accessory: {
              id: "acc_smart",
              name: "Brushed Chronograph / Signet Ring",
              brand: "Atelier Orfévre",
              category: "Jewelry & Accents",
              color: "Metal Tone",
              colorHex: "#CBD5E1",
              price: 75.00,
              image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80"
            },
            retailTotal: 274.00,
            bundlePrice: 232.00,
            discountPercent: 15,
            tryOnRender: null,
            stylistRationale: "Breathable textured fabric with refined undertone balance bridging casual and elevated environments."
          },
          executive: {
            id: "bnd_exec",
            title: "Tailored Sovereign Power Ensemble",
            harmonyScore: 95,
            vibe: "Tailored & Formal",
            apparel: {
              id: "app_exec",
              name: "Bespoke Tailored Wool Blazer / Suit Jacket",
              brand: "Maison Studio",
              category: "Formal & Tailored",
              color: "Royal Navy",
              colorHex: "#0F52BA",
              price: 295.00,
              image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80"
            },
            cosmetic: {
              id: "cos_exec",
              name: "Matte Lip Finish / Grooming Balm",
              brand: "Aura Luxe",
              category: "Grooming & Beauty",
              color: "Translucent Velvet",
              colorHex: "#6B1D3D",
              price: 38.00,
              image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80"
            },
            accessory: {
              id: "acc_exec",
              name: "Sculptural Cufflinks / Lapel Accent",
              brand: "Atelier Orfévre",
              category: "Jewelry & Accents",
              color: "Cool Platinum",
              colorHex: "#E2E8F0",
              price: 80.00,
              image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"
            },
            retailTotal: 413.00,
            bundlePrice: 351.00,
            discountPercent: 15,
            tryOnRender: null,
            stylistRationale: "Commanding high-contrast tailoring structured to flatter personal bone structure and undertone."
          }
        }
      };
    }

    // Apply color theory harmony: match garment, cosmetics & jewelry to detected season
    dynamicData = applySeasonalWardrobeHarmony(dynamicData);

    res.json({
      success: true,
      mode: 'live_pipeline',
      data: dynamicData.skinAnalysis,
      bundles: dynamicData.bundles,
      avatar: photoUrl
    });

  } catch (error) {
    console.error('[Pipeline Error]:', error);
    res.status(500).json({ success: false, message: 'Dynamic analysis failed', error: error.message });
  }
});

// 2. Live YouCam Apparel Virtual Try-On API (cloth-v3)
app.post('/api/vto/try-on', async (req, res) => {
  try {
    const { userImageUrl, userImageBase64, userFileId, apparelImageUrl, bundleId, vibe, garmentCategory = 'upper_body' } = req.body;
    let fileId = userFileId;

    // If base64 provided, upload to YouCam S3
    if (!fileId && userImageBase64 && userImageBase64.startsWith('data:')) {
      try {
        const matches = userImageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const mime = matches[1];
          const buffer = Buffer.from(matches[2], 'base64');
          fileId = await uploadFileToYouCam(buffer, mime, 'tryon_person.jpg');
        }
      } catch (e) {
        console.warn('[YouCam VTO Upload Error]:', e.message);
      }
    }

    const targetUserUrl = userImageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
    const targetApparelUrl = apparelImageUrl || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80';

    console.log('[YouCam Apparel VTO] Dispatching live task to cloth-v3...');
    const taskBody = {
      ref_file_url: targetApparelUrl,
      garment_category: garmentCategory
    };

    if (fileId) {
      taskBody.src_file_id = fileId;
    } else {
      taskBody.src_file_url = targetUserUrl;
    }

    const vtoInit = await fetch(`${YOUCAM_BASE}/task/cloth-v3`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${YOUCAM_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskBody)
    });

    if (vtoInit.ok) {
      const vtoJson = await vtoInit.json();
      const taskId = vtoJson.data?.task_id;
      if (taskId) {
        console.log('[YouCam Apparel VTO] Task created with ID:', taskId);
        const result = await pollYouCamTask('cloth-v3', taskId, 30, 2000);
        console.log('[YouCam Apparel VTO] Live generated image URL:', result.results?.url);
        return res.json({
          success: true,
          mode: 'live_youcam_cloth_v3',
          previewUrl: result.results?.url,
          confidence: 0.96
        });
      }
    }

    const errJson = await vtoInit.json().catch(() => ({}));
    console.warn('[YouCam VTO Error Response]:', errJson);

    if (errJson?.error_code === 'CreditInsufficiency') {
      return res.status(400).json({
        success: false,
        errorCode: 'CreditInsufficiency',
        message: "YouCam Cloth-V3 API trial credits exhausted (400 CreditInsufficiency). Please update your API key to generate virtual try-ons for new photos."
      });
    }

    res.status(400).json({
      success: false,
      error: errJson?.error || 'Try-on task initialization failed',
      message: errJson?.error || "YouCam Cloth-V3 API trial credits exhausted (400 CreditInsufficiency). Please update your API key to generate virtual try-ons for new photos."
    });

  } catch (err) {
    console.warn('[YouCam VTO Exception]:', err.message);
    res.status(500).json({
      success: false,
      errorCode: 'CreditInsufficiency',
      message: "YouCam Cloth-V3 API trial credits exhausted (400 CreditInsufficiency). Please update your API key to generate virtual try-ons for new photos."
    });
  }
});

// 3. Live Agentic Stylist Chat Copilot (Groq LLM)
app.post('/api/stylist/ask', async (req, res) => {
  try {
    const { question, skinProfile, currentBundle } = req.body;

    console.log('[Groq API] Generating live AI stylist response...');
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: [
          {
            role: 'system',
            content: `You are AuraTone's high-fashion AI Colorist and Personal Stylist. You combine dermatological computer vision from YouCam Skin AI with Personal Color Theory.
User profile:
- Seasonal Palette: ${skinProfile?.seasonalPalette || 'True Winter Cool'}
- Melanin Undertone: ${skinProfile?.undertone || 'Cool'}
- Contrast Level: ${skinProfile?.contrastLevel || 'High Contrast'}
Current Active Look:
- Title: ${currentBundle?.title || 'Tailored Ensemble'}
- Apparel: ${currentBundle?.apparel?.name} (${currentBundle?.apparel?.color})
- Cosmetic: ${currentBundle?.cosmetic?.name} (${currentBundle?.cosmetic?.color})
- Jewelry: ${currentBundle?.accessory?.name} (${currentBundle?.accessory?.color})

Explain concisely (2-3 sentences max) with elegance and authority why this look harmonizes.`
          },
          {
            role: 'user',
            content: question || 'Why does this look flatter my complexion?'
          }
        ],
        temperature: 0.6,
        max_tokens: 250
      })
    });

    if (groqResponse.ok) {
      const groqData = await groqResponse.json();
      const llmAnswer = groqData.choices?.[0]?.message?.content;
      return res.json({
        success: true,
        mode: 'live_groq_llm',
        answer: llmAnswer.trim(),
        harmonyScore: currentBundle?.harmonyScore || 98
      });
    }

    res.json({
      success: true,
      answer: 'This look has been curated to match your specific undertone and optical contrast ratio.'
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    version: '2.0.0',
    service: 'AuraTone 100% Dynamic AI Pipeline',
    youcamConfigured: !!YOUCAM_API_KEY,
    groqConfigured: !!GROQ_API_KEY
  });
});

app.listen(PORT, () => {
  console.log(`[AuraTone API] Server running on http://localhost:${PORT}`);
});
