import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAlerts } from '../../hooks/useAlerts';
import { Warning, Bell, ArrowRight, X, CookingPot, Handshake } from '@phosphor-icons/react';

export default function SmartAlertsBanner() {
  const { dismissAlert } = useAlerts();
  const { alerts, setCurrentView, setSelectedRecipeForModal, recipes, setSelectedNgoForDonation, setIsScheduleDonationOpen, ngos } = useApp();

  if (!alerts || alerts.length === 0) return null;

  const handleAction = (alert) => {
    if (alert.actionType === 'recipe') {
      const match = recipes.find(r => r.id === alert.targetRecipeId) || recipes[0];
      setSelectedRecipeForModal(match);
      setCurrentView('recipes');
    } else if (alert.actionType === 'donate') {
      const targetNgo = ngos.find(n => n.id === alert.targetNgoId) || ngos[0];
      setSelectedNgoForDonation(targetNgo);
      setIsScheduleDonationOpen(true);
      setCurrentView('redistribution');
    } else if (alert.actionType === 'marketplace') {
      setCurrentView('marketplace');
    }
  };

  return (
    <div style={{ marginBottom: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {alerts.map((alert) => {
        const isUrgent = alert.severity === 'urgent';
        return (
          <div
            key={alert.id}
            className="animate-fade-in-up"
            style={{
              padding: 'var(--space-4) var(--space-6)',
              borderRadius: 'var(--radius-xl)',
              backgroundColor: isUrgent ? 'var(--color-danger-light)' : 'var(--color-warning-light)',
              border: `1.5px solid ${isUrgent ? 'var(--color-danger)' : 'var(--color-warning)'}`,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-4)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: 1, minWidth: '280px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isUrgent ? 'var(--color-danger)' : 'var(--color-warning)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Warning size={20} weight="fill" />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                    {alert.itemTitle}
                  </span>
                  <span
                    className={`badge ${isUrgent ? 'badge-danger' : 'badge-warning'}`}
                    style={{ fontSize: '10px', padding: '1px 6px' }}
                  >
                    {alert.timeRemaining}
                  </span>
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {alert.suggestedAction}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <button
                onClick={() => handleAction(alert)}
                className="btn btn-sm"
                style={{
                  backgroundColor: isUrgent ? 'var(--color-danger)' : 'var(--color-forest)',
                  color: '#ffffff',
                  fontSize: '12px'
                }}
              >
                {alert.actionType === 'recipe' && <CookingPot size={14} weight="bold" />}
                {alert.actionType === 'donate' && <Handshake size={14} weight="bold" />}
                <span>Act Now</span>
                <ArrowRight size={13} weight="bold" />
              </button>

              <button
                onClick={() => dismissAlert(alert.id)}
                className="btn btn-ghost btn-sm"
                style={{ padding: '4px', color: 'var(--text-tertiary)' }}
                title="Dismiss Alert"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
