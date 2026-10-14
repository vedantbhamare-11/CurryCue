"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ChefHat, CalendarClock } from 'lucide-react';
import { useIngredientStore } from '@/store/ingredient-store';
import { useUserPreferencesStore } from '@/store/user-preferences-store';
import { useRecipeStore } from '@/store/recipe-store';
import { generateRecipes } from '@/lib/services/recipe-generation';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { getUseSoon, describeExpiryShort } from '@/lib/expiry';

// Eggs are left out on purpose: whether they count as vegetarian varies by household
const MEAT_PATTERN = /\b(chicken|mutton|lamb|beef|pork|fish|prawns?|shrimp|crab|salmon|tuna|bacon|ham|sausages?|turkey|keema|meat)\b/i;
export function RecipeGenerator() {
  const {
    ingredients
  } = useIngredientStore();
  const {
    preferences
  } = useUserPreferencesStore();
  const {
    setSuggestedRecipes,
    isLoading,
    setIsLoading
  } = useRecipeStore();
  const [cuisineType, setCuisineType] = useState<string>('');
  const [mealType, setMealType] = useState<string>('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | ''>('');
  const [maxCookingTime, setMaxCookingTime] = useState<number>(60);
  const [servings, setServings] = useState<number>(2);
  const [dietaryPreference, setDietaryPreference] = useState<'veg' | 'non-veg'>('veg');
  // "Veg" asks the model for vegetarian recipes only, which silently ignores any meat in the pantry
  const meatIngredient = ingredients.find((ingredient) => MEAT_PATTERN.test(ingredient.name));
  // Pantry items that are expired or expire within 3 days. Meat is left out while Veg is selected, so a
  // soon-to-expire chicken is not forced into a vegetarian recipe (the hint above offers the switch)
  const allUseSoon = getUseSoon(ingredients);
  const useSoon = allUseSoon.filter(({ ingredient }) => dietaryPreference === 'non-veg' || !MEAT_PATTERN.test(ingredient.name));
  const skippedForDiet = allUseSoon.length - useSoon.length;
  const handleGenerateRecipes = async (options: { strictUseSoon?: boolean } = {}) => {
    if (ingredients.length === 0) {
      toast.error("Please add some ingredients first");
      return;
    }
    setIsLoading(true);
    try {
      const recipes = await generateRecipes({
        ingredients,
        preferences: {
          ...preferences,
          dietaryRestrictions: dietaryPreference === 'veg' ? ['vegetarian'] : []
        },
        cuisineType: cuisineType || undefined,
        mealType: mealType || undefined,
        difficulty: difficulty || undefined,
        maxCookingTime: maxCookingTime || undefined,
        servings: servings || undefined,
        useSoon: useSoon.map(({ ingredient }) => ingredient),
        strictUseSoon: options.strictUseSoon
      });
      setSuggestedRecipes(recipes);
      if (recipes.length > 0) {
        toast.success(`Generated ${recipes.length} recipe suggestions!`);
      } else {
        toast.error("Couldn't generate recipes. Please try again with different ingredients.");
      }
    } catch (error) {
      console.error("Error generating recipes:", error);

      // Handle specific error messages
      if (error instanceof Error) {
        if (error.message.includes("Rate limit")) {
          toast.error("You've reached the recipe generation limit. Please try again in a minute.");
        } else if (error.message.includes("timed out")) {
          toast.error("Recipe generation took too long. Please try again with fewer ingredients.");
        } else {
          toast.error(`Failed to generate recipes: ${error.message}`);
        }
      } else {
        toast.error("Failed to generate recipes. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const resetFilters = () => {
    setCuisineType('');
    setMealType('');
    setDifficulty('');
    setMaxCookingTime(60);
    setServings(2);
    setDietaryPreference('veg');
  };
  return <div className="bg-card rounded-2xl p-6 shadow-sm dark:shadow-primary/5 border border-border">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-xl font-bold">Generate Recipes</h3>
          <div className="flex lg:flex-row flex-col items-center gap-3">
          </div>
        </div>
        
        
        
        <p className="text-muted-foreground">
          Let our AI chef create personalized recipes based on your ingredients and preferences
        </p>

        {useSoon.length > 0 && <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-200 flex items-center gap-2"><CalendarClock className="w-4 h-4" />Use these up soon</p>
              <p className="text-sm text-amber-800/80 dark:text-amber-200/80 mt-1">
                {useSoon.map(({ ingredient, days }) => `${ingredient.name} (${describeExpiryShort(days).toLowerCase()})`).join(', ')}
              </p>
              {skippedForDiet > 0 && <p className="text-xs text-amber-800/70 dark:text-amber-200/70 mt-1">{skippedForDiet} meat {skippedForDiet === 1 ? 'item is' : 'items are'} left out because Veg is selected.</p>}
            </div>
            <button onClick={() => handleGenerateRecipes({ strictUseSoon: true })} disabled={isLoading} className="flex-shrink-0 px-4 py-2 rounded-lg bg-amber-500 text-white font-medium hover:bg-amber-600 disabled:opacity-50 transition-colors">
              Cook with these
            </button>
          </div>}
        
        
        <AnimatePresence>
        <motion.div initial={{
          opacity: 0,
          height: 0
        }} animate={{
          opacity: 1,
          height: 'auto'
        }} exit={{
          opacity: 0,
          height: 0
        }} className="overflow-hidden">
              <div className=" pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Recipe Filters</h4>
                  <button onClick={resetFilters} className="text-sm text-primary hover:text-primary/80 transition-colors">
                    Reset
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Cuisine Type</label>
                    <select value={cuisineType} onChange={e => setCuisineType(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-input-background dark:bg-input border border-border outline-none focus:ring-2 focus:ring-primary/20">
                      <option value="">Any Cuisine</option>
                      <option value="Italian">Italian</option>
                      <option value="Mexican">Mexican</option>
                      <option value="Asian">Asian</option>
                      <option value="Indian">Indian</option>
                      <option value="Mediterranean">Mediterranean</option>
                      <option value="American">American</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Meal Type</label>
                    <select value={mealType} onChange={e => setMealType(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-input-background dark:bg-input border border-border outline-none focus:ring-2 focus:ring-primary/20">
                      <option value="">Any Meal</option>
                      <option value="Breakfast">Breakfast</option>
                      <option value="Lunch">Lunch</option>
                      <option value="Dinner">Dinner</option>
                      <option value="Dessert">Dessert</option>
                      <option value="Snack">Snack</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Difficulty</label>
                    <select value={difficulty} onChange={e => setDifficulty(e.target.value as typeof difficulty)} className="w-full px-3 py-2 rounded-lg bg-input-background dark:bg-input border border-border outline-none focus:ring-2 focus:ring-primary/20">
                      <option value="">Any Difficulty</option>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Max Cooking Time (minutes)</label>
                    <div className="flex items-center gap-2">
                      <input type="range" min="15" max="120" step="5" value={maxCookingTime} onChange={e => setMaxCookingTime(parseInt(e.target.value))} className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary" />
                      <span className="w-12 text-center">{maxCookingTime}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 flex flex-row gap-4  items-center justify-start">
                    <label className="block text-sm font-medium">Servings:</label>
                    <div className="flex items-center">
                      <button onClick={() => setServings(Math.max(1, servings - 1))} className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-l-lg border border-border">
                        -
                      </button>
                      <div className="px-4 py-2 border-t border-b border-border bg-input-background dark:bg-input">
                        {servings}
                      </div>
                      <button onClick={() => setServings(servings + 1)} className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-r-lg border border-border">
                        +
                      </button>
                    </div>
                  </div>

                  {/* Dietary Preference Toggle */}
        <div className="flex items-center justify-start gap-4">
          <span className="text-sm font-medium">Dietary Preference:</span>
          <div className="flex items-center bg-background rounded-full p-1 border border-border">
            <button onClick={() => setDietaryPreference('veg')} className={cn("lg:px-4 lg:py-2 px-2 py-1 rounded-full text-sm font-medium transition-all flex items-center gap-2", dietaryPreference === 'veg' ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
              Veg
            </button>
            <button onClick={() => setDietaryPreference('non-veg')} className={cn("lg:px-4 lg:py-2 px-2 py-1 rounded-full text-sm font-medium transition-all flex items-center gap-2", dietaryPreference === 'non-veg' ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
              Non-Veg
            </button>
          </div>
        </div>
        {dietaryPreference === 'veg' && meatIngredient && <p className="col-span-full text-sm text-amber-600 dark:text-amber-400">
            Your pantry has {meatIngredient.name.toLowerCase()}, but Veg only suggests vegetarian recipes.{' '}
            <button type="button" onClick={() => setDietaryPreference('non-veg')} className="underline font-medium">Switch to Non-Veg</button>
          </p>}

                </div>
              </div>
            </motion.div>
        </AnimatePresence>
        
        {ingredients.length === 0 && <div className="text-center py-4 text-muted-foreground">
            Add some ingredients to generate recipe suggestions
          </div>}
      </div>
      <div className="flex flex-wrap gap-2 mt-6 items-center">
          
          
          <div className="flex-1"></div>
          
          <motion.button whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }} onClick={() => handleGenerateRecipes()} disabled={isLoading || ingredients.length === 0} className={cn("flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors", (isLoading || ingredients.length === 0) && "opacity-50 cursor-not-allowed")}>
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChefHat className="w-5 h-5" />}
            <span>Generate Recipes</span>
          </motion.button>
        </div>
    </div>;
}