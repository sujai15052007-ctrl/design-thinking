import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, ShieldCheck, Sparkle, Plant, HeartStraight } from '@phosphor-icons/react';

export default function LandingHero() {
  const { setCurrentView, setIsAddItemOpen } = useApp();

  return (
    <section
      style={{
        position: 'relative',
        paddingTop: 'clamp(3rem, 6vw, 6rem)',
        paddingBottom: 'clamp(4rem, 8vw, 8rem)',
        overflow: 'hidden'
      }}
    >
      {/* Subtle organic ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(45, 80, 22, 0.08) 0%, rgba(250, 247, 242, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '-5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(196, 101, 46, 0.06) 0%, rgba(250, 247, 242, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div className="container-wide" style={{ position: 'relative', zIndex: 1 }}>
        {/* Editorial Split Hero Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            alignItems: 'center',
            gap: 'clamp(2rem, 5vw, 6rem)'
          }}
        >
          {/* Left Column: Bold Editorial Content */}
          <div style={{ maxWidth: '640px' }}>
            {/* Live Indicator Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-secondary)',
                marginBottom: 'var(--space-6)'
              }}
            >
              <span className="status-dot status-dot-active" />
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  color: 'var(--color-forest)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase'
                }}
              >
                Zero-Waste Municipal Mesh
              </span>
            </div>

            {/* H1 Heading - Guaranteed 2-3 lines max */}
            <h1
              className="text-hero"
              style={{
                maxWidth: '850px',
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-6)',
                letterSpacing: '-0.03em'
              }}
            >
              From forgotten pantry to community feast.
            </h1>

            {/* Editorial Lead Paragraph */}
            <p
              className="text-body-lg"
              style={{
                marginBottom: 'var(--space-8)',
                color: 'var(--text-secondary)'
              }}
            >
              ReRoot transforms expiring home groceries and bakery surpluses into verified meals for local shelters, neighbor sharing, and spontaneous zero-waste recipes. Track, share, and eradicate food discard with intentional design.
            </p>

            {/* High-Contrast Dual CTAs */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 'var(--space-4)',
                marginBottom: 'var(--space-8)'
              }}
            >
              <button
                onClick={() => setCurrentView('dashboard')}
                className="btn btn-primary btn-lg"
                style={{ minWidth: '180px', justifyContent: 'center' }}
              >
                <span>Launch Food Tracker</span>
                <ArrowRight size={18} weight="bold" />
              </button>

              <button
                onClick={() => setCurrentView('redistribution')}
                className="btn btn-secondary btn-lg"
                style={{ minWidth: '180px', justifyContent: 'center' }}
              >
                <span>Find Nearby NGOs</span>
              </button>
            </div>

            {/* Trust and Verification Footnote */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-6)',
                paddingTop: 'var(--space-4)',
                borderTop: '1px solid var(--border-primary)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} color="var(--color-forest)" weight="fill" />
                <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-display)', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  Provincial Food Safety Verified
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HeartStraight size={20} color="var(--color-terracotta)" weight="fill" />
                <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-display)', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  100% Direct Redistribution
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Live Hero Card Stack */}
          <div style={{ position: 'relative' }}>
            {/* Main Interactive Showcase Card */}
            <div
              className="card"
              style={{
                padding: 'var(--space-8)',
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-2xl)',
                boxShadow: 'var(--shadow-xl)',
                position: 'relative',
                zIndex: 2
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 'var(--space-6)',
                  paddingBottom: 'var(--space-4)',
                  borderBottom: '1px solid var(--border-primary)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-success-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-forest)'
                    }}
                  >
                    <Plant size={20} weight="fill" />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                      Active Pantry Expiry Radar
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                      Real-time shelf life monitoring
                    </div>
                  </div>
                </div>

                <span className="badge badge-terracotta">3 Urgent Actions</span>
              </div>

              {/* Sample Live Rescue Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                {[
                  {
                    name: 'Heirloom Tomatoes & Baby Spinach',
                    shelfLife: 'Expires in 18 hrs',
                    status: 'urgent',
                    actionLabel: 'Galette Recipe Ready',
                    impact: '+3.2 kg CO2 Saved'
                  },
                  {
                    name: 'Artisan Sourdough Loaf',
                    shelfLife: 'Expires tomorrow',
                    status: 'warning',
                    actionLabel: 'NGO Match: Kettle Society',
                    impact: '1.2 km away'
                  },
                  {
                    name: 'Heavy Cream 36%',
                    shelfLife: 'Expires today',
                    status: 'urgent',
                    actionLabel: 'Pasta Recipe Ready',
                    impact: '+2.6 kg CO2 Saved'
                  }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 'var(--space-3) var(--space-4)',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: 'var(--bg-inset)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <span
                        className={`status-dot ${
                          item.status === 'urgent' ? 'status-dot-danger' : 'status-dot-warning'
                        }`}
                      />
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                          {item.shelfLife}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontFamily: 'var(--font-display)',
                          fontWeight: 600,
                          color: 'var(--color-forest)'
                        }}
                      >
                        {item.actionLabel}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                        {item.impact}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Card Summary Pill */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--color-success-light)',
                  color: 'var(--color-forest)'
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)' }}>
                    Your Collective Diversion
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', opacity: 0.9 }}>
                    142.8 kg food saved from local landfills
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 800 }}>
                  94.2%
                </div>
              </div>
            </div>

            {/* Overlapping Floating Sub-Card for depth */}
            <div
              className="card animate-float"
              style={{
                position: 'absolute',
                bottom: '-25px',
                right: '-20px',
                padding: 'var(--space-4) var(--space-6)',
                borderRadius: 'var(--radius-xl)',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-secondary)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)'
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-terracotta)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}
              >
                <Sparkle size={18} weight="fill" />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                  19-Day Zero Waste
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-forest)', fontWeight: 600 }}>
                  Active streak • Top 5% in Kitsilano
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
