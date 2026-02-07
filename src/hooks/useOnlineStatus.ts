import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to detect online/offline status
 * Works on both mobile and desktop
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(() => {
    // Default to online if navigator.onLine is not available
    if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
      return navigator.onLine;
    }
    return true;
  });

  const handleOnline = useCallback(() => {
    setIsOnline(true);
  }, []);

  const handleOffline = useCallback(() => {
    setIsOnline(false);
  }, []);

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Also check initial status
    if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
      setIsOnline(navigator.onLine);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  const retry = useCallback(() => {
    // Check current status
    if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
      setIsOnline(navigator.onLine);
    }
  }, []);

  return { isOnline, retry };
}
