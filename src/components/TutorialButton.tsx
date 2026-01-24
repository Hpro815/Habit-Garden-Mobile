import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TutorialButtonProps {
  onClick: () => void;
}

export function TutorialButton({ onClick }: TutorialButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      className="fixed bottom-4 right-20 z-40 h-12 w-12 rounded-full shadow-lg border-2 bg-white dark:bg-gray-800 hover:scale-110 transition-transform"
      title="Show Tutorial"
    >
      <HelpCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
    </Button>
  );
}
