import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnimatedCharacter } from '@/components/AnimatedCharacter';
import { useCompleteHabit, useHabitStats, useReviveHabit, useDeleteHabit } from '@/hooks/useHabits';
import type { Habit } from '@/types/habit';
import { CheckCircle2, Flame, TrendingUp, Heart, Skull, RefreshCw, Trash2, MoreVertical, Smartphone, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AppBlockingDialog } from '@/components/AppBlockingDialog';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface HabitCardProps {
  habit: Habit;
}

export function HabitCard({ habit }: HabitCardProps) {
  const { data: stats } = useHabitStats(habit.id);
  const { data: userPrefs } = useUserPreferences();
  const completeHabit = useCompleteHabit();
  const reviveHabit = useReviveHabit();
  const deleteHabit = useDeleteHabit();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAppBlockingDialogOpen, setIsAppBlockingDialogOpen] = useState(false);

  const health = habit.health ?? 100;
  const isDead = habit.isDead ?? false;
  const isPremium = userPrefs?.isPremium ?? false;
  const streaksEnabled = userPrefs?.streaksEnabled ?? true;
  const hasAppBlocking = habit.appBlocking?.enabled && habit.appBlocking.blockedApps.length > 0;

  const handleDelete = () => {
    deleteHabit.mutate(habit.id);
    setIsDeleteDialogOpen(false);
  };

  const handleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (stats?.completedToday || isDead) return;

    setIsAnimating(true);

    completeHabit.mutate(
      { habitId: habit.id },
      {
        onSuccess: () => {
          setTimeout(() => setIsAnimating(false), 1000);
        },
        onError: () => {
          setIsAnimating(false);
        },
      }
    );
  };

  const handleRevive = async (e: React.MouseEvent) => {
    e.stopPropagation();
    reviveHabit.mutate(habit.id);
  };

  // Get health bar color based on health level
  const getHealthColor = () => {
    if (health > 70) return 'from-green-500 to-green-400';
    if (health > 40) return 'from-yellow-500 to-yellow-400';
    if (health > 20) return 'from-orange-500 to-orange-400';
    return 'from-red-500 to-red-400';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className={`group overflow-hidden border-2 transition-all hover:shadow-lg ${isDead ? 'opacity-75 grayscale' : ''}`}
      >
        <CardContent className="p-0">
          {/* Header with background gradient */}
          <div
            className="p-4 pb-2"
          >
            <div className="mb-2 flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                  {habit.name}
                </h3>
                <div className="mt-1 flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {habit.theme.charAt(0).toUpperCase() + habit.theme.slice(1)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {habit.goalFrequency}
                  </Badge>
                  {isDead && (
                    <Badge variant="destructive" className="text-xs">
                      <Skull size={10} className="mr-1" />
                      Deceased
                    </Badge>
                  )}
                  {hasAppBlocking && !isDead && (
                    <Badge variant="outline" className="text-xs border-purple-300 text-purple-600">
                      <Smartphone size={10} className="mr-1" />
                      Blocking
                    </Badge>
                  )}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2" onClick={(e) => e.stopPropagation()}>
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAppBlockingDialogOpen(true);
                    }}
                  >
                    <Smartphone size={14} className="mr-2" />
                    App Blocking
                    {!isPremium && <Crown size={12} className="ml-2 text-yellow-500" />}
                    {hasAppBlocking && <span className="ml-2 w-2 h-2 rounded-full bg-green-500" />}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 size={14} className="mr-2" />
                    Delete Habit
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Animated Character */}
            <div className={`flex justify-center py-2 relative ${isDead ? 'opacity-50' : ''}`}>
              <AnimatedCharacter
                theme={habit.theme}
                stage={isDead ? 0 : habit.currentStage}
                colorPalette={habit.colorPalette}
                size="medium"
                isAnimating={isAnimating}
              />
              {isDead && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Skull size={48} className="text-gray-500" />
                </div>
              )}
            </div>

            {/* Health Bar */}
            {!isDead && (
              <div className="mt-2">
                <div className="mb-1 flex items-center justify-between text-xs text-gray-900 dark:text-white">
                  <div className="flex items-center gap-1">
                    <Heart size={12} className={health > 40 ? 'text-red-500' : 'text-red-300 animate-pulse'} />
                    <span>Health</span>
                  </div>
                  <span>{health}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${getHealthColor()}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${health}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Stats Section */}
          <div className="border-t p-4">
            {!isDead && (
              <>
                <div className={`mb-3 flex items-center ${streaksEnabled ? 'justify-between' : 'justify-end'} text-sm`}>
                  {streaksEnabled && (
                    <div className="flex items-center gap-1 text-gray-900 dark:text-white">
                      <Flame size={16} className="text-orange-500" />
                      <span className="font-medium">{habit.streakCount} day streak</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-gray-900 dark:text-white">
                    <TrendingUp size={16} className="text-purple-500" />
                    <span className="font-medium">Stage {habit.currentStage + 1}</span>
                  </div>
                </div>

                {/* Complete Button */}
                <Button
                  onClick={handleComplete}
                  disabled={stats?.completedToday || completeHabit.isPending}
                  className="w-full gap-2"
                  variant={stats?.completedToday ? 'outline' : 'default'}
                >
                  <CheckCircle2 size={18} />
                  {stats?.completedToday ? 'Completed Today' : 'Complete Habit'}
                </Button>
              </>
            )}

            {/* Dead state - Revive button */}
            {isDead && (
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Your flower has wilted from neglect.
                </p>
                <Button
                  onClick={handleRevive}
                  disabled={reviveHabit.isPending}
                  className="w-full gap-2"
                  variant="outline"
                >
                  <RefreshCw size={18} className={reviveHabit.isPending ? 'animate-spin' : ''} />
                  {reviveHabit.isPending ? 'Reviving...' : 'Revive & Start Over'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Habit</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{habit.name}"? This will permanently remove the habit and all its progress. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* App Blocking Dialog */}
      <AppBlockingDialog
        open={isAppBlockingDialogOpen}
        onOpenChange={setIsAppBlockingDialogOpen}
        habit={habit}
      />
    </motion.div>
  );
}
