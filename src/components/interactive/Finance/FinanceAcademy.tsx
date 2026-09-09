import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Coins,
  Lock,
  PiggyBank,
  RotateCcw,
  ShoppingBasket,
  Store,
  Target,
  Trophy,
  Wallet,
  XCircle,
} from 'lucide-react';

type LevelId =
  | 'money'
  | 'shopping'
  | 'saving'
  | 'budget'
  | 'business'
  | 'challenge';

type ActivityState = 'playing' | 'correct' | 'incorrect' | 'complete';

interface Level {
  id: LevelId;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  objective: string;
}

interface Question {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  emoji: string;
}

const LEVELS: Level[] = [
  {
    id: 'money',
    title: 'Money Explorer',
    subtitle: 'Recognise and count money',
    icon: <Coins className="w-7 h-7" />,
    color: 'amber',
    objective: 'Learn how to recognise money and count simple amounts.',
  },
  {
    id: 'shopping',
    title: 'Smart Shopper',
    subtitle: 'Needs, wants and choices',
    icon: <ShoppingBasket className="w-7 h-7" />,
    color: 'blue',
    objective: 'Learn how to make thoughtful spending decisions.',
  },
  {
    id: 'saving',
    title: 'Super Saver',
    subtitle: 'Save for your goals',
    icon: <PiggyBank className="w-7 h-7" />,
    color: 'green',
    objective: 'Discover why saving money helps us reach our goals.',
  },
  {
    id: 'budget',
    title: 'Budget Builder',
    subtitle: 'Plan your money',
    icon: <Wallet className="w-7 h-7" />,
    color: 'purple',
    objective: 'Practise planning how money can be spent and saved.',
  },
  {
    id: 'business',
    title: 'Young Entrepreneur',
    subtitle: 'Build a mini business',
    icon: <Store className="w-7 h-7" />,
    color: 'cyan',
    objective: 'Learn about products, costs, sales and profit.',
  },
  {
    id: 'challenge',
    title: 'Finance Champion',
    subtitle: 'Put everything together',
    icon: <Trophy className="w-7 h-7" />,
    color: 'rose',
    objective: 'Use everything you have learned to solve money challenges.',
  },
];

const MONEY_QUESTIONS: Question[] = [
  {
    question: 'You have two 5-cedi coins. How much money do you have?',
    options: ['5 cedis', '10 cedis', '15 cedis'],
    answer: 1,
    explanation: '5 + 5 = 10 cedis.',
    emoji: '🪙',
  },
  {
    question: 'You have GH₵10 and receive another GH₵5. How much do you have now?',
    options: ['GH₵15', 'GH₵10', 'GH₵5'],
    answer: 0,
    explanation: '10 + 5 = GH₵15.',
    emoji: '💰',
  },
  {
    question: 'Which amount is greater?',
    options: ['GH₵5', 'GH₵20', 'GH₵10'],
    answer: 1,
    explanation: 'GH₵20 is greater than GH₵10 and GH₵5.',
    emoji: '🔎',
  },
  {
    question: 'You have GH₵20. You spend GH₵5. How much remains?',
    options: ['GH₵10', 'GH₵15', 'GH₵25'],
    answer: 1,
    explanation: '20 − 5 = GH₵15.',
    emoji: '🧮',
  },
];

const SHOPPING_QUESTIONS: Question[] = [
  {
    question: 'Which one is usually a NEED?',
    options: ['A new toy', 'Food', 'A video game'],
    answer: 1,
    explanation: 'Food is something our bodies need to stay healthy.',
    emoji: '🍎',
  },
  {
    question: 'You have GH₵20. A book costs GH₵15. What should you check before buying it?',
    options: [
      'Whether you have enough money',
      'Whether your friend likes it',
      'Whether it is the biggest book',
    ],
    answer: 0,
    explanation: 'A smart shopper checks whether they can afford something.',
    emoji: '📚',
  },
  {
    question: 'You want two toys, but you only have enough money for one. What is a smart choice?',
    options: [
      'Buy both anyway',
      'Choose one and save the rest',
      'Take them without paying',
    ],
    answer: 1,
    explanation: 'A smart shopper makes choices based on what they can afford.',
    emoji: '🛒',
  },
  {
    question: 'Which question can help you decide if something is a WANT?',
    options: [
      'Do I need this to stay healthy and safe?',
      'Is it my favourite colour?',
      'Is it expensive?',
    ],
    answer: 0,
    explanation: 'Needs help us live safely and healthily. Wants are things we would like to have.',
    emoji: '🤔',
  },
];

