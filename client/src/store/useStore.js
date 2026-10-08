import { create } from 'zustand';

export const useStore = create((set, get) => ({
  // App Phase: 'ONBOARDING' | 'SCANNING' | 'DIAGNOSTIC' | 'SHOWCASE'
  phase: 'ONBOARDING',
  setPhase: (phase) => set({ phase }),

  // User input & persona
  personas: [],
  selectedPersona: null,
  userImage: null,
  userName: 'Guest Explorer',
  
  // Analysis results
  skinAnalysis: null,
  originalSkinAnalysis: null,
  selectedVibe: 'casual', // 'casual' | 'smart_casual' | 'executive'

  // Curated Wardrobe & VTO
  activeBundle: null,
  availableBundles: [],
  isComparingBeforeAfter: false,
  comparisonSliderPos: 50, // 0 to 100%

  // Cart & Checkout
  cart: [],
  isCartOpen: false,
  selectedBundleItems: {
    apparel: true,
    cosmetic: true,
    accessory: true
  },

  // Stylist Drawer & Chat
  isStylistDrawerOpen: false,
  isDossierOpen: false,
  chatMessages: [
    {
      sender: 'stylist',
      text: 'Greetings. I am your AuraTone AI Colorist. Select any look or ask me why specific silhouettes and pigments harmonize with your undertone.'
    }
  ],

  // Actions
  setPersonas: (personas) => set({ personas }),
  
  selectPersona: (persona) => set({
    selectedPersona: persona,
    userImage: persona.avatar,
    userName: persona.name,
    skinAnalysis: null,
    activeBundle: null,
    availableBundles: []
  }),

  setUserImage: (imgUrl, name = 'Custom Explorer') => set({
    userImage: imgUrl,
    userName: name,
    selectedPersona: null,
    skinAnalysis: null,
    activeBundle: null,
    availableBundles: []
  }),

  setSkinAnalysis: (analysis) => set({ 
    skinAnalysis: analysis,
    originalSkinAnalysis: analysis ? JSON.parse(JSON.stringify(analysis)) : null
  }),

  updateUndertoneScore: (score) => {
    const state = get();
    if (!state.skinAnalysis) return;

    const undertoneScore = Math.max(-85, Math.min(85, score));
    const isWarm = undertoneScore > 10;
    const isCool = undertoneScore < -10;
    const undertoneLabel = isWarm ? 'Warm Golden' : isCool ? 'Cool (Pink/Blue sub-pigment)' : 'Neutral Chromatic Balance';
    const melanin = state.skinAnalysis.melaninIndex || 40;
    
    const season = isWarm
      ? (melanin > 50 ? 'Deep Autumn Warm' : 'Bright Spring Warm')
      : (melanin > 50 ? 'True Winter Cool' : 'Soft Summer Cool');

    let notes = '';
    if (isWarm) {
      notes = `High warm-spectrum reflectance (${undertoneScore > 0 ? '+' : ''}${undertoneScore}) indicates carotenoid and pheomelanin dominance. Golden, earth, and rich amber pigments synchronize naturally with your skin's warm frequencies without washing out complexion vitality.`;
    } else if (isCool) {
      notes = `High luminance combined with cool sub-pigments (${undertoneScore}) indicates low pheomelanin density, allowing cool, high-contrast jewel hues to reflect light without causing undertone muddiness. Opt for blue-rich tones to enhance radiance.`;
    } else {
      notes = `Balanced chromatic equilibrium (${undertoneScore}) indicates near-equal melanin and hemoglobin distribution. Neutral pigments, soft sage, muted slate, and taupe bridge warm and cool frequencies seamlessly.`;
    }

    const paletteMap = {
      'Deep Autumn Warm': [
        { name: 'Warm Amber', hex: '#D97706' },
        { name: 'Terracotta Earth', hex: '#B45309' },
        { name: 'Olive Moss', hex: '#046307' },
        { name: 'Rich Tobacco', hex: '#92400E' },
        { name: 'Antique Gold', hex: '#D4AF37' }
      ],
      'Bright Spring Warm': [
        { name: 'Peach Coral', hex: '#FB923C' },
        { name: 'Warm Ivory', hex: '#FEF3C7' },
        { name: 'Golden Honey', hex: '#F59E0B' },
        { name: 'Fresh Pistachio', hex: '#84CC16' },
        { name: 'Warm Terracotta', hex: '#EA580C' }
      ],
      'True Winter Cool': [
        { name: 'Royal Sapphire', hex: '#0F52BA' },
        { name: 'Deep Emerald', hex: '#046307' },
        { name: 'Icy Silver', hex: '#E0E6ED' },
        { name: 'Midnight Obsidian', hex: '#0B132B' },
        { name: 'Vibrant Magenta', hex: '#D81159' }
      ],
      'Soft Summer Cool': [
        { name: 'Muted Slate', hex: '#64748B' },
        { name: 'Rosewood Mauve', hex: '#BE185D' },
        { name: 'Soft Chambray', hex: '#60A5FA' },
        { name: 'Mineral Sage', hex: '#475569' },
        { name: 'Sterling Silver', hex: '#CBD5E1' }
      ]
    };

    const clashingMap = {
      'Deep Autumn Warm': [
        { name: 'Icy Lilac', hex: '#E0E7FF', reason: 'Creates sallow, drained contrast against warm melanin undertones' },
        { name: 'Stark White', hex: '#FFFFFF', reason: 'Overpowers warm golden depth and highlights skin fatigue' }
      ],
      'Bright Spring Warm': [
        { name: 'Dull Charcoal', hex: '#374151', reason: 'Mutes lively golden-peach undertones and dampens radiance' },
        { name: 'Cold Fuchsia', hex: '#BE185D', reason: 'Competes abrasively with warm yellow-based surface tones' }
      ],
      'True Winter Cool': [
        { name: 'Mustard Ochre', hex: '#E1AD01', reason: 'Accentuates redness and creates sallow contrast' },
        { name: 'Muted Terracotta', hex: '#CC5A36', reason: 'Clashes with cool porcelain melanin undertones' }
      ],
      'Soft Summer Cool': [
        { name: 'Neon Orange', hex: '#FF6B00', reason: 'Harsh saturation overpowers delicate cool sub-surface tones' },
        { name: 'Warm Brass', hex: '#B45309', reason: 'Creates yellow color-cast against cool pink-blue undertones' }
      ]
    };

    const bestColors = paletteMap[season] || paletteMap['True Winter Cool'];
    const clashingColors = clashingMap[season] || clashingMap['True Winter Cool'];

    const seasonKey = isWarm ? (melanin > 50 ? 'autumn' : 'spring') : (melanin > 50 ? 'winter' : 'summer');
    const wardrobePresets = {
      autumn: {
        exec: { name: "Bespoke Camel Wool Tailored Blazer", color: "Warm Camel Tan", hex: "#C19A6B", img: "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&w=800&q=80" },
        smart: { name: "Textured Moss Linen Camp-Collar Overshirt", color: "Earthy Forest Olive", hex: "#046307", img: "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?auto=format&fit=crop&w=800&q=80" },
        casual: { name: "Rugged Tobacco Suede Overshirt / Jacket", color: "Rich Tobacco Brown", hex: "#92400E", img: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80" }
      },
      winter: {
        exec: { name: "Bespoke Tailored Wool Blazer / Suit Jacket", color: "Royal Navy", hex: "#0F52BA", img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80" },
        smart: { name: "Midnight Cobalt Minimalist Overshirt", color: "Midnight Cobalt", hex: "#1E3A8A", img: "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?auto=format&fit=crop&w=800&q=80" },
        casual: { name: "Classic Vintage Wash Denim Jacket", color: "Washed Indigo Blue", hex: "#2563EB", img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80" }
      },
      spring: {
        exec: { name: "Tailored Cream Ivory Wool Modern Blazer", color: "Warm Cream Ivory", hex: "#FEF3C7", img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80" },
        smart: { name: "Terracotta Camp-Collar Breathable Linen Shirt", color: "Bright Terracotta", hex: "#EA580C", img: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80" },
        casual: { name: "Butter Honey Relaxed Overshirt", color: "Warm Butter Honey", hex: "#FBBF24", img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80" }
      },
      summer: {
        exec: { name: "Tailored Slate Gray Minimalist Blazer", color: "Muted Slate Gray", hex: "#64748B", img: "https://images.unsplash.com/photo-1555069519-127aadedf1ee?auto=format&fit=crop&w=800&q=80" },
        smart: { name: "Washed Mineral Sage Textured Overshirt", color: "Soft Mineral Sage", hex: "#475569", img: "https://images.unsplash.com/photo-1598808503746-f34c53b9323e?auto=format&fit=crop&w=800&q=80" },
        casual: { name: "Soft Sky Chambray Relaxed Overshirt", color: "Soft Sky Blue", hex: "#60A5FA", img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80" }
      }
    };

    const targetPreset = wardrobePresets[seasonKey];
    let updatedBundles = state.availableBundles;
    if (targetPreset && updatedBundles.length > 0) {
      updatedBundles = updatedBundles.map(b => {
        const copy = { ...b, apparel: { ...b.apparel } };
        if (b.id?.includes('exec') || b.vibe?.toLowerCase()?.includes('formal') || b.vibe?.toLowerCase()?.includes('tailor')) {
          copy.apparel.name = targetPreset.exec.name;
          copy.apparel.color = targetPreset.exec.color;
          copy.apparel.colorHex = targetPreset.exec.hex;
          copy.apparel.image = targetPreset.exec.img;
        } else if (b.id?.includes('smart') || b.vibe?.toLowerCase()?.includes('smart')) {
          copy.apparel.name = targetPreset.smart.name;
          copy.apparel.color = targetPreset.smart.color;
          copy.apparel.colorHex = targetPreset.smart.hex;
          copy.apparel.image = targetPreset.smart.img;
        } else {
          copy.apparel.name = targetPreset.casual.name;
          copy.apparel.color = targetPreset.casual.color;
          copy.apparel.colorHex = targetPreset.casual.hex;
          copy.apparel.image = targetPreset.casual.img;
        }
        return copy;
      });
    }

    const currentVibe = state.selectedVibe || 'casual';
    const active = updatedBundles.find(b => b.id?.includes(currentVibe) || b.vibe?.toLowerCase()?.includes(currentVibe)) || updatedBundles[0];

    set({
      skinAnalysis: {
        ...state.skinAnalysis,
        undertoneScore,
        undertone: undertoneLabel,
        seasonalPalette: season,
        dermatologyNotes: notes,
        bestColors,
        clashingColors
      },
      availableBundles: updatedBundles,
      activeBundle: active || state.activeBundle
    });
  },

  resetUndertone: () => {
    const state = get();
    if (state.originalSkinAnalysis) {
      set({ skinAnalysis: JSON.parse(JSON.stringify(state.originalSkinAnalysis)) });
    }
  },

  
  setDynamicBundles: (bundles) => {
    const bundleList = Object.values(bundles || {});
    const currentVibe = get().selectedVibe || 'casual';
    set({
      availableBundles: bundleList,
      activeBundle: bundles[currentVibe] || bundles['casual'] || bundleList[0] || null
    });
  },

  updateActiveBundleTryOn: (url) => set((state) => {
    if (!state.activeBundle) return {};
    const updated = { ...state.activeBundle, tryOnRender: url };
    const updatedBundles = state.availableBundles.map(b => b.id === updated.id ? updated : b);
    return {
      activeBundle: updated,
      availableBundles: updatedBundles
    };
  }),

  setVibe: (vibe) => {
    const { availableBundles } = get();
    const match = availableBundles.find(b => 
      b.vibe?.toLowerCase()?.includes(vibe) || 
      b.id?.toLowerCase()?.includes(vibe)
    );
    set({
      selectedVibe: vibe,
      activeBundle: match || availableBundles[0] || null
    });
  },

  setActiveBundle: (bundle) => set({ activeBundle: bundle }),
  
  toggleCompare: () => set((state) => ({ isComparingBeforeAfter: !state.isComparingBeforeAfter })),
  setComparisonSliderPos: (pos) => set({ comparisonSliderPos: pos }),

  toggleBundleItem: (itemKey) => set((state) => ({
    selectedBundleItems: {
      ...state.selectedBundleItems,
      [itemKey]: !state.selectedBundleItems[itemKey]
    }
  })),

  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  
  addBundleToCart: () => {
    const { activeBundle, selectedBundleItems } = get();
    if (!activeBundle) return;

    const itemsToAdd = [];
    if (selectedBundleItems.apparel) itemsToAdd.push(activeBundle.apparel);
    if (selectedBundleItems.cosmetic) itemsToAdd.push(activeBundle.cosmetic);
    if (selectedBundleItems.accessory) itemsToAdd.push(activeBundle.accessory);

    const isFullBundle = selectedBundleItems.apparel && selectedBundleItems.cosmetic && selectedBundleItems.accessory;
    
    const cartEntry = {
      bundleId: activeBundle.id,
      bundleTitle: activeBundle.title,
      items: itemsToAdd,
      isFullBundle,
      price: isFullBundle ? activeBundle.bundlePrice : itemsToAdd.reduce((acc, i) => acc + i.price, 0),
      discountApplied: isFullBundle ? (activeBundle.retailTotal - activeBundle.bundlePrice) : 0,
      image: activeBundle.tryOnRender
    };

    set((state) => ({
      cart: [...state.cart, cartEntry],
      isCartOpen: true
    }));
  },

  clearCart: () => set({ cart: [] }),

  toggleStylistDrawer: () => set((state) => ({ isStylistDrawerOpen: !state.isStylistDrawerOpen })),
  toggleDossier: () => set((state) => ({ isDossierOpen: !state.isDossierOpen })),

  addChatMessage: (msg) => set((state) => ({
    chatMessages: [...state.chatMessages, msg]
  })),

  resetSession: () => set({
    phase: 'ONBOARDING',
    selectedPersona: null,
    userImage: null,
    skinAnalysis: null,
    activeBundle: null,
    isCartOpen: false
  })
}));
