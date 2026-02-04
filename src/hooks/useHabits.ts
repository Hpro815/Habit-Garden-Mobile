import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { habitStorage, completionStorage, setCurrentUserId, getCurrentUserId } from '@/lib/storage';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useCreaoAuth } from '@/sdk/core/auth';
import * as dataLayer from '@/services/habitDataLayer';
import type { Habit } from '@/types/habit';
import { GROWTH_STAGES } from '@/types/habit';

// Health decay constants
const HEALTH_DECAY_PER_DAY = 15; // Lose 15 health per missed day
const HEALTH_DECAY_THRESHOLD = 0; // Pet dies when health reaches 0

// Check and apply health decay for habits
function checkHealthDecay(habits: Habit[]): Habit[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return habits.map((habit) => {
    // Skip if already dead
    if (habit.isDead) return habit;

    // Initialize health if not present (for existing habits)
    const currentHealth = habit.health ?? 100;

    // If never completed, check days since creation
    const lastDate = habit.lastCompletedAt
      ? new Date(habit.lastCompletedAt)
      : new Date(habit.createdAt);

    const lastDateMidnight = new Date(
      lastDate.getFullYear(),
      lastDate.getMonth(),
      lastDate.getDate()
    );

    const daysSinceLastActivity = Math.floor(
      (today.getTime() - lastDateMidnight.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Only apply decay if more than 1 day has passed (give grace period)
    if (daysSinceLastActivity > 1) {
      const missedDays = daysSinceLastActivity - 1;
      const healthLoss = missedDays * HEALTH_DECAY_PER_DAY;
      const newHealth = Math.max(0, currentHealth - healthLoss);
      const isDead = newHealth <= HEALTH_DECAY_THRESHOLD;

      // Update habit if health changed
      if (newHealth !== currentHealth || isDead !== habit.isDead) {
        habitStorage.update(habit.id, {
          health: newHealth,
          isDead,
          streakCount: isDead ? 0 : habit.streakCount,
        });

        return {
          ...habit,
          health: newHealth,
          isDead,
          streakCount: isDead ? 0 : habit.streakCount,
        };
      }
    }

    return {
      ...habit,
      health: currentHealth,
    };
  });
}

export function useHabits() {
  const { data: userPrefs } = useUserPreferences();
  const { isAuthenticated } = useCreaoAuth();

  // Include user email in query key so habits are refetched when user changes
  const userId = userPrefs?.isLoggedIn ? (userPrefs.userEmail || 'guest') : 'guest';

  // Ensure the storage layer's activeUserId is in sync with the current user
  // This handles cases where the component re-renders after login/logout
  if (getCurrentUserId() !== userId) {
    setCurrentUserId(userId);
  }

  return useQuery({
    queryKey: ['habits', userId],
    queryFn: async () => {
      // Double-check userId is set correctly before fetching
      if (getCurrentUserId() !== userId) {
        setCurrentUserId(userId);
      }

      // For authenticated users, fetch from backend (source of truth)
      // For guests, use local storage only
      const habits = await dataLayer.fetchAllHabits();

      // Apply health decay check when fetching habits
      return checkHealthDecay(habits);
    },
    // Longer stale time for authenticated users since backend is source of truth
    staleTime: isAuthenticated ? 5 * 60 * 1000 : 1 * 60 * 1000,
  });
}

export function useHabit(id: string) {
  return useQuery({
    queryKey: ['habit', id],
    queryFn: () => habitStorage.getById(id),
    enabled: !!id,
  });
}

export function useCreateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) => {
      // Use data layer which handles backend sync for authenticated users
      const created = await dataLayer.createHabit(habit);
      if (!created) throw new Error('Failed to create habit');
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });
}

export function useUpdateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Omit<Habit, 'id' | 'createdAt'>> }) => {
      // Use data layer which handles backend sync for authenticated users
      const updated = await dataLayer.updateHabit(id, updates);
      return updated;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['habit', variables.id] });
    },
  });
}

export function useDeleteHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Use data layer which handles backend sync for authenticated users
      const deleted = await dataLayer.deleteHabit(id);
      return deleted;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });
}

