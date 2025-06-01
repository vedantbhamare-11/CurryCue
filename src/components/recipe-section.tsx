"use client";

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Utensils, ArrowRight, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Recipe } from '@/types';
import { cn } from '@/lib/utils';
import { useRecipeStore } from '@/store/recipe-store';
import { RecipeDetail } from './recipe-detail';
import { RecipeGenerator } from './recipe-generator';
import { useIngredientStore } from '@/store/ingredient-store';
export function RecipeSection() {
  const {
    suggestedRecipes,
    isLoading
  } = useRecipeStore();
  const {
    ingredients
  } = useIngredientStore();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
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
    setSelectedRecipe(recipe);
  };
  const closeRecipeDetails = () => {
    setSelectedRecipe(null);
  };
  return <section className="relative space-y-8" data-unique-id="919bd38a-e020-4fc8-b5d8-8a07dcd88d95" data-file-name="components/recipe-section.tsx" data-dynamic-text="true">
      <RecipeGenerator />
      
      <div className="flex justify-between items-center" data-unique-id="8e4d60fd-4787-4dfa-8b96-150328193d38" data-file-name="components/recipe-section.tsx" data-dynamic-text="true">
        <div data-unique-id="9a6b8ca5-8e02-4852-b415-5268f4cf19d0" data-file-name="components/recipe-section.tsx">
          <h2 className="text-2xl font-bold" data-unique-id="4695c5d3-a7ec-41f6-9833-8b4598fa759e" data-file-name="components/recipe-section.tsx"><span className="editable-text" data-unique-id="4929cff9-4980-42fd-93c0-93eb77707cc7" data-file-name="components/recipe-section.tsx">Recipe Suggestions</span></h2>
          <p className="text-muted-foreground" data-unique-id="065d56fb-f920-4548-91a0-8ffa5f78d009" data-file-name="components/recipe-section.tsx"><span className="editable-text" data-unique-id="93db3835-e2de-4e5f-b460-e6cd36c3953a" data-file-name="components/recipe-section.tsx">Based on your ingredients</span></p>
        </div>
        
        {suggestedRecipes.length > 0 && <div className="flex gap-2" data-unique-id="e24dbab8-2f6a-48ab-8cec-fbdc6d6cb85c" data-file-name="components/recipe-section.tsx">
            <motion.button whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }} onClick={scrollLeft} className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors" data-unique-id="da32576b-87c0-4200-a37e-c4f711ed6f5e" data-file-name="components/recipe-section.tsx">
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }} onClick={scrollRight} className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors" data-unique-id="427b541a-3da4-4602-a651-6ba86184eab0" data-file-name="components/recipe-section.tsx">
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>}
      </div>
      
      {/* Loading state */}
      {isLoading && <div className="flex flex-col items-center justify-center py-12" data-unique-id="a66aa3db-9360-4d93-b7ae-e7d2edc457a0" data-file-name="components/recipe-section.tsx">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground" data-unique-id="0e6ba204-76f2-4636-8d80-fa0bd64b80fb" data-file-name="components/recipe-section.tsx"><span className="editable-text" data-unique-id="ed6480b5-1888-4144-9f7e-038379b15e36" data-file-name="components/recipe-section.tsx">Generating recipe suggestions...</span></p>
          <p className="text-sm text-muted-foreground mt-2" data-unique-id="476eb3b5-c1f2-4648-95a8-317d3889dec5" data-file-name="components/recipe-section.tsx"><span className="editable-text" data-unique-id="de456f49-8fc1-4368-a420-d308f01b2b8c" data-file-name="components/recipe-section.tsx">This may take a moment</span></p>
        </div>}
      
      {/* Empty state */}
      {!isLoading && suggestedRecipes.length === 0 && ingredients.length > 0 && <div className="bg-muted/30 rounded-xl p-8 text-center" data-unique-id="04b9647e-b4a6-4268-856e-a77a7475889b" data-file-name="components/recipe-section.tsx">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4" data-unique-id="53e5bd9c-adfa-4875-bbd8-1b4bd1153783" data-file-name="components/recipe-section.tsx">
            <Utensils className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2" data-unique-id="2595a556-1b0c-4c9f-9f95-6b3f8d162433" data-file-name="components/recipe-section.tsx"><span className="editable-text" data-unique-id="3376a9cf-13ed-419b-8a38-41d23ef3ace5" data-file-name="components/recipe-section.tsx">No recipes yet</span></h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto" data-unique-id="4c7b083c-1627-4c86-96c1-4db84f0fb970" data-file-name="components/recipe-section.tsx"><span className="editable-text" data-unique-id="7f8f634f-86a4-4e09-9982-d4238dd91f33" data-file-name="components/recipe-section.tsx">
            Click the "Generate Recipes" button above to create personalized recipe suggestions based on your ingredients
          </span></p>
        </div>}
      
      {/* Recipe carousel */}
      {!isLoading && suggestedRecipes.length > 0 && <div ref={scrollContainerRef} className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory hide-scrollbar" style={{
      scrollbarWidth: 'none'
    }} data-unique-id="69fe5cef-5052-48fa-b745-54191068d115" data-file-name="components/recipe-section.tsx" data-dynamic-text="true">
          {suggestedRecipes.map(recipe => <motion.div key={recipe.id} whileHover={{
        y: -5
      }} className="recipe-card flex-shrink-0 w-[300px] bg-card rounded-xl overflow-hidden shadow-sm dark:shadow-primary/5 border border-border snap-start" data-unique-id="84077c5e-b517-4625-8622-9dab61eb70d0" data-file-name="components/recipe-section.tsx">
              <div className="relative h-40" data-unique-id="7fefb7f3-5317-4962-b9a5-0f57e1c832ab" data-file-name="components/recipe-section.tsx">
                <Image src={recipe.image} alt={recipe.title} fill className="object-cover" data-unique-id="d8863cfa-f137-460b-8130-ffdbba97ce1c" data-file-name="components/recipe-section.tsx" />
                <div className="absolute top-2 right-2 bg-card/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium" data-unique-id="a3ffb944-f15c-4385-85c0-896f5facd064" data-file-name="components/recipe-section.tsx" data-dynamic-text="true">
                  {recipe.matchPercentage}<span className="editable-text" data-unique-id="9388df80-def7-43d2-91ed-ad919d8d68cf" data-file-name="components/recipe-section.tsx">% match
                </span></div>
              </div>
              <div className="p-4" data-unique-id="0a7095d3-1511-4e12-bcb8-7e486be222bd" data-file-name="components/recipe-section.tsx">
                <h3 className="font-bold text-lg mb-1 line-clamp-1" data-unique-id="5ab8ff67-7e18-4554-ad55-c8fdce287ae1" data-file-name="components/recipe-section.tsx" data-dynamic-text="true">{recipe.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2" data-unique-id="05d907b8-5f3a-4b6c-86e2-4dd523868aae" data-file-name="components/recipe-section.tsx" data-dynamic-text="true">{recipe.description}</p>
                
                <div className="flex justify-between items-center mb-4" data-unique-id="78ae83e3-0f2e-4586-9024-2f8962c683ac" data-file-name="components/recipe-section.tsx">
                  <div className="flex items-center gap-1 text-sm" data-unique-id="7e819ea0-3b69-4020-8019-b9a739539afb" data-file-name="components/recipe-section.tsx">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span data-unique-id="0be3db88-546f-4047-aa0f-356003ea1c16" data-file-name="components/recipe-section.tsx" data-dynamic-text="true">{recipe.cookTime}<span className="editable-text" data-unique-id="53d4cdd6-c3da-449a-a443-881140c55dd1" data-file-name="components/recipe-section.tsx"> min</span></span>
                  </div>
                  <div className="flex items-center gap-1 text-sm" data-unique-id="fe5ef670-6705-43bf-8d1c-c7d071aabc5a" data-file-name="components/recipe-section.tsx">
                    <Utensils className="w-4 h-4 text-muted-foreground" />
                    <span className="capitalize" data-unique-id="3b76f4d3-1aec-4915-81e2-88502878efc5" data-file-name="components/recipe-section.tsx" data-dynamic-text="true">{recipe.difficulty}</span>
                  </div>
                </div>
                
                <div className="flex gap-1 mb-4 flex-wrap" data-unique-id="214c8efb-822f-41e2-8b3d-b59b9bc81ea9" data-file-name="components/recipe-section.tsx" data-dynamic-text="true">
                  {recipe.tags.slice(0, 3).map((tag, i) => <span key={i} className="bg-muted dark:bg-muted/50 rounded-full px-2 py-1 text-xs" data-unique-id="994d4403-59ab-48e3-af84-f9b48a571c7d" data-file-name="components/recipe-section.tsx" data-dynamic-text="true">
                      {tag}
                    </span>)}
                </div>
                
                <motion.button whileHover={{
            scale: 1.02
          }} whileTap={{
            scale: 0.98
          }} onClick={() => handleSelectRecipe(recipe)} className="w-full bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2" data-unique-id="a228c61d-821b-454a-9148-79cffc4d79b2" data-file-name="components/recipe-section.tsx">
                  <span data-unique-id="664d126f-41f6-495d-b967-729bba1c30bc" data-file-name="components/recipe-section.tsx"><span className="editable-text" data-unique-id="21f5f133-4f76-4266-80bc-82a39423cc7c" data-file-name="components/recipe-section.tsx">View Recipe</span></span>
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
      }} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto" onClick={closeRecipeDetails} data-unique-id="7fe6f1b8-abc2-4381-8627-fa74ba7ba3ff" data-file-name="components/recipe-section.tsx">
            <div onClick={e => e.stopPropagation()} data-unique-id="0f91b52d-8fc6-4dd1-a034-cb9c567e7fd3" data-file-name="components/recipe-section.tsx">
              <RecipeDetail recipe={selectedRecipe} onClose={closeRecipeDetails} />
            </div>
          </motion.div>}
      </AnimatePresence>
    </section>;
}