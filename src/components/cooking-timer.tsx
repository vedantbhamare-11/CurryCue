"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Clock, Play, Pause, X } from 'lucide-react';
import { cn } from '@/lib/utils';
interface CookingTimerProps {
  initialSeconds?: number;
  onComplete?: () => void;
  onCancel?: () => void;
}
export function CookingTimer({
  initialSeconds = 0,
  onComplete,
  onCancel
}: CookingTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (isRunning && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current as NodeJS.Timeout);
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, seconds, onComplete]);
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };
  const cancelTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    onCancel?.();
  };
  const formatTime = () => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  const progress = initialSeconds > 0 ? (initialSeconds - seconds) / initialSeconds * 100 : 0;
  return <motion.div initial={{
    opacity: 0,
    scale: 0.9
  }} animate={{
    opacity: 1,
    scale: 1
  }} className="bg-card border border-border rounded-lg p-3 shadow-md" data-unique-id="c71fa8cc-dc96-4436-b71b-2d36a190bc0e" data-file-name="components/cooking-timer.tsx">
      <div className="flex items-center justify-between mb-2" data-unique-id="c78ba127-6393-41b5-b777-7bcb086d1486" data-file-name="components/cooking-timer.tsx">
        <div className="flex items-center gap-2" data-unique-id="f04d365a-4e09-4d5a-8bff-db4eb9126fab" data-file-name="components/cooking-timer.tsx">
          <Clock className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm" data-unique-id="4a33f666-8d4c-4c00-8627-a42297b2dc94" data-file-name="components/cooking-timer.tsx"><span className="editable-text" data-unique-id="5ee398c3-abf6-4db3-bd99-4e373528a3ef" data-file-name="components/cooking-timer.tsx">Timer</span></span>
        </div>
        <button onClick={cancelTimer} className="p-1 rounded-full hover:bg-muted transition-colors" aria-label="Cancel timer" data-unique-id="1db5bced-9d41-440a-b382-50792668f772" data-file-name="components/cooking-timer.tsx">
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex items-center gap-3" data-unique-id="7b33c498-b64d-49a7-9137-7eb3e001dfd1" data-file-name="components/cooking-timer.tsx">
        <div className="relative w-12 h-12 rounded-full bg-muted flex items-center justify-center" data-unique-id="95f242c2-8d9a-48b0-9645-1e629222b6d5" data-file-name="components/cooking-timer.tsx">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" data-unique-id="18857348-f215-4512-903a-1897fa15d04e" data-file-name="components/cooking-timer.tsx">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="10" className="text-muted" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="10" strokeDasharray="283" strokeDashoffset={283 - 283 * progress / 100} className="text-primary" transform="rotate(-90 50 50)" />
          </svg>
          <span className="font-mono font-medium text-sm z-10" data-unique-id="f846bfdf-b0e9-4c5f-a8f3-5f74c0b4cb47" data-file-name="components/cooking-timer.tsx" data-dynamic-text="true">{formatTime()}</span>
        </div>
        
        <button onClick={toggleTimer} className={cn("p-2 rounded-full transition-colors", isRunning ? "bg-primary/20 text-primary hover:bg-primary/30" : "bg-primary text-primary-foreground hover:bg-primary/90")} aria-label={isRunning ? "Pause timer" : "Start timer"} data-unique-id="1136b95f-8a3b-49cd-ac24-44c6646110c5" data-file-name="components/cooking-timer.tsx" data-dynamic-text="true">
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      </div>
    </motion.div>;
}