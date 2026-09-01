import { createScoreAssessment } from '../assessments/engine';
import { AssessmentResult } from '../assessments/types';
import { Lesson } from '../curriculum/types';
import { ActivityCompletion } from '../activities/types';
import { RewardAward, awardForScore } from '../rewards/engine';

export interface LessonSessionResult {
  lessonId: string;
  activityId: string;
  assessment: AssessmentResult;
  reward: RewardAward;
}

/** Turns an activity outcome into curriculum evidence without coupling UI to storage. */
export function evaluateLessonActivity(lesson: Lesson, completion: ActivityCompletion): LessonSessionResult {
  const assessment = createScoreAssessment(lesson.assessment.id, lesson.assessment.masteryScore);
  const activity = lesson.activities[0];
  return {
    lessonId: lesson.id,
    activityId: activity.id,
    assessment: assessment.evaluate(completion.score, completion.evidence),
    reward: awardForScore(completion.score)
  };
}
