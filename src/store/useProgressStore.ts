import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { awardForScore } from '../rewards/engine';
import {
  getAttempts,
  saveAttempt,
} from '../progress/indexedDb';

export type SkillDomain =
  | 'literacy'
  | 'numeracy'
  | 'language'
  | 'science'
  | 'reasoning'
  | 'general';

export type AcademyId =
  | 'language'
  | 'maths'
  | 'stem'
  | 'digital'
  | 'global'
  | 'creative'
  | 'life'
  | 'finance'
  | 'thinking'
  | 'nature'
  | 'islamic'
  | 'montessori';

export type SkillMasteryStatus =
  | 'developing'
  | 'practicing'
  | 'mastered';

/**
 * Activity-level performance.
 *
 * An activity is evidence of learning.
 * It is NOT itself a curriculum skill.
 */
export interface SkillLog {
  id: string;

  /** Academy that owns the activity */
  academyId: AcademyId;

  /** Primary learning domain */
  domain: SkillDomain;

  /** Skills evidenced by this activity */
  skillIds: readonly string[];

  /** Whether the activity has been completed */
  completed: boolean;

  /** Number of recorded attempts */
  attempts: number;

  /** Highest score achieved */
  bestScore: number;

  /** Highest star result achieved */
  stars: number;

  /** Most recent attempt timestamp */
  lastReviewed: number;
}

/**
 * Aggregated mastery information for one competency.
 *
 * This is derived from activity evidence rather than
 * being independently persisted as curriculum truth.
 */
export interface SkillMastery {
  skillId: string;
  domain: SkillDomain;
  academyIds: readonly AcademyId[];
  activityIds: readonly string[];
  score: number;
  status: SkillMasteryStatus;
  attempts: number;
  lastReviewed: number;
}

/**
 * New activity completion API.
 *
 * academyId is intentionally required.
 *
 * This prevents an activity from silently being assigned
 * to the wrong academy.
 */
export interface CompleteActivityInput {
  id: string;
  score: number;
  academyId: AcademyId;
  domain?: SkillDomain;
  skillIds?: readonly string[];
}

interface ProgressState {
  /**
   * Active learner identity.
   *
   * Identity belongs to useProfileStore.
   * This ID only determines whose activity
   * history is loaded.
   */
  activeProfileId: string;

  /**
   * Activity-level performance.
   *
   * The property name is retained for compatibility
   * with existing ELP UI components.
   */
  skills: Record<string, SkillLog>;

  /** Total stars earned by the active learner */
  totalStars: number;

  /**
   * Change active learner and rebuild activity
   * performance from IndexedDB.
   */
  setActiveProfile: (
    profileId: string,
  ) => Promise<void>;

  /**
   * Record a completed activity.
   *
   * New code should use this object API.
   */
  completeActivity: (
    input: CompleteActivityInput,
  ) => void;

  /**
   * Legacy positional API retained temporarily
   * while existing ELP activities migrate.
   */
  completeActivityLegacy: (
    id: string,
    score: number,
    domain?: SkillDomain,
  ) => void;

  /** Remove all in-memory progress */
  clearProgress: () => void;

  /** Get mastery status for a competency */
  getSkillStatus: (
    skillId: string,
  ) => SkillMasteryStatus;

  /** Get complete aggregated mastery for a competency */
  getSkillMastery: (
    skillId: string,
  ) => SkillMastery | undefined;

  /** Get all aggregated skill mastery */
  getAllSkillMastery: () => readonly SkillMastery[];

  /** Calculate average mastery across unique skills */
  getAverageMastery: () => number;

  /** Number of mastered unique skills */
  getMasteredSkillCount: () => number;

  /** Get activities belonging to an academy */
  getAcademyActivities: (
    academyId: AcademyId,
  ) => readonly SkillLog[];

  /** Get activities belonging to a domain */
  getDomainActivities: (
    domain: SkillDomain,
  ) => readonly SkillLog[];
}

const clampScore = (
  score: number,
): number => {
  if (!Number.isFinite(score)) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(0, score),
  );
};

