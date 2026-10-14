"use client";

import { motion } from "framer-motion";
import { ChefHat, Clock, RefreshCw } from "lucide-react";
export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden h-screen"
    >
      {/* Gradient background */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background to-secondary/10 dark:from-primary/30 dark:via-background dark:to-secondary/30 -z-10"
      ></div>

      {/* Content */}
      <div
        className=" py-12"
      >
        {/* Text content */}
        <div
          className="flex  justify-center flex-col items-center"
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
            className="flex  flex-col items-center gap-3"
          >
            <h1
              className="text-2xl md:text-5xl lg:text-6xl font-semibold text-center leading-tight lg:mb-4"
            >
              
                Dont Know What to Cook?
              
              <span
                className="text-primary block"
              >
                
                  {" "}
                  Let&apos;s CurryCue!
                
              </span>
            </h1>
            <p
              className="text-xs lg:text-lg mb-8 text-center text-muted-foreground max-w-md"
            >
              
                Let our AI chef help you create amazing recipes with ingredients
                you already have at home.
              
            </p>

            {/* Features */}
            <div
              className="flex flex-col lg:flex-row gap-4 mb-8"
            >
              <motion.div
                className="p-4 bg-accent-foreground  rounded-xl shadow-sm flex items-center gap-3"
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.3,
                }}
              >
                <div
                  className="bg-accent/10 dark:bg-accent/20 p-2 rounded-full"
                >
                  <ChefHat className="text-accent w-5 h-5" />
                </div>
                <span>
                  
                    AI-powered recipe suggestions
                  
                </span>
              </motion.div>

              <motion.div
                className="flex shadow-sm p-4 bg-accent-foreground rounded-xl items-center gap-3"
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.5,
                }}
              >
                <div
                  className="bg-accent/10 dark:bg-accent/20 p-2 rounded-full"
                >
                  <Clock className="text-accent w-5 h-5" />
                </div>
                <span>
                  
                    Quick recipes based on what you have
                  
                </span>
              </motion.div>
              <motion.div
                className="flex shadow-sm p-4 bg-accent-foreground rounded-xl items-center gap-3"
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.5,
                }}
              >
                <div
                  className="bg-accent/10 dark:bg-accent/20 p-2 rounded-full"
                >
                  <RefreshCw className="text-accent w-5 h-5" />
                </div>
                <span>
                  
                    Shopping lists from your recipes
                  
                </span>
              </motion.div>
            </div>

            {/* CTA Button */}
            <motion.button
             onClick={() => {
  const el = document.getElementById("ingredient-entry");
  if (el) {
    const yOffset = -80; // adjust this based on your header height
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
  }
}}

              className="bg-primary text-primary-foreground rounded-full px-8 py-4 text-lg font-medium hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Get Started</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Image section */}
      </div>
    </section>
  );
}
