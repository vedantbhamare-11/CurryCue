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
    return <div className="min-h-screen flex items-center justify-center" data-unique-id="069de918-e871-44b3-826b-734376ddb94c" data-file-name="app/cooking/[recipeId]/page.tsx">
        <div className="flex flex-col items-center gap-4" data-unique-id="9d41f98b-5b0e-4216-b04c-35fb435a9663" data-file-name="app/cooking/[recipeId]/page.tsx">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground" data-unique-id="8025d1af-8979-4175-9a66-6128c4cc9e75" data-file-name="app/cooking/[recipeId]/page.tsx"><span className="editable-text" data-unique-id="2ec33909-4c99-4729-b80e-51de7a64a9e3" data-file-name="app/cooking/[recipeId]/page.tsx">Loading cooking mode...</span></p>
        </div>
      </div>;
  }
  if (!recipe) {
    return <div className="min-h-screen flex items-center justify-center" data-unique-id="e331165b-3310-4f27-b00b-ad261a4f73bf" data-file-name="app/cooking/[recipeId]/page.tsx">
        <div className="bg-card border border-border rounded-lg p-8 max-w-md text-center" data-unique-id="2d702775-8ad2-442b-9618-5bb53914b125" data-file-name="app/cooking/[recipeId]/page.tsx">
          <h1 className="text-2xl font-bold mb-4" data-unique-id="8c403692-81c4-4879-8f1b-098b5bd82c6d" data-file-name="app/cooking/[recipeId]/page.tsx"><span className="editable-text" data-unique-id="64a7c730-f844-45d7-997d-ad1a15d89ff9" data-file-name="app/cooking/[recipeId]/page.tsx">Recipe Not Found</span></h1>
          <p className="text-muted-foreground mb-6" data-unique-id="078f5e46-0411-428b-bde3-088f4a5edc22" data-file-name="app/cooking/[recipeId]/page.tsx"><span className="editable-text" data-unique-id="91ace960-ba8d-4a3e-970b-010325f4d024" data-file-name="app/cooking/[recipeId]/page.tsx">
            We couldn't find the recipe you're looking for. It may have been deleted or is no longer available.
          </span></p>
          <button onClick={() => router.push('/recipes')} className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors" data-unique-id="47615ef1-1b7a-47c7-8eed-403fd0e0f581" data-file-name="app/cooking/[recipeId]/page.tsx"><span className="editable-text" data-unique-id="561d8150-2da6-49ba-a05b-5ad8cada4fae" data-file-name="app/cooking/[recipeId]/page.tsx">
            Browse Recipes
          </span></button>
        </div>
      </div>;
  }
  return <CookingMode recipe={recipe} onClose={handleClose} />;
}