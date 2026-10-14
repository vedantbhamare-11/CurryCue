"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { useShoppingListStore } from '@/store/shopping-list-store';
export function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const toBuyCount = useShoppingListStore((state) => state.items.filter((item) => !item.checked).length);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <motion.div initial={{
            rotate: 0
          }} animate={{
            rotate: [0, 15, 0, -15, 0]
          }} transition={{
            duration: 0.6,
            delay: 1,
            repeat: 0
          }}>
            </motion.div>
            <motion.span initial={{
            opacity: 0,
            x: -10
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.4
          }} className="font-heading text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              CurryCue
            </motion.span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/ingredients" className="font-medium hover:text-primary transition-colors">
              My Ingredients
            </Link>
            <Link href="/recipes" className="font-medium hover:text-primary transition-colors">
              Recipes
            </Link>
          </nav>
          
          {/* Action buttons */}
          <div className="flex items-center gap-3">
            
            <button className="p-2 rounded-full hover:bg-muted transition-colors md:hidden" onClick={toggleMenu}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <div className="hidden md:flex items-center gap-2">
              
              <Link href="/shopping-list" className="p-2 rounded-full hover:bg-muted transition-colors relative" aria-label={toBuyCount > 0 ? `Shopping list, ${toBuyCount} to buy` : "Shopping list"}>
                <ShoppingBag className="w-5 h-5" />
                {toBuyCount > 0 && <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full min-w-4 h-4 px-1 flex items-center justify-center">{toBuyCount > 9 ? '9+' : toBuyCount}</span>}
              </Link>
              
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isOpen && <motion.div initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: 'auto'
      }} exit={{
        opacity: 0,
        height: 0
      }} className="md:hidden mt-4 bg-card rounded-lg shadow-lg">
            <nav className="flex flex-col py-2">
              <Link href="/" className="px-4 py-3 hover:bg-muted rounded-md transition-colors" onClick={() => setIsOpen(false)}>
                Home
              </Link>
              <Link href="/ingredients" className="px-4 py-3 hover:bg-muted rounded-md transition-colors" onClick={() => setIsOpen(false)}>
                My Ingredients
              </Link>
              <Link href="/recipes" className="px-4 py-3 hover:bg-muted rounded-md transition-colors" onClick={() => setIsOpen(false)}>
                Recipes
              </Link>
              <div className="px-4 py-3 flex items-center justify-between">
                <Link href="/shopping-list" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  <span>Shopping List</span>
                </Link>
              </div>
            </nav>
          </motion.div>}
      </div>
    </header>;
}