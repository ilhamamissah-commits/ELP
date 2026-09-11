import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe2,
  MapPin,
  Volume2,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
} from 'lucide-react';
import { useProfileStore } from '../../../store/useProfileStore';
import { useProgressStore } from '../../../store/useProgressStore';
import { playSoundFeedback } from '../../../services/soundFeedback';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

type WonderCategory = 'natural' | 'human';

type Wonder = {
  id: number;
  name: string;
  emoji: string;
  location: string;
  continent: string;
  category: WonderCategory;
  description: string;
  significance: string;
  vocabulary: string[];
};

type Challenge = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

const WONDERS: Wonder[] = [
  {
    id: 1,
    name: 'Grand Canyon',
    emoji: '🏜️',
    location: 'Arizona, USA',
    continent: 'North America',
    category: 'natural',
    description:
      'A huge canyon carved by the Colorado River over a very long time.',
    significance:
      'It shows how rivers can slowly shape the land.',
    vocabulary: ['canyon', 'river', 'rock'],
  },
  {
    id: 2,
    name: 'Great Wall of China',
    emoji: '🏯',
    location: 'China',
    continent: 'Asia',
    category: 'human',
    description:
      'A vast series of walls and fortifications built across parts of China.',
    significance:
      'It is an important example of human engineering and history.',
    vocabulary: ['wall', 'China', 'engineering'],
  },
  {
    id: 3,
    name: 'Mount Everest',
    emoji: '⛰️',
    location: 'Nepal / China',
    continent: 'Asia',
    category: 'natural',
    description:
      'The highest mountain above sea level on Earth.',
    significance:
      'Its great height makes it an important part of world geography.',
    vocabulary: ['mountain', 'summit', 'height'],
  },
  {
    id: 4,
    name: 'Amazon Rainforest',
    emoji: '🌳',
    location: 'South America',
    continent: 'South America',
    category: 'natural',
    description:
      'A vast tropical rainforest containing an extraordinary variety of life.',
    significance:
      'It is an important ecosystem for plants, animals, people, and climate.',
    vocabulary: ['rainforest', 'habitat', 'biodiversity'],
  },
  {
    id: 5,
    name: 'Niagara Falls',
    emoji: '💦',
    location: 'Canada / USA',
    continent: 'North America',
    category: 'natural',
    description:
      'A group of powerful waterfalls on the border between Canada and the USA.',
    significance:
      'It demonstrates the power and movement of flowing water.',
    vocabulary: ['waterfall', 'river', 'water'],
  },
  {
    id: 6,
    name: 'Eiffel Tower',
    emoji: '🗼',
    location: 'Paris, France',
    continent: 'Europe',
    category: 'human',
    description:
      'A famous iron tower built in Paris for the 1889 Exposition.',
    significance:
      'It is a famous example of architecture and engineering.',
    vocabulary: ['tower', 'France', 'architecture'],
  },
  {
    id: 7,
    name: 'Pyramids of Giza',
    emoji: '🔺',
    location: 'Giza, Egypt',
    continent: 'Africa',
    category: 'human',
    description:
      'Ancient pyramid monuments built in Egypt thousands of years ago.',
    significance:
      'They provide evidence of the engineering, organisation, and culture of ancient Egypt.',
    vocabulary: ['pyramid', 'Egypt', 'ancient'],
  },
  {
    id: 8,
    name: 'Great Barrier Reef',
    emoji: '🐠',
    location: 'Queensland, Australia',
    continent: 'Oceania',
    category: 'natural',
    description:
      'A vast coral reef ecosystem along the northeastern coast of Australia.',
    significance:
      'It supports many marine species and is an important ocean ecosystem.',
    vocabulary: ['coral', 'reef', 'ocean'],
  },
  {
    id: 9,
    name: 'Victoria Falls',
    emoji: '🌊',
    location: 'Zambia / Zimbabwe',
    continent: 'Africa',
    category: 'natural',
    description:
      'A spectacular waterfall on the Zambezi River.',
    significance:
      'It is one of the most famous waterfalls in the world.',
    vocabulary: ['waterfall', 'river', 'Zambezi'],
  },
  {
    id: 10,
    name: 'Sahara Desert',
    emoji: '🏜️',
    location: 'North Africa',
    continent: 'Africa',
    category: 'natural',
    description:
      'A vast hot desert covering much of North Africa.',
    significance:
      'It is one of the defining physical environments of Africa.',
    vocabulary: ['desert', 'sand', 'dry'],
  },
  {
    id: 11,
    name: 'Serengeti',
    emoji: '🦁',
    location: 'Tanzania / Kenya',
    continent: 'Africa',
    category: 'natural',
    description:
      'A famous grassland ecosystem known for its wildlife and seasonal migrations.',
    significance:
      'It demonstrates the relationship between animals, habitats, and seasonal change.',
    vocabulary: ['savanna', 'wildlife', 'migration'],
  },
  {
    id: 12,
    name: 'Galápagos Islands',
    emoji: '🐢',
    location: 'Ecuador',
    continent: 'South America',
    category: 'natural',
    description:
      'A group of volcanic islands famous for their unique plants and animals.',
    significance:
      'The islands are an important place for studying biodiversity and adaptation.',
    vocabulary: ['island', 'species', 'adaptation'],
  },
  {
    id: 13,
    name: 'Petra',
    emoji: '🏛️',
    location: 'Jordan',
    continent: 'Asia',
    category: 'human',
    description:
      'An ancient city famous for buildings and monuments carved into rock.',
    significance:
      'It shows how people adapted architecture to the landscape.',
    vocabulary: ['city', 'rock', 'ancient'],
  },
  {
    id: 14,
    name: 'Taj Mahal',
    emoji: '🕌',
    location: 'Agra, India',
    continent: 'Asia',
    category: 'human',
    description:
      'A famous marble mausoleum built in the 17th century.',
    significance:
      'It is an important example of architecture, craftsmanship, and cultural history.',
    vocabulary: ['marble', 'India', 'architecture'],
  },
  {
    id: 15,
    name: 'Uluru',
    emoji: '🪨',
    location: 'Northern Territory, Australia',
    continent: 'Oceania',
    category: 'natural',
    description:
      'A large sandstone rock formation in central Australia.',
    significance:
      'Uluru is a significant natural and cultural place for Anangu Traditional Owners.',
    vocabulary: ['rock', 'Australia', 'culture'],
  },
  {
    id: 16,
    name: 'Antarctica',
    emoji: '🧊',
    location: 'Antarctica',
    continent: 'Antarctica',
    category: 'natural',
    description:
      'A continent surrounding the South Pole and covered by a vast ice sheet.',
    significance:
      'It is an important environment for studying ice, climate, oceans, and polar life.',
    vocabulary: ['ice', 'polar', 'continent'],
  },
];

