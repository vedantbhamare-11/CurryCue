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
  return <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-zinc-900 dark:to-amber-950">
      <main className="container mx-auto px-4 py-8">
        <HeroSection />
        
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.3
      }} className="my-16">
          <IngredientEntry />
        </motion.div>
        
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.6
      }} className="my-16">
          <RecipeSection />
        </motion.div>
      </main>
      
    </div>;
}