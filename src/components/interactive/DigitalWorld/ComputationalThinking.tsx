import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  RotateCcw,
  ArrowRight,
  Lightbulb,
  Brain,
  Bug,
  Layers,
  Search,
  ListOrdered,
} from 'lucide-react';

type ThinkingSkill =
  | 'patterns'
  | 'sequencing'
  | 'decomposition'
  | 'classification'
  | 'abstraction'
  | 'logic'
  | 'debugging'
  | 'algorithms';

interface Challenge {
  id: number;
  skill: ThinkingSkill;
  title: string;
  question: string;
  visual: string;
  answer: string;
  options: string[];
  explanation: string;
  hint: string;
  difficulty: 1 | 2 | 3;
}

const CHALLENGES: Challenge[] = [
  // =========================================================
  // 1. PATTERNS
  // =========================================================
  {
    id: 1,
    skill: 'patterns',
    title: 'Find the Pattern',
    question: 'What comes next?',
    visual: '🔴 🔵 🔴 🔵 ❓',
    answer: '🔴',
    options: ['🔴', '🟡', '🟢'],
    explanation:
      'The pattern alternates red, blue, red, blue. So the next item is red.',
    hint: 'Look at what repeats.',
    difficulty: 1,
  },

  {
    id: 2,
    skill: 'patterns',
    title: 'Complete the Pattern',
    question: 'Which shape comes next?',
    visual: '⭐ 🌙 ⭐ 🌙 ⭐ ❓',
    answer: '🌙',
    options: ['🌙', '☀️', '⭐'],
    explanation:
      'The pattern repeats Star, Moon. After Star comes Moon.',
    hint: 'Star and Moon take turns.',
    difficulty: 1,
  },

  {
    id: 3,
    skill: 'patterns',
    title: 'Number Pattern',
    question: 'What number comes next?',
    visual: '2 → 4 → 6 → 8 → ❓',
    answer: '10',
    options: ['9', '10', '12'],
    explanation:
      'Each number increases by 2: 2, 4, 6, 8, 10.',
    hint: 'Count by twos.',
    difficulty: 2,
  },

  // =========================================================
  // 2. SEQUENCING
  // =========================================================
  {
    id: 4,
    skill: 'sequencing',
    title: 'Put It in Order',
    question: 'What happens after planting a seed?',
    visual: '🌱 → ?',
    answer: '🌿',
    options: ['🌿', '🍎', '🪨'],
    explanation:
      'A seed grows into a plant. Understanding what comes first and next is sequencing.',
    hint: 'Think about how a plant grows.',
    difficulty: 1,
  },

  {
    id: 5,
    skill: 'sequencing',
    title: 'Morning Routine',
    question: 'What should happen first?',
    visual: '🛏️   🪥   👕',
    answer: '🛏️',
    options: ['🛏️', '🪥', '👕'],
    explanation:
      'A sequence is a set of steps arranged in a meaningful order.',
    hint: 'You wake up before brushing your teeth.',
    difficulty: 1,
  },

  // =========================================================
  // 3. DECOMPOSITION
  // =========================================================
  {
    id: 6,
    skill: 'decomposition',
    title: 'Break It Down',
    question: 'A pizza is easier to share when we break it into...',
    visual: '🍕 → 🍕 🍕 🍕 🍕',
    answer: 'Slices',
    options: ['Slices', 'Cars', 'Trees'],
    explanation:
      'Decomposition means breaking a big problem or thing into smaller parts.',
    hint: 'What do we cut a pizza into?',
    difficulty: 1,
  },

  {
    id: 7,
    skill: 'decomposition',
    title: 'Big Problem, Small Steps',
    question: 'Which is a smaller part of making breakfast?',
    visual: '🍳 Breakfast',
    answer: 'Crack an egg',
    options: ['Crack an egg', 'Build a house', 'Drive a bus'],
    explanation:
      'A large task can be broken into smaller tasks. Cracking an egg is one small step in making breakfast.',
    hint: 'Choose something that can be one step of breakfast.',
    difficulty: 2,
  },

  // =========================================================
  // 4. CLASSIFICATION
  // =========================================================
  {
    id: 8,
    skill: 'classification',
    title: 'Sort the Objects',
    question: 'Which one belongs with the animals?',
    visual: '🐶 🐱 🚗',
    answer: '🐱',
    options: ['🐱', '🚗', '🏠'],
    explanation:
      'Classification means putting things into groups based on shared properties.',
    hint: 'Which object is alive?',
    difficulty: 1,
  },

  {
    id: 9,
    skill: 'classification',
    title: 'Find the Odd One',
    question: 'Which one does not belong?',
    visual: '🍎 🍌 🚲 🍊',
    answer: '🚲',
    options: ['🍎', '🚲', '🍊'],
    explanation:
      'The fruits belong together. The bicycle is different.',
    hint: 'Three things are food.',
    difficulty: 1,
  },

  // =========================================================
  // 5. ABSTRACTION
  // =========================================================
  {
    id: 10,
    skill: 'abstraction',
    title: 'Find the Category',
    question: 'What do these objects have in common?',
    visual: '🚗 🚌 🚲',
    answer: 'Transport',
    options: ['Transport', 'Animals', 'Food'],
    explanation:
      'Abstraction means focusing on important shared ideas and ignoring unnecessary details.',
    hint: 'How do these objects help people?',
    difficulty: 2,
  },

  // =========================================================
  // 6. LOGIC
  // =========================================================
  {
    id: 11,
    skill: 'logic',
    title: 'Which One Makes Sense?',
    question: 'If it is raining, what should you take?',
    visual: '🌧️',
    answer: 'Umbrella',
    options: ['Umbrella', 'Sunglasses', 'Swimsuit'],
    explanation:
      'Logical thinking uses information to choose a sensible answer.',
    hint: 'What protects you from rain?',
    difficulty: 1,
  },

  {
    id: 12,
    skill: 'logic',
    title: 'Which Is Greater?',
    question: 'Which number is bigger?',
    visual: '7   vs   4',
    answer: '7',
    options: ['7', '4'],
    explanation:
      'Logical reasoning helps us compare information and make decisions.',
    hint: 'Count the numbers.',
    difficulty: 1,
  },

  // =========================================================
  // 7. DEBUGGING
  // =========================================================
  {
    id: 13,
    skill: 'debugging',
    title: 'Find the Bug',
    question: 'Which number is missing?',
    visual: '1 → 2 → 3 → 🐛 → 5',
    answer: '4',
    options: ['4', '6', '8'],
    explanation:
      'A bug is a mistake in a program or process. Here, number 4 is missing.',
    hint: 'Count from 1 to 5.',
    difficulty: 1,
  },

  {
    id: 14,
    skill: 'debugging',
    title: 'Fix the Robot',
    question: 'The robot should move to the star. Which instruction is wrong?',
    visual: '🤖 → Right → Right → Left → ⭐',
    answer: 'Left',
    options: ['Right', 'Left', 'Right'],
    explanation:
      'Debugging means finding and correcting a mistake.',
    hint: 'The robot needs to keep moving toward the star.',
    difficulty: 2,
  },

  // =========================================================
  // 8. ALGORITHMS
  // =========================================================
  {
    id: 15,
    skill: 'algorithms',
    title: 'Build an Algorithm',
    question: 'What should you do before eating an apple?',
    visual: '🍎',
    answer: 'Wash it',
    options: ['Wash it', 'Throw it away', 'Put it on the floor'],
    explanation:
      'An algorithm is a step-by-step set of instructions for completing a task.',
    hint: 'Think about a safe preparation step.',
    difficulty: 1,
  },

  {
    id: 16,
    skill: 'algorithms',
    title: 'Follow the Steps',
    question: 'What should happen last?',
    visual: '🌱 → 💧 → ☀️ → 🌻',
    answer: '🌻',
    options: ['🌱', '💧', '🌻'],
    explanation:
      'Algorithms have ordered steps. The final result comes after the required steps.',
    hint: 'Which picture shows the finished result?',
    difficulty: 2,
  },
];

