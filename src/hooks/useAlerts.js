import { useApp } from '../context/AppContext';

export function useAlerts() {
  const { alerts, dismissAlert, notifications, refreshData } = useApp();
  return { alerts, dismissAlert, notifications, refresh: refreshData };
}
