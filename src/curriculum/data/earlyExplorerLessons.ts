import { Lesson } from '../types';

const assessment = { id: 'early-explorer-score', type: 'score' as const, masteryScore: 70 };
const lesson = (id: string, subject: Lesson['subject'], title: string, description: string, skill: string, montessoriArea: string, cambridgeStrand: string): Lesson => ({
  id, framework: 'montessori', ageGroup: '2-3', subject, title, description, skill, difficulty: 'sensorial', tags: ['Early Explorer', 'Foundation'], montessoriArea, cambridgeStrand,
  activities: [{ id: `${id}-activity`, type: 'match', componentId: 'EarlyExplorerActivity', instructions: ['Listen to the voice instruction.', 'Tap one large picture.'], successCriteria: ['Choose or sequence the activity correctly.'] }], assessment
});

export const EARLY_EXPLORER_LESSONS: Lesson[] = [
  lesson('early-practical-washing', 'practical-life', 'Washing Hands', 'Learn a gentle hand-washing routine', 'Self care', 'Practical Life', 'Personal, Social and Emotional Development'),
  lesson('early-practical-dressing', 'practical-life', 'Getting Dressed', 'Put clothes on in a calm sequence', 'Independence', 'Practical Life', 'Personal, Social and Emotional Development'),
  lesson('early-practical-cleaning', 'practical-life', 'Cleaning Up', 'Care for a shared space', 'Care of environment', 'Practical Life', 'Understanding the World'),
  lesson('early-practical-gardening', 'practical-life', 'Little Gardener', 'Care for a growing plant', 'Care of living things', 'Practical Life', 'Understanding the World'),
  lesson('early-sensorial-colours', 'sensorial', 'Colour Matching', 'Match a clear primary colour', 'Visual discrimination', 'Sensorial', 'Expressive Arts and Design'),
  lesson('early-sensorial-shapes', 'sensorial', 'Shape Sorting', 'Find a familiar shape', 'Shape discrimination', 'Sensorial', 'Mathematics'),
  lesson('early-sensorial-size', 'sensorial', 'Big and Small', 'Compare object sizes', 'Size comparison', 'Sensorial', 'Mathematics'),
  lesson('early-sensorial-sounds', 'sensorial', 'Sound Matching', 'Connect a sound to an animal', 'Auditory discrimination', 'Sensorial', 'Communication and Language'),
  lesson('early-language-phonics', 'english', 'First Phonics', 'Listen for a first letter sound', 'Phonological awareness', 'Language', 'Communication and Language'),
  lesson('early-language-letter-sounds', 'english', 'Letter Sounds', 'Recognise a letter and its sound', 'Letter recognition', 'Language', 'Literacy'),
  lesson('early-language-vocabulary', 'english', 'Everyday Words', 'Match familiar spoken words to pictures', 'Vocabulary', 'Language', 'Communication and Language'),
  lesson('early-language-story', 'english', 'Story Listening', 'Follow a calm three-part story', 'Listening comprehension', 'Language', 'Literacy'),
  lesson('early-maths-counting', 'maths', 'Count Together', 'Count a small set of objects', 'Counting', 'Mathematics', 'Mathematics'),
  lesson('early-maths-number-recognition', 'maths', 'Find the Number', 'Recognise a familiar numeral', 'Number recognition', 'Mathematics', 'Mathematics'),
  lesson('early-maths-quantity', 'maths', 'Match the Quantity', 'Match a small group to its amount', 'Quantity matching', 'Mathematics', 'Mathematics')
];
