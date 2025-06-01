"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Sliders, Scan, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ModelProvider } from '@/types';
import { AIProviderSelector } from './ai-provider-selector';
interface MLDetectionSettingsProps {
  currentProvider: ModelProvider;
  onProviderChange: (provider: ModelProvider) => void;
  confidenceThreshold: number;
  onConfidenceChange: (value: number) => void;
  className?: string;
}
export function MLDetectionSettings({
  currentProvider,
  onProviderChange,
  confidenceThreshold,
  onConfidenceChange,
  className
}: MLDetectionSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  return <div className={cn("relative mb-4", className)} data-unique-id="33a1f3c0-9a33-4485-bec6-d0541eec9a69" data-file-name="components/ml-detection-settings.tsx" data-dynamic-text="true">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 px-3  h-12 rounded-lg border border-border hover:bg-muted/50 transition-colors" data-unique-id="bc064d76-2a1f-4953-910d-49ad7a1d6c44" data-file-name="components/ml-detection-settings.tsx">
        <Settings className="w-4 h-4" />
        <span className="text-sm" data-unique-id="d4ffea9a-adec-4d4a-8976-30a10ad69185" data-file-name="components/ml-detection-settings.tsx"><span className="editable-text" data-unique-id="972d0986-39d6-47c5-93f3-b11d08a70e6a" data-file-name="components/ml-detection-settings.tsx">ML Settings</span></span>
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
    }} className="absolute right-0 top-full mt-2 z-10 bg-card rounded-lg shadow-lg border border-border p-4 w-72" onMouseLeave={() => setIsOpen(false)} data-unique-id="1a0fdd11-3fd5-4b90-a541-4ae22a1c6041" data-file-name="components/ml-detection-settings.tsx">
          <div className="flex items-center gap-2 mb-4" data-unique-id="6e631e40-ca7e-4cbf-b9a3-5a6525c8b34c" data-file-name="components/ml-detection-settings.tsx">
            <h3 className="font-medium" data-unique-id="c2d7de12-1ae8-4f2a-9495-1675d1c37a39" data-file-name="components/ml-detection-settings.tsx"><span className="editable-text" data-unique-id="525c0f53-d9e1-4e9c-8cbd-5398bbeee8bf" data-file-name="components/ml-detection-settings.tsx">ML Detection Settings</span></h3>
          </div>

          <div className="space-y-4" data-unique-id="e637c71f-ea81-4652-b7cf-9af7f705e0dd" data-file-name="components/ml-detection-settings.tsx">
            <div data-unique-id="309b5a40-200f-4872-878d-c52ce7435f35" data-file-name="components/ml-detection-settings.tsx">
              <label className="block text-sm font-medium mb-1" data-unique-id="adaafae9-6523-49c7-9073-ad8d9ec0f413" data-file-name="components/ml-detection-settings.tsx"><span className="editable-text" data-unique-id="8e6750e4-6e66-49d0-95e4-c5c1094fc051" data-file-name="components/ml-detection-settings.tsx">AI Provider</span></label>
              <AIProviderSelector currentProvider={currentProvider} onProviderChange={onProviderChange} />
            </div>

            <div data-unique-id="60a6b65f-9e99-4557-a06a-5cc10129a883" data-file-name="components/ml-detection-settings.tsx">
              <label className="block text-sm font-medium mb-1" data-unique-id="7259909d-f2d9-4b12-93d2-d8487ed2418f" data-file-name="components/ml-detection-settings.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="48c25966-a200-4ce7-829f-06f5c8fe59c4" data-file-name="components/ml-detection-settings.tsx">
                Confidence Threshold: </span>{confidenceThreshold}<span className="editable-text" data-unique-id="020b0b69-ba4f-4b9c-98f0-0d41fc5fb94e" data-file-name="components/ml-detection-settings.tsx">%
              </span></label>
              <input type="range" min="50" max="95" step="5" value={confidenceThreshold} onChange={e => onConfidenceChange(parseInt(e.target.value))} className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary" data-unique-id="cb361118-27cf-42d2-a767-e962e8325423" data-file-name="components/ml-detection-settings.tsx" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1" data-unique-id="d0a21023-279e-4557-9841-269c1d80b279" data-file-name="components/ml-detection-settings.tsx">
                <span data-unique-id="2ff07b55-5f6f-4849-8154-a901bfc1ea37" data-file-name="components/ml-detection-settings.tsx"><span className="editable-text" data-unique-id="0e020b51-355f-40e6-8d31-743311d09c55" data-file-name="components/ml-detection-settings.tsx">50%</span></span>
                <span data-unique-id="e11488bd-7e37-413d-8505-4e1b2296612b" data-file-name="components/ml-detection-settings.tsx"><span className="editable-text" data-unique-id="6d61d85c-6aa4-493d-8168-9d1343d5e4d6" data-file-name="components/ml-detection-settings.tsx">95%</span></span>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-muted/50 p-2 rounded-lg text-xs" data-unique-id="bf48fbb3-74fa-4983-b41b-9217c0411b41" data-file-name="components/ml-detection-settings.tsx">
              <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground" data-unique-id="cbec87a9-aae3-4e3d-84f9-86bb62711c55" data-file-name="components/ml-detection-settings.tsx"><span className="editable-text" data-unique-id="0aba70f4-b84b-4fc1-a92b-ea42167566de" data-file-name="components/ml-detection-settings.tsx">
                Higher confidence threshold means more accurate but potentially fewer detected ingredients.
              </span></p>
            </div>
          </div>
        </motion.div>}
    </div>;
}