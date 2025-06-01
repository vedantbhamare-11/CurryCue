"use client";

import { motion } from "framer-motion";
import { GrocerySync } from "@/components/grocery-sync";
// import { Footer } from '@/components/footer';
export default function GroceryPage() {
  return (
    <div
      className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-zinc-900 dark:to-amber-950"
      data-unique-id="77d03e09-c579-4a6b-a15c-4fecc879fe44"
      data-file-name="app/grocery/page.tsx"
    >
      <main
        className="container mx-auto px-4 py-8"
        data-unique-id="ecffe52b-404e-40d4-87b7-fe5e2228670e"
        data-file-name="app/grocery/page.tsx"
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="mb-8"
          data-unique-id="a3767a78-7956-430a-9058-4487a01ef2a3"
          data-file-name="app/grocery/page.tsx"
        >
          <h1
            className="text-3xl md:text-4xl font-bold mb-2"
            data-unique-id="a45339f8-c468-4f44-be68-f5d411bb46ea"
            data-file-name="app/grocery/page.tsx"
          >
            <span
              className="editable-text"
              data-unique-id="f05d1737-8c59-4fa5-8e56-0ff62167a9f0"
              data-file-name="app/grocery/page.tsx"
            >
              Grocery Bag
            </span>
          </h1>
          <p
            className="text-muted-foreground"
            data-unique-id="9d0933e7-e566-486e-8dbf-59a6e7d24531"
            data-file-name="app/grocery/page.tsx"
          >
            <span
              className="editable-text"
              data-unique-id="7529a297-516d-4008-b040-9b2d5bb4fc8f"
              data-file-name="app/grocery/page.tsx"
            >
              Sync your Shopping Cart with your Kitchten Ingedients
            </span>
          </p>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.3,
          }}
          className="my-8"
          data-unique-id="da032d5b-0caa-4d84-ac33-a5b513a15e84"
          data-file-name="app/grocery/page.tsx"
        >
          <GrocerySync />
        </motion.div>
      </main>

      {/* <Footer /> */}
    </div>
  );
}
