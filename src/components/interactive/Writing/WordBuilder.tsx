import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  Eye,
  Lightbulb,
  Pencil,
  RotateCcw,
  Volume2,
} from 'lucide-react';

type WordStage =
  | 'observe'
  | 'listen'
  | 'understand'
  | 'build'
  | 'check'
  | 'use'
  | 'master';

interface WordData {
  word: string;
  emoji: string;
  meaning: string;
  sentence: string;
  hint: string;
  sounds: string[];
}

const WORDS: WordData[] = [
  {
    word: 'cat',
    emoji: '🐱',
    meaning: 'A small animal that can be a pet.',
    sentence: 'The cat is sleeping.',
    hint: 'Listen: /c/ /a/ /t/',
    sounds: ['c', 'a', 't'],
  },
  {
    word: 'dog',
    emoji: '🐶',
    meaning: 'An animal that can be a friendly pet.',
    sentence: 'The dog can run.',
    hint: 'Listen: /d/ /o/ /g/',
    sounds: ['d', 'o', 'g'],
  },
  {
    word: 'sun',
    emoji: '☀️',
    meaning: 'The bright star that gives Earth light and warmth.',
    sentence: 'The sun is hot.',
    hint: 'Listen: /s/ /u/ /n/',
    sounds: ['s', 'u', 'n'],
  },
  {
    word: 'car',
    emoji: '🚗',
    meaning: 'A vehicle used to travel from one place to another.',
    sentence: 'The car is red.',
    hint: 'Listen: /c/ /a/ /r/',
    sounds: ['c', 'a', 'r'],
  },
  {
    word: 'pen',
    emoji: '🖊️',
    meaning: 'A tool used for writing.',
    sentence: 'I have a pen.',
    hint: 'Listen: /p/ /e/ /n/',
    sounds: ['p', 'e', 'n'],
  },
];

const STAGE_LABELS: Record<WordStage, string> = {
  observe: 'See',
  listen: 'Hear',
  understand: 'Understand',
  build: 'Build',
  check: 'Check',
  use: 'Use',
  master: 'Master',
};

const STAGE_ORDER: WordStage[] = [
  'observe',
  'listen',
  'understand',
  'build',
  'check',
  'use',
  'master',
];

