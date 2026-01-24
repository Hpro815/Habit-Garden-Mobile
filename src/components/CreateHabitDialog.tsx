import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { AnimatedCharacter } from '@/components/AnimatedCharacter';
import { PremiumDialog } from '@/components/PremiumDialog';
import { WatchAdsDialog } from '@/components/WatchAdsDialog';
import { useCreateHabit, useHabits } from '@/hooks/useHabits';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useIsMobile } from '@/hooks/use-mobile';
import { canCreateHabit, canUseTheme, getRemainingHabitSlots, canWatchAdsForSlots } from '@/lib/premium';
import type { ThemeType, FrequencyType } from '@/types/habit';
import { Crown, Lock, AlertCircle, Tv } from 'lucide-react';

const habitSchema = z.object({
  name: z.string().min(1, 'Habit name is required').max(50, 'Name too long'),
  theme: z.enum([
    'rose',
    'lily',
    'tulip',
    'carnation',
    'peony',
    'poppy',
    'sunflower',
    'iris',
    'lavender',
    'lily-of-valley',
    'bluebell',
    'buttercup',
    'cornflower',
  ]),
  goalFrequency: z.enum(['daily', 'weekly', 'custom']),
  customFrequency: z.number().optional(),
  reminderEnabled: z.boolean(),
  reminderTime: z.string().optional(),
});

type HabitFormData = z.infer<typeof habitSchema>;

// Filter out 'plant' from ThemeType for the themes array
type FlowerThemeType = Exclude<ThemeType, 'plant'>;

const allThemes: Array<{ value: FlowerThemeType; label: string; isPremium: boolean }> = [
  // Free flowers
  { value: 'rose', label: 'Rose', isPremium: false },
  { value: 'lily', label: 'Lily', isPremium: false },
  { value: 'tulip', label: 'Tulip', isPremium: false },
  { value: 'carnation', label: 'Carnation', isPremium: false },
  { value: 'peony', label: 'Peony', isPremium: false },
  { value: 'poppy', label: 'Poppy', isPremium: false },
  // Premium flowers
  { value: 'sunflower', label: 'Sunflower', isPremium: true },
  { value: 'iris', label: 'Iris', isPremium: true },
  { value: 'lavender', label: 'Lavender', isPremium: true },
  { value: 'lily-of-valley', label: 'Lily of the Valley', isPremium: true },
  { value: 'bluebell', label: 'Bluebell', isPremium: true },
  { value: 'buttercup', label: 'Buttercup', isPremium: true },
  { value: 'cornflower', label: 'Cornflower', isPremium: true },
];

const frequencies: FrequencyType[] = ['daily', 'weekly', 'custom'];

