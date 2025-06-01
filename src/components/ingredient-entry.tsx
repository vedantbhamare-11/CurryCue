"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Scan } from "lucide-react";
import { Ingredient } from "@/types";
import { cn } from "@/lib/utils";
import { CameraCapture } from "./camera-capture";
import { DetectedIngredient } from "@/lib/services/ingredient-detection";
import { useIngredientStore } from "@/store/ingredient-store";
import { toast } from "sonner";
import { MLDetectionSettings } from "./ml-detection-settings";
import { IngredientSearchBar } from "./ingredient-search-bar";
import { ModelProvider } from "@/types";
export function IngredientEntry() {
  const { ingredients, addIngredient, removeIngredient } = useIngredientStore();
  const [inputValue, setInputValue] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [isScanningComplete, setIsScanningComplete] = useState(false);
  const [scanResults, setScanResults] = useState<DetectedIngredient[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [selectedProvider, setSelectedProvider] =
    useState<ModelProvider>("azure-gpt-4o");
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(70);
  const [mlEnabled, setMlEnabled] = useState<boolean>(true);
  const handleAddIngredient = () => {
    if (!inputValue.trim()) return;
    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: inputValue.trim(),
    };
    addIngredient(newIngredient);
    setInputValue("");
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
    newIngredients.forEach((ingredient) => {
      addIngredient(ingredient);
    });
    setScanResults([]);
    setIsScanningComplete(false);
    if (newIngredients.length < scanResults.length) {
      toast.success(
        `Added ${newIngredients.length} ingredients that met the confidence threshold!`
      );
    } else {
      toast.success(`Added ${newIngredients.length} ingredients to your list!`);
    }
  };
  return (
    <section
      id="ingredient-entry"
      className="relative"
      data-unique-id="0716f3d0-9e25-495f-a8d6-31679afb6008"
      data-file-name="components/ingredient-entry.tsx"
      data-dynamic-text="true"
    >
      <div
        className="mb-8"
        data-unique-id="44ac2c7d-6ab7-4852-9b72-45091138a7d0"
        data-file-name="components/ingredient-entry.tsx"
      >
        <h2
          className="text-2xl font-bold mb-2"
          data-unique-id="48b10bf7-f1cd-4d89-8822-b79f909f5cee"
          data-file-name="components/ingredient-entry.tsx"
        >
          <div
            style={{
              height: 0,
              width: 0,
            }}
          ></div>
        </h2>
        <p
          className="text-muted-foreground"
          data-unique-id="930de64d-c661-4802-bd9d-289e2da33726"
          data-file-name="components/ingredient-entry.tsx"
        >
          <div
            style={{
              height: 0,
              width: 0,
            }}
          ></div>
        </p>
      </div>

      {/* Diagonal design element */}
      <div
        className="absolute -z-10 top-0 right-0 w-1/3 h-32 bg-secondary/10 dark:bg-secondary/20 transform -rotate-12 rounded-3xl"
        data-unique-id="59f46d98-4674-4f2e-9ef4-8145d762df4d"
        data-file-name="components/ingredient-entry.tsx"
      ></div>
      <h3
        className="text-2xl font-bold mb-4"
        data-unique-id="42e349a5-100f-4220-914b-846048b2a48a"
        data-file-name="components/ingredient-entry.tsx"
      >
        <span
          className="editable-text"
          data-unique-id="00e55848-3c87-49a1-971c-adb78aee4db2"
          data-file-name="components/ingredient-entry.tsx"
        >
          Your Ingredients
        </span>
      </h3>

      <div
        className="bg-card rounded-2xl p-6 shadow-sm dark:shadow-secondary/5 border border-border"
        data-unique-id="a66ab651-3fe7-4c5e-b790-7a3ee6c3907a"
        data-file-name="components/ingredient-entry.tsx"
        data-dynamic-text="true"
      >
        {/* Input area */}
        <div
          className="flex flex-wrap gap-2 mb-6"
          data-unique-id="e27bdee7-7bc0-4a23-a2eb-a5552b4eef7e"
          data-file-name="components/ingredient-entry.tsx"
        >
          <div
            className="relative flex-1/3  min-w-[200px] "
            data-unique-id="b5ff3133-4351-402b-89f7-0416b49c64cd"
            data-file-name="components/ingredient-entry.tsx"
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
              data-unique-id="7e48fbc1-d996-4ae8-a4f1-d85d14ecbd1a"
              data-file-name="components/ingredient-entry.tsx"
              data-dynamic-text="true"
            >
              <span>Scan</span>
              <Scan className="w-5 h-5" />
            </motion.button>

            <div
              className=" items-center gap-2"
              data-unique-id="94fee43c-87f7-46a0-af58-51aa1073ed90"
              data-file-name="components/ingredient-entry.tsx"
            >
            
              <MLDetectionSettings
                currentProvider={selectedProvider}
                onProviderChange={setSelectedProvider}
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
              data-unique-id="e69820f3-088a-4cad-aff6-a801b42a9c43"
              data-file-name="components/ingredient-entry.tsx"
            >
              <div
                className="flex flex-col items-center"
                data-unique-id="38a78267-4705-4934-9e0e-afed88dfe55a"
                data-file-name="components/ingredient-entry.tsx"
              >
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                <p
                  data-unique-id="6c89e457-b38f-4755-bd29-42798b86c6df"
                  data-file-name="components/ingredient-entry.tsx"
                >
                  <span
                    className="editable-text"
                    data-unique-id="0ccb7505-b0ad-43da-8447-8353b4b7bbba"
                    data-file-name="components/ingredient-entry.tsx"
                  >
                    Processing your image...
                  </span>
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
              data-unique-id="aa0e54ba-4100-4a0d-8efd-40a7cfe47616"
              data-file-name="components/ingredient-entry.tsx"
            >
              <div
                className="flex justify-between items-center mb-3"
                data-unique-id="17093827-50cb-474a-9ade-9a509aed3862"
                data-file-name="components/ingredient-entry.tsx"
              >
                <h3
                  className="font-medium"
                  data-unique-id="9aec31c8-86ab-4c00-8fa0-614eae625bef"
                  data-file-name="components/ingredient-entry.tsx"
                >
                  <span
                    className="editable-text"
                    data-unique-id="ecc38c2e-8de1-4daf-b7ec-c1e51c98622f"
                    data-file-name="components/ingredient-entry.tsx"
                  >
                    Detected Ingredients
                  </span>
                </h3>
                <button
                  onClick={() => {
                    setIsScanningComplete(false);
                    setScanResults([]);
                  }}
                  className="text-muted-foreground hover:text-foreground"
                  data-unique-id="02af607c-5485-47ae-a660-5cb6cf05030c"
                  data-file-name="components/ingredient-entry.tsx"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div
                className="flex flex-wrap gap-2 mb-4"
                data-unique-id="16537227-b7f3-42fc-8c99-a0676538fd96"
                data-file-name="components/ingredient-entry.tsx"
                data-dynamic-text="true"
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
                    data-unique-id="65655ad8-7c55-4869-aaa4-8790e5e711e1"
                    data-file-name="components/ingredient-entry.tsx"
                    data-dynamic-text="true"
                  >
                    <div
                      className="flex items-center justify-between"
                      data-unique-id="4b7ae39a-d28b-4f0b-b569-9376a8c7c137"
                      data-file-name="components/ingredient-entry.tsx"
                      data-dynamic-text="true"
                    >
                      <div
                        className="font-medium"
                        data-unique-id="250953fc-cefb-4b35-be83-6b032443592e"
                        data-file-name="components/ingredient-entry.tsx"
                        data-dynamic-text="true"
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
                          data-unique-id="8f6a15cd-d2d2-4caa-8c86-2c48500b60ca"
                          data-file-name="components/ingredient-entry.tsx"
                          data-dynamic-text="true"
                        >
                          {Math.round(ingredient.confidence)}
                          <span
                            className="editable-text"
                            data-unique-id="b6a09267-1053-48a9-a129-65a973864d5a"
                            data-file-name="components/ingredient-entry.tsx"
                          >
                            %
                          </span>
                        </div>
                      )}
                    </div>
                    {ingredient.quantity && ingredient.unit && (
                      <div
                        className="text-xs text-muted-foreground mt-1"
                        data-unique-id="535caa96-ab36-47e8-ac0b-bc0a6c3b7099"
                        data-file-name="components/ingredient-entry.tsx"
                        data-dynamic-text="true"
                      >
                        {ingredient.quantity} {ingredient.unit}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div
                className="flex justify-end"
                data-unique-id="f15dfc39-7c5f-40d8-9887-25119389313b"
                data-file-name="components/ingredient-entry.tsx"
              >
                <button
                  onClick={handleAddScannedIngredients}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                  data-unique-id="7c4e2ecc-cb1a-4036-bfeb-24319affdd04"
                  data-file-name="components/ingredient-entry.tsx"
                >
                  <span
                    className="editable-text"
                    data-unique-id="7bc90437-cfe8-4c19-aadf-50e75cf30b0e"
                    data-file-name="components/ingredient-entry.tsx"
                  >
                    Add all ingredients
                  </span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ingredients list */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
          data-unique-id="4a91e35f-d0ea-48b1-8009-f8a3728f0feb"
          data-file-name="components/ingredient-entry.tsx"
          data-dynamic-text="true"
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
                data-unique-id="2383409b-5c59-41ae-9a34-60fcfa62d737"
                data-file-name="components/ingredient-entry.tsx"
              >
                <div
                  data-unique-id="06b4c641-5db4-4b97-8c3b-3cc90e4bf4e9"
                  data-file-name="components/ingredient-entry.tsx"
                  data-dynamic-text="true"
                >
                  <p
                    className="font-medium"
                    data-unique-id="ff0b9d52-32a2-45bc-ad87-7d6131ea679f"
                    data-file-name="components/ingredient-entry.tsx"
                    data-dynamic-text="true"
                  >
                    {ingredient.name}
                  </p>
                  {ingredient.quantity && ingredient.unit && (
                    <span
                      className="text-sm text-muted-foreground"
                      data-unique-id="992e13b7-849c-4979-aa29-ea23e07756b8"
                      data-file-name="components/ingredient-entry.tsx"
                      data-dynamic-text="true"
                    >
                      {ingredient.quantity} {ingredient.unit}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveIngredient(ingredient.id)}
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                  data-unique-id="318f3b69-410a-4736-90b8-8588d75ac0f6"
                  data-file-name="components/ingredient-entry.tsx"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {ingredients.length === 0 && (
            <div
              className="col-span-full text-center py-8 text-muted-foreground"
              data-unique-id="b2550a0c-9a99-4bd4-8733-cca389f48bdb"
              data-file-name="components/ingredient-entry.tsx"
            >
              <span
                className="editable-text"
                data-unique-id="0ccc19fd-7e54-4161-9ef4-870d38c0ea90"
                data-file-name="components/ingredient-entry.tsx"
              >
                No ingredients added yet. Start by adding some!
              </span>
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
            mlProvider={selectedProvider}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
