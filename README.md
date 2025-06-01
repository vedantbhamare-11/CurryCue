# CurryCue

CurryCue is your smart AI-powered kitchen assistant built using **Next.js** and enhanced with real-time AI capabilities. It helps you manage groceries, discover authentic recipes, and cook hands-free using voice interaction, image scanning, and AI-generated suggestions.

---

## 🚀 Features

### 🛒 Grocery & Ingredient Management

* **Ingredient Sync from Grocery Apps:**
  * Seamlessly sync ingredients from grocery apps like Blinkit or Instamart.
  * Automatically recognizes and categorizes items.
* **Manual Ingredient Entry:**
  * Users can add ingredients manually (e.g., "Tomatoes – 1kg" or "Onion – 2 nos.").
* **Ingredient Scanning:**
  * Scan grocery bags to update kitchen inventory using the camera.
* **Smart Suggestions on Entry:**
  * Autocomplete with quantity variants (e.g., Tomato (250g), Tomato (1kg)).
* **Auto-detect Bundled Items:**
  * Smart detection of common units like "2 nos." and grams.

---

### 🍛 Recipe Discovery & Generation

* **Personalized Suggestions:**
  * Recipes based on your current inventory, preferences, and selected cuisine.
* **Cuisine Filters:**
  * Choose from Indian, South Indian, Chinese, Italian, etc.
* **Dietary Filters:**
  * Toggle Veg / Non-Veg dynamically.
* **Partial Ingredient Usage:**
  * Recipes generated using a subset of your available ingredients.
* **Verified Recipes Only:**
  * No AI-invented dishes. Only traditional, authentic, and community-loved ones.
* **Staple Ingredients Assumed:**
  * Basics like salt, oil, and turmeric are assumed always available.

---

### 🧠 AI + Habit Building

* **Celebratory Popups:**
  * Visual feedback like "Looks Yummy!" on dish completion.
* **Conversational Recipe Suggestions:**
  * Chatbot interface to suggest recipes and substitution tips.

---

### 🔜 Coming Soon

1. Full onboarding flow
2. Sync grocery list directly to shopping app
3. Recipe triggers (e.g., "You can cook Pasta today!")
4. Voice input for hands-free recipe walkthroughs

---

## 🛠️ Tech Stack

* **Framework** : Next.js
* **State Management** : Zustand
* **Styling** : TailwindCSS
* **Animation** : Framer Motion
* **UI Libraries** : Radix UI, Geist, Lucide Icons, CMDK
* **Data Management** : Drizzle ORM + SQLite/Postgres
* **AI Services** :
* Text & Vision: Claude Bedrock, Azure GPT-4o
* TTS: ElevenLabs
* Image Generation: Stability AI

> 💡 **Special thanks to [Creatr AI](https://creatrhq.xyz/)** for powering the AI and vibe coding experience that makes CurryCue magical!

---

## 📦 Key Dependencies

```json
{
  "next": "^15.0.1",
  "react": "^18.3.1",
  "zustand": "^5.0.5",
  "@google/generative-ai": "^0.24.1",
  "@tailwindcss/postcss": "^4.1.7",
  "framer-motion": "^12.15.0",
  "radix-ui": "^1.4.2",
  "lucide-react": "^0.511.0",
  "sonner": "^2.0.4",
  "react-hook-form": "^7.56.4",
  "react-webcam": "^7.2.0",
  "recharts": "^2.15.0"
}
```

---

## 📡 AI Integration Overview

### Text Generation

* Prompt-based response using configured providers
* Streaming and non-streaming modes supported

### Vision + Text

* Vision-enabled prompting (text + images)
* Used for ingredient detection, visual recipe suggestions

### Text-To-Speech (TTS)

* ElevenLabs integration for hands-free cooking instructions
* Supports multiple voices (Aria, Will, Lily, etc.)

---

## 🧩 Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run check      # Lint + Type check
npm run db:generate # Drizzle DB migration
```

---

## 📁 Folder Structure Highlights

```
├── app/             # App directory for Next.js routing
├── components/      # UI Components
├── lib/             # Utility functions (includes AI logic)
├── store/           # Zustand stores
├── styles/          # Tailwind config and global styles
├── types/           # TypeScript type definitions
```

---

## 🧠 Configurable Providers

```ts
availableProviders: {
  text: ["claude-bedrock", "azure-gpt-4o", "azure-gpt-4o-o3-mini"],
  visionEnabled: ["claude-bedrock", "azure-gpt-4o"],
  stability: ["stability-ai"],
  elevenlabsTTS: ["elevenlabs-tts"]
}
```

---

## 📞 Support

For bugs or feature requests, please raise issues on the repository.

> Happy Cooking with **CurryCue** 🍛✨
>
