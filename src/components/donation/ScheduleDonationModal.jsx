import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Handshake, Check, Bicycle, Truck, Clock, Calendar, WarningCircle } from '@phosphor-icons/react';

export default function ScheduleDonationModal({ targetNgo, onClose }) {
  const { inventory, donateInventoryItem, user, showToast } = useApp();

  const [selectedItemIds, setSelectedItemIds] = useState(
    inventory.length > 0 ? [inventory[0].id] : []
  );
  const [transportMode, setTransportMode] = useState('courier'); // 'courier' | 'dropoff'
  const [pickupTimeSlot, setPickupTimeSlot] = useState('Today 16:00 - 18:00');
  const [notes, setNotes] = useState('');

  const toggleItem = (id) => {
    setSelectedItemIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedItemIds.length === 0) {
      showToast('Please select at least one item to donate.', 'warning');
      return;
    }

    selectedItemIds.forEach(id => {
      donateInventoryItem(id, targetNgo?.id);
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                color: 'var(--color-terracotta)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em'
              }}
            >
              Surplus Redistribution Protocol
            </div>
            <h3 className="text-heading-3" style={{ color: 'var(--text-primary)' }}>
              Dispatch Food to {targetNgo?.name || 'Local Shelter'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-icon"
            style={{ width: '36px', height: '36px', padding: 0, justifyContent: 'center' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* Target NGO Snapshot */}
          {targetNgo && (
            <div
              style={{
                padding: 'var(--space-4)',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                  {targetNgo.name}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                  {targetNgo.address} • {targetNgo.distanceKm} km away
                </div>
              </div>
              <span className="badge badge-forest">Open for intake</span>
            </div>
          )}

          {/* Select Inventory Items */}
          <div>
            <label className="input-label" style={{ marginBottom: 'var(--space-2)', display: 'block' }}>
              Select Items from Your Crisper/Pantry to Donate:
            </label>

            {inventory.length === 0 ? (
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontStyle: 'italic', padding: 'var(--space-4)', textAlign: 'center' }}>
                Your inventory is currently empty. Log some food items first!
              </div>
            ) : (
              <div
                style={{
                  maxHeight: '180px',
                  overflowY: 'auto',
                  border: '1px solid var(--border-secondary)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-2)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                {inventory.map((item) => {
                  const isChecked = selectedItemIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: isChecked ? 'var(--color-success-light)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background-color 150ms ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '4px',
                            border: `1.5px solid ${isChecked ? 'var(--color-forest)' : 'var(--border-secondary)'}`,
                            backgroundColor: isChecked ? 'var(--color-forest)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff'
                          }}
                        >
                          {isChecked && <Check size={12} weight="bold" />}
                        </div>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>
                          {item.name}
                        </span>
                      </div>

                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Transport Method */}
          <div>
            <label className="input-label" style={{ marginBottom: 'var(--space-2)', display: 'block' }}>
              Redistribution Transport:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              <button
                type="button"
                onClick={() => setTransportMode('courier')}
                style={{
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  border: `1.5px solid ${transportMode === 'courier' ? 'var(--color-forest)' : 'var(--border-secondary)'}`,
                  backgroundColor: transportMode === 'courier' ? 'var(--color-success-light)' : 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Bicycle size={20} color={transportMode === 'courier' ? 'var(--color-forest)' : 'var(--text-tertiary)'} />
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-xs)' }}>
                    Volunteer Courier
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                    Cargo bike arrives at your door
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTransportMode('dropoff')}
                style={{
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  border: `1.5px solid ${transportMode === 'dropoff' ? 'var(--color-forest)' : 'var(--border-secondary)'}`,
                  backgroundColor: transportMode === 'dropoff' ? 'var(--color-success-light)' : 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Truck size={20} color={transportMode === 'dropoff' ? 'var(--color-forest)' : 'var(--text-tertiary)'} />
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-xs)' }}>
                    Direct Drop-Off
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                    I will deliver to the kitchen
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Time Slot */}
          <div className="input-group">
            <label className="input-label" htmlFor="time-slot">Preferred Window</label>
            <select
              id="time-slot"
              className="input select"
              value={pickupTimeSlot}
              onChange={(e) => setPickupTimeSlot(e.target.value)}
            >
              <option value="Today 16:00 - 18:00">Today 16:00 - 18:00</option>
              <option value="Today 18:30 - 20:30">Today 18:30 - 20:30</option>
              <option value="Tomorrow Morning (09:00 - 11:30)">Tomorrow Morning (09:00 - 11:30)</option>
              <option value="Immediately (Urgent Courier Callout)">Immediately (Urgent Courier Callout)</option>
            </select>
          </div>

          {/* Special Notes */}
          <div className="input-group">
            <label className="input-label" htmlFor="donation-notes">Handling Instructions (Optional)</label>
            <input
              id="donation-notes"
              type="text"
              className="input"
              placeholder="e.g. Leave in cooler on front porch, or ring buzzer 402."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={selectedItemIds.length === 0}
            >
              <Handshake size={16} weight="bold" />
              <span>Confirm Dispatch ({selectedItemIds.length} items)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
