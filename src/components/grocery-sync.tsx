"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowRight, Clock, RefreshCw } from 'lucide-react';
import { useIngredientStore } from '@/store/ingredient-store';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { generateText } from '@/lib/api/util';
import { ModelProvider } from '@/types';
interface GroceryApp {
  id: string;
  name: string;
  icon?: string;
  lastSynced?: string;
}
export function GrocerySync() {
  const {
    ingredients,
    addIngredient
  } = useIngredientStore();
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const groceryApps: GroceryApp[] = [{
    id: 'blinkit',
    name: 'Blinkit'
  }, {
    id: 'instamart',
    name: 'Swiggy Instamart'
  }, {
    id: 'amazon',
    name: 'Amazon Fresh'
  }, {
    id: 'bigbasket',
    name: 'BigBasket'
  }];

  // Load last sync time from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLastSynced = localStorage.getItem('lastSynced');
      const savedSelectedApp = localStorage.getItem('selectedGroceryApp');
      if (savedLastSynced) {
        setLastSynced(savedLastSynced);
      }
      if (savedSelectedApp) {
        setSelectedApp(savedSelectedApp);
      }
    }
  }, []);

  // Save last sync time and selected app to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && lastSynced) {
      localStorage.setItem('lastSynced', lastSynced);
    }
    if (typeof window !== 'undefined' && selectedApp) {
      localStorage.setItem('selectedGroceryApp', selectedApp);
    }
  }, [lastSynced, selectedApp]);
  const handleAppSelect = (appId: string) => {
    setSelectedApp(appId);
  };
  const syncGroceryList = async () => {
    if (!selectedApp) {
      toast.error("Please select a grocery app first");
      return;
    }
    setIsSyncing(true);
    try {
      // Simulate fetching grocery list from the selected app
      // In a real app, this would connect to the app's API

      // Use AI to generate a sample grocery list based on the selected app
      const prompt = `Generate a sample grocery list that might be in a user's ${groceryApps.find(app => app.id === selectedApp)?.name} app. 
      Return the response as an array of JSON objects with name, quantity, and unit properties.
      For example: [{"name": "Milk", "quantity": "1", "unit": "liter"}, {"name": "Bread", "quantity": "1", "unit": "loaf"}]
      Include 5-8 grocery items that make sense together.`;
      const response = await generateText(prompt, "azure-gpt-4o" as ModelProvider);

      // Parse the response to extract the JSON
      let jsonText = response.text.trim();
      const startBracket = jsonText.indexOf('[');
      const endBracket = jsonText.lastIndexOf(']');
      if (startBracket !== -1 && endBracket !== -1) {
        jsonText = jsonText.substring(startBracket, endBracket + 1);
      }
      const groceryItems = JSON.parse(jsonText);

      // Add each item to the ingredients store
      groceryItems.forEach((item: any) => {
        const newIngredient = {
          id: `sync-${Date.now()}-${Math.random()}`,
          name: item.name,
          quantity: item.quantity,
          unit: item.unit
        };
        addIngredient(newIngredient);
      });

      // Update the last synced time
      const now = new Date();
      const formattedDate = now.toLocaleString();
      setLastSynced(formattedDate);
      toast.success(`Successfully synced ${groceryItems.length} items from ${groceryApps.find(app => app.id === selectedApp)?.name}`);
    } catch (error) {
      console.error("Error syncing grocery list:", error);
      toast.error("Failed to sync grocery list. Please try again.");
    } finally {
      setIsSyncing(false);
    }
  };
  return <div className="bg-card rounded-2xl shadow-sm dark:shadow-primary/5 border border-border p-6" data-unique-id="d61126ea-dc1f-42b0-a48d-fff1a55218c9" data-file-name="components/grocery-sync.tsx">
      <div className="flex items-center gap-3 mb-6" data-unique-id="3d8c9074-5bdd-4f78-a069-a80bb73393ce" data-file-name="components/grocery-sync.tsx">
        <div className="bg-primary/10 p-3 rounded-full" data-unique-id="f0e6ba0e-aba4-4779-a2ca-67a49dd246cd" data-file-name="components/grocery-sync.tsx">
          <ShoppingCart className="w-5 h-5 text-primary" />
        </div>
        <div data-unique-id="e30416a2-ad07-41fd-ad1f-c9ef7c8e94dd" data-file-name="components/grocery-sync.tsx">
          <h2 className="text-xl font-bold" data-unique-id="d0c2af88-1c58-4a43-99d0-a5da776e328a" data-file-name="components/grocery-sync.tsx"><span className="editable-text" data-unique-id="320c3c88-d9ee-48f3-91b5-65ab3db397f5" data-file-name="components/grocery-sync.tsx">Sync Grocery List</span></h2>
          <p className="text-muted-foreground" data-unique-id="a23773b2-9e60-49e3-ba59-4214aa19e055" data-file-name="components/grocery-sync.tsx"><span className="editable-text" data-unique-id="d1095288-31a3-411f-9398-4ea6ebe9d68e" data-file-name="components/grocery-sync.tsx">Connect your shopping app to sync ingredients</span></p>
        </div>
      </div>
      
      <div className="space-y-6" data-unique-id="455f70aa-2dd0-4dda-9290-c23b03cffae7" data-file-name="components/grocery-sync.tsx">
        <div data-unique-id="3bfc25ca-502b-4e8c-a1e1-52eba01bbb17" data-file-name="components/grocery-sync.tsx">
          <h3 className="font-medium mb-3" data-unique-id="e139d64f-ee10-40ae-b0fd-12acd9c83a3c" data-file-name="components/grocery-sync.tsx"><span className="editable-text" data-unique-id="b98618cc-8532-4bb3-9c12-6f846189ad08" data-file-name="components/grocery-sync.tsx">Select grocery app to sync from</span></h3>
          <div className="grid grid-cols-2 gap-3" data-unique-id="46057591-a6aa-46f5-a2d3-277ec1930a64" data-file-name="components/grocery-sync.tsx" data-dynamic-text="true">
            {groceryApps.map(app => <motion.button key={app.id} onClick={() => handleAppSelect(app.id)} whileHover={{
            scale: 1.03
          }} whileTap={{
            scale: 0.98
          }} className={cn("h-20 flex items-center justify-center rounded-xl border border-border p-4 transition-colors", selectedApp === app.id && "border-primary bg-primary/5")} data-unique-id="71a074ee-c590-4cee-9579-a796ff6ceb85" data-file-name="components/grocery-sync.tsx">
                <span className="font-medium" data-unique-id="ef14a551-aefd-46f5-92fd-3addbff78c50" data-file-name="components/grocery-sync.tsx" data-dynamic-text="true">{app.name}</span>
              </motion.button>)}
          </div>
        </div>
        
        <div className="flex items-center justify-between bg-muted/30 rounded-xl p-4" data-unique-id="c7ef1980-1d09-4c09-8b3d-0a6cfe8a39a3" data-file-name="components/grocery-sync.tsx">
          <div className="flex items-center gap-2" data-unique-id="96fb688b-3c30-4fd8-872e-ebb0c537fec3" data-file-name="components/grocery-sync.tsx">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm" data-unique-id="c91c8be8-281e-4e06-b69f-12a06e6f72b9" data-file-name="components/grocery-sync.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="d7c8f16e-28ba-4a5a-96e5-2dbe456ffd6c" data-file-name="components/grocery-sync.tsx">
              Last Synced: </span>{lastSynced || "Never"}
            </span>
          </div>
          
          <motion.button whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }} onClick={syncGroceryList} disabled={!selectedApp || isSyncing} className={cn("flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg transition-colors", (!selectedApp || isSyncing) && "opacity-50 cursor-not-allowed")} data-unique-id="49dbdb03-5ce3-4327-ba97-501901941db7" data-file-name="components/grocery-sync.tsx" data-dynamic-text="true">
            {isSyncing ? <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span data-unique-id="333aa431-3951-4e37-97e8-e6520e5178e9" data-file-name="components/grocery-sync.tsx"><span className="editable-text" data-unique-id="c86fedad-f0d0-44ee-8c9e-e0df5e90bc60" data-file-name="components/grocery-sync.tsx">Syncing...</span></span>
              </> : <>
                <span data-unique-id="6fb40598-5102-4cde-88af-8fc5d82bab31" data-file-name="components/grocery-sync.tsx"><span className="editable-text" data-unique-id="923f2e51-80a6-4d3d-ac3d-4dab412c1834" data-file-name="components/grocery-sync.tsx">Sync Now</span></span>
                <ArrowRight className="w-4 h-4" />
              </>}
          </motion.button>
        </div>
        
        <div className="bg-secondary/10 dark:bg-secondary/20 rounded-xl p-4" data-unique-id="53a72ec5-036e-4359-bf4b-a65937f70447" data-file-name="components/grocery-sync.tsx">
          <p className="text-sm text-center" data-unique-id="aab25259-963f-4514-b333-84b83a547d46" data-file-name="components/grocery-sync.tsx"><span className="editable-text" data-unique-id="e1e5e374-c044-4f0a-9e2b-184e13a1364e" data-file-name="components/grocery-sync.tsx">
            You've added: </span><span className="font-bold" data-unique-id="c04ca488-8c0f-4222-a5a3-2548e69935bb" data-file-name="components/grocery-sync.tsx" data-dynamic-text="true">{ingredients.length}</span><span className="editable-text" data-unique-id="826628f3-6459-4a2e-9f53-74dfad176490" data-file-name="components/grocery-sync.tsx"> ingredients
          </span></p>
        </div>
      </div>
    </div>;
}