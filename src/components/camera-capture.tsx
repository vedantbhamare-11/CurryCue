"use client";

import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import { Camera, X, RefreshCw, Check, Loader2, Scan } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DetectedIngredient } from '@/lib/services/ingredient-detection';
import { toast } from 'sonner';
import { ModelProvider } from '@/types';
interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
  onClose: () => void;
  onDetectedIngredients?: (ingredients: DetectedIngredient[]) => void;
  useML?: boolean;
  mlProvider?: ModelProvider;
}
export function CameraCapture({
  onCapture,
  onClose,
  onDetectedIngredients,
  useML = false,
  mlProvider = "azure-gpt-4o"
}: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedIngredients, setDetectedIngredients] = useState<DetectedIngredient[]>([]);
  const handleUserMedia = useCallback(() => {
    setIsCameraReady(true);
    setCameraError(null);
  }, []);
  const handleUserMediaError = useCallback((error: string | DOMException) => {
    setIsCameraReady(false);
    setCameraError(typeof error === 'string' ? error : error.message);
  }, []);
  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);

        // If ML detection is enabled, process the image
        if (useML) {
          processImageWithML(imageSrc);
        }
      }
    }
  }, [webcamRef, useML]);
  const processImageWithML = async (imageSrc: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/detect-ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image: imageSrc,
          provider: mlProvider
        })
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      if (data.success && data.ingredients) {
        setDetectedIngredients(data.ingredients);
        if (onDetectedIngredients) {
          onDetectedIngredients(data.ingredients);
        }
        if (data.ingredients.length > 0) {
          toast.success(`Detected ${data.ingredients.length} ingredients!`);
        } else {
          toast.info("No ingredients detected. Please try again with a clearer image.");
        }
      } else {
        toast.error("Failed to detect ingredients");
      }
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error("Failed to process image");
    } finally {
      setIsProcessing(false);
    }
  };
  const retakeImage = useCallback(() => {
    setCapturedImage(null);
    setDetectedIngredients([]);
  }, []);
  const confirmImage = useCallback(() => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  }, [capturedImage, onCapture]);
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} exit={{
    opacity: 0
  }} className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" data-unique-id="2eaf67cc-cc67-46e4-ad7e-2febcde93696" data-file-name="components/camera-capture.tsx">
      <motion.div initial={{
      scale: 0.9,
      opacity: 0
    }} animate={{
      scale: 1,
      opacity: 1
    }} exit={{
      scale: 0.9,
      opacity: 0
    }} className="bg-card rounded-2xl w-full max-w-md overflow-hidden shadow-lg border border-border" data-unique-id="2835bd24-e84d-4bcb-8f69-c48b7fa078fd" data-file-name="components/camera-capture.tsx" data-dynamic-text="true">
        <div className="p-4 flex justify-between items-center border-b border-border" data-unique-id="0a0bbd42-1159-426c-8053-34001046ba13" data-file-name="components/camera-capture.tsx">
          <h3 className="font-medium text-lg flex items-center gap-2" data-unique-id="cef0418f-1ef2-4d65-b1c9-f6d1fe9418d2" data-file-name="components/camera-capture.tsx" data-dynamic-text="true">
            {useML ? <>
                <Scan className="w-5 h-5 text-primary" />
                <span className="editable-text" data-unique-id="7dc5b126-e3e4-4b88-91a4-ae6e99f9840a" data-file-name="components/camera-capture.tsx">ML Ingredient Detection</span>
              </> : <span className="editable-text" data-unique-id="fb0e1e31-f406-49c8-8cfe-ed8bae65b9c2" data-file-name="components/camera-capture.tsx">Scan Ingredients</span>}
          </h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors" data-unique-id="9aaf437d-2749-4dd1-bb8a-880bf1ed692a" data-file-name="components/camera-capture.tsx">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative aspect-[4/3] bg-muted" data-unique-id="34347b70-edb4-4d37-9bc5-5e3ba6a53d94" data-file-name="components/camera-capture.tsx" data-dynamic-text="true">
          {!capturedImage ? <>
              <AnimatePresence>
                {!isCameraReady && !cameraError && <motion.div initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} exit={{
              opacity: 0
            }} className="absolute inset-0 flex items-center justify-center" data-unique-id="eac4c51c-5f6e-4cfd-94b6-aa44b31479dd" data-file-name="components/camera-capture.tsx">
                    <div className="flex flex-col items-center gap-2" data-unique-id="4b5791b7-9b1f-4624-bba6-f7a164338c84" data-file-name="components/camera-capture.tsx">
                      <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" data-unique-id="4c96276f-e44b-49ed-9e56-5a1d82280807" data-file-name="components/camera-capture.tsx" />
                      <p className="text-sm text-muted-foreground" data-unique-id="149c20c4-4c86-401e-b7e6-0dc41be897a4" data-file-name="components/camera-capture.tsx"><span className="editable-text" data-unique-id="df015bb3-d0ee-4f07-8957-fe768199b208" data-file-name="components/camera-capture.tsx">Initializing camera...</span></p>
                    </div>
                  </motion.div>}
              </AnimatePresence>

              {cameraError ? <div className="absolute inset-0 flex items-center justify-center p-6" data-unique-id="cbdc30b3-7a28-439f-ac49-4b1c28b02db9" data-file-name="components/camera-capture.tsx">
                  <div className="text-center" data-unique-id="a4063713-d857-4730-a0d8-e447393fb6f4" data-file-name="components/camera-capture.tsx">
                    <p className="text-destructive mb-2" data-unique-id="66dd67a4-1f8b-447c-a7ff-84745c5437d7" data-file-name="components/camera-capture.tsx"><span className="editable-text" data-unique-id="c95860db-b3bd-4aaf-b947-9730d7da32ca" data-file-name="components/camera-capture.tsx">Camera access error</span></p>
                    <p className="text-sm text-muted-foreground mb-4" data-unique-id="b70e0163-8288-44dd-b71c-6505285c82bc" data-file-name="components/camera-capture.tsx" data-dynamic-text="true">
                      {cameraError || "Please allow camera access to scan ingredients"}
                    </p>
                    <button onClick={onClose} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg" data-unique-id="5af24691-a15a-4611-8946-598461e9ba80" data-file-name="components/camera-capture.tsx"><span className="editable-text" data-unique-id="1ab587f4-7019-457a-a1ad-01e1d7ddd3fa" data-file-name="components/camera-capture.tsx">
                      Close
                    </span></button>
                  </div>
                </div> : <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" videoConstraints={{
            facingMode: "environment"
          }} onUserMedia={handleUserMedia} onUserMediaError={handleUserMediaError} className={cn("absolute inset-0 w-full h-full object-cover", !isCameraReady && "opacity-0")} />}
            </> : <div className="absolute inset-0" data-unique-id="b4f4399f-a83b-42b0-9d3f-08f10b33e4d3" data-file-name="components/camera-capture.tsx" data-dynamic-text="true">
              <img src={capturedImage} alt="Captured ingredient" className="w-full h-full object-cover" data-unique-id="773db53a-38ad-4041-b3d6-0caf65218360" data-file-name="components/camera-capture.tsx" />
              
              {/* ML processing overlay */}
              {isProcessing && <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center" data-unique-id="a254b513-4ce5-4267-9687-a73524d861c5" data-file-name="components/camera-capture.tsx">
                  <div className="flex flex-col items-center gap-3 p-4 bg-card rounded-xl border border-border shadow-lg" data-unique-id="7200b61c-4eae-4555-b943-fd871975b981" data-file-name="components/camera-capture.tsx">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="font-medium" data-unique-id="03aea7aa-9991-4dc5-8dc6-6cbce86d125b" data-file-name="components/camera-capture.tsx"><span className="editable-text" data-unique-id="831e0806-3909-4952-84d0-f1fbc6073b84" data-file-name="components/camera-capture.tsx">Analyzing ingredients...</span></p>
                    <p className="text-sm text-muted-foreground" data-unique-id="1b37fb6d-16d5-491e-967c-97b3b1b46d93" data-file-name="components/camera-capture.tsx"><span className="editable-text" data-unique-id="3c4fd72c-1b5f-4d56-9dcc-c859e051a8ad" data-file-name="components/camera-capture.tsx">Using AI to detect ingredients</span></p>
                  </div>
                </div>}
            </div>}
        </div>

        {/* Detected ingredients section */}
        <AnimatePresence>
          {capturedImage && detectedIngredients.length > 0 && !isProcessing && <motion.div initial={{
          opacity: 0,
          height: 0
        }} animate={{
          opacity: 1,
          height: 'auto'
        }} exit={{
          opacity: 0,
          height: 0
        }} className="border-t border-border overflow-hidden" data-unique-id="86b800d1-6df3-4d4c-971f-e82b9fe36e9f" data-file-name="components/camera-capture.tsx">
              <div className="p-4" data-unique-id="6232f68d-4bf7-41fd-bb3e-34ae4efcd68b" data-file-name="components/camera-capture.tsx">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-1.5" data-unique-id="21bee80a-64ee-40a0-870e-63e41fb416d0" data-file-name="components/camera-capture.tsx">
                  <Check className="w-4 h-4 text-primary" />
                  <span data-unique-id="f6349e69-848b-4449-aded-4589637b71d5" data-file-name="components/camera-capture.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="56c2a0f5-37a5-43e0-bd3b-ec9c525751d4" data-file-name="components/camera-capture.tsx">Detected </span>{detectedIngredients.length}<span className="editable-text" data-unique-id="62b2abf8-2c9d-42cb-b9cf-b46e0d1ed7cb" data-file-name="components/camera-capture.tsx"> ingredients</span></span>
                </h4>
                
                <div className="max-h-40 overflow-y-auto pr-1" data-unique-id="5ca09a29-7f3f-4bed-b17a-a08357fac4d2" data-file-name="components/camera-capture.tsx">
                  <div className="space-y-2" data-unique-id="12bfcacd-bd38-49f7-93ec-5a00cd31db24" data-file-name="components/camera-capture.tsx" data-dynamic-text="true">
                    {detectedIngredients.map((ingredient, idx) => <div key={`${ingredient.name}-${idx}`} className="flex items-center justify-between bg-muted/50 rounded-lg p-2 text-sm" data-unique-id="7c0dd979-3fad-4116-a730-b663a4c0ed06" data-file-name="components/camera-capture.tsx">
                        <div className="flex items-center gap-2" data-unique-id="518bf4e5-06f4-45cc-aa9b-557801024a1e" data-file-name="components/camera-capture.tsx">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" data-unique-id="660f7875-5475-4d22-aa5e-179fa7871113" data-file-name="components/camera-capture.tsx"></div>
                          <span className="font-medium" data-unique-id="34794bb3-2e2f-4f44-8857-6e3f8ee802cf" data-file-name="components/camera-capture.tsx" data-dynamic-text="true">{ingredient.name}</span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-xs text-muted-foreground" data-unique-id="42f72c4c-899a-423e-a4f5-c35b2b3f908f" data-file-name="components/camera-capture.tsx" data-dynamic-text="true">
                          {ingredient.quantity && ingredient.unit && <span data-unique-id="ecbf2bfd-b2bc-4f7e-aa54-449a96793a8c" data-file-name="components/camera-capture.tsx" data-dynamic-text="true">{ingredient.quantity} {ingredient.unit}</span>}
                          {ingredient.confidence && <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-full" data-unique-id="86994d24-0c67-475f-a874-a1d8414f088d" data-file-name="components/camera-capture.tsx" data-dynamic-text="true">
                              {Math.round(ingredient.confidence)}<span className="editable-text" data-unique-id="573d6c0e-b6bc-4db8-acec-10b76a2cb1bd" data-file-name="components/camera-capture.tsx">%
                            </span></span>}
                        </div>
                      </div>)}
                  </div>
                </div>
              </div>
            </motion.div>}
        </AnimatePresence>

        <div className="p-4 flex justify-center gap-4" data-unique-id="9e56ca5d-0b72-4100-a928-d507fa7f77e5" data-file-name="components/camera-capture.tsx" data-dynamic-text="true">
          {!capturedImage ? <motion.button whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }} onClick={captureImage} disabled={!isCameraReady || !!cameraError} className={cn("bg-primary text-primary-foreground rounded-full p-4", "hover:bg-primary/90 transition-colors", (!isCameraReady || !!cameraError) && "opacity-50 cursor-not-allowed")} data-unique-id="8e550114-7f56-4647-b94d-2088353f7380" data-file-name="components/camera-capture.tsx">
              <Camera className="w-6 h-6" />
            </motion.button> : <>
              <motion.button whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }} onClick={retakeImage} className="bg-muted text-muted-foreground rounded-full p-4 hover:bg-muted/80 transition-colors" data-unique-id="6b36eb3c-4ebc-4566-81d9-d5a154efd88c" data-file-name="components/camera-capture.tsx">
                <RefreshCw className="w-6 h-6" />
              </motion.button>
              
              <motion.button whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }} onClick={confirmImage} disabled={isProcessing} className={cn("bg-primary text-primary-foreground rounded-full p-4 hover:bg-primary/90 transition-colors", isProcessing && "opacity-50 cursor-not-allowed")} data-unique-id="c2562e4d-423a-4e4e-94f9-5eadf2ed0456" data-file-name="components/camera-capture.tsx">
                <Check className="w-6 h-6" />
              </motion.button>
            </>}
        </div>
        
        <div className="px-4 pb-4 text-center text-sm text-muted-foreground" data-unique-id="f751a476-b209-4ec0-ae3f-f8514a905690" data-file-name="components/camera-capture.tsx" data-dynamic-text="true">
          {useML ? <p data-unique-id="80a11993-8f97-4b10-8bc6-9cdb4013fe42" data-file-name="components/camera-capture.tsx"><span className="editable-text" data-unique-id="24dadfbf-b668-4261-993f-f39685d49240" data-file-name="components/camera-capture.tsx">Our AI will analyze and identify ingredients in your photo</span></p> : <p data-unique-id="170e1b07-0278-4642-80b6-a91d9c262b3b" data-file-name="components/camera-capture.tsx"><span className="editable-text" data-unique-id="41cbc939-daec-4eab-a077-e2ca8e33f8c9" data-file-name="components/camera-capture.tsx">Position your ingredients clearly in the frame for best results</span></p>}
        </div>
      </motion.div>
    </motion.div>;
}