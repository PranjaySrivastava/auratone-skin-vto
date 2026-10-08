import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { X, ShoppingBag, Sparkles, CheckCircle2, Download, Trash2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CartDrawer() {
  const { cart, isCartOpen, toggleCart, clearCart, skinAnalysis, activeBundle } = useStore();
  const [isOrdered, setIsOrdered] = useState(false);

  if (!isCartOpen) return null;

  const totalSum = cart.reduce((sum, item) => sum + item.price, 0);
  const totalDiscount = cart.reduce((sum, item) => sum + item.discountApplied, 0);

  const handleCheckout = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    setIsOrdered(true);
  };

  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <div className="glass-panel-elevated" style={{
        width: '100%',
        maxWidth: '480px',
        height: '100%',
        borderRadius: '24px 0 0 24px',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '1px solid var(--border-glass-hover)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} color="#d4af37" />
            <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>Your Curated Bag</h3>
          </div>
          <button 
            onClick={toggleCart}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {isOrdered ? (
            <div style={{ textAlign: 'center', padding: '40px 10px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <CheckCircle2 size={36} color="#10b981" />
              </div>
              <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '8px' }}>
                Order Confirmed!
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
                Order #AURA-{Math.floor(100000 + Math.random() * 900000)}. Your calibrated wardrobe bundle has been prepared for dispatch.
              </p>

              <button 
                className="btn-secondary" 
                onClick={handlePrintDossier}
                style={{ width: '100%', justifyContent: 'center', marginBottom: '12px' }}
              >
                <Download size={16} />
                <span>Export Color & Wardrobe Dossier</span>
              </button>

              <button 
                className="btn-primary" 
                onClick={() => { clearCart(); setIsOrdered(false); toggleCart(); }}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <span>Continue Styling</span>
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 10px', color: 'var(--text-muted)' }}>
              <ShoppingBag size={48} style={{ opacity: 0.3, margin: '0 auto 16px' }} />
              <div style={{ fontWeight: 600, color: '#fff', marginBottom: '4px' }}>Your Bag is Empty</div>
              <div style={{ fontSize: '0.85rem' }}>Select a color harmony bundle to add to your order.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {cart.map((entry, index) => (
                <div key={index} className="glass-panel" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
                      {entry.bundleTitle}
                    </div>
                    {entry.isFullBundle && (
                      <span className="badge-tag" style={{ color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                        BUNDLE (15% OFF)
                      </span>
                    )}
                  </div>

                  {/* Items in this bundle */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {entry.items.map((item, itemIdx) => (
                      <div key={itemIdx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={item.image} 
                          alt={item.name}
                          style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            {item.color} • {item.brand}
                          </div>
                        </div>
                        <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: '#fff' }}>
                          ${item.price.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{
                    marginTop: '12px',
                    paddingTop: '10px',
                    borderTop: '1px solid var(--border-glass)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.9rem',
                    fontWeight: 700
                  }}>
                    <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
                    <span style={{ color: '#f3e5ab' }}>${entry.price.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Checkout Bar */}
        {!isOrdered && cart.length > 0 && (
          <div style={{
            padding: '24px',
            borderTop: '1px solid var(--border-glass)',
            background: 'rgba(9, 10, 15, 0.95)'
          }}>
            {totalDiscount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#10b981', marginBottom: '8px' }}>
                <span>Total Harmony Savings:</span>
                <span>-${totalDiscount.toFixed(2)}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '20px' }}>
              <span>Estimated Total:</span>
              <span className="text-gradient-gold">${totalSum.toFixed(2)}</span>
            </div>

            <button 
              className="btn-primary" 
              onClick={handleCheckout}
              style={{ width: '100%', padding: '16px', justifyContent: 'center', fontSize: '1.05rem' }}
            >
              <Sparkles size={18} />
              <span>Complete Express Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
