export type ProgressDomain =
  | 'literacy'
  | 'numeracy'
  | 'language'
  | 'science'
  | 'reasoning'
  | 'general';

export type ProgressAcademyId =
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

export interface ProgressAttempt {
  id: string;
  profileId: string;

  /**
   * Curriculum objective addressed by the activity.
   */
  objectiveId: string;

  /**
   * Specific activity that produced this attempt.
   */
  activityId: string;

  /**
   * Academy that owns the activity.
   */
  academyId: ProgressAcademyId;

  /**
   * Skills supported by this activity attempt.
   *
   * readonly allows curriculum metadata to be passed
   * without unsafe mutable-array conversions.
   */
  skillIds: readonly string[];

  /**
   * Primary competency domain.
   */
  domain: ProgressDomain;

  /**
   * Normalized score from 0–100.
   */
  score: number;

  /**
   * Stars awarded for this attempt.
   */
  stars: number;

  /**
   * Whether the activity was completed.
   */
  completed: boolean;

  /**
   * Unix timestamp in milliseconds.
   */
  completedAt: number;
}

const DB_NAME = 'early-learning-engine';
const DB_VERSION = 3;

const ATTEMPTS_STORE = 'progressAttempts';

const INDEX_BY_PROFILE = 'byProfile';
const INDEX_BY_OBJECTIVE = 'byObjective';
const INDEX_BY_ACTIVITY = 'byActivity';
const INDEX_BY_ACADEMY = 'byAcademy';
const INDEX_BY_COMPLETED_AT = 'byCompletedAt';

function assertIndexedDbAvailable(): void {
  if (typeof indexedDB === 'undefined') {
    throw new Error(
      'IndexedDB is not available in this environment.',
    );
  }
}

function normalizeScore(score: unknown): number {
  if (typeof score !== 'number' || !Number.isFinite(score)) {
    return 0;
  }

  return Math.min(Math.max(score, 0), 100);
}

function normalizeStars(stars: unknown): number {
  if (
    typeof stars !== 'number' ||
    !Number.isFinite(stars)
  ) {
    return 0;
  }

  return Math.max(0, Math.floor(stars));
}

function isProgressDomain(
  value: unknown,
): value is ProgressDomain {
  return (
    value === 'literacy' ||
    value === 'numeracy' ||
    value === 'language' ||
    value === 'science' ||
    value === 'reasoning' ||
    value === 'general'
  );
}

function isProgressAcademyId(
  value: unknown,
): value is ProgressAcademyId {
  return (
    value === 'language' ||
    value === 'maths' ||
    value === 'stem' ||
    value === 'digital' ||
    value === 'global' ||
    value === 'creative' ||
    value === 'life' ||
    value === 'finance' ||
    value === 'thinking' ||
    value === 'nature' ||
    value === 'islamic' ||
    value === 'montessori'
  );
}

function normalizeSkillIds(
  skillIds: unknown,
): readonly string[] {
  if (!Array.isArray(skillIds)) {
    return [];
  }

  return skillIds.filter(
    (skillId): skillId is string =>
      typeof skillId === 'string' &&
      skillId.trim().length > 0,
  );
}

function normalizeCompleted(
  completed: unknown,
  score: number,
): boolean {
  if (typeof completed === 'boolean') {
    return completed;
  }

  return score >= 60;
}

function normalizeCompletedAt(
  completedAt: unknown,
): number {
  if (
    typeof completedAt === 'number' &&
    Number.isFinite(completedAt)
  ) {
    return completedAt;
  }

  return Date.now();
}

/**
 * Normalizes records coming from IndexedDB.
 *
 * This is intentionally defensive because IndexedDB may contain
 * records written by an older version of the application.
 */
