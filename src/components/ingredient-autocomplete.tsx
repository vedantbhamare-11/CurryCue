"use client";

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { searchCatalogue, type IngredientSuggestion } from '@/lib/ingredient-catalogue';
import { cn } from '@/lib/utils';

interface IngredientAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  // A suggestion was chosen (click, or arrow keys + Enter)
  onSelect: (suggestion: IngredientSuggestion) => void;
  // "Add <what was typed> as custom ingredient": the dropdown row, and Enter when nothing is highlighted
  onAddTyped: () => void;
  // false inside a <form> that handles Enter itself: Enter with nothing highlighted then submits the form
  enterAddsTyped?: boolean;
  placeholder: string;
  ariaLabel?: string;
  inputClassName: string;
  // Icons and buttons positioned over the input (the wrapper is `relative`)
  children?: React.ReactNode;
}

// The ingredient name box with suggestions, shared by the pantry and the shopping list
export function IngredientAutocomplete({
  value,
  onChange,
  onSelect,
  onAddTyped,
  enterAddsTyped = true,
  placeholder,
  ariaLabel,
  inputClassName,
  children,
}: IngredientAutocompleteProps) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => (value.length >= 2 ? searchCatalogue(value) : []), [value]);
  const showing = open && suggestions.length > 0;

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!dropdownRef.current?.contains(target) && !inputRef.current?.contains(target)) {
        setOpen(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  const close = () => {
    setOpen(false);
    setSelectedIndex(-1);
  };

  const choose = (suggestion: IngredientSuggestion) => {
    onSelect(suggestion);
    close();
    inputRef.current?.focus();
  };

  const addTyped = () => {
    onAddTyped();
    close();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !showing) {
      // No suggestions on screen: Enter adds what was typed (or lets the surrounding form do it)
      if (enterAddsTyped && value.trim()) {
        event.preventDefault();
        addTyped();
      }
      return;
    }
    if (!showing) return;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex((previous) => (previous < suggestions.length - 1 ? previous + 1 : 0));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex((previous) => (previous > 0 ? previous - 1 : suggestions.length - 1));
        break;
      case 'Enter':
        if (selectedIndex >= 0) {
          event.preventDefault();
          choose(suggestions[selectedIndex]);
        } else if (enterAddsTyped && value.trim()) {
          event.preventDefault();
          addTyped();
        } else {
          close(); // the form submits; the list should not stay open over the result
        }
        break;
      case 'Escape':
        close();
        break;
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={showing}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-label={ariaLabel}
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            setOpen(true);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className={inputClassName}
        />
        {children}
      </div>

      <AnimatePresence>
        {showing && (
          <motion.div
            ref={dropdownRef}
            id={listId}
            role="listbox"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <button
                type="button"
                role="option"
                aria-selected={selectedIndex === index}
                key={`${suggestion.name}-${suggestion.quantity}-${suggestion.unit}`}
                onClick={() => choose(suggestion)}
                className={cn(
                  "w-full text-left px-4 py-3 hover:bg-muted transition-colors flex items-center justify-between border-b border-border last:border-b-0",
                  selectedIndex === index && "bg-primary/10 border-primary/20"
                )}
              >
                <span className="font-medium">{suggestion.displayText}</span>
                <Plus className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}

            {value.trim() && (
              <button
                type="button"
                onClick={addTyped}
                className="w-full text-left px-4 py-3 hover:bg-muted transition-colors flex items-center justify-between border-t border-border"
              >
                <span className="text-muted-foreground">Add &quot;{value}&quot; as custom ingredient</span>
                <Plus className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
