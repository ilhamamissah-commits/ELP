import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe2,
  Search,
  Volume2,
  RotateCcw,
  Trophy,
  Map,
  Landmark,
  Coins,
  Mountain,
  CloudSun,
  ArrowLeft,
  CheckCircle2,
  XCircle,
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

type Continent =
  | 'Africa'
  | 'Asia'
  | 'Europe'
  | 'North America'
  | 'South America'
  | 'Oceania'
  | 'Antarctica';

type Country = {
  id: number;
  continent: Continent;
  flag: string;
  name: string;
  capital?: string;
  currency?: string;
  landmark?: string;
  funFact: string;
  environment: string;
  region?: string;
  ocean?: string;
  languages?: string[];
  isContinentOnly?: boolean;
};

type ExplorerMode =
  | 'explore'
  | 'challenge';

type ChallengeQuestion = {
  country: Country;
  options: Country[];
};

/* =========================================================
   DATA
========================================================= */

const CONTINENTS: Continent[] = [
  'Africa',
  'Asia',
  'Europe',
  'North America',
  'South America',
  'Oceania',
  'Antarctica',
];

const COUNTRY_DATABASE: Country[] = [
  /* =========================
     AFRICA
  ========================= */

  {
    id: 1,
    continent: 'Africa',
    region: 'West Africa',
    flag: '🇬🇭',
    name: 'Ghana',
    capital: 'Accra',
    currency: 'Ghanaian Cedi',
    landmark: 'Cape Coast Castle',
    funFact:
      'Ghana is known for its rich history, colourful culture and cocoa production.',
    environment:
      'Ghana has coastal areas, forests, savannahs and grasslands.',
    ocean: 'Atlantic Ocean',
    languages: ['English', 'Twi', 'Ewe', 'Ga'],
  },

  {
    id: 2,
    continent: 'Africa',
    region: 'West Africa',
    flag: '🇳🇬',
    name: 'Nigeria',
    capital: 'Abuja',
    currency: 'Nigerian Naira',
    landmark: 'Zuma Rock',
    funFact:
      'Nigeria is the most populous country in Africa.',
    environment:
      'Nigeria includes rainforest, savannah and coastal environments.',
    ocean: 'Atlantic Ocean',
    languages: ['English', 'Hausa', 'Yoruba', 'Igbo'],
  },

  {
    id: 3,
    continent: 'Africa',
    region: 'East Africa',
    flag: '🇰🇪',
    name: 'Kenya',
    capital: 'Nairobi',
    currency: 'Kenyan Shilling',
    landmark: 'Mount Kenya',
    funFact:
      'Kenya is famous for its wildlife and spectacular landscapes.',
    environment:
      'Kenya contains savannahs, mountains, forests and coastal areas.',
    ocean: 'Indian Ocean',
    languages: ['English', 'Swahili'],
  },

  {
    id: 4,
    continent: 'Africa',
    region: 'North Africa',
    flag: '🇪🇬',
    name: 'Egypt',
    capital: 'Cairo',
    currency: 'Egyptian Pound',
    landmark: 'Pyramids of Giza',
    funFact:
      'Ancient Egypt developed along the Nile River.',
    environment:
      'Much of Egypt is desert, with fertile land around the Nile.',
    ocean: 'Mediterranean Sea',
    languages: ['Arabic'],
  },

  {
    id: 5,
    continent: 'Africa',
    region: 'East Africa',
    flag: '🇹🇿',
    name: 'Tanzania',
    capital: 'Dodoma',
    currency: 'Tanzanian Shilling',
    landmark: 'Mount Kilimanjaro',
    funFact:
      'Mount Kilimanjaro is Africa’s highest mountain.',
    environment:
      'Tanzania contains savannahs, mountains, forests and coastal environments.',
    ocean: 'Indian Ocean',
    languages: ['Swahili', 'English'],
  },

  {
    id: 6,
    continent: 'Africa',
    region: 'Southern Africa',
    flag: '🇿🇦',
    name: 'South Africa',
    capital: 'Pretoria',
    currency: 'South African Rand',
    landmark: 'Table Mountain',
    funFact:
      'South Africa has three capital cities.',
    environment:
      'The country contains deserts, grasslands, forests and coastlines.',
    ocean: 'Atlantic and Indian Oceans',
    languages: ['English', 'Zulu', 'Xhosa'],
  },

  /* =========================
     ASIA
  ========================= */

  {
    id: 7,
    continent: 'Asia',
    region: 'East Asia',
    flag: '🇯🇵',
    name: 'Japan',
    capital: 'Tokyo',
    currency: 'Japanese Yen',
    landmark: 'Mount Fuji',
    funFact:
      'Japan is an island country made up of thousands of islands.',
    environment:
      'Japan has mountains, forests, volcanoes and coastal environments.',
    ocean: 'Pacific Ocean',
    languages: ['Japanese'],
  },

  {
    id: 8,
    continent: 'Asia',
    region: 'East Asia',
    flag: '🇨🇳',
    name: 'China',
    capital: 'Beijing',
    currency: 'Renminbi',
    landmark: 'Great Wall of China',
    funFact:
      'China is one of the world’s largest countries by population.',
    environment:
      'China contains deserts, mountains, forests, grasslands and coastlines.',
    ocean: 'Pacific Ocean',
    languages: ['Mandarin'],
  },

  {
    id: 9,
    continent: 'Asia',
    region: 'South Asia',
    flag: '🇮🇳',
    name: 'India',
    capital: 'New Delhi',
    currency: 'Indian Rupee',
    landmark: 'Taj Mahal',
    funFact:
      'India has many different languages, cultures and landscapes.',
    environment:
      'India includes mountains, plains, deserts, forests and coastlines.',
    ocean: 'Indian Ocean',
    languages: ['Hindi', 'English'],
  },

  {
    id: 10,
    continent: 'Asia',
    region: 'West Asia',
    flag: '🇸🇦',
    name: 'Saudi Arabia',
    capital: 'Riyadh',
    currency: 'Saudi Riyal',
    landmark: 'Al-Ula',
    funFact:
      'Saudi Arabia occupies much of the Arabian Peninsula.',
    environment:
      'Much of the country consists of desert environments.',
    ocean: 'Red Sea and Arabian Gulf',
    languages: ['Arabic'],
  },

  /* =========================
     EUROPE
  ========================= */

  {
    id: 11,
    continent: 'Europe',
    region: 'Western Europe',
    flag: '🇬🇧',
    name: 'United Kingdom',
    capital: 'London',
    currency: 'Pound Sterling',
    landmark: 'Big Ben',
    funFact:
      'The United Kingdom is made up of four countries.',
    environment:
      'The UK has hills, mountains, forests, rivers and coastlines.',
    ocean: 'Atlantic Ocean',
    languages: ['English'],
  },

  {
    id: 12,
    continent: 'Europe',
    region: 'Western Europe',
    flag: '🇫🇷',
    name: 'France',
    capital: 'Paris',
    currency: 'Euro',
    landmark: 'Eiffel Tower',
    funFact:
      'France is famous for its art, food, architecture and history.',
    environment:
      'France contains mountains, forests, farmland and coastal areas.',
    ocean: 'Atlantic Ocean and Mediterranean Sea',
    languages: ['French'],
  },

  {
    id: 13,
    continent: 'Europe',
    region: 'Southern Europe',
    flag: '🇮🇹',
    name: 'Italy',
    capital: 'Rome',
    currency: 'Euro',
    landmark: 'Colosseum',
    funFact:
      'Rome is the capital of Italy and has a very long history.',
    environment:
      'Italy contains mountains, plains, lakes and coastlines.',
    ocean: 'Mediterranean Sea',
    languages: ['Italian'],
  },

  /* =========================
     NORTH AMERICA
  ========================= */

  {
    id: 14,
    continent: 'North America',
    region: 'North America',
    flag: '🇨🇦',
    name: 'Canada',
    capital: 'Ottawa',
    currency: 'Canadian Dollar',
    landmark: 'Niagara Falls',
    funFact:
      'Canada is the second-largest country in the world by area.',
    environment:
      'Canada contains forests, mountains, lakes, tundra and coastlines.',
    ocean: 'Atlantic, Pacific and Arctic Oceans',
    languages: ['English', 'French'],
  },

  {
    id: 15,
    continent: 'North America',
    region: 'North America',
    flag: '🇺🇸',
    name: 'United States',
    capital: 'Washington, D.C.',
    currency: 'United States Dollar',
    landmark: 'Statue of Liberty',
    funFact:
      'The United States contains many different climates and landscapes.',
    environment:
      'It includes mountains, deserts, forests, plains and coastlines.',
    ocean: 'Atlantic and Pacific Oceans',
    languages: ['English'],
  },

  {
    id: 16,
    continent: 'North America',
    region: 'Central America',
    flag: '🇲🇽',
    name: 'Mexico',
    capital: 'Mexico City',
    currency: 'Mexican Peso',
    landmark: 'Chichen Itza',
    funFact:
      'Mexico has a rich history that includes ancient civilizations.',
    environment:
      'Mexico includes deserts, forests, mountains and tropical areas.',
    ocean: 'Pacific Ocean and Gulf of Mexico',
    languages: ['Spanish'],
  },

  /* =========================
     SOUTH AMERICA
  ========================= */

  {
    id: 17,
    continent: 'South America',
    region: 'South America',
    flag: '🇧🇷',
    name: 'Brazil',
    capital: 'Brasilia',
    currency: 'Brazilian Real',
    landmark: 'Christ the Redeemer',
    funFact:
      'Brazil contains a large part of the Amazon Rainforest.',
    environment:
      'Brazil includes rainforest, savannah, wetlands and coastlines.',
    ocean: 'Atlantic Ocean',
    languages: ['Portuguese'],
  },

  {
    id: 18,
    continent: 'South America',
    region: 'South America',
    flag: '🇦🇷',
    name: 'Argentina',
    capital: 'Buenos Aires',
    currency: 'Argentine Peso',
    landmark: 'Iguazu Falls',
    funFact:
      'Argentina stretches from tropical areas in the north to colder regions in the south.',
    environment:
      'Argentina contains grasslands, mountains, forests and glaciers.',
    ocean: 'Atlantic Ocean',
    languages: ['Spanish'],
  },

  /* =========================
     OCEANIA
  ========================= */

  {
    id: 19,
    continent: 'Oceania',
    region: 'Australasia',
    flag: '🇦🇺',
    name: 'Australia',
    capital: 'Canberra',
    currency: 'Australian Dollar',
    landmark: 'Uluru',
    funFact:
      'Australia is both a country and part of the continent-region commonly called Oceania.',
    environment:
      'Australia contains deserts, forests, grasslands and tropical areas.',
    ocean: 'Indian and Pacific Oceans',
    languages: ['English'],
  },

  {
    id: 20,
    continent: 'Oceania',
    region: 'Melanesia',
    flag: '🇫🇯',
    name: 'Fiji',
    capital: 'Suva',
    currency: 'Fijian Dollar',
    landmark: 'Coral reefs',
    funFact:
      'Fiji is an island country in the South Pacific.',
    environment:
      'Fiji contains tropical forests, beaches and coral reefs.',
    ocean: 'Pacific Ocean',
    languages: ['English', 'Fijian', 'Fiji Hindi'],
  },

  /* =========================
     ANTARCTICA
  ========================= */

  {
    id: 21,
    continent: 'Antarctica',
    flag: '🇦🇶',
    name: 'Antarctica',
    funFact:
      'Antarctica is the coldest continent on Earth and is covered mostly by ice.',
    environment:
      'Antarctica has ice sheets, glaciers and extremely cold polar environments.',
    isContinentOnly: true,
  },
];

