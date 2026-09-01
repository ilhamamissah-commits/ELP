import { AssessmentDefinition } from './types';

export function createScoreAssessment(id: string, masteryScore = 80): AssessmentDefinition {
  return {
    id,
    masteryScore,
    evaluate: (score, evidence) => ({
      assessmentId: id,
      score: Math.max(0, Math.min(100, Math.round(score))),
      completed: score >= masteryScore,
      evidence,
      completedAt: Date.now()
    })
  };
}
