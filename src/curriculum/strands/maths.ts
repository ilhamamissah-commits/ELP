import { LearningObjective } from '../types';

export const MATHS_CURRICULUM: LearningObjective[] = [
  {
    id: 'math-beads-1',
    ageGroup: '4-5',
    subject: 'maths',
    skill: 'Place Value (Units, Tens, Hundreds)',
    difficulty: 'concrete',
    montessoriArea: 'Mathematics',
    cambridgeStrand: 'Numeracy',
    activities: [
      { 
        id: 'act-3', 
        type: 'calculate', 
        instructions: ['Build the target number using Golden Beads'], 
        successCriteria: ['Matches the target value'],
        componentId: 'GoldenBeads' 
      }
    ]
  }
];