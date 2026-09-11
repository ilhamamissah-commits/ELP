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

interface ArabicLettersProps {
  onComplete?: (score: number) => void;
}

type LetterMode =
  | 'explore'
  | 'recognition'
  | 'harakat'
  | 'harakat-practice';

interface ArabicLetter {
  letter: string;
  name: string;
  transliteration: string;
  description: string;
}

interface Haraka {
  id: 'fatha' | 'kasra' | 'damma';
  symbol: string;
  name: string;
  sound: string;
  example: string;
  description: string;
}

interface RecognitionQuestion {
  correctIndex: number;
  options: number[];
}

const LETTERS: ArabicLetter[] = [
  {
    letter: 'ا',
    name: 'Alif',
    transliteration: 'ā / a',
    description: 'A tall Arabic letter often used with long vowel sounds.',
  },
  {
    letter: 'ب',
    name: 'Ba',
    transliteration: 'b',
    description: 'A letter with one dot below.',
  },
  {
    letter: 'ت',
    name: 'Ta',
    transliteration: 't',
    description: 'A letter with two dots above.',
  },
  {
    letter: 'ث',
    name: 'Tha',
    transliteration: 'th',
    description: 'A letter with three dots above.',
  },
  {
    letter: 'ج',
    name: 'Jim',
    transliteration: 'j',
    description: 'A letter with one dot below.',
  },
  {
    letter: 'ح',
    name: 'Haa',
    transliteration: 'ḥ',
    description: 'A deep, breathy Arabic consonant.',
  },
  {
    letter: 'خ',
    name: 'Kha',
    transliteration: 'kh',
    description: 'A letter with one dot above.',
  },
  {
    letter: 'د',
    name: 'Dal',
    transliteration: 'd',
    description: 'A curved Arabic consonant.',
  },
  {
    letter: 'ذ',
    name: 'Dhal',
    transliteration: 'dh',
    description: 'Dal with one dot above.',
  },
  {
    letter: 'ر',
    name: 'Ra',
    transliteration: 'r',
    description: 'An Arabic r sound.',
  },
  {
    letter: 'ز',
    name: 'Zay',
    transliteration: 'z',
    description: 'Ra with one dot above.',
  },
  {
    letter: 'س',
    name: 'Seen',
    transliteration: 's',
    description: 'A smooth s sound.',
  },
  {
    letter: 'ش',
    name: 'Sheen',
    transliteration: 'sh',
    description: 'Seen with three dots above.',
  },
  {
    letter: 'ص',
    name: 'Saad',
    transliteration: 'ṣ',
    description: 'A heavier Arabic s sound.',
  },
  {
    letter: 'ض',
    name: 'Daad',
    transliteration: 'ḍ',
    description: 'A distinctive emphatic Arabic consonant.',
  },
  {
    letter: 'ط',
    name: 'Taa',
    transliteration: 'ṭ',
    description: 'A heavier Arabic t sound.',
  },
  {
    letter: 'ظ',
    name: 'Zaa',
    transliteration: 'ẓ',
    description: 'An emphatic Arabic consonant.',
  },
  {
    letter: 'ع',
    name: 'Ayn',
    transliteration: 'ʿ',
    description: 'A distinctive Arabic throat consonant.',
  },
  {
    letter: 'غ',
    name: 'Ghayn',
    transliteration: 'gh',
    description: 'A voiced throat consonant.',
  },
  {
    letter: 'ف',
    name: 'Fa',
    transliteration: 'f',
    description: 'A letter with one dot above.',
  },
  {
    letter: 'ق',
    name: 'Qaf',
    transliteration: 'q',
    description: 'A deep consonant with two dots above.',
  },
  {
    letter: 'ك',
    name: 'Kaf',
    transliteration: 'k',
    description: 'An Arabic k sound.',
  },
  {
    letter: 'ل',
    name: 'Lam',
    transliteration: 'l',
    description: 'An Arabic l sound.',
  },
  {
    letter: 'م',
    name: 'Meem',
    transliteration: 'm',
    description: 'An Arabic m sound.',
  },
  {
    letter: 'ن',
    name: 'Noon',
    transliteration: 'n',
    description: 'A letter with one dot above.',
  },
  {
    letter: 'ه',
    name: 'Ha',
    transliteration: 'h',
    description: 'A light Arabic h sound.',
  },
  {
    letter: 'و',
    name: 'Waw',
    transliteration: 'w / ū',
    description:
      'A consonant that can also participate in long vowel patterns.',
  },
  {
    letter: 'ي',
    name: 'Ya',
    transliteration: 'y / ī',
    description:
      'A consonant that can also participate in long vowel patterns.',
  },
];

