import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Storefront, MapPin, Clock, Tag } from '@phosphor-icons/react';

export default function PostSurplusModal({ onClose }) {
  const { postSurplusItem, user } = useApp();

  const [title, setTitle] = useState('');
  const [portions, setPortions] = useState('2 portions');
  const [category, setCategory] = useState('Produce');
  const [pickupWindow, setPickupWindow] = useState('Today 17:00 - 19:30');
  const [locationDistance, setLocationDistance] = useState('0.5 km away (Kitsilano)');
  const [description, setDescription] = useState('');
  const [dietary, setDietary] = useState(['Vegetarian']);

  const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Nut-Free', 'Dairy-Free', 'Halal'];

  const toggleDietary = (item) => {
    setDietary(prev =>
      prev.includes(item) ? prev.filter(d => d !== item) : [...prev, item]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    postSurplusItem({
      title,
      portions,
      category,
      pickupWindow,
      locationDistance,
      description: description || 'Fresh surplus food shared with love from our kitchen.',
      dietary,
      imageBadge: category.toLowerCase()
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
          <div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-forest)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Neighborhood Food Sharing
            </div>
            <h3 className="text-heading-3" style={{ color: 'var(--text-primary)' }}>
              Share Surplus Food
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Title */}
          <div className="input-group">
            <label className="input-label" htmlFor="post-title">Item Title *</label>
            <input
              id="post-title"
              type="text"
              className="input"
              placeholder="e.g. Freshly Baked Focaccia with Rosemary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Portions & Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="input-group">
              <label className="input-label" htmlFor="post-portions">Portions Available</label>
              <input
                id="post-portions"
                type="text"
                className="input"
                placeholder="e.g. 4 large portions"
                value={portions}
                onChange={(e) => setPortions(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="post-category">Category</label>
              <select
                id="post-category"
                className="input select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Produce">Produce / Harvest</option>
                <option value="Bakery">Bakery & Grains</option>
                <option value="Prepared Meals">Prepared Home Meal</option>
                <option value="Dairy">Dairy</option>
                <option value="Pantry">Pantry Staples</option>
                <option value="Proteins">Proteins</option>
              </select>
            </div>
          </div>

          {/* Pickup Window & Location */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="input-group">
              <label className="input-label" htmlFor="post-window">Pickup Window</label>
              <input
                id="post-window"
                type="text"
                className="input"
                placeholder="e.g. Today 17:00 - 19:30"
                value={pickupWindow}
                onChange={(e) => setPickupWindow(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="post-loc">General Location</label>
              <input
                id="post-loc"
                type="text"
                className="input"
                placeholder="e.g. 0.5 km away (Kitsilano)"
                value={locationDistance}
                onChange={(e) => setLocationDistance(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Dietary Tags */}
          <div>
            <label className="input-label" style={{ marginBottom: '6px', display: 'block' }}>
              Dietary & Allergen Tags
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {dietaryOptions.map((tag) => {
                const isSelected = dietary.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleDietary(tag)}
                    style={{
                      fontSize: '11px',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      border: `1.5px solid ${isSelected ? 'var(--color-forest)' : 'var(--border-secondary)'}`,
                      backgroundColor: isSelected ? 'var(--color-success-light)' : 'var(--bg-secondary)',
                      color: isSelected ? 'var(--color-forest)' : 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="input-group">
            <label className="input-label" htmlFor="post-desc">Description & Packaging</label>
            <textarea
              id="post-desc"
              className="input"
              rows={3}
              placeholder="Tell neighbors when it was prepared, ingredients used, or bring-your-own container instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Buttons */}
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
            >
              <Storefront size={16} weight="bold" />
              <span>Publish Community Listing</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
