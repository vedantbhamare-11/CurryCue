// The ingredients the search box can suggest, with the amounts people usually buy and the other names they go
// by ("pyaz" finds Onion). One short row each: [name, usual amounts, other names].
// Names are plain (no brands, no bracketed notes) so they match recipe ingredients; add a row to add a suggestion.
import { parseQuantityText } from '@/lib/shopping-list';

type Row = [name: string, amounts: string, aliases?: string];

const ROWS: Row[] = [
  // Vegetables and herbs
  ['Tomato', '250 gm, 2 nos', 'tamatar, tomatoes'],
  ['Onion', '2 nos, 500 gm', 'pyaz, pyaaz, kanda, onions'],
  ['Potato', '500 gm, 1 kg', 'aloo, batata, potatoes'],
  ['Garlic', '1 pod, 100 gm', 'lehsun, lasan'],
  ['Ginger', '1 inch, 100 gm', 'adrak'],
  ['Green Chilli', '2 nos, 50 gm', 'hari mirch, chili, mirchi, green chili'],
  ['Coriander Leaves', '1 bunch, 100 gm', 'cilantro, dhania, kothimbir, fresh coriander'],
  ['Curry Leaves', '1 sprig, 50 gm', 'kadi patta, kadipatta'],
  ['Mint Leaves', '1 bunch', 'pudina, mint'],
  ['Spinach', '1 bunch, 250 gm', 'palak'],
  ['Fenugreek Leaves', '1 bunch', 'methi, fresh methi'],
  ['Carrot', '250 gm, 500 gm', 'gajar, carrots'],
  ['Cauliflower', '1 head, 500 gm', 'gobi, phool gobi'],
  ['Cabbage', '1 nos, 500 gm', 'patta gobi, band gobi'],
  ['Capsicum', '2 nos, 250 gm', 'bell pepper, shimla mirch'],
  ['Brinjal', '3 nos, 500 gm', 'eggplant, aubergine, baingan'],
  ['Okra', '250 gm, 500 gm', 'bhindi, ladyfinger'],
  ['Green Peas', '200 gm, 500 gm', 'matar, peas'],
  ['Beans', '250 gm, 500 gm', 'french beans, green beans'],
  ['Cucumber', '2 nos, 500 gm', 'kheera, kakdi'],
  ['Lemon', '2 nos, 4 nos', 'nimbu, lime'],
  ['Beetroot', '2 nos, 500 gm', 'chukandar'],
  ['Drumstick', '2 nos, 4 nos', 'moringa, sahjan'],
  ['Bottle Gourd', '1 nos, 500 gm', 'lauki, doodhi'],
  ['Bitter Gourd', '250 gm', 'karela'],
  ['Ridge Gourd', '250 gm', 'turai, tori'],
  ['Pumpkin', '500 gm', 'kaddu'],
  ['Radish', '2 nos', 'mooli'],
  ['Sweet Potato', '500 gm', 'shakarkandi'],
  ['Corn', '2 nos, 250 gm', 'sweet corn, bhutta, corn kernels'],
  ['Mushroom', '200 gm, 500 gm', 'mushrooms'],
  ['Spring Onion', '1 bunch', 'green onion, scallion'],
  ['Raw Banana', '2 nos', 'kachha kela, plantain'],
  ['Raw Mango', '1 nos', 'kairi'],
  ['Jackfruit', '250 gm, 500 gm', 'kathal'],
  ['Coconut', '1 nos, 100 gm', 'nariyal'],
  ['Zucchini', '1 nos, 2 nos', 'courgette'],
  ['Broccoli', '1 head, 250 gm'],
  ['Avocado', '1 nos, 2 nos'],
  ['Banana', '6 nos', 'kela'],
  ['Apple', '4 nos', 'seb'],
  ['Mango', '2 nos', 'aam'],
  ['Basil Leaves', '1 bunch, 50 gm', 'basil'],
  ['Jalapeños', '50 gm, 100 gm', 'jalapeno'],
  ['Sun-dried Tomatoes', '100 gm, 250 gm'],

  // Dairy and eggs
  ['Milk', '500 ml, 1 litre', 'doodh'],
  ['Curd', '200 gm, 500 gm', 'yogurt, yoghurt, dahi'],
  ['Paneer', '200 gm, 500 gm', 'cottage cheese'],
  ['Butter', '100 gm, 500 gm', 'makhan'],
  ['Ghee', '200 ml, 500 ml', 'clarified butter'],
  ['Cheese', '100 gm, 200 gm'],
  ['Cream', '200 ml', 'malai, fresh cream'],
  ['Eggs', '6 nos, 12 nos', 'egg, anda'],
  ['Mozzarella Cheese', '100 gm, 250 gm'],
  ['Parmesan Cheese', '100 gm, 200 gm'],
  ['Cheddar Cheese', '100 gm, 200 gm'],
  ['Ricotta Cheese', '100 gm, 250 gm'],
  ['Queso Fresco', '100 gm, 250 gm'],

  // Meat and fish
  ['Chicken', '500 gm, 1 kg', 'murgh'],
  ['Mutton', '500 gm, 1 kg', 'lamb, goat meat'],
  ['Fish', '500 gm', 'machli'],
  ['Prawns', '250 gm, 500 gm', 'shrimp, jhinga'],

  // Rice, flour, pulses and breakfast
  ['Rice', '1 cup, 500 gm', 'chawal'],
  ['Basmati Rice', '1 kg, 5 kg'],
  ['Atta', '1 kg, 5 kg', 'wheat flour, whole wheat flour'],
  ['Maida', '500 gm, 1 kg', 'all purpose flour, refined flour'],
  ['Besan', '250 gm, 500 gm', 'gram flour, chickpea flour'],
  ['Rice Flour', '500 gm', 'chawal ka atta'],
  ['Sooji', '500 gm, 1 kg', 'rava, semolina, suji'],
  ['Poha', '500 gm', 'flattened rice, beaten rice'],
  ['Sabudana', '250 gm, 500 gm', 'sago, tapioca pearls'],
  ['Vermicelli', '200 gm', 'semiya, seviyan'],
  ['Oats', '500 gm'],
  ['Bread', '1 pack', 'loaf, slices'],
  ['Pasta', '250 gm, 500 gm', 'spaghetti, penne, macaroni'],
  ['Noodles', '1 packet, 2 packets', 'maggi'],
  ['Dosa Batter', '1 kg'],
  ['Toor Dal', '250 gm, 1 kg', 'arhar dal, tur dal, pigeon pea'],
  ['Moong Dal', '250 gm, 1 kg', 'split yellow lentils, yellow moong'],
  ['Masoor Dal', '250 gm, 1 kg', 'red lentils'],
  ['Chana Dal', '250 gm, 1 kg', 'split chickpeas, bengal gram'],
  ['Urad Dal', '250 gm, 1 kg', 'black gram'],
  ['Rajma', '250 gm, 500 gm', 'kidney beans'],
  ['Chickpeas', '250 gm, 500 gm', 'chana, chole, kabuli chana'],
  ['Black Beans', '250 gm, 1 kg'],
  ['Refried Beans', '100 gm, 250 gm'],

  // Spices and masalas
  ['Salt', '1 kg', 'namak'],
  ['Turmeric Powder', '100 gm', 'haldi, turmeric'],
  ['Red Chilli Powder', '100 gm, 200 gm', 'lal mirch, chili powder, chilli powder'],
  ['Kashmiri Chilli Powder', '100 gm', 'kashmiri mirch'],
  ['Coriander Powder', '100 gm', 'dhania powder'],
  ['Cumin Seeds', '50 gm, 100 gm', 'jeera'],
  ['Cumin Powder', '100 gm', 'jeera powder'],
  ['Mustard Seeds', '50 gm, 100 gm', 'rai, sarson'],
  ['Garam Masala', '50 gm, 100 gm'],
  ['Chaat Masala', '50 gm, 100 gm'],
  ['Sambar Powder', '100 gm', 'sambhar masala'],
  ['Rasam Powder', '100 gm'],
  ['Black Pepper', '50 gm, 100 gm', 'kali mirch, peppercorn'],
  ['Cardamom', '25 gm', 'elaichi'],
  ['Cloves', '25 gm', 'laung'],
  ['Cinnamon', '25 gm', 'dalchini'],
  ['Bay Leaf', '10 gm', 'tej patta'],
  ['Asafoetida', '25 gm', 'hing'],
  ['Fenugreek Seeds', '50 gm', 'methi dana, methi seeds'],
  ['Fennel Seeds', '50 gm', 'saunf'],
  ['Carom Seeds', '50 gm', 'ajwain'],
  ['Kasuri Methi', '25 gm', 'dried fenugreek leaves'],
  ['Oregano', '1 tbsp, 2 tbsp'],
  ['Chutney Powder', '100 gm'],
  ['Pickle', '250 gm, 500 gm', 'achar'],

  // Oils, sauces, sweeteners and other pantry items
  ['Cooking Oil', '500 ml, 1 litre', 'oil, vegetable oil, sunflower oil, refined oil'],
  ['Mustard Oil', '500 ml', 'sarson ka tel'],
  ['Coconut Oil', '200 ml, 500 ml'],
  ['Olive Oil', '250 ml, 500 ml'],
  ['Sugar', '1 kg', 'cheeni, shakkar'],
  ['Jaggery', '250 gm, 500 gm', 'gur'],
  ['Honey', '250 gm', 'shahad'],
  ['Tamarind', '100 gm, 250 gm', 'imli'],
  ['Tea Powder', '250 gm, 500 gm', 'tea, chai, chai patti, tea leaves'],
  ['Coffee', '50 gm, 100 gm', 'instant coffee'],
  ['Tomato Puree', '200 ml, 400 ml'],
  ['Tomato Ketchup', '200 gm, 500 gm', 'ketchup'],
  ['Soy Sauce', '100 ml, 250 ml'],
  ['Vinegar', '200 ml, 500 ml', 'sirka'],
  ['Coconut Milk', '200 ml, 400 ml'],
  ['Peanuts', '250 gm, 500 gm', 'moongfali, groundnut'],
  ['Cashew Nuts', '100 gm, 250 gm', 'kaju'],
  ['Almonds', '100 gm, 250 gm', 'badam'],
  ['Raisins', '100 gm', 'kishmish'],
  ['Cornflour', '100 gm, 250 gm', 'corn starch, cornstarch'],
  ['Baking Powder', '50 gm, 100 gm'],
  ['Baking Soda', '50 gm, 100 gm', 'soda bicarbonate, cooking soda'],
  ['Red Pasta Sauce', '100 ml, 250 ml'],
  ['White Sauce', '100 ml, 250 ml'],

  // World cooking and plant-based
  ['Tortilla', '6 pcs, 12 pcs', 'wrap'],
  ['Taco Shells', '1 pcs, 2 pcs'],
  ['Salsa', '100 gm, 250 gm'],
  ['Guacamole', '100 gm, 250 gm'],
  ['Pico de Gallo', '100 gm, 250 gm'],
  ['Mexican Rice', '100 gm, 250 gm'],
  ['Chipotle Peppers', '100 gm, 250 gm'],
  ['Arborio Rice', '100 gm, 250 gm', 'risotto rice'],
  ['Capers', '100 gm, 250 gm'],
  ['Balsamic Vinegar', '100 ml, 250 ml'],
  ['Sushi Rice', '250 gm, 500 gm'],
  ['Nori Sheets', '5 sheets, 10 sheets', 'seaweed'],
  ['Wasabi Paste', '50 gm, 100 gm'],
  ['Mirin', '100 ml, 250 ml'],
  ['Miso Paste', '100 gm, 250 gm'],
  ['Udon Noodles', '100 gm, 250 gm'],
  ['Soba Noodles', '100 gm, 250 gm'],
  ['Teriyaki Sauce', '100 ml, 250 ml'],
  ['Rice Vinegar', '100 ml, 250 ml'],
  ['Tempura Batter Mix', '100 gm, 250 gm'],
  ['Pickled Ginger', '100 gm, 250 gm', 'gari'],
  ['Enoki Mushrooms', '100 gm, 250 gm'],
  ['Daikon Radish', '1 nos, 2 nos'],
  ['Edamame', '100 gm, 250 gm'],
  ['Tofu', '200 gm, 500 gm', 'bean curd'],
  ['Tempeh', '100 gm, 250 gm'],
  ['Soy Milk', '500 ml, 1 litre'],
  ['Almond Milk', '500 ml, 1 litre'],
  ['Oat Milk', '500 ml, 1 litre'],
  ['Coconut Yogurt', '200 ml, 400 ml'],
  ['Vegan Butter', '100 gm, 250 gm'],
  ['Vegan Cheese', '100 gm, 250 gm'],
  ['Plant-Based Mayonnaise', '200 gm, 400 gm', 'vegan mayo'],
  ['Nutritional Yeast', '50 gm, 100 gm'],
  ['Chia Seeds', '100 gm, 250 gm'],
  ['Flaxseed Powder', '100 gm, 250 gm', 'flax seeds, alsi'],
  ['Hemp Seeds', '100 gm, 250 gm'],
  ['Tahini', '100 gm, 250 gm', 'sesame paste'],
  ['Maple Syrup', '100 ml, 250 ml'],
  ['Agave Nectar', '100 ml, 250 ml'],
  ['Vegan Chocolate Chips', '100 gm, 250 gm'],
];

