import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Lightbulb,
  RotateCcw,
  Star,
  Target,
} from "lucide-react";

type Difficulty = "Easy" | "Medium" | "Hard";
type LogicSkill =
  | "Classification"
  | "Observation"
  | "Pattern Recognition"
  | "Sequencing"
  | "Odd One Out"
  | "Deduction"
  | "Cause and Effect"
  | "Spatial Reasoning"
  | "Problem Solving"
  | "Logic";
type LearningMode = "guided" | "practice" | "mastery";

interface LogicChallenge {
  id: number;
  level: number;
  title: string;
  skill: LogicSkill;
  difficulty: Difficulty;
  instruction: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  hint: string;
  learningPoint: string;
  emoji?: string;
}

interface LogicProgress {
  attempts: number;
  mastered: boolean;
}

interface ClassificationSorterProps {
  onComplete?: (score: number) => void;
}

/*
 * LOGIC & REASONING CURRICULUM
 *
 * Level 1 — Observe & Classify
 * Level 2 — Patterns & Sequences
 * Level 3 — Reason & Deduce
 * Level 4 — Solve & Think
 *
 * The child should not be locked out of later levels.
 * Progression can be controlled by the parent dashboard
 * using mastery data from the wider ELP progress system.
 */

const CHALLENGES: LogicChallenge[] = [
  // ============================================================
  // LEVEL 1 — OBSERVE & CLASSIFY
  // ============================================================

  {
    id: 1,
    level: 1,
    title: "Find the Fruits",
    skill: "Classification",
    difficulty: "Easy",
    instruction: "Look carefully. Which item belongs with the fruits?",
    question: "Which one is a fruit?",
    options: ["🍎", "🐶", "🚗", "👕"],
    answer: "🍎",
    explanation: "An apple is a fruit. The dog is an animal, the car is a vehicle, and the shirt is clothing.",
    hint: "Think about something you can eat that grows from a plant.",
    learningPoint: "Classification means putting things into groups based on what they have in common.",
  },
  {
    id: 2,
    level: 1,
    title: "Find the Animals",
    skill: "Classification",
    difficulty: "Easy",
    instruction: "Which item belongs in the animal group?",
    question: "Which one is an animal?",
    options: ["🍌", "🐱", "🚌", "⚽"],
    answer: "🐱",
    explanation: "A cat is an animal.",
    hint: "Which one can move and breathe by itself?",
    learningPoint: "We can classify objects by what they are.",
  },
  {
    id: 3,
    level: 1,
    title: "Find the Vehicle",
    skill: "Classification",
    difficulty: "Easy",
    instruction: "Find the object that helps people travel.",
    question: "Which one is a vehicle?",
    options: ["🍓", "🧸", "🚗", "🐟"],
    answer: "🚗",
    explanation: "A car is a vehicle used for transportation.",
    hint: "Which one can carry people from one place to another?",
    learningPoint: "Objects can be grouped according to their purpose.",
  },
  {
    id: 4,
    level: 1,
    title: "Which Does Not Belong?",
    skill: "Odd One Out",
    difficulty: "Easy",
    instruction: "Three belong together. Find the one that does not.",
    question: "Which one does not belong?",
    options: ["🍎", "🍌", "🍓", "🐶"],
    answer: "🐶",
    explanation: "The apple, banana, and strawberry are fruits. The dog is an animal.",
    hint: "Look at what you can eat.",
    learningPoint: "Odd-one-out problems help us notice similarities and differences.",
  },
  {
    id: 5,
    level: 1,
    title: "Match the Group",
    skill: "Classification",
    difficulty: "Easy",
    instruction: "Find the object that belongs with the clothing.",
    question: "Which one belongs with clothes?",
    options: ["👕", "🍕", "🔨", "🐟"],
    answer: "👕",
    explanation: "A shirt is something we wear.",
    hint: "Which object can you wear?",
    learningPoint: "Classification helps us organize information into meaningful groups.",
  },
  {
    id: 6,
    level: 1,
    title: "Same Colour Family",
    skill: "Observation",
    difficulty: "Easy",
    instruction: "Look at the colours carefully.",
    question: "Which one is blue?",
    options: ["🔴", "🟢", "🔵", "🟡"],
    answer: "🔵",
    explanation: "The blue circle is the only blue choice.",
    hint: "Look for the colour of the sky on a clear day.",
    learningPoint: "Careful observation is an important part of logical thinking.",
  },
  {
    id: 7,
    level: 1,
    title: "Food Group",
    skill: "Classification",
    difficulty: "Easy",
    instruction: "Find the item that belongs to the food group.",
    question: "Which one is food?",
    options: ["🍞", "🚲", "👟", "🐱"],
    answer: "🍞",
    explanation: "Bread is food.",
    hint: "Which one can you eat?",
    learningPoint: "We can classify objects according to their use and properties.",
  },
  {
    id: 8,
    level: 1,
    title: "Tool or Toy?",
    skill: "Classification",
    difficulty: "Easy",
    instruction: "Which one is a tool?",
    question: "Which one is used as a tool?",
    options: ["🧸", "⚽", "🔨", "🍎"],
    answer: "🔨",
    explanation: "A hammer is a tool used for building and fixing things.",
    hint: "Which one helps someone make or repair something?",
    learningPoint: "Logical classification can use function as well as appearance.",
  },

  // ============================================================
  // LEVEL 2 — PATTERNS & SEQUENCES
  // ============================================================

  {
    id: 9,
    level: 2,
    title: "Colour Pattern",
    skill: "Pattern Recognition",
    difficulty: "Easy",
    instruction: "Look at the repeating pattern.",
    question: "What comes next? 🔴 🔵 🔴 🔵 ?",
    options: ["🔴", "🟢", "🟡", "🟣"],
    answer: "🔴",
    explanation: "The pattern repeats red, blue, red, blue. The next item is red.",
    hint: "Say the colours aloud: red, blue, red, blue...",
    learningPoint: "Patterns often repeat in a predictable order.",
  },
  {
    id: 10,
    level: 2,
    title: "Shape Pattern",
    skill: "Pattern Recognition",
    difficulty: "Easy",
    instruction: "Find the missing shape.",
    question: "What comes next? 🔺 🟦 🔺 🟦 ?",
    options: ["🔺", "🟢", "🟡", "⭐"],
    answer: "🔺",
    explanation: "The two-shape pattern repeats triangle, square, triangle, square.",
    hint: "Look at the first two shapes and repeat them.",
    learningPoint: "Recognizing repetition helps us predict what comes next.",
  },
  {
    id: 11,
    level: 2,
    title: "Number Sequence",
    skill: "Sequencing",
    difficulty: "Easy",
    instruction: "The numbers are growing by one.",
    question: "What comes next? 1, 2, 3, 4, ?",
    options: ["3", "4", "5", "6"],
    answer: "5",
    explanation: "Each number increases by one.",
    hint: "Count forward from four.",
    learningPoint: "A sequence follows an order or rule.",
  },
  {
    id: 12,
    level: 2,
    title: "Growing Pattern",
    skill: "Pattern Recognition",
    difficulty: "Medium",
    instruction: "Notice how the number of stars changes.",
    question: "What comes next? ⭐, ⭐⭐, ⭐⭐⭐, ?",
    options: ["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐"],
    answer: "⭐⭐⭐⭐",
    explanation: "One star is added each time.",
    hint: "Count the stars in each group.",
    learningPoint: "Some patterns grow according to a simple rule.",
  },
  {
    id: 13,
    level: 2,
    title: "Animal Sequence",
    skill: "Sequencing",
    difficulty: "Medium",
    instruction: "Watch the repeating order.",
    question: "What comes next? 🐱 🐶 🐱 🐶 ?",
    options: ["🐱", "🐭", "🐶", "🐰"],
    answer: "🐱",
    explanation: "The sequence alternates between cat and dog.",
    hint: "The same two animals keep taking turns.",
    learningPoint: "Sequences can be built by alternating between items.",
  },
  {
    id: 14,
    level: 2,
    title: "Size Sequence",
    skill: "Sequencing",
    difficulty: "Medium",
    instruction: "Look at the size order.",
    question: "What should come next? Small → Medium → Large → ?",
    options: ["Small", "Medium", "Large", "Tiny"],
    answer: "Small",
    explanation: "If the sequence repeats, the next item returns to small.",
    hint: "The sequence goes small, medium, large and starts again.",
    learningPoint: "Sequences can repeat after reaching the end of a cycle.",
  },
  {
    id: 15,
    level: 2,
    title: "Odd One Out",
    skill: "Odd One Out",
    difficulty: "Medium",
    instruction: "Three objects share something important.",
    question: "Which one does not belong?",
    options: ["🚗", "🚌", "🚲", "🍎"],
    answer: "🍎",
    explanation: "The car, bus, and bicycle are used for transportation. The apple is food.",
    hint: "Think about how the objects are used.",
    learningPoint: "Logical thinkers compare items using shared properties.",
  },
  {
    id: 16,
    level: 2,
    title: "Complete the Sequence",
    skill: "Pattern Recognition",
    difficulty: "Medium",
    instruction: "Find the missing part of the pattern.",
    question: "What comes next? 🟢 🟢 🔵 🟢 🟢 🔵 ?",
    options: ["🟢", "🔵", "🔴", "🟡"],
    answer: "🟢",
    explanation: "The pattern is two green circles followed by one blue circle.",
    hint: "Group the pattern as: green, green, blue.",
    learningPoint: "Breaking a pattern into smaller groups can make it easier to solve.",
  },

  // ============================================================
  // LEVEL 3 — REASON & DEDUCE
  // ============================================================

  {
    id: 17,
    level: 3,
    title: "What Belongs Together?",
    skill: "Deduction",
    difficulty: "Medium",
    instruction: "Think about what each object is used for.",
    question: "Which pair belongs together?",
    options: ["🔑 + 🔒", "🍎 + 🚗", "🐟 + 👟", "☀️ + 🧸"],
    answer: "🔑 + 🔒",
    explanation: "A key and a lock work together.",
    hint: "Think about objects that have a matching purpose.",
    learningPoint: "Deduction means using information to work out a sensible answer.",
  },
  {
    id: 18,
    level: 3,
    title: "Cause and Effect",
    skill: "Cause and Effect",
    difficulty: "Medium",
    instruction: "Think about what happens when something changes.",
    question: "If it starts raining, what will probably happen?",
    options: ["The ground gets wet.", "The sun gets closer.", "The moon disappears.", "Trees start walking."],
    answer: "The ground gets wet.",
    explanation: "Rain falls onto the ground and makes it wet.",
    hint: "Think about what rain does to things outside.",
    learningPoint: "Cause-and-effect reasoning helps us understand why things happen.",
  },
  {
    id: 19,
    level: 3,
    title: "Which Comes First?",
    skill: "Sequencing",
    difficulty: "Medium",
    instruction: "Put the actions in a sensible order.",
    question: "What should you do first when planting a seed?",
    options: ["Water the seed.", "Eat the plant.", "Pick the fruit.", "Throw the plant away."],
    answer: "Water the seed.",
    explanation: "After placing a seed in suitable soil, we need to provide water so it can begin growing.",
    hint: "Plants need water to grow.",
    learningPoint: "Good reasoning helps us understand the order in which actions should happen.",
  },
  {
    id: 20,
    level: 3,
    title: "Simple Deduction",
    skill: "Deduction",
    difficulty: "Medium",
    instruction: "Use the clues to find the answer.",
    question: "A bird has wings. Which thing can it probably do?",
    options: ["Fly", "Drive a car", "Cook dinner", "Wear shoes"],
    answer: "Fly",
    explanation: "Wings are used by many birds for flying.",
    hint: "Think about what wings help an animal do.",
    learningPoint: "Deduction uses known information to make a reasonable conclusion.",
  },
  {
    id: 21,
    level: 3,
    title: "Tool Matching",
    skill: "Problem Solving",
    difficulty: "Medium",
    instruction: "Choose the tool that best solves the problem.",
    question: "A screw is loose. Which tool would help?",
    options: ["🪛", "🍎", "🧸", "🥄"],
    answer: "🪛",
    explanation: "A screwdriver is designed to turn screws.",
    hint: "Choose the object designed to work with a screw.",
    learningPoint: "Problem solving means choosing an action or tool that fits the problem.",
  },
  {
    id: 22,
    level: 3,
    title: "Which Is Heavier?",
    skill: "Observation",
    difficulty: "Medium",
    instruction: "Use common sense about the objects shown.",
    question: "Which is probably heavier?",
    options: ["A feather 🪶", "A small stone 🪨", "A bubble 🫧", "A leaf 🍃"],
    answer: "A small stone 🪨",
    explanation: "A stone is generally heavier than a feather, bubble, or leaf of similar size.",
    hint: "Think about what would fall quickly when dropped.",
    learningPoint: "Reasoning can use observations about the physical world.",
  },
  {
    id: 23,
    level: 3,
    title: "Spatial Reasoning",
    skill: "Spatial Reasoning",
    difficulty: "Medium",
    instruction: "Think about position.",
    question: "If the ball is under the table, where is the ball?",
    options: ["Below the table", "Above the table", "Inside the sky", "Behind the moon"],
    answer: "Below the table",
    explanation: "Under means below.",
    hint: "What is another word for under?",
    learningPoint: "Spatial reasoning helps us understand where objects are in relation to one another.",
  },
  {
    id: 24,
    level: 3,
    title: "True or Not?",
    skill: "Deduction",
    difficulty: "Medium",
    instruction: "Use the information given.",
    question: "All cats in this group have four legs. Mimi is a cat. What can we conclude?",
    options: ["Mimi has four legs.", "Mimi is a bird.", "Mimi is a car.", "Mimi has wheels."],
    answer: "Mimi has four legs.",
    explanation: "If every cat in the group has four legs and Mimi is a cat, Mimi has four legs.",
    hint: "Use both pieces of information together.",
    learningPoint: "Logical conclusions can be made by combining facts.",
  },

  // ============================================================
  // LEVEL 4 — SOLVE & THINK
  // ============================================================

  {
    id: 25,
    level: 4,
    title: "Three-Step Thinking",
    skill: "Sequencing",
    difficulty: "Hard",
    instruction: "Think through the complete process.",
    question: "What is the best order for making a simple sandwich?",
    options: [
      "Get bread → add filling → put the pieces together",
      "Eat filling → get bread → put it away",
      "Put it away → add filling → get bread",
      "Throw away bread → add filling → eat",
    ],
    answer: "Get bread → add filling → put the pieces together",
    explanation: "A sensible sequence is to prepare the bread, add the filling, and then put the sandwich together.",
    hint: "You need the ingredients before you can assemble them.",
    learningPoint: "Complex problems can be solved by breaking them into ordered steps.",
  },
  {
    id: 26,
    level: 4,
    title: "Conditional Thinking",
    skill: "Deduction",
    difficulty: "Hard",
    instruction: "Use the rule carefully.",
    question: "If the light is red, cars must stop. The light is red. What should cars do?",
    options: ["Stop", "Speed up", "Fly", "Turn into boats"],
    answer: "Stop",
    explanation: "The rule says that when the light is red, cars must stop.",
    hint: "Follow the rule exactly.",
    learningPoint: "Conditional reasoning follows an IF → THEN rule.",
  },
  {
    id: 27,
    level: 4,
    title: "Find the Rule",
    skill: "Pattern Recognition",
    difficulty: "Hard",
    instruction: "Discover what changes each time.",
    question: "What comes next? 2, 4, 6, 8, ?",
    options: ["9", "10", "11", "12"],
    answer: "10",
    explanation: "Each number increases by 2.",
    hint: "Compare each number with the one before it.",
    learningPoint: "Finding the rule is an important step in solving patterns.",
  },
  {
    id: 28,
    level: 4,
    title: "Double Rule",
    skill: "Pattern Recognition",
    difficulty: "Hard",
    instruction: "Look for two rules working together.",
    question: "What comes next? 🔴 1, 🔵 2, 🔴 3, 🔵 4, ?",
    options: ["🔴 5", "🔵 5", "🔴 6", "🟢 5"],
    answer: "🔴 5",
    explanation: "The colours alternate red and blue while the numbers increase by one.",
    hint: "There are two patterns: one for colour and one for numbers.",
    learningPoint: "Advanced patterns may contain more than one rule at the same time.",
  },
  {
    id: 29,
    level: 4,
    title: "Best Solution",
    skill: "Problem Solving",
    difficulty: "Hard",
    instruction: "Choose the solution that solves the problem safely.",
    question: "A toy is stuck under a table. What is the best first idea?",
    options: [
      "Move safely closer and use your hand if you can reach it.",
      "Break the table.",
      "Run away.",
      "Throw something heavy at the table.",
    ],
    answer: "Move safely closer and use your hand if you can reach it.",
    explanation: "A good problem solver tries a simple and safe solution before using more complicated actions.",
    hint: "Choose the safe solution that directly solves the problem.",
    learningPoint: "Good problem solving considers both effectiveness and safety.",
  },
  {
    id: 30,
    level: 4,
    title: "Which Cannot Be True?",
    skill: "Logic",
    difficulty: "Hard",
    instruction: "Look carefully at each possibility.",
    question: "Which statement cannot be true?",
    options: [
      "A fish can swim.",
      "A bird can have wings.",
      "A stone can eat lunch.",
      "A child can read a book.",
    ],
    answer: "A stone can eat lunch.",
    explanation: "A stone is not a living creature and cannot eat lunch.",
    hint: "Which statement describes something impossible?",
    learningPoint: "Logical thinking includes identifying statements that conflict with what we know.",
  },
  {
    id: 31,
    level: 4,
    title: "Plan the Route",
    skill: "Spatial Reasoning",
    difficulty: "Hard",
    instruction: "Think about direction and movement.",
    question: "You are facing north. You turn right. Which direction are you facing?",
    options: ["East", "West", "South", "North"],
    answer: "East",
    explanation: "When you face north and turn right, you face east.",
    hint: "Imagine a compass and turn clockwise.",
    learningPoint: "Spatial reasoning helps us understand direction and movement.",
  },
  {
    id: 32,
    level: 4,
    title: "Final Logic Challenge",
    skill: "Problem Solving",
    difficulty: "Hard",
    instruction: "Use everything you know about patterns and reasoning.",
    question: "There are three boxes. The red box is heavier than the blue box. The blue box is heavier than the green box. Which is lightest?",
    options: ["Red", "Blue", "Green", "They are all equal"],
    answer: "Green",
    explanation: "If red is heavier than blue and blue is heavier than green, green is the lightest.",
    hint: "Put the three boxes in order from heaviest to lightest.",
    learningPoint: "Logical reasoning lets us combine several relationships to reach a conclusion.",
  },
];

