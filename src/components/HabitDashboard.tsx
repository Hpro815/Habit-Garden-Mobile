import { useState } from 'react';
import { Plus, Crown, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AnimatedCharacter } from '@/components/AnimatedCharacter';
import { useHabits } from '@/hooks/useHabits';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { HabitCard } from '@/components/HabitCard';
import { CreateHabitDialog } from '@/components/CreateHabitDialog';
import { PremiumDialog } from '@/components/PremiumDialog';
import { NotificationButton } from '@/components/NotificationButton';
import { SettingsDialog } from '@/components/SettingsDialog';

export function HabitDashboard() {
  const { data: habits, isLoading } = useHabits();
  const { data: userPrefs } = useUserPreferences();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPremiumDialogOpen, setIsPremiumDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);

  const isPremium = userPrefs?.isPremium ?? false;
  const hasLifetimePlan = userPrefs?.premiumPlan === 'onetime';
  // Show premium button if not premium, OR if premium but not lifetime (allow upgrade)
  const showPremiumButton = !isPremium || !hasLifetimePlan;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ paddingTop: 'var(--safe-area-inset-top)' }}>
        <div className="text-center">
          <AnimatedCharacter
            theme="tulip"
            stage={2}
            colorPalette="pastel-pink"
            size="large"
            isAnimating
          />
          <p className="mt-4 text-gray-600">Loading your habits...</p>
        </div>
      </div>
    );
  }

  const hasHabits = habits && habits.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/30 dark:to-blue-900/30" style={{ paddingTop: 'var(--safe-area-inset-top)' }}>
      {/* Fixed Header - 64px + safe area for Android status bar */}
      <div className="h-16 flex items-center px-3 border-b border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
        <div className="flex-1 min-w-0 mr-2">
          <h1 className="text-base font-bold text-gray-800 dark:text-gray-100 truncate leading-tight">
            {userPrefs?.gardenName || 'Your Habit Garden'}
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-400 truncate leading-tight">
            {hasHabits
              ? `${habits.length} habit${habits.length === 1 ? '' : 's'}`
              : 'Start your garden'}
          </p>
        </div>
        <div className="flex gap-1.5 flex-shrink-0">
          {/* Settings Button - Icon only on mobile */}
          <Button
            onClick={() => setIsSettingsDialogOpen(true)}
            size="sm"
            variant="outline"
            className="h-9 w-9 p-0 md:w-auto md:px-3"
          >
            <Settings size={18} className="text-gray-600" />
            <span className="hidden md:inline md:ml-1.5">Settings</span>
          </Button>

          {/* Notification Button - Mobile Only */}
          <NotificationButton />

          {showPremiumButton && (
            <Button
              onClick={() => setIsPremiumDialogOpen(true)}
              size="sm"
              variant="outline"
              className="h-9 w-9 p-0 md:w-auto md:px-3 border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50 hover:from-yellow-100 hover:to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/20"
            >
              <Crown size={18} className="text-yellow-600" />
              <span className="hidden md:inline md:ml-1.5">Premium</span>
            </Button>
          )}
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            size="sm"
            className="h-9 w-9 p-0 md:w-auto md:px-3"
          >
            <Plus size={18} />
            <span className="hidden md:inline md:ml-1.5">New</span>
          </Button>
        </div>
      </div>

      {/* Content Area with proper padding */}
      <div className="p-4 md:p-8">
        <div className="mx-auto max-w-6xl">
          {/* Habits Grid */}
          {hasHabits ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {habits.map((habit) => (
                <HabitCard key={habit.id} habit={habit} />
              ))}
            </div>
          ) : (
            <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 p-12">
              <div className="flex flex-col items-center text-center">
                <AnimatedCharacter
                  theme="tulip"
                  stage={0}
                  colorPalette="pastel-pink"
                  size="large"
                />
                <h3 className="mb-2 mt-6 text-xl font-semibold text-gray-800 dark:text-gray-100">
                  No habits yet
                </h3>
                <p className="mb-6 max-w-md text-gray-600 dark:text-gray-300">
                  Create your first habit and watch it grow as you complete it daily
                </p>
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  size="lg"
                  className="gap-2"
                >
                  <Plus size={20} />
                  Create Your First Habit
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Create Habit Dialog */}
      <CreateHabitDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      {/* Premium Dialog */}
      <PremiumDialog
        open={isPremiumDialogOpen}
        onOpenChange={setIsPremiumDialogOpen}
      />

      {/* Settings Dialog */}
      <SettingsDialog
        open={isSettingsDialogOpen}
        onOpenChange={setIsSettingsDialogOpen}
      />
    </div>
  );
}
