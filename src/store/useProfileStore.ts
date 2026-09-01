import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProfileState {
  currentProfileId: string;
  profiles: Record<string, { name: string; age: number; avatar: string }>;
  setCurrentProfile: (id: string) => void;
  addProfile: (id: string, name: string, age: number, avatar: string) => void;
  removeProfile: (id: string) => void; // <--- NEW
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      currentProfileId: "",
      profiles: {},
      
      setCurrentProfile: (id) => set({ currentProfileId: id }),
      
      addProfile: (id, name, age, avatar) => set((state) => ({
        profiles: {
          ...state.profiles,
          [id]: { name, age, avatar }
        },
        currentProfileId: id
      })),
      
      // NEW: Remove a profile
      removeProfile: (id) => set((state) => {
        const newProfiles = { ...state.profiles };
        delete newProfiles[id];
        return { profiles: newProfiles, currentProfileId: "" }; // Also logs out if deleted
      })
    }),
    { name: 'profile-storage' }
  )
);