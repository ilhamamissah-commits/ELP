import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Learning levels
 *
 * Age does NOT determine a learner's level.
 * Level is determined by placement + demonstrated mastery.
 */
export type LearningLevel = 1 | 2 | 3 | 4 | 5;

export type PlacementStatus =
  | 'not_started'
  | 'in_progress'
  | 'completed';

export interface LearnerSkills {
  literacy: number;
  numeracy: number;
  language: number;
  science: number;
  reasoning: number;
}

/**
 * Individual learner profile.
 */
export interface LearnerProfile {
  name: string;

  /**
   * Age is contextual information only.
   * It must NOT be used to determine the learner's level.
   */
  age: number;

  avatar: string;

  /**
   * The level the placement assessment originally
   * recommended for the learner.
   */
  startingLevel: LearningLevel;

  /**
   * The learner's current academic level.
   *
   * This changes as the learner demonstrates mastery.
   */
  currentLevel: LearningLevel;

  /**
   * Placement assessment state.
   */
  placementStatus: PlacementStatus;

  /**
   * Overall placement score from 0–100.
   */
  placementScore: number;

  /**
   * Current mastery by learning domain.
   *
   * Values are percentages from 0–100.
   */
  skills: LearnerSkills;

  /**
   * Lessons completed by this learner.
   */
  completedLessons: string[];

  /**
   * Skills the learner has demonstrated mastery in.
   */
  masteredSkills: string[];

  /**
   * Timestamp for when the profile was created.
   */
  createdAt: string;

  /**
   * Timestamp for the learner's latest activity.
   */
  lastActiveAt: string;
}

interface ProfileState {
  currentProfileId: string;

  profiles: Record<string, LearnerProfile>;

  setCurrentProfile: (id: string) => void;

  addProfile: (
    id: string,
    name: string,
    age: number,
    avatar: string,
    startingLevel?: LearningLevel,
    placementScore?: number
  ) => void;

  removeProfile: (id: string) => void;

  /**
   * Update any part of a learner's profile.
   */
  updateProfile: (
    id: string,
    updates: Partial<LearnerProfile>
  ) => void;

  /**
   * Change the learner's current level.
   */
  setCurrentLevel: (
    id: string,
    level: LearningLevel
  ) => void;

  /**
   * Record the result of placement.
   */
  completePlacement: (
    id: string,
    level: LearningLevel,
    score: number,
    skills?: Partial<LearnerSkills>
  ) => void;

  /**
   * Update one or more skill mastery percentages.
   */
  updateSkills: (
    id: string,
    skills: Partial<LearnerSkills>
  ) => void;

  /**
   * Mark a lesson as completed.
   */
  completeLesson: (
    id: string,
    lessonId: string
  ) => void;

  /**
   * Mark a skill as mastered.
   */
  masterSkill: (
    id: string,
    skillId: string
  ) => void;
}

const DEFAULT_SKILLS: LearnerSkills = {
  literacy: 0,
  numeracy: 0,
  language: 0,
  science: 0,
  reasoning: 0,
};

const clampPercentage = (value: number): number => {
  return Math.min(100, Math.max(0, value));
};

