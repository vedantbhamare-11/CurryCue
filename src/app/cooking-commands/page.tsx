"use client";

import { motion } from 'framer-motion';
import { Mic, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
export default function CookingCommandsPage() {
  return <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-zinc-900 dark:to-amber-950">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to home</span>
          </Link>
          
          <motion.h1 initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="text-3xl md:text-4xl font-bold mb-2">
            Voice Commands Reference
          </motion.h1>
          <p className="text-muted-foreground">
            Complete list of voice commands available in cooking mode
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Voice commands work in Chrome and Edge. Other browsers, including Firefox and Brave, don&apos;t include the speech service they need. You can say &quot;next&quot; or &quot;back&quot; a few times in a row, like &quot;next next&quot;.
          </p>
        </div>
        
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.1
      }} className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/10 p-3 rounded-full">
              <Mic className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Voice Command System</h2>
              <p className="text-muted-foreground">Hands-free cooking with voice control</p>
            </div>
          </div>
          
          <p className="mb-6">
            The voice command system allows you to control the cooking interface without touching your device.
            This is especially useful when your hands are busy or messy while cooking. Simply enable voice commands
            in the cooking mode and speak clearly to navigate through the recipe.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-muted/30 rounded-xl p-5">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="bg-primary/20 text-primary w-8 h-8 rounded-full flex items-center justify-center">1</span>
                Step Navigation Commands
              </h3>
              
              <div className="space-y-3">
                <div className="bg-card rounded-lg p-3 border border-border">
                  <div className="font-medium mb-1">&quot;Next step&quot; / &quot;Next&quot; / &quot;Go forward&quot;</div>
                  <p className="text-sm text-muted-foreground">Move to the next step in the recipe</p>
                </div>
                
                <div className="bg-card rounded-lg p-3 border border-border">
                  <div className="font-medium mb-1">&quot;Previous step&quot; / &quot;Previous&quot; / &quot;Go back&quot;</div>
                  <p className="text-sm text-muted-foreground">Return to the previous step</p>
                </div>
                
                <div className="bg-card rounded-lg p-3 border border-border">
                  <div className="font-medium mb-1">&quot;Go to step [number]&quot; / &quot;Jump to step [number]&quot;</div>
                  <p className="text-sm text-muted-foreground">Navigate directly to a specific step</p>
                </div>
                
                <div className="bg-card rounded-lg p-3 border border-border">
                  <div className="font-medium mb-1">&quot;Read step&quot; / &quot;Repeat step&quot; / &quot;What does it say&quot;</div>
                  <p className="text-sm text-muted-foreground">Have the current step read aloud</p>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-xl p-5">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="bg-primary/20 text-primary w-8 h-8 rounded-full flex items-center justify-center">2</span>
                Ingredient Commands
              </h3>
              
              <div className="space-y-3">
                <div className="bg-card rounded-lg p-3 border border-border">
                  <div className="font-medium mb-1">&quot;Next ingredient&quot; / &quot;Following ingredient&quot;</div>
                  <p className="text-sm text-muted-foreground">Move to the next ingredient in the list</p>
                </div>
                
                <div className="bg-card rounded-lg p-3 border border-border">
                  <div className="font-medium mb-1">&quot;Previous ingredient&quot; / &quot;Last ingredient&quot;</div>
                  <p className="text-sm text-muted-foreground">Go back to the previous ingredient</p>
                </div>
                
                <div className="bg-card rounded-lg p-3 border border-border">
                  <div className="font-medium mb-1">&quot;List ingredients&quot; / &quot;Show ingredients&quot; / &quot;What ingredients&quot;</div>
                  <p className="text-sm text-muted-foreground">Display and read all ingredients</p>
                </div>
                
                <div className="bg-card rounded-lg p-3 border border-border">
                  <div className="font-medium mb-1">&quot;Read ingredient [number]&quot; / &quot;Tell me about ingredient [number]&quot;</div>
                  <p className="text-sm text-muted-foreground">Read a specific ingredient by its number</p>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-xl p-5">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="bg-primary/20 text-primary w-8 h-8 rounded-full flex items-center justify-center">3</span>
                Timer Commands
              </h3>
              
              <div className="space-y-3">
                <div className="bg-card rounded-lg p-3 border border-border">
                  <div className="font-medium mb-1">&quot;Start timer [number] minutes&quot; / &quot;Set timer for [number] minutes&quot;</div>
                  <p className="text-sm text-muted-foreground">Start a countdown timer for the specified minutes</p>
                </div>
                
                <div className="bg-card rounded-lg p-3 border border-border">
                  <div className="font-medium mb-1">&quot;Stop timer&quot; / &quot;Cancel timer&quot; / &quot;End timer&quot;</div>
                  <p className="text-sm text-muted-foreground">Stop the currently running timer</p>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-xl p-5">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="bg-primary/20 text-primary w-8 h-8 rounded-full flex items-center justify-center">4</span>
                Display & Control Commands
              </h3>
              
              <div className="space-y-3">
                <div className="bg-card rounded-lg p-3 border border-border">
                  <div className="font-medium mb-1">&quot;Fullscreen&quot; / &quot;Full screen&quot;</div>
                  <p className="text-sm text-muted-foreground">Toggle fullscreen mode</p>
                </div>
                
                <div className="bg-card rounded-lg p-3 border border-border">
                  <div className="font-medium mb-1">&quot;Exit cooking&quot; / &quot;Close cooking&quot; / &quot;Quit cooking&quot;</div>
                  <p className="text-sm text-muted-foreground">Exit the cooking mode</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.2
      }} className="bg-card rounded-2xl p-6 shadow-sm border border-border mb-8">
          <h3 className="font-bold text-lg mb-4">Tips for Better Voice Recognition</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <span className="text-primary font-bold">1</span>
              </div>
              <div>
                <p className="font-medium">Speak clearly and at a moderate pace</p>
                <p className="text-sm text-muted-foreground">Avoid speaking too quickly or mumbling</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <span className="text-primary font-bold">2</span>
              </div>
              <div>
                <p className="font-medium">Reduce background noise</p>
                <p className="text-sm text-muted-foreground">Try to minimize kitchen appliance noise when giving commands</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <span className="text-primary font-bold">3</span>
              </div>
              <div>
                <p className="font-medium">Use the exact command phrases</p>
                <p className="text-sm text-muted-foreground">The system works best when you use the exact phrases listed</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <span className="text-primary font-bold">4</span>
              </div>
              <div>
                <p className="font-medium">Wait for feedback</p>
                <p className="text-sm text-muted-foreground">After giving a command, wait for visual or audio confirmation</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>;
}