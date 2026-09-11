import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  RotateCcw,
  Star,
  Target,
  Volume2,
  XCircle,
} from 'lucide-react';

import { speakArabic } from '../../../services/arabicSpeech';
import { playSoundFeedback } from '../../../services/soundFeedback';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

interface ArabicHarakatLabProps {
  onComplete?: (score: number) => void;
}

type HarakaId =
  | 'fatha'
  | 'kasra'
  | 'damma'
  | 'fathatayn'
  | 'kasratayn'
  | 'dammatayn'
  | 'madd-fatha'
  | 'madd-kasra'
  | 'madd-damma'
  | 'sukoon'
  | 'shaddah';

type LabMode = 'explore' | 'learn' | 'practice' | 'mastery';

interface Haraka {
  id: HarakaId;
  symbol: string;
  name: string;
  transliteration: string;
  sound: string;
  description: string;
  example: string;
  category: 'short-vowel' | 'tanween' | 'madd' | 'special';
}

interface PracticeQuestion {
  letter: string;
  haraka: Haraka;
  options: Haraka[];
}

const LETTERS = [
  'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز',
  'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق',
  'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي',
];

const HARAKAT: Haraka[] = [
  {
    id: 'fatha',
    symbol: 'َ',
    name: 'Fatha',
    transliteration: 'a',
    sound: 'a',
    description:
      'Fatha is a short vowel mark written above a letter. It usually gives the letter a short "a" sound.',
    example: 'بَ',
    category: 'short-vowel',
  },
  {
    id: 'kasra',
    symbol: 'ِ',
    name: 'Kasra',
    transliteration: 'i',
    sound: 'i',
    description:
      'Kasra is a short vowel mark written below a letter. It usually gives the letter a short "i" sound.',
    example: 'بِ',
    category: 'short-vowel',
  },
  {
    id: 'damma',
    symbol: 'ُ',
    name: 'Damma',
    transliteration: 'u',
    sound: 'u',
    description:
      'Damma is a short vowel mark written above a letter. It usually gives the letter a short "u" sound.',
    example: 'بُ',
    category: 'short-vowel',
  },
  {
    id: 'fathatayn',
    symbol: 'ً',
    name: 'Fathatayn',
    transliteration: 'an',
    sound: 'an',
    description:
      'Fathatayn is the double Fatha form of Tanween. It commonly produces an "an" ending in fully vowelled words.',
    example: 'بً',
    category: 'tanween',
  },
  {
    id: 'kasratayn',
    symbol: 'ٍ',
    name: 'Kasratayn',
    transliteration: 'in',
    sound: 'in',
    description:
      'Kasratayn is the double Kasra form of Tanween. It commonly produces an "in" ending.',
    example: 'بٍ',
    category: 'tanween',
  },
  {
    id: 'dammatayn',
    symbol: 'ٌ',
    name: 'Dammatayn',
    transliteration: 'un',
    sound: 'un',
    description:
      'Dammatayn is the double Damma form of Tanween. It commonly produces an "un" ending.',
    example: 'بٌ',
    category: 'tanween',
  },
  {
    id: 'madd-fatha',
    symbol: 'ا',
    name: 'Madd with Fatha',
    transliteration: 'ā',
    sound: 'aa',
    description:
      'A Fatha followed by Alif creates a long "aa" sound.',
    example: 'بَا',
    category: 'madd',
  },
  {
    id: 'madd-kasra',
    symbol: 'ي',
    name: 'Madd with Kasra',
    transliteration: 'ī',
    sound: 'ee',
    description:
      'A Kasra followed by Ya can create a long "ee" sound.',
    example: 'بِي',
    category: 'madd',
  },
  {
    id: 'madd-damma',
    symbol: 'و',
    name: 'Madd with Damma',
    transliteration: 'ū',
    sound: 'oo',
    description:
      'A Damma followed by Waw can create a long "oo" sound.',
    example: 'بُو',
    category: 'madd',
  },
  {
    id: 'sukoon',
    symbol: 'ْ',
    name: 'Sukoon',
    transliteration: 'no vowel',
    sound: 'stopped consonant',
    description:
      'Sukoon indicates that the consonant has no short vowel following it.',
    example: 'بْ',
    category: 'special',
  },
  {
    id: 'shaddah',
    symbol: 'ّ',
    name: 'Shaddah',
    transliteration: 'doubled',
    sound: 'strengthened consonant',
    description:
      'Shaddah indicates that the consonant is doubled or strengthened.',
    example: 'بّ',
    category: 'special',
  },
];

