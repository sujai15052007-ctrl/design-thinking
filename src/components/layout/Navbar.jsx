import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Plant,
  Sun,
  Moon,
  PlusCircle,
  Bell,
  List,
  X,
  Compass,
  ChartBar,
  CookingPot,
  Handshake,
  Storefront,
  Trophy,
  ShieldCheck,
  UserCircle
} from '@phosphor-icons/react';

export default function Navbar() {
  const {
    currentView,
    setCurrentView,
    theme,
    toggleTheme,
    user,
    setUserRole,
    inventory,
    alerts,
    setIsAddItemOpen,
    setShowOnboarding
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  // Count expiring soon or urgent items
  const expiringCount = inventory.filter(
    item => item.status === 'urgent' || item.status === 'expiring_soon'
  ).length;

  const navItems = [
    { id: 'landing', label: 'Overview', icon: Compass },
    { id: 'dashboard', label: 'Inventory', icon: List, badge: expiringCount > 0 ? expiringCount : null },
    { id: 'redistribution', label: 'Rescue & NGOs', icon: Handshake },
    { id: 'marketplace', label: 'Marketplace', icon: Storefront },
    { id: 'recipes', label: 'Zero-Waste Kitchen', icon: CookingPot },
    { id: 'analytics', label: 'Analytics', icon: ChartBar },
    { id: 'gamification', label: 'Leaderboard', icon: Trophy },
    { id: 'admin', label: 'NGO Dispatch', icon: ShieldCheck }
  ];

  const handleNavClick = (viewId) => {
    setCurrentView(viewId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-nav)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        backgroundColor: 'var(--bg-nav)',
        borderBottom: '1px solid var(--border-primary)',
        transition: 'background-color 300ms ease'
      }}
    >
      <div
        className="container-wide"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px',
          gap: 'var(--space-4)'
        }}
      >
        {/* Brand / Logo */}
        <div
          onClick={() => handleNavClick('landing')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-forest)',
              color: 'var(--color-cream)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(45, 80, 22, 0.25)'
            }}
          >
            <Plant size={24} weight="duotone" />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 'var(--text-xl)',
                letterSpacing: 'var(--tracking-tight)',
                color: 'var(--text-primary)',
                lineHeight: 1.1
              }}
            >
              ReRoot
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-terracotta)'
              }}
            >
              Food Reclamation
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: 'var(--space-1)',
            padding: '4px',
            backgroundColor: 'var(--bg-inset)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)'
          }}
          className="desktop-nav"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--text-sm)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--color-cream)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--color-forest)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  position: 'relative'
                }}
              >
                <Icon size={16} weight={isActive ? 'fill' : 'regular'} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    style={{
                      backgroundColor: 'var(--color-terracotta)',
                      color: '#ffffff',
                      fontSize: '10px',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-full)',
                      padding: '1px 6px',
                      lineHeight: '13px'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls & Utilities */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          {/* Quick Add Food Button */}
          <button
            onClick={() => setIsAddItemOpen(true)}
            className="btn btn-primary btn-sm"
            title="Log surplus or incoming food item"
          >
            <PlusCircle size={17} weight="bold" />
            <span style={{ display: 'none' }} className="sm-inline">Log Item</span>
          </button>

          {/* Role Switcher Pill */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="btn btn-secondary btn-sm"
              style={{
                fontSize: '12px',
                padding: '6px 10px',
                gap: '6px'
              }}
              title="Switch user perspective"
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor:
                    user.role === 'household'
                      ? 'var(--color-forest)'
                      : user.role === 'business'
                      ? 'var(--color-terracotta)'
                      : 'var(--color-wheat)'
                }}
              />
              <span style={{ textTransform: 'capitalize' }}>{user.role}</span>
            </button>

            {roleDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '6px',
                  width: '180px',
                  zIndex: 250,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}
              >
                <div
                  style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-display)',
                    color: 'var(--text-tertiary)',
                    padding: '4px 8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  Switch Perspective
                </div>
                {[
                  { role: 'household', label: 'Home Cook / Citizen' },
                  { role: 'business', label: 'Local Bakery / Cafe' },
                  { role: 'ngo', label: 'NGO Food Bank Admin' }
                ].map((r) => (
                  <button
                    key={r.role}
                    onClick={() => {
                      setUserRole(r.role);
                      setRoleDropdownOpen(false);
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-md)',
                      border: 'none',
                      backgroundColor: user.role === r.role ? 'var(--bg-tertiary)' : 'transparent',
                      color: user.role === r.role ? 'var(--color-forest)' : 'var(--text-primary)',
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: user.role === r.role ? 600 : 400,
                      cursor: 'pointer'
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-icon"
            style={{ width: '38px', height: '38px', padding: 0, justifyContent: 'center' }}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            aria-label="Toggle Dark/Light Mode"
          >
            {theme === 'light' ? (
              <Moon size={18} weight="bold" color="var(--text-secondary)" />
            ) : (
              <Sun size={18} weight="bold" color="var(--color-wheat)" />
            )}
          </button>

          {/* Profile & Settings Trigger */}
          <button
            onClick={() => handleNavClick('profile')}
            className="btn btn-ghost btn-icon"
            style={{ width: '38px', height: '38px', padding: 0, justifyContent: 'center' }}
            title="Profile & Onboarding"
          >
            <UserCircle size={24} weight={currentView === 'profile' ? 'fill' : 'regular'} />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-secondary btn-icon mobile-menu-btn"
            style={{ width: '38px', height: '38px', padding: 0, justifyContent: 'center' }}
            aria-label="Open Mobile Menu"
          >
            {mobileMenuOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderBottom: '1px solid var(--border-primary)',
            padding: 'var(--space-4) var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)'
          }}
          className="mobile-drawer"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="nav-link"
                style={{
                  backgroundColor: isActive ? 'var(--color-forest)' : 'transparent',
                  color: isActive ? 'var(--color-cream)' : 'var(--text-primary)',
                  fontWeight: isActive ? 600 : 500,
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    style={{
                      backgroundColor: 'var(--color-terracotta)',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-full)',
                      padding: '2px 8px'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* CSS Helper for Responsive Navbar */}
      <style>{`
        @media (min-width: 1024px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
        @media (min-width: 640px) {
          .sm-inline {
            display: inline !important;
          }
        }
      `}</style>
    </header>
  );
}
