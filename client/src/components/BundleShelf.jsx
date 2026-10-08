import React from 'react';
import { useStore } from '../store/useStore';
import { ShoppingBag, Sparkles, Check, Info, HelpCircle } from 'lucide-react';

export default function BundleShelf() {
  const { 
    activeBundle, 
    availableBundles, 
    setActiveBundle, 
    selectedBundleItems, 
    toggleBundleItem,
    addBundleToCart,
    toggleStylistDrawer
  } = useStore();

  if (!activeBundle) return null;

  // Calculate dynamic price based on selected items
  const items = [
    { key: 'apparel', data: activeBundle.apparel, label: 'Hero Apparel' },
    { key: 'cosmetic', data: activeBundle.cosmetic, label: 'Cosmetic Harmonizer' },
    { key: 'accessory', data: activeBundle.accessory, label: 'Metallic Undertone Accent' }
  ].filter(item => Boolean(item.data));

  const selectedCount = Object.values(selectedBundleItems).filter(Boolean).length;
  const isAllSelected = selectedCount === items.length;

  const calculatedRetailTotal = items.reduce((sum, item) => {
    return selectedBundleItems[item.key] ? sum + (item.data?.price || 0) : sum;
  }, 0);

  const finalPrice = isAllSelected ? activeBundle.bundlePrice : calculatedRetailTotal;
  const savings = isAllSelected ? (activeBundle.retailTotal - activeBundle.bundlePrice) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 3-Look Carousel / Tabs */}
      <div className="glass-panel" style={{ padding: '16px' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
          Curated Stylist Ensembles:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {availableBundles.map((bundle) => {
            const isSelected = activeBundle.id === bundle.id;
            return (
              <button
                key={bundle.id}
                onClick={() => setActiveBundle(bundle)}
                style={{
                  background: isSelected ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  border: isSelected ? '2px solid var(--gold-primary)' : '1px solid var(--border-glass)',
                  borderRadius: '12px',
                  padding: '12px 10px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontSize: '0.75rem', color: isSelected ? '#f3e5ab' : 'var(--text-muted)', fontWeight: 600 }}>
                  {bundle.vibe}
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {bundle.title.split(' ')[0]} Look
                </div>
                <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, marginTop: '4px' }}>
                  {bundle.harmonyScore}% Harmony
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bundle Breakdown Cards */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>{activeBundle.title}</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Cross-category color-coordinated bundle
            </span>
          </div>
          {isAllSelected && (
            <span className="badge-tag" style={{ background: 'rgba(212, 175, 55, 0.15)', borderColor: '#d4af37', color: '#f3e5ab' }}>
              15% BUNDLE SAVINGS
            </span>
          )}
        </div>

        {/* 3 Item Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {items.map((item) => {
            const isChecked = selectedBundleItems[item.key];
            return (
              <div
                key={item.key}
                onClick={() => toggleBundleItem(item.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  background: isChecked ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.01)',
                  border: isChecked ? '1px solid rgba(255, 255, 255, 0.15)' : '1px dashed rgba(255, 255, 255, 0.05)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  opacity: isChecked ? 1 : 0.6
                }}
              >
                {/* Custom Checkbox */}
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '6px',
                  background: isChecked ? 'var(--gold-primary)' : 'transparent',
                  border: isChecked ? 'none' : '2px solid rgba(255, 255, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {isChecked && <Check size={14} color="#090a0f" strokeWidth={3} />}
                </div>

                {/* Thumbnail */}
                <img 
                  src={item.data.image} 
                  alt={item.data.name}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    objectFit: 'cover',
                    flexShrink: 0,
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                />

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.data.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: item.data.colorHex, display: 'inline-block' }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.data.color}</span>
                  </div>
                </div>

                {/* Price */}
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
                  ${item.data.price.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing Summary */}
        <div style={{
          borderTop: '1px solid var(--border-glass)',
          paddingTop: '18px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
            <span>Retail Total:</span>
            <span style={{ textDecoration: savings > 0 ? 'line-through' : 'none' }}>
              ${calculatedRetailTotal.toFixed(2)}
            </span>
          </div>

          {savings > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#10b981', marginBottom: '8px' }}>
              <span>Color Harmony Bundle Discount:</span>
              <span>-${savings.toFixed(2)} (15% OFF)</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
            <span>Bundle Price:</span>
            <span className="text-gradient-gold">${finalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Add to Cart CTA */}
        <button
          className="btn-primary"
          onClick={addBundleToCart}
          disabled={selectedCount === 0}
          style={{
            width: '100%',
            padding: '16px',
            justifyContent: 'center',
            fontSize: '1rem',
            opacity: selectedCount > 0 ? 1 : 0.5
          }}
        >
          <ShoppingBag size={18} />
          <span>Add {selectedCount} Harmonized {selectedCount === 1 ? 'Item' : 'Items'} to Bag</span>
        </button>

        {/* Stylist Explanation Teaser */}
        <div 
          onClick={toggleStylistDrawer}
          style={{
            marginTop: '16px',
            padding: '12px',
            borderRadius: '10px',
            background: 'rgba(139, 92, 246, 0.08)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer'
          }}
        >
          <Sparkles size={16} color="#a78bfa" />
          <div style={{ fontSize: '0.8rem', color: '#e9d5ff', flex: 1 }}>
            <strong>Why this works:</strong> {activeBundle.stylistRationale.slice(0, 110)}...
          </div>
          <span style={{ fontSize: '0.75rem', color: '#c4b5fd', fontWeight: 600 }}>Explore</span>
        </div>
      </div>
    </div>
  );
}
