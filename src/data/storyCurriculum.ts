export type StoryLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type StoryType =
  | 'decodable'
  | 'narrative'
  | 'fable'
  | 'informational'
  | 'science'
  | 'nature'
  | 'social-emotional'
  | 'adventure'
  | 'biography'
  | 'problem-solving';

export type StoryDifficulty =
  | 'emerging'
  | 'developing'
  | 'secure'
  | 'advanced'
  | 'challenge';

export type ComprehensionSkill =
  | 'literal-recall'
  | 'detail-identification'
  | 'who-what-where'
  | 'when-identification'
  | 'sequencing'
  | 'cause-and-effect'
  | 'prediction'
  | 'main-idea'
  | 'character-understanding'
  | 'setting-identification'
  | 'problem-identification'
  | 'solution-identification'
  | 'inference'
  | 'compare-and-contrast'
  | 'vocabulary-in-context'
  | 'moral-understanding'
  | 'fact-identification'
  | 'explanation'
  | 'critical-thinking'
  | 'oral-retelling';

export type StoryActivity =
  | 'read'
  | 'listen'
  | 'read-aloud'
  | 'sequence'
  | 'comprehension'
  | 'vocabulary'
  | 'retell'
  | 'discussion';

export interface StoryQuestion {
  id: string;
  question: string;
  answer: string;
  acceptedAnswers?: readonly string[];
  skillIds: readonly ComprehensionSkill[];
  difficulty: StoryDifficulty;
  questionType:
    | 'recall'
    | 'detail'
    | 'sequence'
    | 'cause-effect'
    | 'prediction'
    | 'inference'
    | 'vocabulary'
    | 'reasoning'
    | 'moral';
  points: number;
}

export interface StoryPage {
  id: string;
  text: string;
  illustrationKey?: string;
  vocabulary?: readonly string[];
  skillIds?: readonly ComprehensionSkill[];
  supportsReadAloud: boolean;
}

export interface StoryVocabulary {
  word: string;
  definition: string;
  example?: string;
  category?: string;
}

export interface StoryData {
  id: string;
  title: string;
  level: StoryLevel;
  shortDescription: string;
  storyType: StoryType;
  difficulty: StoryDifficulty;
  emoji?: string;
  pages: readonly StoryPage[];
  questions: readonly StoryQuestion[];
  vocabulary: readonly StoryVocabulary[];
  skillIds: readonly ComprehensionSkill[];
  prerequisiteStoryIds: readonly string[];
  academyId: 'language';
  subjectId: 'english';
  domain: 'literacy';
  supportedActivities: readonly StoryActivity[];
  isFoundational: boolean;
  supportsReview: boolean;
  supportsSpeech: boolean;
  masteryThreshold: number;
  tags: readonly string[];
}

export const STORY_CURRICULUM_CONFIG = {
  academyId: 'language',
  subjectId: 'english',
  domain: 'literacy',
  minimumMasteryForProgression: 80,
  reviewThreshold: 60,
  foundationalReviewLevels: [1, 2] as const,
  language: 'en-US',
} as const;

type QuestionSeed = {
  question: string;
  answer: string;
  skillIds: readonly ComprehensionSkill[];
  questionType: StoryQuestion['questionType'];
};

type StorySeed = {
  id: string;
  title: string;
  level: StoryLevel;
  storyType: StoryType;
  difficulty: StoryDifficulty;
  shortDescription: string;
  text: string;
  questions: readonly QuestionSeed[];
};

const createQuestion = (
  storyId: string,
  index: number,
  seed: QuestionSeed,
  difficulty: StoryDifficulty,
): StoryQuestion => ({
  id: `${storyId}-q${index + 1}`,
  question: seed.question,
  answer: seed.answer,
  acceptedAnswers: [seed.answer],
  skillIds: seed.skillIds,
  difficulty,
  questionType: seed.questionType,
  points: 10,
});

const createPages = (
  storyId: string,
  level: StoryLevel,
  text: string,
  skillIds: readonly ComprehensionSkill[],
): readonly StoryPage[] => {
  const sentences = text
    .match(/[^.!?]+[.!?]+/g)
    ?.map((sentence) => sentence.trim())
    .filter(Boolean) ?? [text.trim()];

  const sentencesPerPage =
    level === 1 ? 2 :
    level <= 3 ? 2 :
    level <= 5 ? 3 :
    3;

  const pages: StoryPage[] = [];

  for (let index = 0; index < sentences.length; index += sentencesPerPage) {
    const pageText = sentences.slice(index, index + sentencesPerPage).join(' ');
    pages.push({
      id: `${storyId}-p${pages.length + 1}`,
      text: pageText,
      illustrationKey: `${storyId}-scene-${pages.length + 1}`,
      skillIds,
      supportsReadAloud: true,
    });
  }

  return pages;
};

const createStory = (
  seed: StorySeed,
  prerequisiteStoryIds: readonly string[],
): StoryData => {
  const skillIds = Array.from(
    new Set(seed.questions.flatMap((question) => question.skillIds)),
  ) as ComprehensionSkill[];

  return {
    id: seed.id,
    title: seed.title,
    level: seed.level,
    shortDescription: seed.shortDescription,
    storyType: seed.storyType,
    difficulty: seed.difficulty,
    pages: createPages(seed.id, seed.level, seed.text, skillIds),
    questions: seed.questions.map((question, index) =>
      createQuestion(seed.id, index, question, seed.difficulty),
    ),
    vocabulary: [],
    skillIds,
    prerequisiteStoryIds,
    academyId: 'language',
    subjectId: 'english',
    domain: 'literacy',
    supportedActivities: [
      'read',
      'listen',
      'read-aloud',
      'comprehension',
      'vocabulary',
      'retell',
      'discussion',
    ],
    isFoundational: seed.level <= 2,
    supportsReview: true,
    supportsSpeech: true,
    masteryThreshold: STORY_CURRICULUM_CONFIG.minimumMasteryForProgression,
    tags: [
      `level-${seed.level}`,
      seed.storyType,
      seed.difficulty,
      'english-literacy',
      'elp-reading',
    ],
  };
};

