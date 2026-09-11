import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Eye,
  GitCompare,
  Hand,
  RotateCcw,
  ArrowRight,
  Volume2,
} from 'lucide-react';

import { playSoundFeedback } from '../../../services/soundFeedback';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

type TextureId = 'rough' | 'smooth' | 'bumpy' | 'soft';

type ActivityStage =
  | 'observe'
  | 'identify'
  | 'compare'
  | 'classify'
  | 'reflect'
  | 'complete';

type TextureBoard = {
  id: TextureId;
  name: string;
  emoji: string;
  description: string;
  sensoryWords: string[];
  visualPattern: string;
};

const BOARDS: TextureBoard[] = [
  {
    id: 'rough',
    name: 'Rough',
    emoji: '🪨',
    description: 'A surface with an uneven, coarse feel.',
    sensoryWords: ['coarse', 'uneven', 'scratchy'],
    visualPattern:
      'radial-gradient(circle at 20% 30%, #737373 0 2px, transparent 3px), radial-gradient(circle at 70% 60%, #525252 0 2px, transparent 3px)',
  },
  {
    id: 'smooth',
    name: 'Smooth',
    emoji: '🪞',
    description: 'A surface that feels even and has little texture.',
    sensoryWords: ['even', 'flat', 'silky'],
    visualPattern:
      'linear-gradient(135deg, #d4d4d4 0%, #a3a3a3 50%, #e5e5e5 100%)',
  },
  {
    id: 'bumpy',
    name: 'Bumpy',
    emoji: '🧽',
    description: 'A surface with many raised areas or bumps.',
    sensoryWords: ['raised', 'uneven', 'lumpy'],
    visualPattern:
      'radial-gradient(circle, #737373 0 5px, #525252 6px 8px, #404040 9px 12px)',
  },
  {
    id: 'soft',
    name: 'Soft',
    emoji: '🧸',
    description: 'A surface that gives easily when gently pressed.',
    sensoryWords: ['gentle', 'cushioned', 'fluffy'],
    visualPattern:
      'radial-gradient(circle at 30% 30%, #f5f5f5 0 8px, #d4d4d4 9px 15px, transparent 16px), radial-gradient(circle at 70% 70%, #e5e5e5 0 8px, #a3a3a3 9px 15px, transparent 16px)',
  },
];

const STAGES: ActivityStage[] = [
  'observe',
  'identify',
  'compare',
  'classify',
  'reflect',
  'complete',
];

const STAGE_LABELS: Record<ActivityStage, string> = {
  observe: 'Observe',
  identify: 'Identify',
  compare: 'Compare',
  classify: 'Classify',
  reflect: 'Reflect',
  complete: 'Complete',
};