const SAVING_QUESTIONS: Question[] = [
  {
    question: 'Why might someone save money?',
    options: [
      'To reach a future goal',
      'To lose their money',
      'Because spending is always bad',
    ],
    answer: 0,
    explanation: 'Saving helps us prepare for something we want or need in the future.',
    emoji: '🎯',
  },
  {
    question: 'You save GH₵5 each week. How much will you have after 3 weeks?',
    options: ['GH₵10', 'GH₵15', 'GH₵20'],
    answer: 1,
    explanation: '5 + 5 + 5 = GH₵15.',
    emoji: '🐷',
  },
  {
    question: 'You are saving for a school bag. What is a good idea?',
    options: [
      'Set a savings goal',
      'Spend all your savings',
      'Forget how much you have saved',
    ],
    answer: 0,
    explanation: 'A clear goal makes saving easier to understand and follow.',
    emoji: '🎒',
  },
  {
    question: 'You receive GH₵10. You decide to save GH₵3. How much can you spend?',
    options: ['GH₵3', 'GH₵7', 'GH₵10'],
    answer: 1,
    explanation: '10 − 3 = GH₵7 available to spend.',
    emoji: '💵',
  },
];

const BUDGET_QUESTIONS: Question[] = [
  {
    question: 'You have GH₵50. You spend GH₵20 on food. How much remains?',
    options: ['GH₵20', 'GH₵30', 'GH₵70'],
    answer: 1,
    explanation: '50 − 20 = GH₵30.',
    emoji: '📊',
  },
  {
    question: 'What is a budget?',
    options: [
      'A plan for how to use money',
      'A type of toy',
      'Money that disappears',
    ],
    answer: 0,
    explanation: 'A budget helps us plan what to spend, save or give.',
    emoji: '📝',
  },
  {
    question: 'You have GH₵40. You want a book for GH₵15 and a snack for GH₵5. How much remains?',
    options: ['GH₵10', 'GH₵20', 'GH₵30'],
    answer: 1,
    explanation: '15 + 5 = 20. Then 40 − 20 = GH₵20.',
    emoji: '📚',
  },
  {
    question: 'A good budget should help you...',
    options: [
      'Spend everything immediately',
      'Plan your money',
      'Buy everything you want',
    ],
    answer: 1,
    explanation: 'A budget is a plan that helps you make thoughtful money decisions.',
    emoji: '🧠',
  },
];

const BUSINESS_QUESTIONS: Question[] = [
  {
    question: 'You want to sell fruit juice. What do you need first?',
    options: [
      'Supplies to make the juice',
      'A pile of profit',
      'A customer who has already paid',
    ],
    answer: 0,
    explanation: 'You need supplies before you can make and sell your product.',
    emoji: '🧃',
  },
  {
    question: 'You spend GH₵20 making products and sell them for GH₵35. What is your profit?',
    options: ['GH₵15', 'GH₵20', 'GH₵55'],
    answer: 0,
    explanation: 'Profit = money earned − money spent. GH₵35 − GH₵20 = GH₵15.',
    emoji: '📈',
  },
  {
    question: 'A customer pays GH₵20 for something that costs GH₵12. What change should they receive?',
    options: ['GH₵6', 'GH₵8', 'GH₵10'],
    answer: 1,
    explanation: '20 − 12 = GH₵8 change.',
    emoji: '🧾',
  },
  {
    question: 'What can help a small business grow?',
    options: [
      'Keeping track of costs and sales',
      'Ignoring customers',
      'Spending all the money immediately',
    ],
    answer: 0,
    explanation: 'Understanding costs and sales helps a business make better decisions.',
    emoji: '🏪',
  },
];

