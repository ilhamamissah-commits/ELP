export type AgeGroup = '2-3' | '3-4' | '4-5' | '5-6' | '6-7' | '7-8' | '8-9' | '9-10';
export type Subject = 'english' | 'science' | 'maths' | 'abacus';
export type Difficulty = 'sensorial' | 'concrete' | 'abstract' | 'mental';
export type ActivityType = 'match' | 'sequence' | 'construct' | 'identify' | 'calculate' | 'experiment';

export interface Activity {
  id: string;
  type: ActivityType;
  instructions: string[];
  successCriteria: string[];
  componentId: string; // Maps to the React component (e.g., 'GoldenBeads')
}

export interface LearningObjective {
  id: string;
  ageGroup: AgeGroup;
  subject: Subject;
  skill: string;
  difficulty: Difficulty;
  montessoriArea?: string;
  cambridgeStrand?: string;
  activities: Activity[];
}