const HARAKAT: Haraka[] = [
  {
    id: 'fatha',
    symbol: 'َ',
    name: 'Fatha',
    sound: 'a',
    example: 'بَ',
    description:
      'A short vowel mark written above the letter. It gives a short "a" sound.',
  },
  {
    id: 'kasra',
    symbol: 'ِ',
    name: 'Kasra',
    sound: 'i',
    example: 'بِ',
    description:
      'A short vowel mark written below the letter. It gives a short "i" sound.',
  },
  {
    id: 'damma',
    symbol: 'ُ',
    name: 'Damma',
    sound: 'u',
    example: 'بُ',
    description:
      'A short vowel mark written above the letter. It gives a short "u" sound.',
  },
];

const createRecognitionQuestion = (): RecognitionQuestion => {
  const correctIndex = Math.floor(Math.random() * LETTERS.length);

  const candidates = new Set<number>([correctIndex]);

  while (candidates.size < 4) {
    candidates.add(Math.floor(Math.random() * LETTERS.length));
  }

  return {
    correctIndex,
    options: Array.from(candidates).sort(() => Math.random() - 0.5),
  };
};

const createRecognitionQuestions = (
  count = 10
): RecognitionQuestion[] =>
  Array.from({ length: count }, () => createRecognitionQuestion());

