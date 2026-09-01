import { LearningObjective } from '../types';

export interface LeveledLearningObjective extends LearningObjective {
  level: number;
  prerequisiteId?: string;
}

export const ENGLISH_CURRICULUM: LeveledLearningObjective[] = [
  {
    id: 'eng-l1-phonics', // Level 1: The starting point (Sensorial)
    level: 1,
    prerequisiteId: undefined,
    ageGroup: '2-3', // Deprecated, but kept for backwards compat
    subject: 'english',
    skill: 'Sound Awareness (SATPIN)',
    difficulty: 'sensorial',
    montessoriArea: 'Language',
    cambridgeStrand: 'Communication',
    activities: [
      { 
        id: 'act-eng-l1', 
        type: 'match', 
        instructions: ['Listen to the sound', 'Tap the matching card'], 
        successCriteria: ['Correctly identifies 3/3 sounds'],
        componentId: 'SoundLottery' 
      }
    ]
  },
  {
    id: 'eng-l2-wordfamilies', // Level 2: Progress from Level 1
    level: 2,
    prerequisiteId: 'eng-l1-phonics', // Must pass phonics first
    ageGroup: '4-5', 
    subject: 'english',
    skill: 'Word Families (at, an, ig)',
    difficulty: 'concrete',
    montessoriArea: 'Language',
    cambridgeStrand: 'Communication',
    activities: [
      { 
        id: 'act-eng-l2', 
        type: 'match', 
        instructions: ['Find the words that belong to the family'], 
        successCriteria: ['Selects all correct words'],
        componentId: 'WordFamilies' 
      }
    ]
  },
  {
    id: 'eng-l3-sentences', // Level 3: Abstract reasoning
    level: 3,
    prerequisiteId: 'eng-l2-wordfamilies',
    ageGroup: '5-6', 
    subject: 'english',
    skill: 'Sentence Construction',
    difficulty: 'abstract',
    montessoriArea: 'Language',
    cambridgeStrand: 'Communication',
    activities: [
      { 
        id: 'act-eng-l3', 
        type: 'construct', 
        instructions: ['Drag the words into the correct order'], 
        successCriteria: ['Correct Subject-Verb order'],
        componentId: 'SentenceBuilder' 
      }
    ]
  },
  {
    id: 'eng-l4-vocabulary', // Level 4: Mastery / Advanced
    level: 4,
    prerequisiteId: 'eng-l3-sentences',
    ageGroup: '6-7',
    subject: 'english',
    skill: 'Vocabulary Expansion',
    difficulty: 'mental',
    montessoriArea: 'Language',
    cambridgeStrand: 'Communication',
    activities: [
      { 
        id: 'act-eng-l4', 
        type: 'identify', 
        instructions: ['Learn new words and their meanings'], 
        successCriteria: ['Correctly identifies word meanings'],
        componentId: 'VocabularyBuilder' 
      }
    ]
  }
];