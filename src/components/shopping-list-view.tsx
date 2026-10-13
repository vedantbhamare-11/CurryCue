"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Check, Copy, MessageCircle, PackageCheck, Plus, ShoppingBasket, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useShoppingListStore } from '@/store/shopping-list-store';
import { useIngredientStore } from '@/store/ingredient-store';
import { describeAmount, formatForSharing, groupByCategory, parseQuantityText, planPantryMove } from '@/lib/shopping-list';

export function ShoppingListView() {
  const { items, addItems, toggleItem, removeItem, clearChecked, clearAll } = useShoppingListStore();
  const pantry = useIngredientStore((state) => state.ingredients);
  const addIngredient = useIngredientStore((state) => state.addIngredient);
  const updateIngredient = useIngredientStore((state) => state.updateIngredient);

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');

  const toBuy = items.filter((item) => !item.checked);
  const bought = items.filter((item) => item.checked);

  const handleAdd = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    // No pantry check here: someone typing an item by hand may well be restocking it
    const result = addItems([{ name, ...parseQuantityText(quantity) }]);
    if (result.merged.length > 0) toast.info(`${result.merged[0]} was already on your list, so its amount was updated`);
    setName('');
    setQuantity('');
  };

  const moveBoughtToPantry = () => {
    const plan = planPantryMove(bought, pantry);
    plan.toAdd.forEach((item) =>
      addIngredient({ id: `shop-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, name: item.name, quantity: item.quantity, unit: item.unit })
    );
    plan.toUpdate.forEach((item) => updateIngredient(item.id, { quantity: item.quantity, unit: item.unit }));
    clearChecked();
    const total = plan.toAdd.length + plan.toUpdate.length;
    toast.success(`Moved ${total} ${total === 1 ? 'item' : 'items'} to your pantry`);
  };

  const shareText = formatForSharing(items);

  const copyList = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success('Shopping list copied');
    } catch {
      toast.error("Couldn't copy. Your browser blocked clipboard access.");
    }
  };

  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <form onSubmit={handleAdd} className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Add an item (e.g. tomato)"
          aria-label="Item name"
          className="flex-1 px-4 py-3 rounded-lg bg-input-background dark:bg-input border border-border outline-none focus:ring-2 focus:ring-primary/20"
        />
        <input
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          placeholder="e.g. 250 gm"
          aria-label="Amount"
          className="sm:w-40 px-4 py-3 rounded-lg bg-input-background dark:bg-input border border-border outline-none focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </form>

      {items.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-10 text-center shadow-sm">
          <ShoppingBasket className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
          <h2 className="text-xl font-medium mb-2">Your shopping list is empty</h2>
          <p className="text-muted-foreground mb-5 max-w-md mx-auto">
            Add items above, or open a recipe and tap &ldquo;Add to shopping list&rdquo; next to what you&rsquo;re missing.
          </p>
          <Link href="/" className="inline-block px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
            Find recipes
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {toBuy.length} to buy{bought.length > 0 ? ` · ${bought.length} bought` : ''}
            </p>
            <div className="flex flex-wrap gap-2">
              <button onClick={copyList} disabled={toBuy.length === 0} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm disabled:opacity-50 transition-colors">
                <Copy className="w-4 h-4" /> Copy
              </button>
              <button onClick={shareOnWhatsApp} disabled={toBuy.length === 0} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm disabled:opacity-50 transition-colors">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </button>
              <button onClick={clearAll} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm text-muted-foreground transition-colors">
                <Trash2 className="w-4 h-4" /> Clear all
              </button>
            </div>
          </div>

          {groupByCategory(toBuy).map(({ category, items: group }) => (
            <section key={category} className="bg-card border border-border rounded-2xl p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-primary mb-2">{category}</h2>
              <ul>
                {group.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 py-1">
                    <button
                      role="checkbox"
                      aria-checked={false}
                      aria-label={`Mark ${item.name} as bought`}
                      onClick={() => toggleItem(item.id)}
                      className="group flex-shrink-0 w-11 h-11 -ml-2 flex items-center justify-center"
                    >
                      <span className="block w-7 h-7 rounded-full border-2 border-muted-foreground/40 group-hover:border-primary transition-colors" />
                    </button>
                    <div className="min-w-0 flex-1 py-1.5">
                      <p className="font-medium">
                        {item.name}
                        {describeAmount(item) && <span className="ml-2 font-normal text-muted-foreground">{describeAmount(item)}</span>}
                      </p>
                      {item.recipes.length > 0 && <p className="text-xs text-muted-foreground truncate">for {item.recipes.join(', ')}</p>}
                    </div>
                    <button onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`} className="p-2 text-muted-foreground/60 hover:text-destructive transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          {bought.length > 0 && (
            <section className="bg-card border border-border rounded-2xl p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <h2 className="text-sm font-semibold text-muted-foreground">Bought</h2>
                <div className="flex gap-2">
                  <button onClick={clearChecked} className="px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors">Clear bought</button>
                  <button onClick={moveBoughtToPantry} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                    <PackageCheck className="w-4 h-4" /> Move {bought.length} to pantry
                  </button>
                </div>
              </div>
              <ul>
                {bought.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 py-1">
                    <button
                      role="checkbox"
                      aria-checked
                      aria-label={`Mark ${item.name} as not bought`}
                      onClick={() => toggleItem(item.id)}
                      className="flex-shrink-0 w-11 h-11 -ml-2 flex items-center justify-center"
                    >
                      <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </span>
                    </button>
                    <p className={cn('flex-1 py-1.5 text-muted-foreground line-through')}>
                      {item.name}
                      {describeAmount(item) && <span className="ml-2">{describeAmount(item)}</span>}
                    </p>
                    <button onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`} className="p-2 text-muted-foreground/60 hover:text-destructive transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
