import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  ArrowRight,
  Brain,
  Eye,
  Zap,
  Lightbulb,
  RotateCcw,
  Volume2,
} from 'lucide-react';

import { playSoundFeedback } from '../../../services/soundFeedback';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

type GameType = 'observation' | 'memory' | 'critical' | 'meta';

export const ThinkingLab: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [score, setScore] = useState(0);

  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const { speak } = useReadAloud();

  /* Auto-read the lab intro once on the hub */
  useEffect(() => {
    if (!autoReadEnabled || selectedGame !== null) return;

    const timer = window.setTimeout(() => {
      speak(
        'The Thinking Lab. Train your brain to learn faster and smarter!',
      );
    }, 500);

    return () => window.clearTimeout(timer);
  }, [selectedGame, speak, autoReadEnabled]);

  const gameSelection = [
    {
      id: 'observation' as const,
      title: 'Observation',
      icon: <Eye className="w-8 h-8" />,
      color: 'bg-blue-500',
      description: 'Spot the hidden detail!',
    },
    {
      id: 'memory' as const,
      title: 'Memory Flash',
      icon: <Brain className="w-8 h-8" />,
      color: 'bg-purple-500',
      description: 'Remember the sequence!',
    },
    {
      id: 'critical' as const,
      title: 'Critical Thinking',
      icon: <Zap className="w-8 h-8" />,
      color: 'bg-green-500',
      description: 'True or False?',
    },
    {
      id: 'meta' as const,
      title: 'Meta Learning',
      icon: <Lightbulb className="w-8 h-8" />,
      color: 'bg-yellow-500',
      description: 'How do YOU learn best?',
    },
  ];

  if (selectedGame === 'observation')
    return (
      <ObservationGame
        score={score}
        setScore={setScore}
        onBack={() => setSelectedGame(null)}
      />
    );
  if (selectedGame === 'memory')
    return (
      <MemoryGame
        score={score}
        setScore={setScore}
        onBack={() => setSelectedGame(null)}
      />
    );
  if (selectedGame === 'critical')
    return (
      <CriticalGame
        score={score}
        setScore={setScore}
        onBack={() => setSelectedGame(null)}
      />
    );
  if (selectedGame === 'meta')
    return (
      <MetaGame
        score={score}
        setScore={setScore}
        onBack={() => setSelectedGame(null)}
      />
    );

  return (
    <div className="max-w-2xl mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-3xl font-bold text-white">🧠 The Thinking Lab</h2>

        <div className="flex items-center gap-3">
          <span className="text-yellow-400 font-bold">⭐ Score: {score}</span>

          <button
            type="button"
            onClick={toggleSound}
            aria-label="Toggle sound"
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Volume2
              className={`w-4 h-4 ${
                soundEnabled ? 'text-amber-300' : 'text-gray-500'
              }`}
            />
          </button>
        </div>
      </div>

      <p className="text-gray-400 mb-6">
        Train your brain to learn faster and smarter!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gameSelection.map((game) => (
          <motion.button
            key={game.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (soundEnabled) playSoundFeedback('move');
              setSelectedGame(game.id);
            }}
            className={`${game.color} bg-opacity-20 p-6 rounded-xl border-2 border-white/10 hover:border-white/40 flex flex-col items-center text-center transition-all`}
          >
            <div
              className={`${game.color} text-white p-3 rounded-full mb-3`}
            >
              {game.icon}
            </div>

            <h3 className="text-white font-bold text-lg">{game.title}</h3>

            <p className="text-gray-400 text-sm mt-1">{game.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

/* ============ GAME 1: OBSERVATION ============ */

const ObservationGame: React.FC<{
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  onBack: () => void;
}> = ({ score, setScore, onBack }) => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);

  const { speak } = useReadAloud();

  const puzzles = [
    {
      emojis: ['🍎', '🍌', '🍎', '🍌', '🍓'],
      target: 4,
      question: 'Which one is different?',
    },
    {
      emojis: ['🐶', '🐱', '🐶', '🐶', '🐱'],
      target: 0,
      question: 'Which one is the cat?',
    },
    {
      emojis: ['🔵', '🔴', '🔴', '🔴', '🔴'],
      target: 0,
      question: 'Which one is blue?',
    },
    {
      emojis: ['🟩', '🟨', '🟨', '🟨', '🟨'],
      target: 0,
      question: 'Which one is green?',
    },
    {
      emojis: ['⚽', '🎾', '⚽', '⚽', '⚽'],
      target: 1,
      question: 'Which one is a tennis ball?',
    },
  ];

  const current = puzzles[index];

  /* Auto-read the question when the puzzle changes */
  useEffect(() => {
    if (!autoReadEnabled || !current) return;

    const timer = window.setTimeout(() => {
      speak(current.question);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [index, current, speak, autoReadEnabled]);

  const handleSelect = (i: number) => {
    if (selected !== null) return;

    setSelected(i);

    if (i === current.target) {
      if (soundEnabled) playSoundFeedback('correct');
      setScore(score + 10);
      speak('Correct!');
    } else {
      if (soundEnabled) playSoundFeedback('try-again');
      speak('Not quite. Look carefully at the pictures.');
    }

    setTimeout(() => {
      setSelected(null);
      if (index < puzzles.length - 1) setIndex(index + 1);
      else onBack();
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onBack}
          className="text-sm text-gray-400 hover:text-white"
        >
          ← Back
        </button>

        <h3 className="text-xl font-bold text-white">👁️ Observation</h3>

        <span className="text-yellow-400 font-bold">⭐ {score}</span>
      </div>

      <p className="text-gray-400 mb-6">{current.question}</p>

      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {current.emojis.map((emoji, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSelect(i)}
            className={`w-16 h-16 rounded-xl border-2 text-3xl flex items-center justify-center ${
              selected === i && i === current.target
                ? 'bg-green-500/20 border-green-400'
                : selected === i
                  ? 'bg-red-500/20 border-red-400'
                  : 'bg-gray-800 border-gray-700'
            }`}
          >
            {emoji}
          </motion.button>
        ))}
      </div>

      {selected !== null && selected === current.target && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-green-400 font-bold"
        >
          <CheckCircle className="w-5 h-5 inline mr-1" /> Correct!
        </motion.div>
      )}
    </div>
  );
};

/* ============ GAME 2: MEMORY FLASH ============ */

const MemoryGame: React.FC<{
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  onBack: () => void;
}> = ({ score, setScore, onBack }) => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [userSeq, setUserSeq] = useState<string[]>([]);
  const [showingSeq, setShowingSeq] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [round, setRound] = useState(1);
  const [index, setIndex] = useState(0);

  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);

  const { speak } = useReadAloud();

  const colors = ['🔴', '🔵', '🟡', '🟢'];

  useEffect(() => {
    if (gameOver) return;

    const newSeq = Array.from({ length: round }, () =>
      colors[Math.floor(Math.random() * colors.length)],
    );

    setSequence(newSeq);
    setUserSeq([]);
    setIndex(0);
    setShowingSeq(true);

    if (autoReadEnabled) {
      speak(`Round ${round}. Watch the sequence.`);
    }

    const timer = setTimeout(() => setShowingSeq(false), round * 800);
    return () => clearTimeout(timer);
  }, [round, gameOver, autoReadEnabled, speak]);

  /* Announce the child's turn */
  useEffect(() => {
    if (showingSeq || gameOver) return;
    if (!autoReadEnabled) return;

    speak('Your turn. Repeat the sequence.');
  }, [showingSeq, gameOver, autoReadEnabled, speak]);

  const handleSelect = (color: string) => {
    if (showingSeq) return;

    const newUser = [...userSeq, color];
    setUserSeq(newUser);

    if (color !== sequence[userSeq.length]) {
      if (soundEnabled) playSoundFeedback('try-again');

      setGameOver(true);
      speak(`Game over. You reached round ${round}. Well done!`);
      return;
    }

    if (soundEnabled) playSoundFeedback('move');

    if (newUser.length === sequence.length) {
      if (soundEnabled) playSoundFeedback('correct');

      setScore(score + 10);
      setRound(round + 1);
      speak('Correct! Here comes the next round.');
    }
  };

  if (gameOver) {
    return (
      <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
        <h3 className="text-2xl font-bold text-white mb-4">🎯 Game Over!</h3>

        <p className="text-gray-400 mb-4">
          You reached round {round}! Score: {score}
        </p>

        <button
          onClick={() => {
            setRound(1);
            setScore(0);
            setGameOver(false);

            speak("Let's play Memory Flash again!");
          }}
          className="px-6 py-3 bg-indigo-600 rounded-xl text-white font-bold"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onBack}
          className="text-sm text-gray-400 hover:text-white"
        >
          ← Back
        </button>

        <h3 className="text-xl font-bold text-white">🧠 Memory Flash</h3>

        <span className="text-yellow-400 font-bold">⭐ {score}</span>
      </div>

      <p className="text-gray-400 mb-4">
        Round {round} - Repeat the sequence!
      </p>

      <div className="flex justify-center gap-3 mb-8">
        {sequence.map((color, i) => (
          <div
            key={i}
            className={`w-14 h-14 rounded-xl border-2 text-2xl flex items-center justify-center transition-all ${
              showingSeq
                ? 'bg-gray-800 border-white'
                : 'bg-gray-900 border-gray-700'
            } ${i === index && showingSeq ? 'scale-110' : ''}`}
          >
            {showingSeq ? color : '?'}
          </div>
        ))}
      </div>

      <p className="text-gray-400 text-sm mb-4">Your turn:</p>

      <div className="flex justify-center gap-3">
        {colors.map((color) => (
          <motion.button
            key={color}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSelect(color)}
            className="w-14 h-14 rounded-xl border-2 border-gray-700 bg-gray-800 text-2xl flex items-center justify-center"
          >
            {color}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

/* ============ GAME 3: CRITICAL THINKING ============ */

const CriticalGame: React.FC<{
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  onBack: () => void;
}> = ({ score, setScore, onBack }) => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<boolean | null>(null);

  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);

  const { speak } = useReadAloud();

  const questions = [
    { text: 'Water is wet.', answer: true },
    { text: 'The sun is a star.', answer: true },
    { text: 'Cats can fly.', answer: false },
    { text: 'Fish live on land.', answer: false },
    { text: '2 + 2 = 5', answer: false },
    { text: 'Ice is cold.', answer: true },
    { text: 'Trees make oxygen.', answer: true },
    { text: 'Rocks can eat.', answer: false },
  ];

  const current = questions[index];

  /* Auto-read the question when it changes */
  useEffect(() => {
    if (!autoReadEnabled || !current) return;

    const timer = window.setTimeout(() => {
      speak(`True or false? ${current.text}`);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [index, current, speak, autoReadEnabled]);

  const handleSelect = (answer: boolean) => {
    if (selected !== null) return;

    setSelected(answer);

    if (answer === current.answer) {
      if (soundEnabled) playSoundFeedback('correct');
      setScore(score + 10);
      speak('Correct!');
    } else {
      if (soundEnabled) playSoundFeedback('try-again');
      speak(
        `Not quite. The answer was ${
          current.answer ? 'true' : 'false'
        }.`,
      );
    }

    setTimeout(() => {
      setSelected(null);
      if (index < questions.length - 1) setIndex(index + 1);
      else onBack();
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onBack}
          className="text-sm text-gray-400 hover:text-white"
        >
          ← Back
        </button>

        <h3 className="text-xl font-bold text-white">
          ⚡ Critical Thinking
        </h3>

        <span className="text-yellow-400 font-bold">⭐ {score}</span>
      </div>

      <p className="text-white font-bold text-xl mb-6">{current.text}</p>

      <div className="flex justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSelect(true)}
          className={`px-6 py-3 rounded-xl text-white font-bold border-2 ${
            selected === true
              ? current.answer
                ? 'bg-green-500 border-green-400'
                : 'bg-red-500 border-red-400'
              : 'bg-gray-800 border-gray-700'
          }`}
        >
          ✅ True
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSelect(false)}
          className={`px-6 py-3 rounded-xl text-white font-bold border-2 ${
            selected === false
              ? current.answer
                ? 'bg-red-500 border-red-400'
                : 'bg-green-500 border-green-400'
              : 'bg-gray-800 border-gray-700'
          }`}
        >
          ❌ False
        </motion.button>
      </div>
    </div>
  );
};

/* ============ GAME 4: META LEARNING ============ */

const MetaGame: React.FC<{
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  onBack: () => void;
}> = ({ score, setScore, onBack }) => {
  const [selected, setSelected] = useState<number | null>(null);

  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);

  const { speak } = useReadAloud();

  const questions = [
    {
      question: 'How do you remember a new word best?',
      options: ['Seeing it', 'Hearing it', 'Writing it down', 'Saying it out loud'],
    },
    {
      question: 'When you are stuck on a problem, what should you do first?',
      options: ['Give up', 'Take a deep breath', 'Cry', 'Run away'],
    },
    {
      question: 'What helps you concentrate the most?',
      options: ['A quiet room', 'Loud music', 'Watching TV', 'Playing games'],
    },
    {
      question: 'How do you celebrate a mistake?',
      options: ['Get angry', 'Learn from it', 'Hide it', 'Blame someone'],
    },
  ];

  const current = questions[selected === null ? 0 : selected % questions.length];

  /* Auto-read the question when it changes */
  useEffect(() => {
    if (!autoReadEnabled || !current) return;

    const timer = window.setTimeout(() => {
      speak(current.question);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [selected, current, speak, autoReadEnabled]);

  const handleSelect = (i: number) => {
    setSelected(i);
    setScore(score + 5);

    speak(
      "That's a great answer! Understanding how you learn makes you a Master Learner!",
    );
  };

  return (
    <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onBack}
          className="text-sm text-gray-400 hover:text-white"
        >
          ← Back
        </button>

        <h3 className="text-xl font-bold text-white">💡 Meta Learning</h3>

        <span className="text-yellow-400 font-bold">⭐ {score}</span>
      </div>

      <p className="text-gray-400 text-sm mb-4">
        There are no wrong answers. Just be honest!
      </p>

      <p className="text-white font-bold text-lg mb-6">{current.question}</p>

      <div className="space-y-3">
        {current.options.map((option, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(i)}
            className={`w-full p-3 rounded-xl border-2 font-bold transition-all ${
              selected === i
                ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300'
                : 'bg-gray-800 border-gray-700 text-white'
            }`}
          >
            {option}
          </motion.button>
        ))}
      </div>

      {selected !== null && (
        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-yellow-300 text-sm">
          💛 That&apos;s a great answer! Understanding how you learn makes you a
          Master Learner!
          <button
            onClick={onBack}
            className="block mx-auto mt-3 px-4 py-2 bg-yellow-600 rounded-lg text-white font-bold"
          >
            Finish Lab
          </button>
        </div>
      )}
    </div>
  );
};