import React, { useState, useEffect } from 'react';
import { Scales, ForkKnife, CloudSun, Buildings, CheckSquareOffset } from '@phosphor-icons/react';

export default function AnimatedStats() {
  const [counts, setCounts] = useState({
    wasteTonnes: 0,
    mealsProvided: 0,
    co2Tonnes: 0,
    partnerKitchens: 0,
    rescueRate: 0
  });

  // Animated increment simulation on mount
  useEffect(() => {
    const duration = 1800; // ms
    const steps = 40;
    const intervalTime = duration / steps;
    let step = 0;

    const targets = {
      wasteTonnes: 142.8,
      mealsProvided: 124500,
      co2Tonnes: 312.4,
      partnerKitchens: 1840,
      rescueRate: 94.2
    };

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      // ease-out cubic
      const factor = 1 - Math.pow(1 - progress, 3);

      setCounts({
        wasteTonnes: +(targets.wasteTonnes * factor).toFixed(1),
        mealsProvided: Math.round(targets.mealsProvided * factor),
        co2Tonnes: +(targets.co2Tonnes * factor).toFixed(1),
        partnerKitchens: Math.round(targets.partnerKitchens * factor),
        rescueRate: +(targets.rescueRate * factor).toFixed(1)
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounts(targets);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      label: 'Surplus Food Diverted',
      value: `${counts.wasteTonnes.toLocaleString()} Tonnes`,
      description: 'Solid biomass kept out of municipal methane landfills.',
      icon: Scales,
      color: 'var(--color-forest)'
    },
    {
      label: 'Nourishing Meals Matched',
      value: `${counts.mealsProvided.toLocaleString()}`,
      description: 'Redirected to food-insecure households & shelter kitchens.',
      icon: ForkKnife,
      color: 'var(--color-terracotta)'
    },
    {
      label: 'CO2e Emissions Prevented',
      value: `${counts.co2Tonnes.toLocaleString()} Tonnes`,
      description: 'Equivalent to removing 68 combustion vehicles for one year.',
      icon: CloudSun,
      color: 'var(--color-clay)'
    },
    {
      label: 'Mutual-Aid Network Hubs',
      value: `${counts.partnerKitchens.toLocaleString()}`,
      description: 'Participating bakeries, grocers, and community food banks.',
      icon: Buildings,
      color: 'var(--color-wheat)'
    }
  ];

  return (
    <section
      style={{
        paddingBlock: 'var(--space-16)',
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-primary)'
      }}
    >
      <div className="container-wide">
        {/* Section Title */}
        <div style={{ textAlign: 'center', maxWidth: '640px', marginInline: 'auto', marginBottom: 'var(--space-12)' }}>
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
            Verified Ecological Balance Sheet
          </div>
          <h2 className="text-heading-3" style={{ color: 'var(--text-primary)' }}>
            Real metrics. Measured by scale, certified by kitchen directors.
          </h2>
        </div>

        {/* 4-Column Stat Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-6)'
          }}
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="card card-compact"
                style={{
                  background: 'var(--bg-elevated)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid var(--border-primary)'
                }}
              >
                <div>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-tertiary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: stat.color,
                      marginBottom: 'var(--space-4)'
                    }}
                  >
                    <Icon size={24} weight="duotone" />
                  </div>

                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(2rem, 3.5vw, 2.5rem)',
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      lineHeight: 1.1,
                      letterSpacing: '-0.02em',
                      marginBottom: 'var(--space-2)'
                    }}
                  >
                    {stat.value}
                  </div>

                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      marginBottom: 'var(--space-2)'
                    }}
                  >
                    {stat.label}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-tertiary)',
                    lineHeight: 1.5,
                    fontFamily: 'var(--font-body)'
                  }}
                >
                  {stat.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
