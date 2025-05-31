import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a data URL to a base64 string
 * @param dataUrl - The data URL to convert
 * @returns The base64 string
 */
export function dataUrlToBase64(dataUrl: string): string {
  // Check if it's already a base64 string without the data URL prefix
  if (!dataUrl.includes('data:')) {
    return dataUrl;
  }
  
  // Extract the base64 part from the data URL
  const base64 = dataUrl.split(',')[1];
  return base64;
}

/**
 * Converts a base64 string to a data URL
 * @param base64 - The base64 string to convert
 * @param mimeType - The MIME type of the data
 * @returns The data URL
 */
export function base64ToDataUrl(base64: string, mimeType: string = 'image/jpeg'): string {
  // Check if it's already a data URL
  if (base64.startsWith('data:')) {
    return base64;
  }
  
  // Create a data URL from the base64 string
  return `data:${mimeType};base64,${base64}`;
}
