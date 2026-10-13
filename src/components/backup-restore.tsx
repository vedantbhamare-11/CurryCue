"use client";

import { useRef, useState } from 'react';
import { Download, ShieldCheck, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useIngredientStore } from '@/store/ingredient-store';
import { useShoppingListStore } from '@/store/shopping-list-store';
import { useRecipeStore } from '@/store/recipe-store';
import { useUserPreferencesStore, defaultPreferences } from '@/store/user-preferences-store';
import { backupFileName, createBackup, mergeBackup, parseBackup, MAX_BACKUP_BYTES, type BackupData, type BackupSummary } from '@/lib/backup';

// Everything lives in this browser (there is no server or account), so this is how data survives a cleared
// browser, a new phone or a new laptop.
function readCurrentData(): BackupData {
  return {
    ingredients: useIngredientStore.getState().ingredients,
    shoppingList: useShoppingListStore.getState().items,
    favoriteRecipes: useRecipeStore.getState().favoriteRecipes,
    recentRecipes: useRecipeStore.getState().recentRecipes,
    preferences: useUserPreferencesStore.getState().preferences,
  };
}

function writeData(data: BackupData) {
  useIngredientStore.setState({ ingredients: data.ingredients });
  useShoppingListStore.setState({ items: data.shoppingList });
  useRecipeStore.setState({ favoriteRecipes: data.favoriteRecipes, recentRecipes: data.recentRecipes });
  if (data.preferences) useUserPreferencesStore.setState({ preferences: data.preferences });
}

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`;

export function BackupRestore() {
  const ingredientCount = useIngredientStore((state) => state.ingredients.length);
  const shoppingCount = useShoppingListStore((state) => state.items.length);
  const recipeCount = useRecipeStore((state) => state.favoriteRecipes.length);

  const fileInput = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<{ data: BackupData; summary: BackupSummary } | null>(null);
  const [confirmReplace, setConfirmReplace] = useState(false);

  const downloadBackup = () => {
    const json = JSON.stringify(createBackup(readCurrentData()), null, 2);
    const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = backupFileName();
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success('Backup downloaded. Keep the file somewhere safe.');
  };

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = ''; // so choosing the same file again still fires
    if (!file) return;
    if (file.size > MAX_BACKUP_BYTES) {
      toast.error('That file is too large to be a CurryCue backup.');
      return;
    }
    const result = parseBackup(await file.text());
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setConfirmReplace(false);
    setPending({ data: result.data, summary: result.summary });
  };

  const finish = (message: string) => {
    setPending(null);
    setConfirmReplace(false);
    toast.success(message);
  };

  const merge = () => {
    if (!pending) return;
    const current = readCurrentData();
    const stillDefaults = JSON.stringify(current.preferences) === JSON.stringify(defaultPreferences);
    writeData(mergeBackup(current, pending.data, { keepCurrentPreferences: !stillDefaults }));
    finish('Backup merged with your data');
  };

  const replace = () => {
    if (!pending) return;
    writeData({ ...pending.data, preferences: pending.data.preferences ?? readCurrentData().preferences });
    finish('Your data was replaced with the backup');
  };

  return (
    <section className="bg-card rounded-2xl p-6 shadow-sm border border-border" aria-labelledby="backup-heading">
      <div className="flex items-start gap-3 mb-4">
        <ShieldCheck className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <h2 id="backup-heading" className="text-xl font-bold">Back up your data</h2>
          <p className="text-sm text-muted-foreground mt-1">
            CurryCue keeps your pantry, shopping list and saved recipes in this browser only. Download a backup file to keep them
            safe, or to move to another phone or computer.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Right now: {plural(ingredientCount, 'ingredient')}, {plural(shoppingCount, 'shopping item')}, {plural(recipeCount, 'saved recipe')}.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={downloadBackup} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
          <Download className="w-4 h-4" /> Download backup
        </button>
        <button onClick={() => fileInput.current?.click()} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-muted hover:bg-muted/80 font-medium transition-colors">
          <Upload className="w-4 h-4" /> Restore from file
        </button>
        <input ref={fileInput} type="file" accept="application/json,.json" onChange={handleFile} className="hidden" aria-label="Choose a CurryCue backup file" />
      </div>

      {pending && (
        <div className="mt-4 rounded-xl border border-border bg-muted/40 p-4 space-y-3" role="alert">
          <div>
            <p className="font-medium">Found a backup
              {pending.summary.exportedAt ? ` from ${new Date(pending.summary.exportedAt).toLocaleDateString()}` : ''}:
            </p>
            <p className="text-sm text-muted-foreground">
              {plural(pending.summary.ingredients, 'ingredient')}, {plural(pending.summary.shoppingItems, 'shopping item')},{' '}
              {plural(pending.summary.favoriteRecipes, 'saved recipe')}.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={merge} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
              Merge with my data
            </button>
            {confirmReplace ? (
              <button onClick={replace} className="px-4 py-2 rounded-lg bg-destructive text-white font-medium hover:bg-destructive/90 transition-colors">
                Yes, replace everything
              </button>
            ) : (
              <button onClick={() => setConfirmReplace(true)} className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 font-medium transition-colors">
                Replace my data
              </button>
            )}
            <button onClick={() => { setPending(null); setConfirmReplace(false); }} className="px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
              Cancel
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Merge keeps everything you have and adds the backup (matching ingredients combine). Replace discards what is here now.
          </p>
        </div>
      )}
    </section>
  );
}
