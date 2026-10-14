"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Utensils, Heart, Search } from 'lucide-react';
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
  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };
  const closeRecipeDetails = () => {
    setSelectedRecipe(null);
  };
  const filteredRecipes = (activeTab === 'favorites' ? favoriteRecipes : recentRecipes).filter(recipe => {
    // Search filter
    if (searchQuery && !recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) && !recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) && !recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }

    return true;
  });
  return <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-zinc-900 dark:to-amber-950">
      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6
      }} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Recipes</h1>
          <p className="text-muted-foreground">
            Browse your favorite and recently viewed recipes
          </p>
        </motion.div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search recipes..." className="w-full pl-10 pr-4 py-3 rounded-lg bg-input-background dark:bg-input border border-border outline-none focus:ring-2 focus:ring-primary/20" />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          </div>
          
          
        </div>
        
        
        <div className="flex border-b border-border mb-6">
          <button onClick={() => setActiveTab('favorites')} className={cn("py-3 px-6 font-medium transition-colors", activeTab === 'favorites' ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")}>
            Favorites
          </button>
          <button onClick={() => setActiveTab('recent')} className={cn("py-3 px-6 font-medium transition-colors", activeTab === 'recent' ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")}>
            Recently Viewed
          </button>
        </div>
        
        {filteredRecipes.length === 0 ? <div className="bg-muted/30 rounded-xl p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              {activeTab === 'favorites' ? <Heart className="w-8 h-8 text-muted-foreground" /> : <Clock className="w-8 h-8 text-muted-foreground" />}
            </div>
            <h3 className="text-xl font-medium mb-2">
              {activeTab === 'favorites' ? "No favorite recipes yet" : "No recently viewed recipes"}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {activeTab === 'favorites' ? "Add recipes to your favorites to see them here" : "Browse recipes to see your recently viewed ones here"}
            </p>
          </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map(recipe => <motion.div key={recipe.id} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} whileHover={{
          y: -5
        }} className="recipe-card bg-card rounded-xl overflow-hidden shadow-sm dark:shadow-primary/5 border border-border">
                <div className="relative h-48">
                  <Image src={recipe.image} alt={recipe.title} fill className="object-cover" />
                  <div className="absolute top-2 right-2 bg-card/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium">
                    {recipe.matchPercentage}% match
                  </div>
                  {activeTab === 'favorites' && <div className="absolute top-2 left-2 bg-primary/90 backdrop-blur-sm rounded-full p-1">
                      <Heart className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
                    </div>}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 line-clamp-1">{recipe.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{recipe.description}</p>
                  
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
            }} onClick={() => handleSelectRecipe(recipe)} className="w-full bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 transition-colors">
                    View Recipe
                  </motion.button>
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
      }} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto" onClick={closeRecipeDetails}>
            <div onClick={e => e.stopPropagation()}>
              <RecipeDetail recipe={selectedRecipe} onClose={closeRecipeDetails} />
            </div>
          </motion.div>}
      </AnimatePresence>
    </div>;
}