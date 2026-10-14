"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChefHat } from 'lucide-react';
interface CompletionCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  recipeName: string;
}
export function CompletionCelebration({
  isOpen,
  onClose,
  recipeName
}: CompletionCelebrationProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);      
    }
  }, [isOpen, onClose]);

  // Generate confetti particles
  const confettiPieces = Array.from({
    length: 50
  }, (_, i) => ({
    id: i,
    color: ['#E67E22', '#F39C12', '#2ECC71', '#E74C3C', '#3498DB'][i % 5],
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
    rotation: Math.random() * 360,
    x: Math.random() * 100
  }));
  return <AnimatePresence>
      {isOpen && <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }} className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={onClose}>
          {/* Confetti Animation */}
          {showConfetti && <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {confettiPieces.map(piece => <motion.div key={piece.id} initial={{
          y: -50,
          x: `${piece.x}vw`,
          rotate: 0,
          opacity: 1
        }} animate={{
          y: '100vh',
          rotate: piece.rotation,
          opacity: 0
        }} transition={{
          duration: piece.duration,
          delay: piece.delay,
          ease: 'easeOut'
        }} className="absolute w-3 h-3 rounded-full" style={{
          backgroundColor: piece.color
        }} />)}
            </div>}

          {/* Celebration Modal */}
          <motion.div initial={{
        scale: 0.8,
        opacity: 0,
        y: 20
      }} animate={{
        scale: 1,
        opacity: 1,
        y: 0
      }} exit={{
        scale: 0.8,
        opacity: 0,
        y: 20
      }} transition={{
        type: 'spring',
        damping: 20,
        stiffness: 300
      }} className="bg-card rounded-2xl p-8 max-w-md w-full mx-4 relative overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
            
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-10">
              <X className="w-5 h-5" />
            </button>

            <div className="relative text-center">
              {/* Success Icon */}
              <motion.div initial={{
            scale: 0,
            rotate: -180
          }} animate={{
            scale: 1,
            rotate: 0
          }} transition={{
            delay: 0.2,
            type: 'spring',
            damping: 15
          }} className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <ChefHat className="w-10 h-10 text-white" />
              </motion.div>

              {/* Celebration Text */}
              <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.4
          }}>
                <h2 className="text-3xl font-bold text-primary mb-2">🎉 Congratulations!</h2>
                <p className="text-lg">
                  You&apos;ve completed <span className="font-semibold text-primary">{recipeName}</span>
                </p>
              </motion.div>

              {/* Close Button */}
              <motion.button initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            delay: 0.8
          }} onClick={onClose} className="mt-6 w-full bg-primary text-primary-foreground rounded-lg py-3 font-medium hover:bg-primary/90 transition-colors">
                Done
              </motion.button>
            </div>
          </motion.div>
        </motion.div>}
    </AnimatePresence>;
}