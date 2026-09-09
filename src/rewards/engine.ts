export type RewardBadge =
  | 'mastery'
  | 'complete';

export interface RewardAward {
  stars: number;
  badge?: RewardBadge;
}

const MAX_SCORE = 100;
const MIN_SCORE = 0;

/**
 * Keeps scores within the valid ELP range.
 */
function normalizeScore(score: number): number {
  if (!Number.isFinite(score)) {
    return 0;
  }

  return Math.min(
    Math.max(score, MIN_SCORE),
    MAX_SCORE,
  );
}

/**
 * Determines the immediate reward earned from an activity score.
 *
 * Reward thresholds:
 * 90–100 → 3 stars + Mastery badge
 * 70–89  → 2 stars + Complete badge
 * 0–69   → 1 star
 *
 * Rewards do not determine curriculum level or skill mastery.
 * Those decisions belong to the Learning Engine/progress system.
 */
export function awardForScore(
  score: number,
): RewardAward {
  const normalizedScore = normalizeScore(score);

  if (normalizedScore >= 90) {
    return {
      stars: 3,
      badge: 'mastery',
    };
  }

  if (normalizedScore >= 70) {
    return {
      stars: 2,
      badge: 'complete',
    };
  }

  return {
    stars: 1,
  };
}