const getMasteryStatus = (
  score: number,
): SkillMasteryStatus => {
  if (score >= 80) {
    return 'mastered';
  }

  if (score >= 50) {
    return 'practicing';
  }

  return 'developing';
};

const normalizeSkillIds = (
  skillIds:
    | readonly string[]
    | undefined,
): readonly string[] => {
  if (
    !skillIds ||
    skillIds.length === 0
  ) {
    return [];
  }

  return Array.from(
    new Set(
      skillIds.filter(
        (skillId) =>
          typeof skillId === 'string' &&
          skillId.trim().length > 0,
      ),
    ),
  );
};

const createEmptyActivity = (
  id: string,
  academyId: AcademyId,
  domain: SkillDomain = 'general',
  skillIds: readonly string[] = [],
): SkillLog => ({
  id,
  academyId,
  domain,
  skillIds:
    normalizeSkillIds(skillIds),
  completed: false,
  attempts: 0,
  bestScore: 0,
  stars: 0,
  lastReviewed: 0,
});

/**
 * Builds competency mastery from activity evidence.
 *
 * A skill can be supported by multiple activities
 * and potentially multiple academies.
 */
const buildSkillMastery = (
  activities: readonly SkillLog[],
): readonly SkillMastery[] => {
  const skillMap = new Map<
    string,
    {
      domain: SkillDomain;
      academyIds: Set<AcademyId>;
      activityIds: Set<string>;
      scores: number[];
      attempts: number;
      lastReviewed: number;
    }
  >();

  activities.forEach(
    (activity) => {
      activity.skillIds.forEach(
        (skillId) => {
          const existing =
            skillMap.get(skillId);

          if (existing) {
            existing.academyIds.add(
              activity.academyId,
            );

            existing.activityIds.add(
              activity.id,
            );

            existing.scores.push(
              activity.bestScore,
            );

            existing.attempts +=
              activity.attempts;

            existing.lastReviewed =
              Math.max(
                existing.lastReviewed,
                activity.lastReviewed,
              );

            return;
          }

          skillMap.set(skillId, {
            domain:
              activity.domain,

            academyIds:
              new Set([
                activity.academyId,
              ]),

            activityIds:
              new Set([
                activity.id,
              ]),

            scores: [
              activity.bestScore,
            ],

            attempts:
              activity.attempts,

            lastReviewed:
              activity.lastReviewed,
          });
        },
      );
    },
  );

  return Array.from(
    skillMap.entries(),
  ).map(
    ([skillId, data]) => {
      /**
       * A skill may be demonstrated through
       * several activities.
       *
       * The strongest demonstrated score is
       * currently used as the mastery score.
       *
       * The Learning Engine can later replace
       * this with a weighted mastery model.
       */
      const score =
        data.scores.length > 0
          ? Math.max(
              ...data.scores,
            )
          : 0;

      return {
        skillId,

        domain:
          data.domain,

        academyIds:
          Array.from(
            data.academyIds,
          ),

        activityIds:
          Array.from(
            data.activityIds,
          ),

        score,

        status:
          getMasteryStatus(score),

        attempts:
          data.attempts,

        lastReviewed:
          data.lastReviewed,
      };
    },
  );
};

