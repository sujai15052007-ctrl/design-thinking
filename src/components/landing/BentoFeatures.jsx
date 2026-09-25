import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  HourglassMedium,
  Handshake,
  CookingPot,
  Storefront,
  ArrowRight,
  ShieldCheck,
  Lightning,
  Sparkle
} from '@phosphor-icons/react';

export default function BentoFeatures() {
  const { setCurrentView } = useApp();

  return (
    <section
      style={{
        paddingBlock: 'var(--space-20)',
        backgroundColor: 'var(--bg-primary)'
      }}
    >
      <div className="container-wide">
        {/* Section Header */}
        <div style={{ maxWidth: '700px', marginBottom: 'var(--space-12)' }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-forest)',
              marginBottom: 'var(--space-2)'
            }}
          >
            Engineered For Zero Waste
          </div>
          <h2 className="text-heading-2" style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
            Four interlocking systems designed to catch every harvest before it decays.
          </h2>
          <p className="text-body-lg">
            Rather than generic spreadsheets, ReRoot combines proactive notification cycles, instant mutual-aid routing, and creative culinary matchmaking.
          </p>
        </div>

        {/* Gapless Dense Bento Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gridAutoFlow: 'dense',
            gap: 'var(--space-6)'
          }}
          className="bento-grid"
        >
          {/* Card 1: Inventory Shelf Life Tracker (Span 7 cols) */}
          <div
            className="card"
            style={{
              gridColumn: 'span 7',
              backgroundColor: 'var(--bg-elevated)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '380px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-success-light)',
                  color: 'var(--color-forest)',
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  marginBottom: 'var(--space-4)'
                }}
              >
                <HourglassMedium size={14} weight="fill" />
                <span>Predictive Countdown Engine</span>
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--space-3)'
                }}
              >
                Intelligent Shelf Life Tracker
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-base)',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  maxWidth: '52ch'
                }}
              >
                Dynamic color-coded expiration countdowns based on food category and storage method. Items nearing critical limits trigger proactive culinary or donation nudges.
              </p>
            </div>

            {/* Interactive Preview Widget inside Card 1 */}
            <div
              style={{
                marginTop: 'var(--space-6)',
                padding: 'var(--space-4)',
                backgroundColor: 'var(--bg-inset)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                  Fresh Atlantic Salmon (Freezer)
                </span>
                <span className="badge badge-forest">Safe: 54 Days</span>
              </div>
              <div className="progress-bar" style={{ height: '6px' }}>
                <div className="progress-fill" style={{ width: '85%', backgroundColor: 'var(--color-forest)' }} />
              </div>
            </div>

            <div style={{ marginTop: 'var(--space-6)' }}>
              <button
                onClick={() => setCurrentView('dashboard')}
                className="btn btn-secondary btn-sm"
              >
                <span>Explore Inventory System</span>
                <ArrowRight size={14} weight="bold" />
              </button>
            </div>
          </div>

          {/* Card 2: Mutual-Aid Redistribution (Span 5 cols) */}
          <div
            className="card"
            style={{
              gridColumn: 'span 5',
              backgroundColor: 'var(--color-night)',
              color: 'var(--color-cream)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '380px'
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'var(--color-wheat)',
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  marginBottom: 'var(--space-4)'
                }}
              >
                <Handshake size={14} weight="fill" />
                <span>Shelter Dispatch Matrix</span>
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: 'var(--space-3)'
                }}
              >
                Surplus-to-Shelter Matchmaker
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-sand)',
                  lineHeight: 1.6
                }}
              >
                Real-time connection with 5 verified grassroots kitchens and food pantries. Schedule pickups, see urgent food needs, and receive verified receipt certificates.
              </p>
            </div>

            <div
              style={{
                marginTop: 'var(--space-6)',
                padding: 'var(--space-4)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="status-dot status-dot-active" />
                <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-display)', fontWeight: 600, color: '#ffffff' }}>
                  Kettle Friendship Society
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-sand)' }}>
                Urgent need: Fresh Greens & Whole Milk (1.2 km away)
              </div>
            </div>

            <div style={{ marginTop: 'var(--space-6)' }}>
              <button
                onClick={() => setCurrentView('redistribution')}
                className="btn btn-primary btn-sm"
                style={{ backgroundColor: 'var(--color-forest-light)', color: '#ffffff' }}
              >
                <span>View Rescue Network</span>
                <ArrowRight size={14} weight="bold" />
              </button>
            </div>
          </div>

          {/* Card 3: Expiring Ingredient Chef Engine (Span 5 cols) */}
          <div
            className="card"
            style={{
              gridColumn: 'span 5',
              backgroundColor: 'var(--bg-elevated)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '340px'
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(196, 101, 46, 0.12)',
                  color: 'var(--color-clay)',
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  marginBottom: 'var(--space-4)'
                }}
              >
                <CookingPot size={14} weight="fill" />
                <span>Culinary Salvage Engine</span>
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-xl)',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--space-2)'
                }}
              >
                Zero-Waste Recipe Generator
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6
                }}
              >
                Algorithms cross-reference whatever is wilting or expiring in your crisper drawer to generate delicious, chef-crafted recipes requiring minimal pantry staples.
              </p>
            </div>

            <div style={{ marginTop: 'var(--space-4)' }}>
              <button
                onClick={() => setCurrentView('recipes')}
                className="btn btn-secondary btn-sm"
              >
                <span>Generate Recipe From Fridge</span>
                <ArrowRight size={14} weight="bold" />
              </button>
            </div>
          </div>

          {/* Card 4: Community Surplus Marketplace (Span 7 cols) */}
          <div
            className="card"
            style={{
              gridColumn: 'span 7',
              backgroundColor: 'var(--bg-elevated)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '340px'
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--color-bark)',
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  marginBottom: 'var(--space-4)'
                }}
              >
                <Storefront size={14} weight="fill" />
                <span>Hyper-Local Food Exchange</span>
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-xl)',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--space-2)'
                }}
              >
                Neighborhood Surplus Marketplace
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  maxWidth: '56ch'
                }}
              >
                Post garden harvests, bakery overruns, or pantry surpluses for neighbors to claim within walking distance. Zero monetary transactions; pure mutual generosity.
              </p>
            </div>

            <div style={{ marginTop: 'var(--space-4)' }}>
              <button
                onClick={() => setCurrentView('marketplace')}
                className="btn btn-secondary btn-sm"
              >
                <span>Browse Community Shares</span>
                <ArrowRight size={14} weight="bold" />
              </button>
            </div>
          </div>
        </div>

        {/* Responsive Grid Fallback Style */}
        <style>{`
          @media (max-width: 900px) {
            .bento-grid > div {
              grid-column: span 12 !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
