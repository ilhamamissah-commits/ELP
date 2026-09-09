import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  ChevronRight,
  HelpCircle,
  Headphones,
  Lock,
  RotateCcw,
  Star,
  Target,
  Trophy,
  Volume2,
  X,
} from 'lucide-react';

import { ArabicLetters } from './ArabicLetters';
import { ArabicHarakatLab } from './ArabicHarakatLab';
import { ArabicWords } from './ArabicWords';
import { ArabicReading } from './ArabicReading';

type ArabicComponent =
  | 'ArabicLetters'
  | 'ArabicHarakatLab'
  | 'ArabicWords'
  | 'ArabicReading';

type ArabicStage =
  | 'Readiness'
  | 'Letters'
  | 'Harakat'
  | 'Word Building'
  | 'Reading'
  | 'Vocabulary'
  | 'Comprehension';

interface ArabicLevel {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  component: ArabicComponent;
  stage: ArabicStage;
  skills: string[];
  objective: string;
  prerequisite?: number;
  recommended: boolean;
}

interface LevelProgress {
  completed: boolean;
  bestScore: number;
  attempts: number;
}

type ProgressMap = Record<number, LevelProgress>;

interface ArabicAcademyProps {
  onComplete?: (score: number) => void;
}

const STORAGE_KEY = 'elp-arabic-academy-progress';

