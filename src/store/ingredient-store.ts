import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Ingredient } from '@/types';

interface IngredientState {
  ingredients: Ingredient[];
  addIngredient: (ingredient: Ingredient) => void;
  removeIngredient: (id: string) => void;
  updateIngredient: (id: string, updates: Partial<Ingredient>) => void;
  clearIngredients: () => void;
}

// Older versions seeded every new user's pantry with these three sample items. They were never
// the user's own, so a one-time migration removes them. Only exact matches go: real ingredients get
// timestamp ids, and an edited sample item (different name) is kept.
const LEGACY_SAMPLE_ITEMS: Record<string, string> = {
  '1': 'Chicken breast',
  '2': 'Onion',
  '3': 'Bell pepper'
};

export const useIngredientStore = create<IngredientState>()(
  persist(
    (set) => ({
      ingredients: [],
      addIngredient: (ingredient) => 
        set((state) => ({ ingredients: [...state.ingredients, ingredient] })),
      removeIngredient: (id) => 
        set((state) => ({ ingredients: state.ingredients.filter((i) => i.id !== id) })),
      updateIngredient: (id, updates) => 
        set((state) => ({
          ingredients: state.ingredients.map((i) => 
            i.id === id ? { ...i, ...updates } : i
          ),
        })),
      clearIngredients: () => set({ ingredients: [] }),
    }),
    {
      name: 'ingredient-storage',
      version: 1,
      migrate: (persisted, version) => {
        const state = persisted as { ingredients?: Ingredient[] };
        if (version < 1 && Array.isArray(state?.ingredients)) {
          return {
            ...state,
            ingredients: state.ingredients.filter((i) => LEGACY_SAMPLE_ITEMS[i.id] !== i.name)
          };
        }
        return state;
      },
    }
  )
);
