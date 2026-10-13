"use client";

import { useState } from 'react';
import { CalendarClock } from 'lucide-react';
import type { Ingredient } from '@/types';
import { cn } from '@/lib/utils';
import { useIngredientStore } from '@/store/ingredient-store';
import { addDaysKey, daysUntil, describeExpiry, getExpiryStatus, suggestShelfLifeDays, type ExpiryStatus } from '@/lib/expiry';

const BADGE_STYLES: Record<ExpiryStatus, string> = {
  expired: 'bg-red-500/15 text-red-700 dark:text-red-300',
  today: 'bg-red-500/15 text-red-700 dark:text-red-300',
  urgent: 'bg-red-500/10 text-red-700 dark:text-red-300',
  soon: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  ok: 'bg-foreground/5 text-muted-foreground',
};

// Expiry badge for a pantry chip. Click it to set or change the date; quick presets cover most cases.
export function PantryExpiry({ ingredient }: { ingredient: Ingredient }) {
  const updateIngredient = useIngredientStore((state) => state.updateIngredient);
  const [open, setOpen] = useState(false);

  const days = daysUntil(ingredient.expiresOn);
  const typical = suggestShelfLifeDays(ingredient.name);
  const status = days === null ? null : getExpiryStatus(days);

  const setExpiry = (expiresOn: string | undefined) => {
    updateIngredient(ingredient.id, { expiresOn });
    setOpen(false);
  };

  const presetButton = 'px-2.5 py-1 rounded-md bg-background border border-border text-xs hover:border-primary transition-colors';

  return (
    <div className="mt-1.5">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={days === null ? `Add an expiry date for ${ingredient.name}` : `${describeExpiry(days)}. Change expiry date for ${ingredient.name}`}
        className={cn(
          'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition-colors',
          status ? BADGE_STYLES[status] : 'text-muted-foreground/70 hover:text-foreground'
        )}
      >
        <CalendarClock className="w-3 h-3" />
        {days === null ? 'Add expiry' : describeExpiry(days)}
      </button>

      {open && (
        <div className="mt-2 space-y-2 rounded-lg bg-card border border-border p-3 shadow-sm">
          <label className="block text-xs text-muted-foreground">
            Use by
            <input
              type="date"
              value={ingredient.expiresOn ?? ''}
              onChange={(event) => event.target.value && setExpiry(event.target.value)}
              className="mt-1 block w-full rounded-md bg-input-background dark:bg-input border border-border px-2 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <div className="flex flex-wrap gap-1.5">
            <button type="button" className={presetButton} onClick={() => setExpiry(addDaysKey(1))}>Tomorrow</button>
            <button type="button" className={presetButton} onClick={() => setExpiry(addDaysKey(3))}>3 days</button>
            <button type="button" className={presetButton} onClick={() => setExpiry(addDaysKey(7))}>1 week</button>
            {typical !== null && (
              <button type="button" className={cn(presetButton, 'border-primary/40')} onClick={() => setExpiry(addDaysKey(typical))}>
                Typical: {typical} {typical === 1 ? 'day' : 'days'}
              </button>
            )}
          </div>
          <div className="flex justify-between">
            {ingredient.expiresOn ? (
              <button type="button" onClick={() => setExpiry(undefined)} className="text-xs text-muted-foreground hover:text-destructive transition-colors">Clear date</button>
            ) : <span />}
            <button type="button" onClick={() => setOpen(false)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
