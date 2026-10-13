"use client";

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { CookingTimer } from './cooking-timer';
import { cn } from '@/lib/utils';
interface CookingStepProps {
  stepNumber: number;
  totalSteps: number;
  instruction: string;
  onTimerComplete?: () => void;
}
export function CookingStep({
  stepNumber,
  totalSteps,
  instruction,
  onTimerComplete
}: CookingStepProps) {
  // Extract time mentions from the instruction
  const extractTimeFromInstruction = (): number | null => {
    const timeRegex = /(\d+)\s*(minute|min)/i;
    const match = instruction.match(timeRegex);
    if (match && match[1]) {
      return parseInt(match[1]) * 60; // Convert to seconds
    }
    return null;
  };
  const suggestedTime = extractTimeFromInstruction();
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} exit={{
    opacity: 0,
    y: -20
  }} className="bg-card border border-border rounded-xl p-6 shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 text-lg font-bold">
          {stepNumber}
        </div>
        <div>
          <h3 className="text-xl font-bold">Step {stepNumber}</h3>
          <p className="text-sm text-muted-foreground">
            {Math.round(stepNumber / totalSteps * 100)}% complete
          </p>
        </div>
      </div>
      
      <p className="text-lg mb-6 leading-relaxed">{instruction}</p>
      
      {suggestedTime && <div className="mt-4 mb-2">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Suggested Timer: {Math.floor(suggestedTime / 60)} minutes</span>
          </div>
          <CookingTimer initialSeconds={suggestedTime} onComplete={onTimerComplete} />
        </div>}
      
      {!suggestedTime && <div className="mt-6 border-t border-border pt-4">
          <h4 className="font-medium mb-3">Need a timer?</h4>
          <div className="flex flex-wrap gap-2">
            {[1, 3, 5, 10, 15].map(minutes => <button key={minutes} className="px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg text-sm transition-colors">
                {minutes} min
              </button>)}
          </div>
        </div>}
    </motion.div>;
}