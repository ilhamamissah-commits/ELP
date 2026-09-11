import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Thermometer,
  Eye,
  GitCompare,
  ArrowUpDown,
  Brain,
  RotateCcw,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Volume2,
} from 'lucide-react';

import { playSoundFeedback } from '../../../services/soundFeedback';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

type TemperatureId = 'cold' | 'cool' | 'warm' | 'hot';

type ActivityStage =
  | 'observe'
  | 'identify'
  | 'compare'
  | 'order'
  | 'reflect'
  | 'complete';

interface TemperatureTablet {
  id: TemperatureId;
  name: string;
  emoji: string;
  description: string;
  sensoryWords: string[];
  relativePosition: number;
}

const TEMPERATURES: TemperatureTablet[] = [
  {
    id: 'cold',
    name: 'Cold',
    emoji: '❄️',
    description: 'Very cold, like ice or a frozen drink.',
    sensoryWords: ['cold', 'chilly', 'icy'],
    relativePosition: 1,
  },
  {
    id: 'cool',
    name: 'Cool',
    emoji: '🧊',
    description: 'A little chilly, like a cool morning.',
    sensoryWords: ['cool', 'fresh', 'chilly'],
    relativePosition: 2,
  },
  {
    id: 'warm',
    name: 'Warm',
    emoji: '🌤️',
    description: 'Comfortably warm, like gentle sunshine.',
    sensoryWords: ['warm', 'comfortable', 'mild'],
    relativePosition: 3,
  },
  {
    id: 'hot',
    name: 'Hot',
    emoji: '🔥',
    description: 'Very hot, like something heated by the sun or fire.',
    sensoryWords: ['hot', 'very warm', 'heated'],
    relativePosition: 4,
  },
];

const STAGE_ORDER: ActivityStage[] = [
  'observe',
  'identify',
  'compare',
  'order',
  'reflect',
  'complete',
];

const STAGE_LABELS: Record<ActivityStage, string> = {
  observe: 'Observe',
  identify: 'Identify',
  compare: 'Compare',
  order: 'Order',
  reflect: 'Reflect',
  complete: 'Complete',
};