const SHORT_VOWELS = HARAKAT.filter(
  (haraka) => haraka.category === 'short-vowel'
);

const createQuestion = (): PracticeQuestion => {
  const letter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
  const haraka =
    SHORT_VOWELS[Math.floor(Math.random() * SHORT_VOWELS.length)];

  const shuffledOptions = [...SHORT_VOWELS]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  if (!shuffledOptions.some((option) => option.id === haraka.id)) {
    shuffledOptions[Math.floor(Math.random() * shuffledOptions.length)] =
      haraka;
  }

  return {
    letter,
    haraka,
    options: shuffledOptions.sort(() => Math.random() - 0.5),
  };
};

const createInitialQuestions = (count = 10): PracticeQuestion[] =>
  Array.from({ length: count }, () => createQuestion());

export const ArabicHarakatLab: React.FC<ArabicHarakatLabProps> = ({
  onComplete,
}) => {
  const [mode, setMode] = useState<LabMode>('explore');

  const [selectedLetter, setSelectedLetter] = useState('ب');
  const [selectedHarakaId, setSelectedHarakaId] =
    useState<HarakaId>('fatha');

  const [questions, setQuestions] = useState<PracticeQuestion[]>(
    createInitialQuestions()
  );

  const [questionIndex, setQuestionIndex] = useState(0);
  const [practiceScore, setPracticeScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<HarakaId | null>(null);

  const [masteryScore, setMasteryScore] = useState(0);
  const [masteryAttempts, setMasteryAttempts] = useState(0);
  const [completed, setCompleted] = useState(false);

  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const { speak } = useReadAloud();

  const selectedHaraka =
    HARAKAT.find((haraka) => haraka.id === selectedHarakaId) ?? HARAKAT[0];

  const currentQuestion = questions[questionIndex];

  const combinedCharacter = useMemo(() => {
    if (selectedHaraka.id === 'madd-fatha') {
      return `${selectedLetter}َ${selectedHaraka.symbol}`;
    }
    if (selectedHaraka.id === 'madd-kasra') {
      return `${selectedLetter}ِ${selectedHaraka.symbol}`;
    }
    if (selectedHaraka.id === 'madd-damma') {
      return `${selectedLetter}ُ${selectedHaraka.symbol}`;
    }
    return `${selectedLetter}${selectedHaraka.symbol}`;
  }, [selectedLetter, selectedHaraka]);

  const currentModeTitle = {
    explore: 'Explore Harakat',
    learn: 'Learn the Marks',
    practice: 'Practice Short Vowels',
    mastery: 'Harakat Mastery',
  }[mode];

  // Arabic voice gated on soundEnabled
  const handleSpeak = (text = combinedCharacter) => {
    if (!soundEnabled) return;
    speakArabic(text);
  };

  // Auto-read the explore mode + other mode prompts
  useEffect(() => {
    if (!autoReadEnabled) return;

    let readOut = '';

    if (mode === 'explore') {
      readOut = `${selectedHaraka.name}. Sound: ${selectedHaraka.sound}. ${selectedHaraka.description}`;
    } else if (mode === 'learn') {
      readOut =
        'Learn the Arabic marks. Explore each mark, hear its sound, and compare how it changes a letter.';
    } else if (mode === 'practice' || mode === 'mastery') {
      if (!answered && currentQuestion) {
        readOut =
          mode === 'practice'
            ? 'Practice. Listen and choose the correct haraka.'
            : 'Mastery assessment. Listen and choose the correct haraka.';
      }
    }

    if (!readOut) return;

    const timer = window.setTimeout(() => {
      if (mode === 'explore') {
        // Explore mode reads Arabic symbol aloud
        handleSpeak();
      } else {
        speak(readOut);
      }
    }, 450);

    return () => window.clearTimeout(timer);
  }, [
    mode,
    selectedLetter,
    selectedHarakaId,
    questionIndex,
    answered,
    currentQuestion,
    speak,
    autoReadEnabled,
    soundEnabled,
    selectedHaraka,
  ]);

  const resetLab = () => {
    setMode('explore');
    setSelectedLetter('ب');
    setSelectedHarakaId('fatha');
    setQuestions(createInitialQuestions());
    setQuestionIndex(0);
    setPracticeScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setMasteryScore(0);
    setMasteryAttempts(0);
    setCompleted(false);

    speak("Let's explore the harakat again!");
  };

  const startPractice = () => {
    setQuestions(createInitialQuestions());
    setQuestionIndex(0);
    setPracticeScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setCompleted(false);
    setMode('practice');

    speak('Practice mode. Listen and choose the correct haraka.');
  };

  const startMastery = () => {
    setQuestions(createInitialQuestions(15));
    setQuestionIndex(0);
    setMasteryScore(0);
    setMasteryAttempts(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setCompleted(false);
    setMode('mastery');

    speak('Mastery assessment. Listen and choose the correct haraka.');
  };

  const handleAnswer = (answer: HarakaId) => {
    if (answered || !currentQuestion) return;

    const correct = answer === currentQuestion.haraka.id;

    setSelectedAnswer(answer);
    setAnswered(true);

    if (mode === 'practice') {
      if (correct) {
        if (soundEnabled) playSoundFeedback('correct');
        setPracticeScore((previous) => previous + 10);
        speak('Correct!');
      } else {
        if (soundEnabled) playSoundFeedback('try-again');
        speak(
          `Not quite. The correct answer is ${currentQuestion.haraka.name}.`,
        );
      }
    }

    if (mode === 'mastery') {
      setMasteryAttempts((previous) => previous + 1);

      if (correct) {
        if (soundEnabled) playSoundFeedback('correct');
        setMasteryScore((previous) => previous + 10);
        speak('Correct!');
      } else {
        if (soundEnabled) playSoundFeedback('try-again');
        speak(
          `Not quite. The correct answer is ${currentQuestion.haraka.name}.`,
        );
      }
    }

    handleSpeak(
      `${currentQuestion.letter}${currentQuestion.haraka.symbol}`
    );
  };

  const moveToNextQuestion = () => {
    if (!currentQuestion) return;

    const isLastQuestion = questionIndex === questions.length - 1;

    if (isLastQuestion) {
      const finalScore =
        mode === 'practice'
          ? practiceScore +
            (selectedAnswer === currentQuestion.haraka.id ? 10 : 0)
          : masteryScore +
            (selectedAnswer === currentQuestion.haraka.id ? 10 : 0);

      setCompleted(true);
      onComplete?.(finalScore);

      const percentage = Math.round(
        (finalScore / (questions.length * 10)) * 100
      );

      speak(
        percentage >= 80
          ? `Masha'Allah! You scored ${percentage} percent.`
          : `Well done! You scored ${percentage} percent. Let's practise again.`,
      );
      return;
    }

    setQuestionIndex((previous) => previous + 1);
    setAnswered(false);
    setSelectedAnswer(null);
  };

  const renderExploreMode = () => (
    <div>
      <div className="bg-gray-900/70 border border-app-border rounded-2xl p-6 md:p-8 text-center mb-6">
        <div className="text-xs uppercase tracking-[0.18em] text-indigo-400 font-bold mb-4">
          Explore
        </div>

        <motion.div
          key={combinedCharacter}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-8xl md:text-9xl text-white leading-none mb-5"
          dir="rtl"
        >
          {combinedCharacter}
        </motion.div>

        <div className="text-xl font-bold text-emerald-400">
          {selectedHaraka.name}
        </div>

        <div className="text-gray-400 text-sm mt-1">
          Sound: {selectedHaraka.sound}
        </div>

        <div className="text-gray-500 text-xs mt-3">
          {selectedHaraka.description}
        </div>

        <button
          type="button"
          onClick={() => handleSpeak()}
          className="mt-5 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors"
        >
          <Volume2 size={19} />
          Hear It
        </button>
      </div>

      <div className="mb-6">
        <SectionTitle number="1" title="Choose a Letter" />

        <div
          className="grid grid-cols-7 sm:grid-cols-9 md:grid-cols-14 gap-2"
          dir="rtl"
        >
          {LETTERS.map((letter) => (
            <motion.button
              key={letter}
              type="button"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedLetter(letter)}
              className={`h-10 rounded-lg border text-xl font-bold transition-colors ${
                selectedLetter === letter
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-gray-800 border-gray-700 text-white hover:border-gray-500'
              }`}
              aria-label={`Choose Arabic letter ${letter}`}
            >
              {letter}
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle number="2" title="Choose a Haraka" />

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {HARAKAT.map((haraka) => (
            <HarakaButton
              key={haraka.id}
              haraka={haraka}
              selected={selectedHarakaId === haraka.id}
              onClick={() => setSelectedHarakaId(haraka.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderLearnMode = () => (
    <div className="space-y-4">
      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <HelpCircle
            size={22}
            className="text-indigo-400 flex-shrink-0 mt-0.5"
          />

          <div>
            <h3 className="text-white font-bold">
              Learn the Arabic marks
            </h3>

            <p className="text-sm text-gray-400 mt-1">
              Explore each mark, hear its sound and compare how it changes a
              letter.
            </p>
          </div>
        </div>
      </div>

      {HARAKAT.map((haraka) => (
        <motion.div
          key={haraka.id}
          whileHover={{ y: -2 }}
          className="bg-app-card border border-app-border rounded-2xl p-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div
              className="w-20 h-20 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-5xl text-white flex-shrink-0"
              dir="rtl"
            >
              {haraka.example}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-white font-bold text-lg">
                  {haraka.name}
                </h3>

                <span className="text-xs px-2 py-1 rounded-md bg-gray-800 text-gray-400">
                  {haraka.transliteration}
                </span>
              </div>

              <p className="text-sm text-gray-400 mt-2">
                {haraka.description}
              </p>

              <div className="text-xs text-indigo-300 mt-2">
                Example: {haraka.example}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSpeak(haraka.example)}
              className="p-3 rounded-xl bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
              aria-label={`Hear ${haraka.name}`}
            >
              <Volume2 size={19} />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderQuestionMode = () => {
    if (completed) {
      const totalQuestions = questions.length;

      const finalScore = mode === 'practice' ? practiceScore : masteryScore;

      const percentage = Math.round(
        (finalScore / (totalQuestions * 10)) * 100
      );

      return (
        <CompletionCard
          score={finalScore}
          percentage={percentage}
          totalQuestions={totalQuestions}
          mode={mode}
          onRetry={mode === 'practice' ? startPractice : startMastery}
          onExplore={() => setMode('explore')}
        />
      );
    }

    if (!currentQuestion) return null;

    const correctAnswer = currentQuestion.haraka.id;
    const isCorrect = selectedAnswer === correctAnswer;

    return (
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-xs uppercase tracking-wider text-indigo-400 font-bold">
              {mode === 'practice' ? 'Practice' : 'Mastery Assessment'}
            </div>

            <div className="text-sm text-gray-400 mt-1">
              Question {questionIndex + 1} of {questions.length}
            </div>
          </div>

          <div className="flex items-center gap-2 text-yellow-400 font-bold">
            <Star size={17} fill="currentColor" />
            {mode === 'practice' ? practiceScore : masteryScore}
          </div>
        </div>

        <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-6">
          <motion.div
            animate={{
              width: `${((questionIndex + 1) / questions.length) * 100}%`,
            }}
            className="h-full bg-indigo-500 rounded-full"
          />
        </div>

        <div className="bg-gray-900/70 border border-app-border rounded-2xl p-8 text-center mb-6">
          <div className="text-sm text-gray-500 mb-4">
            Listen and choose the correct haraka
          </div>

          <motion.div
            key={`${currentQuestion.letter}-${currentQuestion.haraka.id}-${questionIndex}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-8xl text-white mb-5"
            dir="rtl"
          >
            {currentQuestion.letter}
          </motion.div>

          <button
            type="button"
            onClick={() =>
              handleSpeak(
                `${currentQuestion.letter}${currentQuestion.haraka.symbol}`
              )
            }
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors"
          >
            <Volume2 size={18} />
            Hear the Sound
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {currentQuestion.options.map((haraka) => {
            const isSelected = selectedAnswer === haraka.id;
            const isCorrectOption = haraka.id === correctAnswer;

            let stateClass =
              'bg-app-card border-app-border hover:border-indigo-400';

            if (answered && isCorrectOption) {
              stateClass = 'bg-green-500/10 border-green-500/40';
            } else if (answered && isSelected && !isCorrect) {
              stateClass = 'bg-red-500/10 border-red-500/40';
            }

            return (
              <motion.button
                key={haraka.id}
                type="button"
                whileHover={!answered ? { y: -2 } : undefined}
                whileTap={!answered ? { scale: 0.98 } : undefined}
                onClick={() => handleAnswer(haraka.id)}
                disabled={answered}
                className={`p-5 rounded-2xl border-2 transition-all ${stateClass}`}
              >
                <div className="text-5xl text-white mb-3" dir="rtl">
                  {currentQuestion.letter}
                  {haraka.symbol}
                </div>

                <div className="text-sm font-bold text-white">
                  {haraka.name}
                </div>

                <div className="text-xs text-gray-500 mt-1">
                  {haraka.transliteration}
                </div>

                {answered && isCorrectOption && (
                  <CheckCircle
                    size={18}
                    className="mx-auto mt-3 text-green-400"
                  />
                )}

                {answered && isSelected && !isCorrect && (
                  <XCircle size={18} className="mx-auto mt-3 text-red-400" />
                )}
              </motion.button>
            );
          })}
        </div>

        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-5 rounded-2xl p-5 border ${
              isCorrect
                ? 'bg-green-500/10 border-green-500/25'
                : 'bg-red-500/10 border-red-500/25'
            }`}
          >
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <CheckCircle
                  size={21}
                  className="text-green-400 flex-shrink-0"
                />
              ) : (
                <XCircle size={21} className="text-red-400 flex-shrink-0" />
              )}

              <div>
                <div
                  className={`font-bold ${
                    isCorrect ? 'text-green-300' : 'text-red-300'
                  }`}
                >
                  {isCorrect ? 'Excellent!' : 'Keep practising!'}
                </div>

                <p className="text-sm text-gray-400 mt-1">
                  The correct answer is{' '}
                  <strong className="text-white">
                    {currentQuestion.haraka.name}
                  </strong>{' '}
                  —{' '}
                  <span dir="rtl">
                    {currentQuestion.letter}
                    {currentQuestion.haraka.symbol}
                  </span>
                  .
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={moveToNextQuestion}
              className="mt-4 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-colors"
            >
              {questionIndex === questions.length - 1
                ? 'Finish Assessment'
                : 'Next Question'}
              <ArrowRight size={17} />
            </button>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-app-card border border-app-border rounded-2xl p-5 mb-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-2xl">
              🔬
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                Arabic Literacy Laboratory
              </div>

              <h2 className="text-xl font-bold text-white">
                {currentModeTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSound}
              aria-label="Toggle sound"
              className="p-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <Volume2
                size={17}
                className={soundEnabled ? 'text-amber-300' : 'text-gray-500'}
              />
            </button>

            <button
              type="button"
              onClick={resetLab}
              className="p-2.5 rounded-xl bg-gray-800 text-gray-400 hover:text-white transition-colors"
              aria-label="Reset Arabic Harakat Lab"
            >
              <RotateCcw size={17} />
            </button>
          </div>
        </div>

        {/* Mode navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5">
          <ModeButton
            active={mode === 'explore'}
            onClick={() => setMode('explore')}
          >
            Explore
          </ModeButton>

          <ModeButton
            active={mode === 'learn'}
            onClick={() => setMode('learn')}
          >
            Learn
          </ModeButton>

          <ModeButton active={mode === 'practice'} onClick={startPractice}>
            Practice
          </ModeButton>

          <ModeButton active={mode === 'mastery'} onClick={startMastery}>
            Mastery
          </ModeButton>
        </div>
      </div>

      {/* Mode Content */}
      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {mode === 'explore' && renderExploreMode()}
        {mode === 'learn' && renderLearnMode()}
        {(mode === 'practice' || mode === 'mastery') && renderQuestionMode()}
      </motion.div>

      {/* Learning principle */}
      <div className="mt-6 bg-app-card border border-app-border rounded-2xl p-5">
        <div className="flex gap-3">
          <Target size={20} className="text-indigo-400 flex-shrink-0" />

          <div>
            <div className="text-white font-semibold">
              Arabic decoding pathway
            </div>

            <div className="text-sm text-gray-500 mt-1">
              Hear → See → Say → Compare → Read → Master
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SectionTitleProps {
  number: string;
  title: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ number, title }) => (
  <div className="flex items-center gap-3 mb-3">
    <div className="w-7 h-7 rounded-full bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-xs text-indigo-300 font-bold">
      {number}
    </div>

    <h3 className="text-sm font-semibold text-white">{title}</h3>
  </div>
);

interface HarakaButtonProps {
  haraka: Haraka;
  selected: boolean;
  onClick: () => void;
}

const HarakaButton: React.FC<HarakaButtonProps> = ({
  haraka,
  selected,
  onClick,
}) => (
  <motion.button
    type="button"
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`p-4 rounded-xl border-2 text-center transition-colors ${
      selected
        ? 'bg-indigo-500/15 border-indigo-400'
        : 'bg-gray-800 border-gray-700 hover:border-gray-500'
    }`}
  >
    <div className="text-4xl text-white mb-2" dir="rtl">
      ب{haraka.symbol}
    </div>

    <div
      className={`text-xs font-bold ${
        selected ? 'text-indigo-300' : 'text-gray-300'
      }`}
    >
      {haraka.name}
    </div>

    <div className="text-[10px] text-gray-500 mt-1">
      {haraka.transliteration}
    </div>
  </motion.button>
);

interface ModeButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const ModeButton: React.FC<ModeButtonProps> = ({
  active,
  onClick,
  children,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
      active
        ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
        : 'bg-gray-900 text-gray-500 border border-app-border hover:text-gray-300'
    }`}
  >
    {children}
  </button>
);

interface CompletionCardProps {
  score: number;
  percentage: number;
  totalQuestions: number;
  mode: LabMode;
  onRetry: () => void;
  onExplore: () => void;
}

const CompletionCard: React.FC<CompletionCardProps> = ({
  score,
  percentage,
  totalQuestions,
  mode,
  onRetry,
  onExplore,
}) => {
  const isMastered = percentage >= 80;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-app-card border border-app-border rounded-2xl p-8 text-center"
    >
      <div
        className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-5 ${
          isMastered
            ? 'bg-green-500/10 text-green-400'
            : 'bg-indigo-500/10 text-indigo-400'
        }`}
      >
        {isMastered ? <CheckCircle size={32} /> : <Star size={32} />}
      </div>

      <div className="text-xs uppercase tracking-wider text-indigo-400 font-bold">
        {mode === 'mastery'
          ? 'Mastery Assessment Complete'
          : 'Practice Complete'}
      </div>

      <h3 className="text-2xl font-bold text-white mt-2">
        {isMastered ? 'Harakat Mastery Achieved!' : 'Good Practice!'}
      </h3>

      <p className="text-gray-500 text-sm mt-2">
        You completed {totalQuestions} questions.
      </p>

      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mt-6">
        <div className="bg-gray-900 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">{score}</div>
          <div className="text-xs text-gray-500 mt-1">Score</div>
        </div>

        <div className="bg-gray-900 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">{percentage}%</div>
          <div className="text-xs text-gray-500 mt-1">Accuracy</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-colors"
        >
          <RotateCcw size={17} />
          Try Again
        </button>

        <button
          type="button"
          onClick={onExplore}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-800 text-gray-300 font-bold hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={17} />
          Explore Harakat
        </button>
      </div>
    </motion.div>
  );
};

export default ArabicHarakatLab;