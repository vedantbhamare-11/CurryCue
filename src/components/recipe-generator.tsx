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
  const handleGenerateRecipes = async () => {
    if (ingredients.length === 0) {
      toast.error("Please add some ingredients first");
      return;
    }
    setIsLoading(true);
    try {
      const recipes = await generateRecipes({
        ingredients,
        preferences,
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
  };
  return <div className="bg-card rounded-2xl p-6 shadow-sm dark:shadow-primary/5 border border-border" data-unique-id="cebf1c4a-24db-4764-870d-c35fcc4f8bea" data-file-name="components/recipe-generator.tsx">
      <div className="flex flex-col gap-4" data-unique-id="9daa1076-8a23-495d-901a-5059c3a7aa84" data-file-name="components/recipe-generator.tsx" data-dynamic-text="true">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3" data-unique-id="75fc8049-9341-4169-9d8b-7a55ae5fe01d" data-file-name="components/recipe-generator.tsx">
          <h3 className="text-xl font-bold" data-unique-id="e588fbf1-8268-4e7e-8c89-807de426a75b" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="70ccc3df-efcf-414c-91d6-0bd122de1f48" data-file-name="components/recipe-generator.tsx">Generate Recipes</span></h3>
          <div className="flex items-center gap-3" data-unique-id="ed633eb8-350a-4474-bd25-34300efb1072" data-file-name="components/recipe-generator.tsx">
            <ApiUsageInfo provider={formatProviderName(selectedProvider)} />
            <AIProviderSelector currentProvider={selectedProvider} onProviderChange={setSelectedProvider} />
          </div>
        </div>
        
        <p className="text-muted-foreground" data-unique-id="348eb42a-dee8-4bfc-b172-57aa13b9f3fa" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="91bcbca8-c4bb-4856-86a4-14e0d69b31c6" data-file-name="components/recipe-generator.tsx">
          Let our AI chef create personalized recipes based on your ingredients and preferences
        </span></p>
        
        <div className="flex flex-wrap gap-2 items-center" data-unique-id="b83385ab-780f-4921-a2e3-76ebd7de1696" data-file-name="components/recipe-generator.tsx">
          <motion.button whileHover={{
          scale: 1.02
        }} whileTap={{
          scale: 0.98
        }} onClick={toggleFilters} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors" data-unique-id="0cbf07a3-abf6-40a4-af15-8d0eaca71932" data-file-name="components/recipe-generator.tsx">
            <Filter className="w-4 h-4" />
            <span data-unique-id="622ad5c8-b3e8-4bce-a961-c756261f44b5" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="881b04dc-a5d0-4d90-bf91-d66a49eeacde" data-file-name="components/recipe-generator.tsx">Filters</span></span>
          </motion.button>
          
          <div className="flex-1" data-unique-id="0bc1cf9f-06c1-4b0d-9f0c-c221b96e3def" data-file-name="components/recipe-generator.tsx"></div>
          
          <motion.button whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }} onClick={handleGenerateRecipes} disabled={isLoading || ingredients.length === 0} className={cn("flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors", (isLoading || ingredients.length === 0) && "opacity-50 cursor-not-allowed")} data-unique-id="37ae0d8a-af82-48da-869d-5e23ab6b5a84" data-file-name="components/recipe-generator.tsx" data-dynamic-text="true">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChefHat className="w-5 h-5" />}
            <span data-unique-id="2e5b5265-cdbc-4058-a0fc-df05bc13ba25" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="4a12814f-3eb3-402f-bfb5-73e550f43518" data-file-name="components/recipe-generator.tsx">Generate Recipes</span></span>
          </motion.button>
        </div>
        
        <AnimatePresence>
          {showFilters && <motion.div initial={{
          opacity: 0,
          height: 0
        }} animate={{
          opacity: 1,
          height: 'auto'
        }} exit={{
          opacity: 0,
          height: 0
        }} className="overflow-hidden" data-unique-id="25585a1a-7ac2-4f10-a7f3-82c767ef5eb5" data-file-name="components/recipe-generator.tsx">
              <div className="border-t border-border mt-2 pt-4" data-unique-id="3727b339-9be2-4761-a408-665d390b03f2" data-file-name="components/recipe-generator.tsx">
                <div className="flex justify-between items-center mb-4" data-unique-id="62cd9b60-092b-4af4-b8a7-74087b7c1475" data-file-name="components/recipe-generator.tsx">
                  <h4 className="font-medium" data-unique-id="65772eff-fc11-4804-ae4f-a220f7577e76" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="d09000dc-490b-475d-94a6-b268bd139db2" data-file-name="components/recipe-generator.tsx">Recipe Filters</span></h4>
                  <button onClick={resetFilters} className="text-sm text-primary hover:text-primary/80 transition-colors" data-unique-id="d64884c2-65cf-486f-a6e0-82fbc8a63c21" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="d40062e1-fb36-467e-a638-8e4716ad1f7e" data-file-name="components/recipe-generator.tsx">
                    Reset
                  </span></button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-unique-id="0cbfcbeb-3526-40e7-a33b-2bd8dda9fe41" data-file-name="components/recipe-generator.tsx">
                  <div className="space-y-2" data-unique-id="bcf49d02-c91c-4aaf-bda3-301d55fa9acb" data-file-name="components/recipe-generator.tsx">
                    <label className="block text-sm font-medium" data-unique-id="af58a813-4e5b-4999-91a0-5f3a34443e18" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="44866cc4-a77d-4dcc-8028-514c4864f7bc" data-file-name="components/recipe-generator.tsx">Cuisine Type</span></label>
                    <select value={cuisineType} onChange={e => setCuisineType(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-input-background dark:bg-input border border-border outline-none focus:ring-2 focus:ring-primary/20" data-unique-id="6f8a7eab-f5b7-4902-a993-cb0572eddbcb" data-file-name="components/recipe-generator.tsx">
                      <option value="" data-unique-id="4f1ba193-fca2-44eb-b64d-6b276d4bb9b7" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="7b1ca902-4dd1-44c0-905c-d4247cca8587" data-file-name="components/recipe-generator.tsx">Any Cuisine</span></option>
                      <option value="Italian" data-unique-id="00000326-e3a1-4c24-a2a3-6ea99d73791f" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="99f9012a-0c4f-43e4-9a60-e325aa19b7d8" data-file-name="components/recipe-generator.tsx">Italian</span></option>
                      <option value="Mexican" data-unique-id="a78681e2-8b10-4bc0-b6e7-a28d9a8ba980" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="7e6ae9e2-d62c-4fd9-a2c8-1799c0a1c8f3" data-file-name="components/recipe-generator.tsx">Mexican</span></option>
                      <option value="Asian" data-unique-id="e6f7ddcf-ba60-403d-872a-61ddbd591e97" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="26b4a79b-253d-43be-82a9-aefb9be119c9" data-file-name="components/recipe-generator.tsx">Asian</span></option>
                      <option value="Indian" data-unique-id="0a81bd79-4434-4fc1-8a9f-0b3713ab15c1" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="db679714-fc35-4c38-99ce-22376b67bf70" data-file-name="components/recipe-generator.tsx">Indian</span></option>
                      <option value="Mediterranean" data-unique-id="3eb5c9f5-0b21-431f-bb4f-2dac2f8ed60e" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="3e59904e-7e47-4cc0-b749-319c971d375a" data-file-name="components/recipe-generator.tsx">Mediterranean</span></option>
                      <option value="American" data-unique-id="751d1106-3235-4ddb-bc79-a8377c4cbc3c" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="2854f883-664a-4ce9-8934-5c644ef564d5" data-file-name="components/recipe-generator.tsx">American</span></option>
                    </select>
                  </div>
                  
                  <div className="space-y-2" data-unique-id="b567180d-7ae0-4374-a87c-895719399bb2" data-file-name="components/recipe-generator.tsx">
                    <label className="block text-sm font-medium" data-unique-id="fd9ed1e8-a97c-4c02-8074-eabdb5f08999" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="7a056518-ba9f-4dde-82b4-886687020c1f" data-file-name="components/recipe-generator.tsx">Meal Type</span></label>
                    <select value={mealType} onChange={e => setMealType(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-input-background dark:bg-input border border-border outline-none focus:ring-2 focus:ring-primary/20" data-unique-id="d24b8261-2194-4c08-a7c3-69c39e861f5e" data-file-name="components/recipe-generator.tsx">
                      <option value="" data-unique-id="fff599b5-db4f-4455-9d5f-462d20979ca0" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="c7edd418-151f-4e9b-a8ea-3b8a6167e303" data-file-name="components/recipe-generator.tsx">Any Meal</span></option>
                      <option value="Breakfast" data-unique-id="d27eb164-8b28-4c81-945c-4177c24a3d1f" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="14bf605b-e4fc-47f2-93cc-509635708692" data-file-name="components/recipe-generator.tsx">Breakfast</span></option>
                      <option value="Lunch" data-unique-id="33452373-7c2b-4a07-8a5d-f1ebefd3d8e0" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="88b04ee1-5633-4177-abaf-fd165fa9f41f" data-file-name="components/recipe-generator.tsx">Lunch</span></option>
                      <option value="Dinner" data-unique-id="333889fc-d2b7-46d0-ae68-6b73182a412a" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="b5e7b838-379b-4000-830d-5ee482e8a3fc" data-file-name="components/recipe-generator.tsx">Dinner</span></option>
                      <option value="Dessert" data-unique-id="76e72cb5-abab-4bda-b463-89cb94f7aaa8" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="12268899-52f3-4384-8769-ce679ba35f45" data-file-name="components/recipe-generator.tsx">Dessert</span></option>
                      <option value="Snack" data-unique-id="ebe0fdf3-c90f-4ea7-86ff-aa518eb36a19" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="8c58df1f-c3a8-4ae4-af20-28ed0b7b44f8" data-file-name="components/recipe-generator.tsx">Snack</span></option>
                    </select>
                  </div>
                  
                  <div className="space-y-2" data-unique-id="730c0045-eca5-40df-9d4a-578954db5712" data-file-name="components/recipe-generator.tsx">
                    <label className="block text-sm font-medium" data-unique-id="eaa62432-eb99-430b-bbcb-205ddc032a88" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="f765603e-fd00-41d6-b25e-ffc70cda259e" data-file-name="components/recipe-generator.tsx">Difficulty</span></label>
                    <select value={difficulty} onChange={e => setDifficulty(e.target.value as any)} className="w-full px-3 py-2 rounded-lg bg-input-background dark:bg-input border border-border outline-none focus:ring-2 focus:ring-primary/20" data-unique-id="b19e5199-0e5e-4e5a-9d0d-da44f4f489df" data-file-name="components/recipe-generator.tsx">
                      <option value="" data-unique-id="d68139f4-0390-4f29-85c1-e2e7da6f2a25" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="c95af4dc-a124-4597-88a3-e949ff90035c" data-file-name="components/recipe-generator.tsx">Any Difficulty</span></option>
                      <option value="easy" data-unique-id="b8f3a1a4-00be-414d-b5c5-28aae24da650" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="21fdb49c-bfda-49d9-8961-3dca385c0386" data-file-name="components/recipe-generator.tsx">Easy</span></option>
                      <option value="medium" data-unique-id="1967de01-ca92-4284-9274-58cb7387d25a" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="8afcc670-c09b-434d-9321-9b1ce29d40da" data-file-name="components/recipe-generator.tsx">Medium</span></option>
                      <option value="hard" data-unique-id="476a3f67-3e3e-43e3-ac6b-8dbfcc4cb17f" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="d6667adb-6b3d-4da8-b12e-3efbbd97a07f" data-file-name="components/recipe-generator.tsx">Hard</span></option>
                    </select>
                  </div>
                  
                  <div className="space-y-2" data-unique-id="c6ec2714-de1a-46f1-b62d-45b185eb86e0" data-file-name="components/recipe-generator.tsx">
                    <label className="block text-sm font-medium" data-unique-id="0f539ee9-df50-49f6-90b3-5395bccc2d47" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="914e48d4-5eba-43de-aeb7-41bf82c5cf53" data-file-name="components/recipe-generator.tsx">Max Cooking Time (minutes)</span></label>
                    <div className="flex items-center gap-2" data-unique-id="2095fb92-9dc1-4a53-b5d8-b2338edba43a" data-file-name="components/recipe-generator.tsx">
                      <input type="range" min="15" max="120" step="5" value={maxCookingTime} onChange={e => setMaxCookingTime(parseInt(e.target.value))} className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary" data-unique-id="0ec029e3-de8d-4cd8-97e2-8e553eac5c7c" data-file-name="components/recipe-generator.tsx" />
                      <span className="w-12 text-center" data-unique-id="ad3e6bfd-c93a-409e-8090-bd79013bb47e" data-file-name="components/recipe-generator.tsx" data-dynamic-text="true">{maxCookingTime}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2" data-unique-id="ece179e2-7b18-4612-90c9-ecaf9f1f3580" data-file-name="components/recipe-generator.tsx">
                    <label className="block text-sm font-medium" data-unique-id="9d0f2674-18db-4bb5-807c-2ce4af5c31aa" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="84f55786-9d91-4bfb-8105-e4b50dfa92a3" data-file-name="components/recipe-generator.tsx">Servings</span></label>
                    <div className="flex items-center" data-unique-id="45edb647-7f84-4b3e-9974-dc1654abf3fe" data-file-name="components/recipe-generator.tsx">
                      <button onClick={() => setServings(Math.max(1, servings - 1))} className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-l-lg border border-border" data-unique-id="97b0c31e-37b6-4398-8e0f-ffd34fb66344" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="b834cd44-4b7b-4f36-99cd-0b08f35297dc" data-file-name="components/recipe-generator.tsx">
                        -
                      </span></button>
                      <div className="px-4 py-2 border-t border-b border-border bg-input-background dark:bg-input" data-unique-id="93a32986-624f-495e-a35b-e29934193a63" data-file-name="components/recipe-generator.tsx" data-dynamic-text="true">
                        {servings}
                      </div>
                      <button onClick={() => setServings(servings + 1)} className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-r-lg border border-border" data-unique-id="a0c6dbd4-ae69-421c-926f-30becfcef929" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="6a6b84fe-99b8-42c3-ad6c-1b511c9d069b" data-file-name="components/recipe-generator.tsx">
                        +
                      </span></button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>}
        </AnimatePresence>
        
        {ingredients.length === 0 && <div className="text-center py-4 text-muted-foreground" data-unique-id="d10b790d-ec70-4af7-b69c-e84377db074a" data-file-name="components/recipe-generator.tsx"><span className="editable-text" data-unique-id="1a3c58b5-2a57-48ee-88d3-8ba14b3c693f" data-file-name="components/recipe-generator.tsx">
            Add some ingredients to generate recipe suggestions
          </span></div>}
      </div>
    </div>;
}