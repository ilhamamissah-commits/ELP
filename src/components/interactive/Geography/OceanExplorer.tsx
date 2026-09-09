import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Waves,
  Volume2,
  RotateCcw,
  Fish,
  Leaf,
  Microscope,
  Globe2,
  Heart,
  CheckCircle2,
  XCircle,
  Sparkles,
} from 'lucide-react';
import { speakWord } from '../../../services/audioEngine';
import { useProfileStore } from '../../../store/useProfileStore';
import { useProgressStore } from '../../../store/useProgressStore';

type OceanCategory =
  | 'oceans'
  | 'marine-life'
  | 'ecosystems'
  | 'science';

type Ocean = {
  id: number;
  name: string;
  emoji: string;
  location: string;
  fact: string;
  description: string;
  temperature: string;
  life: string[];
};

type MarineLife = {
  id: number;
  name: string;
  emoji: string;
  group: string;
  habitat: string;
  description: string;
  diet: string;
  adaptation: string;
};

type Ecosystem = {
  id: number;
  name: string;
  emoji: string;
  description: string;
  organisms: string[];
  importance: string;
};

type Challenge = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

const OCEANS: Ocean[] = [
  {
    id: 1,
    name: 'Pacific Ocean',
    emoji: '🌊',
    location: 'Between Asia, Australia, and the Americas',
    fact: 'The Pacific is the largest and deepest ocean.',
    description:
      'The Pacific Ocean stretches across a huge part of Earth and contains many islands, habitats, and marine species.',
    temperature: 'Warm tropical waters to very cold polar waters',
    life: ['🐋 Whales', '🐬 Dolphins', '🐠 Reef fish', '🪸 Corals'],
  },
  {
    id: 2,
    name: 'Atlantic Ocean',
    emoji: '🌊',
    location: 'Between the Americas, Europe, and Africa',
    fact: 'The Atlantic connects many continents and seas.',
    description:
      'The Atlantic Ocean lies between the Americas and Europe and Africa. It contains important ecosystems and major ocean currents.',
    temperature: 'Tropical, temperate, and polar waters',
    life: ['🐋 Whales', '🦈 Sharks', '🐢 Turtles', '🐟 Fish'],
  },
  {
    id: 3,
    name: 'Indian Ocean',
    emoji: '🌊',
    location: 'Between Africa, Asia, and Australia',
    fact: 'The Indian Ocean includes many warm tropical waters.',
    description:
      'The Indian Ocean is surrounded by Africa, Asia, Australia, and the Southern Ocean. It contains coral reefs, deep waters, and diverse marine life.',
    temperature: 'Mostly warm, with cooler southern waters',
    life: ['🐢 Sea turtles', '🐋 Whales', '🦈 Sharks', '🪸 Corals'],
  },
  {
    id: 4,
    name: 'Arctic Ocean',
    emoji: '❄️',
    location: 'Around the North Pole',
    fact: 'The Arctic is the smallest of the five oceans.',
    description:
      'The Arctic Ocean is a cold polar ocean surrounded by land. Sea ice provides habitat for several specially adapted animals.',
    temperature: 'Very cold',
    life: ['🐻‍❄️ Polar bears', '🦭 Seals', '🐋 Whales', '🦐 Tiny marine animals'],
  },
  {
    id: 5,
    name: 'Southern Ocean',
    emoji: '🐧',
    location: 'Around Antarctica',
    fact: 'The Southern Ocean surrounds Antarctica.',
    description:
      'The Southern Ocean is a cold ocean surrounding Antarctica. Its waters support important food webs involving plankton, krill, fish, birds, and whales.',
    temperature: 'Very cold',
    life: ['🐧 Penguins', '🦐 Krill', '🐋 Whales', '🦭 Seals'],
  },
];

