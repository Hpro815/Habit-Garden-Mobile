import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useUserPreferences, useUpdateUserPreferences } from '@/hooks/useUserPreferences';
import { Bell, Clock, Flower2, Settings, Check } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { data: userPrefs } = useUserPreferences();
  const updatePrefs = useUpdateUserPreferences();
  const isMobile = useIsMobile();
  const isAndroid = isAndroidApp();

  // Local state for form
  const [gardenName, setGardenName] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [isAM, setIsAM] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Initialize form values from user prefs
  useEffect(() => {
    if (userPrefs) {
      setGardenName(userPrefs.gardenName || '');
      setNotificationsEnabled(userPrefs.notificationsEnabled || false);

      // Parse notification time
      if (userPrefs.notificationTime) {
        const [hours, minutes] = userPrefs.notificationTime.split(':').map(Number);
        if (hours >= 12) {
          setIsAM(false);
          setSelectedHour(hours === 12 ? 12 : hours - 12);
        } else {
          setIsAM(true);
          setSelectedHour(hours === 0 ? 12 : hours);
        }
        setSelectedMinute(minutes);
      }
    }
  }, [userPrefs, open]);

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

  const handleNotificationToggle = async (enabled: boolean) => {
    setNotificationsEnabled(enabled);

    // Immediately update Android
    setAndroidNotifications(enabled);

    // Update preferences
    await updatePrefs.mutateAsync({
      notificationsEnabled: enabled,
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);

    try {
      const updates: Record<string, unknown> = {};

      if (gardenName !== userPrefs?.gardenName) {
        updates.gardenName = gardenName || undefined;
      }

      const newTime = getTime24Hour();
      if (newTime !== userPrefs?.notificationTime) {
        updates.notificationTime = newTime;
      }

      if (Object.keys(updates).length > 0) {
        await updatePrefs.mutateAsync(updates);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = [0, 15, 30, 45];

  // Only show notification settings on mobile Android app
  const showNotificationSettings = isMobile && isAndroid;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="text-purple-500" size={24} />
            Settings
          </DialogTitle>
          <DialogDescription>
            Customize your Habit Garden experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Garden Name Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Flower2 className="text-green-500" size={18} />
              <Label className="text-sm font-medium">Garden Name</Label>
            </div>
            <Input
              value={gardenName}
              onChange={(e) => setGardenName(e.target.value)}
              placeholder="My Habit Garden"
              className="w-full"
            />
          </div>

          {/* Notification Settings - Mobile Only */}
          {showNotificationSettings && (
            <>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="text-purple-500" size={18} />
                    <Label className="text-sm font-medium">Daily Notifications</Label>
                  </div>
                  <Switch
                    checked={notificationsEnabled}
                    onCheckedChange={handleNotificationToggle}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-6">
                  Get reminded about your habits daily
                </p>
              </div>

              {/* Time Picker - Only show when notifications are enabled */}
              {notificationsEnabled && (
                <div className="space-y-3 pl-6">
                  <div className="flex items-center gap-2">
                    <Clock className="text-purple-400" size={16} />
                    <Label className="text-sm text-gray-600 dark:text-gray-400">Notification Time</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Hour Selector */}
                    <select
                      value={selectedHour}
                      onChange={(e) => setSelectedHour(Number(e.target.value))}
                      className="w-16 h-10 text-center font-semibold rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                    >
                      {hours.map((hour) => (
                        <option key={hour} value={hour}>
                          {hour}
                        </option>
                      ))}
                    </select>

                    <span className="text-lg font-bold text-gray-400">:</span>

                    {/* Minute Selector */}
                    <select
                      value={selectedMinute}
                      onChange={(e) => setSelectedMinute(Number(e.target.value))}
                      className="w-16 h-10 text-center font-semibold rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                    >
                      {minutes.map((min) => (
                        <option key={min} value={min}>
                          {min.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>

                    {/* AM/PM Toggle */}
                    <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                      <button
                        type="button"
                        onClick={() => setIsAM(true)}
                        className={`px-2 py-2 text-xs font-semibold transition-colors ${
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
                        className={`px-2 py-2 text-xs font-semibold transition-colors ${
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
              )}
            </>
          )}
        </div>

        {/* Save Button */}
        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 gap-2"
          >
            {saved ? (
              <>
                <Check size={18} />
                Saved!
              </>
            ) : isSaving ? (
              'Saving...'
            ) : (
              'Save Changes'
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
