"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ChefHat, Utensils, Clock, RefreshCw } from "lucide-react";
export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden"
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
        className="grid grid-cols-1 md:grid-cols-2 gap-8 py-12"
        data-unique-id="de83f1d5-414f-440f-a8f6-680797fc04cc"
        data-file-name="components/hero-section.tsx"
        data-dynamic-text="true"
      >
        {/* Text content */}
        <div
          className="flex flex-col justify-center"
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
          >
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4"
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
              className="text-lg mb-8 text-muted-foreground max-w-md"
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
              className="flex flex-col gap-4 mb-8"
              data-unique-id="4ab40bd7-c987-4267-ac7b-718f8b30db34"
              data-file-name="components/hero-section.tsx"
            >
              <motion.div
                className="flex items-center gap-3"
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
                className="flex items-center gap-3"
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
                className="flex items-center gap-3"
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
              className="bg-primary text-primary-foreground rounded-full px-8 py-4 text-lg font-medium hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20"
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              data-unique-id="a495bd62-2e16-437a-a92a-a29841033f29"
              data-file-name="components/hero-section.tsx"
            >
              <span
                className="editable-text"
                data-unique-id="5c8a6456-52e7-4faa-a8fc-ad48dade7a41"
                data-file-name="components/hero-section.tsx"
              >
                Get Started
              </span>
            </motion.button>
          </motion.div>
        </div>

        {/* Image section */}
        <motion.div
          className="relative h-[400px] md:h-[500px]"
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.6,
            delay: 0.3,
          }}
          data-unique-id="7694def4-6b94-4adc-9c00-290ca4b92a62"
          data-file-name="components/hero-section.tsx"
        >
          <div
            className="absolute right-0 top-0 w-full h-full overflow-hidden rounded-3xl"
            data-unique-id="e76fa1f9-719e-4c12-9b66-a5be687b3cfe"
            data-file-name="components/hero-section.tsx"
          >
            <div
              className="relative w-full h-full"
              data-unique-id="9193eeff-0c7b-4764-b86b-68f8f594b526"
              data-file-name="components/hero-section.tsx"
              data-dynamic-text="true"
            >
              <Image
                src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8"
                alt="Delicious food with vegetables and herbs"
                fill
                priority
                className="object-cover rounded-3xl"
                sizes="(max-width: 768px) 100vw, 50vw"
                data-unique-id="cec7e7a7-b7ba-44c8-a9bf-563892c8db15"
                data-file-name="components/hero-section.tsx"
              />
              <div
                className="absolute inset-0 rounded-3xl bg-gradient-to-t from-background/80 via-transparent to-transparent"
                data-unique-id="0465971d-fbb4-4302-ba8e-20e957c86695"
                data-file-name="components/hero-section.tsx"
              ></div>

              {/* Floating ingredient cards */}
              <motion.div
                className="absolute -bottom-2 -left-2 bg-card p-3 rounded-xl shadow-lg"
                initial={{
                  y: 20,
                  opacity: 0,
                }}
                animate={{
                  y: 0,
                  opacity: 1,
                }}
                transition={{
                  delay: 0.8,
                }}
                data-unique-id="7c6bf4fa-78c2-415c-9357-09233acdb760"
                data-file-name="components/hero-section.tsx"
              >
                <h3
                  className="font-medium text-sm mb-2"
                  data-unique-id="23c16be3-5643-47d4-ae5f-92fbff690eb5"
                  data-file-name="components/hero-section.tsx"
                >
                  <span
                    className="editable-text"
                    data-unique-id="a010f1e1-41c9-4193-b28d-832cd5292309"
                    data-file-name="components/hero-section.tsx"
                  >
                    Fresh Ingredients
                  </span>
                </h3>
                <div
                  className="flex gap-1"
                  data-unique-id="27b4f662-61c6-4fdb-bec3-5a4ea3e9afd9"
                  data-file-name="components/hero-section.tsx"
                >
                  <span
                    className="ingredient-tag"
                    data-unique-id="44c1a9c1-5c78-4c2b-bfaf-00de62a25028"
                    data-file-name="components/hero-section.tsx"
                  >
                    <span
                      className="editable-text"
                      data-unique-id="13ca2072-093a-4aad-83dc-7d890745e7bd"
                      data-file-name="components/hero-section.tsx"
                    >
                      Tomato
                    </span>
                  </span>
                  <span
                    className="ingredient-tag"
                    data-unique-id="a7390c70-9f0f-4218-bed9-3c16edefed30"
                    data-file-name="components/hero-section.tsx"
                  >
                    <span
                      className="editable-text"
                      data-unique-id="1b4e0e5a-d57a-4eff-9a66-c297b2ca044e"
                      data-file-name="components/hero-section.tsx"
                    >
                      Basil
                    </span>
                  </span>
                  <span
                    className="ingredient-tag"
                    data-unique-id="c9e98e55-b95c-48a0-ad41-90214abf14b4"
                    data-file-name="components/hero-section.tsx"
                  >
                    <span
                      className="editable-text"
                      data-unique-id="d9bb6b52-8a8e-471f-a925-e6a403d9f483"
                      data-file-name="components/hero-section.tsx"
                    >
                      +3
                    </span>
                  </span>
                </div>
              </motion.div>

              <motion.div
                className="absolute top-10 right-10 bg-card p-3 rounded-xl shadow-lg"
                initial={{
                  y: -20,
                  opacity: 0,
                }}
                animate={{
                  y: 0,
                  opacity: 1,
                }}
                transition={{
                  delay: 0.9,
                }}
                data-unique-id="5a8c7665-65ae-42ec-82ff-5b6dba94bcf3"
                data-file-name="components/hero-section.tsx"
              >
                <div
                  className="flex items-center gap-2"
                  data-unique-id="b1cf21e8-f440-4998-8780-d75e82ba3688"
                  data-file-name="components/hero-section.tsx"
                >
                  <Clock className="w-4 h-4 text-primary" />
                  <span
                    className="text-sm"
                    data-unique-id="31ecd1f8-8098-441a-bee3-1284e8a74130"
                    data-file-name="components/hero-section.tsx"
                  >
                    <span
                      className="editable-text"
                      data-unique-id="5ed6e2f2-63fd-4462-b189-ec35aeb1e594"
                      data-file-name="components/hero-section.tsx"
                    >
                      Ready in 25 min
                    </span>
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