const MARINE_LIFE: MarineLife[] = [
  {
    id: 1,
    name: 'Blue Whale',
    emoji: '🐋',
    group: 'Mammal',
    habitat: 'Open ocean',
    description:
      'The blue whale is the largest known animal to have lived on Earth.',
    diet: 'Mostly krill',
    adaptation:
      'Its huge body and feeding system allow it to consume large amounts of tiny krill.',
  },
  {
    id: 2,
    name: 'Dolphin',
    emoji: '🐬',
    group: 'Mammal',
    habitat: 'Oceans and coastal waters',
    description:
      'Dolphins are intelligent marine mammals that breathe air through a blowhole.',
    diet: 'Fish and squid',
    adaptation:
      'Dolphins use echolocation to help detect objects and prey underwater.',
  },
  {
    id: 3,
    name: 'Sea Turtle',
    emoji: '🐢',
    group: 'Reptile',
    habitat: 'Warm and temperate oceans',
    description:
      'Sea turtles spend most of their lives in the ocean but females return to land to lay eggs.',
    diet: 'Depends on species',
    adaptation:
      'Their streamlined bodies and flippers help them travel through water.',
  },
  {
    id: 4,
    name: 'Great White Shark',
    emoji: '🦈',
    group: 'Fish',
    habitat: 'Coastal and open ocean',
    description:
      'A large predatory fish found in several oceans.',
    diet: 'Fish, rays, and marine animals',
    adaptation:
      'Its streamlined body and powerful tail help it swim efficiently.',
  },
  {
    id: 5,
    name: 'Clownfish',
    emoji: '🐠',
    group: 'Fish',
    habitat: 'Coral reefs',
    description:
      'A colourful reef fish that can live among the tentacles of certain sea anemones.',
    diet: 'Small organisms and food particles',
    adaptation:
      'Its relationship with sea anemones provides protection.',
  },
  {
    id: 6,
    name: 'Octopus',
    emoji: '🐙',
    group: 'Mollusc',
    habitat: 'Seafloor and rocky habitats',
    description:
      'An intelligent marine animal with eight arms.',
    diet: 'Crabs, fish, and other animals',
    adaptation:
      'It can change colour and texture to communicate and camouflage itself.',
  },
  {
    id: 7,
    name: 'Jellyfish',
    emoji: '🪼',
    group: 'Cnidarian',
    habitat: 'Open ocean and coastal waters',
    description:
      'Jellyfish are soft-bodied animals that drift or swim through the water.',
    diet: 'Small plankton and marine animals',
    adaptation:
      'Many species use stinging cells to capture prey and defend themselves.',
  },
  {
    id: 8,
    name: 'Penguin',
    emoji: '🐧',
    group: 'Bird',
    habitat: 'Southern Hemisphere',
    description:
      'Penguins are flightless birds adapted for swimming.',
    diet: 'Fish, squid, and krill',
    adaptation:
      'Their streamlined bodies and flipper-like wings help them move underwater.',
  },
  {
    id: 9,
    name: 'Seahorse',
    emoji: '🦄',
    group: 'Fish',
    habitat: 'Seagrass beds and coral reefs',
    description:
      'A small fish with an unusual upright body shape.',
    diet: 'Tiny crustaceans and plankton',
    adaptation:
      'Its tail can grip plants and other objects to help it stay in place.',
  },
  {
    id: 10,
    name: 'Sea Star',
    emoji: '⭐',
    group: 'Echinoderm',
    habitat: 'Seafloor',
    description:
      'A marine animal with arms arranged around a central body.',
    diet: 'Varies by species',
    adaptation:
      'Its tube feet help it move and interact with surfaces.',
  },
  {
    id: 11,
    name: 'Sea Lion',
    emoji: '🦭',
    group: 'Mammal',
    habitat: 'Coastal waters',
    description:
      'A marine mammal that uses flippers to swim and can move on land.',
    diet: 'Fish and squid',
    adaptation:
      'Its streamlined body and flippers make it an effective swimmer.',
  },
  {
    id: 12,
    name: 'Krill',
    emoji: '🦐',
    group: 'Crustacean',
    habitat: 'Open ocean',
    description:
      'Tiny shrimp-like animals that are an important part of many marine food webs.',
    diet: 'Mostly phytoplankton',
    adaptation:
      'Krill often gather in large groups called swarms.',
  },
];