const SKILL_INFO: Record<
  ThinkingSkill,
  {
    name: string;
    description: string;
    icon: React.ReactNode;
  }
> = {
  patterns: {
    name: 'Pattern Recognition',
    description: 'Find what repeats and predict what comes next.',
    icon: <Search className="w-5 h-5" />,
  },

  sequencing: {
    name: 'Sequencing',
    description: 'Put events and instructions in the correct order.',
    icon: <ListOrdered className="w-5 h-5" />,
  },

  decomposition: {
    name: 'Decomposition',
    description: 'Break a large problem into smaller parts.',
    icon: <Layers className="w-5 h-5" />,
  },

  classification: {
    name: 'Classification',
    description: 'Group things according to their properties.',
    icon: <Layers className="w-5 h-5" />,
  },

  abstraction: {
    name: 'Abstraction',
    description: 'Focus on important ideas and ignore unnecessary details.',
    icon: <Brain className="w-5 h-5" />,
  },

  logic: {
    name: 'Logical Reasoning',
    description: 'Use information to make sensible decisions.',
    icon: <Brain className="w-5 h-5" />,
  },

  debugging: {
    name: 'Debugging',
    description: 'Find mistakes and work out how to fix them.',
    icon: <Bug className="w-5 h-5" />,
  },

  algorithms: {
    name: 'Algorithms',
    description: 'Create clear step-by-step instructions.',
    icon: <ListOrdered className="w-5 h-5" />,
  },
};

