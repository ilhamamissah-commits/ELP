import { LearningObjective } from '../types';

// UPDATE: Updated the type definition to support Level and Prerequisites
// (We will update types.ts to match this in the next step)
export interface LeveledLearningObjective extends LearningObjective {
  level: number;
  prerequisiteId?: string;
}

export const ABACUS_CURRICULUM: LeveledLearningObjective[] = [
  {
    id: 'aba-l1-beads', // Level 1: The absolute starting point
    level: 1,
    prerequisiteId: undefined,
    ageGroup: '2-3', // Deprecated, but keep for backwards compatibility
    subject: 'abacus',
    skill: 'Bead Recognition & Number Setting',
    difficulty: 'sensorial', // Lowest difficulty
    montessoriArea: 'Mathematics',
    cambridgeStrand: 'Numeracy',
    activities: [
      { 
        id: 'act-aba-l1', 
        type: 'calculate', 
        instructions: ['Look at the number', 'Tap the beads to set that number'], 
        successCriteria: ['Correctly sets 0-9 on the abacus'],
        componentId: 'AbacusWidget' 
      }
    ]
  },
  {
    id: 'aba-l2-addition', // Level 2: Progress from Level 1
    level: 2,
    prerequisiteId: 'aba-l1-beads', // Must complete Level 1 first
    ageGroup: '4-5', 
    subject: 'abacus',
    skill: 'Single Digit Addition (1-9)',
    difficulty: 'concrete', // Now using concrete objects
    montessoriArea: 'Mathematics',
    cambridgeStrand: 'Numeracy',
    activities: [
      { 
        id: 'act-aba-l2', 
        type: 'calculate', 
        instructions: ['Add 2 + 3 on the abacus'], 
        successCriteria: ['Correctly solves single digit addition'],
        componentId: 'AbacusWidget' 
      }
    ]
  },
  {
    id: 'aba-l3-subtraction', // Level 3: More abstract
    level: 3,
    prerequisiteId: 'aba-l2-addition',
    ageGroup: '5-6',
    subject: 'abacus',
    skill: 'Single Digit Subtraction',
    difficulty: 'abstract',
    montessoriArea: 'Mathematics',
    cambridgeStrand: 'Numeracy',
    activities: [
      { 
        id: 'act-aba-l3', 
        type: 'calculate', 
        instructions: ['Subtract 5 - 2 on the abacus'], 
        successCriteria: ['Correctly solves single digit subtraction'],
        componentId: 'AbacusWidget' 
      }
    ]
  },
  {
    id: 'aba-l4-mental', // Level 4: The advanced mastery level
    level: 4,
    prerequisiteId: 'aba-l3-subtraction',
    ageGroup: '6-7',
    subject: 'abacus',
    skill: 'Mental Math (Anzan)',
    difficulty: 'mental', // Highest difficulty - visualization
    montessoriArea: 'Mathematics',
    cambridgeStrand: 'Numeracy',
    activities: [
      { 
        id: 'act-aba-l4', 
        type: 'calculate', 
        instructions: ['Visualize the abacus in your mind'], 
        successCriteria: ['Correctly solves mental math problems'],
        componentId: 'AbacusWidget' 
      }
    ]
  }
];