const CHALLENGES: Challenge[] = [
  {
    question: 'Which continent is the Sahara Desert in?',
    options: ['Africa', 'Asia', 'Europe', 'Oceania'],
    answer: 'Africa',
    explanation: 'The Sahara stretches across much of North Africa.',
  },
  {
    question: 'Where can you find the Pyramids of Giza?',
    options: ['Egypt', 'Brazil', 'Japan', 'Australia'],
    answer: 'Egypt',
    explanation: 'The Pyramids of Giza are located near Cairo in Egypt.',
  },
  {
    question: 'Which wonder is a coral reef ecosystem?',
    options: [
      'Great Barrier Reef',
      'Grand Canyon',
      'Mount Everest',
      'Petra',
    ],
    answer: 'Great Barrier Reef',
    explanation: 'The Great Barrier Reef is a huge coral reef ecosystem.',
  },
  {
    question: 'Which is a human-made landmark?',
    options: [
      'Eiffel Tower',
      'Sahara Desert',
      'Victoria Falls',
      'Uluru',
    ],
    answer: 'Eiffel Tower',
    explanation:
      'The Eiffel Tower was designed and built by people.',
  },
  {
    question: 'Which wonder is in South America?',
    options: [
      'Amazon Rainforest',
      'Taj Mahal',
      'Great Wall of China',
      'Sahara Desert',
    ],
    answer: 'Amazon Rainforest',
    explanation:
      'The Amazon Rainforest is primarily located in South America.',
  },
  {
    question: 'Which wonder is the highest mountain above sea level?',
    options: [
      'Mount Everest',
      'Grand Canyon',
      'Uluru',
      'Victoria Falls',
    ],
    answer: 'Mount Everest',
    explanation:
      'Mount Everest is the highest mountain above sea level.',
  },
  {
    question: 'Which wonder is found in Australia?',
    options: [
      'Great Barrier Reef',
      'Petra',
      'Pyramids of Giza',
      'Grand Canyon',
    ],
    answer: 'Great Barrier Reef',
    explanation:
      'The Great Barrier Reef lies off the northeastern coast of Australia.',
  },
  {
    question: 'Which place is famous for animals and migration in East Africa?',
    options: [
      'Serengeti',
      'Eiffel Tower',
      'Petra',
      'Grand Canyon',
    ],
    answer: 'Serengeti',
    explanation:
      'The Serengeti is famous for its wildlife and seasonal migrations.',
  },
];