export interface IngredientSuggestion {
  name: string;
  quantity: string;
  unit: string;
  displayText: string;
}

type Entry = { name: string; lower: string; aliases: string[]; suggestions: IngredientSuggestion[] };

const CATALOGUE: Entry[] = ROWS.map(([name, amounts, aliases = '']) => ({
  name,
  lower: name.toLowerCase(),
  aliases: aliases.split(',').map((alias) => alias.trim().toLowerCase()).filter(Boolean),
  suggestions: amounts.split(',').map((amount) => {
    const { quantity = '', unit = '' } = parseQuantityText(amount);
    return { name, quantity, unit, displayText: `${name} (${quantity} ${unit})` };
  }),
}));

const startsAWord = (text: string, query: string) => text.split(/[\s/-]+/).some((word) => word.startsWith(query));

// Lower is better: the name begins with what was typed (or it is exactly another name for it), then a word of the name, then another name for it, then
// anywhere in either ("tom" should offer Tomato before Sun-dried Tomatoes, and "ginger" Ginger before Pickled Ginger)
function rank(entry: Entry, query: string): number | null {
  if (entry.lower.startsWith(query) || entry.aliases.includes(query)) return 0;
  if (startsAWord(entry.lower, query)) return 1;
  if (entry.aliases.some((alias) => alias.startsWith(query) || startsAWord(alias, query))) return 2;
  if (entry.lower.includes(query)) return 3;
  if (entry.aliases.some((alias) => alias.includes(query))) return 4;
  return null;
}

// Suggestions are always under the ingredient's own name, whatever name was typed ("pyaz" offers "Onion (2 nos)")
export function searchCatalogue(query: string, limit = 8): IngredientSuggestion[] {
  const text = query.trim().toLowerCase();
  if (!text) return [];
  return CATALOGUE.flatMap((entry, order) => {
    const score = rank(entry, text);
    return score === null ? [] : [{ entry, score, order }];
  })
    .sort((a, b) => a.score - b.score || a.order - b.order)
    .flatMap(({ entry }) => entry.suggestions)
    .slice(0, limit);
}

// For tests: the raw names, to check the data stays tidy
export const catalogueNames = (): string[] => CATALOGUE.map((entry) => entry.name);
