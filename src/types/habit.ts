// Core habit tracking types

export type FlowerType =
  | 'rose'
  | 'lily'
  | 'tulip'
  | 'carnation'
  | 'peony'
  | 'poppy'
  | 'sunflower'
  | 'iris'
  | 'lavender'
  | 'lily-of-valley'
  | 'bluebell'
  | 'buttercup'
  | 'cornflower';

export type ThemeType = 'plant' | FlowerType;
export type FrequencyType = 'daily' | 'weekly' | 'custom';

// Premium flower types that require subscription
export const PREMIUM_FLOWERS: FlowerType[] = [
  'sunflower',
  'iris',
  'lavender',
  'lily-of-valley',
  'bluebell',
  'buttercup',
  'cornflower',
];

export const FREE_FLOWERS: FlowerType[] = [
  'rose',
  'lily',
  'tulip',
  'carnation',
  'peony',
  'poppy',
];
export type ColorPaletteType =
  | 'pastel-pink'
  | 'pastel-blue'
  | 'pastel-green'
  | 'pastel-purple'
  | 'pastel-yellow'
  | 'soft-coral'
  | 'mint-dream'
  | 'lavender-mist';

export interface AppBlockSettings {
  enabled: boolean;
  blockedApps: string[]; // App names/identifiers
  blockType: 'during_habit' | 'time_period' | 'until_complete';
  startTime?: string; // Format: "HH:MM" for time_period type
  endTime?: string; // Format: "HH:MM" for time_period type
}

export interface Habit {
  id: string;
  name: string;
  theme: ThemeType;
  colorPalette: ColorPaletteType;
  goalFrequency: FrequencyType;
  customFrequency?: number; // For custom frequency (e.g., 3 times per week)
  reminderEnabled: boolean;
  reminderTime?: string; // Format: "HH:MM"
  currentStage: number; // 0-7 growth stages
  streakCount: number;
  lastCompletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdMonth?: string; // Format: "YYYY-MM" for tracking monthly habit creation
  health: number; // 0-100, pet/plant health that decays when streak is broken
  isDead: boolean; // Pet/plant has died from neglect
  appBlocking?: AppBlockSettings; // Premium feature for app blocking
}

export interface Completion {
  id: string;
  habitId: string;
  completedAt: Date;
  notes?: string;
  createdAt: Date;
}

export interface UserPreferences {
  id: string;
  hasCompletedOnboarding: boolean;
  hasCompletedTutorial: boolean;
  defaultTheme?: ThemeType;
  notificationTime?: string;
  isPremium: boolean;
  purchasedSkins: string[];
  purchasedBackgrounds: string[];
  purchasedAnimations: string[];
  darkMode: boolean;
  createdAt: Date;
  updatedAt: Date;
  // User account info
  isLoggedIn: boolean;
  userEmail?: string;
  userName?: string;
  notificationsEnabled: boolean;
  notificationPermissionAsked: boolean;
  // Garden customization
  gardenName?: string;
  // Ad-earned extra habit slots
  adEarnedSlots: number; // Number of extra habit slots earned from watching ads
  adTriesUsed: number; // Number of times user has used the ad option (max 2)
  // Display settings
  streaksEnabled: boolean; // Show/hide streak counters
}

// Maximum times user can use ad option to get extra slots
export const MAX_AD_TRIES = 2;
// Number of ads to watch for one extra habit slot
export const ADS_PER_SLOT = 2;
// Duration of each ad in seconds
export const AD_DURATION_SECONDS = 10;

// Growth stage configuration
export interface GrowthStage {
  stage: number;
  name: string;
  xpRequired: number;
  description: string;
  plantName?: string;
  petName?: string;
}

