export interface RewardAward {
  stars: number;
  badge?: 'mastery' | 'complete';
}

export function awardForScore(score: number): RewardAward {
  if (score >= 90) return { stars: 3, badge: 'mastery' };
  if (score >= 70) return { stars: 2, badge: 'complete' };
  return { stars: 1 };
}
