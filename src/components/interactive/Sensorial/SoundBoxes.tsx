import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { motion } from 'framer-motion';
import {
  Volume2,
  Ear,
  GitCompare,
  Brain,
  RotateCcw,
  CheckCircle,
  ArrowRight,
  Play,
} from 'lucide-react';

import { playSoundFeedback } from '../../../services/soundFeedback';
import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

type SoundId =
  | 'bell'
  | 'rattle'
  | 'whistle'
  | 'drum'
  | 'rain'
  | 'birds';

type ActivityStage =
  | 'listen'
  | 'identify'
  | 'compare'
  | 'remember'
  | 'sequence'
  | 'reflect'
  | 'complete';

type SoundBox = {
  id: SoundId;
  name: string;
  emoji: string;
  description: string;
  quality: string;
};

const SOUNDS: SoundBox[] = [
  {
    id: 'bell',
    name: 'Soft Bell',
    emoji: '🔔',
    description: 'A clear, gentle ringing sound.',
    quality: 'Clear and ringing',
  },
  {
    id: 'rattle',
    name: 'Rattle',
    emoji: '🪇',
    description: 'A series of small, quick sounds.',
    quality: 'Shaking and repeated',
  },
  {
    id: 'whistle',
    name: 'Whistle',
    emoji: '🪈',
    description: 'A high, steady tone.',
    quality: 'High and steady',
  },
  {
    id: 'drum',
    name: 'Drum',
    emoji: '🥁',
    description: 'A short, low percussive sound.',
    quality: 'Low and percussive',
  },
  {
    id: 'rain',
    name: 'Rain',
    emoji: '🌧️',
    description: 'Many tiny sounds occurring together.',
    quality: 'Soft and continuous',
  },
  {
    id: 'birds',
    name: 'Birdsong',
    emoji: '🐦',
    description: 'Short, changing high sounds.',
    quality: 'High and changing',
  },
];

const STAGES: ActivityStage[] = [
  'listen',
  'identify',
  'compare',
  'remember',
  'sequence',
  'reflect',
  'complete',
];

const STAGE_LABELS: Record<ActivityStage, string> = {
  listen: 'Listen',
  identify: 'Identify',
  compare: 'Compare',
  remember: 'Remember',
  sequence: 'Sequence',
  reflect: 'Reflect',
  complete: 'Complete',
};

