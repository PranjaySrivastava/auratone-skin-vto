import React from 'react';
import { useStore } from '../store/useStore';
import { X, Sparkles, Download, Share2, ShieldCheck, Check } from 'lucide-react';

export default function DossierExportModal() {
  const { isDossierOpen, toggleDossier, skinAnalysis, activeBundle, userImage, userName } = useStore();
  const [copied, setCopied] = React.useState(false);

  if (!isDossierOpen || !skinAnalysis) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(12px)',
      zIndex: 110,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div className="glass-panel-elevated" style={{
        width: '100%',
        maxWidth: '720px',
        maxHeight: '90vh',
        overflowY: 'auto',
        borderRadius: '24px',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Modal Top Bar */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#d4af37" />
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
              AuraTone Personal Color & Wardrobe Dossier
            </span>
          </div>
          <button 
            onClick={toggleDossier}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Printable Card Canvas */}
        <div id="printable-dossier" style={{ padding: '32px' }}>
          {/* Card Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '1px solid var(--border-glass)',
            paddingBottom: '20px',
            marginBottom: '24px'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                BIOMETRIC STYLE CERTIFICATE
              </div>
              <h2 style={{ fontSize: '1.8rem', color: '#fff', marginTop: '4px' }}>
                {userName || 'Personal Client'}
              </h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Issued by AuraTone AI • Perfect Corp YouCam Core Engine
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div className="badge-harmony" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                {skinAnalysis.seasonalPalette}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                CONFIDENCE: {(skinAnalysis.confidenceScore * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          {/* Central Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', marginBottom: '28px' }}>
            {/* Visual Portrait + Look */}
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                Calibrated Virtual Try-On
              </div>
              <div style={{
                width: '100%',
                height: '280px',
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <img 
                  src={activeBundle ? activeBundle.tryOnRender : userImage} 
                  alt="Dossier Look"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 10,
                  left: 10,
                  right: 10,
                  background: 'rgba(9, 10, 15, 0.85)',
                  backdropFilter: 'blur(8px)',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  fontSize: '0.7rem',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span>{activeBundle ? activeBundle.title : 'Baseline Portrait'}</span>
                  <ShieldCheck size={13} color="#10b981" />
                </div>
              </div>
            </div>

            {/* Scientific Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '16px',
                borderRadius: '14px',
                border: '1px solid var(--border-glass)'
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Melanin Undertone Specification
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f3e5ab' }}>
                  {skinAnalysis.undertone}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Depth Spectrum: {skinAnalysis.depth} • {skinAnalysis.contrastLevel}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                  Signature Color Resonances
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                  {skinAnalysis.bestColors.map((col, idx) => (
                    <div key={idx} style={{ textAlign: 'center' }}>
                      <div style={{
                        width: '100%',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: col.hex,
                        border: '1px solid rgba(255,255,255,0.2)',
                        marginBottom: '4px'
                      }} />
                      <div style={{ fontSize: '0.65rem', color: '#fff', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {col.name.split(' ')[0]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                background: 'rgba(139, 92, 246, 0.08)',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                fontSize: '0.75rem',
                color: '#e9d5ff',
                lineHeight: 1.5
              }}>
                <strong>Stylist Note:</strong> {skinAnalysis.dermatologyNotes}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Bar */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border-glass)',
          background: 'rgba(9, 10, 15, 0.95)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button 
            className="btn-secondary" 
            onClick={handleShare}
            style={{ padding: '10px 18px', fontSize: '0.85rem' }}
          >
            {copied ? <Check size={16} color="#10b981" /> : <Share2 size={16} />}
            <span>{copied ? 'Link Copied!' : 'Share Dossier'}</span>
          </button>

          <button 
            className="btn-primary" 
            onClick={handlePrint}
            style={{ padding: '10px 22px', fontSize: '0.85rem' }}
          >
            <Download size={16} />
            <span>Download PDF / Print</span>
          </button>
        </div>
      </div>
    </div>
  );
}