const MODE_INFO: Record<
  LearningMode,
  { title: string; description: string }
> = {
  guided: {
    title: "Guided",
    description: "Learn the reasoning idea first, then solve the challenge.",
  },
  practice: {
    title: "Practice",
    description: "Try challenges and receive feedback after each answer.",
  },
  mastery: {
    title: "Mastery",
    description: "Solve independently and show that you understand the skill.",
  },
};

const LEVEL_INFO = [
  {
    level: 1,
    title: "Observe & Classify",
    description: "Notice similarities, differences and groups.",
  },
  {
    level: 2,
    title: "Patterns & Sequences",
    description: "Find rules and predict what comes next.",
  },
  {
    level: 3,
    title: "Reason & Deduce",
    description: "Use clues to make sensible conclusions.",
  },
  {
    level: 4,
    title: "Solve & Think",
    description: "Combine rules, sequences and reasoning to solve problems.",
  },
];

export const ClassificationSorter: React.FC<ClassificationSorterProps> = ({
  onComplete,
}) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState<LearningMode>("guided");

  const [progress, setProgress] = useState<Record<number, LogicProgress>>(
    {}
  );

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerChecked, setAnswerChecked] = useState(false);

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const [hintShown, setHintShown] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const levelChallenges = useMemo(
    () => CHALLENGES.filter((challenge) => challenge.level === currentLevel),
    [currentLevel]
  );

  const currentChallenge = levelChallenges[currentIndex];

  const currentProgress = currentChallenge
    ? progress[currentChallenge.id] ?? {
        attempts: 0,
        mastered: false,
      }
    : {
        attempts: 0,
        mastered: false,
      };

  const levelMastered = levelChallenges.filter(
    (challenge) => progress[challenge.id]?.mastered
  ).length;

  const masteryPercentage =
    levelChallenges.length > 0
      ? Math.round((levelMastered / levelChallenges.length) * 100)
      : 0;

  const navigationProgress =
    levelChallenges.length > 0
      ? ((currentIndex + (answerChecked ? 1 : 0)) /
          levelChallenges.length) *
        100
      : 0;

  const updateProgress = (
    challengeId: number,
    updater: (previous: LogicProgress) => LogicProgress
  ) => {
    setProgress((previous) => {
      const existing = previous[challengeId] ?? {
        attempts: 0,
        mastered: false,
      };

      return {
        ...previous,
        [challengeId]: updater(existing),
      };
    });
  };

  const handleAnswer = (option: string) => {
    if (!currentChallenge || answerChecked) return;

    const correct = option === currentChallenge.answer;

    setSelectedAnswer(option);
    setAnswerChecked(true);

    updateProgress(currentChallenge.id, (previous) => ({
      attempts: previous.attempts + 1,
      mastered:
        previous.mastered || (correct && mode === "mastery"),
    }));

    if (correct) {
      const firstMastery =
        !currentProgress.mastered && mode !== "guided";

      const points = firstMastery ? 10 : 0;
      const newStreak = streak + 1;
      const streakBonus = firstMastery && newStreak >= 3 ? 5 : 0;

      if (points > 0 || streakBonus > 0) {
        setScore((previous) => previous + points + streakBonus);
      }

      setStreak(newStreak);
    } else {
      setStreak(0);
    }
  };

  const completeGuidedChallenge = () => {
    if (!currentChallenge) return;

    updateProgress(currentChallenge.id, (previous) => ({
      attempts: previous.attempts + 1,
      mastered: true,
    }));

    if (!currentProgress.mastered) {
      setScore((previous) => previous + 10);
    }

    setStreak((previous) => previous + 1);
    setAnswerChecked(true);
    setSelectedAnswer(currentChallenge.answer);
  };

  const nextChallenge = () => {
    if (!currentChallenge) return;

    if (currentIndex < levelChallenges.length - 1) {
      setCurrentIndex((previous) => previous + 1);
      setSelectedAnswer(null);
      setAnswerChecked(false);
      setHintShown(false);
      return;
    }

    setIsComplete(true);
  };

  const previousChallenge = () => {
    if (currentIndex === 0) return;

    setCurrentIndex((previous) => previous - 1);
    setSelectedAnswer(null);
    setAnswerChecked(false);
    setHintShown(false);
  };

  const finishAndMoveUp = () => {
    if (hasFinished) return;

    setHasFinished(true);
    onComplete?.(score);
  };

  const changeLevel = (level: number) => {
    setCurrentLevel(level);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswerChecked(false);
    setHintShown(false);
    setIsComplete(false);
    setHasFinished(false);
  };

  const resetModule = () => {
    setCurrentLevel(1);
    setCurrentIndex(0);
    setMode("guided");
    setProgress({});
    setSelectedAnswer(null);
    setAnswerChecked(false);
    setScore(0);
    setStreak(0);
    setHintShown(false);
    setIsComplete(false);
    setHasFinished(false);
  };

  if (isComplete) {
    return (
      <div className="max-w-2xl mx-auto bg-app-card rounded-3xl border border-app-border shadow-xl overflow-hidden">
        <div className="p-8 text-center">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 mx-auto mb-5 rounded-full bg-green-500/15 flex items-center justify-center"
          >
            <CheckCircle className="w-11 h-11 text-green-400" />
          </motion.div>

          <h2 className="text-3xl font-bold text-white mb-2">
            Level {currentLevel} Complete
          </h2>

          <p className="text-gray-400 mb-6">
            You completed {LEVEL_INFO[currentLevel - 1].title}.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="rounded-2xl bg-gray-800 p-4">
              <Star className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-white">{score}</p>
              <p className="text-xs text-gray-400">Score</p>
            </div>

            <div className="rounded-2xl bg-gray-800 p-4">
              <Target className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-white">
                {levelMastered}/{levelChallenges.length}
              </p>
              <p className="text-xs text-gray-400">Mastered</p>
            </div>

            <div className="rounded-2xl bg-gray-800 p-4">
              <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-white">
                {masteryPercentage}%
              </p>
              <p className="text-xs text-gray-400">Mastery</p>
            </div>
          </div>

          <div className="rounded-2xl bg-gray-800/70 p-5 text-left mb-6">
            <h3 className="font-bold text-white mb-3">
              What you practised
            </h3>

            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Observation and classification</li>
              <li>• Pattern recognition</li>
              <li>• Sequencing and ordering</li>
              <li>• Deductive reasoning</li>
              <li>• Problem solving</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setCurrentIndex(0);
                setSelectedAnswer(null);
                setAnswerChecked(false);
                setHintShown(false);
                setIsComplete(false);
                setHasFinished(false);
              }}
              className="px-5 py-3 rounded-xl bg-gray-800 text-white font-bold flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Learn Again
            </button>

            {currentLevel < 4 ? (
              <button
                onClick={() => changeLevel(currentLevel + 1)}
                className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center gap-2"
              >
                Next Level
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={finishAndMoveUp}
                className="px-5 py-3 rounded-xl bg-green-600 text-white font-bold flex items-center justify-center gap-2"
              >
                Finish & Move Up
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!currentChallenge) {
    return (
      <div className="max-w-2xl mx-auto bg-app-card rounded-3xl border border-app-border p-8 text-center">
        <p className="text-white font-bold mb-4">
          No logic challenge is available for this level.
        </p>

        <button
          onClick={resetModule}
          className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold"
        >
          Reset Logic
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-app-card rounded-3xl border border-app-border shadow-xl overflow-hidden">
      {/* HEADER */}
      <div className="p-5 sm:p-6 border-b border-app-border">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-indigo-400 font-bold">
              Logic & Reasoning
            </p>

            <h2 className="text-2xl font-bold text-white">
              {currentChallenge.title}
            </h2>
          </div>

          <button
            onClick={resetModule}
            className="p-2.5 rounded-xl bg-gray-800 text-gray-300 hover:text-white"
            aria-label="Reset logic module"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <span className="px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 text-xs font-bold">
            Level {currentLevel}
          </span>

          <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-xs font-bold">
            {currentChallenge.skill}
          </span>

          <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-xs font-bold">
            {currentChallenge.difficulty}
          </span>

          <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-300 text-xs font-bold">
            Score: {score}
          </span>

          {streak > 1 && (
            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-300 text-xs font-bold">
              Streak: {streak}
            </span>
          )}
        </div>
      </div>

      {/* LEVEL SELECTOR */}
      <div className="px-5 sm:px-6 pt-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {LEVEL_INFO.map((level) => (
            <button
              key={level.level}
              onClick={() => changeLevel(level.level)}
              className={`p-3 rounded-xl text-left border transition ${
                currentLevel === level.level
                  ? "border-indigo-400 bg-indigo-500/10"
                  : "border-gray-800 bg-gray-800/60"
              }`}
            >
              <p className="text-xs text-gray-400">
                Level {level.level}
              </p>

              <p className="text-sm font-bold text-white">
                {level.title}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* MODE SELECTOR */}
      <div className="p-5 sm:p-6">
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(MODE_INFO) as LearningMode[]).map((learningMode) => (
            <button
              key={learningMode}
              onClick={() => {
                setMode(learningMode);
                setSelectedAnswer(null);
                setAnswerChecked(false);
                setHintShown(false);
              }}
              className={`p-3 rounded-xl border text-left transition ${
                mode === learningMode
                  ? "border-indigo-400 bg-indigo-500/10"
                  : "border-gray-800 bg-gray-800/60"
              }`}
            >
              <p className="text-sm font-bold text-white capitalize">
                {MODE_INFO[learningMode].title}
              </p>

              <p className="text-[11px] text-gray-400 mt-1 hidden sm:block">
                {MODE_INFO[learningMode].description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* PROGRESS */}
      <div className="px-5 sm:px-6">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>
            Challenge {currentIndex + 1} of {levelChallenges.length}
          </span>

          <span>{Math.round(navigationProgress)}%</span>
        </div>

        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-500 rounded-full"
            animate={{ width: `${navigationProgress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* CHALLENGE */}
      <div className="p-5 sm:p-6">
        <div className="rounded-2xl bg-gray-800/60 border border-gray-700 p-5 mb-5">
          <p className="text-sm text-indigo-300 font-bold mb-2">
            {currentChallenge.instruction}
          </p>

          <h3 className="text-xl sm:text-2xl font-bold text-white">
            {currentChallenge.question}
          </h3>

          {currentChallenge.emoji && (
            <div className="text-5xl text-center mt-5">
              {currentChallenge.emoji}
            </div>
          )}
        </div>

        {/* GUIDED EXPLANATION */}
        {mode === "guided" && !answerChecked && (
          <div className="rounded-2xl bg-indigo-500/10 border border-indigo-400/20 p-4 mb-5">
            <div className="flex gap-3">
              <Lightbulb className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />

              <div>
                <p className="text-sm font-bold text-white mb-1">
                  Think like a problem solver
                </p>

                <p className="text-sm text-gray-300">
                  {currentChallenge.learningPoint}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ANSWERS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentChallenge.options.map((option) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === currentChallenge.answer;

            let className =
              "p-4 rounded-2xl border-2 text-left font-bold text-white transition ";

            if (!answerChecked) {
              className +=
                "border-gray-700 bg-gray-800 hover:border-indigo-400 hover:bg-indigo-500/10";
            } else if (isCorrect) {
              className +=
                "border-green-400 bg-green-500/10 text-green-300";
            } else if (isSelected) {
              className += "border-red-400 bg-red-500/10 text-red-300";
            } else {
              className +=
                "border-gray-800 bg-gray-800/50 text-gray-500";
            }

            return (
              <motion.button
                key={option}
                whileHover={!answerChecked ? { scale: 1.02 } : undefined}
                whileTap={!answerChecked ? { scale: 0.98 } : undefined}
                onClick={() =>
                  mode === "guided"
                    ? completeGuidedChallenge()
                    : handleAnswer(option)
                }
                disabled={answerChecked}
                className={className}
              >
                <div className="flex items-center justify-between gap-3">
                  <span>{option}</span>

                  {answerChecked && isCorrect && (
                    <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* HINT */}
        {!answerChecked && mode !== "guided" && (
          <div className="mt-4">
            <button
              onClick={() => setHintShown((previous) => !previous)}
              className="text-sm text-indigo-300 font-bold hover:text-indigo-200"
            >
              {hintShown ? "Hide hint" : "Need a hint?"}
            </button>

            {hintShown && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-sm text-yellow-200"
              >
                {currentChallenge.hint}
              </motion.div>
            )}
          </div>
        )}

        {/* FEEDBACK */}
        {answerChecked && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-5 p-5 rounded-2xl border ${
              selectedAnswer === currentChallenge.answer
                ? "bg-green-500/10 border-green-500/20"
                : "bg-red-500/10 border-red-500/20"
            }`}
          >
            <div className="flex gap-3">
              <CheckCircle
                className={`w-5 h-5 shrink-0 ${
                  selectedAnswer === currentChallenge.answer
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              />

              <div>
                <p className="font-bold text-white mb-1">
                  {selectedAnswer === currentChallenge.answer
                    ? "Excellent reasoning!"
                    : "Good try. Let's learn from it."}
                </p>

                <p className="text-sm text-gray-300 mb-3">
                  {currentChallenge.explanation}
                </p>

                <div className="text-sm text-indigo-300">
                  <strong>Logic skill:</strong>{" "}
                  {currentChallenge.learningPoint}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* NAVIGATION */}
      <div className="p-5 sm:p-6 border-t border-app-border flex items-center justify-between gap-3">
        <button
          onClick={previousChallenge}
          disabled={currentIndex === 0}
          className="px-4 py-3 rounded-xl bg-gray-800 text-gray-300 font-bold flex items-center gap-2 disabled:opacity-30"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            {currentChallenge.skill}
          </p>

          <p className="text-xs text-gray-400">
            {currentProgress.attempts} attempt
            {currentProgress.attempts === 1 ? "" : "s"}
          </p>
        </div>

        <button
          onClick={nextChallenge}
          disabled={!answerChecked}
          className="px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold flex items-center gap-2 disabled:opacity-40"
        >
          {currentIndex === levelChallenges.length - 1
            ? "Complete"
            : "Next"}

          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};