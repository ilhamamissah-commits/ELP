import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  ArrowRight,
  RotateCcw,
  Monitor,
  Keyboard,
  Mouse,
  Cpu,
  Printer,
  Smartphone,
  Volume2,
  Camera,
  HardDrive,
  Wifi,
  ShieldCheck,
  Lightbulb,
} from 'lucide-react';

import { playSoundFeedback } from '../../../services/soundFeedback';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

type ComputerConcept =
  | 'display'
  | 'input'
  | 'processing'
  | 'output'
  | 'mobile'
  | 'audio'
  | 'camera'
  | 'storage'
  | 'network'
  | 'safety';

interface ComputerPart {
  id: number;
  name: string;
  concept: ComputerConcept;
  description: string;
  example: string;
  icon: React.ReactNode;
  question: string;
  answer: string;
  options: string[];
  explanation: string;
}

const COMPUTER_PARTS: ComputerPart[] = [
  {
    id: 1,
    name: 'Monitor',
    concept: 'display',
    description:
      'A monitor displays pictures, text, videos and other information from a computer.',
    example: 'You look at the monitor to see what the computer is doing.',
    icon: <Monitor className="w-16 h-16" />,
    question: 'What does a monitor help you do?',
    answer: 'See information',
    options: ['See information', 'Type letters', 'Print paper'],
    explanation:
      'A monitor is an output device. It shows information from the computer.',
  },
  {
    id: 2,
    name: 'Keyboard',
    concept: 'input',
    description:
      'A keyboard lets you enter letters, numbers and commands into a computer.',
    example: 'You can use it to type your name.',
    icon: <Keyboard className="w-16 h-16" />,
    question: 'What can you use a keyboard for?',
    answer: 'Typing',
    options: ['Typing', 'Printing', 'Taking photos'],
    explanation:
      'A keyboard is an input device because it sends information to the computer.',
  },
  {
    id: 3,
    name: 'Mouse',
    concept: 'input',
    description:
      'A mouse helps you point, click, select and move things on a computer screen.',
    example: 'You can click an icon to open an application.',
    icon: <Mouse className="w-16 h-16" />,
    question: 'What can you use a mouse to do?',
    answer: 'Click',
    options: ['Click', 'Print', 'Play sound'],
    explanation:
      'A mouse is an input device. It lets you control the pointer on the screen.',
  },
  {
    id: 4,
    name: 'CPU',
    concept: 'processing',
    description:
      'The CPU processes instructions and helps the computer perform tasks.',
    example:
      'When you open an application, the CPU helps process the instructions needed to run it.',
    icon: <Cpu className="w-16 h-16" />,
    question: 'What does the CPU mainly do?',
    answer: 'Process instructions',
    options: ['Process instructions', 'Print paper', 'Take photographs'],
    explanation:
      'The CPU is a major processing component. It carries out instructions and calculations.',
  },
  {
    id: 5,
    name: 'Printer',
    concept: 'output',
    description:
      'A printer produces a physical copy of digital information on paper.',
    example: 'You can print a drawing or document.',
    icon: <Printer className="w-16 h-16" />,
    question: 'What does a printer produce?',
    answer: 'Paper copies',
    options: ['Paper copies', 'Computer instructions', 'Internet signals'],
    explanation:
      'A printer is an output device because it turns digital information into a physical result.',
  },
  {
    id: 6,
    name: 'Tablet',
    concept: 'mobile',
    description:
      'A tablet is a portable computer that usually uses a touchscreen.',
    example: 'You can tap the screen to open an application.',
    icon: <Smartphone className="w-16 h-16" />,
    question: 'How do you commonly control a tablet?',
    answer: 'Touch the screen',
    options: ['Touch the screen', 'Print the screen', 'Shake the keyboard'],
    explanation: 'Many tablets use touch as an input method.',
  },
  {
    id: 7,
    name: 'Speaker',
    concept: 'audio',
    description: 'Speakers allow a computer or device to produce sound.',
    example:
      'You can hear music, stories and learning instructions through speakers.',
    icon: <Volume2 className="w-16 h-16" />,
    question: 'What does a speaker produce?',
    answer: 'Sound',
    options: ['Sound', 'Paper', 'Pictures'],
    explanation:
      'A speaker is an output device that converts digital audio into sound we can hear.',
  },
  {
    id: 8,
    name: 'Camera',
    concept: 'camera',
    description: 'A camera captures photographs and videos.',
    example:
      'A computer or tablet camera can be used for taking a picture.',
    icon: <Camera className="w-16 h-16" />,
    question: 'What can a camera capture?',
    answer: 'Photos and videos',
    options: [
      'Photos and videos',
      'Paper documents only',
      'Keyboard commands',
    ],
    explanation:
      'A camera is an input device because it captures information and sends it to the device.',
  },
  {
    id: 9,
    name: 'Storage',
    concept: 'storage',
    description:
      'Storage keeps digital information so it can be used later.',
    example: 'Photos, documents and applications can be stored on a device.',
    icon: <HardDrive className="w-16 h-16" />,
    question: 'What does storage help a computer do?',
    answer: 'Keep information',
    options: ['Keep information', 'Make paper', 'Display sound'],
    explanation: 'Storage holds digital information for later use.',
  },
  {
    id: 10,
    name: 'Wi-Fi',
    concept: 'network',
    description:
      'Wi-Fi allows compatible devices to connect to a network without a physical network cable.',
    example: 'A tablet can use Wi-Fi to connect to the internet.',
    icon: <Wifi className="w-16 h-16" />,
    question: 'What can Wi-Fi help a device do?',
    answer: 'Connect to a network',
    options: [
      'Connect to a network',
      'Print without a printer',
      'Turn into a keyboard',
    ],
    explanation:
      'Wi-Fi is a wireless networking technology used to connect devices to networks.',
  },
  {
    id: 11,
    name: 'Digital Safety',
    concept: 'safety',
    description:
      'Digital safety means using devices, information and online services responsibly and carefully.',
    example:
      'Ask a trusted adult before sharing personal information online.',
    icon: <ShieldCheck className="w-16 h-16" />,
    question: 'What should you do before sharing personal information online?',
    answer: 'Ask a trusted adult',
    options: [
      'Ask a trusted adult',
      'Share it with everyone',
      'Post it publicly',
    ],
    explanation:
      'Children should protect personal information and ask a trusted adult when they are unsure.',
  },
];