function normalizeAttempt(
  rawAttempt: Partial<ProgressAttempt> & {
    academyId?: unknown;
    skillIds?: unknown;
    domain?: unknown;
    completed?: unknown;
    score?: unknown;
    stars?: unknown;
    completedAt?: unknown;
  },
): ProgressAttempt {
  const score = normalizeScore(rawAttempt.score);

  return {
    id:
      typeof rawAttempt.id === 'string'
        ? rawAttempt.id
        : crypto.randomUUID(),

    profileId:
      typeof rawAttempt.profileId === 'string'
        ? rawAttempt.profileId
        : 'guest',

    objectiveId:
      typeof rawAttempt.objectiveId === 'string'
        ? rawAttempt.objectiveId
        : '',

    activityId:
      typeof rawAttempt.activityId === 'string'
        ? rawAttempt.activityId
        : '',

    /**
     * v2 records did not contain academyId.
     *
     * Nature is NOT assumed here. Legacy records are assigned
     * to general so we do not falsely attribute old evidence
     * to a specific academy.
     */
    academyId: isProgressAcademyId(
      rawAttempt.academyId,
    )
      ? rawAttempt.academyId
      : 'language',

    skillIds: normalizeSkillIds(
      rawAttempt.skillIds,
    ),

    domain: isProgressDomain(
      rawAttempt.domain,
    )
      ? rawAttempt.domain
      : 'general',

    score,

    stars: normalizeStars(
      rawAttempt.stars,
    ),

    completed: normalizeCompleted(
      rawAttempt.completed,
      score,
    ),

    completedAt: normalizeCompletedAt(
      rawAttempt.completedAt,
    ),
  };
}

/**
 * Opens the ELP progress database.
 *
 * Version 3:
 * - adds academyId to progress attempts
 * - adds academy index
 * - preserves existing attempts
 * - normalizes legacy records when read
 */
function database(): Promise<IDBDatabase> {
  assertIndexedDbAvailable();

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(
      DB_NAME,
      DB_VERSION,
    );

    request.onupgradeneeded = () => {
      const db = request.result;
      const transaction = request.transaction;

      if (!transaction) {
        reject(
          new Error(
            'Unable to access the IndexedDB upgrade transaction.',
          ),
        );
        return;
      }

      let store: IDBObjectStore;

      if (
        !db.objectStoreNames.contains(
          ATTEMPTS_STORE,
        )
      ) {
        store = db.createObjectStore(
          ATTEMPTS_STORE,
          {
            keyPath: 'id',
          },
        );
      } else {
        store =
          transaction.objectStore(
            ATTEMPTS_STORE,
          );
      }

      if (
        !store.indexNames.contains(
          INDEX_BY_PROFILE,
        )
      ) {
        store.createIndex(
          INDEX_BY_PROFILE,
          'profileId',
          {
            unique: false,
          },
        );
      }

      if (
        !store.indexNames.contains(
          INDEX_BY_OBJECTIVE,
        )
      ) {
        store.createIndex(
          INDEX_BY_OBJECTIVE,
          'objectiveId',
          {
            unique: false,
          },
        );
      }

      if (
        !store.indexNames.contains(
          INDEX_BY_ACTIVITY,
        )
      ) {
        store.createIndex(
          INDEX_BY_ACTIVITY,
          'activityId',
          {
            unique: false,
          },
        );
      }

      if (
        !store.indexNames.contains(
          INDEX_BY_ACADEMY,
        )
      ) {
        store.createIndex(
          INDEX_BY_ACADEMY,
          'academyId',
          {
            unique: false,
          },
        );
      }

      if (
        !store.indexNames.contains(
          INDEX_BY_COMPLETED_AT,
        )
      ) {
        store.createIndex(
          INDEX_BY_COMPLETED_AT,
          'completedAt',
          {
            unique: false,
          },
        );
      }
    };

    request.onsuccess = () => {
      const db = request.result;

      db.onversionchange = () => {
        db.close();
      };

      resolve(db);
    };

    request.onerror = () => {
      reject(
        request.error ??
          new Error(
            'Unable to open the ELP progress database.',
          ),
      );
    };

    request.onblocked = () => {
      reject(
        new Error(
          'The ELP progress database upgrade is blocked by another connection.',
        ),
      );
    };
  });
}

/**
 * Saves or updates a learner activity attempt.
 */