export const ArabicLetters: React.FC<ArabicLettersProps> = ({
  onComplete,
}) => {
  const [mode, setMode] = useState<LetterMode>('explore');

  const [activeIndex, setActiveIndex] = useState(0);
  const [learned, setLearned] = useState<number[]>([]);

  const [questions, setQuestions] = useState<RecognitionQuestion[]>(
    createRecognitionQuestions()
  );

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [recognitionScore, setRecognitionScore] = useState(0);

  const [harakatIndex, setHarakatIndex] = useState(0);

  const [harakatQuestionIndex, setHarakatQuestionIndex] = useState(0);

  const [selectedHarakaAnswer, setSelectedHarakaAnswer] = useState<
    string | null
  >(null);

  const [harakatAnswered, setHarakatAnswered] = useState(false);

  const [harakatScore, setHarakatScore] = useState(0);

  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const { speak } = useReadAloud();

  const currentLetter = LETTERS[activeIndex];

  const currentHaraka = HARAKAT[harakatIndex];

  const currentRecognitionQuestion = questions[questionIndex];

  /*
   * Harakat practice targets.
   * Each item is: { letterIndex, harakaIndex }
   */
  const [harakatTargets, setHarakatTargets] = useState<
    Array<{ letterIndex: number; harakaIndex: number }>
  >([]);

  const currentHarakatTarget = harakatTargets[harakatQuestionIndex];

  const targetHaraka = currentHarakatTarget
    ? HARAKAT[currentHarakatTarget.harakaIndex]
    : HARAKAT[0];

  const overallLearnedPercentage = Math.round(
    (learned.length / LETTERS.length) * 100
  );

  // Arabic voice gated on soundEnabled
  const speakArabicGated = (text: string) => {
    if (!soundEnabled) return;
    speakArabic(text);
  };

  // Auto-read for explore + harakat modes
  useEffect(() => {
    if (!autoReadEnabled) return;

    if (mode === 'explore') {
      const timer = window.setTimeout(() => {
        speakArabicGated(currentLetter.letter);
      }, 400);
      return () => window.clearTimeout(timer);
    }

    if (mode === 'harakat') {
      const readOut = `${currentHaraka.name}. Sound: ${currentHaraka.sound}. ${currentHaraka.description}`;
      const timer = window.setTimeout(() => speak(readOut), 400);
      return () => window.clearTimeout(timer);
    }
  }, [
    activeIndex,
    mode,
    currentLetter,
    currentHaraka,
    speak,
    autoReadEnabled,
    soundEnabled,
  ]);

  const resetAll = () => {
    setMode('explore');
    setActiveIndex(0);
    setLearned([]);
    setQuestions(createRecognitionQuestions());
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setRecognitionScore(0);
    setHarakatIndex(0);
    setHarakatTargets([]);
    setHarakatQuestionIndex(0);
    setSelectedHarakaAnswer(null);
    setHarakatAnswered(false);
    setHarakatScore(0);

    speak("Let's explore the Arabic letters again!");
  };

  const handleSelectLetter = (index: number) => {
    setActiveIndex(index);
    speakArabicGated(LETTERS[index].letter);

    setLearned((previous) =>
      previous.includes(index) ? previous : [...previous, index]
    );
  };

  const startRecognition = () => {
    setQuestions(createRecognitionQuestions());
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setRecognitionScore(0);
    setMode('recognition');

    speak('Letter recognition. Listen and choose the correct letter.');
  };

  const handleRecognitionAnswer = (index: number) => {
    if (answered || !currentRecognitionQuestion) {
      return;
    }

    const isCorrect = index === currentRecognitionQuestion.correctIndex;

    setSelectedAnswer(index);
    setAnswered(true);

    if (isCorrect) {
      if (soundEnabled) playSoundFeedback('correct');
      setRecognitionScore((previous) => previous + 10);
      speak('Well done!');
    } else {
      if (soundEnabled) playSoundFeedback('try-again');
      speak(
        `Not quite. The correct letter is ${LETTERS[currentRecognitionQuestion.correctIndex].name}.`,
      );
    }

    speakArabicGated(
      LETTERS[currentRecognitionQuestion.correctIndex].letter
    );
  };

  const handleNextRecognition = () => {
    if (!currentRecognitionQuestion) {
      return;
    }

    const isLast = questionIndex === questions.length - 1;

    if (isLast) {
      const finalScore =
        recognitionScore +
        (selectedAnswer === currentRecognitionQuestion.correctIndex ? 10 : 0);

      const percentage = Math.round(
        (finalScore / (questions.length * 10)) * 100
      );

      onComplete?.(finalScore);
      setMode('explore');

      speak(
        percentage >= 80
          ? `Masha'Allah! You scored ${percentage} percent.`
          : `Well done! You scored ${percentage} percent. Let's practise again.`,
      );
      return;
    }

    setQuestionIndex((previous) => previous + 1);
    setSelectedAnswer(null);
    setAnswered(false);
  };

  const startHarakatAssessment = () => {
    const targets = Array.from({ length: 9 }, () => ({
      letterIndex: Math.floor(Math.random() * LETTERS.length),
      harakaIndex: Math.floor(Math.random() * HARAKAT.length),
    }));

    setHarakatTargets(targets);
    setHarakatQuestionIndex(0);
    setSelectedHarakaAnswer(null);
    setHarakatAnswered(false);
    setHarakatScore(0);
    setMode('harakat-practice');

    speak('Harakat practice. Listen and choose the correct short vowel.');
  };

  const handleHarakatChoice = (harakaId: string) => {
    if (harakatAnswered || !currentHarakatTarget) {
      return;
    }

    const isCorrect = harakaId === targetHaraka.id;

    setSelectedHarakaAnswer(harakaId);
    setHarakatAnswered(true);

    if (isCorrect) {
      if (soundEnabled) playSoundFeedback('correct');
      setHarakatScore((previous) => previous + 10);
      speak('Excellent listening!');
    } else {
      if (soundEnabled) playSoundFeedback('try-again');
      speak(`Keep practising. The correct mark is ${targetHaraka.name}.`);
    }

    speakArabicGated(
      `${LETTERS[currentHarakatTarget.letterIndex].letter}${targetHaraka.symbol}`
    );
  };

  const handleNextHarakatQuestion = () => {
    if (!currentHarakatTarget) {
      return;
    }

    const isLast = harakatQuestionIndex === harakatTargets.length - 1;

    if (isLast) {
      const finalScore =
        harakatScore + (selectedHarakaAnswer === targetHaraka.id ? 10 : 0);

      const percentage = Math.round(
        (finalScore / (harakatTargets.length * 10)) * 100
      );

      onComplete?.(finalScore);
      setMode('harakat');

      speak(
        percentage >= 80
          ? `Masha'Allah! You scored ${percentage} percent.`
          : `Well done! You scored ${percentage} percent. Let's practise again.`,
      );
      return;
    }

    setHarakatQuestionIndex((previous) => previous + 1);
    setSelectedHarakaAnswer(null);
    setHarakatAnswered(false);
  };

  const currentModeTitle = useMemo(() => {
    switch (mode) {
      case 'explore':
        return 'Explore the 28 Letters';
      case 'recognition':
        return 'Letter Recognition';
      case 'harakat':
        return 'Discover the Short Vowels';
      case 'harakat-practice':
        return 'Harakat Recognition';
      default:
        return 'Arabic Foundations';
    }
  }, [mode]);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-app-card border border-app-border rounded-2xl p-5 mb-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-2xl">
              أ
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                Arabic Foundations
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
              onClick={resetAll}
              className="p-2.5 rounded-xl bg-gray-800 text-gray-400 hover:text-white transition-colors"
              aria-label="Reset Arabic Letters"
            >
              <RotateCcw size={17} />
            </button>
          </div>
        </div>

        {/* Mode Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-5">
          <ModeButton
            active={mode === 'explore'}
            onClick={() => setMode('explore')}
          >
            Explore
          </ModeButton>

          <ModeButton
            active={mode === 'recognition'}
            onClick={startRecognition}
          >
            Recognition
          </ModeButton>

          <ModeButton
            active={mode === 'harakat'}
            onClick={() => {
              setMode('harakat');
              speak(
                'Discover the short vowels. Harakat are marks that help us know how to pronounce a consonant.',
              );
            }}
          >
            Harakat
          </ModeButton>

          <ModeButton
            active={mode === 'harakat-practice'}
            onClick={startHarakatAssessment}
          >
            Practice
          </ModeButton>
        </div>
      </div>

      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* EXPLORE MODE */}
        {mode === 'explore' && (
          <>
            <div className="bg-gray-900/70 border border-app-border rounded-2xl p-6 md:p-8 text-center mb-5">
              <div className="text-xs uppercase tracking-[0.18em] text-emerald-400 font-bold mb-4">
                Explore • Hear • Recognise
              </div>

              <motion.div
                key={currentLetter.letter}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-9xl text-white leading-none mb-5"
                dir="rtl"
              >
                {currentLetter.letter}
              </motion.div>

              <h3 className="text-2xl font-bold text-emerald-400">
                {currentLetter.name}
              </h3>

              <div className="text-sm text-indigo-300 mt-1">
                {currentLetter.transliteration}
              </div>

              <p className="text-sm text-gray-400 max-w-md mx-auto mt-3">
                {currentLetter.description}
              </p>

              <button
                type="button"
                onClick={() => speakArabicGated(currentLetter.letter)}
                className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors"
              >
                <Volume2 size={19} />
                Hear Letter
              </button>
            </div>

            {/* Progress */}
            <div className="bg-app-card border border-app-border rounded-2xl p-5 mb-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">
                  Letters explored
                </span>

                <span className="text-sm text-emerald-400 font-bold">
                  {learned.length} / {LETTERS.length}
                </span>
              </div>

              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${overallLearnedPercentage}%` }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </div>

            {/* Letter Grid */}
            <div className="bg-app-card border border-app-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-bold">
                    The 28 Arabic Letters
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Tap a letter to explore it.
                  </p>
                </div>

                <div className="text-yellow-400 text-xs font-bold flex items-center gap-1">
                  <Star size={14} fill="currentColor" />
                  Foundation
                </div>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2" dir="rtl">
                {LETTERS.map((item, index) => {
                  const isActive = activeIndex === index;
                  const isLearned = learned.includes(index);

                  return (
                    <motion.button
                      key={item.letter}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSelectLetter(index)}
                      className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center transition-colors ${
                        isActive
                          ? 'bg-emerald-500/20 border-emerald-400'
                          : isLearned
                            ? 'bg-emerald-500/5 border-emerald-500/30'
                            : 'bg-gray-900 border-gray-800 hover:border-gray-600'
                      }`}
                    >
                      <span
                        className={`text-3xl ${
                          isLearned ? 'text-emerald-300' : 'text-white'
                        }`}
                      >
                        {item.letter}
                      </span>

                      <span className="text-[9px] text-gray-500 mt-1">
                        {item.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Recognition CTA */}
            <div className="mt-5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-indigo-500/15 text-indigo-300">
                  <Target size={21} />
                </div>

                <div className="flex-1">
                  <h3 className="text-white font-bold">
                    Ready to test recognition?
                  </h3>

                  <p className="text-sm text-gray-400 mt-1">
                    Identify Arabic letters from multiple choices and build
                    recognition confidence.
                  </p>

                  <button
                    type="button"
                    onClick={startRecognition}
                    className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-500 transition-colors"
                  >
                    Start Recognition
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* RECOGNITION MODE */}
        {mode === 'recognition' && currentRecognitionQuestion && (
          <RecognitionAssessment
            question={currentRecognitionQuestion}
            questionIndex={questionIndex}
            totalQuestions={questions.length}
            selectedAnswer={selectedAnswer}
            answered={answered}
            score={recognitionScore}
            onAnswer={handleRecognitionAnswer}
            onNext={handleNextRecognition}
            onSpeak={(index) => speakArabicGated(LETTERS[index].letter)}
          />
        )}

        {/* HARAKAT LEARNING */}
        {mode === 'harakat' && (
          <>
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-5 mb-5">
              <div className="flex items-start gap-3">
                <HelpCircle
                  size={21}
                  className="text-indigo-400 flex-shrink-0"
                />

                <div>
                  <h3 className="text-white font-bold">
                    Meet the three short vowels
                  </h3>

                  <p className="text-sm text-gray-400 mt-1">
                    Harakat are marks that help us know how to pronounce a
                    consonant.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/70 border border-app-border rounded-2xl p-7 text-center mb-5">
              <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold mb-4">
                Short Vowel {harakatIndex + 1} of {HARAKAT.length}
              </div>

              <motion.div
                key={currentHaraka.id}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-8xl text-white leading-none mb-4"
                dir="rtl"
              >
                {currentHaraka.example}
              </motion.div>

              <h3 className="text-2xl text-emerald-400 font-bold">
                {currentHaraka.name}
              </h3>

              <div className="text-gray-400 text-sm mt-1">
                Sound: &quot;{currentHaraka.sound}&quot;
              </div>

              <p className="text-gray-400 text-sm max-w-lg mx-auto mt-4">
                {currentHaraka.description}
              </p>

              <button
                type="button"
                onClick={() => speakArabicGated(currentHaraka.example)}
                className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors"
              >
                <Volume2 size={18} />
                Hear {currentHaraka.name}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              {HARAKAT.map((haraka, index) => (
                <button
                  key={haraka.id}
                  type="button"
                  onClick={() => {
                    setHarakatIndex(index);
                    speakArabicGated(haraka.example);
                  }}
                  className={`p-4 rounded-xl border-2 transition-colors ${
                    harakatIndex === index
                      ? 'bg-emerald-500/15 border-emerald-400'
                      : 'bg-app-card border-app-border hover:border-gray-600'
                  }`}
                >
                  <div className="text-4xl text-white" dir="rtl">
                    {haraka.example}
                  </div>

                  <div className="text-xs text-gray-400 mt-2">
                    {haraka.name}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between gap-3">
              <button
                type="button"
                disabled={harakatIndex === 0}
                onClick={() =>
                  setHarakatIndex((previous) => Math.max(0, previous - 1))
                }
                className="px-5 py-3 rounded-xl bg-gray-800 text-gray-300 font-bold disabled:opacity-40"
              >
                <ArrowLeft size={17} className="inline mr-2" />
                Previous
              </button>

              {harakatIndex < HARAKAT.length - 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    setHarakatIndex((previous) =>
                      Math.min(HARAKAT.length - 1, previous + 1)
                    )
                  }
                  className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-colors"
                >
                  Next
                  <ArrowRight size={17} className="inline ml-2" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startHarakatAssessment}
                  className="px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors"
                >
                  Practise Harakat
                  <ArrowRight size={17} className="inline ml-2" />
                </button>
              )}
            </div>
          </>
        )}

        {/* HARAKAT PRACTICE */}
        {mode === 'harakat-practice' && currentHarakatTarget && (
          <HarakatAssessment
            letter={LETTERS[currentHarakatTarget.letterIndex]}
            targetHaraka={targetHaraka}
            questionIndex={harakatQuestionIndex}
            totalQuestions={harakatTargets.length}
            selectedAnswer={selectedHarakaAnswer}
            answered={harakatAnswered}
            score={harakatScore}
            onAnswer={handleHarakatChoice}
            onNext={handleNextHarakatQuestion}
            onSpeak={() =>
              speakArabicGated(
                `${LETTERS[currentHarakatTarget.letterIndex].letter}${targetHaraka.symbol}`
              )
            }
          />
        )}
      </motion.div>

      {/* Learning Principle */}
      <div className="mt-6 bg-app-card border border-app-border rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <Volume2 size={20} className="text-indigo-400 flex-shrink-0" />

          <div>
            <div className="text-white font-semibold">
              Arabic literacy sequence
            </div>

            <div className="text-sm text-gray-500 mt-1">
              See → Hear → Say → Recognise → Read
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* RECOGNITION ASSESSMENT */

interface RecognitionAssessmentProps {
  question: RecognitionQuestion;
  questionIndex: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  answered: boolean;
  score: number;
  onAnswer: (index: number) => void;
  onNext: () => void;
  onSpeak: (index: number) => void;
}

const RecognitionAssessment: React.FC<RecognitionAssessmentProps> = ({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  answered,
  score,
  onAnswer,
  onNext,
  onSpeak,
}) => {
  const correctIndex = question.correctIndex;
  const isCorrect = selectedAnswer === correctIndex;

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-indigo-400 font-bold">
            Letter Recognition
          </div>

          <div className="text-sm text-gray-500 mt-1">
            Question {questionIndex + 1} of {totalQuestions}
          </div>
        </div>

        <div className="flex items-center gap-1 text-yellow-400 font-bold">
          <Star size={15} fill="currentColor" />
          {score}
        </div>
      </div>

      <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-5">
        <motion.div
          animate={{
            width: `${((questionIndex + 1) / totalQuestions) * 100}%`,
          }}
          className="h-full bg-indigo-500 rounded-full"
        />
      </div>

      <div className="bg-gray-900/70 border border-app-border rounded-2xl p-8 text-center mb-5">
        <div className="text-sm text-gray-500 mb-3">
          Which letter is this?
        </div>

        <motion.div
          key={questionIndex}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-9xl text-white mb-5"
          dir="rtl"
        >
          ؟
        </motion.div>

        <button
          type="button"
          onClick={() => onSpeak(correctIndex)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500"
        >
          <Volume2 size={18} />
          Hear Letter
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {question.options.map((index) => {
          const selected = selectedAnswer === index;
          const correct = index === correctIndex;

          let state = 'bg-app-card border-app-border hover:border-indigo-400';

          if (answered && correct) {
            state = 'bg-green-500/10 border-green-500/40';
          } else if (answered && selected && !correct) {
            state = 'bg-red-500/10 border-red-500/40';
          }

          return (
            <button
              key={index}
              type="button"
              disabled={answered}
              onClick={() => onAnswer(index)}
              className={`p-5 rounded-2xl border-2 transition-colors ${state}`}
            >
              <div className="text-5xl text-white" dir="rtl">
                {LETTERS[index].letter}
              </div>

              {answered && correct && (
                <CheckCircle size={17} className="mx-auto mt-2 text-green-400" />
              )}

              {answered && selected && !correct && (
                <XCircle size={17} className="mx-auto mt-2 text-red-400" />
              )}
            </button>
          );
        })}
      </div>

      {answered && (
        <div
          className={`mt-5 p-5 rounded-2xl border ${
            isCorrect
              ? 'bg-green-500/10 border-green-500/25'
              : 'bg-red-500/10 border-red-500/25'
          }`}
        >
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <CheckCircle
                size={20}
                className="text-green-400 flex-shrink-0"
              />
            ) : (
              <XCircle size={20} className="text-red-400 flex-shrink-0" />
            )}

            <div>
              <div className="text-white font-bold">
                {isCorrect
                  ? 'Well done!'
                  : `The correct letter is ${LETTERS[correctIndex].name}.`}
              </div>

              <div className="text-sm text-gray-400 mt-1">
                <span className="text-white text-xl" dir="rtl">
                  {LETTERS[correctIndex].letter}
                </span>{' '}
                — {LETTERS[correctIndex].name}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onNext}
            className="mt-4 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500"
          >
            Next
            <ArrowRight size={17} />
          </button>
        </div>
      )}
    </div>
  );
};

