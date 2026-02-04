/**
 * Habit Sync Service
 *
 * Handles backend synchronization for habits and completions.
 * Provides a unified interface for syncing data with the backend API.
 * Backend is the source of truth for authenticated users.
 */

import { platformApi } from '@/sdk/core/request';
import { isAuthenticatedSync } from '@/sdk/core/auth';
import type { Habit, Completion } from '@/types/habit';

const API_ENDPOINTS = {
  HABITS: '/api/habits',
  HABIT_BY_ID: (id: string) => `/api/habits/${id}`,
  COMPLETIONS: '/api/completions',
  COMPLETION_BY_ID: (id: string) => `/api/completions/${id}`,
  HABIT_COMPLETIONS: (habitId: string) => `/api/habits/${habitId}/completions`,
} as const;

export interface SyncResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Check if user is authenticated
 */
function isUserAuthenticated(): boolean {
  return isAuthenticatedSync();
}

/**
 * Sync habits from backend to client
 * Called after login to fetch all user's habits
 */
export async function syncHabitsFromBackend(): Promise<SyncResult<Habit[]>> {
  if (!isUserAuthenticated()) {
    return { success: false, error: 'User not authenticated' };
  }

  try {
    const response = await platformApi.get(API_ENDPOINTS.HABITS);

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Failed to fetch habits: ${response.status} ${errorText}`,
      };
    }

    const data = await response.json();
    const habits = (Array.isArray(data) ? data : data.habits || []) as Habit[];

    // Convert date strings to Date objects
    return {
      success: true,
      data: habits.map((habit) => ({
        ...habit,
        createdAt: new Date(habit.createdAt),
        updatedAt: new Date(habit.updatedAt),
        lastCompletedAt: habit.lastCompletedAt
          ? new Date(habit.lastCompletedAt)
          : undefined,
      })),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Error syncing habits: ${message}` };
  }
}

/**
 * Fetch completions for a specific habit from backend
 */
export async function fetchHabitCompletionsFromBackend(
  habitId: string
): Promise<SyncResult<Completion[]>> {
  if (!isUserAuthenticated()) {
    return { success: false, error: 'User not authenticated' };
  }

  try {
    const response = await platformApi.get(
      API_ENDPOINTS.HABIT_COMPLETIONS(habitId)
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Failed to fetch completions: ${response.status} ${errorText}`,
      };
    }

    const data = await response.json();
    const completions = (Array.isArray(data)
      ? data
      : data.completions || []) as Completion[];

    // Convert date strings to Date objects
    return {
      success: true,
      data: completions.map((completion) => ({
        ...completion,
        completedAt: new Date(completion.completedAt),
        createdAt: new Date(completion.createdAt),
      })),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Error fetching completions: ${message}` };
  }
}

/**
 * Create a habit on the backend
 */
export async function createHabitOnBackend(
  habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>
): Promise<SyncResult<Habit>> {
  if (!isUserAuthenticated()) {
    return { success: false, error: 'User not authenticated' };
  }

  try {
    const response = await platformApi.post(API_ENDPOINTS.HABITS, habit);

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Failed to create habit: ${response.status} ${errorText}`,
      };
    }

    const data = await response.json();
    const createdHabit = data as Habit;

    return {
      success: true,
      data: {
        ...createdHabit,
        createdAt: new Date(createdHabit.createdAt),
        updatedAt: new Date(createdHabit.updatedAt),
        lastCompletedAt: createdHabit.lastCompletedAt
          ? new Date(createdHabit.lastCompletedAt)
          : undefined,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Error creating habit: ${message}` };
  }
}

/**
 * Update a habit on the backend
 */
export async function updateHabitOnBackend(
  habitId: string,
  updates: Partial<Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<SyncResult<Habit>> {
  if (!isUserAuthenticated()) {
    return { success: false, error: 'User not authenticated' };
  }

  try {
    const response = await platformApi.put(
      API_ENDPOINTS.HABIT_BY_ID(habitId),
      updates
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Failed to update habit: ${response.status} ${errorText}`,
      };
    }

    const data = await response.json();
    const updatedHabit = data as Habit;

    return {
      success: true,
      data: {
        ...updatedHabit,
        createdAt: new Date(updatedHabit.createdAt),
        updatedAt: new Date(updatedHabit.updatedAt),
        lastCompletedAt: updatedHabit.lastCompletedAt
          ? new Date(updatedHabit.lastCompletedAt)
          : undefined,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Error updating habit: ${message}` };
  }
}

/**
 * Delete a habit on the backend
 */
export async function deleteHabitOnBackend(
  habitId: string
): Promise<SyncResult<void>> {
  if (!isUserAuthenticated()) {
    return { success: false, error: 'User not authenticated' };
  }

  try {
    const response = await platformApi.delete(
      API_ENDPOINTS.HABIT_BY_ID(habitId)
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Failed to delete habit: ${response.status} ${errorText}`,
      };
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Error deleting habit: ${message}` };
  }
}

/**
 * Record a completion on the backend
 */
export async function recordCompletionOnBackend(
  habitId: string,
  completion: Omit<Completion, 'id' | 'createdAt'>
): Promise<SyncResult<Completion>> {
  if (!isUserAuthenticated()) {
    return { success: false, error: 'User not authenticated' };
  }

  try {
    const response = await platformApi.post(API_ENDPOINTS.COMPLETIONS, {
      ...completion,
      habitId,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Failed to record completion: ${response.status} ${errorText}`,
      };
    }

    const data = await response.json();
    const recordedCompletion = data as Completion;

    return {
      success: true,
      data: {
        ...recordedCompletion,
        completedAt: new Date(recordedCompletion.completedAt),
        createdAt: new Date(recordedCompletion.createdAt),
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: `Error recording completion: ${message}`,
    };
  }
}

/**
 * Delete a completion on the backend
 */
export async function deleteCompletionOnBackend(
  completionId: string
): Promise<SyncResult<void>> {
  if (!isUserAuthenticated()) {
    return { success: false, error: 'User not authenticated' };
  }

  try {
    const response = await platformApi.delete(
      API_ENDPOINTS.COMPLETION_BY_ID(completionId)
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Failed to delete completion: ${response.status} ${errorText}`,
      };
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: `Error deleting completion: ${message}` };
  }
}

/**
 * Check if backend sync is available
 * Returns true if user is authenticated (backend sync enabled)
 */
export function isBackendSyncAvailable(): boolean {
  return isUserAuthenticated();
}
