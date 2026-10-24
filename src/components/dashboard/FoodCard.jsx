import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Check,
  Handshake,
  CookingPot,
  Trash,
  Clock,
  MapPin,
  X,
  Sparkle,
  Scales
} from '@phosphor-icons/react';

export default function FoodCard({ item }) {
  const {
    markAsConsumed,
    donateInventoryItem,
    discardInventoryItem,
    deleteInventoryItem,
    setCurrentView,
    setSelectedRecipeForModal,
    recipes
  } = useApp();

  // Calculate days remaining
  const now = new Date();
  const expiry = new Date(item.expiryDate);
  const diffMs = expiry - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));

  let badgeClass = 'badge-forest';
  let statusText = `${diffDays} days left`;
  let isUrgent = false;

  if (diffHours <= 0) {
    badgeClass = 'badge-danger';
    statusText = 'Expired Today';
    isUrgent = true;
  } else if (diffHours <= 24) {
    badgeClass = 'badge-danger';
    statusText = `Expires in ${diffHours} hrs`;
    isUrgent = true;
  } else if (diffDays <= 2) {
    badgeClass = 'badge-warning';
    statusText = `Expires in ${diffDays} days`;
  }

  // Calculate progress bar percent (arbitrary 10-day base for visualization)
  const percentRemaining = Math.max(5, Math.min(100, Math.round((Math.max(0, diffDays) / 10) * 100)));

  // Find if this item has a matching recipe
  const matchingRecipe = recipes.find(r =>
    r.matchingIngredients.some(ing => ing.toLowerCase().includes(item.name.toLowerCase()) || item.name.toLowerCase().includes(ing.toLowerCase()))
  );

  const handleRecipeClick = () => {
    if (matchingRecipe) {
      setSelectedRecipeForModal(matchingRecipe);
    }
    setCurrentView('recipes');
  };

  return (
    <div
      className="card card-interactive"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        border: isUrgent ? '1.5px solid var(--color-danger)' : '1px solid var(--border-primary)',
        backgroundColor: 'var(--bg-elevated)',
        transition: 'transform 200ms ease, box-shadow 200ms ease'
      }}
    >
      {/* Top Details */}
      <div>
        {/* Header Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-3)',
            gap: '8px'
          }}
        >
          <span className={`badge ${badgeClass}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12} weight="bold" />
            <span>{statusText}</span>
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
              {item.storage}
            </span>
            <button
              onClick={() => deleteInventoryItem(item.id, item.name)}
              className="btn btn-ghost"
              style={{ padding: '2px', color: 'var(--text-tertiary)' }}
              title="Remove item"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h4
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-lg)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1.2,
            marginBottom: 'var(--space-2)'
          }}
        >
          {item.name}
        </h4>

        {/* Quantity and Category */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-4)'
          }}
        >
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            {item.quantity} {item.unit}
          </span>
          <span>•</span>
          <span>{item.category}</span>
          <span>•</span>
          <span>${Number(item.estimatedValue || 0).toFixed(2)}</span>
        </div>

        {/* Notes if available */}
        {item.notes && (
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-tertiary)',
              lineHeight: 1.5,
              marginBottom: 'var(--space-4)',
              fontStyle: 'italic'
            }}
          >
            "{item.notes}"
          </p>
        )}

        {/* Shelf Life Progress Indicator */}
        <div style={{ marginBottom: 'var(--space-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
            <span>Shelf Life Buffer</span>
            <span>{percentRemaining}%</span>
          </div>
          <div className="progress-bar" style={{ height: '5px' }}>
            <div
              className="progress-fill"
              style={{
                width: `${percentRemaining}%`,
                backgroundColor:
                  percentRemaining < 25
                    ? 'var(--color-danger)'
                    : percentRemaining < 50
                    ? 'var(--color-warning)'
                    : 'var(--color-forest)'
              }}
            />
          </div>
        </div>
      </div>

      {/* Action Footer Buttons */}
      <div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--space-2)',
            paddingTop: 'var(--space-3)',
            borderTop: '1px solid var(--border-subtle)'
          }}
        >
          {/* Savor / Consumed */}
          <button
            onClick={() => markAsConsumed(item.id)}
            className="btn btn-primary btn-sm"
            style={{ justifyContent: 'center', gap: '4px' }}
            title="Mark as eaten (+10 eco points, prevents waste)"
          >
            <Check size={14} weight="bold" />
            <span>Consumed</span>
          </button>

          {/* Donate to NGO */}
          <button
            onClick={() => donateInventoryItem(item.id)}
            className="btn btn-secondary btn-sm"
            style={{ justifyContent: 'center', gap: '4px' }}
            title="Dispatch to nearest verified food bank"
          >
            <Handshake size={14} weight="bold" color="var(--color-terracotta)" />
            <span>Donate</span>
          </button>
        </div>

        {/* Secondary options row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'var(--space-2)'
          }}
        >
          <button
            onClick={handleRecipeClick}
            className="btn btn-ghost btn-sm"
            style={{
              fontSize: '11px',
              padding: '4px 6px',
              color: 'var(--color-forest)',
              fontWeight: 600
            }}
          >
            <CookingPot size={13} weight="bold" />
            <span>{matchingRecipe ? 'Cook in Recipe' : 'Find Recipes'}</span>
          </button>

          <button
            onClick={() => discardInventoryItem(item.id)}
            className="btn btn-ghost btn-sm"
            style={{
              fontSize: '11px',
              padding: '4px 6px',
              color: 'var(--color-stone)'
            }}
            title="Log as waste discard"
          >
            <Trash size={13} />
            <span>Discard</span>
          </button>
        </div>
      </div>
    </div>
  );
}
