"use client";

import { Toaster } from "sonner";
import { useTheme } from "next-themes";

// Sonner does not know about next-themes: without this, toasts stay light on a dark page
export function ThemedToaster() {
  const { resolvedTheme } = useTheme();
  return <Toaster position="top-center" offset={76} richColors theme={resolvedTheme === 'dark' ? 'dark' : 'light'} />;
}
