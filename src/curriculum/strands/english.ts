import { LearningObjective } from '../types';

export const ENGLISH_CURRICULUM: LearningObjective[] = [
  {
    id: 'eng-phonics-1',
    ageGroup: '2-3',
    subject: 'english',
    skill: 'Sound Awareness (SATPIN)',
    difficulty: 'sensorial',
    montessoriArea: 'Language',
    cambridgeStrand: 'Communication',
    activities: [
      { 
        id: 'act-1', 
        type: 'match', 
        instructions: ['Listen to the sound', 'Tap the matching card'], 
        successCriteria: ['Correctly identifies 3/3 sounds'],
        componentId: 'SoundLottery' 
      }
    ]
  },
  {
    id: 'eng-sentences-1',
    ageGroup: '5-6',
    subject: 'english',
    skill: 'Sentence Construction',
    difficulty: 'concrete',
    montessoriArea: 'Language',
    cambridgeStrand: 'Communication',
    activities: [
      { 
        id: 'act-2', 
        type: 'construct', 
        instructions: ['Drag the words into the correct order'], 
        successCriteria: ['Correct Subject-Verb order'],
        componentId: 'SentenceBuilder' 
      }
    ]
  }
];