/* =========================================================
   HELPERS
========================================================= */

const shuffle = <T,>(items: T[]): T[] => {
  return [...items].sort(
    () => Math.random() - 0.5
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export const GlobeExplorer: React.FC = () => {
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

  /**
   * IMPORTANT:
   *
   * Age is contextual.
   * Current learning level determines
   * academic complexity.
   */
  const age = profile?.age ?? 3;

  const learningLevel =
    profile?.currentLevel ?? 1;

  const [mode, setMode] =
    useState<ExplorerMode>('explore');

  const [selectedContinent, setSelectedContinent] =
    useState<Continent | 'All'>('All');

  const [search, setSearch] =
    useState('');

  const [selectedCountry, setSelectedCountry] =
    useState<Country | null>(null);

  const [discovered, setDiscovered] =
    useState<number[]>([]);

  const [challengeQuestions, setChallengeQuestions] =
    useState<ChallengeQuestion[]>([]);

  const [challengeIndex, setChallengeIndex] =
    useState(0);

  const [challengeScore, setChallengeScore] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState<number | null>(null);

  const [challengeFinished, setChallengeFinished] =
    useState(false);

  /* =======================================================
     ADAPTIVE LEARNING
  ======================================================= */

  const learnerStage =
    learningLevel <= 2
      ? 'foundation'
      : learningLevel === 3
        ? 'developing'
        : 'advanced';

  const showDetailedInformation =
    learnerStage !== 'foundation';

  const showAdvancedInformation =
    learnerStage === 'advanced';

  /* =======================================================
     FILTERED COUNTRIES
  ======================================================= */

  const filteredCountries = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return COUNTRY_DATABASE.filter(
      (country) => {
        const continentMatch =
          selectedContinent === 'All' ||
          country.continent ===
            selectedContinent;

        const searchMatch =
          normalizedSearch.length === 0 ||
          country.name
            .toLowerCase()
            .includes(normalizedSearch) ||
          country.capital
            ?.toLowerCase()
            .includes(normalizedSearch) ||
          country.region
            ?.toLowerCase()
            .includes(normalizedSearch);

        return (
          continentMatch &&
          searchMatch
        );
      }
    );
  }, [
    search,
    selectedContinent,
  ]);

  /* =======================================================
     DISCOVERY
  ======================================================= */

  const discoverCountry = useCallback(
    (country: Country) => {
      setSelectedCountry(country);

      setDiscovered((current) => {
        if (current.includes(country.id)) {
          return current;
        }

        return [
          ...current,
          country.id,
        ];
      });

      if (soundEnabled) playSoundFeedback('move');

      speak(
        country.isContinentOnly
          ? `${country.name}. ${country.funFact}`
          : `${country.name}. Capital: ${
              country.capital
            }. ${country.funFact}`
      );
    },
    [speak, soundEnabled]
  );

  /* =======================================================
     AUTO-READ PROMPT ON LOAD (Explore mode)
  ======================================================= */

  useEffect(() => {
    if (!autoReadEnabled) return;
    if (mode !== 'explore') return;
    if (selectedCountry) return;

    const timer = window.setTimeout(() => {
      speak(
        learnerStage === 'foundation'
          ? 'Let\'s explore the world. Choose a place to discover its people, environment and interesting facts.'
          : learnerStage === 'developing'
            ? 'Explore countries, continents, regions, capitals and environments. Choose a place to begin.'
            : 'Compare places, environments and communities around the world. Choose a country or continent to explore.'
      );
    }, 400);

    return () => window.clearTimeout(timer);
  }, [mode, selectedCountry, speak, autoReadEnabled, learnerStage]);

  /* =======================================================
     AUTO-READ PROMPT ON CHALLENGE QUESTION CHANGE
  ======================================================= */

  useEffect(() => {
    if (!autoReadEnabled) return;
    if (mode !== 'challenge') return;
    if (!challengeQuestions[challengeIndex]) return;
    if (challengeFinished) return;

    const timer = window.setTimeout(() => {
      speak('Which country does this flag belong to? Choose the correct answer.');
    }, 400);

    return () => window.clearTimeout(timer);
  }, [
    challengeIndex,
    challengeQuestions,
    mode,
    autoReadEnabled,
    speak,
    challengeFinished,
  ]);

  /* =======================================================
     READ HINT / EXPLANATION ON ANSWER
  ======================================================= */

  useEffect(() => {
    if (selectedAnswer === null) return;
    if (mode !== 'challenge') return;
    if (!challengeQuestions[challengeIndex]) return;

    const current =
      challengeQuestions[challengeIndex];

    const correct =
      selectedAnswer === current.country.id;

    if (correct) {
      if (soundEnabled) playSoundFeedback('correct');
      speak(
        `Correct! ${current.country.name} is in ${current.country.continent}. ${current.country.funFact}`
      );
    } else {
      if (soundEnabled) playSoundFeedback('try-again');
      const chosen =
        current.options.find(
          (o) => o.id === selectedAnswer
        );
      speak(
        `Not quite. ${chosen?.name ?? 'That country'} is in ${
          chosen?.continent ?? 'a different continent'
        }. The correct answer is ${current.country.name}, in ${current.country.continent}.`
      );
    }
  }, [
    selectedAnswer,
    mode,
    challengeQuestions,
    challengeIndex,
    speak,
    soundEnabled,
  ]);

  /* =======================================================
     COMPLETION NARRATION
  ======================================================= */

  useEffect(() => {
    if (!challengeFinished) return;
    if (challengeQuestions.length === 0) return;

    const percentage = Math.round(
      (challengeScore /
        challengeQuestions.length) *
        100
    );

    if (percentage >= 80) {
      speak(
        `Brilliant work! You scored ${percentage} percent. Your world knowledge is excellent.`
      );
    } else if (percentage >= 60) {
      speak(
        `Well done! You scored ${percentage} percent. Keep exploring the world.`
      );
    } else {
      speak(
        `You scored ${percentage} percent. Let's explore some more countries and try again.`
      );
    }
  }, [
    challengeFinished,
    challengeQuestions.length,
    challengeScore,
    speak,
  ]);

  /* =======================================================
     CHALLENGE
  ======================================================= */

  const startChallenge = useCallback(() => {
    const available =
      COUNTRY_DATABASE.filter(
        (country) =>
          !country.isContinentOnly
      );

    const selected =
      shuffle(available).slice(0, 8);

    const questions =
      selected.map((country) => {
        const incorrect =
          shuffle(
            available.filter(
              (candidate) =>
                candidate.id !==
                country.id
            )
          ).slice(0, 3);

        return {
          country,
          options: shuffle([
            country,
            ...incorrect,
          ]),
        };
      });

    setChallengeQuestions(
      questions
    );

    setChallengeIndex(0);
    setChallengeScore(0);
    setSelectedAnswer(null);
    setChallengeFinished(false);
    setMode('challenge');

    if (soundEnabled) playSoundFeedback('move');
  }, [soundEnabled]);

  const currentQuestion =
    challengeQuestions[
      challengeIndex
    ];

  const answerChallenge = (
    option: Country
  ) => {
    if (
      selectedAnswer !== null ||
      !currentQuestion
    ) {
      return;
    }

    const correct =
      option.id ===
      currentQuestion.country.id;

    setSelectedAnswer(option.id);

    if (correct) {
      setChallengeScore(
        (score) => score + 1
      );
    }

    window.setTimeout(() => {
      const nextIndex =
        challengeIndex + 1;

      if (
        nextIndex >=
        challengeQuestions.length
      ) {
        const finalScore =
          challengeScore +
          (correct ? 1 : 0);

        setChallengeFinished(true);

        const percentage = Math.round(
          (finalScore /
            challengeQuestions.length) *
            100
        );

        completeActivity({
          id: 'geography-globe-explorer',
          score: percentage,
          academyId: 'global',
          domain: 'general',
          skillIds: [
            'geography-country-recognition',
            'geography-continent-recognition',
            'global-awareness',
            'spatial-awareness',
          ],
        });

        return;
      }

      setChallengeIndex(
        nextIndex
      );

      setSelectedAnswer(null);
    }, 2200);
  };

  const resetExplorer = () => {
    setSelectedContinent('All');
    setSearch('');
    setSelectedCountry(null);
    setDiscovered([]);
    setMode('explore');
    setChallengeQuestions([]);
    setChallengeIndex(0);
    setChallengeScore(0);
    setSelectedAnswer(null);
    setChallengeFinished(false);
  };

  /* =======================================================
     CHALLENGE COMPLETE
  ======================================================= */

  if (
    mode === 'challenge' &&
    challengeFinished
  ) {
    const percentage =
      Math.round(
        (challengeScore /
          challengeQuestions.length) *
          100
      );

    return (
      <div className="w-full rounded-3xl border border-slate-700 bg-slate-950 p-6 text-white shadow-2xl">
        <div className="mx-auto flex max-w-2xl flex-col items-center py-10 text-center">
          <motion.div
            initial={{
              scale: 0,
              rotate: -15,
            }}
            animate={{
              scale: 1,
              rotate: 0,
            }}
            className="mb-6 rounded-full bg-amber-500/10 p-6"
          >
            <Trophy
              size={64}
              className="text-amber-400"
            />
          </motion.div>

          <h2 className="text-3xl font-bold">
            Geography Challenge Complete
          </h2>

          <p className="mt-3 text-slate-400">
            You scored
          </p>

          <div className="mt-2 text-6xl font-black text-emerald-400">
            {challengeScore}/
            {challengeQuestions.length}
          </div>

          <p className="mt-3 text-lg text-slate-300">
            {percentage >= 80
              ? 'Excellent world knowledge!'
              : percentage >= 60
                ? 'Good work! Keep exploring.'
                : 'Keep exploring and try again.'}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={startChallenge}
              className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Try Again
            </button>

            <button
              type="button"
              onClick={() =>
                setMode('explore')
              }
              className="rounded-xl border border-slate-700 px-5 py-3 font-semibold transition hover:bg-slate-900"
            >
              Explore the World
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     CHALLENGE MODE
  ======================================================= */

  if (
    mode === 'challenge' &&
    currentQuestion
  ) {
    return (
      <div className="w-full rounded-3xl border border-slate-700 bg-slate-950 p-6 text-white shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() =>
              setMode('explore')
            }
            className="flex items-center gap-2 text-slate-400 hover:text-white"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-400">
              Question{' '}
              {challengeIndex + 1} of{' '}
              {challengeQuestions.length}
            </div>

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

        <div className="mx-auto max-w-3xl">
          <div className="mb-8 h-2 overflow-hidden rounded-full bg-slate-800">
            <motion.div
              className="h-full bg-emerald-500"
              initial={{
                width: 0,
              }}
              animate={{
                width: `${
                  ((challengeIndex + 1) /
                    challengeQuestions.length) *
                  100
                }%`,
              }}
            />
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-900 p-8 text-center">
            <div className="text-7xl">
              {currentQuestion.country.flag}
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              Which country is this?
            </h2>

            <p className="mt-2 text-slate-400">
              Choose the correct answer.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {currentQuestion.options.map(
              (option) => {
                const isSelected =
                  selectedAnswer ===
                  option.id;

                const isCorrect =
                  option.id ===
                  currentQuestion
                    .country.id;

                let stateClass =
                  'border-slate-700 bg-slate-900 hover:border-emerald-500';

                if (
                  selectedAnswer !== null &&
                  isCorrect
                ) {
                  stateClass =
                    'border-emerald-500 bg-emerald-500/10';
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
                      selectedAnswer !== null
                    }
                    onClick={() =>
                      answerChallenge(
                        option
                      )
                    }
                    className={`flex items-center gap-4 rounded-2xl border p-5 text-left transition ${stateClass}`}
                  >
                    <span className="text-3xl">
                      {option.flag}
                    </span>

                    <span className="flex-1 font-semibold">
                      {option.name}
                    </span>

                    {selectedAnswer !==
                      null &&
                      isCorrect && (
                        <CheckCircle2
                          className="text-emerald-400"
                        />
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
      </div>
    );
  }

  /* =======================================================
     MAIN EXPLORER
  ======================================================= */

  return (
    <div className="w-full space-y-6 rounded-3xl border border-slate-700 bg-slate-950 p-5 text-white shadow-2xl sm:p-6">
      {/* HEADER */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-emerald-500/10 p-3">
            <Globe2
              size={32}
              className="text-emerald-400"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Global Explorer
            </h1>

            <p className="mt-1 text-sm text-slate-400 sm:text-base">
              Discover countries, continents,
              environments and communities.
            </p>

            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-slate-300">
                Level {learningLevel}
              </span>

              <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-slate-300">
                {learnerStage ===
                'foundation'
                  ? 'Foundation Explorer'
                  : learnerStage ===
                      'developing'
                    ? 'Developing Explorer'
                    : 'Advanced Explorer'}
              </span>

              <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-slate-300">
                {discovered.length}/
                {COUNTRY_DATABASE.length}{' '}
                discovered
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              setMode('explore')
            }
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              mode === 'explore'
                ? 'bg-emerald-500 text-slate-950'
                : 'border border-slate-700 bg-slate-900 text-slate-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <Map size={16} />
              Explore
            </span>
          </button>

          <button
            type="button"
            onClick={startChallenge}
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-emerald-500 hover:text-white"
          >
            <span className="flex items-center gap-2">
              <Trophy size={16} />
              Challenge
            </span>
          </button>

          <button
            type="button"
            onClick={resetExplorer}
            aria-label="Reset explorer"
            className="rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-400 transition hover:text-white"
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

      {/* FOUNDATION MESSAGE */}

      {learnerStage ===
        'foundation' && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <div className="flex gap-3">
            <Compass
              className="mt-0.5 shrink-0 text-emerald-400"
              size={20}
            />

            <div>
              <p className="font-semibold">
                Let's explore the world
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Start by discovering
                continents and countries.
                You can learn more details as
                your geography skills develop.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH */}

      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <input
          type="search"
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          placeholder="Search a country, capital or region..."
          className="w-full rounded-2xl border border-slate-700 bg-slate-900 py-4 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
        />
      </div>

      {/* CONTINENT FILTERS */}

      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() =>
            setSelectedContinent('All')
          }
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${
            selectedContinent === 'All'
              ? 'bg-emerald-500 text-slate-950'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          🌍 All
        </button>

        {CONTINENTS.map(
          (continent) => (
            <button
              key={continent}
              type="button"
              onClick={() =>
                setSelectedContinent(
                  continent
                )
              }
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${
                selectedContinent ===
                continent
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {continent}
            </button>
          )
        )}
      </div>

      {/* CONTENT */}

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* COUNTRY GRID */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredCountries.map(
              (country) => {
                const isDiscovered =
                  discovered.includes(
                    country.id
                  );

                return (
                  <motion.button
                    key={country.id}
                    type="button"
                    layout
                    initial={{
                      opacity: 0,
                      y: 12,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.95,
                    }}
                    onClick={() =>
                      discoverCountry(
                        country
                      )
                    }
                    className={`group rounded-2xl border p-5 text-left transition ${
                      selectedCountry?.id ===
                      country.id
                        ? 'border-emerald-500 bg-emerald-500/5'
                        : 'border-slate-800 bg-slate-900 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-5xl">
                        {country.flag}
                      </span>

                      {isDiscovered && (
                        <CheckCircle2
                          size={18}
                          className="text-emerald-400"
                        />
                      )}
                    </div>

                    <h3 className="mt-4 font-bold">
                      {country.name}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {country.continent}
                      {country.region
                        ? ` • ${country.region}`
                        : ''}
                    </p>

                    {showDetailedInformation &&
                      country.capital && (
                        <p className="mt-3 text-sm text-slate-400">
                          Capital:{' '}
                          <span className="text-slate-200">
                            {country.capital}
                          </span>
                        </p>
                      )}
                  </motion.button>
                );
              }
            )}
          </AnimatePresence>

          {filteredCountries.length ===
            0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-700 p-10 text-center">
              <Globe2
                size={40}
                className="mx-auto text-slate-600"
              />

              <p className="mt-4 font-semibold">
                No places found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Try another country,
                capital or continent.
              </p>
            </div>
          )}
        </div>

        {/* DETAIL PANEL */}

        <AnimatePresence mode="wait">
          {selectedCountry ? (
            <motion.aside
              key={selectedCountry.id}
              initial={{
                opacity: 0,
                x: 20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: 20,
              }}
              className="h-fit rounded-3xl border border-slate-700 bg-slate-900 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="text-6xl">
                  {selectedCountry.flag}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    speak(
                      selectedCountry
                        .funFact
                    )
                  }
                  className="rounded-xl border border-slate-700 p-3 text-slate-400 transition hover:text-white"
                  aria-label="Read fact aloud"
                >
                  <Volume2 size={20} />
                </button>
              </div>

              <h2 className="mt-5 text-2xl font-bold">
                {selectedCountry.name}
              </h2>

              <p className="mt-1 text-sm text-emerald-400">
                {selectedCountry.continent}
                {selectedCountry.region
                  ? ` • ${selectedCountry.region}`
                  : ''}
              </p>

              <p className="mt-5 leading-7 text-slate-300">
                {selectedCountry.funFact}
              </p>

              {showDetailedInformation &&
                !selectedCountry.isContinentOnly && (
                  <div className="mt-6 space-y-3">
                    {selectedCountry.capital && (
                      <InfoRow
                        icon={
                          <Landmark
                            size={18}
                          />
                        }
                        label="Capital"
                        value={
                          selectedCountry.capital
                        }
                      />
                    )}

                    {selectedCountry.currency && (
                      <InfoRow
                        icon={
                          <Coins
                            size={18}
                          />
                        }
                        label="Currency"
                        value={
                          selectedCountry.currency
                        }
                      />
                    )}

                    {selectedCountry.environment && (
                      <InfoRow
                        icon={
                          <Mountain
                            size={18}
                          />
                        }
                        label="Environment"
                        value={
                          selectedCountry.environment
                        }
                      />
                    )}
                  </div>
                )}

              {showAdvancedInformation &&
                !selectedCountry.isContinentOnly && (
                  <div className="mt-6 space-y-3 border-t border-slate-800 pt-5">
                    {selectedCountry.landmark && (
                      <InfoRow
                        icon={
                          <Sparkles
                            size={18}
                          />
                        }
                        label="Landmark"
                        value={
                          selectedCountry.landmark
                        }
                      />
                    )}

                    {selectedCountry.ocean && (
                      <InfoRow
                        icon={
                          <CloudSun
                            size={18}
                          />
                        }
                        label="Nearby waters"
                        value={
                          selectedCountry.ocean
                        }
                      />
                    )}

                    {selectedCountry.languages &&
                      selectedCountry
                        .languages.length >
                        0 && (
                        <InfoRow
                          icon={
                            <Globe2
                              size={18}
                            />
                          }
                          label="Languages"
                          value={selectedCountry.languages.join(
                            ', '
                          )}
                        />
                      )}
                  </div>
                )}

              <button
                type="button"
                onClick={() =>
                  speak(
                    `${selectedCountry.name}. ${selectedCountry.funFact}`
                  )
                }
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                <Volume2 size={18} />
                Listen
              </button>
            </motion.aside>
          ) : (
            <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 p-8 text-center">
              <div>
                <Globe2
                  size={56}
                  className="mx-auto text-slate-700"
                />

                <h3 className="mt-5 font-bold text-slate-300">
                  Choose a place to explore
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Discover its location,
                  people, environment and
                  interesting facts.
                </p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* LEARNING NOTE */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="flex gap-3">
          <Compass className="mt-0.5 shrink-0 text-emerald-400" />

          <div>
            <h3 className="font-semibold">
              What are we learning?
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-400">
              {learnerStage ===
                'foundation' &&
                'We are learning that our world has different continents and countries.'}

              {learnerStage ===
                'developing' &&
                'We are learning how countries connect to continents, regions, capitals and environments.'}

              {learnerStage ===
                'advanced' &&
                'We are comparing places, environments and communities while developing geographical and global awareness.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   INFO ROW
========================================================= */

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
      <div className="mt-0.5 text-emerald-400">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </p>

        <p className="mt-1 text-sm text-slate-200">
          {value}
        </p>
      </div>
    </div>
  );
};

export default GlobeExplorer;