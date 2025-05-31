"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, VolumeX, Volume2, ChevronLeft, ChevronRight, X, Clock, Maximize, Minimize, Play, Pause, List, MessageSquare } from 'lucide-react';
import { Recipe } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { VoiceCommandParser, VoiceCommandAction } from './voice-command-parser';
import { CookingAssistant } from './cooking-assistant';
interface CookingModeProps {
  recipe: Recipe;
  onClose: () => void;
}
export function CookingMode({
  recipe,
  onClose
}: CookingModeProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentIngredient, setCurrentIngredient] = useState(0);
  const [showIngredients, setShowIngredients] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerRemaining, setTimerRemaining] = useState(0);
  const [showAssistant, setShowAssistant] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const speechSynthRef = useRef<SpeechSynthesis | null>(null);
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      speechSynthRef.current = window.speechSynthesis;

      // Initialize speech recognition if available
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        speechRecognitionRef.current = new SpeechRecognitionAPI();
        if (speechRecognitionRef.current) {
          speechRecognitionRef.current.continuous = true;
          speechRecognitionRef.current.interimResults = false;
          speechRecognitionRef.current.lang = 'en-US';
          speechRecognitionRef.current.onresult = event => {
            const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
            handleVoiceCommandAction({
              type: 'READ_STEP'
            });
          };
          speechRecognitionRef.current.onerror = event => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
          };
          speechRecognitionRef.current.onend = () => {
            // Restart if we're still supposed to be listening
            if (isListening && speechRecognitionRef.current) {
              speechRecognitionRef.current.start();
            }
          };
        }
      } else {
        console.warn('Speech recognition not supported in this browser');
      }
    }
    return () => {
      // Clean up speech synthesis
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }

      // Clean up speech recognition
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.abort();
      }

      // Clean up timer
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (timerRunning && timerRemaining > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimerRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current as NodeJS.Timeout);
            setTimerRunning(false);
            speak("Timer complete!");
            toast.success("Timer complete!");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!timerRunning && timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [timerRunning, timerRemaining]);

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    try {
      if (!isFullscreen) {
        if (containerRef.current?.requestFullscreen) {
          containerRef.current.requestFullscreen().catch(err => {
            console.error('Error attempting to enable fullscreen:', err);
            toast.error("Fullscreen mode not available");
          });
        } else {
          // Fallback for browsers that don't support fullscreen
          setIsFullscreen(true);
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(err => {
            console.error('Error attempting to exit fullscreen:', err);
          });
        } else {
          // Fallback for browsers that don't support fullscreen
          setIsFullscreen(false);
        }
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
      toast.error("Fullscreen mode not available in this context");
      // Simulate fullscreen with CSS as a fallback
      setIsFullscreen(!isFullscreen);
    }
  };

  // Toggle speech recognition
  const toggleSpeechRecognition = () => {
    if (!isListening) {
      startListening();
    } else {
      stopListening();
    }
  };

  // Start speech recognition
  const startListening = () => {
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.start();
        setIsListening(true);
        toast.success("Voice commands activated");
        speak("Voice commands activated. Say 'next' to go to the next step, 'previous' to go back, or 'read' to hear the current step.");
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        toast.error("Couldn't start voice recognition");
      }
    } else {
      toast.error("Speech recognition not supported in this browser");
    }
  };

  // Stop speech recognition
  const stopListening = () => {
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
      toast.success("Voice commands deactivated");
    }
  };

  // Toggle text-to-speech
  const toggleSpeech = () => {
    setIsSpeechEnabled(!isSpeechEnabled);
    if (!isSpeechEnabled) {
      speak("Text to speech enabled. I will read the instructions for you.");
      speak(recipe.steps[currentStep]);
    } else {
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }
    }
  };

  // Speak text using speech synthesis
  const speak = (text: string) => {
    if (speechSynthRef.current && isSpeechEnabled) {
      speechSynthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower than default
      utterance.pitch = 1;
      speechSynthRef.current.speak(utterance);
    }
  };

  // Handle ingredient navigation
  const handleNextIngredient = () => {
    if (currentIngredient < recipe.ingredients.length - 1) {
      setCurrentIngredient(currentIngredient + 1);
      if (isSpeechEnabled) {
        const ingredient = recipe.ingredients[currentIngredient + 1];
        const text = ingredient.quantity && ingredient.unit ? `${ingredient.name}, ${ingredient.quantity} ${ingredient.unit}` : ingredient.name;
        speak(`Ingredient ${currentIngredient + 2}: ${text}`);
      }
      if (!showIngredients) {
        setShowIngredients(true);
      }
    } else {
      if (isSpeechEnabled) {
        speak("That was the last ingredient.");
      }
      toast.info("That was the last ingredient");
    }
  };
  const handlePreviousIngredient = () => {
    if (currentIngredient > 0) {
      setCurrentIngredient(currentIngredient - 1);
      if (isSpeechEnabled) {
        const ingredient = recipe.ingredients[currentIngredient - 1];
        const text = ingredient.quantity && ingredient.unit ? `${ingredient.name}, ${ingredient.quantity} ${ingredient.unit}` : ingredient.name;
        speak(`Ingredient ${currentIngredient}: ${text}`);
      }
      if (!showIngredients) {
        setShowIngredients(true);
      }
    } else {
      if (isSpeechEnabled) {
        speak("You're at the first ingredient.");
      }
      toast.info("You're at the first ingredient");
    }
  };
  const listAllIngredients = () => {
    setShowIngredients(true);
    if (isSpeechEnabled) {
      const ingredientsList = recipe.ingredients.map((ingredient, index) => {
        const text = ingredient.quantity && ingredient.unit ? `${ingredient.name}, ${ingredient.quantity} ${ingredient.unit}` : ingredient.name;
        return `Ingredient ${index + 1}: ${text}`;
      }).join(". ");
      speak(`Here are all the ingredients: ${ingredientsList}`);
    }
  };
  const readIngredient = (index: number) => {
    if (index >= 0 && index < recipe.ingredients.length) {
      setCurrentIngredient(index);
      if (isSpeechEnabled) {
        const ingredient = recipe.ingredients[index];
        const text = ingredient.quantity && ingredient.unit ? `${ingredient.name}, ${ingredient.quantity} ${ingredient.unit}` : ingredient.name;
        speak(`Ingredient ${index + 1}: ${text}`);
      }
      if (!showIngredients) {
        setShowIngredients(true);
      }
    }
  };

  // Handle voice command actions
  const handleVoiceCommandAction = (action: VoiceCommandAction) => {
    switch (action.type) {
      case 'NEXT_STEP':
        handleNextStep();
        break;
      case 'PREVIOUS_STEP':
        handlePreviousStep();
        break;
      case 'GO_TO_STEP':
        setCurrentStep(action.stepNumber);
        if (isSpeechEnabled) {
          speak(recipe.steps[action.stepNumber]);
        }
        break;
      case 'READ_STEP':
        speak(recipe.steps[currentStep]);
        break;
      case 'NEXT_INGREDIENT':
        handleNextIngredient();
        break;
      case 'PREVIOUS_INGREDIENT':
        handlePreviousIngredient();
        break;
      case 'LIST_INGREDIENTS':
        listAllIngredients();
        break;
      case 'READ_INGREDIENT':
        readIngredient(action.ingredientIndex);
        break;
      case 'START_TIMER':
        startTimer(action.minutes * 60);
        break;
      case 'STOP_TIMER':
        stopTimer();
        break;
      case 'TOGGLE_FULLSCREEN':
        toggleFullscreen();
        break;
      case 'EXIT':
        onClose();
        break;
    }
  };

  // Navigate to next step
  const handleNextStep = () => {
    if (currentStep < recipe.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      if (isSpeechEnabled) {
        speak(recipe.steps[currentStep + 1]);
      }
    } else {
      if (isSpeechEnabled) {
        speak("You've reached the end of the recipe. Congratulations!");
      }
    }
  };

  // Navigate to previous step
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      if (isSpeechEnabled) {
        speak(recipe.steps[currentStep - 1]);
      }
    } else {
      if (isSpeechEnabled) {
        speak("You're already at the first step.");
      }
    }
  };

  // Start a timer
  const startTimer = (seconds: number) => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setTimer(seconds);
    setTimerRemaining(seconds);
    setTimerRunning(true);
    speak(`Timer set for ${Math.floor(seconds / 60)} minutes and ${seconds % 60} seconds.`);
    toast.success(`Timer set for ${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`);
  };

  // Stop the timer
  const stopTimer = () => {
    setTimerRunning(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    speak("Timer stopped.");
    toast.info("Timer stopped");
  };

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle pause/resume
  const togglePause = () => {
    setIsPaused(!isPaused);
    if (isPaused) {
      toast.success("Cooking resumed");
    } else {
      toast.info("Cooking paused");
    }
  };

  // Toggle assistant
  const toggleAssistant = () => {
    setShowAssistant(!showAssistant);
  };
  return <VoiceCommandParser isListening={isListening} onCommand={handleVoiceCommandAction} totalSteps={recipe.steps.length} totalIngredients={recipe.ingredients.length} currentStep={currentStep} currentIngredient={currentIngredient}>
      <div ref={containerRef} className={cn("bg-gradient-to-b from-background to-muted/30 text-foreground flex flex-col", "w-full h-full min-h-screen overflow-hidden relative", isFullscreen && "fixed inset-0 z-[100] max-h-screen")} data-unique-id="ae9c54d8-7b95-4c50-9914-3c249818c0d1" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">
        {/* Header */}
        <div className="bg-card/80 backdrop-blur-md border-b border-border p-4 flex justify-between items-center" data-unique-id="43ec16bc-f1fb-4d5d-8a8a-13cf4f732e4a" data-file-name="components/cooking-mode.tsx">
          <div className="flex items-center gap-3" data-unique-id="5322dcf3-a96b-43b0-9034-d11a425f2879" data-file-name="components/cooking-mode.tsx">
            <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors" aria-label="Exit cooking mode" data-unique-id="1621795d-4bdd-4b60-99e1-cbc1d20f26aa" data-file-name="components/cooking-mode.tsx">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold truncate" data-unique-id="7c90b70d-b1ca-4a4c-81c3-1ff2bfd27407" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">{recipe.title}</h2>
          </div>
          
          <div className="flex items-center gap-2" data-unique-id="94015716-46aa-4412-a892-0b99b12f9583" data-file-name="components/cooking-mode.tsx">
            <button onClick={toggleAssistant} className={cn("p-2 rounded-full transition-colors", showAssistant ? "bg-primary text-primary-foreground" : "hover:bg-muted")} aria-label={showAssistant ? "Hide assistant" : "Show assistant"} data-unique-id="fb13e7c3-e7c4-432f-a08c-3f2a4fd547bf" data-file-name="components/cooking-mode.tsx">
              <MessageSquare className="w-5 h-5" />
            </button>
            
            <button onClick={toggleSpeech} className={cn("p-2 rounded-full transition-colors", isSpeechEnabled ? "bg-primary text-primary-foreground" : "hover:bg-muted")} aria-label={isSpeechEnabled ? "Disable text-to-speech" : "Enable text-to-speech"} data-unique-id="d3d6dd68-4323-4288-aa09-9f4f74e74045" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">
              {isSpeechEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            
            <button onClick={toggleSpeechRecognition} className={cn("p-2 rounded-full transition-colors", isListening ? "bg-primary text-primary-foreground" : "hover:bg-muted")} aria-label={isListening ? "Disable voice commands" : "Enable voice commands"} data-unique-id="ebd6f849-5d0f-4d5e-acec-10c9ded288c6" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">
              {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>
            
            <button onClick={toggleFullscreen} className="p-2 rounded-full hover:bg-muted transition-colors" aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"} data-unique-id="b8fbae12-4903-472b-a132-6fb0522fc165" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center" data-unique-id="5aa0c483-514e-459d-83ce-cf3e4bac9488" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">
          {/* Top controls */}
          <div className="w-full max-w-3xl mb-4 flex justify-between" data-unique-id="0850285c-9964-40a6-9b4d-811afebfdea3" data-file-name="components/cooking-mode.tsx">
            <button onClick={togglePause} className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors", isPaused ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80")} data-unique-id="4460c8c2-a20e-4825-b1cc-f266c75a2f74" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              <span className="text-sm" data-unique-id="f56ef4d0-ba6d-4f89-93c4-b842c445e4d8" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">{isPaused ? "Resume" : "Pause"}</span>
            </button>
            
            <button onClick={() => setShowIngredients(!showIngredients)} className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors", showIngredients ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80")} data-unique-id="01e4a96e-5941-42b0-9b13-10ef49e1a86b" data-file-name="components/cooking-mode.tsx">
              <List className="w-4 h-4" />
              <span className="text-sm" data-unique-id="fcaf2698-57ce-4cec-b0e8-fc3ef1668483" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="6e31ec6a-624e-462b-8ffa-eba3ca304ed3" data-file-name="components/cooking-mode.tsx">Ingredients</span></span>
            </button>
          </div>
          
          {/* Ingredients panel */}
          <AnimatePresence>
            {showIngredients && <motion.div initial={{
            opacity: 0,
            height: 0
          }} animate={{
            opacity: 1,
            height: 'auto'
          }} exit={{
            opacity: 0,
            height: 0
          }} className="w-full max-w-3xl mb-6 overflow-hidden" data-unique-id="ef9e9a48-f8be-4539-97dd-4c0dfd3577a2" data-file-name="components/cooking-mode.tsx">
                <div className="bg-card border border-border rounded-xl p-4 shadow-md" data-unique-id="07f6ec17-01dd-4dfa-a389-8b2be8e08191" data-file-name="components/cooking-mode.tsx">
                  <h3 className="font-medium mb-3 flex items-center gap-2" data-unique-id="c8856c2e-b81c-433d-a235-11591366d381" data-file-name="components/cooking-mode.tsx">
                    <span data-unique-id="ad404f68-49dc-43d2-85d6-48ab268599a3" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="4725860d-88ca-4043-8050-f934107ed9b4" data-file-name="components/cooking-mode.tsx">Ingredients</span></span>
                    <span className="text-xs text-muted-foreground" data-unique-id="1c5df7c3-fbdf-4004-aa77-a4db08d0e3fa" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">
                      <span className="editable-text" data-unique-id="227c595b-f22a-4528-a93e-23c3cbe9b4a5" data-file-name="components/cooking-mode.tsx">(</span>{currentIngredient + 1}<span className="editable-text" data-unique-id="8fe84f34-f849-47a8-89c2-56285bf9e01b" data-file-name="components/cooking-mode.tsx">/</span>{recipe.ingredients.length}<span className="editable-text" data-unique-id="aa2c1459-b4ce-412d-a49d-e63614b60cab" data-file-name="components/cooking-mode.tsx">)</span>
                    </span>
                  </h3>
                  
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2" data-unique-id="6b786b2d-75e6-4b3d-9b7a-6edd66f91ed1" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">
                    {recipe.ingredients.map((ingredient, index) => <button key={ingredient.id || index} onClick={() => setCurrentIngredient(index)} className={cn("w-full text-left p-2 rounded-lg transition-colors flex items-center gap-2", currentIngredient === index ? "bg-primary/10 border border-primary/30" : "hover:bg-muted")} data-unique-id="ddf8adfd-e638-46b8-a036-77097f804b48" data-file-name="components/cooking-mode.tsx">
                        <div className={cn("w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0", currentIngredient === index ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")} data-unique-id="528b858e-0e06-46aa-ac46-017f5f0bbd47" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">
                          {index + 1}
                        </div>
                        <div data-unique-id="8fef9e58-633b-4ad9-8b6e-64a1441385fd" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">
                          <div className="font-medium" data-unique-id="4847a64a-c126-4d1d-95c6-49fa427f7208" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">{ingredient.name}</div>
                          {ingredient.quantity && ingredient.unit && <div className="text-xs text-muted-foreground" data-unique-id="ac069697-54c1-4b55-b28f-13718eca19e9" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">
                              {ingredient.quantity} {ingredient.unit}
                            </div>}
                        </div>
                      </button>)}
                  </div>
                  
                  <div className="flex justify-between mt-4 pt-3 border-t border-border" data-unique-id="949c2d95-c2ca-424e-b38e-c9416ed96e06" data-file-name="components/cooking-mode.tsx">
                    <button onClick={handlePreviousIngredient} disabled={currentIngredient === 0} className={cn("px-3 py-1 text-sm rounded-lg transition-colors flex items-center gap-1", currentIngredient === 0 ? "opacity-50 cursor-not-allowed text-muted-foreground" : "hover:bg-muted")} data-unique-id="e21b9bb8-1378-45b3-8556-5556d00cc487" data-file-name="components/cooking-mode.tsx">
                      <ChevronLeft className="w-4 h-4" />
                      <span data-unique-id="df18278b-3cd9-4341-b0d9-bfe4a6489217" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="b91de932-2a0e-457a-904e-83068f0f50df" data-file-name="components/cooking-mode.tsx">Previous</span></span>
                    </button>
                    
                    <button onClick={handleNextIngredient} disabled={currentIngredient === recipe.ingredients.length - 1} className={cn("px-3 py-1 text-sm rounded-lg transition-colors flex items-center gap-1", currentIngredient === recipe.ingredients.length - 1 ? "opacity-50 cursor-not-allowed text-muted-foreground" : "hover:bg-muted")} data-unique-id="c460f4a3-0a1a-41a4-a7bb-ef4ab06d81b7" data-file-name="components/cooking-mode.tsx">
                      <span data-unique-id="16241bde-dcec-49ad-b6d3-5bbd4dbbb612" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="83a704ba-4290-462b-8d65-2766cbea6f9b" data-file-name="components/cooking-mode.tsx">Next</span></span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>}
          </AnimatePresence>
          
          {/* Progress indicator */}
          <div className="w-full max-w-3xl mb-6" data-unique-id="663b4f7c-05ba-4de9-9933-4c7dc02539b1" data-file-name="components/cooking-mode.tsx">
            <div className="flex justify-between items-center mb-2" data-unique-id="96ca55f6-9397-412d-a8b1-02ff223bf2d3" data-file-name="components/cooking-mode.tsx">
              <span className="text-sm text-muted-foreground" data-unique-id="14f4b775-2fbd-4fd0-a434-35590974fbd1" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">
                <span className="editable-text" data-unique-id="55e53e87-34ec-477b-8479-42dbed33a281" data-file-name="components/cooking-mode.tsx">Step </span>{currentStep + 1}<span className="editable-text" data-unique-id="cdc42a86-ad2a-4f4c-a48a-86cbdfcbe68b" data-file-name="components/cooking-mode.tsx"> of </span>{recipe.steps.length}
              </span>
              <span className="text-sm font-medium" data-unique-id="babfcc54-dc5f-4d0e-af33-129f7ff70474" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">
                {Math.round((currentStep + 1) / recipe.steps.length * 100)}<span className="editable-text" data-unique-id="57938839-9681-4b9d-a42b-04904b42c3aa" data-file-name="components/cooking-mode.tsx">% Complete</span>
              </span>
            </div>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden" data-unique-id="5d71287c-ee60-4343-bfff-ea88d3812fa4" data-file-name="components/cooking-mode.tsx">
              <motion.div className="h-full bg-primary" initial={{
              width: `${currentStep / recipe.steps.length * 100}%`
            }} animate={{
              width: `${(currentStep + 1) / recipe.steps.length * 100}%`
            }} transition={{
              duration: 0.3
            }} data-unique-id="10c9002d-8dba-45e6-b2a4-498f14907777" data-file-name="components/cooking-mode.tsx" />
            </div>
          </div>
          
          {/* Main content area - split into two columns when assistant is shown */}
          <div className={cn("w-full max-w-3xl grid gap-6", showAssistant ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")} data-unique-id="2787b77d-3374-4791-8843-61cb3ca07f7e" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">
            {/* Step content */}
            <motion.div key={currentStep} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -20
          }} transition={{
            duration: 0.3
          }} className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-lg" data-unique-id="728ee527-a763-457c-94f4-3f3821265c5e" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">
              <div className="flex items-center gap-3 mb-6" data-unique-id="655686ef-adc7-47e2-a23b-4e9135e9e1f3" data-file-name="components/cooking-mode.tsx">
                <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 text-lg font-bold" data-unique-id="71d31b45-477e-4e2a-a71d-b035e46b08f5" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">
                  {currentStep + 1}
                </div>
                <h3 className="text-xl font-bold" data-unique-id="03f56b87-413b-44ad-88ce-9521ec2ba79f" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="3fc857f8-654e-4c52-ad0a-8fe0346d9fc5" data-file-name="components/cooking-mode.tsx">Step </span>{currentStep + 1}</h3>
              </div>
              
              <p className="text-lg mb-6 leading-relaxed" data-unique-id="29b630fc-bd73-4067-aa1b-40c34046c878" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">{recipe.steps[currentStep]}</p>
              
              {/* Timer section */}
              <div className="mt-6 border-t border-border pt-4" data-unique-id="3f950e74-ffc0-400a-b4d3-e509123f5f82" data-file-name="components/cooking-mode.tsx">
                <h4 className="font-medium mb-3" data-unique-id="dc1326fd-315a-4df7-a74c-fa405b38252f" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="8b903f12-1fcc-49f7-99c6-0569b92ae3a2" data-file-name="components/cooking-mode.tsx">Need a timer?</span></h4>
                <div className="flex flex-wrap gap-2" data-unique-id="976e7b70-97c1-4f89-9b4c-8146afb35725" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">
                  {[1, 3, 5, 10, 15].map(minutes => <button key={minutes} onClick={() => startTimer(minutes * 60)} className="px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg text-sm transition-colors" data-unique-id="88144a80-d7d4-485f-84ba-01627717477a" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">
                      {minutes}<span className="editable-text" data-unique-id="bb803f59-17c3-4a36-81f2-4d9655deff94" data-file-name="components/cooking-mode.tsx"> min</span>
                    </button>)}
                  
                  {timerRunning && <div className="flex items-center gap-2 ml-2 bg-primary/10 px-3 py-1.5 rounded-lg" data-unique-id="49ceae45-2dc9-4771-9f33-ec02f20c9029" data-file-name="components/cooking-mode.tsx">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="font-mono font-medium" data-unique-id="36427830-630d-41d0-b4f8-3deabd0f8931" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">{formatTime(timerRemaining)}</span>
                      <button onClick={stopTimer} className="ml-1 p-1 rounded-full hover:bg-muted/80" aria-label="Stop timer" data-unique-id="f00d0286-f596-4cf9-b481-77e500e5de5d" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">
                        {timerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      </button>
                    </div>}
                </div>
              </div>
            </motion.div>
            
            {/* Cooking Assistant */}
            {showAssistant && <CookingAssistant recipe={recipe} currentStep={currentStep} onStepChange={setCurrentStep} isPaused={isPaused} onPauseToggle={togglePause} />}
          </div>
          
          {/* Voice command help */}
          {isListening && <div className="w-full max-w-3xl bg-muted/50 rounded-xl p-4 mb-6 mt-6" data-unique-id="3cc8ab26-24fe-44be-9520-eb88bc5de854" data-file-name="components/cooking-mode.tsx">
              <h4 className="font-medium mb-2 flex items-center gap-2" data-unique-id="eff8e0ef-7b5a-4087-a566-36e484e7e7fb" data-file-name="components/cooking-mode.tsx">
                <Mic className="w-4 h-4 text-primary" />
                <span className="editable-text" data-unique-id="1e81b451-a4f4-4a7b-9415-6a6e1dd3a201" data-file-name="components/cooking-mode.tsx">Voice Commands Available</span>
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" data-unique-id="e4d0e3ec-3436-4167-a5af-254d78f5982e" data-file-name="components/cooking-mode.tsx">
                <div className="space-y-1" data-unique-id="8d58f059-f677-42bd-927d-e7255dcf17d6" data-file-name="components/cooking-mode.tsx">
                  <div className="text-xs font-medium text-muted-foreground mb-1" data-unique-id="12698fd3-b099-41ce-b78e-7b79b7d86358" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="98e03c0c-2658-41f5-8337-10ff71c3408c" data-file-name="components/cooking-mode.tsx">Steps</span></div>
                  <div className="flex items-center gap-2" data-unique-id="ad280e9f-bbaf-4e5d-81ad-c80437ccb7f6" data-file-name="components/cooking-mode.tsx">
                    <span className="bg-muted px-2 py-1 rounded font-mono text-xs" data-unique-id="59b76821-ff6c-4193-9cb4-5167cd5d692d" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="6b427414-f81c-4109-8bc0-8fbf732f8794" data-file-name="components/cooking-mode.tsx">"Next step"</span></span>
                    <span className="text-muted-foreground text-xs" data-unique-id="41e091ae-46a9-4304-a0db-84e018632512" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="6f407a9a-0834-4610-a2df-ed8a4f46bec3" data-file-name="components/cooking-mode.tsx">Next step</span></span>
                  </div>
                  <div className="flex items-center gap-2" data-unique-id="8e477c89-a7b0-4f54-92fc-f1635ae9ad73" data-file-name="components/cooking-mode.tsx">
                    <span className="bg-muted px-2 py-1 rounded font-mono text-xs" data-unique-id="bd37fbd9-b918-4265-8105-639df4818cb9" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="0c0b6df6-ae7e-4274-862a-baf4f5790a4b" data-file-name="components/cooking-mode.tsx">"Go to step 3"</span></span>
                    <span className="text-muted-foreground text-xs" data-unique-id="6284e9bc-e08c-478a-930a-9025a3d56633" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="c9872681-01ae-4deb-bbfe-d74d10bf0225" data-file-name="components/cooking-mode.tsx">Jump to step</span></span>
                  </div>
                  <div className="flex items-center gap-2" data-unique-id="6550bee1-3af0-416b-96b0-d8f3b49150a3" data-file-name="components/cooking-mode.tsx">
                    <span className="bg-muted px-2 py-1 rounded font-mono text-xs" data-unique-id="84cc95e8-c80e-4498-aeeb-94eefef527de" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="252c065c-1096-41a3-93f5-815d9b81525d" data-file-name="components/cooking-mode.tsx">"Read step"</span></span>
                    <span className="text-muted-foreground text-xs" data-unique-id="d051b95a-c510-42f8-8846-0da156077202" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="61805c1f-85d1-43dc-bc48-814444f92bc9" data-file-name="components/cooking-mode.tsx">Read current step</span></span>
                  </div>
                </div>
                
                <div className="space-y-1" data-unique-id="85bca024-5f48-4da9-8275-e4ef8be42a60" data-file-name="components/cooking-mode.tsx">
                  <div className="text-xs font-medium text-muted-foreground mb-1" data-unique-id="44539437-7070-4445-b6a0-3cb804e570b3" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="f966e675-b78d-4573-b4a8-da5bfe4825bc" data-file-name="components/cooking-mode.tsx">Ingredients</span></div>
                  <div className="flex items-center gap-2" data-unique-id="d7bc983a-8d53-4432-95e6-59bd31bf8231" data-file-name="components/cooking-mode.tsx">
                    <span className="bg-muted px-2 py-1 rounded font-mono text-xs" data-unique-id="030b8fb8-7845-480a-a0fe-df24131dc370" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="216a340c-edb3-444d-8ce7-0ef4ba7dad40" data-file-name="components/cooking-mode.tsx">"Next ingredient"</span></span>
                    <span className="text-muted-foreground text-xs" data-unique-id="afce8d39-d4a4-4992-a714-0fa2fca5a1d2" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="24b38641-8e29-47e9-a482-e4b7e40cd070" data-file-name="components/cooking-mode.tsx">Next ingredient</span></span>
                  </div>
                  <div className="flex items-center gap-2" data-unique-id="11e0f491-a1d3-42fc-8489-f37efc2fb3b3" data-file-name="components/cooking-mode.tsx">
                    <span className="bg-muted px-2 py-1 rounded font-mono text-xs" data-unique-id="61634f33-5907-4bd6-9652-0dc1750c8e1c" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="5eeaaa63-ace1-4986-a88a-13c97568a66e" data-file-name="components/cooking-mode.tsx">"List ingredients"</span></span>
                    <span className="text-muted-foreground text-xs" data-unique-id="d95d7ebd-11ef-482a-b4c8-b8149ce79fcf" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="895024f7-bdc4-48ef-9872-6eadb297a9a7" data-file-name="components/cooking-mode.tsx">Show all</span></span>
                  </div>
                  <div className="flex items-center gap-2" data-unique-id="e6bde410-0131-4b5f-906f-060ea4a8aa8f" data-file-name="components/cooking-mode.tsx">
                    <span className="bg-muted px-2 py-1 rounded font-mono text-xs" data-unique-id="9c2e0420-4b7f-4e6d-822e-ef4968cec1cb" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="d811649d-df05-433a-b373-56101d351090" data-file-name="components/cooking-mode.tsx">"Read ingredient 2"</span></span>
                    <span className="text-muted-foreground text-xs" data-unique-id="0dcda595-c1f4-49dd-9047-9d03e10eec68" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="2aaa530f-2a69-4ba1-adb2-5d6c70f0d46c" data-file-name="components/cooking-mode.tsx">Specific ingredient</span></span>
                  </div>
                </div>
                
                <div className="space-y-1" data-unique-id="930ab53b-547f-42f6-bd23-3172296570b5" data-file-name="components/cooking-mode.tsx">
                  <div className="text-xs font-medium text-muted-foreground mb-1" data-unique-id="ef793f5e-5d96-4a3e-861a-976f83ac06b7" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="c5cb3cfc-38df-4e32-a017-0067f45ed935" data-file-name="components/cooking-mode.tsx">Timer</span></div>
                  <div className="flex items-center gap-2" data-unique-id="0ec7085d-1108-4c3e-9f03-f562148af217" data-file-name="components/cooking-mode.tsx">
                    <span className="bg-muted px-2 py-1 rounded font-mono text-xs" data-unique-id="f546e1ed-4665-40c2-b2f7-5c7dc8bdf1d5" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="83325aca-2f68-42f1-a068-e15b34f0aa06" data-file-name="components/cooking-mode.tsx">"Start timer 5 minutes"</span></span>
                    <span className="text-muted-foreground text-xs" data-unique-id="90e18e7f-db9c-46fc-9843-e5ba8a351a37" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="13e42446-3916-4997-92a7-bf74b1027dff" data-file-name="components/cooking-mode.tsx">Set timer</span></span>
                  </div>
                  <div className="flex items-center gap-2" data-unique-id="1addd884-f692-4e97-9bf5-ff4eb69f2fc8" data-file-name="components/cooking-mode.tsx">
                    <span className="bg-muted px-2 py-1 rounded font-mono text-xs" data-unique-id="d24e1bbc-07b5-4694-9edd-77f49c396157" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="cd1530dd-6266-415e-8b5e-eaeb3857ddb2" data-file-name="components/cooking-mode.tsx">"Stop timer"</span></span>
                    <span className="text-muted-foreground text-xs" data-unique-id="cb0b063c-d140-4b36-afe5-cbaa2677e7d6" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="ac833446-b4fa-4cc4-915a-eecb3c9a1fc4" data-file-name="components/cooking-mode.tsx">Cancel timer</span></span>
                  </div>
                </div>
                
                <div className="space-y-1" data-unique-id="f46c33b0-2c4c-4c8a-8564-8bae489e02a9" data-file-name="components/cooking-mode.tsx">
                  <div className="text-xs font-medium text-muted-foreground mb-1" data-unique-id="f9292d0c-90ab-4c05-af22-5cb2d7658680" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="63676320-067a-427a-b471-8f0309f54300" data-file-name="components/cooking-mode.tsx">Other</span></div>
                  <div className="flex items-center gap-2" data-unique-id="5760bf58-4c1a-484e-9653-235f10226a17" data-file-name="components/cooking-mode.tsx">
                    <span className="bg-muted px-2 py-1 rounded font-mono text-xs" data-unique-id="49237149-1efe-431e-8915-9038824b9aaa" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="51deabfb-8e90-466c-902d-aeb78afaf94c" data-file-name="components/cooking-mode.tsx">"Fullscreen"</span></span>
                    <span className="text-muted-foreground text-xs" data-unique-id="84488e79-b2ed-49d1-957a-7106979d49de" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="18110d5c-01a8-4636-9955-9765e69baf55" data-file-name="components/cooking-mode.tsx">Toggle fullscreen</span></span>
                  </div>
                  <div className="flex items-center gap-2" data-unique-id="9e671c97-8b5b-445f-83dc-a86bd333626f" data-file-name="components/cooking-mode.tsx">
                    <span className="bg-muted px-2 py-1 rounded font-mono text-xs" data-unique-id="a0ba5c84-a390-4b8c-a3e7-219df281da25" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="229675de-e8df-41dd-960a-b1d676953f3b" data-file-name="components/cooking-mode.tsx">"Exit"</span></span>
                    <span className="text-muted-foreground text-xs" data-unique-id="29587fa6-51ba-4d9a-b5d2-b41f696e2809" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="6ae666e6-ecf0-4abb-923e-b254cc493d8b" data-file-name="components/cooking-mode.tsx">Close cooking mode</span></span>
                  </div>
                </div>
              </div>
              
              <button onClick={() => window.open('/cooking-commands', '_blank')} className="mt-3 text-xs text-primary hover:underline" data-unique-id="a8b04155-ad62-44a5-9339-b6059a346803" data-file-name="components/cooking-mode.tsx">
                <span className="editable-text" data-unique-id="03fc29fa-9ba4-42f2-9c72-353cc079510a" data-file-name="components/cooking-mode.tsx">View all commands</span>
              </button>
            </div>}
        </div>
        
        {/* Navigation footer */}
        <div className="bg-card/80 backdrop-blur-md border-t border-border p-4 flex justify-between items-center" data-unique-id="eb946076-dc4c-4a84-aefd-4dfd2bf192a8" data-file-name="components/cooking-mode.tsx">
          <button onClick={handlePreviousStep} disabled={currentStep === 0} className={cn("flex items-center gap-2 px-4 py-2 rounded-lg transition-colors", currentStep === 0 ? "opacity-50 cursor-not-allowed bg-muted text-muted-foreground" : "bg-muted hover:bg-muted/80")} data-unique-id="5b91da20-e056-49c1-811f-d5d98266db50" data-file-name="components/cooking-mode.tsx">
            <ChevronLeft className="w-5 h-5" />
            <span data-unique-id="7d6e5d6b-3be0-45ec-9f9f-97209bb3b826" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="1b32ba90-e567-49c3-b489-af69243ae097" data-file-name="components/cooking-mode.tsx">Previous</span></span>
          </button>
          
          <div className="flex gap-1" data-unique-id="b2e60dc6-b90b-42f3-bf79-1fc96d94b5e2" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">
            {recipe.steps.map((_, index) => <button key={index} onClick={() => setCurrentStep(index)} className={cn("w-2 h-2 rounded-full transition-all", currentStep === index ? "bg-primary w-4" : "bg-muted hover:bg-muted-foreground/50")} aria-label={`Go to step ${index + 1}`} data-unique-id="12f92cae-bdc3-4902-9c81-71a794e298fe" data-file-name="components/cooking-mode.tsx" />)}
          </div>
          
          <button onClick={handleNextStep} disabled={currentStep === recipe.steps.length - 1} className={cn("flex items-center gap-2 px-4 py-2 rounded-lg transition-colors", currentStep === recipe.steps.length - 1 ? "opacity-50 cursor-not-allowed bg-muted text-muted-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90")} data-unique-id="26481bab-c317-4304-b193-9bc0f339d6a5" data-file-name="components/cooking-mode.tsx">
            <span data-unique-id="a8b52216-7e84-4a19-b6bf-c77798f90a28" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="f84c2993-cb22-4c00-90c2-6583fdee6c26" data-file-name="components/cooking-mode.tsx">Next</span></span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </VoiceCommandParser>;
}