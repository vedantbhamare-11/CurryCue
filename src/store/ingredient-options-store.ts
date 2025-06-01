// store/ingredient-options-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IngredientSuggestion {
  name: string;
  suggestions: {
    quantity: string;
    unit: string;
    displayText: string;
  }[];
}

interface IngredientOptionsState {
  ingredientOptions: IngredientSuggestion[];
  setIngredientOptions: (options: IngredientSuggestion[]) => void;
  addIngredient: (ingredient: IngredientSuggestion) => void;
}

export const useIngredientOptionsStore = create<IngredientOptionsState>()(
  persist(
    (set, get) => ({
      ingredientOptions: [
        {
          name: "Tomato",
          suggestions: [
            { quantity: "250", unit: "gm", displayText: "Tomato (250 gm)" },
            { quantity: "2", unit: "nos", displayText: "Tomato (2 nos)" },
          ],
        },
        {
          name: "Rice",
          suggestions: [
            { quantity: "1", unit: "cup", displayText: "Rice (1 cup)" },
            { quantity: "500", unit: "gm", displayText: "Rice (500 gm)" },
          ],
        },
        {
          name: "Green Chilli",
          suggestions: [
            { quantity: "2", unit: "nos", displayText: "Green Chilli (2 nos)" },
          ],
        },
        {
          name: "Ginger",
          suggestions: [
            {
              quantity: "1",
              unit: "inch",
              displayText: "Ginger (1 inch piece)",
            },
          ],
        },

        {
          name: "Maggi Noodles",
          suggestions: [
            {
              quantity: "1",
              unit: "packet",
              displayText: "Maggi Noodles (1 packet)",
            },
            {
              quantity: "2",
              unit: "packets",
              displayText: "Maggi Noodles (2 packets)",
            },
          ],
        },
        {
          name: "Basmati Rice",
          suggestions: [
            { quantity: "1", unit: "kg", displayText: "Basmati Rice (1 kg)" },
            { quantity: "5", unit: "kg", displayText: "Basmati Rice (5 kg)" },
          ],
        },
        {
          name: "Atta (Wheat Flour)",
          suggestions: [
            { quantity: "1", unit: "kg", displayText: "Atta (1 kg)" },
            { quantity: "5", unit: "kg", displayText: "Atta (5 kg)" },
          ],
        },
        {
          name: "Maida",
          suggestions: [
            { quantity: "500", unit: "gm", displayText: "Maida (500 gm)" },
            { quantity: "1", unit: "kg", displayText: "Maida (1 kg)" },
          ],
        },
        {
          name: "Sooji (Rava)",
          suggestions: [
            { quantity: "500", unit: "gm", displayText: "Sooji (500 gm)" },
            { quantity: "1", unit: "kg", displayText: "Sooji (1 kg)" },
          ],
        },
        {
          name: "Ghee",
          suggestions: [
            { quantity: "200", unit: "ml", displayText: "Ghee (200 ml)" },
            { quantity: "500", unit: "ml", displayText: "Ghee (500 ml)" },
          ],
        },
        {
          name: "Butter (Amul)",
          suggestions: [
            {
              quantity: "100",
              unit: "gm",
              displayText: "Amul Butter (100 gm)",
            },
            {
              quantity: "500",
              unit: "gm",
              displayText: "Amul Butter (500 gm)",
            },
          ],
        },
        {
          name: "Paneer (Store-Bought)",
          suggestions: [
            { quantity: "200", unit: "gm", displayText: "Paneer (200 gm)" },
            { quantity: "500", unit: "gm", displayText: "Paneer (500 gm)" },
          ],
        },
        {
          name: "Bread (White/Brown)",
          suggestions: [
            { quantity: "1", unit: "pack", displayText: "Bread (1 pack)" },
          ],
        },
        {
          name: "Milk Packet",
          suggestions: [
            {
              quantity: "500",
              unit: "ml",
              displayText: "Milk Packet (500 ml)",
            },
            {
              quantity: "1",
              unit: "litre",
              displayText: "Milk Packet (1 litre)",
            },
          ],
        },
        {
          name: "Dosa Batter",
          suggestions: [
            { quantity: "1", unit: "kg", displayText: "Dosa Batter (1 kg)" },
          ],
        },
        {
          name: "Poha (Flattened Rice)",
          suggestions: [
            { quantity: "500", unit: "gm", displayText: "Poha (500 gm)" },
          ],
        },
        {
          name: "Sabudana (Sago)",
          suggestions: [
            { quantity: "250", unit: "gm", displayText: "Sabudana (250 gm)" },
            { quantity: "500", unit: "gm", displayText: "Sabudana (500 gm)" },
          ],
        },
        {
          name: "Pickle (Achar)",
          suggestions: [
            {
              quantity: "250",
              unit: "gm",
              displayText: "Mango Pickle (250 gm)",
            },
            {
              quantity: "500",
              unit: "gm",
              displayText: "Mixed Pickle (500 gm)",
            },
          ],
        },
        {
          name: "Tea Powder (Tata/Red Label)",
          suggestions: [
            { quantity: "250", unit: "gm", displayText: "Tea Powder (250 gm)" },
            { quantity: "500", unit: "gm", displayText: "Tea Powder (500 gm)" },
          ],
        },
        {
          name: "Instant Coffee (Bru/Nescafe)",
          suggestions: [
            {
              quantity: "50",
              unit: "gm",
              displayText: "Coffee Powder (50 gm)",
            },
            {
              quantity: "100",
              unit: "gm",
              displayText: "Coffee Powder (100 gm)",
            },
          ],
        },
        {
          name: "Sugar",
          suggestions: [
            { quantity: "1", unit: "kg", displayText: "Sugar (1 kg)" },
          ],
        },
        {
          name: "Salt Packet",
          suggestions: [
            { quantity: "1", unit: "kg", displayText: "Salt (1 kg)" },
          ],
        },
        {
          name: "Chutney Powder (Dry)",
          suggestions: [
            {
              quantity: "100",
              unit: "gm",
              displayText: "Chutney Powder (100 gm)",
            },
          ],
        },
        {
          name: "Rasam Powder / Sambar Powder",
          suggestions: [
            {
              quantity: "100",
              unit: "gm",
              displayText: "Rasam Powder (100 gm)",
            },
            {
              quantity: "100",
              unit: "gm",
              displayText: "Sambar Powder (100 gm)",
            },
          ],
        },
        {
          name: "Toor Dal (Arhar Dal)",
          suggestions: [
            { quantity: "250", unit: "gm", displayText: "Toor Dal (250 gm)" },
            { quantity: "1", unit: "kg", displayText: "Toor Dal (1 kg)" },
          ],
        },
        {
          name: "Moong Dal (Split Yellow)",
          suggestions: [
            { quantity: "250", unit: "gm", displayText: "Moong Dal (250 gm)" },
            { quantity: "1", unit: "kg", displayText: "Moong Dal (1 kg)" },
          ],
        },
        {
          name: "Masoor Dal (Red Lentils)",
          suggestions: [
            { quantity: "250", unit: "gm", displayText: "Masoor Dal (250 gm)" },
            { quantity: "1", unit: "kg", displayText: "Masoor Dal (1 kg)" },
          ],
        },
        {
          name: "Chana Dal",
          suggestions: [
            { quantity: "250", unit: "gm", displayText: "Chana Dal (250 gm)" },
            { quantity: "1", unit: "kg", displayText: "Chana Dal (1 kg)" },
          ],
        },
        {
          name: "Rajma (Kidney Beans)",
          suggestions: [
            { quantity: "250", unit: "gm", displayText: "Rajma (250 gm)" },
            { quantity: "500", unit: "gm", displayText: "Rajma (500 gm)" },
          ],
        },

        {
          name: "Coriander Leaves",
          suggestions: [
            {
              quantity: "1",
              unit: "bunch",
              displayText: "Coriander Leaves (1 bunch)",
            },
            {
              quantity: "100",
              unit: "gm",
              displayText: "Coriander Leaves (100 gm)",
            },
          ],
        },
        {
          name: "Curry Leaves",
          suggestions: [
            {
              quantity: "1",
              unit: "sprig",
              displayText: "Curry Leaves (1 sprig)",
            },
            {
              quantity: "50",
              unit: "gm",
              displayText: "Curry Leaves (50 gm)",
            },
          ],
        },
        {
          name: "Cauliflower",
          suggestions: [
            {
              quantity: "1",
              unit: "head",
              displayText: "Cauliflower (1 head)",
            },
            {
              quantity: "500",
              unit: "gm",
              displayText: "Cauliflower (500 gm)",
            },
          ],
        },
        {
          name: "Cabbage",
          suggestions: [
            {
              quantity: "1",
              unit: "nos",
              displayText: "Cabbage (1 nos)",
            },
            {
              quantity: "500",
              unit: "gm",
              displayText: "Cabbage (500 gm)",
            },
          ],
        },
        {
          name: "Beans",
          suggestions: [
            {
              quantity: "250",
              unit: "gm",
              displayText: "Beans (250 gm)",
            },
            {
              quantity: "500",
              unit: "gm",
              displayText: "Beans (500 gm)",
            },
          ],
        },
        {
          name: "Beetroot",
          suggestions: [
            {
              quantity: "2",
              unit: "nos",
              displayText: "Beetroot (2 nos)",
            },
            {
              quantity: "500",
              unit: "gm",
              displayText: "Beetroot (500 gm)",
            },
          ],
        },
        {
          name: "Brinjal (Eggplant)",
          suggestions: [
            {
              quantity: "3",
              unit: "nos",
              displayText: "Brinjal (3 nos)",
            },
            {
              quantity: "500",
              unit: "gm",
              displayText: "Brinjal (500 gm)",
            },
          ],
        },
        {
          name: "Drumstick",
          suggestions: [
            {
              quantity: "2",
              unit: "nos",
              displayText: "Drumstick (2 nos)",
            },
            {
              quantity: "4",
              unit: "nos",
              displayText: "Drumstick (4 nos)",
            },
          ],
        },
        {
          name: "Green Peas (Frozen)",
          suggestions: [
            {
              quantity: "200",
              unit: "gm",
              displayText: "Green Peas (200 gm)",
            },
            {
              quantity: "500",
              unit: "gm",
              displayText: "Green Peas (500 gm)",
            },
          ],
        },
        {
          name: "Lauki (Bottle Gourd)",
          suggestions: [
            {
              quantity: "1",
              unit: "nos",
              displayText: "Lauki (1 nos)",
            },
            {
              quantity: "500",
              unit: "gm",
              displayText: "Lauki (500 gm)",
            },
          ],
        },

        // Add more essentials like Garlic, Onion, Mustard Seeds, etc.
      ],
      setIngredientOptions: (options) => set({ ingredientOptions: options }),
      addIngredient: (ingredient) =>
        set({
          ingredientOptions: [...get().ingredientOptions, ingredient],
        }),
    }),
    {
      name: "ingredient-options-store",
    }
  )
);
