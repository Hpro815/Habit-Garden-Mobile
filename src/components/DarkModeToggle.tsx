import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { userPrefsStorage } from '@/lib/storage';
import { useEffect } from 'react';

export function DarkModeToggle() {
  const { data: userPrefs } = useUserPreferences();
  const isDark = userPrefs?.darkMode ?? false;

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    userPrefsStorage.update({ darkMode: !isDark });
    window.location.reload();
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleDarkMode}
      className="fixed bottom-4 right-4 z-40 h-12 w-12 rounded-full shadow-lg border-2 bg-white dark:bg-gray-800 hover:scale-110 transition-transform"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-yellow-500" />
      ) : (
        <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      )}
    </Button>
  );
}
