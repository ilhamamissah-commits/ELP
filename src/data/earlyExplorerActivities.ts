export type EarlyExplorerActivityKind = 'sequence' | 'match' | 'choose' | 'count';

export interface EarlyExplorerOption {
  id: string;
  label: string;
  icon: string;
}

export interface EarlyExplorerActivityDefinition {
  lessonId: string;
  kind: EarlyExplorerActivityKind;
  spokenInstruction: string;
  prompt: string;
  promptIcon: string;
  options: EarlyExplorerOption[];
  correctOptionIds: string[];
  steps?: string[];
}

const options = (...items: [string, string, string][]): EarlyExplorerOption[] => items.map(([id, label, icon]) => ({ id, label, icon }));

export const EARLY_EXPLORER_ACTIVITIES: Record<string, EarlyExplorerActivityDefinition> = {
  'early-practical-washing': { lessonId: 'early-practical-washing', kind: 'sequence', spokenInstruction: 'Let us wash our hands. Tap each picture in order.', prompt: 'Wash hands', promptIcon: '🧼', steps: ['Turn on water', 'Use soap', 'Rub hands', 'Rinse and dry'], options: [], correctOptionIds: [] },
  'early-practical-dressing': { lessonId: 'early-practical-dressing', kind: 'sequence', spokenInstruction: 'Let us get dressed. Tap each picture in order.', prompt: 'Get dressed', promptIcon: '👕', steps: ['Choose clothes', 'Put on shirt', 'Put on trousers', 'Put on shoes'], options: [], correctOptionIds: [] },
  'early-practical-cleaning': { lessonId: 'early-practical-cleaning', kind: 'sequence', spokenInstruction: 'Let us clean the table. Tap each picture in order.', prompt: 'Clean up', promptIcon: '🧽', steps: ['Get cloth', 'Wipe gently', 'Put cloth away'], options: [], correctOptionIds: [] },
  'early-practical-gardening': { lessonId: 'early-practical-gardening', kind: 'sequence', spokenInstruction: 'Let us help the plant grow. Tap each picture in order.', prompt: 'Grow a plant', promptIcon: '🌱', steps: ['Put seed in soil', 'Give it water', 'Give it sunshine'], options: [], correctOptionIds: [] },
  'early-sensorial-colours': { lessonId: 'early-sensorial-colours', kind: 'match', spokenInstruction: 'Find the red colour.', prompt: 'Find red', promptIcon: '🔴', options: options(['red', 'Red', '🔴'], ['blue', 'Blue', '🔵'], ['yellow', 'Yellow', '🟡']), correctOptionIds: ['red'] },
  'early-sensorial-shapes': { lessonId: 'early-sensorial-shapes', kind: 'match', spokenInstruction: 'Find the circle.', prompt: 'Find circle', promptIcon: '⚪', options: options(['circle', 'Circle', '⚪'], ['square', 'Square', '🟥'], ['triangle', 'Triangle', '🔺']), correctOptionIds: ['circle'] },
  'early-sensorial-size': { lessonId: 'early-sensorial-size', kind: 'choose', spokenInstruction: 'Tap the biggest one.', prompt: 'Which is big?', promptIcon: '🐘', options: options(['small', 'Small', '🐭'], ['big', 'Big', '🐘'], ['medium', 'Medium', '🐕']), correctOptionIds: ['big'] },
  'early-sensorial-sounds': { lessonId: 'early-sensorial-sounds', kind: 'match', spokenInstruction: 'Listen. Find the animal that says moo.', prompt: 'Moo!', promptIcon: '🔊', options: options(['cow', 'Cow', '🐄'], ['cat', 'Cat', '🐈'], ['dog', 'Dog', '🐕']), correctOptionIds: ['cow'] },
  'early-language-phonics': { lessonId: 'early-language-phonics', kind: 'match', spokenInstruction: 'Listen to the sound. Find the picture that starts with sss.', prompt: 'Sss', promptIcon: '🔤', options: options(['sun', 'Sun', '☀️'], ['moon', 'Moon', '🌙'], ['fish', 'Fish', '🐟']), correctOptionIds: ['sun'] },
  'early-language-letter-sounds': { lessonId: 'early-language-letter-sounds', kind: 'match', spokenInstruction: 'Find the letter A.', prompt: 'A says ah', promptIcon: '🅰️', options: options(['a', 'A', '🅰️'], ['b', 'B', '🅱️'], ['c', 'C', '©️']), correctOptionIds: ['a'] },
  'early-language-vocabulary': { lessonId: 'early-language-vocabulary', kind: 'match', spokenInstruction: 'Find the apple.', prompt: 'Apple', promptIcon: '🍎', options: options(['apple', 'Apple', '🍎'], ['banana', 'Banana', '🍌'], ['pear', 'Pear', '🍐']), correctOptionIds: ['apple'] },
  'early-language-story': { lessonId: 'early-language-story', kind: 'sequence', spokenInstruction: 'Listen to the little story. Tap the pictures to help Bunny find home.', prompt: 'Bunny goes home', promptIcon: '🐰', steps: ['Bunny sees a flower', 'Bunny follows the path', 'Bunny finds home'], options: [], correctOptionIds: [] },
  'early-maths-counting': { lessonId: 'early-maths-counting', kind: 'count', spokenInstruction: 'Count the apples. Tap the right number.', prompt: 'How many apples?', promptIcon: '🍎🍎🍎', options: options(['2', 'Two', '2️⃣'], ['3', 'Three', '3️⃣'], ['4', 'Four', '4️⃣']), correctOptionIds: ['3'] },
  'early-maths-number-recognition': { lessonId: 'early-maths-number-recognition', kind: 'match', spokenInstruction: 'Find number five.', prompt: '5', promptIcon: '5️⃣', options: options(['3', 'Three', '3️⃣'], ['5', 'Five', '5️⃣'], ['7', 'Seven', '7️⃣']), correctOptionIds: ['5'] },
  'early-maths-quantity': { lessonId: 'early-maths-quantity', kind: 'count', spokenInstruction: 'Find the group with two stars.', prompt: 'Find two', promptIcon: '⭐ ⭐', options: options(['one', 'One star', '⭐'], ['two', 'Two stars', '⭐ ⭐'], ['three', 'Three stars', '⭐ ⭐ ⭐']), correctOptionIds: ['two'] }
};
