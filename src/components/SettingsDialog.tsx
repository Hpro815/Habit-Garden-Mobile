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
import { Flower2, Settings, Check, Flame } from 'lucide-react';

// Maximum length for garden name
const MAX_GARDEN_NAME_LENGTH = 15;

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { data: userPrefs } = useUserPreferences();
  const updatePrefs = useUpdateUserPreferences();

  // Local state for form
  const [gardenName, setGardenName] = useState('');
  const [streaksEnabled, setStreaksEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Initialize form values from user prefs
  useEffect(() => {
    if (userPrefs) {
      setGardenName(userPrefs.gardenName || '');
      setStreaksEnabled(userPrefs.streaksEnabled ?? true);
    }
  }, [userPrefs, open]);

  const handleGardenNameChange = (value: string) => {
    // Limit to MAX_GARDEN_NAME_LENGTH characters
    if (value.length <= MAX_GARDEN_NAME_LENGTH) {
      setGardenName(value);
    }
  };

  const handleStreaksToggle = async (enabled: boolean) => {
    setStreaksEnabled(enabled);

    // Update preferences immediately
    await updatePrefs.mutateAsync({
      streaksEnabled: enabled,
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flower2 className="text-green-500" size={18} />
                <Label className="text-sm font-medium">Garden Name</Label>
              </div>
              <span className="text-xs text-gray-400">
                {gardenName.length}/{MAX_GARDEN_NAME_LENGTH}
              </span>
            </div>
            <Input
              value={gardenName}
              onChange={(e) => handleGardenNameChange(e.target.value)}
              placeholder="My Habit Garden"
              maxLength={MAX_GARDEN_NAME_LENGTH}
              className="w-full text-sm"
            />
          </div>

          {/* Streaks Display Toggle */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="text-orange-500" size={18} />
                <Label className="text-sm font-medium">Show Streaks</Label>
              </div>
              <Switch
                checked={streaksEnabled}
                onCheckedChange={handleStreaksToggle}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-6">
              Display streak counters on your habit cards
            </p>
          </div>
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
