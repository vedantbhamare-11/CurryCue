"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HeroSection } from '@/components/hero-section';
import { IngredientEntry } from '@/components/ingredient-entry';
import { RecipeSection } from '@/components/recipe-section';
export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-zinc-900 dark:to-amber-950" data-unique-id="cc8b9659-d4e3-4ae9-aeb0-237c47682e81" data-file-name="app/page.tsx">
      <main className="container mx-auto px-4 py-8" data-unique-id="02e5701c-8d59-43fc-928f-9f286836ada6" data-file-name="app/page.tsx">
        <HeroSection />
        
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.3
      }} className="my-16" data-unique-id="3f233247-1213-4fe3-a252-b291a7d6a1fe" data-file-name="app/page.tsx">
          <IngredientEntry />
        </motion.div>
        
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.6
      }} className="my-16" data-unique-id="5ce3b6e9-4ac6-4af1-9a24-6200ba05d6d1" data-file-name="app/page.tsx">
          <RecipeSection />
        </motion.div>
      </main>
      
    </div>;
}