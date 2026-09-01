import { Lesson } from '../types';

export const VOCABULARY_CURRICULUM: Lesson[] = [
  {
    id: 'voc-l1-basic',
    framework: 'cambridge-primary',
    ageGroup: '4-5',
    title: 'Word Explorer Level 1',
    description: 'Learn basic words and meanings',
    subject: 'vocabulary',
    skill: 'Basic Vocabulary',
    tags: ['Foundation', 'Vocabulary'],
    prerequisites: [],
    difficulty: 'sensorial',
    montessoriArea: 'Language',
    cambridgeStrand: 'Communication',
    activities: [{ id: 'act-voc-l1', type: 'identify', instructions: ['Read word'], successCriteria: ['Learns meaning'], componentId: 'VocabularyBuilder' }],
    assessment: { id: 'assess-voc-l1', type: 'score', masteryScore: 80 }
  },
  {
    id: 'voc-l2-advanced',
    framework: 'cambridge-primary',
    ageGroup: '5-6',
    title: 'Word Explorer Level 2',
    description: 'Expand your vocabulary',
    subject: 'vocabulary',
    skill: 'Advanced Vocabulary',
    tags: ['Level 1', 'Vocabulary'],
    prerequisites: ['voc-l1-basic'],
    difficulty: 'concrete',
    montessoriArea: 'Language',
    cambridgeStrand: 'Communication',
    activities: [{ id: 'act-voc-l2', type: 'identify', instructions: ['Read word'], successCriteria: ['Learns meaning'], componentId: 'VocabularyBuilder' }],
    assessment: { id: 'assess-voc-l2', type: 'score', masteryScore: 80 }
  }
];