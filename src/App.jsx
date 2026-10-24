import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Toast from './components/common/Toast';
import AddFoodModal from './components/dashboard/AddFoodModal';
import AuthPage from './components/auth/AuthPage';
import OnboardingModal from './components/profile/OnboardingModal';

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
  const { currentView, loading, loadError, refreshData, showOnboarding, setShowOnboarding } = useApp();
  const { user: authUser, loading: authLoading } = useAuth();
  let visibleView = currentView;
  if (!authUser && !['landing', 'login', 'register'].includes(visibleView)) visibleView = 'login';
  if (authUser?.role !== 'ngo' && visibleView === 'admin') visibleView = 'dashboard';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <Navbar />
      <main className="overflow-x-hidden w-full max-w-full" style={{ flex: 1 }}>
        {authLoading && <div className="container-wide" role="status" style={{ padding: 'var(--space-8)' }}>Checking your session…</div>}
        {!authLoading && authUser && loading && (
          <div className="container-wide" role="status" aria-label="Loading ReRoot data" style={{ paddingBlock: 'var(--space-8)' }}>
            <div className="loading-skeleton" style={{ width: '34%', height: 32, marginBottom: 18 }} />
            <div className="loading-skeleton" style={{ width: '100%', height: 140, marginBottom: 18 }} />
            <div className="loading-skeleton" style={{ width: '100%', height: 300 }} />
          </div>
        )}
        {!authLoading && !(authUser && loading) && visibleView === 'landing' && <LandingPage />}
        {!authLoading && !(authUser && loading) && visibleView === 'login' && <AuthPage mode="login" />}
        {!authLoading && !(authUser && loading) && visibleView === 'register' && <AuthPage mode="register" />}
        {!authLoading && !(authUser && loading) && visibleView === 'dashboard' && <DashboardPage />}
        {!authLoading && !(authUser && loading) && visibleView === 'redistribution' && <RedistributionPage />}
        {!authLoading && !(authUser && loading) && visibleView === 'marketplace' && <MarketplacePage />}
        {!authLoading && !(authUser && loading) && visibleView === 'recipes' && <RecipesPage />}
        {!authLoading && !(authUser && loading) && visibleView === 'analytics' && <WasteAnalyticsPage />}
        {!authLoading && !(authUser && loading) && visibleView === 'gamification' && <GamificationPage />}
        {!authLoading && !(authUser && loading) && visibleView === 'admin' && authUser?.role === 'ngo' && <NgoAdminPage />}
        {!authLoading && !(authUser && loading) && visibleView === 'profile' && <ProfileSettingsPage />}
        {loadError && authUser && (
          <div className="container-wide" role="alert" style={{ padding: 'var(--space-4)', color: 'var(--color-danger)' }}>
            {loading ? 'Loading ReRoot data… ' : `Could not load ReRoot data: ${loadError} `}
            <button className="btn btn-secondary btn-sm" onClick={refreshData} disabled={loading}>
              Retry
            </button>
          </div>
        )}
      </main>
      <AddFoodModal />
      {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}
      <Toast />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}
