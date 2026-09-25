import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import FoodCard from './FoodCard';
import FoodTable from './FoodTable';
import SmartAlertsBanner from '../alerts/SmartAlertsBanner';
import {
  MagnifyingGlass,
  Funnel,
  Plus,
  SquaresFour,
  Table,
  SlidersHorizontal,
  Plant,
  WarningCircle,
  Clock,
  Sparkle,
  ArrowClockwise
} from '@phosphor-icons/react';

export default function DashboardPage() {
  const { inventory, setIsAddItemOpen, user } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStorage, setSelectedStorage] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('expiry_asc'); // 'expiry_asc' | 'expiry_desc' | 'name' | 'value'
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  const categories = ['All', 'Produce', 'Bakery', 'Dairy', 'Pantry', 'Prepared Meals', 'Proteins'];
  const storages = ['All', 'Fridge', 'Pantry', 'Freezer'];
  const statuses = ['All', 'Urgent (<24h)', 'Expiring Soon (2-3d)', 'Fresh (4+d)'];

  // Filtered and sorted inventory items
  const filteredItems = useMemo(() => {
    return inventory
      .filter((item) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.name.toLowerCase().includes(q);
          const matchNotes = item.notes?.toLowerCase().includes(q);
          const matchCat = item.category.toLowerCase().includes(q);
          if (!matchName && !matchNotes && !matchCat) return false;
        }

        // Category
        if (selectedCategory !== 'All' && item.category !== selectedCategory) {
          return false;
        }

        // Storage
        if (selectedStorage !== 'All' && item.storage !== selectedStorage) {
          return false;
        }

        // Status
        if (selectedStatus !== 'All') {
          const now = new Date();
          const expiry = new Date(item.expiryDate);
          const diffHours = (expiry - now) / (1000 * 60 * 60);

          if (selectedStatus === 'Urgent (<24h)' && diffHours > 24) return false;
          if (selectedStatus === 'Expiring Soon (2-3d)' && (diffHours <= 24 || diffHours > 72)) return false;
          if (selectedStatus === 'Fresh (4+d)' && diffHours <= 72) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'expiry_asc') {
          return new Date(a.expiryDate) - new Date(b.expiryDate);
        }
        if (sortBy === 'expiry_desc') {
          return new Date(b.expiryDate) - new Date(a.expiryDate);
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'value') {
          return (b.estimatedValue || 0) - (a.estimatedValue || 0);
        }
        return 0;
      });
  }, [inventory, searchQuery, selectedCategory, selectedStorage, selectedStatus, sortBy]);

  // Inventory Quick Metrics
  const totalItems = inventory.length;
  const urgentCount = inventory.filter((i) => {
    const diffHours = (new Date(i.expiryDate) - new Date()) / (1000 * 60 * 60);
    return diffHours <= 24;
  }).length;
  const expiringSoonCount = inventory.filter((i) => {
    const diffHours = (new Date(i.expiryDate) - new Date()) / (1000 * 60 * 60);
    return diffHours > 24 && diffHours <= 72;
  }).length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.estimatedValue || 0), 0);

  return (
    <div className="container-wide" style={{ paddingBlock: 'var(--space-8)' }}>
      {/* Top Header & Overview Bar */}
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
              color: 'var(--color-forest)',
              marginBottom: 'var(--space-1)'
            }}
          >
            Pantry & Crisper Ecosystem
          </div>
          <h1 className="text-heading-2" style={{ color: 'var(--text-primary)' }}>
            Active Food Inventory
          </h1>
          <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
            Real-time shelf life monitoring, automated expiry alerts, and zero-waste disposal actions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button
            onClick={() => setIsAddItemOpen(true)}
            className="btn btn-primary btn-lg"
          >
            <Plus size={18} weight="bold" />
            <span>Log Food Item</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-8)'
        }}
      >
        <div className="card card-compact" style={{ background: 'var(--bg-elevated)' }}>
          <div className="stat-label">Active Items Tracked</div>
          <div className="stat-value" style={{ marginTop: 'var(--space-2)' }}>{totalItems}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
            Across {storages.length - 1} storage zones
          </div>
        </div>

        <div className="card card-compact" style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid var(--color-danger)' }}>
          <div className="stat-label" style={{ color: 'var(--color-danger)' }}>Critical: &lt; 24h Left</div>
          <div className="stat-value" style={{ color: 'var(--color-danger)', marginTop: 'var(--space-2)' }}>
            {urgentCount}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
            Immediate action recommended
          </div>
        </div>

        <div className="card card-compact" style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid var(--color-warning)' }}>
          <div className="stat-label" style={{ color: 'var(--color-clay)' }}>Expiring in 2-3 Days</div>
          <div className="stat-value" style={{ color: 'var(--color-clay)', marginTop: 'var(--space-2)' }}>
            {expiringSoonCount}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
            Ready for recipe pairing
          </div>
        </div>

        <div className="card card-compact" style={{ background: 'var(--bg-elevated)' }}>
          <div className="stat-label">Total Inventory Value</div>
          <div className="stat-value" style={{ marginTop: 'var(--space-2)' }}>${totalValue.toFixed(2)}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
            Protected household capital
          </div>
        </div>
      </div>

      {/* Smart Alerts Banner Component */}
      <SmartAlertsBanner />

      {/* Search, Filter & View Controls */}
      <div
        className="card"
        style={{
          background: 'var(--bg-elevated)',
          padding: 'var(--space-6)',
          marginBottom: 'var(--space-6)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)'
        }}
      >
        {/* Top Control Bar: Search and View Mode */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-4)'
          }}
        >
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <MagnifyingGlass
              size={18}
              color="var(--text-tertiary)"
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search food by name, category, or note..."
              className="input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="btn btn-ghost btn-sm"
                style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', padding: '2px 8px' }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort By Dropdown & View Mode Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                Sort:
              </span>
              <select
                className="input select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ paddingBlock: '6px', fontSize: 'var(--text-xs)', width: 'auto' }}
              >
                <option value="expiry_asc">Expiry (Soonest First)</option>
                <option value="expiry_desc">Expiry (Furthest First)</option>
                <option value="name">Alphabetical (A-Z)</option>
                <option value="value">Highest Value ($)</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div
              style={{
                display: 'flex',
                padding: '2px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-inset)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <button
                onClick={() => setViewMode('cards')}
                className="btn btn-ghost btn-sm"
                style={{
                  backgroundColor: viewMode === 'cards' ? 'var(--bg-secondary)' : 'transparent',
                  color: viewMode === 'cards' ? 'var(--color-forest)' : 'var(--text-tertiary)',
                  padding: '6px 10px',
                  boxShadow: viewMode === 'cards' ? 'var(--shadow-sm)' : 'none'
                }}
                title="Card View"
              >
                <SquaresFour size={16} weight={viewMode === 'cards' ? 'bold' : 'regular'} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className="btn btn-ghost btn-sm"
                style={{
                  backgroundColor: viewMode === 'table' ? 'var(--bg-secondary)' : 'transparent',
                  color: viewMode === 'table' ? 'var(--color-forest)' : 'var(--text-tertiary)',
                  padding: '6px 10px',
                  boxShadow: viewMode === 'table' ? 'var(--shadow-sm)' : 'none'
                }}
                title="Table View"
              >
                <Table size={16} weight={viewMode === 'table' ? 'bold' : 'regular'} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills: Category */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginRight: '4px' }}>
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="btn btn-sm"
              style={{
                fontSize: '12px',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: selectedCategory === cat ? 'var(--color-forest)' : 'var(--bg-tertiary)',
                color: selectedCategory === cat ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary Filter Row: Storage & Expiry Status */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-6)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border-subtle)' }}>
          {/* Storage Filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginRight: '4px' }}>
              Storage:
            </span>
            {storages.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStorage(st)}
                className="btn btn-sm"
                style={{
                  fontSize: '11px',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: selectedStorage === st ? 'var(--color-terracotta)' : 'var(--bg-tertiary)',
                  color: selectedStorage === st ? '#ffffff' : 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Expiry Status Filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginRight: '4px' }}>
              Urgency:
            </span>
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className="btn btn-sm"
                style={{
                  fontSize: '11px',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: selectedStatus === st ? 'var(--text-primary)' : 'var(--bg-tertiary)',
                  color: selectedStatus === st ? 'var(--color-cream)' : 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content: Food Cards Grid or Table */}
      {filteredItems.length === 0 ? (
        <div className="card empty-state" style={{ background: 'var(--bg-elevated)' }}>
          <WarningCircle size={48} weight="duotone" />
          <h3 className="text-heading-4" style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>
            No food items match your filter criteria
          </h3>
          <p className="text-body" style={{ maxWidth: '45ch', marginBottom: 'var(--space-6)' }}>
            Try clearing the active filters or log a fresh grocery item to begin tracking shelf life.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedStorage('All');
                setSelectedStatus('All');
              }}
              className="btn btn-secondary"
            >
              Reset Filters
            </button>
            <button
              onClick={() => setIsAddItemOpen(true)}
              className="btn btn-primary"
            >
              <Plus size={16} weight="bold" />
              <span>Log New Food</span>
            </button>
          </div>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid-auto-fill">
          {filteredItems.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <FoodTable items={filteredItems} />
      )}
    </div>
  );
}
