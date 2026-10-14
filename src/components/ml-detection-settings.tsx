"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
interface MLDetectionSettingsProps {
  confidenceThreshold: number;
  onConfidenceChange: (value: number) => void;
  className?: string;
}
export function MLDetectionSettings({
  confidenceThreshold,
  onConfidenceChange,
  className
}: MLDetectionSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  return <div className={cn("relative mb-4", className)}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 px-3  h-12 rounded-lg border border-border hover:bg-muted/50 transition-colors">
        <Settings className="w-4 h-4" />
        <span className="text-sm">ML Settings</span>
      </button>

      {isOpen && <motion.div initial={{
      opacity: 0,
      y: 10
    }} animate={{
      opacity: 1,
      y: 0
    }} exit={{
      opacity: 0,
      y: 10
    }} className="absolute right-0 top-full mt-2 z-10 bg-card rounded-lg shadow-lg border border-border p-4 w-72" onMouseLeave={() => setIsOpen(false)}>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-medium">ML Detection Settings</h3>
          </div>

          <div className="space-y-4">

            <div>
              <label className="block text-sm font-medium mb-1">
                Confidence Threshold: {confidenceThreshold}%
              </label>
              <input type="range" min="50" max="95" step="5" value={confidenceThreshold} onChange={e => onConfidenceChange(parseInt(e.target.value))} className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>50%</span>
                <span>95%</span>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-muted/50 p-2 rounded-lg text-xs">
              <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground">
                Higher confidence threshold means more accurate but potentially fewer detected ingredients.
              </p>
            </div>
          </div>
        </motion.div>}
    </div>;
}