const shuffle = (letters: string[]) => {
  const result = [...letters];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

export const WordBuilder: React.FC = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [stage, setStage] = useState<WordStage>('observe');
  const [built, setBuilt] = useState<string[]>([]);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [reflection, setReflection] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [usedInSentence, setUsedInSentence] = useState(false);

  const currentWord = WORDS[wordIndex];

  const stageIndex = STAGE_ORDER.indexOf(stage);

  const progress = useMemo(
    () => ((stageIndex + 1) / STAGE_ORDER.length) * 100,
    [stageIndex]
  );

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.75;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  }, []);

  const prepareWord = useCallback(() => {
    setBuilt([]);
    setAvailableLetters(shuffle(currentWord.word.split('')));
    setAttempts(0);
    setFeedback(null);
    setReflection('');
    setUsedInSentence(false);
  }, [currentWord]);

  useEffect(() => {
    prepareWord();
    setStage('observe');
  }, [prepareWord, wordIndex]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleAddLetter = (letter: string, index: number) => {
    if (stage !== 'build') return;

    setBuilt((previous) => [...previous, letter]);

    setAvailableLetters((previous) =>
      previous.filter((_, letterIndex) => letterIndex !== index)
    );

    setFeedback(null);
  };

  const handleRemoveLetter = (index: number) => {
    if (stage !== 'build') return;

    const letter = built[index];

    setBuilt((previous) =>
      previous.filter((_, letterIndex) => letterIndex !== index)
    );

    setAvailableLetters((previous) => [...previous, letter]);
    setFeedback(null);
  };

  const handleListen = () => {
    speak(currentWord.word);
  };

  const handleCheck = () => {
    const attemptNumber = attempts + 1;
    setAttempts(attemptNumber);

    if (built.length !== currentWord.word.length) {
      setFeedback(
        `You need ${currentWord.word.length} letters. Listen to the word again and keep building.`
      );
      return;
    }

    if (built.join('') === currentWord.word) {
      setFeedback('Excellent! You built the word correctly.');
      setStage('check');
      return;
    }

    setFeedback(
      `Almost! Say each sound slowly and check the order of the letters.`
    );
  };

  const handleUseWord = () => {
    setUsedInSentence(true);
    setStage('master');
  };

  const handleNextWord = () => {
    setWordIndex((previous) => (previous + 1) % WORDS.length);
    setStage('observe');
  };

  const handleReset = () => {
    prepareWord();
    setStage('observe');
  };

  const moveToBuild = () => {
    setFeedback(null);
    setStage('build');
  };

  const moveToListen = () => {
    setFeedback(null);
    setStage('listen');
    speak(currentWord.word);
  };

  const moveToUnderstand = () => {
    setFeedback(null);
    setStage('understand');
  };

  const handleImprove = () => {
    setFeedback(null);
    setBuilt([]);
    setAvailableLetters(shuffle(currentWord.word.split('')));
    setStage('build');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-app-card rounded-3xl border border-app-border shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-app-border">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold mb-1">
                <Pencil className="w-4 h-4" />
                Writing & Literacy
              </div>

              <h2 className="text-2xl font-bold text-white">
                Word Builder
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                Build words by listening to sounds and putting letters in order.
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="p-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 transition"
              aria-label="Reset activity"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {/* Progress */}
          <div className="mt-5">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>
                Step {stageIndex + 1} of {STAGE_ORDER.length}
              </span>
              <span>{STAGE_LABELS[stage]}</span>
            </div>

            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-indigo-500 rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Learning progression */}
          <div className="flex flex-wrap gap-2 mt-4">
            {STAGE_ORDER.map((stageName, index) => (
              <div
                key={stageName}
                className={`px-2.5 py-1 rounded-full text-xs border ${
                  index <= stageIndex
                    ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
                    : 'bg-gray-900 border-gray-800 text-gray-600'
                }`}
              >
                {index + 1}. {STAGE_LABELS[stageName]}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* OBSERVE */}
            {stage === 'observe' && (
              <motion.div
                key="observe"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                <Eye className="w-8 h-8 text-indigo-400 mx-auto mb-3" />

                <p className="text-gray-400 text-sm mb-4">
                  Look carefully at the word.
                </p>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                  <div className="text-7xl mb-4">{currentWord.emoji}</div>

                  <div className="text-5xl font-black tracking-widest text-white">
                    {currentWord.word}
                  </div>
                </div>

                <p className="text-gray-400 mt-5">
                  This word is <span className="text-white font-semibold">{currentWord.word}</span>.
                </p>

                <button
                  type="button"
                  onClick={moveToListen}
                  className="mt-6 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold inline-flex items-center gap-2 transition"
                >
                  Hear the Word
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* LISTEN */}
            {stage === 'listen' && (
              <motion.div
                key="listen"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <Volume2 className="w-10 h-10 text-indigo-400 mx-auto mb-4" />

                <h3 className="text-xl font-bold text-white">
                  Listen carefully
                </h3>

                <p className="text-gray-400 text-sm mt-2">
                  Hear the whole word, then listen for its individual sounds.
                </p>

                <button
                  type="button"
                  onClick={handleListen}
                  className="mt-6 w-20 h-20 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center mx-auto transition"
                  aria-label="Hear word"
                >
                  <Volume2 className="w-8 h-8" />
                </button>

                <div className="mt-6 p-4 bg-gray-900 border border-gray-800 rounded-xl">
                  <p className="text-indigo-300 font-semibold">
                    {currentWord.hint}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={moveToUnderstand}
                  className="mt-6 px-5 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold inline-flex items-center gap-2 transition"
                >
                  I Heard It
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* UNDERSTAND */}
            {stage === 'understand' && (
              <motion.div
                key="understand"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <BookOpen className="w-9 h-9 text-indigo-400 mx-auto mb-4" />

                <h3 className="text-xl font-bold text-white text-center">
                  What does this word mean?
                </h3>

                <div className="mt-6 p-6 bg-gray-900 border border-gray-800 rounded-2xl text-center">
                  <div className="text-5xl mb-3">{currentWord.emoji}</div>

                  <div className="text-3xl font-bold text-white">
                    {currentWord.word}
                  </div>

                  <p className="text-gray-400 mt-3">
                    {currentWord.meaning}
                  </p>
                </div>

                <div className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <Lightbulb className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-300">
                    Knowing what a word means helps you use it when you speak
                    and write.
                  </p>
                </div>

                <div className="text-center mt-6">
                  <button
                    type="button"
                    onClick={moveToBuild}
                    className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold inline-flex items-center gap-2 transition"
                  >
                    Build the Word
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* BUILD */}
            {stage === 'build' && (
              <motion.div
                key="build"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-center mb-6">
                  <Pencil className="w-8 h-8 text-indigo-400 mx-auto mb-3" />

                  <h3 className="text-xl font-bold text-white">
                    Build the word
                  </h3>

                  <p className="text-gray-400 text-sm mt-1">
                    Put the letters in the correct order.
                  </p>
                </div>

                {/* Target */}
                <div className="flex justify-center items-center gap-3 mb-6">
                  <span className="text-4xl">{currentWord.emoji}</span>
                  <span className="text-gray-500 text-sm">
                    What word belongs here?
                  </span>
                </div>

                {/* Built word */}
                <div className="flex justify-center gap-2 min-h-[72px] p-4 bg-gray-950 rounded-2xl border border-gray-800 mb-6">
                  {built.length > 0 ? (
                    built.map((letter, index) => (
                      <motion.button
                        key={`${letter}-${index}`}
                        type="button"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={() => handleRemoveLetter(index)}
                        className="w-14 h-14 bg-gray-700 hover:bg-gray-600 rounded-xl text-white text-2xl font-bold transition"
                        aria-label={`Remove letter ${letter}`}
                      >
                        {letter}
                      </motion.button>
                    ))
                  ) : (
                    <span className="text-gray-600 italic self-center">
                      Tap letters below...
                    </span>
                  )}
                </div>

                {/* Available letters */}
                <div className="flex justify-center flex-wrap gap-3">
                  {availableLetters.map((letter, index) => (
                    <motion.button
                      key={`${letter}-${index}`}
                      type="button"
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => handleAddLetter(letter, index)}
                      className="w-14 h-14 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white text-2xl font-bold shadow-lg transition"
                    >
                      {letter}
                    </motion.button>
                  ))}
                </div>

                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-sm text-center"
                  >
                    {feedback}
                  </motion.div>
                )}

                <div className="flex justify-center mt-6">
                  <button
                    type="button"
                    onClick={handleCheck}
                    disabled={built.length === 0}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-xl font-semibold transition"
                  >
                    Check Word
                  </button>
                </div>
              </motion.div>
            )}

            {/* CHECK */}
            {stage === 'check' && (
              <motion.div
                key="check"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <CheckCircle className="w-14 h-14 text-green-400 mx-auto mb-4" />

                <h3 className="text-2xl font-bold text-white">
                  You built it!
                </h3>

                <div className="mt-6 p-6 bg-gray-900 border border-gray-800 rounded-2xl">
                  <div className="text-5xl mb-3">{currentWord.emoji}</div>

                  <div className="text-4xl font-black tracking-widest text-green-400">
                    {currentWord.word}
                  </div>

                  <p className="text-gray-400 mt-4">
                    You put all the sounds and letters in the correct order.
                  </p>
                </div>

                <div className="mt-5 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <p className="text-green-300 text-sm">
                    Attempt{attempts === 1 ? '' : 's'}: {attempts}
                  </p>
                </div>

                <div className="flex justify-center mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setStage('use');
                      setFeedback(null);
                    }}
                    className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold inline-flex items-center gap-2"
                  >
                    Use the Word
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* USE */}
            {stage === 'use' && (
              <motion.div
                key="use"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <BookOpen className="w-9 h-9 text-indigo-400 mx-auto mb-4" />

                <h3 className="text-xl font-bold text-white">
                  See the word in a sentence
                </h3>

                <p className="text-gray-400 text-sm mt-2">
                  Words become more meaningful when we use them.
                </p>

                <div className="mt-6 p-6 bg-gray-900 border border-gray-800 rounded-2xl">
                  <p className="text-lg text-gray-300 leading-relaxed">
                    {currentWord.sentence}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => speak(currentWord.sentence)}
                  className="mt-5 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg inline-flex items-center gap-2"
                >
                  <Volume2 className="w-4 h-4" />
                  Hear the sentence
                </button>

                <div className="mt-6 text-left">
                  <label
                    htmlFor="word-reflection"
                    className="block text-sm font-semibold text-gray-300 mb-2"
                  >
                    Can you make your own sentence?
                  </label>

                  <textarea
                    id="word-reflection"
                    value={reflection}
                    onChange={(event) => setReflection(event.target.value)}
                    placeholder={`Write a sentence using "${currentWord.word}"...`}
                    className="w-full min-h-[110px] rounded-xl bg-gray-950 border border-gray-800 text-white placeholder:text-gray-600 p-4 outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleUseWord}
                  className="mt-5 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold inline-flex items-center gap-2"
                >
                  Finish Word
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* MASTER */}
            {stage === 'master' && (
              <motion.div
                key="master"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <CheckCircle className="w-14 h-14 text-green-400 mx-auto mb-4" />

                <h3 className="text-2xl font-bold text-white">
                  Word mastered
                </h3>

                <p className="text-gray-400 mt-2">
                  You practiced seeing, hearing, building, and using this word.
                </p>

                <div className="mt-6 p-6 bg-gray-900 border border-gray-800 rounded-2xl">
                  <div className="text-5xl mb-3">{currentWord.emoji}</div>

                  <div className="text-4xl font-black text-white tracking-widest">
                    {currentWord.word}
                  </div>

                  {reflection.trim() && (
                    <div className="mt-5 pt-5 border-t border-gray-800">
                      <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                        Your sentence
                      </p>

                      <p className="text-gray-300 italic">
                        “{reflection.trim()}”
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
                  <div className="p-3 bg-gray-900 rounded-xl border border-gray-800">
                    <p className="text-xs text-gray-500">Recognize</p>
                    <p className="text-sm text-white font-semibold mt-1">
                      ✓
                    </p>
                  </div>

                  <div className="p-3 bg-gray-900 rounded-xl border border-gray-800">
                    <p className="text-xs text-gray-500">Sounds</p>
                    <p className="text-sm text-white font-semibold mt-1">
                      ✓
                    </p>
                  </div>

                  <div className="p-3 bg-gray-900 rounded-xl border border-gray-800">
                    <p className="text-xs text-gray-500">Spelling</p>
                    <p className="text-sm text-white font-semibold mt-1">
                      ✓
                    </p>
                  </div>

                  <div className="p-3 bg-gray-900 rounded-xl border border-gray-800">
                    <p className="text-xs text-gray-500">Vocabulary</p>
                    <p className="text-sm text-white font-semibold mt-1">
                      ✓
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleImprove}
                    className="px-5 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold inline-flex items-center justify-center gap-2"
                  >
                    <Pencil className="w-4 h-4" />
                    Practice Again
                  </button>

                  <button
                    type="button"
                    onClick={handleNextWord}
                    className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold inline-flex items-center justify-center gap-2"
                  >
                    Next Word
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {usedInSentence && (
                  <p className="mt-5 text-xs text-gray-500">
                    You also practiced using the word in context.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Learning model */}
      <div className="mt-5 p-4 rounded-2xl bg-app-card border border-app-border">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />

          <div>
            <p className="text-sm font-semibold text-white">
              Learning progression
            </p>

            <p className="text-xs text-gray-500 mt-1">
              See → Hear → Understand → Build → Check → Use → Master
            </p>

            <p className="text-xs text-gray-600 mt-2">
              This activity develops phonemic awareness, letter-sound
              connection, decoding, spelling, vocabulary, and early sentence
              construction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
