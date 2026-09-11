import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Globe2,
  RotateCcw,
  Search,
  Volume2,
  MapPin,
  Trophy,
} from 'lucide-react';

import { playSoundFeedback } from '../../../services/soundFeedback';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

type Region =
  | 'Africa'
  | 'Asia'
  | 'Europe'
  | 'North America'
  | 'South America'
  | 'Oceania';

type Country = {
  id: number;
  country: string;
  flag: string;
  capital: string;
  region: Region;
};

const COUNTRIES: Country[] = [
  // AFRICA
  { id: 1, country: 'Ghana', flag: '🇬🇭', capital: 'Accra', region: 'Africa' },
  { id: 2, country: 'Nigeria', flag: '🇳🇬', capital: 'Abuja', region: 'Africa' },
  { id: 3, country: 'Kenya', flag: '🇰🇪', capital: 'Nairobi', region: 'Africa' },
  { id: 4, country: 'South Africa', flag: '🇿🇦', capital: 'Pretoria', region: 'Africa' },
  { id: 5, country: 'Egypt', flag: '🇪🇬', capital: 'Cairo', region: 'Africa' },
  { id: 6, country: 'Morocco', flag: '🇲🇦', capital: 'Rabat', region: 'Africa' },
  { id: 7, country: 'Ethiopia', flag: '🇪🇹', capital: 'Addis Ababa', region: 'Africa' },
  { id: 8, country: 'Senegal', flag: '🇸🇳', capital: 'Dakar', region: 'Africa' },

  // ASIA
  { id: 9, country: 'Japan', flag: '🇯🇵', capital: 'Tokyo', region: 'Asia' },
  { id: 10, country: 'China', flag: '🇨🇳', capital: 'Beijing', region: 'Asia' },
  { id: 11, country: 'India', flag: '🇮🇳', capital: 'New Delhi', region: 'Asia' },
  { id: 12, country: 'Saudi Arabia', flag: '🇸🇦', capital: 'Riyadh', region: 'Asia' },
  { id: 13, country: 'United Arab Emirates', flag: '🇦🇪', capital: 'Abu Dhabi', region: 'Asia' },
  { id: 14, country: 'Türkiye', flag: '🇹🇷', capital: 'Ankara', region: 'Asia' },
  { id: 15, country: 'South Korea', flag: '🇰🇷', capital: 'Seoul', region: 'Asia' },
  { id: 16, country: 'Indonesia', flag: '🇮🇩', capital: 'Jakarta', region: 'Asia' },

  // EUROPE
  { id: 17, country: 'United Kingdom', flag: '🇬🇧', capital: 'London', region: 'Europe' },
  { id: 18, country: 'France', flag: '🇫🇷', capital: 'Paris', region: 'Europe' },
  { id: 19, country: 'Germany', flag: '🇩🇪', capital: 'Berlin', region: 'Europe' },
  { id: 20, country: 'Italy', flag: '🇮🇹', capital: 'Rome', region: 'Europe' },
  { id: 21, country: 'Spain', flag: '🇪🇸', capital: 'Madrid', region: 'Europe' },
  { id: 22, country: 'Portugal', flag: '🇵🇹', capital: 'Lisbon', region: 'Europe' },
  { id: 23, country: 'Netherlands', flag: '🇳🇱', capital: 'Amsterdam', region: 'Europe' },
  { id: 24, country: 'Switzerland', flag: '🇨🇭', capital: 'Bern', region: 'Europe' },

  // NORTH AMERICA
  { id: 25, country: 'United States', flag: '🇺🇸', capital: 'Washington, D.C.', region: 'North America' },
  { id: 26, country: 'Canada', flag: '🇨🇦', capital: 'Ottawa', region: 'North America' },
  { id: 27, country: 'Mexico', flag: '🇲🇽', capital: 'Mexico City', region: 'North America' },
  { id: 28, country: 'Jamaica', flag: '🇯🇲', capital: 'Kingston', region: 'North America' },
  { id: 29, country: 'Cuba', flag: '🇨🇺', capital: 'Havana', region: 'North America' },

  // SOUTH AMERICA
  { id: 30, country: 'Brazil', flag: '🇧🇷', capital: 'Brasília', region: 'South America' },
  { id: 31, country: 'Argentina', flag: '🇦🇷', capital: 'Buenos Aires', region: 'South America' },
  { id: 32, country: 'Colombia', flag: '🇨🇴', capital: 'Bogotá', region: 'South America' },
  { id: 33, country: 'Peru', flag: '🇵🇪', capital: 'Lima', region: 'South America' },
  { id: 34, country: 'Chile', flag: '🇨🇱', capital: 'Santiago', region: 'South America' },

  // OCEANIA
  { id: 35, country: 'Australia', flag: '🇦🇺', capital: 'Canberra', region: 'Oceania' },
  { id: 36, country: 'New Zealand', flag: '🇳🇿', capital: 'Wellington', region: 'Oceania' },
  { id: 37, country: 'Fiji', flag: '🇫🇯', capital: 'Suva', region: 'Oceania' },
  { id: 38, country: 'Papua New Guinea', flag: '🇵🇬', capital: 'Port Moresby', region: 'Oceania' },

  // ADDITIONAL COUNTRIES
  { id: 39, country: 'Rwanda', flag: '🇷🇼', capital: 'Kigali', region: 'Africa' },
  { id: 40, country: 'Tanzania', flag: '🇹🇿', capital: 'Dodoma', region: 'Africa' },
];

