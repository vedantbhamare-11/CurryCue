"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, VolumeX, Volume2, ChevronLeft, ChevronRight, X, Clock, Maximize, Minimize, Check, Play, Pause, List, MessageSquare, BellRing } from 'lucide-react';
import { Recipe } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { VoiceCommandParser, VoiceCommandAction, isSpeechRecognitionSupported } from './voice-command-parser';
import { VOICE_UNSUPPORTED_MESSAGE } from '@/lib/voice-commands';
import { CookingAssistant } from './cooking-assistant';
import { createPortal } from 'react-dom';
import { CompletionCelebration } from './completion-celebration';
import { toSpeech, pickPreferredVoice } from '@/lib/speech-text';
import { remainingSeconds } from '@/lib/timer';
import { startAlarm, stopAlarm, unlockAlarm } from '@/lib/alarm';
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
  // Last thing the recognizer heard, so users (and we) can see what was understood
  const [lastHeard, setLastHeard] = useState<{ text: string; kind: 'action' | 'error' | 'ignored' } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  // The server cannot know the browser, so it renders "supported"; the client then says what is true (no hydration mismatch)
  const voiceSupported = useSyncExternalStore(() => () => {}, isSpeechRecognitionSupported, () => true);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerRemaining, setTimerRemaining] = useState(0);
  // Set when a timer reaches zero; the banner and the alarm stay up until the user dismisses it
  const [timerDone, setTimerDone] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const speechSynthRef = useRef<SpeechSynthesis | null>(null);
  // Best installed English (India) voice, if the device has one; otherwise the browser default is used
  const preferredVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  // When the running timer ends, as a real clock time (see lib/timer.ts for why it is not a ticking counter)
  const timerEndRef = useRef<number | null>(null);

  // Text-to-speech. Speech *recognition* lives in VoiceCommandParser (a second recognizer here
  // used to fight it for the mic and fired READ_STEP on any speech).
  useEffect(() => {
    let removeVoicesListener = () => {};
    if (typeof window !== 'undefined') {
      speechSynthRef.current = window.speechSynthesis;

      // Voices load asynchronously in most browsers, so listen for them as well as reading them now
      const synth = window.speechSynthesis;
      const loadVoices = () => {
        preferredVoiceRef.current = pickPreferredVoice(synth.getVoices()) ?? null;
      };
      loadVoices();
      synth.addEventListener?.('voiceschanged', loadVoices);
      removeVoicesListener = () => synth.removeEventListener?.('voiceschanged', loadVoices);
    }
    return () => {
      removeVoicesListener();

      // Clean up speech synthesis
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }

      // A timer left ringing must not outlive the screen
      stopAlarm();
    };
  }, []);

  // Keep the screen awake while cooking: a phone that locks mid-recipe suspends the page and its timer. Browsers
  // release the lock when the tab is hidden, so it is requested again when the user comes back.
  useEffect(() => {
    let lock: WakeLockSentinel | null = null;
    const acquire = async () => {
      try {
        if (document.visibilityState !== 'visible' || !('wakeLock' in navigator)) return;
        await lock?.release().catch(() => {});
        lock = await navigator.wakeLock.request('screen');
      } catch {
        // Not supported, or refused (e.g. battery saver): cooking still works, the screen just may dim
      }
    };
    void acquire();
    const onVisible = () => { if (document.visibilityState === 'visible') void acquire(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      void lock?.release().catch(() => {});
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

  // Timer effect: recompute the time left from the real clock on every tick (and the moment the tab is visible
  // again) instead of subtracting 1 per tick, so throttling or a suspended page cannot make it run slow.
  useEffect(() => {
    if (!timerRunning) return;
    const tick = () => {
      const endAt = timerEndRef.current;
      if (endAt === null) return;
      const left = remainingSeconds(endAt, Date.now());
      setTimerRemaining(left);
      if (left <= 0) {
        timerEndRef.current = null;
        setTimerRunning(false);
        setTimerDone(true);
      }
    };
    tick();
    const id = setInterval(tick, 500);
    const onVisible = () => { if (document.visibilityState === 'visible') tick(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [timerRunning]);

  // The timer reached zero: ring (beeps + vibration), say so, and show the banner until dismissed
  useEffect(() => {
    if (!timerDone) return;
    startAlarm();
    speak("Timer complete!", true);
    toast.success("Timer complete!");
  }, [timerDone]);

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

  // Start voice commands (the recognizer itself lives in VoiceCommandParser, driven by isListening)
  const startListening = () => {
    if (!isSpeechRecognitionSupported()) {
      toast.error(VOICE_UNSUPPORTED_MESSAGE);
      return;
    }
    setIsListening(true);
    toast.success("Voice commands activated");
    speak("Voice commands activated. Say 'next step', 'previous step' or 'read step'.", true);
  };

  // Stop voice commands
  const stopListening = () => {
    setIsListening(false);
    toast.success("Voice commands deactivated");
  };

  // Toggle text-to-speech
  const toggleSpeech = () => {
    const enabled = !isSpeechEnabled;
    setIsSpeechEnabled(enabled);
    if (enabled) {
      // One utterance: speak() cancels whatever is playing, and isSpeechEnabled is still the old
      // value in this render, so the confirmation has to bypass the gate with `force`.
      speak(`Read aloud is on. ${recipe.steps[currentStep]}`, true);
    } else if (speechSynthRef.current) {
      speechSynthRef.current.cancel();
    }
  };

  // Speak text using speech synthesis. `force` is for things the user explicitly asked for
  // ("read step", turning read-aloud on) so they work even while auto read-aloud is off.
  const speak = (text: string, force = false) => {
    if (speechSynthRef.current && (isSpeechEnabled || force)) {
      speechSynthRef.current.cancel();
      // Recipe text is written to be read ("1/2 tsp", "5-6 min"); rewrite it so it is spoken naturally
      const utterance = new SpeechSynthesisUtterance(toSpeech(text));
      if (preferredVoiceRef.current) {
        utterance.voice = preferredVoiceRef.current;
        utterance.lang = preferredVoiceRef.current.lang;
      }
      utterance.rate = 0.9; // Slightly slower than default
      utterance.pitch = 1;
      speechSynthRef.current.speak(utterance);
    }
  };

  // Handle ingredient navigation
  const handleNextIngredient = () => {
    if (currentIngredient < recipe.ingredients.length - 1) {
      setCurrentIngredient(currentIngredient + 1);
      const ingredient = recipe.ingredients[currentIngredient + 1];
      const text = ingredient.quantity && ingredient.unit ? `${ingredient.name}, ${ingredient.quantity} ${ingredient.unit}` : ingredient.name;
      speak(`Ingredient ${currentIngredient + 2}: ${text}`, true);
      if (!showIngredients) {
        setShowIngredients(true);
      }
    } else {
      speak("That was the last ingredient.", true);
      toast.info("That was the last ingredient");
    }
  };
  const handlePreviousIngredient = () => {
    if (currentIngredient > 0) {
      setCurrentIngredient(currentIngredient - 1);
      const ingredient = recipe.ingredients[currentIngredient - 1];
      const text = ingredient.quantity && ingredient.unit ? `${ingredient.name}, ${ingredient.quantity} ${ingredient.unit}` : ingredient.name;
      speak(`Ingredient ${currentIngredient}: ${text}`, true);
      if (!showIngredients) {
        setShowIngredients(true);
      }
    } else {
      speak("You're at the first ingredient.", true);
      toast.info("You're at the first ingredient");
    }
  };
  const listAllIngredients = (forceSpeak = false) => {
    setShowIngredients(true);
    if (isSpeechEnabled || forceSpeak) {
      const ingredientsList = recipe.ingredients.map((ingredient, index) => {
        const text = ingredient.quantity && ingredient.unit ? `${ingredient.name}, ${ingredient.quantity} ${ingredient.unit}` : ingredient.name;
        return `Ingredient ${index + 1}: ${text}`;
      }).join(". ");
      speak(`Here are all the ingredients: ${ingredientsList}`, true);
    }
  };
  const readIngredient = (index: number, forceSpeak = false) => {
    if (index >= 0 && index < recipe.ingredients.length) {
      setCurrentIngredient(index);
      if (isSpeechEnabled || forceSpeak) {
        const ingredient = recipe.ingredients[index];
        const text = ingredient.quantity && ingredient.unit ? `${ingredient.name}, ${ingredient.quantity} ${ingredient.unit}` : ingredient.name;
        speak(`Ingredient ${index + 1}: ${text}`, true);
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
        speak(recipe.steps[currentStep], true);
        break;
      case 'NEXT_INGREDIENT':
        handleNextIngredient();
        break;
      case 'PREVIOUS_INGREDIENT':
        handlePreviousIngredient();
        break;
      case 'LIST_INGREDIENTS':
        listAllIngredients(true);
        break;
      case 'READ_INGREDIENT':
        readIngredient(action.ingredientIndex, true);
        break;
      case 'START_TIMER':
        startTimer(action.minutes * 60, true);
        break;
      case 'STOP_TIMER':
        stopTimer(true);
        break;
      case 'TOGGLE_FULLSCREEN':
        toggleFullscreen();
        break;
      case 'EXIT':
        onClose();
        break;
    }
  };

  const isLastStep = currentStep === recipe.steps.length - 1;

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
  const startTimer = (seconds: number, announce = false) => {
    // Starting a timer is a tap, the one moment a browser lets us unlock audio for the alarm later
    unlockAlarm();
    stopAlarm();
    setTimerDone(false);
    timerEndRef.current = Date.now() + seconds * 1000;
    setTimerRemaining(seconds);
    setTimerRunning(true);
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    speak(`Timer set for ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}${rest ? ` and ${rest} seconds` : ''}.`, announce);
    toast.success(`Timer set for ${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`);
  };

  // Silence the alarm and hide the "time's up" banner
  const dismissTimerAlert = () => {
    stopAlarm();
    setTimerDone(false);
  };

  // Stop the timer
  const stopTimer = (announce = false) => {
    timerEndRef.current = null;
    setTimerRunning(false);
    dismissTimerAlert();
    speak("Timer stopped.", announce);
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
  // Fullscreen shows only the fullscreen element, so overlays must be drawn inside it; otherwise the page body
  const portalTarget = isFullscreen && containerRef.current ? containerRef.current : document.body;
  const ingredientsPanel = <>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium flex items-center gap-2">
          <List className="w-4 h-4 text-primary" />
          Ingredients ({recipe.ingredients.length})
        </h4>
        <button onClick={() => setShowIngredients(false)} className="p-1.5 rounded-full hover:bg-muted transition-colors" aria-label="Close ingredients">
          <X className="w-4 h-4" />
        </button>
      </div>
      <ul className="relative space-y-1 overflow-y-auto pr-1 md:max-h-[40vh]">
        {recipe.ingredients.map((ingredient, index) => <li key={`${ingredient.id}-${index}`} ref={index === currentIngredient ? (el) => {
            // keep the highlighted row visible inside the scrolling list (without scrolling the page)
            const list = el?.parentElement;
            if (el && list && (el.offsetTop < list.scrollTop || el.offsetTop + el.offsetHeight > list.scrollTop + list.clientHeight)) {
              list.scrollTop = el.offsetTop - list.clientHeight / 2;
            }
          } : undefined} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm md:text-base", index === currentIngredient ? "bg-primary/10 font-medium" : "")}>
            <span className="w-6 text-muted-foreground tabular-nums">{index + 1}</span>
            <span>{ingredient.quantity && ingredient.unit ? `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}` : ingredient.quantity ? `${ingredient.quantity} ${ingredient.name}` : ingredient.name}</span>
          </li>)}
      </ul>
    </>;
  return <VoiceCommandParser isListening={isListening} onCommand={handleVoiceCommandAction} totalSteps={recipe.steps.length} totalIngredients={recipe.ingredients.length} onListeningStopped={() => setIsListening(false)} onHeard={(text, kind) => setLastHeard({ text, kind })}>
      <div ref={containerRef} className={cn(" bg-gradient-to-b from-background to-muted/30 text-foreground flex flex-col", "w-full min-h-dvh relative", isFullscreen && "fixed inset-0 z-[100] max-h-dvh overflow-y-auto")}>
        {/* Header */}
        <div className="bg-card/80 mt-4 backdrop-blur-md border-b border-border p-2 lg:p-4 flex justify-between items-center">
          <div className="flex min-w-0 items-center gap-3">
            <button onClick={onClose} className="lg:p-2 p-0 rounded-full hover:bg-muted transition-colors" aria-label="Exit cooking mode">
              <X className="lg:w-5 lg:h-5 w-4 h-4" />
            </button>
            <h2 className="min-w-0 text-sm font-bold line-clamp-2 lg:text-xl lg:truncate">{recipe.title}</h2>
          </div>
          
          <div className="flex items-center  lg:gap-2">
            <button onClick={toggleAssistant} className={cn("p-2 rounded-full transition-colors", showAssistant ? "bg-primary text-primary-foreground" : "hover:bg-muted")} aria-label={showAssistant ? "Hide assistant" : "Show assistant"}>
              <MessageSquare className="lg:w-5 lg:h-5 w-4 h-4" />
            </button>
            
            <button onClick={toggleSpeech} className={cn("p-2 rounded-full transition-colors", isSpeechEnabled ? "bg-primary text-primary-foreground" : "hover:bg-muted")} aria-label={isSpeechEnabled ? "Disable text-to-speech" : "Enable text-to-speech"}>
              {isSpeechEnabled ? <Volume2 className="lg:w-5 lg:h-5 w-4 h-4" /> : <VolumeX className="lg:w-5 lg:h-5 w-4 h-4" />}
            </button>
            
            <button onClick={toggleSpeechRecognition} title={voiceSupported ? undefined : VOICE_UNSUPPORTED_MESSAGE} aria-disabled={!voiceSupported} className={cn("p-2 rounded-full transition-colors", isListening ? "bg-primary text-primary-foreground" : "hover:bg-muted", !voiceSupported && "opacity-40")} aria-label={isListening ? "Disable voice commands" : voiceSupported ? "Enable voice commands" : "Voice commands are not available in this browser"}>
              {isListening ? <Mic className="lg:w-5 lg:h-5 w-4 h-4" /> : <MicOff className="lg:w-5 lg:h-5 w-4 h-4" />}
            </button>
            
            <button onClick={toggleFullscreen} className="p-2 rounded-full hover:bg-muted transition-colors" aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
              {isFullscreen ? <Minimize className="lg:w-5 lg:h-5 w-4 h-4" /> : <Maximize className="lg:w-5 lg:h-5 w-4 h-4" />}
            </button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 p-4 md:p-8 flex flex-col items-center">
          {/* Top controls */}
          <div className="w-full max-w-3xl mb-4 flex flex-wrap items-center justify-between gap-2">
            <button onClick={togglePause} className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors", isPaused ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80")}>
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              <span className="text-sm">{isPaused ? "Resume" : "Pause"}</span>
            </button>

            <div className="flex flex-wrap items-center gap-2">
              {/* Countdown: sits above everything else so it stays visible while the ingredients/assistant open */}
              {timerRunning && <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-lg" aria-label="Timer countdown">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-mono font-medium">{formatTime(timerRemaining)}</span>
                  <button onClick={() => stopTimer()} className="ml-1 p-1 rounded-full hover:bg-muted/80" aria-label="Cancel timer">
                    <X className="w-3 h-3" />
                  </button>
                </div>}

              <button onClick={() => setShowIngredients(!showIngredients)} className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors", showIngredients ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80")} aria-label={showIngredients ? "Hide ingredients" : "Show ingredients"}>
                <List className="w-4 h-4" />
                <span className="text-sm">Ingredients</span>
              </button>
            </div>
          </div>

          {/* Stays until dismissed: a 4-second toast is easy to miss when you are across the kitchen */}
          {timerDone && <div role="alert" className="w-full max-w-3xl mb-4 flex items-center justify-between gap-3 rounded-lg bg-primary text-primary-foreground px-4 py-3 shadow-md">
              <span className="flex items-center gap-2 font-medium">
                <BellRing className="w-5 h-5" aria-hidden="true" />
                Time&apos;s up!
              </span>
              <button onClick={dismissTimerAlert} className="rounded-md bg-primary-foreground/20 hover:bg-primary-foreground/30 px-3 py-1 text-sm font-medium transition-colors">
                Dismiss
              </button>
            </div>}

          {/* What the microphone just heard, so a command that did nothing is explainable */}
          {isListening && <div className="w-full max-w-3xl mb-4 flex items-center gap-2 text-sm rounded-lg bg-muted/50 px-3 py-2" aria-live="polite">
              <Mic className="w-4 h-4 text-primary flex-shrink-0" />
              {lastHeard ? <span className="truncate">
                  <span className="text-muted-foreground">Heard </span>
                  <span className="font-medium">&ldquo;{lastHeard.text}&rdquo;</span>
                  <span className={cn("ml-2", lastHeard.kind === 'action' ? "text-green-600" : "text-muted-foreground")}>
                    {lastHeard.kind === 'action' ? "understood" : lastHeard.kind === 'error' ? "invalid" : "not a command"}
                  </span>
                </span> : <span className="text-muted-foreground">Listening… try &ldquo;next step&rdquo; or &ldquo;list ingredients&rdquo;</span>}
            </div>}

          {/* Ingredients (button, or the voice commands "list ingredients" / "next ingredient").
              Phones get a bottom sheet over the step; larger screens keep the card above it. */}
          {showIngredients && <>
              <div className="hidden md:block w-full max-w-3xl mb-6 bg-card border border-border rounded-2xl p-4 md:p-6 shadow-sm">
                {ingredientsPanel}
              </div>
              {createPortal(<div className="md:hidden fixed inset-0 z-[110]" role="dialog" aria-label="Ingredients">
                  <div className="absolute inset-0 bg-black/40" onClick={() => setShowIngredients(false)} />
                  <div className="absolute inset-x-0 bottom-0 max-h-[70dvh] flex flex-col bg-card border-t border-border rounded-t-2xl shadow-2xl p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                    <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-muted-foreground/30" />
                    {ingredientsPanel}
                  </div>
                </div>, portalTarget)}
            </>}

          {/* Progress indicator */}
          <div className="w-full max-w-3xl mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {recipe.steps.length}
              </span>
              <span className="text-sm font-medium">
                {Math.round((currentStep + 1) / recipe.steps.length * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <motion.div className="h-full bg-primary" initial={{
              width: `${currentStep / recipe.steps.length * 100}%`
            }} animate={{
              width: `${(currentStep + 1) / recipe.steps.length * 100}%`
            }} transition={{
              duration: 0.3
            }} />
            </div>
          </div>
          
          {/* Main content area - split into two columns when assistant is shown */}
          <div className={cn("w-full max-w-3xl grid gap-6", showAssistant ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")}>
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
          }} className="bg-card border border-border rounded-2xl p-5 md:p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 text-lg font-bold">
                  {currentStep + 1}
                </div>
                <h3 className="text-xl font-bold">Step {currentStep + 1}</h3>
              </div>
              
              <p className="text-lg mb-6 leading-relaxed">{recipe.steps[currentStep]}</p>
              
              {/* Timer section */}
              <div className="mt-6 border-t border-border pt-4">
                <h4 className="font-medium mb-3">Need a timer?</h4>
                <div className="flex flex-wrap gap-2">
                  {[1, 3, 5, 10, 15].map(minutes => <button key={minutes} onClick={() => startTimer(minutes * 60)} className="px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg text-sm transition-colors">
                      {minutes} min
                    </button>)}
                  
                </div>
              </div>
            </motion.div>
            
            {/* Cooking Assistant */}
            {/* Stays mounted while hidden so closing the panel doesn't erase the conversation */}
            <div className={showAssistant ? undefined : "hidden"}>
              <CookingAssistant recipe={recipe} currentStep={currentStep} onStepChange={setCurrentStep} isPaused={isPaused} onPauseToggle={togglePause} />
            </div>
          </div>
          
          {/* Voice command help */}
          {isListening && <div className="w-full max-w-3xl bg-muted/50 rounded-xl p-4 mb-6 mt-6">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Mic className="w-4 h-4 text-primary" />
                Voice Commands Available
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-medium text-muted-foreground mb-1">Steps</div>
                  <div className="flex items-center gap-2">
                    <span className="bg-muted px-2 py-1 rounded font-mono text-xs">&quot;Next step&quot;</span>
                    <span className="text-muted-foreground text-xs">Next step</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-muted px-2 py-1 rounded font-mono text-xs">&quot;Go to step 3&quot;</span>
                    <span className="text-muted-foreground text-xs">Jump to step</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-muted px-2 py-1 rounded font-mono text-xs">&quot;Read step&quot;</span>
                    <span className="text-muted-foreground text-xs">Read current step</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-xs font-medium text-muted-foreground mb-1">Ingredients</div>
                  <div className="flex items-center gap-2">
                    <span className="bg-muted px-2 py-1 rounded font-mono text-xs">&quot;Next ingredient&quot;</span>
                    <span className="text-muted-foreground text-xs">Next ingredient</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-muted px-2 py-1 rounded font-mono text-xs">&quot;List ingredients&quot;</span>
                    <span className="text-muted-foreground text-xs">Show all</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-muted px-2 py-1 rounded font-mono text-xs">&quot;Read ingredient 2&quot;</span>
                    <span className="text-muted-foreground text-xs">Specific ingredient</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-xs font-medium text-muted-foreground mb-1">Timer</div>
                  <div className="flex items-center gap-2">
                    <span className="bg-muted px-2 py-1 rounded font-mono text-xs">&quot;Start timer 5 minutes&quot;</span>
                    <span className="text-muted-foreground text-xs">Set timer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-muted px-2 py-1 rounded font-mono text-xs">&quot;Stop timer&quot;</span>
                    <span className="text-muted-foreground text-xs">Cancel timer</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-xs font-medium text-muted-foreground mb-1">Other</div>
                  <div className="flex items-center gap-2">
                    <span className="bg-muted px-2 py-1 rounded font-mono text-xs">&quot;Fullscreen&quot;</span>
                    <span className="text-muted-foreground text-xs">Toggle fullscreen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-muted px-2 py-1 rounded font-mono text-xs">&quot;Exit cooking&quot;</span>
                    <span className="text-muted-foreground text-xs">Close cooking mode</span>
                  </div>
                </div>
              </div>
              
              <button onClick={() => window.open('/cooking-commands', '_blank')} className="mt-3 text-xs text-primary hover:underline">
                View all commands
              </button>
            </div>}
        </div>
        
        {/* Navigation footer */}
        <div className="sticky bottom-0 z-10 bg-card/95 backdrop-blur-md border-t border-border p-4 flex justify-between items-center">
          <button onClick={handlePreviousStep} disabled={currentStep === 0} aria-label="Previous step" className={cn("flex items-center gap-2 px-4 py-2 rounded-lg transition-colors bg-muted", currentStep === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-muted/80")}>
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden lg:block">Previous</span>
          </button>
          
          <div className="flex gap-1">
            {recipe.steps.map((_, index) => <button key={index} onClick={() => setCurrentStep(index)} className={cn("w-2 h-2 rounded-full transition-all", currentStep === index ? "bg-primary w-4" : "bg-muted hover:bg-muted-foreground/50")} aria-label={`Go to step ${index + 1}`} />)}
          </div>
          
          <button onClick={handleNextStep} aria-label={isLastStep ? "Finish recipe" : "Next step"} className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors bg-primary text-primary-foreground hover:bg-primary/90">
            {isLastStep ? <><span>Finish</span><Check className="w-5 h-5" /></> : <><span className="hidden lg:block">Next</span><ChevronRight className="w-5 h-5" /></>}
          </button>
        </div>
      </div>
      
      {/* Completion Celebration */}
      <CompletionCelebration isOpen={showCelebration} onClose={() => setShowCelebration(false)} recipeName={recipe.title} portalTarget={portalTarget} />
    </VoiceCommandParser>;
}