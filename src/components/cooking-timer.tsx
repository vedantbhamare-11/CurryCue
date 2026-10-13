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
  }} className="bg-card border border-border rounded-lg p-3 shadow-md">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm">Timer</span>
        </div>
        <button onClick={cancelTimer} className="p-1 rounded-full hover:bg-muted transition-colors" aria-label="Cancel timer">
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="10" className="text-muted" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="10" strokeDasharray="283" strokeDashoffset={283 - 283 * progress / 100} className="text-primary" transform="rotate(-90 50 50)" />
          </svg>
          <span className="font-mono font-medium text-sm z-10">{formatTime()}</span>
        </div>
        
        <button onClick={toggleTimer} className={cn("p-2 rounded-full transition-colors", isRunning ? "bg-primary/20 text-primary hover:bg-primary/30" : "bg-primary text-primary-foreground hover:bg-primary/90")} aria-label={isRunning ? "Pause timer" : "Start timer"}>
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      </div>
    </motion.div>;
}