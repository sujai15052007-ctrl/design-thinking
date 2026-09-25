import React, { useState } from 'react';
import { ArrowBendRightDown, WarningCircle, CheckCircle, ArrowsCounterClockwise, Trash, ForkKnife } from '@phosphor-icons/react';

export default function ProblemStory() {
  const [activeTab, setActiveTab] = useState('circular'); // 'linear' | 'circular'

  return (
    <section
      style={{
        paddingBlock: 'var(--space-20)',
        borderTop: '1px solid var(--border-primary)',
        borderBottom: '1px solid var(--border-primary)',
        backgroundColor: 'var(--bg-tertiary)'
      }}
    >
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '720px', marginBottom: 'var(--space-12)' }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-terracotta)',
              marginBottom: 'var(--space-2)'
            }}
          >
            The Crisis of Extraction vs Renewal
          </div>
          <h2
            className="text-heading-2"
            style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}
          >
            A broken supply chain throwing away 40% of all harvested calories.
          </h2>
          <p className="text-body-lg">
            Food waste isn't merely an individual habit; it's a systemic failure of timing, visibility, and mutual-aid distribution. Compare what happens today versus what happens when food moves through ReRoot.
          </p>
        </div>

        {/* Interactive Comparison Switcher */}
        <div
          style={{
            display: 'inline-flex',
            padding: '4px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-secondary)',
            marginBottom: 'var(--space-8)'
          }}
        >
          <button
            onClick={() => setActiveTab('circular')}
            style={{
              padding: '8px 20px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: activeTab === 'circular' ? 'var(--color-forest)' : 'transparent',
              color: activeTab === 'circular' ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 200ms ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ArrowsCounterClockwise size={16} weight="bold" />
            <span>The ReRoot Regenerative Loop</span>
          </button>

          <button
            onClick={() => setActiveTab('linear')}
            style={{
              padding: '8px 20px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: activeTab === 'linear' ? 'var(--color-danger)' : 'transparent',
              color: activeTab === 'linear' ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 200ms ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Trash size={16} weight="bold" />
            <span>Conventional Landfill Pipeline</span>
          </button>
        </div>

        {/* Narrative Flow Stepper */}
        {activeTab === 'circular' ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 'var(--space-6)'
            }}
          >
            {[
              {
                step: '01',
                title: 'Conscious Logging',
                subtitle: 'Takes 10 Seconds',
                desc: 'Groceries or bakery overstock are captured with expiration dates into local-first inventory.',
                color: 'var(--color-forest)',
                highlight: '100% data privacy'
              },
              {
                step: '02',
                title: 'Predictive Radar',
                subtitle: '48h Before Expiry',
                desc: 'Smart algorithms nudge you: will you cook this tonight, share with neighbors, or dispatch to shelter?',
                color: 'var(--color-forest-light)',
                highlight: 'Zero forgotten items'
              },
              {
                step: '03',
                title: 'Mutual-Aid Dispatch',
                subtitle: 'Direct Routing',
                desc: 'One tap matches excess produce with nearby food banks like Kettle Friendship Society within 2km.',
                color: 'var(--color-terracotta)',
                highlight: 'Volunteer courier network'
              },
              {
                step: '04',
                title: 'Nourishment Delivered',
                subtitle: 'Landfill Avoided',
                desc: 'Wholesome calories feed families, methane emissions are averted, and your community score rises.',
                color: 'var(--color-clay)',
                highlight: 'Measurable CO2 impact'
              }
            ].map((card, i) => (
              <div
                key={i}
                className="card"
                style={{
                  background: 'var(--bg-secondary)',
                  borderTop: `4px solid ${card.color}`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: 'var(--space-6)'
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 800,
                      color: card.color,
                      marginBottom: 'var(--space-2)'
                    }}
                  >
                    PHASE {card.step} • {card.subtitle}
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--text-lg)',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      marginBottom: 'var(--space-3)'
                    }}
                  >
                    {card.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-sm)',
                      lineHeight: 1.6,
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {card.desc}
                  </p>
                </div>

                <div
                  style={{
                    marginTop: 'var(--space-6)',
                    paddingTop: 'var(--space-3)',
                    borderTop: '1px solid var(--border-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: 'var(--text-xs)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    color: card.color
                  }}
                >
                  <CheckCircle size={16} weight="fill" />
                  <span>{card.highlight}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 'var(--space-6)'
            }}
          >
            {[
              {
                step: '01',
                title: 'Impulsive Over-Purchasing',
                desc: 'Bulk discounts and poor pantry visibility lead to purchasing more than household capacity.',
                impact: 'Average household wastes $1,800/yr'
              },
              {
                step: '02',
                title: 'Back-of-Fridge Neglect',
                desc: 'Greens wilt in crisper drawers, breads harden behind pantry boxes without warning.',
                impact: '63% of home waste is fully avoidable'
              },
              {
                step: '03',
                title: 'Guilty Discard',
                desc: 'Once spoiled, unconsumed food is tossed directly into municipal black garbage bags.',
                impact: 'Anaerobic rotting creates potent methane'
              },
              {
                step: '04',
                title: 'Permanent Ecological Deficit',
                desc: 'All embodied water, transport fuel, and soil nutrients are irreversibly lost forever.',
                impact: '8-10% of global greenhouse emissions'
              }
            ].map((card, i) => (
              <div
                key={i}
                className="card"
                style={{
                  background: 'var(--bg-secondary)',
                  borderTop: '4px solid var(--color-danger)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: 'var(--space-6)'
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 800,
                      color: 'var(--color-danger)',
                      marginBottom: 'var(--space-2)'
                    }}
                  >
                    STEP {card.step}
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--text-lg)',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      marginBottom: 'var(--space-3)'
                    }}
                  >
                    {card.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-sm)',
                      lineHeight: 1.6,
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {card.desc}
                  </p>
                </div>

                <div
                  style={{
                    marginTop: 'var(--space-6)',
                    paddingTop: 'var(--space-3)',
                    borderTop: '1px solid var(--border-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: 'var(--text-xs)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    color: 'var(--color-danger)'
                  }}
                >
                  <WarningCircle size={16} weight="fill" />
                  <span>{card.impact}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
