import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Recipe } from '@/types';
import { stripStepLabel } from '@/lib/utils';

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
      // isLoading is transient: persisting it left the UI stuck on "Generating..." forever
      // whenever a request was interrupted (tab closed mid-generation, crash, etc.)
      partialize: ({ suggestedRecipes, favoriteRecipes, recentRecipes }) => ({
        suggestedRecipes,
        favoriteRecipes,
        recentRecipes,
      }),
      // Also ignore a stale isLoading already saved in users' localStorage by the old version
      merge: (persisted, current) => {
        const saved = persisted as Partial<RecipeState>;
        // Recipes saved before the prompt fix have "Step 1:" baked into their step text
        const cleanSteps = (recipes?: Recipe[]) =>
          recipes?.map((recipe) => ({ ...recipe, steps: (recipe.steps ?? []).map(stripStepLabel).filter(Boolean) }));
        return {
          ...current,
          ...saved,
          suggestedRecipes: cleanSteps(saved.suggestedRecipes) ?? current.suggestedRecipes,
          favoriteRecipes: cleanSteps(saved.favoriteRecipes) ?? current.favoriteRecipes,
          recentRecipes: cleanSteps(saved.recentRecipes) ?? current.recentRecipes,
          isLoading: false,
        };
      },
    }
  )
);
