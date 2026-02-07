import { WifiOff, RefreshCw, Cloud, CloudOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface OfflineScreenProps {
  onRetry?: () => void;
}

export function OfflineScreen({ onRetry }: OfflineScreenProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-slate-100 to-gray-200 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-xl">
        <div className="text-center">
          {/* Animated offline icon */}
          <div className="relative mb-6 flex justify-center">
            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              {/* Cloud with X */}
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center shadow-lg">
                <CloudOff className="w-12 h-12 md:w-16 md:h-16 text-gray-500 dark:text-gray-400" />
              </div>

              {/* WiFi off badge */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-2 -right-2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center border-4 border-white dark:border-gray-800"
              >
                <WifiOff className="w-5 h-5 md:w-6 md:h-6 text-red-500 dark:text-red-400" />
              </motion.div>
            </motion.div>
          </div>

          {/* Wilted flower illustration */}
          <div className="mb-6">
            <motion.div
              animate={{
                rotate: [-5, 5, -5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-block text-5xl md:text-6xl"
            >
              <span role="img" aria-label="wilted flower">🥀</span>
            </motion.div>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">
            You're Offline
          </h1>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 mb-2 text-sm md:text-base">
            Your garden needs sunshine to grow!
          </p>
          <p className="text-gray-500 dark:text-gray-500 mb-8 text-sm">
            Please check your internet connection and try again.
          </p>

          {/* Retry button */}
          <Button
            onClick={handleRetry}
            size="lg"
            className="gap-2 w-full sm:w-auto px-8"
          >
            <RefreshCw size={20} />
            Try Again
          </Button>

          {/* Additional info for mobile */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500">
              <Cloud size={14} />
              <span>Your habits are saved locally</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
