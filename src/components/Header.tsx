import { Moon, Sun, Film } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SearchBar from './SearchBar';
import { useTheme } from '../hooks/useTheme';

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-xl border-border"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-2xl font-bold text-foreground"
          >
            <Film className="w-8 h-8 text-primary" />
            <span>CineScope</span>
          </Link>

          <div className="flex-1 max-w-2xl mx-8">
            <SearchBar />
          </div>

          <div className="flex items-center gap-6">
            <Link
              to="/favorites"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Favorites
            </Link>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-accent transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-foreground" />
              ) : (
                <Moon className="w-5 h-5 text-foreground" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}