import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Eye,
  Lightbulb,
  RotateCcw,
  Volume2,
  BookOpen,
  Pencil,
  MessageCircle,
} from 'lucide-react';

type SightWordStage =
  | 'observe'
  | 'listen'
  | 'recognize'
  | 'build'
  | 'use'
  | 'check'
  | 'master';

type SightWord = {
  word: string;
  meaning: string;
  sentence: string;
  hint: string;
  category: string;
};

const SIGHT_WORDS: SightWord[] = [
  {
    word: 'the',
    meaning: 'A word we use before a person, place, animal, or thing.',
    sentence: 'The cat is sleeping.',
    hint: 'This word starts with T.',
    category: 'Common word',
  },
  {
    word: 'and',
    meaning: 'A word that joins two ideas or things.',
    sentence: 'I like apples and bananas.',
    hint: 'This word starts with A.',
    category: 'Joining word',
  },
  {
    word: 'you',
    meaning: 'A word we use when talking to another person.',
    sentence: 'You are my friend.',
    hint: 'This word starts with Y.',
    category: 'People word',
  },
  {
    word: 'that',
    meaning: 'A word we use to point to or talk about something.',
    sentence: 'That is my book.',
    hint: 'This word starts with T and has four letters.',
    category: 'Common word',
  },
  {
    word: 'was',
    meaning: 'A word we use to talk about something in the past.',
    sentence: 'She was happy.',
    hint: 'This word has three letters.',
    category: 'Action word',
  },
  {
    word: 'for',
    meaning: 'A word that can show who or what something is meant for.',
    sentence: 'This gift is for you.',
    hint: 'This word starts with F.',
    category: 'Common word',
  },
  {
    word: 'are',
    meaning: 'A form of the verb “to be”.',
    sentence: 'We are ready.',
    hint: 'This word has three letters.',
    category: 'Action word',
  },
  {
    word: 'with',
    meaning: 'A word that can mean together or alongside.',
    sentence: 'I play with my friend.',
    hint: 'This word starts with W.',
    category: 'Common word',
  },
  {
    word: 'his',
    meaning: 'A word used to show that something belongs to a boy or man.',
    sentence: 'This is his hat.',
    hint: 'This word starts with H.',
    category: 'People word',
  },
  {
    word: 'they',
    meaning: 'A word used when talking about more than one person or thing.',
    sentence: 'They are playing.',
    hint: 'This word starts with T.',
    category: 'People word',
  },
  {
    word: 'have',
    meaning: 'A word that can show having or owning something.',
    sentence: 'I have a pencil.',
    hint: 'This word starts with H.',
    category: 'Action word',
  },
  {
    word: 'this',
    meaning: 'A word we use to point to something nearby.',
    sentence: 'This is my bag.',
    hint: 'This word starts with T and has four letters.',
    category: 'Pointing word',
  },
];

const STAGE_ORDER: SightWordStage[] = [
  'observe',
  'listen',
  'recognize',
  'build',
  'use',
  'check',
  'master',
];

const STAGE_LABELS: Record<SightWordStage, string> = {
  observe: 'Look',
  listen: 'Listen',
  recognize: 'Recognize',
  build: 'Build',
  use: 'Use',
  check: 'Check',
  master: 'Master',
};

