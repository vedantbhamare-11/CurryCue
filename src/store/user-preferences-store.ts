import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserPreferences } from '@/types';

interface UserPreferencesState {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
}

const defaultPreferences: UserPreferences = {
  dietaryRestrictions: [],
  allergies: [],
  cuisinePreferences: [],
  skillLevel: 'intermediate',
  mealTypes: ['dinner', 'lunch'],
  cookingTime: {
    min: 0,
    max: 60
  }
};

export const useUserPreferencesStore = create<UserPreferencesState>()(
  persist(
    (set) => ({
      preferences: defaultPreferences,
      updatePreferences: (updates) => 
        set((state) => ({ 
          preferences: { ...state.preferences, ...updates } 
        })),
      resetPreferences: () => set({ preferences: defaultPreferences }),
    }),
    {
      name: 'user-preferences-storage',
    }
  )
);
