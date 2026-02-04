/**
 * Synced Habits Hook
 *
 * React hook that provides habit data with backend sync support.
 * Automatically handles both authenticated (synced) and guest (local) modes.
 *
 * Usage:
 * ```tsx
 * const { data: habits, isLoading, error } = useSyncedHabits();
 * ```
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useCreaoAuth } from '@/sdk/core/auth';
import * as dataLayer from '@/services/habitDataLayer';
import type { Habit, Completion } from '@/types/habit';

// Query key factory for better cache management
export const habitQueryKeys = {
  all: () => ['habits'] as const,
  lists: () => [...habitQueryKeys.all(), 'list'] as const,
  list: (userId: string) => [...habitQueryKeys.lists(), userId] as const,
  details: () => [...habitQueryKeys.all(), 'detail'] as const,
  detail: (id: string) => [...habitQueryKeys.details(), id] as const,
  completions: () => ['completions'] as const,
  habitCompletions: (habitId: string) =>
    [...habitQueryKeys.completions(), habitId] as const,
};

interface UseSyncedHabitsOptions {
  forceLocalOnly?: boolean;
}

/**
 * Hook to fetch all habits with backend sync
 */
export function useSyncedHabits(options?: UseSyncedHabitsOptions) {
  const { data: userPrefs } = useUserPreferences();
  const { isAuthenticated } = useCreaoAuth();

  // Use email or 'guest' as user identifier for cache key
  const userId = isAuthenticated && userPrefs?.userEmail
    ? userPrefs.userEmail
    : 'guest';

  return useQuery({
    queryKey: habitQueryKeys.list(userId),
    queryFn: () => dataLayer.fetchAllHabits({ forceLocalOnly: options?.forceLocalOnly }),
    staleTime: isAuthenticated ? 5 * 60 * 1000 : 1 * 60 * 1000, // 5 min for authenticated, 1 min for guests
  });
}

/**
 * Hook to fetch a specific habit
 */
export function useSyncedHabit(habitId: string) {
  return useQuery({
    queryKey: habitQueryKeys.detail(habitId),
    queryFn: () => dataLayer.fetchAllHabits().then(
      (habits) => habits.find((h) => h.id === habitId)
    ),
    enabled: !!habitId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to create a habit with backend sync
 */
export function useCreateSyncedHabit() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useCreaoAuth();

  return useMutation({
    mutationFn: (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) =>
      dataLayer.createHabit(habit),
    onSuccess: () => {
      // Invalidate all habit lists
      queryClient.invalidateQueries({ queryKey: habitQueryKeys.lists() });
    },
  });
}

/**
 * Hook to update a habit with backend sync
 */
export function useUpdateSyncedHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>>;
    }) => dataLayer.updateHabit(id, updates),
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: habitQueryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: habitQueryKeys.detail(variables.id),
      });
    },
  });
}

/**
 * Hook to delete a habit with backend sync
 */
export function useDeleteSyncedHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (habitId: string) => dataLayer.deleteHabit(habitId),
    onSuccess: () => {
      // Invalidate all habit lists
      queryClient.invalidateQueries({ queryKey: habitQueryKeys.lists() });
    },
  });
}

/**
 * Hook to record a completion with backend sync
 */
export function useRecordCompletion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      habitId,
      notes,
    }: {
      habitId: string;
      notes?: string;
    }) => {
      const now = new Date();
      return dataLayer.recordCompletion(habitId, {
        habitId,
        completedAt: now,
        notes,
      });
    },
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: habitQueryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: habitQueryKeys.detail(variables.habitId),
      });
      queryClient.invalidateQueries({
        queryKey: habitQueryKeys.habitCompletions(variables.habitId),
      });
    },
  });
}

/**
 * Hook to fetch completions for a habit with backend sync
 */
export function useSyncedCompletions(habitId: string) {
  return useQuery({
    queryKey: habitQueryKeys.habitCompletions(habitId),
    queryFn: () => dataLayer.fetchHabitCompletions(habitId),
    enabled: !!habitId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to delete a completion with backend sync
 */
export function useDeleteCompletion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (completionId: string) =>
      dataLayer.deleteCompletion(completionId),
    onSuccess: () => {
      // Invalidate all habit and completion queries
      queryClient.invalidateQueries({ queryKey: habitQueryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: habitQueryKeys.completions(),
      });
    },
  });
}

/**
 * Hook to initialize user data after login
 * Should be called after successful authentication
 */
export function useInitializeUserDataAfterLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => dataLayer.initializeUserDataAfterLogin(),
    onSuccess: () => {
      // Invalidate all habit data to trigger refetch from backend
      queryClient.invalidateQueries({ queryKey: habitQueryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: habitQueryKeys.completions(),
      });
    },
  });
}

/**
 * Hook to check if backend sync is enabled
 */
export function useIsBackendSyncEnabled() {
  const { isAuthenticated } = useCreaoAuth();
  return isAuthenticated && dataLayer.isBackendSyncEnabled();
}
