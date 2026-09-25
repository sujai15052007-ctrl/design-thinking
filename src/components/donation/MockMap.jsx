import React from 'react';
import { MapPin, NavigationArrow, Sparkle, Buildings } from '@phosphor-icons/react';

export default function MockMap({ ngos, selectedNgo, onSelectNgo }) {
  // User coordinates (Kitsilano location)
  const userPos = { x: 30, y: 55 };

  return (
    <div
      className="card card-flush"
      style={{
        position: 'relative',
        height: '420px',
        backgroundColor: 'var(--bg-inset)',
        border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden'
      }}
    >
      {/* Map Graphic Canvas / Stylized Municipal Grid */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, opacity: 0.25 }}
      >
        <defs>
          <pattern id="grid-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="var(--color-stone)" strokeWidth="0.3" />
          </pattern>
        </defs>

        {/* Municipal Map Grid */}
        <rect width="100" height="100" fill="url(#grid-pattern)" />

        {/* Shoreline / Inlet representation */}
        <path
          d="M 0 25 Q 35 30 50 18 T 100 12 L 100 0 L 0 0 Z"
          fill="var(--color-mint)"
          opacity="0.3"
        />
        <path
          d="M 0 25 Q 35 30 50 18 T 100 12"
          fill="none"
          stroke="var(--color-forest)"
          strokeWidth="0.8"
          strokeDasharray="2,1"
        />

        {/* Major Transit Artery Roads */}
        <path d="M 5 60 L 95 40" fill="none" stroke="var(--color-sand)" strokeWidth="1.2" />
        <path d="M 25 10 L 40 90" fill="none" stroke="var(--color-sand)" strokeWidth="1.2" />
        <path d="M 60 15 L 75 85" fill="none" stroke="var(--color-sand)" strokeWidth="1.0" />

        {/* 2km Radius Circle from User Position */}
        <circle
          cx={userPos.x}
          cy={userPos.y}
          r="26"
          fill="none"
          stroke="var(--color-forest)"
          strokeWidth="0.5"
          strokeDasharray="1,1"
        />
      </svg>

      {/* Floating Map Legend */}
      <div
        style={{
          position: 'absolute',
          top: '14px',
          left: '14px',
          backgroundColor: 'var(--bg-elevated)',
          padding: '8px 14px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-subtle)',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-forest)',
              boxShadow: '0 0 0 3px var(--color-success-light)'
            }}
          />
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
            Your Kitchen (Kitsilano)
          </span>
        </div>

        <span style={{ color: 'var(--border-secondary)' }}>|</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-terracotta)'
            }}
          />
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
            Verified Shelter Kitchens
          </span>
        </div>
      </div>

      {/* User Current Position Pin */}
      <div
        style={{
          position: 'absolute',
          left: `${userPos.x}%`,
          top: `${userPos.y}%`,
          transform: 'translate(-50%, -50%)',
          zIndex: 15,
          cursor: 'pointer'
        }}
        title="Your Location: 2340 W 4th Ave, Kitsilano"
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-forest)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 0 6px rgba(45, 80, 22, 0.25)'
          }}
        >
          <NavigationArrow size={14} weight="fill" />
        </div>
      </div>

      {/* NGO Map Pins */}
      {ngos.map((ngo) => {
        const isSelected = selectedNgo?.id === ngo.id;
        const isUrgent = ngo.capacityStatus === 'urgent';

        return (
          <div
            key={ngo.id}
            onClick={() => onSelectNgo(ngo)}
            style={{
              position: 'absolute',
              left: `${ngo.coordinates.x}%`,
              top: `${ngo.coordinates.y}%`,
              transform: `translate(-50%, -100%) scale(${isSelected ? 1.2 : 1})`,
              transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
              cursor: 'pointer',
              zIndex: isSelected ? 25 : 12,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            {/* Tooltip Card on Selected or Hover */}
            {isSelected && (
              <div
                className="animate-fade-in-up"
                style={{
                  backgroundColor: 'var(--color-night)',
                  color: '#ffffff',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '11px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  boxShadow: 'var(--shadow-lg)',
                  marginBottom: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                {ngo.name} ({ngo.distanceKm} km)
              </div>
            )}

            {/* Custom SVG Pin Marker */}
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50% 50% 50% 0',
                transform: 'rotate(-45deg)',
                backgroundColor: isUrgent ? 'var(--color-danger)' : isSelected ? 'var(--color-forest)' : 'var(--color-terracotta)',
                border: '2px solid #ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25)'
              }}
            >
              <div style={{ transform: 'rotate(45deg)', color: '#ffffff' }}>
                <Buildings size={16} weight="bold" />
              </div>
            </div>
          </div>
        );
      })}

      {/* Map Bottom Ticker */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          right: '14px',
          backgroundColor: 'rgba(250, 247, 242, 0.9)',
          backdropFilter: 'blur(8px)',
          padding: '4px 10px',
          borderRadius: 'var(--radius-md)',
          fontSize: '10px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-tertiary)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        GIS Radius: 3.5 km • 5 Regional Kitchen Nodes
      </div>
    </div>
  );
}
