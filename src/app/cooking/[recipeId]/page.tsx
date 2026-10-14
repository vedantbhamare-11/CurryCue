"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Recipe } from '@/types';
import { useRecipeStore } from '@/store/recipe-store';
import { CookingMode } from '@/components/cooking-mode';
export default function CookingModePage() {
  const params = useParams();
  const router = useRouter();
  const recipeId = params.recipeId as string;
  const {
    favoriteRecipes,
    recentRecipes,
    suggestedRecipes
  } = useRecipeStore();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Find the recipe from all available sources
    const allRecipes = [...favoriteRecipes, ...recentRecipes, ...suggestedRecipes];
    const uniqueRecipes = allRecipes.filter((recipe, index, self) => index === self.findIndex(r => r.id === recipe.id));
    const foundRecipe = uniqueRecipes.find(r => r.id === recipeId);
    if (foundRecipe) {
      setRecipe(foundRecipe);
    }
    setLoading(false);
  }, [recipeId, favoriteRecipes, recentRecipes, suggestedRecipes]);
  const handleClose = () => {
    router.back();
  };
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading cooking mode...</p>
        </div>
      </div>;
  }
  if (!recipe) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="bg-card border border-border rounded-lg p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Recipe Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn&apos;t find the recipe you&apos;re looking for. It may have been deleted or is no longer available.
          </p>
          <button onClick={() => router.push('/recipes')} className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
            Browse Recipes
          </button>
        </div>
      </div>;
  }
  return <CookingMode recipe={recipe} onClose={handleClose} />;
}