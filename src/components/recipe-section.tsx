"use client";

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Utensils, ArrowRight, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Recipe } from '@/types';
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
  return <section className="relative space-y-8" data-unique-id="a6286f10-a6b8-4500-9c2a-51e98b2eccf5" data-file-name="components/recipe-section.tsx" data-dynamic-text="true">
      <RecipeGenerator />
      
      <div className="flex justify-between items-center" data-unique-id="6ab58b03-79e8-4fec-922c-19750e67b0d2" data-file-name="components/recipe-section.tsx" data-dynamic-text="true">
        <div data-unique-id="83294dc6-8576-4de8-a55b-3d2602623286" data-file-name="components/recipe-section.tsx">
          <h2 className="text-2xl font-bold" data-unique-id="2d9b594e-e1d4-4d14-9ec5-348403202079" data-file-name="components/recipe-section.tsx"><span className="editable-text" data-unique-id="e777bcab-29be-4acf-be4f-d079c33ba977" data-file-name="components/recipe-section.tsx">Recipe Suggestions</span></h2>
          <p className="text-muted-foreground" data-unique-id="a59fd450-6042-46b3-88e8-ed0bc4e0f25a" data-file-name="components/recipe-section.tsx"><span className="editable-text" data-unique-id="31ad5201-36c4-4c71-b2cb-089815cb40d8" data-file-name="components/recipe-section.tsx">Based on your ingredients</span></p>
        </div>
        
        {suggestedRecipes.length > 0 && <div className="flex gap-2" data-unique-id="9c6b3aed-95b3-4c6d-ba4e-2f09b012ce09" data-file-name="components/recipe-section.tsx">
            <motion.button whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }} onClick={scrollLeft} className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors" data-unique-id="267ffbea-2d13-48b1-b661-623800d1dfb5" data-file-name="components/recipe-section.tsx">
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }} onClick={scrollRight} className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors" data-unique-id="f7b8d789-a739-4dbe-957d-b8185fd3d600" data-file-name="components/recipe-section.tsx">
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>}
      </div>
      
      {/* Loading state */}
      {isLoading && <div className="flex flex-col items-center justify-center py-12" data-unique-id="2e885a37-2d47-43c5-9c57-a1c500ca606d" data-file-name="components/recipe-section.tsx">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground" data-unique-id="8dfcf7cf-15df-4fdc-9423-f00af796d8a6" data-file-name="components/recipe-section.tsx"><span className="editable-text" data-unique-id="70caa8c9-afbc-4500-b0c4-36f802c52882" data-file-name="components/recipe-section.tsx">Generating recipe suggestions...</span></p>
          <p className="text-sm text-muted-foreground mt-2" data-unique-id="d28be39d-2455-43b3-956d-f6cf1ee6542a" data-file-name="components/recipe-section.tsx"><span className="editable-text" data-unique-id="771b7f11-8c1d-43dd-9865-31e5cea80189" data-file-name="components/recipe-section.tsx">This may take a moment</span></p>
        </div>}
      
      {/* Empty state */}
      {!isLoading && suggestedRecipes.length === 0 && ingredients.length > 0 && <div className="bg-muted/30 rounded-xl p-8 text-center" data-unique-id="7fd6ba46-3679-428d-92fe-8fe3b0cbd660" data-file-name="components/recipe-section.tsx">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4" data-unique-id="dcd39a1a-ae49-4f6f-bcb9-8473a96c327c" data-file-name="components/recipe-section.tsx">
            <Utensils className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2" data-unique-id="cdb19de3-89e9-4736-bf79-8250afa5fe05" data-file-name="components/recipe-section.tsx"><span className="editable-text" data-unique-id="68df00e3-c5c0-4b08-8b94-2f073336f437" data-file-name="components/recipe-section.tsx">No recipes yet</span></h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto" data-unique-id="691e077c-f6ed-4be2-b124-08fdd23d21af" data-file-name="components/recipe-section.tsx"><span className="editable-text" data-unique-id="45a8a1c3-4d5a-4ff8-a9a8-0f58291f0aec" data-file-name="components/recipe-section.tsx">
            Click the "Generate Recipes" button above to create personalized recipe suggestions based on your ingredients
          </span></p>
        </div>}
      
      {/* Recipe carousel */}
      {!isLoading && suggestedRecipes.length > 0 && <div ref={scrollContainerRef} className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory hide-scrollbar" style={{
      scrollbarWidth: 'none'
    }} data-unique-id="d5edac0c-68e0-4186-9bb7-71b3f92a1705" data-file-name="components/recipe-section.tsx" data-dynamic-text="true">
          {suggestedRecipes.map(recipe => <motion.div key={recipe.id} whileHover={{
        y: -5
      }} className="recipe-card flex-shrink-0 w-[300px] bg-card rounded-xl overflow-hidden shadow-sm dark:shadow-primary/5 border border-border snap-start" data-unique-id="a74eaa5f-45c8-4a6e-870f-2915161e60ac" data-file-name="components/recipe-section.tsx">
              <div className="relative h-40" data-unique-id="9e4ea8c0-c08e-419d-a604-7b42829ec81a" data-file-name="components/recipe-section.tsx">
                <Image src={recipe.image} alt={recipe.title} fill className="object-cover" data-unique-id="abf8c4a7-3b09-4b7d-83da-bd80d6372728" data-file-name="components/recipe-section.tsx" />
                <div className="absolute top-2 right-2 bg-card/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium" data-unique-id="d930d8dc-5293-4c47-b9a7-6332d930495e" data-file-name="components/recipe-section.tsx" data-dynamic-text="true">
                  {recipe.matchPercentage}<span className="editable-text" data-unique-id="a1275556-6036-40aa-8387-da6df5b4a76c" data-file-name="components/recipe-section.tsx">% match
                </span></div>
              </div>
              <div className="p-4" data-unique-id="82634728-1651-45a0-bba5-1a0ed4f610ed" data-file-name="components/recipe-section.tsx">
                <h3 className="font-bold text-lg mb-1 line-clamp-1" data-unique-id="4f88e593-dab4-4ce4-ac53-78bcb2aa4d5d" data-file-name="components/recipe-section.tsx" data-dynamic-text="true">{recipe.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2" data-unique-id="8814c6d6-b3f5-4bd4-abd2-28be91d45782" data-file-name="components/recipe-section.tsx" data-dynamic-text="true">{recipe.description}</p>
                
                <div className="flex justify-between items-center mb-4" data-unique-id="41b3dbbc-725a-42f4-af97-9ba174c6d11b" data-file-name="components/recipe-section.tsx">
                  <div className="flex items-center gap-1 text-sm" data-unique-id="246cd3d4-696c-4351-a092-c7762f0f80e0" data-file-name="components/recipe-section.tsx">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span data-unique-id="f3ae634b-224d-4236-b43f-52533df09b2e" data-file-name="components/recipe-section.tsx" data-dynamic-text="true">{recipe.cookTime}<span className="editable-text" data-unique-id="652167e2-6e7e-45d4-8fd5-eddcae24ed52" data-file-name="components/recipe-section.tsx"> min</span></span>
                  </div>
                  <div className="flex items-center gap-1 text-sm" data-unique-id="8deba806-b3dc-4f49-9f9a-184fb2b76a1b" data-file-name="components/recipe-section.tsx">
                    <Utensils className="w-4 h-4 text-muted-foreground" />
                    <span className="capitalize" data-unique-id="c2c14c08-3ee3-4636-ac9a-07937b7535b7" data-file-name="components/recipe-section.tsx" data-dynamic-text="true">{recipe.difficulty}</span>
                  </div>
                </div>
                
                <div className="flex gap-1 mb-4 flex-wrap" data-unique-id="096bc683-5688-431e-835e-da33058d262d" data-file-name="components/recipe-section.tsx" data-dynamic-text="true">
                  {recipe.tags.slice(0, 3).map((tag, i) => <span key={i} className="bg-muted dark:bg-muted/50 rounded-full px-2 py-1 text-xs" data-unique-id="351a83e9-29a2-4146-9b7b-f2dacec5f631" data-file-name="components/recipe-section.tsx" data-dynamic-text="true">
                      {tag}
                    </span>)}
                </div>
                
                <motion.button whileHover={{
            scale: 1.02
          }} whileTap={{
            scale: 0.98
          }} onClick={() => handleSelectRecipe(recipe)} className="w-full bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2" data-unique-id="b6e78d1f-eeba-4b27-b1a1-9235d931c6fd" data-file-name="components/recipe-section.tsx">
                  <span data-unique-id="288d6523-d676-4202-b619-c15e7508d2f6" data-file-name="components/recipe-section.tsx"><span className="editable-text" data-unique-id="b307f17c-87bd-412c-88fd-ce13fdd254a4" data-file-name="components/recipe-section.tsx">View Recipe</span></span>
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
      }} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto" onClick={closeRecipeDetails} data-unique-id="0cb78f46-733b-4a90-b7f2-ae7260f0677e" data-file-name="components/recipe-section.tsx">
            <div onClick={e => e.stopPropagation()} data-unique-id="beafd03f-9a32-4be2-a505-e419af71b206" data-file-name="components/recipe-section.tsx">
              <RecipeDetail recipe={selectedRecipe} onClose={closeRecipeDetails} />
            </div>
          </motion.div>}
      </AnimatePresence>
    </section>;
}