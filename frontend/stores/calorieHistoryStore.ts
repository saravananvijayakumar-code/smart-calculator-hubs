import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CalorieHistoryItem {
  food: string;
  calories: number;
  weight: number;
  timestamp: string;
  source?: 'camera' | 'manual';
}

interface CalorieHistoryStore {
  history: CalorieHistoryItem[];
  addToHistory: (item: CalorieHistoryItem) => void;
  clearHistory: () => void;
}

export const useCalorieHistoryStore = create<CalorieHistoryStore>()(
  persist(
    (set) => ({
      history: [],
      addToHistory: (item) =>
        set((state) => ({
          history: [item, ...state.history].slice(0, 5),
        })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'calorie-history-storage',
    }
  )
);
