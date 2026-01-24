import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useUpdateUserPreferences, useUserPreferences } from '@/hooks/useUserPreferences';
import { Bell, BellOff, X } from 'lucide-react';

interface NotificationPermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationPermissionDialog({ open, onOpenChange }: NotificationPermissionDialogProps) {
  const [isRequesting, setIsRequesting] = useState(false);
  const updatePrefs = useUpdateUserPreferences();
  const { data: userPrefs } = useUserPreferences();

  const requestNotificationPermission = async () => {
    setIsRequesting(true);

    try {
      // Check if browser supports notifications
      if (!('Notification' in window)) {
        await updatePrefs.mutateAsync({
          notificationPermissionAsked: true,
          notificationsEnabled: false,
        });
        onOpenChange(false);
        return;
      }

      // Request permission
      const permission = await Notification.requestPermission();

      await updatePrefs.mutateAsync({
        notificationPermissionAsked: true,
        notificationsEnabled: permission === 'granted',
      });

      if (permission === 'granted') {
        // Show a test notification
        new Notification('Habit Garden', {
          body: 'Notifications are now enabled! We\'ll remind you about your habits.',
          icon: '/favicon.ico',
        });
      }

      onOpenChange(false);
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      await updatePrefs.mutateAsync({
        notificationPermissionAsked: true,
        notificationsEnabled: false,
      });
      onOpenChange(false);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleDeny = async () => {
    await updatePrefs.mutateAsync({
      notificationPermissionAsked: true,
      notificationsEnabled: false,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="text-purple-500" size={24} />
            Enable Notifications
          </DialogTitle>
          <DialogDescription>
            Stay on track with your habits
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
                <Bell className="w-12 h-12 text-purple-500" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center animate-pulse">
                !
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                <span className="text-green-600 dark:text-green-400 text-sm">1</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Daily Reminders</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get reminded to complete your habits at your preferred time
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                <span className="text-blue-600 dark:text-blue-400 text-sm">2</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Streak Alerts</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive alerts before your streak is about to break
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center shrink-0">
                <span className="text-yellow-600 dark:text-yellow-400 text-sm">3</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Pet Health Warnings</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get notified when your pet's health is getting low
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            onClick={requestNotificationPermission}
            className="w-full gap-2"
            disabled={isRequesting}
          >
            <Bell size={18} />
            {isRequesting ? 'Requesting...' : 'Enable Notifications'}
          </Button>
          <Button
            onClick={handleDeny}
            variant="ghost"
            className="w-full gap-2 text-gray-600 dark:text-gray-400"
          >
            <BellOff size={18} />
            Maybe Later
          </Button>
        </div>

        <p className="text-xs text-center text-gray-500 dark:text-gray-500 mt-2">
          You can change this anytime in settings
        </p>
      </DialogContent>
    </Dialog>
  );
}

// Hook to automatically show the notification permission dialog
export function useNotificationPermissionPrompt() {
  const { data: userPrefs, isLoading } = useUserPreferences();
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (!isLoading && userPrefs) {
      // Show dialog if:
      // 1. User has completed onboarding
      // 2. User hasn't been asked for notification permission yet
      // 3. Browser supports notifications
      const shouldPrompt =
        userPrefs.hasCompletedOnboarding &&
        !userPrefs.notificationPermissionAsked &&
        'Notification' in window &&
        Notification.permission === 'default';

      if (shouldPrompt) {
        // Delay showing the dialog to not overwhelm the user
        const timer = setTimeout(() => {
          setShouldShow(true);
        }, 3000);

        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, userPrefs]);

  return {
    shouldShow,
    setShouldShow,
  };
}
