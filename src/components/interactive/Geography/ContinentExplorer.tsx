import React, { useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Globe2,
  RotateCcw,
  Volume2,
  Map,
  Users,
  Mountain,
  Trees,
  Snowflake,
} from 'lucide-react';
import { speakWord } from '../../../services/audioEngine';

type ContinentId =
  | 'africa'
  | 'antarctica'
  | 'asia'
  | 'europe'
  | 'north-america'
  | 'south-america'
  | 'oceania';

type Continent = {
  id: ContinentId;
  name: string;
  emoji: string;
  fact: string;
  location: string;
  landmark: string;
  environment: string;
  populationNote: string;
  vocabulary: string[];
  icon: React.ReactNode;
};

const CONTINENTS: Continent[] = [
  {
    id: 'africa',
    name: 'Africa',
    emoji: '🦒',
    fact: 'Africa is home to the Sahara Desert and the Nile River.',
    location: 'Africa is between the Atlantic Ocean and Indian Ocean.',
    landmark: 'Sahara Desert',
    environment: 'Savanna, rainforest, desert, mountains and coastlines.',
    populationNote: 'Africa is home to many different peoples, languages and cultures.',
    vocabulary: ['desert', 'river', 'savanna', 'rainforest'],
    icon: <Trees size={18} />,
  },
  {
    id: 'antarctica',
    name: 'Antarctica',
    emoji: '🐧',
    fact: 'Antarctica is the coldest continent and is covered mostly by ice.',
    location: 'Antarctica surrounds the South Pole.',
    landmark: 'South Pole',
    environment: 'Ice sheets, glaciers and very cold polar environments.',
    populationNote: 'People do not live there permanently, but scientists work at research stations.',
    vocabulary: ['ice', 'glacier', 'polar', 'South Pole'],
    icon: <Snowflake size={18} />,
  },
  {
    id: 'asia',
    name: 'Asia',
    emoji: '🐼',
    fact: 'Asia is the largest continent and has more people than any other continent.',
    location: 'Asia is mostly in the Northern and Eastern Hemispheres.',
    landmark: 'Mount Everest',
    environment: 'Mountains, forests, deserts, grasslands and coastal regions.',
    populationNote: 'Asia contains many countries, cultures, languages and communities.',
    vocabulary: ['mountain', 'continent', 'country', 'population'],
    icon: <Mountain size={18} />,
  },
  {
    id: 'europe',
    name: 'Europe',
    emoji: '🏰',
    fact: 'Europe is known for its many countries, languages, art and long history.',
    location: 'Europe lies west of Asia and north of Africa.',
    landmark: 'Alps',
    environment: 'Mountains, forests, plains, rivers and coastlines.',
    populationNote: 'Europe contains many countries with different languages and traditions.',
    vocabulary: ['country', 'culture', 'mountain', 'river'],
    icon: <Map size={18} />,
  },
  {
    id: 'north-america',
    name: 'North America',
    emoji: '🦬',
    fact: 'North America includes countries such as Canada, the United States and Mexico.',
    location: 'North America is mostly in the Northern and Western Hemispheres.',
    landmark: 'Rocky Mountains',
    environment: 'Forests, mountains, grasslands, deserts and icy regions.',
    populationNote: 'North America has many different cultures, languages and environments.',
    vocabulary: ['mountain', 'forest', 'desert', 'ocean'],
    icon: <Globe2 size={18} />,
  },
  {
    id: 'south-america',
    name: 'South America',
    emoji: '🦜',
    fact: 'South America contains the Amazon Rainforest and the Andes Mountains.',
    location: 'South America is mostly in the Southern and Western Hemispheres.',
    landmark: 'Amazon Rainforest',
    environment: 'Rainforest, mountains, grasslands, deserts and coastlines.',
    populationNote: 'South America is home to many cultures, languages and communities.',
    vocabulary: ['rainforest', 'mountain', 'river', 'forest'],
    icon: <Trees size={18} />,
  },
  {
    id: 'oceania',
    name: 'Oceania',
    emoji: '🦘',
    fact: 'Oceania includes Australia and many islands across the Pacific Ocean.',
    location: 'Oceania lies mainly in the Pacific Ocean.',
    landmark: 'Great Barrier Reef',
    environment: 'Islands, coral reefs, deserts, forests and coastal environments.',
    populationNote: 'Oceania contains many island communities with rich cultures and traditions.',
    vocabulary: ['island', 'ocean', 'reef', 'coast'],
    icon: <Globe2 size={18} />,
  },
];

type ExplorerMode = 'discover' | 'recall';