export const ComputationalThinking: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [answered, setAnswered] = useState(0);

  const current = CHALLENGES[index];

  const skill = useMemo(
    () => SKILL_INFO[current.skill],
    [current.skill]
  );

  const handleSelect = (answer: string) => {
    if (completed) return;

    setSelected(answer);
    setAnswered((previous) => previous + 1);

    if (answer === current.answer) {
      setCompleted(true);
      setScore((previous) => previous + 10);
    }
  };

  const nextChallenge = () => {
    setIndex((previous) => (previous + 1) % CHALLENGES.length);
    setSelected(null);
    setCompleted(false);
    setShowHint(false);
  };

  const resetChallenge = () => {
    setSelected(null);
    setCompleted(false);
    setShowHint(false);
  };

  const progress = ((index + (completed ? 1 : 0)) / CHALLENGES.length) * 100;

  return (
    <div className="max-w-2xl mx-auto bg-app-card p-6 rounded-3xl border border-app-border shadow-xl">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">

        <div className="flex items-center gap-3">

          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-300">
            <Brain className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              Computational Thinking
            </h2>

            <p className="text-sm text-gray-400">
              Learn how to think, solve problems and find patterns.
            </p>
          </div>

        </div>

        <div className="text-right">
          <div className="text-xs text-gray-500">
            SCORE
          </div>

          <div className="text-xl font-bold text-white">
            {score}
          </div>
        </div>

      </div>

      {/* PROGRESS */}
      <div className="mb-5">

        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>
            Challenge {index + 1} of {CHALLENGES.length}
          </span>

          <span>
            {Math.round(progress)}%
          </span>
        </div>

        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">

          <motion.div
            className="h-full bg-indigo-500"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />

        </div>

      </div>

      {/* CURRENT SKILL */}
      <motion.div
        key={current.skill}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20"
      >

        <div className="flex items-center gap-3">

          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
            {skill.icon}
          </div>

          <div>
            <div className="text-xs uppercase tracking-wide text-indigo-300 font-bold">
              Thinking Skill
            </div>

            <div className="text-lg font-bold text-white">
              {skill.name}
            </div>

            <div className="text-sm text-gray-400">
              {skill.description}
            </div>
          </div>

        </div>

      </motion.div>

      {/* CHALLENGE */}
      <motion.div
        key={current.id}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#171717] rounded-2xl border border-gray-800 p-6 text-center mb-5"
      >

        <div className="inline-flex px-3 py-1 rounded-full bg-gray-800 text-gray-400 text-xs mb-4">
          Difficulty {current.difficulty}/3
        </div>

        <h3 className="text-xl font-bold text-white mb-2">
          {current.title}
        </h3>

        <p className="text-gray-300 mb-5">
          {current.question}
        </p>

        <div className="text-4xl sm:text-5xl font-bold tracking-wider py-5">
          {current.visual}
        </div>

      </motion.div>

      {/* ANSWERS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">

        {current.options.map((option) => {

          const isSelected = selected === option;
          const isAnswer = option === current.answer;

          let stateClass =
            'bg-gray-800 border-gray-700 hover:border-indigo-400';

          if (completed && isAnswer) {
            stateClass =
              'bg-green-500/20 border-green-500 text-green-300';
          } else if (isSelected && !isAnswer) {
            stateClass =
              'bg-red-500/20 border-red-500 text-red-300';
          }

          return (
            <motion.button
              key={option}
              whileHover={!completed ? { scale: 1.03 } : undefined}
              whileTap={!completed ? { scale: 0.97 } : undefined}
              onClick={() => handleSelect(option)}
              disabled={completed}
              className={`min-h-[64px] px-4 rounded-2xl border-2 text-white font-bold transition ${stateClass}`}
            >
              {option}
            </motion.button>
          );
        })}

      </div>

      {/* HINT */}
      {!completed && (
        <button
          onClick={() => setShowHint((previous) => !previous)}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm text-yellow-400 hover:text-yellow-300"
        >
          <Lightbulb className="w-4 h-4" />

          {showHint ? 'Hide Hint' : 'Need a Hint?'}
        </button>
      )}

      <AnimatePresence>
        {showHint && !completed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-sm text-yellow-200"
          >
            💡 {current.hint}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FEEDBACK */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-4 rounded-2xl text-center ${
              selected === current.answer
                ? 'bg-green-500/10 border border-green-500/20'
                : 'bg-red-500/10 border border-red-500/20'
            }`}
          >

            {selected === current.answer ? (
              <>
                <CheckCircle className="w-5 h-5 inline mr-2 text-green-400" />

                <span className="font-bold text-green-400">
                  Excellent!
                </span>

                <p className="text-sm text-gray-300 mt-2">
                  {current.explanation}
                </p>
              </>
            ) : (
              <>
                <p className="font-bold text-red-300">
                  Not quite. Try again!
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  Look carefully at the problem and think about the pattern or rule.
                </p>
              </>
            )}

          </motion.div>
        )}
      </AnimatePresence>

      {/* ACTIONS */}
      <div className="flex gap-3 mt-4">

        <button
          onClick={resetChallenge}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-white font-bold"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>

        {completed && (
          <button
            onClick={nextChallenge}
            className="flex-[2] flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-bold"
          >
            Next Challenge
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

      </div>

      {/* LEARNING NOTE */}
      <div className="mt-5 pt-4 border-t border-gray-800 text-center">
        <p className="text-xs text-gray-500">
          Computational thinking is about solving problems using
          patterns, logic, algorithms and clear steps.
        </p>
      </div>

    </div>
  );
};

