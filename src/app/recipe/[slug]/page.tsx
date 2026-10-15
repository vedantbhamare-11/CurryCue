import type { Metadata } from 'next';
import Link from 'next/link';
import { SharedRecipeView } from '@/components/shared-recipe-view';
import { decodeRecipe } from '@/lib/share-recipe';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function recipeFromLink(searchParams: Props['searchParams']) {
  const value = (await searchParams).d;
  return decodeRecipe(Array.isArray(value) ? value[0] : value);
}

// The title and description in the preview card that chat apps show when the link is pasted. Those apps read
// the page's HTML without running scripts, which is why the recipe is decoded here on the server.
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const recipe = await recipeFromLink(searchParams);
  // Anyone can make a link, so search engines should not index them
  const robots = { index: false, follow: false };
  if (!recipe) return { title: 'Shared recipe', robots };

  const facts = [recipe.cuisine, recipe.cookTime ? `${recipe.cookTime} min` : '', recipe.difficulty].filter(Boolean).join(' · ');
  const description = recipe.description ? `${recipe.description} (${facts})` : `${facts}. ${recipe.ingredients.length} ingredients, ${recipe.steps.length} steps.`;
  return {
    title: recipe.title,
    description,
    robots,
    openGraph: { title: recipe.title, description, type: 'article', siteName: 'CurryCue' },
    twitter: { card: 'summary', title: recipe.title, description },
  };
}

export default async function SharedRecipePage({ searchParams }: Props) {
  const recipe = await recipeFromLink(searchParams);
  if (!recipe) {
    return (
      <main className="min-h-dvh flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold">This recipe link doesn&apos;t work</h1>
          <p className="text-muted-foreground">It may have been cut short when it was copied. Ask the sender to share it again.</p>
          <Link href="/" className="inline-block rounded-lg bg-primary px-5 py-2.5 text-primary-foreground hover:bg-primary/90 transition-colors">Go to CurryCue</Link>
        </div>
      </main>
    );
  }
  return <SharedRecipeView recipe={recipe} />;
}
