"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ChefHat, Filter, Clock, Utensils, X } from 'lucide-react';
import { useIngredientStore } from '@/store/ingredient-store';
import { useUserPreferencesStore } from '@/store/user-preferences-store';
import { useRecipeStore } from '@/store/recipe-store';
import { generateRecipes } from '@/lib/services/recipe-generation';
import { AIProviderSelector } from './ai-provider-selector';
import { ApiUsageInfo } from './api-usage-info';
import { ModelProvider } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
export function RecipeGenerator() {
  // Format provider name for display
  const formatProviderName = (provider: string): string => {
    return provider.replace('azure-', '').replace('-bedrock', '').split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  const {
    ingredients
  } = useIngredientStore();
  const {
    preferences
  } = useUserPreferencesStore();
  const {
    suggestedRecipes,
    setSuggestedRecipes,
    isLoading,
    setIsLoading
  } = useRecipeStore();
  const [selectedProvider, setSelectedProvider] = useState<ModelProvider>("azure-gpt-4o");
  const [showFilters, setShowFilters] = useState(false);
  const [cuisineType, setCuisineType] = useState<string>('');
  const [mealType, setMealType] = useState<string>('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | ''>('');
  const [maxCookingTime, setMaxCookingTime] = useState<number>(60);
  const [servings, setServings] = useState<number>(2);
  const [dietaryPreference, setDietaryPreference] = useState<'veg' | 'non-veg'>('veg');
  const handleGenerateRecipes = async () => {
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
        servings: servings || undefined
      }, selectedProvider);
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
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  const resetFilters = () => {
    setCuisineType('');
    setMealType('');
    setDifficulty('');
    setMaxCookingTime(60);
    setServings(2);
    setDietaryPreference('veg');
  };
  return <div className="bg-card rounded-2xl p-6 shadow-sm dark:shadow-primary/5 border border-border" data-unique-id="d437d8a8-f6d1-43ad-9381-e83748e3a936" data-file-name="components/recipe-generator.tsx">
      <div className="flex flex-col gap-4" data-unique-id="be02f180-cda1-4759-8738-b40359f0ec4f" data-file-name="components/recipe-generator.tsx" data-dynamic-text="true">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3" data-unique-id="fbd0fe1b-f57b-4183-853b-f1dc9836af4f" data-file-name="components/recipe-generator.tsx">
          <h3 className="text-xl font-bold" data-unique-id="c678b60c-3ba6-4cbd-9605-12221fde1f8d" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="949b3eb4-2654-45b8-b052-d808eb41fb8e" data-file-name="components/recipe-generator.tsx">Generate Recipes</span></h3>
          <div className="flex lg:flex-row flex-col items-center gap-3" data-unique-id="09cebf9c-b989-46b9-8430-224ef1bd5aff" data-file-name="components/recipe-generator.tsx">
            <ApiUsageInfo provider={formatProviderName(selectedProvider)} />
            <AIProviderSelector currentProvider={selectedProvider} onProviderChange={setSelectedProvider} />
          </div>
        </div>
        
        
        
        <p className="text-muted-foreground" data-unique-id="b7bb7088-349d-4aa5-813e-228619b3d10d" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="f8d054a2-4f02-449c-8d92-577427682d20" data-file-name="components/recipe-generator.tsx">
          Let our AI chef create personalized recipes based on your ingredients and preferences
        </span></p>
        
        
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
        }} className="overflow-hidden" data-unique-id="3a804ef4-1a16-4f26-8047-5120886fc1b7" data-file-name="components/recipe-generator.tsx">
              <div className=" pt-4" data-unique-id="03c0b713-f84c-453e-ae36-ec137e35e2ae" data-file-name="components/recipe-generator.tsx">
                <div className="flex justify-between items-center mb-4" data-unique-id="d1c24499-8f8a-485f-9e18-69940ae72274" data-file-name="components/recipe-generator.tsx">
                  <h4 className="font-medium" data-unique-id="79554830-f66c-4382-8a47-4ccff40abf6b" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="275c7e29-32ae-41fb-abe5-5eb513d47393" data-file-name="components/recipe-generator.tsx">Recipe Filters</span></h4>
                  <button onClick={resetFilters} className="text-sm text-primary hover:text-primary/80 transition-colors" data-unique-id="e36dddaf-f99d-4281-9299-73272118f2e6" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="f834492d-55e7-4630-b13e-7ad492af5178" data-file-name="components/recipe-generator.tsx">
                    Reset
                  </span></button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-unique-id="0329df6b-d259-4d9c-ba62-d5737a9a071e" data-file-name="components/recipe-generator.tsx">
                  <div className="space-y-2" data-unique-id="efe01aef-af06-4c59-a6b3-16cc8b2db2e0" data-file-name="components/recipe-generator.tsx">
                    <label className="block text-sm font-medium" data-unique-id="fb23304c-fb6f-4940-a20f-3a0dd77abf95" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="de959180-b3a2-4af3-b20d-fcc0333dc570" data-file-name="components/recipe-generator.tsx">Cuisine Type</span></label>
                    <select value={cuisineType} onChange={e => setCuisineType(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-input-background dark:bg-input border border-border outline-none focus:ring-2 focus:ring-primary/20" data-unique-id="13df807b-e9cd-415c-8d78-ee924392818d" data-file-name="components/recipe-generator.tsx">
                      <option value="" data-unique-id="257e207b-5c00-48eb-877b-366b1fc932b0" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="01b5e389-d069-4247-b128-b04a9401b4f9" data-file-name="components/recipe-generator.tsx">Any Cuisine</span></option>
                      <option value="Italian" data-unique-id="eb04e121-b0df-4cd5-99cf-0a3d2c90fd3c" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="a306596f-5ba9-45a6-845b-44c7cb863878" data-file-name="components/recipe-generator.tsx">Italian</span></option>
                      <option value="Mexican" data-unique-id="b4d674f1-ed1d-4c9a-9722-0b0f9705e509" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="ec08a2f6-4fe5-49aa-b0ef-80c1591d2f32" data-file-name="components/recipe-generator.tsx">Mexican</span></option>
                      <option value="Asian" data-unique-id="2193ccef-c3ff-4126-84ad-1c18db107c67" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="eafbc6c7-52bd-4cff-ac16-8fede0d7cc2e" data-file-name="components/recipe-generator.tsx">Asian</span></option>
                      <option value="Indian" data-unique-id="3349f467-cc35-416f-b22b-8ab9c92a606a" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="3eaefb3f-2613-44ef-81f5-ae20ffd9844c" data-file-name="components/recipe-generator.tsx">Indian</span></option>
                      <option value="Mediterranean" data-unique-id="53a14a58-52eb-441a-ac05-78f032412bcb" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="4975ff2c-7413-424c-a05f-200b9a931ec7" data-file-name="components/recipe-generator.tsx">Mediterranean</span></option>
                      <option value="American" data-unique-id="ecfb2613-37ac-414b-9e47-02102a9beb05" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="a2423acb-e0c9-4391-af6e-1bbfcdf04a77" data-file-name="components/recipe-generator.tsx">American</span></option>
                    </select>
                  </div>
                  
                  <div className="space-y-2" data-unique-id="9444981d-6b61-484d-aaa7-1515d0dac826" data-file-name="components/recipe-generator.tsx">
                    <label className="block text-sm font-medium" data-unique-id="01548f8f-29ef-45e1-8b2f-7575a5fd6086" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="4d0568b3-0bff-4838-9e84-40881dffd00d" data-file-name="components/recipe-generator.tsx">Meal Type</span></label>
                    <select value={mealType} onChange={e => setMealType(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-input-background dark:bg-input border border-border outline-none focus:ring-2 focus:ring-primary/20" data-unique-id="61173c93-e9f0-432f-849b-e702a7489a21" data-file-name="components/recipe-generator.tsx">
                      <option value="" data-unique-id="1a004d73-332e-4e61-b5d1-76f58fbbd1e4" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="d2f3834a-dd60-4138-8a30-111adbabcf13" data-file-name="components/recipe-generator.tsx">Any Meal</span></option>
                      <option value="Breakfast" data-unique-id="419e3fe1-8291-4d94-892e-a63fab65cebd" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="296aea41-f10e-4d79-a8fe-472141bcc4b3" data-file-name="components/recipe-generator.tsx">Breakfast</span></option>
                      <option value="Lunch" data-unique-id="aa66ccda-d0be-4827-9e59-0acb6e2f80ba" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="7318f91a-a1c4-4851-8e49-055873bc8584" data-file-name="components/recipe-generator.tsx">Lunch</span></option>
                      <option value="Dinner" data-unique-id="aabd5e29-2bf2-412c-b480-94ac464a671a" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="ec2c338a-b0c2-4129-a223-12ab23bef668" data-file-name="components/recipe-generator.tsx">Dinner</span></option>
                      <option value="Dessert" data-unique-id="ac082ea2-1ec4-4d98-8d25-375dc7b618c9" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="f9b0500a-dccc-4d66-b67b-b11465fb59cc" data-file-name="components/recipe-generator.tsx">Dessert</span></option>
                      <option value="Snack" data-unique-id="c6582671-9106-4396-ad73-5ad732aeab66" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="88e85f90-5900-44ce-82ec-1461126a420b" data-file-name="components/recipe-generator.tsx">Snack</span></option>
                    </select>
                  </div>
                  
                  <div className="space-y-2" data-unique-id="6c156a75-4a56-4553-82c8-6a24a08aafdc" data-file-name="components/recipe-generator.tsx">
                    <label className="block text-sm font-medium" data-unique-id="161ed408-5414-4d79-b36d-72e1cf40fcce" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="657bf4d5-28c1-4288-b8b3-ed0be22f1a54" data-file-name="components/recipe-generator.tsx">Difficulty</span></label>
                    <select value={difficulty} onChange={e => setDifficulty(e.target.value as any)} className="w-full px-3 py-2 rounded-lg bg-input-background dark:bg-input border border-border outline-none focus:ring-2 focus:ring-primary/20" data-unique-id="311922c0-e2c3-41cf-a7c5-fd006be114e7" data-file-name="components/recipe-generator.tsx">
                      <option value="" data-unique-id="2815bd4f-9aa8-4370-8d62-8affcf14d65c" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="e14214ab-4b13-475c-a811-c0bc34dff018" data-file-name="components/recipe-generator.tsx">Any Difficulty</span></option>
                      <option value="easy" data-unique-id="49a6a77e-a16f-48be-973d-bc9bc1a6e028" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="a349a568-ad0b-41bc-8f6b-a7b09fbfa7f1" data-file-name="components/recipe-generator.tsx">Easy</span></option>
                      <option value="medium" data-unique-id="f5b1dcaa-8093-4559-805a-8570dd908055" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="67661ee8-b5ff-485a-bb5a-a9101b5d1973" data-file-name="components/recipe-generator.tsx">Medium</span></option>
                      <option value="hard" data-unique-id="eae6f40b-aa36-43ff-b7a1-e80bfecd1872" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="1b1f50f5-b65a-4335-9c27-1ce207cda616" data-file-name="components/recipe-generator.tsx">Hard</span></option>
                    </select>
                  </div>
                  
                  <div className="space-y-2" data-unique-id="762e730a-d444-4537-bc3e-4c9fc5d397be" data-file-name="components/recipe-generator.tsx">
                    <label className="block text-sm font-medium" data-unique-id="97120aa4-bc03-44e8-ae16-e279b88e5f7c" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="e282a31a-08fd-4912-881b-c89b08e74137" data-file-name="components/recipe-generator.tsx">Max Cooking Time (minutes)</span></label>
                    <div className="flex items-center gap-2" data-unique-id="83b6096d-7499-453a-af47-76e2b167cda5" data-file-name="components/recipe-generator.tsx">
                      <input type="range" min="15" max="120" step="5" value={maxCookingTime} onChange={e => setMaxCookingTime(parseInt(e.target.value))} className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary" data-unique-id="79328a23-bbf2-48cf-a800-e6298eb67efb" data-file-name="components/recipe-generator.tsx" />
                      <span className="w-12 text-center" data-unique-id="a1afba34-4aba-45b1-8e8b-80cbcffc4467" data-file-name="components/recipe-generator.tsx" data-dynamic-text="true">{maxCookingTime}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 flex flex-row gap-4  items-center justify-start" data-unique-id="2542a473-c617-48c5-ac19-f457076c074d" data-file-name="components/recipe-generator.tsx">
                    <label className="block text-sm font-medium" data-unique-id="93a8b215-108e-4e0d-955e-8a48f34077e1" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="0ea2eff3-dad0-4c40-90e4-5c692d976122" data-file-name="components/recipe-generator.tsx">Servings:</span></label>
                    <div className="flex items-center" data-unique-id="c7d0af4c-2eba-429e-be09-039f97267aab" data-file-name="components/recipe-generator.tsx">
                      <button onClick={() => setServings(Math.max(1, servings - 1))} className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-l-lg border border-border" data-unique-id="94997718-fdab-404d-b19d-f1371d91677e" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="3a4e1c77-4c52-4e53-aa4e-f4445b3b8d85" data-file-name="components/recipe-generator.tsx">
                        -
                      </span></button>
                      <div className="px-4 py-2 border-t border-b border-border bg-input-background dark:bg-input" data-unique-id="494455d3-fc85-44bf-9775-eff11251d9e5" data-file-name="components/recipe-generator.tsx" data-dynamic-text="true">
                        {servings}
                      </div>
                      <button onClick={() => setServings(servings + 1)} className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-r-lg border border-border" data-unique-id="2c97f5ef-4da1-4dd4-8f1b-7c2a726fbde6" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="18ec3917-4ec9-4a82-9298-4e5ddeff7715" data-file-name="components/recipe-generator.tsx">
                        +
                      </span></button>
                    </div>
                  </div>

                  {/* Dietary Preference Toggle */}
        <div className="flex items-center justify-start gap-4" data-unique-id="2389544a-ea8b-4f01-b0a1-1974cc7cf6f2" data-file-name="components/recipe-generator.tsx">
          <span className="text-sm font-medium" data-unique-id="c6950b1b-9420-4d6e-bf7e-f820cb0d72ea" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="f0c0a921-c8ed-470b-8a93-3a7a659055c2" data-file-name="components/recipe-generator.tsx">Dietary Preference:</span></span>
          <div className="flex items-center bg-background rounded-full p-1 border border-border" data-unique-id="d5d196ae-24a6-49e1-983c-021a38916250" data-file-name="components/recipe-generator.tsx">
            <button onClick={() => setDietaryPreference('veg')} className={cn("lg:px-4 lg:py-2 px-2 py-1 rounded-full text-sm font-medium transition-all flex items-center gap-2", dietaryPreference === 'veg' ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")} data-unique-id="3e82b9a0-d796-4b0f-bfcd-2033511697ec" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="5375a408-ac5f-44bd-a2aa-ddfbb0bb6f03" data-file-name="components/recipe-generator.tsx">
              Veg
            </span></button>
            <button onClick={() => setDietaryPreference('non-veg')} className={cn("lg:px-4 lg:py-2 px-2 py-1 rounded-full text-sm font-medium transition-all flex items-center gap-2", dietaryPreference === 'non-veg' ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")} data-unique-id="37bc9331-e89f-4b56-8f58-2885ef61cd8e" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="9abb67d1-c03a-4290-a6f5-9fb19709a4eb" data-file-name="components/recipe-generator.tsx">
              Non-Veg
            </span></button>
          </div>
        </div>
                </div>
              </div>
            </motion.div>
        </AnimatePresence>
        
        {ingredients.length === 0 && <div className="text-center py-4 text-muted-foreground" data-unique-id="84e7d7f8-31fb-40fc-944a-60bbed460e8c" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="c63be9e7-4c65-4ec9-b83a-9abd5421a5ba" data-file-name="components/recipe-generator.tsx">
            Add some ingredients to generate recipe suggestions
          </span></div>}
      </div>
      <div className="flex flex-wrap gap-2 mt-6 items-center" data-unique-id="d3aeb203-d536-45d3-af63-f4bb406a5b21" data-file-name="components/recipe-generator.tsx">
          
          
          <div className="flex-1" data-unique-id="47bf11f4-6831-41a4-bfbd-13634a65f3fd" data-file-name="components/recipe-generator.tsx"></div>
          
          <motion.button whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }} onClick={handleGenerateRecipes} disabled={isLoading || ingredients.length === 0} className={cn("flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors", (isLoading || ingredients.length === 0) && "opacity-50 cursor-not-allowed")} data-unique-id="0fcd2cc0-8df7-434a-bbb0-72c48af3bae8" data-file-name="components/recipe-generator.tsx" data-dynamic-text="true">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChefHat className="w-5 h-5" />}
            <span data-unique-id="d9a7d744-786f-4a36-a168-c4d5a2cb35be" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="dc56bc3d-0de5-4554-885b-7460a1ee700c" data-file-name="components/recipe-generator.tsx">Generate Recipes</span></span>
          </motion.button>
        </div>
    </div>;
}