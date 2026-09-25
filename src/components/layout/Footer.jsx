import React from 'react';
import { useApp } from '../../context/AppContext';
import { Plant, Heart, ArrowUpRight, ShieldCheck, TreeEvergreen } from '@phosphor-icons/react';

export default function Footer() {
  const { setCurrentView } = useApp();

  return (
    <footer
      style={{
        backgroundColor: 'var(--color-night)',
        color: 'var(--color-cream)',
        borderTop: '1px solid var(--border-primary)',
        paddingTop: 'var(--space-20)',
        paddingBottom: 'var(--space-12)',
        marginTop: 'var(--space-24)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="container-wide">
        {/* Top Grid: Brand Manifesto & Navigation Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-12)',
            marginBottom: 'var(--space-16)'
          }}
        >
          {/* Brand & Manifesto Column */}
          <div style={{ maxWidth: '420px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-forest)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-cream)'
                }}
              >
                <Plant size={20} weight="duotone" />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: 'var(--text-2xl)',
                  letterSpacing: 'var(--tracking-tight)',
                  color: '#ffffff'
                }}
              >
                ReRoot
              </span>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-base)',
                lineHeight: 1.6,
                color: 'var(--color-sand)',
                marginBottom: 'var(--space-6)'
              }}
            >
              Every year, over 1.3 billion tonnes of food is squandered while soils deplete and communities go hungry. ReRoot connects home kitchens, neighborhood markets, and mutual-aid food banks into a closed-loop nourishment ecology.
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: 'var(--color-mint)',
                fontSize: 'var(--text-xs)',
                fontFamily: 'var(--font-display)',
                fontWeight: 600
              }}
            >
              <TreeEvergreen size={14} weight="bold" />
              <span>Zero-Landfill Mission • 100% Non-Commercial Ecology</span>
            </div>
          </div>

          {/* Module Links */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-sand)',
                marginBottom: 'var(--space-4)'
              }}
            >
              Reclamation Ecosystem
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {[
                { view: 'dashboard', label: 'Inventory Shelf Life Tracker' },
                { view: 'redistribution', label: 'Food Bank & NGO Dispatch' },
                { view: 'marketplace', label: 'Surplus Community Marketplace' },
                { view: 'recipes', label: 'Expiring Ingredients Chef' },
                { view: 'analytics', label: 'Methane & Carbon Ledger' },
                { view: 'gamification', label: 'Zero-Waste Community Champions' }
              ].map((link) => (
                <li key={link.view}>
                  <button
                    onClick={() => {
                      setCurrentView(link.view);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: 'var(--color-parchment)',
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--text-sm)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'color 150ms ease'
                    }}
                    onMouseEnter={(e) => (e.target.style.color = '#ffffff')}
                    onMouseLeave={(e) => (e.target.style.color = 'var(--color-parchment)')}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Ecological Principles */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-sand)',
                marginBottom: 'var(--space-4)'
              }}
            >
              Design Integrity
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', color: 'var(--color-sand)', fontSize: 'var(--text-sm)' }}>
              <div>
                <strong style={{ color: '#ffffff', display: 'block', fontFamily: 'var(--font-display)' }}>Local-First Privacy</strong>
                All pantry inventories are maintained client-side in browser state.
              </div>
              <div>
                <strong style={{ color: '#ffffff', display: 'block', fontFamily: 'var(--font-display)' }}>Food Safety Protocols</strong>
                Compliant with provincial good-faith food donation guidelines.
              </div>
              <div>
                <strong style={{ color: '#ffffff', display: 'block', fontFamily: 'var(--font-display)' }}>Zero Algorithmic Waste</strong>
                Immediate direct routing to the nearest active soup kitchen.
              </div>
            </div>
          </div>

          {/* Live System Counter */}
          <div
            style={{
              padding: 'var(--space-6)',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                color: 'var(--color-wheat)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 'var(--space-2)'
              }}
            >
              Network Ticker
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-3xl)',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1,
                marginBottom: 'var(--space-1)'
              }}
            >
              124,580 kg
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-sand)', marginBottom: 'var(--space-4)' }}>
              Surplus organic food safely redirected from local landfills to date.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="status-dot status-dot-active" />
              <span style={{ fontSize: '11px', color: 'var(--color-mint)' }}>All 5 regional hub dispatch nodes operational</span>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: 'var(--space-6)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-4)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-stone)',
            fontFamily: 'var(--font-display)'
          }}
        >
          <div>
            © 2026 ReRoot Food Reclamation System • Crafted with thoughtful regenerative UI.
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <span>No Cookies / No Third-Party Trackers</span>
            <span>•</span>
            <span>Food Recovery Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
