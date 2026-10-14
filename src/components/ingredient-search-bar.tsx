"use client";

import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { useIngredientStore } from '@/store/ingredient-store';
import { IngredientAutocomplete } from '@/components/ingredient-autocomplete';
import type { IngredientSuggestion } from '@/lib/ingredient-catalogue';
import { toast } from 'sonner';

export function IngredientSearchBar() {
  const { addIngredient } = useIngredientStore();
  const [query, setQuery] = useState('');

  // Adding something you already have adds to its amount instead of duplicating it; say so
  const notifyIfMerged = (result: { merged: boolean; mergedInto?: string }) => {
    if (result.merged) toast.info(`You already have ${result.mergedInto}, so the amount was added to it`);
  };

  const handleSelectSuggestion = (suggestion: IngredientSuggestion) => {
    notifyIfMerged(
      addIngredient({
        id: `search-${Date.now()}-${Math.random()}`,
        name: suggestion.name,
        quantity: suggestion.quantity,
        unit: suggestion.unit,
      })
    );
    setQuery('');
  };

  const handleAddCustomIngredient = () => {
    if (!query.trim()) return;
    notifyIfMerged(addIngredient({ id: `custom-${Date.now()}-${Math.random()}`, name: query.trim() }));
    setQuery('');
  };

  return (
    <IngredientAutocomplete
      value={query}
      onChange={setQuery}
      onSelect={handleSelectSuggestion}
      onAddTyped={handleAddCustomIngredient}
      placeholder="Search ingredients (e.g., tomato, onion)..."
      inputClassName="w-full pl-10 pr-12 py-3 rounded-lg bg-input-background border border-border outline-none focus:ring-2 focus:ring-primary/20 text-base"
    >
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      {query.trim() && (
        <button
          type="button"
          onClick={handleAddCustomIngredient}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          title="Add custom ingredient"
          aria-label="Add custom ingredient"
        >
          <Plus className="w-4 h-4" />
        </button>
      )}
    </IngredientAutocomplete>
  );
}