const ECOSYSTEMS: Ecosystem[] = [
  {
    id: 1,
    name: 'Coral Reef',
    emoji: '🪸',
    description:
      'A complex marine ecosystem built around coral colonies.',
    organisms: ['🐠 Reef fish', '🐢 Turtles', '🐙 Octopus', '🦀 Crabs'],
    importance:
      'Coral reefs provide habitat for many species and support coastal communities.',
  },
  {
    id: 2,
    name: 'Kelp Forest',
    emoji: '🌿',
    description:
      'An underwater habitat formed by tall brown algae called kelp.',
    organisms: ['🦦 Sea otters', '🐟 Fish', '🦀 Crabs', '⭐ Sea stars'],
    importance:
      'Kelp forests provide food and shelter for many marine organisms.',
  },
  {
    id: 3,
    name: 'Mangrove',
    emoji: '🌱',
    description:
      'A coastal ecosystem where salt-tolerant trees grow in shallow water.',
    organisms: ['🐟 Young fish', '🦀 Crabs', '🐦 Birds', '🦐 Shrimp'],
    importance:
      'Mangroves provide nursery habitats and help protect coastlines.',
  },
  {
    id: 4,
    name: 'Seagrass Meadow',
    emoji: '🌱',
    description:
      'An underwater meadow made of flowering plants adapted to live in seawater.',
    organisms: ['🐢 Turtles', '🐠 Fish', '🦐 Shrimp', '🐚 Molluscs'],
    importance:
      'Seagrass meadows provide habitat and help store carbon.',
  },
  {
    id: 5,
    name: 'Deep Ocean',
    emoji: '🌑',
    description:
      'The dark, high-pressure environment far below the ocean surface.',
    organisms: ['🦑 Squid', '🐟 Deep-sea fish', '🪼 Jellyfish', '🦠 Microbes'],
    importance:
      'The deep ocean contains unique organisms and plays an important role in Earth systems.',
  },
  {
    id: 6,
    name: 'Polar Ocean',
    emoji: '🧊',
    description:
      'Extremely cold ocean environments near the Arctic and Antarctica.',
    organisms: ['🐧 Penguins', '🦭 Seals', '🐋 Whales', '🦐 Krill'],
    importance:
      'Polar oceans support specialised food webs and influence global climate.',
  },
];

const CHALLENGES: Challenge[] = [
  {
    question: 'Which is the largest ocean?',
    options: [
      'Pacific Ocean',
      'Atlantic Ocean',
      'Indian Ocean',
      'Arctic Ocean',
    ],
    answer: 'Pacific Ocean',
    explanation:
      'The Pacific Ocean is the largest of Earth’s five oceans.',
  },
  {
    question: 'Which animal is a marine mammal?',
    options: ['Dolphin', 'Clownfish', 'Octopus', 'Sea star'],
    answer: 'Dolphin',
    explanation:
      'Dolphins are mammals. They breathe air and nurse their young.',
  },
  {
    question: 'What is an important food source for many whales?',
    options: ['Krill', 'Grass', 'Leaves', 'Seeds'],
    answer: 'Krill',
    explanation:
      'Many whales, including blue whales, feed on large quantities of krill.',
  },
  {
    question: 'Which ecosystem is built around coral?',
    options: [
      'Coral reef',
      'Kelp forest',
      'Desert',
      'Tundra',
    ],
    answer: 'Coral reef',
    explanation:
      'Coral reefs provide complex habitats for many marine species.',
  },
  {
    question: 'Which ocean surrounds Antarctica?',
    options: [
      'Southern Ocean',
      'Arctic Ocean',
      'Atlantic Ocean',
      'Indian Ocean',
    ],
    answer: 'Southern Ocean',
    explanation:
      'The Southern Ocean surrounds Antarctica.',
  },
  {
    question: 'Which animal uses echolocation?',
    options: ['Dolphin', 'Sea turtle', 'Penguin', 'Sea star'],
    answer: 'Dolphin',
    explanation:
      'Dolphins use echolocation to help detect objects and prey.',
  },
  {
    question: 'What are seagrasses?',
    options: [
      'Flowering plants',
      'Fish',
      'Corals',
      'Mammals',
    ],
    answer: 'Flowering plants',
    explanation:
      'Seagrasses are flowering plants that have adapted to live underwater.',
  },
  {
    question: 'What is one important role of mangroves?',
    options: [
      'Provide coastal habitat',
      'Make mountains',
      'Create deserts',
      'Freeze oceans',
    ],
    answer: 'Provide coastal habitat',
    explanation:
      'Mangroves provide important habitat for many coastal species.',
  },
  {
    question: 'Which animal is a fish?',
    options: [
      'Clownfish',
      'Dolphin',
      'Penguin',
      'Sea turtle',
    ],
    answer: 'Clownfish',
    explanation:
      'Clownfish are fish that commonly live around coral reefs.',
  },
  {
    question: 'What is plankton?',
    options: [
      'Tiny drifting organisms',
      'A type of whale',
      'A kind of coral',
      'A sea mountain',
    ],
    answer: 'Tiny drifting organisms',
    explanation:
      'Plankton are organisms that drift with currents. They form the foundation of many ocean food webs.',
  },
];

