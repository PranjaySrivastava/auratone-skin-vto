import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { API_BASE } from '../config';
import { Camera, Upload, Sparkles, UserCheck, ArrowRight, Video, AlertCircle } from 'lucide-react';

export default function CaptureStudio() {
  const { 
    personas, 
    setPersonas, 
    selectPersona, 
    setUserImage, 
    userImage, 
    selectedPersona, 
    setPhase,
    setSkinAnalysis
  } = useStore();

  const [activeTab, setActiveTab] = useState('personas'); // 'personas' | 'upload' | 'camera'
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Fetch preset personas from backend on mount
  useEffect(() => {
    fetch(`${API_BASE}/api/personas`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          setPersonas(data.data);
          // Default to first persona for immediate instant readiness
          if (!selectedPersona && !userImage) {
            selectPersona(data.data[0]);
          }
        }
      })
      .catch(err => console.warn('Could not load personas:', err));
  }, []);

  // Handle Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error('Camera error:', err);
      setCameraError('Unable to access webcam. Please check browser permissions or use a preset persona.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setUserImage(dataUrl, 'Webcam Capture');
    stopCamera();
    setActiveTab('upload');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserImage(event.target?.result, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBeginScan = () => {
    setPhase('SCANNING');
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 24px',
      display: 'grid',
      gridTemplateColumns: '1.1fr 0.9fr',
      gap: '48px',
      alignItems: 'center'
    }}>
      {/* Left Column: Hero Editorial Intro & Tabs */}
      <div>
        <div className="badge-tag" style={{ borderColor: 'rgba(212, 175, 55, 0.4)', color: '#f3e5ab', marginBottom: '16px' }}>
          <Sparkles size={14} color="#d4af37" />
          PERFECT CORP YOUCAM API CHALLENGE
        </div>
        
        <h1 style={{ fontSize: '3.2rem', lineHeight: 1.1, marginBottom: '20px' }}>
          Stop Guessing.<br />
          Dress in <span className="text-gradient-gold">True Harmony</span>.
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '32px' }}>
          Over 65% of online fashion returns are caused by color and appearance mismatches. 
          AuraTone unifies <strong>YouCam Skin AI</strong> with <strong>Generative Apparel VTO</strong> to scientifically analyze your melanin undertone, map your seasonal color palette, and curate full-look outfits that radiate on you.
        </p>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '6px',
          borderRadius: '14px',
          border: '1px solid var(--border-glass)',
          marginBottom: '28px',
          maxWidth: '440px'
        }}>
          <button
            onClick={() => { setActiveTab('personas'); stopCamera(); }}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'personas' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
              color: activeTab === 'personas' ? '#fff' : 'var(--text-secondary)',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <UserCheck size={16} />
            <span>Sample Models</span>
          </button>

          <button
            onClick={() => { setActiveTab('upload'); stopCamera(); }}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'upload' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
              color: activeTab === 'upload' ? '#fff' : 'var(--text-secondary)',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <Upload size={16} />
            <span>Upload Photo</span>
          </button>

          <button
            onClick={() => { setActiveTab('camera'); startCamera(); }}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'camera' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
              color: activeTab === 'camera' ? '#fff' : 'var(--text-secondary)',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <Camera size={16} />
            <span>Webcam</span>
          </button>
        </div>

        {/* Tab 1: Instant Personas Selector */}
        {activeTab === 'personas' && (
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '12px' }}>
              Choose a diverse persona for instant evaluation:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '32px' }}>
              {personas.map((p) => {
                const isSelected = selectedPersona?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => selectPersona(p)}
                    style={{
                      background: isSelected ? 'rgba(212, 175, 55, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: isSelected ? '2px solid var(--gold-primary)' : '1px solid var(--border-glass)',
                      borderRadius: '14px',
                      padding: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'center'
                    }}
                  >
                    <img 
                      src={p.avatar} 
                      alt={p.name}
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        margin: '0 auto 8px',
                        border: isSelected ? '2px solid #d4af37' : '1px solid rgba(255,255,255,0.1)'
                      }}
                    />
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: isSelected ? '#f3e5ab' : '#fff' }}>
                      {p.name.split(' ')[0]}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {p.label || 'Live Analysis Ready'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Upload Photo */}
        {activeTab === 'upload' && (
          <div style={{ marginBottom: '32px' }}>
            <div 
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed var(--border-glass-hover)',
                borderRadius: '16px',
                padding: '32px',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'rgba(255, 255, 255, 0.02)'
              }}
            >
              <Upload size={32} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontWeight: 600, color: '#fff', marginBottom: '4px' }}>Click to select a clear portrait</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Supports JPG, PNG with natural lighting</div>
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={handleFileUpload}
              />
            </div>
          </div>
        )}

        {/* Tab 3: Webcam */}
        {activeTab === 'camera' && (
          <div style={{ marginBottom: '32px' }}>
            {cameraError ? (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '16px',
                borderRadius: '12px',
                color: '#fca5a5',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={18} />
                {cameraError}
              </div>
            ) : (
              <div>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '240px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: '#000',
                  border: '1px solid var(--border-glass)'
                }}>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <button 
                  className="btn-secondary" 
                  onClick={capturePhoto}
                  style={{ marginTop: '12px', width: '100%', justifyContent: 'center' }}
                >
                  <Camera size={16} />
                  <span>Snap Photo</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Primary CTA */}
        <button 
          className="btn-primary" 
          onClick={handleBeginScan}
          disabled={!userImage}
          style={{
            padding: '16px 36px',
            fontSize: '1.05rem',
            width: '100%',
            justifyContent: 'center',
            opacity: userImage ? 1 : 0.5,
            cursor: userImage ? 'pointer' : 'not-allowed'
          }}
        >
          <Sparkles size={20} />
          <span>Analyze Skin Harmony & Curate Wardrobe</span>
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Right Column: High-Fidelity Studio Preview */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="glass-panel" style={{
          width: '100%',
          maxWidth: '440px',
          padding: '20px',
          position: 'relative',
          boxShadow: '0 24px 60px rgba(0,0,0,0.6)'
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            height: '520px',
            borderRadius: '16px',
            overflow: 'hidden',
            background: '#12141d'
          }}>
            {userImage ? (
              <img 
                src={userImage} 
                alt="Selected Face"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)'
              }}>
                <UserCheck size={48} style={{ opacity: 0.4, marginBottom: '12px' }} />
                <span>Select a portrait or sample persona</span>
              </div>
            )}

            {/* Viewfinder Corner Accents */}
            <div style={{ position: 'absolute', top: 16, left: 16, width: 20, height: 20, borderTop: '2px solid #d4af37', borderLeft: '2px solid #d4af37' }} />
            <div style={{ position: 'absolute', top: 16, right: 16, width: 20, height: 20, borderTop: '2px solid #d4af37', borderRight: '2px solid #d4af37' }} />
            <div style={{ position: 'absolute', bottom: 16, left: 16, width: 20, height: 20, borderBottom: '2px solid #d4af37', borderLeft: '2px solid #d4af37' }} />
            <div style={{ position: 'absolute', bottom: 16, right: 16, width: 20, height: 20, borderBottom: '2px solid #d4af37', borderRight: '2px solid #d4af37' }} />

            {/* Telemetry Badge */}
            <div style={{
              position: 'absolute',
              bottom: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(9, 10, 15, 0.85)',
              backdropFilter: 'blur(12px)',
              padding: '8px 16px',
              borderRadius: '9999px',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap'
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#fff' }}>
                {selectedPersona ? selectedPersona.name : 'Custom Subject Ready'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
