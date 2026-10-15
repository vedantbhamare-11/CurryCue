"use client";

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';
import { RecipeDetail } from '@/components/recipe-detail';
import { useIngredientStore } from '@/store/ingredient-store';
import { classifyIngredients } from '@/lib/services/recipe-generation';
import type { Recipe } from '@/types';

// A recipe someone sent. What the link carries is the recipe only; what you have and what you are missing
// is worked out here, against your own pantry.
export function SharedRecipeView({ recipe }: { recipe: Recipe }) {
  const router = useRouter();
  const pantry = useIngredientStore((state) => state.ingredients);

  const forYou = useMemo(() => {
    const { used, assumed, missing } = classifyIngredients(recipe.ingredients, pantry);
    const needed = used.length + missing.length;
    return {
      ...recipe,
      usedIngredients: used,
      assumedIngredients: assumed,
      missingIngredients: missing,
      matchPercentage: needed === 0 ? 0 : Math.round((used.length / needed) * 100),
    };
  }, [recipe, pantry]);

  return (
    <div className="min-h-dvh bg-gradient-to-b from-amber-50 to-orange-50 dark:from-background dark:to-[#2a1b10]">
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <p className="mb-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Send className="w-4 h-4" aria-hidden="true" /> A recipe shared with you. Tap the heart to keep it.
        </p>
        <div className="flex justify-center">
          <RecipeDetail recipe={forYou} onClose={() => router.push('/')} />
        </div>
      </main>
    </div>
  );
}
