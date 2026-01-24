import { habitStorage, userPrefsStorage } from './storage';
import { isPremiumTheme, FREE_HABIT_LIMIT_PER_MONTH, MAX_AD_TRIES, ADS_PER_SLOT } from '@/types/habit';
import type { ThemeType } from '@/types/habit';

// Get current month in YYYY-MM format
export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

// Count habits created this month
export function getHabitsCreatedThisMonth(): number {
  const habits = habitStorage.getAll();
  const currentMonth = getCurrentMonth();
  return habits.filter((habit) => habit.createdMonth === currentMonth).length;
}

// Get total habit limit including ad-earned slots
export function getTotalHabitLimit(): number {
  const userPrefs = userPrefsStorage.get();
  const adEarnedSlots = userPrefs.adEarnedSlots ?? 0;
  return FREE_HABIT_LIMIT_PER_MONTH + adEarnedSlots;
}

// Check if user can watch ads for extra slots
export function canWatchAdsForSlots(): { allowed: boolean; triesRemaining: number } {
  const userPrefs = userPrefsStorage.get();
  const adTriesUsed = userPrefs.adTriesUsed ?? 0;
  const triesRemaining = MAX_AD_TRIES - adTriesUsed;
  return {
    allowed: triesRemaining > 0,
    triesRemaining,
  };
}

// Add an extra habit slot from watching ads
export function addAdEarnedSlot(): void {
  const userPrefs = userPrefsStorage.get();
  const currentSlots = userPrefs.adEarnedSlots ?? 0;
  const currentTries = userPrefs.adTriesUsed ?? 0;
  userPrefsStorage.update({
    adEarnedSlots: currentSlots + 1,
    adTriesUsed: currentTries + 1,
  });
}

// Check if user can create more habits
export function canCreateHabit(): { allowed: boolean; reason?: string; canWatchAds?: boolean } {
  const userPrefs = userPrefsStorage.get();

  // Premium users have no limits
  if (userPrefs.isPremium) {
    return { allowed: true };
  }

  // Free users: check monthly limit including ad-earned slots
  const habitsThisMonth = getHabitsCreatedThisMonth();
  const totalLimit = getTotalHabitLimit();

  if (habitsThisMonth >= totalLimit) {
    const adCheck = canWatchAdsForSlots();
    return {
      allowed: false,
      reason: `Free plan limit reached (${totalLimit} habits/month). ${adCheck.allowed ? 'Watch ads for an extra slot or upgrade to Premium!' : 'Upgrade to Premium for unlimited habits!'}`,
      canWatchAds: adCheck.allowed,
    };
  }

  return { allowed: true };
}

// Export constants for use in components
export { MAX_AD_TRIES, ADS_PER_SLOT };

// Check if user can use a specific theme
export function canUseTheme(theme: ThemeType): { allowed: boolean; reason?: string } {
  const userPrefs = userPrefsStorage.get();

  // Premium users can use all themes
  if (userPrefs.isPremium) {
    return { allowed: true };
  }

  // Check if theme requires premium
  if (isPremiumTheme(theme)) {
    return {
      allowed: false,
      reason: `${theme.charAt(0).toUpperCase() + theme.slice(1)} requires Premium. Upgrade to unlock!`,
    };
  }

  return { allowed: true };
}

// Get remaining habit slots for free users
export function getRemainingHabitSlots(): number {
  const userPrefs = userPrefsStorage.get();

  if (userPrefs.isPremium) {
    return Infinity;
  }

  const habitsThisMonth = getHabitsCreatedThisMonth();
  const totalLimit = getTotalHabitLimit();
  return Math.max(0, totalLimit - habitsThisMonth);
}
