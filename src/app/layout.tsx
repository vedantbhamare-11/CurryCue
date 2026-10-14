import "@/styles/globals.css";
import React from "react";
import { Quicksand, Nunito } from "next/font/google";
import { type Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { NavBar } from "@/components/nav-bar";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
export const viewport = {
  width: "device-width",
  initialScale: 1,
};
export const metadata: Metadata = {
  title: {
    default: "CurryCue | AI Cooking Assistant",
    template: "%s | CurryCue",
  },
  description:
    "Turn your ingredients into delicious recipes with AI assistance",
  applicationName: "CurryCue",
  keywords: [
    "cooking",
    "recipes",
    "AI",
    "food",
    "ingredients",
    "meal planning",
  ],
  authors: [
    {
      name: "CurryCue Team",
    },
  ],
  creator: "CurryCue Team",
  publisher: "CurryCue",
  // Icons come from src/app/icon.svg and apple-icon.png, and the manifest from src/app/manifest.ts
  // (Next links them automatically). public/favicon.ico still serves the classic /favicon.ico request.
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CurryCue",
  },
  formatDetection: {
    telephone: false,
  },
};
const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});
const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${quicksand.variable} ${nunito.variable}`}
    >
      <body
        className="font-body bg-background text-foreground antialiased"
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          <NavBar />
          {children}
          <Analytics />
          <SpeedInsights />
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