const CATEGORIES: {
  id: OceanCategory;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'oceans',
    label: 'Five Oceans',
    icon: <Globe2 className="w-4 h-4" />,
  },
  {
    id: 'marine-life',
    label: 'Marine Life',
    icon: <Fish className="w-4 h-4" />,
  },
  {
    id: 'ecosystems',
    label: 'Habitats',
    icon: <Leaf className="w-4 h-4" />,
  },
  {
    id: 'science',
    label: 'Ocean Science',
    icon: <Microscope className="w-4 h-4" />,
  },
];

const getStage = (level: number) => {
  if (level <= 2) return 'foundation';
  if (level === 3) return 'developing';
  return 'advanced';
};

export const OceanExplorer: React.FC = () => {
  const profile = useProfileStore(
    (state) => state.profiles[state.currentProfileId]
  );

  const completeActivity = useProgressStore(
    (state) => state.completeActivity
  );

  const currentLevel = profile?.currentLevel ?? 1;
  const stage = getStage(currentLevel);

  const [category, setCategory] =
    useState<OceanCategory>('oceans');

  const [selectedOcean, setSelectedOcean] =
    useState<number | null>(null);

  const [selectedLife, setSelectedLife] =
    useState<number | null>(null);

  const [selectedEcosystem, setSelectedEcosystem] =
    useState<number | null>(null);

  const [challengeIndex, setChallengeIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] =
    useState<string | null>(null);

  const [score, setScore] = useState(0);
  const [challengeComplete, setChallengeComplete] =
    useState(false);

  const selectedOceanData = OCEANS.find(
    (ocean) => ocean.id === selectedOcean
  );

  const selectedLifeData = MARINE_LIFE.find(
    (life) => life.id === selectedLife
  );

  const selectedEcosystemData = ECOSYSTEMS.find(
    (ecosystem) => ecosystem.id === selectedEcosystem
  );

  const currentChallenge = CHALLENGES[challengeIndex];

  const marineGroups = useMemo(() => {
    return [...new Set(MARINE_LIFE.map((life) => life.group))];
  }, []);

  const handleOceanClick = (ocean: Ocean) => {
    setSelectedOcean(ocean.id);

    speakWord(
      `${ocean.name}. ${ocean.fact}. ${ocean.description}`
    );
  };

  const handleLifeClick = (life: MarineLife) => {
    setSelectedLife(life.id);

    speakWord(
      `${life.name}. ${life.description}`
    );
  };

  const handleEcosystemClick = (ecosystem: Ecosystem) => {
    setSelectedEcosystem(ecosystem.id);

    speakWord(
      `${ecosystem.name}. ${ecosystem.description}`
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
        id: 'geography-ocean-explorer',
        score: percentage,
        academyId: 'global',
        domain: 'science',
        skillIds: [
          'ocean-geography',
          'marine-life',
          'ocean-ecosystems',
          'food-webs',
          'adaptation',
          'environmental-awareness',
          'scientific-vocabulary',
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
    setSelectedOcean(null);
    setSelectedLife(null);
    setSelectedEcosystem(null);
    resetChallenge();
    setCategory('oceans');
  };

  return (
    <div className="max-w-5xl mx-auto bg-app-card rounded-3xl border border-app-border shadow-xl overflow-hidden">
      {/* HEADER */}
      <div className="p-6 border-b border-app-border bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Waves className="w-7 h-7 text-cyan-400" />

              <h3 className="text-2xl font-bold text-white">
                Ocean & Marine Life Explorer
              </h3>
            </div>

            <p className="text-gray-400 text-sm mt-2 max-w-2xl">
              Explore Earth's five oceans, discover marine animals,
              investigate ocean habitats, and learn how life survives
              underwater.
            </p>
          </div>

          <button
            type="button"
            onClick={resetExplorer}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white"
            aria-label="Reset ocean explorer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-4 text-xs">
          <span className="text-gray-500">
            Geography + Science • Level {currentLevel}
          </span>

          <span className="text-cyan-400 capitalize">
            {stage} explorer
          </span>
        </div>
      </div>

      {/* CATEGORY NAVIGATION */}
      <div className="p-4 border-b border-app-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {CATEGORIES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCategory(item.id)}
              className={`flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-xs font-semibold transition-all ${
                category === item.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                  : 'bg-white/5 text-gray-400 border border-white/5 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* FIVE OCEANS */}
          {category === 'oceans' && (
            <motion.div
              key="oceans"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="text-center mb-6">
                <p className="text-gray-300 text-sm">
                  Earth has five recognised oceans. Explore each one.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {OCEANS.map((ocean) => {
                  const selected =
                    selectedOcean === ocean.id;

                  return (
                    <motion.button
                      key={ocean.id}
                      type="button"
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOceanClick(ocean)}
                      className={`text-left p-5 rounded-2xl border transition-all ${
                        selected
                          ? 'bg-cyan-500/15 border-cyan-400/50'
                          : 'bg-white/[0.03] border-white/10 hover:border-cyan-400/30'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-4xl">
                          {ocean.emoji}
                        </span>

                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-bold text-white">
                              {ocean.name}
                            </h4>

                            <Volume2 className="w-4 h-4 text-cyan-400" />
                          </div>

                          <p className="text-xs text-gray-500 mt-1">
                            {ocean.location}
                          </p>

                          {selected && (
                            <motion.div
                              initial={{
                                opacity: 0,
                                height: 0,
                              }}
                              animate={{
                                opacity: 1,
                                height: 'auto',
                              }}
                              className="mt-4"
                            >
                              <p className="text-sm text-gray-300 leading-relaxed">
                                {ocean.description}
                              </p>

                              <div className="mt-3 p-3 rounded-xl bg-black/20">
                                <p className="text-xs text-cyan-300 font-semibold">
                                  Ocean life
                                </p>

                                <div className="flex flex-wrap gap-2 mt-2">
                                  {ocean.life.map(
                                    (item) => (
                                      <span
                                        key={item}
                                        className="text-xs text-gray-400"
                                      >
                                        {item}
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* MARINE LIFE */}
          {category === 'marine-life' && (
            <motion.div
              key="marine-life"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex items-center gap-2 mb-5">
                <Fish className="w-5 h-5 text-cyan-400" />

                <div>
                  <h4 className="font-bold text-white">
                    Life Beneath the Waves
                  </h4>

                  <p className="text-xs text-gray-500">
                    Animals belong to different biological groups.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                {marineGroups.map((group) => (
                  <span
                    key={group}
                    className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400"
                  >
                    {group}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {MARINE_LIFE.map((life) => {
                  const selected =
                    selectedLife === life.id;

                  return (
                    <motion.button
                      key={life.id}
                      type="button"
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleLifeClick(life)}
                      className={`text-left p-4 rounded-2xl border transition-all ${
                        selected
                          ? 'bg-blue-500/15 border-blue-400/50'
                          : 'bg-white/[0.03] border-white/10 hover:border-blue-400/30'
                      }`}
                    >
                      <span className="text-4xl">
                        {life.emoji}
                      </span>

                      <h4 className="text-white font-bold mt-3 text-sm">
                        {life.name}
                      </h4>

                      <p className="text-[11px] text-cyan-400 mt-1">
                        {life.group}
                      </p>

                      {selected && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            height: 0,
                          }}
                          animate={{
                            opacity: 1,
                            height: 'auto',
                          }}
                          className="mt-3"
                        >
                          <p className="text-xs text-gray-400 leading-relaxed">
                            {life.description}
                          </p>

                          <div className="mt-3 space-y-2">
                            <div>
                              <span className="text-[10px] text-gray-500">
                                DIET
                              </span>
                              <p className="text-xs text-gray-300">
                                {life.diet}
                              </p>
                            </div>

                            <div>
                              <span className="text-[10px] text-gray-500">
                                ADAPTATION
                              </span>
                              <p className="text-xs text-gray-300">
                                {life.adaptation}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              speakWord(
                                `${life.name}. ${life.description}`
                              );
                            }}
                            className="mt-3 flex items-center gap-1 text-xs text-cyan-300"
                          >
                            <Volume2 className="w-3 h-3" />
                            Listen
                          </button>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {selectedLifeData && (
                <div className="mt-6 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-400/10">
                  <div className="flex items-start gap-3">
                    <Microscope className="w-5 h-5 text-emerald-400 mt-0.5" />

                    <div>
                      <p className="text-sm font-semibold text-white">
                        Biology connection
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        Ask: How does the{' '}
                        {selectedLifeData.name.toLowerCase()}{' '}
                        survive in its habitat?
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ECOSYSTEMS */}
          {category === 'ecosystems' && (
            <motion.div
              key="ecosystems"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="text-center mb-6">
                <h4 className="text-xl font-bold text-white">
                  Ocean Habitats
                </h4>

                <p className="text-sm text-gray-400 mt-1">
                  Different environments support different communities
                  of living things.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ECOSYSTEMS.map((ecosystem) => {
                  const selected =
                    selectedEcosystem === ecosystem.id;

                  return (
                    <motion.button
                      key={ecosystem.id}
                      type="button"
                      whileHover={{ y: -3 }}
                      onClick={() =>
                        handleEcosystemClick(ecosystem)
                      }
                      className={`text-left p-5 rounded-2xl border transition-all ${
                        selected
                          ? 'bg-emerald-500/10 border-emerald-400/40'
                          : 'bg-white/[0.03] border-white/10 hover:border-emerald-400/30'
                      }`}
                    >
                      <div className="flex gap-4">
                        <span className="text-4xl">
                          {ecosystem.emoji}
                        </span>

                        <div>
                          <h4 className="font-bold text-white">
                            {ecosystem.name}
                          </h4>

                          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                            {ecosystem.description}
                          </p>
                        </div>
                      </div>

                      {selected && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-4"
                        >
                          <p className="text-[10px] uppercase tracking-wider text-gray-500">
                            Who lives here?
                          </p>

                          <div className="flex flex-wrap gap-2 mt-2">
                            {ecosystem.organisms.map(
                              (organism) => (
                                <span
                                  key={organism}
                                  className="px-2 py-1 rounded-lg bg-white/5 text-xs text-gray-300"
                                >
                                  {organism}
                                </span>
                              )
                            )}
                          </div>

                          <div className="mt-3 p-3 rounded-xl bg-black/20">
                            <p className="text-xs text-emerald-300 font-semibold">
                              Why it matters
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                              {ecosystem.importance}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* OCEAN SCIENCE */}
          {category === 'science' && (
            <motion.div
              key="science"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="text-center mb-6">
                <Microscope className="w-8 h-8 mx-auto text-cyan-400" />

                <h4 className="text-xl font-bold text-white mt-2">
                  Ocean Science
                </h4>

                <p className="text-sm text-gray-400 mt-1">
                  Oceans are living systems connected to the whole planet.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '🦠 Plankton',
                    text:
                      'Tiny organisms that drift in water. Phytoplankton use sunlight to make food and form the foundation of many ocean food webs.',
                  },
                  {
                    title: '☀️ Sunlight Zone',
                    text:
                      'The upper ocean receives sunlight. Many organisms live here because light supports photosynthesis.',
                  },
                  {
                    title: '🌑 Deep Ocean',
                    text:
                      'Far below the surface, there is little or no sunlight and pressure becomes very high. Animals here have special adaptations.',
                  },
                  {
                    title: '🍽️ Food Webs',
                    text:
                      'Energy moves through ocean food webs from producers such as phytoplankton to animals that eat them and to larger predators.',
                  },
                  {
                    title: '🫧 Oxygen',
                    text:
                      'Ocean organisms, especially tiny photosynthetic organisms such as phytoplankton, contribute significantly to Earth’s oxygen cycle.',
                  },
                  {
                    title: '🌡️ Ocean & Climate',
                    text:
                      'Oceans absorb and move heat around the planet and play a major role in Earth’s climate system.',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="p-5 rounded-2xl bg-white/[0.03] border border-white/10"
                  >
                    <h4 className="font-bold text-white">
                      {item.title}
                    </h4>

                    <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-5 rounded-2xl bg-cyan-500/5 border border-cyan-400/10">
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-cyan-400 mt-0.5" />

                  <div>
                    <p className="font-semibold text-white">
                      Protecting ocean life
                    </p>

                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      Healthy oceans support countless organisms and
                      people. Reducing pollution, protecting habitats,
                      and using marine resources responsibly can help
                      protect ocean ecosystems.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* CHALLENGE */}
          {category === 'science' && (
            <div className="mt-8 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setCategory('oceans');
                  resetChallenge();
                }}
                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-colors"
              >
                Explore more, then try the Ocean Challenge below
              </button>
            </div>
          )}
        </AnimatePresence>

        {/* CHALLENGE PANEL */}
        <div className="mt-8 pt-6 border-t border-white/10">
          {!challengeComplete ? (
            <>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-purple-400 font-semibold">
                    Ocean Knowledge Challenge
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Question {challengeIndex + 1} of{' '}
                    {CHALLENGES.length}
                  </p>
                </div>

                <span className="text-xs text-gray-500">
                  Score: {score}
                </span>
              </div>

              <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-5">
                <motion.div
                  className="h-full bg-cyan-400 rounded-full"
                  animate={{
                    width: `${
                      ((challengeIndex + 1) /
                        CHALLENGES.length) *
                      100
                    }%`,
                  }}
                />
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                <h4 className="text-lg font-bold text-white">
                  {currentChallenge.question}
                </h4>

                <button
                  type="button"
                  onClick={() =>
                    speakWord(currentChallenge.question)
                  }
                  className="flex items-center gap-2 mt-3 text-xs text-cyan-300"
                >
                  <Volume2 className="w-4 h-4" />
                  Hear question
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
                  {currentChallenge.options.map(
                    (option) => {
                      const isCorrect =
                        selectedAnswer &&
                        option === currentChallenge.answer;

                      const isWrong =
                        selectedAnswer === option &&
                        option !== currentChallenge.answer;

                      return (
                        <button
                          key={option}
                          type="button"
                          disabled={Boolean(selectedAnswer)}
                          onClick={() =>
                            handleAnswer(option)
                          }
                          className={`p-4 rounded-xl border text-left transition-all ${
                            isCorrect
                              ? 'bg-emerald-500/15 border-emerald-400/50'
                              : isWrong
                              ? 'bg-red-500/15 border-red-400/50'
                              : 'bg-white/[0.03] border-white/10 hover:border-cyan-400/30'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-white font-semibold">
                              {option}
                            </span>

                            {isCorrect && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            )}

                            {isWrong && (
                              <XCircle className="w-5 h-5 text-red-400" />
                            )}
                          </div>
                        </button>
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
                        ? 'Excellent ocean scientist! 🌊'
                        : `The correct answer is ${currentChallenge.answer}.`}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {currentChallenge.explanation}
                    </p>

                    <button
                      type="button"
                      onClick={nextQuestion}
                      className="w-full mt-4 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors"
                    >
                      {challengeIndex ===
                      CHALLENGES.length - 1
                        ? 'Finish Challenge'
                        : 'Next Question'}
                    </button>
                  </motion.div>
                )}
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-emerald-400" />
              </div>

              <h4 className="text-xl font-bold text-white mt-4">
                Ocean Explorer Complete
              </h4>

              <p className="text-gray-400 text-sm mt-2">
                You scored {score} out of {CHALLENGES.length}.
              </p>

              <div className="flex flex-wrap justify-center gap-2 mt-5">
                {[
                  'Ocean Geography',
                  'Marine Biology',
                  'Ecosystems',
                  'Adaptation',
                  'Food Webs',
                  'Environmental Awareness',
                ].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-xs text-cyan-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={resetChallenge}
                className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="px-6 pb-6">
        <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800">
          <div className="flex items-start gap-3">
            <Waves className="w-5 h-5 text-cyan-400 mt-0.5" />

            <div>
              <p className="text-sm font-semibold text-white">
                Think like an ocean scientist
              </p>

              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Ask three questions: What lives here? How does it
                survive? How do living things depend on one another?
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
