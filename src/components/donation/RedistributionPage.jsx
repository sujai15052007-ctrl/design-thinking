import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import ShelterMap from './ShelterMap';
import NgoCard from './NgoCard';
import ScheduleDonationModal from './ScheduleDonationModal';
import {
  Handshake,
  MapPin,
  Bicycle,
  ShieldCheck,
  CheckCircle,
  Funnel,
  ThermometerSimple,
  Clock
} from '@phosphor-icons/react';

export default function RedistributionPage() {
  const {
    ngos,
    ngoRequests,
    isScheduleDonationOpen,
    setIsScheduleDonationOpen,
    selectedNgoForDonation,
    setSelectedNgoForDonation
  } = useApp();

  const [activeNgoId, setActiveNgoId] = useState(null);
  const activeNgo = ngos.find((ngo) => ngo.id === activeNgoId) || ngos[0] || null;
  const [filterType, setFilterType] = useState('All'); // 'All' | 'Urgent' | 'Refrigerated'

  const setActiveNgo = (ngo) => setActiveNgoId(ngo?.id || null);

  const filteredNgos = ngos.filter(n => {
    if (filterType === 'Urgent') return n.capacityStatus === 'urgent';
    if (filterType === 'Refrigerated') return n.refrigeratedStorage;
    return true;
  });

  const handleOpenSchedule = (ngo) => {
    setSelectedNgoForDonation(ngo);
    setIsScheduleDonationOpen(true);
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
          Direct Redistribution Network
        </div>
        <h1 className="text-heading-2" style={{ color: 'var(--text-primary)' }}>
          Surplus-to-Shelter Matchmaker
        </h1>
        <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
          Match your extra groceries and bakery overstock with 5 verified grassroots kitchens, community food locks, and mutual-aid hubs across Vancouver.
        </p>
      </div>

      {/* Active Donation Tracking Banner */}
      {ngoRequests.length > 0 && (
        <div
          className="card"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderLeft: '4px solid var(--color-forest)',
            padding: 'var(--space-5) var(--space-6)',
            marginBottom: 'var(--space-8)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bicycle size={20} color="var(--color-forest)" weight="bold" />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                Active Redistribution Dispatches ({ngoRequests.length})
              </span>
            </div>
            <span className="badge badge-forest">Live Mesh Protocol</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
            {ngoRequests.slice(0, 3).map((req) => (
              <div
                key={req.id}
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-inset)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}>
                    {req.ngoName}
                  </span>
                  <span
                    className={`badge ${
                      req.status === 'Completed'
                        ? 'badge-forest'
                        : req.status === 'En Route'
                        ? 'badge-terracotta'
                        : 'badge-neutral'
                    }`}
                    style={{ fontSize: '10px' }}
                  >
                    {req.status}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                  {req.itemSummary}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--color-forest)', fontWeight: 500 }}>
                  {req.driverName} • {req.scheduledTime}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Interactive Map + Shelter Directory */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: 'var(--space-8)',
          alignItems: 'start'
        }}
        className="redistribution-grid"
      >
        {/* Left Column: Interactive Map Canvas */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)' }}>
              Regional Hub Radar
            </span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
              Select a pin to inspect shelter profile
            </span>
          </div>

          <ShelterMap
            ngos={filteredNgos}
            selectedNgo={activeNgo}
            onSelectNgo={setActiveNgo}
            onDonateNgo={handleOpenSchedule}
          />

          {/* Map Footnote */}
          <div
            style={{
              marginTop: 'var(--space-4)',
              padding: 'var(--space-4)',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)'
            }}
          >
            <ShieldCheck size={24} color="var(--color-forest)" weight="duotone" />
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
              <strong>Provincial Food Donor Protection Act:</strong> Donating surplus food in good faith is legally indemnified and protected across British Columbia.
            </div>
          </div>
        </div>

        {/* Right Column: NGO Shelter Cards List */}
        <div>
          {/* Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: 'var(--space-4)' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              Filter:
            </span>
            {[
              { id: 'All', label: 'All Centers' },
              { id: 'Urgent', label: 'Urgent Shortages' },
              { id: 'Refrigerated', label: 'Cold Storage Ready' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className="btn btn-sm"
                style={{
                  fontSize: '11px',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: filterType === f.id ? 'var(--color-forest)' : 'var(--bg-tertiary)',
                  color: filterType === f.id ? '#ffffff' : 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {filteredNgos.map((ngo) => (
              <NgoCard
                key={ngo.id}
                ngo={ngo}
                isSelected={activeNgo?.id === ngo.id}
                onSelect={() => setActiveNgo(ngo)}
                onScheduleDonation={handleOpenSchedule}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Schedule Donation Modal */}
      {isScheduleDonationOpen && (
        <ScheduleDonationModal
          targetNgo={selectedNgoForDonation || activeNgo}
          onClose={() => setIsScheduleDonationOpen(false)}
        />
      )}

      {/* Responsive Grid fallback */}
      <style>{`
        @media (max-width: 960px) {
          .redistribution-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
