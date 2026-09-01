import { LearningObjective } from '../types';

export interface LeveledLearningObjective extends LearningObjective {
  level: number;
  prerequisiteId?: string;
}

export const MATHS_CURRICULUM: LeveledLearningObjective[] = [
  {
    id: 'math-l1-counting', // Level 1: Start here (Sensorial)
    level: 1,
    prerequisiteId: undefined,
    ageGroup: '2-3', // Deprecated, but kept for backwards compat
    subject: 'maths',
    skill: 'One-to-One Counting (1-10)',
    difficulty: 'sensorial',
    montessoriArea: 'Mathematics',
    cambridgeStrand: 'Numeracy',
    activities: [
      { 
        id: 'act-math-l1', 
        type: 'calculate', 
        instructions: ['Count the objects', 'Match to the correct number'], 
        successCriteria: ['Counts objects 1-5 accurately'],
        componentId: 'GoldenBeads' // Uses the free explore mode
      }
    ]
  },
  {
    id: 'math-l2-placevalue', // Level 2: Concrete understanding
    level: 2,
    prerequisiteId: 'math-l1-counting',
    ageGroup: '4-5', 
    subject: 'maths',
    skill: 'Place Value (Units, Tens, Hundreds)',
    difficulty: 'concrete',
    montessoriArea: 'Mathematics',
    cambridgeStrand: 'Numeracy',
    activities: [
      { 
        id: 'act-math-l2', 
        type: 'calculate', 
        instructions: ['Build the target number using Golden Beads'], 
        successCriteria: ['Matches the target value'],
        componentId: 'GoldenBeads'
      }
    ]
  },
  {
    id: 'math-l3-operations', // Level 3: Abstract operations
    level: 3,
    prerequisiteId: 'math-l2-placevalue',
    ageGroup: '6-7',
    subject: 'maths',
    skill: 'Addition & Subtraction',
    difficulty: 'abstract',
    montessoriArea: 'Mathematics',
    cambridgeStrand: 'Numeracy',
    activities: [
      { 
        id: 'act-math-l3', 
        type: 'calculate', 
        instructions: ['Use the plus and minus buttons to solve the problem'], 
        successCriteria: ['Correctly solves addition/subtraction'],
        componentId: 'NumberOperations'
      }
    ]
  },
  {
    id: 'math-l4-writing', // Level 4: Mastery / Symbolic
    level: 4,
    prerequisiteId: 'math-l3-operations',
    ageGroup: '7-8',
    subject: 'maths',
    skill: 'Writing Numbers & Mental Math',
    difficulty: 'mental',
    montessoriArea: 'Mathematics',
    cambridgeStrand: 'Numeracy',
    activities: [
      { 
        id: 'act-math-l4', 
        type: 'calculate', 
        instructions: ['Trace the numbers', 'Solve mental math sums'], 
        successCriteria: ['Writes numbers accurately'],
        componentId: 'TracingNumbers'
      }
    ]
  }
];