import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Plant, Sparkle } from '@phosphor-icons/react';

export default function LandingCTA() {
  const { setCurrentView, setIsAddItemOpen } = useApp();

  return (
    <section
      style={{
        paddingBlock: 'var(--space-20)',
        backgroundColor: 'var(--bg-primary)',
        position: 'relative'
      }}
    >
      <div className="container">
        <div
          style={{
            backgroundColor: 'var(--color-forest)',
            color: 'var(--color-cream)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'clamp(2.5rem, 6vw, 5rem)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 48px -12px rgba(45, 80, 22, 0.35)'
          }}
        >
          {/* Subtle botanical backdrop accent */}
          <div
            style={{
              position: 'absolute',
              right: '-10%',
              bottom: '-30%',
              width: '450px',
              height: '450px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(184, 212, 160, 0.15) 0%, rgba(45, 80, 22, 0) 70%)',
              pointerEvents: 'none'
            }}
          />

          <div style={{ maxWidth: '680px', position: 'relative', zIndex: 1 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: 'var(--color-mint)',
                fontSize: 'var(--text-xs)',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: 'var(--space-6)'
              }}
            >
              <Sparkle size={15} weight="fill" />
              <span>Begin Your Zero-Waste Kitchen Today</span>
            </div>

            <h2
              className="text-heading-1"
              style={{
                color: '#ffffff',
                marginBottom: 'var(--space-6)',
                letterSpacing: '-0.03em'
              }}
            >
              Reclaim your kitchen. Feed your neighborhood.
            </h2>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-lg)',
                lineHeight: 1.6,
                color: 'var(--color-parchment)',
                marginBottom: 'var(--space-8)'
              }}
            >
              Take 20 seconds to log the contents of your crisper drawer. Watch how easily surplus food moves toward hungry neighbors rather than decomposing in garbage dumps.
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 'var(--space-4)'
              }}
            >
              <button
                onClick={() => setCurrentView('dashboard')}
                className="btn btn-lg"
                style={{
                  backgroundColor: 'var(--color-cream)',
                  color: 'var(--color-forest)',
                  fontWeight: 700
                }}
              >
                <span>Launch Interactive Prototype</span>
                <ArrowRight size={18} weight="bold" />
              </button>

              <button
                onClick={() => setCurrentView('marketplace')}
                className="btn btn-secondary btn-lg"
                style={{
                  color: '#ffffff',
                  borderColor: 'rgba(255, 255, 255, 0.3)'
                }}
              >
                <span>Browse Community Shares</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
