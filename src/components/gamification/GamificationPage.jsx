import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Trophy,
  Flame,
  Medal,
  Plant,
  Sparkle,
  ShieldCheck,
  CheckCircle,
  Lock,
  Heart,
  Crown
} from '@phosphor-icons/react';

export default function GamificationPage() {
  const { user, badges, leaderboard } = useApp();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unlocked' | 'locked'

  const filteredBadges = badges.filter((b) => {
    if (activeTab === 'unlocked') return b.unlocked;
    if (activeTab === 'locked') return !b.unlocked;
    return true;
  });

  // Calculate XP progress to next level
  const currentXP = user.ecoScore;
  const targetXP = 4000;
  const progressPercent = Math.min(100, Math.round((currentXP / targetXP) * 100));

  return (
    <div className="container-wide" style={{ paddingBlock: 'var(--space-8)' }}>
      {/* Header */}
      <div style={{ maxWidth: '720px', marginBottom: 'var(--space-8)' }}>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-terracotta)',
            marginBottom: 'var(--space-1)'
          }}
        >
          Regenerative Recognition
        </div>
        <h1 className="text-heading-2" style={{ color: 'var(--text-primary)' }}>
          Community Champions & Eco Milestones
        </h1>
        <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
          Celebrate daily habits that divert solid biomass from methane landfills. Track your streak, earn certified badges, and inspire neighborhood stewardship.
        </p>
      </div>

      {/* Hero Level & Streak Progression Card */}
      <div
        className="card"
        style={{
          backgroundColor: 'var(--color-night)',
          color: 'var(--color-cream)',
          padding: 'clamp(1.5rem, 4vw, 2.5rem)',
          marginBottom: 'var(--space-8)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            alignItems: 'center',
            gap: 'var(--space-8)'
          }}
        >
          {/* Level Info */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'var(--color-mint)',
                fontSize: 'var(--text-xs)',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: 'var(--space-4)'
              }}
            >
              <Plant size={15} weight="fill" />
              <span>Level Tier {user.levelTier} Steward</span>
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.15,
                marginBottom: 'var(--space-2)'
              }}
            >
              {user.level}
            </h2>

            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-sand)', marginBottom: 'var(--space-6)' }}>
              You have diverted <strong>{user.metrics.wasteDivertedKg} kg</strong> of organic food, safely averting <strong>{user.metrics.co2SavedKg} kg</strong> of methane greenhouse emissions.
            </p>

            {/* XP Progress Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--color-parchment)', marginBottom: '6px' }}>
                <span>{currentXP} Eco XP</span>
                <span>Next Rank: Ecosystem Steward ({targetXP} XP)</span>
              </div>
              <div className="progress-bar" style={{ height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                <div
                  className="progress-fill"
                  style={{ width: `${progressPercent}%`, backgroundColor: 'var(--color-mint)' }}
                />
              </div>
            </div>
          </div>

          {/* Streak Flame Tracker */}
          <div
            style={{
              padding: 'var(--space-6)',
              borderRadius: 'var(--radius-xl)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(196, 101, 46, 0.25)',
                color: 'var(--color-terracotta)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--space-3)'
              }}
            >
              <Flame size={36} weight="fill" />
            </div>

            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-4xl)',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1
              }}
            >
              {user.streakDays} Days
            </div>

            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-sm)',
                fontWeight: 700,
                color: 'var(--color-wheat)',
                marginTop: '4px',
                marginBottom: 'var(--space-2)'
              }}
            >
              Zero-Discard Streak
            </div>

            <p style={{ fontSize: '11px', color: 'var(--color-sand)', maxWidth: '28ch' }}>
              Consecutive days with zero edible food discarded to trash. Top 3% in Kitsilano.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Badges Showcase (Left) + Leaderboard (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: 'var(--space-8)'
        }}
        className="gamification-grid"
      >
        {/* Left Column: Badges Showcase */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
            <div>
              <h3 className="text-heading-3" style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)' }}>
                Ecological Badges ({badges.filter(b => b.unlocked).length}/{badges.length})
              </h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                Verified milestones recognized across Vancouver food banks
              </p>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {[
                { id: 'all', label: 'All' },
                { id: 'unlocked', label: 'Earned' },
                { id: 'locked', label: 'Locked' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="btn btn-sm"
                  style={{
                    fontSize: '11px',
                    padding: '3px 10px',
                    backgroundColor: activeTab === tab.id ? 'var(--color-forest)' : 'var(--bg-tertiary)',
                    color: activeTab === tab.id ? '#ffffff' : 'var(--text-secondary)',
                    borderRadius: 'var(--radius-full)',
                    border: 'none'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Badges Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
            {filteredBadges.map((badge) => {
              const isUnlocked = badge.unlocked;
              return (
                <div
                  key={badge.id}
                  className="card card-compact"
                  style={{
                    backgroundColor: isUnlocked ? 'var(--bg-elevated)' : 'var(--bg-inset)',
                    border: isUnlocked ? '1.5px solid var(--color-forest)' : '1px dashed var(--border-secondary)',
                    opacity: isUnlocked ? 1 : 0.65,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: isUnlocked ? 'var(--color-success-light)' : 'var(--bg-tertiary)',
                          color: isUnlocked ? 'var(--color-forest)' : 'var(--text-tertiary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {isUnlocked ? <Medal size={20} weight="fill" /> : <Lock size={18} />}
                      </div>

                      <span
                        className="badge"
                        style={{
                          fontSize: '10px',
                          backgroundColor:
                            badge.tier === 'Gold'
                              ? 'rgba(212, 167, 71, 0.15)'
                              : badge.tier === 'Diamond'
                              ? 'rgba(74, 122, 46, 0.15)'
                              : 'var(--bg-inset)',
                          color:
                            badge.tier === 'Gold'
                              ? 'var(--color-clay)'
                              : 'var(--color-forest)'
                        }}
                      >
                        {badge.tier}
                      </span>
                    </div>

                    <h4
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        marginBottom: '4px'
                      }}
                    >
                      {badge.name}
                    </h4>

                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.5, fontFamily: 'var(--font-body)' }}>
                      {badge.description}
                    </p>
                  </div>

                  <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--border-subtle)', fontSize: '11px', color: 'var(--text-tertiary)' }}>
                    {isUnlocked ? (
                      <span style={{ color: 'var(--color-forest)', fontWeight: 600 }}>
                        ✓ Unlocked {badge.unlockedDate}
                      </span>
                    ) : (
                      <span>Progress: {badge.progress}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Community Leaderboard */}
        <div>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <h3 className="text-heading-3" style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)' }}>
              Community Diversion Leaderboard
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
              Top contributors this month across Vancouver West
            </p>
          </div>

          <div
            className="card card-flush"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-primary)'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {leaderboard.map((champ) => {
                const isYou = champ.name.includes('(You)');
                return (
                  <div
                    key={champ.rank}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 'var(--space-4) var(--space-5)',
                      borderBottom: '1px solid var(--border-subtle)',
                      backgroundColor: isYou ? 'var(--color-success-light)' : 'transparent'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <div
                        style={{
                          width: '24px',
                          fontFamily: 'var(--font-display)',
                          fontWeight: 800,
                          fontSize: 'var(--text-sm)',
                          color: champ.rank === 1 ? 'var(--color-clay)' : champ.rank === 2 ? 'var(--color-stone)' : 'var(--text-tertiary)'
                        }}
                      >
                        #{champ.rank}
                      </div>

                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: isYou ? 700 : 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                          {champ.name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                          {champ.type} • {champ.location}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-forest)' }}>
                        {champ.divertedKg} kg
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--color-terracotta)', fontWeight: 600 }}>
                        {champ.streak}d streak
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .gamification-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
