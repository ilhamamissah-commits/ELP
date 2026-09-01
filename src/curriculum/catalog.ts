export type Subject = 
  | 'english' 
  | 'maths' 
  | 'science' 
  | 'abacus' 
  | 'vocabulary' 
  | 'practical-life' 
  | 'art' 
  | 'geography' 
  | 'sensorial';

export type Difficulty = 'sensorial' | 'concrete' | 'abstract' | 'mental';
export type ActivityType = 'match' | 'sequence' | 'construct' | 'identify' | 'calculate' | 'experiment';

export interface Activity {
  id: string;
  type: ActivityType;
  instructions: string[];
  successCriteria: string[];
  componentId: string; // Maps to the React component
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  skill: string;
  level: number; // NEW: Progression level (1 is easiest, 10 is hardest)
  prerequisiteId?: string; // NEW: Must complete this lesson first
  difficulty: Difficulty;
  montessoriArea?: string;
  cambridgeStrand?: string;
  activities: Activity[];
}

// Deprecated - Kept for backwards compatibility, but no longer used for access control
export type AgeGroup = '2-3' | '3-4' | '4-5' | '5-6' | '6-7' | '7-8' | '8-9' | '9-10';