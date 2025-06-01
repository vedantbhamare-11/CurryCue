"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, VolumeX, Volume2, ChevronLeft, ChevronRight, X, Clock, Maximize, Minimize, Play, Pause, List, MessageSquare } from 'lucide-react';
import { Recipe } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { VoiceCommandParser, VoiceCommandAction } from './voice-command-parser';
import { CookingAssistant } from './cooking-assistant';
import { CompletionCelebration } from './completion-celebration';
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
  const [showCelebration, setShowCelebration] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const speechSynthRef = useRef<SpeechSynthesis | null>(null);
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null); // eslint-disable-line no-undef
  const timerIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      speechSynthRef.current = window.speechSynthesis;

      // Initialize speech recognition if available
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        speechRecognitionRef.current = new SpeechRecognitionAPI() as unknown as SpeechRecognition; // eslint-disable-line no-undef
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
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
            }
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
        if (typeof document !== 'undefined') {
          if (document.exitFullscreen) {
            document.exitFullscreen().catch(err => {
              console.error('Error attempting to exit fullscreen:', err);
            });
          } else {
            // Fallback for browsers that don't support fullscreen
            setIsFullscreen(false);
          }
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
      // Show celebration when recipe is completed
      setShowCelebration(true);
      // Complete recipe for rewards system
      if (typeof window !== 'undefined' && (window as any).completeRecipe) {
        (window as any).completeRecipe();
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
      <div ref={containerRef} className={cn(" bg-gradient-to-b from-background to-muted/30 text-foreground flex flex-col", " w-84  h-full lg:w-full lg:h-full min-h-screen overflow-y-auto relative", isFullscreen && "fixed inset-0 z-[100] max-h-screen")} data-unique-id="f34cdaa8-e4dd-4563-b9e2-efe62d774ce3" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">
        {/* Header */}
        <div className="bg-card/80 mt-4 backdrop-blur-md border-b border-border p-2 lg:p-4 flex justify-between items-center" data-unique-id="fa202a2b-fe88-4c7e-828f-1a26a8e5d6e9" data-file-name="components/cooking-mode.tsx">
          <div className="flex items-center gap-3" data-unique-id="dba70607-e146-4b8e-8279-718085de0706" data-file-name="components/cooking-mode.tsx">
            <button onClick={onClose} className="lg:p-2 p-0 rounded-full hover:bg-muted transition-colors" aria-label="Exit cooking mode" data-unique-id="187b0c08-abf8-42fc-9db8-f19f53cbc59c" data-file-name="components/cooking-mode.tsx">
              <X className="lg:w-5 lg:h-5 w-4 h-4" />
            </button>
            <h2 className="lg:text-xl text-sm font-bold lg:truncate" data-unique-id="c7b0d447-ec24-4054-9584-ba3d2df65fa8" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">{recipe.title}</h2>
          </div>
          
          <div className="flex items-center  lg:gap-2" data-unique-id="d34f7f82-58bc-450f-9b45-720bfbec8ca3" data-file-name="components/cooking-mode.tsx">
            <button onClick={toggleAssistant} className={cn("p-2 rounded-full transition-colors", showAssistant ? "bg-primary text-primary-foreground" : "hover:bg-muted")} aria-label={showAssistant ? "Hide assistant" : "Show assistant"} data-unique-id="b5bf590e-23ba-4d59-87e9-59f8aff050b0" data-file-name="components/cooking-mode.tsx">
              <MessageSquare className="lg:w-5 lg:h-5 w-4 h-4" />
            </button>
            
            {/* <button onClick={toggleSpeech} className={cn("p-2 rounded-full transition-colors", isSpeechEnabled ? "bg-primary text-primary-foreground" : "hover:bg-muted")} aria-label={isSpeechEnabled ? "Disable text-to-speech" : "Enable text-to-speech"} data-unique-id="ada9920e-e483-48da-9876-c34d6d03fef2" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">
              {isSpeechEnabled ? <Volume2 className="lg:w-5 lg:h-5 w-4 h-4" /> : <VolumeX className="lg:w-5 lg:h-5 w-4 h-4" />}
            </button> */}
            
            {/* <button onClick={toggleSpeechRecognition} className={cn("p-2 rounded-full transition-colors", isListening ? "bg-primary text-primary-foreground" : "hover:bg-muted")} aria-label={isListening ? "Disable voice commands" : "Enable voice commands"} data-unique-id="cdd3c9dc-7ba3-47bb-8bed-7b56688ea580" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">
              {isListening ? <Mic className="lg:w-5 lg:h-5 w-4 h-4" /> : <MicOff className="lg:w-5 lg:h-5 w-4 h-4" />}
            </button> */}
            
            <button onClick={toggleFullscreen} className="p-2 rounded-full hover:bg-muted transition-colors" aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"} data-unique-id="6f7da888-01d0-47af-8206-d3c444e329d8" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">
              {isFullscreen ? <Minimize className="lg:w-5 lg:h-5 w-4 h-4" /> : <Maximize className="lg:w-5 lg:h-5 w-4 h-4" />}
            </button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center" data-unique-id="60c08edf-ccb4-4417-93de-e3b607d4eafa" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">
          {/* Top controls */}
          <div className="w-full max-w-3xl mb-4 flex justify-between" data-unique-id="a84f52bf-0397-462f-94ec-188d7380e992" data-file-name="components/cooking-mode.tsx">
            <button onClick={togglePause} className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors", isPaused ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80")} data-unique-id="9e908e60-5a69-43ce-9803-65442c59119e" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              <span className="text-sm" data-unique-id="a02045dd-a74a-4ebc-873c-12968f2f35df" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">{isPaused ? "Resume" : "Pause"}</span>
            </button>
            
            
          </div>
          
        
          
          {/* Progress indicator */}
          <div className="w-full hidden lg:block max-w-3xl mb-6" data-unique-id="a91e4199-e3a9-439e-b7af-e9e8620ab3d4" data-file-name="components/cooking-mode.tsx">
            <div className="flex justify-between items-center mb-2" data-unique-id="9c4a4981-825a-470c-bf83-018bd3cca5f7" data-file-name="components/cooking-mode.tsx">
              <span className="text-sm text-muted-foreground" data-unique-id="b4dade6d-fb9e-4ad8-a3a2-8886a0c98405" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">
                <span className="editable-text" data-unique-id="35b8939d-45bc-4b63-907a-90e96e433073" data-file-name="components/cooking-mode.tsx">Step </span>{currentStep + 1}<span className="editable-text" data-unique-id="be4706c7-6847-4d5a-8781-9b7a5e7d5246" data-file-name="components/cooking-mode.tsx"> of </span>{recipe.steps.length}
              </span>
              <span className="text-sm font-medium" data-unique-id="6114dacf-4ce9-49bd-a17c-e2d804c989b2" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">
                {Math.round((currentStep + 1) / recipe.steps.length * 100)}<span className="editable-text" data-unique-id="ee582874-fb5b-46bc-81a0-4e5a97e5a801" data-file-name="components/cooking-mode.tsx">% Complete</span>
              </span>
            </div>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden" data-unique-id="bff834bd-0992-40d2-a039-5e0d2cd62187" data-file-name="components/cooking-mode.tsx">
              <motion.div className="h-full bg-primary" initial={{
              width: `${currentStep / recipe.steps.length * 100}%`
            }} animate={{
              width: `${(currentStep + 1) / recipe.steps.length * 100}%`
            }} transition={{
              duration: 0.3
            }} data-unique-id="28c4ac51-748f-4045-845c-c01248036ff3" data-file-name="components/cooking-mode.tsx" />
            </div>
          </div>
          
          {/* Main content area - split into two columns when assistant is shown */}
          <div className={cn("w-full max-w-3xl grid gap-6", showAssistant ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")} data-unique-id="486c5660-7b99-4ded-875f-a4aca73a625b" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">
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
          }} className="bg-card hidden lg:block border border-border rounded-2xl p-6 md:p-8 shadow-lg" data-unique-id="d2c83323-2aad-4b6c-b686-341b6adf2def" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">
              <div className="flex items-center gap-3 mb-6" data-unique-id="2d330f39-04ee-4fbb-b796-e1aeeb57d804" data-file-name="components/cooking-mode.tsx">
                <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 text-lg font-bold" data-unique-id="d1af7c6c-7f0e-4ade-9e13-87381ec36ce8" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">
                  {currentStep + 1}
                </div>
                <h3 className="text-xl font-bold" data-unique-id="b9a0941c-9df2-4b01-954f-3ecc253310a8" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="4786bfc4-c860-467a-9235-b2b89da1f3e6" data-file-name="components/cooking-mode.tsx">Step </span>{currentStep + 1}</h3>
              </div>
              
              <p className="text-lg mb-6 leading-relaxed" data-unique-id="b53b6564-8cb5-4d66-a222-27be3a80117e" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">{recipe.steps[currentStep]}</p>
              
              {/* Timer section */}
              <div className="mt-6 border-t border-border pt-4" data-unique-id="5a7ab25f-cf80-4279-b39e-125eb12038b6" data-file-name="components/cooking-mode.tsx">
                <h4 className="font-medium mb-3" data-unique-id="609034ba-39c2-421d-9e35-734eb919ec9b" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="db66e137-8c39-4cda-b185-be9a9cebfa9d" data-file-name="components/cooking-mode.tsx">Need a timer?</span></h4>
                <div className="flex flex-wrap gap-2" data-unique-id="7d57dd89-ba71-4d90-a2df-a082a4f69445" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">
                  {[1, 3, 5, 10, 15].map(minutes => <button key={minutes} onClick={() => startTimer(minutes * 60)} className="px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg text-sm transition-colors" data-unique-id="f40ba045-c74e-4603-9c49-5c61beee7284" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">
                      {minutes}<span className="editable-text" data-unique-id="69df8632-70d0-4f12-99bd-245fb0aade76" data-file-name="components/cooking-mode.tsx"> min</span>
                    </button>)}
                  
                  {timerRunning && <div className="flex items-center gap-2 ml-2 bg-primary/10 px-3 py-1.5 rounded-lg" data-unique-id="a23cfc26-141d-460c-ac9f-77de7c7dc9dd" data-file-name="components/cooking-mode.tsx">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="font-mono font-medium" data-unique-id="16fcf9d7-2c0e-4a7b-8b99-87eaba925ffe" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">{formatTime(timerRemaining)}</span>
                      <button onClick={stopTimer} className="ml-1 p-1 rounded-full hover:bg-muted/80" aria-label="Stop timer" data-unique-id="074497ef-b4c6-4977-b762-900041ea31ef" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">
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
          {isListening && <div className="w-full max-w-3xl bg-muted/50 rounded-xl p-4 mb-6 mt-6" data-unique-id="1ed7f551-7ef9-49a8-839f-cc84f0965348" data-file-name="components/cooking-mode.tsx">
              <h4 className="font-medium mb-2 flex items-center gap-2" data-unique-id="d78d7d1e-fefa-426b-9af5-f0b7c2535218" data-file-name="components/cooking-mode.tsx">
                <Mic className="w-4 h-4 text-primary" />
                <span className="editable-text" data-unique-id="13f52db3-3007-4378-b702-dcbc36f78cd1" data-file-name="components/cooking-mode.tsx">Voice Commands Available</span>
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" data-unique-id="9f95ddba-b9e2-4670-8144-64362d8d0206" data-file-name="components/cooking-mode.tsx">
                <div className="space-y-1" data-unique-id="5f0709b5-c59c-4063-866e-bf37e2a912f0" data-file-name="components/cooking-mode.tsx">
                  <div className="text-xs font-medium text-muted-foreground mb-1" data-unique-id="b451cacc-806d-46ee-892a-0b067a81e4f2" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="ea06ff5b-3e6b-42d4-be88-a526f2f15d2a" data-file-name="components/cooking-mode.tsx">Steps</span></div>
                  <div className="flex items-center gap-2" data-unique-id="c7b19726-9899-4492-a138-9b59c7430cf5" data-file-name="components/cooking-mode.tsx">
                    <span className="bg-muted px-2 py-1 rounded font-mono text-xs" data-unique-id="547e5457-d60a-4407-a9b9-a92125514bbd" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="5b97b636-43ef-488e-a9d9-2d59df513ad2" data-file-name="components/cooking-mode.tsx">"Next step"</span></span>
                    <span className="text-muted-foreground text-xs" data-unique-id="0b0e8716-ed04-4737-9503-67aad32ee251" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="65726bf8-99d3-4c8d-9b01-c425f71fdc30" data-file-name="components/cooking-mode.tsx">Next step</span></span>
                  </div>
                  <div className="flex items-center gap-2" data-unique-id="0c9d6bc4-b6c2-43f8-a76b-d766fa771fbc" data-file-name="components/cooking-mode.tsx">
                    <span className="bg-muted px-2 py-1 rounded font-mono text-xs" data-unique-id="847bb6f1-a38d-4196-9263-847f0210ec0f" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="32261b27-34ac-4d72-beca-8af7ca41c22b" data-file-name="components/cooking-mode.tsx">"Go to step 3"</span></span>
                    <span className="text-muted-foreground text-xs" data-unique-id="bab80458-1bc4-4f84-abf5-ac19d4344cf0" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="82ce8bf7-d8c2-4ad7-9c72-0c9d2e239f67" data-file-name="components/cooking-mode.tsx">Jump to step</span></span>
                  </div>
                  <div className="flex items-center gap-2" data-unique-id="459c74c4-5eff-4a21-ae17-c212482137fc" data-file-name="components/cooking-mode.tsx">
                    <span className="bg-muted px-2 py-1 rounded font-mono text-xs" data-unique-id="220385ba-1993-4fce-b1b5-ca758dc825d9" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="3a156ea7-9160-4569-b28d-735d90d1378c" data-file-name="components/cooking-mode.tsx">"Read step"</span></span>
                    <span className="text-muted-foreground text-xs" data-unique-id="5c99d93e-b92f-4114-b48d-0d0af0841834" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="1fbcaee4-6685-4cec-9c4b-2e78fab2664d" data-file-name="components/cooking-mode.tsx">Read current step</span></span>
                  </div>
                </div>
                
                <div className="space-y-1" data-unique-id="c3862c07-e4b7-4bb2-b186-9b9a11af8dd4" data-file-name="components/cooking-mode.tsx">
                  <div className="text-xs font-medium text-muted-foreground mb-1" data-unique-id="80e9d290-659c-47e8-8bfe-548d752b630c" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="7254d515-b292-4664-ad57-55c1509a727f" data-file-name="components/cooking-mode.tsx">Ingredients</span></div>
                  <div className="flex items-center gap-2" data-unique-id="66442af5-1590-4e71-a59d-1e8ce2c7240f" data-file-name="components/cooking-mode.tsx">
                    <span className="bg-muted px-2 py-1 rounded font-mono text-xs" data-unique-id="67ae1be3-1fc4-493f-9aeb-3722bf5e1d77" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="badc1b50-eff3-45eb-8181-4409933052b6" data-file-name="components/cooking-mode.tsx">"Next ingredient"</span></span>
                    <span className="text-muted-foreground text-xs" data-unique-id="5e50de40-bd1d-41db-85a9-7e76eb701019" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="ff4f805f-78fd-452c-8726-b1a6460dd38d" data-file-name="components/cooking-mode.tsx">Next ingredient</span></span>
                  </div>
                  <div className="flex items-center gap-2" data-unique-id="5c6dc559-8293-470d-80cf-c14e25b8aba4" data-file-name="components/cooking-mode.tsx">
                    <span className="bg-muted px-2 py-1 rounded font-mono text-xs" data-unique-id="bb60c6d9-3ee3-453a-a014-c8043ecf2d8a" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="df0fc884-f8e9-4022-bed0-992ebc330db2" data-file-name="components/cooking-mode.tsx">"List ingredients"</span></span>
                    <span className="text-muted-foreground text-xs" data-unique-id="5be83c9f-e64b-424d-b8f4-1848faffc283" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="1fb306ec-3ef1-43fe-af6a-f8ca0d974827" data-file-name="components/cooking-mode.tsx">Show all</span></span>
                  </div>
                  <div className="flex items-center gap-2" data-unique-id="e623d89f-641f-4491-97d3-7c5209c00742" data-file-name="components/cooking-mode.tsx">
                    <span className="bg-muted px-2 py-1 rounded font-mono text-xs" data-unique-id="eb1b43e4-d6ac-4185-b8f9-efe0d320af2a" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="585cb4fc-6624-472c-8868-6dd6994b5d10" data-file-name="components/cooking-mode.tsx">"Read ingredient 2"</span></span>
                    <span className="text-muted-foreground text-xs" data-unique-id="3e7f907e-1b7e-45fc-b040-94cb6741b676" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="43e4c8b4-eee3-4971-8117-8ecff87edbbc" data-file-name="components/cooking-mode.tsx">Specific ingredient</span></span>
                  </div>
                </div>
                
                <div className="space-y-1" data-unique-id="fcdcfc06-c0c6-46d9-b1d6-4b69b22f8eae" data-file-name="components/cooking-mode.tsx">
                  <div className="text-xs font-medium text-muted-foreground mb-1" data-unique-id="f556af49-7fcc-49ec-967c-23eccde09d42" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="ca562f0c-1d85-43af-a27b-fc83e669af05" data-file-name="components/cooking-mode.tsx">Timer</span></div>
                  <div className="flex items-center gap-2" data-unique-id="2780e1ae-3955-41ef-b58b-6d48d8549c4d" data-file-name="components/cooking-mode.tsx">
                    <span className="bg-muted px-2 py-1 rounded font-mono text-xs" data-unique-id="def50a4b-7fa5-4416-801e-1b96b52074b6" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="63c3b05d-22a1-44c0-91c2-263b38f8b2cb" data-file-name="components/cooking-mode.tsx">"Start timer 5 minutes"</span></span>
                    <span className="text-muted-foreground text-xs" data-unique-id="e942d883-d088-4b08-b15d-169d4add3571" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="817512ef-84bf-4c30-8d6b-6e4ae1b95912" data-file-name="components/cooking-mode.tsx">Set timer</span></span>
                  </div>
                  <div className="flex items-center gap-2" data-unique-id="94b11455-9721-432a-adeb-7836790a5791" data-file-name="components/cooking-mode.tsx">
                    <span className="bg-muted px-2 py-1 rounded font-mono text-xs" data-unique-id="4c310439-6d92-43a2-918f-71c1b7f41d65" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="c094e8a7-981d-42d2-ba82-7579e1b72a63" data-file-name="components/cooking-mode.tsx">"Stop timer"</span></span>
                    <span className="text-muted-foreground text-xs" data-unique-id="e05ffe3f-b121-451a-b71a-79a0e8dfeea9" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="3ac218bf-e881-40e5-b09c-4c17f29e72c0" data-file-name="components/cooking-mode.tsx">Cancel timer</span></span>
                  </div>
                </div>
                
                <div className="space-y-1" data-unique-id="153d3979-d632-41fb-b4af-5733a723420d" data-file-name="components/cooking-mode.tsx">
                  <div className="text-xs font-medium text-muted-foreground mb-1" data-unique-id="16730ad7-891f-4326-9579-4ce58d3466d3" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="7991516b-345e-4872-977b-22e7bcdba626" data-file-name="components/cooking-mode.tsx">Other</span></div>
                  <div className="flex items-center gap-2" data-unique-id="de0410d6-5bcd-49fc-8125-6d6a24ced1ad" data-file-name="components/cooking-mode.tsx">
                    <span className="bg-muted px-2 py-1 rounded font-mono text-xs" data-unique-id="ac19bb04-64bf-486b-ae06-d8e3e91862ba" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="00cf1190-75ac-43ff-800e-a19e8a3e1e42" data-file-name="components/cooking-mode.tsx">"Fullscreen"</span></span>
                    <span className="text-muted-foreground text-xs" data-unique-id="859e2e58-7e06-4240-ad37-a08144cb544c" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="9efa46d5-4924-4fb4-baca-f036e8fcd17a" data-file-name="components/cooking-mode.tsx">Toggle fullscreen</span></span>
                  </div>
                  <div className="flex items-center gap-2" data-unique-id="84df1076-c815-4cea-808b-489c5e770c8d" data-file-name="components/cooking-mode.tsx">
                    <span className="bg-muted px-2 py-1 rounded font-mono text-xs" data-unique-id="4a32dd94-5c11-4530-bf10-6b78346d0dfe" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="b60fc604-90ac-426a-8b21-7ad6329d1b03" data-file-name="components/cooking-mode.tsx">"Exit"</span></span>
                    <span className="text-muted-foreground text-xs" data-unique-id="e10f02fa-41e9-4b9e-a3ed-7be0488e8b5d" data-file-name="components/cooking-mode.tsx"><span className="editable-text" data-unique-id="6d39de90-9660-4790-ab71-2551a77ad2ea" data-file-name="components/cooking-mode.tsx">Close cooking mode</span></span>
                  </div>
                </div>
              </div>
              
              <button onClick={() => window.open('/cooking-commands', '_blank')} className="mt-3 text-xs text-primary hover:underline" data-unique-id="df92b7b2-e39d-4208-9911-0ee2740ff879" data-file-name="components/cooking-mode.tsx">
                <span className="editable-text" data-unique-id="67652433-20f1-4023-86bf-5865567e095f" data-file-name="components/cooking-mode.tsx">View all commands</span>
              </button>
            </div>}
        </div>
        
        {/* Navigation footer */}
        <div className="bg-card/80 backdrop-blur-md border-t border-border p-4 flex justify-between items-center" data-unique-id="851c8bb0-a748-44b2-9c50-eb7bcf646bdd" data-file-name="components/cooking-mode.tsx">
          <button onClick={handlePreviousStep}  className={cn("flex items-center gap-2 px-4 py-2 rounded-lg transition-colors", currentStep === 0 ? "bg-accent" : "bg-muted hover:bg-muted/80")} data-unique-id="f41156fb-c77a-45a3-a06d-00d052638442" data-file-name="components/cooking-mode.tsx">
            <ChevronLeft className="w-5 h-5" />
            <span data-unique-id="ddcaf59d-91dc-46c7-bac5-57b2e60fb222" data-file-name="components/cooking-mode.tsx"><span className="editable-text hidden lg:block" data-unique-id="243f80b9-52e8-4c2d-a3cd-d0e3b85c8e94" data-file-name="components/cooking-mode.tsx">Previous</span></span>
          </button>
          
          <div className="flex gap-1" data-unique-id="f6893a94-1679-4737-8180-8a8ca79bd4b7" data-file-name="components/cooking-mode.tsx" data-dynamic-text="true">
            {recipe.steps.map((_, index) => <button key={index} onClick={() => setCurrentStep(index)} className={cn("w-2 h-2 rounded-full transition-all", currentStep === index ? "bg-primary w-4" : "bg-muted hover:bg-muted-foreground/50")} aria-label={`Go to step ${index + 1}`} data-unique-id="2264c388-4c83-4e94-8a14-0ecf4021bbd7" data-file-name="components/cooking-mode.tsx" />)}
          </div>
          
          <button onClick={handleNextStep}  className={cn("flex items-center gap-2 px-4 py-2 rounded-lg transition-colors", currentStep === recipe.steps.length - 1 ? "bg-accent" : "bg-primary text-primary-foreground hover:bg-primary/90")} data-unique-id="6427ccdf-9298-4311-a085-da92d7335817" data-file-name="components/cooking-mode.tsx">
            <span data-unique-id="ee9ca97e-09c6-4faf-ba64-e1c613182197" data-file-name="components/cooking-mode.tsx"><span className="editable-text hidden lg:block" data-unique-id="e45af173-b54e-424d-947c-8191b7ed0634" data-file-name="components/cooking-mode.tsx">Next</span></span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Completion Celebration */}
      <CompletionCelebration isOpen={showCelebration} onClose={() => setShowCelebration(false)} recipeName={recipe.title} />
    </VoiceCommandParser>;
}