const LEVELS: ArabicLevel[] = [
  {
    id: 0,
    title: 'Arabic Readiness',
    subtitle: 'Listen and prepare your ear',
    description:
      'Build listening awareness and become familiar with Arabic sounds before reading.',
    icon: '🎧',
    component: 'ArabicLetters',
    stage: 'Readiness',
    skills: ['Listening', 'Sound discrimination', 'Attention'],
    objective: 'Recognise and distinguish basic Arabic sounds.',
    recommended: true,
  },
  {
    id: 1,
    title: 'The 28 Arabic Letters',
    subtitle: 'Recognise every letter',
    description:
      'Meet the complete Arabic alphabet and learn each letter by name and sound.',
    icon: 'أ',
    component: 'ArabicLetters',
    stage: 'Letters',
    skills: ['Letter recognition', 'Letter names', 'Letter sounds'],
    objective: 'Recognise all 28 Arabic letters.',
    recommended: true,
  },
  {
    id: 2,
    title: 'Arabic Letter Shapes',
    subtitle: 'Beginning, middle, end and isolated',
    description:
      'Discover how Arabic letters change shape depending on where they appear in a word.',
    icon: 'ب',
    component: 'ArabicLetters',
    stage: 'Letters',
    skills: ['Letter forms', 'Visual discrimination', 'Directionality'],
    objective: 'Recognise common positional forms of Arabic letters.',
    prerequisite: 1,
    recommended: true,
  },
  {
    id: 3,
    title: 'Fatha',
    subtitle: 'The short "a" sound — بَ',
    description:
      'Learn how Fatha changes a consonant into a short "a" sound.',
    icon: 'َ',
    component: 'ArabicHarakatLab',
    stage: 'Harakat',
    skills: ['Fatha', 'Sound-symbol association', 'Decoding'],
    objective: 'Read and pronounce letters with Fatha.',
    prerequisite: 1,
    recommended: true,
  },
  {
    id: 4,
    title: 'Kasra',
    subtitle: 'The short "i" sound — بِ',
    description:
      'Learn how Kasra creates the short "i" sound beneath a letter.',
    icon: 'ِ',
    component: 'ArabicHarakatLab',
    stage: 'Harakat',
    skills: ['Kasra', 'Decoding', 'Pronunciation'],
    objective: 'Read and pronounce letters with Kasra.',
    prerequisite: 1,
    recommended: true,
  },
  {
    id: 5,
    title: 'Damma',
    subtitle: 'The short "u" sound — بُ',
    description:
      'Learn how Damma creates the short "u" sound above a letter.',
    icon: 'ُ',
    component: 'ArabicHarakatLab',
    stage: 'Harakat',
    skills: ['Damma', 'Decoding', 'Pronunciation'],
    objective: 'Read and pronounce letters with Damma.',
    prerequisite: 1,
    recommended: true,
  },
  {
    id: 6,
    title: 'Short Vowel Mastery',
    subtitle: 'Read بَ بِ بُ with confidence',
    description:
      'Bring Fatha, Kasra and Damma together and distinguish their sounds.',
    icon: '🎯',
    component: 'ArabicHarakatLab',
    stage: 'Harakat',
    skills: ['Fatha', 'Kasra', 'Damma', 'Fluency'],
    objective: 'Accurately distinguish the three short vowels.',
    prerequisite: 5,
    recommended: true,
  },
  {
    id: 7,
    title: 'Tanween',
    subtitle: 'ـً ـٍ ـٌ',
    description:
      'Explore the three forms of Tanween and practise reading their sounds.',
    icon: 'ً',
    component: 'ArabicHarakatLab',
    stage: 'Harakat',
    skills: ['Fathatayn', 'Kasratayn', 'Dammatayn'],
    objective: 'Recognise and read the three Tanween forms.',
    prerequisite: 6,
    recommended: false,
  },
  {
    id: 8,
    title: 'Madd — Long Vowels',
    subtitle: 'بَا بِي بُو',
    description:
      'Discover how Alif, Ya and Waw extend vowel sounds.',
    icon: 'M',
    component: 'ArabicHarakatLab',
    stage: 'Harakat',
    skills: ['Long vowels', 'Madd', 'Sound length'],
    objective: 'Distinguish short vowels from long vowel sounds.',
    prerequisite: 6,
    recommended: true,
  },
  {
    id: 9,
    title: 'Sukoon',
    subtitle: 'The silent mark — بْ',
    description:
      'Learn how Sukoon indicates that a consonant has no vowel sound.',
    icon: 'ْ',
    component: 'ArabicHarakatLab',
    stage: 'Harakat',
    skills: ['Sukoon', 'Blending', 'Decoding'],
    objective: 'Read consonants marked with Sukoon.',
    prerequisite: 6,
    recommended: false,
  },
  {
    id: 10,
    title: 'Shaddah',
    subtitle: 'The doubled consonant — بّ',
    description:
      'Learn how Shaddah indicates a doubled or strengthened consonant.',
    icon: 'ّ',
    component: 'ArabicHarakatLab',
    stage: 'Harakat',
    skills: ['Shaddah', 'Consonant doubling', 'Fluency'],
    objective: 'Recognise and read letters carrying Shaddah.',
    prerequisite: 6,
    recommended: false,
  },
  {
    id: 11,
    title: 'Hamzah',
    subtitle: 'أ إ ؤ ئ ء',
    description:
      'Meet the major written forms of Hamzah and learn to recognise them.',
    icon: 'ء',
    component: 'ArabicLetters',
    stage: 'Letters',
    skills: ['Hamzah', 'Orthography', 'Visual recognition'],
    objective: 'Recognise common forms of Hamzah.',
    prerequisite: 6,
    recommended: false,
  },
  {
    id: 12,
    title: 'Word Building',
    subtitle: 'Build Arabic words',
    description:
      'Move from individual sounds to connected letters and simple words.',
    icon: '🧩',
    component: 'ArabicWords',
    stage: 'Word Building',
    skills: ['Blending', 'Segmentation', 'Word formation'],
    objective: 'Combine Arabic letters and sounds into words.',
    prerequisite: 6,
    recommended: true,
  },
  {
    id: 13,
    title: 'Word Reading',
    subtitle: 'Read 2–4 letter words',
    description:
      'Practise decoding short, fully vowelled Arabic words.',
    icon: '📖',
    component: 'ArabicWords',
    stage: 'Reading',
    skills: ['Decoding', 'Blending', 'Word recognition'],
    objective: 'Read simple Arabic words independently.',
    prerequisite: 12,
    recommended: true,
  },
  {
    id: 14,
    title: 'Sentence Reading',
    subtitle: 'Read simple Arabic sentences',
    description:
      'Move from isolated words into meaningful phrases and sentences.',
    icon: '📚',
    component: 'ArabicReading',
    stage: 'Reading',
    skills: ['Sentence reading', 'Fluency', 'Meaning'],
    objective: 'Read simple Arabic sentences with understanding.',
    prerequisite: 13,
    recommended: true,
  },
  {
    id: 15,
    title: 'Arabic Vocabulary',
    subtitle: 'Family, animals, food and everyday words',
    description:
      'Build useful vocabulary and connect written words to their meanings.',
    icon: '🗣️',
    component: 'ArabicWords',
    stage: 'Vocabulary',
    skills: ['Vocabulary', 'Pronunciation', 'Meaning'],
    objective: 'Recognise and understand common Arabic vocabulary.',
    prerequisite: 13,
    recommended: true,
  },
  {
    id: 16,
    title: 'Reading Comprehension',
    subtitle: 'Understand what you read',
    description:
      'Read short passages and demonstrate understanding of their meaning.',
    icon: '🧠',
    component: 'ArabicReading',
    stage: 'Comprehension',
    skills: ['Comprehension', 'Inference', 'Recall'],
    objective: 'Demonstrate understanding of short Arabic texts.',
    prerequisite: 14,
    recommended: true,
  },
];