export const useProgressStore =
  create<ProgressState>()(
    persist(
      (set, get) => ({
        activeProfileId: 'guest',

        skills: {},

        totalStars: 0,

        setActiveProfile:
          async (
            profileId,
          ) => {
            const attempts =
              await getAttempts(
                profileId,
              );

            const activities: Record<
              string,
              SkillLog
            > = {};

            attempts.forEach(
              (attempt) => {
                const existing =
                  activities[
                    attempt.objectiveId
                  ];

                const normalizedScore =
                  clampScore(
                    attempt.score,
                  );

                const bestScore =
                  Math.max(
                    existing?.bestScore ??
                      0,
                    normalizedScore,
                  );

                const stars =
                  Math.max(
                    existing?.stars ??
                      0,
                    attempt.stars,
                  );

                const attemptSkillIds =
                  normalizeSkillIds(
                    attempt.skillIds,
                  );

                const domain =
                  attempt.domain;

                const academyId =
                  attempt.academyId;

                const mergedSkillIds =
                  normalizeSkillIds([
                    ...(existing?.skillIds ??
                      []),
                    ...attemptSkillIds,
                  ]);

                activities[
                  attempt.objectiveId
                ] = {
                  id:
                    attempt.objectiveId,

                  academyId,

                  domain,

                  skillIds:
                    mergedSkillIds,

                  completed:
                    Boolean(
                      existing?.completed ||
                        attempt.completed ||
                        bestScore >= 60,
                    ),

                  attempts:
                    (existing?.attempts ??
                      0) + 1,

                  bestScore,

                  stars,

                  lastReviewed:
                    Math.max(
                      existing?.lastReviewed ??
                        0,
                      attempt.completedAt,
                    ),
                };
              },
            );

            const totalStars =
              attempts.reduce(
                (
                  total,
                  attempt,
                ) =>
                  total +
                  Math.max(
                    0,
                    attempt.stars,
                  ),
                0,
              );

            set({
              activeProfileId:
                profileId,

              skills:
                activities,

              totalStars,
            });
          },

        completeActivity:
          ({
            id,
            score,
            academyId,
            domain = 'general',
            skillIds = [],
          }) =>
            set((state) => {
              const normalizedScore =
                clampScore(score);

              const normalizedSkillIds =
                normalizeSkillIds(
                  skillIds,
                );

              const existing =
                state.skills[id] ??
                createEmptyActivity(
                  id,
                  academyId,
                  domain,
                  normalizedSkillIds,
                );

              /**
               * Academy ownership is explicit.
               *
               * Existing activities retain their
               * original academy when the caller
               * supplies the same activity again.
               */
              const resolvedAcademyId =
                existing.academyId ===
                academyId
                  ? existing.academyId
                  : academyId;

              const resolvedDomain =
                domain !== 'general'
                  ? domain
                  : existing.domain;

              const resolvedSkillIds =
                normalizedSkillIds.length >
                0
                  ? normalizeSkillIds([
                      ...existing.skillIds,
                      ...normalizedSkillIds,
                    ])
                  : existing.skillIds;

              const {
                stars,
              } =
                awardForScore(
                  normalizedScore,
                );

              const now =
                Date.now();

              const bestScore =
                Math.max(
                  existing.bestScore,
                  normalizedScore,
                );

              const completed =
                bestScore >= 60;

              /**
               * IndexedDB stores the detailed
               * attempt history.
               */
              void saveAttempt({
                id:
                  crypto.randomUUID(),

                profileId:
                  state.activeProfileId,

                objectiveId:
                  id,

                activityId:
                  id,

                academyId:
                  resolvedAcademyId,

                score:
                  normalizedScore,

                stars,

                completedAt:
                  now,

                skillIds:
                  resolvedSkillIds,

                domain:
                  resolvedDomain,

                completed,
              });

              return {
                totalStars:
                  state.totalStars +
                  stars,

                skills: {
                  ...state.skills,

                  [id]: {
                    id,

                    academyId:
                      resolvedAcademyId,

                    domain:
                      resolvedDomain,

                    skillIds:
                      resolvedSkillIds,

                    completed,

                    attempts:
                      existing.attempts +
                      1,

                    bestScore,

                    stars:
                      Math.max(
                        existing.stars,
                        stars,
                      ),

                    lastReviewed:
                      now,
                  },
                },
              };
            }),

        completeActivityLegacy:
          (
            id,
            score,
            domain = 'general',
          ) => {
            /**
             * Temporary compatibility path.
             *
             * Existing activities that have not yet
             * been migrated are treated as Language
             * rather than being incorrectly attributed
             * to Nature.
             *
             * New activities MUST use completeActivity()
             * and provide academyId explicitly.
             */
            get().completeActivity({
              id,
              score,
              academyId: 'language',
              domain,
            });
          },

        clearProgress:
          () =>
            set({
              skills: {},
              totalStars: 0,
            }),

        getSkillStatus:
          (skillId) => {
            const mastery =
              get().getSkillMastery(
                skillId,
              );

            if (!mastery) {
              return 'developing';
            }

            return mastery.status;
          },

        getSkillMastery:
          (skillId) => {
            const mastery =
              buildSkillMastery(
                Object.values(
                  get().skills,
                ),
              );

            return mastery.find(
              (skill) =>
                skill.skillId ===
                skillId,
            );
          },

        getAllSkillMastery:
          () =>
            buildSkillMastery(
              Object.values(
                get().skills,
              ),
            ),

        getAverageMastery:
          () => {
            const mastery =
              buildSkillMastery(
                Object.values(
                  get().skills,
                ),
              );

            if (
              mastery.length === 0
            ) {
              return 0;
            }

            const total =
              mastery.reduce(
                (
                  sum,
                  skill,
                ) =>
                  sum +
                  skill.score,
                0,
              );

            return Math.round(
              total /
                mastery.length,
            );
          },

        getMasteredSkillCount:
          () =>
            buildSkillMastery(
              Object.values(
                get().skills,
              ),
            ).filter(
              (skill) =>
                skill.status ===
                'mastered',
            ).length,

        getAcademyActivities:
          (academyId) =>
            Object.values(
              get().skills,
            ).filter(
              (activity) =>
                activity.academyId ===
                academyId,
            ),

        getDomainActivities:
          (domain) =>
            Object.values(
              get().skills,
            ).filter(
              (activity) =>
                activity.domain ===
                domain,
            ),
      }),

      {
        name:
          'learning-progress-storage',

        version: 3,

        /**
         * Preserve existing persisted
         * activity performance during
         * the Zustand store upgrade.
         */
        migrate:
          (
            persistedState,
          ) => {
            if (
              !persistedState ||
              typeof persistedState !==
                'object'
            ) {
              return {
                activeProfileId:
                  'guest',

                skills: {},

                totalStars: 0,
              };
            }

            const state =
              persistedState as Partial<ProgressState>;

            const persistedSkills =
              state.skills ?? {};

            const normalizedSkills:
              Record<
                string,
                SkillLog
              > = {};

            Object.entries(
              persistedSkills,
            ).forEach(
              ([id, rawActivity]) => {
                if (
                  !rawActivity ||
                  typeof rawActivity !==
                    'object'
                ) {
                  return;
                }

                const activity =
                  rawActivity as Partial<SkillLog>;

                /**
                 * Old persisted activity records
                 * did not contain academyId.
                 *
                 * They are temporarily assigned
                 * to language for compatibility.
                 * Fresh IndexedDB evidence remains
                 * the authoritative source once the
                 * profile is reloaded.
                 */
                const academyId =
                  activity.academyId ??
                  'language';

                const domain =
                  activity.domain ??
                  'general';

                const skillIds =
                  normalizeSkillIds(
                    activity.skillIds,
                  );

                normalizedSkills[id] = {
                  id:
                    typeof activity.id ===
                    'string'
                      ? activity.id
                      : id,

                  academyId,

                  domain,

                  skillIds,

                  completed:
                    Boolean(
                      activity.completed,
                    ),

                  attempts:
                    typeof activity.attempts ===
                    'number'
                      ? Math.max(
                          0,
                          Math.floor(
                            activity.attempts,
                          ),
                        )
                      : 0,

                  bestScore:
                    typeof activity.bestScore ===
                    'number'
                      ? clampScore(
                          activity.bestScore,
                        )
                      : 0,

                  stars:
                    typeof activity.stars ===
                    'number'
                      ? Math.max(
                          0,
                          Math.floor(
                            activity.stars,
                          ),
                        )
                      : 0,

                  lastReviewed:
                    typeof activity.lastReviewed ===
                    'number'
                      ? activity.lastReviewed
                      : 0,
                };
              },
            );

            return {
              activeProfileId:
                typeof state.activeProfileId ===
                'string'
                  ? state.activeProfileId
                  : 'guest',

              skills:
                normalizedSkills,

              totalStars:
                typeof state.totalStars ===
                'number'
                  ? Math.max(
                      0,
                      state.totalStars,
                    )
                  : 0,
            };
          },
      },
    ),
  );