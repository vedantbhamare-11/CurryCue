"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Utensils, Heart, Search, Filter, X } from 'lucide-react';
import Image from 'next/image';
import { Recipe } from '@/types';
import { cn } from '@/lib/utils';
import { useRecipeStore } from '@/store/recipe-store';
import { RecipeDetail } from '@/components/recipe-detail';
// import { Footer } from '@/components/footer';
export default function RecipesPage() {
  const {
    favoriteRecipes,
    recentRecipes
  } = useRecipeStore();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'favorites' | 'recent'>('favorites');
  const [filterOpen, setFilterOpen] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('');
  const [cuisineFilter, setCuisineFilter] = useState<string>('');
  const [timeFilter, setTimeFilter] = useState<number | null>(null);
  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };
  const closeRecipeDetails = () => {
    setSelectedRecipe(null);
  };
  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };
  const resetFilters = () => {
    setDifficultyFilter('');
    setCuisineFilter('');
    setTimeFilter(null);
  };
  const filteredRecipes = (activeTab === 'favorites' ? favoriteRecipes : recentRecipes).filter(recipe => {
    // Search filter
    if (searchQuery && !recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) && !recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) && !recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }

    // Difficulty filter
    if (difficultyFilter && recipe.difficulty !== difficultyFilter) {
      return false;
    }

    // Cuisine filter
    if (cuisineFilter && recipe.cuisine !== cuisineFilter) {
      return false;
    }

    // Time filter
    if (timeFilter && recipe.cookTime > timeFilter) {
      return false;
    }
    return true;
  });
  return <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-zinc-900 dark:to-amber-950" data-unique-id="84b5930d-7439-4086-a2d5-0379c42b6ddd" data-file-name="app/recipes/page.tsx" data-dynamic-text="true">
      <main className="container mx-auto px-4 py-8" data-unique-id="06c562d0-30ba-4fe1-af78-4fd343798864" data-file-name="app/recipes/page.tsx" data-dynamic-text="true">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6
      }} className="mb-8" data-unique-id="253b0f96-abca-415b-8bd5-87ea042ab803" data-file-name="app/recipes/page.tsx">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" data-unique-id="f82838c4-c9c5-4a1a-8194-4ca27388f011" data-file-name="app/recipes/page.tsx"><span className="editable-text" data-unique-id="8c03ef2c-ad31-4157-8dbe-bd4d996fc31e" data-file-name="app/recipes/page.tsx">My Recipes</span></h1>
          <p className="text-muted-foreground" data-unique-id="c5f34750-ea29-48e2-b0b9-078864c6b87c" data-file-name="app/recipes/page.tsx"><span className="editable-text" data-unique-id="209ad72e-2d46-45c7-8ff8-f34ac1aff08f" data-file-name="app/recipes/page.tsx">
            Browse your favorite and recently viewed recipes
          </span></p>
        </motion.div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6" data-unique-id="18e69378-f8de-4caa-a133-d5b0aea39e32" data-file-name="app/recipes/page.tsx">
          <div className="relative flex-1" data-unique-id="bf26f3a7-1f33-45eb-a713-a6e5b73eb499" data-file-name="app/recipes/page.tsx">
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search recipes..." className="w-full pl-10 pr-4 py-3 rounded-lg bg-input-background dark:bg-input border border-border outline-none focus:ring-2 focus:ring-primary/20" data-unique-id="59ea827d-9231-420f-bbf7-6e1d8c6d8b5c" data-file-name="app/recipes/page.tsx" />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          </div>
          
          <motion.button whileHover={{
          scale: 1.02
        }} whileTap={{
          scale: 0.98
        }} onClick={toggleFilter} className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors" data-unique-id="fc075545-b2e5-44e0-87a4-c9cd0b5c17d6" data-file-name="app/recipes/page.tsx">
            <Filter className="w-5 h-5" />
            <span data-unique-id="3a57a6d2-db1c-49f0-ba74-0de84142c7e0" data-file-name="app/recipes/page.tsx"><span className="editable-text" data-unique-id="e1ffcead-8376-40ae-bbf3-51dfbd82f61d" data-file-name="app/recipes/page.tsx">Filters</span></span>
          </motion.button>
        </div>
        
        <AnimatePresence>
          {filterOpen && <motion.div initial={{
          opacity: 0,
          height: 0
        }} animate={{
          opacity: 1,
          height: 'auto'
        }} exit={{
          opacity: 0,
          height: 0
        }} className="mb-6 overflow-hidden" data-unique-id="10cfc462-03de-4c1c-9c50-ac673fdc490f" data-file-name="app/recipes/page.tsx">
              <div className="bg-card rounded-lg p-4 border border-border shadow-sm" data-unique-id="e9dcb2b3-42fe-4a08-ab42-a8193ca2fca3" data-file-name="app/recipes/page.tsx">
                <div className="flex justify-between items-center mb-4" data-unique-id="e433d091-dcdc-4225-9470-bbef4efe96af" data-file-name="app/recipes/page.tsx">
                  <h3 className="font-medium" data-unique-id="f44b17f6-f517-4a69-af16-c0d4d8ed75bb" data-file-name="app/recipes/page.tsx"><span className="editable-text" data-unique-id="c29c2906-1602-41f7-ba55-30a5c624c489" data-file-name="app/recipes/page.tsx">Filter Recipes</span></h3>
                  <button onClick={resetFilters} className="text-sm text-primary hover:text-primary/80 transition-colors" data-unique-id="fafb1725-1b7c-4819-9a97-dcbda79c1d01" data-file-name="app/recipes/page.tsx"><span className="editable-text" data-unique-id="d81eefc9-7e16-4260-bdf0-5b3608b0b67d" data-file-name="app/recipes/page.tsx">
                    Reset
                  </span></button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="b85a30a7-b88f-4d76-920e-15b0ace144b0" data-file-name="app/recipes/page.tsx">
                  <div className="space-y-2" data-unique-id="b13e670e-625a-426f-833c-69583d44ec7b" data-file-name="app/recipes/page.tsx">
                    <label className="block text-sm font-medium" data-unique-id="2e325ea2-8b8c-401b-89e2-dab7aa77f111" data-file-name="app/recipes/page.tsx"><span className="editable-text" data-unique-id="701e4ef3-3740-4f41-81d7-329ca9cae4cc" data-file-name="app/recipes/page.tsx">Difficulty</span></label>
                    <select value={difficultyFilter} onChange={e => setDifficultyFilter(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-input-background dark:bg-input border border-border outline-none focus:ring-2 focus:ring-primary/20" data-unique-id="373b978f-1ddf-4c3b-a005-4a930d672b4f" data-file-name="app/recipes/page.tsx">
                      <option value="" data-unique-id="b373f9f3-b356-43c2-a0de-05ef3a71a3c1" data-file-name="app/recipes/page.tsx"><span className="editable-text" data-unique-id="cd132272-8645-458e-9cbe-d6eb14c98c99" data-file-name="app/recipes/page.tsx">Any Difficulty</span></option>
                      <option value="easy" data-unique-id="95f4f24d-cf9d-4ded-b534-c8ecfaea121f" data-file-name="app/recipes/page.tsx"><span className="editable-text" data-unique-id="4485fd5a-12ed-438b-9103-bc2eebe31209" data-file-name="app/recipes/page.tsx">Easy</span></option>
                      <option value="medium" data-unique-id="1753c14f-35f0-4374-af1d-7011f694abe2" data-file-name="app/recipes/page.tsx"><span className="editable-text" data-unique-id="7f408e47-60aa-42de-8019-abaf408fdd1b" data-file-name="app/recipes/page.tsx">Medium</span></option>
                      <option value="hard" data-unique-id="54bf5d0a-144d-4b1a-85ad-dd276a7615ea" data-file-name="app/recipes/page.tsx"><span className="editable-text" data-unique-id="89145fc5-eb9b-43a9-b80d-c4335849f098" data-file-name="app/recipes/page.tsx">Hard</span></option>
                    </select>
                  </div>
                  
                  <div className="space-y-2" data-unique-id="1c356fdc-9eb9-4e42-8f28-1209286b87d2" data-file-name="app/recipes/page.tsx">
                    <label className="block text-sm font-medium" data-unique-id="4a7e0422-69a0-4c93-9e0e-27061d688da1" data-file-name="app/recipes/page.tsx"><span className="editable-text" data-unique-id="1a79a5cb-4ecc-47ae-8238-ce8d5d8e32b5" data-file-name="app/recipes/page.tsx">Cuisine</span></label>
                    <select value={cuisineFilter} onChange={e => setCuisineFilter(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-input-background dark:bg-input border border-border outline-none focus:ring-2 focus:ring-primary/20" data-unique-id="26ca6077-5f0f-45b3-8eea-fb72be40d8b3" data-file-name="app/recipes/page.tsx">
                      <option value="" data-unique-id="0e59f6c8-5c06-4bd9-b216-f6aaa479d867" data-file-name="app/recipes/page.tsx"><span className="editable-text" data-unique-id="85ed5c88-1098-4987-b42f-6c6da44968ef" data-file-name="app/recipes/page.tsx">Any Cuisine</span></option>
                      <option value="Italian" data-unique-id="eb915e25-c628-44dd-b339-6914aec46547" data-file-name="app/recipes/page.tsx"><span className="editable-text" data-unique-id="ad518517-6483-48c9-b3cd-7638dad88f3f" data-file-name="app/recipes/page.tsx">Italian</span></option>
                      <option value="Mexican" data-unique-id="7c4a76ed-7aae-4aac-b791-bbc6ca22c47e" data-file-name="app/recipes/page.tsx"><span className="editable-text" data-unique-id="7dae4d16-7229-4b76-a720-e6ed9c5367d0" data-file-name="app/recipes/page.tsx">Mexican</span></option>
                      <option value="Asian" data-unique-id="60efe19b-571e-403d-bbb5-db747e172a3f" data-file-name="app/recipes/page.tsx"><span className="editable-text" data-unique-id="5784ea99-af99-4f3a-8c5d-cb30e276d7e6" data-file-name="app/recipes/page.tsx">Asian</span></option>
                      <option value="Indian" data-unique-id="b2147f01-dad2-474e-91ac-52dc9f15c2ae" data-file-name="app/recipes/page.tsx"><span className="editable-text" data-unique-id="b3aba4a7-d531-4855-a971-71229a71760b" data-file-name="app/recipes/page.tsx">Indian</span></option>
                      <option value="Mediterranean" data-unique-id="f8d8de8f-2b87-4e84-86a5-cb788ff90fdf" data-file-name="app/recipes/page.tsx"><span className="editable-text" data-unique-id="f968fe8a-e4b0-4faa-965e-391103713fcc" data-file-name="app/recipes/page.tsx">Mediterranean</span></option>
                      <option value="American" data-unique-id="f50f2f35-8819-4b32-be3e-e573a051eb06" data-file-name="app/recipes/page.tsx"><span className="editable-text" data-unique-id="acaa47aa-7562-46c8-9fff-a921b18d303c" data-file-name="app/recipes/page.tsx">American</span></option>
                    </select>
                  </div>
                  
                  <div className="space-y-2" data-unique-id="dbc5517d-7804-4e62-8138-d4dd6842cc74" data-file-name="app/recipes/page.tsx">
                    <label className="block text-sm font-medium" data-unique-id="366b20c1-3c73-436e-817f-947dd40105a5" data-file-name="app/recipes/page.tsx"><span className="editable-text" data-unique-id="f51c3ca4-b16a-4396-93c2-6bbbbc5fdbaf" data-file-name="app/recipes/page.tsx">Max Cooking Time</span></label>
                    <select value={timeFilter || ''} onChange={e => setTimeFilter(e.target.value ? parseInt(e.target.value) : null)} className="w-full px-3 py-2 rounded-lg bg-input-background dark:bg-input border border-border outline-none focus:ring-2 focus:ring-primary/20" data-unique-id="bd2255df-6291-48ff-b3a7-930f7d9e4300" data-file-name="app/recipes/page.tsx">
                      <option value="" data-unique-id="2cac1b66-2ced-484a-9106-9e19e6fe8223" data-file-name="app/recipes/page.tsx"><span className="editable-text" data-unique-id="84ea1b5e-8dfc-41f8-9ccb-455a83c4c063" data-file-name="app/recipes/page.tsx">Any Time</span></option>
                      <option value="15" data-unique-id="df3f4254-6cfa-4b2a-a8a0-dce1570a2ea2" data-file-name="app/recipes/page.tsx"><span className="editable-text" data-unique-id="ac88198d-33aa-49bc-b50e-f791ecd9df89" data-file-name="app/recipes/page.tsx">15 minutes or less</span></option>
                      <option value="30" data-unique-id="3675f286-3538-47ec-9c13-acf6a0f552b7" data-file-name="app/recipes/page.tsx"><span className="editable-text" data-unique-id="e50cc910-00fd-4218-a0a9-3751fa9981da" data-file-name="app/recipes/page.tsx">30 minutes or less</span></option>
                      <option value="45" data-unique-id="2e3a48e8-cc88-4592-b342-06502edb3377" data-file-name="app/recipes/page.tsx"><span className="editable-text" data-unique-id="95b5c63e-0899-4ee4-a7ce-7b6bf179f6da" data-file-name="app/recipes/page.tsx">45 minutes or less</span></option>
                      <option value="60" data-unique-id="096f0557-5669-4bb1-9fce-084df165144c" data-file-name="app/recipes/page.tsx"><span className="editable-text" data-unique-id="eeb14b30-09da-4194-b34a-37d580080308" data-file-name="app/recipes/page.tsx">60 minutes or less</span></option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>}
        </AnimatePresence>
        
        <div className="flex border-b border-border mb-6" data-unique-id="38b604f3-4979-4517-ac45-68e738f8e832" data-file-name="app/recipes/page.tsx">
          <button onClick={() => setActiveTab('favorites')} className={cn("py-3 px-6 font-medium transition-colors", activeTab === 'favorites' ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")} data-unique-id="4715198a-9c8d-4deb-a495-45db583696a1" data-file-name="app/recipes/page.tsx"><span className="editable-text" data-unique-id="454901fe-1140-4a8e-8676-00e382f300d0" data-file-name="app/recipes/page.tsx">
            Favorites
          </span></button>
          <button onClick={() => setActiveTab('recent')} className={cn("py-3 px-6 font-medium transition-colors", activeTab === 'recent' ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")} data-unique-id="8c7d7566-06a0-4914-9c3e-967661e85317" data-file-name="app/recipes/page.tsx"><span className="editable-text" data-unique-id="fc4e801b-3416-4ed9-9578-bb3dc64fbc78" data-file-name="app/recipes/page.tsx">
            Recently Viewed
          </span></button>
        </div>
        
        {filteredRecipes.length === 0 ? <div className="bg-muted/30 rounded-xl p-8 text-center" data-unique-id="d667852c-d21d-46b9-aa92-d8bdfb412d15" data-file-name="app/recipes/page.tsx">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4" data-unique-id="58320bf2-019e-4d6a-bbb4-49e8f8ffc0b3" data-file-name="app/recipes/page.tsx" data-dynamic-text="true">
              {activeTab === 'favorites' ? <Heart className="w-8 h-8 text-muted-foreground" /> : <Clock className="w-8 h-8 text-muted-foreground" />}
            </div>
            <h3 className="text-xl font-medium mb-2" data-unique-id="35c3d43d-922a-4c1f-9d52-5286cc84f376" data-file-name="app/recipes/page.tsx" data-dynamic-text="true">
              {activeTab === 'favorites' ? "No favorite recipes yet" : "No recently viewed recipes"}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto" data-unique-id="7fbe27a1-5ad1-4483-b119-4bbe4c0dd1b8" data-file-name="app/recipes/page.tsx" data-dynamic-text="true">
              {activeTab === 'favorites' ? "Add recipes to your favorites to see them here" : "Browse recipes to see your recently viewed ones here"}
            </p>
          </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-unique-id="3d940986-edd7-4938-a3a9-476ae4cc0607" data-file-name="app/recipes/page.tsx" data-dynamic-text="true">
            {filteredRecipes.map(recipe => <motion.div key={recipe.id} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} whileHover={{
          y: -5
        }} className="recipe-card bg-card rounded-xl overflow-hidden shadow-sm dark:shadow-primary/5 border border-border" data-unique-id="bf3d404a-3156-4084-a4be-9e22b7b479b9" data-file-name="app/recipes/page.tsx">
                <div className="relative h-48" data-unique-id="a9d41dfe-488e-492a-95e0-715141e2ea66" data-file-name="app/recipes/page.tsx" data-dynamic-text="true">
                  <Image src={recipe.image} alt={recipe.title} fill className="object-cover" data-unique-id="141971d3-80d6-4e49-9822-0a5e3b3831ed" data-file-name="app/recipes/page.tsx" />
                  <div className="absolute top-2 right-2 bg-card/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium" data-unique-id="57b5a9fc-426b-469d-a8be-b172a3f3047d" data-file-name="app/recipes/page.tsx" data-dynamic-text="true">
                    {recipe.matchPercentage}<span className="editable-text" data-unique-id="63f54aba-4df5-4b61-8940-cfbd1da077f6" data-file-name="app/recipes/page.tsx">% match
                  </span></div>
                  {activeTab === 'favorites' && <div className="absolute top-2 left-2 bg-primary/90 backdrop-blur-sm rounded-full p-1" data-unique-id="276af26a-fce4-4e2e-933d-009541b5622f" data-file-name="app/recipes/page.tsx">
                      <Heart className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
                    </div>}
                </div>
                <div className="p-4" data-unique-id="6f92d0f5-8948-4149-8bfe-9c4f45a1e03c" data-file-name="app/recipes/page.tsx">
                  <h3 className="font-bold text-lg mb-1 line-clamp-1" data-unique-id="0f173405-3dfc-4a56-976b-dda429a600c7" data-file-name="app/recipes/page.tsx" data-dynamic-text="true">{recipe.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2" data-unique-id="c0a4ee19-00d1-46ee-82b4-1d4dce88b2b2" data-file-name="app/recipes/page.tsx" data-dynamic-text="true">{recipe.description}</p>
                  
                  <div className="flex justify-between items-center mb-4" data-unique-id="298e839c-93c6-4d47-88a3-d820af5fe6c7" data-file-name="app/recipes/page.tsx">
                    <div className="flex items-center gap-1 text-sm" data-unique-id="6e28b48c-dcbf-4a1a-bf35-459f2e3ad7b3" data-file-name="app/recipes/page.tsx">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span data-unique-id="609cbde8-afd1-48a0-a4d6-cb57a4d615f0" data-file-name="app/recipes/page.tsx" data-dynamic-text="true">{recipe.cookTime}<span className="editable-text" data-unique-id="cb5a410f-d367-4ccc-b7b9-01a69e986fab" data-file-name="app/recipes/page.tsx"> min</span></span>
                    </div>
                    <div className="flex items-center gap-1 text-sm" data-unique-id="4df430f5-566a-4c97-a318-1775b6c85a53" data-file-name="app/recipes/page.tsx">
                      <Utensils className="w-4 h-4 text-muted-foreground" />
                      <span className="capitalize" data-unique-id="5a2ba992-b17e-41ba-b5a8-0a57b5fa4822" data-file-name="app/recipes/page.tsx" data-dynamic-text="true">{recipe.difficulty}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 mb-4 flex-wrap" data-unique-id="22660ffe-240b-4ed6-8d58-5e323a3c4c1d" data-file-name="app/recipes/page.tsx" data-dynamic-text="true">
                    {recipe.tags.slice(0, 3).map((tag, i) => <span key={i} className="bg-muted dark:bg-muted/50 rounded-full px-2 py-1 text-xs" data-unique-id="6ff16ca4-4c55-4a83-859c-d00afa0af4da" data-file-name="app/recipes/page.tsx" data-dynamic-text="true">
                        {tag}
                      </span>)}
                  </div>
                  
                  <motion.button whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }} onClick={() => handleSelectRecipe(recipe)} className="w-full bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 transition-colors" data-unique-id="4253c214-96d3-4aef-9ba7-a48dacfc2005" data-file-name="app/recipes/page.tsx"><span className="editable-text" data-unique-id="4f8b871d-0b61-44cb-898f-2c6ceca1382a" data-file-name="app/recipes/page.tsx">
                    View Recipe
                  </span></motion.button>
                </div>
              </motion.div>)}
          </div>}
      </main>
      
      {/* <Footer /> */}
      
      {/* Recipe detail modal */}
      <AnimatePresence>
        {selectedRecipe && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto" onClick={closeRecipeDetails} data-unique-id="024768e8-8369-47b7-a6de-a789c92c1abe" data-file-name="app/recipes/page.tsx">
            <div onClick={e => e.stopPropagation()} data-unique-id="d0282a19-7775-446e-ad11-e0229dbea6c8" data-file-name="app/recipes/page.tsx">
              <RecipeDetail recipe={selectedRecipe} onClose={closeRecipeDetails} />
            </div>
          </motion.div>}
      </AnimatePresence>
    </div>;
}