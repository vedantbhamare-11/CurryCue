"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, Search, ShoppingCart, User, Coffee, X, MoonStar, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
export function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    theme,
    setTheme
  } = useTheme();
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  return <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border" data-unique-id="1b02d2c1-af4f-493b-b8cc-28439684ee1a" data-file-name="components/nav-bar.tsx">
      <div className="container mx-auto px-4 py-4" data-unique-id="ed686f12-d09e-427c-8de4-ac340acbad2b" data-file-name="components/nav-bar.tsx" data-dynamic-text="true">
        <div className="flex justify-between items-center" data-unique-id="0308ba85-df7d-4d2b-aac4-745a0dd50da4" data-file-name="components/nav-bar.tsx" data-dynamic-text="true">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" data-unique-id="9ba87905-a99b-4783-a59e-2a06c0e0d666" data-file-name="components/nav-bar.tsx">
            <motion.div initial={{
            rotate: 0
          }} animate={{
            rotate: [0, 15, 0, -15, 0]
          }} transition={{
            duration: 0.6,
            delay: 1,
            repeat: 0
          }} data-unique-id="646d97b2-afbf-4f2c-84e3-fea47adfeafe" data-file-name="components/nav-bar.tsx">
            </motion.div>
            <motion.span initial={{
            opacity: 0,
            x: -10
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.4
          }} className="font-heading text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" data-unique-id="cdba0758-e05a-4cca-816c-c3f4da3e20b0" data-file-name="components/nav-bar.tsx"><span className="editable-text" data-unique-id="cc49a246-fe8a-4e1d-9dbe-d51a63e3f00d" data-file-name="components/nav-bar.tsx">
              CurryCue
            </span></motion.span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6" data-unique-id="36fc2f35-bba4-4ab3-800d-37ddb7d63e32" data-file-name="components/nav-bar.tsx">
            <Link href="/" className="font-medium hover:text-primary transition-colors" data-unique-id="63887912-ec23-47df-be14-dec5cb207e1c" data-file-name="components/nav-bar.tsx"><span className="editable-text" data-unique-id="7a8608db-6418-4c2e-a6ca-de13dbbfe890" data-file-name="components/nav-bar.tsx">
              Home
            </span></Link>
            <Link href="/ingredients" className="font-medium hover:text-primary transition-colors" data-unique-id="a4da5c78-3c46-4f76-afb1-888e07ceb21b" data-file-name="components/nav-bar.tsx"><span className="editable-text" data-unique-id="908eca57-643a-4a11-85ca-ee6c08cfbc5d" data-file-name="components/nav-bar.tsx">
              My Ingredients
            </span></Link>
            <Link href="/recipes" className="font-medium hover:text-primary transition-colors" data-unique-id="7ddfd1ee-2b9d-4134-9390-d50a69dd9934" data-file-name="components/nav-bar.tsx"><span className="editable-text" data-unique-id="f9c3eede-99b0-4de1-b250-f37e3468b3f6" data-file-name="components/nav-bar.tsx">
              Recipes
            </span></Link>
          </nav>
          
          {/* Action buttons */}
          <div className="flex items-center gap-3" data-unique-id="5cd0e5ba-0eb1-45de-b83c-b07060db47a3" data-file-name="components/nav-bar.tsx">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-muted transition-colors" aria-label="Toggle theme" data-unique-id="191c119d-e88f-4838-8ac7-de2557e53530" data-file-name="components/nav-bar.tsx" data-dynamic-text="true">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <MoonStar className="w-5 h-5" />}
            </button>
            
            <button className="p-2 rounded-full hover:bg-muted transition-colors md:hidden" onClick={toggleMenu} data-unique-id="e2b2e970-d776-44bf-915b-3b6eed246244" data-file-name="components/nav-bar.tsx" data-dynamic-text="true">
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <div className="hidden md:flex items-center gap-2" data-unique-id="117f608e-2a76-44f3-a53d-026e9ea90b3d" data-file-name="components/nav-bar.tsx">
              
              <Link href="/grocery" className="p-2 rounded-full hover:bg-muted transition-colors relative" data-unique-id="552154c4-b188-47e4-b24c-163c73cb51fd" data-file-name="components/nav-bar.tsx">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center" data-unique-id="4cc73373-e649-48a4-bf38-ab6893d01269" data-file-name="components/nav-bar.tsx"><span className="editable-text" data-unique-id="4c4835c9-d867-449c-a07b-2a9382c5119f" data-file-name="components/nav-bar.tsx">3</span></span>
              </Link>
              <button className="flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-4 py-2 hover:bg-primary/90 transition-colors" data-unique-id="2087d298-3bf5-4c87-bb76-b5b35ae06907" data-file-name="components/nav-bar.tsx">
                <User className="w-4 h-4" />
                <span data-unique-id="8dd99259-2f91-4179-b46c-1a77b0c89b75" data-file-name="components/nav-bar.tsx"><span className="editable-text" data-unique-id="bd2654b6-7747-499e-8187-970e43f25808" data-file-name="components/nav-bar.tsx">Account</span></span>
              </button>
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
      }} className="md:hidden mt-4 bg-card rounded-lg shadow-lg" data-unique-id="d10a7eb1-10f7-49b0-bbdf-7c78db984251" data-file-name="components/nav-bar.tsx">
            <nav className="flex flex-col py-2" data-unique-id="98ce10c6-382f-448e-b482-745769bbb567" data-file-name="components/nav-bar.tsx">
              <Link href="/" className="px-4 py-3 hover:bg-muted rounded-md transition-colors" onClick={() => setIsOpen(false)} data-unique-id="bc8d6be6-0bae-4832-95f8-2871335bae97" data-file-name="components/nav-bar.tsx"><span className="editable-text" data-unique-id="e45c62f6-b2d4-47db-89fe-0e626b779595" data-file-name="components/nav-bar.tsx">
                Home
              </span></Link>
              <Link href="/ingredients" className="px-4 py-3 hover:bg-muted rounded-md transition-colors" onClick={() => setIsOpen(false)} data-unique-id="a1009346-b560-4be1-b099-4e156fb22f20" data-file-name="components/nav-bar.tsx"><span className="editable-text" data-unique-id="a2705be8-13af-4668-938c-3c31d9464c8f" data-file-name="components/nav-bar.tsx">
                My Ingredients
              </span></Link>
              <Link href="/recipes" className="px-4 py-3 hover:bg-muted rounded-md transition-colors" onClick={() => setIsOpen(false)} data-unique-id="7621db2b-171b-428e-8f89-6cc735a527bb" data-file-name="components/nav-bar.tsx"><span className="editable-text" data-unique-id="195c8857-08da-49dd-88a3-4be30545ced9" data-file-name="components/nav-bar.tsx">
                Recipes
              </span></Link>
              <div className="border-t border-border my-2" data-unique-id="1f7303ee-8234-4b44-ba3b-b22d9542f320" data-file-name="components/nav-bar.tsx"></div>
              <div className="px-4 py-3 flex items-center justify-between" data-unique-id="90b4a671-b38f-4471-a277-f39580e259a5" data-file-name="components/nav-bar.tsx">
                <button className="flex items-center gap-2" data-unique-id="ec27beda-64c8-40e0-891a-450de974dd87" data-file-name="components/nav-bar.tsx">
                  <Search className="w-5 h-5" />
                  <span data-unique-id="61de7490-9f23-4daa-967a-a4994a2ef132" data-file-name="components/nav-bar.tsx"><span className="editable-text" data-unique-id="df5f0f9f-5693-442b-afac-a4d0f5a45491" data-file-name="components/nav-bar.tsx">Search</span></span>
                </button>
                <Link href="/grocery" className="flex items-center gap-2" data-unique-id="250ce290-d692-4b8c-a53f-8bc3bbd91b32" data-file-name="components/nav-bar.tsx">
                  <ShoppingCart className="w-5 h-5" />
                  <span data-unique-id="8493fdfc-3732-49ef-8ba8-97e231572db2" data-file-name="components/nav-bar.tsx"><span className="editable-text" data-unique-id="d1f0c4ca-e016-4735-9875-6ebbebf43f65" data-file-name="components/nav-bar.tsx">Grocery List</span></span>
                </Link>
              </div>
              <button className="mx-4 mt-2 mb-2 bg-primary text-primary-foreground rounded-full px-4 py-2 flex items-center justify-center gap-2" data-unique-id="54323f1e-9525-4932-ac17-c6b0e0e46a32" data-file-name="components/nav-bar.tsx">
                <User className="w-4 h-4" />
                <span data-unique-id="22c16a27-199b-4075-b4d5-e1b883fbbd83" data-file-name="components/nav-bar.tsx"><span className="editable-text" data-unique-id="802f8707-fcdf-4783-933f-2a07784f8a41" data-file-name="components/nav-bar.tsx">Account</span></span>
              </button>
            </nav>
          </motion.div>}
      </div>
    </header>;
}