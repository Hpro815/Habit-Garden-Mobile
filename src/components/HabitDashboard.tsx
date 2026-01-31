import { useState } from 'react';
import { Plus, Crown, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AnimatedCharacter } from '@/components/AnimatedCharacter';
import { useHabits } from '@/hooks/useHabits';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { HabitCard } from '@/components/HabitCard';
import { CreateHabitDialog } from '@/components/CreateHabitDialog';
import { PremiumDialog } from '@/components/PremiumDialog';
import { LoginDialog } from '@/components/LoginDialog';
import { NotificationButton } from '@/components/NotificationButton';
import { SettingsDialog } from '@/components/SettingsDialog';

export function HabitDashboard() {
  const { data: habits, isLoading } = useHabits();
  const { data: userPrefs } = useUserPreferences();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPremiumDialogOpen, setIsPremiumDialogOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);

  const isPremium = userPrefs?.isPremium ?? false;
  const isLoggedIn = userPrefs?.isLoggedIn ?? false;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/30 dark:to-blue-900/30 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 md:text-4xl">
                {userPrefs?.gardenName || 'Your Habit Garden'}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {hasHabits
                  ? `Growing ${habits.length} habit${habits.length === 1 ? '' : 's'}`
                  : 'Plant your first habit to get started'}
              </p>
            </div>
            <div className="flex gap-2">
              {/* Settings Button */}
              <Button
                onClick={() => setIsSettingsDialogOpen(true)}
                size="lg"
                variant="outline"
                className="gap-2"
              >
                <Settings size={20} className="text-gray-600" />
                <span className="hidden sm:inline">Settings</span>
              </Button>

              {/* Notification Button - Mobile Only */}
              <NotificationButton />

              {/* Login/Account Button */}
              <Button
                onClick={() => setIsLoginDialogOpen(true)}
                size="lg"
                variant="outline"
                className={`gap-2 ${isLoggedIn ? 'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20' : ''}`}
              >
                {isLoggedIn ? (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                    {userPrefs?.userName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                ) : (
                  <User size={20} className="text-gray-600" />
                )}
                <span className="hidden sm:inline">
                  {isLoggedIn ? userPrefs?.userName || 'Account' : 'Sign In'}
                </span>
              </Button>

              {!isPremium && (
                <Button
                  onClick={() => setIsPremiumDialogOpen(true)}
                  size="lg"
                  variant="outline"
                  className="gap-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50 hover:from-yellow-100 hover:to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/20"
                >
                  <Crown size={20} className="text-yellow-600" />
                  <span className="hidden sm:inline">Premium</span>
                </Button>
              )}
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                size="lg"
                className="gap-2"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">New Habit</span>
              </Button>
            </div>
          </div>
        </div>

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

      {/* Login Dialog */}
      <LoginDialog
        open={isLoginDialogOpen}
        onOpenChange={setIsLoginDialogOpen}
      />

      {/* Settings Dialog */}
      <SettingsDialog
        open={isSettingsDialogOpen}
        onOpenChange={setIsSettingsDialogOpen}
      />
    </div>
  );
}