const getStage = (level: number) => {
  if (level <= 2) return 'foundation';
  if (level === 3) return 'developing';
  return 'advanced';
};

export const NaturalWonders: React.FC = () => {
  const profile = useProfileStore(
    (state) => state.profiles[state.currentProfileId]
  );

  const completeActivity = useProgressStore(
    (state) => state.completeActivity
  );

  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const { speak } = useReadAloud();

  const currentLevel = profile?.currentLevel ?? 1;
  const stage = getStage(currentLevel);

  const [selected, setSelected] = useState<number | null>(null);
  const [category, setCategory] =
    useState<'all' | WonderCategory>('all');

  const [continent, setContinent] = useState('All');

  const [mode, setMode] = useState<
    'explore' | 'challenge'
  >('explore');

  const [challengeIndex, setChallengeIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] =
    useState<string | null>(null);

  const [score, setScore] = useState(0);
  const [challengeComplete, setChallengeComplete] =
    useState(false);

  const filteredWonders = useMemo(() => {
    return WONDERS.filter((wonder) => {
      const matchesCategory =
        category === 'all' || wonder.category === category;

      const matchesContinent =
        continent === 'All' ||
        wonder.continent === continent;

      return matchesCategory && matchesContinent;
    });
  }, [category, continent]);

  const selectedWonder = WONDERS.find(
    (wonder) => wonder.id === selected
  );

  const currentChallenge = CHALLENGES[challengeIndex];

  /* =======================================================
     AUTO-READ PROMPT ON LOAD / MODE CHANGE
  ======================================================= */

  useEffect(() => {
    if (!autoReadEnabled) return;

    const timer = window.setTimeout(() => {
      if (mode === 'explore') {
        speak(
          stage === 'foundation'
            ? 'World Wonders Explorer. Choose a wonder to discover what makes it special.'
            : stage === 'developing'
              ? 'World Wonders Explorer. Explore remarkable natural environments and human-made landmarks. Choose a wonder to begin.'
              : 'World Wonders Explorer. Compare remarkable natural environments and human-made landmarks around our world.'
        );
      } else if (mode === 'challenge' && !challengeComplete) {
        speak(currentChallenge.question);
      }
    }, 400);

    return () => window.clearTimeout(timer);
  }, [
    mode,
    challengeIndex,
    challengeComplete,
    currentChallenge,
    autoReadEnabled,
    speak,
    stage,
  ]);

  /* =======================================================
     ANSWER FEEDBACK NARRATION
  ======================================================= */

  useEffect(() => {
    if (mode !== 'challenge') return;
    if (selectedAnswer === null) return;

    const correct =
      selectedAnswer === currentChallenge.answer;

    if (correct) {
      if (soundEnabled) playSoundFeedback('correct');
      speak(`Correct! ${currentChallenge.explanation}`);
    } else {
      if (soundEnabled) playSoundFeedback('try-again');
      speak(
        `Not quite. The correct answer is ${currentChallenge.answer}. ${currentChallenge.explanation}`
      );
    }
  }, [
    selectedAnswer,
    mode,
    currentChallenge,
    speak,
    soundEnabled,
  ]);

  /* =======================================================
     COMPLETION NARRATION
  ======================================================= */

  useEffect(() => {
    if (!challengeComplete) return;

    const percentage = Math.round(
      (score / CHALLENGES.length) * 100
    );

    if (percentage >= 80) {
      speak(
        `Brilliant work! You scored ${score} out of ${CHALLENGES.length}. Your world knowledge is excellent.`
      );
    } else if (percentage >= 60) {
      speak(
        `Well done! You scored ${score} out of ${CHALLENGES.length}. Keep exploring the world.`
      );
    } else {
      speak(
        `You scored ${score} out of ${CHALLENGES.length}. Let's explore some more wonders and try again.`
      );
    }
  }, [challengeComplete, score, speak]);

  /* =======================================================
     HANDLERS
  ======================================================= */

  const handleSelect = (wonder: Wonder) => {
    setSelected(wonder.id);

    if (soundEnabled) playSoundFeedback('move');

    speak(
      `${wonder.name}. ${wonder.description}`
    );
  };

  const speakWonder = (wonder: Wonder) => {
    speak(
      `${wonder.name}. Located in ${wonder.location}. ${wonder.description}`
    );
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);

    if (answer === currentChallenge.answer) {
      setScore((previous) => previous + 1);
    }
  };

  const nextQuestion = () => {
    if (challengeIndex === CHALLENGES.length - 1) {
      const finalScore =
        score +
        (selectedAnswer === currentChallenge.answer ? 1 : 0);

      const percentage = Math.round(
        (finalScore / CHALLENGES.length) * 100
      );

      completeActivity({
        id: 'geography-world-wonders',
        score: percentage,
        academyId: 'global',
        domain: 'general',
        skillIds: [
          'world-geography',
          'place-knowledge',
          'geographical-vocabulary',
          'natural-environment',
          'human-landmarks',
          'global-awareness',
        ],
      });

      setChallengeComplete(true);
      return;
    }

    setChallengeIndex((previous) => previous + 1);
    setSelectedAnswer(null);
  };

  const resetChallenge = () => {
    setChallengeIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setChallengeComplete(false);
  };

  const resetExplorer = () => {
    setSelected(null);
    setCategory('all');
    setContinent('All');
    resetChallenge();
    setMode('explore');
  };

  return (
    <div className="max-w-4xl mx-auto bg-app-card rounded-3xl border border-app-border shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-app-border bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-emerald-500/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Globe2 className="w-7 h-7 text-cyan-400" />

              <h3 className="text-2xl font-bold text-white">
                World Wonders Explorer
              </h3>
            </div>

            <p className="text-gray-400 text-sm mt-2 max-w-2xl">
              Discover remarkable natural environments and
              human-made landmarks around our world.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={toggleSound}
              aria-label="Toggle sound"
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <Volume2
                className={`w-4 h-4 ${soundEnabled ? 'text-amber-300' : 'text-gray-500'}`}
              />
            </button>

            <button
              type="button"
              onClick={resetExplorer}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
              aria-label="Reset explorer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 text-xs">
          <span className="text-gray-500">
            Global Geography • Level {currentLevel}
          </span>

          <span className="text-cyan-400 capitalize">
            {stage} explorer
          </span>
        </div>
      </div>

      {/* Mode navigation */}
      <div className="p-4 border-b border-app-border">
        <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => {
              setMode('explore');
              if (soundEnabled) playSoundFeedback('move');
            }}
            className={`py-3 rounded-xl font-semibold text-sm transition-all ${
              mode === 'explore'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                : 'bg-white/5 text-gray-400 border border-white/5'
            }`}
          >
            🌍 Explore
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('challenge');
              if (soundEnabled) playSoundFeedback('move');
            }}
            className={`py-3 rounded-xl font-semibold text-sm transition-all ${
              mode === 'challenge'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40'
                : 'bg-white/5 text-gray-400 border border-white/5'
            }`}
          >
            🧠 Challenge
          </button>
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* EXPLORE */}
          {mode === 'explore' && (
            <motion.div
              key="explore"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Category filters */}
              <div className="flex flex-wrap gap-2 mb-3">
                {[
                  ['all', 'All'],
                  ['natural', '🌿 Natural'],
                  ['human', '🏛️ Human-made'],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setCategory(
                        value as 'all' | WonderCategory
                      )
                    }
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                      category === value
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                        : 'bg-white/5 text-gray-400 border border-white/10'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Continent filter */}
              <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
                {[
                  'All',
                  'Africa',
                  'Asia',
                  'Europe',
                  'North America',
                  'South America',
                  'Oceania',
                  'Antarctica',
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setContinent(item)}
                    className={`whitespace-nowrap px-3 py-2 rounded-lg text-xs border transition-all ${
                      continent === item
                        ? 'bg-purple-500/15 text-purple-300 border-purple-400/30'
                        : 'bg-white/[0.03] text-gray-500 border-white/10'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* Wonder grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {filteredWonders.map((wonder) => {
                  const isSelected =
                    selected === wonder.id;

                  return (
                    <motion.button
                      key={wonder.id}
                      type="button"
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSelect(wonder)}
                      className={`text-left p-4 rounded-2xl border transition-all ${
                        isSelected
                          ? 'bg-purple-500/15 border-purple-400/50'
                          : 'bg-white/[0.03] border-white/10 hover:border-cyan-400/30'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-4xl">
                          {wonder.emoji}
                        </span>

                        <span
                          className={`text-[9px] uppercase tracking-wide px-2 py-1 rounded-full ${
                            wonder.category === 'natural'
                              ? 'bg-emerald-500/10 text-emerald-300'
                              : 'bg-purple-500/10 text-purple-300'
                          }`}
                        >
                          {wonder.category}
                        </span>
                      </div>

                      <p className="text-white font-bold mt-3 text-sm">
                        {wonder.name}
                      </p>

                      <p className="text-gray-500 text-xs mt-1">
                        {wonder.continent}
                      </p>
                    </motion.button>
                  );
                })}
              </div>

              {/* Detail panel */}
              <AnimatePresence>
                {selectedWonder && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-5 rounded-2xl bg-white/[0.03] border border-white/10"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 shrink-0 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-4xl">
                        {selectedWonder.emoji}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-xl font-bold text-white">
                            {selectedWonder.name}
                          </h4>

                          <span className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-gray-400">
                            {selectedWonder.category ===
                            'natural'
                              ? 'Natural'
                              : 'Human-made'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <MapPin className="w-3 h-3" />
                          {selectedWonder.location}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          speakWonder(selectedWonder)
                        }
                        className="p-2 rounded-lg bg-white/5 text-cyan-300 hover:bg-white/10"
                        aria-label={`Hear about ${selectedWonder.name}`}
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-sm text-gray-300 leading-relaxed mt-5">
                      {selectedWonder.description}
                    </p>

                    <div className="mt-4 p-3 rounded-xl bg-cyan-500/5 border border-cyan-400/10">
                      <p className="text-xs text-cyan-300 font-semibold">
                        Why it matters
                      </p>

                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        {selectedWonder.significance}
                      </p>
                    </div>

                    <div className="mt-4">
                      <p className="text-xs text-gray-500 mb-2">
                        Vocabulary
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {selectedWonder.vocabulary.map(
                          (word) => (
                            <button
                              key={word}
                              type="button"
                              onClick={() => speak(word)}
                              className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 hover:text-white"
                            >
                              {word}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {filteredWonders.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No wonders match these filters.
                </div>
              )}
            </motion.div>
          )}

          {/* CHALLENGE */}
          {mode === 'challenge' && !challengeComplete && (
            <motion.div
              key="challenge"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-purple-400 font-semibold">
                  World Geography Challenge
                </span>

                <span className="text-xs text-gray-500">
                  {challengeIndex + 1} / {CHALLENGES.length}
                </span>
              </div>

              <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-6">
                <motion.div
                  className="h-full bg-purple-400 rounded-full"
                  animate={{
                    width: `${
                      ((challengeIndex + 1) /
                        CHALLENGES.length) *
                      100
                    }%`,
                  }}
                />
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                <h4 className="text-xl font-bold text-white leading-relaxed">
                  {currentChallenge.question}
                </h4>

                <button
                  type="button"
                  onClick={() =>
                    speak(currentChallenge.question)
                  }
                  className="flex items-center gap-2 mt-3 text-xs text-cyan-300"
                >
                  <Volume2 className="w-4 h-4" />
                  Hear question
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                  {currentChallenge.options.map(
                    (option) => {
                      const correct =
                        selectedAnswer &&
                        option ===
                          currentChallenge.answer;

                      const incorrect =
                        selectedAnswer === option &&
                        option !==
                          currentChallenge.answer;

                      return (
                        <motion.button
                          key={option}
                          type="button"
                          whileHover={
                            !selectedAnswer
                              ? { y: -2 }
                              : {}
                          }
                          whileTap={
                            !selectedAnswer
                              ? { scale: 0.98 }
                              : {}
                          }
                          disabled={Boolean(selectedAnswer)}
                          onClick={() =>
                            handleAnswer(option)
                          }
                          className={`p-4 rounded-xl border text-left transition-all ${
                            correct
                              ? 'bg-emerald-500/15 border-emerald-400/50'
                              : incorrect
                              ? 'bg-red-500/15 border-red-400/50'
                              : 'bg-white/[0.03] border-white/10 hover:border-purple-400/30'
                          }`}
                        >
                          <div className="flex justify-between items-center gap-3">
                            <span className="text-white font-semibold">
                              {option}
                            </span>

                            {correct && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            )}

                            {incorrect && (
                              <XCircle className="w-5 h-5 text-red-400" />
                            )}
                          </div>
                        </motion.button>
                      );
                    }
                  )}
                </div>

                {selectedAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 p-4 rounded-xl bg-cyan-500/5 border border-cyan-400/10"
                  >
                    <p className="text-sm font-semibold text-white">
                      {selectedAnswer ===
                      currentChallenge.answer
                        ? 'Excellent geographical thinking! 🌍'
                        : `The correct answer is ${currentChallenge.answer}.`}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {currentChallenge.explanation}
                    </p>

                    <button
                      type="button"
                      onClick={nextQuestion}
                      className="w-full mt-4 py-3 rounded-xl bg-purple-500 text-white font-bold hover:bg-purple-400 transition-colors"
                    >
                      {challengeIndex ===
                      CHALLENGES.length - 1
                        ? 'Finish Challenge'
                        : 'Next Question'}
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* COMPLETION */}
          {mode === 'challenge' &&
            challengeComplete && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-emerald-400" />
                </div>

                <h4 className="text-2xl font-bold text-white mt-5">
                  World Explorer Complete
                </h4>

                <p className="text-gray-400 mt-2">
                  You scored {score} out of{' '}
                  {CHALLENGES.length}.
                </p>

                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    'Place Knowledge',
                    'Natural Environments',
                    'Human Landmarks',
                    'Global Awareness',
                  ].map((skill) => (
                    <div
                      key={skill}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/10"
                    >
                      <CheckCircle2 className="w-5 h-5 mx-auto text-emerald-400" />

                      <p className="text-[11px] text-gray-400 mt-2">
                        {skill}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={resetChallenge}
                  className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try Again
                </button>
              </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* Curriculum footer */}
      <div className="px-6 pb-6">
        <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800">
          <div className="flex items-start gap-3">
            <Globe2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />

            <div>
              <p className="text-sm font-semibold text-white">
                Global Perspectives
              </p>

              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Places around the world are connected through
                people, environments, cultures, resources, and
                ideas. Explore with curiosity and respect.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};