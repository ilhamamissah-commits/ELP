import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  RotateCcw,
  Volume2,
  Eye,
  Pencil,
  CheckCircle,
  Lightbulb,
  Hash,
  Sparkles,
} from 'lucide-react';

import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

type NumberStage =
  | 'observe'
  | 'count'
  | 'listen'
  | 'trace'
  | 'form'
  | 'check'
  | 'apply'
  | 'master';

type NumberData = {
  value: number;
  word: string;
  emoji: string;
  formationHint: string;
};

const NUMBERS: NumberData[] = [
  {
    value: 0,
    word: 'zero',
    emoji: '⚪',
    formationHint:
      'Start at the top and make one smooth oval all the way around.',
  },
  {
    value: 1,
    word: 'one',
    emoji: '⭐',
    formationHint:
      'Start at the top and draw a straight line down.',
  },
  {
    value: 2,
    word: 'two',
    emoji: '⭐',
    formationHint:
      'Curve across the top, move diagonally down, then draw along the bottom.',
  },
  {
    value: 3,
    word: 'three',
    emoji: '⭐',
    formationHint:
      'Make two curved bumps, one above the other.',
  },
  {
    value: 4,
    word: 'four',
    emoji: '⭐',
    formationHint:
      'Make the angled line, cross it, then draw the tall line down.',
  },
  {
    value: 5,
    word: 'five',
    emoji: '⭐',
    formationHint:
      'Start with the top, move down, then curve around the bottom.',
  },
  {
    value: 6,
    word: 'six',
    emoji: '⭐',
    formationHint:
      'Curve around from the top and close the rounded bottom.',
  },
  {
    value: 7,
    word: 'seven',
    emoji: '⭐',
    formationHint:
      'Draw across the top, then move diagonally down.',
  },
  {
    value: 8,
    word: 'eight',
    emoji: '⭐',
    formationHint:
      'Make one small loop on top and one larger loop below.',
  },
  {
    value: 9,
    word: 'nine',
    emoji: '⭐',
    formationHint:
      'Make the round top first, then bring the line down.',
  },
];

const STAGES: NumberStage[] = [
  'observe',
  'count',
  'listen',
  'trace',
  'form',
  'check',
  'apply',
  'master',
];

const CANVAS_SIZE = 500;