const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      currentProfileId: '',

      profiles: {},

      /**
       * Set the active learner.
       */
      setCurrentProfile: (id) =>
        set((state) => {
          const profile = state.profiles[id];

          if (!profile) {
            return {
              currentProfileId: id,
            };
          }

          return {
            currentProfileId: id,

            profiles: {
              ...state.profiles,

              [id]: {
                ...profile,
                lastActiveAt: getCurrentTimestamp(),
              },
            },
          };
        }),

      /**
       * Create a new learner profile.
       *
       * New learners start at Level 1 unless
       * placement determines another starting level.
       */
      addProfile: (
        id,
        name,
        age,
        avatar,
        startingLevel = 1,
        placementScore = 0
      ) =>
        set((state) => {
          const now = getCurrentTimestamp();

          const profile: LearnerProfile = {
            name: name.trim() || 'Explorer',

            age: age || 3,

            avatar,

            startingLevel,

            currentLevel: startingLevel,

            placementStatus:
              placementScore > 0
                ? 'completed'
                : 'not_started',

            placementScore: clampPercentage(
              placementScore
            ),

            skills: {
              ...DEFAULT_SKILLS,
            },

            completedLessons: [],

            masteredSkills: [],

            createdAt: now,

            lastActiveAt: now,
          };

          return {
            profiles: {
              ...state.profiles,
              [id]: profile,
            },

            currentProfileId: id,
          };
        }),

      /**
       * Remove a learner profile.
       */
      removeProfile: (id) =>
        set((state) => {
          const newProfiles = {
            ...state.profiles,
          };

          delete newProfiles[id];

          /**
           * If the deleted learner was active,
           * automatically clear the active profile.
           */
          const nextCurrentProfileId =
            state.currentProfileId === id
              ? ''
              : state.currentProfileId;

          return {
            profiles: newProfiles,
            currentProfileId:
              nextCurrentProfileId,
          };
        }),

      /**
       * Update arbitrary learner information.
       */
      updateProfile: (id, updates) =>
        set((state) => {
          const profile = state.profiles[id];

          if (!profile) {
            return state;
          }

          return {
            profiles: {
              ...state.profiles,

              [id]: {
                ...profile,
                ...updates,
                lastActiveAt:
                  getCurrentTimestamp(),
              },
            },
          };
        }),

      /**
       * Move a learner to another learning level.
       */
      setCurrentLevel: (id, level) =>
        set((state) => {
          const profile = state.profiles[id];

          if (!profile) {
            return state;
          }

          return {
            profiles: {
              ...state.profiles,

              [id]: {
                ...profile,

                currentLevel: level,

                lastActiveAt:
                  getCurrentTimestamp(),
              },
            },
          };
        }),

      /**
       * Complete placement assessment.
       */
      completePlacement: (
        id,
        level,
        score,
        skills = {}
      ) =>
        set((state) => {
          const profile = state.profiles[id];

          if (!profile) {
            return state;
          }

          return {
            profiles: {
              ...state.profiles,

              [id]: {
                ...profile,

                startingLevel: level,

                currentLevel: level,

                placementStatus: 'completed',

                placementScore:
                  clampPercentage(score),

                skills: {
                  ...profile.skills,

                  ...Object.fromEntries(
                    Object.entries(skills).map(
                      ([key, value]) => [
                        key,
                        clampPercentage(
                          value ?? 0
                        ),
                      ]
                    )
                  ),
                },

                lastActiveAt:
                  getCurrentTimestamp(),
              },
            },
          };
        }),

      /**
       * Update learner mastery.
       */
      updateSkills: (id, skills) =>
        set((state) => {
          const profile = state.profiles[id];

          if (!profile) {
            return state;
          }

          const updatedSkills: LearnerSkills = {
            ...profile.skills,
          };

          Object.entries(skills).forEach(
            ([key, value]) => {
              if (
                key in updatedSkills &&
                typeof value === 'number'
              ) {
                updatedSkills[
                  key as keyof LearnerSkills
                ] = clampPercentage(value);
              }
            }
          );

          return {
            profiles: {
              ...state.profiles,

              [id]: {
                ...profile,

                skills: updatedSkills,

                lastActiveAt:
                  getCurrentTimestamp(),
              },
            },
          };
        }),

      /**
       * Mark a lesson as completed.
       */
      completeLesson: (id, lessonId) =>
        set((state) => {
          const profile = state.profiles[id];

          if (!profile) {
            return state;
          }

          const alreadyCompleted =
            profile.completedLessons.includes(
              lessonId
            );

          return {
            profiles: {
              ...state.profiles,

              [id]: {
                ...profile,

                completedLessons:
                  alreadyCompleted
                    ? profile.completedLessons
                    : [
                        ...profile.completedLessons,
                        lessonId,
                      ],

                lastActiveAt:
                  getCurrentTimestamp(),
              },
            },
          };
        }),

      /**
       * Mark a skill as mastered.
       */
      masterSkill: (id, skillId) =>
        set((state) => {
          const profile = state.profiles[id];

          if (!profile) {
            return state;
          }

          const alreadyMastered =
            profile.masteredSkills.includes(
              skillId
            );

          return {
            profiles: {
              ...state.profiles,

              [id]: {
                ...profile,

                masteredSkills:
                  alreadyMastered
                    ? profile.masteredSkills
                    : [
                        ...profile.masteredSkills,
                        skillId,
                      ],

                lastActiveAt:
                  getCurrentTimestamp(),
              },
            },
          };
        }),
    }),

    {
      name: 'profile-storage',

      /**
       * This version number helps us handle future
       * profile schema migrations.
       */
      version: 2,

      /**
       * IMPORTANT:
       * Existing profiles created with the old store
       * will not contain the new fields.
       *
       * The migration below upgrades them safely.
       */
      migrate: (persistedState: any, version) => {
        if (version < 2) {
          const oldProfiles =
            persistedState?.profiles || {};

          const migratedProfiles: Record<
            string,
            LearnerProfile
          > = {};

          Object.entries(oldProfiles).forEach(
            ([id, oldProfile]: [string, any]) => {
              const now =
                getCurrentTimestamp();

              migratedProfiles[id] = {
                name:
                  oldProfile.name ||
                  'Explorer',

                age:
                  oldProfile.age || 3,

                avatar:
                  oldProfile.avatar ||
                  '🌍',

                /**
                 * Existing users begin at Level 1
                 * until they complete the new placement.
                 */
                startingLevel: 1,

                currentLevel: 1,

                placementStatus:
                  'not_started',

                placementScore: 0,

                skills: {
                  ...DEFAULT_SKILLS,
                },

                completedLessons: [],

                masteredSkills: [],

                createdAt:
                  oldProfile.createdAt ||
                  now,

                lastActiveAt: now,
              };
            }
          );

          return {
            ...persistedState,

            profiles:
              migratedProfiles,

            currentProfileId:
              persistedState?.currentProfileId ||
              '',
          };
        }

        return persistedState;
      },
    }
  )
);
