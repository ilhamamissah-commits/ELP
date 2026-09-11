import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Clock3,
  Lightbulb,
  RotateCcw,
  Volume2,
  Trophy,
} from 'lucide-react';

import { playSoundFeedback } from '../../../services/soundFeedback';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';
import { useProfileStore } from '../../../store/useProfileStore';
import { useProgressStore } from '../../../store/useProgressStore';

type TimeProblem = {
  id: string;
  hour: number;
  minute: number;
  label: string;
  words: string;
  difficulty: 'starter' | 'developing' | 'challenge';
  hint: string;
  explanation: string;
};

const TIMES: TimeProblem[] = [
  {
    id: 'time-1',
    hour: 1,
    minute: 0,
    label: '1:00',
    words: "one o'clock",
    difficulty: 'starter',
    hint: 'The minute hand points to 12 when it is exactly an hour.',
    explanation: 'The minute hand is on 12, so it is exactly 1 o’clock.',
  },
  {
    id: 'time-2',
    hour: 2,
    minute: 30,
    label: '2:30',
    words: 'half past two',
    difficulty: 'starter',
    hint: 'The minute hand points to 6 at 30 minutes.',
    explanation: '30 minutes is half an hour, so 2:30 is half past two.',
  },
  {
    id: 'time-3',
    hour: 6,
    minute: 0,
    label: '6:00',
    words: "six o'clock",
    difficulty: 'starter',
    hint: 'Look at the minute hand first. Is it pointing to 12?',
    explanation: 'The minute hand is on 12, so the time is exactly 6 o’clock.',
  },
  {
    id: 'time-4',
    hour: 9,
    minute: 15,
    label: '9:15',
    words: 'quarter past nine',
    difficulty: 'developing',
    hint: '15 minutes is a quarter of an hour.',
    explanation:
      '15 minutes is a quarter of an hour, so 9:15 is quarter past nine.',
  },
  {
    id: 'time-5',
    hour: 4,
    minute: 45,
    label: '4:45',
    words: 'quarter to five',
    difficulty: 'developing',
    hint: '45 minutes means there are 15 minutes left until the next hour.',
    explanation: '4:45 is 15 minutes before 5, so we can say quarter to five.',
  },
  {
    id: 'time-6',
    hour: 7,
    minute: 30,
    label: '7:30',
    words: 'half past seven',
    difficulty: 'developing',
    hint: 'The minute hand points to 6 for half past.',
    explanation: 'The minute hand is on 6, meaning 30 minutes have passed.',
  },
  {
    id: 'time-7',
    hour: 10,
    minute: 5,
    label: '10:05',
    words: 'five past ten',
    difficulty: 'challenge',
    hint: 'Each number on the clock represents 5 minutes for the minute hand.',
    explanation: 'The minute hand is on 1, which represents 5 minutes.',
  },
  {
    id: 'time-8',
    hour: 11,
    minute: 20,
    label: '11:20',
    words: 'twenty past eleven',
    difficulty: 'challenge',
    hint: 'Count the minute-hand positions in groups of five.',
    explanation: 'The minute hand is on 4. Four groups of five make 20 minutes.',
  },
];

type TimeSkill =
  | 'telling-time'
  | 'clock-reading'
  | 'hour-hand'
  | 'minute-hand'
  | 'five-minute-intervals'
  | 'quarter-and-half-hours'
  | 'mathematical-language';

const SKILLS: TimeSkill[] = [
  'telling-time',
  'clock-reading',
  'hour-hand',
  'minute-hand',
  'five-minute-intervals',
  'quarter-and-half-hours',
  'mathematical-language',
];