export const ContinentExplorer: React.FC = () => {
  const [revealed, setRevealed] = useState<ContinentId[]>([]);
  const [selectedContinent, setSelectedContinent] =
    useState<ContinentId | null>(null);
  const [mode, setMode] = useState<ExplorerMode>('discover');
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [completed, setCompleted] = useState(false);

  const selected = useMemo(
    () => CONTINENTS.find((continent) => continent.id === selectedContinent),
    [selectedContinent]
  );

  const progress = Math.round(
    (revealed.length / CONTINENTS.length) * 100
  );

  const speak = useCallback((text: string) => {
    speakWord(text);
  }, []);

  const revealContinent = useCallback(
    (id: ContinentId) => {
      const continent = CONTINENTS.find((item) => item.id === id);

      if (!continent) return;

      setSelectedContinent(id);

      if (!revealed.includes(id)) {
        setRevealed((current) => [...current, id]);
        speak(continent.fact);
      }
    },
    [revealed, speak]
  );

  const resetExplorer = () => {
    setRevealed([]);
    setSelectedContinent(null);
    setScore(0);
    setAttempts(0);
    setCompleted(false);
    setMode('discover');
  };

  const startRecall = () => {
    if (revealed.length !== CONTINENTS.length) return;

    setMode('recall');
    setSelectedContinent(null);
    setScore(0);
    setAttempts(0);
    setCompleted(false);
  };

  const checkRecall = (answer: ContinentId) => {
    const target =
      CONTINENTS[Math.floor(Math.random() * CONTINENTS.length)];

    setAttempts((current) => current + 1);

    if (answer === target.id) {
      setScore((current) => current + 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-app-card rounded-3xl border border-app-border shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-app-border">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <Globe2 size={20} />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Geography
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-white">
              🌍 Continent Explorer
            </h3>

            <p className="text-gray-400 text-sm mt-2">
              Explore the seven continents and discover how our world is
              organised.
            </p>
          </div>

          <button
            type="button"
            onClick={resetExplorer}
            aria-label="Reset continent explorer"
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-gray-400">
              Continents explored
            </span>

            <span className="text-cyan-400 font-semibold">
              {revealed.length}/{CONTINENTS.length}
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

      {/* Mode Switch */}
      <div className="px-6 pt-5">
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-white/5 border border-white/10">
          <button
            type="button"
            onClick={() => setMode('discover')}
            className={`py-2.5 rounded-lg text-sm font-semibold transition ${
              mode === 'discover'
                ? 'bg-cyan-500/20 text-cyan-300'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Explore
          </button>

          <button
            type="button"
            disabled={revealed.length !== CONTINENTS.length}
            onClick={startRecall}
            className={`py-2.5 rounded-lg text-sm font-semibold transition ${
              mode === 'recall'
                ? 'bg-cyan-500/20 text-cyan-300'
                : 'text-gray-400'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            Remember
          </button>
        </div>
      </div>

      {/* Discovery Mode */}
      {mode === 'discover' && (
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {CONTINENTS.map((continent) => {
              const isRevealed = revealed.includes(continent.id);
              const isSelected = selectedContinent === continent.id;

              return (
                <motion.button
                  key={continent.id}
                  type="button"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => revealContinent(continent.id)}
                  aria-label={`Explore ${continent.name}`}
                  className={`
                    relative min-h-[150px] rounded-2xl border p-4
                    flex flex-col items-center justify-center
                    text-center transition-all
                    ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-500/10'
                        : isRevealed
                        ? 'border-white/15 bg-white/[0.04]'
                        : 'border-white/10 bg-black/10 hover:border-cyan-400/50'
                    }
                  `}
                >
                  {isRevealed && (
                    <CheckCircle2
                      size={16}
                      className="absolute top-3 right-3 text-green-400"
                    />
                  )}

                  <span className="text-4xl mb-3">
                    {isRevealed ? continent.emoji : '🌍'}
                  </span>

                  <span className="text-sm font-bold text-white">
                    {continent.name}
                  </span>

                  {isRevealed && (
                    <span className="text-[11px] text-gray-500 mt-1">
                      Explored
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Selected continent */}
          <AnimatePresence mode="wait">
            {selected && (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-500/5 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">
                      {selected.emoji}
                    </span>

                    <div>
                      <h4 className="text-xl font-bold text-white">
                        {selected.name}
                      </h4>

                      <p className="text-xs text-cyan-400 mt-1">
                        {selected.landmark}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => speak(selected.fact)}
                    aria-label={`Listen to ${selected.name} fact`}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-cyan-400 hover:bg-white/10"
                  >
                    <Volume2 size={18} />
                  </button>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mt-4">
                  {selected.fact}
                </p>

                <div className="grid sm:grid-cols-2 gap-3 mt-4">
                  <InfoCard
                    icon={<Map size={16} />}
                    label="Where?"
                    text={selected.location}
                  />

                  <InfoCard
                    icon={selected.icon}
                    label="Environment"
                    text={selected.environment}
                  />

                  <InfoCard
                    icon={<Users size={16} />}
                    label="People"
                    text={selected.populationNote}
                  />

                  <InfoCard
                    icon={<Globe2 size={16} />}
                    label="Key vocabulary"
                    text={selected.vocabulary.join(' • ')}
                  />
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {selected.vocabulary.map((word) => (
                    <button
                      key={word}
                      type="button"
                      onClick={() => speak(word)}
                      className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 hover:text-white hover:border-cyan-400/40 transition"
                    >
                      🔊 {word}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Completion */}
          {revealed.length === CONTINENTS.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-5 p-5 rounded-2xl border border-green-500/30 bg-green-500/10"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="text-green-400" />
                </div>

                <div>
                  <h4 className="font-bold text-white">
                    World explorer complete!
                  </h4>

                  <p className="text-sm text-gray-400">
                    You have explored all seven continents.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={startRecall}
                className="mt-4 w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition"
              >
                Test what you remember →
              </button>
            </motion.div>
          )}
        </div>
      )}

      {/* Recall Mode */}
      {mode === 'recall' && (
        <div className="p-6">
          <div className="text-center mb-6">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 mb-3">
              <Globe2 />
            </span>

            <h4 className="text-xl font-bold text-white">
              Geography Recall
            </h4>

            <p className="text-sm text-gray-400 mt-1">
              Can you remember where things belong?
            </p>
          </div>

          <RecallActivity
            onAnswer={checkRecall}
            onComplete={() => setCompleted(true)}
          />

          {completed && (
            <div className="mt-5 p-4 rounded-2xl bg-green-500/10 border border-green-500/30 text-center">
              <CheckCircle2
                className="mx-auto text-green-400 mb-2"
                size={28}
              />

              <p className="font-bold text-white">
                Great geographical thinking!
              </p>

              <p className="text-sm text-gray-400 mt-1">
                Score: {score}
              </p>
            </div>
          )}

          {attempts > 0 && (
            <div className="mt-4 text-center text-xs text-gray-500">
              Attempts: {attempts} · Correct: {score}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

type InfoCardProps = {
  icon: React.ReactNode;
  label: string;
  text: string;
};

const InfoCard: React.FC<InfoCardProps> = ({
  icon,
  label,
  text,
}) => (
  <div className="p-3 rounded-xl bg-black/10 border border-white/5">
    <div className="flex items-center gap-2 text-cyan-400 mb-1">
      {icon}
      <span className="text-xs font-semibold">{label}</span>
    </div>

    <p className="text-xs text-gray-400 leading-relaxed">
      {text}
    </p>
  </div>
);

type RecallActivityProps = {
  onAnswer: (answer: ContinentId) => void;
  onComplete: () => void;
};

const RecallActivity: React.FC<RecallActivityProps> = ({
  onAnswer,
  onComplete,
}) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] =
    useState<ContinentId | null>(null);

  const QUESTIONS = [
    {
      question: 'Which continent is home to the Sahara Desert?',
      answer: 'africa' as ContinentId,
    },
    {
      question: 'Which continent surrounds the South Pole?',
      answer: 'antarctica' as ContinentId,
    },
    {
      question: 'Which continent is the largest?',
      answer: 'asia' as ContinentId,
    },
    {
      question: 'Which continent contains the Amazon Rainforest?',
      answer: 'south-america' as ContinentId,
    },
    {
      question: 'Which continent includes Australia?',
      answer: 'oceania' as ContinentId,
    },
  ];

  const currentQuestion = QUESTIONS[questionIndex];

  const handleAnswer = (id: ContinentId) => {
    setSelectedAnswer(id);
    onAnswer(id);

    window.setTimeout(() => {
      if (questionIndex < QUESTIONS.length - 1) {
        setQuestionIndex((current) => current + 1);
        setSelectedAnswer(null);
      } else {
        onComplete();
      }
    }, 700);
  };

  return (
    <div>
      <div className="mb-5">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>
            Question {questionIndex + 1} of {QUESTIONS.length}
          </span>

          <span>{currentQuestion.answer}</span>
        </div>

        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-cyan-400"
            animate={{
              width: `${((questionIndex + 1) / QUESTIONS.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 mb-5">
        <p className="text-lg md:text-xl font-bold text-white text-center leading-relaxed">
          {currentQuestion.question}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CONTINENTS.map((continent) => {
          const isSelected = selectedAnswer === continent.id;
          const isCorrect =
            isSelected && continent.id === currentQuestion.answer;

          return (
            <motion.button
              key={continent.id}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => handleAnswer(continent.id)}
              disabled={selectedAnswer !== null}
              className={`
                p-4 rounded-2xl border text-center transition
                ${
                  isSelected
                    ? isCorrect
                      ? 'border-green-400 bg-green-500/10'
                      : 'border-red-400 bg-red-500/10'
                    : 'border-white/10 bg-black/10 hover:border-cyan-400/50'
                }
              `}
            >
              <span className="text-3xl block mb-2">
                {continent.emoji}
              </span>

              <span className="text-xs font-semibold text-white">
                {continent.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