export const SoundBoxes: React.FC = () => {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const { speak, stopSpeaking } = useReadAloud();

  const [stage, setStage] = useState<ActivityStage>('listen');
  const [selectedSound, setSelectedSound] = useState<SoundId | null>(
    null
  );
  const [comparison, setComparison] = useState<SoundId[]>([]);
  const [rememberedSound, setRememberedSound] =
    useState<SoundId | null>(null);
  const [sequence, setSequence] = useState<SoundId[]>([]);
  const [feedback, setFeedback] = useState('');
  const [reflection, setReflection] = useState('');
  const [isPlaying, setIsPlaying] = useState<SoundId | null>(null);
  const [attempts, setAttempts] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const stageIndex = STAGES.indexOf(stage);

  /* =======================================================
     AUDIO ENGINE (unchanged from original)
  ======================================================= */

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (
          window as typeof window & {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext;

      if (!AudioContextClass) {
        return null;
      }

      audioContextRef.current = new AudioContextClass();
    }

    return audioContextRef.current;
  }, []);

  const playTone = useCallback(
    (
      context: AudioContext,
      frequency: number,
      duration: number,
      type: OscillatorType = 'sine',
      volume = 0.12
    ) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = type;
      oscillator.frequency.value = frequency;

      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        volume,
        context.currentTime + 0.02
      );
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        context.currentTime + duration
      );

      oscillator.connect(gain);
      gain.connect(context.destination);

      oscillator.start();
      oscillator.stop(context.currentTime + duration + 0.05);
    },
    []
  );

  const playSound = useCallback(
    async (soundId: SoundId) => {
      const context = getAudioContext();

      if (!context) {
        setFeedback(
          'Your browser does not support the sound activity.'
        );
        return;
      }

      if (context.state === 'suspended') {
        await context.resume();
      }

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      setIsPlaying(soundId);
      setFeedback('');

      switch (soundId) {
        case 'bell': {
          playTone(context, 880, 0.7, 'sine', 0.12);
          window.setTimeout(() => {
            playTone(context, 1320, 0.45, 'sine', 0.06);
          }, 90);
          break;
        }

        case 'rattle': {
          for (let i = 0; i < 8; i += 1) {
            window.setTimeout(() => {
              playTone(
                context,
                500 + Math.random() * 700,
                0.06,
                'square',
                0.035
              );
            }, i * 65);
          }
          break;
        }

        case 'whistle': {
          playTone(context, 1500, 0.8, 'sine', 0.09);
          break;
        }

        case 'drum': {
          playTone(context, 130, 0.25, 'triangle', 0.2);
          break;
        }

        case 'rain': {
          for (let i = 0; i < 22; i += 1) {
            window.setTimeout(() => {
              playTone(
                context,
                800 + Math.random() * 1600,
                0.035,
                'sine',
                0.018
              );
            }, i * 55);
          }
          break;
        }

        case 'birds': {
          playTone(context, 1700, 0.18, 'sine', 0.07);
          window.setTimeout(() => {
            playTone(context, 2100, 0.15, 'sine', 0.06);
          }, 220);
          window.setTimeout(() => {
            playTone(context, 1800, 0.2, 'sine', 0.06);
          }, 430);
          break;
        }
      }

      timeoutRef.current = window.setTimeout(() => {
        setIsPlaying(null);
      }, 1100);
    },
    [getAudioContext, playTone]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      if (audioContextRef.current) {
        void audioContextRef.current.close();
      }
    };
  }, []);

  /* =======================================================
     AUTO-READ — stage prompts
     Skipped on 'complete' (has its own effect below).
     Skipped on 'remember' — that stage must not reveal names.
  ======================================================= */

  useEffect(() => {
    if (!autoReadEnabled) return;
    if (stage === 'complete') return;
    if (stage === 'remember') return;

    const timer = window.setTimeout(() => {
      if (stage === 'listen') {
        speak(
          'Listen carefully. Tap each sound box. Close your eyes if you like and concentrate on what you hear.'
        );
      } else if (stage === 'identify') {
        speak(
          'Identify what you hear. Tap a box to hear its sound and discover its name.'
        );
      } else if (stage === 'compare') {
        speak(
          'Compare two sounds. Choose two sound boxes, then listen to them one after another.'
        );
      } else if (stage === 'sequence') {
        speak(
          'Build a sound sequence. Choose three different sounds, then listen to your sequence in order.'
        );
      } else if (stage === 'reflect') {
        speak(
          'Reflect on listening. Think about the sounds you heard. Which sound was easiest for you to recognise?'
        );
      }
    }, 450);

    return () => window.clearTimeout(timer);
  }, [stage, autoReadEnabled, speak]);

  /* =======================================================
     AUTO-READ — remember stage prompt
     Fires when the remember stage begins, WITHOUT naming any
     sound. Reads the instruction only.
  ======================================================= */

  useEffect(() => {
    if (!autoReadEnabled) return;
    if (stage !== 'remember') return;

    const timer = window.setTimeout(() => {
      speak(
        'Remember the sound. Tap play to hear a mystery sound. Then choose the box you think made it.'
      );
    }, 450);

    return () => window.clearTimeout(timer);
  }, [stage, autoReadEnabled, speak]);

  /* =======================================================
     SELECTED SOUND NARRATION — identify stage only
     Fires when the child taps a box during identify and
     the tone has finished playing.
  ======================================================= */

  useEffect(() => {
    if (stage !== 'identify') return;
    if (!selectedSound) return;
    if (isPlaying) return; // wait until the tone finishes

    const sound = SOUNDS.find((s) => s.id === selectedSound);
    if (!sound) return;

    const timer = window.setTimeout(() => {
      speak(`${sound.name}. ${sound.description}`);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [selectedSound, isPlaying, stage, speak]);

  /* =======================================================
     FEEDBACK NARRATION
     Every non-empty feedback message is spoken. Covers
     compare prompt, sequence prompt, and remember-stage
     feedback. Never names the mystery sound during the
     remember stage.
  ======================================================= */

  useEffect(() => {
    if (!feedback) return;

    speak(feedback);
  }, [feedback, speak]);

  /* =======================================================
     COMPLETION NARRATION
  ======================================================= */

  useEffect(() => {
    if (stage !== 'complete') return;

    if (soundEnabled) playSoundFeedback('correct');

    speak(
      `Excellent listening. You listened carefully, compared sounds, used auditory memory, and created a sound sequence. ${
        reflection.trim()
          ? 'Thank you for writing your reflection.'
          : 'Close your eyes and identify three sounds around you.'
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
     ACTIVITY CONTROLS
  ======================================================= */

  const nextStage = () => {
    const nextIndex = stageIndex + 1;

    if (nextIndex < STAGES.length) {
      setStage(STAGES[nextIndex]);
      setSelectedSound(null);
      setComparison([]);
      setFeedback('');
      if (soundEnabled) playSoundFeedback('move');
    }
  };

  const reset = () => {
    stopSpeaking();
    setStage('listen');
    setSelectedSound(null);
    setComparison([]);
    setRememberedSound(null);
    setSequence([]);
    setFeedback('');
    setReflection('');
    setIsPlaying(null);
    setAttempts(0);
  };

  const handleIdentify = async (sound: SoundBox) => {
    if (soundEnabled) playSoundFeedback('move');
    setSelectedSound(sound.id);
    await playSound(sound.id);
    // Narration handled by the selected-sound effect above.
  };

  const handleComparisonSelect = (id: SoundId) => {
    if (soundEnabled) playSoundFeedback('move');

    if (comparison.includes(id)) {
      setComparison(
        comparison.filter((soundId) => soundId !== id)
      );
      return;
    }

    if (comparison.length >= 2) {
      setComparison([comparison[1], id]);
      return;
    }

    setComparison([...comparison, id]);
  };

  const handleCompare = async () => {
    if (comparison.length !== 2) {
      if (soundEnabled) playSoundFeedback('try-again');
      setFeedback('Choose two sound boxes to compare.');
      return;
    }

    setAttempts((value) => value + 1);

    setFeedback(
      'Listen to both sounds one after another. What is different about them?'
    );

    await playSound(comparison[0]);

    window.setTimeout(() => {
      void playSound(comparison[1]);
    }, 1300);
  };

  const playRememberChallenge = async () => {
    const randomIndex = Math.floor(Math.random() * SOUNDS.length);
    const sound = SOUNDS[randomIndex];

    setRememberedSound(sound.id);
    setSelectedSound(null);
    setFeedback(
      'Listen carefully. Now try to remember which sound you heard.'
    );

    await playSound(sound.id);

    window.setTimeout(() => {
      setRememberedSound(null);
    }, 1400);
  };

  const handleMemoryAnswer = async (id: SoundId) => {
    setAttempts((value) => value + 1);

    if (id === rememberedSound) {
      if (soundEnabled) playSoundFeedback('correct');
      setSelectedSound(id);
      setFeedback('Excellent listening memory.');
    } else {
      if (soundEnabled) playSoundFeedback('try-again');
      setSelectedSound(id);
      setFeedback(
        'That is okay. Listen again and notice the sound carefully.'
      );
    }

    await playSound(id);
  };

  const handleSequence = (id: SoundId) => {
    if (sequence.includes(id)) return;

    if (soundEnabled) playSoundFeedback('move');

    const nextSequence = [...sequence, id];

    setSequence(nextSequence);

    if (nextSequence.length === 3) {
      setFeedback(
        'You created a three-sound sequence. Try listening to each sound in order.'
      );
    }
  };

  const renderSoundBox = (
    sound: SoundBox,
    interactive = true,
    selected = false
  ) => {
    const playing = isPlaying === sound.id;

    return (
      <motion.button
        key={sound.id}
        type="button"
        disabled={!interactive}
        onClick={() => {
          if (stage === 'compare') {
            handleComparisonSelect(sound.id);
          } else if (stage === 'remember') {
            void handleMemoryAnswer(sound.id);
          } else if (stage === 'sequence') {
            handleSequence(sound.id);
          } else {
            void handleIdentify(sound);
          }
        }}
        whileHover={interactive ? { scale: 1.03 } : undefined}
        whileTap={interactive ? { scale: 0.96 } : undefined}
        className={`
          relative rounded-2xl p-5 border-2 transition-all
          ${
            selected
              ? 'border-cyan-400 bg-cyan-400/10 ring-2 ring-cyan-400/20'
              : 'border-gray-700 bg-gray-900 hover:border-gray-600'
          }
          ${playing ? 'ring-2 ring-indigo-400 bg-indigo-500/10' : ''}
        `}
      >
        {playing && (
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-indigo-400"
            animate={{ opacity: [0.2, 0.9, 0.2] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}

        <div className="relative flex flex-col items-center">
          <div
            className={`
              w-14 h-14 rounded-full flex items-center
              justify-center mb-3
              ${
                playing
                  ? 'bg-indigo-400/20'
                  : 'bg-gray-800'
              }
            `}
          >
            {playing ? (
              <Volume2 className="w-7 h-7 text-indigo-300" />
            ) : (
              <span className="text-3xl">📦</span>
            )}
          </div>

          <span className="font-semibold text-white text-sm">
            {stage === 'listen' || stage === 'compare'
              ? 'Sound Box'
              : sound.name}
          </span>

          {stage !== 'listen' && (
            <span className="text-xs text-gray-500 mt-1">
              {sound.quality}
            </span>
          )}

          {selected && (
            <CheckCircle className="absolute -top-2 -right-2 w-5 h-5 text-cyan-300" />
          )}
        </div>
      </motion.button>
    );
  };

  return (
    <div className="max-w-3xl mx-auto bg-app-card rounded-2xl border border-app-border shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-app-border">
        <div className="flex justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Ear className="w-5 h-5 text-indigo-300" />

              <h3 className="text-xl font-bold text-white">
                Sound Boxes
              </h3>
            </div>

            <p className="text-gray-400 text-sm">
              Listen carefully, compare sounds, and strengthen
              auditory discrimination.
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
              aria-label="Reset Sound Boxes"
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
                        ? 'bg-indigo-400/20 text-indigo-200 border border-indigo-400/40'
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
        {/* LISTEN */}
        {stage === 'listen' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <Ear className="w-10 h-10 mx-auto mb-3 text-indigo-300" />

              <h4 className="text-lg font-bold text-white">
                Listen carefully
              </h4>

              <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
                Tap each sound box. Close your eyes if you like and
                concentrate on what you hear.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {SOUNDS.map((sound) =>
                renderSoundBox(sound, true)
              )}
            </div>

            <div className="bg-indigo-400/10 border border-indigo-400/20 rounded-xl p-4">
              <p className="text-sm text-indigo-100">
                <strong>Listening tip:</strong> Try to notice whether
                a sound is high or low, short or long, soft or loud,
                steady or changing.
              </p>
            </div>

            <button
              type="button"
              onClick={nextStage}
              className="w-full py-3 rounded-xl bg-indigo-400 hover:bg-indigo-300 text-slate-900 font-semibold transition"
            >
              Identify the sounds
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
              <Volume2 className="w-10 h-10 mx-auto mb-3 text-indigo-300" />

              <h4 className="text-lg font-bold text-white">
                Identify what you hear
              </h4>

              <p className="text-gray-400 text-sm mt-2">
                Tap a box to hear its sound and discover its name.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {SOUNDS.map((sound) =>
                renderSoundBox(
                  sound,
                  true,
                  selectedSound === sound.id
                )
              )}
            </div>

            {selectedSound && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900 border border-app-border rounded-xl p-5 text-center"
              >
                {(() => {
                  const sound = SOUNDS.find(
                    (item) => item.id === selectedSound
                  );

                  if (!sound) return null;

                  return (
                    <>
                      <div className="text-4xl mb-2">
                        {sound.emoji}
                      </div>

                      <h5 className="text-white font-bold">
                        {sound.name}
                      </h5>

                      <p className="text-gray-400 text-sm mt-2">
                        {sound.description}
                      </p>

                      <button
                        type="button"
                        onClick={() => void playSound(sound.id)}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-sm transition"
                      >
                        <Play className="w-4 h-4" />
                        Hear again
                      </button>
                    </>
                  );
                })()}
              </motion.div>
            )}

            <button
              type="button"
              onClick={nextStage}
              className="w-full py-3 rounded-xl bg-indigo-400 hover:bg-indigo-300 text-slate-900 font-semibold transition"
            >
              Compare sounds
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
              <GitCompare className="w-10 h-10 mx-auto mb-3 text-indigo-300" />

              <h4 className="text-lg font-bold text-white">
                Compare two sounds
              </h4>

              <p className="text-gray-400 text-sm mt-2">
                Choose two sound boxes. Then listen to them one
                after another.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {SOUNDS.map((sound) =>
                renderSoundBox(
                  sound,
                  true,
                  comparison.includes(sound.id)
                )
              )}
            </div>

            {feedback && (
              <div className="bg-indigo-400/10 border border-indigo-400/20 rounded-xl p-4 text-center">
                <p className="text-sm text-indigo-100">
                  {feedback}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => void handleCompare()}
                className="flex-1 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold transition"
              >
                Listen & Compare
              </button>

              <button
                type="button"
                onClick={nextStage}
                className="flex-1 py-3 rounded-xl bg-indigo-400 hover:bg-indigo-300 text-slate-900 font-semibold transition"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {/* REMEMBER */}
        {stage === 'remember' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <Brain className="w-10 h-10 mx-auto mb-3 text-indigo-300" />

              <h4 className="text-lg font-bold text-white">
                Remember the sound
              </h4>

              <p className="text-gray-400 text-sm mt-2">
                Listen to one sound. Then choose the box that you
                think made it.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void playRememberChallenge()}
              className="w-full py-5 rounded-2xl bg-indigo-500/10 border border-indigo-400/30 hover:bg-indigo-500/20 transition"
            >
              <Volume2 className="w-8 h-8 mx-auto mb-2 text-indigo-300" />

              <span className="text-white font-semibold">
                Play a mystery sound
              </span>

              <span className="block text-gray-500 text-xs mt-1">
                Listen carefully
              </span>
            </button>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {SOUNDS.map((sound) =>
                renderSoundBox(
                  sound,
                  true,
                  selectedSound === sound.id
                )
              )}
            </div>

            {feedback && (
              <div
                className={`
                  rounded-xl p-4 text-center
                  ${
                    selectedSound === rememberedSound
                      ? 'bg-emerald-400/10 border border-emerald-400/20'
                      : 'bg-amber-400/10 border border-amber-400/20'
                  }
                `}
              >
                <p className="text-sm text-gray-200">
                  {feedback}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={nextStage}
              className="w-full py-3 rounded-xl bg-indigo-400 hover:bg-indigo-300 text-slate-900 font-semibold transition"
            >
              Create a sequence
            </button>
          </motion.div>
        )}

        {/* SEQUENCE */}
        {stage === 'sequence' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <Ear className="w-10 h-10 mx-auto mb-3 text-indigo-300" />

              <h4 className="text-lg font-bold text-white">
                Build a sound sequence
              </h4>

              <p className="text-gray-400 text-sm mt-2">
                Choose three different sounds. Then listen to your
                sequence in order.
              </p>
            </div>

            <div className="flex justify-center gap-3 min-h-[70px]">
              {[0, 1, 2].map((index) => {
                const soundId = sequence[index];
                const sound = SOUNDS.find(
                  (item) => item.id === soundId
                );

                return (
                  <div
                    key={index}
                    className="w-16 h-16 rounded-xl bg-gray-900 border border-app-border flex items-center justify-center"
                  >
                    {sound ? (
                      <span className="text-2xl">
                        {sound.emoji}
                      </span>
                    ) : (
                      <span className="text-gray-700">
                        {index + 1}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {SOUNDS.map((sound) =>
                renderSoundBox(
                  sound,
                  true,
                  sequence.includes(sound.id)
                )
              )}
            </div>

            {sequence.length === 3 && (
              <button
                type="button"
                onClick={async () => {
                  for (const id of sequence) {
                    await playSound(id);

                    await new Promise<void>((resolve) => {
                      window.setTimeout(resolve, 1200);
                    });
                  }

                  setFeedback(
                    'Listen to the sequence and try to remember the order.'
                  );
                }}
                className="w-full py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold transition"
              >
                Play My Sequence
              </button>
            )}

            {feedback && (
              <div className="bg-indigo-400/10 border border-indigo-400/20 rounded-xl p-4 text-center">
                <p className="text-sm text-indigo-100">
                  {feedback}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={nextStage}
              className="w-full py-3 rounded-xl bg-indigo-400 hover:bg-indigo-300 text-slate-900 font-semibold transition"
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
              <Ear className="w-10 h-10 mx-auto mb-3 text-indigo-300" />

              <h4 className="text-lg font-bold text-white">
                Reflect on listening
              </h4>

              <p className="text-gray-400 text-sm mt-2">
                Think about the sounds you heard.
              </p>
            </div>

            <div className="bg-gray-900 border border-app-border rounded-xl p-5">
              <label
                htmlFor="sound-reflection"
                className="block text-sm text-gray-300 mb-3"
              >
                Which sound was easiest for you to recognise?
              </label>

              <textarea
                id="sound-reflection"
                value={reflection}
                onChange={(event) =>
                  setReflection(event.target.value)
                }
                rows={4}
                placeholder="For example: The drum was easy to recognise because it sounded low..."
                className="w-full rounded-xl bg-gray-950 border border-gray-700 text-white placeholder:text-gray-600 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
              />
            </div>

            <div className="bg-cyan-400/10 border border-cyan-400/20 rounded-xl p-4">
              <p className="text-sm text-cyan-100">
                <strong>Listening skill:</strong> Good listeners
                notice small differences. You can practise by
                closing your eyes and listening to sounds around you.
              </p>
            </div>

            <button
              type="button"
              onClick={nextStage}
              className="w-full py-3 rounded-xl bg-indigo-400 hover:bg-indigo-300 text-slate-900 font-semibold transition"
            >
              Complete activity
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
                Excellent listening
              </h4>

              <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
                You listened carefully, compared sounds, used
                auditory memory, and created a sound sequence.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="bg-gray-900 rounded-xl p-4">
                <p className="text-indigo-300 font-semibold text-sm">
                  You practised
                </p>

                <p className="text-gray-400 text-xs mt-2">
                  Auditory discrimination
                </p>
              </div>

              <div className="bg-gray-900 rounded-xl p-4">
                <p className="text-indigo-300 font-semibold text-sm">
                  You explored
                </p>

                <p className="text-gray-400 text-xs mt-2">
                  Pitch, duration and sound quality
                </p>
              </div>

              <div className="bg-gray-900 rounded-xl p-4">
                <p className="text-indigo-300 font-semibold text-sm">
                  You developed
                </p>

                <p className="text-gray-400 text-xs mt-2">
                  Listening memory and sequencing
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
                <strong>Real-world challenge:</strong> Close your
                eyes and identify three sounds around you. Can you
                tell where each sound is coming from?
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