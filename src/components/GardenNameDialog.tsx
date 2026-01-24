import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AnimatedCharacter } from '@/components/AnimatedCharacter';
import { Sparkles } from 'lucide-react';
import { userPrefsStorage } from '@/lib/storage';

interface GardenNameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

export function GardenNameDialog({ open, onOpenChange, onComplete }: GardenNameDialogProps) {
  const [gardenName, setGardenName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = gardenName.trim() || 'My Garden';
    userPrefsStorage.update({ gardenName: name });
    onComplete();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="text-purple-500" size={28} />
            <DialogTitle className="text-2xl">Name Your Garden</DialogTitle>
          </div>
          <DialogDescription className="text-center">
            What would you like to call your habit garden?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Flower preview */}
          <div className="flex justify-center mb-6">
            <div className="flex gap-3 items-end">
              <AnimatedCharacter theme="tulip" stage={4} colorPalette="pastel-pink" size="small" />
              <AnimatedCharacter theme="rose" stage={6} colorPalette="pastel-pink" size="medium" />
              <AnimatedCharacter theme="lily" stage={5} colorPalette="pastel-yellow" size="small" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="e.g., My Flower Garden, Zen Garden..."
              value={gardenName}
              onChange={(e) => setGardenName(e.target.value)}
              maxLength={30}
              className="text-center text-lg"
              autoFocus
            />

            <Button type="submit" className="w-full" size="lg">
              <Sparkles className="mr-2" size={18} />
              Start Growing
            </Button>
          </form>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3">
            You can change this later in settings
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
