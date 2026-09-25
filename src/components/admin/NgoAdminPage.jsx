import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Bicycle,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Scales,
  ArrowsClockwise,
  User,
  WarningCircle
} from '@phosphor-icons/react';

export default function NgoAdminPage() {
  const { ngoRequests, updateNgoRequestStatus, showToast } = useApp();
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedRequestForWeight, setSelectedRequestForWeight] = useState(null);
  const [weighedInput, setWeighedInput] = useState('');

  const statuses = ['All', 'Pending Verification', 'Scheduled', 'En Route', 'Completed'];

  const filteredRequests = ngoRequests.filter((req) => {
    if (filterStatus !== 'All' && req.status !== filterStatus) return false;
    return true;
  });

  const handleStatusChange = (reqId, newStatus) => {
    updateNgoRequestStatus(reqId, newStatus);
  };

  const handleVerifyWeight = (e) => {
    e.preventDefault();
    if (!weighedInput || !selectedRequestForWeight) return;

    updateNgoRequestStatus(selectedRequestForWeight.id, 'Completed');
    showToast(`Logged verified weight: ${weighedInput} kg for ${selectedRequestForWeight.donorName}. Official donation tax receipt issued!`, 'success');
    setSelectedRequestForWeight(null);
    setWeighedInput('');
  };

  // Metrics
  const totalPending = ngoRequests.filter(r => r.status === 'Pending Verification').length;
  const totalEnRoute = ngoRequests.filter(r => r.status === 'En Route').length;
  const totalCompleted = ngoRequests.filter(r => r.status === 'Completed').length;
  const totalWeightKg = ngoRequests.reduce((sum, r) => sum + (r.verifiedWeightKg || 0), 0);

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
          Shelter Logistics Portal
        </div>
        <h1 className="text-heading-2" style={{ color: 'var(--text-primary)' }}>
          NGO Dispatch & Pickup Coordinator
        </h1>
        <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
          Review incoming pantry surplus alerts, coordinate volunteer cargo-bike routes, and certify verified food weights upon kitchen arrival.
        </p>
      </div>

      {/* KPI Stats Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-8)'
        }}
      >
        <div className="card card-compact" style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid var(--color-warning)' }}>
          <div className="stat-label">Pending Verification</div>
          <div className="stat-value" style={{ marginTop: 'var(--space-2)' }}>{totalPending}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>Requires kitchen intake triage</div>
        </div>

        <div className="card card-compact" style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid var(--color-terracotta)' }}>
          <div className="stat-label">Couriers En Route</div>
          <div className="stat-value" style={{ marginTop: 'var(--space-2)' }}>{totalEnRoute}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>Active cargo bikes dispatched</div>
        </div>

        <div className="card card-compact" style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid var(--color-forest)' }}>
          <div className="stat-label">Completed Dispatches</div>
          <div className="stat-value" style={{ marginTop: 'var(--space-2)' }}>{totalCompleted}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>Delivered to dining hall</div>
        </div>

        <div className="card card-compact" style={{ background: 'var(--bg-elevated)' }}>
          <div className="stat-label">Verified Intake Weight</div>
          <div className="stat-value" style={{ marginTop: 'var(--space-2)' }}>{totalWeightKg.toFixed(1)} kg</div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>Logged on calibrated scale</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: 'var(--space-6)' }}>
        <span style={{ fontSize: '11px', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginRight: '4px' }}>
          Status Filter:
        </span>
        {statuses.map(st => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className="btn btn-sm"
            style={{
              fontSize: '11px',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: filterStatus === st ? 'var(--color-forest)' : 'var(--bg-elevated)',
              color: filterStatus === st ? '#ffffff' : 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Incoming Requests Table */}
      <div className="table-wrapper" style={{ background: 'var(--bg-elevated)' }}>
        <table>
          <thead>
            <tr>
              <th>Donor & Address</th>
              <th>Recipient NGO</th>
              <th>Surplus Food Manifest</th>
              <th>Courier & Time</th>
              <th>Status</th>
              <th>Weight</th>
              <th style={{ textAlign: 'right' }}>Workflow Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((req) => (
              <tr key={req.id}>
                <td>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                    {req.donorName}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                    {req.pickupAddress}
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--color-forest)' }}>
                    {req.ngoName}
                  </div>
                </td>
                <td style={{ maxWidth: '240px' }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    {req.itemSummary}
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 500 }}>
                    {req.driverName}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                    {req.scheduledTime}
                  </div>
                </td>
                <td>
                  <span
                    className={`badge ${
                      req.status === 'Completed'
                        ? 'badge-forest'
                        : req.status === 'En Route'
                        ? 'badge-terracotta'
                        : req.status === 'Pending Verification'
                        ? 'badge-warning'
                        : 'badge-neutral'
                    }`}
                  >
                    {req.status}
                  </span>
                </td>
                <td>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>
                    {req.verifiedWeightKg ? `${req.verifiedWeightKg} kg` : 'Pending'}
                  </strong>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                    {req.status === 'Pending Verification' && (
                      <button
                        onClick={() => handleStatusChange(req.id, 'Scheduled')}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '11px', padding: '4px 8px' }}
                      >
                        Approve Intake
                      </button>
                    )}

                    {req.status === 'Scheduled' && (
                      <button
                        onClick={() => handleStatusChange(req.id, 'En Route')}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '11px', padding: '4px 8px' }}
                      >
                        <Bicycle size={13} weight="bold" />
                        <span>Dispatch Courier</span>
                      </button>
                    )}

                    {req.status === 'En Route' && (
                      <button
                        onClick={() => {
                          setSelectedRequestForWeight(req);
                          setWeighedInput(String(req.verifiedWeightKg || ''));
                        }}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: 'var(--color-forest)' }}
                      >
                        <Scales size={13} weight="bold" />
                        <span>Verify Scale Weight</span>
                      </button>
                    )}

                    {req.status === 'Completed' && (
                      <span style={{ fontSize: '11px', color: 'var(--color-forest)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={14} weight="fill" />
                        <span>Certified</span>
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Scale Weight Verification Modal */}
      {selectedRequestForWeight && (
        <div className="modal-overlay" onClick={() => setSelectedRequestForWeight(null)}>
          <div className="modal-content animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
              <h3 className="text-heading-3" style={{ color: 'var(--text-primary)' }}>
                Certified Scale Intake
              </h3>
              <button
                onClick={() => setSelectedRequestForWeight(null)}
                className="btn btn-ghost btn-icon"
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-4)' }}>
              Intake for: <strong>{selectedRequestForWeight.donorName}</strong> ({selectedRequestForWeight.itemSummary})
            </p>

            <form onSubmit={handleVerifyWeight} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="input-group">
                <label className="input-label" htmlFor="verified-kg">Final Weighed Biomass (kg) *</label>
                <input
                  id="verified-kg"
                  type="number"
                  step="0.1"
                  min="0.1"
                  className="input"
                  value={weighedInput}
                  onChange={(e) => setWeighedInput(e.target.value)}
                  placeholder="e.g. 2.4"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
                <button
                  type="button"
                  onClick={() => setSelectedRequestForWeight(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle size={16} weight="bold" />
                  <span>Issue Official Receipt</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
