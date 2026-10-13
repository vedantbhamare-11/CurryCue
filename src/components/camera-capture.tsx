"use client";

import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import { Camera, X, RefreshCw, Check, Loader2, Scan } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DetectedIngredient } from '@/lib/services/ingredient-detection';
import { toast } from 'sonner';
interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
  onClose: () => void;
  onDetectedIngredients?: (ingredients: DetectedIngredient[]) => void;
  useML?: boolean;
}
export function CameraCapture({
  onCapture,
  onClose,
  onDetectedIngredients,
  useML = false
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
      const response = await fetch('/api/detect-ingredients/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image: imageSrc
        })
      });
      if (response.status === 429) {
        toast.error("You're scanning too fast. Please wait a moment and try again.");
        return;
      }
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
  }} className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{
      scale: 0.9,
      opacity: 0
    }} animate={{
      scale: 1,
      opacity: 1
    }} exit={{
      scale: 0.9,
      opacity: 0
    }} className="bg-card rounded-2xl w-full max-w-md overflow-hidden shadow-lg border border-border">
        <div className="p-4 flex justify-between items-center border-b border-border">
          <h3 className="font-medium text-lg flex items-center gap-2">
            {useML ? <>
                <Scan className="w-5 h-5 text-primary" />
                ML Ingredient Detection
              </> : <span className="editable-text">Scan Ingredients</span>}
          </h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative aspect-[4/3] bg-muted">
          {!capturedImage ? <>
              <AnimatePresence>
                {!isCameraReady && !cameraError && <motion.div initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} exit={{
              opacity: 0
            }} className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm text-muted-foreground">Initializing camera...</p>
                    </div>
                  </motion.div>}
              </AnimatePresence>

              {cameraError ? <div className="absolute inset-0 flex items-center justify-center p-6">
                  <div className="text-center">
                    <p className="text-destructive mb-2">Camera access error</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      {cameraError || "Please allow camera access to scan ingredients"}
                    </p>
                    <button onClick={onClose} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">
                      Close
                    </button>
                  </div>
                </div> : <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" videoConstraints={{
            facingMode: "environment"
          }} onUserMedia={handleUserMedia} onUserMediaError={handleUserMediaError} className={cn("absolute inset-0 w-full h-full object-cover", !isCameraReady && "opacity-0")} />}
            </> : <div className="absolute inset-0">
              <img src={capturedImage} alt="Captured ingredient" className="w-full h-full object-cover" />
              
              {/* ML processing overlay */}
              {isProcessing && <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3 p-4 bg-card rounded-xl border border-border shadow-lg">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="font-medium">Analyzing ingredients...</p>
                    <p className="text-sm text-muted-foreground">Using AI to detect ingredients</p>
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
        }} className="border-t border-border overflow-hidden">
              <div className="p-4">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Detected {detectedIngredients.length} ingredients</span>
                </h4>
                
                <div className="max-h-40 overflow-y-auto pr-1">
                  <div className="space-y-2">
                    {detectedIngredients.map((ingredient, idx) => <div key={`${ingredient.name}-${idx}`} className="flex items-center justify-between bg-muted/50 rounded-lg p-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                          <span className="font-medium">{ingredient.name}</span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          {ingredient.quantity && ingredient.unit && <span>{ingredient.quantity} {ingredient.unit}</span>}
                          {ingredient.confidence && <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                              {Math.round(ingredient.confidence)}%
                            </span>}
                        </div>
                      </div>)}
                  </div>
                </div>
              </div>
            </motion.div>}
        </AnimatePresence>

        <div className="p-4 flex justify-center gap-4">
          {!capturedImage ? <motion.button whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }} onClick={captureImage} disabled={!isCameraReady || !!cameraError} className={cn("bg-primary text-primary-foreground rounded-full p-4", "hover:bg-primary/90 transition-colors", (!isCameraReady || !!cameraError) && "opacity-50 cursor-not-allowed")}>
              <Camera className="w-6 h-6" />
            </motion.button> : <>
              <motion.button whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }} onClick={retakeImage} className="bg-muted text-muted-foreground rounded-full p-4 hover:bg-muted/80 transition-colors">
                <RefreshCw className="w-6 h-6" />
              </motion.button>
              
              <motion.button whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }} onClick={confirmImage} disabled={isProcessing} className={cn("bg-primary text-primary-foreground rounded-full p-4 hover:bg-primary/90 transition-colors", isProcessing && "opacity-50 cursor-not-allowed")}>
                <Check className="w-6 h-6" />
              </motion.button>
            </>}
        </div>
        
        <div className="px-4 pb-4 text-center text-sm text-muted-foreground">
          {useML ? <p>Our AI will analyze and identify ingredients in your photo</p> : <p>Position your ingredients clearly in the frame for best results</p>}
        </div>
      </motion.div>
    </motion.div>;
}