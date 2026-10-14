import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Recipe } from '@/types';
import { stripStepLabel } from '@/lib/utils';
import { normalizeDifficulty } from '@/lib/recipe-fields';

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
  // A photo arrives after the recipe is shown, so it is attached to every saved copy of that recipe
  setRecipePhoto: (id: string, image: string, imageCredit: Recipe['imageCredit']) => void;
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
      setRecipePhoto: (id, image, imageCredit) =>
        set((state) => {
          const attach = (recipes: Recipe[]) => recipes.map((recipe) => (recipe.id === id ? { ...recipe, image, imageCredit } : recipe));
          return { suggestedRecipes: attach(state.suggestedRecipes), favoriteRecipes: attach(state.favoriteRecipes), recentRecipes: attach(state.recentRecipes) };
        }),
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
        // Recipes saved by older versions may have "Step 1:" baked into their step text, or a difficulty
        // like "intermediate" that the UI does not know. Both are repaired on load (idempotent).
        const cleanSteps = (recipes?: Recipe[]) =>
          recipes?.map((recipe) => ({
            ...recipe,
            steps: (recipe.steps ?? []).map(stripStepLabel).filter(Boolean),
            difficulty: normalizeDifficulty(recipe.difficulty) ?? 'medium',
          }));
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
