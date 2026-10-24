import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from './AuthContext';
import { fromCanonicalItem, toCanonicalQuantity } from '../utils/units';

const AppContext = createContext(null);
const THEME_KEY = 'reroot_theme_v1';
const UNITS_KEY = 'reroot_units_v1';
const ONBOARDING_KEY = 'reroot_onboarding_seen_v1';
const LEGACY_DATA_KEYS = [
  'reroot_user_v1',
  'reroot_inventory_v1',
  'reroot_marketplace_v1',
  'reroot_ngo_requests_v1',
  'reroot_alerts_v1',
];

const emptyAnalytics = {
  monthlyTrend: [],
  categoryBreakdown: [],
  destinationSplit: [],
};

const toUiRole = (role) => role === 'home' ? 'household' : role;
const toApiRole = (role) => role === 'household' ? 'home' : role;

function mapUser(user, totals = {}, donations = []) {
  const score = Number(user.ecoScore || 0);
  const preferences = user.preferences || {};
  const units = user.units || localStorage.getItem(UNITS_KEY) || 'metric';
  return {
    ...user,
    role: toUiRole(user.role),
    handle: `@${String(user.name || 'reroot').toLowerCase().replace(/[^a-z0-9]+/g, '_')}`,
    joinedDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '',
    location: user.location || '',
    bio: user.bio || '',
    levelTier: Math.max(1, Math.floor(score / 1000) + 1),
    level: score >= 4000 ? 'Ecosystem Steward' : 'Canopy Guardian',
    ecoScore: score,
    streakDays: Number(user.streak || 0),
    metrics: {
      wasteDivertedKg: Number(totals.divertedKg || 0),
      mealsDonated: donations.filter((donation) => donation.status !== 'cancelled').length,
      co2SavedKg: Number(totals.co2SavedKg || 0),
      moneySaved: Number(totals.moneySaved || 0),
    },
    preferences: {
      ...preferences,
      dietary: preferences.dietary || [],
      measurementUnit: units,
      notifyExpiring24h: preferences.notifyExpiring24h !== false,
      notifyCommunityClaim: preferences.notifyCommunityClaim !== false,
      notifyDonationPickup: preferences.notifyDonationPickup !== false,
    },
  };
}

function mapInventoryItem(item, units) {
  const remainingHours = item.expiryDate
    ? (new Date(`${item.expiryDate}T23:59:59`) - Date.now()) / 3600000
    : Infinity;
  const status = remainingHours <= 24 ? 'urgent' : remainingHours <= 72 ? 'expiring_soon' : 'fresh';
  return {
    ...fromCanonicalItem(item, units),
    id: String(item.id),
    expiryDate: item.expiryDate || '',
    status,
  };
}

function mapShelter(shelter) {
  let accepts = shelter.accepts;
  if (typeof accepts === 'string') {
    try { accepts = JSON.parse(accepts); } catch { accepts = []; }
  }
  return {
    ...shelter,
    id: String(shelter.id),
    type: 'Community Food Partner',
    openHours: shelter.openingHours || 'Contact for opening hours',
    urgentNeeds: accepts || [],
    capacityStatus: 'normal',
    refrigeratedStorage: false,
    acceptsCookedFood: (accepts || []).includes('Prepared Meals'),
    coordinates: { lat: Number(shelter.lat), lng: Number(shelter.lng) },
    distanceKm: Number(shelter.distanceKm || 0).toFixed(1),
  };
}

function mapListing(listing) {
  return {
    ...listing,
    id: String(listing.id),
    locationDistance: listing.pickupLocation || '',
    giverType: 'Community member',
    giverRating: 5,
    co2SavedKg: 2.5,
  };
}

function mapDonation(donation) {
  const labels = { scheduled: 'Scheduled', completed: 'Completed', cancelled: 'Cancelled' };
  return {
    ...donation,
    id: String(donation.id),
    ngoName: donation.shelterName,
    itemSummary: donation.itemName,
    status: donation.status === 'scheduled' && donation.acceptedAt
      ? 'En Route'
      : labels[donation.status] || donation.status,
    scheduledTime: donation.pickupTime,
    driverName: 'Volunteer pickup',
    verifiedWeightKg: Number(donation.verifiedWeightKg || 0),
  };
}

