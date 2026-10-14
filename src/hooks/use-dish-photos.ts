import { useEffect } from 'react';
import { Recipe } from '@/types';
import { useRecipeStore } from '@/store/recipe-store';
import { hasRealPhoto, type DishPhoto } from '@/lib/dish-photo';

// Titles already looked up this page load (found or not), so a re-render never asks twice
const asked = new Set<string>();

// Looks up a real photo for each recipe that has none and saves it on the recipe. Recipes keep their
// placeholder if nothing good is found, if the server has no key, or if the request fails.
export function useDishPhotos(recipes: Recipe[]) {
  const setRecipePhoto = useRecipeStore((state) => state.setRecipePhoto);

  useEffect(() => {
    for (const recipe of recipes) {
      if (hasRealPhoto(recipe.image) || asked.has(recipe.id)) continue;
      asked.add(recipe.id);
      const query = new URLSearchParams({ title: recipe.title, cuisine: recipe.cuisine });
      fetch(`/api/dish-photo?${query}`)
        .then((response) => (response.ok ? response.json() : null))
        .then((data: { photo?: DishPhoto | null } | null) => {
          if (data?.photo) setRecipePhoto(recipe.id, data.photo.url, data.photo.credit);
        })
        .catch(() => {});
    }
  }, [recipes, setRecipePhoto]);
}
