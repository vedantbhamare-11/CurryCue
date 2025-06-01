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
      {cookingModeActive ? <CookingMode recipe={recipe} onClose={closeCookingMode} /> : <div className="bg-card rounded-2xl overflow-hidden shadow-lg border border-border w-[95%] max-w-4xl max-h-[90vh] flex flex-col" data-unique-id="904ce06e-f277-4f58-84c3-2fa7401141fb" data-file-name="components/recipe-detail.tsx">
          <div className="relative h-48 sm:h-56 md:h-80" data-unique-id="c56d7b03-212e-4889-9658-b88c11cf0f18" data-file-name="components/recipe-detail.tsx">
            <Image src={recipe.image} alt={recipe.title} fill className="object-cover" sizes="(max-width: 768px) 95vw, (max-width: 1200px) 80vw, 1200px" data-unique-id="0982f0dd-71b4-4faa-9b4c-07269dba64cf" data-file-name="components/recipe-detail.tsx" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" data-unique-id="a63744ff-1179-4713-aaa5-a68148187b81" data-file-name="components/recipe-detail.tsx"></div>
            
            <button onClick={onClose} className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-card/80 backdrop-blur-sm rounded-full p-2 hover:bg-card transition-colors z-10" aria-label="Close recipe" data-unique-id="f60ef516-476c-4bac-80bd-d45d19ae9e68" data-file-name="components/recipe-detail.tsx">
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            
            <div className="absolute bottom-2 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4" data-unique-id="f099073b-3a08-4498-be55-b351d3145f79" data-file-name="components/recipe-detail.tsx">
              <div className="flex flex-wrap gap-1 sm:gap-2 mb-1 sm:mb-2" data-unique-id="98fffdbd-7622-4278-95d4-daff9208668e" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">
                <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full" data-unique-id="6eebea83-951c-4813-9a78-6f7a6798d5de" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">
                  {recipe.matchPercentage}<span className="editable-text" data-unique-id="cb11e7a0-43bc-40e6-975d-b717a490a48e" data-file-name="components/recipe-detail.tsx">% match
                </span></span>
                <span className="bg-secondary text-secondary-foreground text-xs font-medium px-2 py-1 rounded-full" data-unique-id="4d777b8e-72b1-4427-a766-8acba138bf68" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">
                  {recipe.cuisine}
                </span>
                {recipe.tags.slice(0, 2).map((tag, i) => <span key={i} className="bg-muted text-muted-foreground text-xs font-medium px-2 py-1 rounded-full" data-unique-id="9907a99c-0056-4760-b3a3-ec2df2d3a163" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">
                    {tag}
                  </span>)}
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-card-foreground line-clamp-2" data-unique-id="7063b796-67d2-436b-88f6-eebc9f2e24a7" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">{recipe.title}</h2>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-between p-3 sm:p-4 border-b border-border" data-unique-id="1086c769-2405-442b-98b7-a5da8384fb6b" data-file-name="components/recipe-detail.tsx">
            <div className="flex flex-wrap gap-3 sm:gap-4" data-unique-id="c6a50cf5-4e79-40e6-b3ce-f3567263c3d8" data-file-name="components/recipe-detail.tsx">
              <div className="flex items-center gap-1" data-unique-id="c93f7127-2ae6-4d0d-ac8c-3dfd8793790b" data-file-name="components/recipe-detail.tsx">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm" data-unique-id="626843a5-8111-4a8f-8ca5-f4291531bb2f" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">{recipe.cookTime}<span className="editable-text" data-unique-id="b0c4130c-90fb-4810-a1a7-41be67301a2e" data-file-name="components/recipe-detail.tsx"> min</span></span>
              </div>
              <div className="flex items-center gap-1" data-unique-id="e8fb8787-7bf5-4713-876f-04a93f253377" data-file-name="components/recipe-detail.tsx">
                <Utensils className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm capitalize" data-unique-id="bddb61d3-a2f0-4495-92ec-2ee07010fe6f" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">{recipe.difficulty}</span>
              </div>
              <div className="flex items-center gap-1" data-unique-id="3423400c-5a45-46c6-b456-0e4fe1872451" data-file-name="components/recipe-detail.tsx">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm" data-unique-id="c4852c2c-4252-417b-b0de-50b1d6097bdf" data-file-name="components/recipe-detail.tsx"><span className="editable-text" data-unique-id="e6a369d2-4570-4fae-bb75-a04f616a9cf5" data-file-name="components/recipe-detail.tsx">2 servings</span></span>
              </div>
            </div>
            
            <div className="flex gap-2 mt-2 sm:mt-0" data-unique-id="52bb6e18-8999-4da9-9d8b-5d407eeb985c" data-file-name="components/recipe-detail.tsx">
              <button onClick={handleAddToFavorites} className={cn("p-2 rounded-full hover:bg-muted transition-colors", isFavorite && "text-primary")} aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"} data-unique-id="a8170b43-2f9d-45bb-9bf5-cec9d28aa9a4" data-file-name="components/recipe-detail.tsx">
                <Heart className={cn("w-5 h-5", isFavorite && "fill-primary")} />
              </button>
              <button onClick={handleShare} className="p-2 rounded-full hover:bg-muted transition-colors" aria-label="Share recipe" data-unique-id="d6a915ec-962b-4325-a97f-224ccf62ae88" data-file-name="components/recipe-detail.tsx">
                <Share className="w-5 h-5" />
              </button>
            </div>
          </div>
      
          <div className="flex border-b border-border" data-unique-id="9626244f-6a22-49eb-9c6f-394dc48affdc" data-file-name="components/recipe-detail.tsx">
            <button onClick={() => setActiveTab('ingredients')} className={cn("flex-1 py-2 sm:py-3 text-center font-medium transition-colors text-sm sm:text-base", activeTab === 'ingredients' ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")} data-unique-id="ca88084e-6eb6-42f8-ac5f-b61e3829bf9c" data-file-name="components/recipe-detail.tsx"><span className="editable-text" data-unique-id="cfcdcb32-870a-4221-a0e9-d9d3de8d51da" data-file-name="components/recipe-detail.tsx">
              Ingredients
            </span></button>
            <button onClick={() => setActiveTab('instructions')} className={cn("flex-1 py-2 sm:py-3 text-center font-medium transition-colors text-sm sm:text-base", activeTab === 'instructions' ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")} data-unique-id="7b7067bb-2a4d-4d25-967d-90e273c9f88b" data-file-name="components/recipe-detail.tsx"><span className="editable-text" data-unique-id="097e9f53-fa5c-4cd4-ab69-172a062c8888" data-file-name="components/recipe-detail.tsx">
              Instructions
            </span></button>
          </div>
      
          <div className="flex-1 overflow-y-auto p-3 sm:p-4" data-unique-id="0d6431aa-dbcf-4a1d-9f53-296dd82ceb56" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">
            {activeTab === 'ingredients' && <div className="space-y-3 sm:space-y-4" data-unique-id="35e15f03-559c-4b74-88bf-63bb182e4bdf" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">
                <p className="text-sm sm:text-base text-muted-foreground" data-unique-id="14802f06-b17c-40b6-a446-aa8f99f114cf" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">{recipe.description}</p>
                
                <h3 className="font-medium text-base sm:text-lg" data-unique-id="2857ae85-8463-4503-824c-906d880c15d4" data-file-name="components/recipe-detail.tsx"><span className="editable-text" data-unique-id="fe1802a5-5ae5-4f6d-a6a7-20095cdd2b44" data-file-name="components/recipe-detail.tsx">Ingredients</span></h3>
                
                {/* Used Ingredients from Inventory */}
                {recipe.usedIngredients && recipe.usedIngredients.length > 0 && <div className="mb-4" data-unique-id="2529314a-f589-4617-bf25-1d3f1392ded9" data-file-name="components/recipe-detail.tsx">
                    <h4 className="font-medium text-sm text-primary mb-2" data-unique-id="dee14a8f-3846-430c-8c02-54e09d420443" data-file-name="components/recipe-detail.tsx"><span className="editable-text" data-unique-id="59ba8c07-9aaa-4954-8270-533303e38fb1" data-file-name="components/recipe-detail.tsx">From Your Kitchen:</span></h4>
                    <ul className="space-y-2" data-unique-id="49c97204-3125-45c9-b3ed-21cd6f0c7dec" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">
                      {recipe.usedIngredients.map((ingredient, index) => <li key={index} className="flex items-center gap-2 text-sm sm:text-base" data-unique-id="443ee068-7a5b-45b9-9986-1054283d676c" data-file-name="components/recipe-detail.tsx">
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" data-unique-id="49abac48-f8ad-4d6e-937e-7d6ec8ff0f33" data-file-name="components/recipe-detail.tsx"></div>
                          <span data-unique-id="8d281586-c105-4e79-a33e-c64fd05f6a63" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">
                            {ingredient.quantity && ingredient.unit ? `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}` : ingredient.name}
                          </span>
                        </li>)}
                    </ul>
                  </div>}
                
                {/* Assumed Basic Ingredients */}
                {recipe.assumedIngredients && recipe.assumedIngredients.length > 0 && <div className="mb-4" data-unique-id="fb85fd16-c7b7-4822-9933-ef00a3e0b669" data-file-name="components/recipe-detail.tsx">
                    <h4 className="font-medium text-sm text-secondary mb-2" data-unique-id="8d4f7a53-6338-4eb4-bc42-49d5d223f3ff" data-file-name="components/recipe-detail.tsx"><span className="editable-text" data-unique-id="f2c32b7e-cd87-4a61-a082-177b582e10ef" data-file-name="components/recipe-detail.tsx">Basic Pantry Items (Assumed):</span></h4>
                    <ul className="space-y-2" data-unique-id="4a55b26e-012b-4cb4-bd85-60e2b4b295c6" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">
                      {recipe.assumedIngredients.map((ingredient, index) => <li key={index} className="flex items-center gap-2 text-sm sm:text-base opacity-75" data-unique-id="b9d5470a-4b45-4c53-aa04-e180c17325e5" data-file-name="components/recipe-detail.tsx">
                          <div className="w-2 h-2 rounded-full bg-secondary flex-shrink-0" data-unique-id="08139f82-c7cd-4135-9289-584b9de17306" data-file-name="components/recipe-detail.tsx"></div>
                          <span data-unique-id="3ac8e700-6f97-46bc-8453-c317175524b2" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">
                            {ingredient.quantity && ingredient.unit ? `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}` : ingredient.name}
                          </span>
                        </li>)}
                    </ul>
                  </div>}
                
                {/* Fallback to all ingredients if new format not available */}
                {(!recipe.usedIngredients || recipe.usedIngredients.length === 0) && (!recipe.assumedIngredients || recipe.assumedIngredients.length === 0) && <ul className="space-y-2" data-unique-id="bd35b497-d44d-424e-a531-e1acd86b50de" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">
                    {recipe.ingredients.map((ingredient, index) => <li key={index} className="flex items-center gap-2 text-sm sm:text-base" data-unique-id="34a61423-64fa-402c-8719-44ad09a52f7a" data-file-name="components/recipe-detail.tsx">
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" data-unique-id="74563d21-76cc-4bea-a720-31656f668652" data-file-name="components/recipe-detail.tsx"></div>
                        <span data-unique-id="030049a6-d05e-4e22-bef1-3057c20faa61" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">
                          {ingredient.quantity && ingredient.unit ? `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}` : ingredient.name}
                        </span>
                      </li>)}
                  </ul>}
              </div>}
            
            {activeTab === 'instructions' && <div className="space-y-3 sm:space-y-4" data-unique-id="24471c3c-af86-4e1a-ba35-42fe0b136def" data-file-name="components/recipe-detail.tsx">
                <div className="flex justify-between items-center" data-unique-id="13d19989-46e5-4976-bb9a-1be817e58cc4" data-file-name="components/recipe-detail.tsx">
                  <h3 className="font-medium text-base sm:text-lg" data-unique-id="8c5c6f1f-45de-4121-92c2-2d68584d7ce3" data-file-name="components/recipe-detail.tsx"><span className="editable-text" data-unique-id="7a922b6e-f041-481a-acca-c8fd2830d9a7" data-file-name="components/recipe-detail.tsx">Step by Step</span></h3>
                  <div className="text-xs sm:text-sm text-muted-foreground" data-unique-id="faa0b0cb-2a29-4ffd-92a3-6237b4230a92" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">
                    {currentStep + 1}<span className="editable-text" data-unique-id="aba423ba-ada8-410d-a88b-11cbd7c3b1c3" data-file-name="components/recipe-detail.tsx"> of </span>{recipe.steps.length}
                  </div>
                </div>
                
                <motion.button whileHover={{
            scale: 1.02
          }} whileTap={{
            scale: 0.98
          }} onClick={startCookingMode} className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg py-3 mb-4 flex items-center justify-center gap-2 hover:shadow-md transition-all" data-unique-id="f566a582-6f53-4eee-a000-d19925f9f075" data-file-name="components/recipe-detail.tsx">
                  <PlayCircle className="w-5 h-5" />
                  <span className="font-medium" data-unique-id="518d05f0-dde7-4edb-a291-b1dd90199258" data-file-name="components/recipe-detail.tsx"><span className="editable-text" data-unique-id="e7464ef6-d6d0-472f-ab01-73d6aa70bcdc" data-file-name="components/recipe-detail.tsx">Start Cooking Mode</span></span>
                </motion.button>
                
                <div className="bg-muted rounded-lg p-3 sm:p-4" data-unique-id="b51adebe-c896-4bcd-8248-d38bb14a4075" data-file-name="components/recipe-detail.tsx">
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
            }} className="min-h-[80px] sm:min-h-[100px]" data-unique-id="a3ef1aec-796f-40c9-a592-94ae51655d05" data-file-name="components/recipe-detail.tsx">
                    <div className="flex items-start gap-2 sm:gap-3" data-unique-id="b2b7bddb-27c2-4898-8438-dfedb02b0c00" data-file-name="components/recipe-detail.tsx">
                      <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center flex-shrink-0" data-unique-id="cf72557a-2e5c-4c9d-92ed-c90762fc4c92" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">
                        {currentStep + 1}
                      </div>
                      <p className="text-sm sm:text-base" data-unique-id="b80073ab-9081-47c0-b64e-9558344f9c8f" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">{recipe.steps[currentStep]}</p>
                    </div>
                  </motion.div>
                  
                  <div className="flex justify-between mt-4 sm:mt-6" data-unique-id="be4c1b51-f565-4e9b-ad2f-cb7584f5a085" data-file-name="components/recipe-detail.tsx">
                    <button onClick={handlePreviousStep} disabled={currentStep === 0} className={cn("px-3 py-1.5 sm:px-4 sm:py-2 text-sm rounded-lg border border-border hover:bg-muted/80 transition-colors", currentStep === 0 && "opacity-50 cursor-not-allowed")} data-unique-id="96368818-0203-4a68-86c9-2460e52d349d" data-file-name="components/recipe-detail.tsx"><span className="editable-text" data-unique-id="7033e6d7-d2e6-4bed-9614-df0a318173ec" data-file-name="components/recipe-detail.tsx">
                      Previous
                    </span></button>
                    
                    <button onClick={handleNextStep} disabled={currentStep === recipe.steps.length - 1} className={cn("px-3 py-1.5 sm:px-4 sm:py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1", currentStep === recipe.steps.length - 1 && "opacity-50 cursor-not-allowed")} data-unique-id="3a6bfb04-db8c-4f76-86f7-6634ea955db3" data-file-name="components/recipe-detail.tsx">
                      <span data-unique-id="f2a4c789-360e-4089-9c9c-01404c281050" data-file-name="components/recipe-detail.tsx"><span className="editable-text" data-unique-id="c7c963d6-17c4-4870-b92d-3c8d17188417" data-file-name="components/recipe-detail.tsx">Next</span></span>
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 sm:mt-6" data-unique-id="c1f05a5b-acb4-4520-90f3-f58eea006542" data-file-name="components/recipe-detail.tsx">
                  <h4 className="font-medium text-sm sm:text-base mb-2" data-unique-id="c4c01728-8373-468c-a53e-dba3824b75db" data-file-name="components/recipe-detail.tsx"><span className="editable-text" data-unique-id="ab3b5a28-24af-4efc-b326-4bf92d1a289e" data-file-name="components/recipe-detail.tsx">All Steps</span></h4>
                  <div className="space-y-2 sm:space-y-3" data-unique-id="7ff9c304-d289-4578-8c94-53abc6f3c699" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">
                    {recipe.steps.map((step, index) => <button key={index} onClick={() => setCurrentStep(index)} className={cn("w-full text-left p-2 sm:p-3 rounded-lg border border-border hover:border-primary transition-colors flex items-start gap-1.5 sm:gap-2", currentStep === index && "border-primary bg-primary/5")} data-unique-id="ceeeb533-b4d6-4c8e-8aa4-5ef90777f218" data-file-name="components/recipe-detail.tsx">
                        <div className={cn("rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center flex-shrink-0", currentStep === index ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")} data-unique-id="06857e2f-2161-44ab-bd05-bb48d4f1a7e7" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">
                          {index + 1}
                        </div>
                        <p className="text-xs sm:text-sm line-clamp-1" data-unique-id="f9af88af-a410-41a5-8c26-b7cdf890b7d4" data-file-name="components/recipe-detail.tsx" data-dynamic-text="true">{step}</p>
                      </button>)}
                  </div>
                </div>
              </div>}
          </div>
        </div>}
    </>;
}