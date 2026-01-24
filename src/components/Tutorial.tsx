import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AnimatedCharacter } from '@/components/AnimatedCharacter';
import { X, ChevronRight, ChevronLeft, Sparkles, Target, TrendingUp, Check } from 'lucide-react';
import { userPrefsStorage } from '@/lib/storage';

interface TutorialProps {
  onComplete: () => void;
}

const tutorialSteps = [
  {
    title: 'Welcome to Habit Garden!',
    description: 'Transform your habits into beautiful growing flowers',
    icon: Sparkles,
    content: (
      <div className="flex flex-col items-center gap-4">
        <p className="text-center text-gray-900 dark:text-white">
          Each habit you create becomes a living flower that grows as you complete it daily!
        </p>
        <div className="flex gap-4 items-end">
          <div className="flex flex-col items-center">
            <AnimatedCharacter theme="rose" stage={0} colorPalette="pastel-pink" size="small" />
            <span className="text-xs text-gray-900 dark:text-white mt-1">Day 1</span>
          </div>
          <div className="flex flex-col items-center">
            <AnimatedCharacter theme="rose" stage={3} colorPalette="pastel-pink" size="small" />
            <span className="text-xs text-gray-900 dark:text-white mt-1">Week 1</span>
          </div>
          <div className="flex flex-col items-center">
            <AnimatedCharacter theme="rose" stage={6} colorPalette="pastel-pink" size="medium" />
            <span className="text-xs text-gray-900 dark:text-white mt-1">Month 1</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Complete Daily, Grow Your Flower',
    description: 'Each completion helps your flower grow',
    icon: Target,
    content: (
      <div className="flex flex-col items-center gap-4">
        <p className="text-center text-gray-900 dark:text-white">
          Tap the "Complete" button each time you finish your habit to help your flower grow!
        </p>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-800/30 dark:to-pink-800/30 p-6 rounded-lg">
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-300">Complete daily</div>
            <div className="text-sm text-gray-900 dark:text-white">Watch your flower bloom</div>
            <div className="text-lg font-semibold text-pink-600 dark:text-pink-300">Build streaks</div>
            <div className="text-sm text-gray-900 dark:text-white">Keep your flower healthy!</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Build Streaks',
    description: 'Consecutive days = healthy flowers',
    icon: TrendingUp,
    content: (
      <div className="flex flex-col items-center gap-4">
        <p className="text-center text-gray-900 dark:text-white">
          Complete your habit multiple days in a row to build a streak and keep your flower healthy!
        </p>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-orange-50 dark:bg-orange-900/30 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="text-2xl">🔥</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">1 Day</div>
            <div className="text-xs text-gray-900 dark:text-white">Started!</div>
          </div>
          <div className="bg-orange-100 dark:bg-orange-900/50 p-3 rounded-lg border-2 border-orange-300 dark:border-orange-700">
            <div className="text-2xl">🔥🔥</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">3 Days</div>
            <div className="text-xs text-gray-900 dark:text-white">Growing!</div>
          </div>
          <div className="bg-orange-200 dark:bg-orange-900/70 p-3 rounded-lg border-2 border-orange-400 dark:border-orange-600">
            <div className="text-2xl">🔥🔥🔥</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">7 Days</div>
            <div className="text-xs text-gray-900 dark:text-white">Thriving!</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Choose Your Flowers',
    description: 'All flower types are free to use!',
    icon: Sparkles,
    content: (
      <div className="flex flex-col items-center gap-4">
        <p className="text-center text-gray-900 dark:text-white">
          Choose from beautiful tulips, roses, and lilies to represent your habits!
        </p>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-pink-50 dark:bg-pink-900/30 p-3 rounded-lg border border-pink-200 dark:border-pink-800">
            <div className="flex flex-col items-center">
              <AnimatedCharacter theme="tulip" stage={4} colorPalette="pastel-pink" size="small" />
              <span className="text-sm font-medium mt-1 text-gray-900 dark:text-white">Tulip</span>
              <span className="text-xs text-pink-600 dark:text-pink-400">Free</span>
            </div>
          </div>
          <div className="bg-rose-50 dark:bg-rose-900/30 p-3 rounded-lg border border-rose-200 dark:border-rose-800">
            <div className="flex flex-col items-center">
              <AnimatedCharacter theme="rose" stage={4} colorPalette="pastel-pink" size="small" />
              <span className="text-sm font-medium mt-1 text-gray-900 dark:text-white">Rose</span>
              <span className="text-xs text-rose-600 dark:text-rose-400">Free</span>
            </div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex flex-col items-center">
              <AnimatedCharacter theme="lily" stage={4} colorPalette="pastel-yellow" size="small" />
              <span className="text-sm font-medium mt-1 text-gray-900 dark:text-white">Lily</span>
              <span className="text-xs text-amber-600 dark:text-amber-400">Free</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "You're All Set!",
    description: 'Ready to start growing your habits?',
    icon: Check,
    content: (
      <div className="flex flex-col items-center gap-4">
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-800 dark:to-pink-800 p-6 rounded-full">
          <AnimatedCharacter theme="rose" stage={6} colorPalette="pastel-pink" size="large" isAnimating />
        </div>
        <p className="text-center text-gray-900 dark:text-white max-w-md">
          Create your first habit and watch it bloom! Remember: consistency is key to growth.
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800 w-full">
          <div className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-2">Quick Tips:</div>
          <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Complete habits daily for best results</li>
            <li>• Build streaks to keep flowers healthy</li>
            <li>• Free plan: 10 habits/month, limited flower types</li>
            <li>• Premium: Unlimited habits, all flower types</li>
          </ul>
        </div>
      </div>
    ),
  },
];

export function Tutorial({ onComplete }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    userPrefsStorage.update({ hasCompletedTutorial: true });
    onComplete();
  };

  const step = tutorialSteps[currentStep];
  const Icon = step.icon;
  const isLastStep = currentStep === tutorialSteps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 shadow-2xl">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-800 dark:to-pink-800 p-3">
                  <Icon size={28} className="text-purple-600 dark:text-purple-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{step.title}</h2>
                  <p className="text-sm text-gray-900 dark:text-white">{step.description}</p>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleSkip} className="shrink-0">
              <X size={20} />
            </Button>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              {step.content}
            </motion.div>
          </AnimatePresence>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-6">
            {tutorialSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-purple-600'
                    : index < currentStep
                      ? 'w-2 bg-purple-400'
                      : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handleBack} className="flex-1">
                <ChevronLeft size={16} className="mr-1" />
                Back
              </Button>
            )}
            <Button onClick={handleNext} className="flex-1">
              {isLastStep ? (
                <>
                  <Check size={16} className="mr-1" />
                  Get Started
                </>
              ) : (
                <>
                  Next
                  <ChevronRight size={16} className="ml-1" />
                </>
              )}
            </Button>
          </div>

          {!isLastStep && (
            <button
              onClick={handleSkip}
              className="w-full mt-3 text-sm text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Skip tutorial
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}