export const SightWords: React.FC = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const [stage, setStage] = useState<SightWordStage>('observe');
  const [built, setBuilt] = useState<string[]>([]);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [useAnswer, setUseAnswer] = useState<string | null>(null);
  const [reflection, setReflection] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const wordData = SIGHT_WORDS[currentWord];
  const word = wordData.word;

  const progress = useMemo(() => {
    const stageIndex = STAGE_ORDER.indexOf(stage);
    return ((stageIndex + 1) / STAGE_ORDER.length) * 100;
  }, [stage]);

  const shuffleLetters = useCallback((letters: string[]) => {
    const shuffled = [...letters];

    // Fisher-Yates shuffle.
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }, []);

  const resetWord = useCallback(() => {
    setStage('observe');
    setBuilt([]);
    setAvailableLetters(shuffleLetters(word.split('')));
    setSelectedWord(null);
    setUseAnswer(null);
    setReflection('');
    setFeedback(null);
  }, [shuffleLetters, word]);

  useEffect(() => {
    resetWord();
  }, [currentWord, resetWord]);

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

  const goToStage = (nextStage: SightWordStage) => {
    setFeedback(null);
    setStage(nextStage);
  };

  const addLetter = (letter: string, index: number) => {
    setBuilt((previous) => [...previous, letter]);

    setAvailableLetters((previous) =>
      previous.filter((_, letterIndex) => letterIndex !== index)
    );

    setFeedback(null);
  };

  const removeLetter = (index: number) => {
    const letter = built[index];

    setBuilt((previous) =>
      previous.filter((_, letterIndex) => letterIndex !== index)
    );

    setAvailableLetters((previous) => [...previous, letter]);

    setFeedback(null);
  };

  const checkBuiltWord = () => {
    setAttempts((previous) => previous + 1);

    if (built.join('') === word) {
      setFeedback('Great! You built the word in the correct order.');
      goToStage('use');
      return;
    }

    setFeedback(
      'Almost! Look carefully at the letters and try building the word again.'
    );
  };

  const handleRecognition = (choice: string) => {
    setSelectedWord(choice);

    if (choice === word) {
      setFeedback('Yes! You recognized the sight word.');
      goToStage('build');
    } else {
      setFeedback('Look again. Compare the letters carefully.');
    }
  };

  const handleUseAnswer = (answer: string) => {
    setUseAnswer(answer);

    if (answer === 'correct') {
      setFeedback('Excellent! You found the sight word in a sentence.');
      goToStage('check');
    } else {
      setFeedback('Read the sentence again and look for the word you learned.');
    }
  };

  const nextWord = () => {
    setCurrentWord((previous) => (previous + 1) % SIGHT_WORDS.length);
    setAttempts(0);
  };

  const isLastWord = currentWord === SIGHT_WORDS.length - 1;

  const recognitionOptions = useMemo(() => {
    const distractors = SIGHT_WORDS
      .filter((item) => item.word !== word)
      .map((item) => item.word)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    return shuffleLetters([word, ...distractors]);
  }, [shuffleLetters, word, currentWord]);

  return (
    <div className="max-w-3xl mx-auto bg-app-card p-6 md:p-8 rounded-3xl border border-app-border shadow-xl">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
            <BookOpen className="w-7 h-7 text-cyan-400" />
          </div>
        </div>

        <h3 className="text-2xl md:text-3xl font-bold text-white">
          Sight Words
        </h3>

        <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
          Learn to recognize common words quickly, understand them in context,
          and use them in meaningful sentences.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>{STAGE_LABELS[stage]}</span>
          <span>
            Word {currentWord + 1} of {SIGHT_WORDS.length}
          </span>
        </div>

        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-cyan-500 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Stage indicator */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {STAGE_ORDER.map((item, index) => {
          const active = item === stage;
          const completed =
            STAGE_ORDER.indexOf(stage) > index;

          return (
            <div
              key={item}
              className={`px-3 py-1.5 rounded-full text-xs border ${
                active
                  ? 'bg-cyan-500/10 border-cyan-400/40 text-cyan-300'
                  : completed
                    ? 'bg-green-500/10 border-green-500/30 text-green-300'
                    : 'bg-gray-800/50 border-gray-700 text-gray-500'
              }`}
            >
              {completed ? '✓ ' : ''}
              {STAGE_LABELS[item]}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* OBSERVE */}
        {stage === 'observe' && (
          <motion.div
            key="observe"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <div className="flex justify-center mb-4">
              <Eye className="w-7 h-7 text-cyan-400" />
            </div>

            <p className="text-gray-400 text-sm mb-4">
              Look carefully at this word.
            </p>

            <div className="p-8 rounded-2xl bg-[#111827] border border-gray-800 mb-5">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-6xl md:text-7xl font-bold tracking-widest text-white"
              >
                {word}
              </motion.div>

              <p className="text-cyan-300 mt-4 font-medium">
                {wordData.category}
              </p>
            </div>

            <p className="text-gray-300 max-w-lg mx-auto">
              {wordData.meaning}
            </p>

            <button
              onClick={() => goToStage('listen')}
              className="mt-6 inline-flex items-center gap-2 px-5 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold"
            >
              I looked carefully
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* LISTEN */}
        {stage === 'listen' && (
          <motion.div
            key="listen"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <div className="flex justify-center mb-4">
              <Volume2 className="w-7 h-7 text-cyan-400" />
            </div>

            <h4 className="text-xl font-bold text-white mb-2">
              Listen to the word
            </h4>

            <p className="text-gray-400 text-sm mb-6">
              Listen, then say the word aloud.
            </p>

            <div className="p-8 rounded-2xl bg-[#111827] border border-gray-800">
              <div className="text-6xl font-bold text-white mb-6">
                {word}
              </div>

              <button
                onClick={() => speak(word)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold"
              >
                <Volume2 className="w-5 h-5" />
                Hear the word
              </button>

              <p className="text-gray-500 text-xs mt-5">
                Try saying it yourself after you hear it.
              </p>
            </div>

            <button
              onClick={() => goToStage('recognize')}
              className="mt-6 inline-flex items-center gap-2 px-5 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold"
            >
              I heard it
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* RECOGNIZE */}
        {stage === 'recognize' && (
          <motion.div
            key="recognize"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <Eye className="w-7 h-7 text-cyan-400 mx-auto mb-4" />

            <h4 className="text-xl font-bold text-white mb-2">
              Find the word
            </h4>

            <p className="text-gray-400 text-sm mb-6">
              Which word did you just learn?
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recognitionOptions.map((option) => (
                <motion.button
                  key={option}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleRecognition(option)}
                  className={`p-6 rounded-2xl border-2 text-3xl font-bold transition-all ${
                    selectedWord === option
                      ? option === word
                        ? 'bg-green-500/10 border-green-400 text-green-300'
                        : 'bg-red-500/10 border-red-400 text-red-300'
                      : 'bg-[#111827] border-gray-700 text-white hover:border-cyan-400'
                  }`}
                >
                  {option}
                </motion.button>
              ))}
            </div>

            {feedback && (
              <p className="mt-5 text-sm text-gray-300">{feedback}</p>
            )}
          </motion.div>
        )}

        {/* BUILD */}
        {stage === 'build' && (
          <motion.div
            key="build"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="text-center mb-6">
              <Pencil className="w-7 h-7 text-cyan-400 mx-auto mb-3" />

              <h4 className="text-xl font-bold text-white">
                Build the word
              </h4>

              <p className="text-gray-400 text-sm mt-2">
                Put the letters in the correct order.
              </p>
            </div>

            {/* Built word */}
            <div className="min-h-[76px] flex justify-center items-center gap-2 p-4 bg-[#111827] rounded-2xl border border-gray-800 mb-5">
              {built.length === 0 ? (
                <span className="text-gray-600 text-sm">
                  Tap letters below to build the word
                </span>
              ) : (
                built.map((letter, index) => (
                  <motion.button
                    key={`${letter}-${index}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => removeLetter(index)}
                    className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-xl text-white text-2xl font-bold"
                    aria-label={`Remove ${letter}`}
                  >
                    {letter}
                  </motion.button>
                ))
              )}
            </div>

            {/* Available letters */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {availableLetters.map((letter, index) => (
                <motion.button
                  key={`${letter}-${index}`}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => addLetter(letter, index)}
                  className="w-12 h-12 bg-cyan-700 hover:bg-cyan-600 rounded-xl text-white text-2xl font-bold"
                >
                  {letter}
                </motion.button>
              ))}
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setBuilt([]);
                  setAvailableLetters(shuffleLetters(word.split('')));
                  setFeedback(null);
                }}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl"
              >
                <RotateCcw className="w-4 h-4 inline mr-2" />
                Try again
              </button>

              <button
                onClick={checkBuiltWord}
                disabled={built.length !== word.length}
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-xl font-semibold"
              >
                Check
              </button>
            </div>

            {feedback && (
              <div className="mt-5 text-center text-sm text-gray-300">
                {feedback}
              </div>
            )}

            <div className="mt-5 flex items-start gap-2 p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
              <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
              <p className="text-xs text-gray-400">
                {wordData.hint}
              </p>
            </div>
          </motion.div>
        )}

        {/* USE */}
        {stage === 'use' && (
          <motion.div
            key="use"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="text-center mb-6">
              <MessageCircle className="w-7 h-7 text-cyan-400 mx-auto mb-3" />

              <h4 className="text-xl font-bold text-white">
                Find it in a sentence
              </h4>

              <p className="text-gray-400 text-sm mt-2">
                Look for the sight word in this sentence.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-[#111827] border border-gray-800 text-center mb-6">
              <button
                onClick={() => speak(wordData.sentence)}
                className="mb-5 inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-200 text-sm"
              >
                <Volume2 className="w-4 h-4" />
                Hear sentence
              </button>

              <p className="text-2xl md:text-3xl leading-relaxed text-white">
                {wordData.sentence}
              </p>
            </div>

            <p className="text-center text-gray-400 text-sm mb-4">
              Is <strong className="text-cyan-300">{word}</strong> in the
              sentence?
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => handleUseAnswer('correct')}
                className={`px-6 py-3 rounded-xl font-semibold ${
                  useAnswer === 'correct'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 hover:bg-gray-700 text-white'
                }`}
              >
                Yes
              </button>

              <button
                onClick={() => handleUseAnswer('incorrect')}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold"
              >
                No
              </button>
            </div>

            {feedback && (
              <p className="text-center mt-5 text-sm text-gray-300">
                {feedback}
              </p>
            )}
          </motion.div>
        )}

        {/* CHECK */}
        {stage === 'check' && (
          <motion.div
            key="check"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-4" />

            <h4 className="text-xl font-bold text-white mb-2">
              Show what you know
            </h4>

            <p className="text-gray-400 text-sm mb-6">
              Look at the word once more and say it aloud.
            </p>

            <div className="p-8 bg-[#111827] border border-gray-800 rounded-2xl">
              <div className="text-6xl font-bold tracking-widest text-cyan-300">
                {word}
              </div>

              <button
                onClick={() => speak(word)}
                className="mt-5 inline-flex items-center gap-2 px-5 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold"
              >
                <Volume2 className="w-5 h-5" />
                Hear it again
              </button>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => goToStage('master')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-semibold"
              >
                I know this word
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* MASTER */}
        {stage === 'master' && (
          <motion.div
            key="master"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-4" />

            <h4 className="text-2xl font-bold text-white">
              You learned this word!
            </h4>

            <div className="mt-6 p-6 rounded-2xl bg-green-500/5 border border-green-500/20">
              <div className="text-5xl font-bold text-cyan-300">
                {word}
              </div>

              <p className="text-gray-300 mt-4">
                {wordData.meaning}
              </p>

              <p className="text-gray-400 mt-3 italic">
                “{wordData.sentence}”
              </p>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-[#111827] border border-gray-800 text-left">
              <p className="text-sm font-semibold text-white mb-2">
                Learning progress
              </p>

              <ul className="text-sm text-gray-400 space-y-2">
                <li>✓ Recognized the word</li>
                <li>✓ Heard and said the word</li>
                <li>✓ Built the word with letters</li>
                <li>✓ Found the word in context</li>
              </ul>
            </div>

            <div className="mt-6">
              <label
                htmlFor="sight-word-reflection"
                className="block text-sm text-gray-400 mb-2"
              >
                What do you remember about this word?
              </label>

              <textarea
                id="sight-word-reflection"
                value={reflection}
                onChange={(event) => setReflection(event.target.value)}
                placeholder="Write or say something about the word..."
                className="w-full min-h-[90px] p-3 bg-[#111827] border border-gray-700 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            <button
              onClick={nextWord}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold"
            >
              {isLastWord ? 'Start Again' : 'Next Word'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attempts */}
      {attempts > 0 && stage !== 'master' && (
        <div className="mt-6 text-center text-xs text-gray-500">
          Attempts: {attempts}
        </div>
      )}

      {/* Learning model */}
      <div className="mt-8 pt-5 border-t border-gray-800">
        <p className="text-center text-xs text-gray-500">
          Learning sequence: Recognize → Listen → Understand → Build → Use → Master
        </p>
      </div>
    </div>
  );
};
