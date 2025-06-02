import "@/styles/globals.css";
import React from "react";
import { Quicksand, Nunito } from "next/font/google";
import { type Metadata } from "next";
import { DevtoolsProvider } from "creatr-devtools";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { NavBar } from "@/components/nav-bar";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
  icons: {
    icon: [
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: "/site.webmanifest",
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
      data-unique-id="907bed16-5e1a-44fd-990e-3ef9f55c4e57"
      data-file-name="app/layout.tsx"
    >
      <body
        className="font-body bg-background text-foreground antialiased"
        data-unique-id="8eb1ae6f-4cf4-4738-9176-6dcb89a472e7"
        data-file-name="app/layout.tsx"
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          <DevtoolsProvider>
            <NavBar />
            {children}
            <Analytics />
            <SpeedInsights />
            <Toaster position="top-center" richColors />
          </DevtoolsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
