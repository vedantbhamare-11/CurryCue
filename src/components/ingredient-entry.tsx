"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Camera, X, Plus, Loader2, Scan } from 'lucide-react';
import { Ingredient } from '@/types';
import { cn } from '@/lib/utils';
import { CameraCapture } from './camera-capture';
import { DetectedIngredient } from '@/lib/services/ingredient-detection';
import { useIngredientStore } from '@/store/ingredient-store';
import { toast } from 'sonner';
import { MLDetectionSettings } from './ml-detection-settings';
import { ModelProvider } from '@/types';
export function IngredientEntry() {
  const {
    ingredients,
    addIngredient,
    removeIngredient
  } = useIngredientStore();
  const [inputValue, setInputValue] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isScanningComplete, setIsScanningComplete] = useState(false);
  const [scanResults, setScanResults] = useState<DetectedIngredient[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ModelProvider>("azure-gpt-4o");
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(70);
  const [mlEnabled, setMlEnabled] = useState<boolean>(true);
  const handleAddIngredient = () => {
    if (!inputValue.trim()) return;
    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: inputValue.trim()
    };
    addIngredient(newIngredient);
    setInputValue('');
  };
  const handleRemoveIngredient = (id: string) => {
    removeIngredient(id);
  };
  const handleScan = () => {
    setShowCamera(true);
  };
  const handleCameraClose = () => {
    setShowCamera(false);
  };
  const handleImageCapture = async (imageSrc: string) => {
    setShowCamera(false);
    // We don't need to set scanning state here anymore as the camera component handles it
  };
  const handleDetectedIngredients = (detectedIngredients: DetectedIngredient[]) => {
    if (detectedIngredients.length > 0) {
      setScanResults(detectedIngredients);
      setIsScanningComplete(true);
      setIsScanning(false);
      setIsProcessingImage(false);
    } else {
      toast.error("No ingredients detected. Please try again with a clearer image.");
      setIsScanning(false);
      setIsProcessingImage(false);
    }
  };
  const handleAddScannedIngredients = () => {
    // Filter ingredients by confidence threshold if confidence is available
    const filteredResults = scanResults.filter(result => !result.confidence || result.confidence >= confidenceThreshold);
    const newIngredients = filteredResults.map(result => ({
      id: `scan-${Date.now()}-${Math.random()}`,
      name: result.name,
      quantity: result.quantity,
      unit: result.unit
    }));
    if (newIngredients.length === 0) {
      toast.error("No ingredients meet the confidence threshold. Try lowering the threshold or taking a clearer photo.");
      return;
    }
    newIngredients.forEach(ingredient => {
      addIngredient(ingredient);
    });
    setScanResults([]);
    setIsScanningComplete(false);
    if (newIngredients.length < scanResults.length) {
      toast.success(`Added ${newIngredients.length} ingredients that met the confidence threshold!`);
    } else {
      toast.success(`Added ${newIngredients.length} ingredients to your list!`);
    }
  };
  return <section className="relative" data-unique-id="ab30140f-0514-44df-9c3d-325d01d0b02b" data-file-name="components/ingredient-entry.tsx" data-dynamic-text="true">
      <div className="mb-8" data-unique-id="b4ee1a8e-2bc5-408c-a405-72e8e6dd7aca" data-file-name="components/ingredient-entry.tsx">
        <h2 className="text-2xl font-bold mb-2" data-unique-id="5b43f4f9-d731-40fe-9d69-7ce8d9ef27b5" data-file-name="components/ingredient-entry.tsx"><span className="editable-text" data-unique-id="ef7a1952-6826-4f2f-a496-7800bf87afbe" data-file-name="components/ingredient-entry.tsx">What's in your kitchen?</span></h2>
        <p className="text-muted-foreground" data-unique-id="667cd52f-9980-4db1-9004-54d84ff474af" data-file-name="components/ingredient-entry.tsx"><span className="editable-text" data-unique-id="f0a158dc-c30a-49e6-bd2f-1cd7972939c9" data-file-name="components/ingredient-entry.tsx">
          Add ingredients manually or scan them with your camera
        </span></p>
      </div>
      
      {/* Diagonal design element */}
      <div className="absolute -z-10 top-0 right-0 w-1/3 h-32 bg-secondary/10 dark:bg-secondary/20 transform -rotate-12 rounded-3xl" data-unique-id="61edb63c-eb0e-4632-b467-abd13763afbf" data-file-name="components/ingredient-entry.tsx"></div>
      
      <div className="bg-card rounded-2xl p-6 shadow-sm dark:shadow-secondary/5 border border-border" data-unique-id="7da3dca7-f453-4c45-afdf-b5d4f0395617" data-file-name="components/ingredient-entry.tsx" data-dynamic-text="true">
        {/* Input area */}
        <div className="flex flex-wrap gap-2 mb-6" data-unique-id="863f2ee8-fb8a-49fc-b742-9a1023f63b7e" data-file-name="components/ingredient-entry.tsx">
          <div className="relative flex-1 min-w-[200px]" data-unique-id="324a3662-8960-4cc2-8e52-234b531438d1" data-file-name="components/ingredient-entry.tsx">
            <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => {
            if (e.key === 'Enter') handleAddIngredient();
          }} placeholder="Add an ingredient..." className="w-full pl-10 pr-4 py-3 rounded-lg bg-input-background dark:bg-input border border-border outline-none focus:ring-2 focus:ring-primary/20" data-unique-id="8f147e3f-1d7b-4f62-ad62-d9c67915042e" data-file-name="components/ingredient-entry.tsx" />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          </div>
          <motion.button whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }} onClick={handleAddIngredient} className="bg-primary text-primary-foreground px-4 py-3 rounded-lg hover:bg-primary/90 transition-colors" data-unique-id="0e4c3b46-ec80-481d-a71a-be8a834e686a" data-file-name="components/ingredient-entry.tsx">
            <Plus className="w-5 h-5" />
          </motion.button>
          <motion.button whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }} onClick={handleScan} className={cn("px-4 py-3 rounded-lg transition-colors flex items-center gap-2", mlEnabled ? "bg-secondary text-secondary-foreground hover:bg-secondary/90" : "bg-muted text-foreground hover:bg-muted/80", isProcessingImage && "opacity-50 cursor-not-allowed")} disabled={isProcessingImage} data-unique-id="a6902818-f6a0-4951-853f-2d9b1704cf57" data-file-name="components/ingredient-entry.tsx" data-dynamic-text="true">
            {mlEnabled ? <Scan className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
          </motion.button>
          
          <div className="ml-auto flex items-center gap-2" data-unique-id="a7afea97-9a80-4828-95c1-a358425c7d7f" data-file-name="components/ingredient-entry.tsx">
            
            
            <MLDetectionSettings currentProvider={selectedProvider} onProviderChange={setSelectedProvider} confidenceThreshold={confidenceThreshold} onConfidenceChange={setConfidenceThreshold} />
          </div>
        </div>
        
        {/* Scanning UI */}
        <AnimatePresence>
          {isScanning && <motion.div initial={{
          opacity: 0,
          height: 0
        }} animate={{
          opacity: 1,
          height: 'auto'
        }} exit={{
          opacity: 0,
          height: 0
        }} className="mb-6 bg-muted rounded-lg p-4 flex items-center justify-center" data-unique-id="7e98b335-f25a-4679-bff4-7f0ac34a2fd9" data-file-name="components/ingredient-entry.tsx">
              <div className="flex flex-col items-center" data-unique-id="32d48814-b22c-4e9d-8a55-4da272e33f4e" data-file-name="components/ingredient-entry.tsx">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                <p data-unique-id="f942d546-42d0-430f-9538-09c8f5fb9a9e" data-file-name="components/ingredient-entry.tsx"><span className="editable-text" data-unique-id="f2c1bab5-30bd-4aa8-9537-9b1716676dd7" data-file-name="components/ingredient-entry.tsx">Processing your image...</span></p>
              </div>
            </motion.div>}
          
          {isScanningComplete && <motion.div initial={{
          opacity: 0,
          height: 0
        }} animate={{
          opacity: 1,
          height: 'auto'
        }} exit={{
          opacity: 0,
          height: 0
        }} className="mb-6 bg-muted rounded-lg p-4" data-unique-id="df86223c-da90-4db8-addd-f12a98317b4d" data-file-name="components/ingredient-entry.tsx">
              <div className="flex justify-between items-center mb-3" data-unique-id="db37c7a6-0aae-410d-b16e-0e1f5f175cfa" data-file-name="components/ingredient-entry.tsx">
                <h3 className="font-medium" data-unique-id="661307e5-cf4b-41c1-b792-477767f1cada" data-file-name="components/ingredient-entry.tsx"><span className="editable-text" data-unique-id="f8973b3b-1f0c-4196-b6a2-c153cbdf9c91" data-file-name="components/ingredient-entry.tsx">Detected Ingredients</span></h3>
                <button onClick={() => {
              setIsScanningComplete(false);
              setScanResults([]);
            }} className="text-muted-foreground hover:text-foreground" data-unique-id="fff89da8-6262-4cb1-9e1c-151878774aaa" data-file-name="components/ingredient-entry.tsx">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4" data-unique-id="92b31284-8d69-4a5b-a299-035ab80bbe5c" data-file-name="components/ingredient-entry.tsx" data-dynamic-text="true">
                {scanResults.map((ingredient, index) => <div key={index} className={cn("bg-card border rounded-lg px-3 py-2 text-sm", ingredient.confidence && ingredient.confidence >= confidenceThreshold ? "border-primary/30" : "border-border opacity-70")} data-unique-id="c3e14db5-e888-46e0-9151-cd6151494ac5" data-file-name="components/ingredient-entry.tsx" data-dynamic-text="true">
                    <div className="flex items-center justify-between" data-unique-id="e834b2af-c8c2-4b85-9517-91f78509d215" data-file-name="components/ingredient-entry.tsx" data-dynamic-text="true">
                      <div className="font-medium" data-unique-id="6004093b-851b-41d2-9552-68bbcdbf5853" data-file-name="components/ingredient-entry.tsx" data-dynamic-text="true">{ingredient.name}</div>
                      {ingredient.confidence && <div className={cn("text-xs px-1.5 py-0.5 rounded-full", ingredient.confidence >= 85 ? "bg-primary/20 text-primary" : ingredient.confidence >= 70 ? "bg-secondary/20 text-secondary" : "bg-muted text-muted-foreground")} data-unique-id="e47333e4-bbc3-49f7-baeb-e6a34bb9c209" data-file-name="components/ingredient-entry.tsx" data-dynamic-text="true">
                          {Math.round(ingredient.confidence)}<span className="editable-text" data-unique-id="a1c4ea5a-16fe-415d-bf72-b8714e05a458" data-file-name="components/ingredient-entry.tsx">%
                        </span></div>}
                    </div>
                    {ingredient.quantity && ingredient.unit && <div className="text-xs text-muted-foreground mt-1" data-unique-id="b47d7b99-f6b6-45ff-86d9-de83541d0087" data-file-name="components/ingredient-entry.tsx" data-dynamic-text="true">
                        {ingredient.quantity} {ingredient.unit}
                      </div>}
                  </div>)}
              </div>
              
              <div className="flex justify-end" data-unique-id="62653325-08e1-479b-a0e8-6870a9eae33d" data-file-name="components/ingredient-entry.tsx">
                <button onClick={handleAddScannedIngredients} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm" data-unique-id="972f13a1-e8c6-4b27-9dec-e1fba4353ee1" data-file-name="components/ingredient-entry.tsx"><span className="editable-text" data-unique-id="3390a75c-0da2-4cbf-8014-00d738a4d690" data-file-name="components/ingredient-entry.tsx">
                  Add all ingredients
                </span></button>
              </div>
            </motion.div>}
        </AnimatePresence>
        
        {/* Ingredients list */}
        <h3 className="font-medium mb-3 text-lg" data-unique-id="f8b6bfcb-6b88-43e7-883c-1578ece34b83" data-file-name="components/ingredient-entry.tsx"><span className="editable-text" data-unique-id="b4994780-4738-4800-919f-c2af58c70538" data-file-name="components/ingredient-entry.tsx">Your Ingredients</span></h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3" data-unique-id="9c2fa529-db8a-485e-ac6f-ac0d898628d4" data-file-name="components/ingredient-entry.tsx" data-dynamic-text="true">
          <AnimatePresence>
            {ingredients.map(ingredient => <motion.div key={ingredient.id} initial={{
            opacity: 0,
            scale: 0.8
          }} animate={{
            opacity: 1,
            scale: 1
          }} exit={{
            opacity: 0,
            scale: 0.8
          }} className="group bg-muted dark:bg-muted/50 rounded-lg px-4 py-3 flex justify-between items-center" data-unique-id="c57f98e2-2062-4867-99fd-5796991dc35d" data-file-name="components/ingredient-entry.tsx">
                <div data-unique-id="2b68a9e9-7929-42e1-b45e-b3032dd1c961" data-file-name="components/ingredient-entry.tsx" data-dynamic-text="true">
                  <p className="font-medium" data-unique-id="2355a365-6796-42dd-ace7-fa8a417a2e6e" data-file-name="components/ingredient-entry.tsx" data-dynamic-text="true">{ingredient.name}</p>
                  {ingredient.quantity && ingredient.unit && <span className="text-sm text-muted-foreground" data-unique-id="1ff23a1d-7a20-46e2-a110-d0bc28f6fb35" data-file-name="components/ingredient-entry.tsx" data-dynamic-text="true">{ingredient.quantity} {ingredient.unit}</span>}
                </div>
                <button onClick={() => handleRemoveIngredient(ingredient.id)} className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity text-muted-foreground hover:text-destructive" data-unique-id="d13250c0-3d1b-4679-983e-8a33c5547c6f" data-file-name="components/ingredient-entry.tsx">
                  <X className="w-5 h-5" />
                </button>
              </motion.div>)}
          </AnimatePresence>
          
          {ingredients.length === 0 && <div className="col-span-full text-center py-8 text-muted-foreground" data-unique-id="aefb384e-ea61-43de-9d29-a22865c28466" data-file-name="components/ingredient-entry.tsx"><span className="editable-text" data-unique-id="c23292e7-fc0a-4f93-8e2e-b268f35406a5" data-file-name="components/ingredient-entry.tsx">
              No ingredients added yet. Start by adding some!
            </span></div>}
        </div>
      </div>
      
      {/* Camera Modal */}
      <AnimatePresence>
        {showCamera && <CameraCapture onCapture={handleImageCapture} onClose={handleCameraClose} onDetectedIngredients={handleDetectedIngredients} useML={true} mlProvider={selectedProvider} />}
      </AnimatePresence>
    </section>;
}