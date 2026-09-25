import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Calendar, Tag, Package, MapPin, Sparkle } from '@phosphor-icons/react';

export default function AddFoodModal() {
  const { isAddItemOpen, setIsAddItemOpen, addInventoryItem } = useApp();

  // Sensible default expiry: 3 days from today
  const defaultExpiry = new Date();
  defaultExpiry.setDate(defaultExpiry.getDate() + 3);
  const defaultExpiryStr = defaultExpiry.toISOString().split('T')[0];

  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    name: '',
    category: 'Produce',
    quantity: 1,
    unit: 'items',
    storage: 'Fridge',
    purchaseDate: todayStr,
    expiryDate: defaultExpiryStr,
    estimatedValue: 4.50,
    co2ImpactKg: 1.5,
    notes: ''
  });

  const [formErrors, setFormErrors] = useState({});

  if (!isAddItemOpen) return null;

  const quickPantrySuggestions = [
    { name: 'Organic Baby Spinach', cat: 'Produce', unit: 'g', qty: 250, days: 3 },
    { name: 'Artisan Baguette', cat: 'Bakery', unit: 'loaf', qty: 1, days: 2 },
    { name: 'Oat Milk Barista', cat: 'Dairy', unit: 'carton', qty: 1, days: 7 },
    { name: 'Ripe Cherry Tomatoes', cat: 'Produce', unit: 'items', qty: 12, days: 3 },
    { name: 'Firm Tofu Block', cat: 'Proteins', unit: 'items', qty: 1, days: 5 }
  ];

  const applySuggestion = (sug) => {
    const exp = new Date();
    exp.setDate(exp.getDate() + sug.days);
    setFormData(prev => ({
      ...prev,
      name: sug.name,
      category: sug.cat,
      unit: sug.unit,
      quantity: sug.qty,
      expiryDate: exp.toISOString().split('T')[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormErrors({ name: 'Please enter a food title.' });
      return;
    }

    addInventoryItem({
      ...formData,
      quantity: Number(formData.quantity),
      estimatedValue: Number(formData.estimatedValue),
      co2ImpactKg: Number(formData.co2ImpactKg)
    });

    setIsAddItemOpen(false);
    // Reset form
    setFormData({
      name: '',
      category: 'Produce',
      quantity: 1,
      unit: 'items',
      storage: 'Fridge',
      purchaseDate: todayStr,
      expiryDate: defaultExpiryStr,
      estimatedValue: 4.50,
      co2ImpactKg: 1.5,
      notes: ''
    });
    setFormErrors({});
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAddItemOpen(false)}>
      <div className="modal-content animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
          <div>
            <h3 className="text-heading-3" style={{ color: 'var(--text-primary)' }}>
              Log Food Item
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
              Add groceries or pantry surplus to your active expiry radar
            </p>
          </div>
          <button
            onClick={() => setIsAddItemOpen(false)}
            className="btn btn-ghost btn-icon"
            style={{ width: '36px', height: '36px', padding: 0, justifyContent: 'center' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Quick Presets
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {quickPantrySuggestions.map((sug, i) => (
              <button
                key={i}
                type="button"
                onClick={() => applySuggestion(sug)}
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-display)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-secondary)',
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                + {sug.name}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Name */}
          <div className="input-group">
            <label className="input-label" htmlFor="food-name">Food Title *</label>
            <input
              id="food-name"
              type="text"
              className="input"
              placeholder="e.g. Organic Baby Spinach"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (formErrors.name) setFormErrors({});
              }}
              required
            />
            {formErrors.name && (
              <span style={{ fontSize: '12px', color: 'var(--color-danger)' }}>{formErrors.name}</span>
            )}
          </div>

          {/* Category & Storage Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="input-group">
              <label className="input-label" htmlFor="food-category">Category</label>
              <select
                id="food-category"
                className="input select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Produce">Produce</option>
                <option value="Bakery">Bakery</option>
                <option value="Dairy">Dairy</option>
                <option value="Pantry">Pantry</option>
                <option value="Prepared Meals">Prepared Meals</option>
                <option value="Proteins">Proteins</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="food-storage">Storage Place</label>
              <select
                id="food-storage"
                className="input select"
                value={formData.storage}
                onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
              >
                <option value="Fridge">Fridge</option>
                <option value="Pantry">Pantry</option>
                <option value="Freezer">Freezer</option>
                <option value="Fruit Bowl / Counter">Countertop</option>
              </select>
            </div>
          </div>

          {/* Quantity and Unit */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="input-group">
              <label className="input-label" htmlFor="food-qty">Quantity</label>
              <input
                id="food-qty"
                type="number"
                min="0.1"
                step="any"
                className="input"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="food-unit">Unit</label>
              <select
                id="food-unit"
                className="input select"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              >
                <option value="items">items / pieces</option>
                <option value="g">grams (g)</option>
                <option value="kg">kilograms (kg)</option>
                <option value="loaf">loaf</option>
                <option value="cartons">cartons</option>
                <option value="ml">milliliters (ml)</option>
              </select>
            </div>
          </div>

          {/* Expiry Date & Purchase Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="input-group">
              <label className="input-label" htmlFor="food-expiry">Expiry / Best Before *</label>
              <input
                id="food-expiry"
                type="date"
                className="input"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="food-value">Est. Value ($ CAD)</label>
              <input
                id="food-value"
                type="number"
                step="0.5"
                min="0"
                className="input"
                value={formData.estimatedValue}
                onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="input-group">
            <label className="input-label" htmlFor="food-notes">Crisper Notes (Optional)</label>
            <input
              id="food-notes"
              type="text"
              className="input"
              placeholder="e.g. Half-opened, crisp, needs using for salad."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            <button
              type="button"
              onClick={() => setIsAddItemOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              <Plus size={16} weight="bold" />
              <span>Log to Inventory</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