const shuffle = <T,>(items: T[]): T[] => {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

const formatTime = (hour: number, minute: number): string =>
  `${hour}:${minute.toString().padStart(2, '0')}`;

const getStage = (level: number) => {
  if (level <= 1) {
    return {
      title: 'Clock Explorer',
      description: 'Learn the hour hand and whole hours.',
    };
  }

  if (level === 2) {
    return {
      title: 'Time Reader',
      description: 'Read half hours and quarter hours.',
    };
  }

  if (level === 3) {
    return {
      title: 'Time Investigator',
      description: 'Read times in five-minute intervals.',
    };
  }

  return {
    title: 'Time Mathematician',
    description: 'Read, reason about and explain time.',
  };
};

const getHandAngles = (hour: number, minute: number) => {
  /*
   * Minute hand:
   * 60 minutes = 360°
   * therefore each minute = 6°
   *
   * Hour hand:
   * 12 hours = 360°
   * therefore each hour = 30°
   *
   * The hour hand also moves as the minutes pass.
   */
  const minuteAngle = minute * 6;
  const hourAngle = ((hour % 12) + minute / 60) * 30;

  return {
    minuteAngle,
    hourAngle,
  };
};

const buildOptions = (current: TimeProblem): string[] => {
  const correct = current.label;

  const distractors = TIMES.filter((time) => time.label !== correct).map(
    (time) => time.label,
  );

  /*
   * Prefer common misconceptions:
   * - correct hour + 45 minutes
   * - next hour
   * - previous hour
   */
  const preferred = [
    formatTime(current.hour, 45),
    formatTime(current.hour + 1 > 12 ? 1 : current.hour + 1, 0),
    formatTime(current.hour - 1 <= 0 ? 12 : current.hour - 1, 30),
  ].filter((value) => value !== correct);

  const uniquePreferred = Array.from(new Set(preferred));

  const selectedDistractors = [...uniquePreferred, ...shuffle(distractors)]
    .filter((value, index, array) => array.indexOf(value) === index)
    .slice(0, 2);

  return shuffle([correct, ...selectedDistractors]);
};

export const ClockGame: React.FC = () => {
  const profile = useProfileStore(
    (state) => state.profiles[state.currentProfileId],
  );

  const currentLevel = profile?.currentLevel ?? 1;

  const completeActivity = useProgressStore((state) => state.completeActivity);

  // Global sound / auto-read settings
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  // useReadAloud already respects soundEnabled + voiceAccent internally
  const { speak } = useReadAloud();

  const [problemIndex, setProblemIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);

  const stage = getStage(currentLevel);

  const sessionProblems = useMemo(() => {
    const eligible = TIMES.filter((time) => {
      if (currentLevel <= 1) {
        return time.minute === 0;
      }

      if (currentLevel === 2) {
        return [0, 15, 30, 45].includes(time.minute);
      }

      return true;
    });

    return shuffle(eligible.length >= 5 ? eligible : TIMES).slice(0, 5);
  }, [currentLevel]);

  const current = sessionProblems[problemIndex];

  const options = useMemo(
    () => (current ? buildOptions(current) : []),
    [current],
  );

  const accuracy =
    attempts > 0 ? Math.round((correctAnswers / attempts) * 100) : 0;

  const progress =
    sessionProblems.length > 0
      ? ((problemIndex + (completed ? 1 : 0)) / sessionProblems.length) * 100
      : 0;

  const { hourAngle, minuteAngle } = current
    ? getHandAngles(current.hour, current.minute)
    : { hourAngle: 0, minuteAngle: 0 };

  // Reset per-question state + auto-read the question (if enabled)
  useEffect(() => {
    setSelected(null);
    setShowHint(false);

    if (current && autoReadEnabled) {
      const timer = window.setTimeout(() => {
        speak(
          'What time is it? Look carefully at the hour hand and minute hand.',
        );
      }, 350);

      return () => window.clearTimeout(timer);
    }
  }, [problemIndex, current, speak, autoReadEnabled]);

  // Read hint aloud when it opens
  useEffect(() => {
    if (showHint && current) {
      speak(current.hint);
    }
  }, [showHint, current, speak]);

  // Announce completion result
  useEffect(() => {
    if (!completed) return;

    const finalAccuracy =
      attempts > 0 ? Math.round((correctAnswers / attempts) * 100) : 0;

    speak(
      finalAccuracy >= 80
        ? `Brilliant work! You scored ${finalAccuracy} percent. You are a time expert!`
        : `Well done! You scored ${finalAccuracy} percent. Let's practise again.`,
    );
  }, [completed, attempts, correctAnswers, speak]);

  const finishActivity = (finalCorrect: number, finalAttempts: number) => {
    const finalAccuracy =
      finalAttempts > 0
        ? Math.round((finalCorrect / finalAttempts) * 100)
        : 0;

    completeActivity({
      id: 'maths-time-clock-lab',
      score: finalAccuracy,
      academyId: 'maths',
      domain: 'numeracy',
      skillIds: SKILLS,
    });

    setCompleted(true);
  };

  const handleAnswer = (answer: string) => {
    if (!current || selected !== null || completed) {
      return;
    }

    const isCorrect = answer === current.label;
    const nextAttempts = attempts + 1;
    const nextCorrect = correctAnswers + (isCorrect ? 1 : 0);

    setAttempts(nextAttempts);
    setSelected(answer);

    if (isCorrect) {
      if (soundEnabled) {
        playSoundFeedback('correct');
      }

      setCorrectAnswers(nextCorrect);

      speak(`Correct! It is ${current.words}. ${current.explanation}`);

      if (problemIndex === sessionProblems.length - 1) {
        setTimeout(() => {
          finishActivity(nextCorrect, nextAttempts);
        }, 2200);
      } else {
        setTimeout(() => {
          setProblemIndex((value) => value + 1);
        }, 2200);
      }
    } else {
      if (soundEnabled) {
        playSoundFeedback('try-again');
      }

      speak('Not quite. Look at the hands again and try another answer.');
      setShowHint(true);
    }
  };

  const resetActivity = () => {
    setProblemIndex(0);
    setSelected(null);
    setCorrectAnswers(0);
    setAttempts(0);
    setShowHint(false);
    setCompleted(false);

    speak("Let's practise telling the time again!");
  };

  const readTime = () => {
    if (!current) return;

    speak('What time is it? Look carefully at the hour hand and minute hand.');
  };

  if (!current && !completed) {
    return null;
  }

  if (completed) {
    const finalAccuracy =
      attempts > 0 ? Math.round((correctAnswers / attempts) * 100) : 0;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto bg-app-card p-7 rounded-2xl border border-app-border shadow-xl text-center"
      >
        <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-emerald-500/15 flex items-center justify-center">
          <Trophy className="w-8 h-8 text-emerald-400" />
        </div>

        <h3 className="text-2xl font-bold text-white">Time Lab Complete</h3>

        <p className="text-gray-400 text-sm mt-2">
          You practised reading clocks and explaining time.
        </p>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="rounded-xl bg-gray-900/70 p-3">
            <div className="text-xl font-bold text-white">
              {correctAnswers}
            </div>
            <div className="text-xs text-gray-500">Correct</div>
          </div>

          <div className="rounded-xl bg-gray-900/70 p-3">
            <div className="text-xl font-bold text-white">{finalAccuracy}%</div>
            <div className="text-xs text-gray-500">Accuracy</div>
          </div>

          <div className="rounded-xl bg-gray-900/70 p-3">
            <div className="text-xl font-bold text-white">
              {sessionProblems.length}
            </div>
            <div className="text-xs text-gray-500">Questions</div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-app-border bg-gray-900/40 p-4 text-left">
          <p className="text-xs uppercase tracking-wider text-gray-500">
            Mathematical thinking
          </p>

          <p className="text-sm text-gray-300 mt-2">
            A clock is a number system. The minute hand moves through 60
            minutes, while the hour hand moves through 12 hours.
          </p>
        </div>

        <button
          type="button"
          onClick={resetActivity}
          className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-400 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Practise Again
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-app-card p-6 md:p-7 rounded-2xl border border-app-border shadow-xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Clock3 className="w-6 h-6 text-cyan-400" />
            <h3 className="text-2xl font-bold text-white">Time Lab</h3>
          </div>

          <p className="text-gray-400 text-sm mt-1">
            {stage.title} · {stage.description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={readTime}
            aria-label="Read instructions"
            className="p-2.5 rounded-xl bg-gray-800 border border-gray-700 text-cyan-400 hover:bg-gray-700 transition-colors"
          >
            <Volume2 className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={toggleSound}
            aria-label="Toggle sound"
            className="p-2.5 rounded-xl bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors"
          >
            <Volume2
              className={`w-5 h-5 ${
                soundEnabled ? 'text-amber-300' : 'text-gray-500'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>
            Question {problemIndex + 1} of {sessionProblems.length}
          </span>
          <span>{accuracy}% accuracy</span>
        </div>

        <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
          <motion.div
            className="h-full bg-cyan-500"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Clock */}
      <div className="flex justify-center mb-7">
        <motion.div
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          key={current.id}
          className="relative w-56 h-56 rounded-full bg-gray-900 border-8 border-gray-700 shadow-2xl"
          aria-label={`Clock showing ${current.label}`}
        >
          {/* Clock numbers */}
          {Array.from({ length: 12 }).map((_, index) => {
            const number = index + 1;
            const angle = number * 30;
            const radius = 42;

            const x = 50 + radius * Math.sin((angle * Math.PI) / 180);
            const y = 50 - radius * Math.cos((angle * Math.PI) / 180);

            return (
              <span
                key={number}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-gray-300"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                }}
              >
                {number}
              </span>
            );
          })}

          {/* Minute hand */}
          <motion.div
            className="absolute left-1/2 top-1/2 w-1.5 h-[82px] rounded-full bg-cyan-400 origin-bottom"
            style={{
              transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)`,
            }}
          />

          {/* Hour hand */}
          <motion.div
            className="absolute left-1/2 top-1/2 w-2.5 h-[58px] rounded-full bg-white origin-bottom"
            style={{
              transform: `translate(-50%, -100%) rotate(${hourAngle}deg)`,
            }}
          />

          {/* Centre */}
          <div className="absolute left-1/2 top-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white border-4 border-gray-800" />
        </motion.div>
      </div>

      {/* Question */}
      <div className="text-center mb-5">
        <p className="text-gray-400 text-sm">Look carefully at both hands.</p>

        <p className="text-white text-lg font-semibold mt-1">
          What time is it?
        </p>
      </div>

      {/* Answer options */}
      <div className="grid grid-cols-3 gap-3">
        {options.map((option) => {
          const isCorrect = option === current.label;
          const isSelected = selected === option;

          let classes =
            'bg-gray-800 border-gray-700 text-white hover:bg-gray-700';

          if (isSelected && isCorrect) {
            classes = 'bg-emerald-500/20 border-emerald-400 text-emerald-300';
          } else if (isSelected && !isCorrect) {
            classes = 'bg-red-500/20 border-red-400 text-red-300';
          }

          return (
            <motion.button
              key={option}
              type="button"
              whileHover={{ scale: selected === null ? 1.03 : 1 }}
              whileTap={{ scale: selected === null ? 0.97 : 1 }}
              onClick={() => handleAnswer(option)}
              disabled={selected !== null}
              className={`min-h-14 rounded-xl border-2 text-xl font-bold transition-colors ${classes}`}
            >
              {option}
            </motion.button>
          );
        })}
      </div>

      {/* Hint */}
      {!selected && (
        <button
          type="button"
          onClick={() => setShowHint((value) => !value)}
          className="mt-5 mx-auto flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300"
        >
          <Lightbulb className="w-4 h-4" />
          {showHint ? 'Hide hint' : 'Need a hint?'}
        </button>
      )}

      {showHint && !selected && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-200"
        >
          {current.hint}
        </motion.div>
      )}

      {/* Feedback */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-5 p-4 rounded-xl border ${
            selected === current.label
              ? 'bg-emerald-500/10 border-emerald-500/20'
              : 'bg-red-500/10 border-red-500/20'
          }`}
        >
          {selected === current.label ? (
            <>
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle className="w-5 h-5" />
                Correct!
              </div>

              <p className="text-sm text-gray-300 mt-2">{current.words}</p>

              <p className="text-xs text-gray-500 mt-1">
                {current.explanation}
              </p>
            </>
          ) : (
            <>
              <p className="text-red-300 font-semibold">
                Not quite. Look at the hands again.
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Use the hint or try another answer.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSelected(null);
                  setShowHint(false);
                }}
                className="mt-3 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm font-semibold"
              >
                Try Again
              </button>
            </>
          )}
        </motion.div>
      )}

      {/* Score */}
      <div className="mt-6 pt-5 border-t border-app-border flex justify-between text-sm">
        <span className="text-gray-500">
          Score:{' '}
          <span className="text-white font-semibold">{correctAnswers * 10}</span>
        </span>

        <span className="text-gray-500">
          Correct:{' '}
          <span className="text-white font-semibold">
            {correctAnswers}/{attempts}
          </span>
        </span>
      </div>

      {/* Thinking prompt */}
      <div className="mt-5 p-4 rounded-xl bg-gray-900/50 border border-app-border">
        <p className="text-xs uppercase tracking-wider text-gray-500">
          Think like a mathematician
        </p>

        <p className="text-sm text-gray-300 mt-2">
          Can you explain how you knew where the minute hand was pointing?
        </p>
      </div>
    </div>
  );
};