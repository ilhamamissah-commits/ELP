import { LearningObjective } from '../types';

export const SCIENCE_CURRICULUM: LearningObjective[] = [
  {
    id: 'sci-lab-1',
    ageGroup: '5-6',
    subject: 'science',
    skill: 'Plant Life Cycle',
    difficulty: 'concrete',
    montessoriArea: 'Cultural',
    cambridgeStrand: 'Science',
    activities: [
      { 
        id: 'act-4', 
        type: 'sequence', 
        instructions: ['Follow the steps to grow a plant'], 
        successCriteria: ['Completes the experiment'],
        componentId: 'VirtualLab' 
      }
    ]
  }
];