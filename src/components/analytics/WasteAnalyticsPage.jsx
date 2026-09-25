import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  Scales,
  CloudSun,
  CurrencyDollar,
  Drop,
  Calendar,
  TrendUp,
  DownloadSimple
} from '@phosphor-icons/react';

export default function WasteAnalyticsPage() {
  const { analytics, user } = useApp();
  const [timeRange, setTimeRange] = useState('6m'); // '1m' | '6m' | '1y'

  const { monthlyTrend, categoryBreakdown, destinationSplit } = analytics;

  // Custom Chart Tooltip
  const CustomAreaTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: 'var(--color-night)',
            color: '#ffffff',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            fontSize: '12px',
            fontFamily: 'var(--font-display)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: '6px', color: 'var(--color-sand)' }}>
            {label} 2026
          </div>
          <div style={{ color: 'var(--color-mint)', marginBottom: '3px' }}>
            Diverted: <strong>{payload[0]?.value} kg</strong>
          </div>
          <div style={{ color: 'var(--color-terracotta-muted)', marginBottom: '3px' }}>
            Discarded: <strong>{payload[1]?.value} kg</strong>
          </div>
          <div style={{ color: 'var(--color-wheat)', paddingTop: '4px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            Emissions Averted: <strong>{payload[0]?.payload.co2Saved} kg CO2e</strong>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: 'var(--color-night)',
            color: '#ffffff',
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            fontSize: '12px',
            fontFamily: 'var(--font-display)'
          }}
        >
          <div style={{ fontWeight: 700, color: payload[0].payload.color }}>
            {payload[0].name}
          </div>
          <div>Share: {payload[0].value}% ({payload[0].payload.kg} kg)</div>
        </div>
      );
    }
    return null;
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
              color: 'var(--color-forest)',
              marginBottom: 'var(--space-1)'
            }}
          >
            Ecological Accounting
          </div>
          <h1 className="text-heading-2" style={{ color: 'var(--text-primary)' }}>
            Waste Diversion & Carbon Analytics
          </h1>
          <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
            Audited breakdown of food saved from methane landfills, household capital preserved, and category patterns.
          </p>
        </div>

        {/* Time range switcher */}
        <div
          style={{
            display: 'flex',
            padding: '4px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-secondary)'
          }}
        >
          {[
            { id: '1m', label: 'Last 30 Days' },
            { id: '6m', label: 'Last 6 Months' },
            { id: '1y', label: 'Full Year' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeRange(t.id)}
              className="btn btn-sm"
              style={{
                fontSize: '12px',
                padding: '5px 14px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: timeRange === t.id ? 'var(--color-forest)' : 'transparent',
                color: timeRange === t.id ? '#ffffff' : 'var(--text-secondary)',
                border: 'none'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top Impact KPI Cards Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-8)'
        }}
      >
        {/* KPI 1 */}
        <div className="card card-compact" style={{ background: 'var(--bg-elevated)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="stat-label">Total Diverted Food</span>
            <Scales size={20} color="var(--color-forest)" />
          </div>
          <div className="stat-value" style={{ marginTop: 'var(--space-3)' }}>
            {user.metrics.wasteDivertedKg} kg
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-forest)', marginTop: '4px', fontWeight: 600 }}>
            +18.4% vs previous 6 months
          </div>
        </div>

        {/* KPI 2 */}
        <div className="card card-compact" style={{ background: 'var(--bg-elevated)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="stat-label">CO2e Emissions Prevented</span>
            <CloudSun size={20} color="var(--color-terracotta)" />
          </div>
          <div className="stat-value" style={{ marginTop: 'var(--space-3)' }}>
            {user.metrics.co2SavedKg} kg
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
            Averts landfill anaerobic decay
          </div>
        </div>

        {/* KPI 3 */}
        <div className="card card-compact" style={{ background: 'var(--bg-elevated)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="stat-label">Grocery Capital Saved</span>
            <CurrencyDollar size={20} color="var(--color-wheat)" />
          </div>
          <div className="stat-value" style={{ marginTop: 'var(--space-3)' }}>
            ${user.metrics.moneySaved.toFixed(2)}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-forest)', marginTop: '4px', fontWeight: 600 }}>
            Avg. $141/mo preserved
          </div>
        </div>

        {/* KPI 4 */}
        <div className="card card-compact" style={{ background: 'var(--bg-elevated)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="stat-label">Shelter Meals Provided</span>
            <Drop size={20} color="var(--color-clay)" />
          </div>
          <div className="stat-value" style={{ marginTop: 'var(--space-3)' }}>
            {user.metrics.mealsDonated} Meals
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
            Redirected via courier mesh
          </div>
        </div>
      </div>

      {/* Main Charts Row: Area Trend (Left 7 cols) & Donut Category Breakdown (Right 5 cols) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.6fr 1fr',
          gap: 'var(--space-6)',
          marginBottom: 'var(--space-8)'
        }}
        className="analytics-grid"
      >
        {/* Trend Over Time Area Chart */}
        <div
          className="card"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <div>
                <h3 className="text-heading-3" style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)' }}>
                  Monthly Biomass: Diverted vs Discarded
                </h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                  Kilograms of edible provisions diverted (green) vs tossed into compost/trash (clay)
                </p>
              </div>
              <span className="badge badge-forest">96.8% Diversion Rate</span>
            </div>

            <div style={{ width: '100%', height: '300px', marginTop: 'var(--space-4)' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="divertedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-forest)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--color-forest)" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="discardedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-terracotta)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--color-terracotta)" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} />
                  <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} unit="kg" />
                  <Tooltip content={<CustomAreaTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="divertedKg"
                    name="Diverted (kg)"
                    stroke="var(--color-forest)"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#divertedGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="discardedKg"
                    name="Discarded (kg)"
                    stroke="var(--color-terracotta)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#discardedGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-6)',
              paddingTop: 'var(--space-4)',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: 'var(--text-xs)',
              fontFamily: 'var(--font-display)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--color-forest)' }} />
              <span>Diverted to Kitchens & Shelters</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--color-terracotta)' }} />
              <span>Lost as Discard</span>
            </div>
          </div>
        </div>

        {/* Waste By Category Donut Chart */}
        <div
          className="card"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <h3 className="text-heading-3" style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)', marginBottom: '4px' }}>
              Diversion by Food Category
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-4)' }}>
              Produce & bakery compose 66% of all reclaimed provisions
            </p>

            <div style={{ width: '100%', height: '230px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Legend Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)' }}>
            {categoryBreakdown.map((cat, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  fontFamily: 'var(--font-display)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-inset)'
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: cat.color }} />
                <span>{cat.name} ({cat.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Row: Destination Allocation Breakdown & Monthly Financial Savings */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-6)'
        }}
      >
        {/* Destination Allocation */}
        <div className="card" style={{ backgroundColor: 'var(--bg-elevated)' }}>
          <h3 className="text-heading-3" style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Where Does Your Surplus Go?
          </h3>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-6)' }}>
            The journey of 142.8 kg of intercepted food items
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {destinationSplit.map((dest, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', fontWeight: 600, fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
                  <span>{dest.name}</span>
                  <span style={{ color: dest.color }}>{dest.percentage}%</span>
                </div>
                <div className="progress-bar" style={{ height: '8px' }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${dest.percentage}%`,
                      backgroundColor: dest.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Savings Monthly Bar Chart */}
        <div className="card" style={{ backgroundColor: 'var(--bg-elevated)' }}>
          <h3 className="text-heading-3" style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Protected Household Capital ($ CAD)
          </h3>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-4)' }}>
            Dollar value of groceries consumed or donated before spoiling
          </p>

          <div style={{ width: '100%', height: '210px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} unit="$" />
                <Tooltip
                  formatter={(val) => [`$${val.toFixed(2)} CAD`, 'Capital Preserved']}
                  contentStyle={{
                    backgroundColor: 'var(--color-night)',
                    color: '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    fontSize: '12px',
                    fontFamily: 'var(--font-display)'
                  }}
                />
                <Bar dataKey="dollarsSaved" fill="var(--color-forest)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .analytics-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
