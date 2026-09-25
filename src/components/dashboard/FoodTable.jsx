import React from 'react';
import { useApp } from '../../context/AppContext';
import { Check, Handshake, CookingPot, Trash, X, Clock } from '@phosphor-icons/react';

export default function FoodTable({ items }) {
  const { markAsConsumed, donateInventoryItem, discardInventoryItem, deleteInventoryItem, setCurrentView, setSelectedRecipeForModal, recipes } = useApp();

  return (
    <div className="table-wrapper" style={{ background: 'var(--bg-elevated)' }}>
      <table>
        <thead>
          <tr>
            <th>Item & Details</th>
            <th>Category</th>
            <th>Storage</th>
            <th>Quantity</th>
            <th>Status / Expiry</th>
            <th>Est. Value</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const now = new Date();
            const expiry = new Date(item.expiryDate);
            const diffHours = Math.round((expiry - now) / (1000 * 60 * 60));
            const diffDays = Math.ceil(diffHours / 24);

            let badgeClass = 'badge-forest';
            let label = `${diffDays} days`;

            if (diffHours <= 0) {
              badgeClass = 'badge-danger';
              label = 'Expired';
            } else if (diffHours <= 24) {
              badgeClass = 'badge-danger';
              label = `${diffHours} hrs`;
            } else if (diffDays <= 2) {
              badgeClass = 'badge-warning';
              label = `${diffDays} days`;
            }

            return (
              <tr key={item.id}>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                    {item.name}
                  </div>
                  {item.notes && (
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                      {item.notes}
                    </div>
                  )}
                </td>
                <td>
                  <span className="badge badge-neutral">{item.category}</span>
                </td>
                <td>{item.storage}</td>
                <td style={{ fontWeight: 600 }}>
                  {item.quantity} {item.unit}
                </td>
                <td>
                  <span className={`badge ${badgeClass}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={11} weight="bold" />
                    <span>{label}</span>
                  </span>
                </td>
                <td>${Number(item.estimatedValue || 0).toFixed(2)}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                    <button
                      onClick={() => markAsConsumed(item.id)}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '4px 8px', fontSize: '11px' }}
                      title="Mark Consumed"
                    >
                      <Check size={12} weight="bold" />
                      <span>Eaten</span>
                    </button>

                    <button
                      onClick={() => donateInventoryItem(item.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '4px 8px', fontSize: '11px' }}
                      title="Donate Surplus"
                    >
                      <Handshake size={12} weight="bold" color="var(--color-terracotta)" />
                      <span>Donate</span>
                    </button>

                    <button
                      onClick={() => discardInventoryItem(item.id)}
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '4px', color: 'var(--color-stone)' }}
                      title="Discard"
                    >
                      <Trash size={13} />
                    </button>

                    <button
                      onClick={() => deleteInventoryItem(item.id, item.name)}
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '4px', color: 'var(--text-tertiary)' }}
                      title="Remove"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
