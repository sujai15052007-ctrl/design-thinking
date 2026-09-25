import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import OnboardingModal from './OnboardingModal';
import {
  UserCircle,
  Gear,
  Bell,
  Sliders,
  Sparkle,
  ArrowClockwise,
  CheckCircle,
  Plant,
  ShieldCheck,
  House,
  Storefront,
  Building
} from '@phosphor-icons/react';

export default function ProfileSettingsPage() {
  const { user, setUser, setUserRole, showToast } = useApp();
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  const [name, setName] = useState(user.name);
  const [location, setLocation] = useState(user.location);
  const [bio, setBio] = useState(user.bio);
  const [dietary, setDietary] = useState(user.preferences.dietary || ['Vegetarian']);
  const [measurementUnit, setMeasurementUnit] = useState(user.preferences.measurementUnit || 'metric');
  const [notify24h, setNotify24h] = useState(user.preferences.notifyExpiring24h !== false);
  const [notifyMarketplace, setNotifyMarketplace] = useState(user.preferences.notifyCommunityClaim !== false);
  const [notifyPickup, setNotifyPickup] = useState(user.preferences.notifyDonationPickup !== false);

  const dietaryOptions = ['Vegetarian', 'Vegan', 'Dairy-Friendly', 'Gluten-Free', 'Nut-Free', 'Halal'];

  const toggleDietary = (opt) => {
    setDietary(prev =>
      prev.includes(opt) ? prev.filter(d => d !== opt) : [...prev, opt]
    );
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      name,
      location,
      bio,
      preferences: {
        ...prev.preferences,
        dietary,
        measurementUnit,
        notifyExpiring24h: notify24h,
        notifyCommunityClaim: notifyMarketplace,
        notifyDonationPickup: notifyPickup
      }
    }));
    showToast('Profile and preferences updated successfully.', 'success');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all inventory, marketplace, and dispatch states back to baseline demo defaults?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

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
            color: 'var(--color-forest)',
            marginBottom: 'var(--space-1)'
          }}
        >
          Identity & Node Configuration
        </div>
        <h1 className="text-heading-2" style={{ color: 'var(--text-primary)' }}>
          Profile & System Settings
        </h1>
        <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
          Manage your household role, dietary filters, local alert preferences, and storage defaults.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: 'var(--space-8)'
        }}
        className="profile-grid"
      >
        {/* Left Column: User Snapshot & Role Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Identity Card */}
          <div className="card" style={{ backgroundColor: 'var(--bg-elevated)', textAlign: 'center' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-forest)',
                color: 'var(--color-cream)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginInline: 'auto',
                marginBottom: 'var(--space-4)',
                fontSize: '28px',
                fontFamily: 'var(--font-display)',
                fontWeight: 700
              }}
            >
              {user.name.charAt(0)}
            </div>

            <h3 className="text-heading-3" style={{ fontSize: 'var(--text-xl)', color: 'var(--text-primary)' }}>
              {user.name}
            </h3>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-3)' }}>
              {user.handle} • Member since {user.joinedDate}
            </div>

            <span className="badge badge-forest" style={{ marginBottom: 'var(--space-4)' }}>
              {user.level} (Tier {user.levelTier})
            </span>

            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.5, fontStyle: 'italic', marginBottom: 'var(--space-6)' }}>
              "{user.bio}"
            </div>

            <div
              style={{
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--bg-inset)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--space-2)',
                textAlign: 'left'
              }}
            >
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Diverted</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-forest)' }}>
                  {user.metrics.wasteDivertedKg} kg
                </div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Streak</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-terracotta)' }}>
                  {user.streakDays} Days
                </div>
              </div>
            </div>
          </div>

          {/* Quick Onboarding Replay */}
          <div className="card" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginBottom: '8px' }}>
              System Walkthrough
            </h4>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
              Need a reminder of how the inventory radar, shelter matching, and chef engine work together?
            </p>
            <button
              type="button"
              onClick={() => setShowOnboardingModal(true)}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Sparkle size={14} weight="bold" />
              <span>Launch Product Tour</span>
            </button>
          </div>

          {/* Demo Reset Button */}
          <div className="card" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px dashed var(--color-danger)' }}>
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-danger)', marginBottom: '4px' }}>
              Data Controls
            </h4>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-3)' }}>
              Reset client state back to starting demo data.
            </p>
            <button
              onClick={handleResetData}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--color-danger)', border: '1px solid var(--color-danger)', width: '100%', justifyContent: 'center' }}
            >
              <ArrowClockwise size={14} />
              <span>Reset Demo State</span>
            </button>
          </div>
        </div>

        {/* Right Column: Settings Form */}
        <div className="card" style={{ backgroundColor: 'var(--bg-elevated)' }}>
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Perspective / Role Selector */}
            <div>
              <label className="input-label" style={{ marginBottom: 'var(--space-3)', display: 'block' }}>
                Active Operating Role:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-3)' }}>
                {[
                  { role: 'household', label: 'Home Cook', desc: 'Family pantry & crisper tracking', icon: House },
                  { role: 'business', label: 'Bakery / Cafe', desc: 'Commercial overstock & day-end batards', icon: Storefront },
                  { role: 'ngo', label: 'NGO Food Bank', desc: 'Shelter logistics & intake scale', icon: Building }
                ].map(r => {
                  const Icon = r.icon;
                  const isSelected = user.role === r.role;
                  return (
                    <div
                      key={r.role}
                      onClick={() => setUserRole(r.role)}
                      style={{
                        padding: 'var(--space-4)',
                        borderRadius: 'var(--radius-lg)',
                        border: `1.5px solid ${isSelected ? 'var(--color-forest)' : 'var(--border-secondary)'}`,
                        backgroundColor: isSelected ? 'var(--color-success-light)' : 'var(--bg-secondary)',
                        cursor: 'pointer',
                        transition: 'all 150ms ease'
                      }}
                    >
                      <Icon size={20} color={isSelected ? 'var(--color-forest)' : 'var(--text-tertiary)'} weight={isSelected ? 'fill' : 'regular'} style={{ marginBottom: '6px' }} />
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                        {r.label}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                        {r.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Name & Location */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="input-group">
                <label className="input-label" htmlFor="user-name">Display Name</label>
                <input
                  id="user-name"
                  type="text"
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="user-location">Neighborhood / District</label>
                <input
                  id="user-location"
                  type="text"
                  className="input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Bio */}
            <div className="input-group">
              <label className="input-label" htmlFor="user-bio">Kitchen Mission Statement</label>
              <input
                id="user-bio"
                type="text"
                className="input"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            {/* Dietary Preferences */}
            <div>
              <label className="input-label" style={{ marginBottom: '8px', display: 'block' }}>
                Dietary & Culinary Preferences
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {dietaryOptions.map((opt) => {
                  const isSelected = dietary.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleDietary(opt)}
                      style={{
                        fontSize: '11px',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 600,
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-full)',
                        border: `1.5px solid ${isSelected ? 'var(--color-forest)' : 'var(--border-secondary)'}`,
                        backgroundColor: isSelected ? 'var(--color-forest)' : 'var(--bg-secondary)',
                        color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                        cursor: 'pointer'
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Units of Measurement */}
            <div>
              <label className="input-label" style={{ marginBottom: '8px', display: 'block' }}>
                Measurement System
              </label>
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                {[
                  { id: 'metric', label: 'Metric (grams, kg, liters)' },
                  { id: 'imperial', label: 'Imperial (oz, lbs, fl oz)' }
                ].map((unit) => (
                  <button
                    key={unit.id}
                    type="button"
                    onClick={() => setMeasurementUnit(unit.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-md)',
                      border: `1.5px solid ${measurementUnit === unit.id ? 'var(--color-forest)' : 'var(--border-secondary)'}`,
                      backgroundColor: measurementUnit === unit.id ? 'var(--color-success-light)' : 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {unit.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications & Alert Preferences */}
            <div>
              <label className="input-label" style={{ marginBottom: 'var(--space-3)', display: 'block' }}>
                Proactive Radar Alerts
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notify24h}
                    onChange={(e) => setNotify24h(e.target.checked)}
                    style={{ accentColor: 'var(--color-forest)', width: '16px', height: '16px' }}
                  />
                  <span>Dispatch critical warning when pantry item enters &lt; 24h shelf life</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notifyMarketplace}
                    onChange={(e) => setNotifyMarketplace(e.target.checked)}
                    style={{ accentColor: 'var(--color-forest)', width: '16px', height: '16px' }}
                  />
                  <span>Notify when a neighbor claims or reserves surplus food on Marketplace</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notifyPickup}
                    onChange={(e) => setNotifyPickup(e.target.checked)}
                    style={{ accentColor: 'var(--color-forest)', width: '16px', height: '16px' }}
                  />
                  <span>Live tracking alerts when volunteer cargo bike courier is en route</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-primary)' }}>
              <button type="submit" className="btn btn-primary btn-lg">
                <CheckCircle size={18} weight="bold" />
                <span>Save Preferences</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Onboarding Walkthrough Modal */}
      {showOnboardingModal && (
        <OnboardingModal onClose={() => setShowOnboardingModal(false)} />
      )}

      <style>{`
        @media (max-width: 860px) {
          .profile-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
