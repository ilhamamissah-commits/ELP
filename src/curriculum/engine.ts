import { AgeGroup, LearningObjective, Subject } from './types';
import { ENGLISH_CURRICULUM } from './strands/english';
import { MATHS_CURRICULUM } from './strands/maths';
import { SCIENCE_CURRICULUM } from './strands/science';
import { ABACUS_CURRICULUM } from './strands/abacus';

// Combine all subjects into one master registry
const MASTER_CURRICULUM: LearningObjective[] = [
  ...ENGLISH_CURRICULUM,
  ...MATHS_CURRICULUM,
  ...SCIENCE_CURRICULUM,
  ...ABACUS_CURRICULUM
];

export function ageToGroup(age: number): AgeGroup {
  if (age <= 3) return '2-3';
  if (age <= 4) return '3-4';
  if (age <= 5) return '4-5';
  if (age <= 6) return '5-6';
  if (age <= 7) return '6-7';
  if (age <= 8) return '7-8';
  if (age <= 9) return '8-9';
  return '9-10';
}

// The actual function your App will use to find lessons
export function getObjectivesForAge(age: number, subject?: Subject): LearningObjective[] {
  const group = ageToGroup(age);
  return MASTER_CURRICULUM.filter(o => 
    o.ageGroup === group && 
    (!subject || o.subject === subject)
  );
}

// Helper to get an objective by specific ID
export function getObjectiveById(id: string): LearningObjective | undefined {
  return MASTER_CURRICULUM.find(o => o.id === id);
}