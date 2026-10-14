import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * The UI numbers steps itself, so drop any "Step 1:", "1.", "2)" label the LLM put in the text.
 * Models add these even when told not to, so don't rely on the prompt alone.
 */
export function stripStepLabel(step: unknown): string {
  return String(step ?? '')
    .trim()
    .replace(/^(?:step\s*\d+\s*[:.)\-–—]\s*|\d+\s*[.):]\s+)/i, '')
    .trim();
}
