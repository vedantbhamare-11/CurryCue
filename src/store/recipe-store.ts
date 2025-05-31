import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Recipe } from '@/types';

interface RecipeState {
  suggestedRecipes: Recipe[];
  favoriteRecipes: Recipe[];
  recentRecipes: Recipe[];
  isLoading: boolean;
  setSuggestedRecipes: (recipes: Recipe[]) => void;
  addFavoriteRecipe: (recipe: Recipe) => void;
  removeFavoriteRecipe: (id: string) => void;
  addRecentRecipe: (recipe: Recipe) => void;
  setIsLoading: (isLoading: boolean) => void;
  clearSuggestedRecipes: () => void;
}

export const useRecipeStore = create<RecipeState>()(
  persist(
    (set) => ({
      suggestedRecipes: [],
      favoriteRecipes: [],
      recentRecipes: [],
      isLoading: false,
      setSuggestedRecipes: (recipes) => 
        set({ suggestedRecipes: recipes }),
      addFavoriteRecipe: (recipe) => 
        set((state) => {
          if (state.favoriteRecipes.some(r => r.id === recipe.id)) {
            return state;
          }
          return { favoriteRecipes: [recipe, ...state.favoriteRecipes] };
        }),
      removeFavoriteRecipe: (id) => 
        set((state) => ({ 
          favoriteRecipes: state.favoriteRecipes.filter(r => r.id !== id) 
        })),
      addRecentRecipe: (recipe) => 
        set((state) => {
          const filteredRecent = state.recentRecipes.filter(r => r.id !== recipe.id);
          return { recentRecipes: [recipe, ...filteredRecent].slice(0, 10) };
        }),
      setIsLoading: (isLoading) => 
        set({ isLoading }),
      clearSuggestedRecipes: () => 
        set({ suggestedRecipes: [] }),
    }),
    {
      name: 'recipe-storage',
    }
  )
);
