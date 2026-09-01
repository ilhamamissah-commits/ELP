export interface ActivityCompletion {
  score: number;
  evidence?: Record<string, unknown>;
}

export interface ActivityProps {
  onComplete: (result: ActivityCompletion) => void;
  lessonId?: string;
}
