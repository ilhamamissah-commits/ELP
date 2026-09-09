import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  /** Application appearance */
  isDarkMode: boolean;

  /** General sound effects */
  isSoundEnabled: boolean;

  /** Automatically play instructional audio */
  isAutoPlayAudio: boolean;

  /**
   * Personalised Islamic learning/content mode.
   *
   * This does not control access to Islamic Studies.
   * Islamic Studies remains an independent academy.
   */
  isIslamicMode: boolean;

  toggleDarkMode: () => void;
  toggleSound: () => void;
  toggleAutoPlay: () => void;
  toggleIslamicMode: () => void;

  setDarkMode: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setAutoPlayAudio: (enabled: boolean) => void;
  setIslamicMode: (enabled: boolean) => void;

  resetSettings: () => void;
}

const DEFAULT_SETTINGS = {
  isDarkMode: true,
  isSoundEnabled: true,
  isAutoPlayAudio: false,
  isIslamicMode: false,
};

export const useSettingsStore =
  create<SettingsState>()(
    persist(
      (set) => ({
        ...DEFAULT_SETTINGS,

        toggleDarkMode: () =>
          set((state) => ({
            isDarkMode: !state.isDarkMode,
          })),

        toggleSound: () =>
          set((state) => ({
            isSoundEnabled:
              !state.isSoundEnabled,
          })),

        toggleAutoPlay: () =>
          set((state) => ({
            isAutoPlayAudio:
              !state.isAutoPlayAudio,
          })),

        toggleIslamicMode: () =>
          set((state) => ({
            isIslamicMode:
              !state.isIslamicMode,
          })),

        setDarkMode: (enabled) =>
          set({
            isDarkMode: enabled,
          }),

        setSoundEnabled: (enabled) =>
          set({
            isSoundEnabled: enabled,
          }),

        setAutoPlayAudio: (enabled) =>
          set({
            isAutoPlayAudio: enabled,
          }),

        setIslamicMode: (enabled) =>
          set({
            isIslamicMode: enabled,
          }),

        resetSettings: () =>
          set({
            ...DEFAULT_SETTINGS,
          }),
      }),
      {
        name: 'settings-storage',
      }
    )
  );
