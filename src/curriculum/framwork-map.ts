export const FRAMEWORK_MAP: Record<string, string> = {
  // --- ENGLISH ---
  'eng-l1-phonics': 'Phonics Sound Lottery',
  'eng-l2-wordfamilies': 'Word Families Challenge',
  'eng-l3-sentences': 'Sentence Construction',
  'eng-l4-vocabulary': 'Vocabulary Explorer',

  // --- MATHS ---
  'math-l1-counting': 'Golden Beads Counting',
  'math-l2-placevalue': 'Place Value (Golden Beads)',
  'math-l3-operations': 'Number Operations',
  'math-l4-writing': 'Tracing Numbers',

  // --- SCIENCE ---
  'sci-l1-senses': '5 Senses Observation',
  'sci-l2-biology': 'Biology Lab',
  'sci-l3-physics': 'Physics Experiments',
  'sci-l4-earth': 'Earth Science Lab',

  // --- ABACUS ---
  'aba-l1-beads': 'Soroban Bead Basics',
  'aba-l2-addition': 'Soroban Addition',
  'aba-l3-subtraction': 'Soroban Subtraction',
  'aba-l4-mental': 'Mental Abacus (Anzan)',

  // --- VOCABULARY ---
  'voc-l1-basic': 'Basic Vocabulary Builder',
  'voc-l2-advanced': 'Advanced Vocabulary Builder',

  // --- PRACTICAL LIFE ---
  'pl-l1-hands': 'Washing Hands Steps',
  'pl-l2-plant': 'Planting Seeds Guide',

  // --- ART ---
  'art-l1-mixing': 'Color Mixing Studio',
  'art-l2-drawing': 'Drawing Basics',

  // --- GEOGRAPHY ---
  'geo-l1-continents': 'Globe Continents',
  'geo-l2-countries': 'Globe Countries & Capitals',

  // --- SENSORIAL ---
  'sen-l1-tower': 'Pink Tower Sorting'
};

// Helper function to get a friendly name for an ID
export function getFrameworkName(id: string): string {
  return FRAMEWORK_MAP[id] || 'Unknown Activity';
}