import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { awardForScore } from '../rewards/engine';
import { getAttempts, saveAttempt } from '../progress/indexedDb';
import { PresentationProfile, presentationProfileForAge } from '../curriculum/progression';

export interface SkillLog {
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
  activeProfileId: string;
  presentationProfile: PresentationProfile;
  totalStars: number;
  skills: Record<string, SkillLog>;
  setProfile: (age: number, name: string) => void;
  setActiveProfile: (profileId: string) => Promise<void>;
  completeActivity: (id: string, score: number) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      childAge: 5,
      childName: 'Explorer',
      activeProfileId: 'guest',
      presentationProfile: 'developing-learner',
      totalStars: 0,
      skills: {},
      
      setProfile: (age, name) => set({ childAge: age, childName: name, presentationProfile: presentationProfileForAge(age) }),
      setActiveProfile: async (profileId) => {
        const attempts = await getAttempts(profileId);
        const skills: Record<string, SkillLog> = {};
        let totalStars = 0;
        attempts.forEach((attempt) => {
          const existing = skills[attempt.objectiveId];
          skills[attempt.objectiveId] = {
            id: attempt.objectiveId,
            completed: attempt.score >= 60,
            attempts: (existing?.attempts || 0) + 1,
            bestScore: Math.max(existing?.bestScore || 0, attempt.score),
            stars: Math.max(existing?.stars || 0, attempt.stars),
            lastReviewed: attempt.completedAt
          };
          totalStars += attempt.stars;
        });
        set({ activeProfileId: profileId, skills, totalStars });
      },
      
      completeActivity: (id, score) => set((state) => {
        const existing = state.skills[id];
        // Star logic (3 stars for mastery, 2 for passing, 1 for attempt)
        const { stars } = awardForScore(score);
        void saveAttempt({
          id: crypto.randomUUID(),
          profileId: state.activeProfileId,
          objectiveId: id,
          activityId: id,
          score,
          stars,
          completedAt: Date.now()
        });
        
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
