"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Scan } from "lucide-react";
import { cn } from "@/lib/utils";
import { CameraCapture } from "./camera-capture";
import { DetectedIngredient } from "@/lib/services/ingredient-detection";
import { useIngredientStore } from "@/store/ingredient-store";
import { toast } from "sonner";
import { MLDetectionSettings } from "./ml-detection-settings";
import { IngredientSearchBar } from "./ingredient-search-bar";
import { PantryExpiry } from "./pantry-expiry";
export function IngredientEntry() {
  const { ingredients, addIngredient, removeIngredient } = useIngredientStore();
  const [isScanning, setIsScanning] = useState(false);
  const [isScanningComplete, setIsScanningComplete] = useState(false);
  const [scanResults, setScanResults] = useState<DetectedIngredient[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(70);
  const [mlEnabled] = useState<boolean>(true);
  const handleRemoveIngredient = (id: string) => {
    removeIngredient(id);
  };
  const handleScan = () => {
    setShowCamera(true);
  };
  const handleCameraClose = () => {
    setShowCamera(false);
  };
  const handleImageCapture = async () => {
    setShowCamera(false);
    // We don't need to set scanning state here anymore as the camera component handles it
  };
  const handleDetectedIngredients = (
    detectedIngredients: DetectedIngredient[]
  ) => {
    if (detectedIngredients.length > 0) {
      setScanResults(detectedIngredients);
      setIsScanningComplete(true);
      setIsScanning(false);
      setIsProcessingImage(false);
    } else {
      toast.error(
        "No ingredients detected. Please try again with a clearer image."
      );
      setIsScanning(false);
      setIsProcessingImage(false);
    }
  };
  const handleAddScannedIngredients = () => {
    // Filter ingredients by confidence threshold if confidence is available
    const filteredResults = scanResults.filter(
      (result) => !result.confidence || result.confidence >= confidenceThreshold
    );
    const newIngredients = filteredResults.map((result) => ({
      id: `scan-${Date.now()}-${Math.random()}`,
      name: result.name,
      quantity: result.quantity,
      unit: result.unit,
    }));
    if (newIngredients.length === 0) {
      toast.error(
        "No ingredients meet the confidence threshold. Try lowering the threshold or taking a clearer photo."
      );
      return;
    }
    const mergedCount = newIngredients.filter((ingredient) => addIngredient(ingredient).merged).length;
    setScanResults([]);
    setIsScanningComplete(false);
    const mergeNote = mergedCount > 0 ? ` (${mergedCount} added to amounts you already had)` : "";
    if (newIngredients.length < scanResults.length) {
      toast.success(
        `Added ${newIngredients.length} ingredients that met the confidence threshold!${mergeNote}`
      );
    } else {
      toast.success(`Added ${newIngredients.length} ingredients to your list!${mergeNote}`);
    }
  };
  return (
    <section
      id="ingredient-entry"
      className="relative scroll-mt-24"
    >
      <div
        className="mb-8"
      ></div>

      {/* Diagonal design element */}
      <div
        className="absolute -z-10 top-0 right-0 w-1/3 h-32 bg-secondary/10 dark:bg-secondary/20 transform -rotate-12 rounded-3xl"
      ></div>
      <h2
        className="text-2xl font-bold mb-4"
      >
        
          Your Ingredients
        
      </h2>

      <div
        className="bg-card rounded-2xl p-6 shadow-sm dark:shadow-secondary/5 border border-border"
      >
        {/* Input area */}
        <div
          className="flex flex-wrap gap-2 mb-6"
        >
          <div
            className="relative flex-1/3  min-w-[200px] "
          >
            <IngredientSearchBar />
          </div>
          <div className="flex lg:flex-1 gap-2 w-full">
            
            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              onClick={handleScan}
              className={cn(
                "px-4 py-3 h-12 flex-1/2 rounded-lg transition-colors flex justify-center items-center gap-2",
                mlEnabled
                  ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  : "bg-muted text-foreground hover:bg-muted/80",
                isProcessingImage && "opacity-50 cursor-not-allowed"
              )}
              disabled={isProcessingImage}
            >
              <span>Scan</span>
              <Scan className="w-5 h-5" />
            </motion.button>

            <div
              className=" items-center gap-2"
            >
            
              <MLDetectionSettings
                confidenceThreshold={confidenceThreshold}
                onConfidenceChange={setConfidenceThreshold}
              />
            </div>
          </div>
        </div>

        {/* Scanning UI */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              className="mb-6 bg-muted rounded-lg p-4 flex items-center justify-center"
            >
              <div
                className="flex flex-col items-center"
              >
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                <p>
                  
                    Processing your image...
                  
                </p>
              </div>
            </motion.div>
          )}

          {isScanningComplete && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              className="mb-6 bg-muted rounded-lg p-4"
            >
              <div
                className="flex justify-between items-center mb-3"
              >
                <h3
                  className="font-medium"
                >
                  
                    Detected Ingredients
                  
                </h3>
                <button
                  onClick={() => {
                    setIsScanningComplete(false);
                    setScanResults([]);
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div
                className="flex flex-wrap gap-2 mb-4"
              >
                {scanResults.map((ingredient, index) => (
                  <div
                    key={index}
                    className={cn(
                      "bg-card border rounded-lg px-3 py-2 text-sm",
                      ingredient.confidence &&
                        ingredient.confidence >= confidenceThreshold
                        ? "border-primary/30"
                        : "border-border opacity-70"
                    )}
                  >
                    <div
                      className="flex items-center justify-between"
                    >
                      <div
                        className="font-medium"
                      >
                        {ingredient.name}
                      </div>
                      {ingredient.confidence && (
                        <div
                          className={cn(
                            "text-xs px-1.5 py-0.5 rounded-full",
                            ingredient.confidence >= 85
                              ? "bg-primary/20 text-primary"
                              : ingredient.confidence >= 70
                              ? "bg-secondary/20 text-secondary"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {Math.round(ingredient.confidence)}
                          
                            %
                          
                        </div>
                      )}
                    </div>
                    {ingredient.quantity && ingredient.unit && (
                      <div
                        className="text-xs text-muted-foreground mt-1"
                      >
                        {ingredient.quantity} {ingredient.unit}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div
                className="flex justify-end"
              >
                <button
                  onClick={handleAddScannedIngredients}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  
                    Add all ingredients
                  
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ingredients list */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 items-start max-h-80 overflow-y-auto pr-1"
        >
          <AnimatePresence>
            {ingredients.map((ingredient) => (
              <motion.div
                key={ingredient.id}
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                }}
                className="group bg-muted dark:bg-muted/50 rounded-lg px-4 py-3 flex justify-between items-center"
              >
                <div>
                  <p
                    className="font-medium capitalize"
                  >
                    {ingredient.name}
                  </p>
                  {ingredient.quantity && ingredient.unit && (
                    <span
                      className="text-sm text-muted-foreground"
                    >
                      {ingredient.quantity} {ingredient.unit}
                    </span>
                  )}
                  <PantryExpiry ingredient={ingredient} />
                </div>
                {/* Always visible: a hover-only button cannot be found or tapped on a phone */}
                <button
                  onClick={() => handleRemoveIngredient(ingredient.id)}
                  aria-label={`Remove ${ingredient.name}`}
                  className="-mr-2 p-2 rounded-full text-muted-foreground/70 hover:text-destructive hover:bg-destructive/10 focus-visible:text-destructive transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {ingredients.length === 0 && (
            <div
              className="col-span-full text-center py-8 text-muted-foreground"
            >
              
                No ingredients added yet. Start by adding some!
              
            </div>
          )}
        </div>
      </div>

      {/* Camera Modal */}
      <AnimatePresence>
        {showCamera && (
          <CameraCapture
            onCapture={handleImageCapture}
            onClose={handleCameraClose}
            onDetectedIngredients={handleDetectedIngredients}
            useML={true}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
