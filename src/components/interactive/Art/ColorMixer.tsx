import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Eye,
  FlaskConical,
  Lightbulb,
  Palette,
  RotateCcw,
  Sparkles,
  Target,
  Volume2,
} from 'lucide-react';

import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

type ColorStage =
  | 'observe'
  | 'explore'
  | 'mix'
  | 'predict'
  | 'compare'
  | 'create'
  | 'reflect'
  | 'master';

interface ColorChoice {
  id: string;
  name: string;
  value: string;
}

const PRIMARY_COLORS: ColorChoice[] = [
  {
    id: 'red',
    name: 'Red',
    value: '#ef4444',
  },
  {
    id: 'yellow',
    name: 'Yellow',
    value: '#facc15',
  },
  {
    id: 'blue',
    name: 'Blue',
    value: '#3b82f6',
  },
];

const MIXING_EXAMPLES = [
  {
    id: 'orange',
    name: 'Orange',
    first: 'red',
    second: 'yellow',
    result: '#f97316',
  },
  {
    id: 'green',
    name: 'Green',
    first: 'yellow',
    second: 'blue',
    result: '#22c55e',
  },
  {
    id: 'purple',
    name: 'Purple',
    first: 'red',
    second: 'blue',
    result: '#a855f7',
  },
];

const STAGE_LABELS: Record<ColorStage, string> = {
  observe: 'Observe',
  explore: 'Explore',
  mix: 'Mix',
  predict: 'Predict',
  compare: 'Compare',
  create: 'Create',
  reflect: 'Reflect',
  master: 'Master',
};

const STAGES: ColorStage[] = [
  'observe',
  'explore',
  'mix',
  'predict',
  'compare',
  'create',
  'reflect',
  'master',
];

const getMixedColor = (first: string, second: string): string => {
  const color1 = PRIMARY_COLORS.find((color) => color.id === first);
  const color2 = PRIMARY_COLORS.find((color) => color.id === second);

  if (!color1 || !color2) return '#6b7280';

  const hexToRgb = (hex: string) => {
    const value = hex.replace('#', '');

    return {
      r: parseInt(value.substring(0, 2), 16),
      g: parseInt(value.substring(2, 4), 16),
      b: parseInt(value.substring(4, 6), 16),
    };
  };

  const rgb1 = hexToRgb(color1.value);
  const rgb2 = hexToRgb(color2.value);

  const r = Math.round((rgb1.r + rgb2.r) / 2);
  const g = Math.round((rgb1.g + rgb2.g) / 2);
  const b = Math.round((rgb1.b + rgb2.b) / 2);

  return `rgb(${r}, ${g}, ${b})`;
};

