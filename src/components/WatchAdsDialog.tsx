import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, CheckCircle2, Gift, Tv } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { addAdEarnedSlot, canWatchAdsForSlots } from '@/lib/premium';
import { ADS_PER_SLOT, AD_DURATION_SECONDS } from '@/types/habit';

// ============================================================================
// GOOGLE ADMOB CONFIGURATION (for mobile apps)
// ============================================================================
// App ID: ca-app-pub-1715028570954921~7213780530
// Ad Unit ID: ca-app-pub-1715028570954921/1560152691
// ============================================================================

const ADMOB_CONFIG = {
  appId: 'ca-app-pub-1715028570954921~7213780530',
  adUnitId: 'ca-app-pub-1715028570954921/1560152691',
};

// localStorage key for persisting watched ads counter
const REWARD_ADS_COUNTER_KEY = 'habit_reward_ads_watched';

// Declare Android WebView interface for TypeScript
declare global {
  interface Window {
    AndroidReward?: {
      showRewardAd: () => void;
    };
    // Callback function for Android to call when reward ad completes
    onHabitRewardGranted?: () => void;
  }
}

// Check if running in Android WebView
function isAndroidWebView(): boolean {
  return typeof window !== 'undefined' && typeof window.AndroidReward !== 'undefined';
}

// Get the current watched ads counter from localStorage
function getStoredAdsWatched(): number {
  if (typeof window === 'undefined') return 0;
  const stored = localStorage.getItem(REWARD_ADS_COUNTER_KEY);
  if (!stored) return 0;
  const count = parseInt(stored, 10);
  return isNaN(count) ? 0 : Math.min(count, ADS_PER_SLOT);
}

// Save the watched ads counter to localStorage
function setStoredAdsWatched(count: number): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REWARD_ADS_COUNTER_KEY, Math.min(count, ADS_PER_SLOT).toString());
}

// Clear the watched ads counter from localStorage
function clearStoredAdsWatched(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(REWARD_ADS_COUNTER_KEY);
}

interface WatchAdsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

// Ad display component - shows ad content during the viewing period
function AdDisplay({ adNumber, timeRemaining }: { adNumber: number; timeRemaining: number }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
      <div className="bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-lg p-6 w-full max-w-sm shadow-lg">
        <div className="text-sm opacity-75 mb-1">Sponsored</div>
        <div className="text-3xl font-bold mb-2">Habit Garden</div>
        <div className="text-lg opacity-90 mb-4">Grow Your Best Self</div>

        {/* Countdown display */}
        <div className="bg-white/20 rounded-full px-6 py-3 inline-block mb-4">
          <span className="text-3xl font-bold">{timeRemaining}</span>
          <span className="text-lg ml-1">seconds</span>
        </div>

        <div className="text-sm opacity-75">
          Ad {adNumber} of {ADS_PER_SLOT}
        </div>

        {/* AdMob info for development */}
        <div className="mt-4 pt-4 border-t border-white/20 text-xs opacity-50">
          <div>AdMob Unit: {ADMOB_CONFIG.adUnitId.slice(-8)}</div>
        </div>
      </div>
    </div>
  );
}

