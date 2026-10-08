import React from 'react';
import { useStore } from '../store/useStore';
import { Sparkles, ShoppingBag, RotateCcw, MessageSquare, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const { phase, resetSession, toggleCart, cart, toggleStylistDrawer, toggleDossier, skinAnalysis } = useStore();

  const totalCartCount = cart.reduce((count, entry) => count + entry.items.length, 0);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(9, 10, 15, 0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-glass)',
      padding: '16px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Brand Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }} onClick={resetSession}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #d4af37, #8b5cf6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(212, 175, 55, 0.3)'
        }}>
          <Sparkles size={22} color="#fff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.25rem',
              letterSpacing: '-0.03em',
              color: '#fff'
            }}>
              AURA<span className="text-gradient-gold">TONE</span>
            </span>
            <span className="badge-tag" style={{ fontSize: '0.65rem', borderColor: 'rgba(212, 175, 55, 0.3)', color: '#f3e5ab' }}>
              YOUCAM AI
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.02em' }}>
            Outfit + Skin Harmony Engine
          </span>
        </div>
      </div>

      {/* Progress Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '6px 16px',
          borderRadius: '9999px',
          border: '1px solid var(--border-glass)',
          fontSize: '0.8rem',
          fontWeight: 500
        }}>
          <span style={{
            color: phase === 'ONBOARDING' || phase === 'SCANNING' ? 'var(--gold-primary)' : 'var(--text-muted)',
            fontWeight: phase === 'ONBOARDING' || phase === 'SCANNING' ? 700 : 500
          }}>
            1. Capture
          </span>
          <span style={{ color: 'var(--border-glass)' }}>›</span>
          <span style={{
            color: phase === 'DIAGNOSTIC' ? 'var(--gold-primary)' : 'var(--text-muted)',
            fontWeight: phase === 'DIAGNOSTIC' ? 700 : 500
          }}>
            2. Color Diagnosis
          </span>
          <span style={{ color: 'var(--border-glass)' }}>›</span>
          <span style={{
            color: phase === 'SHOWCASE' ? 'var(--gold-primary)' : 'var(--text-muted)',
            fontWeight: phase === 'SHOWCASE' ? 700 : 500
          }}>
            3. VTO & Wardrobe
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {phase !== 'ONBOARDING' && (
          <button 
            className="btn-secondary" 
            onClick={resetSession}
            title="Start Over"
            style={{ padding: '8px 14px', fontSize: '0.8rem' }}
          >
            <RotateCcw size={15} />
            <span>New Scan</span>
          </button>
        )}

        {skinAnalysis && (
          <button 
            className="btn-secondary"
            onClick={toggleDossier}
            style={{ borderColor: 'rgba(212, 175, 55, 0.4)', color: '#f3e5ab' }}
          >
            <Sparkles size={15} color="#d4af37" />
            <span>Style Dossier</span>
          </button>
        )}

        <button 
          className="btn-secondary"
          onClick={toggleStylistDrawer}
          style={{ borderColor: 'rgba(139, 92, 246, 0.3)' }}
        >
          <MessageSquare size={16} color="#a78bfa" />
          <span style={{ color: '#e9d5ff' }}>AI Colorist</span>
        </button>

        <button 
          className="btn-primary" 
          onClick={toggleCart}
          style={{ position: 'relative', padding: '10px 20px' }}
        >
          <ShoppingBag size={18} />
          <span>Bag</span>
          {totalCartCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-6px',
              right: '-6px',
              background: '#ef4444',
              color: '#fff',
              fontSize: '0.7rem',
              fontWeight: 800,
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.5)'
            }}>
              {totalCartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
