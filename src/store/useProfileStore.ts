import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProfileState {
  currentProfileId: string; // Changed from string | null to just string
  profiles: Record<string, { name: string; age: number; avatar: string }>;
  setCurrentProfile: (id: string) => void;
  addProfile: (id: string, name: string, age: number, avatar: string) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      currentProfileId: "", // Default to empty string instead of null
      profiles: {},
      
      setCurrentProfile: (id) => set({ currentProfileId: id }),
      
      addProfile: (id, name, age, avatar) => set((state) => ({
        profiles: {
          ...state.profiles,
          [id]: { name, age, avatar }
        },
        currentProfileId: id
      }))
    }),
    { name: 'profile-storage' }
  )
);