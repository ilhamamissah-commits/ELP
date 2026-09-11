import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  Mountain,
  Waves,
  Trees,
  Search,
  Trophy,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Compass,
  Sparkles,
} from 'lucide-react';

import { useProfileStore } from '../../../store/useProfileStore';
import { useProgressStore } from '../../../store/useProgressStore';
import { playSoundFeedback } from '../../../services/soundFeedback';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

/* =========================================================
   TYPES
========================================================= */

type FeatureCategory =
  | 'land'
  | 'water'
  | 'coastal'
  | 'extreme';

type GeographyFeature = {
  id: number;
  name: string;
  emoji: string;
  category: FeatureCategory;
  description: string;
  childDescription: string;
  example: string;
  locationHint: string;
};

/* =========================================================
   GEOGRAPHY DATA
========================================================= */

const GEOGRAPHY_FEATURES: GeographyFeature[] = [
  /* =========================
     LAND FEATURES
  ========================= */

  {
    id: 1,
    name: 'Mountain',
    emoji: '⛰️',
    category: 'land',
    description:
      'A large area of land that rises high above the surrounding land.',
    childDescription:
      'A very high part of the land that reaches up into the sky.',
    example:
      'Mount Kilimanjaro is a famous mountain in Africa.',
    locationHint:
      'Mountains can be found on many continents.',
  },

  {
    id: 2,
    name: 'Hill',
    emoji: '🌄',
    category: 'land',
    description:
      'A raised area of land that is usually lower and less steep than a mountain.',
    childDescription:
      'A raised part of the land that is smaller than a mountain.',
    example:
      'Hills can be found around many towns and countryside areas.',
    locationHint:
      'Hills occur in many parts of the world.',
  },

  {
    id: 3,
    name: 'Valley',
    emoji: '🏞️',
    category: 'land',
    description:
      'A low area of land between hills or mountains.',
    childDescription:
      'A low place between hills or mountains.',
    example:
      'Many rivers flow through valleys.',
    locationHint:
      'Valleys often form between mountains or hills.',
  },

  {
    id: 4,
    name: 'Plateau',
    emoji: '🪨',
    category: 'land',
    description:
      'A large area of high land with a relatively flat surface.',
    childDescription:
      'High land that has a broad, fairly flat top.',
    example:
      'The Ethiopian Highlands contain large areas of elevated land.',
    locationHint:
      'Plateaus can occur on different continents.',
  },

  {
    id: 5,
    name: 'Plain',
    emoji: '🌾',
    category: 'land',
    description:
      'A broad area of mostly flat or gently rolling land.',
    childDescription:
      'A wide area of land that is mostly flat.',
    example:
      'Plains are often important areas for farming.',
    locationHint:
      'Large plains occur in Africa, Asia, Europe and the Americas.',
  },

  {
    id: 6,
    name: 'Canyon',
    emoji: '🏜️',
    category: 'land',
    description:
      'A deep, narrow valley with steep sides, often formed by erosion.',
    childDescription:
      'A deep valley with very steep sides.',
    example:
      'The Grand Canyon is a famous canyon in the United States.',
    locationHint:
      'Canyons can form where rivers cut into rock.',
  },

  {
    id: 7,
    name: 'Volcano',
    emoji: '🌋',
    category: 'extreme',
    description:
      'An opening in Earth’s crust through which lava, ash or gases may escape.',
    childDescription:
      'A mountain or opening that can release hot lava and gases.',
    example:
      'Mount Etna is an active volcano in Italy.',
    locationHint:
      'Many volcanoes occur near tectonic plate boundaries.',
  },

  {
    id: 8,
    name: 'Cave',
    emoji: '🕳️',
    category: 'land',
    description:
      'A natural hollow or passage inside rock or underground.',
    childDescription:
      'A natural space or tunnel inside the ground or rock.',
    example:
      'Some caves contain fascinating rock formations.',
    locationHint:
      'Caves can form in many types of rocky environments.',
  },

  /* =========================
     WATER FEATURES
  ========================= */

  {
    id: 9,
    name: 'River',
    emoji: '🏞️',
    category: 'water',
    description:
      'A natural stream of flowing water that usually moves towards a lake, sea or ocean.',
    childDescription:
      'Water that flows from one place to another.',
    example:
      'The River Nile flows through several countries in Africa.',
    locationHint:
      'Rivers can be found on every continent except Antarctica.',
  },

  {
    id: 10,
    name: 'Lake',
    emoji: '💧',
    category: 'water',
    description:
      'A body of water surrounded by land.',
    childDescription:
      'A large area of water surrounded by land.',
    example:
      'Lake Victoria is one of Africa’s great lakes.',
    locationHint:
      'Lakes can be found in many different environments.',
  },

  {
    id: 11,
    name: 'Ocean',
    emoji: '🌊',
    category: 'water',
    description:
      'A vast body of salt water covering large areas of Earth.',
    childDescription:
      'A huge body of salty water.',
    example:
      'The Atlantic Ocean lies between Africa and the Americas.',
    locationHint:
      'Oceans surround and separate continents.',
  },

  {
    id: 12,
    name: 'Waterfall',
    emoji: '💦',
    category: 'water',
    description:
      'A place where flowing water drops steeply from a higher level to a lower level.',
    childDescription:
      'Water falling from a high place to a lower place.',
    example:
      'Victoria Falls is a famous waterfall in Africa.',
    locationHint:
      'Waterfalls often occur where rivers flow over steep changes in height.',
  },

  {
    id: 13,
    name: 'River Delta',
    emoji: '🔱',
    category: 'water',
    description:
      'An area where a river divides into smaller channels as it approaches its mouth.',
    childDescription:
      'A place where a river spreads into smaller waterways.',
    example:
      'The Nile Delta reaches the Mediterranean Sea.',
    locationHint:
      'Deltas commonly form where rivers meet seas or lakes.',
  },

  {
    id: 14,
    name: 'Wetland',
    emoji: '🪷',
    category: 'water',
    description:
      'An area of land that is covered or saturated with water for part or all of the year.',
    childDescription:
      'Land where water is present for much of the time.',
    example:
      'Wetlands provide important habitats for many plants and animals.',
    locationHint:
      'Wetlands occur in many climates around the world.',
  },

  /* =========================
     COASTAL FEATURES
  ========================= */

  {
    id: 15,
    name: 'Island',
    emoji: '🏝️',
    category: 'coastal',
    description:
      'A piece of land completely surrounded by water.',
    childDescription:
      'Land with water all around it.',
    example:
      'Ghana has islands in and around Lake Volta.',
    locationHint:
      'Islands occur in oceans, seas and lakes.',
  },

  {
    id: 16,
    name: 'Peninsula',
    emoji: '🗺️',
    category: 'coastal',
    description:
      'A piece of land almost surrounded by water and connected to a larger land area.',
    childDescription:
      'Land that has water around most of it.',
    example:
      'The Arabian Peninsula is one of the world’s largest peninsulas.',
    locationHint:
      'Peninsulas occur around many coastlines.',
  },

  {
    id: 17,
    name: 'Beach',
    emoji: '🏖️',
    category: 'coastal',
    description:
      'An area of sand, pebbles or other material along the edge of a sea, lake or river.',
    childDescription:
      'A sandy or pebbly place beside water.',
    example:
      'Ghana has many beaches along its coastline.',
    locationHint:
      'Beaches can occur beside oceans, seas, lakes and some rivers.',
  },

  {
    id: 18,
    name: 'Cliff',
    emoji: '🪨',
    category: 'coastal',
    description:
      'A very steep face of rock or earth, often found beside the sea or a valley.',
    childDescription:
      'A very steep wall of rock or land.',
    example:
      'Coastal cliffs can rise above the sea.',
    locationHint:
      'Cliffs can form along coasts, valleys and mountains.',
  },

  {
    id: 19,
    name: 'Bay',
    emoji: '🌊',
    category: 'coastal',
    description:
      'A broad part of the sea or other water that curves into the land.',
    childDescription:
      'Water that reaches into the land.',
    example:
      'A bay can provide a sheltered area along a coastline.',
    locationHint:
      'Bays occur along many coastlines.',
  },

  {
    id: 20,
    name: 'Coral Reef',
    emoji: '🪸',
    category: 'coastal',
    description:
      'A marine ecosystem built mainly by tiny coral animals and other organisms.',
    childDescription:
      'A colourful underwater home for many sea animals.',
    example:
      'The Great Barrier Reef is a famous coral reef system.',
    locationHint:
      'Many coral reefs occur in warm, shallow tropical waters.',
  },

  /* =========================
     EXTREME ENVIRONMENTS
  ========================= */

  {
    id: 21,
    name: 'Desert',
    emoji: '🏜️',
    category: 'extreme',
    description:
      'A very dry environment that receives little precipitation.',
    childDescription:
      'A very dry place where very little rain falls.',
    example:
      'The Sahara is the largest hot desert in the world.',
    locationHint:
      'Deserts occur on several continents.',
  },

  {
    id: 22,
    name: 'Glacier',
    emoji: '🧊',
    category: 'extreme',
    description:
      'A large, long-lasting mass of ice that moves slowly over land.',
    childDescription:
      'A huge mass of ice that slowly moves across land.',
    example:
      'Glaciers are found in polar regions and high mountains.',
    locationHint:
      'Large glaciers occur in Antarctica and Greenland.',
  },

  {
    id: 23,
    name: 'Iceberg',
    emoji: '🧊',
    category: 'extreme',
    description:
      'A large piece of ice that has broken away from a glacier or ice shelf and floats in water.',
    childDescription:
      'A large piece of floating ice.',
    example:
      'Icebergs can be found in cold ocean regions.',
    locationHint:
      'Icebergs are found in polar and nearby cold waters.',
  },

  {
    id: 24,
    name: 'Rainforest',
    emoji: '🌴',
    category: 'extreme',
    description:
      'A forest ecosystem that receives a large amount of rainfall.',
    childDescription:
      'A warm, wet forest filled with plants and animals.',
    example:
      'The Amazon Rainforest is the largest tropical rainforest.',
    locationHint:
      'Tropical rainforests occur mainly near the Equator.',
  },

  {
    id: 25,
    name: 'Savanna',
    emoji: '🌾',
    category: 'extreme',
    description:
      'A grassland ecosystem with scattered trees and a seasonal pattern of rainfall.',
    childDescription:
      'A wide grassy place with some trees.',
    example:
      'African savannas support elephants, lions and many other animals.',
    locationHint:
      'Savannas are common in tropical and subtropical regions.',
  },

  {
    id: 26,
    name: 'Tundra',
    emoji: '❄️',
    category: 'extreme',
    description:
      'A cold biome where trees are limited or absent and the growing season is short.',
    childDescription:
      'A very cold environment where few trees can grow.',
    example:
      'Arctic tundra is home to specially adapted plants and animals.',
    locationHint:
      'Tundra occurs in polar regions and on some high mountains.',
  },
];

