"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Award, ChefHat } from 'lucide-react';
import { cn } from '@/lib/utils';
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
    }} className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={onClose} data-unique-id="a655a939-b921-467c-b1e6-88e1472cdbe2" data-file-name="components/completion-celebration.tsx" data-dynamic-text="true">
          {/* Confetti Animation */}
          {showConfetti && <div className="absolute inset-0 pointer-events-none overflow-hidden" data-unique-id="f6a27ae2-ea81-4c87-8ff2-fb4062e1e1ec" data-file-name="components/completion-celebration.tsx" data-dynamic-text="true">
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
        }} data-unique-id="6255cea5-8891-414d-b3aa-6318d9a63f5a" data-file-name="components/completion-celebration.tsx" />)}
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
      }} className="bg-card rounded-2xl p-8 max-w-md w-full mx-4 relative overflow-hidden" onClick={e => e.stopPropagation()} data-unique-id="b1d8cdec-9d3c-426e-b89d-d6752c982a3a" data-file-name="components/completion-celebration.tsx" data-dynamic-text="true">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" data-unique-id="63da6470-aab2-436e-8be5-7329ae375ec6" data-file-name="components/completion-celebration.tsx" />
            
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-10" data-unique-id="379566bf-816a-406e-80ee-53892188c176" data-file-name="components/completion-celebration.tsx">
              <X className="w-5 h-5" />
            </button>

            <div className="relative text-center" data-unique-id="fdffeddf-91b3-40c5-b328-9d8f323c7407" data-file-name="components/completion-celebration.tsx" data-dynamic-text="true">
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
          }} className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center" data-unique-id="d76ebdb3-d278-49b2-bae3-357f6f2fc91c" data-file-name="components/completion-celebration.tsx">
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
          }} data-unique-id="c3086405-9f39-456f-a775-54362ec787ad" data-file-name="components/completion-celebration.tsx">
                <h2 className="text-3xl font-bold text-primary mb-2" data-unique-id="85ec45bc-a259-4cdd-bde6-d86c21869ac1" data-file-name="components/completion-celebration.tsx"><span className="editable-text" data-unique-id="1b25e047-cb56-4b34-b729-37dc7fb2b764" data-file-name="components/completion-celebration.tsx">🎉 Congratulations!</span></h2>
                <p className="text-lg mb-4" data-unique-id="61eaf868-2eda-4186-b94e-a31e5d911b4c" data-file-name="components/completion-celebration.tsx"><span className="editable-text" data-unique-id="8dd9234a-2a1a-491a-a4c7-d1ff5f35f995" data-file-name="components/completion-celebration.tsx">
                  You've completed </span><span className="font-semibold text-primary" data-unique-id="478a2bf8-d656-4b86-b22f-8c650390eb73" data-file-name="components/completion-celebration.tsx" data-dynamic-text="true">{recipeName}</span>
                </p>
                <p className="text-muted-foreground mb-6" data-unique-id="2b60f0bd-20fa-4d54-ab36-570c3a1d19f6" data-file-name="components/completion-celebration.tsx"><span className="editable-text" data-unique-id="c1dd53f5-8bf8-4a72-9b0f-3eb77909b1ce" data-file-name="components/completion-celebration.tsx">It looks absolutely delicious!</span></p>
              </motion.div>

              {/* Cooked Dish Image */}
              <motion.div initial={{
            opacity: 0,
            scale: 0.8
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            delay: 0.6
          }} className="mb-6" data-unique-id="81e9b9b7-3ab2-41dc-85fb-2745dde4a242" data-file-name="components/completion-celebration.tsx">
                <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-primary/20 shadow-lg" data-unique-id="6927ae6e-a6e3-42c2-87dc-b7ccd194b5d1" data-file-name="components/completion-celebration.tsx">
                  <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop&crop=center" alt="Delicious cooked dish" className="w-full h-full object-cover" data-unique-id="7ab7f986-41ae-48c3-bc57-e2c5aad28682" data-file-name="components/completion-celebration.tsx" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" data-unique-id="7cdcf407-dc98-4a4a-93d1-2a8dba482039" data-file-name="components/completion-celebration.tsx" />
                </div>
              </motion.div>

              {/* Stars Animation */}
              <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            delay: 0.8
          }} className="flex justify-center gap-1 mb-6" data-unique-id="36c607df-800b-4efc-bbe6-a67b889956c6" data-file-name="components/completion-celebration.tsx" data-dynamic-text="true">
                {Array.from({
              length: 5
            }).map((_, i) => <motion.div key={i} initial={{
              scale: 0,
              rotate: -180
            }} animate={{
              scale: 1,
              rotate: 0
            }} transition={{
              delay: 0.8 + i * 0.1,
              type: 'spring'
            }} data-unique-id="3d62b05d-e9d8-43f3-ab28-f6b99f89116b" data-file-name="components/completion-celebration.tsx">
                    <Star className="w-6 h-6 text-accent fill-accent" data-unique-id="50ec9262-f004-40bb-91ea-43635e15b707" data-file-name="components/completion-celebration.tsx" data-dynamic-text="true" />
                  </motion.div>)}
              </motion.div>

              {/* Achievement Badge */}
              <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 1
          }} className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-2 rounded-full border border-primary/20" data-unique-id="b9d94d0d-9669-4457-8317-657c0d8c133d" data-file-name="components/completion-celebration.tsx">
                <Award className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary" data-unique-id="f501187d-85e1-4e70-bdd6-0c64e803ee39" data-file-name="components/completion-celebration.tsx"><span className="editable-text" data-unique-id="919081de-0bce-4482-86ce-6e3ab7e90682" data-file-name="components/completion-celebration.tsx">Recipe Master</span></span>
              </motion.div>

              {/* Close Button */}
              <motion.button initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            delay: 1.2
          }} onClick={onClose} className="mt-6 w-full bg-primary text-primary-foreground rounded-lg py-3 font-medium hover:bg-primary/90 transition-colors" data-unique-id="234a8d97-4edf-481d-9a75-b265d2f59b9a" data-file-name="components/completion-celebration.tsx"><span className="editable-text" data-unique-id="4ad1537b-4bde-477f-84d5-f461f28de743" data-file-name="components/completion-celebration.tsx">
                Continue Cooking! 👨‍🍳
              </span></motion.button>
            </div>
          </motion.div>
        </motion.div>}
    </AnimatePresence>;
}