const CONCEPT_LABELS: Record<ComputerConcept, string> = {
  display: 'Display',
  input: 'Input',
  processing: 'Processing',
  output: 'Output',
  mobile: 'Mobile Computing',
  audio: 'Audio',
  camera: 'Digital Imaging',
  storage: 'Storage',
  network: 'Networks',
  safety: 'Digital Safety',
};

export const ComputerBasics: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const { speak } = useReadAloud();

  const current = COMPUTER_PARTS[index];

  /* Auto-read the current computer part + question when it changes */
  useEffect(() => {
    if (!autoReadEnabled) return;

    const timer = window.setTimeout(() => {
      speak(
        `${current.name}. ${current.description}. ${current.question}`,
      );
    }, 400);

    return () => window.clearTimeout(timer);
  }, [index, current, speak, autoReadEnabled]);

  /* Read the learning tip when it opens */
  useEffect(() => {
    if (showHint && !completed) {
      speak('Think about what the device is designed to help you do.');
    }
  }, [showHint, completed, speak]);

  const handleAnswer = (answer: string) => {
    if (completed) return;

    setSelected(answer);

    if (answer === current.answer) {
      if (soundEnabled) playSoundFeedback('correct');

      setCompleted(true);
      setScore((previous) => previous + 10);

      speak(`Correct! ${current.explanation}`);
    } else {
      if (soundEnabled) playSoundFeedback('try-again');

      speak(
        'Not quite. Think about what this device is used for, and try again.',
      );
    }
  };

  const nextPart = () => {
    setIndex((previous) => (previous + 1) % COMPUTER_PARTS.length);
    setSelected(null);
    setCompleted(false);
    setShowHint(false);
  };

  const resetPart = () => {
    setSelected(null);
    setCompleted(false);
    setShowHint(false);

    speak('Lesson reset.');
  };

  const progress =
    ((index + (completed ? 1 : 0)) / COMPUTER_PARTS.length) * 100;

  return (
    <div className="max-w-2xl mx-auto bg-app-card p-6 rounded-3xl border border-app-border shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-300">
            <Monitor className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              Computer Basics
            </h2>

            <p className="text-sm text-gray-400">
              Discover how computers and digital devices work.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-gray-500">SCORE</div>

            <div className="text-xl font-bold text-white">{score}</div>
          </div>

          <button
            type="button"
            onClick={toggleSound}
            aria-label="Toggle sound"
            className="p-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <Volume2
              className={`w-4 h-4 ${
                soundEnabled ? 'text-amber-300' : 'text-gray-500'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>
            Lesson {index + 1} of {COMPUTER_PARTS.length}
          </span>

          <span>{Math.round(progress)}%</span>
        </div>

        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-500"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Main lesson */}
      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-[#171717] rounded-2xl border border-gray-800 p-6 mb-5 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 text-gray-400 text-xs mb-4">
            {CONCEPT_LABELS[current.concept]}
          </div>

          <div className="flex justify-center text-indigo-300 mb-4">
            {current.icon}
          </div>

          <h3 className="text-2xl font-bold text-white mb-3">
            {current.name}
          </h3>

          <p className="text-gray-300 text-sm leading-6">
            {current.description}
          </p>

          <div className="mt-4 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-left">
            <p className="text-xs uppercase tracking-wide text-indigo-300 font-bold mb-1">
              Example
            </p>

            <p className="text-sm text-gray-300">{current.example}</p>
          </div>
        </div>

        {/* Question */}
        <div className="mb-4">
          <h4 className="text-lg font-bold text-white text-center mb-4">
            {current.question}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {current.options.map((option) => {
              const isSelected = selected === option;
              const isCorrect = option === current.answer;

              let stateClass =
                'bg-gray-800 border-gray-700 hover:border-indigo-400';

              if (completed && isCorrect) {
                stateClass = 'bg-green-500/20 border-green-500 text-green-300';
              } else if (isSelected && !isCorrect) {
                stateClass = 'bg-red-500/20 border-red-500 text-red-300';
              }

              return (
                <motion.button
                  key={option}
                  type="button"
                  whileHover={!completed ? { scale: 1.02 } : undefined}
                  whileTap={!completed ? { scale: 0.98 } : undefined}
                  onClick={() => handleAnswer(option)}
                  disabled={completed}
                  className={`min-h-[64px] px-4 rounded-2xl border-2 text-white font-semibold transition ${stateClass}`}
                >
                  {option}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Hint */}
        {!completed && (
          <button
            type="button"
            onClick={() => setShowHint((previous) => !previous)}
            className="w-full flex items-center justify-center gap-2 py-2 text-sm text-yellow-400 hover:text-yellow-300"
          >
            <Lightbulb className="w-4 h-4" />

            {showHint ? 'Hide Learning Tip' : 'Need Help?'}
          </button>
        )}

        {showHint && !completed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-sm text-yellow-200"
          >
            💡 Think about what the device is designed to help you do.
          </motion.div>
        )}

        {/* Feedback */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-4 rounded-2xl text-center ${
                selected === current.answer
                  ? 'bg-green-500/10 border border-green-500/20'
                  : 'bg-red-500/10 border border-red-500/20'
              }`}
            >
              {selected === current.answer ? (
                <>
                  <CheckCircle className="w-5 h-5 inline mr-2 text-green-400" />

                  <span className="font-bold text-green-400">Correct!</span>

                  <p className="text-sm text-gray-300 mt-2">
                    {current.explanation}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-bold text-red-300">
                    Not quite. Try again!
                  </p>

                  <p className="text-sm text-gray-400 mt-1">
                    Think about what this device is used for.
                  </p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={resetPart}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-white font-bold"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>

          {completed && (
            <button
              type="button"
              onClick={nextPart}
              className="flex-[2] flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-bold"
            >
              Next Lesson
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-800 text-center">
        <p className="text-xs text-gray-500">
          Computers use input, processing, storage and output to help us work
          with information.
        </p>
      </div>
    </div>
  );
};