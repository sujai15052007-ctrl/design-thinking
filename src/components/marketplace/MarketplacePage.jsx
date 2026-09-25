import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import PostSurplusModal from './PostSurplusModal';
import {
  Storefront,
  Plus,
  Clock,
  MapPin,
  CheckCircle,
  Star,
  Sparkle,
  HandHeart,
  Leaf,
  ShieldCheck
} from '@phosphor-icons/react';

export default function MarketplacePage() {
  const { marketplace, claimMarketplaceItem, isPostMarketplaceOpen, setIsPostMarketplaceOpen, user } = useApp();

  const [filterCategory, setFilterCategory] = useState('All');
  const [filterDietary, setFilterDietary] = useState('All');
  const [selectedPostForClaim, setSelectedPostForClaim] = useState(null);

  const categories = ['All', 'Produce', 'Bakery', 'Prepared Meals', 'Proteins', 'Pantry'];
  const dietaryFilters = ['All', 'Vegetarian', 'Vegan', 'Gluten-Free'];

  const filteredPosts = marketplace.filter((post) => {
    if (filterCategory !== 'All' && post.category !== filterCategory) return false;
    if (filterDietary !== 'All' && !post.dietary?.includes(filterDietary)) return false;
    return true;
  });

  const handleClaim = (postId) => {
    claimMarketplaceItem(postId);
    setSelectedPostForClaim(null);
  };

  return (
    <div className="container-wide" style={{ paddingBlock: 'var(--space-8)' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 'var(--space-6)',
          marginBottom: 'var(--space-8)'
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-terracotta)',
              marginBottom: 'var(--space-1)'
            }}
          >
            Gift Economy • 100% Free Food Exchange
          </div>
          <h1 className="text-heading-2" style={{ color: 'var(--text-primary)' }}>
            Neighborhood Surplus Marketplace
          </h1>
          <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
            Share garden gluts, cafe over-bakes, and extra groceries with neighbors. Pick up fresh food within walking distance.
          </p>
        </div>

        <button
          onClick={() => setIsPostMarketplaceOpen(true)}
          className="btn btn-accent btn-lg"
        >
          <Plus size={18} weight="bold" />
          <span>Post Surplus Food</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div
        className="card"
        style={{
          background: 'var(--bg-elevated)',
          padding: 'var(--space-4) var(--space-6)',
          marginBottom: 'var(--space-8)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-4)'
        }}
      >
        {/* Category Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            Category:
          </span>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilterCategory(c)}
              className="btn btn-sm"
              style={{
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: filterCategory === c ? 'var(--color-forest)' : 'var(--bg-tertiary)',
                color: filterCategory === c ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Dietary Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            Dietary:
          </span>
          {dietaryFilters.map((d) => (
            <button
              key={d}
              onClick={() => setFilterDietary(d)}
              className="btn btn-sm"
              style={{
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: filterDietary === d ? 'var(--color-terracotta)' : 'var(--bg-tertiary)',
                color: filterDietary === d ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Marketplace Listings Grid */}
      <div className="grid-auto-fill" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {filteredPosts.map((post) => {
          const isClaimed = post.claimed;
          return (
            <div
              key={post.id}
              className="card card-interactive"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: 'var(--bg-elevated)',
                border: isClaimed ? '1px dashed var(--border-secondary)' : '1px solid var(--border-primary)',
                opacity: isClaimed ? 0.75 : 1
              }}
            >
              <div>
                {/* Top badges */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                  <span className="badge badge-forest">{post.category}</span>

                  {isClaimed ? (
                    <span className="badge badge-neutral" style={{ color: 'var(--color-forest)', fontWeight: 700 }}>
                      Claimed by {post.claimedBy}
                    </span>
                  ) : (
                    <span className="badge badge-terracotta">Available Now</span>
                  )}
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-lg)',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    lineHeight: 1.25,
                    marginBottom: 'var(--space-2)'
                  }}
                >
                  {post.title}
                </h3>

                {/* Portions & distance */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{post.portions}</span>
                  <span>•</span>
                  <span>{post.locationDistance}</span>
                </div>

                {/* Description */}
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    marginBottom: 'var(--space-4)'
                  }}
                >
                  {post.description}
                </p>

                {/* Dietary Tags */}
                {post.dietary && post.dietary.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: 'var(--space-4)' }}>
                    {post.dietary.map((tag, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '10px',
                          padding: '2px 7px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: 'var(--bg-inset)',
                          color: 'var(--text-tertiary)',
                          fontFamily: 'var(--font-display)',
                          fontWeight: 600
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Pickup Window */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-inset)',
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-display)'
                  }}
                >
                  <Clock size={13} color="var(--color-terracotta)" weight="bold" />
                  <span>Pickup: {post.pickupWindow}</span>
                </div>
              </div>

              {/* Giver info & Claim Button */}
              <div style={{ marginTop: 'var(--space-5)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}>
                      {post.giverName}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                      {post.giverType} • {post.giverRating} ★ Trust Score
                    </div>
                  </div>

                  <span style={{ fontSize: '11px', color: 'var(--color-forest)', fontWeight: 600 }}>
                    +{post.co2SavedKg} kg CO2
                  </span>
                </div>

                {!isClaimed ? (
                  <button
                    onClick={() => handleClaim(post.id)}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <HandHeart size={16} weight="bold" />
                    <span>Claim Surplus Portion</span>
                  </button>
                ) : (
                  <div
                    style={{
                      textAlign: 'center',
                      fontSize: 'var(--text-xs)',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 600,
                      color: 'var(--color-forest)',
                      padding: '8px'
                    }}
                  >
                    ✓ Claimed & Reserved
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Post Surplus Food Modal */}
      {isPostMarketplaceOpen && (
        <PostSurplusModal onClose={() => setIsPostMarketplaceOpen(false)} />
      )}
    </div>
  );
}