export async function saveAttempt(
  attempt: ProgressAttempt,
): Promise<void> {
  const db = await database();

  const normalizedAttempt =
    normalizeAttempt(attempt);

  try {
    await new Promise<void>(
      (resolve, reject) => {
        const transaction =
          db.transaction(
            ATTEMPTS_STORE,
            'readwrite',
          );

        const store =
          transaction.objectStore(
            ATTEMPTS_STORE,
          );

        store.put(normalizedAttempt);

        transaction.oncomplete = () => {
          resolve();
        };

        transaction.onerror = () => {
          reject(
            transaction.error ??
              new Error(
                'Unable to save the progress attempt.',
              ),
          );
        };

        transaction.onabort = () => {
          reject(
            transaction.error ??
              new Error(
                'Progress attempt transaction was aborted.',
              ),
          );
        };
      },
    );
  } finally {
    db.close();
  }
}

/**
 * Returns all attempts belonging to one learner profile.
 */
export async function getAttempts(
  profileId: string,
): Promise<ProgressAttempt[]> {
  const db = await database();

  try {
    return await new Promise<
      ProgressAttempt[]
    >((resolve, reject) => {
      const transaction =
        db.transaction(
          ATTEMPTS_STORE,
          'readonly',
        );

      const store =
        transaction.objectStore(
          ATTEMPTS_STORE,
        );

      const index =
        store.index(
          INDEX_BY_PROFILE,
        );

      const request =
        index.getAll(profileId);

      request.onsuccess = () => {
        resolve(
          request.result.map(
            (attempt) =>
              normalizeAttempt(attempt),
          ),
        );
      };

      request.onerror = () => {
        reject(
          request.error ??
            new Error(
              'Unable to retrieve learner progress.',
            ),
        );
      };
    });
  } finally {
    db.close();
  }
}

/**
 * Returns attempts for a specific academy
 * belonging to a learner profile.
 */
export async function getAcademyAttempts(
  profileId: string,
  academyId: ProgressAcademyId,
): Promise<ProgressAttempt[]> {
  const attempts =
    await getAttempts(profileId);

  return attempts.filter(
    (attempt) =>
      attempt.academyId === academyId,
  );
}

/**
 * Returns attempts for a specific activity
 * belonging to a learner profile.
 */
export async function getActivityAttempts(
  profileId: string,
  activityId: string,
): Promise<ProgressAttempt[]> {
  const attempts =
    await getAttempts(profileId);

  return attempts.filter(
    (attempt) =>
      attempt.activityId === activityId,
  );
}

/**
 * Returns the most recent attempt for an activity.
 */
export async function getLatestActivityAttempt(
  profileId: string,
  activityId: string,
): Promise<
  ProgressAttempt | undefined
> {
  const attempts =
    await getActivityAttempts(
      profileId,
      activityId,
    );

  return attempts.reduce<
    ProgressAttempt | undefined
  >((latest, attempt) => {
    if (
      !latest ||
      attempt.completedAt >
        latest.completedAt
    ) {
      return attempt;
    }

    return latest;
  }, undefined);
}

/**
 * Deletes all progress belonging to a learner profile.
 *
 * Useful for profile deletion or a deliberate
 * "reset learning progress" action.
 */
export async function clearAttempts(
  profileId: string,
): Promise<void> {
  const db = await database();

  try {
    await new Promise<void>(
      (resolve, reject) => {
        const transaction =
          db.transaction(
            ATTEMPTS_STORE,
            'readwrite',
          );

        const store =
          transaction.objectStore(
            ATTEMPTS_STORE,
          );

        const index =
          store.index(
            INDEX_BY_PROFILE,
          );

        const request =
          index.openCursor(
            IDBKeyRange.only(
              profileId,
            ),
          );

        request.onsuccess = () => {
          const cursor =
            request.result;

          if (!cursor) {
            return;
          }

          cursor.delete();
          cursor.continue();
        };

        request.onerror = () => {
          reject(
            request.error ??
              new Error(
                'Unable to clear learner progress.',
              ),
          );
        };

        transaction.oncomplete = () => {
          resolve();
        };

        transaction.onerror = () => {
          reject(
            transaction.error ??
              new Error(
                'Unable to clear learner progress.',
              ),
          );
        };

        transaction.onabort = () => {
          reject(
            transaction.error ??
              new Error(
                'Progress deletion was aborted.',
              ),
          );
        };
      },
    );
  } finally {
    db.close();
  }
}