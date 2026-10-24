import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, CookingPot, Check, Sparkle, Clock, Fire, LightbulbFilament } from '@phosphor-icons/react';

export default function RecipeModal({ recipe, onClose }) {
  const { markItemsUsedInRecipe, inventory, showToast } = useApp();

  if (!recipe) return null;

  // Handler to consume all matching ingredients in one click
  const handleCookRecipe = async () => {
    // Find matching items in user's active inventory
    const matchedInvItems = inventory.filter(item =>
      recipe.matchingIngredients.some(ing =>
        ing.toLowerCase().includes(item.name.toLowerCase()) || item.name.toLowerCase().includes(ing.toLowerCase())
      )
    );

    if (matchedInvItems.length === 0) {
      showToast('No matching items currently left in your inventory.', 'info');
    } else {
      await markItemsUsedInRecipe(matchedInvItems.map((item) => item.id));
    }

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in-up" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-xs)', color: 'var(--color-forest)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
              <CookingPot size={15} weight="fill" />
              <span>Zero-Waste Culinary Generator</span>
            </div>
            <h3 className="text-heading-3" style={{ color: 'var(--text-primary)' }}>
              {recipe.title}
            </h3>
            <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '4px' }}>
              <span>⏱ Prep: {recipe.prepTimeMinutes} min</span>
              <span>•</span>
              <span>🔥 Cook: {recipe.cookTimeMinutes} min</span>
              <span>•</span>
              <span>Difficulty: {recipe.difficulty}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-icon"
            style={{ width: '36px', height: '36px', padding: 0, justifyContent: 'center' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Recipe Description */}
        <p className="text-body" style={{ marginBottom: 'var(--space-6)' }}>
          {recipe.description}
        </p>

        {/* Expiring Ingredients Rescued */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Crisper Ingredients Rescued:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {recipe.matchingIngredients.map((ing, i) => (
              <span
                key={i}
                className="badge badge-forest"
                style={{ padding: '4px 10px', fontSize: '12px' }}
              >
                ✓ {ing}
              </span>
            ))}
          </div>
        </div>

        {/* Pantry Staples Needed */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Basic Pantry Staples Needed:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {recipe.pantryStaplesNeeded.map((staple, i) => (
              <span
                key={i}
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-display)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--bg-inset)',
                  color: 'var(--text-secondary)'
                }}
              >
                + {staple}
              </span>
            ))}
          </div>
        </div>

        {/* Zero-Waste Chef Tip Callout */}
        <div
          style={{
            padding: 'var(--space-4)',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--color-warning-light)',
            border: '1px solid var(--color-warning)',
            display: 'flex',
            gap: 'var(--space-3)',
            marginBottom: 'var(--space-6)'
          }}
        >
          <LightbulbFilament size={22} color="var(--color-warning)" weight="fill" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-xs)', color: 'var(--color-clay)', marginBottom: '2px' }}>
              Chef's Zero-Scrap Technique
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {recipe.zeroWasteTip}
            </div>
          </div>
        </div>

        {/* Step-by-Step Cooking Guide */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Preparation Steps:
          </div>
          <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {recipe.steps.map((step, idx) => (
              <li
                key={idx}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  lineHeight: 1.6,
                  color: 'var(--text-primary)'
                }}
              >
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-primary)' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-forest)', fontWeight: 600 }}>
            +{recipe.co2DivertedKg} kg CO2e Prevented
          </span>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button
              onClick={onClose}
              className="btn btn-secondary"
            >
              Close
            </button>
            <button
              onClick={handleCookRecipe}
              className="btn btn-primary"
            >
              <Check size={16} weight="bold" />
              <span>Mark Ingredients as Cooked</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
