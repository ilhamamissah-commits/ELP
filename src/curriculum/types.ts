export type AgeGroup = '2-3' | '3-4' | '4-5' | '5-6' | '6-7' | '7-8' | '8-9' | '9-10';

export type CurriculumFramework =
  | 'montessori'
  | 'cambridge-primary'
  | 'cambridge-global-perspectives'
  | 'computing-digital-literacy'
  | 'advanced-abacus';

export type Subject =
  | 'english'
  | 'maths'
  | 'science'
  | 'abacus'
  | 'vocabulary'
  | 'digital-literacy'
  | 'practical-life'
  | 'sensorial'
  | 'geography'
  | 'art'
  | 'global-perspectives'
  | 'computing';

export type Difficulty = 'sensorial' | 'concrete' | 'abstract' | 'mental';
export type ActivityType = 'match' | 'sequence' | 'construct' | 'identify' | 'calculate' | 'experiment' | 'create' | 'explore';

export interface ActivityRef {
  id: string;
  type: ActivityType;
  instructions: string[];
  successCriteria: string[];
  componentId: string; // Maps to the React component
}

export interface AssessmentRef {
  id: string;
  type: 'completion' | 'score' | 'observation' | 'rubric';
  masteryScore: number;
}

export interface LearningObjective {
  id: string;
  framework?: CurriculumFramework;
  ageGroup: AgeGroup;
  subject: Subject;
  skill: string;
  difficulty: Difficulty;
  title?: string;
  description?: string;
  tags?: string[];
  prerequisites?: string[];
  montessoriArea?: string;
  cambridgeStrand?: string;
  activities: ActivityRef[];
  assessment?: AssessmentRef;
}

export interface Lesson extends Omit<LearningObjective, 'framework' | 'title' | 'description' | 'tags' | 'assessment'> {
  framework: CurriculumFramework;
  title: string;
  description: string;
  tags: string[];
  assessment: AssessmentRef;
  status?: 'complete' | 'available' | 'locked';
}