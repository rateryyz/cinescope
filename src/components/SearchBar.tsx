import { Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery(''); // Clear the query after navigation
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="relative w-full"
      initial={false}
      animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Search for movies..."
        aria-label="Search for movies"
        className="w-full h-10 pl-10 pr-4 rounded-lg bg-muted text-foreground placeholder:text-muted-foreground border border-input focus:border-ring focus:ring-1 focus:ring-ring transition-all duration-200"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md bg-transparent hover:bg-muted-foreground/10 transition-colors"
        aria-label="Submit search"
      >
        <Search className="w-4 h-4 text-muted-foreground" />
      </button>
    </motion.form>
  );
}
