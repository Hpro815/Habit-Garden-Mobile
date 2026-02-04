/**
 * Habit Data Layer
 *
 * Unified data layer that handles both local storage (for guests)
 * and backend sync (for authenticated users).
 *
 * Strategy:
 * - For authenticated users: Backend is source of truth, local cache for offline
 * - For guests: Local storage only
 */

import { habitStorage, completionStorage } from '@/lib/storage';
import {
  syncHabitsFromBackend,
  fetchHabitCompletionsFromBackend,
  createHabitOnBackend,
  updateHabitOnBackend,
  deleteHabitOnBackend,
  recordCompletionOnBackend,
  deleteCompletionOnBackend,
  isBackendSyncAvailable,
} from './habitSyncService';
import { isAuthenticatedSync } from '@/sdk/core/auth';
import type { Habit, Completion } from '@/types/habit';

interface DataLayerOptions {
  forceLocalOnly?: boolean; // Force local-only mode even if authenticated
}

/**
 * Fetch all habits with backend sync if available
 * For authenticated users: fetches from backend and updates local cache
 * For guests: fetches from local storage only
 */
export async function fetchAllHabits(
  options: DataLayerOptions = {}
): Promise<Habit[]> {
  const isAuthenticated = isAuthenticatedSync();

  // Force local-only if requested
  if (options.forceLocalOnly || !isAuthenticated) {
    return habitStorage.getAll();
  }

  // Try to sync from backend
  if (isBackendSyncAvailable()) {
    const syncResult = await syncHabitsFromBackend();

    if (syncResult.success && syncResult.data) {
      // Update local cache with backend data
      // This ensures consistency across devices
      const currentHabits = habitStorage.getAll();

      // For each habit from backend, update or create in local storage
      for (const backendHabit of syncResult.data) {
        const localHabit = currentHabits.find((h) => h.id === backendHabit.id);
        if (localHabit) {
          // Update existing habit
          habitStorage.update(backendHabit.id, backendHabit);
        } else {
          // Note: We can't directly create with an ID, so we'll store it
          // The local storage layer would need to support this
          // For now, we return backend data and let the UI handle caching
        }
      }

      return syncResult.data;
    }

    // If sync fails, fall back to local storage
    console.warn('Backend sync failed, using local cache:', syncResult.error);
    return habitStorage.getAll();
  }

  // Fallback to local storage
  return habitStorage.getAll();
}

/**
 * Fetch completions for a habit
 * For authenticated users: tries backend first
 * For guests: uses local storage
 */
export async function fetchHabitCompletions(
  habitId: string,
  options: DataLayerOptions = {}
): Promise<Completion[]> {
  const isAuthenticated = isAuthenticatedSync();

  if (options.forceLocalOnly || !isAuthenticated) {
    return completionStorage.getByHabitId(habitId);
  }

  if (isBackendSyncAvailable()) {
    const syncResult = await fetchHabitCompletionsFromBackend(habitId);

    if (syncResult.success && syncResult.data) {
      return syncResult.data;
    }

    // Fallback to local storage
    console.warn(
      'Backend completion sync failed, using local cache:',
      syncResult.error
    );
  }

  return completionStorage.getByHabitId(habitId);
}

/**
 * Create a new habit
 * For authenticated users: creates on backend and updates local cache
 * For guests: creates in local storage only
 */
export async function createHabit(
  habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>,
  options: DataLayerOptions = {}
): Promise<Habit | null> {
  const isAuthenticated = isAuthenticatedSync();

  if (options.forceLocalOnly || !isAuthenticated) {
    return habitStorage.create(habit);
  }

  // Try backend first for authenticated users
  if (isBackendSyncAvailable()) {
    const syncResult = await createHabitOnBackend(habit);

    if (syncResult.success && syncResult.data) {
      // Update local cache with backend response
      // Note: This would require modifying habitStorage to accept a full habit with ID
      return syncResult.data;
    }

    console.warn('Failed to create habit on backend:', syncResult.error);
  }

  // Fallback to local storage
  return habitStorage.create(habit);
}

/**
 * Update a habit
 * For authenticated users: updates on backend
 * For guests: updates in local storage only
 */
