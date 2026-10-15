"use client";

import { useRef, useState } from 'react';
import { useModalBehavior } from '@/hooks/use-modal-behavior';
import { motion } from 'framer-motion';
import { RecipeImage } from '@/components/recipe-image';
import { hasRealPhoto } from '@/lib/dish-photo';
import { Clock, Utensils, Users, Heart, Share, X, ChevronRight, PlayCircle } from 'lucide-react';
import { Recipe } from '@/types';
import { useRecipeStore } from '@/store/recipe-store';
import { useShoppingListStore } from '@/store/shopping-list-store';
import { useIngredientStore } from '@/store/ingredient-store';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { buildShareUrl, recipeShareText } from '@/lib/share-recipe';
import { CookingMode } from './cooking-mode';
interface RecipeDetailProps {
  recipe: Recipe;
  onClose: () => void;
}
export function RecipeDetail({
  recipe,
  onClose
}: RecipeDetailProps) {
  const {
    addFavoriteRecipe,
    favoriteRecipes,
    addRecentRecipe
  } = useRecipeStore();
  const router = useRouter();
  const addToShoppingList = useShoppingListStore(state => state.addItems);
  const pantry = useIngredientStore(state => state.ingredients);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');
  const [currentStep, setCurrentStep] = useState(0);
  const [cookingModeActive, setCookingModeActive] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  useModalBehavior(dialogRef, onClose, !cookingModeActive);
  const isFavorite = favoriteRecipes.some(r => r.id === recipe.id);
  // Put what this recipe is missing on the shopping list (merging with what is already there)
  const handleAddMissingToList = () => {
    const result = addToShoppingList(recipe.missingIngredients ?? [], { pantry, recipeTitle: recipe.title });
    const parts: string[] = [];
    if (result.added.length > 0) parts.push(`Added ${result.added.length} ${result.added.length === 1 ? 'item' : 'items'} to your shopping list`);
    if (result.merged.length > 0) parts.push(`${parts.length ? 'updated' : 'Updated'} ${result.merged.length} already on it`);
    if (parts.length === 0) parts.push(result.alreadyListed.length > 0 ? 'Already on your shopping list' : 'Everything is already in your pantry');
    toast.success(parts.join(', '), { action: { label: 'View list', onClick: () => router.push('/shopping-list') } });
  };
  const handleAddToFavorites = () => {
    addFavoriteRecipe(recipe);
    addRecentRecipe(recipe);
    toast.success(`Added "${recipe.title}" to favorites!`);
  };
  // Shares the recipe itself: a link that opens it for the other person, plus the readable text, so it still
  // works where a link does not (or is too long). Opening the link needs no account.
  const handleShare = async () => {
    const link = await buildShareUrl(window.location.origin, recipe);
    const text = recipeShareText(recipe, link);
    if (navigator.share) {
      try {
        await navigator.share({ title: recipe.title, text });
      } catch (error) {
        // Closing the share sheet is not an error
        if ((error as Error).name !== 'AbortError') console.error('Error sharing:', error);
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      toast.success(link ? 'Recipe and link copied to the clipboard!' : 'Recipe copied to the clipboard!');
    } catch {
      toast.error("Couldn't copy the recipe. Please try again.");
    }
  };
  const handleNextStep = () => {
    if (currentStep < recipe.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  const startCookingMode = () => {
    setCookingModeActive(true);
  };
  const closeCookingMode = () => {
    setCookingModeActive(false);
  };
  return <>
      {cookingModeActive ? <CookingMode recipe={recipe} onClose={closeCookingMode} /> : <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={recipe.title} tabIndex={-1} className="bg-card rounded-2xl overflow-hidden shadow-lg border border-border w-[95%] max-w-4xl max-h-[90dvh] flex flex-col outline-none">
          <div className="relative h-48 sm:h-56 md:h-80">
            <RecipeImage src={recipe.image} title={recipe.title} iconTop sizes="(max-width: 768px) 95vw, (max-width: 1200px) 80vw, 1200px" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent"></div>
            {hasRealPhoto(recipe.image) && recipe.imageCredit && <a href={recipe.imageCredit.url} target="_blank" rel="noopener noreferrer" className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-black/50 text-white text-[10px] sm:text-xs rounded-full px-2 py-1 hover:bg-black/70 transition-colors z-10">Photo by {recipe.imageCredit.name} on Unsplash</a>}
            
            <button onClick={onClose} className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-card/80 backdrop-blur-sm rounded-full p-2 hover:bg-card transition-colors z-10" aria-label="Close recipe">
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            
            <div className="absolute bottom-2 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
              <div className="flex flex-wrap gap-1 sm:gap-2 mb-1 sm:mb-2">
                <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
                  {recipe.matchPercentage}% match
                </span>
                <span className="bg-secondary text-secondary-foreground text-xs font-medium px-2 py-1 rounded-full">
                  {recipe.cuisine}
                </span>
                {recipe.tags.slice(0, 2).map((tag, i) => <span key={i} className="bg-muted text-muted-foreground text-xs font-medium px-2 py-1 rounded-full">
                    {tag}
                  </span>)}
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-card-foreground line-clamp-2">{recipe.title}</h2>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-between p-3 sm:p-4 border-b border-border">
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{recipe.cookTime} min</span>
              </div>
              <div className="flex items-center gap-1">
                <Utensils className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm capitalize">{recipe.difficulty}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">2 servings</span>
              </div>
            </div>
            
            <div className="flex gap-2 mt-2 sm:mt-0">
              <button onClick={handleAddToFavorites} className={cn("p-2 rounded-full hover:bg-muted transition-colors", isFavorite && "text-primary")} aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}>
                <Heart className={cn("w-5 h-5", isFavorite && "fill-primary")} />
              </button>
              <button onClick={handleShare} className="p-2 rounded-full hover:bg-muted transition-colors" aria-label="Share recipe">
                <Share className="w-5 h-5" />
              </button>
            </div>
          </div>
      
          {/* Outside the tabs so it is one tap away from either of them */}
          <div className="px-3 sm:px-4 pt-3">
            <motion.button whileHover={{
          scale: 1.02
        }} whileTap={{
          scale: 0.98
        }} onClick={startCookingMode} className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg py-3 flex items-center justify-center gap-2 hover:shadow-md transition-all">
              <PlayCircle className="w-5 h-5" />
              <span className="font-medium">Start Cooking Mode</span>
            </motion.button>
          </div>

          <div className="flex border-b border-border mt-3">
            <button onClick={() => setActiveTab('ingredients')} className={cn("flex-1 py-2 sm:py-3 text-center font-medium transition-colors text-sm sm:text-base", activeTab === 'ingredients' ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")}>
              Ingredients
            </button>
            <button onClick={() => setActiveTab('instructions')} className={cn("flex-1 py-2 sm:py-3 text-center font-medium transition-colors text-sm sm:text-base", activeTab === 'instructions' ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")}>
              Instructions
            </button>
          </div>
      
          <div className="flex-1 overflow-y-auto p-3 sm:p-4">
            {activeTab === 'ingredients' && <div className="space-y-3 sm:space-y-4">
                <p className="text-sm sm:text-base text-muted-foreground">{recipe.description}</p>
                
                <h3 className="font-medium text-base sm:text-lg">Ingredients</h3>
                
                {/* Used Ingredients from Inventory */}
                {recipe.usedIngredients && recipe.usedIngredients.length > 0 && <div className="mb-4">
                    <h4 className="font-medium text-sm text-primary mb-2">From Your Kitchen:</h4>
                    {recipe.usesExpiring && recipe.usesExpiring.length > 0 && <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-2">Uses up what&apos;s about to expire: {recipe.usesExpiring.join(', ')}</p>}
                    <ul className="space-y-2">
                      {recipe.usedIngredients.map((ingredient, index) => <li key={index} className="flex items-center gap-2 text-sm sm:text-base">
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                          <span>
                            {ingredient.quantity && ingredient.unit ? `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}` : ingredient.name}
                          </span>
                        </li>)}
                    </ul>
                  </div>}
                
                {/* Assumed Basic Ingredients */}
                {recipe.assumedIngredients && recipe.assumedIngredients.length > 0 && <div className="mb-4">
                    <h4 className="font-medium text-sm text-secondary mb-2">Basic Pantry Items (Assumed):</h4>
                    <ul className="space-y-2">
                      {recipe.assumedIngredients.map((ingredient, index) => <li key={index} className="flex items-center gap-2 text-sm sm:text-base opacity-75">
                          <div className="w-2 h-2 rounded-full bg-secondary flex-shrink-0"></div>
                          <span>
                            {ingredient.quantity && ingredient.unit ? `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}` : ingredient.name}
                          </span>
                        </li>)}
                    </ul>
                  </div>}
                
                {/* Ingredients the recipe needs that aren't in the pantry */}
                {recipe.missingIngredients && recipe.missingIngredients.length > 0 && <div className="mb-4">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h4 className="font-medium text-sm text-amber-600 dark:text-amber-400">You&apos;ll Also Need:</h4>
                      <button onClick={handleAddMissingToList} className="text-xs font-medium px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 transition-colors">Add to shopping list</button>
                    </div>
                    <ul className="space-y-2">
                      {recipe.missingIngredients.map((ingredient, index) => <li key={index} className="flex items-center gap-2 text-sm sm:text-base">
                          <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0"></div>
                          <span>
                            {ingredient.quantity && ingredient.unit ? `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}` : ingredient.name}
                          </span>
                        </li>)}
                    </ul>
                  </div>}
                
                {/* Fallback to all ingredients if new format not available */}
                {(!recipe.usedIngredients || recipe.usedIngredients.length === 0) && (!recipe.assumedIngredients || recipe.assumedIngredients.length === 0) && <ul className="space-y-2">
                    {recipe.ingredients.map((ingredient, index) => <li key={index} className="flex items-center gap-2 text-sm sm:text-base">
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                        <span>
                          {ingredient.quantity && ingredient.unit ? `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}` : ingredient.name}
                        </span>
                      </li>)}
                  </ul>}
              </div>}
            
            {activeTab === 'instructions' && <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-base sm:text-lg">Step by Step</h3>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {currentStep + 1} of {recipe.steps.length}
                  </div>
                </div>
                
                <div className="bg-muted rounded-lg p-3 sm:p-4">
                  <motion.div key={currentStep} initial={{
              opacity: 0,
              y: 10
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -10
            }} transition={{
              duration: 0.3
            }} className="min-h-[80px] sm:min-h-[100px]">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center flex-shrink-0">
                        {currentStep + 1}
                      </div>
                      <p className="text-sm sm:text-base">{recipe.steps[currentStep]}</p>
                    </div>
                  </motion.div>
                  
                  <div className="flex justify-between mt-4 sm:mt-6">
                    <button onClick={handlePreviousStep} disabled={currentStep === 0} className={cn("px-3 py-1.5 sm:px-4 sm:py-2 text-sm rounded-lg border border-border hover:bg-muted/80 transition-colors", currentStep === 0 && "opacity-50 cursor-not-allowed")}>
                      Previous
                    </button>
                    
                    <button onClick={handleNextStep} disabled={currentStep === recipe.steps.length - 1} className={cn("px-3 py-1.5 sm:px-4 sm:py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1", currentStep === recipe.steps.length - 1 && "opacity-50 cursor-not-allowed")}>
                      <span>Next</span>
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 sm:mt-6">
                  <h4 className="font-medium text-sm sm:text-base mb-2">All Steps</h4>
                  <div className="space-y-2 sm:space-y-3">
                    {recipe.steps.map((step, index) => <button key={index} onClick={() => setCurrentStep(index)} className={cn("w-full text-left p-2 sm:p-3 rounded-lg border border-border hover:border-primary transition-colors flex items-start gap-1.5 sm:gap-2", currentStep === index && "border-primary bg-primary/5")}>
                        <div className={cn("rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center flex-shrink-0", currentStep === index ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                          {index + 1}
                        </div>
                        <p className={cn("text-xs sm:text-sm", currentStep !== index && "line-clamp-2")}>{step}</p>
                      </button>)}
                  </div>
                </div>
              </div>}
          </div>
        </div>}
    </>;
}