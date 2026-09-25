import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import RecipeModal from './RecipeModal';
import {
  CookingPot,
  Sparkle,
  Clock,
  Fire,
  CheckCircle,
  LightbulbFilament,
  ArrowRight,
  Plant
} from '@phosphor-icons/react';

export default function RecipesPage() {
  const { recipes, inventory, selectedRecipeForModal, setSelectedRecipeForModal } = useApp();
  const [filterDifficulty, setFilterDifficulty] = useState('All');

  // Compute live match status for each recipe based on inventory
  const recipesWithMatch = recipes.map((recipe) => {
    const matchedItems = recipe.matchingIngredients.filter((ing) =>
      inventory.some((invItem) =>
        invItem.name.toLowerCase().includes(ing.toLowerCase()) || ing.toLowerCase().includes(invItem.name.toLowerCase())
      )
    );

    const matchPercent = Math.round((matchedItems.length / recipe.matchingIngredients.length) * 100);

    return {
      ...recipe,
      matchedItems,
      liveMatchPercent: matchPercent
    };
  });

  const filtered = recipesWithMatch.filter((r) => {
    if (filterDifficulty !== 'All' && r.difficulty !== filterDifficulty) return false;
    return true;
  });

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
          Culinary Reclamation
        </div>
        <h1 className="text-heading-2" style={{ color: 'var(--text-primary)' }}>
          "Use Expiring Ingredients" Recipe Engine
        </h1>
        <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
          Transform crisper drawer greens, hardening artisan loaves, and opened dairy into gourmet meals. Zero groceries left behind.
        </p>
      </div>

      {/* Crisper Ingredients In Stock Pill Banner */}
      <div
        className="card"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          padding: 'var(--space-5) var(--space-6)',
          marginBottom: 'var(--space-8)',
          borderLeft: '4px solid var(--color-forest)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkle size={18} color="var(--color-forest)" weight="fill" />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
              Ingredients Available Right Now in Your Pantry ({inventory.length} items)
            </span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
            Cross-referenced in real time
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {inventory.map((item) => (
            <span
              key={item.id}
              style={{
                fontSize: '11px',
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: item.status === 'urgent' ? 'var(--color-danger-light)' : 'var(--bg-inset)',
                color: item.status === 'urgent' ? 'var(--color-danger)' : 'var(--text-secondary)',
                border: `1px solid ${item.status === 'urgent' ? 'var(--color-danger)' : 'var(--border-subtle)'}`
              }}
            >
              {item.name} ({item.quantity} {item.unit})
            </span>
          ))}
        </div>
      </div>

      {/* Difficulty Filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: 'var(--space-6)' }}>
        <span style={{ fontSize: '11px', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
          Skill Level:
        </span>
        {['All', 'Beginner', 'Easy'].map((diff) => (
          <button
            key={diff}
            onClick={() => setFilterDifficulty(diff)}
            className="btn btn-sm"
            style={{
              fontSize: '11px',
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: filterDifficulty === diff ? 'var(--color-forest)' : 'var(--bg-tertiary)',
              color: filterDifficulty === diff ? '#ffffff' : 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            {diff}
          </button>
        ))}
      </div>

      {/* Recipe Cards Grid */}
      <div className="grid-2">
        {filtered.map((recipe) => (
          <div
            key={recipe.id}
            className="card card-interactive"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: 'var(--bg-elevated)',
              border: recipe.liveMatchPercent >= 90 ? '1.5px solid var(--color-forest)' : '1px solid var(--border-primary)'
            }}
          >
            <div>
              {/* Top Badges */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                <span
                  className={`badge ${recipe.liveMatchPercent >= 90 ? 'badge-forest' : 'badge-warning'}`}
                  style={{ fontWeight: 700 }}
                >
                  {recipe.liveMatchPercent}% Ingredients in Fridge
                </span>

                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                  Prep: {recipe.prepTimeMinutes}m • Cook: {recipe.cookTimeMinutes}m
                </span>
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-xl)',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  lineHeight: 1.25,
                  marginBottom: 'var(--space-2)'
                }}
              >
                {recipe.title}
              </h3>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: 'var(--space-4)'
                }}
              >
                {recipe.description}
              </p>

              {/* Ingredients from pantry matched */}
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Rescues from your crisper:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {recipe.matchingIngredients.map((ing, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '11px',
                        fontFamily: 'var(--font-display)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--color-success-light)',
                        color: 'var(--color-forest)',
                        fontWeight: 600
                      }}
                    >
                      ✓ {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Zero-Waste Chef Tip Preview */}
              <div
                style={{
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-inset)',
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <LightbulbFilament size={14} color="var(--color-warning)" weight="fill" />
                <span className="truncate"><strong>Zero-Waste Tip:</strong> {recipe.zeroWasteTip}</span>
              </div>
            </div>

            {/* Action Footer */}
            <div style={{ marginTop: 'var(--space-5)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-forest)', fontWeight: 600 }}>
                +{recipe.co2DivertedKg} kg CO2e Averted
              </span>

              <button
                onClick={() => setSelectedRecipeForModal(recipe)}
                className="btn btn-primary"
              >
                <CookingPot size={16} weight="bold" />
                <span>View Full Recipe & Cook</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipeForModal && (
        <RecipeModal
          recipe={selectedRecipeForModal}
          onClose={() => setSelectedRecipeForModal(null)}
        />
      )}
    </div>
  );
}
