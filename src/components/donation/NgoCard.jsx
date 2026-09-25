import React from 'react';
import {
  MapPin,
  Clock,
  Phone,
  CheckCircle,
  ThermometerSimple,
  ForkKnife,
  ArrowRight,
  Handshake
} from '@phosphor-icons/react';

export default function NgoCard({ ngo, isSelected, onSelect, onScheduleDonation }) {
  const isUrgent = ngo.capacityStatus === 'urgent';
  const isHighDemand = ngo.capacityStatus === 'high_demand';

  return (
    <div
      onClick={onSelect}
      className="card card-interactive"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        border: isSelected
          ? '2px solid var(--color-forest)'
          : isUrgent
          ? '1.5px solid var(--color-danger)'
          : '1px solid var(--border-primary)',
        backgroundColor: isSelected ? 'var(--bg-tertiary)' : 'var(--bg-elevated)',
        cursor: 'pointer',
        padding: 'var(--space-6)'
      }}
    >
      <div>
        {/* Top Badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
          <span
            className={`badge ${
              isUrgent ? 'badge-danger' : isHighDemand ? 'badge-terracotta' : 'badge-forest'
            }`}
          >
            {isUrgent ? 'Urgent Pantry Shortage' : isHighDemand ? 'High Demand' : 'Normal Intake'}
          </span>

          <span
            style={{
              fontSize: 'var(--text-xs)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              color: 'var(--color-forest)'
            }}
          >
            {ngo.distanceKm} km away
          </span>
        </div>

        {/* NGO Title */}
        <h4
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-lg)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1.25,
            marginBottom: '4px'
          }}
        >
          {ngo.name}
        </h4>

        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-3)' }}>
          {ngo.type}
        </div>

        {/* Address and Hours */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} color="var(--text-tertiary)" />
            <span>{ngo.address}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} color="var(--text-tertiary)" />
            <span>{ngo.openHours}</span>
          </div>
        </div>

        {/* Urgent Needs Tags */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '6px' }}>
            Needed Provisions:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {ngo.urgentNeeds.map((need, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-display)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--bg-inset)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                {need}
              </span>
            ))}
          </div>
        </div>

        {/* Facilities badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: 'var(--space-4)' }}>
          {ngo.refrigeratedStorage && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ThermometerSimple size={13} color="var(--color-forest)" />
              <span>Cold Storage Ready</span>
            </div>
          )}
          {ngo.acceptsCookedFood && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ForkKnife size={13} color="var(--color-terracotta)" />
              <span>Cooked Batches OK</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div style={{ paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)' }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onScheduleDonation(ngo);
          }}
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <Handshake size={16} weight="bold" />
          <span>Dispatch Food Donation</span>
        </button>
      </div>
    </div>
  );
}