export const ThermicTablets: React.FC = () => {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const { speak, stopSpeaking } = useReadAloud();

  const [stage, setStage] = useState<ActivityStage>('observe');
  const [selected, setSelected] = useState<TemperatureId | null>(null);
  const [comparePair, setComparePair] = useState<TemperatureId[]>([]);
  const [orderAttempt, setOrderAttempt] = useState<TemperatureId[]>([]);
  const [reflection, setReflection] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [orderComplete, setOrderComplete] = useState(false);

  const currentStageIndex = STAGE_ORDER.indexOf(stage);

  const selectedTemperature = useMemo(
    () => TEMPERATURES.find((temp) => temp.id === selected),
    [selected]
  );

  /* =======================================================
     AUTO-READ — stage prompts
     Skipped on 'complete' (has its own effect below).
  ======================================================= */

  useEffect(() => {
    if (!autoReadEnabled) return;
    if (stage === 'complete') return;

    const timer = window.setTimeout(() => {
      if (stage === 'observe') {
        speak(
          'Look carefully at the temperature words and notice how they change from cold to hot.'
        );
      } else if (stage === 'identify') {
        speak(
          'Explore each tablet and learn the words we use to describe temperature.'
        );
      } else if (stage === 'compare') {
        speak(
          'Choose two temperatures and think about how they are different.'
        );
      } else if (stage === 'order') {
        speak(
          'Arrange the temperatures from coldest to hottest.'
        );
      } else if (stage === 'reflect') {
        speak(
          'Connect what you learned to a real temperature you have experienced.'
        );
      }
    }, 450);

    return () => window.clearTimeout(timer);
  }, [stage, autoReadEnabled, speak]);

  /* =======================================================
     SELECTED TEMPERATURE NARRATION (identify stage)
     Fires when the child taps a tablet and reads name +
     description + sensory words.
  ======================================================= */

  useEffect(() => {
    if (stage !== 'identify') return;
    if (!selectedTemperature) return;

    const timer = window.setTimeout(() => {
      speak(
        `${selectedTemperature.name}. ${selectedTemperature.description}`
      );
    }, 250);

    return () => window.clearTimeout(timer);
  }, [selectedTemperature, stage, speak]);

  /* =======================================================
     COMPARISON RESULT NARRATION
     When the child has selected two temperatures, read the
     comparison (e.g. "Cold is colder than Hot").
  ======================================================= */

  useEffect(() => {
    if (stage !== 'compare') return;
    if (comparePair.length !== 2) return;

    const first = TEMPERATURES.find((t) => t.id === comparePair[0]);
    const second = TEMPERATURES.find((t) => t.id === comparePair[1]);
    if (!first || !second) return;
    if (first.id === second.id) return;

    const colder =
      first.relativePosition < second.relativePosition ? first : second;
    const warmer =
      first.relativePosition > second.relativePosition ? first : second;

    const timer = window.setTimeout(() => {
      speak(`${colder.name} is colder than ${warmer.name}.`);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [comparePair, stage, speak]);

  /* =======================================================
     ORDER — success / failure narration
  ======================================================= */

  useEffect(() => {
    if (stage !== 'order') return;
    if (orderAttempt.length !== TEMPERATURES.length) return;

    const correctOrder = [...TEMPERATURES]
      .sort((a, b) => a.relativePosition - b.relativePosition)
      .map((temp) => temp.id);

    const isCorrect = orderAttempt.every(
      (value, index) => value === correctOrder[index]
    );

    if (isCorrect) {
      if (soundEnabled) playSoundFeedback('correct');
      speak(
        'Correct sequence. Cold, cool, warm, hot. You ordered the temperature scale from coldest to hottest.'
      );
    } else {
      if (soundEnabled) playSoundFeedback('try-again');
      speak(
        'Not quite. Start with the coldest and gradually move toward the hottest. The coldest is cold. The hottest is hot.'
      );
    }
  }, [orderAttempt, stage, speak, soundEnabled]);

  /* =======================================================
     COMPLETION NARRATION
     Reflection-aware, but never reads back the child's own
     words.
  ======================================================= */

  useEffect(() => {
    if (stage !== 'complete') return;

    speak(
      `Temperature explored. You observed temperature words, compared them, ordered them, and connected them to real-world experience. ${
        reflection.trim()
          ? 'Thank you for writing your reflection.'
          : 'Think about something you have actually experienced that was cold, cool, warm or hot.'
      }`
    );
  }, [stage, speak, reflection]);

  /* =======================================================
     CLEANUP
  ======================================================= */

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  /* =======================================================
     HANDLERS
  ======================================================= */

  const goNext = () => {
    const nextIndex = currentStageIndex + 1;

    if (nextIndex < STAGE_ORDER.length) {
      setStage(STAGE_ORDER[nextIndex]);
      if (soundEnabled) playSoundFeedback('move');
    }
  };

  const handleTemperatureSelect = (id: TemperatureId) => {
    if (stage === 'compare' && soundEnabled) {
      playSoundFeedback('move');
    } else if (stage === 'identify' && soundEnabled) {
      playSoundFeedback('move');
    }

    setSelected(id);

    if (stage === 'identify') {
      setAttempts((value) => value + 1);
    }

    if (stage === 'compare') {
      setComparePair((current) => {
        if (current.includes(id)) {
          return current.filter((item) => item !== id);
        }

        if (current.length >= 2) {
          return [current[1], id];
        }

        return [...current, id];
      });
    }
  };

  const handleOrderSelect = (id: TemperatureId) => {
    if (orderAttempt.includes(id)) return;

    if (soundEnabled) playSoundFeedback('move');

    const nextOrder = [...orderAttempt, id];
    setOrderAttempt(nextOrder);
    setAttempts((value) => value + 1);

    // The order result narration fires from the effect above.
  };

  const resetOrder = () => {
    stopSpeaking();
    setOrderAttempt([]);
    setOrderComplete(false);
  };

  const resetActivity = () => {
    stopSpeaking();
    setStage('observe');
    setSelected(null);
    setComparePair([]);
    setOrderAttempt([]);
    setReflection('');
    setAttempts(0);
    setOrderComplete(false);
  };

  const getStageDescription = () => {
    switch (stage) {
      case 'observe':
        return 'Look carefully at the temperature words and notice how they change from cold to hot.';
      case 'identify':
        return 'Explore each tablet and learn the words we use to describe temperature.';
      case 'compare':
        return 'Choose two temperatures and think about how they are different.';
      case 'order':
        return 'Arrange the temperatures from coldest to hottest.';
      case 'reflect':
        return 'Connect what you learned to a real temperature you have experienced.';
      case 'complete':
        return 'Review what you discovered about temperature.';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-app-card rounded-3xl border border-app-border shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-app-border">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Sensorial • Temperature
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white">
              Thermic Tablets
            </h3>

            <p className="text-sm text-gray-400 mt-1">
              Observe, compare and order temperature concepts.
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
              onClick={resetActivity}
              className="p-2 rounded-lg border border-app-border text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Reset activity"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-5">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>
              {STAGE_LABELS[stage]}
            </span>
            <span>
              {Math.max(currentStageIndex + 1, 1)} / {STAGE_ORDER.length}
            </span>
          </div>

          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-cyan-400"
              initial={{ width: 0 }}
              animate={{
                width: `${
                  ((currentStageIndex + 1) / STAGE_ORDER.length) * 100
                }%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Learning principle */}
      <div className="mx-6 mt-5 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
        <div className="flex items-start gap-3">
          <Thermometer className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />

          <div>
            <p className="text-sm font-semibold text-cyan-300">
              Important sensory note
            </p>

            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              A screen cannot actually reproduce the sensation of temperature.
              This activity helps you learn temperature words and comparisons.
              For real thermic exploration, use safe real-world materials with
              a teacher, parent or trusted adult.
            </p>
          </div>
        </div>
      </div>

      {/* Stage description */}
      <div className="px-6 pt-5">
        <p className="text-sm text-gray-300 leading-relaxed">
          {getStageDescription()}
        </p>
      </div>

      {/* OBSERVE */}
      {stage === 'observe' && (
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-4 h-4 text-cyan-400" />
            <h4 className="font-semibold text-white">
              Observe the temperature scale
            </h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TEMPERATURES.map((temp) => (
              <motion.div
                key={temp.id}
                whileHover={{ y: -3 }}
                className="p-4 rounded-xl bg-white/[0.03] border border-app-border text-center"
              >
                <span className="text-3xl block mb-2">{temp.emoji}</span>

                <span className="text-sm font-semibold text-white">
                  {temp.name}
                </span>

                <div className="mt-3 h-1 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-cyan-400"
                    style={{
                      width: `${temp.relativePosition * 25}%`,
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-5 p-4 rounded-xl bg-white/[0.03] border border-app-border">
            <p className="text-sm text-gray-300">
              Notice the progression:
            </p>

            <p className="text-sm font-semibold text-white mt-2">
              Cold → Cool → Warm → Hot
            </p>
          </div>

          <button
            onClick={goNext}
            className="w-full mt-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2"
          >
            Explore the words
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* IDENTIFY */}
      {stage === 'identify' && (
        <div className="p-6">
          <div className="grid grid-cols-2 gap-3">
            {TEMPERATURES.map((temp) => {
              const isSelected = selected === temp.id;

              return (
                <motion.button
                  key={temp.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTemperatureSelect(temp.id)}
                  className={`p-5 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-400'
                      : 'bg-white/[0.03] border-app-border hover:border-white/20'
                  }`}
                >
                  <span className="text-3xl block mb-2">
                    {temp.emoji}
                  </span>

                  <span className="font-bold text-white">
                    {temp.name}
                  </span>

                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3"
                    >
                      <p className="text-xs text-gray-400 leading-relaxed">
                        {temp.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {temp.sensoryWords.map((word) => (
                          <span
                            key={word}
                            className="px-2 py-1 rounded-md bg-white/5 text-[10px] text-gray-300"
                          >
                            {word}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {selectedTemperature && (
            <div className="mt-5 p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
              <p className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">
                Think about it
              </p>

              <p className="text-sm text-gray-300 mt-2">
                Where might you experience something that feels{' '}
                <strong className="text-white">
                  {selectedTemperature.name.toLowerCase()}
                </strong>
                ?
              </p>
            </div>
          )}

          <button
            onClick={goNext}
            disabled={!selected}
            className="w-full mt-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Compare temperatures
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* COMPARE */}
      {stage === 'compare' && (
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <GitCompare className="w-4 h-4 text-cyan-400" />
            <h4 className="font-semibold text-white">
              Choose two temperatures
            </h4>
          </div>

          <p className="text-xs text-gray-500 mb-4">
            Select two. Think about which one is colder and which one is
            warmer.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {TEMPERATURES.map((temp) => {
              const isSelected = comparePair.includes(temp.id);

              return (
                <motion.button
                  key={temp.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleTemperatureSelect(temp.id)}
                  className={`p-5 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-400'
                      : 'bg-white/[0.03] border-app-border'
                  }`}
                >
                  <span className="text-3xl block mb-2">
                    {temp.emoji}
                  </span>

                  <span className="font-semibold text-white">
                    {temp.name}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {comparePair.length === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 p-4 rounded-xl bg-white/[0.03] border border-app-border"
            >
              {(() => {
                const first = TEMPERATURES.find(
                  (temp) => temp.id === comparePair[0]
                );
                const second = TEMPERATURES.find(
                  (temp) => temp.id === comparePair[1]
                );

                if (!first || !second) return null;

                const colder =
                  first.relativePosition < second.relativePosition
                    ? first
                    : second;

                const warmer =
                  first.relativePosition > second.relativePosition
                    ? first
                    : second;

                if (first.id === second.id) {
                  return (
                    <p className="text-sm text-gray-300">
                      Choose two different temperatures to compare them.
                    </p>
                  );
                }

                return (
                  <>
                    <p className="text-sm text-gray-300">
                      <strong className="text-white">
                        {colder.name}
                      </strong>{' '}
                      is colder than{' '}
                      <strong className="text-white">
                        {warmer.name}
                      </strong>
                      .
                    </p>

                    <p className="text-xs text-gray-500 mt-2">
                      Comparing helps your mind notice differences between
                      sensory qualities.
                    </p>
                  </>
                );
              })()}
            </motion.div>
          )}

          <button
            onClick={goNext}
            disabled={comparePair.length !== 2}
            className="w-full mt-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Order them
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ORDER */}
      {stage === 'order' && (
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpDown className="w-4 h-4 text-cyan-400" />
            <h4 className="font-semibold text-white">
              Build the temperature scale
            </h4>
          </div>

          <p className="text-xs text-gray-500 mb-5">
            Tap the temperatures from <strong>coldest</strong> to{' '}
            <strong>hottest</strong>.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {TEMPERATURES.map((temp) => {
              const position = orderAttempt.indexOf(temp.id);
              const alreadyChosen = position !== -1;

              return (
                <motion.button
                  key={temp.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleOrderSelect(temp.id)}
                  disabled={alreadyChosen || orderComplete}
                  className={`relative p-5 rounded-xl border-2 transition-all ${
                    alreadyChosen
                      ? 'bg-cyan-500/10 border-cyan-400'
                      : 'bg-white/[0.03] border-app-border hover:border-white/20'
                  } disabled:cursor-default`}
                >
                  {alreadyChosen && (
                    <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-cyan-400 text-slate-950 text-xs font-bold flex items-center justify-center">
                      {position + 1}
                    </span>
                  )}

                  <span className="text-3xl block mb-2">
                    {temp.emoji}
                  </span>

                  <span className="font-semibold text-white">
                    {temp.name}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {orderAttempt.length === TEMPERATURES.length &&
            !orderComplete && (
              <div className="mt-5 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
                <p className="text-sm text-amber-200">
                  Take another look at the temperature scale.
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Start with the coldest and gradually move toward the
                  hottest.
                </p>

                <button
                  onClick={resetOrder}
                  className="mt-3 text-xs text-cyan-400 hover:text-cyan-300"
                >
                  Try the order again
                </button>
              </div>
            )}

          {orderComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-5 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400" />

                <div>
                  <p className="font-semibold text-white">
                    Correct sequence
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Cold → Cool → Warm → Hot
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <button
            onClick={goNext}
            disabled={!orderComplete}
            className="w-full mt-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Reflect
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* REFLECT */}
      {stage === 'reflect' && (
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-4 h-4 text-cyan-400" />
            <h4 className="font-semibold text-white">
              Connect it to real life
            </h4>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-app-border mb-5">
            <p className="text-sm text-gray-300 leading-relaxed">
              Think about something you have actually experienced that was
              cold, cool, warm or hot.
            </p>

            <p className="text-xs text-gray-500 mt-2">
              For example: water, the weather, food, a bath, or an object.
            </p>
          </div>

          <textarea
            value={reflection}
            onChange={(event) => setReflection(event.target.value)}
            placeholder="I remember something that felt..."
            className="w-full min-h-[120px] rounded-xl bg-white/[0.03] border border-app-border p-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-400 resize-none"
          />

          <button
            onClick={goNext}
            className="w-full mt-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold flex items-center justify-center gap-2"
          >
            Finish activity
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* COMPLETE */}
      {stage === 'complete' && (
        <div className="p-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center"
          >
            <Sparkles className="w-7 h-7 text-cyan-400" />
          </motion.div>

          <h4 className="text-xl font-bold text-white mt-5">
            Temperature explored
          </h4>

          <p className="text-sm text-gray-400 mt-2 leading-relaxed">
            You observed temperature words, compared them, ordered them and
            connected them to real-world experience.
          </p>

          <div className="grid grid-cols-2 gap-3 mt-6 text-left">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-app-border">
              <p className="text-xs text-gray-500">You practised</p>
              <p className="text-sm font-semibold text-white mt-1">
                Temperature vocabulary
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-app-border">
              <p className="text-xs text-gray-500">You practised</p>
              <p className="text-sm font-semibold text-white mt-1">
                Comparison & ordering
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-app-border">
              <p className="text-xs text-gray-500">You practised</p>
              <p className="text-sm font-semibold text-white mt-1">
                Observation
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-app-border">
              <p className="text-xs text-gray-500">You practised</p>
              <p className="text-sm font-semibold text-white mt-1">
                Sensory reflection
              </p>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 text-left">
            <p className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">
              Real-world sensory challenge
            </p>

            <p className="text-sm text-gray-300 mt-2 leading-relaxed">
              With a teacher, parent or trusted adult, safely notice the
              difference between two everyday temperatures. Describe what you
              notice using words such as cold, cool, warm or hot.
            </p>

            <p className="text-xs text-gray-500 mt-2">
              Never touch fire, boiling water, very hot objects or extremely
              cold materials as part of this activity.
            </p>
          </div>

          <button
            onClick={resetActivity}
            className="w-full mt-5 py-3 rounded-xl border border-app-border text-gray-300 hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Explore again
          </button>

          <p className="text-[11px] text-gray-600 mt-4">
            Attempts recorded: {attempts}
          </p>
        </div>
      )}
    </div>
  );
};