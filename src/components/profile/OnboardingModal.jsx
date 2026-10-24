import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Plant,
  HourglassMedium,
  Handshake,
  CookingPot,
  ArrowRight,
  ArrowLeft,
  Check,
  X
} from '@phosphor-icons/react';

export default function OnboardingModal({ onClose }) {
  const { setCurrentView, user, setUser, showToast } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [role, setRole] = useState(user?.role || 'household');
  const [units, setUnits] = useState(user?.preferences?.measurementUnit || 'metric');

  const steps = [
    {
      title: 'Welcome to ReRoot',
      subtitle: 'Regenerative Food Management',
      description: 'Over 1.3 billion tonnes of food is squandered each year. ReRoot transforms your kitchen from an accidental dead end into a conscious, thriving community nourishment node.',
      icon: Plant,
      color: 'var(--color-forest)',
      highlight: 'Zero food to landfill'
    },
    {
      title: '1. Track Shelf Life in Seconds',
      subtitle: 'Predictive Crisper Radar',
      description: 'Quickly log groceries or bakery items. ReRoot automatically computes remaining shelf life, warning you 48 hours and 24 hours before peak freshness begins to decline.',
      icon: HourglassMedium,
      color: 'var(--color-warning)',
      highlight: 'Smart countdown timers'
    },
    {
      title: '2. One-Tap Shelter Dispatch',
      subtitle: 'Mutual-Aid Cargo Bikes',
      description: 'When you have surplus greens or loaves you cannot finish, dispatch them directly to 5 verified local soup kitchens and mutual-aid food banks within 2 kilometers.',
      icon: Handshake,
      color: 'var(--color-terracotta)',
      highlight: 'Protected by Good Samaritan acts'
    },
    {
      title: '3. Zero-Waste Culinary Alchemy',
      subtitle: 'Cook What Is Expiring First',
      description: 'Our culinary engine cross-references what is in your crisper drawer right now to generate delicious, waste-free recipes with step-by-step guidance.',
      icon: CookingPot,
      color: 'var(--color-clay)',
      highlight: 'Never wonder what to cook'
    }
  ];

  const current = steps[currentStep];
  const Icon = current.icon;

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        await setUser((previous) => ({
          ...previous,
          role,
          preferences: { ...previous.preferences, measurementUnit: units },
        }));
        onClose();
        setCurrentView('dashboard');
      } catch (error) {
        showToast(error.message, 'error');
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content animate-fade-in-up"
        style={{ maxWidth: '520px', padding: 'var(--space-8)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {steps.map((_, i) => (
              <span
                key={i}
                style={{
                  width: i === currentStep ? '24px' : '8px',
                  height: '6px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: i === currentStep ? 'var(--color-forest)' : 'var(--border-secondary)',
                  transition: 'all 200ms ease'
                }}
              />
            ))}
          </div>

          <button
            onClick={onClose}
            className="btn btn-ghost btn-icon"
            style={{ width: '32px', height: '32px', padding: 0, justifyContent: 'center' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Step Graphic */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-xl)',
            backgroundColor: 'var(--bg-tertiary)',
            color: current.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 'var(--space-5)'
          }}
        >
          <Icon size={36} weight="duotone" />
        </div>

        {/* Step Content */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: current.color,
              marginBottom: 'var(--space-1)'
            }}
          >
            {current.subtitle}
          </div>

          {currentStep === 0 && (
            <div style={{ display: 'grid', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
              <div className="input-group">
                <label className="input-label" htmlFor="onboarding-role">Your role</label>
                <select id="onboarding-role" className="input select" value={role} onChange={(event) => setRole(event.target.value)}>
                  <option value="household">Home cook</option>
                  <option value="business">Business</option>
                  <option value="ngo">NGO food bank</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="onboarding-units">Measurement units</label>
                <select id="onboarding-units" className="input select" value={units} onChange={(event) => setUnits(event.target.value)}>
                  <option value="metric">Metric</option>
                  <option value="imperial">Imperial</option>
                </select>
              </div>
            </div>
          )}

          <h3
            className="text-heading-3"
            style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}
          >
            {current.title}
          </h3>

          <p
            className="text-body"
            style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}
          >
            {current.description}
          </p>

          <div
            style={{
              marginTop: 'var(--space-4)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-inset)',
              fontSize: '11px',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              color: 'var(--text-primary)'
            }}
          >
            <span>✓ {current.highlight}</span>
          </div>
        </div>

        {/* Footer Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-primary)' }}>
          {currentStep > 0 ? (
            <button
              onClick={handlePrev}
              className="btn btn-secondary btn-sm"
            >
              <ArrowLeft size={14} weight="bold" />
              <span>Previous</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className="btn btn-primary btn-sm"
          >
            <span>{currentStep === steps.length - 1 ? 'Start Using ReRoot' : 'Continue'}</span>
            {currentStep === steps.length - 1 ? (
              <Check size={14} weight="bold" />
            ) : (
              <ArrowRight size={14} weight="bold" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