export function useCompleteHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ habitId, notes }: { habitId: string; notes?: string }) => {
      const habit = habitStorage.getById(habitId);
      if (!habit) throw new Error('Habit not found');

      const now = new Date();
      const lastCompleted = habit.lastCompletedAt;

      // Calculate streak
      let newStreak = habit.streakCount;
      if (lastCompleted) {
        const daysSinceLastCompletion = Math.floor(
          (now.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceLastCompletion === 1) {
          // Consecutive day - increment streak
          newStreak += 1;
        } else if (daysSinceLastCompletion > 1) {
          // Streak broken - reset to 1
          newStreak = 1;
        }
        // Same day completion - keep streak
      } else {
        // First completion
        newStreak = 1;
      }

      // Calculate new stage based on total completions
      const completions = await dataLayer.fetchHabitCompletions(habitId);
      const totalCompletions = completions.length + 1; // +1 for current completion
      let newStage = habit.currentStage;

      // Progress through stages based on completions (roughly every 7 completions = 1 stage)
      const stageFromCompletions = Math.min(7, Math.floor(totalCompletions / 7));
      if (stageFromCompletions > newStage) {
        newStage = stageFromCompletions;
      }

      // Create completion record using data layer (syncs to backend for authenticated users)
      const completion = await dataLayer.recordCompletion(habitId, {
        habitId,
        completedAt: now,
        notes,
      });

      if (!completion) throw new Error('Failed to record completion');

      // Restore health when completing habit (20 health per completion, max 100)
      const currentHealth = habit.health ?? 100;
      const newHealth = Math.min(100, currentHealth + 20);

      // Update habit using data layer (syncs to backend for authenticated users)
      const updatedHabit = await dataLayer.updateHabit(habitId, {
        currentStage: newStage,
        streakCount: newStreak,
        lastCompletedAt: now,
        health: newHealth,
      });

      return {
        habit: updatedHabit,
        completion,
        leveledUp: newStage > habit.currentStage,
        healthRestored: newHealth - currentHealth,
      };
    },
    onSuccess: (data) => {
      // Invalidate all relevant queries to force refetch
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['habit', data.completion.habitId] });
      queryClient.invalidateQueries({ queryKey: ['completions', data.completion.habitId] });
      queryClient.invalidateQueries({ queryKey: ['habit-stats', data.completion.habitId] });
    },
  });
}

export function useReviveHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (habitId: string) => {
      const habit = habitStorage.getById(habitId);
      if (!habit) throw new Error('Habit not found');
      if (!habit.isDead) throw new Error('Habit is not dead');

      // Revive with 50% health and reset stage to 0
      // Use data layer which handles backend sync for authenticated users
      const updatedHabit = await dataLayer.updateHabit(habitId, {
        health: 50,
        isDead: false,
        currentStage: 0,
        streakCount: 0,
        lastCompletedAt: new Date(),
      });

      return updatedHabit;
    },
    onSuccess: (_, habitId) => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['habit', habitId] });
      queryClient.invalidateQueries({ queryKey: ['habit-stats', habitId] });
    },
  });
}

export function useHabitCompletions(habitId: string) {
  return useQuery({
    queryKey: ['completions', habitId],
    queryFn: () => dataLayer.fetchHabitCompletions(habitId),
    enabled: !!habitId,
  });
}

export function useHabitStats(habitId: string) {
  return useQuery({
    queryKey: ['habit-stats', habitId],
    queryFn: async () => {
      const habit = habitStorage.getById(habitId);
      if (!habit) return null;

      // Use data layer which handles backend sync for authenticated users
      const completions = await dataLayer.fetchHabitCompletions(habitId);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const completedToday = completions.some((c) => {
        const completionDate = new Date(c.completedAt);
        completionDate.setHours(0, 0, 0, 0);
        return completionDate.getTime() === today.getTime();
      });

      // Calculate stage info
      const currentStage = GROWTH_STAGES[habit.currentStage];
      const nextStage = GROWTH_STAGES[habit.currentStage + 1];

      return {
        habit,
        completions,
        completedToday,
        totalCompletions: completions.length,
        currentStage,
        nextStage,
      };
    },
    enabled: !!habitId,
  });
}

/**
 * Hook to initialize user data after login
 * Should be called after successful authentication to sync with backend
 */
export function useInitializeHabitsAfterLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => dataLayer.initializeUserDataAfterLogin(),
    onSuccess: () => {
      // Invalidate all habit data to trigger refetch from backend
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['completions'] });
      queryClient.invalidateQueries({ queryKey: ['habit-stats'] });
    },
  });
}
