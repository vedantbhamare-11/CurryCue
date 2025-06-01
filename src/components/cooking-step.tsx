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
  }} className="bg-card border border-border rounded-xl p-6 shadow-md" data-unique-id="d6126a92-c969-459b-9f05-3e48b8e87bca" data-file-name="components/cooking-step.tsx" data-dynamic-text="true">
      <div className="flex items-center gap-3 mb-6" data-unique-id="b5610e52-40f1-4174-9184-6393f6c01044" data-file-name="components/cooking-step.tsx">
        <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 text-lg font-bold" data-unique-id="42e9f181-2700-446c-8318-1906a53aedf1" data-file-name="components/cooking-step.tsx" data-dynamic-text="true">
          {stepNumber}
        </div>
        <div data-unique-id="be1d574f-adcf-4507-9bf1-ec24e8ff02ba" data-file-name="components/cooking-step.tsx">
          <h3 className="text-xl font-bold" data-unique-id="2dfcc7cd-b3a1-44f8-b075-05ccd1104b30" data-file-name="components/cooking-step.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="b433f67a-0440-42b2-a9b6-f2c7b16812cf" data-file-name="components/cooking-step.tsx">Step </span>{stepNumber}</h3>
          <p className="text-sm text-muted-foreground" data-unique-id="0712465b-54aa-4b0b-9acf-8bbd84828eb7" data-file-name="components/cooking-step.tsx" data-dynamic-text="true">
            {Math.round(stepNumber / totalSteps * 100)}<span className="editable-text" data-unique-id="a47e6c7a-b794-48aa-a686-fc5c8c0a9a17" data-file-name="components/cooking-step.tsx">% complete
          </span></p>
        </div>
      </div>
      
      <p className="text-lg mb-6 leading-relaxed" data-unique-id="c305ae95-cbba-4fc6-85ba-95f67db4b161" data-file-name="components/cooking-step.tsx" data-dynamic-text="true">{instruction}</p>
      
      {suggestedTime && <div className="mt-4 mb-2" data-unique-id="13b9d438-ee33-4542-937f-fa68cce0fcc1" data-file-name="components/cooking-step.tsx">
          <div className="flex items-center gap-2 mb-2" data-unique-id="1f1c1d34-8e2f-4a0d-9203-812d43d96255" data-file-name="components/cooking-step.tsx">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium" data-unique-id="746520ec-c10b-436a-b777-c5fb9dcdca03" data-file-name="components/cooking-step.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="1a896b89-4a4e-4854-ac48-28e5d48cb85e" data-file-name="components/cooking-step.tsx">Suggested Timer: </span>{Math.floor(suggestedTime / 60)}<span className="editable-text" data-unique-id="bc12001e-c213-4347-a10b-2f5fe018cb8b" data-file-name="components/cooking-step.tsx"> minutes</span></span>
          </div>
          <CookingTimer initialSeconds={suggestedTime} onComplete={onTimerComplete} />
        </div>}
      
      {!suggestedTime && <div className="mt-6 border-t border-border pt-4" data-unique-id="abb3e4e9-3813-4f78-8495-51d0b4d4de59" data-file-name="components/cooking-step.tsx">
          <h4 className="font-medium mb-3" data-unique-id="10d780ea-a555-4aac-982e-60b456639869" data-file-name="components/cooking-step.tsx"><span className="editable-text" data-unique-id="037caf92-862d-4504-a003-49e086b55581" data-file-name="components/cooking-step.tsx">Need a timer?</span></h4>
          <div className="flex flex-wrap gap-2" data-unique-id="26428de0-ff91-4bbd-9c9a-ad26d679f8ed" data-file-name="components/cooking-step.tsx" data-dynamic-text="true">
            {[1, 3, 5, 10, 15].map(minutes => <button key={minutes} className="px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg text-sm transition-colors" data-unique-id="4f166a6a-af32-4ab0-abc6-17b46f16147b" data-file-name="components/cooking-step.tsx" data-dynamic-text="true">
                {minutes}<span className="editable-text" data-unique-id="41339b69-f6a7-4634-96d4-3505f6cc0771" data-file-name="components/cooking-step.tsx"> min
              </span></button>)}
          </div>
        </div>}
    </motion.div>;
}