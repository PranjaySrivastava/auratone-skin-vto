import React from 'react';
import { useStore } from './store/useStore';
import Navbar from './components/Navbar';
import CaptureStudio from './components/CaptureStudio';
import ScanningOverlay from './components/ScanningOverlay';
import ColorReport from './components/ColorReport';
import VTOCanvas from './components/VTOCanvas';
import BundleShelf from './components/BundleShelf';
import StylistDrawer from './components/StylistDrawer';
import CartDrawer from './components/CartDrawer';
import DossierExportModal from './components/DossierExportModal';
import { Sparkles, Shield, Cpu, ExternalLink } from 'lucide-react';

export default function App() {
  const { phase } = useStore();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Sticky Header */}
      <Navbar />

      {/* Main Dynamic Stage */}
      <main style={{ flex: 1, paddingBottom: '60px' }}>
        {phase === 'ONBOARDING' && <CaptureStudio />}
        {phase === 'SCANNING' && <ScanningOverlay />}
        {phase === 'DIAGNOSTIC' && <ColorReport />}
        {phase === 'SHOWCASE' && (
          <div style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '32px 24px',
            display: 'grid',
            gridTemplateColumns: '1.05fr 0.95fr',
            gap: '36px',
            alignItems: 'start'
          }}>
            <VTOCanvas />
            <BundleShelf />
          </div>
        )}
      </main>

      {/* Floating Drawers & Overlays */}
      <StylistDrawer />
      <CartDrawer />
      <DossierExportModal />

      {/* Footer / Hackathon Showcase Information */}
      <footer style={{
        borderTop: '1px solid var(--border-glass)',
        background: 'rgba(9, 10, 15, 0.9)',
        backdropFilter: 'blur(16px)',
        padding: '32px 24px',
        marginTop: 'auto'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>AURATONE</span>
              <span className="badge-tag" style={{ color: '#f3e5ab' }}>Devpost Hackathon Project</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Orchestrating Perfect Corp YouCam Skin AI API & Generative Apparel VTO with Agentic Styling.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={14} color="#10b981" /> 100% Ephemeral Privacy
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Cpu size={14} color="#8b5cf6" /> LLM Function Calling Agent
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} color="#d4af37" /> Personal Color Matrix
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
