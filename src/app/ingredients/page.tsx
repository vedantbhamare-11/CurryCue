"use client";

import { motion } from 'framer-motion';
import { IngredientEntry } from '@/components/ingredient-entry';
// import { Footer } from '@/components/footer';
export default function IngredientsPage() {
  return <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-zinc-900 dark:to-amber-950" data-unique-id="636438ff-4caa-462c-8918-7004ebfdd89a" data-file-name="app/ingredients/page.tsx">
      <main className="container mx-auto px-4 py-8" data-unique-id="ab3145cb-09a9-403e-aa3f-4e453306a26d" data-file-name="app/ingredients/page.tsx">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6
      }} className="mb-8" data-unique-id="4a73a916-b40b-4a4f-8f25-1ce18acca82c" data-file-name="app/ingredients/page.tsx">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" data-unique-id="34c32b9a-a25f-4e41-89c5-0344b06cb2ce" data-file-name="app/ingredients/page.tsx"><span className="editable-text" data-unique-id="7ea67d48-77cc-4d52-b8f2-815f6fe8c6fb" data-file-name="app/ingredients/page.tsx">My Ingredients</span></h1>
          <p className="text-muted-foreground" data-unique-id="335bfdec-3c94-45c2-9e9f-abaa44e4bba3" data-file-name="app/ingredients/page.tsx"><span className="editable-text" data-unique-id="db978cc8-148b-4981-b63b-f63190ca9e92" data-file-name="app/ingredients/page.tsx">
            Manage your ingredients and scan new ones with your camera
          </span></p>
        </motion.div>
        
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.3
      }} className="my-8" data-unique-id="2aa53a21-5ec9-4718-bd87-66fc3368636b" data-file-name="app/ingredients/page.tsx">
          <IngredientEntry />
        </motion.div>
      </main>
      
      {/* <Footer /> */}
    </div>;
}