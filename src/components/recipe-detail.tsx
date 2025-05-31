"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Clock, Utensils, Users, Heart, Share, X, ChevronRight, Star, PlayCircle } from 'lucide-react';
import { Recipe } from '@/types';
import { useRecipeStore } from '@/store/recipe-store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
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
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');
  const [currentStep, setCurrentStep] = useState(0);
  const [cookingModeActive, setCookingModeActive] = useState(false);
  const isFavorite = favoriteRecipes.some(r => r.id === recipe.id);
  const handleAddToFavorites = () => {
    addFavoriteRecipe(recipe);
    addRecentRecipe(recipe);
    toast.success(`Added "${recipe.title}" to favorites!`);
  };
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe.title,
        text: `Check out this recipe: ${recipe.title}`,
        url: window.location.href
      }).catch(error => {
        console.error('Error sharing:', error);
      });
    } else {
      // Fallback for browsers that don't support the Web Speech API
      navigator.clipboard.writeText(`${recipe.title} - ${window.location.href}`);
      toast.success('Recipe link copied to clipboard!');
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
      {cookingModeActive ? <CookingMode recipe={recipe} onClose={closeCookingMode} /> : <div className="bg-card rounded-2xl overflow-hidden shadow-lg border border-border w-[95%] max-w-4xl max-h-[90vh] flex flex-col" data-unique-id="bb0ee2e5-5a4b-4c50-9566-01e5c05db08c" data-file-name="components/recipe-detail.tsx">
          <div className="relative h-48 sm:h-56 md:h-80" data-unique-id="e7b706fc-d717-4a00-84fa-4f4fd00a043c" data-file-name="components/recipe-detail.tsx">
            <Image src={recipe.image} alt={recipe.title} fill className="object-cover" sizes="(max-width: 768px) 95vw, (max-width: 1200px) 80vw, 1200px" data-unique-id="96c0bc6f-b813-44d5-ba9a-a431875ebc78" data-file-name="components/recipe-detail.tsx" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" data-unique-id="d210b46b-f08f-4e4a-8518-99d85d0e67ea" data-file-name="components/recipe-detail.tsx"></div>
            
            <button onClick={onClose} className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-card/80 backdrop-blur-sm rounded-full p-2 hover:bg-card transition-colors z-10" aria-label="Close recipe" data-unique-id="2fc388bd-1473-4c08-a5b9-b9b9ed48838f" data-file-name="components/recipe-detail.tsx">
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            
            <div className="absolute bottom-2 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4" data-unique-id="e8b8676d-f798-42c6-ab0c-e0f990935c41" data-file-name="components/recipe-detail.tsx">
              <div className="flex flex-wrap gap-1 sm:gap-2 mb-1 sm:mb-2" data-unique-id="642f45b5-6040-4d4a-a575-7ccecd5904ad" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">
                <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full" data-unique-id="862ab94e-55b4-4759-b5d9-937447cc1007" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">
                  {recipe.matchPercentage}<span className="editable-text" data-unique-id="023202ba-fd3b-4d0c-ad93-1960f1774d5d" data-file-name="components/recipe-detail.tsx">% match
                </span></span>
                <span className="bg-secondary text-secondary-foreground text-xs font-medium px-2 py-1 rounded-full" data-unique-id="799abfaa-7554-4865-921b-954fc932b577" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">
                  {recipe.cuisine}
                </span>
                {recipe.tags.slice(0, 2).map((tag, i) => <span key={i} className="bg-muted text-muted-foreground text-xs font-medium px-2 py-1 rounded-full" data-unique-id="798f1f1a-69ca-473b-850c-d460af685330" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">
                    {tag}
                  </span>)}
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-card-foreground line-clamp-2" data-unique-id="f470a09c-f7f5-4c09-80cb-a023182bb128" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">{recipe.title}</h2>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-between p-3 sm:p-4 border-b border-border" data-unique-id="063c5be2-acc4-43c9-8de1-390d5fe5e738" data-file-name="components/recipe-detail.tsx">
            <div className="flex flex-wrap gap-3 sm:gap-4" data-unique-id="cb01a475-a9b5-48c6-a423-2411be8716f1" data-file-name="components/recipe-detail.tsx">
              <div className="flex items-center gap-1" data-unique-id="fa600072-c18f-466f-a632-d596af5ca9c3" data-file-name="components/recipe-detail.tsx">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm" data-unique-id="94cd71b6-35f4-4cbf-ac80-35e6cae96118" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">{recipe.cookTime}<span className="editable-text" data-unique-id="be012033-afb0-4304-8659-0ae1477e184a" data-file-name="components/recipe-detail.tsx"> min</span></span>
              </div>
              <div className="flex items-center gap-1" data-unique-id="1a4f9236-d62c-400d-bad1-f24e61f7d1f5" data-file-name="components/recipe-detail.tsx">
                <Utensils className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm capitalize" data-unique-id="fa61af33-40ee-44ed-b270-54fbab268d28" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">{recipe.difficulty}</span>
              </div>
              <div className="flex items-center gap-1" data-unique-id="cd4eb521-4c07-4414-bc58-f72ad7a75457" data-file-name="components/recipe-detail.tsx">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm" data-unique-id="793377a2-430f-41ee-b44a-4a70b3b3a3fe" data-file-name="components/recipe-detail.tsx"><span className="editable-text" data-unique-id="b5388dcb-8aa3-4f64-825f-33116b3d0c73" data-file-name="components/recipe-detail.tsx">2 servings</span></span>
              </div>
            </div>
            
            <div className="flex gap-2 mt-2 sm:mt-0" data-unique-id="fa3bbb22-ef2d-4ed3-b7eb-fbdb9333b16d" data-file-name="components/recipe-detail.tsx">
              <button onClick={handleAddToFavorites} className={cn("p-2 rounded-full hover:bg-muted transition-colors", isFavorite && "text-primary")} aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"} data-unique-id="b62e3347-e182-4e16-ab1d-322cf3ad2c42" data-file-name="components/recipe-detail.tsx">
                <Heart className={cn("w-5 h-5", isFavorite && "fill-primary")} />
              </button>
              <button onClick={handleShare} className="p-2 rounded-full hover:bg-muted transition-colors" aria-label="Share recipe" data-unique-id="95902c72-5f88-4f69-82e8-a017e41ec6af" data-file-name="components/recipe-detail.tsx">
                <Share className="w-5 h-5" />
              </button>
            </div>
          </div>
      
          <div className="flex border-b border-border" data-unique-id="fe79c4ec-70d2-4422-8773-5f9d53ce9a1c" data-file-name="components/recipe-detail.tsx">
            <button onClick={() => setActiveTab('ingredients')} className={cn("flex-1 py-2 sm:py-3 text-center font-medium transition-colors text-sm sm:text-base", activeTab === 'ingredients' ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")} data-unique-id="d0c63f6a-7792-45a7-b127-d3a05df124f5" data-file-name="components/recipe-detail.tsx"><span className="editable-text" data-unique-id="52ed1a7c-5f9b-4add-ae74-5ad6d181bc86" data-file-name="components/recipe-detail.tsx">
              Ingredients
            </span></button>
            <button onClick={() => setActiveTab('instructions')} className={cn("flex-1 py-2 sm:py-3 text-center font-medium transition-colors text-sm sm:text-base", activeTab === 'instructions' ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")} data-unique-id="1f67e229-5da4-4351-b3fb-bc6612b18a8e" data-file-name="components/recipe-detail.tsx"><span className="editable-text" data-unique-id="94fc9ad7-de97-42bd-8734-1a39f780da64" data-file-name="components/recipe-detail.tsx">
              Instructions
            </span></button>
          </div>
      
          <div className="flex-1 overflow-y-auto p-3 sm:p-4" data-unique-id="c1c2a8a8-e3ee-4f79-8f7c-948865a57603" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">
            {activeTab === 'ingredients' && <div className="space-y-3 sm:space-y-4" data-unique-id="b53abf53-bbdc-49ad-8217-587f43d13bc2" data-file-name="components/recipe-detail.tsx">
                <p className="text-sm sm:text-base text-muted-foreground" data-unique-id="5f9410e4-4746-4e23-a2fc-4d7e2c7cc503" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">{recipe.description}</p>
                
                <h3 className="font-medium text-base sm:text-lg" data-unique-id="d1f638ae-7db2-43b9-8dd8-1325a80a3c66" data-file-name="components/recipe-detail.tsx"><span className="editable-text" data-unique-id="d292e699-0383-4204-992a-531489945453" data-file-name="components/recipe-detail.tsx">Ingredients</span></h3>
                <ul className="space-y-2" data-unique-id="6cab5e04-4afb-4eb2-9566-485c8499a870" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">
                  {recipe.ingredients.map((ingredient, index) => <li key={index} className="flex items-center gap-2 text-sm sm:text-base" data-unique-id="59287c93-6ab1-4f3d-b30e-90578a9eb652" data-file-name="components/recipe-detail.tsx">
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" data-unique-id="fd482963-04f7-4962-9cc6-ee760b0bf3a4" data-file-name="components/recipe-detail.tsx"></div>
                      <span data-unique-id="e94da93a-6dad-457e-a43e-5fded0691a03" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">
                        {ingredient.quantity && ingredient.unit ? `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}` : ingredient.name}
                      </span>
                    </li>)}
                </ul>
              </div>}
            
            {activeTab === 'instructions' && <div className="space-y-3 sm:space-y-4" data-unique-id="468ae899-ae7a-4684-8b48-3c68da0f184e" data-file-name="components/recipe-detail.tsx">
                <div className="flex justify-between items-center" data-unique-id="449a6bf3-f67e-484c-8251-2a4048bb1199" data-file-name="components/recipe-detail.tsx">
                  <h3 className="font-medium text-base sm:text-lg" data-unique-id="148bb2c3-9c84-411e-9444-9c4a09376b47" data-file-name="components/recipe-detail.tsx"><span className="editable-text" data-unique-id="eb0ef393-8705-4701-98b4-0855fccda1f1" data-file-name="components/recipe-detail.tsx">Step by Step</span></h3>
                  <div className="text-xs sm:text-sm text-muted-foreground" data-unique-id="7a10974a-0b43-4828-99fb-f56896e8dd9a" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">
                    {currentStep + 1}<span className="editable-text" data-unique-id="f5e9f3e4-12c2-4ab9-9cfa-5aaf3d297330" data-file-name="components/recipe-detail.tsx"> of </span>{recipe.steps.length}
                  </div>
                </div>
                
                <motion.button whileHover={{
            scale: 1.02
          }} whileTap={{
            scale: 0.98
          }} onClick={startCookingMode} className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg py-3 mb-4 flex items-center justify-center gap-2 hover:shadow-md transition-all" data-unique-id="77afca75-32ee-43f9-be54-fb7b8bad3ec1" data-file-name="components/recipe-detail.tsx">
                  <PlayCircle className="w-5 h-5" />
                  <span className="font-medium" data-unique-id="7c4adb41-e479-48fe-b125-d16c80ac34d3" data-file-name="components/recipe-detail.tsx"><span className="editable-text" data-unique-id="25c9d566-5426-4084-9040-6fcac2da9ab5" data-file-name="components/recipe-detail.tsx">Start Cooking Mode</span></span>
                </motion.button>
                
                <div className="bg-muted rounded-lg p-3 sm:p-4" data-unique-id="30f1075f-b314-43e7-9d7b-efa03336c90d" data-file-name="components/recipe-detail.tsx">
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
            }} className="min-h-[80px] sm:min-h-[100px]" data-unique-id="07c27d53-30b0-40cc-b677-2fe622723c1a" data-file-name="components/recipe-detail.tsx">
                    <div className="flex items-start gap-2 sm:gap-3" data-unique-id="f06920d0-6340-4c36-b4e7-016c1da5c81a" data-file-name="components/recipe-detail.tsx">
                      <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center flex-shrink-0" data-unique-id="a8b3ef0a-ba3d-4249-84fa-664490283709" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">
                        {currentStep + 1}
                      </div>
                      <p className="text-sm sm:text-base" data-unique-id="cb21d3f5-d004-456d-9290-51f3291367d8" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">{recipe.steps[currentStep]}</p>
                    </div>
                  </motion.div>
                  
                  <div className="flex justify-between mt-4 sm:mt-6" data-unique-id="e545bb1e-6c46-417c-a339-18c4dbd3179c" data-file-name="components/recipe-detail.tsx">
                    <button onClick={handlePreviousStep} disabled={currentStep === 0} className={cn("px-3 py-1.5 sm:px-4 sm:py-2 text-sm rounded-lg border border-border hover:bg-muted/80 transition-colors", currentStep === 0 && "opacity-50 cursor-not-allowed")} data-unique-id="80c58e25-611f-4c45-9f2f-6937fb87d232" data-file-name="components/recipe-detail.tsx"><span className="editable-text" data-unique-id="8927cd7a-0c16-4da6-9ff3-21be41167150" data-file-name="components/recipe-detail.tsx">
                      Previous
                    </span></button>
                    
                    <button onClick={handleNextStep} disabled={currentStep === recipe.steps.length - 1} className={cn("px-3 py-1.5 sm:px-4 sm:py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1", currentStep === recipe.steps.length - 1 && "opacity-50 cursor-not-allowed")} data-unique-id="0fb5bbf6-6178-4f3d-a02c-c3bca1abea36" data-file-name="components/recipe-detail.tsx">
                      <span data-unique-id="a66e3372-ee4c-49b1-8ad9-327507c14750" data-file-name="components/recipe-detail.tsx"><span className="editable-text" data-unique-id="22961554-5302-4703-9487-1c5859a47985" data-file-name="components/recipe-detail.tsx">Next</span></span>
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 sm:mt-6" data-unique-id="97a78af7-648f-4451-800e-5101a2d4fc62" data-file-name="components/recipe-detail.tsx">
                  <h4 className="font-medium text-sm sm:text-base mb-2" data-unique-id="ad0b8e60-5760-4316-8310-713f7f39dea2" data-file-name="components/recipe-detail.tsx"><span className="editable-text" data-unique-id="ab0ab9ac-c126-4590-af86-0e53f6fe4569" data-file-name="components/recipe-detail.tsx">All Steps</span></h4>
                  <div className="space-y-2 sm:space-y-3" data-unique-id="6039593f-706b-4878-a577-02dcaf702346" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">
                    {recipe.steps.map((step, index) => <button key={index} onClick={() => setCurrentStep(index)} className={cn("w-full text-left p-2 sm:p-3 rounded-lg border border-border hover:border-primary transition-colors flex items-start gap-1.5 sm:gap-2", currentStep === index && "border-primary bg-primary/5")} data-unique-id="ea5563ff-8baa-4b87-b7b8-a38a1406a84d" data-file-name="components/recipe-detail.tsx">
                        <div className={cn("rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center flex-shrink-0", currentStep === index ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")} data-unique-id="b6c1be0f-c28d-4642-af4d-1ebfa8ae67c9" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">
                          {index + 1}
                        </div>
                        <p className="text-xs sm:text-sm line-clamp-1" data-unique-id="27f80bd4-1721-4554-a1cd-421066b2626d" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">{step}</p>
                      </button>)}
                  </div>
                </div>
              </div>}
          </div>
        </div>}
    </>;
}