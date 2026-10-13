"use client";

import { motion } from 'framer-motion';
import { IngredientEntry } from '@/components/ingredient-entry';
import { BackupRestore } from '@/components/backup-restore';
// import { Footer } from '@/components/footer';
export default function IngredientsPage() {
  return <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-zinc-900 dark:to-amber-950">
      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6
      }} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Ingredients</h1>
          <p className="text-muted-foreground">
            Manage your ingredients and scan new ones with your camera
          </p>
        </motion.div>
        
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.3
      }} className="my-8">
          <IngredientEntry />
        </motion.div>

        <div className="my-8">
          <BackupRestore />
        </div>
      </main>
      
      {/* <Footer /> */}
    </div>;
}