const STAGES: ArabicStage[] = [
  'Readiness',
  'Letters',
  'Harakat',
  'Word Building',
  'Reading',
  'Vocabulary',
  'Comprehension',
];

const createInitialProgress = (): ProgressMap =>
  LEVELS.reduce<ProgressMap>((progress, level) => {
    progress[level.id] = {
      completed: false,
      bestScore: 0,
      attempts: 0,
    };

    return progress;
  }, {});

const loadProgress = (): ProgressMap => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return createInitialProgress();
    }

    const parsed = JSON.parse(stored) as ProgressMap;

    return {
      ...createInitialProgress(),
      ...parsed,
    };
  } catch {
    return createInitialProgress();
  }
};

export const ArabicAcademy: React.FC<ArabicAcademyProps> = ({
  onComplete,
}) => {
  const [activeLevel, setActiveLevel] = useState<number | null>(null);
  const [progress, setProgress] = useState<ProgressMap>(loadProgress);
  const [selectedStage, setSelectedStage] =
    useState<ArabicStage | 'All'>('All');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Storage may be unavailable in some browser contexts.
    }
  }, [progress]);

  const completedCount = useMemo(
    () =>
      LEVELS.filter((level) => progress[level.id]?.completed).length,
    [progress]
  );

  const totalScore = useMemo(
    () =>
      LEVELS.reduce(
        (total, level) => total + (progress[level.id]?.bestScore ?? 0),
        0
      ),
    [progress]
  );

  const masteryPercentage = Math.round(
    (completedCount / LEVELS.length) * 100
  );

  const filteredLevels = useMemo(() => {
    if (selectedStage === 'All') {
      return LEVELS;
    }

    return LEVELS.filter((level) => level.stage === selectedStage);
  }, [selectedStage]);

  const recommendedLevel =
    LEVELS.find(
      (level) => level.recommended && !progress[level.id]?.completed
    ) ?? LEVELS[LEVELS.length - 1];

  const activeLevelData =
    activeLevel !== null
      ? LEVELS.find((level) => level.id === activeLevel) ?? null
      : null;

  const handleLevelComplete = (score: number) => {
    if (activeLevel === null) {
      return;
    }

    const levelId = activeLevel;
    const previousBest = progress[levelId]?.bestScore ?? 0;

    setProgress((previous) => ({
      ...previous,
      [levelId]: {
        completed: true,
        bestScore: Math.max(previousBest, score),
        attempts: (previous[levelId]?.attempts ?? 0) + 1,
      },
    }));

    onComplete?.(score);
  };

  const handleReset = () => {
    setProgress(createInitialProgress());
    setActiveLevel(null);
    setShowResetConfirm(false);

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors.
    }
  };

  const renderLesson = (component: ArabicComponent) => {
    switch (component) {
      case 'ArabicLetters':
        return <ArabicLetters onComplete={handleLevelComplete} />;

      case 'ArabicHarakatLab':
        return <ArabicHarakatLab onComplete={handleLevelComplete} />;

      case 'ArabicWords':
        return <ArabicWords onComplete={handleLevelComplete} />;

      case 'ArabicReading':
        return <ArabicReading onComplete={handleLevelComplete} />;

      default:
        return <ArabicLetters onComplete={handleLevelComplete} />;
    }
  };

  if (activeLevelData) {
    const currentIndex = LEVELS.findIndex(
      (level) => level.id === activeLevelData.id
    );

    const previousLevel =
      currentIndex > 0 ? LEVELS[currentIndex - 1] : null;

    const nextLevel =
      currentIndex < LEVELS.length - 1
        ? LEVELS[currentIndex + 1]
        : null;

    return (
      <div className="max-w-5xl mx-auto">
        {/* Lesson Header */}
        <div className="bg-app-card border border-app-border rounded-2xl p-4 mb-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setActiveLevel(null)}
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={17} />
              Back to Arabic Academy
            </button>

            <div className="flex items-center gap-3">
              <div className="text-3xl">{activeLevelData.icon}</div>

              <div>
                <div className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">
                  Level {activeLevelData.id} • {activeLevelData.stage}
                </div>

                <h2 className="text-lg md:text-xl font-bold text-white">
                  {activeLevelData.title}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 text-yellow-400">
              <Star size={17} fill="currentColor" />
              <span className="font-bold">
                {progress[activeLevelData.id]?.bestScore ?? 0}
              </span>
            </div>
          </div>
        </div>

        {/* Objective */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-5 mb-5"
        >
          <div className="flex gap-4">
            <div className="p-3 rounded-xl bg-indigo-500/15 text-indigo-300">
              <Target size={22} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-1">
                Learning Objective
              </p>

              <p className="text-gray-200">
                {activeLevelData.objective}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Lesson */}
        <motion.div
          key={activeLevelData.id}
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
        >
          {renderLesson(activeLevelData.component)}
        </motion.div>

        {/* Lesson Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
          {previousLevel && (
            <button
              type="button"
              onClick={() => setActiveLevel(previousLevel.id)}
              className="p-4 rounded-xl border border-app-border bg-app-card text-left hover:border-indigo-400 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ArrowLeft size={18} className="text-gray-400" />

                <div>
                  <div className="text-xs text-gray-500">
                    Previous Level
                  </div>
                  <div className="text-white font-semibold">
                    {previousLevel.title}
                  </div>
                </div>
              </div>
            </button>
          )}

          {nextLevel && (
            <button
              type="button"
              onClick={() => setActiveLevel(nextLevel.id)}
              className="p-4 rounded-xl border border-app-border bg-app-card text-left hover:border-indigo-400 transition-colors md:col-start-2"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500">
                    Next Level
                  </div>
                  <div className="text-white font-semibold">
                    {nextLevel.title}
                  </div>
                </div>

                <ArrowRight size={18} className="text-gray-400" />
              </div>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Academy Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-app-card border border-app-border p-6 md:p-8"
      >
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative">
          <div className="flex flex-wrap justify-between items-start gap-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-3xl">
                📖
              </div>

              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-indigo-400 font-bold mb-1">
                  Arabic Language & Literacy
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Arabic Literacy Academy
                </h1>

                <p className="text-gray-400 mt-2 max-w-2xl">
                  A structured pathway from Arabic listening and letter
                  recognition to fluent word reading, vocabulary and
                  comprehension.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowInfo(true)}
              className="p-2.5 rounded-xl border border-app-border text-gray-400 hover:text-white hover:border-indigo-400 transition-colors"
              aria-label="About Arabic Academy"
            >
              <HelpCircle size={19} />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-7">
            <StatCard
              icon={<Trophy size={18} />}
              label="Levels Mastered"
              value={`${completedCount}/${LEVELS.length}`}
            />

            <StatCard
              icon={<Target size={18} />}
              label="Mastery"
              value={`${masteryPercentage}%`}
            />

            <StatCard
              icon={<Star size={18} />}
              label="Best Score"
              value={String(totalScore)}
            />

            <StatCard
              icon={<BookOpen size={18} />}
              label="Learning Stages"
              value={String(STAGES.length)}
            />
          </div>

          {/* Mastery Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-400">
                Academy Progress
              </span>

              <span className="text-indigo-300 font-semibold">
                {completedCount} of {LEVELS.length} levels
              </span>
            </div>

            <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${masteryPercentage}%` }}
                transition={{ duration: 0.7 }}
                className="h-full rounded-full bg-indigo-500"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recommended Next */}
      <motion.button
        type="button"
        onClick={() => setActiveLevel(recommendedLevel.id)}
        whileHover={{ y: -2 }}
        className="w-full text-left bg-indigo-500/10 border border-indigo-500/25 rounded-2xl p-5 hover:border-indigo-400/50 transition-colors"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/15 flex items-center justify-center text-2xl">
              {recommendedLevel.icon}
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-indigo-300 font-bold">
                Recommended Next
              </div>

              <div className="text-white font-bold text-lg">
                Level {recommendedLevel.id}: {recommendedLevel.title}
              </div>

              <div className="text-sm text-gray-400 mt-1">
                {recommendedLevel.description}
              </div>
            </div>
          </div>

          <ChevronRight
            size={22}
            className="text-indigo-300 flex-shrink-0"
          />
        </div>
      </motion.button>

      {/* Stage Filters */}
      <div className="bg-app-card border border-app-border rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={17} className="text-indigo-400" />
          <h2 className="text-sm font-semibold text-white">
            Learning Stages
          </h2>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          <StageButton
            active={selectedStage === 'All'}
            onClick={() => setSelectedStage('All')}
          >
            All Levels
          </StageButton>

          {STAGES.map((stage) => (
            <StageButton
              key={stage}
              active={selectedStage === stage}
              onClick={() => setSelectedStage(stage)}
            >
              {stage}
            </StageButton>
          ))}
        </div>
      </div>

      {/* Levels */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">
              Arabic Learning Path
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Start at foundation and move forward as mastery develops.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-red-400 transition-colors"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredLevels.map((level, index) => {
            const levelProgress = progress[level.id] ?? {
              completed: false,
              bestScore: 0,
              attempts: 0,
            };

            const isCompleted = levelProgress.completed;

            return (
              <motion.button
                key={level.id}
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.025 }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveLevel(level.id)}
                className={`group relative text-left p-5 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-green-500/5 border-green-500/25 hover:border-green-400/50'
                    : 'bg-app-card border-app-border hover:border-indigo-400/50'
                }`}
              >
                {/* Completion */}
                {isCompleted && (
                  <div className="absolute top-4 right-4 text-green-400">
                    <CheckCircle size={20} />
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                      isCompleted
                        ? 'bg-green-500/10'
                        : 'bg-gray-800'
                    }`}
                  >
                    {level.icon}
                  </div>

                  <div className="min-w-0 pr-5">
                    <div className="text-xs text-indigo-400 font-semibold mb-1">
                      LEVEL {level.id}
                    </div>

                    <h3 className="text-white font-bold">
                      {level.title}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {level.subtitle}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-400 mt-4 leading-relaxed">
                  {level.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  {level.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 rounded-md bg-gray-800 text-[10px] text-gray-400"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-app-border">
                  <div className="text-xs text-gray-500">
                    {isCompleted
                      ? `Best: ${levelProgress.bestScore}`
                      : 'Not mastered yet'}
                  </div>

                  <div className="flex items-center gap-1 text-xs text-indigo-400 group-hover:text-indigo-300">
                    {isCompleted ? 'Practise again' : 'Start lesson'}
                    <ChevronRight size={14} />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Teaching Principle */}
      <div className="bg-app-card border border-app-border rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Headphones size={21} />
          </div>

          <div>
            <h3 className="text-white font-bold">
              How Arabic learning works
            </h3>

            <p className="text-sm text-gray-400 mt-1 leading-relaxed">
              Children begin with foundational Arabic literacy and build
              progressively through sound awareness, letters, harakat,
              blending, words, sentences, vocabulary and comprehension.
              Age can influence recommendations, but mastery determines
              readiness for the next challenge.
            </p>
          </div>
        </div>
      </div>

      {/* Reset Confirmation */}
      {showResetConfirm && (
        <Modal onClose={() => setShowResetConfirm(false)}>
          <div className="text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mb-4">
              <RotateCcw size={24} />
            </div>

            <h3 className="text-xl font-bold text-white">
              Reset Arabic Progress?
            </h3>

            <p className="text-sm text-gray-400 mt-2">
              This will remove all Arabic Academy mastery and score
              records from this device.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="flex-1 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
              >
                Reset Progress
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Academy Information */}
      {showInfo && (
        <Modal onClose={() => setShowInfo(false)}>
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-white">
                About the Arabic Academy
              </h3>

              <button
                type="button"
                onClick={() => setShowInfo(false)}
                className="text-gray-500 hover:text-white"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-sm text-gray-400">
              <InfoRow
                icon={<BookOpen size={17} />}
                title="Foundation First"
                text="Every learner can begin with the foundational Arabic literacy sequence."
              />

              <InfoRow
                icon={<Target size={17} />}
                title="Mastery Based"
                text="Completion records practice, while best scores help indicate mastery."
              />

              <InfoRow
                icon={<Volume2 size={17} />}
                title="Listen and Read"
                text="Arabic literacy connects visual symbols, pronunciation and meaning."
              />

              <InfoRow
                icon={<Star size={17} />}
                title="Practice Again"
                text="Completed levels remain available for revision and further practice."
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
}) => (
  <div className="rounded-xl bg-gray-900/60 border border-app-border p-4">
    <div className="flex items-center gap-2 text-indigo-400 mb-2">
      {icon}
      <span className="text-xs text-gray-500">{label}</span>
    </div>

    <div className="text-xl font-bold text-white">
      {value}
    </div>
  </div>
);

interface StageButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const StageButton: React.FC<StageButtonProps> = ({
  active,
  onClick,
  children,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`whitespace-nowrap px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
      active
        ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
        : 'bg-gray-900 text-gray-500 border border-app-border hover:text-gray-300'
    }`}
  >
    {children}
  </button>
);

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => (
  <div
    className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="w-full max-w-md bg-app-card border border-app-border rounded-2xl p-6 shadow-2xl"
      onClick={(event) => event.stopPropagation()}
    >
      {children}
    </motion.div>
  </div>
);

interface InfoRowProps {
  icon: React.ReactNode;
  title: string;
  text: string;
}

const InfoRow: React.FC<InfoRowProps> = ({
  icon,
  title,
  text,
}) => (
  <div className="flex gap-3">
    <div className="text-indigo-400 mt-0.5">{icon}</div>

    <div>
      <div className="text-white font-semibold">{title}</div>
      <div className="mt-1">{text}</div>
    </div>
  </div>
);

export default ArabicAcademy;