import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AnimatedCharacter } from '@/components/AnimatedCharacter';
import { Check, Crown, Sparkles, Zap, Infinity as InfinityIcon, Star, FlaskConical } from 'lucide-react';
import { FREE_HABIT_LIMIT_PER_MONTH } from '@/types/habit';
import { useUserPreferences, useUnlockPremium } from '@/hooks/useUserPreferences';
import { PRICING_INFO, startCheckout, type PricingPlan } from '@/lib/stripe';

interface PremiumDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const premiumFeatures = [
  { icon: InfinityIcon, text: 'Unlimited habit creation', highlight: true },
  { icon: Sparkles, text: 'Exclusive color palettes', highlight: true },
  { icon: Zap, text: 'Advanced statistics & insights' },
  { icon: Check, text: 'Priority support' },
];

const flowerShowcase = [
  { type: 'tulip' as const, name: 'Tulip', stage: 5 },
  { type: 'rose' as const, name: 'Rose', stage: 6 },
  { type: 'lily' as const, name: 'Lily', stage: 6 },
];

export function PremiumDialog({ open, onOpenChange }: PremiumDialogProps) {
  const { data: userPrefs } = useUserPreferences();
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan>('yearly');
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const unlockPremium = useUnlockPremium();

  const handleCheckout = (plan: PricingPlan) => {
    startCheckout(plan);
  };

  const handleTryDemo = async () => {
    setIsDemoLoading(true);
    await unlockPremium.mutateAsync(selectedPlan);
    setIsDemoLoading(false);
    onOpenChange(false);
  };

  // If user already has premium and lifetime plan, don't show dialog at all
  if (userPrefs?.isPremium && userPrefs?.premiumPlan === 'onetime') {
    return null;
  }

  // Show dialog even if user has premium (to allow upgrade from monthly/yearly to lifetime)
  const isPremium = userPrefs?.isPremium ?? false;
  const currentPlan = userPrefs?.premiumPlan;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[700px] p-4 sm:p-6">
        <DialogHeader>
          <div className="flex items-center justify-center gap-2 mb-1 sm:mb-2">
            <Crown className="text-yellow-500" size={24} />
            <DialogTitle className="text-xl sm:text-3xl">Upgrade to Premium</DialogTitle>
          </div>
          <DialogDescription className="text-center text-sm sm:text-base">
            Unlock unlimited habits and exclusive features
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 py-2 sm:py-4">
          {/* Flower Showcase - Hidden on mobile to save space */}
          <div className="hidden sm:block">
            <h3 className="text-lg font-semibold mb-3 text-center text-gray-900 dark:text-white">Grow Beautiful Flowers</h3>
            <div className="grid grid-cols-3 gap-4">
              {flowerShowcase.map((flower, index) => (
                <motion.div
                  key={flower.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-4 border-2 border-green-200 dark:border-green-700 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30">
                    <div className="flex flex-col items-center">
                      <AnimatedCharacter
                        theme={flower.type}
                        stage={flower.stage}
                        colorPalette="pastel-green"
                        size="medium"
                      />
                      <div className="text-center mt-2">
                        <div className="font-semibold text-gray-900 dark:text-white">{flower.name}</div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Pricing Plans */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-center text-gray-900 dark:text-white">Choose Your Plan</h3>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
              {PRICING_INFO.map((pricing) => {
                const isCurrentPlan = currentPlan === pricing.plan;
                const isSelected = selectedPlan === pricing.plan;

                return (
                  <Card
                    key={pricing.plan}
                    onClick={() => setSelectedPlan(pricing.plan)}
                    className={`p-2 sm:p-4 cursor-pointer transition-all relative ${
                      isCurrentPlan
                        ? 'border-2 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30'
                        : isSelected
                        ? 'border-2 border-yellow-500 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30'
                        : 'border border-gray-200 dark:border-gray-700 hover:border-yellow-300'
                    }`}
                  >
                    {isCurrentPlan && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                        <span className="bg-green-500 text-white text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-0.5 sm:gap-1 whitespace-nowrap">
                          <Check size={8} fill="currentColor" className="sm:w-2.5 sm:h-2.5" /> Selected
                        </span>
                      </div>
                    )}
                    {!isCurrentPlan && pricing.popular && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                        <span className="bg-yellow-500 text-white text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-0.5 sm:gap-1 whitespace-nowrap">
                          <Star size={8} fill="currentColor" className="sm:w-2.5 sm:h-2.5" /> Popular
                        </span>
                      </div>
                    )}
                    <div className="text-center pt-1 sm:pt-2">
                      <div className="text-xs sm:text-base font-semibold text-gray-900 dark:text-white">{pricing.label}</div>
                      <div className="mt-1 sm:mt-2">
                        <span className="text-base sm:text-2xl font-bold text-gray-900 dark:text-white">{pricing.price}</span>
                        <span className="text-[10px] sm:text-sm text-gray-500 dark:text-gray-400 block sm:inline">{pricing.period}</span>
                      </div>
                      {pricing.savings && (
                        <div className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs font-medium text-green-600 dark:text-green-400">
                          {pricing.savings}
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Free vs Premium Comparison - Compact on mobile */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <Card className="p-2 sm:p-4 bg-gray-50 dark:bg-gray-800">
              <h4 className="text-xs sm:text-base font-semibold text-center mb-2 sm:mb-3 text-gray-900 dark:text-white">Free Plan</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                <li className="flex items-start gap-1 sm:gap-2">
                  <span className="text-gray-400 dark:text-gray-500">✓</span>
                  <span className="text-gray-900 dark:text-white">Limited flowers</span>
                </li>
                <li className="flex items-start gap-1 sm:gap-2">
                  <span className="text-gray-400 dark:text-gray-500">✓</span>
                  <span className="text-gray-900 dark:text-white">{FREE_HABIT_LIMIT_PER_MONTH} habits/mo</span>
                </li>
                <li className="flex items-start gap-1 sm:gap-2">
                  <span className="text-gray-400 dark:text-gray-500">✓</span>
                  <span className="text-gray-900 dark:text-white">Basic colors</span>
                </li>
              </ul>
            </Card>

            <Card className="p-2 sm:p-4 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 border-2 border-yellow-300 dark:border-yellow-700">
              <div className="flex items-center justify-center gap-1 mb-2 sm:mb-3">
                <Crown className="text-yellow-600 dark:text-yellow-400" size={14} />
                <h4 className="text-xs sm:text-base font-semibold text-center text-gray-900 dark:text-white">Premium</h4>
              </div>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                <li className="flex items-start gap-1 sm:gap-2">
                  <Check className="text-yellow-600 dark:text-yellow-400 shrink-0" size={12} />
                  <span className="font-medium text-gray-900 dark:text-white">Unlimited</span>
                </li>
                <li className="flex items-start gap-1 sm:gap-2">
                  <Check className="text-yellow-600 dark:text-yellow-400 shrink-0" size={12} />
                  <span className="font-medium text-gray-900 dark:text-white">All colors</span>
                </li>
                <li className="flex items-start gap-1 sm:gap-2">
                  <Check className="text-yellow-600 dark:text-yellow-400 shrink-0" size={12} />
                  <span className="font-medium text-gray-900 dark:text-white">All features</span>
                </li>
                <li className="flex items-start gap-1 sm:gap-2">
                  <Check className="text-yellow-600 dark:text-yellow-400 shrink-0" size={12} />
                  <span className="font-medium text-gray-900 dark:text-white">No Ads</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Feature List - Hidden on mobile to save space */}
          <div className="hidden sm:block">
            <h4 className="font-semibold text-center mb-3 text-gray-900 dark:text-white">Everything Premium Includes</h4>
            <div className="grid gap-2">
              {premiumFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    feature.highlight
                      ? 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 border border-yellow-200 dark:border-yellow-700'
                      : 'bg-gray-50 dark:bg-gray-800'
                  }`}
                >
                  <div className={`rounded-full p-2 ${feature.highlight ? 'bg-yellow-100 dark:bg-yellow-900/50' : 'bg-white dark:bg-gray-700'}`}>
                    <feature.icon
                      size={20}
                      className={feature.highlight ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-600 dark:text-gray-300'}
                    />
                  </div>
                  <span className={`font-medium ${feature.highlight ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Upgrade Button */}
          <div className="pt-2 sm:pt-4 space-y-2 sm:space-y-3">
            <Button
              onClick={() => handleCheckout(selectedPlan)}
              size="lg"
              className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-semibold text-sm sm:text-lg py-4 sm:py-6"
            >
              <Crown className="mr-1 sm:mr-2" size={18} />
              Subscribe - {PRICING_INFO.find(p => p.plan === selectedPlan)?.price}
              {PRICING_INFO.find(p => p.plan === selectedPlan)?.period}
            </Button>

            <p className="text-center text-[10px] sm:text-xs text-gray-900 dark:text-white">
              Secure payment powered by Stripe. Cancel anytime.
            </p>

            
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