export async function updateHabit(
  habitId: string,
  updates: Partial<Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>>,
  options: DataLayerOptions = {}
): Promise<Habit | null> {
  const isAuthenticated = isAuthenticatedSync();

  // Always update local cache for instant feedback
  const localResult = habitStorage.update(habitId, updates);

  if (options.forceLocalOnly || !isAuthenticated) {
    return localResult;
  }

  // Try to sync to backend
  if (isBackendSyncAvailable()) {
    const syncResult = await updateHabitOnBackend(habitId, updates);

    if (syncResult.success && syncResult.data) {
      // Update local cache with backend response (handles server-side transformations)
      habitStorage.update(habitId, syncResult.data);
      return syncResult.data;
    }

    // If backend update fails, keep local change but log error
    console.warn('Failed to sync habit to backend:', syncResult.error);
  }

  return localResult;
}

/**
 * Delete a habit
 * For authenticated users: deletes from backend
 * For guests: deletes from local storage only
 */
export async function deleteHabit(
  habitId: string,
  options: DataLayerOptions = {}
): Promise<boolean> {
  const isAuthenticated = isAuthenticatedSync();

  if (options.forceLocalOnly || !isAuthenticated) {
    return habitStorage.delete(habitId);
  }

  // Always try backend first for authenticated users
  if (isBackendSyncAvailable()) {
    const syncResult = await deleteHabitOnBackend(habitId);

    if (syncResult.success) {
      // Only delete from local storage after backend confirms
      habitStorage.delete(habitId);
      return true;
    }

    console.warn('Failed to delete habit on backend:', syncResult.error);
    return false;
  }

  // Fallback to local storage
  return habitStorage.delete(habitId);
}

/**
 * Record a completion
 * For authenticated users: records on backend
 * For guests: records in local storage only
 */
export async function recordCompletion(
  habitId: string,
  completion: Omit<Completion, 'id' | 'createdAt'>,
  options: DataLayerOptions = {}
): Promise<Completion | null> {
  const isAuthenticated = isAuthenticatedSync();

  if (options.forceLocalOnly || !isAuthenticated) {
    return completionStorage.create(completion);
  }

  // Try backend first for authenticated users
  if (isBackendSyncAvailable()) {
    const syncResult = await recordCompletionOnBackend(habitId, completion);

    if (syncResult.success && syncResult.data) {
      return syncResult.data;
    }

    console.warn('Failed to record completion on backend:', syncResult.error);
  }

  // Fallback to local storage
  return completionStorage.create(completion);
}

/**
 * Delete a completion
 * For authenticated users: deletes from backend
 * For guests: deletes from local storage only
 */
export async function deleteCompletion(
  completionId: string,
  options: DataLayerOptions = {}
): Promise<boolean> {
  const isAuthenticated = isAuthenticatedSync();

  if (options.forceLocalOnly || !isAuthenticated) {
    return completionStorage.delete(completionId);
  }

  // Always try backend first for authenticated users
  if (isBackendSyncAvailable()) {
    const syncResult = await deleteCompletionOnBackend(completionId);

    if (syncResult.success) {
      // Only delete from local storage after backend confirms
      completionStorage.delete(completionId);
      return true;
    }

    console.warn('Failed to delete completion on backend:', syncResult.error);
    return false;
  }

  // Fallback to local storage
  return completionStorage.delete(completionId);
}

/**
 * Initialize user's data after login
 * Fetches all data from backend and refreshes local cache
 */
export async function initializeUserDataAfterLogin(): Promise<{
  habitsInitialized: boolean;
  habitCount: number;
  error?: string;
}> {
  if (!isAuthenticatedSync()) {
    return {
      habitsInitialized: false,
      habitCount: 0,
      error: 'User not authenticated',
    };
  }

  try {
    const habits = await fetchAllHabits();

    return {
      habitsInitialized: true,
      habitCount: habits.length,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      habitsInitialized: false,
      habitCount: 0,
      error: `Failed to initialize user data: ${message}`,
    };
  }
}

/**
 * Check if backend sync is available and user is authenticated
 */
export function isBackendSyncEnabled(): boolean {
  return isAuthenticatedSync() && isBackendSyncAvailable();
}
