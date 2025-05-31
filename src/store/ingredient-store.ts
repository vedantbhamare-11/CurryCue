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

// Sample initial ingredients
const initialIngredients: Ingredient[] = [
  {
    id: '1',
    name: 'Chicken breast',
    quantity: '2',
    unit: 'pieces'
  },
  {
    id: '2',
    name: 'Onion',
    quantity: '1',
    unit: 'medium'
  },
  {
    id: '3',
    name: 'Bell pepper',
    quantity: '1',
    unit: 'medium'
  }
];

export const useIngredientStore = create<IngredientState>()(
  persist(
    (set) => ({
      ingredients: initialIngredients,
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
    }
  )
);
