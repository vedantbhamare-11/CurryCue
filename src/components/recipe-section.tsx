"use client";

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Utensils, ArrowRight, Loader2, CalendarClock } from 'lucide-react';
import { RecipeImage } from '@/components/recipe-image';
import { Recipe } from '@/types';
import { useRecipeStore } from '@/store/recipe-store';
import { RecipeDetail } from './recipe-detail';
import { RecipeGenerator } from './recipe-generator';
import { useIngredientStore } from '@/store/ingredient-store';
import { useDishPhotos } from '@/hooks/use-dish-photos';
export function RecipeSection() {
  const {
    suggestedRecipes,
    isLoading
  } = useRecipeStore();
  const {
    ingredients
  } = useIngredientStore();
  // Keep the opened recipe's id and look it up live, so its photo appears when it arrives; the copy covers a regenerate while open
  const [opened, setOpened] = useState<Recipe | null>(null);
  const selectedRecipe = opened ? suggestedRecipes.find(recipe => recipe.id === opened.id) ?? opened : null;
  useDishPhotos(suggestedRecipes);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };
  const handleSelectRecipe = (recipe: Recipe) => {
    setOpened(recipe);
  };
  const closeRecipeDetails = () => {
    setOpened(null);
  };
  return <section className="relative space-y-8">
      <RecipeGenerator />
      
      {(isLoading || suggestedRecipes.length > 0 || ingredients.length > 0) && <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Recipe Suggestions</h2>
          <p className="text-muted-foreground">Based on your ingredients</p>
        </div>
        
        {suggestedRecipes.length > 0 && <div className="flex gap-2">
            <motion.button whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }} onClick={scrollLeft} aria-label="Scroll recipes left" className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }} onClick={scrollRight} aria-label="Scroll recipes right" className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>}
      </div>}
      
      {/* Loading state */}
      {isLoading && <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Generating recipe suggestions...</p>
          <p className="text-sm text-muted-foreground mt-2">This may take a moment</p>
        </div>}
      
      {/* Empty state */}
      {!isLoading && suggestedRecipes.length === 0 && ingredients.length > 0 && <div className="bg-muted/30 rounded-xl p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Utensils className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">No recipes yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Click the &quot;Generate Recipes&quot; button above to create personalized recipe suggestions based on your ingredients
          </p>
        </div>}
      
      {/* Recipe carousel */}
      {!isLoading && suggestedRecipes.length > 0 && <div ref={scrollContainerRef} className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory hide-scrollbar" style={{
      scrollbarWidth: 'none'
    }}>
          {suggestedRecipes.map(recipe => <motion.div key={recipe.id} whileHover={{
        y: -5
      }} onClick={() => handleSelectRecipe(recipe)} className="recipe-card flex-shrink-0 w-[300px] bg-card rounded-xl overflow-hidden shadow-sm dark:shadow-primary/5 border border-border snap-start cursor-pointer">
              <div className="relative h-40">
                <RecipeImage src={recipe.image} title={recipe.title} />
                <div className="absolute top-2 right-2 bg-card/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium">
                  {recipe.matchPercentage}% match
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1 line-clamp-1">{recipe.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{recipe.description}</p>
                {recipe.usesExpiring && recipe.usesExpiring.length > 0 && <p className="flex items-center gap-1.5 text-xs font-medium text-green-700 dark:text-green-400 mb-3 line-clamp-1">
                    <CalendarClock className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">Uses up {recipe.usesExpiring.join(', ')}</span>
                  </p>}
                
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{recipe.cookTime} min</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Utensils className="w-4 h-4 text-muted-foreground" />
                    <span className="capitalize">{recipe.difficulty}</span>
                  </div>
                </div>
                
                <div className="flex gap-1 mb-4 flex-wrap">
                  {recipe.tags.slice(0, 3).map((tag, i) => <span key={i} className="bg-muted dark:bg-muted/50 rounded-full px-2 py-1 text-xs">
                      {tag}
                    </span>)}
                </div>
                
                <motion.button whileHover={{
            scale: 1.02
          }} whileTap={{
            scale: 0.98
          }} onClick={() => handleSelectRecipe(recipe)} className="w-full bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                  <span>View Recipe</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>)}
        </div>}
      
      {/* Recipe detail modal */}
      <AnimatePresence>
        {selectedRecipe && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="fixed inset-x-0 top-0 h-dvh bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto" onClick={closeRecipeDetails}>
            <div className="w-full flex justify-center self-start sm:self-center" onClick={e => e.stopPropagation()}>
              <RecipeDetail recipe={selectedRecipe} onClose={closeRecipeDetails} />
            </div>
          </motion.div>}
      </AnimatePresence>
    </section>;
}