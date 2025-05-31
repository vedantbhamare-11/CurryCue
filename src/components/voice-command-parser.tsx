"use client";

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
export type VoiceCommandAction = {
  type: 'NEXT_STEP';
} | {
  type: 'PREVIOUS_STEP';
} | {
  type: 'GO_TO_STEP';
  stepNumber: number;
} | {
  type: 'READ_STEP';
} | {
  type: 'NEXT_INGREDIENT';
} | {
  type: 'PREVIOUS_INGREDIENT';
} | {
  type: 'LIST_INGREDIENTS';
} | {
  type: 'READ_INGREDIENT';
  ingredientIndex: number;
} | {
  type: 'START_TIMER';
  minutes: number;
} | {
  type: 'STOP_TIMER';
} | {
  type: 'TOGGLE_FULLSCREEN';
} | {
  type: 'EXIT';
};
interface VoiceCommandParserProps {
  isListening: boolean;
  onCommand: (action: VoiceCommandAction) => void;
  totalSteps: number;
  totalIngredients: number;
  currentStep: number;
  currentIngredient?: number;
  children?: React.ReactNode;
}
export function VoiceCommandParser({
  isListening,
  onCommand,
  totalSteps,
  totalIngredients,
  currentStep,
  currentIngredient,
  children
}: VoiceCommandParserProps) {
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  const [lastCommand, setLastCommand] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        speechRecognitionRef.current = new SpeechRecognitionAPI();
        if (speechRecognitionRef.current) {
          speechRecognitionRef.current.continuous = true;
          speechRecognitionRef.current.interimResults = false;
          speechRecognitionRef.current.lang = 'en-US';
          speechRecognitionRef.current.onresult = event => {
            const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
            const currentConfidence = event.results[event.results.length - 1][0].confidence;
            setLastCommand(transcript);
            setConfidence(currentConfidence);
            parseCommand(transcript);
          };
          speechRecognitionRef.current.onerror = event => {
            console.error('Speech recognition error:', event.error);
          };
          speechRecognitionRef.current.onend = () => {
            // Restart if we're still supposed to be listening
            if (isListening && speechRecognitionRef.current) {
              try {
                speechRecognitionRef.current.start();
              } catch (e) {
                console.log('Recognition already started');
              }
            }
          };
        }
      } else {
        console.warn('Speech recognition not supported in this browser');
      }
    }
    return () => {
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.abort();
        } catch (e) {
          console.log('Recognition already stopped');
        }
      }
    };
  }, []);

  // Start or stop listening based on isListening prop
  useEffect(() => {
    if (isListening) {
      startListening();
    } else {
      stopListening();
    }
  }, [isListening]);
  const startListening = () => {
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };
  const stopListening = () => {
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  };
  const parseCommand = (command: string) => {
    // Navigation commands
    if (command.includes('next step') || command.includes('go forward')) {
      onCommand({
        type: 'NEXT_STEP'
      });
      return;
    }
    if (command.includes('previous step') || command.includes('go back') || command.includes('last step')) {
      onCommand({
        type: 'PREVIOUS_STEP'
      });
      return;
    }

    // Go to specific step
    const stepMatch = command.match(/(?:go to|show|jump to) step (\d+)/i);
    if (stepMatch && stepMatch[1]) {
      const stepNumber = parseInt(stepMatch[1]);
      if (stepNumber > 0 && stepNumber <= totalSteps) {
        onCommand({
          type: 'GO_TO_STEP',
          stepNumber: stepNumber - 1
        }); // Convert to 0-based index
        return;
      } else {
        toast.error(`Step ${stepNumber} is out of range. There are ${totalSteps} steps.`);
        return;
      }
    }

    // Read current step
    if (command.includes('read step') || command.includes('repeat step') || command.includes('what does it say')) {
      onCommand({
        type: 'READ_STEP'
      });
      return;
    }

    // Ingredient navigation
    if (command.includes('next ingredient') || command.includes('following ingredient')) {
      onCommand({
        type: 'NEXT_INGREDIENT'
      });
      return;
    }
    if (command.includes('previous ingredient') || command.includes('last ingredient')) {
      onCommand({
        type: 'PREVIOUS_INGREDIENT'
      });
      return;
    }

    // List all ingredients
    if (command.includes('list ingredients') || command.includes('what ingredients') || command.includes('show ingredients')) {
      onCommand({
        type: 'LIST_INGREDIENTS'
      });
      return;
    }

    // Read specific ingredient
    const ingredientMatch = command.match(/(?:read|what is|tell me about) ingredient (\d+)/i);
    if (ingredientMatch && ingredientMatch[1]) {
      const ingredientIndex = parseInt(ingredientMatch[1]);
      if (ingredientIndex > 0 && ingredientIndex <= totalIngredients) {
        onCommand({
          type: 'READ_INGREDIENT',
          ingredientIndex: ingredientIndex - 1
        }); // Convert to 0-based index
        return;
      } else {
        toast.error(`Ingredient ${ingredientIndex} is out of range. There are ${totalIngredients} ingredients.`);
        return;
      }
    }

    // Timer commands
    const timerMatch = command.match(/(?:set|start) timer (?:for )?(\d+)(?: minutes?)?/i);
    if (timerMatch && timerMatch[1]) {
      const minutes = parseInt(timerMatch[1]);
      onCommand({
        type: 'START_TIMER',
        minutes
      });
      return;
    }
    if (command.includes('stop timer') || command.includes('cancel timer') || command.includes('end timer')) {
      onCommand({
        type: 'STOP_TIMER'
      });
      return;
    }

    // Display commands
    if (command.includes('fullscreen') || command.includes('full screen')) {
      onCommand({
        type: 'TOGGLE_FULLSCREEN'
      });
      return;
    }

    // Exit command
    if (command.includes('exit') || command.includes('close') || command.includes('quit')) {
      onCommand({
        type: 'EXIT'
      });
      return;
    }
  };
  return <>
      {children}
      {/* Optionally render debug info */}
      {/* 
       <div className="fixed bottom-4 left-4 bg-card/80 backdrop-blur-sm p-2 rounded-lg text-xs">
        <div>Last command: {lastCommand}</div>
        <div>Confidence: {Math.round(confidence * 100)}%</div>
       </div>
       */}
    </>;
}