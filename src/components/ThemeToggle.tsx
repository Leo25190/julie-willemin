import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [rotating, setRotating] = useState(false);

  // initialisation au chargement
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const activeDark = stored === 'dark' || (!stored && prefersDark);
    setIsDark(activeDark);
    document.documentElement.classList.toggle('dark', activeDark);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setRotating(true);

    // changer le thème au milieu de l’animation
    setTimeout(() => {
      setIsDark(newDark);
      document.documentElement.classList.toggle('dark', newDark);
      localStorage.setItem('theme', newDark ? 'dark' : 'light');
    }, 250);

    // arrêter l’animation après 500ms
    setTimeout(() => {
      setRotating(false);
    }, 500);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 transition-colors duration-300"
      aria-label="Changer le thème"
    >
      <motion.div
        animate={{ rotate: rotating ? 180 : 0 }}
        transition={{ duration: 0.5 }}
        className="w-6 h-6"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="sun"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Sun className="w-6 h-6 text-yellow-400" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Moon className="w-6 h-6 text-gray-800" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  );
}
