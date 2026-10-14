"use client";

import { motion } from 'framer-motion';
import { ShoppingListView } from '@/components/shopping-list-view';

export default function ShoppingListPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-background dark:to-[#2a1b10]">
      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Shopping List</h1>
          <p className="text-muted-foreground">
            Add what a recipe is missing, tick things off as you buy them, then move them into your pantry.
          </p>
        </motion.div>
        <ShoppingListView />
      </main>
    </div>
  );
}
