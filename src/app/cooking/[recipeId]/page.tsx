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
    return <div className="min-h-screen flex items-center justify-center" data-unique-id="5184d654-bff6-4598-aea1-c06398dcb5c9" data-file-name="app/cooking/[recipeId]/page.tsx">
        <div className="flex flex-col items-center gap-4" data-unique-id="06451e67-b64f-4c7c-8f01-1c4caa6e92e4" data-file-name="app/cooking/[recipeId]/page.tsx">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground" data-unique-id="1a0cb6f7-e381-4fa5-b736-7be4392f8d09" data-file-name="app/cooking/[recipeId]/page.tsx"><span className="editable-text" data-unique-id="a6326f79-2e52-4a88-a910-0b1023f5edb1" data-file-name="app/cooking/[recipeId]/page.tsx">Loading cooking mode...</span></p>
        </div>
      </div>;
  }
  if (!recipe) {
    return <div className="min-h-screen flex items-center justify-center" data-unique-id="5c2038b4-ac6c-4133-8fc0-f3cd670580d1" data-file-name="app/cooking/[recipeId]/page.tsx">
        <div className="bg-card border border-border rounded-lg p-8 max-w-md text-center" data-unique-id="d8d41cff-64a9-43eb-b178-79b2c8224180" data-file-name="app/cooking/[recipeId]/page.tsx">
          <h1 className="text-2xl font-bold mb-4" data-unique-id="1697412d-f372-4aec-80df-bfbc2617c32e" data-file-name="app/cooking/[recipeId]/page.tsx"><span className="editable-text" data-unique-id="996f8c9f-f48d-423d-a3fa-18094661e155" data-file-name="app/cooking/[recipeId]/page.tsx">Recipe Not Found</span></h1>
          <p className="text-muted-foreground mb-6" data-unique-id="07bfa918-16e0-4f6f-95f1-56b9dc66444f" data-file-name="app/cooking/[recipeId]/page.tsx"><span className="editable-text" data-unique-id="b7843584-f1fb-4508-a768-83d1eec240f6" data-file-name="app/cooking/[recipeId]/page.tsx">
            We couldn't find the recipe you're looking for. It may have been deleted or is no longer available.
          </span></p>
          <button onClick={() => router.push('/recipes')} className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors" data-unique-id="cce951b1-04d2-488b-89d1-e3fae050f815" data-file-name="app/cooking/[recipeId]/page.tsx"><span className="editable-text" data-unique-id="0b57a0a1-2420-4622-bf9d-f28dd493a0be" data-file-name="app/cooking/[recipeId]/page.tsx">
            Browse Recipes
          </span></button>
        </div>
      </div>;
  }
  return <CookingMode recipe={recipe} onClose={handleClose} />;
}