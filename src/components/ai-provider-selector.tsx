"use client";

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Check } from 'lucide-react';
import { getTextProviders, getVisionEnabledProviders } from '@/lib/api/util';
import { ModelProvider } from '@/types';
import { cn } from '@/lib/utils';
interface AIProviderSelectorProps {
  onProviderChange: (provider: ModelProvider) => void;
  currentProvider: ModelProvider;
}
export function AIProviderSelector({
  onProviderChange,
  currentProvider
}: AIProviderSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    theme
  } = useTheme();
  const textProviders = getTextProviders() as ModelProvider[];
  const visionProviders = getVisionEnabledProviders() as ModelProvider[];
  const formatProviderName = (provider: string) => {
    return provider.replace('azure-', '').replace('-bedrock', '').split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  return <div className="relative" data-unique-id="ccd84310-de92-47d7-80cd-8b0f012b6a8b" data-file-name="components/ai-provider-selector.tsx" data-dynamic-text="true">
      <button onClick={() => setIsOpen(!isOpen)} className={cn("flex items-center gap-2 px-3 py-2 rounded-lg", "border border-border hover:bg-muted/50 transition-colors")} data-unique-id="e60af277-ab1f-4d7b-9aec-c700123d2450" data-file-name="components/ai-provider-selector.tsx">
        <span className="text-sm" data-unique-id="4361d17d-df1a-47dc-86db-9d27e3b35dd8" data-file-name="components/ai-provider-selector.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="71b846f3-f01b-433f-b708-bfdfd79579e2" data-file-name="components/ai-provider-selector.tsx">AI: </span>{formatProviderName(currentProvider)}</span>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={cn("transition-transform", isOpen ? "rotate-180" : "")} data-unique-id="d1a03892-b57d-42a5-b939-3ff71dbd026b" data-file-name="components/ai-provider-selector.tsx">
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      
      {isOpen && <div className="absolute z-10 mt-1 right-0 bg-card rounded-lg shadow-lg border border-border py-1 min-w-[180px]" onMouseLeave={() => setIsOpen(false)} data-unique-id="49a76891-0b32-4abe-9e1b-18039685fa7d" data-file-name="components/ai-provider-selector.tsx" data-dynamic-text="true">
          <div className="px-2 py-1.5 text-xs text-muted-foreground font-medium" data-unique-id="531c733b-20a8-4e39-8c87-55d5f3ad24ed" data-file-name="components/ai-provider-selector.tsx"><span className="editable-text" data-unique-id="3717010b-b8ad-4beb-853b-4d30c5a8b7da" data-file-name="components/ai-provider-selector.tsx">Text Providers</span></div>
          {textProviders.map(provider => <button key={provider} onClick={() => {
        onProviderChange(provider);
        setIsOpen(false);
      }} className="flex items-center justify-between gap-2 w-full px-3 py-2 text-sm hover:bg-muted/50 transition-colors" data-unique-id="a52a2ae0-64ab-4207-a7c8-07af58ca5545" data-file-name="components/ai-provider-selector.tsx" data-dynamic-text="true">
              <span data-unique-id="877f694b-8f14-47bc-a775-92164eeff108" data-file-name="components/ai-provider-selector.tsx" data-dynamic-text="true">{formatProviderName(provider)}</span>
              {currentProvider === provider && <Check className="w-4 h-4 text-primary" />}
            </button>)}
          
          <div className="border-t border-border my-1" data-unique-id="10b9782d-d9e6-4249-9afb-047650290ff1" data-file-name="components/ai-provider-selector.tsx"></div>
          
          <div className="px-2 py-1.5 text-xs text-muted-foreground font-medium" data-unique-id="6007bd3f-a197-4a80-a868-c3117d0ec0e8" data-file-name="components/ai-provider-selector.tsx"><span className="editable-text" data-unique-id="cc8a6b37-d98d-463f-ac43-85adaca86b83" data-file-name="components/ai-provider-selector.tsx">Vision Providers</span></div>
          {visionProviders.map(provider => <button key={provider} onClick={() => {
        onProviderChange(provider);
        setIsOpen(false);
      }} className="flex items-center justify-between gap-2 w-full px-3 py-2 text-sm hover:bg-muted/50 transition-colors" data-unique-id="17781138-f1b3-415e-8c39-b216adc5338c" data-file-name="components/ai-provider-selector.tsx" data-dynamic-text="true">
              <span data-unique-id="80211f90-b86e-4851-91bc-86e5884cec78" data-file-name="components/ai-provider-selector.tsx" data-dynamic-text="true">{formatProviderName(provider)}</span>
              {currentProvider === provider && <Check className="w-4 h-4 text-primary" />}
            </button>)}
        </div>}
    </div>;
}