/* HARAKAT ASSESSMENT */

interface HarakatAssessmentProps {
  letter: ArabicLetter;
  targetHaraka: Haraka;
  questionIndex: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  answered: boolean;
  score: number;
  onAnswer: (id: string) => void;
  onNext: () => void;
  onSpeak: () => void;
}

const HarakatAssessment: React.FC<HarakatAssessmentProps> = ({
  letter,
  targetHaraka,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  answered,
  score,
  onAnswer,
  onNext,
  onSpeak,
}) => {
  const isCorrect = selectedAnswer === targetHaraka.id;

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-indigo-400 font-bold">
            Harakat Recognition
          </div>

          <div className="text-sm text-gray-500 mt-1">
            Question {questionIndex + 1} of {totalQuestions}
          </div>
        </div>

        <div className="flex items-center gap-1 text-yellow-400 font-bold">
          <Star size={15} fill="currentColor" />
          {score}
        </div>
      </div>

      <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-5">
        <motion.div
          animate={{
            width: `${((questionIndex + 1) / totalQuestions) * 100}%`,
          }}
          className="h-full bg-indigo-500 rounded-full"
        />
      </div>

      <div className="bg-gray-900/70 border border-app-border rounded-2xl p-8 text-center mb-5">
        <div className="text-sm text-gray-500 mb-3">
          Listen carefully. Which haraka do you hear?
        </div>

        <div className="text-8xl text-white mb-5" dir="rtl">
          {letter.letter}
        </div>

        <button
          type="button"
          onClick={onSpeak}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500"
        >
          <Volume2 size={18} />
          Hear Sound
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {HARAKAT.map((haraka) => {
          const selected = selectedAnswer === haraka.id;
          const correct = haraka.id === targetHaraka.id;

          let state = 'bg-app-card border-app-border hover:border-indigo-400';

          if (answered && correct) {
            state = 'bg-green-500/10 border-green-500/40';
          } else if (answered && selected && !correct) {
            state = 'bg-red-500/10 border-red-500/40';
          }

          return (
            <button
              key={haraka.id}
              type="button"
              disabled={answered}
              onClick={() => onAnswer(haraka.id)}
              className={`p-5 rounded-2xl border-2 transition-colors ${state}`}
            >
              <div className="text-5xl text-white" dir="rtl">
                {letter.letter}
                {haraka.symbol}
              </div>

              <div className="text-xs text-gray-400 mt-2">{haraka.name}</div>

              {answered && correct && (
                <CheckCircle size={17} className="mx-auto mt-2 text-green-400" />
              )}

              {answered && selected && !correct && (
                <XCircle size={17} className="mx-auto mt-2 text-red-400" />
              )}
            </button>
          );
        })}
      </div>

      {answered && (
        <div
          className={`mt-5 p-5 rounded-2xl border ${
            isCorrect
              ? 'bg-green-500/10 border-green-500/25'
              : 'bg-red-500/10 border-red-500/25'
          }`}
        >
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <CheckCircle
                size={20}
                className="text-green-400 flex-shrink-0"
              />
            ) : (
              <XCircle size={20} className="text-red-400 flex-shrink-0" />
            )}

            <div>
              <div className="text-white font-bold">
                {isCorrect
                  ? 'Excellent listening!'
                  : 'Keep practising the sound.'}
              </div>

              <div className="text-sm text-gray-400 mt-1">
                The correct mark is{' '}
                <strong className="text-white">{targetHaraka.name}</strong>.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onNext}
            className="mt-4 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500"
          >
            Next
            <ArrowRight size={17} />
          </button>
        </div>
      )}
    </div>
  );
};

/* SHARED UI */

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
        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
        : 'bg-gray-900 text-gray-500 border border-app-border hover:text-gray-300'
    }`}
  >
    {children}
  </button>
);

export default ArabicLetters;