export function WatchAdsDialog({ open, onOpenChange, onComplete }: WatchAdsDialogProps) {
  // Initialize adsWatched from localStorage for mobile app persistence
  const [adsWatched, setAdsWatched] = useState(() => {
    if (isAndroidWebView()) {
      return getStoredAdsWatched();
    }
    return 0;
  });
  const [isWatching, setIsWatching] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(AD_DURATION_SECONDS);

  const { triesRemaining } = canWatchAdsForSlots();
  const progress = (adsWatched / ADS_PER_SLOT) * 100;
  const adProgress = ((AD_DURATION_SECONDS - timeRemaining) / AD_DURATION_SECONDS) * 100;

  // Handler for when Android calls onHabitRewardGranted
  const handleRewardGranted = useCallback(() => {
    // Only process on mobile app
    if (!isAndroidWebView()) return;

    const newCount = Math.min(adsWatched + 1, ADS_PER_SLOT);

    // Update state immediately for UI
    setAdsWatched(newCount);

    // Persist to localStorage
    setStoredAdsWatched(newCount);

    if (newCount >= ADS_PER_SLOT) {
      // All ads watched - grant the slot
      addAdEarnedSlot();
      setIsComplete(true);
      // Clear the counter for next time
      clearStoredAdsWatched();
    }
  }, [adsWatched]);

  // Register callback for Android to call when reward ad completes
  // Only runs on mobile app (Android WebView)
  useEffect(() => {
    if (isAndroidWebView()) {
      window.onHabitRewardGranted = handleRewardGranted;

      return () => {
        window.onHabitRewardGranted = undefined;
      };
    }
  }, [handleRewardGranted]);

  // Load persisted counter when dialog opens on mobile
  useEffect(() => {
    if (open && isAndroidWebView()) {
      const storedCount = getStoredAdsWatched();
      setAdsWatched(storedCount);

      // Check if already complete
      if (storedCount >= ADS_PER_SLOT) {
        addAdEarnedSlot();
        setIsComplete(true);
        clearStoredAdsWatched();
      }
    }
  }, [open]);

  // Countdown timer effect - only for desktop/web simulated ads
  useEffect(() => {
    // Don't run timer on Android WebView - native ads handle timing
    if (isAndroidWebView()) return;

    let interval: NodeJS.Timeout | null = null;

    if (isWatching && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Ad finished
            setIsWatching(false);
            const newCount = adsWatched + 1;
            setAdsWatched(newCount);

            if (newCount >= ADS_PER_SLOT) {
              // All ads watched - grant the slot
              addAdEarnedSlot();
              setIsComplete(true);
            }
            return AD_DURATION_SECONDS;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWatching, timeRemaining, adsWatched]);

  const handleWatchAd = () => {
    // Check if running in Android WebView - call native ad interface
    if (isAndroidWebView()) {
      try {
        window.AndroidReward?.showRewardAd();
        // The native Android app will handle the ad display
        // When complete, it calls window.onHabitRewardGranted()
        return;
      } catch (error) {
        console.error('Error calling AndroidReward.showRewardAd():', error);
        // Fall through to simulated ad if native call fails
      }
    }

    // Web/Desktop: Show simulated ad with timer (no real ads on web)
    setTimeRemaining(AD_DURATION_SECONDS);
    setIsWatching(true);
  };

  const handleClose = () => {
    if (isComplete) {
      onComplete();
      // Clear counter on successful completion
      if (isAndroidWebView()) {
        clearStoredAdsWatched();
      }
    }
    // Reset local state but keep localStorage for mobile persistence
    if (!isAndroidWebView()) {
      setAdsWatched(0);
    }
    setIsComplete(false);
    setIsWatching(false);
    setTimeRemaining(AD_DURATION_SECONDS);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tv className="text-purple-600" size={24} />
            Watch Ads for Extra Habit
          </DialogTitle>
          <DialogDescription>
            Watch {ADS_PER_SLOT} short ads to earn 1 extra habit slot. You have {triesRemaining} {triesRemaining === 1 ? 'try' : 'tries'} remaining.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <AnimatePresence mode="wait">
            {isComplete ? (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-6">
                  <Gift size={48} className="text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Extra Habit Unlocked!
                </h3>
                <p className="text-center text-gray-600 dark:text-gray-400">
                  You earned 1 extra habit slot. Go create your new habit!
                </p>
                <Button onClick={handleClose} className="w-full mt-2">
                  <CheckCircle2 size={18} className="mr-2" />
                  Continue
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="watching"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-6"
              >
                {/* Overall progress indicator */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Ads Watched</span>
                    <span>{adsWatched} / {ADS_PER_SLOT}</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>

                {/* Ad viewing area */}
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden min-h-[280px] flex flex-col">
                  {isWatching ? (
                    <>
                      {/* Ad content area */}
                      <div className="flex-1 flex items-center justify-center">
                        <AdDisplay
                          adNumber={adsWatched + 1}
                          timeRemaining={timeRemaining}
                        />
                      </div>

                      {/* Ad timer progress bar */}
                      <div className="p-3 bg-gray-200 dark:bg-gray-700">
                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                          <span>Ad {adsWatched + 1} of {ADS_PER_SLOT}</span>
                          <span>{timeRemaining}s remaining</span>
                        </div>
                        <Progress value={adProgress} className="h-2" />
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
                      <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-4">
                        <Play size={32} className="text-purple-600 dark:text-purple-400" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-center">
                        {adsWatched === 0
                          ? 'Tap below to start watching ads'
                          : `${ADS_PER_SLOT - adsWatched} more ${ADS_PER_SLOT - adsWatched === 1 ? 'ad' : 'ads'} to go!`}
                      </p>
                    </div>
                  )}
                </div>

                {/* Watch button */}
                <Button
                  onClick={handleWatchAd}
                  disabled={isWatching}
                  className="w-full gap-2"
                  size="lg"
                >
                  {isWatching ? (
                    <>Watching... {timeRemaining}s</>
                  ) : (
                    <>
                      <Play size={18} />
                      Watch Ad {adsWatched + 1}
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-gray-500 dark:text-gray-500">
                  Each ad is {AD_DURATION_SECONDS} seconds
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
