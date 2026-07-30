import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  isDarkMode: boolean;
  isSoundEnabled: boolean;
  isAutoPlayAudio: boolean;
  isIslamicMode: boolean; // <--- NEW
  toggleDarkMode: () => void;
  toggleSound: () => void;
  toggleAutoPlay: () => void;
  toggleIslamicMode: () => void; // <--- NEW
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      isDarkMode: true,
      isSoundEnabled: true,
      isAutoPlayAudio: false,
      isIslamicMode: false, // Default is off
      
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      toggleSound: () => set((state) => ({ isSoundEnabled: !state.isSoundEnabled })),
      toggleAutoPlay: () => set((state) => ({ isAutoPlayAudio: !state.isAutoPlayAudio })),
      toggleIslamicMode: () => set((state) => ({ isIslamicMode: !state.isIslamicMode })),
    }),
    { name: 'settings-storage' }
  )
);