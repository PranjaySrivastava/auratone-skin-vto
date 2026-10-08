import React from 'react';
import { useStore } from '../store/useStore';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Palette, Compass } from 'lucide-react';

export default function ColorReport() {
  const { 
    skinAnalysis, 
    userImage, 
    setPhase, 
    selectedVibe, 
    setVibe, 
    updateUndertoneScore, 
    resetUndertone, 
    originalSkinAnalysis 
  } = useStore();

  if (!skinAnalysis) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center', padding: '32px' }}>
        <div className="glass-panel" style={{ padding: '40px' }}>
          <Sparkles size={36} color="#d4af37" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ color: '#fff', marginBottom: '8px' }}>No Color Diagnostic Available</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.95rem' }}>
            Please select a sample portrait or capture a photo to initiate live YouCam Skin AI analysis.
          </p>
          <button className="btn-primary" onClick={() => setPhase('ONBOARDING')} style={{ margin: '0 auto' }}>
            Go to Capture Studio
          </button>
        </div>
      </div>
    );
  }

  const vibes = [
    { id: 'casual', label: 'Casual & Weekend', desc: 'Denim jackets, streetwear tees, relaxed overshirts' },
    { id: 'smart_casual', label: 'Smart Casual', desc: 'Textured linen, knit polos, effortless chic' },
    { id: 'executive', label: 'Tailored & Formal', desc: 'Bespoke blazers, suitwear, commanding power' }
  ];

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 24px',
      display: 'grid',
      gridTemplateColumns: '0.85fr 1.15fr',
      gap: '40px',
      alignItems: 'start'
    }}>
      {/* Left Column: Portrait & Undertone Compass */}
      <div>
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            position: 'relative',
            width: '260px',
            height: '320px',
            margin: '0 auto 20px',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '2px solid rgba(212, 175, 55, 0.4)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.5)'
          }}>
            <img 
              src={userImage} 
              alt="Analyzed Subject"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              right: 12,
              background: 'rgba(9, 10, 15, 0.85)',
              backdropFilter: 'blur(8px)',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              color: '#f3e5ab',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}>
              <ShieldCheck size={14} color="#10b981" />
              Verified by YouCam Skin AI
            </div>
          </div>

          <div className="badge-harmony" style={{ marginBottom: '8px', fontSize: '0.85rem' }}>
            <Sparkles size={14} />
            {skinAnalysis.seasonalPalette}
          </div>

          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Confidence Match: <strong>{(skinAnalysis.confidenceScore * 100).toFixed(0)}%</strong>
          </div>
        </div>

        {/* Melanin Undertone Axis (Interactive & Calibrated) */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={18} color="#d4af37" />
              <h3 style={{ fontSize: '1rem', color: '#fff', margin: 0 }}>Melanin Undertone Axis</h3>
            </div>
            
            {/* Live Undertone Spectrum Tag */}
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '20px',
              background: skinAnalysis.undertoneScore > 10 
                ? 'rgba(245, 158, 11, 0.2)' 
                : skinAnalysis.undertoneScore < -10 
                  ? 'rgba(56, 189, 248, 0.2)' 
                  : 'rgba(203, 213, 225, 0.2)',
              color: skinAnalysis.undertoneScore > 10 
                ? '#fbbf24' 
                : skinAnalysis.undertoneScore < -10 
                  ? '#38bdf8' 
                  : '#e2e8f0',
              border: `1px solid ${skinAnalysis.undertoneScore > 10 ? 'rgba(245, 158, 11, 0.4)' : skinAnalysis.undertoneScore < -10 ? 'rgba(56, 189, 248, 0.4)' : 'rgba(203, 213, 225, 0.3)'}`
            }}>
              {skinAnalysis.undertoneScore > 10 
                ? `Warm Golden (+${skinAnalysis.undertoneScore})` 
                : skinAnalysis.undertoneScore < -10 
                  ? `Cool Blue/Pink (${skinAnalysis.undertoneScore})` 
                  : `Neutral Equilibrium (${skinAnalysis.undertoneScore})`}
            </span>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <span style={{ color: skinAnalysis.undertoneScore < -10 ? '#38bdf8' : 'inherit', fontWeight: skinAnalysis.undertoneScore < -10 ? 600 : 400 }}>
                Cool (Pink/Blue)
              </span>
              <span style={{ color: Math.abs(skinAnalysis.undertoneScore) <= 10 ? '#cbd5e1' : 'inherit', fontWeight: Math.abs(skinAnalysis.undertoneScore) <= 10 ? 600 : 400 }}>
                Neutral
              </span>
              <span style={{ color: skinAnalysis.undertoneScore > 10 ? '#f59e0b' : 'inherit', fontWeight: skinAnalysis.undertoneScore > 10 ? 600 : 400 }}>
                Warm (Golden/Peach)
              </span>
            </div>

            {/* Interactive Slider Input */}
            <div style={{ position: 'relative', width: '100%', padding: '6px 0' }}>
              <input
                type="range"
                min="-85"
                max="85"
                step="1"
                value={skinAnalysis.undertoneScore}
                onChange={(e) => updateUndertoneScore(parseInt(e.target.value, 10))}
                className="undertone-slider"
                style={{ width: '100%' }}
              />
            </div>

            {/* Interactive hint & reset control */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                💡 Drag slider to adjust or simulate undertone shifts
              </span>
              {originalSkinAnalysis && originalSkinAnalysis.undertoneScore !== skinAnalysis.undertoneScore && (
                <button
                  onClick={resetUndertone}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#d4af37',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: 0
                  }}
                >
                  Reset AI Value ({originalSkinAnalysis.undertoneScore})
                </button>
              )}
            </div>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '16px', lineHeight: 1.5, background: 'rgba(255,255,255,0.02)', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <strong style={{ color: '#fff' }}>Dermatological Finding:</strong> {skinAnalysis.dermatologyNotes}
          </div>
        </div>

      </div>

      {/* Right Column: Palette Matrix & Vibe Selection */}
      <div>
        <div className="glass-panel" style={{ padding: '32px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Palette size={20} color="#8b5cf6" />
            <h2 style={{ fontSize: '1.6rem', color: '#fff' }}>Your Harmonious Palette Matrix</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
            These pigment frequencies reflect light complementarily onto your undertones, reducing appearance fatigue and enhancing radiance.
          </p>

          {/* Best Swatches */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} />
              Recommended Wardrobe Resonances
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
              {skinAnalysis.bestColors.map((c, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '100%',
                    height: '56px',
                    borderRadius: '12px',
                    backgroundColor: c.hex,
                    boxShadow: `0 4px 16px ${c.hex}33`,
                    border: '1px solid rgba(255,255,255,0.2)',
                    marginBottom: '6px'
                  }} />
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff' }}>{c.name}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{c.hex}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Clashing Swatches */}
          <div style={{
            background: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '16px',
            padding: '16px 20px',
            marginBottom: '28px'
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={15} />
              Dissonant Colors to Avoid
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {skinAnalysis.clashingColors.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: c.hex,
                    flexShrink: 0,
                    border: '1px solid rgba(255,255,255,0.1)'
                  }} />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff' }}>{c.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{c.reason}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Occasion / Vibe Selector */}
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
              Select Styling Occasion:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
              {vibes.map((v) => {
                const isSelected = selectedVibe === v.id;
                return (
                  <div
                    key={v.id}
                    onClick={() => setVibe(v.id)}
                    style={{
                      background: isSelected ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                      border: isSelected ? '2px solid var(--gold-primary)' : '1px solid var(--border-glass)',
                      borderRadius: '14px',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: isSelected ? '#f3e5ab' : '#fff', marginBottom: '4px' }}>
                      {v.label}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {v.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Transition Button */}
          <button 
            className="btn-primary" 
            onClick={() => setPhase('SHOWCASE')}
            style={{ width: '100%', padding: '16px', justifyContent: 'center', fontSize: '1.05rem' }}
          >
            <Sparkles size={18} />
            <span>Generate YouCam VTO Wardrobe Look</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
