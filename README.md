# CurryCue

CurryCue is an AI kitchen assistant built with **Next.js**. Tell it what is in your kitchen (type it, or scan it with the camera) and it suggests real recipes you can cook with it, walks you through them hands-free by voice, keeps your shopping list, and nudges you to use up food before it goes off.

Everything you add (pantry, shopping list, saved recipes, preferences) is stored in your own browser. There are no accounts and no database.

---

## Features

### Pantry, shopping list and use-it-up

* **Pantry:** add ingredients by hand (e.g. "Tomatoes – 1kg", "Onion – 2 nos.") with autocomplete, or scan a photo of your groceries. Duplicates merge and amounts add up.
* **Use-It-Up Tracker:**
  * Add an expiry date to any pantry item (quick presets, plus a typical shelf life for common foods).
  * Colour-coded badges show what is expired or about to expire.
  * A "Use these up soon" banner offers **Cook with these**: recipes are built around what is about to go off, and each recipe says which expiring items it uses up.
* **Smart Shopping List:**
  * Add what a recipe is missing in one tap; items already in your pantry are skipped.
  * Duplicates merge and amounts add up (250 gm + 100 gm = 350 gm, 500 ml + 1 l = 1.5 l).
  * Grouped by aisle, tick items off as you buy them, then move them into your pantry.
  * Copy the list or send it on WhatsApp.
* **Backup and restore:** download everything as a JSON file from the My Ingredients page, and restore it later or on another device. Restoring merges with what you already have and validates the file first.

### Recipes

* Suggestions based on your pantry, your preferences (diet, allergies, cuisine, skill, cooking time) and the cuisine you pick.
* Traditional, known dishes rather than invented ones. Basics like salt, oil and turmeric are assumed to be available.
* Each recipe shows what you have, what is assumed, and what is missing.
* Favourites and recently viewed recipes.
* **Dish photos (optional):** with a free `UNSPLASH_ACCESS_KEY`, recipes get a real photo found by dish name. A photo is only used when its description names the dish; otherwise the recipe keeps a neutral placeholder. The photographer is credited in the recipe view.

### Cooking mode

* Step-by-step view with timers, an ingredients panel and a cooking assistant chat for substitutions and questions.
* **Voice control:** say "next", "previous", "go to step 3", "repeat", "timer 5 minutes", "show ingredients" and more. The full list is on the `/cooking-commands` page. "exit cooking" is required to leave, so a stray word never ends your session.
* **Read-aloud:** steps are read with the browser's speech engine, preferring an English (India) voice where one is installed. Quantities and units are spoken naturally ("1/2 tsp" becomes "half a teaspoon").
* A celebration screen when you finish.

> Voice commands use the browser's Web Speech API, which works best in Chrome and Edge. Brave and Firefox block or lack it.

---

## Tech stack

* **Framework:** Next.js 16 (App Router, Turbopack), React 18, TypeScript
* **State:** Zustand with `persist` (localStorage)
* **Styling and UI:** Tailwind CSS v4, Radix UI, Framer Motion, Lucide icons, Sonner toasts
* **AI:** Groq (primary) and Google Gemini (fallback), called from server routes only so keys never reach the browser
* **Voice:** browser Web Speech API (recognition and synthesis)
* **Tests:** Node's built-in test runner via `tsx`

---

## Getting started

Requires Node 22 (pinned in `package.json` so Vercel does not jump to a new major on its own); Next 16 needs at least 20.9.

```bash
npm install
cp .env.example .env.local   # then add at least one API key
npm run dev                  # http://localhost:3000
```

### AI configuration

Which provider and which models are used is set in `.env.local`, not in code. See [`.env.example`](.env.example) for every option.

| Variable | Purpose |
| --- | --- |
| `GROQ_API_KEY` | Groq key (primary provider) |
| `GEMINI_API_KEY` | Gemini key (fallback) |
| `AI_PROVIDERS` | Order to try providers, default `groq,gemini`. A provider without a key is skipped |
| `GROQ_TEXT_MODELS`, `GROQ_VISION_MODELS`, `GEMINI_MODELS` | Optional comma-separated model lists, tried in order. Use these when a provider retires a model |
| `<NAME>_API_KEY`, `<NAME>_TEXT_MODELS`, `<NAME>_VISION_MODELS` | Add any other OpenAI-compatible provider (presets: cerebras, openrouter, together, mistral, openai) without code changes |
| `UNSPLASH_ACCESS_KEY` | Optional. Enables dish photos (see Recipes above) |
| `AI_RATE_LIMIT_PER_MIN`, `AI_SCAN_RATE_LIMIT_PER_MIN`, `AI_RATE_LIMIT_GLOBAL_PER_MIN` | Per-IP and global request limits so strangers cannot burn your quota. `0` disables |

If a model gets retired, run `npm run check:models` (add `-- --probe` to send real test requests) to see which names are missing, then update the model list in `.env.local`.

Never commit `.env.local`; it is gitignored.

---

## Scripts

```bash
npm run dev           # Start the development server
npm run build         # Build for production
npm run start         # Start the production server
npm run check         # Type check (tsc --noEmit)
npm test              # Run the unit tests
npm run lint          # ESLint (no errors; a few intentional warnings)
npm run check:models  # Verify the configured AI models exist (-- --probe to test them)
```

---

## Project structure

```
src/
├── app/          # Routes: home, ingredients, recipes, shopping-list, cooking, cooking-commands
│   └── api/      # ai (text), detect-ingredients (photo scan) and dish-photo, all rate limited
├── components/   # UI components
├── lib/          # Pure logic (matching, shopping list, expiry, backup, voice commands, speech text)
│   ├── server/   # AI dispatcher, providers, rate limiting (server only)
│   └── services/ # Recipe generation
├── store/        # Zustand stores
└── types/        # Shared TypeScript types
tests/            # Unit tests for the pure logic in src/lib
scripts/          # check-models
```

---

## Support

For bugs or feature requests, please raise issues on the repository.

> 💡 **Special thanks to [Creatr AI](https://creatrhq.xyz/)** for powering the AI and vibe coding experience that makes CurryCue magical!

> Happy Cooking with **CurryCue** 🍛✨
