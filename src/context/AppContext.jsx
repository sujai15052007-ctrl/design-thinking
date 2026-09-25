import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_USER,
  INITIAL_INVENTORY,
  INITIAL_NGOS,
  INITIAL_MARKETPLACE,
  RECIPES_DB,
  BADGES_DB,
  LEADERBOARD_DATA,
  ANALYTICS_DATA,
  INITIAL_NGO_REQUESTS,
  INITIAL_ALERTS
} from '../data/mockData';

const AppContext = createContext(null);

const STORAGE_KEYS = {
  USER: 'reroot_user_v1',
  INVENTORY: 'reroot_inventory_v1',
  MARKETPLACE: 'reroot_marketplace_v1',
  NGO_REQUESTS: 'reroot_ngo_requests_v1',
  ALERTS: 'reroot_alerts_v1',
  THEME: 'reroot_theme_v1',
  ONBOARDING_SEEN: 'reroot_onboarding_seen_v1'
};

export function AppProvider({ children }) {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  });

  // Current view navigation
  // 'landing' | 'dashboard' | 'redistribution' | 'analytics' | 'marketplace' | 'recipes' | 'gamification' | 'admin' | 'profile'
  const [currentView, setCurrentView] = useState('landing');

  // User state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  // Inventory state
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  // Marketplace state
  const [marketplace, setMarketplace] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MARKETPLACE);
    return saved ? JSON.parse(saved) : INITIAL_MARKETPLACE;
  });

  // NGO requests state
  const [ngoRequests, setNgoRequests] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NGO_REQUESTS);
    return saved ? JSON.parse(saved) : INITIAL_NGO_REQUESTS;
  });

  // Alerts state
  const [alerts, setAlerts] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ALERTS);
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  // Onboarding modal state
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Global Toast state
  const [toast, setToast] = useState(null);

  // Modal controls
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isScheduleDonationOpen, setIsScheduleDonationOpen] = useState(false);
  const [isPostMarketplaceOpen, setIsPostMarketplaceOpen] = useState(false);
  const [selectedNgoForDonation, setSelectedNgoForDonation] = useState(null);
  const [selectedRecipeForModal, setSelectedRecipeForModal] = useState(null);

  // Sync theme to root DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MARKETPLACE, JSON.stringify(marketplace));
  }, [marketplace]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NGO_REQUESTS, JSON.stringify(ngoRequests));
  }, [ngoRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
  }, [alerts]);

  // Toast trigger helper
  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Switch role helper
  const setUserRole = (newRole) => {
    setUser(prev => ({ ...prev, role: newRole }));
    showToast(`Role switched to: ${newRole.toUpperCase()}`, 'info');
  };

  // --- Inventory Operations ---
  const addInventoryItem = (item) => {
    const newItem = {
      ...item,
      id: `inv-${Date.now()}`,
      status: calculateStatus(item.expiryDate)
    };
    setInventory(prev => [newItem, ...prev]);
    showToast(`Added "${item.name}" to inventory.`);
  };

  const updateInventoryItem = (id, updatedFields) => {
    setInventory(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updatedFields } : item))
    );
    showToast(`Updated item.`);
  };

  const deleteInventoryItem = (id, itemName) => {
    setInventory(prev => prev.filter(item => item.id !== id));
    showToast(`Removed "${itemName || 'item'}" from inventory.`, 'info');
  };

  // Mark food item as consumed (eco win)
  const markAsConsumed = (id) => {
    const target = inventory.find(i => i.id === id);
    if (!target) return;

    setInventory(prev => prev.filter(i => i.id !== id));

    // Calculate eco gains
    const weightKg = target.unit === 'g' ? target.quantity / 1000 : target.quantity * 0.4;
    const value = target.estimatedValue || 4.5;
    const co2 = target.co2ImpactKg || 1.5;

    setUser(prev => ({
      ...prev,
      ecoScore: prev.ecoScore + 50,
      metrics: {
        ...prev.metrics,
        wasteDivertedKg: +(prev.metrics.wasteDivertedKg + weightKg).toFixed(1),
        co2SavedKg: +(prev.metrics.co2SavedKg + co2).toFixed(1),
        moneySaved: +(prev.metrics.moneySaved + value).toFixed(2)
      }
    }));

    showToast(`Delicious! "${target.name}" savored. +50 Eco XP earned!`, 'success');
  };

  // Mark item as donated
  const donateInventoryItem = (id, ngoId = null) => {
    const target = inventory.find(i => i.id === id);
    if (!target) return;

    const ngo = INITIAL_NGOS.find(n => n.id === ngoId) || INITIAL_NGOS[0];
    const weightKg = target.unit === 'g' ? target.quantity / 1000 : target.quantity * 0.5;

    // Create NGO donation request
    const newRequest = {
      id: `req-${Date.now()}`,
      donorName: `${user.name} (You)`,
      ngoName: ngo.name,
      itemSummary: `${target.name} (${target.quantity} ${target.unit})`,
      status: 'Scheduled',
      scheduledTime: 'Today within 2 hrs',
      driverName: 'Assigned to Volunteer Courier',
      pickupAddress: user.location,
      urgency: 'Medium',
      verifiedWeightKg: +weightKg.toFixed(1)
    };

    setNgoRequests(prev => [newRequest, ...prev]);
    setInventory(prev => prev.filter(i => i.id !== id));

    setUser(prev => ({
      ...prev,
      ecoScore: prev.ecoScore + 100,
      metrics: {
        ...prev.metrics,
        mealsDonated: prev.metrics.mealsDonated + 1,
        wasteDivertedKg: +(prev.metrics.wasteDivertedKg + weightKg).toFixed(1),
        co2SavedKg: +(prev.metrics.co2SavedKg + (target.co2ImpactKg || 1.8)).toFixed(1)
      }
    }));

    showToast(`Donation scheduled with ${ngo.name}! +100 Eco XP`, 'success');
  };

  // Discard item (loss)
  const discardInventoryItem = (id) => {
    const target = inventory.find(i => i.id === id);
    if (!target) return;

    setInventory(prev => prev.filter(i => i.id !== id));
    showToast(`Item logged as waste. Next time, let's rescue it early!`, 'warning');
  };

  // --- Marketplace Operations ---
  const postSurplusItem = (postData) => {
    const newPost = {
      ...postData,
      id: `mkt-${Date.now()}`,
      giverName: user.name,
      giverType: user.role === 'business' ? 'Local Business' : 'Neighbor',
      giverRating: 5.0,
      claimed: false,
      claimedBy: null,
      co2SavedKg: 2.5
    };
    setMarketplace(prev => [newPost, ...prev]);
    setUser(prev => ({ ...prev, ecoScore: prev.ecoScore + 40 }));
    showToast(`Surplus food published to community marketplace!`, 'success');
  };

  const claimMarketplaceItem = (postId) => {
    setMarketplace(prev =>
      prev.map(item =>
        item.id === postId
          ? { ...item, claimed: true, claimedBy: `${user.name} (You)` }
          : item
      )
    );
    setUser(prev => ({
      ...prev,
      ecoScore: prev.ecoScore + 60,
      metrics: {
        ...prev.metrics,
        wasteDivertedKg: +(prev.metrics.wasteDivertedKg + 1.8).toFixed(1)
      }
    }));
    showToast(`Claim confirmed! Pickup coordinates sent to your messages.`, 'success');
  };

  // --- NGO Request Status Update (Admin view) ---
  const updateNgoRequestStatus = (reqId, newStatus) => {
    setNgoRequests(prev =>
      prev.map(r => (r.id === reqId ? { ...r, status: newStatus } : r))
    );
    showToast(`Donation request status updated to: ${newStatus}`);
  };

  // Dismiss alert
  const dismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  // Helper to calculate status based on expiry
  function calculateStatus(expiryDateStr) {
    if (!expiryDateStr) return 'fresh';
    const now = new Date();
    const expiry = new Date(expiryDateStr);
    const diffHours = (expiry - now) / (1000 * 60 * 60);

    if (diffHours < 0) return 'expired';
    if (diffHours <= 24) return 'urgent';
    if (diffHours <= 72) return 'expiring_soon';
    return 'fresh';
  }

  // Value export
  const value = {
    theme,
    toggleTheme,
    currentView,
    setCurrentView,
    user,
    setUser,
    setUserRole,
    inventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    markAsConsumed,
    donateInventoryItem,
    discardInventoryItem,
    ngos: INITIAL_NGOS,
    marketplace,
    postSurplusItem,
    claimMarketplaceItem,
    recipes: RECIPES_DB,
    badges: BADGES_DB,
    leaderboard: LEADERBOARD_DATA,
    analytics: ANALYTICS_DATA,
    ngoRequests,
    updateNgoRequestStatus,
    alerts,
    dismissAlert,
    toast,
    showToast,
    showOnboarding,
    setShowOnboarding,
    isAddItemOpen,
    setIsAddItemOpen,
    isScheduleDonationOpen,
    setIsScheduleDonationOpen,
    isPostMarketplaceOpen,
    setIsPostMarketplaceOpen,
    selectedNgoForDonation,
    setSelectedNgoForDonation,
    selectedRecipeForModal,
    setSelectedRecipeForModal
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
