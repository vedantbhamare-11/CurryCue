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

        {
          name: "Pasta (Spaghetti/Penne)",
          suggestions: [
            { quantity: "250", unit: "gm", displayText: "Pasta (250 gm)" },
            { quantity: "500", unit: "gm", displayText: "Pasta (500 gm)" },
          ],
        },
        {
          name: "Olive Oil",
          suggestions: [
            { quantity: "250", unit: "ml", displayText: "Olive Oil (250 ml)" },
            { quantity: "500", unit: "ml", displayText: "Olive Oil (500 ml)" },
          ],
        },
        {
          name: "Parmesan Cheese",
          suggestions: [
            {
              quantity: "100",
              unit: "gm",
              displayText: "Parmesan Cheese (100 gm)",
            },
            {
              quantity: "200",
              unit: "gm",
              displayText: "Parmesan Cheese (200 gm)",
            },
          ],
        },
        {
          name: "Tomato Puree",
          suggestions: [
            {
              quantity: "200",
              unit: "ml",
              displayText: "Tomato Puree (200 ml)",
            },
            {
              quantity: "400",
              unit: "ml",
              displayText: "Tomato Puree (400 ml)",
            },
          ],
        },
        {
          name: "Oregano",
          suggestions: [
            { quantity: "1", unit: "tbsp", displayText: "Oregano (1 tbsp)" },
            { quantity: "2", unit: "tbsp", displayText: "Oregano (2 tbsp)" },
          ],
        },

        {
          name: "Tortilla (Corn/Flour)",
          suggestions: [
            { quantity: "6", unit: "pcs", displayText: "Tortilla (6 pcs)" },
            { quantity: "12", unit: "pcs", displayText: "Tortilla (12 pcs)" },
          ],
        },
        {
          name: "Black Beans",
          suggestions: [
            {
              quantity: "250",
              unit: "gm",
              displayText: "Black Beans (250 gm)",
            },
            { quantity: "1", unit: "kg", displayText: "Black Beans (1 kg)" },
          ],
        },
        {
          name: "Avocado",
          suggestions: [
            { quantity: "1", unit: "nos", displayText: "Avocado (1 nos)" },
            { quantity: "2", unit: "nos", displayText: "Avocado (2 nos)" },
          ],
        },
        {
          name: "Jalapeños",
          suggestions: [
            { quantity: "50", unit: "gm", displayText: "Jalapeños (50 gm)" },
            { quantity: "100", unit: "gm", displayText: "Jalapeños (100 gm)" },
          ],
        },
        {
          name: "Cheddar Cheese",
          suggestions: [
            {
              quantity: "100",
              unit: "gm",
              displayText: "Cheddar Cheese (100 gm)",
            },
            {
              quantity: "200",
              unit: "gm",
              displayText: "Cheddar Cheese (200 gm)",
            },
          ],
        },
        {
          name: "Sushi Rice",
          suggestions: [
            { quantity: "250", unit: "gm", displayText: "Sushi Rice (250 gm)" },
            { quantity: "500", unit: "gm", displayText: "Sushi Rice (500 gm)" },
          ],
        },
        {
          name: "Soy Sauce",
          suggestions: [
            { quantity: "100", unit: "ml", displayText: "Soy Sauce (100 ml)" },
            { quantity: "250", unit: "ml", displayText: "Soy Sauce (250 ml)" },
          ],
        },
        {
          name: "Nori Sheets",
          suggestions: [
            {
              quantity: "5",
              unit: "sheets",
              displayText: "Nori Sheets (5 sheets)",
            },
            {
              quantity: "10",
              unit: "sheets",
              displayText: "Nori Sheets (10 sheets)",
            },
          ],
        },
        {
          name: "Wasabi Paste",
          suggestions: [
            { quantity: "50", unit: "gm", displayText: "Wasabi Paste (50 gm)" },
            {
              quantity: "100",
              unit: "gm",
              displayText: "Wasabi Paste (100 gm)",
            },
          ],
        },
        {
          name: "Mirin",
          suggestions: [
            { quantity: "100", unit: "ml", displayText: "Mirin (100 ml)" },
            { quantity: "250", unit: "ml", displayText: "Mirin (250 ml)" },
          ],
        },

        {
          name: "Almond Milk",
          suggestions: [
            {
              quantity: "500",
              unit: "ml",
              displayText: "Almond Milk (500 ml)",
            },
            {
              quantity: "1",
              unit: "litre",
              displayText: "Almond Milk (1 litre)",
            },
          ],
        },
        {
          name: "Tofu",
          suggestions: [
            { quantity: "200", unit: "gm", displayText: "Tofu (200 gm)" },
            { quantity: "500", unit: "gm", displayText: "Tofu (500 gm)" },
          ],
        },
        {
          name: "Nutritional Yeast",
          suggestions: [
            {
              quantity: "50",
              unit: "gm",
              displayText: "Nutritional Yeast (50 gm)",
            },
            {
              quantity: "100",
              unit: "gm",
              displayText: "Nutritional Yeast (100 gm)",
            },
          ],
        },
        {
          name: "Vegan Butter",
          suggestions: [
            {
              quantity: "100",
              unit: "gm",
              displayText: "Vegan Butter (100 gm)",
            },
            {
              quantity: "250",
              unit: "gm",
              displayText: "Vegan Butter (250 gm)",
            },
          ],
        },
        {
          name: "Coconut Milk",
          suggestions: [
            {
              quantity: "200",
              unit: "ml",
              displayText: "Coconut Milk (200 ml)",
            },
            {
              quantity: "400",
              unit: "ml",
              displayText: "Coconut Milk (400 ml)",
            },
          ],
        },
        {
          name: "Chia Seeds",
          suggestions: [
            { quantity: "100", unit: "gm", displayText: "Chia Seeds (100 gm)" },
            { quantity: "250", unit: "gm", displayText: "Chia Seeds (250 gm)" },
          ],
        },
        {
          name: "Flaxseed Powder",
          suggestions: [
            {
              quantity: "100",
              unit: "gm",
              displayText: "Flaxseed Powder (100 gm)",
            },
            {
              quantity: "250",
              unit: "gm",
              displayText: "Flaxseed Powder (250 gm)",
            },
          ],
        },
        {
          name: "Cashew Nuts",
          suggestions: [
            {
              quantity: "100",
              unit: "gm",
              displayText: "Cashew Nuts (100 gm)",
            },
            {
              quantity: "250",
              unit: "gm",
              displayText: "Cashew Nuts (250 gm)",
            },
          ],
        },
        {
          name: "Plant-Based Mayonnaise",
          suggestions: [
            { quantity: "200", unit: "gm", displayText: "Vegan Mayo (200 gm)" },
            { quantity: "400", unit: "gm", displayText: "Vegan Mayo (400 gm)" },
          ],
        },
        {
          name: "Soy Milk",
          suggestions: [
            { quantity: "500", unit: "ml", displayText: "Soy Milk (500 ml)" },
            { quantity: "1", unit: "litre", displayText: "Soy Milk (1 litre)" },
          ],
        },
        {
          name: "Mozzarella Cheese",
          suggestions: [
            {
              quantity: "100",
              unit: "gm",
              displayText: "Mozzarella Cheese (100 gm)",
            },
            {
              quantity: "250",
              unit: "gm",
              displayText: "Mozzarella Cheese (250 gm)",
            },
          ],
        },
        {
          name: "Basil Leaves",
          suggestions: [
            {
              quantity: "100",
              unit: "gm",
              displayText: "Basil Leaves (100 gm)",
            },
            {
              quantity: "250",
              unit: "gm",
              displayText: "Basil Leaves (250 gm)",
            },
          ],
        },
        {
          name: "Red Pasta Sauce",
          suggestions: [
            {
              quantity: "100",
              unit: "ml",
              displayText: "Red Pasta Sauce (100 ml)",
            },
            {
              quantity: "250",
              unit: "ml",
              displayText: "Red Pasta Sauce (250 ml)",
            },
          ],
        },
        {
          name: "White Sauce",
          suggestions: [
            {
              quantity: "100",
              unit: "ml",
              displayText: "White Sauce (100 ml)",
            },
            {
              quantity: "250",
              unit: "ml",
              displayText: "White Sauce (250 ml)",
            },
          ],
        },
        {
          name: "Arborio Rice",
          suggestions: [
            {
              quantity: "100",
              unit: "gm",
              displayText: "Arborio Rice (100 gm)",
            },
            {
              quantity: "250",
              unit: "gm",
              displayText: "Arborio Rice (250 gm)",
            },
          ],
        },
        {
          name: "Sun-dried Tomatoes",
          suggestions: [
            {
              quantity: "100",
              unit: "gm",
              displayText: "Sun-dried Tomatoes (100 gm)",
            },
            {
              quantity: "250",
              unit: "gm",
              displayText: "Sun-dried Tomatoes (250 gm)",
            },
          ],
        },
        {
          name: "Capers",
          suggestions: [
            { quantity: "100", unit: "gm", displayText: "Capers (100 gm)" },
            { quantity: "250", unit: "gm", displayText: "Capers (250 gm)" },
          ],
        },
        {
          name: "Zucchini",
          suggestions: [
            { quantity: "1", unit: "nos", displayText: "Zucchini (1 nos)" },
            { quantity: "2", unit: "nos", displayText: "Zucchini (2 nos)" },
          ],
        },
        {
          name: "Ricotta Cheese",
          suggestions: [
            {
              quantity: "100",
              unit: "gm",
              displayText: "Ricotta Cheese (100 gm)",
            },
            {
              quantity: "250",
              unit: "gm",
              displayText: "Ricotta Cheese (250 gm)",
            },
          ],
        },
        {
          name: "Balsamic Vinegar",
          suggestions: [
            {
              quantity: "100",
              unit: "ml",
              displayText: "Balsamic Vinegar (100 ml)",
            },
            {
              quantity: "250",
              unit: "ml",
              displayText: "Balsamic Vinegar (250 ml)",
            },
          ],
        },
        {
          name: "Corn Kernels",
          suggestions: [
            {
              quantity: "100",
              unit: "gm",
              displayText: "Corn Kernels (100 gm)",
            },
            {
              quantity: "250",
              unit: "gm",
              displayText: "Corn Kernels (250 gm)",
            },
          ],
        },
        {
          name: "Refried Beans",
          suggestions: [
            {
              quantity: "100",
              unit: "gm",
              displayText: "Refried Beans (100 gm)",
            },
            {
              quantity: "250",
              unit: "gm",
              displayText: "Refried Beans (250 gm)",
            },
          ],
        },
        {
          name: "Taco Shells",
          suggestions: [
            { quantity: "1", unit: "pcs", displayText: "Taco Shells (1 pcs)" },
            { quantity: "2", unit: "pcs", displayText: "Taco Shells (2 pcs)" },
          ],
        },
        {
          name: "Salsa",
          suggestions: [
            { quantity: "100", unit: "gm", displayText: "Salsa (100 gm)" },
            { quantity: "250", unit: "gm", displayText: "Salsa (250 gm)" },
          ],
        },
        {
          name: "Guacamole",
          suggestions: [
            { quantity: "100", unit: "gm", displayText: "Guacamole (100 gm)" },
            { quantity: "250", unit: "gm", displayText: "Guacamole (250 gm)" },
          ],
        },
        {
          name: "Mexican Rice",
          suggestions: [
            {
              quantity: "100",
              unit: "gm",
              displayText: "Mexican Rice (100 gm)",
            },
            {
              quantity: "250",
              unit: "gm",
              displayText: "Mexican Rice (250 gm)",
            },
          ],
        },
        {
          name: "Pico de Gallo",
          suggestions: [
            {
              quantity: "100",
              unit: "gm",
              displayText: "Pico de Gallo (100 gm)",
            },
            {
              quantity: "250",
              unit: "gm",
              displayText: "Pico de Gallo (250 gm)",
            },
          ],
        },
        {
          name: "Chipotle Peppers",
          suggestions: [
            {
              quantity: "100",
              unit: "gm",
              displayText: "Chipotle Peppers (100 gm)",
            },
            {
              quantity: "250",
              unit: "gm",
              displayText: "Chipotle Peppers (250 gm)",
            },
          ],
        },
        {
          name: "Queso Fresco",
          suggestions: [
            {
              quantity: "100",
              unit: "gm",
              displayText: "Queso Fresco (100 gm)",
            },
            {
              quantity: "250",
              unit: "gm",
              displayText: "Queso Fresco (250 gm)",
            },
          ],
        },
        {
          name: "Cilantro",
          suggestions: [
            { quantity: "100", unit: "gm", displayText: "Cilantro (100 gm)" },
            { quantity: "250", unit: "gm", displayText: "Cilantro (250 gm)" },
          ],
        },
        {
          name: "Miso Paste",
          suggestions: [
            { quantity: "100", unit: "gm", displayText: "Miso Paste (100 gm)" },
            { quantity: "250", unit: "gm", displayText: "Miso Paste (250 gm)" },
          ],
        },
        {
          name: "Udon Noodles",
          suggestions: [
            {
              quantity: "100",
              unit: "gm",
              displayText: "Udon Noodles (100 gm)",
            },
            {
              quantity: "250",
              unit: "gm",
              displayText: "Udon Noodles (250 gm)",
            },
          ],
        },
        {
          name: "Tempura Batter Mix",
          suggestions: [
            {
              quantity: "100",
              unit: "gm",
              displayText: "Tempura Batter Mix (100 gm)",
            },
            {
              quantity: "250",
              unit: "gm",
              displayText: "Tempura Batter Mix (250 gm)",
            },
          ],
        },
        {
          name: "Pickled Ginger",
          suggestions: [
            {
              quantity: "100",
              unit: "gm",
              displayText: "Pickled Ginger (100 gm)",
            },
            {
              quantity: "250",
              unit: "gm",
              displayText: "Pickled Ginger (250 gm)",
            },
          ],
        },
        {
          name: "Soba Noodles",
          suggestions: [
            {
              quantity: "100",
              unit: "gm",
              displayText: "Soba Noodles (100 gm)",
            },
            {
              quantity: "250",
              unit: "gm",
              displayText: "Soba Noodles (250 gm)",
            },
          ],
        },
        {
          name: "Teriyaki Sauce",
          suggestions: [
            {
              quantity: "100",
              unit: "ml",
              displayText: "Teriyaki Sauce (100 ml)",
            },
            {
              quantity: "250",
              unit: "ml",
              displayText: "Teriyaki Sauce (250 ml)",
            },
          ],
        },
        {
          name: "Rice Vinegar",
          suggestions: [
            {
              quantity: "100",
              unit: "ml",
              displayText: "Rice Vinegar (100 ml)",
            },
            {
              quantity: "250",
              unit: "ml",
              displayText: "Rice Vinegar (250 ml)",
            },
          ],
        },
        {
          name: "Enoki Mushrooms",
          suggestions: [
            {
              quantity: "100",
              unit: "gm",
              displayText: "Enoki Mushrooms (100 gm)",
            },
            {
              quantity: "250",
              unit: "gm",
              displayText: "Enoki Mushrooms (250 gm)",
            },
          ],
        },
        {
          name: "Daikon Radish",
          suggestions: [
            {
              quantity: "1",
              unit: "nos",
              displayText: "Daikon Radish (1 nos)",
            },
            {
              quantity: "2",
              unit: "nos",
              displayText: "Daikon Radish (2 nos)",
            },
          ],
        },
        {
          name: "Edamame",
          suggestions: [
            { quantity: "100", unit: "gm", displayText: "Edamame (100 gm)" },
            { quantity: "250", unit: "gm", displayText: "Edamame (250 gm)" },
          ],
        },
        {
          name: "Oat Milk",
          suggestions: [
            { quantity: "500", unit: "ml", displayText: "Oat Milk (500 ml)" },
            { quantity: "1", unit: "litre", displayText: "Oat Milk (1 litre)" },
          ],
        },
        {
          name: "Tempeh",
          suggestions: [
            { quantity: "100", unit: "gm", displayText: "Tempeh (100 gm)" },
            { quantity: "250", unit: "gm", displayText: "Tempeh (250 gm)" },
          ],
        },
        {
          name: "Jackfruit (Raw)",
          suggestions: [
            { quantity: "100", unit: "gm", displayText: "Jackfruit (100 gm)" },
            { quantity: "250", unit: "gm", displayText: "Jackfruit (250 gm)" },
          ],
        },
        {
          name: "Vegan Cheese",
          suggestions: [
            {
              quantity: "100",
              unit: "gm",
              displayText: "Vegan Cheese (100 gm)",
            },
            {
              quantity: "250",
              unit: "gm",
              displayText: "Vegan Cheese (250 gm)",
            },
          ],
        },
        {
          name: "Hemp Seeds",
          suggestions: [
            { quantity: "100", unit: "gm", displayText: "Hemp Seeds (100 gm)" },
            { quantity: "250", unit: "gm", displayText: "Hemp Seeds (250 gm)" },
          ],
        },
        {
          name: "Tahini",
          suggestions: [
            { quantity: "100", unit: "gm", displayText: "Tahini (100 gm)" },
            { quantity: "250", unit: "gm", displayText: "Tahini (250 gm)" },
          ],
        },
        {
          name: "Coconut Yogurt",
          suggestions: [
            {
              quantity: "200",
              unit: "ml",
              displayText: "Coconut Yogurt (200 ml)",
            },
            {
              quantity: "400",
              unit: "ml",
              displayText: "Coconut Yogurt (400 ml)",
            },
          ],
        },
        {
          name: "Maple Syrup",
          suggestions: [
            {
              quantity: "100",
              unit: "ml",
              displayText: "Maple Syrup (100 ml)",
            },
            {
              quantity: "250",
              unit: "ml",
              displayText: "Maple Syrup (250 ml)",
            },
          ],
        },
        {
          name: "Agave Nectar",
          suggestions: [
            {
              quantity: "100",
              unit: "ml",
              displayText: "Agave Nectar (100 ml)",
            },
            {
              quantity: "250",
              unit: "ml",
              displayText: "Agave Nectar (250 ml)",
            },
          ],
        },
        {
          name: "Vegan Chocolate Chips",
          suggestions: [
            {
              quantity: "100",
              unit: "gm",
              displayText: "Vegan Chocolate Chips (100 gm)",
            },
            {
              quantity: "250",
              unit: "gm",
              displayText: "Vegan Chocolate Chips (250 gm)",
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