export const ColorMixer: React.FC = () => {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const { speak, stopSpeaking } = useReadAloud();

  const [stage, setStage] = useState<ColorStage>('observe');

  const [firstColor, setFirstColor] = useState<string | null>(null);
  const [secondColor, setSecondColor] = useState<string | null>(null);

  const [prediction, setPrediction] = useState<string | null>(null);
  const [reflection, setReflection] = useState('');

  const [attempts, setAttempts] = useState(0);
  const [experimentCount, setExperimentCount] = useState(0);

  const stageIndex = STAGES.indexOf(stage);

  const progress = useMemo(
    () => ((stageIndex + 1) / STAGES.length) * 100,
    [stageIndex]
  );

  const mixedColor = useMemo(() => {
    if (!firstColor || !secondColor) return '#1f2937';

    return getMixedColor(firstColor, secondColor);
  }, [firstColor, secondColor]);

  const mixedName = useMemo(() => {
    if (!firstColor || !secondColor) return null;

    const match = MIXING_EXAMPLES.find(
      (example) =>
        (example.first === firstColor && example.second === secondColor) ||
        (example.first === secondColor && example.second === firstColor)
    );

    return match?.name ?? 'A new colour';
  }, [firstColor, secondColor]);

  const predictionIsCorrect =
    prediction?.toLowerCase() === mixedName?.toLowerCase();

  /* =======================================================
     AUTO-READ — stage prompts
     Skipped on 'master' (has its own completion effect).
  ======================================================= */

  useEffect(() => {
    if (!autoReadEnabled) return;
    if (stage === 'master') return;

    const timer = window.setTimeout(() => {
      if (stage === 'observe') {
        speak(
          'Observe the colours. Look carefully at the three primary colours. They are important starting points for exploring many other colours.'
        );
      } else if (stage === 'explore') {
        speak(
          'Explore each colour. Tap a colour to explore it.'
        );
      } else if (stage === 'mix') {
        speak(
          'Mix two colours. Choose two different colours and see what happens.'
        );
      } else if (stage === 'predict') {
        speak(
          'Predict the result. Before looking at the answer, what colour do you think you made?'
        );
      } else if (stage === 'compare') {
        speak(
          'Compare your colours. Look at the starting colours and the colour they made.'
        );
      } else if (stage === 'create') {
        speak(
          'Experiment freely. Choose another pair and see what you can discover.'
        );
      } else if (stage === 'reflect') {
        speak(
          'Think like an artist. Tell us about your colour experiment. Which colour combination did you enjoy?'
        );
      }
    }, 450);

    return () => window.clearTimeout(timer);
  }, [stage, autoReadEnabled, speak]);

  /* =======================================================
     MIX RESULT NARRATION
     When two colours have been selected, speaks the mixed
     colour name. Never speaks the *name of the mix* before
     the child reaches the predict stage.
  ======================================================= */

  useEffect(() => {
    if (stage !== 'mix') return;
    if (!firstColor || !secondColor) return;
    if (!mixedName) return;

    const timer = window.setTimeout(() => {
      speak(`Your mixed colour looks like ${mixedName}.`);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [stage, firstColor, secondColor, mixedName, speak]);

  /* =======================================================
     PREDICTION FEEDBACK NARRATION
     Fires when the child makes a prediction. Reads the
     specific verdict (correct / incorrect) with the actual
     answer, so the child learns the specific colour pairing.
  ======================================================= */

  useEffect(() => {
    if (stage !== 'predict') return;
    if (!prediction) return;
    if (!mixedName) return;

    const timer = window.setTimeout(() => {
      if (predictionIsCorrect) {
        speak(
          `Correct! ${mixedName} is the colour you made. Your observation helped you anticipate the result.`
        );
      } else {
        speak(
          `Good thinking. The colour you made is ${mixedName}. Try noticing which two colours created it.`
        );
      }
    }, 350);

    return () => window.clearTimeout(timer);
  }, [prediction, predictionIsCorrect, mixedName, stage, speak]);

  /* =======================================================
     COMPLETION NARRATION
     Reflection-aware; never reads back the child's words.
  ======================================================= */

  useEffect(() => {
    if (stage !== 'master') return;

    speak(
      `Colour exploration complete. You explored colour relationships, made predictions, experimented, and reflected on your creative choices. ${
        reflection.trim()
          ? 'Thank you for writing your reflection.'
          : 'Remember, artists often experiment. There does not have to be only one right colour choice.'
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

  const reset = () => {
    stopSpeaking();
    setStage('observe');
    setFirstColor(null);
    setSecondColor(null);
    setPrediction(null);
    setReflection('');
    setAttempts(0);
    setExperimentCount(0);
  };

  const chooseFirstColor = (color: string) => {
    if (soundEnabled) {
      // No playSoundFeedback in this family, so we do nothing here.
    }
    setFirstColor(color);
    setSecondColor(null);
    setPrediction(null);

    const colorData = PRIMARY_COLORS.find((c) => c.id === color);
    if (colorData) speak(colorData.name);
  };

  const chooseSecondColor = (color: string) => {
    if (!firstColor || color === firstColor) return;

    setSecondColor(color);
    setPrediction(null);
    setExperimentCount((previous) => previous + 1);

    // Mix result narration is handled by the mix-result effect.
  };

  const handlePrediction = (colorName: string) => {
    setPrediction(colorName);
    setAttempts((previous) => previous + 1);
    // Prediction feedback is handled by the prediction effect.
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-app-card rounded-3xl border border-app-border shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-app-border">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold mb-1">
                <Palette className="w-4 h-4" />
                Creative Arts
              </div>

              <h2 className="text-2xl font-bold text-white">
                Colour Mixer
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                Explore what happens when colours come together.
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
                onClick={reset}
                className="p-2.5 rounded-xl bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition"
                aria-label="Reset colour mixer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>
                Step {stageIndex + 1} of {STAGES.length}
              </span>

              <span className="text-indigo-400">
                {STAGE_LABELS[stage]}
              </span>
            </div>

            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-indigo-500 rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Progression */}
          <div className="flex flex-wrap gap-2 mt-4">
            {STAGES.map((stageName, index) => (
              <div
                key={stageName}
                className={`px-2.5 py-1 rounded-full text-xs border ${
                  index <= stageIndex
                    ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                    : 'bg-gray-900 border-gray-800 text-gray-600'
                }`}
              >
                {index + 1}. {STAGE_LABELS[stageName]}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* OBSERVE */}
            {stage === 'observe' && (
              <motion.div
                key="observe"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <Eye className="w-9 h-9 text-indigo-400 mx-auto mb-4" />

                <h3 className="text-xl font-bold text-white">
                  Observe the colours
                </h3>

                <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
                  Look carefully at the three primary colours. They are
                  important starting points for exploring many other colours.
                </p>

                <div className="grid grid-cols-3 gap-4 mt-7">
                  {PRIMARY_COLORS.map((color) => (
                    <div
                      key={color.id}
                      className="p-4 bg-gray-900 border border-gray-800 rounded-2xl"
                    >
                      <div
                        className="w-20 h-20 rounded-full mx-auto shadow-lg"
                        style={{ backgroundColor: color.value }}
                      />

                      <p className="text-white font-semibold mt-3">
                        {color.name}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setStage('explore')}
                  className="mt-7 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold inline-flex items-center gap-2"
                >
                  Explore the Colours
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* EXPLORE */}
            {stage === 'explore' && (
              <motion.div
                key="explore"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-center">
                  <Sparkles className="w-9 h-9 text-indigo-400 mx-auto mb-4" />

                  <h3 className="text-xl font-bold text-white">
                    Explore each colour
                  </h3>

                  <p className="text-gray-400 text-sm mt-2">
                    Tap a colour to explore it.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-7">
                  {PRIMARY_COLORS.map((color) => (
                    <motion.button
                      key={color.id}
                      type="button"
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => chooseFirstColor(color.id)}
                      className="p-5 rounded-2xl bg-gray-900 border border-gray-800 hover:border-indigo-500/40 transition"
                    >
                      <div
                        className="w-24 h-24 rounded-full mx-auto shadow-xl"
                        style={{ backgroundColor: color.value }}
                      />

                      <p className="text-white font-bold mt-4">
                        {color.name}
                      </p>
                    </motion.button>
                  ))}
                </div>

                {firstColor && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-center"
                  >
                    <p className="text-indigo-300 text-sm">
                      You explored{' '}
                      <strong>
                        {
                          PRIMARY_COLORS.find(
                            (color) => color.id === firstColor
                          )?.name
                        }
                      </strong>
                      .
                    </p>
                  </motion.div>
                )}

                <div className="text-center mt-6">
                  <button
                    type="button"
                    onClick={() => setStage('mix')}
                    className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold inline-flex items-center gap-2"
                  >
                    Start Mixing
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* MIX */}
            {stage === 'mix' && (
              <motion.div
                key="mix"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-center">
                  <FlaskConical className="w-9 h-9 text-indigo-400 mx-auto mb-4" />

                  <h3 className="text-xl font-bold text-white">
                    Mix two colours
                  </h3>

                  <p className="text-gray-400 text-sm mt-2">
                    Choose two different colours and see what happens.
                  </p>
                </div>

                {/* Colour choices */}
                <div className="grid grid-cols-3 gap-3 mt-7">
                  {PRIMARY_COLORS.map((color) => {
                    const selected =
                      firstColor === color.id || secondColor === color.id;

                    return (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => {
                          if (!firstColor) {
                            chooseFirstColor(color.id);
                          } else if (!secondColor) {
                            chooseSecondColor(color.id);
                          }
                        }}
                        disabled={selected}
                        className={`p-4 rounded-2xl border transition ${
                          selected
                            ? 'border-indigo-400 bg-indigo-500/10'
                            : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                        }`}
                      >
                        <div
                          className="w-16 h-16 rounded-full mx-auto"
                          style={{ backgroundColor: color.value }}
                        />

                        <p className="text-white font-semibold mt-2">
                          {color.name}
                        </p>

                        {selected && (
                          <p className="text-xs text-indigo-400 mt-1">
                            Selected
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Selected colours */}
                <div className="mt-7 flex items-center justify-center gap-5">
                  <div
                    className="w-24 h-24 rounded-full border-4 border-white/10 shadow-xl"
                    style={{
                      backgroundColor:
                        firstColor
                          ? PRIMARY_COLORS.find(
                              (color) => color.id === firstColor
                            )?.value
                          : '#1f2937',
                    }}
                  />

                  <span className="text-gray-500 text-2xl">+</span>

                  <div
                    className="w-24 h-24 rounded-full border-4 border-white/10 shadow-xl"
                    style={{
                      backgroundColor:
                        secondColor
                          ? PRIMARY_COLORS.find(
                              (color) => color.id === secondColor
                            )?.value
                          : '#1f2937',
                    }}
                  />

                  <span className="text-gray-500 text-2xl">=</span>

                  <motion.div
                    animate={{
                      scale: secondColor ? [0.9, 1.05, 1] : 1,
                    }}
                    className="w-28 h-28 rounded-full border-4 border-white/20 shadow-2xl"
                    style={{ backgroundColor: mixedColor }}
                  />
                </div>

                {secondColor && (
                  <div className="mt-6 text-center">
                    <p className="text-gray-400 text-sm">
                      Your mixed colour looks like:
                    </p>

                    <p className="text-2xl font-bold text-white mt-1">
                      {mixedName}
                    </p>
                  </div>
                )}

                {firstColor && secondColor && (
                  <div className="text-center mt-6">
                    <button
                      type="button"
                      onClick={() => setStage('predict')}
                      className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold inline-flex items-center gap-2"
                    >
                      Make a Prediction
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* PREDICT */}
            {stage === 'predict' && (
              <motion.div
                key="predict"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <Target className="w-9 h-9 text-indigo-400 mx-auto mb-4" />

                <h3 className="text-xl font-bold text-white">
                  Predict the result
                </h3>

                <p className="text-gray-400 text-sm mt-2">
                  Before looking at the answer, what colour do you think you
                  made?
                </p>

                <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['Orange', 'Green', 'Purple'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handlePrediction(color)}
                      className={`p-4 rounded-xl border transition ${
                        prediction === color
                          ? predictionIsCorrect
                            ? 'border-green-500 bg-green-500/10'
                            : 'border-amber-500 bg-amber-500/10'
                          : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                      }`}
                    >
                      <div
                        className="w-12 h-12 rounded-full mx-auto mb-2"
                        style={{
                          backgroundColor:
                            color === 'Orange'
                              ? '#f97316'
                              : color === 'Green'
                                ? '#22c55e'
                                : '#a855f7',
                        }}
                      />

                      <span className="text-white font-semibold">
                        {color}
                      </span>
                    </button>
                  ))}
                </div>

                {prediction && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-5 p-4 rounded-xl border ${
                      predictionIsCorrect
                        ? 'bg-green-500/10 border-green-500/20 text-green-300'
                        : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                    }`}
                  >
                    {predictionIsCorrect
                      ? 'Excellent prediction! Your observation helped you anticipate the result.'
                      : `Good thinking! The colour you made is ${mixedName}. Try noticing which two colours created it.`}
                  </motion.div>
                )}

                {prediction && (
                  <button
                    type="button"
                    onClick={() => setStage('compare')}
                    className="mt-6 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold inline-flex items-center gap-2"
                  >
                    Compare Colours
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            )}

            {/* COMPARE */}
            {stage === 'compare' && (
              <motion.div
                key="compare"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-center">
                  <Eye className="w-9 h-9 text-indigo-400 mx-auto mb-4" />

                  <h3 className="text-xl font-bold text-white">
                    Compare your colours
                  </h3>

                  <p className="text-gray-400 text-sm mt-2">
                    Look at the starting colours and the colour they made.
                  </p>
                </div>

                <div className="mt-7 grid md:grid-cols-3 gap-4">
                  <div className="p-5 bg-gray-900 border border-gray-800 rounded-2xl text-center">
                    <div
                      className="w-24 h-24 rounded-full mx-auto"
                      style={{
                        backgroundColor:
                          PRIMARY_COLORS.find(
                            (color) => color.id === firstColor
                          )?.value,
                      }}
                    />

                    <p className="text-gray-400 text-sm mt-3">
                      First colour
                    </p>
                  </div>

                  <div className="p-5 bg-gray-900 border border-gray-800 rounded-2xl text-center">
                    <div
                      className="w-24 h-24 rounded-full mx-auto"
                      style={{
                        backgroundColor:
                          PRIMARY_COLORS.find(
                            (color) => color.id === secondColor
                          )?.value,
                      }}
                    />

                    <p className="text-gray-400 text-sm mt-3">
                      Second colour
                    </p>
                  </div>

                  <div className="p-5 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl text-center">
                    <div
                      className="w-24 h-24 rounded-full mx-auto"
                      style={{ backgroundColor: mixedColor }}
                    />

                    <p className="text-indigo-300 text-sm mt-3">
                      New colour
                    </p>

                    <p className="text-white font-bold mt-1">
                      {mixedName}
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-900 rounded-xl border border-gray-800 text-center">
                  <p className="text-gray-300 text-sm">
                    Two colours can combine to create a different colour.
                    Artists can experiment with these relationships to make
                    new visual choices.
                  </p>
                </div>

                <div className="text-center mt-6">
                  <button
                    type="button"
                    onClick={() => setStage('create')}
                    className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold inline-flex items-center gap-2"
                  >
                    Create a Colour
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* CREATE */}
            {stage === 'create' && (
              <motion.div
                key="create"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-center">
                  <Sparkles className="w-9 h-9 text-indigo-400 mx-auto mb-4" />

                  <h3 className="text-xl font-bold text-white">
                    Experiment freely
                  </h3>

                  <p className="text-gray-400 text-sm mt-2">
                    Choose another pair and see what you can discover.
                  </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 mt-7">
                  {MIXING_EXAMPLES.map((example) => (
                    <button
                      key={example.id}
                      type="button"
                      onClick={() => {
                        setFirstColor(example.first);
                        setSecondColor(example.second);
                        setExperimentCount((previous) => previous + 1);

                        speak(`${example.name}`);
                      }}
                      className="p-5 bg-gray-900 border border-gray-800 rounded-2xl hover:border-indigo-500/40 transition"
                    >
                      <div className="flex justify-center items-center gap-2">
                        <div
                          className="w-10 h-10 rounded-full"
                          style={{
                            backgroundColor:
                              PRIMARY_COLORS.find(
                                (color) => color.id === example.first
                              )?.value,
                          }}
                        />

                        <span className="text-gray-500">+</span>

                        <div
                          className="w-10 h-10 rounded-full"
                          style={{
                            backgroundColor:
                              PRIMARY_COLORS.find(
                                (color) => color.id === example.second
                              )?.value,
                          }}
                        />
                      </div>

                      <div className="mt-4">
                        <span className="text-white font-bold">
                          {example.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-600">
                    Experiments made: {experimentCount}
                  </p>
                </div>

                <div className="text-center mt-6">
                  <button
                    type="button"
                    onClick={() => setStage('reflect')}
                    className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold inline-flex items-center gap-2"
                  >
                    Reflect on Your Experiment
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* REFLECT */}
            {stage === 'reflect' && (
              <motion.div
                key="reflect"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-center">
                  <Lightbulb className="w-9 h-9 text-indigo-400 mx-auto mb-4" />

                  <h3 className="text-xl font-bold text-white">
                    Think like an artist
                  </h3>

                  <p className="text-gray-400 text-sm mt-2">
                    Tell us about your colour experiment.
                  </p>
                </div>

                <div className="mt-7 space-y-5">
                  <div>
                    <label
                      htmlFor="colour-reflection"
                      className="block text-sm font-semibold text-gray-300 mb-2"
                    >
                      Which colour combination did you enjoy?
                    </label>

                    <textarea
                      id="colour-reflection"
                      value={reflection}
                      onChange={(event) =>
                        setReflection(event.target.value)
                      }
                      placeholder="I liked..."
                      className="w-full min-h-[120px] bg-gray-950 border border-gray-800 rounded-xl p-4 text-white placeholder:text-gray-600 resize-none outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />

                    <p className="text-sm text-gray-300">
                      Artists often experiment. There does not have to be
                      only one “right” colour choice.
                    </p>
                  </div>
                </div>

                <div className="text-center mt-6">
                  <button
                    type="button"
                    onClick={() => setStage('master')}
                    className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold inline-flex items-center gap-2"
                  >
                    Complete Activity
                    <CheckCircle className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* MASTER */}
            {stage === 'master' && (
              <motion.div
                key="master"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <CheckCircle className="w-14 h-14 text-green-400 mx-auto mb-4" />

                <h3 className="text-2xl font-bold text-white">
                  Colour exploration complete
                </h3>

                <p className="text-gray-400 mt-2 max-w-lg mx-auto">
                  You explored colour relationships, made predictions,
                  experimented, and reflected on your creative choices.
                </p>

                <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                  {[
                    ['Observe', 'Noticed colour differences'],
                    ['Mix', 'Combined colours'],
                    ['Predict', 'Made a prediction'],
                    ['Reflect', 'Thought about choices'],
                  ].map(([title, description]) => (
                    <div
                      key={title}
                      className="p-4 bg-gray-900 border border-gray-800 rounded-xl"
                    >
                      <CheckCircle className="w-4 h-4 text-green-400 mb-2" />

                      <p className="text-white text-sm font-semibold">
                        {title}
                      </p>

                      <p className="text-xs text-gray-600 mt-1">
                        {description}
                      </p>
                    </div>
                  ))}
                </div>

                {reflection.trim() && (
                  <div className="mt-6 p-5 bg-gray-900 border border-gray-800 rounded-2xl">
                    <p className="text-xs uppercase tracking-wider text-gray-600">
                      Artist reflection
                    </p>

                    <p className="text-gray-300 italic mt-2">
                      “{reflection.trim()}”
                    </p>
                  </div>
                )}

                <div className="mt-6 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <p className="text-sm text-indigo-300">
                    Experiments completed: {experimentCount}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Prediction attempts: {attempts}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={reset}
                  className="mt-6 px-5 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Explore Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Learning framework */}
      <div className="mt-5 p-5 bg-app-card border border-app-border rounded-2xl">
        <div className="flex items-start gap-3">
          <Palette className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />

          <div>
            <p className="text-sm font-semibold text-white">
              Art learning progression
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Observe → Explore → Mix → Predict → Compare → Create → Reflect
              → Master
            </p>

            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              This activity develops colour recognition, visual observation,
              prediction, experimentation, creative decision-making,
              vocabulary, and reflection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};