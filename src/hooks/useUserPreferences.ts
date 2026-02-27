import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userPrefsStorage } from '@/lib/storage';
import type { UserPreferences, ThemeType } from '@/types/habit';

export function useUserPreferences() {
  return useQuery({
    queryKey: ['userPreferences'],
    queryFn: () => userPrefsStorage.get(),
  });
}

export function useUpdateUserPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: Partial<Omit<UserPreferences, 'id' | 'createdAt'>>) =>
      Promise.resolve(userPrefsStorage.update(updates)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPreferences'] });
    },
  });
}

export function useCompleteOnboarding() {
  const updatePrefs = useUpdateUserPreferences();

  return useMutation({
    mutationFn: (data: { defaultTheme?: ThemeType; notificationTime?: string }) =>
      updatePrefs.mutateAsync({
        hasCompletedOnboarding: true,
        ...data,
      }),
  });
}

export function useUnlockPremium() {
  const updatePrefs = useUpdateUserPreferences();

  return useMutation({
    mutationFn: (plan?: 'monthly' | 'yearly' | 'onetime') =>
      updatePrefs.mutateAsync({
        isPremium: true,
        premiumPlan: plan,
      }),
  });
}

export function usePurchaseItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, type }: { itemId: string; type: 'skin' | 'background' | 'animation' }) => {
      const prefs = userPrefsStorage.get();

      const updates: Partial<UserPreferences> = {};

      if (type === 'skin') {
        updates.purchasedSkins = [...(prefs.purchasedSkins || []), itemId];
      } else if (type === 'background') {
        updates.purchasedBackgrounds = [...(prefs.purchasedBackgrounds || []), itemId];
      } else if (type === 'animation') {
        updates.purchasedAnimations = [...(prefs.purchasedAnimations || []), itemId];
      }

      return userPrefsStorage.update(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPreferences'] });
    },
  });
}