export const GROWTH_STAGES: GrowthStage[] = [
  { stage: 0, name: 'Baby', xpRequired: 0, description: 'Just starting out', plantName: 'Seed', petName: 'Newborn' },
  { stage: 1, name: 'Young', xpRequired: 50, description: 'Beginning to grow', plantName: 'Sprout', petName: 'Baby' },
  { stage: 2, name: 'Growing', xpRequired: 150, description: 'Taking shape', plantName: 'Seedling', petName: 'Toddler' },
  { stage: 3, name: 'Juvenile', xpRequired: 300, description: 'Growing stronger', plantName: 'Young Plant', petName: 'Child' },
  { stage: 4, name: 'Teen', xpRequired: 500, description: 'Developing well', plantName: 'Maturing', petName: 'Teenager' },
  { stage: 5, name: 'Young Adult', xpRequired: 800, description: 'Flourishing', plantName: 'Blooming', petName: 'Young Adult' },
  { stage: 6, name: 'Adult', xpRequired: 1200, description: 'Fully grown', plantName: 'Thriving', petName: 'Adult' },
  { stage: 7, name: 'Master', xpRequired: 2000, description: 'Maximum evolution', plantName: 'Legendary', petName: 'Master' },
];

// Flower-specific growth stage names
export const FLOWER_STAGE_NAMES: Record<FlowerType, string[]> = {
  rose: ['Seed', 'Sprout', 'Seedling', 'Young Bush', 'Budding', 'Blooming', 'Full Bloom', 'Rose Garden'],
  lily: ['Bulb', 'Shoot', 'Leaves', 'Stem', 'Budding', 'Opening', 'Full Bloom', 'Lily Patch'],
  tulip: ['Bulb', 'Shoot', 'Leaves', 'Stem', 'Budding', 'Opening', 'Full Bloom', 'Tulip Field'],
  carnation: ['Seed', 'Sprout', 'Seedling', 'Stem', 'Budding', 'Opening', 'Full Bloom', 'Carnation Bouquet'],
  peony: ['Root', 'Sprout', 'Leaves', 'Bush', 'Budding', 'Opening', 'Full Bloom', 'Peony Garden'],
  poppy: ['Seed', 'Sprout', 'Leaves', 'Stem', 'Budding', 'Opening', 'Full Bloom', 'Poppy Field'],
  sunflower: ['Seed', 'Sprout', 'Seedling', 'Stem', 'Growing Tall', 'Budding', 'Full Bloom', 'Sunflower Field'],
  iris: ['Rhizome', 'Shoot', 'Leaves', 'Stem', 'Budding', 'Opening', 'Full Bloom', 'Iris Garden'],
  lavender: ['Seed', 'Sprout', 'Seedling', 'Bush', 'Budding', 'Flowering', 'Full Bloom', 'Lavender Field'],
  'lily-of-valley': ['Pip', 'Shoot', 'Leaves', 'Stem', 'Budding', 'Bells Forming', 'Full Bloom', 'Valley Garden'],
  bluebell: ['Bulb', 'Shoot', 'Leaves', 'Stem', 'Budding', 'Opening', 'Full Bloom', 'Bluebell Woods'],
  buttercup: ['Seed', 'Sprout', 'Leaves', 'Stem', 'Budding', 'Opening', 'Full Bloom', 'Buttercup Meadow'],
  cornflower: ['Seed', 'Sprout', 'Seedling', 'Stem', 'Budding', 'Opening', 'Full Bloom', 'Cornflower Field'],
};

// Premium features
export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'skin' | 'background' | 'animation';
  previewUrl?: string;
}

// Premium configuration
export const PREMIUM_UNLOCK_PRICE = 4.99;
export const FREE_HABIT_LIMIT_PER_MONTH = 10;

// Helper function to check if a theme requires premium
export function isPremiumTheme(theme: ThemeType): boolean {
  return PREMIUM_FLOWERS.includes(theme as FlowerType);
}

// Helper to get stage name for a theme
export function getStageName(theme: ThemeType, stage: number): string {
  if (theme === 'plant') {
    return GROWTH_STAGES[stage]?.plantName || GROWTH_STAGES[stage]?.name || 'Unknown';
  }
  if (theme in FLOWER_STAGE_NAMES) {
    return FLOWER_STAGE_NAMES[theme as FlowerType][stage] || 'Unknown';
  }
  return GROWTH_STAGES[stage]?.name || 'Unknown';
}
