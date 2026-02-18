import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedCharacter } from '@/components/AnimatedCharacter';
import { useCompleteOnboarding } from '@/hooks/useUserPreferences';
import type { ThemeType } from '@/types/habit';
import { Sparkles, Target, TrendingUp } from 'lucide-react';

const themes: Array<{ type: ThemeType | null; name: string; description: string }> = [
  { type: 'tulip', name: 'Tulip', description: 'Grow beautiful tulips' },
  { type: 'rose', name: 'Rose', description: 'Grow elegant roses' },
  { type: 'lily', name: 'Lily', description: 'Grow graceful lilies' },
  { type: null, name: 'Coming Soon', description: 'More flowers coming!' },
];

const steps = [
  {
    title: 'Welcome to Habit Garden',
    description: 'Watch your habits come to life as beautiful growing characters',
    icon: Sparkles,
  },
  {
    title: 'Complete Habits, Grow Flowers',
    description: 'Each completion makes your flower grow and evolve through 8 amazing stages',
    icon: Target,
  },
  {
    title: 'Build Streaks, Stay Healthy',
    description: 'Maintain daily streaks to keep your flowers healthy and thriving',
    icon: TrendingUp,
  },
];

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>('tulip');
  const completeOnboarding = useCompleteOnboarding();

  const isLastInfoStep = currentStep === steps.length - 1;
  const isThemeSelection = currentStep === steps.length;

  const handleNext = () => {
    if (isThemeSelection) {
      completeOnboarding.mutate(
        { defaultTheme: selectedTheme },
        {
          onSuccess: () => {
            onComplete();
          },
        }
      );
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900 dark:via-pink-900 dark:to-blue-900 p-4" style={{ paddingTop: 'var(--safe-area-inset-top)' }}>
      <Card className="w-full max-w-2xl overflow-hidden border-2 shadow-2xl">
        <CardContent className="p-0">
          <AnimatePresence mode="wait">
            {!isThemeSelection ? (
              <motion.div
                key={`step-${currentStep}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8 md:p-12"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-800 dark:to-pink-800 p-6">
                    {(() => {
                      const Icon = steps[currentStep].icon;
                      return Icon ? <Icon size={48} className="text-purple-600 dark:text-purple-300" strokeWidth={2} /> : null;
                    })()}
                  </div>

                  <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                    {steps[currentStep].title}
                  </h2>

                  <p className="mb-8 max-w-md text-lg text-gray-900 dark:text-white">
                    {steps[currentStep].description}
                  </p>

                  {/* Sample character preview */}
                  <div className="mb-8">
                    <AnimatedCharacter
                      theme="tulip"
                      stage={currentStep * 2}
                      colorPalette="pastel-pink"
                      size="large"
                      isAnimating={currentStep === 1}
                    />
                  </div>

                  {/* Progress dots */}
                  <div className="mb-6 flex gap-2">
                    {steps.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 w-2 rounded-full transition-all ${
                          index === currentStep
                            ? 'w-6 bg-purple-600'
                            : index < currentStep
                              ? 'bg-purple-400'
                              : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex w-full gap-3">
                    {currentStep > 0 && (
                      <Button variant="outline" onClick={handleBack} className="flex-1">
                        Back
                      </Button>
                    )}
                    <Button onClick={handleNext} className="flex-1">
                      {isLastInfoStep ? 'Choose Your Theme' : 'Next'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="theme-selection"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8 md:p-12"
              >
                <div className="flex flex-col items-center">
                  <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Choose Your Starter</h2>
                  <p className="mb-8 text-center text-gray-900 dark:text-white">
                    Select a theme for your first habit. You can use different themes for each habit!
                  </p>

                  <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                    {themes.map((theme, index) => (
                      <button
                        key={theme.type ?? `coming-soon-${index}`}
                        onClick={() => theme.type && setSelectedTheme(theme.type)}
                        disabled={theme.type === null}
                        className={`rounded-2xl border-2 p-4 transition-all ${
                          theme.type === null
                            ? 'border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed opacity-60'
                            : selectedTheme === theme.type
                              ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30 shadow-lg hover:scale-105'
                              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300 hover:scale-105'
                        }`}
                      >
                        <div className="mb-2 flex justify-center">
                          {theme.type ? (
                            <AnimatedCharacter
                              theme={theme.type}
                              stage={3}
                              colorPalette="pastel-green"
                              size="small"
                            />
                          ) : (
                            <div
                              className="flex items-center justify-center text-gray-400 dark:text-gray-500"
                              style={{ width: 60, height: 60 }}
                            >
                              <span className="text-2xl">?</span>
                            </div>
                          )}
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-900 dark:text-white">{theme.name}</div>
                          <div className="text-xs text-gray-900 dark:text-white">{theme.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mb-6 flex justify-center">
                    <AnimatedCharacter
                      theme={selectedTheme}
                      stage={4}
                      colorPalette="pastel-purple"
                      size="large"
                    />
                  </div>

                  <div className="flex w-full gap-3">
                    <Button variant="outline" onClick={handleBack} className="flex-1">
                      Back
                    </Button>
                    <Button
                      onClick={handleNext}
                      className="flex-1"
                      disabled={completeOnboarding.isPending}
                    >
                      {completeOnboarding.isPending ? 'Starting...' : "Let's Grow!"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
