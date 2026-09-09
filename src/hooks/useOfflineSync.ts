import { useEffect, useState } from 'react';

interface OfflineSyncState {
  isOnline: boolean;
}

/**
 * Tracks the browser's current network connectivity.
 *
 * This hook is intentionally limited to connectivity state.
 * Actual offline data synchronization should be handled by
 * a dedicated sync service/engine.
 */
export const useOfflineSync = (): OfflineSyncState => {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof navigator === 'undefined') {
      return true;
    }

    return navigator.onLine;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const handleOnline = (): void => {
      setIsOnline(true);
    };

    const handleOffline = (): void => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Re-check after mounting in case connectivity changed
    // between initial state creation and effect registration.
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
  };
};
