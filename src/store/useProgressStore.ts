import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SkillLog {
  id: string;
  completed: boolean;
  attempts: number;
  bestScore: number;
  stars: number;
  lastReviewed: number; // timestamp for SM-2 algorithm
}

interface ProgressState {
  childAge: number;
  childName: string;
  totalStars: number;
  skills: Record<string, SkillLog>;
  setProfile: (age: number, name: string) => void;
  completeActivity: (id: string, score: number) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      childAge: 5,
      childName: 'Explorer',
      totalStars: 0,
      skills: {},
      
      setProfile: (age, name) => set({ childAge: age, childName: name }),
      
      completeActivity: (id, score) => set((state) => {
        const existing = state.skills[id];
        // Star logic (3 stars for mastery, 2 for passing, 1 for attempt)
        const stars = score >= 90 ? 3 : score >= 70 ? 2 : 1;
        
        return {
          totalStars: state.totalStars + stars,
          skills: {
            ...state.skills,
            [id]: {
              id,
              completed: score >= 60,
              attempts: (existing?.attempts || 0) + 1,
              bestScore: Math.max(existing?.bestScore || 0, score),
              stars: Math.max(existing?.stars || 0, stars),
              lastReviewed: Date.now()
            }
          }
        };
      })
    }),
    { name: 'early-learning-storage' }
  )
);