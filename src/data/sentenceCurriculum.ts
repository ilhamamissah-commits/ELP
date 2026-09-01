export interface SentenceData {
  id: string;
  text: string; // Lowercase for building
  level: number; // 1 to 7
  pattern: string; // Educational description
  prompt?: string; // Optional hint
}

// 100 Correct Sentences progressing from 2 words to complex
export const SENTENCE_CURRICULUM: SentenceData[] = [
  // --- LEVEL 1: 2-Word Basics (Ages 2-3) ---
  { id: 's1', text: "i am happy", level: 1, pattern: 'Subject + Adjective', prompt: "Make a sentence about yourself." },
  { id: 's2', text: "i am sad", level: 1, pattern: 'Subject + Adjective', prompt: "Make a sentence about yourself." },
  { id: 's3', text: "it is hot", level: 1, pattern: 'Subject + Adjective', prompt: "Describe the weather." },
  { id: 's4', text: "it is cold", level: 1, pattern: 'Subject + Adjective', prompt: "Describe the weather." },
  { id: 's5', text: "i am big", level: 1, pattern: 'Subject + Adjective', prompt: "Describe yourself." },
  { id: 's6', text: "i am small", level: 1, pattern: 'Subject + Adjective', prompt: "Describe yourself." },

  // --- LEVEL 2: 3-Word Basics (Verb + Object) ---
  { id: 's7', text: "i can run", level: 2, pattern: 'Subject + Modal + Verb', prompt: "What can you do?" },
  { id: 's8', text: "i can jump", level: 2, pattern: 'Subject + Modal + Verb', prompt: "What can you do?" },
  { id: 's9', text: "i can eat", level: 2, pattern: 'Subject + Modal + Verb', prompt: "What can you do?" },
  { id: 's10', text: "i like cake", level: 2, pattern: 'Subject + Verb + Object', prompt: "What food do you like?" },
  { id: 's11', text: "i like dogs", level: 2, pattern: 'Subject + Verb + Object', prompt: "What animals do you like?" },
  { id: 's12', text: "i see a cat", level: 2, pattern: 'Subject + Verb + Article + Noun', prompt: "What do you see?" },
  { id: 's13', text: "i see a bus", level: 2, pattern: 'Subject + Verb + Article + Noun', prompt: "What do you see?" },
  { id: 's14', text: "i see a star", level: 2, pattern: 'Subject + Verb + Article + Noun', prompt: "What do you see?" },
  { id: 's15', text: "i have a dog", level: 2, pattern: 'Subject + Verb + Article + Noun', prompt: "What do you have?" },
  { id: 's16', text: "i have a hat", level: 2, pattern: 'Subject + Verb + Article + Noun', prompt: "What do you have?" },
  { id: 's17', text: "he can swim", level: 2, pattern: 'Subject + Modal + Verb', prompt: "What can he do?" },
  { id: 's18', text: "she can sing", level: 2, pattern: 'Subject + Modal + Verb', prompt: "What can she do?" },
  { id: 's19', text: "we can play", level: 2, pattern: 'Subject + Modal + Verb', prompt: "What can we do?" },
  { id: 's20', text: "they can dance", level: 2, pattern: 'Subject + Modal + Verb', prompt: "What can they do?" },

  // --- LEVEL 3: 4-Word (Action in place) ---
  { id: 's21', text: "the cat runs fast", level: 3, pattern: 'Article + Noun + Verb + Adverb', prompt: "Describe an animal!" },
  { id: 's22', text: "the dog is big", level: 3, pattern: 'Article + Noun + Verb + Adjective', prompt: "Describe an animal!" },
  { id: 's23', text: "the sun is hot", level: 3, pattern: 'Article + Noun + Verb + Adjective', prompt: "Describe the weather!" },
  { id: 's24', text: "the bird can fly", level: 3, pattern: 'Article + Noun + Modal + Verb', prompt: "What can a bird do?" },
  { id: 's25', text: "the fish can swim", level: 3, pattern: 'Article + Noun + Modal + Verb', prompt: "What can a fish do?" },
  { id: 's26', text: "i like red apples", level: 3, pattern: 'Subject + Verb + Adjective + Noun', prompt: "What fruit do you like?" },
  { id: 's27', text: "she has a blue bag", level: 3, pattern: 'Subject + Verb + Article + Adjective + Noun', prompt: "What color is your bag?" },
  { id: 's28', text: "he has a red car", level: 3, pattern: 'Subject + Verb + Article + Adjective + Noun', prompt: "What color is the car?" },
  { id: 's29', text: "we go to school", level: 3, pattern: 'Subject + Verb + Preposition + Noun', prompt: "Where do you go?" },
  { id: 's30', text: "they live in a house", level: 3, pattern: 'Subject + Verb + Preposition + Article + Noun', prompt: "Where do they live?" },
  { id: 's31', text: "i can see the moon", level: 3, pattern: 'Subject + Modal + Verb + Article + Noun', prompt: "What do you see at night?" },
  { id: 's32', text: "i can see the stars", level: 3, pattern: 'Subject + Modal + Verb + Article + Noun', prompt: "What do you see at night?" },
  { id: 's33', text: "the pig is pink", level: 3, pattern: 'Article + Noun + Verb + Adjective', prompt: "What color is the pig?" },
  { id: 's34', text: "the frog is green", level: 3, pattern: 'Article + Noun + Verb + Adjective', prompt: "What color is the frog?" },
  { id: 's35', text: "the banana is yellow", level: 3, pattern: 'Article + Noun + Verb + Adjective', prompt: "What color is the banana?" },
  { id: 's36', text: "the sky is blue", level: 3, pattern: 'Article + Noun + Verb + Adjective', prompt: "What color is the sky?" },

  // --- LEVEL 4: 5-Word (Prepositions & Details) ---
  { id: 's37', text: "the cat sat on the mat", level: 4, pattern: 'Article + Noun + Verb + Preposition + Article + Noun', prompt: "Where did the cat sit?" },
  { id: 's38', text: "the dog ran in the park", level: 4, pattern: 'Article + Noun + Verb + Preposition + Article + Noun', prompt: "Where did the dog run?" },
  { id: 's39', text: "the bird sat on the tree", level: 4, pattern: 'Article + Noun + Verb + Preposition + Article + Noun', prompt: "Where did the bird sit?" },
  { id: 's40', text: "my dad cooks good food", level: 4, pattern: 'Possessive + Noun + Verb + Adjective + Noun', prompt: "Who cooks well?" },
  { id: 's41', text: "my mom reads a book", level: 4, pattern: 'Possessive + Noun + Verb + Article + Noun', prompt: "What does mom do?" },
  { id: 's42', text: "the fish swims in water", level: 4, pattern: 'Article + Noun + Verb + Preposition + Noun', prompt: "Where does the fish swim?" },
  { id: 's43', text: "the kids play in the sand", level: 4, pattern: 'Article + Noun + Verb + Preposition + Article + Noun', prompt: "Where do kids play?" },
  { id: 's44', text: "i go to the market", level: 4, pattern: 'Subject + Verb + Preposition + Article + Noun', prompt: "Where do you go?" },
  { id: 's45', text: "he rides his bike", level: 4, pattern: 'Subject + Verb + Possessive + Noun', prompt: "What does he ride?" },
  { id: 's46', text: "she wears a red dress", level: 4, pattern: 'Subject + Verb + Article + Adjective + Noun', prompt: "What does she wear?" },
  { id: 's47', text: "i like to read books", level: 4, pattern: 'Subject + Verb + Infinitive + Verb + Noun', prompt: "What do you like to do?" },
  { id: 's48', text: "we love to play outside", level: 4, pattern: 'Subject + Verb + Infinitive + Verb + Adverb', prompt: "What do you love to do?" },
  { id: 's49', text: "the little cat is small", level: 4, pattern: 'Article + Adjective + Noun + Verb + Adjective', prompt: "Describe the cat!" },
  { id: 's50', text: "the big dog is brown", level: 4, pattern: 'Article + Adjective + Noun + Verb + Adjective', prompt: "Describe the dog!" },

  // --- LEVEL 5: 6-Word (Advanced Grammar) ---
  { id: 's51', text: "i am reading a funny book", level: 5, pattern: 'Subject + Auxiliary + Verb + Article + Adjective + Noun', prompt: "What are you doing?" },
  { id: 's52', text: "she is eating a red apple", level: 5, pattern: 'Subject + Auxiliary + Verb + Article + Adjective + Noun', prompt: "What is she doing?" },
  { id: 's53', text: "he is playing with his toys", level: 5, pattern: 'Subject + Auxiliary + Verb + Preposition + Possessive + Noun', prompt: "What is he doing?" },
  { id: 's54', text: "we are going to the zoo", level: 5, pattern: 'Subject + Auxiliary + Verb + Preposition + Article + Noun', prompt: "Where are you going?" },
  { id: 's55', text: "they are riding a yellow bus", level: 5, pattern: 'Subject + Auxiliary + Verb + Article + Adjective + Noun', prompt: "What are they riding?" },
  { id: 's56', text: "the sun is shining very bright", level: 5, pattern: 'Article + Noun + Auxiliary + Verb + Adverb + Adjective', prompt: "Describe the sun!" },
  { id: 's57', text: "i have a very big dog", level: 5, pattern: 'Subject + Verb + Article + Adverb + Adjective + Noun', prompt: "Describe your dog!" },
  { id: 's58', text: "she has a beautiful doll", level: 5, pattern: 'Subject + Verb + Article + Adjective + Noun', prompt: "What does she have?" },
  { id: 's59', text: "the little boy is very happy", level: 5, pattern: 'Article + Adjective + Noun + Auxiliary + Adverb + Adjective', prompt: "How is the boy?" },
  { id: 's60', text: "my sister can sing very well", level: 5, pattern: 'Possessive + Noun + Modal + Verb + Adverb + Adverb', prompt: "What can your sister do?" },
  { id: 's61', text: "the man is walking to the shop", level: 5, pattern: 'Article + Noun + Auxiliary + Verb + Preposition + Article + Noun', prompt: "Where is the man going?" },
  { id: 's62', text: "the lady is cooking some rice", level: 5, pattern: 'Article + Noun + Auxiliary + Verb + Quantifier + Noun', prompt: "What is the lady doing?" },
  { id: 's63', text: "i want to go to the beach", level: 5, pattern: 'Subject + Verb + Infinitive + Verb + Preposition + Article + Noun', prompt: "Where do you want to go?" },
  { id: 's64', text: "he likes to play with his friends", level: 5, pattern: 'Subject + Verb + Infinitive + Verb + Preposition + Possessive + Noun', prompt: "What does he like to do?" },

  // --- LEVEL 6: 7-Word Complex Sentences ---
  { id: 's65', text: "the little girl is playing in the garden", level: 6, pattern: 'Article + Adjective + Noun + Auxiliary + Verb + Preposition + Article + Noun', prompt: "What is the girl doing?" },
  { id: 's66', text: "my father drives to work every morning", level: 6, pattern: 'Possessive + Noun + Verb + Preposition + Noun + Adverb + Noun', prompt: "What does dad do?" },
  { id: 's67', text: "we went to the market to buy fruits", level: 6, pattern: 'Subject + Verb + Preposition + Article + Noun + Infinitive + Verb + Noun', prompt: "Why did you go to the market?" },
  { id: 's68', text: "the big brown dog barked at the cat", level: 6, pattern: 'Article + Adjective + Adjective + Noun + Verb + Preposition + Article + Noun', prompt: "What did the dog do?" },
  { id: 's69', text: "i can see the moon and the stars", level: 6, pattern: 'Subject + Modal + Verb + Article + Noun + Conjunction + Article + Noun', prompt: "What do you see in the sky?" },
  { id: 's70', text: "she is wearing a very pretty red dress", level: 6, pattern: 'Subject + Auxiliary + Verb + Article + Adverb + Adjective + Adjective + Noun', prompt: "What is she wearing?" },
  { id: 's71', text: "the children are laughing at the funny clown", level: 6, pattern: 'Article + Noun + Auxiliary + Verb + Preposition + Article + Adjective + Noun', prompt: "Why are the children laughing?" },
  { id: 's72', text: "my mom is making a delicious chocolate cake", level: 6, pattern: 'Possessive + Noun + Auxiliary + Verb + Article + Adjective + Adjective + Noun', prompt: "What is mom making?" },
  { id: 's73', text: "the little bird flew over the tall tree", level: 6, pattern: 'Article + Adjective + Noun + Verb + Preposition + Article + Adjective + Noun', prompt: "Where did the bird fly?" },
  { id: 's74', text: "i put my toys in the big red box", level: 6, pattern: 'Subject + Verb + Possessive + Noun + Preposition + Article + Adjective + Noun', prompt: "Where did you put your toys?" },
  { id: 's75', text: "they are running to the park very fast", level: 6, pattern: 'Subject + Auxiliary + Verb + Preposition + Article + Noun + Adverb + Adverb', prompt: "How fast are they running?" },
  { id: 's76', text: "the students listen to the teacher in class", level: 6, pattern: 'Article + Noun + Verb + Preposition + Article + Noun + Preposition + Noun', prompt: "What do students do in class?" },

  // --- LEVEL 7: Challenge (Advanced Grammar & Vocabulary) ---
  { id: 's77', text: "the red car drives down the busy street", level: 7, pattern: 'Article + Adjective + Noun + Verb + Preposition + Article + Adjective + Noun', prompt: "What is happening?" },
  { id: 's78', text: "i have a very big and fluffy dog", level: 7, pattern: 'Subject + Verb + Article + Adverb + Adjective + Conjunction + Adjective + Noun', prompt: "Describe your dog!" },
  { id: 's79', text: "the beautiful flowers bloom in the spring", level: 7, pattern: 'Article + Adjective + Noun + Verb + Preposition + Article + Noun', prompt: "When do flowers bloom?" },
  { id: 's80', text: "we take a bus to school every day", level: 7, pattern: 'Subject + Verb + Article + Noun + Preposition + Noun + Adverb + Noun', prompt: "How do you go to school?" },
  { id: 's81', text: "the moon shines bright in the night sky", level: 7, pattern: 'Article + Noun + Verb + Adjective + Preposition + Article + Adjective + Noun', prompt: "What happens at night?" },
  { id: 's82', text: "my brother and i love to play video games", level: 7, pattern: 'Possessive + Noun + Conjunction + Subject + Verb + Infinitive + Verb + Noun', prompt: "What do you love to do?" },
  { id: 's83', text: "the little boy was playing in the sandbox", level: 7, pattern: 'Article + Adjective + Noun + Auxiliary + Verb + Preposition + Article + Noun', prompt: "What was the boy doing?" },
  { id: 's84', text: "i want to be a doctor when i grow up", level: 7, pattern: 'Subject + Verb + Infinitive + Verb + Article + Noun + Conjunction + Subject + Verb + Particle', prompt: "What do you want to be?" },
  { id: 's85', text: "the cat was sleeping on the warm soft blanket", level: 7, pattern: 'Article + Noun + Auxiliary + Verb + Preposition + Article + Adjective + Adjective + Noun', prompt: "Where was the cat?" },
  { id: 's86', text: "she gave her friend a beautiful gift", level: 7, pattern: 'Subject + Verb + Possessive + Noun + Article + Adjective + Noun', prompt: "What did she give?" },
  { id: 's87', text: "the heavy rain fell on the dry dusty ground", level: 7, pattern: 'Article + Adjective + Noun + Verb + Preposition + Article + Adjective + Adjective + Noun', prompt: "What happened after the rain?" },
  { id: 's88', text: "we are going to see a movie at the cinema", level: 7, pattern: 'Subject + Auxiliary + Verb + Infinitive + Verb + Article + Noun + Preposition + Article + Noun', prompt: "What are you going to do?" },
  { id: 's89', text: "the kind teacher helped the students with their work", level: 7, pattern: 'Article + Adjective + Noun + Verb + Article + Noun + Preposition + Possessive + Noun', prompt: "What did the teacher do?" },
  { id: 's90', text: "my grandma tells us stories about the old days", level: 7, pattern: 'Possessive + Noun + Verb + Pronoun + Noun + Preposition + Article + Adjective + Noun', prompt: "What does grandma do?" },
  { id: 's91', text: "the little boy cleaned his room all by himself", level: 7, pattern: 'Article + Adjective + Noun + Verb + Possessive + Noun + Adverb + Preposition + Reflexive', prompt: "Who cleaned the room?" },
  { id: 's92', text: "i am very excited about the school trip tomorrow", level: 7, pattern: 'Subject + Auxiliary + Adverb + Adjective + Preposition + Article + Noun + Noun', prompt: "How do you feel?" },
  { id: 's93', text: "she is learning to play the piano very well", level: 7, pattern: 'Subject + Auxiliary + Verb + Infinitive + Verb + Article + Noun + Adverb + Adverb', prompt: "What is she learning?" },
  { id: 's94', text: "we should always say please and thank you", level: 7, pattern: 'Subject + Modal + Adverb + Verb + Noun + Conjunction + Noun + Pronoun', prompt: "What should we always do?" },
  { id: 's95', text: "the hungry baby cried for his milk bottle", level: 7, pattern: 'Article + Adjective + Noun + Verb + Preposition + Possessive + Noun + Noun', prompt: "Why did the baby cry?" },
  { id: 's96', text: "my dad is fixing the old car in the garage", level: 7, pattern: 'Possessive + Noun + Auxiliary + Verb + Article + Adjective + Noun + Preposition + Article + Noun', prompt: "What is dad doing?" },
  { id: 's97', text: "the children are building a tall sandcastle on the beach", level: 7, pattern: 'Article + Noun + Auxiliary + Verb + Article + Adjective + Noun + Preposition + Article + Noun', prompt: "What are the children building?" },
  { id: 's98', text: "i like to read books about animals and nature", level: 7, pattern: 'Subject + Verb + Infinitive + Verb + Noun + Preposition + Noun + Conjunction + Noun', prompt: "What do you like to read?" },
  { id: 's99', text: "the little girl is drawing a colorful picture", level: 7, pattern: 'Article + Adjective + Noun + Auxiliary + Verb + Article + Adjective + Noun', prompt: "What is the girl doing?" },
  { id: 's100', text: "we are having a wonderful time at the party", level: 7, pattern: 'Subject + Auxiliary + Verb + Article + Adjective + Noun + Preposition + Article + Noun', prompt: "How are you feeling?" },
];