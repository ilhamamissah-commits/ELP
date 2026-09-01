export interface AssessmentResult {
  assessmentId: string;
  score: number;
  completed: boolean;
  evidence?: Record<string, unknown>;
  completedAt: number;
}

export interface AssessmentDefinition {
  id: string;
  masteryScore: number;
  evaluate: (score: number, evidence?: Record<string, unknown>) => AssessmentResult;
}
