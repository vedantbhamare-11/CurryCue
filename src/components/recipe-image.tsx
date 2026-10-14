import Image from 'next/image';
import { ChefHat } from 'lucide-react';
import { hasRealPhoto } from '@/lib/dish-photo';

// Warm gradients, picked by title so a row of cards is not one flat colour but a dish never changes colour
const GRADIENTS = [
  'from-amber-200 to-orange-300 dark:from-amber-900/60 dark:to-orange-800/60',
  'from-orange-200 to-rose-300 dark:from-orange-900/50 dark:to-amber-900/50',
  'from-yellow-200 to-amber-400 dark:from-yellow-900/60 dark:to-amber-800/60',
  'from-red-200 to-orange-300 dark:from-orange-900/50 dark:to-yellow-900/50',
  'from-lime-200 to-amber-300 dark:from-lime-900/50 dark:to-amber-800/60',
];

function gradientFor(title: string): string {
  let hash = 0;
  for (const char of title) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return GRADIENTS[hash % GRADIENTS.length];
}

// Fills its (relative) parent. Shows the recipe's photo when it really has one, otherwise a plain placeholder.
// `iconTop` keeps the icon clear of text laid over the bottom of the image (the recipe modal's title and tags).
export function RecipeImage({ src, title, sizes, iconTop }: { src?: string; title: string; sizes?: string; iconTop?: boolean }) {
  if (hasRealPhoto(src)) {
    return <Image src={src} alt={title} fill className="object-cover" sizes={sizes} />;
  }
  return (
    <div className={`absolute inset-0 flex justify-center bg-gradient-to-br ${gradientFor(title)} ${iconTop ? 'items-start pt-6 sm:pt-10' : 'items-center'}`} role="img" aria-label={title}>
      <ChefHat className="w-12 h-12 text-white/70 dark:text-white/40" aria-hidden="true" />
    </div>
  );
}
