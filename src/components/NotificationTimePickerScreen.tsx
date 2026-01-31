import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Bell, BellOff, Clock } from 'lucide-react';
import { useUpdateUserPreferences } from '@/hooks/useUserPreferences';
import { AnimatedCharacter } from '@/components/AnimatedCharacter';

// Declare Android interface for TypeScript
declare global {
  interface Window {
    Android?: {
      setNotificationsEnabled: (enabled: boolean) => void;
    };
  }
}

// Check if running in Android WebView
function isAndroidApp(): boolean {
  return typeof window !== 'undefined' && typeof window.Android !== 'undefined';
}

// Call Android to enable/disable notifications
function setAndroidNotifications(enabled: boolean): void {
  if (isAndroidApp()) {
    try {
      window.Android?.setNotificationsEnabled(enabled);
    } catch (error) {
      console.error('Error calling Android.setNotificationsEnabled:', error);
    }
  }
}

interface NotificationTimePickerScreenProps {
  onComplete: () => void;
}

export function NotificationTimePickerScreen({ onComplete }: NotificationTimePickerScreenProps) {
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [isAM, setIsAM] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const updatePrefs = useUpdateUserPreferences();

  // Convert to 24-hour format for storage
  const getTime24Hour = (): string => {
    let hour = selectedHour;
    if (!isAM && hour !== 12) {
      hour += 12;
    } else if (isAM && hour === 12) {
      hour = 0;
    }
    return `${hour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
  };

  const handleEnableNotifications = async () => {
    setIsLoading(true);
    try {
      const time = getTime24Hour();

      // Update preferences
      await updatePrefs.mutateAsync({
        notificationTime: time,
        notificationsEnabled: true,
        notificationPermissionAsked: true,
      });

      // Call Android to enable notifications
      setAndroidNotifications(true);

      onComplete();
    } catch (error) {
      console.error('Error enabling notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipNotifications = async () => {
    setIsLoading(true);
    try {
      await updatePrefs.mutateAsync({
        notificationsEnabled: false,
        notificationPermissionAsked: true,
      });

      // Call Android to disable notifications
      setAndroidNotifications(false);

      onComplete();
    } catch (error) {
      console.error('Error skipping notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = [0, 15, 30, 45];

  return (
    <div className="min-h-dvh bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/30 dark:to-blue-900/30 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Header with animated character */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <AnimatedCharacter
              theme="tulip"
              stage={5}
              colorPalette="pastel-pink"
              size="large"
              isAnimating
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Daily Reminders
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Pick the time you want daily habit notifications
          </p>
        </div>

        {/* Time Picker Card */}
        <Card className="p-6 mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-purple-500" size={20} />
            <span className="font-medium text-gray-900 dark:text-white">Notification Time</span>
          </div>

          {/* Hour and Minute Selectors */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {/* Hour Selector */}
            <div className="flex flex-col items-center">
              <label className="text-xs text-gray-500 mb-1">Hour</label>
              <select
                value={selectedHour}
                onChange={(e) => setSelectedHour(Number(e.target.value))}
                className="w-20 h-12 text-center text-2xl font-bold rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {hours.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-2xl font-bold text-gray-400 mt-4">:</span>

            {/* Minute Selector */}
            <div className="flex flex-col items-center">
              <label className="text-xs text-gray-500 mb-1">Min</label>
              <select
                value={selectedMinute}
                onChange={(e) => setSelectedMinute(Number(e.target.value))}
                className="w-20 h-12 text-center text-2xl font-bold rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {minutes.map((min) => (
                  <option key={min} value={min}>
                    {min.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>

            {/* AM/PM Toggle */}
            <div className="flex flex-col items-center">
              <label className="text-xs text-gray-500 mb-1">Period</label>
              <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsAM(true)}
                  className={`px-3 py-2 text-sm font-semibold transition-colors ${
                    isAM
                      ? 'bg-purple-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => setIsAM(false)}
                  className={`px-3 py-2 text-sm font-semibold transition-colors ${
                    !isAM
                      ? 'bg-purple-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  PM
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="text-center py-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">You'll be reminded at</p>
            <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
              {selectedHour}:{selectedMinute.toString().padStart(2, '0')} {isAM ? 'AM' : 'PM'}
            </p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleEnableNotifications}
            disabled={isLoading}
            className="w-full gap-2 h-12 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Bell size={20} />
            {isLoading ? 'Setting up...' : 'Enable Notifications'}
          </Button>

          <Button
            onClick={handleSkipNotifications}
            disabled={isLoading}
            variant="ghost"
            className="w-full gap-2 h-12 text-gray-600 dark:text-gray-400"
          >
            <BellOff size={20} />
            I don't want notifications
          </Button>
        </div>

        <p className="text-xs text-center text-gray-500 dark:text-gray-500 mt-4">
          You can change this anytime in Settings
        </p>
      </motion.div>
    </div>
  );
}