const CHALLENGE_QUESTIONS: Question[] = [
  {
    question: 'You have GH₵50. You save GH₵10 and spend GH₵25. How much remains?',
    options: ['GH₵10', 'GH₵15', 'GH₵25'],
    answer: 1,
    explanation: '50 − 10 − 25 = GH₵15.',
    emoji: '🏆',
  },
  {
    question: 'Which is the smartest choice?',
    options: [
      'Spend all your money without thinking',
      'Plan, save and spend carefully',
      'Borrow money for every want',
    ],
    answer: 1,
    explanation: 'Planning, saving and thoughtful spending are important money habits.',
    emoji: '🧠',
  },
  {
    question: 'A business earns GH₵60 and spends GH₵40. What is its profit?',
    options: ['GH₵20', 'GH₵40', 'GH₵100'],
    answer: 0,
    explanation: 'GH₵60 − GH₵40 = GH₵20 profit.',
    emoji: '💼',
  },
  {
    question: 'What is one reason to keep some money as savings?',
    options: [
      'To prepare for a future goal or need',
      'Because money cannot be spent',
      'Because saving means never buying anything',
    ],
    answer: 0,
    explanation: 'Savings can help us prepare for future goals and unexpected needs.',
    emoji: '🌱',
  },
];

const QUESTIONS_BY_LEVEL: Record<LevelId, Question[]> = {
  money: MONEY_QUESTIONS,
  shopping: SHOPPING_QUESTIONS,
  saving: SAVING_QUESTIONS,
  budget: BUDGET_QUESTIONS,
  business: BUSINESS_QUESTIONS,
  challenge: CHALLENGE_QUESTIONS,
};

const getLevelIndex = (id: LevelId) =>
  LEVELS.findIndex((level) => level.id === id);

const getColorClasses = (color: string) => {
  const colors: Record<
    string,
    {
      bg: string;
      border: string;
      text: string;
      soft: string;
    }
  > = {
    amber: {
      bg: 'bg-amber-500',
      border: 'border-amber-500/40',
      text: 'text-amber-400',
      soft: 'bg-amber-500/10',
    },
    blue: {
      bg: 'bg-blue-500',
      border: 'border-blue-500/40',
      text: 'text-blue-400',
      soft: 'bg-blue-500/10',
    },
    green: {
      bg: 'bg-green-500',
      border: 'border-green-500/40',
      text: 'text-green-400',
      soft: 'bg-green-500/10',
    },
    purple: {
      bg: 'bg-purple-500',
      border: 'border-purple-500/40',
      text: 'text-purple-400',
      soft: 'bg-purple-500/10',
    },
    cyan: {
      bg: 'bg-cyan-500',
      border: 'border-cyan-500/40',
      text: 'text-cyan-400',
      soft: 'bg-cyan-500/10',
    },
    rose: {
      bg: 'bg-rose-500',
      border: 'border-rose-500/40',
      text: 'text-rose-400',
      soft: 'bg-rose-500/10',
    },
  };

  return colors[color] ?? colors.amber;
};

