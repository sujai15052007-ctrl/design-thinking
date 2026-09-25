import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Toast from './components/common/Toast';
import AddFoodModal from './components/dashboard/AddFoodModal';

// Views
import LandingPage from './components/landing/LandingPage';
import DashboardPage from './components/dashboard/DashboardPage';
import RedistributionPage from './components/donation/RedistributionPage';
import WasteAnalyticsPage from './components/analytics/WasteAnalyticsPage';
import MarketplacePage from './components/marketplace/MarketplacePage';
import RecipesPage from './components/recipes/RecipesPage';
import GamificationPage from './components/gamification/GamificationPage';
import NgoAdminPage from './components/admin/NgoAdminPage';
import ProfileSettingsPage from './components/profile/ProfileSettingsPage';

function AppContent() {
  const { currentView } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      {/* Primary Sticky Top Bar */}
      <Navbar />

      {/* Main Dynamic Viewport */}
      <main className="overflow-x-hidden w-full max-w-full" style={{ flex: 1 }}>
        {currentView === 'landing' && <LandingPage />}
        {currentView === 'dashboard' && <DashboardPage />}
        {currentView === 'redistribution' && <RedistributionPage />}
        {currentView === 'marketplace' && <MarketplacePage />}
        {currentView === 'recipes' && <RecipesPage />}
        {currentView === 'analytics' && <WasteAnalyticsPage />}
        {currentView === 'gamification' && <GamificationPage />}
        {currentView === 'admin' && <NgoAdminPage />}
        {currentView === 'profile' && <ProfileSettingsPage />}
      </main>

      {/* Global Modals & Notifications */}
      <AddFoodModal />
      <Toast />

      {/* High-Contrast AIDA Ecological Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