interface CreateHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateHabitDialog({ open, onOpenChange }: CreateHabitDialogProps) {
  const { data: userPrefs } = useUserPreferences();
  const { data: existingHabits } = useHabits();
  const createHabit = useCreateHabit();
  const [previewTheme, setPreviewTheme] = useState<FlowerThemeType>('rose');
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [showAdsDialog, setShowAdsDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMobile = useIsMobile();
  const isPremium = userPrefs?.isPremium ?? false;
  const remainingSlots = getRemainingHabitSlots();
  const habitCheck = canCreateHabit();
  const adCheck = canWatchAdsForSlots();

  // Only show ads option on mobile devices
  const canShowAdsOption = isMobile && adCheck.allowed;

  // Refresh the dialog state when ads dialog completes
  const handleAdsComplete = () => {
    setShowAdsDialog(false);
  };

  const form = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: '',
      theme: 'rose',
      goalFrequency: 'daily',
      reminderEnabled: false,
      reminderTime: '09:00',
    },
  });

  const onSubmit = (data: HabitFormData) => {
    setError(null);

    // Check for duplicate habit name
    const habitNames = existingHabits?.map(h => h.name.toLowerCase().trim()) || [];
    if (habitNames.includes(data.name.toLowerCase().trim())) {
      setError('A habit with this name already exists. Please choose a different name.');
      return;
    }

    // Check if user can create habit
    const habitCheck = canCreateHabit();
    if (!habitCheck.allowed) {
      setError(habitCheck.reason || 'Cannot create habit');
      setShowPremiumDialog(true);
      return;
    }

    // Check if user can use selected theme
    const themeCheck = canUseTheme(data.theme);
    if (!themeCheck.allowed) {
      setError(themeCheck.reason || 'Cannot use this theme');
      setShowPremiumDialog(true);
      return;
    }

    createHabit.mutate(
      {
        ...data,
        colorPalette: 'pastel-green', // Default color palette
        currentStage: 0,
        streakCount: 0,
        health: 100,
        isDead: false,
      },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
          setError(null);
        },
      }
    );
  };

  const handleThemeSelect = (theme: FlowerThemeType) => {
    const themeCheck = canUseTheme(theme);
    if (!themeCheck.allowed) {
      setShowPremiumDialog(true);
      return;
    }
    form.setValue('theme', theme);
    setPreviewTheme(theme);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Habit</DialogTitle>
            <DialogDescription>
              Choose a theme and settings for your new habit tracker
              {!isPremium && (
                <div className="mt-2 text-sm">
                  {remainingSlots > 0 ? (
                    <span className="text-blue-600">
                      {remainingSlots} habit{remainingSlots === 1 ? '' : 's'} remaining this month
                    </span>
                  ) : (
                    <span className="text-red-600">Monthly limit reached!</span>
                  )}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {!habitCheck.allowed && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="text-yellow-600 dark:text-yellow-400" size={20} />
                <span className="font-semibold text-yellow-900 dark:text-yellow-100">Need More Habits?</span>
              </div>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">{habitCheck.reason}</p>
              <div className="flex flex-col sm:flex-row gap-2">
                {/* Watch Ads button - only shown on mobile */}
                {canShowAdsOption && (
                  <Button
                    onClick={() => setShowAdsDialog(true)}
                    size="sm"
                    variant="outline"
                    className="border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-900/30"
                  >
                    <Tv size={16} className="mr-1" />
                    Watch Ads ({adCheck.triesRemaining} {adCheck.triesRemaining === 1 ? 'try' : 'tries'} left)
                  </Button>
                )}
                <Button
                  onClick={() => setShowPremiumDialog(true)}
                  size="sm"
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  <Crown size={16} className="mr-1" />
                  View Premium
                </Button>
              </div>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Preview - Show full bloom at stage 7 */}
              <div className="flex justify-center rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 py-6 dark:from-purple-900/20 dark:to-pink-900/20">
                <AnimatedCharacter
                  theme={previewTheme}
                  stage={7}
                  colorPalette="pastel-green"
                  size="large"
                />
              </div>

              {/* Habit Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Habit Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Morning Exercise, Read 30 min" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Theme Selection with Premium Locks */}
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Choose Your Companion</FormLabel>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {allThemes.map((theme) => {
                        const isLocked = theme.isPremium && !isPremium;
                        const isSelected = field.value === theme.value;

                        return (
                          <button
                            key={theme.value}
                            type="button"
                            onClick={() => handleThemeSelect(theme.value)}
                            className={`relative p-4 rounded-lg border-2 transition-all ${
                              isSelected
                                ? 'border-purple-600 bg-purple-50 shadow-lg dark:bg-purple-900/30'
                                : isLocked
                                  ? 'border-gray-200 bg-gray-50 opacity-60 dark:bg-gray-800'
                                  : 'border-gray-200 bg-white hover:border-purple-300 dark:bg-gray-900 dark:border-gray-700'
                            }`}
                          >
                            {isLocked && (
                              <div className="absolute top-2 right-2 bg-yellow-500 rounded-full p-1">
                                <Lock size={12} className="text-white" />
                              </div>
                            )}
                            <div className="flex flex-col items-center gap-2">
                              <AnimatedCharacter
                                theme={theme.value}
                                stage={7}
                                colorPalette="pastel-green"
                                size="small"
                              />
                              <div className="text-center">
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">{theme.label}</div>
                                {isLocked && (
                                  <div className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center justify-center gap-1">
                                    <Crown size={10} />
                                    Premium
                                  </div>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Goal Frequency */}
              <FormField
                control={form.control}
                name="goalFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal Frequency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="How often?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {frequencies.map((freq) => (
                          <SelectItem key={freq} value={freq}>
                            {freq.charAt(0).toUpperCase() + freq.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Reminder Toggle */}
              <FormField
                control={form.control}
                name="reminderEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 dark:border-gray-700">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable Reminders</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Get notified to complete your habit
                      </div>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={createHabit.isPending || !habitCheck.allowed}
                >
                  {createHabit.isPending ? 'Creating...' : 'Create Habit'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Premium Dialog */}
      <PremiumDialog open={showPremiumDialog} onOpenChange={setShowPremiumDialog} />

      {/* Watch Ads Dialog - only used on mobile */}
      <WatchAdsDialog
        open={showAdsDialog}
        onOpenChange={setShowAdsDialog}
        onComplete={handleAdsComplete}
      />
    </>
  );
}
