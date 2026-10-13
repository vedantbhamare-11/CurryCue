"use client";

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { parseVoiceCommand, type VoiceCommandAction } from '@/lib/voice-commands';

export type { VoiceCommandAction } from '@/lib/voice-commands';

export function isSpeechRecognitionSupported(): boolean {
  return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
}

interface VoiceCommandParserProps {
  isListening: boolean;
  onCommand: (action: VoiceCommandAction) => void;
  totalSteps: number;
  totalIngredients: number;
  // Called when listening had to stop by itself (mic blocked, no network, too many restarts)
  // so the parent can flip its "listening" UI back off
  onListeningStopped?: () => void;
  children?: React.ReactNode;
}

// Chrome ends a recognition session after a stretch of silence; we restart it. If it keeps ending
// immediately (broken mic/service) give up instead of looping forever.
const RESTART_DELAY_MS = 300;
const MAX_RESTARTS_IN_WINDOW = 8;
const RESTART_WINDOW_MS = 10_000;

export function VoiceCommandParser({
  isListening,
  onCommand,
  totalSteps,
  totalIngredients,
  onListeningStopped,
  children
}: VoiceCommandParserProps) {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const wantListeningRef = useRef(false);
  const restartTimesRef = useRef<number[]>([]);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The recognizer's handlers are created once, so they must read the LATEST props through a ref.
  // Capturing props directly froze them at their first-render values: "next step" always acted on
  // step 0, and the restart check always saw isListening === false.
  const latest = useRef({ onCommand, totalSteps, totalIngredients, onListeningStopped });
  latest.current = { onCommand, totalSteps, totalIngredients, onListeningStopped };

  const stopForGood = (message?: string) => {
    wantListeningRef.current = false;
    if (message) toast.error(message);
    latest.current.onListeningStopped?.();
  };

  const startRecognition = () => {
    try {
      recognitionRef.current?.start();
    } catch {
      // InvalidStateError: already started. Nothing to do.
    }
  };

  // Create the recognizer once
  useEffect(() => {
    if (!isSpeechRecognitionSupported()) return;

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI() as unknown as SpeechRecognition;
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (!result.isFinal) continue;

        const { onCommand, totalSteps, totalIngredients } = latest.current;
        const parsed = parseVoiceCommand(result[0].transcript, { totalSteps, totalIngredients });
        if (parsed.kind === 'action') onCommand(parsed.action);
        else if (parsed.kind === 'error') toast.error(parsed.message);
      }
    };

    recognition.onerror = (event) => {
      switch (event.error) {
        case 'not-allowed':
        case 'service-not-allowed':
          stopForGood('Microphone access is blocked. Allow it in your browser settings to use voice commands.');
          break;
        case 'audio-capture':
          stopForGood('No microphone found.');
          break;
        case 'network':
          stopForGood('Voice commands need an internet connection.');
          break;
        case 'no-speech':
        case 'aborted':
          break; // normal: silence, or we stopped it ourselves
        default:
          console.error('Speech recognition error:', event.error);
      }
    };

    recognition.onend = () => {
      if (!wantListeningRef.current) return;

      const now = Date.now();
      restartTimesRef.current = [...restartTimesRef.current.filter((t) => now - t < RESTART_WINDOW_MS), now];
      if (restartTimesRef.current.length > MAX_RESTARTS_IN_WINDOW) {
        stopForGood("Voice commands keep stopping. Please try again.");
        return;
      }
      restartTimerRef.current = setTimeout(() => {
        if (wantListeningRef.current) startRecognition();
      }, RESTART_DELAY_MS);
    };

    recognitionRef.current = recognition;

    return () => {
      wantListeningRef.current = false;
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      recognition.onend = null;
      try {
        recognition.abort();
      } catch {
        // already stopped
      }
      recognitionRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Start/stop when the parent toggles listening
  useEffect(() => {
    wantListeningRef.current = isListening;
    if (isListening) {
      restartTimesRef.current = [];
      startRecognition();
    } else {
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      try {
        recognitionRef.current?.stop();
      } catch {
        // not running
      }
    }
  }, [isListening]);

  return <>{children}</>;
}
