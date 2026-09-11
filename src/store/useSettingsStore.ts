import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppTheme = 'dark' | 'light' | 'high-contrast';
export type TextSize = 'small' | 'medium' | 'large';
export type VoiceAccent = 'auto' | 'en-US' | 'en-GB' | 'en-AU' | 'en-IN';

interface SettingsState {
  theme: AppTheme;
  textSize: TextSize;
  soundEnabled: boolean;
  musicEnabled: boolean;
  reduceMotion: boolean;
  voiceAccent: VoiceAccent;
  autoReadEnabled: boolean;

  setTheme: (theme: AppTheme) => void;
  setTextSize: (size: TextSize) => void;
  toggleSound: () => void;
  toggleMusic: () => void;
  toggleReduceMotion: () => void;
  setVoiceAccent: (accent: VoiceAccent) => void;
  toggleAutoRead: () => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      textSize: 'medium',
      soundEnabled: true,
      musicEnabled: false,
      reduceMotion: false,
      voiceAccent: 'auto',
      autoReadEnabled: false,

      setTheme: (theme) => set({ theme }),
      setTextSize: (textSize) => set({ textSize }),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      toggleMusic: () => set((s) => ({ musicEnabled: !s.musicEnabled })),
      toggleReduceMotion: () => set((s) => ({ reduceMotion: !s.reduceMotion })),
      setVoiceAccent: (voiceAccent) => set({ voiceAccent }),
      toggleAutoRead: () => set((s) => ({ autoReadEnabled: !s.autoReadEnabled })),

      resetSettings: () =>
        set({
          theme: 'dark',
          textSize: 'medium',
          soundEnabled: true,
          musicEnabled: false,
          reduceMotion: false,
          voiceAccent: 'auto',
          autoReadEnabled: false,
        }),
    }),
    { name: 'app-settings-storage' }
  )
);