const STORY_SEEDS: readonly StorySeed[] = [
  {
    id: "story-001",
    title: "Mina Finds a Red Ball",
    level: 1,
    storyType: "narrative",
    difficulty: "emerging",
    shortDescription: "Mina sees a red ball by a tree.",
    text: "Mina sees a red ball. She picks it up. A little boy named Sam comes to look for his ball. Mina gives it to Sam. Sam smiles and says thank you.",
    questions: [
      {
        question: "What color is the ball?",
        answer: "Red",
        skillIds: ["literal-recall"],
        questionType: "recall",
      },
      {
        question: "Who is looking for the ball?",
        answer: "Sam",
        skillIds: ["who-what-where"],
        questionType: "recall",
      },
      {
        question: "What does Sam say?",
        answer: "Thank you",
        skillIds: ["detail-identification"],
        questionType: "detail",
      },
    ],
  },
  {
    id: "story-002",
    title: "The Little Blue Bird",
    level: 1,
    storyType: "nature",
    difficulty: "emerging",
    shortDescription: "A little bird learns to share a seed.",
    text: "A blue bird finds one seed. A small bird watches nearby. The blue bird breaks the seed in two. They eat together. Both birds are happy.",
    questions: [
      {
        question: "What color is the bird?",
        answer: "Blue",
        skillIds: ["literal-recall"],
        questionType: "recall",
      },
      {
        question: "What does the blue bird find?",
        answer: "A seed",
        skillIds: ["detail-identification"],
        questionType: "detail",
      },
      {
        question: "Why does the bird break the seed?",
        answer: "To share it",
        skillIds: ["cause-and-effect"],
        questionType: "cause-effect",
      },
    ],
  },
  {
    id: "story-003",
    title: "Lulu Washes Her Hands",
    level: 1,
    storyType: "informational",
    difficulty: "emerging",
    shortDescription: "Lulu learns why clean hands matter.",
    text: "Lulu comes in from the garden. Her hands are dirty. She uses soap and water. She rubs her hands and rinses them. Now her hands are clean.",
    questions: [
      {
        question: "Where does Lulu come from?",
        answer: "The garden",
        skillIds: ["who-what-where"],
        questionType: "detail",
      },
      {
        question: "What does Lulu use with water?",
        answer: "Soap",
        skillIds: ["detail-identification"],
        questionType: "recall",
      },
      {
        question: "Why does she wash her hands?",
        answer: "To clean them",
        skillIds: ["cause-and-effect"],
        questionType: "cause-effect",
      },
    ],
  },
  {
    id: "story-004",
    title: "Omar's Yellow Hat",
    level: 1,
    storyType: "narrative",
    difficulty: "emerging",
    shortDescription: "Omar keeps looking for his bright yellow hat.",
    text: "Omar has a yellow hat. He looks on his bed. It is not there. He looks by the door. There it is! Omar puts it on and goes outside.",
    questions: [
      {
        question: "What color is Omar's hat?",
        answer: "Yellow",
        skillIds: ["literal-recall"],
        questionType: "recall",
      },
      {
        question: "Where does Omar find it?",
        answer: "By the door",
        skillIds: ["detail-identification"],
        questionType: "detail",
      },
      {
        question: "What does Omar do after finding it?",
        answer: "He puts it on and goes outside",
        skillIds: ["sequencing"],
        questionType: "sequence",
      },
    ],
  },
  {
    id: "story-005",
    title: "The Kind Little Ant",
    level: 1,
    storyType: "fable",
    difficulty: "emerging",
    shortDescription: "A tiny ant helps a tired beetle.",
    text: "An ant sees a beetle carrying a leaf. The beetle drops the leaf. The ant helps lift it. Together they carry the leaf home. The beetle thanks the ant.",
    questions: [
      {
        question: "What does the beetle carry?",
        answer: "A leaf",
        skillIds: ["detail-identification"],
        questionType: "recall",
      },
      {
        question: "Who helps the beetle?",
        answer: "The ant",
        skillIds: ["literal-recall"],
        questionType: "recall",
      },
      {
        question: "What lesson does the story show?",
        answer: "Helping others is kind",
        skillIds: ["moral-understanding"],
        questionType: "moral",
      },
    ],
  },
  {
    id: "story-006",
    title: "A Snack for Aisha",
    level: 1,
    storyType: "social-emotional",
    difficulty: "emerging",
    shortDescription: "Aisha remembers to share her snack.",
    text: "Aisha has two bananas. Her friend Hana has no snack. Aisha gives Hana one banana. They sit together and eat. Aisha feels happy.",
    questions: [
      {
        question: "How many bananas does Aisha have?",
        answer: "Two",
        skillIds: ["detail-identification"],
        questionType: "recall",
      },
      {
        question: "Who has no snack?",
        answer: "Hana",
        skillIds: ["who-what-where"],
        questionType: "recall",
      },
      {
        question: "How does Aisha feel at the end?",
        answer: "Happy",
        skillIds: ["character-understanding"],
        questionType: "detail",
      },
    ],
  },
  {
    id: "story-007",
    title: "Rain on the Roof",
    level: 1,
    storyType: "nature",
    difficulty: "emerging",
    shortDescription: "A child listens to gentle rain.",
    text: "Rain falls on the roof. Ali sits by the window. He hears tap, tap, tap. The garden gets wet. Ali watches the drops and smiles.",
    questions: [
      {
        question: "What falls on the roof?",
        answer: "Rain",
        skillIds: ["literal-recall"],
        questionType: "recall",
      },
      {
        question: "Where does Ali sit?",
        answer: "By the window",
        skillIds: ["setting-identification"],
        questionType: "detail",
      },
      {
        question: "What happens to the garden?",
        answer: "It gets wet",
        skillIds: ["cause-and-effect"],
        questionType: "cause-effect",
      },
    ],
  },
  {
    id: "story-008",
    title: "The Sleepy Kitten",
    level: 1,
    storyType: "narrative",
    difficulty: "emerging",
    shortDescription: "A sleepy kitten finds a warm place to rest.",
    text: "A small kitten plays with a ball. Soon the kitten feels sleepy. It curls up on a soft mat. The kitten closes its eyes. Soon it is fast asleep.",
    questions: [
      {
        question: "What does the kitten play with?",
        answer: "A ball",
        skillIds: ["detail-identification"],
        questionType: "recall",
      },
      {
        question: "Where does the kitten sleep?",
        answer: "On a soft mat",
        skillIds: ["setting-identification"],
        questionType: "detail",
      },
      {
        question: "Why does the kitten stop playing?",
        answer: "It feels sleepy",
        skillIds: ["cause-and-effect"],
        questionType: "cause-effect",
      },
    ],
  },
  {
    id: "story-009",
    title: "Tariq and the Lost Chick",
    level: 2,
    storyType: "narrative",
    difficulty: "developing",
    shortDescription: "Tariq helps a chick find its mother.",
    text: "Tariq hears a tiny peep near the garden gate. A yellow chick is alone. He does not chase it. He looks around and sees a hen near the coop. Tariq gently guides the chick toward its mother. The chick settles under her wing.",
    questions: [
      {
        question: "Where does Tariq hear the chick?",
        answer: "Near the garden gate",
        skillIds: ["setting-identification"],
        questionType: "detail",
      },
      {
        question: "What does Tariq do first?",
        answer: "He looks around",
        skillIds: ["sequencing"],
        questionType: "sequence",
      },
      {
        question: "Why does the chick settle under the hen's wing?",
        answer: "It is with its mother",
        skillIds: ["cause-and-effect"],
        questionType: "cause-effect",
      },
    ],
  },
  {
    id: "story-010",
    title: "Nia's Busy Garden",
    level: 2,
    storyType: "nature",
    difficulty: "developing",
    shortDescription: "Nia discovers that plants need care.",
    text: "Nia plants a bean seed in soft soil. She gives it water each morning. After several days, a green shoot appears. Nia keeps caring for it. Soon two small leaves open to the sun.",
    questions: [
      {
        question: "What does Nia plant?",
        answer: "A bean seed",
        skillIds: ["literal-recall"],
        questionType: "recall",
      },
      {
        question: "What appears after several days?",
        answer: "A green shoot",
        skillIds: ["sequencing"],
        questionType: "sequence",
      },
      {
        question: "What does the plant need from Nia?",
        answer: "Water and care",
        skillIds: ["cause-and-effect"],
        questionType: "cause-effect",
      },
    ],
  },
  {
    id: "story-011",
    title: "The Three Little Kites",
    level: 2,
    storyType: "adventure",
    difficulty: "developing",
    shortDescription: "Three friends learn that patience helps a kite fly.",
    text: "Sami, Noor, and Zayd make kites. Sami runs too fast and his kite falls. Noor waits for the wind, then lets her kite go. Zayd watches Noor and tries again. Soon all three kites are dancing in the sky.",
    questions: [
      {
        question: "Why does Sami's kite fall?",
        answer: "He runs too fast",
        skillIds: ["cause-and-effect"],
        questionType: "cause-effect",
      },
      {
        question: "Who waits for the wind?",
        answer: "Noor",
        skillIds: ["detail-identification"],
        questionType: "recall",
      },
      {
        question: "What do the friends learn?",
        answer: "Patience helps",
        skillIds: ["moral-understanding"],
        questionType: "moral",
      },
    ],
  },
  {
    id: "story-012",
    title: "The Missing Lunchbox",
    level: 2,
    storyType: "problem-solving",
    difficulty: "developing",
    shortDescription: "Mariam uses clues to find her lunchbox.",
    text: "Mariam cannot find her lunchbox. She remembers eating breakfast in the kitchen. She checks the table, but it is empty. Then she sees a blue handle beside the school bag. Her lunchbox is behind the bag.",
    questions: [
      {
        question: "Where did Mariam eat breakfast?",
        answer: "In the kitchen",
        skillIds: ["detail-identification"],
        questionType: "recall",
      },
      {
        question: "What clue does she see?",
        answer: "A blue handle",
        skillIds: ["inference"],
        questionType: "inference",
      },
      {
        question: "Where is the lunchbox?",
        answer: "Behind the school bag",
        skillIds: ["literal-recall"],
        questionType: "recall",
      },
    ],
  },
  {
    id: "story-013",
    title: "Baba's Market Morning",
    level: 2,
    storyType: "informational",
    difficulty: "developing",
    shortDescription: "Baba visits a lively market and learns to make a list.",
    text: "Baba goes to the market with his mother. They need tomatoes, rice, and soap. Mother checks the list before buying anything. Baba counts three tomatoes into the basket. They leave with everything they need.",
    questions: [
      {
        question: "Who goes to the market with Baba?",
        answer: "His mother",
        skillIds: ["who-what-where"],
        questionType: "recall",
      },
      {
        question: "Why does Mother check the list?",
        answer: "To remember what they need",
        skillIds: ["cause-and-effect"],
        questionType: "cause-effect",
      },
      {
        question: "How many tomatoes does Baba count?",
        answer: "Three",
        skillIds: ["detail-identification"],
        questionType: "recall",
      },
    ],
  },
  {
    id: "story-014",
    title: "The Helpful Bridge",
    level: 2,
    storyType: "fable",
    difficulty: "developing",
    shortDescription: "A small bridge helps everyone cross the stream.",
    text: "A stream blocks the path to the meadow. The children find a fallen log. They place it across the narrow stream. One child tests it carefully. Soon everyone crosses safely.",
    questions: [
      {
        question: "What blocks the path?",
        answer: "A stream",
        skillIds: ["problem-identification"],
        questionType: "recall",
      },
      {
        question: "What do the children use as a bridge?",
        answer: "A fallen log",
        skillIds: ["solution-identification"],
        questionType: "recall",
      },
      {
        question: "Why does one child test it?",
        answer: "To make sure it is safe",
        skillIds: ["cause-and-effect"],
        questionType: "cause-effect",
      },
    ],
  },
  {
    id: "story-015",
    title: "Yusuf's Quiet Choice",
    level: 2,
    storyType: "social-emotional",
    difficulty: "developing",
    shortDescription: "Yusuf learns to pause before reacting.",
    text: "Yusuf is building a tower when his little sister bumps the table. The tower falls. Yusuf feels angry. He takes a slow breath instead of shouting. His sister helps him build it again.",
    questions: [
      {
        question: "What happens to Yusuf's tower?",
        answer: "It falls",
        skillIds: ["literal-recall"],
        questionType: "recall",
      },
      {
        question: "What does Yusuf do when he feels angry?",
        answer: "He takes a slow breath",
        skillIds: ["character-understanding"],
        questionType: "detail",
      },
      {
        question: "Why does his sister help him?",
        answer: "To build the tower again",
        skillIds: ["cause-and-effect"],
        questionType: "cause-effect",
      },
    ],
  },
  {
    id: "story-016",
    title: "The Moonlit Walk",
    level: 2,
    storyType: "nature",
    difficulty: "developing",
    shortDescription: "A family notices how the night changes familiar things.",
    text: "After dinner, Lina walks outside with her father. The moon lights the path. A tree looks like a giant shadow. Lina knows it is the same tree from daytime. She smiles when she sees an owl fly past.",
    questions: [
      {
        question: "What lights the path?",
        answer: "The moon",
        skillIds: ["detail-identification"],
        questionType: "recall",
      },
      {
        question: "What looks like a giant shadow?",
        answer: "A tree",
        skillIds: ["literal-recall"],
        questionType: "recall",
      },
      {
        question: "Why does Lina know the tree is the same?",
        answer: "She saw it in the daytime",
        skillIds: ["inference"],
        questionType: "inference",
      },
    ],
  },
  {
    id: "story-017",
    title: "The Seed That Waited",
    level: 3,
    storyType: "nature",
    difficulty: "developing",
    shortDescription: "A child learns that growth takes time.",
    text: "Kofi plants a mango seed and checks the soil every morning. For many days, nothing appears. He almost gives up. His grandmother tells him roots may be growing below the soil. A week later, a green shoot rises. Kofi learns that quiet work can happen before we see results.",
    questions: [
      {
        question: "What does Kofi plant?",
        answer: "A mango seed",
        skillIds: ["literal-recall"],
        questionType: "recall",
      },
      {
        question: "Why does he almost give up?",
        answer: "Nothing appears for many days",
        skillIds: ["cause-and-effect"],
        questionType: "cause-effect",
      },
      {
        question: "What lesson does he learn?",
        answer: "Growth can happen before we see results",
        skillIds: ["moral-understanding"],
        questionType: "moral",
      },
    ],
  },
  {
    id: "story-018",
    title: "The Clever Crow",
    level: 3,
    storyType: "fable",
    difficulty: "developing",
    shortDescription: "A crow solves a problem using stones and water.",
    text: "A thirsty crow finds a jar with water low inside. Its beak cannot reach the water. The crow looks around and finds small stones. It drops the stones into the jar one by one. The water rises, and the crow drinks.",
    questions: [
      {
        question: "What does the crow need?",
        answer: "Water",
        skillIds: ["problem-identification"],
        questionType: "recall",
      },
      {
        question: "What does the crow put in the jar?",
        answer: "Small stones",
        skillIds: ["solution-identification"],
        questionType: "recall",
      },
      {
        question: "Why does the water rise?",
        answer: "The stones take up space and push the water up",
        skillIds: ["cause-and-effect"],
        questionType: "cause-effect",
      },
    ],
  },
  {
    id: "story-019",
    title: "Ama's New Neighbor",
    level: 3,
    storyType: "social-emotional",
    difficulty: "developing",
    shortDescription: "Ama learns how a welcoming question can begin a friendship.",
    text: "A new girl named Salma moves next door. Ama sees her sitting alone with a book. Instead of guessing what Salma likes, Ama asks, 'Would you like to play?' Salma smiles and says yes. They discover they both enjoy drawing.",
    questions: [
      {
        question: "What is the new girl's name?",
        answer: "Salma",
        skillIds: ["literal-recall"],
        questionType: "recall",
      },
      {
        question: "What does Ama ask?",
        answer: "Would you like to play?",
        skillIds: ["detail-identification"],
        questionType: "detail",
      },
      {
        question: "What do both girls enjoy?",
        answer: "Drawing",
        skillIds: ["compare-and-contrast"],
        questionType: "detail",
      },
    ],
  },
  {
    id: "story-020",
    title: "The Rain Garden",
    level: 3,
    storyType: "science",
    difficulty: "secure",
    shortDescription: "A class discovers how a garden can help after rain.",
    text: "After a heavy rain, water gathers beside the school. The class digs a shallow garden bed and fills it with plants that like wet soil. The roots help hold the soil, and the garden gives the water a place to collect. After the next rain, the puddle is smaller.",
    questions: [
      {
        question: "Where does water gather?",
        answer: "Beside the school",
        skillIds: ["setting-identification"],
        questionType: "recall",
      },
      {
        question: "What do the students plant?",
        answer: "Plants that like wet soil",
        skillIds: ["detail-identification"],
        questionType: "detail",
      },
      {
        question: "Why is the puddle smaller after the garden is made?",
        answer: "The garden collects some of the water",
        skillIds: ["cause-and-effect"],
        questionType: "cause-effect",
      },
    ],
  },
  {
    id: "story-021",
    title: "The Library Map",
    level: 3,
    storyType: "adventure",
    difficulty: "secure",
    shortDescription: "Two friends use a simple map to find a book corner.",
    text: "Hana and Idris enter the school library. A map shows the story corner beside the window. They follow the arrows past the science shelf and turn left. Soon they reach the reading rug. They find a book about oceans.",
    questions: [
      {
        question: "What does the map show?",
        answer: "Where the story corner is",
        skillIds: ["detail-identification"],
        questionType: "recall",
      },
      {
        question: "What do they pass?",
        answer: "The science shelf",
        skillIds: ["setting-identification"],
        questionType: "detail",
      },
      {
        question: "Which direction do they turn?",
        answer: "Left",
        skillIds: ["detail-identification"],
        questionType: "recall",
      },
    ],
  },
  {
    id: "story-022",
    title: "Why Did the Soup Cool?",
    level: 3,
    storyType: "science",
    difficulty: "secure",
    shortDescription: "A child investigates why warm soup changes temperature.",
    text: "Fatima helps her father make soup. She puts some in a bowl and leaves it on the table. Another portion stays in the covered pot. After a while, the bowl feels cooler than the pot. Fatima realizes the uncovered soup loses heat more easily.",
    questions: [
      {
        question: "Which soup cools faster?",
        answer: "The soup in the bowl",
        skillIds: ["detail-identification"],
        questionType: "recall",
      },
      {
        question: "Where is the warmer soup?",
        answer: "In the covered pot",
        skillIds: ["compare-and-contrast"],
        questionType: "detail",
      },
      {
        question: "Why does the bowl of soup cool faster?",
        answer: "It is uncovered and loses heat more easily",
        skillIds: ["cause-and-effect"],
        questionType: "cause-effect",
      },
    ],
  },
  {
    id: "story-023",
    title: "The Honest Pencil",
    level: 3,
    storyType: "fable",
    difficulty: "secure",
    shortDescription: "A child chooses honesty after finding something that is not hers.",
    text: "During class, Mariam finds a beautiful pencil under her desk. She wants to keep it, but she remembers it may belong to someone else. She asks the teacher. The teacher finds the owner, who is very happy. Mariam feels proud of her honest choice.",
    questions: [
      {
        question: "Where does Mariam find the pencil?",
        answer: "Under her desk",
        skillIds: ["detail-identification"],
        questionType: "recall",
      },
      {
        question: "Why does she ask the teacher?",
        answer: "The pencil may belong to someone else",
        skillIds: ["cause-and-effect"],
        questionType: "cause-effect",
      },
      {
        question: "What quality does Mariam show?",
        answer: "Honesty",
        skillIds: ["moral-understanding"],
        questionType: "moral",
      },
    ],
  },
  {
    id: "story-024",
    title: "The Smallest Team Member",
    level: 3,
    storyType: "problem-solving",
    difficulty: "secure",
    shortDescription: "A quiet child discovers that every team member can contribute.",
    text: "Four children build a model house. Everyone has a job. Sami is the youngest, so he thinks his job is not important. He notices the roof keeps sliding. Sami suggests using a wider piece underneath. The roof stays in place, and the team celebrates his idea.",
    questions: [
      {
        question: "What problem does the team have?",
        answer: "The roof keeps sliding",
        skillIds: ["problem-identification"],
        questionType: "recall",
      },
      {
        question: "What does Sami suggest?",
        answer: "Using a wider piece underneath",
        skillIds: ["solution-identification"],
        questionType: "recall",
      },
      {
        question: "What does the story show about teamwork?",
        answer: "Every team member can contribute",
        skillIds: ["main-idea"],
        questionType: "inference",
      },
    ],
  },
  {
    id: "story-025",
    title: "The Mystery of the Empty Nest",
    level: 4,
    storyType: "nature",
    difficulty: "secure",
    shortDescription: "A young explorer investigates an empty nest without disturbing it.",
    text: "During a nature walk, Zayn notices a nest high in a tree. It looks empty, but tiny feathers lie nearby. He wants to climb up, yet his guide reminds him to observe from the ground. They return later and see two young birds learning to fly. Zayn realizes an empty nest does not always mean an empty home.",
    questions: [
      {
        question: "What clues does Zayn notice?",
        answer: "Tiny feathers",
        skillIds: ["detail-identification"],
        questionType: "detail",
      },
      {
        question: "Why does he stay on the ground?",
        answer: "To avoid disturbing the nest",
        skillIds: ["cause-and-effect"],
        questionType: "cause-effect",
      },
      {
        question: "What does he learn?",
        answer: "An empty-looking nest may still be an active home",
        skillIds: ["inference"],
        questionType: "inference",
      },
    ],
  },
  {
    id: "story-026",
    title: "The River That Changed Course",
    level: 4,
    storyType: "science",
    difficulty: "secure",
    shortDescription: "Children observe how moving water changes the land.",
    text: "After a storm, the class visits a stream near the village. They notice the water now follows a slightly different path. Some soil has been carried away from one bank and deposited on another. Their teacher explains that flowing water can slowly reshape land.",
    questions: [
      {
        question: "What changed after the storm?",
        answer: "The stream's path",
        skillIds: ["literal-recall"],
        questionType: "recall",
      },
      {
        question: "What happened to some soil?",
        answer: "It was carried away and deposited elsewhere",
        skillIds: ["cause-and-effect"],
        questionType: "cause-effect",
      },
      {
        question: "What can flowing water do over time?",
        answer: "Reshape land",
        skillIds: ["main-idea"],
        questionType: "recall",
      },
    ],
  },
  {
    id: "story-027",
    title: "The Clock in the Attic",
    level: 4,
    storyType: "adventure",
    difficulty: "secure",
    shortDescription: "Two cousins solve a clue hidden inside an old clock.",
    text: "Leila and Hamza explore their grandmother's attic. They find an old clock stopped at three. A note says, 'Look where time points.' The clock's hand points toward a wooden chest. Inside is a collection of family photographs. The cousins spend the afternoon learning the stories behind each picture.",
    questions: [
      {
        question: "What time does the clock show?",
        answer: "Three",
        skillIds: ["detail-identification"],
        questionType: "recall",
      },
      {
        question: "Where does the clock point?",
        answer: "Toward a wooden chest",
        skillIds: ["inference"],
        questionType: "inference",
      },
      {
        question: "What do the cousins find in the chest?",
        answer: "Family photographs",
        skillIds: ["literal-recall"],
        questionType: "recall",
      },
    ],
  },
  {
    id: "story-028",
    title: "A Recipe for Patience",
    level: 4,
    storyType: "narrative",
    difficulty: "secure",
    shortDescription: "A child learns that rushing a recipe can change the result.",
    text: "Nadia helps prepare bread with her aunt. She wants to taste it immediately, but the dough needs time to rise. Nadia watches the bowl and waits. When the dough becomes larger and soft, they shape it and bake it. The warm bread turns out light and fluffy.",
    questions: [
      {
        question: "What needs time to rise?",
        answer: "The dough",
        skillIds: ["literal-recall"],
        questionType: "recall",
      },
      {
        question: "What happens when Nadia waits?",
        answer: "The dough becomes larger and soft",
        skillIds: ["sequencing"],
        questionType: "sequence",
      },
      {
        question: "Why is patience important in the story?",
        answer: "Some processes need time",
        skillIds: ["main-idea"],
        questionType: "inference",
      },
    ],
  },
  {
    id: "story-029",
    title: "The Reusable Bottle",
    level: 4,
    storyType: "informational",
    difficulty: "secure",
    shortDescription: "A school challenge helps students reduce single-use plastic.",
    text: "A teacher starts a reusable bottle challenge. Students bring bottles instead of buying drinks in disposable plastic cups. At the end of the week, the class counts the cups they did not use. The number surprises them. They decide to continue the habit.",
    questions: [
      {
        question: "What challenge does the teacher start?",
        answer: "A reusable bottle challenge",
        skillIds: ["literal-recall"],
        questionType: "recall",
      },
      {
        question: "What do the students avoid using?",
        answer: "Disposable plastic cups",
        skillIds: ["detail-identification"],
        questionType: "recall",
      },
      {
        question: "Why do they continue the habit?",
        answer: "It helps reduce waste",
        skillIds: ["cause-and-effect"],
        questionType: "cause-effect",
      },
    ],
  },
  {
    id: "story-030",
    title: "The Fair Share",
    level: 4,
    storyType: "social-emotional",
    difficulty: "secure",
    shortDescription: "Friends solve a disagreement by listening to one another.",
    text: "Three friends have one new board game. Each wants to play first. Instead of arguing, they explain why they are excited. They agree to take turns. The first player chooses the game piece, and the others choose next. Everyone gets a chance.",
    questions: [
      {
        question: "What causes the disagreement?",
        answer: "Everyone wants to play first",
        skillIds: ["problem-identification"],
        questionType: "recall",
      },
      {
        question: "How do they solve it?",
        answer: "They take turns",
        skillIds: ["solution-identification"],
        questionType: "recall",
      },
      {
        question: "What skill helps them solve the problem?",
        answer: "Listening",
        skillIds: ["critical-thinking"],
        questionType: "inference",
      },
    ],
  },
  {
    id: "story-031",
    title: "The Girl Who Asked Why",
    level: 4,
    storyType: "science",
    difficulty: "secure",
    shortDescription: "Curiosity leads a child to investigate a simple question.",
    text: "Every morning, a puddle near the gate disappears. Esi wonders why. She marks its edge with a stick and checks it at different times. On a sunny day it disappears faster. Her teacher explains that heat helps water change into vapor. Esi writes down her observation.",
    questions: [
      {
        question: "What question does Esi investigate?",
        answer: "Why the puddle disappears",
        skillIds: ["problem-identification"],
        questionType: "recall",
      },
      {
        question: "When does the puddle disappear faster?",
        answer: "On a sunny day",
        skillIds: ["fact-identification"],
        questionType: "detail",
      },
      {
        question: "What helps water change into vapor?",
        answer: "Heat",
        skillIds: ["cause-and-effect"],
        questionType: "recall",
      },
    ],
  },
  {
    id: "story-032",
    title: "The Secret Life of Soil",
    level: 5,
    storyType: "science",
    difficulty: "advanced",
    shortDescription: "A class discovers that healthy soil is a living system.",
    text: "When the class examines a handful of healthy soil, they find tiny roots, insects, and other small organisms. Their teacher explains that these living things help break down dead material and return nutrients to the soil. The students compare this with bare, compacted soil near the playground. They notice the garden soil is darker and holds water better.",
    questions: [
      {
        question: "What living things do the students find?",
        answer: "Insects, roots, and small organisms",
        skillIds: ["detail-identification"],
        questionType: "detail",
      },
      {
        question: "How do organisms help soil?",
        answer: "They help break down dead material and return nutrients",
        skillIds: ["cause-and-effect"],
        questionType: "cause-effect",
      },
      {
        question: "Why does the garden soil hold water better?",
        answer: "It is healthier and less compacted",
        skillIds: ["compare-and-contrast"],
        questionType: "inference",
      },
    ],
  },
  {
    id: "story-033",
    title: "The Bridge Builders",
    level: 5,
    storyType: "problem-solving",
    difficulty: "advanced",
    shortDescription: "A team improves a bridge by testing and revising its design.",
    text: "A group of learners must build a bridge from paper strips. Their first bridge bends under a stack of books. They study the weak points and fold the paper into stronger shapes. The second design holds more books. The team learns that good engineering includes testing, noticing failure, and improving the design.",
    questions: [
      {
        question: "What happens to the first bridge?",
        answer: "It bends under the books",
        skillIds: ["literal-recall"],
        questionType: "recall",
      },
      {
        question: "How do they improve it?",
        answer: "They fold the paper into stronger shapes",
        skillIds: ["solution-identification"],
        questionType: "detail",
      },
      {
        question: "What engineering lesson do they learn?",
        answer: "Testing and revision improve designs",
        skillIds: ["main-idea"],
        questionType: "inference",
      },
    ],
  },
  {
    id: "story-034",
    title: "The Message in the Stars",
    level: 5,
    storyType: "adventure",
    difficulty: "advanced",
    shortDescription: "Two friends use patterns in the night sky to solve a puzzle.",
    text: "During a camping trip, Noor notices three bright stars forming a triangle. Her brother gives her a puzzle whose clues mention a triangle and north. They use a star chart to identify the pattern and face north. A small marker near the campsite matches the final clue. They discover a box containing notes from previous campers.",
    questions: [
      {
        question: "What shape do the stars form?",
        answer: "A triangle",
        skillIds: ["detail-identification"],
        questionType: "recall",
      },
      {
        question: "What tool helps them identify the stars?",
        answer: "A star chart",
        skillIds: ["solution-identification"],
        questionType: "recall",
      },
      {
        question: "How do the stars help solve the puzzle?",
        answer: "Their pattern and direction provide clues",
        skillIds: ["inference"],
        questionType: "inference",
      },
    ],
  },
  {
    id: "story-035",
    title: "The Mango Tree Agreement",
    level: 5,
    storyType: "social-emotional",
    difficulty: "advanced",
    shortDescription: "Neighbors find a fair way to care for a shared tree.",
    text: "A mango tree grows between two homes. When fruit appears, both families want to pick it. Instead of arguing, they discuss the problem. They agree that each family will collect fruit on alternate days and leave some for birds. The tree becomes a reason for cooperation rather than conflict.",
    questions: [
      {
        question: "Why do the families disagree?",
        answer: "Both want to pick the mangoes",
        skillIds: ["problem-identification"],
        questionType: "recall",
      },
      {
        question: "What agreement do they make?",
        answer: "They collect fruit on alternate days and leave some for birds",
        skillIds: ["solution-identification"],
        questionType: "detail",
      },
      {
        question: "Why is the agreement fair?",
        answer: "Both families share the fruit and protect the tree",
        skillIds: ["critical-thinking"],
        questionType: "reasoning",
      },
    ],
  },
  {
    id: "story-036",
    title: "The Plastic-Free Picnic",
    level: 5,
    storyType: "nature",
    difficulty: "advanced",
    shortDescription: "Friends redesign a picnic to create less waste.",
    text: "Before a class picnic, the learners list everything they might throw away. They replace disposable plates with washable ones and bring food in reusable containers. They also set up separate bins for compost and recycling. At the end, the rubbish bag is much smaller than usual. The class realizes that planning can prevent waste before it is created.",
    questions: [
      {
        question: "What do they replace disposable plates with?",
        answer: "Washable plates",
        skillIds: ["detail-identification"],
        questionType: "recall",
      },
      {
        question: "What do they separate?",
        answer: "Compost and recycling",
        skillIds: ["detail-identification"],
        questionType: "recall",
      },
      {
        question: "What is the main idea?",
        answer: "Planning can reduce waste",
        skillIds: ["main-idea"],
        questionType: "inference",
      },
    ],
  },
  {
    id: "story-037",
    title: "The Power of a Good Question",
    level: 5,
    storyType: "informational",
    difficulty: "advanced",
    shortDescription: "A learner discovers that better questions lead to better investigations.",
    text: "Kojo wants to know whether plants grow better in sunlight. Instead of simply watching one plant, he asks how two similar plants would grow under different conditions. He keeps the amount of water the same and changes only the light. After two weeks, he compares their growth. His teacher praises the question because it makes a fair test possible.",
    questions: [
      {
        question: "What does Kojo want to investigate?",
        answer: "Whether plants grow better in sunlight",
        skillIds: ["literal-recall"],
        questionType: "recall",
      },
      {
        question: "What does he keep the same?",
        answer: "The amount of water",
        skillIds: ["detail-identification"],
        questionType: "detail",
      },
      {
        question: "Why is his question useful?",
        answer: "It allows a fair test",
        skillIds: ["critical-thinking"],
        questionType: "inference",
      },
    ],
  },
  {
    id: "story-038",
    title: "The Lost Mapmaker",
    level: 5,
    storyType: "adventure",
    difficulty: "advanced",
    shortDescription: "A young mapmaker learns to check assumptions when a route seems wrong.",
    text: "Safiya draws a map to a waterfall using directions from an old sign. After walking for an hour, the path ends at a dry field. She notices the sign's arrow has faded. Rather than blame the map, she compares the landscape with a compass and finds another trail. The waterfall is beyond a ridge she had not expected.",
    questions: [
      {
        question: "Why is Safiya's first route wrong?",
        answer: "The old sign's arrow has faded",
        skillIds: ["cause-and-effect"],
        questionType: "cause-effect",
      },
      {
        question: "What tools does she use?",
        answer: "The landscape and a compass",
        skillIds: ["solution-identification"],
        questionType: "detail",
      },
      {
        question: "What does she learn?",
        answer: "Check assumptions and evidence",
        skillIds: ["critical-thinking"],
        questionType: "inference",
      },
    ],
  },
  {
    id: "story-039",
    title: "The City Beneath the Soil",
    level: 6,
    storyType: "science",
    difficulty: "challenge",
    shortDescription: "A science club investigates how underground life supports a garden.",
    text: "The science club compares two garden beds. One has rich soil filled with roots and tiny organisms; the other is hard and dry. They measure moisture and observe plant growth for a month. The richer bed supports stronger plants. The learners conclude that what happens below the surface can strongly influence what happens above it.",
    questions: [
      {
        question: "What two garden beds do they compare?",
        answer: "Rich living soil and hard dry soil",
        skillIds: ["compare-and-contrast"],
        questionType: "detail",
      },
      {
        question: "What do they measure?",
        answer: "Moisture and plant growth",
        skillIds: ["detail-identification"],
        questionType: "recall",
      },
      {
        question: "What conclusion do they reach?",
        answer: "Underground conditions affect plant growth",
        skillIds: ["main-idea"],
        questionType: "inference",
      },
    ],
  },
  {
    id: "story-040",
    title: "The Wind-Powered Boat",
    level: 6,
    storyType: "problem-solving",
    difficulty: "challenge",
    shortDescription: "Learners design a small boat that moves using wind.",
    text: "A group builds boats from light materials and attaches paper sails. The first boat barely moves because its sail is too small. They test a wider sail and adjust its angle. The boat travels farther, but it tips when the sail is too high. They lower the sail and test again. The final design moves steadily without tipping.",
    questions: [
      {
        question: "Why does the first boat barely move?",
        answer: "Its sail is too small",
        skillIds: ["cause-and-effect"],
        questionType: "cause-effect",
      },
      {
        question: "What problem appears with the larger sail?",
        answer: "The boat tips",
        skillIds: ["problem-identification"],
        questionType: "recall",
      },
      {
        question: "What does the team do to solve it?",
        answer: "They lower the sail and test again",
        skillIds: ["solution-identification"],
        questionType: "sequence",
      },
    ],
  },
  {
    id: "story-041",
    title: "The Choice at the Crossroads",
    level: 6,
    storyType: "narrative",
    difficulty: "challenge",
    shortDescription: "A young traveler must choose between a fast route and a safer one.",
    text: "On the way home, Amina reaches a crossroads. One path is short but crosses a swollen stream. The other is longer and follows a marked road. Amina wants to arrive quickly, but she studies the dark clouds and the fast water. She chooses the longer road. It takes more time, but she reaches home safely before the storm becomes heavy.",
    questions: [
      {
        question: "Why is the short path risky?",
        answer: "The stream is swollen",
        skillIds: ["cause-and-effect"],
        questionType: "detail",
      },
      {
        question: "What clues influence Amina?",
        answer: "Dark clouds and fast water",
        skillIds: ["inference"],
        questionType: "detail",
      },
      {
        question: "Why does she choose the longer road?",
        answer: "It is safer",
        skillIds: ["critical-thinking"],
        questionType: "inference",
      },
    ],
  },
  {
    id: "story-042",
    title: "The Memory Garden",
    level: 6,
    storyType: "nature",
    difficulty: "challenge",
    shortDescription: "A school garden becomes a place for remembering local plants.",
    text: "The learners create signs for plants used by families in their community. An elder explains how some plants were once grown near every home. The students record names, uses, and growing conditions. Years later, younger children use the garden to learn the same knowledge. The project shows how a garden can preserve both biodiversity and community memory.",
    questions: [
      {
        question: "What do the signs record?",
        answer: "Plant names, uses, and growing conditions",
        skillIds: ["detail-identification"],
        questionType: "detail",
      },
      {
        question: "Who explains the plants' history?",
        answer: "An elder",
        skillIds: ["literal-recall"],
        questionType: "recall",
      },
      {
        question: "How does the garden preserve community memory?",
        answer: "It passes plant knowledge to younger learners",
        skillIds: ["main-idea"],
        questionType: "inference",
      },
    ],
  },
  {
    id: "story-043",
    title: "The Case of the Vanishing Water",
    level: 6,
    storyType: "problem-solving",
    difficulty: "challenge",
    shortDescription: "A team traces a surprising drop in water use at school.",
    text: "The school notices its water bill has fallen sharply. At first, everyone assumes students are using less water. The maintenance team checks the meters and discovers a repaired leak behind a wall. The learners compare the old readings with the new ones. They realize the missing water had been escaping unnoticed for months.",
    questions: [
      {
        question: "What change does the school notice?",
        answer: "Its water bill falls",
        skillIds: ["literal-recall"],
        questionType: "recall",
      },
      {
        question: "What caused the earlier high water use?",
        answer: "A hidden leak",
        skillIds: ["cause-and-effect"],
        questionType: "cause-effect",
      },
      {
        question: "Why was the leak difficult to notice?",
        answer: "It was behind a wall",
        skillIds: ["inference"],
        questionType: "inference",
      },
    ],
  },
  {
    id: "story-044",
    title: "The Question That Changed the Experiment",
    level: 6,
    storyType: "science",
    difficulty: "challenge",
    shortDescription: "A learner revises an experiment after noticing a hidden variable.",
    text: "Daniel tests whether different amounts of fertilizer affect bean growth. His first results seem clear, but he notices the plants received different amounts of sunlight. He repeats the experiment with equal light and carefully measured fertilizer. The new results are less dramatic. Daniel learns that a strong conclusion depends on controlling important variables.",
    questions: [
      {
        question: "What hidden variable does Daniel notice?",
        answer: "Different amounts of sunlight",
        skillIds: ["detail-identification"],
        questionType: "recall",
      },
      {
        question: "What does he change in the second experiment?",
        answer: "He gives the plants equal light",
        skillIds: ["sequencing"],
        questionType: "detail",
      },
      {
        question: "What does Daniel learn?",
        answer: "Strong conclusions require controlled variables",
        skillIds: ["explanation"],
        questionType: "inference",
      },
    ],
  },
  {
    id: "story-045",
    title: "The Village That Measured Time",
    level: 7,
    storyType: "informational",
    difficulty: "challenge",
    shortDescription: "A story about how communities once used natural signs to organize daily life.",
    text: "Before clocks were common, people observed shadows, sunrise, sunset, and recurring natural events to organize activities. In one village, farmers noticed that the shadow of a tall post changed length during the day. They used this observation alongside the position of the sun. The system was not as precise as a modern clock, but it helped the community coordinate work.",
    questions: [
      {
        question: "What natural signs did people observe?",
        answer: "Shadows, sunrise, sunset, and recurring events",
        skillIds: ["fact-identification"],
        questionType: "detail",
      },
      {
        question: "Why was the system less precise than a modern clock?",
        answer: "Natural signs are less exact",
        skillIds: ["compare-and-contrast"],
        questionType: "inference",
      },
      {
        question: "What does the story show?",
        answer: "People can use observations to organize activities",
        skillIds: ["main-idea"],
        questionType: "inference",
      },
    ],
  },
  {
    id: "story-046",
    title: "The Forest's Hidden Conversation",
    level: 7,
    storyType: "nature",
    difficulty: "challenge",
    shortDescription: "A learner discovers that plants and organisms interact in complex ways.",
    text: "During a forest study, researchers observe that some trees grow near fungi connected to their roots. The fungi receive sugars from the plants while helping the roots obtain nutrients and water. The learners realize that a forest is not simply a collection of separate organisms. Many living things depend on relationships that are easy to miss.",
    questions: [
      {
        question: "What do the fungi receive from the trees?",
        answer: "Sugars",
        skillIds: ["detail-identification"],
        questionType: "recall",
      },
      {
        question: "How do the fungi help the roots?",
        answer: "They help obtain nutrients and water",
        skillIds: ["cause-and-effect"],
        questionType: "recall",
      },
      {
        question: "What is the main idea?",
        answer: "Forest organisms depend on complex relationships",
        skillIds: ["main-idea"],
        questionType: "inference",
      },
    ],
  },
  {
    id: "story-047",
    title: "The Bridge That Learned",
    level: 7,
    storyType: "problem-solving",
    difficulty: "challenge",
    shortDescription: "An engineering team uses repeated testing to improve a structure.",
    text: "A team designs a bridge model and tests it under increasing loads. At each failure, they record where the structure bends or breaks. Instead of simply making the bridge thicker, they change the shape of the supports. Several versions fail before one performs well. Their teacher explains that engineering progress often comes from learning systematically from failure.",
    questions: [
      {
        question: "What do the learners record?",
        answer: "Where the structure bends or breaks",
        skillIds: ["detail-identification"],
        questionType: "detail",
      },
      {
        question: "What do they change instead of only making it thicker?",
        answer: "The shape of the supports",
        skillIds: ["solution-identification"],
        questionType: "recall",
      },
      {
        question: "What does the process demonstrate?",
        answer: "Systematic learning from failure improves designs",
        skillIds: ["main-idea"],
        questionType: "inference",
      },
    ],
  },
  {
    id: "story-048",
    title: "The Rumor at School",
    level: 7,
    storyType: "social-emotional",
    difficulty: "challenge",
    shortDescription: "A learner learns to verify information before repeating it.",
    text: "A message spreads that a school activity has been cancelled. Many learners repeat it without checking. Mariam looks at the official notice and discovers that the activity is still happening. She tells her friends to check reliable information before sharing messages. The rumor fades because people begin checking the source.",
    questions: [
      {
        question: "What rumor spreads?",
        answer: "That the school activity is cancelled",
        skillIds: ["literal-recall"],
        questionType: "recall",
      },
      {
        question: "How does Mariam check the claim?",
        answer: "She looks at the official notice",
        skillIds: ["solution-identification"],
        questionType: "detail",
      },
      {
        question: "What lesson does the story teach?",
        answer: "Verify information before sharing it",
        skillIds: ["critical-thinking"],
        questionType: "moral",
      },
    ],
  },
  {
    id: "story-049",
    title: "The Last Piece of the Puzzle",
    level: 7,
    storyType: "problem-solving",
    difficulty: "challenge",
    shortDescription: "A difficult puzzle teaches a learner to reconsider an assumption.",
    text: "Yara has one missing piece in a large puzzle. She tries forcing pieces into the empty space, but none fits. She studies the picture again and notices that the empty space is not where she first thought. A small piece she had placed elsewhere belongs there instead. Once she moves it, the final piece fits easily.",
    questions: [
      {
        question: "Why does Yara struggle at first?",
        answer: "She assumes the empty space is in the wrong place",
        skillIds: ["inference"],
        questionType: "inference",
      },
      {
        question: "What does she notice?",
        answer: "The empty space is not where she first thought",
        skillIds: ["detail-identification"],
        questionType: "detail",
      },
      {
        question: "What strategy solves the puzzle?",
        answer: "Reconsidering her assumption",
        skillIds: ["critical-thinking"],
        questionType: "inference",
      },
    ],
  },
  {
    id: "story-050",
    title: "The Children Who Planted Tomorrow",
    level: 7,
    storyType: "nature",
    difficulty: "challenge",
    shortDescription: "A group of learners plans a long-term community garden.",
    text: "A group of learners wants to improve an unused piece of land. They interview neighbors, study the soil, choose suitable plants, and design a watering plan. They also leave space for compost and insects that support the garden. The first harvest is small, but they keep records and improve the garden each season. Years later, younger children inherit a thriving space and add ideas of their own.",
    questions: [
      {
        question: "What do the learners study before planting?",
        answer: "The soil",
        skillIds: ["detail-identification"],
        questionType: "recall",
      },
      {
        question: "Why do they leave space for compost and insects?",
        answer: "They support a healthy garden",
        skillIds: ["cause-and-effect"],
        questionType: "cause-effect",
      },
      {
        question: "What is the deeper message of the story?",
        answer: "Long-term care can create benefits for future generations",
        skillIds: ["main-idea", "moral-understanding"],
        questionType: "inference",
      },
    ],
  },
];

const LEVEL_ANCHORS: Readonly<Record<StoryLevel, string | null>> = {
  1: null,
  2: 'story-008',
  3: 'story-016',
  4: 'story-024',
  5: 'story-031',
  6: 'story-038',
  7: 'story-044',
};

export const STORY_CURRICULUM: readonly StoryData[] = STORY_SEEDS.map((story) =>
  createStory(
    story,
    LEVEL_ANCHORS[story.level] ? [LEVEL_ANCHORS[story.level] as string] : [],
  ),
);

export const STORY_COUNT = STORY_CURRICULUM.length;
