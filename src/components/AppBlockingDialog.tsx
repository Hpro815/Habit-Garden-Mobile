import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useUpdateHabit } from '@/hooks/useHabits';
import { PremiumDialog } from '@/components/PremiumDialog';
import type { Habit, AppBlockSettings } from '@/types/habit';
import { Crown, Smartphone, X, Plus, Lock, Clock, CheckCircle } from 'lucide-react';

// Common apps that users might want to block
const POPULAR_APPS = [
  'Instagram',
  'TikTok',
  'Facebook',
  'Twitter/X',
  'YouTube',
  'Netflix',
  'Snapchat',
  'Reddit',
  'Pinterest',
  'WhatsApp',
  'Discord',
  'Twitch',
  'Spotify',
  'Games',
];

interface AppBlockingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit: Habit;
}

export function AppBlockingDialog({ open, onOpenChange, habit }: AppBlockingDialogProps) {
  const { data: userPrefs } = useUserPreferences();
  const updateHabit = useUpdateHabit();
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);

  const isPremium = userPrefs?.isPremium ?? false;

  // Initialize state from habit's existing settings
  const existingSettings = habit.appBlocking;
  const [enabled, setEnabled] = useState(existingSettings?.enabled ?? false);
  const [blockedApps, setBlockedApps] = useState<string[]>(existingSettings?.blockedApps ?? []);
  const [blockType, setBlockType] = useState<'during_habit' | 'time_period' | 'until_complete'>(
    existingSettings?.blockType ?? 'until_complete'
  );
  const [startTime, setStartTime] = useState(existingSettings?.startTime ?? '09:00');
  const [endTime, setEndTime] = useState(existingSettings?.endTime ?? '17:00');
  const [customApp, setCustomApp] = useState('');

  const handleAddApp = (appName: string) => {
    if (!blockedApps.includes(appName)) {
      setBlockedApps([...blockedApps, appName]);
    }
  };

  const handleRemoveApp = (appName: string) => {
    setBlockedApps(blockedApps.filter(app => app !== appName));
  };

  const handleAddCustomApp = () => {
    if (customApp.trim() && !blockedApps.includes(customApp.trim())) {
      setBlockedApps([...blockedApps, customApp.trim()]);
      setCustomApp('');
    }
  };

  const handleSave = () => {
    const settings: AppBlockSettings = {
      enabled,
      blockedApps,
      blockType,
      startTime: blockType === 'time_period' ? startTime : undefined,
      endTime: blockType === 'time_period' ? endTime : undefined,
    };

    updateHabit.mutate({
      id: habit.id,
      updates: { appBlocking: settings }
    }, {
      onSuccess: () => {
        onOpenChange(false);
      }
    });
  };

  const handleRequestPermission = () => {
    // In a real app, this would trigger the native app permission request
    // For web demo purposes, we'll just show a message
    alert('App blocking requires device permissions. On a real mobile device, this would request accessibility/usage access permissions.');
  };

  if (!isPremium) {
    return (
      <>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Crown className="text-yellow-500" size={24} />
                Premium Feature
              </DialogTitle>
              <DialogDescription>
                App blocking is a premium feature that helps you stay focused by blocking distracting apps.
              </DialogDescription>
            </DialogHeader>

            <div className="py-6">
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg p-6 text-center">
                <Smartphone className="w-12 h-12 mx-auto mb-4 text-yellow-600" />
                <h3 className="font-semibold text-lg mb-2">Block Distracting Apps</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Lock yourself out of social media and other distracting apps until you complete your habit or during specific time periods.
                </p>
                <ul className="text-left text-sm space-y-2 mb-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-green-500" size={16} />
                    Block apps until habit is complete
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-green-500" size={16} />
                    Set specific blocking time periods
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="text-green-500" size={16} />
                    Choose from popular apps or add custom
                  </li>
                </ul>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Maybe Later
              </Button>
              <Button
                onClick={() => {
                  onOpenChange(false);
                  setShowPremiumDialog(true);
                }}
                className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600"
              >
                <Crown size={16} className="mr-2" />
                Upgrade to Premium
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <PremiumDialog open={showPremiumDialog} onOpenChange={setShowPremiumDialog} />
      </>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="text-purple-600" size={20} />
            App Blocking Settings
          </DialogTitle>
          <DialogDescription>
            Block distracting apps to help you focus on "{habit.name}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Enable App Blocking</Label>
              <p className="text-sm text-muted-foreground">
                Block selected apps based on your settings
              </p>
            </div>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>

          {enabled && (
            <>
              {/* Permission Request */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Smartphone className="text-blue-600 shrink-0 mt-0.5" size={20} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Device Permission Required
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      App blocking requires accessibility permissions on your device.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 border-blue-300 text-blue-700 hover:bg-blue-100"
                      onClick={handleRequestPermission}
                    >
                      Grant Permission
                    </Button>
                  </div>
                </div>
              </div>

              {/* Block Type Selection */}
              <div className="space-y-2">
                <Label>When to Block Apps</Label>
                <Select value={blockType} onValueChange={(v) => setBlockType(v as typeof blockType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="until_complete">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={14} />
                        <span>Until habit is completed</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="time_period">
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        <span>During specific time period</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="during_habit">
                      <div className="flex items-center gap-2">
                        <Lock size={14} />
                        <span>While working on habit</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Time Period Settings */}
              {blockType === 'time_period' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Popular Apps */}
              <div className="space-y-2">
                <Label>Popular Apps to Block</Label>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_APPS.map((app) => {
                    const isSelected = blockedApps.includes(app);
                    return (
                      <Badge
                        key={app}
                        variant={isSelected ? 'default' : 'outline'}
                        className={`cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-purple-600 hover:bg-purple-700'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => isSelected ? handleRemoveApp(app) : handleAddApp(app)}
                      >
                        {isSelected && <X size={12} className="mr-1" />}
                        {app}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {/* Custom App Input */}
              <div className="space-y-2">
                <Label>Add Custom App</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter app name..."
                    value={customApp}
                    onChange={(e) => setCustomApp(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCustomApp()}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddCustomApp}
                    disabled={!customApp.trim()}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>

              {/* Selected Apps Summary */}
              {blockedApps.length > 0 && (
                <div className="space-y-2">
                  <Label>Blocked Apps ({blockedApps.length})</Label>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <div className="flex flex-wrap gap-2">
                      {blockedApps.map((app) => (
                        <Badge
                          key={app}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {app}
                          <button
                            type="button"
                            onClick={() => handleRemoveApp(app)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X size={12} />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateHabit.isPending}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {updateHabit.isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
