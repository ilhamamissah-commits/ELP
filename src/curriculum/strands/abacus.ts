import { LearningObjective } from '../types';

export const ABACUS_CURRICULUM: LearningObjective[] = [
  {
    id: 'math-abacus-1',
    ageGroup: '6-7',
    subject: 'abacus',
    skill: 'Bead Manipulation & 5-complements',
    difficulty: 'concrete',
    montessoriArea: 'Mathematics',
    cambridgeStrand: 'Numeracy',
    activities: [
      { 
        id: 'act-5', 
        type: 'calculate', 
        instructions: ['Move the beads to solve the sum'], 
        successCriteria: ['Correctly solves the math'],
        componentId: 'AbacusWidget' 
      }
    ]
  }
];