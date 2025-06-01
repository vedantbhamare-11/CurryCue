"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ChefHat, Utensils, Clock, RefreshCw } from "lucide-react";
export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden h-screen"
      data-unique-id="c16178f2-fc77-4086-8d2d-0643543c9fcf"
      data-file-name="components/hero-section.tsx"
      data-dynamic-text="true"
    >
      {/* Gradient background */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background to-secondary/10 dark:from-primary/30 dark:via-background dark:to-secondary/30 -z-10"
        data-unique-id="07b679d2-cfbd-4261-82a8-522bceffde86"
        data-file-name="components/hero-section.tsx"
      ></div>

      {/* Content */}
      <div
        className=" py-12"
        data-unique-id="de83f1d5-414f-440f-a8f6-680797fc04cc"
        data-file-name="components/hero-section.tsx"
        data-dynamic-text="true"
      >
        {/* Text content */}
        <div
          className="flex  justify-center flex-col items-center"
          data-unique-id="76a65134-cff1-4a58-a073-0c6c84e95efa"
          data-file-name="components/hero-section.tsx"
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
            data-unique-id="3d0f4b5a-4cc7-4fd8-b708-8d5726fec028"
            data-file-name="components/hero-section.tsx"
            data-dynamic-text="true"
            className="flex  flex-col items-center gap-3"
          >
            <h1
              className="text-2xl md:text-5xl lg:text-6xl font-semibold text-center leading-tight lg:mb-4"
              data-unique-id="e386d944-bf12-4af9-9511-18a6a174b047"
              data-file-name="components/hero-section.tsx"
            >
              <span
                className="editable-text"
                data-unique-id="2b3e90c4-2bba-4c2a-8ab7-2319e1a224bb"
                data-file-name="components/hero-section.tsx"
              >
                Dont Know What to Cook?
              </span>
              <span
                className="text-primary block"
                data-unique-id="5a682b33-b052-40d1-b59d-362e1cffa1b5"
                data-file-name="components/hero-section.tsx"
              >
                <span
                  className="editable-text"
                  data-unique-id="a5b79888-afea-417d-ba52-b1411c12790c"
                  data-file-name="components/hero-section.tsx"
                >
                  {" "}
                  Let's CurryCue!
                </span>
              </span>
            </h1>
            <p
              className="text-xs lg:text-lg mb-8 text-center text-muted-foreground max-w-md"
              data-unique-id="bd7c054c-f55e-426f-971e-a0a6b4f90996"
              data-file-name="components/hero-section.tsx"
            >
              <span
                className="editable-text"
                data-unique-id="1bf89549-dd5d-48b8-8e00-d37e1caa9b8f"
                data-file-name="components/hero-section.tsx"
              >
                Let our AI chef help you create amazing recipes with ingredients
                you already have at home.
              </span>
            </p>

            {/* Features */}
            <div
              className="flex flex-col lg:flex-row gap-4 mb-8"
              data-unique-id="4ab40bd7-c987-4267-ac7b-718f8b30db34"
              data-file-name="components/hero-section.tsx"
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
                data-unique-id="219ac2f1-f4e9-4b44-9411-557a7b9dd464"
                data-file-name="components/hero-section.tsx"
              >
                <div
                  className="bg-primary/10 dark:bg-primary/20 p-2 rounded-full"
                  data-unique-id="efba9f56-10e4-408b-964b-3b0df549abfa"
                  data-file-name="components/hero-section.tsx"
                >
                  <ChefHat className="text-primary w-5 h-5" />
                </div>
                <span
                  data-unique-id="d44b262b-d5e8-41d4-9dfc-0fb0e08fe8d8"
                  data-file-name="components/hero-section.tsx"
                >
                  <span
                    className="editable-text"
                    data-unique-id="04141c28-5cba-4952-810f-7fa357f63988"
                    data-file-name="components/hero-section.tsx"
                  >
                    AI-powered recipe suggestions
                  </span>
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
                data-unique-id="898984e0-01de-46bd-832c-4d800f321c47"
                data-file-name="components/hero-section.tsx"
              >
                <div
                  className="bg-accent/10 dark:bg-accent/20 p-2 rounded-full"
                  data-unique-id="934f336a-92d9-4a36-8a0a-da70032de0e4"
                  data-file-name="components/hero-section.tsx"
                >
                  <Clock className="text-accent w-5 h-5" />
                </div>
                <span
                  data-unique-id="f14e34d5-a2bb-4ada-ab67-1ad6e46b9344"
                  data-file-name="components/hero-section.tsx"
                >
                  <span
                    className="editable-text"
                    data-unique-id="8834e9d3-5f42-4405-a3d2-fc7f49d9a05e"
                    data-file-name="components/hero-section.tsx"
                  >
                    Quick recipes based on what you have
                  </span>
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
                data-unique-id="898984e0-01de-46bd-832c-4d800f321c47"
                data-file-name="components/hero-section.tsx"
              >
                <div
                  className="bg-accent/10 dark:bg-accent/20 p-2 rounded-full"
                  data-unique-id="934f336a-92d9-4a36-8a0a-da70032de0e4"
                  data-file-name="components/hero-section.tsx"
                >
                  <RefreshCw className="text-accent w-5 h-5" />
                </div>
                <span
                  data-unique-id="f14e34d5-a2bb-4ada-ab67-1ad6e46b9344"
                  data-file-name="components/hero-section.tsx"
                >
                  <span
                    className="editable-text"
                    data-unique-id="8834e9d3-5f42-4405-a3d2-fc7f49d9a05e"
                    data-file-name="components/hero-section.tsx"
                  >
                    Sync ingredients from your grocery apps
                  </span>
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