export const NumberTracing: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const { speak, stopSpeaking } = useReadAloud();

  const [numberIndex, setNumberIndex] = useState(0);
  const [stage, setStage] = useState<NumberStage>('observe');
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasWritten, setHasWritten] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentNumber = NUMBERS[numberIndex];

  const stageIndex = STAGES.indexOf(stage);

  /* =======================================================
     CANVAS DRAWING (unchanged from original)
  ======================================================= */

  const drawTemplate = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      value: number,
      showTemplate: boolean
    ) => {
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      ctx.strokeStyle = '#dbe4ee';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(45, 100);
      ctx.lineTo(455, 100);
      ctx.stroke();

      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(45, 250);
      ctx.lineTo(455, 250);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(45, 380);
      ctx.lineTo(455, 380);
      ctx.stroke();

      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.moveTo(45, 430);
      ctx.lineTo(455, 430);
      ctx.stroke();

      ctx.setLineDash([]);

      if (showTemplate) {
        ctx.save();

        ctx.font = '300px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 7;
        ctx.setLineDash([8, 8]);

        ctx.strokeText(
          value.toString(),
          CANVAS_SIZE / 2,
          255
        );

        ctx.setLineDash([]);
        ctx.restore();
      }
    },
    []
  );

  const redrawCanvas = useCallback(
    (showTemplate = true) => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      drawTemplate(
        ctx,
        currentNumber.value,
        showTemplate
      );
    },
    [currentNumber.value, drawTemplate]
  );

  useEffect(() => {
    redrawCanvas(stage === 'observe' || stage === 'trace');
  }, [redrawCanvas, stage]);

  const getPosition = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;

      if (!canvas) {
        return { x: 0, y: 0 };
      }

      const rect = canvas.getBoundingClientRect();

      return {
        x:
          ((event.clientX - rect.left) / rect.width) *
          canvas.width,
        y:
          ((event.clientY - rect.top) / rect.height) *
          canvas.height,
      };
    },
    []
  );

  const startDrawing = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (
        stage !== 'trace' &&
        stage !== 'form' &&
        stage !== 'apply'
      ) {
        return;
      }

      const canvas = canvasRef.current;

      if (!canvas) return;

      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      canvas.setPointerCapture(event.pointerId);

      // Yield narration to the child's strokes.
      stopSpeaking();

      const { x, y } = getPosition(event);

      ctx.beginPath();
      ctx.moveTo(x, y);

      ctx.lineWidth = 9;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#0f172a';

      setIsDrawing(true);
      setHasWritten(true);
    },
    [getPosition, stage, stopSpeaking]
  );

  const draw = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;

      const canvas = canvasRef.current;

      if (!canvas) return;

      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      const { x, y } = getPosition(event);

      ctx.lineTo(x, y);
      ctx.stroke();
    },
    [getPosition, isDrawing]
  );

  const stopDrawing = useCallback(
    (event?: React.PointerEvent<HTMLCanvasElement>) => {
      if (
        event &&
        canvasRef.current?.hasPointerCapture(event.pointerId)
      ) {
        canvasRef.current.releasePointerCapture(
          event.pointerId
        );
      }

      setIsDrawing(false);
    },
    []
  );

  const clearCanvas = useCallback(() => {
    stopSpeaking();
    redrawCanvas(stage === 'trace');

    setHasWritten(false);
    setFeedback(null);
  }, [redrawCanvas, stage, stopSpeaking]);

  /* =======================================================
     AUTO-READ — stage prompts
     The 'listen' stage reads the numeral + word.
     The 'count' and 'apply' stages do NOT read the emoji
     sequence (they'd say "star star star…").
     The 'form', 'trace' stages do NOT read the numeral.
  ======================================================= */

  useEffect(() => {
    if (!autoReadEnabled) return;

    const timer = window.setTimeout(() => {
      if (stage === 'observe') {
        speak(
          `Look at the numeral ${currentNumber.value}. Notice its shape and how it sits between the writing lines.`
        );
      } else if (stage === 'count') {
        speak(
          `Count the objects. How many are there?`
        );
      } else if (stage === 'listen') {
        speak(
          `${currentNumber.value}. ${currentNumber.word}.`
        );
      } else if (stage === 'trace') {
        speak(
          'Trace the numeral. Follow the dotted shape with your finger, mouse, or stylus.'
        );
      } else if (stage === 'form') {
        speak(
          'Your turn. Write the numeral yourself without tracing over the guide.'
        );
      } else if (stage === 'check') {
        speak(
          'Good effort. Compare your numeral with the example. Think about its shape, size, and position.'
        );
      } else if (stage === 'apply') {
        speak(
          `The numeral ${currentNumber.value} represents a quantity. Count the objects shown and connect them to the number.`
        );
      } else if (stage === 'master') {
        speak(
          `Number practised. You practised recognising the number ${currentNumber.value}, connecting it to quantity, hearing its name, and forming the numeral.`
        );
      }
    }, 450);

    return () => window.clearTimeout(timer);
  }, [
    stage,
    currentNumber.value,
    currentNumber.word,
    autoReadEnabled,
    speak,
  ]);

  /* =======================================================
     FEEDBACK NARRATION
  ======================================================= */

  useEffect(() => {
    if (!feedback) return;

    speak(feedback);
  }, [feedback, speak]);

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

  const handleCheck = useCallback(() => {
    if (!hasWritten) {
      setFeedback(
        'Make an attempt first. Follow the numeral shape slowly and carefully.'
      );
      return;
    }

    setAttempts((previous) => previous + 1);

    setFeedback(
      'Good effort! Compare your numeral with the example. Look at its shape, size and position on the writing lines.'
    );

    setStage('check');
  }, [hasWritten]);

  const handleApply = useCallback(() => {
    setFeedback(
      `You are working with the number ${currentNumber.value}. Count the objects and connect the quantity to the numeral.`
    );

    setStage('apply');
  }, [currentNumber.value]);

  const handleNextNumber = useCallback(() => {
    const nextIndex =
      (numberIndex + 1) % NUMBERS.length;

    stopSpeaking();

    setNumberIndex(nextIndex);
    setStage('observe');
    setHasWritten(false);
    setFeedback(null);
    setAttempts(0);
  }, [numberIndex, stopSpeaking]);

  const handleReset = useCallback(() => {
    stopSpeaking();

    setStage('observe');
    setHasWritten(false);
    setFeedback(null);
    setAttempts(0);

    setTimeout(() => {
      redrawCanvas(true);
    }, 0);
  }, [redrawCanvas, stopSpeaking]);

  /* =======================================================
     SPEAK NUMBER — now delegates to shared useReadAloud.
     Replaces the local SpeechSynthesisUtterance wrapper.
  ======================================================= */

  const speakNumber = useCallback(() => {
    speak(`${currentNumber.value}. ${currentNumber.word}.`);
  }, [currentNumber.value, currentNumber.word, speak]);

  const renderStage = () => {
    switch (stage) {
      case 'observe':
        return (
          <div className="space-y-4">
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-left">
              <div className="flex items-start gap-3">
                <Eye className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />

                <div>
                  <p className="font-semibold text-white">
                    Look at the numeral
                  </p>

                  <p className="mt-1 text-sm leading-relaxed text-gray-400">
                    Notice its shape and how it sits between the
                    writing lines.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStage('count')}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 font-bold text-white transition hover:bg-cyan-500"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        );

      case 'count':
        return (
          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <p className="mb-4 text-center text-sm text-gray-400">
                Count the objects. How many are there?
              </p>

              <div className="flex flex-wrap justify-center gap-3 rounded-xl bg-gray-900/60 p-5">
                {Array.from(
                  { length: currentNumber.value },
                  (_, index) => (
                    <span
                      key={index}
                      className="text-3xl"
                      aria-hidden="true"
                    >
                      {currentNumber.emoji}
                    </span>
                  )
                )}

                {currentNumber.value === 0 && (
                  <span className="text-sm font-semibold text-gray-500">
                    There are none.
                  </span>
                )}
              </div>

              <div className="mt-4 text-center">
                <span className="text-4xl font-bold text-emerald-400">
                  {currentNumber.value}
                </span>

                <p className="mt-1 text-sm text-gray-400">
                  {currentNumber.word}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStage('listen')}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 font-bold text-white transition hover:bg-cyan-500"
            >
              Hear and Say It
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        );

      case 'listen':
        return (
          <div className="space-y-4">
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5 text-center">
              <div className="text-7xl font-bold text-indigo-400">
                {currentNumber.value}
              </div>

              <p className="mt-2 text-xl font-semibold text-white">
                {currentNumber.word}
              </p>

              <button
                type="button"
                onClick={speakNumber}
                className="mx-auto mt-4 flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white transition hover:bg-indigo-500"
              >
                <Volume2 className="h-4 w-4" />
                Hear the Number
              </button>
            </div>

            <button
              type="button"
              onClick={() => setStage('trace')}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 font-bold text-white transition hover:bg-cyan-500"
            >
              Trace the Numeral
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        );

      case 'trace':
        return (
          <div className="space-y-4">
            <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 text-left">
              <div className="flex items-start gap-3">
                <Pencil className="mt-0.5 h-5 w-5 shrink-0 text-purple-400" />

                <div>
                  <p className="font-semibold text-white">
                    Trace the numeral
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    Follow the dotted shape with your finger,
                    mouse or stylus.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-app-border bg-gray-900/60 p-4 text-left">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Formation hint
              </p>

              <p className="mt-1 text-sm text-gray-300">
                {currentNumber.formationHint}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={clearCanvas}
                className="flex-1 rounded-xl border border-app-border bg-gray-800 px-4 py-3 font-semibold text-gray-200 transition hover:bg-gray-700"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={() => setStage('form')}
                className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white transition hover:bg-indigo-500"
              >
                Write Yourself
              </button>
            </div>
          </div>
        );

      case 'form':
        return (
          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-left">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />

                <div>
                  <p className="font-semibold text-white">
                    Your turn
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    Write the number{' '}
                    <strong className="text-white">
                      {currentNumber.value}
                    </strong>{' '}
                    without tracing over the guide.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={clearCanvas}
                className="flex-1 rounded-xl border border-app-border bg-gray-800 px-4 py-3 font-semibold text-gray-200 transition hover:bg-gray-700"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={handleCheck}
                className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 font-bold text-white transition hover:bg-emerald-500"
              >
                Check
              </button>
            </div>
          </div>
        );

      case 'check':
        return (
          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-6 w-6 shrink-0 text-emerald-400" />

                <div>
                  <p className="font-bold text-white">
                    Good effort!
                  </p>

                  <p className="mt-1 text-sm leading-relaxed text-gray-400">
                    Compare your numeral with the example. Think
                    about its shape, size and position.
                  </p>
                </div>
              </div>
            </div>

            {feedback && (
              <div className="rounded-xl bg-gray-800 p-4 text-sm text-gray-300">
                {feedback}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setStage('form');
                  redrawCanvas(false);
                  setHasWritten(false);
                }}
                className="flex-1 rounded-xl border border-app-border bg-gray-800 px-4 py-3 font-semibold text-gray-200 transition hover:bg-gray-700"
              >
                Try Again
              </button>

              <button
                type="button"
                onClick={handleApply}
                className="flex-1 rounded-xl bg-cyan-600 px-4 py-3 font-bold text-white transition hover:bg-cyan-500"
              >
                Use the Number
              </button>
            </div>
          </div>
        );

      case 'apply':
        return (
          <div className="space-y-4">
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
              <Hash className="mx-auto mb-3 h-8 w-8 text-cyan-400" />

              <h3 className="text-center font-bold text-white">
                Connect numeral and quantity
              </h3>

              <p className="mt-2 text-center text-sm leading-relaxed text-gray-400">
                The numeral{' '}
                <strong className="text-cyan-400">
                  {currentNumber.value}
                </strong>{' '}
                represents a quantity.
              </p>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {Array.from(
                  { length: currentNumber.value },
                  (_, index) => (
                    <span
                      key={index}
                      className="text-3xl"
                      aria-hidden="true"
                    >
                      {currentNumber.emoji}
                    </span>
                  )
                )}
              </div>
            </div>

            {feedback && (
              <div className="rounded-xl bg-gray-800 p-4 text-center text-sm text-gray-300">
                {feedback}
              </div>
            )}

            <button
              type="button"
              onClick={() => setStage('master')}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-500"
            >
              Complete Practice
              <CheckCircle className="h-4 w-4" />
            </button>
          </div>
        );

      case 'master':
        return (
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-center">
              <CheckCircle className="mx-auto mb-3 h-10 w-10 text-emerald-400" />

              <h3 className="text-xl font-bold text-white">
                Number practiced!
              </h3>

              <div className="mt-3 text-7xl font-bold text-cyan-400">
                {currentNumber.value}
              </div>

              <p className="mt-2 text-lg font-semibold text-white">
                {currentNumber.word}
              </p>

              <p className="mt-3 text-sm leading-relaxed text-gray-400">
                You practiced recognizing the number, connecting
                it to quantity, hearing its name and forming the
                numeral.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-app-border bg-gray-900/60 p-4">
                <p className="text-xs text-gray-500">
                  Attempts
                </p>

                <p className="mt-1 text-xl font-bold text-white">
                  {Math.max(attempts, 1)}
                </p>
              </div>

              <div className="rounded-xl border border-app-border bg-gray-900/60 p-4">
                <p className="text-xs text-gray-500">
                  Quantity
                </p>

                <p className="mt-1 text-xl font-bold text-cyan-400">
                  {currentNumber.value}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleNextNumber}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-bold text-white transition hover:bg-purple-500"
            >
              Next Number
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        );
    }
  };

  const progress =
    ((stageIndex + 1) / STAGES.length) * 100;

  return (
    <div className="mx-auto w-full max-w-2xl rounded-2xl border border-app-border bg-app-card p-5 shadow-xl sm:p-6">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Hash className="h-5 w-5 text-cyan-400" />

            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Numeracy Foundations
            </span>
          </div>

          <h2 className="text-xl font-bold text-white sm:text-2xl">
            Number Tracing
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Connect quantities, number names and numeral formation.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={toggleSound}
            aria-label="Toggle sound"
            className="rounded-lg bg-gray-800 p-2 transition-colors hover:bg-gray-700"
          >
            <Volume2
              className={`h-4 w-4 ${soundEnabled ? 'text-amber-300' : 'text-gray-500'}`}
            />
          </button>

          <button
            type="button"
            onClick={handleReset}
            aria-label="Reset number tracing"
            className="rounded-lg bg-gray-800 p-2 text-gray-300 transition hover:bg-gray-700"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-gray-500">
            {stage.charAt(0).toUpperCase() + stage.slice(1)}
          </span>

          <span className="text-gray-500">
            Number {numberIndex + 1} of {NUMBERS.length}
          </span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-gray-800">
          <div
            className="h-full rounded-full bg-cyan-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Number identity */}
      <div className="mb-5 rounded-xl border border-app-border bg-gray-900/50 p-4">
        <div className="flex items-center justify-center gap-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-cyan-400">
              {currentNumber.value}
            </div>

            <p className="mt-1 text-xs text-gray-500">
              numeral
            </p>
          </div>

          <div className="h-12 w-px bg-app-border" />

          <div className="text-center">
            <div className="text-xl font-bold text-indigo-400">
              {currentNumber.word}
            </div>

            <p className="mt-1 text-xs text-gray-500">
              number name
            </p>
          </div>

          <div className="h-12 w-px bg-app-border" />

          <div className="text-center">
            <div className="text-2xl">
              {currentNumber.emoji}
            </div>

            <p className="mt-1 text-xs text-gray-500">
              quantity
            </p>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="mb-5 flex justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-600 bg-white shadow-inner">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerCancel={stopDrawing}
          onPointerLeave={stopDrawing}
          className="block h-auto w-full touch-none cursor-crosshair"
          aria-label={`Number tracing canvas for ${currentNumber.value}`}
        />
      </div>

      {/* Stage content */}
      {renderStage()}

      {/* Learning sequence */}
      <div className="mt-6 border-t border-app-border pt-4">
        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-500">
          {STAGES.map((stageName, index) => (
            <React.Fragment key={stageName}>
              <span
                className={
                  stageIndex >= index
                    ? 'font-semibold text-cyan-400'
                    : ''
                }
              >
                {stageName.charAt(0).toUpperCase() +
                  stageName.slice(1)}
              </span>

              {index < STAGES.length - 1 && (
                <span>→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};