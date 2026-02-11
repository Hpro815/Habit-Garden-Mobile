import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Bell, BellOff, Clock } from 'lucide-react';
import { useUpdateUserPreferences } from '@/hooks/useUserPreferences';
import { AnimatedCharacter } from '@/components/AnimatedCharacter';

interface UniversalNotificationTimePickerProps {
  onComplete: () => void;
}

export function UniversalNotificationTimePicker({ onComplete }: UniversalNotificationTimePickerProps) {
  // Use 24-hour format: hours 0-23, minutes 0-59
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const updatePrefs = useUpdateUserPreferences();

  // Generate all hours from 00 to 23
  const hours = Array.from({ length: 24 }, (_, i) => i);
  // Generate all minutes from 00 to 59
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  // Format time for storage
  const getTimeString = (): string => {
    return `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
  };

  const handleEnableNotifications = async () => {
    setIsLoading(true);
    try {
      const time = getTimeString();

      await updatePrefs.mutateAsync({
        notificationTime: time,
        notificationsEnabled: true,
        notificationPermissionAsked: true,
      });

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

      onComplete();
    } catch (error) {
      console.error('Error skipping notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/30 dark:to-blue-900/30 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Daily Reminders
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            When would you like to be reminded about your habits?
          </p>
        </div>

        {/* Time Picker Card */}
        <Card className="p-6 md:p-8 mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="text-purple-500" size={24} />
            <span className="font-semibold text-lg text-gray-900 dark:text-white">
              Notification Time
            </span>
          </div>

          {/* Hour and Minute Selectors */}
          <div className="flex items-center justify-center gap-3 md:gap-4 mb-6">
            {/* Hour Selector */}
            <div className="flex flex-col items-center flex-1 max-w-[140px]">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                Hour (24h)
              </label>
              <select
                value={selectedHour}
                onChange={(e) => setSelectedHour(Number(e.target.value))}
                className="w-full h-14 text-center text-2xl font-bold rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer transition-all hover:border-purple-300"
              >
                {hours.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-3xl font-bold text-gray-400 mt-6">:</span>

            {/* Minute Selector */}
            <div className="flex flex-col items-center flex-1 max-w-[140px]">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                Minute
              </label>
              <select
                value={selectedMinute}
                onChange={(e) => setSelectedMinute(Number(e.target.value))}
                className="w-full h-14 text-center text-2xl font-bold rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer transition-all hover:border-purple-300"
              >
                {minutes.map((min) => (
                  <option key={min} value={min}>
                    {min.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Preview */}
          <div className="text-center py-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              You'll be reminded every day at
            </p>
            <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {selectedHour.toString().padStart(2, '0')}:{selectedMinute.toString().padStart(2, '0')}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              24-hour format
            </p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleEnableNotifications}
            disabled={isLoading}
            className="w-full gap-2 h-14 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all"
          >
            <Bell size={22} />
            {isLoading ? 'Setting up...' : 'Enable Daily Reminders'}
          </Button>

          <Button
            onClick={handleSkipNotifications}
            disabled={isLoading}
            variant="ghost"
            className="w-full gap-2 h-12 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <BellOff size={20} />
            Skip for now
          </Button>
        </div>

        <p className="text-xs text-center text-gray-500 dark:text-gray-500 mt-6">
          You can change this anytime in Settings ⚙️
        </p>
      </motion.div>
    </div>
  );
}
