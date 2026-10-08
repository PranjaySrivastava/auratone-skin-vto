import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Sparkles, Scan, Activity } from 'lucide-react';

export default function ScanningOverlay() {
  const { userImage, selectedPersona, setSkinAnalysis, setDynamicBundles, setPhase } = useStore();
  const [telemetryIndex, setTelemetryIndex] = useState(0);

  const telemetrySteps = [
    'Connecting to YouCam Skin AI API pipeline...',
    'Detecting facial landmarks & melanin luminance index...',
    'Evaluating undertone frequency (Warm vs. Cool sub-pigment)...',
    'Synthesizing Personal Color Matrix (Seasonal Archetype)...',
    'Agentic Stylist matching luxury apparel & cosmetic palettes...'
  ];

  const [scanError, setScanError] = useState(null);

  const extractClientComplexion = (imageSrc) => {
    return new Promise((resolve) => {
      if (!imageSrc) return resolve(null);
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 64;
          canvas.height = 64;
          const ctx = canvas.getContext('2d');
          // Sample center 50% face zone
          ctx.drawImage(img, img.width * 0.25, img.height * 0.2, img.width * 0.5, img.height * 0.5, 0, 0, 64, 64);
          const data = ctx.getImageData(0, 0, 64, 64).data;
          let totalR = 0, totalG = 0, totalB = 0, count = 0;
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i + 1], b = data[i + 2];
            const br = (r + g + b) / 3;
            if (br > 35 && br < 240) {
              totalR += r; totalG += g; totalB += b; count++;
            }
          }
          if (count === 0) count = 1;
          const r = totalR / count;
          const g = totalG / count;
          const b = totalB / count;

          // Warmth delta: warm skin has higher R and G relative to B
          const warmthDelta = (r - b) + 0.5 * (g - b);
          // Scale from -85 (Ultra Cool) to +85 (Ultra Warm)
          const undertoneScore = Math.max(-85, Math.min(85, Math.round(((warmthDelta - 42) / 32) * 60)));
          const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
          const melaninIndex = Math.max(12, Math.min(92, Math.round((255 - luminance) * 0.5)));

          resolve({
            detectedR: Math.round(r),
            detectedG: Math.round(g),
            detectedB: Math.round(b),
            undertoneScore,
            melaninIndex
          });
        } catch (e) {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = imageSrc;
    });
  };

  useEffect(() => {
    // Cycle telemetry strings
    const interval = setInterval(() => {
      setTelemetryIndex((prev) => (prev < telemetrySteps.length - 1 ? prev + 1 : prev));
    }, 600);

    const startTime = Date.now();

    // Call backend API for 100% dynamic live skin & bundle curation
    const runAnalysis = async () => {
      setScanError(null);
      try {
        const clientTelemetry = await extractClientComplexion(userImage);

        const response = await fetch('http://localhost:5000/api/skin/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            personaId: selectedPersona?.id,
            userImageUrl: userImage,
            imageBase64: userImage,
            clientTelemetry
          })
        });
        const result = await response.json();
        if (result.success && result.data) {
          setSkinAnalysis(result.data);
          if (result.bundles) {
            setDynamicBundles(result.bundles);
          }
          const elapsed = Date.now() - startTime;
          const remainingDelay = Math.max(0, 1800 - elapsed);
          setTimeout(() => {
            setPhase('DIAGNOSTIC');
          }, remainingDelay);
        } else {
          setScanError(result.message || 'Analysis could not be completed. Please retry.');
        }
      } catch (err) {
        console.warn('API error during scan:', err);
        setScanError('Unable to connect to live API. Please retry.');
      }
    };

    runAnalysis();

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      maxWidth: '800px',
      margin: '40px auto',
      padding: '24px',
      textAlign: 'center'
    }}>
      <div className="glass-panel" style={{
        padding: '40px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Viewport with scanning animation */}
        <div style={{
          position: 'relative',
          width: '320px',
          height: '420px',
          margin: '0 auto 32px',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 0 50px rgba(212, 175, 55, 0.25)',
          border: '2px solid rgba(212, 175, 55, 0.5)'
        }}>
          <img 
            src={userImage} 
            alt="Scanning Face"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Golden Scanning Laser Line */}
          <div className="animate-scan-laser" />

          {/* Futuristic HUD Grid Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(212,175,55,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.05) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            pointerEvents: 'none'
          }} />

          {/* Animated Target Rings */}
          <div style={{
            position: 'absolute',
            top: '35%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            border: '1px dashed rgba(212, 175, 55, 0.6)',
            animation: 'spin 12s linear infinite'
          }} />
        </div>

        {scanError ? (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '14px',
            padding: '20px',
            maxWidth: '460px',
            margin: '0 auto'
          }}>
            <p style={{ color: '#fca5a5', marginBottom: '16px', fontSize: '0.9rem' }}>{scanError}</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                className="btn-primary" 
                onClick={() => window.location.reload()}
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
              >
                Retry Scan
              </button>
              <button 
                className="btn-secondary" 
                onClick={() => setPhase('ONBOARDING')}
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
              >
                Choose Another Portrait
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Telemetry Status Bar */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(212, 175, 55, 0.1)',
              padding: '8px 20px',
              borderRadius: '9999px',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              marginBottom: '16px'
            }}>
              <Activity size={16} color="#d4af37" className="animate-pulse" />
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                color: '#f3e5ab'
              }}>
                {telemetrySteps[telemetryIndex]}
              </span>
            </div>

            <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '8px' }}>
              Calibrating Biometric Color Resonance
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Cross-referencing melanin spectrophotometry with global Personal Color matrices...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