/* =========================================================
   CATEGORY CONFIG
========================================================= */

const CATEGORY_CONFIG: Record<
  FeatureCategory,
  {
    label: string;
    icon: string;
  }
> = {
  land: {
    label: 'Land',
    icon: '⛰️',
  },
  water: {
    label: 'Water',
    icon: '🌊',
  },
  coastal: {
    label: 'Coasts',
    icon: '🏝️',
  },
  extreme: {
    label: 'Environments',
    icon: '🌍',
  },
};

/* =========================================================
   COMPONENT
========================================================= */

export const Landforms: React.FC = () => {
  const profile = useProfileStore(
    (state) =>
      state.profiles[
        state.currentProfileId
      ]
  );

  const completeActivity =
    useProgressStore(
      (state) => state.completeActivity
    );

  const soundEnabled = useSettingsStore(
    (s) => s.soundEnabled
  );
  const autoReadEnabled = useSettingsStore(
    (s) => s.autoReadEnabled
  );
  const toggleSound = useSettingsStore(
    (s) => s.toggleSound
  );

  const { speak } = useReadAloud();

  const learningLevel =
    profile?.currentLevel ?? 1;

  const learnerStage =
    learningLevel <= 2
      ? 'foundation'
      : learningLevel === 3
        ? 'developing'
        : 'advanced';

  const [selected, setSelected] =
    useState<number | null>(null);

  const [category, setCategory] =
    useState<
      FeatureCategory | 'all'
    >('all');

  const [search, setSearch] =
    useState('');

  const [discovered, setDiscovered] =
    useState<number[]>([]);

  const [challengeMode, setChallengeMode] =
    useState(false);

  const [challengeQuestions, setChallengeQuestions] =
    useState<GeographyFeature[]>([]);

  const [challengeIndex, setChallengeIndex] =
    useState(0);

  const [challengeScore, setChallengeScore] =
    useState(0);

  const [challengeOptions, setChallengeOptions] =
    useState<GeographyFeature[]>([]);

  const [selectedAnswer, setSelectedAnswer] =
    useState<number | null>(null);

  const [challengeComplete, setChallengeComplete] =
    useState(false);

  /* =======================================================
     FILTERING
  ======================================================= */

  const filteredFeatures =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return GEOGRAPHY_FEATURES.filter(
        (feature) => {
          const matchesCategory =
            category === 'all' ||
            feature.category ===
              category;

          const matchesSearch =
            query.length === 0 ||
            feature.name
              .toLowerCase()
              .includes(query) ||
            feature.description
              .toLowerCase()
              .includes(query);

          return (
            matchesCategory &&
            matchesSearch
          );
        }
      );
    }, [category, search]);

  /* =======================================================
     SELECT FEATURE
  ======================================================= */

  const handleClick = (
    id: number
  ) => {
    const feature =
      GEOGRAPHY_FEATURES.find(
        (item) => item.id === id
      );

    if (!feature) {
      return;
    }

    setSelected(id);

    setDiscovered((current) =>
      current.includes(id)
        ? current
        : [...current, id]
    );

    if (soundEnabled) playSoundFeedback('move');

    const speech =
      learnerStage === 'foundation'
        ? `${feature.name}. ${feature.childDescription}`
        : `${feature.name}. ${feature.description}`;

    speak(speech);
  };

  /* =======================================================
     AUTO-READ PROMPT ON LOAD (Explore mode)
  ======================================================= */

  useEffect(() => {
    if (!autoReadEnabled) return;
    if (challengeMode) return;

    const timer = window.setTimeout(() => {
      speak(
        learnerStage === 'foundation'
          ? 'Land and water explorer. Choose a feature to discover what it is and where we can find it.'
          : learnerStage === 'developing'
            ? 'Land and water explorer. Explore landforms, water features, coasts and environments. Choose a feature to begin.'
            : 'Land and water explorer. Compare physical features and explore how geography shapes environments and communities.'
      );
    }, 400);

    return () => window.clearTimeout(timer);
  }, [challengeMode, speak, autoReadEnabled, learnerStage]);

  /* =======================================================
     AUTO-READ CHALLENGE QUESTION ON CHANGE
  ======================================================= */

  useEffect(() => {
    if (!autoReadEnabled) return;
    if (!challengeMode) return;
    if (challengeComplete) return;
    if (!challengeQuestions[challengeIndex]) return;

    const timer = window.setTimeout(() => {
      speak('Which feature is this? Choose the correct answer.');
    }, 400);

    return () => window.clearTimeout(timer);
  }, [
    challengeIndex,
    challengeMode,
    challengeQuestions,
    challengeComplete,
    autoReadEnabled,
    speak,
  ]);

  /* =======================================================
     ANSWER FEEDBACK NARRATION
  ======================================================= */

  useEffect(() => {
    if (!challengeMode) return;
    if (selectedAnswer === null) return;
    if (!challengeQuestions[challengeIndex]) return;

    const question =
      challengeQuestions[challengeIndex];

    const correct =
      selectedAnswer === question.id;

    const chosen =
      challengeOptions.find(
        (o) => o.id === selectedAnswer
      );

    if (correct) {
      if (soundEnabled) playSoundFeedback('correct');
      speak(
        `Correct! A ${question.name.toLowerCase()} is ${
          learnerStage === 'foundation'
            ? question.childDescription
            : question.description
        }`
      );
    } else {
      if (soundEnabled) playSoundFeedback('try-again');
      speak(
        `Not quite. ${
          chosen ? `A ${chosen.name.toLowerCase()} is different. ` : ''
        }The correct answer is ${question.name}. ${
          learnerStage === 'foundation'
            ? question.childDescription
            : question.description
        }`
      );
    }
  }, [
    selectedAnswer,
    challengeMode,
    challengeQuestions,
    challengeIndex,
    challengeOptions,
    learnerStage,
    speak,
    soundEnabled,
  ]);

  /* =======================================================
     COMPLETION NARRATION
  ======================================================= */

  useEffect(() => {
    if (!challengeComplete) return;
    if (challengeQuestions.length === 0) return;

    const percentage = Math.round(
      (challengeScore /
        challengeQuestions.length) *
        100
    );

    if (percentage >= 80) {
      speak(
        `Brilliant work! You scored ${percentage} percent. Your geographical knowledge is excellent.`
      );
    } else if (percentage >= 60) {
      speak(
        `Well done! You scored ${percentage} percent. Keep exploring Earth.`
      );
    } else {
      speak(
        `You scored ${percentage} percent. Let's explore some more features and try again.`
      );
    }
  }, [
    challengeComplete,
    challengeQuestions.length,
    challengeScore,
    speak,
  ]);

  /* =======================================================
     CHALLENGE
  ======================================================= */

  const shuffle = <T,>(
    items: T[]
  ): T[] => {
    return [...items].sort(
      () => Math.random() - 0.5
    );
  };

  const startChallenge = () => {
    const selectedQuestions =
      shuffle(
        GEOGRAPHY_FEATURES
      ).slice(0, 8);

    setChallengeQuestions(
      selectedQuestions
    );

    setChallengeIndex(0);
    setChallengeScore(0);
    setSelectedAnswer(null);
    setChallengeComplete(false);

    const firstQuestion =
      selectedQuestions[0];

    if (firstQuestion) {
      const wrongAnswers =
        shuffle(
          GEOGRAPHY_FEATURES.filter(
            (item) =>
              item.id !==
              firstQuestion.id
          )
        ).slice(0, 3);

      setChallengeOptions(
        shuffle([
          firstQuestion,
          ...wrongAnswers,
        ])
      );
    }

    setChallengeMode(true);

    if (soundEnabled) playSoundFeedback('move');
  };

  const moveToNextQuestion = (
    wasCorrect: boolean
  ) => {
    const nextIndex =
      challengeIndex + 1;

    const updatedScore =
      challengeScore +
      (wasCorrect ? 1 : 0);

    if (
      nextIndex >=
      challengeQuestions.length
    ) {
      const percentage =
        Math.round(
          (updatedScore /
            challengeQuestions.length) *
            100
        );

      setChallengeScore(
        updatedScore
      );

      setChallengeComplete(
        true
      );

      completeActivity({
        id: 'geography-landforms-explorer',
        score: percentage,
        academyId: 'global',
        domain: 'general',
        skillIds: [
          'geography-landform-recognition',
          'geography-water-feature-recognition',
          'geography-environment-recognition',
          'spatial-awareness',
          'geographical-vocabulary',
        ],
      });

      return;
    }

    const nextQuestion =
      challengeQuestions[
        nextIndex
      ];

    const wrongAnswers =
      shuffle(
        GEOGRAPHY_FEATURES.filter(
          (item) =>
            item.id !==
            nextQuestion.id
        )
      ).slice(0, 3);

    setChallengeIndex(
      nextIndex
    );

    setChallengeScore(
      updatedScore
    );

    setChallengeOptions(
      shuffle([
        nextQuestion,
        ...wrongAnswers,
      ])
    );

    setSelectedAnswer(null);
  };

  const answerChallenge = (
    answer: GeographyFeature
  ) => {
    if (
      selectedAnswer !== null
    ) {
      return;
    }

    const question =
      challengeQuestions[
        challengeIndex
      ];

    if (!question) {
      return;
    }

    const correct =
      answer.id === question.id;

    setSelectedAnswer(
      answer.id
    );

    window.setTimeout(() => {
      moveToNextQuestion(
        correct
      );
    }, 2200);
  };

  /* =======================================================
     CHALLENGE COMPLETE
  ======================================================= */

  if (
    challengeMode &&
    challengeComplete
  ) {
    const percentage =
      Math.round(
        (challengeScore /
          challengeQuestions.length) *
          100
      );

    return (
      <div className="mx-auto max-w-3xl rounded-3xl border border-app-border bg-app-card p-6 text-center shadow-xl">
        <motion.div
          initial={{
            scale: 0,
          }}
          animate={{
            scale: 1,
          }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/10"
        >
          <Trophy
            size={42}
            className="text-cyan-400"
          />
        </motion.div>

        <h2 className="mt-6 text-3xl font-bold text-white">
          Explorer Challenge Complete!
        </h2>

        <p className="mt-3 text-gray-400">
          You scored
        </p>

        <div className="mt-2 text-6xl font-black text-cyan-400">
          {challengeScore}/
          {challengeQuestions.length}
        </div>

        <p className="mt-4 text-gray-300">
          {percentage >= 80
            ? 'Excellent geographical knowledge!'
            : percentage >= 60
              ? 'Great work! Keep exploring Earth.'
              : 'Keep learning and try again!'}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={startChallenge}
            className="rounded-xl bg-cyan-500 px-5 py-3 font-bold text-black transition hover:bg-cyan-400"
          >
            Try Again
          </button>

          <button
            type="button"
            onClick={() => {
              setChallengeMode(
                false
              );
              setChallengeComplete(
                false
              );
            }}
            className="rounded-xl border border-gray-700 px-5 py-3 font-semibold text-white hover:bg-white/5"
          >
            Explore Features
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     CHALLENGE SCREEN
  ======================================================= */

  if (
    challengeMode &&
    challengeQuestions.length >
      0
  ) {
    const question =
      challengeQuestions[
        challengeIndex
      ];

    return (
      <div className="mx-auto max-w-3xl rounded-3xl border border-app-border bg-app-card p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() =>
              setChallengeMode(
                false
              )
            }
            className="flex items-center gap-2 text-gray-400 hover:text-white"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">
              {challengeIndex + 1} /{' '}
              {challengeQuestions.length}
            </span>

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
          </div>
        </div>

        <div className="mb-8 h-2 overflow-hidden rounded-full bg-gray-800">
          <motion.div
            className="h-full bg-cyan-400"
            animate={{
              width: `${
                ((challengeIndex + 1) /
                  challengeQuestions.length) *
                100
              }%`,
            }}
          />
        </div>

        <div className="rounded-3xl bg-[#101820] p-8 text-center">
          <span className="text-7xl">
            {question.emoji}
          </span>

          <h2 className="mt-5 text-2xl font-bold text-white">
            Which feature is this?
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Choose the correct answer.
          </p>

          <button
            type="button"
            onClick={() =>
              speak(
                question.childDescription
              )
            }
            className="mx-auto mt-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-cyan-400 hover:bg-cyan-400/10"
          >
            <Volume2 size={17} />
            Listen
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {challengeOptions.map(
            (option) => {
              const isSelected =
                selectedAnswer ===
                option.id;

              const isCorrect =
                option.id ===
                question.id;

              let stateClass =
                'border-gray-700 bg-[#151515] hover:border-cyan-400';

              if (
                selectedAnswer !==
                  null &&
                isCorrect
              ) {
                stateClass =
                  'border-green-500 bg-green-500/10';
              }

              if (
                isSelected &&
                !isCorrect
              ) {
                stateClass =
                  'border-red-500 bg-red-500/10';
              }

              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={
                    selectedAnswer !==
                    null
                  }
                  onClick={() =>
                    answerChallenge(
                      option
                    )
                  }
                  className={`flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition ${stateClass}`}
                >
                  <span className="text-3xl">
                    {option.emoji}
                  </span>

                  <span className="flex-1 font-bold text-white">
                    {option.name}
                  </span>

                  {selectedAnswer !==
                    null &&
                    isCorrect && (
                      <CheckCircle2 className="text-green-400" />
                    )}

                  {isSelected &&
                    !isCorrect && (
                      <XCircle className="text-red-400" />
                    )}
                </button>
              );
            }
          )}
        </div>
      </div>
    );
  }

  /* =======================================================
     MAIN EXPLORER
  ======================================================= */

  return (
    <div className="mx-auto max-w-6xl rounded-3xl border border-app-border bg-app-card p-5 shadow-xl sm:p-6">
      {/* HEADER */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-cyan-500/10 p-3">
            <Mountain
              size={32}
              className="text-cyan-400"
            />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white sm:text-3xl">
              Land & Water Explorer
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              Discover the amazing physical
              features of our planet.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-black/20 px-3 py-1 text-xs text-gray-400">
                Level {learningLevel}
              </span>

              <span className="rounded-full bg-black/20 px-3 py-1 text-xs text-gray-400">
                {discovered.length}/
                {GEOGRAPHY_FEATURES.length}{' '}
                discovered
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={startChallenge}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 font-bold text-black transition hover:bg-cyan-400"
          >
            <Trophy size={17} />
            Challenge
          </button>

          <button
            type="button"
            onClick={() => {
              setSelected(null);
              setDiscovered([]);
              setCategory('all');
              setSearch('');
            }}
            className="rounded-xl border border-gray-700 p-2.5 text-gray-400 transition hover:text-white"
            aria-label="Reset explorer"
          >
            <RotateCcw size={18} />
          </button>

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
        </div>
      </div>

      {/* LEARNING OBJECTIVE */}

      <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
        <div className="flex gap-3">
          <Compass
            size={20}
            className="mt-0.5 shrink-0 text-cyan-400"
          />

          <div>
            <p className="font-semibold text-white">
              What are we learning?
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-400">
              {learnerStage ===
                'foundation' &&
                'We are learning the names of different places and features we can see on Earth.'}

              {learnerStage ===
                'developing' &&
                'We are learning how land, water and environments are different from one another.'}

              {learnerStage ===
                'advanced' &&
                'We are comparing physical features and exploring how geography shapes environments and communities.'}
            </p>
          </div>
        </div>
      </div>

      {/* SEARCH */}

      <div className="relative mt-6">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
        />

        <input
          type="search"
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          placeholder="Search mountains, rivers, islands..."
          className="w-full rounded-2xl border border-gray-700 bg-[#151515] py-4 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400"
        />
      </div>

      {/* CATEGORY FILTER */}

      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() =>
            setCategory('all')
          }
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${
            category === 'all'
              ? 'bg-cyan-500 text-black'
              : 'bg-[#151515] text-gray-400'
          }`}
        >
          🌍 All
        </button>

        {(
          Object.entries(
            CATEGORY_CONFIG
          ) as [
            FeatureCategory,
            {
              label: string;
              icon: string;
            }
          ][]
        ).map(
          ([
            key,
            config,
          ]) => (
            <button
              key={key}
              type="button"
              onClick={() =>
                setCategory(key)
              }
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${
                category === key
                  ? 'bg-cyan-500 text-black'
                  : 'bg-[#151515] text-gray-400'
              }`}
            >
              {config.icon}{' '}
              {config.label}
            </button>
          )
        )}
      </div>

      {/* MAIN AREA */}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* FEATURES */}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filteredFeatures.map(
              (feature) => {
                const isSelected =
                  selected ===
                  feature.id;

                const isDiscovered =
                  discovered.includes(
                    feature.id
                  );

                return (
                  <motion.button
                    key={feature.id}
                    layout
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.95,
                    }}
                    whileHover={{
                      y: -3,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    onClick={() =>
                      handleClick(
                        feature.id
                      )
                    }
                    className={`relative rounded-2xl border-2 p-4 text-left transition ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-500/10'
                        : 'border-gray-800 bg-[#151515] hover:border-gray-600'
                    }`}
                  >
                    {isDiscovered && (
                      <CheckCircle2
                        size={17}
                        className="absolute right-3 top-3 text-green-400"
                      />
                    )}

                    <span className="block text-4xl">
                      {feature.emoji}
                    </span>

                    <span className="mt-3 block font-bold text-white">
                      {feature.name}
                    </span>

                    <span className="mt-1 block text-xs capitalize text-gray-500">
                      {feature.category}
                    </span>
                  </motion.button>
                );
              }
            )}
          </AnimatePresence>

          {filteredFeatures.length ===
            0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-gray-700 p-10 text-center">
              <Search
                size={40}
                className="mx-auto text-gray-600"
              />

              <p className="mt-4 font-semibold text-white">
                No features found
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Try another search.
              </p>
            </div>
          )}
        </div>

        {/* DETAIL PANEL */}

        <AnimatePresence mode="wait">
          {selected ? (
            (() => {
              const feature =
                GEOGRAPHY_FEATURES.find(
                  (item) =>
                    item.id ===
                    selected
                );

              if (!feature) {
                return null;
              }

              return (
                <motion.div
                  key={feature.id}
                  initial={{
                    opacity: 0,
                    x: 15,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: 15,
                  }}
                  className="h-fit rounded-3xl border border-gray-700 bg-[#101820] p-6"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-6xl">
                      {feature.emoji}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        speak(
                          feature.description
                        )
                      }
                      className="rounded-xl border border-gray-700 p-3 text-gray-400 hover:text-white"
                      aria-label={`Listen to ${feature.name}`}
                    >
                      <Volume2
                        size={20}
                      />
                    </button>
                  </div>

                  <h4 className="mt-5 text-2xl font-bold text-white">
                    {feature.name}
                  </h4>

                  <p className="mt-1 text-sm capitalize text-cyan-400">
                    {feature.category}
                  </p>

                  <p className="mt-5 leading-7 text-gray-300">
                    {learnerStage ===
                    'foundation'
                      ? feature.childDescription
                      : feature.description}
                  </p>

                  {learnerStage !==
                    'foundation' && (
                    <div className="mt-5 rounded-2xl border border-gray-800 bg-black/20 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Example
                      </p>

                      <p className="mt-2 text-sm leading-6 text-gray-300">
                        {feature.example}
                      </p>
                    </div>
                  )}

                  {learnerStage ===
                    'advanced' && (
                    <div className="mt-3 rounded-2xl border border-gray-800 bg-black/20 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Where can we find it?
                      </p>

                      <p className="mt-2 text-sm leading-6 text-gray-300">
                        {feature.locationHint}
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      speak(
                        `${feature.name}. ${feature.description}`
                      )
                    }
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-bold text-black transition hover:bg-cyan-400"
                  >
                    <Volume2
                      size={18}
                    />
                    Listen & Learn
                  </button>
                </motion.div>
              );
            })()
          ) : (
            <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-dashed border-gray-700 bg-[#101820]/50 p-8 text-center">
              <div>
                <Sparkles
                  size={48}
                  className="mx-auto text-gray-700"
                />

                <h4 className="mt-5 font-bold text-gray-300">
                  Choose a feature
                </h4>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Tap a landform, water
                  feature or environment
                  to discover more.
                </p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER LEARNING PROMPT */}

      <div className="mt-6 rounded-2xl border border-gray-800 bg-[#101820] p-5">
        <div className="flex items-start gap-3">
          <Waves
            size={20}
            className="mt-0.5 shrink-0 text-cyan-400"
          />

          <div>
            <h4 className="font-semibold text-white">
              Think like a geographer
            </h4>

            <p className="mt-1 text-sm leading-6 text-gray-400">
              Can you find something made
              of land? Something made of
              water? Something found near
              the coast?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landforms;