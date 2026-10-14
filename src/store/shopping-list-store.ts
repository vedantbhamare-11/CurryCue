import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addItems, type AddResult, type IncomingItem, type PantryItemLike, type ShoppingItem } from '@/lib/shopping-list';

interface ShoppingListState {
  items: ShoppingItem[];
  // Merges duplicates and amounts, skips what is already in the pantry, and reports what happened
  addItems: (incoming: IncomingItem[], options?: { pantry?: PantryItemLike[]; recipeTitle?: string }) => Omit<AddResult, 'items'>;
  toggleItem: (id: string) => void;
  removeItem: (id: string) => void;
  clearChecked: () => void;
  clearAll: () => void;
}

export const useShoppingListStore = create<ShoppingListState>()(
  persist(
    (set, get) => ({
      items: [],
      addItems: (incoming, options = {}) => {
        const result = addItems(get().items, incoming, options);
        set({ items: result.items });
        return { added: result.added, merged: result.merged, skippedInPantry: result.skippedInPantry, alreadyListed: result.alreadyListed };
      },
      toggleItem: (id) =>
        set((state) => ({ items: state.items.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)) })),
      removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      clearChecked: () => set((state) => ({ items: state.items.filter((item) => !item.checked) })),
      clearAll: () => set({ items: [] }),
    }),
    { name: 'shopping-list-storage' }
  )
);