function mapAnalytics(data) {
  return {
    monthlyTrend: data.monthly.map((month) => ({
      month: month.month,
      divertedKg: month.divertedKg,
      discardedKg: month.discardedKg,
      co2Saved: month.divertedKg * 2.5,
      dollarsSaved: month.divertedKg * 3.5,
    })),
    categoryBreakdown: data.categories.map((category, index) => ({
      name: category.category,
      value: category.weightKg,
      fill: ['#2D5016', '#C4652E', '#D4A747', '#5C8A3E', '#8C6B46'][index % 5],
    })),
    destinationSplit: (() => {
      const labels = {
        consumed: { name: 'Consumed at home', color: '#2D5016' },
        used_in_recipe: { name: 'Used in recipes', color: '#5C8A3E' },
        donated: { name: 'Donated to shelters', color: '#C4652E' },
        discarded: { name: 'Discarded', color: '#8C6B46' },
      };
      const total = data.destinations.reduce((sum, entry) => sum + entry.weightKg, 0);
      return data.destinations.map((entry) => ({
        ...labels[entry.action],
        percentage: total ? Math.round(entry.weightKg / total * 100) : 0,
      })).filter((entry) => entry.name);
    })(),
    totals: data.totals,
    streakCalendar: data.streakCalendar || [],
  };
}

