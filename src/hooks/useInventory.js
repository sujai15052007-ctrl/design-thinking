import { useApp } from '../context/AppContext';

export function useInventory() {
  const app = useApp();
  return {
    inventory: app.inventory,
    loading: app.loading,
    error: app.loadError,
    retry: app.refreshData,
    addInventoryItem: app.addInventoryItem,
    updateInventoryItem: app.updateInventoryItem,
    deleteInventoryItem: app.deleteInventoryItem,
    markAsConsumed: app.markAsConsumed,
    markAsUsedInRecipe: app.markAsUsedInRecipe,
    markItemsUsedInRecipe: app.markItemsUsedInRecipe,
    donateInventoryItem: app.donateInventoryItem,
    discardInventoryItem: app.discardInventoryItem,
  };
}
