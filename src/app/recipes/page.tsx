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
          
          
        </div>
        
        
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