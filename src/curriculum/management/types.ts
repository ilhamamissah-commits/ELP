import { ActivityType, CurriculumFramework, Difficulty, Subject } from '../types';

export type StageId = 'ages-2-4' | 'ages-5-7' | 'ages-8-10';

export interface CurriculumSubject {
  id: Subject;
  title: string;
  framework: CurriculumFramework | 'cross-framework';
  description: string;
  sortOrder: number;
}

export interface CurriculumStage {
  id: StageId;
  title: string;
  minAge: number;
  maxAge: number;
  sortOrder: number;
}

export interface CurriculumUnit {
  id: string;
  subjectId: Subject;
  stageId: StageId;
  title: string;
  description: string;
  sortOrder: number;
}

export interface ManagedLesson {
  id: string;
  unitId: string;
  title: string;
  description: string;
  skill: string;
  difficulty: Difficulty;
  framework: CurriculumFramework;
  tags: string[];
  prerequisiteLessonIds: string[];
  sortOrder: number;
  published: boolean;
}

export interface ManagedActivity {
  id: string;
  lessonId: string;
  title: string;
  type: ActivityType;
  rendererId: string;
  instructions: string[];
  successCriteria: string[];
  sortOrder: number;
}

export interface ManagedAssessment {
  id: string;
  lessonId: string;
  title: string;
  type: 'completion' | 'score' | 'observation' | 'rubric';
  masteryScore: number;
}

/** A serializable, normalized format that is practical for JSON, IndexedDB, or a future API. */
export interface CurriculumDataset {
  subjects: CurriculumSubject[];
  stages: CurriculumStage[];
  units: CurriculumUnit[];
  lessons: ManagedLesson[];
  activities: ManagedActivity[];
  assessments: ManagedAssessment[];
}

export interface LessonBundle {
  lesson: ManagedLesson;
  unit: CurriculumUnit;
  subject: CurriculumSubject;
  stage: CurriculumStage;
  activities: ManagedActivity[];
  assessment?: ManagedAssessment;
}

export interface LessonQuery {
  subjectId?: Subject;
  stageId?: StageId;
  unitId?: string;
  publishedOnly?: boolean;
  limit?: number;
  offset?: number;
}
