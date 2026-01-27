import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, BellOff } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserPreferences, useUpdateUserPreferences } from '@/hooks/useUserPreferences';

// Declare Android WebView interface for TypeScript
declare global {
  interface Window {
    AndroidNotification?: {
      requestPermission: () => void;
    };
    // Callback for Android to notify when permission is granted/denied
    onNotificationPermissionResult?: (granted: boolean) => void;
  }
}

// Check if running in Android WebView with notification support
function isAndroidWebView(): boolean {
  return typeof window !== 'undefined' && typeof window.AndroidNotification !== 'undefined';
}

export function NotificationButton() {
  const isMobile = useIsMobile();
  const { data: userPrefs } = useUserPreferences();
  const updatePrefs = useUpdateUserPreferences();
  const [isRequesting, setIsRequesting] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Only show on mobile (Android WebView)
  const shouldShow = isMobile && isAndroidWebView();

  // Register callback for Android to report permission result
  useEffect(() => {
    if (shouldShow) {
      window.onNotificationPermissionResult = async (granted: boolean) => {
        setIsRequesting(false);
        setPermissionGranted(granted);

        await updatePrefs.mutateAsync({
          notificationPermissionAsked: true,
          notificationsEnabled: granted,
        });
      };

      return () => {
        window.onNotificationPermissionResult = undefined;
      };
    }
  }, [shouldShow, updatePrefs]);

  // Update local state when user prefs change
  useEffect(() => {
    if (userPrefs?.notificationsEnabled) {
      setPermissionGranted(true);
    }
  }, [userPrefs?.notificationsEnabled]);

  const handleRequestPermission = () => {
    if (!isAndroidWebView()) return;

    setIsRequesting(true);

    try {
      window.AndroidNotification?.requestPermission();
    } catch (error) {
      console.error('Error calling AndroidNotification.requestPermission():', error);
      setIsRequesting(false);
    }
  };

  // Don't render if not on mobile/Android
  if (!shouldShow) {
    return null;
  }

  // If already granted, show a different state
  if (permissionGranted || userPrefs?.notificationsEnabled) {
    return (
      <Button
        variant="outline"
        size="lg"
        disabled
        className="gap-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
      >
        <Bell size={20} className="text-green-600" />
        <span className="hidden sm:inline">Notifications On</span>
      </Button>
    );
  }

  return (
    <Button
      onClick={handleRequestPermission}
      variant="outline"
      size="lg"
      disabled={isRequesting}
      className="gap-2 border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20"
    >
      <Bell size={20} className="text-purple-600" />
      <span className="hidden sm:inline">
        {isRequesting ? 'Requesting...' : 'Allow Notifications'}
      </span>
    </Button>
  );
}