export const RoughSmooth: React.FC = () => {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const { speak, stopSpeaking } = useReadAloud();

  const [stage, setStage] = useState<ActivityStage>('observe');
  const [selected, setSelected] = useState<TextureId | null>(null);
  const [comparison, setComparison] = useState<TextureId[]>([]);
  const [classification, setClassification] = useState<
    Record<TextureId, 'natural' | 'manmade' | null>
  >({
    rough: null,
    smooth: null,
    bumpy: null,
    soft: null,
  });
  const [feedback, setFeedback] = useState('');
  const [reflection, setReflection] = useState('');

  const stageIndex = STAGES.indexOf(stage);

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
          'Observe different surfaces. Our screen cannot reproduce real touch. Instead, we will use pictures, words, and examples to learn how people describe different textures.'
        );
      } else if (stage === 'identify') {
        speak(
          'Identify the texture. Choose a surface and learn the words we use to describe it.'
        );
      } else if (stage === 'compare') {
        speak(
          'Compare two textures. Choose two surfaces and think about how their sensory qualities are different.'
        );
      } else if (stage === 'classify') {
        speak(
          'Think about where textures come from. Some textures can be found in nature. Others are created or manufactured by people.'
        );
      } else if (stage === 'reflect') {
        speak(
          'Use your own experience. Think about something you have touched before, and describe what it felt like.'
        );
      }
    }, 450);

    return () => window.clearTimeout(timer);
  }, [stage, autoReadEnabled, speak]);

  /* =======================================================
     SELECTED TEXTURE NARRATION
     Fires when a texture is tapped during the identify stage.
     Names the texture + description + sensory words.
  ======================================================= */

  useEffect(() => {
    if (stage !== 'identify') return;
    if (!selected) return;

    const board = BOARDS.find((b) => b.id === selected);
    if (!board) return;

    const timer = window.setTimeout(() => {
      speak(
        `${board.name}. ${board.description} Words we can use: ${board.sensoryWords.join(', ')}.`
      );
    }, 250);

    return () => window.clearTimeout(timer);
  }, [selected, stage, speak]);

  /* =======================================================
     FEEDBACK NARRATION
     Every non-empty feedback message is spoken. Covers
     the comparison result and the "choose two textures"
     nudge.
  ======================================================= */

  useEffect(() => {
    if (!feedback) return;

    speak(feedback);
  }, [feedback, speak]);

  /* =======================================================
     COMPLETION NARRATION — fires once on stage === 'complete'
     Deliberately does not read the child's own reflection.
  ======================================================= */

  useEffect(() => {
    if (stage !== 'complete') return;

    if (soundEnabled) playSoundFeedback('correct');

    speak(
      `Sensory explorer complete. You observed, identified, compared, and described different textures. ${
        reflection.trim()
          ? 'Thank you for describing what you noticed with your own hands.'
          : 'Remember, your hands are important tools for discovering the world.'
      }`
    );
  }, [stage, speak, soundEnabled, reflection]);

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

  const nextStage = () => {
    const nextIndex = stageIndex + 1;

    if (nextIndex < STAGES.length) {
      setStage(STAGES[nextIndex]);
      setFeedback('');
      setSelected(null);
      setComparison([]);
      if (soundEnabled) playSoundFeedback('move');
    }
  };

  const reset = () => {
    stopSpeaking();
    setStage('observe');
    setSelected(null);
    setComparison([]);
    setClassification({
      rough: null,
      smooth: null,
      bumpy: null,
      soft: null,
    });
    setFeedback('');
    setReflection('');
  };

  const handleIdentify = (id: TextureId) => {
    if (soundEnabled) playSoundFeedback('move');
    setSelected(id);
    // Narration handled by the selected-texture effect above.
  };

  const handleComparison = (id: TextureId) => {
    if (soundEnabled) playSoundFeedback('move');

    if (comparison.includes(id)) {
      setComparison(
        comparison.filter((textureId) => textureId !== id)
      );
      return;
    }

    if (comparison.length >= 2) {
      setComparison([comparison[1], id]);
      return;
    }

    setComparison([...comparison, id]);
  };

  const compareTextures = () => {
    if (comparison.length !== 2) {
      if (soundEnabled) playSoundFeedback('try-again');
      setFeedback('Choose two textures to compare.');
      return;
    }

    const first = BOARDS.find(
      (board) => board.id === comparison[0]
    );
    const second = BOARDS.find(
      (board) => board.id === comparison[1]
    );

    if (!first || !second) return;

    if (soundEnabled) playSoundFeedback('move');

    setFeedback(
      `${first.name} and ${second.name} have different sensory qualities. Look at the words that describe each one.`
    );
  };

  const classifyTexture = (
    id: TextureId,
    category: 'natural' | 'manmade'
  ) => {
    if (soundEnabled) playSoundFeedback('move');

    setClassification((current) => ({
      ...current,
      [id]: category,
    }));
  };

  const renderTexture = (
    board: TextureBoard,
    interactive = false,
    isSelected = false
  ) => (
    <motion.button
      key={board.id}
      type="button"
      onClick={
        interactive
          ? () =>
              stage === 'compare'
                ? handleComparison(board.id)
                : handleIdentify(board.id)
          : undefined
      }
      whileHover={interactive ? { scale: 1.03 } : undefined}
      whileTap={interactive ? { scale: 0.97 } : undefined}
      className={`
        relative overflow-hidden rounded-2xl border-2
        transition-all duration-200
        ${
          isSelected
            ? 'border-cyan-400 ring-2 ring-cyan-400/30'
            : 'border-gray-700'
        }
        ${interactive ? 'cursor-pointer' : 'cursor-default'}
      `}
    >
      <div
        className="absolute inset-0 opacity-70"
        style={{ background: board.visualPattern }}
      />

      <div className="relative bg-black/30 p-5 min-h-[150px] flex flex-col items-center justify-center">
        <span className="text-4xl mb-2">{board.emoji}</span>

        <span className="font-bold text-white">
          {board.name}
        </span>

        {isSelected && (
          <CheckCircle className="absolute top-3 right-3 w-5 h-5 text-cyan-300" />
        )}
      </div>
    </motion.button>
  );

  return (
    <div className="max-w-3xl mx-auto bg-app-card rounded-2xl border border-app-border shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-app-border">
        <div className="flex justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Hand className="w-5 h-5 text-amber-300" />

              <h3 className="text-xl font-bold text-white">
                Rough & Smooth
              </h3>
            </div>

            <p className="text-gray-400 text-sm">
              Explore tactile vocabulary and learn to notice
              differences between surfaces.
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
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition"
              aria-label="Reset activity"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Learning progression */}
        <div className="mt-5 flex items-center gap-1 overflow-x-auto pb-1">
          {STAGES.map((item, index) => {
            const active = item === stage;
            const completed = index < stageIndex;

            return (
              <React.Fragment key={item}>
                <div
                  className={`
                    flex items-center gap-1 px-2.5 py-1.5
                    rounded-full text-xs whitespace-nowrap
                    ${
                      active
                        ? 'bg-amber-400/20 text-amber-200 border border-amber-400/40'
                        : completed
                        ? 'bg-emerald-400/10 text-emerald-300'
                        : 'bg-gray-800 text-gray-500'
                    }
                  `}
                >
                  {completed && (
                    <CheckCircle className="w-3 h-3" />
                  )}
                  {STAGE_LABELS[item]}
                </div>

                {index < STAGES.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-gray-600 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="p-6">
        {/* OBSERVE */}
        {stage === 'observe' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <Eye className="w-10 h-10 mx-auto mb-3 text-cyan-400" />

              <h4 className="text-lg font-bold text-white">
                Observe different surfaces
              </h4>

              <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
                Our screen cannot reproduce real touch. Instead,
                we will use pictures, words, and examples to learn
                how people describe different textures.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {BOARDS.map((board) => renderTexture(board))}
            </div>

            <div className="bg-amber-400/10 border border-amber-400/20 rounded-xl p-4">
              <p className="text-sm text-amber-100">
                <strong>Sensorial idea:</strong> When we touch an
                object, our hands can notice qualities such as
                roughness, smoothness, softness, hardness, and
                bumps.
              </p>
            </div>

            <button
              type="button"
              onClick={nextStage}
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold transition"
            >
              Identify the textures
            </button>
          </motion.div>
        )}

        {/* IDENTIFY */}
        {stage === 'identify' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <Hand className="w-10 h-10 mx-auto mb-3 text-cyan-400" />

              <h4 className="text-lg font-bold text-white">
                Identify the texture
              </h4>

              <p className="text-gray-400 text-sm mt-2">
                Choose a surface and learn the words we use to
                describe it.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {BOARDS.map((board) =>
                renderTexture(
                  board,
                  true,
                  selected === board.id
                )
              )}
            </div>

            {selected && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900 border border-app-border rounded-xl p-5"
              >
                {(() => {
                  const board = BOARDS.find(
                    (item) => item.id === selected
                  );

                  if (!board) return null;

                  return (
                    <>
                      <h5 className="text-white font-bold">
                        {board.name}
                      </h5>

                      <p className="text-gray-400 text-sm mt-2">
                        {board.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {board.sensoryWords.map((word) => (
                          <span
                            key={word}
                            className="px-2.5 py-1 rounded-full bg-cyan-400/10 text-cyan-300 text-xs"
                          >
                            {word}
                          </span>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            )}

            <button
              type="button"
              onClick={nextStage}
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold transition"
            >
              Compare textures
            </button>
          </motion.div>
        )}

        {/* COMPARE */}
        {stage === 'compare' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <GitCompare className="w-10 h-10 mx-auto mb-3 text-cyan-400" />

              <h4 className="text-lg font-bold text-white">
                Compare two textures
              </h4>

              <p className="text-gray-400 text-sm mt-2">
                Choose two surfaces. Think about how their sensory
                qualities are different.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {BOARDS.map((board) =>
                renderTexture(
                  board,
                  true,
                  comparison.includes(board.id)
                )
              )}
            </div>

            {feedback && (
              <div className="bg-cyan-400/10 border border-cyan-400/20 rounded-xl p-4 text-center">
                <p className="text-sm text-cyan-100">
                  {feedback}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={compareTextures}
                className="flex-1 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold transition"
              >
                Compare
              </button>

              <button
                type="button"
                onClick={nextStage}
                className="flex-1 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold transition"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {/* CLASSIFY */}
        {stage === 'classify' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h4 className="text-lg font-bold text-white">
                Think about where textures come from
              </h4>

              <p className="text-gray-400 text-sm mt-2">
                Some textures can be found in nature. Others are
                created or manufactured by people.
              </p>
            </div>

            <div className="space-y-4">
              {BOARDS.map((board) => (
                <div
                  key={board.id}
                  className="bg-gray-900 rounded-xl border border-app-border p-4"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">
                      {board.emoji}
                    </span>

                    <span className="font-semibold text-white">
                      {board.name}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        classifyTexture(board.id, 'natural')
                      }
                      className={`
                        py-2 rounded-lg text-xs transition
                        ${
                          classification[board.id] === 'natural'
                            ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }
                      `}
                    >
                      Nature
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        classifyTexture(board.id, 'manmade')
                      }
                      className={`
                        py-2 rounded-lg text-xs transition
                        ${
                          classification[board.id] === 'manmade'
                            ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/40'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }
                      `}
                    >
                      Made by people
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-amber-400/10 border border-amber-400/20 rounded-xl p-4">
              <p className="text-sm text-amber-100">
                There is not always one correct answer. A texture
                can appear in many different objects and materials.
                The important skill here is noticing and describing
                the sensory quality.
              </p>
            </div>

            <button
              type="button"
              onClick={nextStage}
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold transition"
            >
              Reflect
            </button>
          </motion.div>
        )}

        {/* REFLECT */}
        {stage === 'reflect' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h4 className="text-lg font-bold text-white">
                Use your own experience
              </h4>

              <p className="text-gray-400 text-sm mt-2">
                Think about something you have touched before.
              </p>
            </div>

            <div className="bg-gray-900 rounded-xl border border-app-border p-5">
              <label
                htmlFor="texture-reflection"
                className="block text-sm text-gray-300 mb-3"
              >
                What did it feel like?
              </label>

              <textarea
                id="texture-reflection"
                value={reflection}
                onChange={(event) =>
                  setReflection(event.target.value)
                }
                placeholder="For example: The stone felt rough..."
                rows={4}
                className="w-full rounded-xl bg-gray-950 border border-gray-700 text-white placeholder:text-gray-600 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              />
            </div>

            <div className="bg-cyan-400/10 border border-cyan-400/20 rounded-xl p-4">
              <p className="text-sm text-cyan-100">
                <strong>Remember:</strong> Your hands are important
                tools for discovering the world. Touch carefully and
                describe what you notice.
              </p>
            </div>

            <button
              type="button"
              onClick={nextStage}
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold transition"
            >
              Finish activity
            </button>
          </motion.div>
        )}

        {/* COMPLETE */}
        {stage === 'complete' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 text-center"
          >
            <CheckCircle className="w-16 h-16 mx-auto text-emerald-400" />

            <div>
              <h4 className="text-2xl font-bold text-white">
                Sensory explorer complete
              </h4>

              <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
                You observed, identified, compared, and described
                different textures.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="bg-gray-900 rounded-xl p-4">
                <p className="text-amber-300 font-semibold text-sm">
                  You practised
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  Tactile vocabulary
                </p>
              </div>

              <div className="bg-gray-900 rounded-xl p-4">
                <p className="text-amber-300 font-semibold text-sm">
                  You explored
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  Texture discrimination
                </p>
              </div>

              <div className="bg-gray-900 rounded-xl p-4">
                <p className="text-amber-300 font-semibold text-sm">
                  You developed
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  Observation and description
                </p>
              </div>
            </div>

            {reflection.trim() && (
              <div className="bg-gray-900 border border-app-border rounded-xl p-4 text-left">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                  Your reflection
                </p>

                <p className="text-sm text-gray-300">
                  {reflection}
                </p>
              </div>
            )}

            <div className="bg-cyan-400/10 border border-cyan-400/20 rounded-xl p-4">
              <p className="text-sm text-cyan-100">
                <strong>Reflect:</strong> What other textures would
                you like to investigate in the real world?
              </p>
            </div>

            <button
              type="button"
              onClick={reset}
              className="w-full py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold transition"
            >
              Explore Again
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};