const REGIONS: Array<'All' | Region> = [
  'All',
  'Africa',
  'Asia',
  'Europe',
  'North America',
  'South America',
  'Oceania',
];

type GameMode = 'explore' | 'challenge';

export const FlagMatch: React.FC = () => {
  const [matched, setMatched] = useState<number[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [region, setRegion] = useState<'All' | Region>('All');
  const [search, setSearch] = useState('');
  const [gameMode, setGameMode] = useState<GameMode>('explore');

  const [challengeIndex, setChallengeIndex] = useState(0);
  const [challengeScore, setChallengeScore] = useState(0);
  const [challengeFinished, setChallengeFinished] = useState(false);

  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const { speak } = useReadAloud();

  const filteredCountries = useMemo(() => {
    const query = search.trim().toLowerCase();

    return COUNTRIES.filter((country) => {
      const matchesRegion = region === 'All' || country.region === region;

      const matchesSearch =
        !query ||
        country.country.toLowerCase().includes(query) ||
        country.capital.toLowerCase().includes(query);

      return matchesRegion && matchesSearch;
    });
  }, [region, search]);

  const progress = Math.round((matched.length / COUNTRIES.length) * 100);

  /* Announce discovery-complete milestone once */
  useEffect(() => {
    if (gameMode !== 'explore') return;
    if (matched.length !== COUNTRIES.length) return;

    speak(
      `World explorer achievement unlocked! You discovered all ${COUNTRIES.length} countries in this activity. You can now test what you remember.`,
    );
  }, [matched.length, gameMode, speak]);

  const revealCountry = useCallback(
    (country: Country) => {
      if (soundEnabled) playSoundFeedback('move');

      setSelectedCountry(country);

      if (!matched.includes(country.id)) {
        setMatched((current) => [...current, country.id]);
      }

      speak(
        `${country.country}. The capital city is ${country.capital}.`,
      );
    },
    [matched, speak, soundEnabled]
  );

  const speakCountry = (country: Country) => {
    speak(`${country.country}. Capital: ${country.capital}.`);
  };

  const reset = () => {
    setMatched([]);
    setSelectedCountry(null);
    setSearch('');
    setRegion('All');
    setGameMode('explore');
    setChallengeIndex(0);
    setChallengeScore(0);
    setChallengeFinished(false);

    speak("Let's explore the flags again!");
  };

  const startChallenge = () => {
    if (soundEnabled) playSoundFeedback('move');

    setGameMode('challenge');
    setChallengeIndex(0);
    setChallengeScore(0);
    setChallengeFinished(false);
    setSelectedCountry(null);

    speak('Flag challenge. Which country does this flag belong to?');
  };

  return (
    <div className="max-w-5xl mx-auto bg-app-card rounded-3xl border border-app-border shadow-xl overflow-hidden">
      {/* HEADER */}
      <div className="p-6 border-b border-app-border">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <Globe2 size={19} />
              <span className="text-xs uppercase tracking-wider font-semibold">
                Geography
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-white">
              🚩 Flag Match
            </h3>

            <p className="text-sm text-gray-400 mt-2">
              Discover countries, flags, capitals and world regions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSound}
              aria-label="Toggle sound"
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition"
            >
              <Volume2
                size={18}
                className={soundEnabled ? 'text-amber-300' : 'text-gray-500'}
              />
            </button>

            <button
              type="button"
              onClick={reset}
              aria-label="Reset flag activity"
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>

        {/* PROGRESS */}
        <div className="mt-6">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-gray-400">Countries discovered</span>

            <span className="text-cyan-400 font-semibold">
              {matched.length}/{COUNTRIES.length}
            </span>
          </div>

          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-cyan-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      </div>

      {/* MODE SWITCH */}
      <div className="px-6 pt-5">
        <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => setGameMode('explore')}
            className={`py-2.5 rounded-lg text-sm font-semibold transition ${
              gameMode === 'explore'
                ? 'bg-cyan-500/20 text-cyan-300'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Explore Flags
          </button>

          <button
            type="button"
            onClick={startChallenge}
            className={`py-2.5 rounded-lg text-sm font-semibold transition ${
              gameMode === 'challenge'
                ? 'bg-cyan-500/20 text-cyan-300'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Challenge Me
          </button>
        </div>
      </div>

      {gameMode === 'explore' && (
        <div className="p-6">
          {/* SEARCH */}
          <div className="relative mb-4">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search country or capital..."
              aria-label="Search countries"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/10 border border-white/10 text-white placeholder:text-gray-600 outline-none focus:border-cyan-400/50"
            />
          </div>

          {/* REGION FILTER */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
            {REGIONS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setRegion(item)}
                className={`whitespace-nowrap px-3 py-2 rounded-full text-xs font-semibold border transition ${
                  region === item
                    ? 'bg-cyan-500/15 border-cyan-400/40 text-cyan-300'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* FLAG GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredCountries.map((country) => {
              const isMatched = matched.includes(country.id);
              const isSelected = selectedCountry?.id === country.id;

              return (
                <motion.button
                  key={country.id}
                  type="button"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => revealCountry(country)}
                  className={`relative min-h-[155px] rounded-2xl border p-4 flex flex-col items-center justify-center text-center transition ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-500/10'
                      : isMatched
                        ? 'border-white/15 bg-white/[0.04]'
                        : 'border-white/10 bg-black/10 hover:border-cyan-400/40'
                  }`}
                >
                  {isMatched && (
                    <CheckCircle2
                      size={15}
                      className="absolute top-3 right-3 text-green-400"
                    />
                  )}

                  <span className="text-5xl mb-3">{country.flag}</span>

                  <span className="font-bold text-sm text-white">
                    {country.country}
                  </span>

                  <span className="text-[11px] text-gray-500 mt-1">
                    {country.region}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {filteredCountries.length === 0 && (
            <div className="py-12 text-center">
              <Globe2 size={32} className="mx-auto text-gray-600 mb-3" />

              <p className="text-gray-400">No countries found.</p>
            </div>
          )}

          {/* COUNTRY DETAIL */}
          <AnimatePresence mode="wait">
            {selectedCountry && (
              <motion.div
                key={selectedCountry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 p-5 rounded-2xl border border-cyan-400/20 bg-cyan-500/5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{selectedCountry.flag}</span>

                    <div>
                      <h4 className="text-xl font-bold text-white">
                        {selectedCountry.country}
                      </h4>

                      <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                        <MapPin size={14} />

                        <span>Capital: {selectedCountry.capital}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => speakCountry(selectedCountry)}
                    aria-label={`Listen to ${selectedCountry.country}`}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-cyan-400 hover:bg-white/10"
                  >
                    <Volume2 size={18} />
                  </button>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
                    🌍 {selectedCountry.region}
                  </span>

                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
                    🏛️ {selectedCountry.capital}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* COMPLETE */}
          {matched.length === COUNTRIES.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-5 p-5 rounded-2xl border border-green-500/30 bg-green-500/10"
            >
              <div className="flex items-center gap-3">
                <Trophy className="text-yellow-400" />

                <div>
                  <h4 className="font-bold text-white">
                    World explorer achievement unlocked!
                  </h4>

                  <p className="text-sm text-gray-400">
                    You discovered all {COUNTRIES.length} countries in this
                    activity.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={startChallenge}
                className="w-full mt-4 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition"
              >
                Test what you remember →
              </button>
            </motion.div>
          )}
        </div>
      )}

      {gameMode === 'challenge' && (
        <FlagChallenge
          challengeIndex={challengeIndex}
          setChallengeIndex={setChallengeIndex}
          score={challengeScore}
          setScore={setChallengeScore}
          finished={challengeFinished}
          setFinished={setChallengeFinished}
        />
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* FLAG CHALLENGE                                                             */
/* -------------------------------------------------------------------------- */

type FlagChallengeProps = {
  challengeIndex: number;
  setChallengeIndex: React.Dispatch<React.SetStateAction<number>>;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  finished: boolean;
  setFinished: React.Dispatch<React.SetStateAction<boolean>>;
};

const FlagChallenge: React.FC<FlagChallengeProps> = ({
  challengeIndex,
  setChallengeIndex,
  score,
  setScore,
  finished,
  setFinished,
}) => {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);

  const { speak } = useReadAloud();

  const QUESTIONS = useMemo(() => {
    return [...COUNTRIES].sort(() => Math.random() - 0.5).slice(0, 10);
  }, []);

  const current = QUESTIONS[challengeIndex];

  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const options = useMemo(() => {
    if (!current) return [];

    const others = COUNTRIES.filter(
      (country) => country.id !== current.id,
    )
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    return [...others, current].sort(() => Math.random() - 0.5);
  }, [current]);

  /* Auto-read the question when a new flag appears */
  useEffect(() => {
    if (!autoReadEnabled || !current || finished) return;

    const timer = window.setTimeout(() => {
      speak(`Which country does this flag belong to?`);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [challengeIndex, current, finished, speak, autoReadEnabled]);

  const answer = (country: Country) => {
    if (answered || !current) return;

    setAnswered(true);
    setSelectedAnswer(country.country);

    if (country.id === current.id) {
      if (soundEnabled) playSoundFeedback('correct');
      setScore((value) => value + 1);
      speak(`Correct! This is the flag of ${current.country}.`);
    } else {
      if (soundEnabled) playSoundFeedback('try-again');
      speak(`The correct answer is ${current.country}.`);
    }

    window.setTimeout(() => {
      if (challengeIndex >= QUESTIONS.length - 1) {
        setFinished(true);
      } else {
        setChallengeIndex((value) => value + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      }
    }, 1400);
  };

  if (finished) {
    const percentage = Math.round((score / QUESTIONS.length) * 100);

    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-4">
          <Trophy className="text-yellow-400" size={32} />
        </div>

        <h4 className="text-2xl font-bold text-white">Challenge complete!</h4>

        <p className="text-gray-400 mt-2">
          You scored {score} out of {QUESTIONS.length}.
        </p>

        <div className="text-4xl font-black text-cyan-400 mt-4">
          {percentage}%
        </div>

        <p className="text-sm text-gray-500 mt-2">
          {percentage >= 80
            ? 'Excellent geographical knowledge!'
            : percentage >= 50
              ? 'Good work. Keep exploring the world!'
              : 'Keep practising. Every explorer learns step by step!'}
        </p>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="p-6">
      <div className="flex justify-between text-xs text-gray-500 mb-2">
        <span>
          Question {challengeIndex + 1} of {QUESTIONS.length}
        </span>

        <span>Score: {score}</span>
      </div>

      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-6">
        <motion.div
          className="h-full bg-cyan-400"
          animate={{
            width: `${((challengeIndex + 1) / QUESTIONS.length) * 100}%`,
          }}
        />
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-400 mb-4">
          Which country does this flag belong to?
        </p>

        <motion.div
          key={current.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-8xl mb-8"
        >
          {current.flag}
        </motion.div>

        <div className="grid grid-cols-2 gap-3 max-w-xl mx-auto">
          {options.map((option) => {
            const isSelected = selectedAnswer === option.country;
            const isCorrect = answered && option.id === current.id;
            const isWrong = answered && isSelected && !isCorrect;

            return (
              <motion.button
                key={option.id}
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => answer(option)}
                disabled={answered}
                className={`p-4 rounded-xl border font-semibold transition ${
                  isCorrect
                    ? 'border-green-400 bg-green-500/10 text-green-300'
                    : isWrong
                      ? 'border-red-400 bg-red-500/10 text-red-300'
                      : 'border-white/10 bg-white/[0.03] text-white hover:border-cyan-400/50'
                }`}
              >
                {option.country}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};