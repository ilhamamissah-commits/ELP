import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Lightbulb,
  RotateCcw,
  Star,
  Target,
} from "lucide-react";

type LearningMode = "guided" | "practice" | "mastery";

type PatternSkill =
  | "Pattern Recognition"
  | "Sequencing"
  | "Observation"
  | "Prediction"
  | "Logical Thinking"
  | "Number Patterns"
  | "Spatial Patterns"
  | "Problem Solving";

type Difficulty = "Easy" | "Medium" | "Hard";

interface PatternChallenge {
  id: number;
  level: number;
  title: string;
  pattern: string[];
  next: string;
  options: string[];
  hint: string;
  explanation: string;
  skill: PatternSkill;
  difficulty: Difficulty;
  objective: string;
}

interface PatternProgress {
  attempts: number;
  correct: number;
  mastered: boolean;
}

interface PatternRecognizerProps {
  onComplete?: (score: number) => void;
}

const CHALLENGES: PatternChallenge[] = [
  // -----------------------------------------------------
  // LEVEL 1 — AB PATTERNS
  // -----------------------------------------------------
  {
    id: 1,
    level: 1,
    title: "Red and Blue",
    pattern: ["🔴", "🔵", "🔴", "🔵", "🔴"],
    next: "🔵",
    options: ["🔵", "🟡", "🟢"],
    hint: "Look at the two colors that keep taking turns.",
    explanation: "The pattern is Red, Blue, Red, Blue, Red, Blue.",
    skill: "Pattern Recognition",
    difficulty: "Easy",
    objective: "Recognize a simple AB pattern.",
  },
  {
    id: 2,
    level: 1,
    title: "Star and Moon",
    pattern: ["⭐", "🌙", "⭐", "🌙", "⭐"],
    next: "🌙",
    options: ["🌙", "☀️", "⭐"],
    hint: "The star and moon take turns.",
    explanation: "Star and Moon repeat in an AB pattern.",
    skill: "Pattern Recognition",
    difficulty: "Easy",
    objective: "Identify a repeating two-item sequence.",
  },
  {
    id: 3,
    level: 1,
    title: "Cat and Dog",
    pattern: ["🐱", "🐶", "🐱", "🐶", "🐱"],
    next: "🐶",
    options: ["🐶", "🐸", "🐰"],
    hint: "Which animal comes after every cat?",
    explanation: "Cat is followed by Dog each time.",
    skill: "Sequencing",
    difficulty: "Easy",
    objective: "Predict the next item in a simple sequence.",
  },

  // -----------------------------------------------------
  // LEVEL 2 — AAB PATTERNS
  // -----------------------------------------------------
  {
    id: 4,
    level: 2,
    title: "Apple Apple Banana",
    pattern: ["🍎", "🍎", "🍌", "🍎", "🍎"],
    next: "🍌",
    options: ["🍌", "🍇", "🍊"],
    hint: "Two apples appear before one banana.",
    explanation: "The repeating unit is Apple, Apple, Banana.",
    skill: "Pattern Recognition",
    difficulty: "Easy",
    objective: "Recognize an AAB pattern.",
  },
  {
    id: 5,
    level: 2,
    title: "Car Car Bus",
    pattern: ["🚗", "🚗", "🚌", "🚗", "🚗"],
    next: "🚌",
    options: ["🚌", "🚲", "✈️"],
    hint: "Count how many cars appear before the bus.",
    explanation: "Two cars are followed by one bus.",
    skill: "Sequencing",
    difficulty: "Easy",
    objective: "Use repetition to predict what comes next.",
  },
  {
    id: 6,
    level: 2,
    title: "Star Star Sparkle",
    pattern: ["⭐", "⭐", "🌟", "⭐", "⭐"],
    next: "🌟",
    options: ["🌟", "💫", "🌙"],
    hint: "There are two matching stars before the different star.",
    explanation: "The pattern is Star, Star, Sparkle.",
    skill: "Observation",
    difficulty: "Easy",
    objective: "Notice repeated groups within a sequence.",
  },

  // -----------------------------------------------------
  // LEVEL 3 — ABB PATTERNS
  // -----------------------------------------------------
  {
    id: 7,
    level: 3,
    title: "Flower Leaf Leaf",
    pattern: ["🌸", "🌿", "🌿", "🌸", "🌿"],
    next: "🌿",
    options: ["🌿", "🌳", "🌻"],
    hint: "One flower is followed by two leaves.",
    explanation: "The repeating group is Flower, Leaf, Leaf.",
    skill: "Pattern Recognition",
    difficulty: "Easy",
    objective: "Recognize an ABB pattern.",
  },
  {
    id: 8,
    level: 3,
    title: "Strawberry Cherry Cherry",
    pattern: ["🍓", "🍒", "🍒", "🍓", "🍒"],
    next: "🍒",
    options: ["🍒", "🍇", "🍎"],
    hint: "Look for one strawberry followed by two cherries.",
    explanation: "The pattern repeats Strawberry, Cherry, Cherry.",
    skill: "Sequencing",
    difficulty: "Easy",
    objective: "Identify repeating three-item groups.",
  },
  {
    id: 9,
    level: 3,
    title: "Frog Fish Fish",
    pattern: ["🐸", "🐟", "🐟", "🐸", "🐟"],
    next: "🐟",
    options: ["🐟", "🐙", "🐬"],
    hint: "The frog starts each group.",
    explanation: "Each group contains one frog and two fish.",
    skill: "Observation",
    difficulty: "Easy",
    objective: "Find repeated structures in a sequence.",
  },

  // -----------------------------------------------------
  // LEVEL 4 — ABC PATTERNS
  // -----------------------------------------------------
  {
    id: 10,
    level: 4,
    title: "Traffic Lights",
    pattern: ["🔴", "🟡", "🟢", "🔴", "🟡"],
    next: "🟢",
    options: ["🟢", "🔵", "🟠"],
    hint: "Think about the order of traffic light colors.",
    explanation: "Red, Yellow, Green repeats.",
    skill: "Sequencing",
    difficulty: "Medium",
    objective: "Recognize a three-item repeating pattern.",
  },
  {
    id: 11,
    level: 4,
    title: "Three Animals",
    pattern: ["🐱", "🐶", "🐰", "🐱", "🐶"],
    next: "🐰",
    options: ["🐰", "🐻", "🐼"],
    hint: "The same three animals repeat.",
    explanation: "Cat, Dog, Rabbit repeats again and again.",
    skill: "Pattern Recognition",
    difficulty: "Medium",
    objective: "Predict the missing item in an ABC sequence.",
  },
  {
    id: 12,
    level: 4,
    title: "Sky Pattern",
    pattern: ["⭐", "🌙", "☀️", "⭐", "🌙"],
    next: "☀️",
    options: ["☀️", "🌥️", "🌧️"],
    hint: "Star, Moon, Sun repeats.",
    explanation: "The three-item sequence begins again after the Sun.",
    skill: "Prediction",
    difficulty: "Medium",
    objective: "Continue a repeating three-item sequence.",
  },

  // -----------------------------------------------------
  // LEVEL 5 — ABCD PATTERNS
  // -----------------------------------------------------
  {
    id: 13,
    level: 5,
    title: "Fruit Sequence",
    pattern: ["🍎", "🍌", "🍇", "🍓", "🍎"],
    next: "🍌",
    options: ["🍌", "🍊", "🍐"],
    hint: "There are four fruits in the repeating group.",
    explanation: "Apple, Banana, Grape, Strawberry repeats.",
    skill: "Pattern Recognition",
    difficulty: "Medium",
    objective: "Recognize a longer repeating sequence.",
  },
  {
    id: 14,
    level: 5,
    title: "Transport Sequence",
    pattern: ["🚗", "✈️", "🚢", "🚂", "🚗"],
    next: "✈️",
    options: ["✈️", "🚲", "🚌"],
    hint: "Four types of transport form the repeating group.",
    explanation: "Car, Plane, Boat, Train repeats.",
    skill: "Sequencing",
    difficulty: "Medium",
    objective: "Predict the next item in a four-part sequence.",
  },
  {
    id: 15,
    level: 5,
    title: "Garden Sequence",
    pattern: ["🌸", "🌿", "🌻", "🌱", "🌸"],
    next: "🌿",
    options: ["🌿", "🌳", "🍃"],
    hint: "The four garden items repeat in the same order.",
    explanation: "Flower, Leaf, Sunflower, Seed repeats.",
    skill: "Observation",
    difficulty: "Medium",
    objective: "Track a longer repeating pattern.",
  },

  // -----------------------------------------------------
  // LEVEL 6 — AABB
  // -----------------------------------------------------
  {
    id: 16,
    level: 6,
    title: "Color Pairs",
    pattern: ["🔴", "🔴", "🔵", "🔵", "🔴"],
    next: "🔴",
    options: ["🔴", "🟢", "🟡"],
    hint: "Each color appears twice before the next color.",
    explanation: "Red, Red, Blue, Blue repeats.",
    skill: "Pattern Recognition",
    difficulty: "Medium",
    objective: "Recognize paired repetition.",
  },
  {
    id: 17,
    level: 6,
    title: "Fruit Pairs",
    pattern: ["🍎", "🍎", "🍌", "🍌", "🍎"],
    next: "🍎",
    options: ["🍎", "🍇", "🍊"],
    hint: "Look at the fruits in pairs.",
    explanation: "Apple appears twice, then Banana twice.",
    skill: "Sequencing",
    difficulty: "Medium",
    objective: "Identify a paired repeating sequence.",
  },
  {
    id: 18,
    level: 6,
    title: "Animal Pairs",
    pattern: ["🐱", "🐱", "🐶", "🐶", "🐱"],
    next: "🐱",
    options: ["🐱", "🐰", "🐻"],
    hint: "The animals appear in groups of two.",
    explanation: "Cat, Cat, Dog, Dog repeats.",
    skill: "Pattern Recognition",
    difficulty: "Medium",
    objective: "Recognize repeated pairs.",
  },

  // -----------------------------------------------------
  // LEVEL 7 — ABCABC
  // -----------------------------------------------------
  {
    id: 19,
    level: 7,
    title: "Fruit Cycle",
    pattern: ["🍎", "🍌", "🍇", "🍎", "🍌"],
    next: "🍇",
    options: ["🍇", "🍊", "🍓"],
    hint: "The first three fruits repeat.",
    explanation: "Apple, Banana, Grape repeats.",
    skill: "Pattern Recognition",
    difficulty: "Medium",
    objective: "Identify a longer repeating cycle.",
  },
  {
    id: 20,
    level: 7,
    title: "Animal Cycle",
    pattern: ["🐱", "🐶", "🐰", "🐱", "🐶"],
    next: "🐰",
    options: ["🐰", "🐻", "🦊"],
    hint: "The same three animals appear again.",
    explanation: "Cat, Dog, Rabbit repeats.",
    skill: "Sequencing",
    difficulty: "Medium",
    objective: "Continue a three-item cycle.",
  },
  {
    id: 21,
    level: 7,
    title: "Color Cycle",
    pattern: ["🔴", "🟡", "🟢", "🔴", "🟡"],
    next: "🟢",
    options: ["🟢", "🔵", "🟣"],
    hint: "The color cycle has three colors.",
    explanation: "Red, Yellow, Green repeats.",
    skill: "Prediction",
    difficulty: "Medium",
    objective: "Predict the next item from a repeating cycle.",
  },

  // -----------------------------------------------------
  // LEVEL 8 — GROWING PATTERNS
  // -----------------------------------------------------
  {
    id: 22,
    level: 8,
    title: "Growing Stars",
    pattern: ["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐"],
    next: "⭐⭐⭐⭐⭐",
    options: ["⭐⭐⭐⭐⭐", "⭐⭐⭐", "⭐⭐"],
    hint: "The number of stars increases by one each time.",
    explanation: "Each step adds one more star.",
    skill: "Number Patterns",
    difficulty: "Medium",
    objective: "Recognize a pattern that grows.",
  },
  {
    id: 23,
    level: 8,
    title: "Growing Blocks",
    pattern: ["🟦", "🟦🟦", "🟦🟦🟦", "🟦🟦🟦🟦"],
    next: "🟦🟦🟦🟦🟦",
    options: ["🟦🟦🟦🟦🟦", "🟦🟦🟦", "🟦🟦"],
    hint: "Count the blocks in each group.",
    explanation: "One block is added at every step.",
    skill: "Pattern Recognition",
    difficulty: "Hard",
    objective: "Understand an increasing pattern.",
  },

  // -----------------------------------------------------
  // LEVEL 9 — SHRINKING PATTERNS
  // -----------------------------------------------------
  {
    id: 24,
    level: 9,
    title: "Shrinking Stars",
    pattern: ["⭐⭐⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐", "⭐⭐"],
    next: "⭐",
    options: ["⭐", "⭐⭐⭐", "⭐⭐⭐⭐"],
    hint: "The number of stars decreases by one each time.",
    explanation: "One star disappears at every step.",
    skill: "Number Patterns",
    difficulty: "Hard",
    objective: "Recognize a decreasing pattern.",
  },
  {
    id: 25,
    level: 9,
    title: "Fading Blocks",
    pattern: ["🟥🟥🟥🟥", "🟥🟥🟥", "🟥🟥", "🟥"],
    next: "⬜",
    options: ["⬜", "🟥🟥", "🟥🟥🟥"],
    hint: "The number of red blocks gets smaller.",
    explanation: "The pattern removes one block at each step.",
    skill: "Logical Thinking",
    difficulty: "Hard",
    objective: "Predict the result of a decreasing sequence.",
  },

  // -----------------------------------------------------
  // LEVEL 10 — ALTERNATING
  // -----------------------------------------------------
  {
    id: 26,
    level: 10,
    title: "Big and Small",
    pattern: ["🔵", "🔵🔵", "🔵", "🔵🔵", "🔵"],
    next: "🔵🔵",
    options: ["🔵🔵", "🔵", "🔵🔵🔵"],
    hint: "The groups alternate between one and two.",
    explanation: "One blue, two blues, one blue, two blues...",
    skill: "Pattern Recognition",
    difficulty: "Hard",
    objective: "Recognize an alternating quantity pattern.",
  },
  {
    id: 27,
    level: 10,
    title: "Shape Alternation",
    pattern: ["🔺", "🔺🔺", "🔺", "🔺🔺", "🔺"],
    next: "🔺🔺",
    options: ["🔺🔺", "🔺", "🔺🔺🔺"],
    hint: "The number of triangles switches between one and two.",
    explanation: "The quantities alternate: one, two, one, two, one.",
    skill: "Spatial Patterns",
    difficulty: "Hard",
    objective: "Use quantity and position to predict a pattern.",
  },

  // -----------------------------------------------------
  // LEVEL 11 — MIXED LOGIC
  // -----------------------------------------------------
  {
    id: 28,
    level: 11,
    title: "Color and Shape",
    pattern: ["🔴⭐", "🔵🌙", "🔴⭐", "🔵🌙", "🔴⭐"],
    next: "🔵🌙",
    options: ["🔵🌙", "🟢⭐", "🔴🌙"],
    hint: "Both the color and shape repeat together.",
    explanation: "Red Star and Blue Moon alternate.",
    skill: "Logical Thinking",
    difficulty: "Hard",
    objective: "Track more than one feature in a pattern.",
  },
  {
    id: 29,
    level: 11,
    title: "Fruit and Animal",
    pattern: ["🍎🐱", "🍌🐶", "🍎🐱", "🍌🐶", "🍎🐱"],
    next: "🍌🐶",
    options: ["🍌🐶", "🍎🐶", "🍇🐱"],
    hint: "Watch both parts of each pair.",
    explanation: "Apple-Cat and Banana-Dog alternate.",
    skill: "Observation",
    difficulty: "Hard",
    objective: "Identify a pattern containing multiple attributes.",
  },

  // -----------------------------------------------------
  // LEVEL 12 — TRANSFORMATION
  // -----------------------------------------------------
  {
    id: 30,
    level: 12,
    title: "Turn the Shape",
    pattern: ["➡️", "⬇️", "⬅️", "⬆️", "➡️"],
    next: "⬇️",
    options: ["⬇️", "⬅️", "⬆️"],
    hint: "The arrow turns one quarter-turn each time.",
    explanation: "The arrow rotates clockwise through four directions.",
    skill: "Spatial Patterns",
    difficulty: "Hard",
    objective: "Recognize a rotational pattern.",
  },
  {
    id: 31,
    level: 12,
    title: "Moon Cycle",
    pattern: ["🌑", "🌒", "🌓", "🌔", "🌕"],
    next: "🌖",
    options: ["🌖", "🌑", "🌗"],
    hint: "The moon becomes more illuminated step by step.",
    explanation: "The sequence moves through the moon's changing phases.",
    skill: "Sequencing",
    difficulty: "Hard",
    objective: "Recognize a natural sequence.",
  },

  // -----------------------------------------------------
  // LEVEL 13 — MASTER CHALLENGE
  // -----------------------------------------------------
  {
    id: 32,
    level: 13,
    title: "The Hidden Cycle",
    pattern: ["🔴", "🔵", "🟢", "🟢", "🔵", "🔴"],
    next: "🔵",
    options: ["🔵", "🟢", "🔴"],
    hint: "The sequence moves toward green and then comes back.",
    explanation: "The pattern mirrors itself: Red, Blue, Green, Green, Blue, Red, Blue...",
    skill: "Problem Solving",
    difficulty: "Hard",
    objective: "Use symmetry to predict the next item.",
  },
];

