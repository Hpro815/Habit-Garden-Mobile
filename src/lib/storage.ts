// LocalStorage-based persistence layer for habit tracking data

import type { Habit, Completion, UserPreferences } from '@/types/habit';

const STORAGE_KEYS = {
  HABITS: 'habitTracker_habits',
  COMPLETIONS: 'habitTracker_completions',
  USER_PREFS: 'habitTracker_userPreferences',
  CURRENT_USER: 'habitTracker_currentUser',
} as const;

// Get the current user ID for user-specific storage
function getCurrentUserId(): string {
  const prefs = localStorage.getItem(STORAGE_KEYS.USER_PREFS);
  if (prefs) {
    try {
      const parsed = JSON.parse(prefs);
      if (parsed.isLoggedIn && parsed.userEmail) {
        return parsed.userEmail;
      }
    } catch {
      // Fall through to guest
    }
  }
  return 'guest';
}

// Get user-specific storage key
function getUserStorageKey(baseKey: string): string {
  const userId = getCurrentUserId();
  return `${baseKey}_${userId}`;
}

// Helper to safely parse JSON from localStorage
function safeJSONParse<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;

    const parsed = JSON.parse(item);

    // Convert date strings back to Date objects
    if (Array.isArray(parsed)) {
      return parsed.map((item: any) => ({
        ...item,
        createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
        updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined,
        lastCompletedAt: item.lastCompletedAt
          ? new Date(item.lastCompletedAt)
          : undefined,
        completedAt: item.completedAt ? new Date(item.completedAt) : undefined,
      })) as T;
    } else if (parsed && typeof parsed === 'object') {
      return {
        ...parsed,
        createdAt: parsed.createdAt ? new Date(parsed.createdAt) : undefined,
        updatedAt: parsed.updatedAt ? new Date(parsed.updatedAt) : undefined,
        lastCompletedAt: parsed.lastCompletedAt
          ? new Date(parsed.lastCompletedAt)
          : undefined,
      } as T;
    }

    return parsed as T;
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage:`, error);
    return defaultValue;
  }
}

// Habit CRUD operations - now user-specific
export const habitStorage = {
  getAll(): Habit[] {
    const key = getUserStorageKey(STORAGE_KEYS.HABITS);
    return safeJSONParse<Habit[]>(key, []);
  },

  getById(id: string): Habit | undefined {
    const habits = this.getAll();
    return habits.find((habit: Habit) => habit.id === id);
  },

  create(habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>): Habit {
    const habits = this.getAll();
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const newHabit: Habit = {
      ...habit,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      createdMonth: currentMonth,
    };
    habits.push(newHabit);
    const key = getUserStorageKey(STORAGE_KEYS.HABITS);
    localStorage.setItem(key, JSON.stringify(habits));
    return newHabit;
  },

  update(id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt'>>): Habit | null {
    const habits = this.getAll();
    const index = habits.findIndex((habit: Habit) => habit.id === id);

    if (index === -1) return null;

    habits[index] = {
      ...habits[index],
      ...updates,
      updatedAt: new Date(),
    };

    const key = getUserStorageKey(STORAGE_KEYS.HABITS);
    localStorage.setItem(key, JSON.stringify(habits));
    return habits[index];
  },

  delete(id: string): boolean {
    const habits = this.getAll();
    const filtered = habits.filter((habit: Habit) => habit.id !== id);

    if (filtered.length === habits.length) return false;

    const key = getUserStorageKey(STORAGE_KEYS.HABITS);
    localStorage.setItem(key, JSON.stringify(filtered));

    // Also delete associated completions
    const completions = completionStorage.getAll();
    const filteredCompletions = completions.filter((c: Completion) => c.habitId !== id);
    const completionsKey = getUserStorageKey(STORAGE_KEYS.COMPLETIONS);
    localStorage.setItem(completionsKey, JSON.stringify(filteredCompletions));

    return true;
  },
};

// Completion CRUD operations - now user-specific
export const completionStorage = {
  getAll(): Completion[] {
    const key = getUserStorageKey(STORAGE_KEYS.COMPLETIONS);
    return safeJSONParse<Completion[]>(key, []);
  },

  getByHabitId(habitId: string): Completion[] {
    const completions = this.getAll();
    return completions
      .filter((c: Completion) => c.habitId === habitId)
      .sort((a: Completion, b: Completion) => b.completedAt.getTime() - a.completedAt.getTime());
  },

  getByDateRange(habitId: string, startDate: Date, endDate: Date): Completion[] {
    const completions = this.getByHabitId(habitId);
    return completions.filter(
      (c: Completion) =>
        c.completedAt >= startDate &&
        c.completedAt <= endDate
    );
  },

  create(completion: Omit<Completion, 'id' | 'createdAt'>): Completion {
    const completions = this.getAll();
    const newCompletion: Completion = {
      ...completion,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    completions.push(newCompletion);
    const key = getUserStorageKey(STORAGE_KEYS.COMPLETIONS);
    localStorage.setItem(key, JSON.stringify(completions));
    return newCompletion;
  },

  delete(id: string): boolean {
    const completions = this.getAll();
    const filtered = completions.filter((c: Completion) => c.id !== id);

    if (filtered.length === completions.length) return false;

    const key = getUserStorageKey(STORAGE_KEYS.COMPLETIONS);
    localStorage.setItem(key, JSON.stringify(filtered));
    return true;
  },
};

// User Preferences operations - these remain global (not user-specific)
export const userPrefsStorage = {
  get(): UserPreferences {
    const defaultPrefs: UserPreferences = {
      id: crypto.randomUUID(),
      hasCompletedOnboarding: false,
      hasCompletedTutorial: false,
      isPremium: false,
      purchasedSkins: [],
      purchasedBackgrounds: [],
      purchasedAnimations: [],
      darkMode: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      isLoggedIn: false,
      notificationsEnabled: false,
      notificationPermissionAsked: false,
      adEarnedSlots: 0,
      adTriesUsed: 0,
    };

    return safeJSONParse<UserPreferences>(STORAGE_KEYS.USER_PREFS, defaultPrefs);
  },

  update(updates: Partial<Omit<UserPreferences, 'id' | 'createdAt'>>): UserPreferences {
    const prefs = this.get();
    const updated: UserPreferences = {
      ...prefs,
      ...updates,
      updatedAt: new Date(),
    };
    localStorage.setItem(STORAGE_KEYS.USER_PREFS, JSON.stringify(updated));
    return updated;
  },

  reset(): void {
    localStorage.removeItem(STORAGE_KEYS.USER_PREFS);
  },
};

// Bulk operations
export const bulkOperations = {
  clearAllData(): void {
    const habitsKey = getUserStorageKey(STORAGE_KEYS.HABITS);
    const completionsKey = getUserStorageKey(STORAGE_KEYS.COMPLETIONS);
    localStorage.removeItem(habitsKey);
    localStorage.removeItem(completionsKey);
    localStorage.removeItem(STORAGE_KEYS.USER_PREFS);
  },

  exportData(): {
    habits: Habit[];
    completions: Completion[];
    userPreferences: UserPreferences;
  } {
    return {
      habits: habitStorage.getAll(),
      completions: completionStorage.getAll(),
      userPreferences: userPrefsStorage.get(),
    };
  },

  importData(data: {
    habits?: Habit[];
    completions?: Completion[];
    userPreferences?: UserPreferences;
  }): void {
    if (data.habits) {
      const key = getUserStorageKey(STORAGE_KEYS.HABITS);
      localStorage.setItem(key, JSON.stringify(data.habits));
    }
    if (data.completions) {
      const key = getUserStorageKey(STORAGE_KEYS.COMPLETIONS);
      localStorage.setItem(key, JSON.stringify(data.completions));
    }
    if (data.userPreferences) {
      localStorage.setItem(STORAGE_KEYS.USER_PREFS, JSON.stringify(data.userPreferences));
    }
  },
};
