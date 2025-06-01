"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus } from 'lucide-react';
import { useIngredientStore } from '@/store/ingredient-store';
import { useIngredientOptionsStore } from '@/store/ingredient-options-store';
import { cn } from '@/lib/utils';

interface IngredientSuggestion {
  name: string;
  quantity: string;
  unit: string;
  displayText: string;
}

export function IngredientSearchBar() {
  const { addIngredient } = useIngredientStore();
  const { ingredientOptions } = useIngredientOptionsStore();

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<IngredientSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on query
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = ingredientOptions
      .filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
      .flatMap((item) =>
        item.suggestions.map((suggestion) => ({
          name: item.name,
          quantity: suggestion.quantity,
          unit: suggestion.unit,
          displayText: suggestion.displayText,
        }))
      )
      .slice(0, 8);

    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
    setSelectedIndex(-1);
  }, [query, ingredientOptions]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        } else if (query.trim()) {
          handleAddCustomIngredient();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelectSuggestion = (suggestion: IngredientSuggestion) => {
    const newIngredient = {
      id: `search-${Date.now()}-${Math.random()}`,
      name: suggestion.name,
      quantity: suggestion.quantity,
      unit: suggestion.unit,
    };
    addIngredient(newIngredient);
    setQuery('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleAddCustomIngredient = () => {
    const newIngredient = {
      id: `custom-${Date.now()}-${Math.random()}`,
      name: query.trim(),
    };
    addIngredient(newIngredient);
    setQuery('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() =>
            query.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)
          }
          placeholder="Search ingredients (e.g., tomato, onion)..."
          className="w-full pl-10 pr-12 py-3 rounded-lg bg-input-background border border-border outline-none focus:ring-2 focus:ring-primary/20 text-base"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        {query.trim() && (
          <button
            onClick={handleAddCustomIngredient}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            title="Add custom ingredient"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.name}-${suggestion.quantity}-${suggestion.unit}`}
                onClick={() => handleSelectSuggestion(suggestion)}
                className={cn(
                  "w-full text-left px-4 py-3 hover:bg-muted transition-colors flex items-center justify-between border-b border-border last:border-b-0",
                  selectedIndex === index && "bg-primary/10 border-primary/20"
                )}
              >
                <span className="font-medium">{suggestion.displayText}</span>
                <Plus className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}

            {query.trim() && (
              <button
                onClick={handleAddCustomIngredient}
                className={cn(
                  "w-full text-left px-4 py-3 hover:bg-muted transition-colors flex items-center justify-between border-t border-border",
                  selectedIndex === suggestions.length && "bg-primary/10 border-primary/20"
                )}
              >
                <span className="text-muted-foreground">
                  Add "{query}" as custom ingredient
                </span>
                <Plus className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