export const FinanceAcademy: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<LevelId | null>(null);
  const [completedLevels, setCompletedLevels] = useState<LevelId[]>([]);
  const [xp, setXp] = useState(0);

  const totalLevels = LEVELS.length;

  const unlockedLevelIds = useMemo(() => {
    return LEVELS.filter((level, index) => {
      if (index === 0) return true;
      return completedLevels.includes(LEVELS[index - 1].id);
    }).map((level) => level.id);
  }, [completedLevels]);

  const handleLevelComplete = (levelId: LevelId, earnedXp: number) => {
    setXp((current) => current + earnedXp);

    setCompletedLevels((current) =>
      current.includes(levelId) ? current : [...current, levelId],
    );

    setSelectedLevel(null);
  };

  if (selectedLevel) {
    const level = LEVELS.find((item) => item.id === selectedLevel);

    if (level) {
      return (
        <FinanceLevel
          level={level}
          onBack={() => setSelectedLevel(null)}
          onComplete={(earnedXp) =>
            handleLevelComplete(level.id, earnedXp)
          }
        />
      );
    }
  }

  const progress =
    totalLevels === 0
      ? 0
      : Math.round((completedLevels.length / totalLevels) * 100);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-app-card border border-app-border rounded-3xl p-6 md:p-8 shadow-xl mb-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/20">
                <Coins className="w-8 h-8 text-amber-400" />
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Finance Academy
                </h1>

                <p className="text-gray-400 text-sm md:text-base">
                  Learn how money works through play and discovery.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-xs text-gray-500">XP</p>
                  <p className="font-bold text-amber-400">{xp}</p>
                </div>
              </div>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-xs text-gray-500">Progress</p>
                  <p className="font-bold text-green-400">{progress}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-gray-500">Finance journey</span>
            <span className="text-gray-400">
              {completedLevels.length}/{totalLevels} levels complete
            </span>
          </div>

          <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.7 }}
              className="h-full bg-amber-500 rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Journey */}
      <div className="space-y-4">
        {LEVELS.map((level, index) => {
          const colors = getColorClasses(level.color);
          const isCompleted = completedLevels.includes(level.id);
          const isUnlocked = unlockedLevelIds.includes(level.id);

          return (
            <motion.button
              key={level.id}
              whileHover={isUnlocked ? { y: -2 } : undefined}
              whileTap={isUnlocked ? { scale: 0.99 } : undefined}
              disabled={!isUnlocked}
              onClick={() => setSelectedLevel(level.id)}
              className={`w-full text-left rounded-3xl border p-5 md:p-6 transition-all ${
                isUnlocked
                  ? `${colors.border} ${colors.soft} hover:bg-white/[0.04]`
                  : 'border-gray-800 bg-gray-900/40 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                    isCompleted
                      ? 'bg-green-500/15 text-green-400'
                      : isUnlocked
                        ? `${colors.soft} ${colors.text}`
                        : 'bg-gray-800 text-gray-600'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-7 h-7" />
                  ) : isUnlocked ? (
                    level.icon
                  ) : (
                    <Lock className="w-6 h-6" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs uppercase tracking-wider text-gray-500">
                      Level {index + 1}
                    </span>

                    {isCompleted && (
                      <span className="text-xs font-semibold text-green-400">
                        Completed
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg md:text-xl font-bold text-white mt-1">
                    {level.title}
                  </h2>

                  <p className="text-gray-400 text-sm mt-1">
                    {level.subtitle}
                  </p>
                </div>

                {isUnlocked && (
                  <ArrowRight className="w-5 h-5 text-gray-500 shrink-0" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Learning principle */}
      <div className="mt-6 rounded-3xl border border-app-border bg-app-card/60 p-5">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
          Learning focus
        </p>

        <p className="text-sm text-gray-400 leading-relaxed">
          Finance Academy helps learners develop practical numeracy,
          decision-making, planning and entrepreneurship skills through
          age-appropriate activities.
        </p>
      </div>
    </div>
  );
};

interface FinanceLevelProps {
  level: Level;
  onBack: () => void;
  onComplete: (earnedXp: number) => void;
}

const FinanceLevel: React.FC<FinanceLevelProps> = ({
  level,
  onBack,
  onComplete,
}) => {
  const questions = QUESTIONS_BY_LEVEL[level.id];

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [activityState, setActivityState] =
    useState<ActivityState>('playing');
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const currentQuestion = questions[questionIndex];

  const colors = getColorClasses(level.color);

  const handleAnswer = (index: number) => {
    if (selected !== null || activityState !== 'playing') return;

    setSelected(index);

    if (index === currentQuestion.answer) {
      setActivityState('correct');
      setCorrectAnswers((current) => current + 1);
    } else {
      setActivityState('incorrect');
    }
  };

  const nextQuestion = () => {
    if (activityState === 'playing') return;

    const isLastQuestion = questionIndex === questions.length - 1;

    if (isLastQuestion) {
      const earnedXp = correctAnswers * 10;

      onComplete(earnedXp);
      return;
    }

    setQuestionIndex((current) => current + 1);
    setSelected(null);
    setActivityState('playing');
  };

  const restart = () => {
    setQuestionIndex(0);
    setSelected(null);
    setActivityState('playing');
    setCorrectAnswers(0);
  };

  const progress =
    ((questionIndex + (activityState !== 'playing' ? 1 : 0)) /
      questions.length) *
    100;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className={`flex items-center gap-2 ${colors.text}`}>
          {level.icon}
          <span className="font-bold">{level.title}</span>
        </div>
      </div>

      {/* Objective */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${colors.soft} border ${colors.border} rounded-3xl p-5 mb-5`}
      >
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
          Learning objective
        </p>

        <p className="text-white text-sm md:text-base">
          {level.objective}
        </p>
      </motion.div>

      {/* Progress */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>
            Question {questionIndex + 1} of {questions.length}
          </span>

          <span>{correctAnswers} correct</span>
        </div>

        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
            className={`h-full ${colors.bg} rounded-full`}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={questionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-app-card border border-app-border rounded-3xl p-6 md:p-8 shadow-xl"
        >
          <div className="text-center mb-7">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-6xl mb-5"
            >
              {currentQuestion.emoji}
            </motion.div>

            <h2 className="text-xl md:text-2xl font-bold text-white leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selected === index;
              const isCorrect = index === currentQuestion.answer;

              let optionClass =
                'bg-gray-900 border-gray-800 text-white hover:border-gray-600';

              if (activityState === 'correct' && isCorrect) {
                optionClass =
                  'bg-green-500/10 border-green-500 text-green-400';
              }

              if (
                activityState === 'incorrect' &&
                isSelected &&
                !isCorrect
              ) {
                optionClass =
                  'bg-red-500/10 border-red-500 text-red-400';
              }

              if (
                activityState === 'incorrect' &&
                isCorrect
              ) {
                optionClass =
                  'bg-green-500/10 border-green-500 text-green-400';
              }

              return (
                <motion.button
                  key={option}
                  whileHover={
                    selected === null ? { scale: 1.01 } : undefined
                  }
                  whileTap={
                    selected === null ? { scale: 0.99 } : undefined
                  }
                  onClick={() => handleAnswer(index)}
                  disabled={selected !== null}
                  className={`w-full p-4 rounded-2xl border-2 text-left font-semibold transition-all ${optionClass}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm shrink-0">
                      {String.fromCharCode(65 + index)}
                    </span>

                    <span>{option}</span>

                    {activityState !== 'playing' &&
                      isCorrect && (
                        <CheckCircle2 className="w-5 h-5 ml-auto" />
                      )}

                    {activityState === 'incorrect' &&
                      isSelected &&
                      !isCorrect && (
                        <XCircle className="w-5 h-5 ml-auto" />
                      )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {activityState !== 'playing' && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: 10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                className={`mt-5 rounded-2xl p-4 border ${
                  activityState === 'correct'
                    ? 'bg-green-500/10 border-green-500/20'
                    : 'bg-amber-500/10 border-amber-500/20'
                }`}
              >
                <div className="flex gap-3">
                  {activityState === 'correct' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  ) : (
                    <Target className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  )}

                  <div>
                    <p
                      className={`font-bold ${
                        activityState === 'correct'
                          ? 'text-green-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {activityState === 'correct'
                        ? 'Great thinking!'
                        : 'Let’s learn from this one.'}
                    </p>

                    <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Continue */}
          {activityState !== 'playing' && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={nextQuestion}
              className={`w-full mt-5 ${colors.bg} text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity`}
            >
              {questionIndex === questions.length - 1
                ? 'Finish Level'
                : 'Continue'}

              <ArrowRight className="w-5 h-5" />
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Restart */}
      <div className="flex justify-center mt-5">
        <button
          onClick={restart}
          className="flex items-center gap-2 text-gray-500 hover:text-white text-sm transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Restart level
        </button>
      </div>
    </div>
  );
};

export default FinanceAcademy;