export const PatternRecognizer: React.FC<
  PatternRecognizerProps
> = ({ onComplete }) => {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [mode, setMode] = useState<LearningMode>("guided");

  const [selected, setSelected] = useState<string | null>(null);
  const [answerChecked, setAnswerChecked] = useState(false);
  const [correct, setCorrect] = useState(false);

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const [isComplete, setIsComplete] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const [progress, setProgress] = useState<
    Record<number, PatternProgress>
  >({});

  const current = CHALLENGES[challengeIndex];

  const levelNumber = current.level;

  const levelChallenges = useMemo(
    () =>
      CHALLENGES.filter(
        (challenge) => challenge.level === levelNumber,
      ),
    [levelNumber],
  );

  const completedChallenges = useMemo(
    () =>
      Object.values(progress).filter(
        (item) => item.mastered,
      ).length,
    [progress],
  );

  const masteryPercentage = Math.round(
    (completedChallenges / CHALLENGES.length) * 100,
  );

  useEffect(() => {
    setSelected(null);
    setAnswerChecked(false);
    setCorrect(false);
    setShowHint(false);
    setShowExplanation(false);
  }, [challengeIndex, mode]);

  const updateProgress = (
    challengeId: number,
    wasCorrect: boolean,
  ) => {
    setProgress((previous) => {
      const existing = previous[challengeId] ?? {
        attempts: 0,
        correct: 0,
        mastered: false,
      };

      return {
        ...previous,
        [challengeId]: {
          attempts: existing.attempts + 1,
          correct:
            existing.correct + (wasCorrect ? 1 : 0),
          mastered:
            existing.mastered || wasCorrect,
        },
      };
    });
  };

  const handleSelect = (option: string) => {
    if (answerChecked || isComplete) return;

    const isAnswerCorrect = option === current.next;

    setSelected(option);
    setCorrect(isAnswerCorrect);
    setAnswerChecked(true);

    updateProgress(current.id, isAnswerCorrect);

    if (isAnswerCorrect) {
      const nextStreak = streak + 1;

      setStreak(nextStreak);

      const basePoints = 10;
      const streakBonus =
        nextStreak >= 3 ? 5 : 0;

      if (mode === "guided") {
        setScore((previous) => previous + 10);
      } else {
        setScore(
          (previous) =>
            previous + basePoints + streakBonus,
        );
      }

      setShowExplanation(true);

      if (challengeIndex === CHALLENGES.length - 1) {
        setIsComplete(true);
      }
    } else {
      setStreak(0);
      setShowHint(true);
      setShowExplanation(false);
    }
  };

  const nextChallenge = () => {
    if (!correct) return;

    if (challengeIndex < CHALLENGES.length - 1) {
      setChallengeIndex(
        (previous) => previous + 1,
      );
    } else {
      setIsComplete(true);
    }
  };

  const previousChallenge = () => {
    if (challengeIndex > 0) {
      setChallengeIndex(
        (previous) => previous - 1,
      );
    }
  };

  const finishAndMoveUp = () => {
    if (hasFinished) return;

    setHasFinished(true);
    onComplete?.(score);
  };

  const resetGame = () => {
    setChallengeIndex(0);
    setSelected(null);
    setAnswerChecked(false);
    setCorrect(false);
    setScore(0);
    setStreak(0);
    setShowHint(false);
    setShowExplanation(false);
    setIsComplete(false);
    setHasFinished(false);
    setProgress({});
  };

  if (hasFinished) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
          <Star className="w-8 h-8 text-yellow-400" />
        </div>

        <h3 className="text-2xl font-bold text-white mb-2">
          Pattern Master!
        </h3>

        <p className="text-gray-400 mb-6">
          You completed the Pattern Recognition
          journey.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gray-800/60 rounded-xl p-4">
            <div className="text-2xl font-bold text-white">
              {score}
            </div>
            <div className="text-xs text-gray-400">
              Total Score
            </div>
          </div>

          <div className="bg-gray-800/60 rounded-xl p-4">
            <div className="text-2xl font-bold text-white">
              {masteryPercentage}%
            </div>
            <div className="text-xs text-gray-400">
              Mastery
            </div>
          </div>
        </div>

        <button
          onClick={resetGame}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2 mx-auto"
        >
          <RotateCcw className="w-4 h-4" />
          Play Again
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-app-card p-5 sm:p-6 rounded-2xl border border-app-border shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-start gap-4 mb-4">
        <div>
          <h3 className="text-2xl font-bold text-white">
            🔷 Pattern Recognizer
          </h3>

          <p className="text-sm text-gray-400 mt-1">
            Discover patterns, sequences and what
            comes next.
          </p>
        </div>

        <button
          onClick={resetGame}
          className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300"
          aria-label="Restart pattern activity"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Learning Mode */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {(
          [
            ["guided", "Guided"],
            ["practice", "Practice"],
            ["mastery", "Mastery"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setMode(value)}
            className={`py-2 px-3 rounded-lg text-xs font-semibold transition ${
              mode === value
                ? "bg-indigo-600 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="flex flex-wrap justify-between gap-2 mb-4">
        <div className="flex flex-wrap gap-2">
          <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs">
            Level {levelNumber}
          </span>

          <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs">
            {current.skill}
          </span>

          <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs">
            {current.difficulty}
          </span>
        </div>

        <div className="flex gap-2">
          <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold">
            ⭐ {score}
          </span>

          <span className="bg-gray-800 text-gray-400 px-3 py-1 rounded-full text-xs">
            🔥 {streak}
          </span>
        </div>
      </div>

      {/* Objective */}
      <div className="bg-gray-800/50 rounded-xl p-4 mb-5">
        <div className="flex items-start gap-3">
          <Target className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />

          <div>
            <div className="text-sm font-semibold text-white">
              {current.title}
            </div>

            <p className="text-sm text-gray-400 mt-1">
              {current.objective}
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-5">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-400">
            Challenge {challengeIndex + 1} of{" "}
            {CHALLENGES.length}
          </span>

          <span className="text-gray-300">
            {masteryPercentage}% mastery
          </span>
        </div>

        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-500"
            animate={{
              width: `${((challengeIndex + 1) /
                CHALLENGES.length) *
                100}%`,
            }}
          />
        </div>
      </div>

      {/* Pattern */}
      <div className="mb-6">
        <p className="text-center text-sm text-gray-400 mb-3">
          What comes next?
        </p>

        <div className="flex justify-center items-center gap-2 flex-wrap">
          <AnimatePresence mode="popLayout">
            {current.pattern.map(
              (item, index) => (
                <motion.div
                  key={`${current.id}-${index}`}
                  initial={{
                    opacity: 0,
                    scale: 0.7,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    delay: index * 0.08,
                  }}
                  className="min-w-12 h-12 px-2 bg-gray-800 rounded-xl flex items-center justify-center border border-gray-700"
                >
                  <span className="text-2xl">
                    {item}
                  </span>
                </motion.div>
              ),
            )}
          </AnimatePresence>

          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
            }}
            className="min-w-12 h-12 px-2 bg-indigo-600 rounded-xl flex items-center justify-center border-2 border-indigo-400"
          >
            <span className="text-xl text-white font-bold">
              ?
            </span>
          </motion.div>
        </div>
      </div>

      {/* Hint */}
      <div className="mb-4">
        <button
          onClick={() =>
            setShowHint((previous) => !previous)
          }
          className="flex items-center gap-2 text-sm text-yellow-400 hover:text-yellow-300"
        >
          <Lightbulb className="w-4 h-4" />
          {showHint
            ? "Hide hint"
            : "Need a hint?"}
        </button>

        {showHint && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            className="mt-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 text-sm text-yellow-200"
          >
            {current.hint}
          </motion.div>
        )}
      </div>

      {/* Answer Options */}
      <p className="text-center text-gray-400 text-sm mb-3">
        Choose the next item:
      </p>

      <div className="flex justify-center gap-3 flex-wrap">
        {current.options.map((option) => {
          const isSelected =
            selected === option;

          const isCorrectAnswer =
            answerChecked &&
            option === current.next;

          const isWrongSelection =
            answerChecked &&
            isSelected &&
            !correct;

          return (
            <motion.button
              key={option}
              whileHover={
                !answerChecked
                  ? { scale: 1.08 }
                  : undefined
              }
              whileTap={
                !answerChecked
                  ? { scale: 0.94 }
                  : undefined
              }
              onClick={() =>
                handleSelect(option)
              }
              disabled={answerChecked}
              className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center text-3xl transition ${
                isCorrectAnswer
                  ? "bg-green-500/20 border-green-400"
                  : isWrongSelection
                    ? "bg-red-500/20 border-red-400"
                    : "bg-gray-800 border-gray-700 hover:border-indigo-400"
              }`}
            >
              {option}
            </motion.button>
          );
        })}
      </div>

      {/* Feedback */}
      {answerChecked && (
        <motion.div
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className={`mt-5 p-4 rounded-xl ${
            correct
              ? "bg-green-500/10 border border-green-500/20"
              : "bg-red-500/10 border border-red-500/20"
          }`}
        >
          <div
            className={`font-bold ${
              correct
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {correct ? (
              <>
                <CheckCircle className="w-5 h-5 inline mr-1" />
                Correct!
              </>
            ) : (
              "Not quite. Think about the sequence again."
            )}
          </div>

          {correct && showExplanation && (
            <p className="text-sm text-gray-300 mt-2">
              {current.explanation}
            </p>
          )}

          {!correct && (
            <p className="text-sm text-gray-400 mt-2">
              Try another option. Look for what
              repeats or changes each time.
            </p>
          )}
        </motion.div>
      )}

      {/* Continue */}
      {correct && !isComplete && (
        <motion.button
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={nextChallenge}
          className="mt-4 w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-bold flex items-center justify-center gap-2"
        >
          Next Challenge
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      )}

      {/* Final Completion */}
      {isComplete && correct && (
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="mt-5 p-5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-center"
        >
          <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />

          <h4 className="text-xl font-bold text-white">
            Pattern Journey Complete!
          </h4>

          <p className="text-sm text-gray-400 mt-1">
            You solved all {CHALLENGES.length} pattern
            challenges.
          </p>

          <div className="flex justify-center gap-5 mt-4 text-sm">
            <span className="text-yellow-400 font-bold">
              ⭐ {score} points
            </span>

            <span className="text-gray-300">
              {masteryPercentage}% mastery
            </span>
          </div>

          <button
            onClick={finishAndMoveUp}
            className="mt-4 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-bold"
          >
            Finish & Move Up
          </button>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center mt-5">
        <button
          onClick={previousChallenge}
          disabled={challengeIndex === 0}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>

        <span className="text-xs text-gray-500">
          Level {levelNumber}
        </span>

        <button
          onClick={nextChallenge}
          disabled={!correct || isComplete}
          className="flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Level summary */}
      <div className="mt-5 pt-4 border-t border-gray-800">
        <div className="flex justify-between text-xs text-gray-500">
          <span>
            {levelChallenges.length} challenge
            {levelChallenges.length !== 1 ? "s" : ""} in
            this level
          </span>

          <span>
            {current.skill}
          </span>
        </div>
      </div>
    </div>
  );
};