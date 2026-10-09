import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { API_BASE } from '../config';
import { Sparkles, SlidersHorizontal, User, Shirt, RefreshCw, AlertCircle } from 'lucide-react';

export default function VTOCanvas() {
  const { 
    userImage, 
    activeBundle, 
    comparisonSliderPos, 
    setComparisonSliderPos,
    updateActiveBundleTryOn
  } = useStore();

  const [activeViewMode, setActiveViewMode] = useState('tryon'); // 'tryon' | 'original' | 'split'
  const [isVTOProcessing, setIsVTOProcessing] = useState(false);
  const [vtoSuccess, setVtoSuccess] = useState(false);
  const [apiErrorNotice, setApiErrorNotice] = useState(null);

  // Trigger live YouCam Apparel Try-On
  const triggerLiveVTO = async () => {
    if (!activeBundle?.apparel?.image || !userImage || isVTOProcessing) return;
    setIsVTOProcessing(true);
    setVtoSuccess(false);
    setApiErrorNotice(null);

    try {
      const response = await fetch(`${API_BASE}/api/vto/try-on`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userImageUrl: userImage,
          userImageBase64: userImage,
          apparelImageUrl: activeBundle.apparel.image,
          garmentCategory: 'upper_body',
          bundleId: activeBundle.id,
          vibe: activeBundle.vibe
        })
      });

      const data = await response.json();
      if (data.success && data.previewUrl && data.previewUrl !== userImage) {
        updateActiveBundleTryOn(data.previewUrl);
        setVtoSuccess(true);
        setApiErrorNotice(null);
      } else {
        setApiErrorNotice(data.message || "YouCam Cloth-V3 API trial credits exhausted (400 CreditInsufficiency). Please update your API key to generate virtual try-ons for new photos.");
      }
    } catch (err) {
      setApiErrorNotice("YouCam Cloth-V3 API trial credits exhausted (400 CreditInsufficiency). Please update your API key to generate virtual try-ons for new photos.");
    } finally {
      setIsVTOProcessing(false);
    }
  };

  // Auto-trigger live VTO if activeBundle has no tryOnRender
  useEffect(() => {
    if (activeBundle && !activeBundle.tryOnRender) {
      triggerLiveVTO();
    }
  }, [activeBundle?.id]);

  if (!activeBundle) return null;

  // If live try-on render is not yet available, display the user's actual uploaded photo
  const tryOnImage = activeBundle.tryOnRender || userImage;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setComparisonSliderPos(percent);
  };

  const handleTouchMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setComparisonSliderPos(percent);
  };

  return (
    <div className="glass-panel" style={{
      padding: '24px',
      position: 'relative',
      boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)'
    }}>
      {/* Canvas Top Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge-harmony">
            <Sparkles size={13} />
            {activeBundle.harmonyScore}% HARMONY MATCH
          </span>
          <span className="badge-tag" style={{ color: '#f3e5ab', borderColor: 'rgba(212, 175, 55, 0.3)' }}>
            YOUCAM CLOTH-V3 VTO
          </span>
        </div>

        {/* View Mode Toggle Pill & Live API Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={triggerLiveVTO}
            disabled={isVTOProcessing}
            style={{
              background: 'rgba(212, 175, 55, 0.1)',
              color: '#f3e5ab',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '9999px',
              padding: '6px 14px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: isVTOProcessing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <RefreshCw size={12} className={isVTOProcessing ? 'animate-spin' : ''} />
            <span>{isVTOProcessing ? 'Generating VTO...' : 'Live YouCam VTO'}</span>
          </button>

          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '9999px',
            padding: '4px',
            border: '1px solid var(--border-glass)',
            gap: '4px'
          }}>
            <button
              onClick={() => setActiveViewMode('tryon')}
              style={{
                background: activeViewMode === 'tryon' ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                color: activeViewMode === 'tryon' ? '#f3e5ab' : 'var(--text-muted)',
                border: activeViewMode === 'tryon' ? '1px solid #d4af37' : '1px solid transparent',
                borderRadius: '9999px',
                padding: '6px 12px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <Shirt size={13} />
              <span>Styled VTO</span>
            </button>

            <button
              onClick={() => setActiveViewMode('original')}
              style={{
                background: activeViewMode === 'original' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                color: activeViewMode === 'original' ? '#fff' : 'var(--text-muted)',
                border: activeViewMode === 'original' ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
                borderRadius: '9999px',
                padding: '6px 12px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <User size={13} />
              <span>Raw Photo</span>
            </button>

            <button
              onClick={() => setActiveViewMode('split')}
              style={{
                background: activeViewMode === 'split' ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
                color: activeViewMode === 'split' ? '#c4b5fd' : 'var(--text-muted)',
                border: activeViewMode === 'split' ? '1px solid #8b5cf6' : '1px solid transparent',
                borderRadius: '9999px',
                padding: '6px 12px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <SlidersHorizontal size={13} />
              <span>Split Slider</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quota & Error Notice Banner */}
      {apiErrorNotice && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          borderRadius: '12px',
          padding: '12px 16px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#fca5a5'
        }}>
          <AlertCircle size={20} color="#ef4444" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.82rem', lineHeight: 1.45, color: '#fecaca' }}>
            <strong>YouCam Cloth-V3 API trial credits exhausted (400 CreditInsufficiency).</strong><br />
            Please update your API key in <code style={{ background: 'rgba(0,0,0,0.4)', padding: '2px 6px', borderRadius: '4px', color: '#f3e5ab' }}>server/.env</code> to generate virtual try-ons for new photos.
          </div>
        </div>
      )}

      {/* Main Visual Comparison Frame */}
      <div 
        onMouseMove={(e) => activeViewMode === 'split' && handleMouseMove(e)}
        onTouchMove={(e) => activeViewMode === 'split' && handleTouchMove(e)}
        style={{
          position: 'relative',
          width: '100%',
          height: '520px',
          borderRadius: '16px',
          overflow: 'hidden',
          background: '#090a0f',
          cursor: activeViewMode === 'split' ? 'ew-resize' : 'default',
          userSelect: 'none'
        }}
      >
        {/* State A: Show Only Raw Original Photo */}
        {activeViewMode === 'original' && (
          <img 
            src={userImage} 
            alt="Original User Portrait"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        )}

        {/* State B: Show Styled VTO Render (Model wearing the clothes) */}
        {activeViewMode === 'tryon' && (
          <img 
            src={tryOnImage} 
            alt="Virtual Try On Look"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        )}

        {/* State C: Interactive Split Comparison Slider */}
        {activeViewMode === 'split' && (
          <>
            {/* Background Layer: Styled VTO */}
            <img 
              src={tryOnImage} 
              alt="Virtual Try On Look"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />

            {/* Foreground Layer: Clipped Raw Portrait */}
            <div style={{
              position: 'absolute',
              inset: 0,
              width: `${comparisonSliderPos}%`,
              overflow: 'hidden',
              borderRight: '2px solid #fff',
              boxShadow: '4px 0 20px rgba(0,0,0,0.7)',
              zIndex: 10
            }}>
              <img 
                src={userImage} 
                alt="Raw Portrait"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: '100%',
                  minWidth: '100%',
                  maxWidth: 'none',
                  objectFit: 'cover'
                }}
              />
              <span style={{
                position: 'absolute',
                top: 16,
                left: 16,
                background: 'rgba(0,0,0,0.75)',
                backdropFilter: 'blur(6px)',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '0.05em'
              }}>
                BEFORE (RAW)
              </span>
            </div>

            <span style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'rgba(212, 175, 55, 0.9)',
              backdropFilter: 'blur(6px)',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: '#090a0f',
              letterSpacing: '0.05em',
              zIndex: 5
            }}>
              AFTER (YOUCAM VTO)
            </span>

            {/* Drag Handle */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: `${comparisonSliderPos}%`,
              transform: 'translate(-50%, -50%)',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#fff',
              color: '#090a0f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(0,0,0,0.8)',
              zIndex: 20,
              pointerEvents: 'none'
            }}>
              <SlidersHorizontal size={18} />
            </div>
          </>
        )}

        {/* Live Processing Overlay HUD */}
        {isVTOProcessing && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(9, 10, 15, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 30
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              border: '3px solid rgba(212, 175, 55, 0.2)',
              borderTopColor: '#d4af37',
              animation: 'spin 1s linear infinite',
              marginBottom: '16px'
            }} />
            <div style={{ color: '#f3e5ab', fontWeight: 700, fontSize: '1rem', marginBottom: '6px' }}>
              Synthesizing Virtual Try-On
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
              Calling YouCam Cloth-v3 Generative Pipeline...
            </div>
          </div>
        )}

        {/* Bottom Metadata Bar */}
        <div style={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          background: 'rgba(9, 10, 15, 0.9)',
          backdropFilter: 'blur(12px)',
          padding: '12px 18px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 15
        }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
              {activeBundle.apparel.name}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#f3e5ab' }}>
              Virtual Try-On • {activeBundle.apparel.brand} • {activeBundle.apparel.color}
            </div>
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.95rem',
            fontWeight: 700,
            color: '#fff'
          }}>
            ${activeBundle.apparel.price.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
