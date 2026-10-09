// AuraTone API Configuration
// Points to localhost in development and Render in production

export const API_BASE = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? 'http://localhost:5000' : 'https://auratone-skin-vto.onrender.com');