export function AppProvider({ children }) {
  const {
    user: authenticatedUser,
    loading: authLoading,
    updateProfile,
  } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'light');
  const [currentView, setCurrentView] = useState('landing');
  const [inventory, setInventory] = useState([]);
  const [marketplace, setMarketplace] = useState([]);
  const [ngoRequests, setNgoRequests] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [badges, setBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [analytics, setAnalytics] = useState(emptyAnalytics);
  const [notifications, setNotifications] = useState([]);
  const [ngoStats, setNgoStats] = useState({ donationCount: 0, kgReceived: 0 });
  const [showOnboarding, setShowOnboardingState] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isScheduleDonationOpen, setIsScheduleDonationOpen] = useState(false);
  const [isPostMarketplaceOpen, setIsPostMarketplaceOpen] = useState(false);
  const [selectedNgoForDonation, setSelectedNgoForDonation] = useState(null);
  const [selectedRecipeForModal, setSelectedRecipeForModal] = useState(null);
  const [user, setUiUser] = useState(null);

  useEffect(() => {
    LEGACY_DATA_KEYS.forEach((key) => localStorage.removeItem(key));
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    window.setTimeout(() => setToast(null), 4000);
  }, []);

  const refreshData = useCallback(async () => {
    if (!authenticatedUser) return;
    setLoading(true);
    setLoadError('');
    try {
      const [
        inventoryResult, alertResult, shelterResult, donationResult, marketResult,
        recipeResult, rewardResult, leaderResult, analyticsResult, profileResult,
        notificationResult, ngoStatsResult,
      ] = await Promise.all([
        api.get('/api/inventory?status=active'),
        api.get('/api/alerts?days=3'),
        api.get('/api/shelters'),
        api.get(authenticatedUser.role === 'ngo' ? '/api/ngo/incoming-donations' : '/api/donations'),
        api.get('/api/marketplace'),
        api.get('/api/recipes/suggest'),
        api.get('/api/rewards'),
        api.get('/api/leaderboard'),
        api.get('/api/analytics'),
        api.get('/api/profile'),
        api.get('/api/notifications'),
        authenticatedUser.role === 'ngo'
          ? api.get('/api/ngo/stats')
          : Promise.resolve({ donationCount: 0, kgReceived: 0 }),
      ]);
      const donations = donationResult.donations.map(mapDonation);
      const mappedAnalytics = mapAnalytics(analyticsResult);
      const rawUser = profileResult.user;
      setInventory(inventoryResult.items.map((item) => mapInventoryItem(item, rawUser.units)));
      setAlerts(alertResult.alerts.map((item) => ({
        id: String(item.id),
        itemTitle: item.name,
        timeRemaining: Number(item.daysRemaining) <= 0 ? 'Today' : `${item.daysRemaining} day(s)`,
        severity: Number(item.daysRemaining) <= 1 ? 'urgent' : 'warning',
        suggestedAction: 'Use it in a recipe or donate it before it expires.',
        actionType: 'recipe',
      })));
      setNotifications(notificationResult.notifications || []);
      setNgoStats(ngoStatsResult);
      setNgos(shelterResult.shelters.map(mapShelter));
      setNgoRequests(donations.filter((donation) => donation.status !== 'Cancelled'));
      setMarketplace(marketResult.listings.map(mapListing));
      setRecipes(recipeResult.recipes || []);
      setBadges(rewardResult.badges || []);
      setLeaderboard(leaderResult.leaderboard || []);
      setAnalytics(mappedAnalytics);
      setUiUser(mapUser(rawUser, analyticsResult.totals, donations));
      if (rawUser.units) localStorage.setItem(UNITS_KEY, rawUser.units);
      const savedTheme = localStorage.getItem(THEME_KEY);
      setTheme(savedTheme || (rawUser.darkMode ? 'dark' : 'light'));
      if (!localStorage.getItem(ONBOARDING_KEY)) setShowOnboardingState(true);
    } catch (error) {
      setLoadError(error.message);
    } finally {
      setLoading(false);
    }
  }, [authenticatedUser]);

  useEffect(() => {
    if (authenticatedUser) {
      refreshData();
    } else {
      setUiUser(null);
      setInventory([]);
      setMarketplace([]);
      setNgoRequests([]);
      setAlerts([]);
      setNgos([]);
      setRecipes([]);
      setBadges([]);
      setLeaderboard([]);
      setAnalytics(emptyAnalytics);
      setNotifications([]);
      setNgoStats({ donationCount: 0, kgReceived: 0 });
      setShowOnboardingState(false);
    }
  }, [authenticatedUser, refreshData]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const setShowOnboarding = useCallback((value) => {
    setShowOnboardingState((previous) => {
      const next = typeof value === 'function' ? value(previous) : value;
      if (!next) localStorage.setItem(ONBOARDING_KEY, 'true');
      return next;
    });
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (authenticatedUser) updateProfile({ darkMode: nextTheme === 'dark' }).catch((error) => showToast(error.message, 'error'));
  }, [theme, authenticatedUser, updateProfile, showToast]);

  const updateUser = useCallback(async (updater) => {
    if (!user) return;
    const next = typeof updater === 'function' ? updater(user) : updater;
    const units = next.preferences?.measurementUnit || next.units || 'metric';
    localStorage.setItem(UNITS_KEY, units);
    const updated = await updateProfile({
      name: next.name,
      role: toApiRole(next.role),
      units,
      darkMode: theme === 'dark',
      location: next.location || '',
      bio: next.bio || '',
      preferences: next.preferences || {},
    });
    const nextUser = mapUser(updated, analytics.totals || {}, ngoRequests);
    setUiUser(nextUser);
  }, [user, updateProfile, theme, analytics, ngoRequests]);

  const setUserRole = useCallback(async (role) => {
    try {
      await updateUser((previous) => ({ ...previous, role }));
      showToast(`Role switched to: ${role.toUpperCase()}`, 'info');
    } catch (error) {
      showToast(error.message, 'error');
    }
  }, [updateUser, showToast]);

  const toggleThemeAndPreference = toggleTheme;

  const addInventoryItem = useCallback(async (item) => {
    try {
      const canonical = toCanonicalQuantity(item.quantity, item.unit);
      await api.post('/api/inventory', {
        ...item,
        ...canonical,
        storageLocation: item.storageLocation || item.storage || 'Fridge',
        weightKg: item.weightKg || canonical.weightKg,
      });
      await refreshData();
      showToast(`Added "${item.name}" to inventory.`);
    } catch (error) {
      showToast(error.message, 'error');
    }
  }, [refreshData, showToast]);

  const updateInventoryItem = useCallback(async (id, changes) => {
    try {
      await api.put(`/api/inventory/${id}`, changes);
      await refreshData();
      showToast('Updated item.');
    } catch (error) {
      showToast(error.message, 'error');
    }
  }, [refreshData, showToast]);

  const deleteInventoryItem = useCallback(async (id, name) => {
    const previous = inventory;
    setInventory((items) => items.filter((item) => item.id !== String(id)));
    try {
      await api.delete(`/api/inventory/${id}`);
      showToast(`Removed "${name || 'item'}" from inventory.`, 'info');
    } catch (error) {
      setInventory(previous);
      showToast(error.message, 'error');
    }
  }, [inventory, showToast]);

  const changeItemStatus = useCallback(async (id, status, successMessage) => {
    const previous = inventory;
    const target = previous.find((item) => item.id === String(id));
    setInventory((items) => items.filter((item) => item.id !== String(id)));
    try {
      await api.patch(`/api/inventory/${id}/status`, { status });
      await refreshData();
      showToast(successMessage || `Updated "${target?.name || 'item'}".`);
    } catch (error) {
      setInventory(previous);
      showToast(error.message, 'error');
    }
  }, [inventory, refreshData, showToast]);

  const markAsConsumed = useCallback((id) => (
    changeItemStatus(id, 'consumed', 'Food saved! Eco points were added to your account.')
  ), [changeItemStatus]);

  const markAsUsedInRecipe = useCallback((id) => (
    changeItemStatus(id, 'used_in_recipe', 'Ingredients marked as used in your recipe.')
  ), [changeItemStatus]);

  const markItemsUsedInRecipe = useCallback(async (ids) => {
    const uniqueIds = [...new Set(ids.map(String))];
    setInventory((items) => items.filter((item) => !uniqueIds.includes(item.id)));
    try {
      await Promise.all(uniqueIds.map((id) => api.patch(`/api/inventory/${id}/status`, { status: 'used_in_recipe' })));
      await refreshData();
      showToast(`Marked ${uniqueIds.length} ingredient(s) as used.`);
    } catch (error) {
      await refreshData();
      showToast(error.message, 'error');
    }
  }, [refreshData, showToast]);

  const discardInventoryItem = useCallback((id) => (
    changeItemStatus(id, 'discarded', 'Item recorded as discarded.')
  ), [changeItemStatus]);

  const donateInventoryItem = useCallback(async (id, shelterId = null, options = {}) => {
    const shelter = ngos.find((item) => item.id === String(shelterId)) || ngos[0];
    if (!shelter) {
      showToast('No shelters are available. Please retry after shelters load.', 'error');
      return;
    }
    const pickupTime = options.pickupTime || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
    setInventory((items) => items.filter((item) => item.id !== String(id)));
    try {
      await api.post('/api/donations', {
        itemId: Number(id),
        shelterId: Number(shelter.id),
        pickupTime,
        notes: options.notes,
      });
      await refreshData();
      showToast(`Donation scheduled with ${shelter.name}.`);
      return true;
    } catch (error) {
      await refreshData();
      showToast(error.message, 'error');
      return false;
    }
  }, [ngos, refreshData, showToast]);

  const postSurplusItem = useCallback(async (post) => {
    try {
      await api.post('/api/marketplace', post);
      await refreshData();
      showToast('Surplus food published to the community marketplace.');
    } catch (error) {
      showToast(error.message, 'error');
    }
  }, [refreshData, showToast]);

  const claimMarketplaceItem = useCallback(async (id) => {
    try {
      await api.post(`/api/marketplace/${id}/claim`, {});
      await refreshData();
      showToast('Claim confirmed. Contact the giver to arrange pickup.');
    } catch (error) {
      showToast(error.message, 'error');
    }
  }, [refreshData, showToast]);

  const updateNgoRequestStatus = useCallback(async (id, status, verifiedWeightKg) => {
    try {
      const apiStatus = status.toLowerCase() === 'completed'
        ? 'completed'
        : status.toLowerCase() === 'en route' ? 'scheduled' : 'cancelled';
      await api.patch(`/api/donations/${id}`, { status: apiStatus, verifiedWeightKg });
      await refreshData();
      showToast(`Donation status updated to ${status}.`);
      return true;
    } catch (error) {
      showToast(error.message, 'error');
      return false;
    }
  }, [refreshData, showToast]);

  const dismissAlert = useCallback((id) => {
    setAlerts((items) => items.filter((alert) => alert.id !== String(id)));
  }, []);

  const markNotificationsRead = useCallback(async () => {
    try {
      await api.post('/api/notifications/read', {});
      setNotifications((items) => items.map((item) => ({ ...item, isRead: true })));
    } catch (error) {
      showToast(error.message, 'error');
    }
  }, [showToast]);

  const value = useMemo(() => ({
    theme,
    toggleTheme: toggleThemeAndPreference,
    currentView,
    setCurrentView,
    user,
    setUser: updateUser,
    setUserRole,
    inventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    markAsConsumed,
    markAsUsedInRecipe,
    markItemsUsedInRecipe,
    donateInventoryItem,
    discardInventoryItem,
    ngos,
    marketplace,
    postSurplusItem,
    claimMarketplaceItem,
    recipes,
    badges,
    leaderboard,
    analytics,
    ngoRequests,
    updateNgoRequestStatus,
    alerts,
    dismissAlert,
    notifications,
    ngoStats,
    markNotificationsRead,
    refreshData,
    loading: loading || authLoading,
    loadError,
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
    setSelectedRecipeForModal,
  }), [
    theme, toggleThemeAndPreference, currentView, user, updateUser, setUserRole,
    inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, markAsConsumed,
    markAsUsedInRecipe, markItemsUsedInRecipe, donateInventoryItem, discardInventoryItem, ngos, marketplace,
    postSurplusItem, claimMarketplaceItem, recipes, badges, leaderboard, analytics,
    ngoRequests, updateNgoRequestStatus, alerts, dismissAlert, notifications, ngoStats, markNotificationsRead, refreshData,
    loading, authLoading, loadError, toast, showToast, showOnboarding, setShowOnboarding,
    isAddItemOpen, isScheduleDonationOpen, isPostMarketplaceOpen,
    selectedNgoForDonation, selectedRecipeForModal,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
