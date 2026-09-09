import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  RotateCcw,
  Volume2,
  Eye,
  Pencil,
  CheckCircle,
  Lightbulb,
  Sparkles,
} from 'lucide-react';

type LetterStage =
  | 'observe'
  | 'listen'
  | 'trace'
  | 'form'
  | 'check'
  | 'repeat'
  | 'master';

type LetterData = {
  letter: string;
  lowercase: string;
  sound: string;
  example: string;
  exampleEmoji: string;
  formationHint: string;
};

const LETTERS: LetterData[] = [
  {
    letter: 'A',
    lowercase: 'a',
    sound: '/æ/',
    example: 'Apple',
    exampleEmoji: '🍎',
    formationHint: 'Start at the top, move down, then make the other side and cross the middle.',
  },
  {
    letter: 'B',
    lowercase: 'b',
    sound: '/b/',
    example: 'Ball',
    exampleEmoji: '⚽',
    formationHint: 'Start at the top, go down, then make two rounded curves.',
  },
  {
    letter: 'C',
    lowercase: 'c',
    sound: '/k/',
    example: 'Cat',
    exampleEmoji: '🐱',
    formationHint: 'Start near the top and curve around to make an open C shape.',
  },
  {
    letter: 'D',
    lowercase: 'd',
    sound: '/d/',
    example: 'Dog',
    exampleEmoji: '🐶',
    formationHint: 'Make the round part first, then add the tall line.',
  },
  {
    letter: 'E',
    lowercase: 'e',
    sound: '/ɛ/',
    example: 'Egg',
    exampleEmoji: '🥚',
    formationHint: 'Start at the top and make a vertical line with three horizontal strokes.',
  },
  {
    letter: 'F',
    lowercase: 'f',
    sound: '/f/',
    example: 'Fish',
    exampleEmoji: '🐟',
    formationHint: 'Make a tall line, then add the top and middle strokes.',
  },
  {
    letter: 'G',
    lowercase: 'g',
    sound: '/ɡ/',
    example: 'Goat',
    exampleEmoji: '🐐',
    formationHint: 'Begin like C, then add the small horizontal stroke inside.',
  },
  {
    letter: 'H',
    lowercase: 'h',
    sound: '/h/',
    example: 'Hat',
    exampleEmoji: '🎩',
    formationHint: 'Make two tall lines and connect them across the middle.',
  },
  {
    letter: 'I',
    lowercase: 'i',
    sound: '/ɪ/',
    example: 'Igloo',
    exampleEmoji: '🏠',
    formationHint: 'Make a short vertical stroke and remember the dot.',
  },
  {
    letter: 'J',
    lowercase: 'j',
    sound: '/dʒ/',
    example: 'Jam',
    exampleEmoji: '🍓',
    formationHint: 'Curve the line at the bottom and remember the dot.',
  },
];

const STAGES: LetterStage[] = [
  'observe',
  'listen',
  'trace',
  'form',
  'check',
  'repeat',
  'master',
];

const CANVAS_SIZE = 500;

export const LetterTracing: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [letterIndex, setLetterIndex] = useState(0);
  const [stage, setStage] = useState<LetterStage>('observe');
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasWritten, setHasWritten] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentLetter = LETTERS[letterIndex];

  const stageIndex = STAGES.indexOf(stage);

  /**
   * Draws the handwriting guide.
   *
   * The canvas provides a visual tracing aid. It does not
   * pretend to perform professional handwriting recognition.
   */
  const drawTemplate = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      letter: LetterData,
      showTemplate: boolean
    ) => {
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Writing surface
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Handwriting guide lines
      ctx.strokeStyle = '#dbe4ee';
      ctx.lineWidth = 2;

      // Top line
      ctx.beginPath();
      ctx.moveTo(45, 100);
      ctx.lineTo(455, 100);
      ctx.stroke();

      // Midline
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(45, 250);
      ctx.lineTo(455, 250);
      ctx.stroke();

      // Baseline
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(45, 380);
      ctx.lineTo(455, 380);
      ctx.stroke();

      // Lower guide
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

        // Light letter for tracing.
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 6;
        ctx.setLineDash([7, 7]);

        ctx.strokeText(letter.letter, CANVAS_SIZE / 2, 255);

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

      drawTemplate(ctx, currentLetter, showTemplate);
    },
    [currentLetter, drawTemplate]
  );

  useEffect(() => {
    redrawCanvas(stage === 'observe' || stage === 'trace');
  }, [currentLetter, redrawCanvas, stage]);

  /**
   * Convert pointer coordinates to canvas coordinates.
   *
   * Pointer events support:
   * - mouse
   * - touch
   * - stylus
   */
  const getPosition = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;

      if (!canvas) {
        return { x: 0, y: 0 };
      }

      const rect = canvas.getBoundingClientRect();

      return {
        x: ((event.clientX - rect.left) / rect.width) * canvas.width,
        y: ((event.clientY - rect.top) / rect.height) * canvas.height,
      };
    },
    []
  );

  const startDrawing = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (stage !== 'trace' && stage !== 'form' && stage !== 'repeat') {
        return;
      }

      const canvas = canvasRef.current;

      if (!canvas) return;

      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      canvas.setPointerCapture(event.pointerId);

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
    [getPosition, stage]
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
        canvasRef.current.releasePointerCapture(event.pointerId);
      }

      setIsDrawing(false);
    },
    []
  );

  const clearCanvas = useCallback(() => {
    redrawCanvas(stage === 'trace');

    setHasWritten(false);
    setFeedback(null);
  }, [redrawCanvas, stage]);

  /**
   * Web Speech API.
   *
   * This provides auditory reinforcement without requiring
   * an external audio dependency.
   */
  const speakLetter = useCallback(() => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(
      `${currentLetter.letter}. ${currentLetter.example}.`
    );

    utterance.rate = 0.75;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  }, [currentLetter]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleCheck = useCallback(() => {
    if (!hasWritten) {
      setFeedback(
        'Make an attempt first. Follow the letter shape slowly and carefully.'
      );
      return;
    }

    setAttempts((previous) => previous + 1);

    setFeedback(
      'Good effort! Look at the example and notice the direction, shape and position of your letter.'
    );

    setStage('check');
  }, [hasWritten]);

  const handleRepeat = useCallback(() => {
    setFeedback(
      'Try again. Focus on the formation hint and make each movement slowly.'
    );

    setStage('repeat');

    setTimeout(() => {
      redrawCanvas(false);
      setHasWritten(false);
    }, 50);
  }, [redrawCanvas]);

  const handleNextLetter = useCallback(() => {
    const nextIndex = (letterIndex + 1) % LETTERS.length;

    setLetterIndex(nextIndex);
    setStage('observe');
    setHasWritten(false);
    setFeedback(null);
    setAttempts(0);
  }, [letterIndex]);

  const handleReset = useCallback(() => {
    setStage('observe');
    setHasWritten(false);
    setFeedback(null);
    setAttempts(0);

    setTimeout(() => {
      redrawCanvas(true);
    }, 0);
  }, [redrawCanvas]);

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
                    Look at the letter
                  </p>

                  <p className="mt-1 text-sm leading-relaxed text-gray-400">
                    Notice its shape before you begin. Look at where
                    the letter starts, turns and finishes.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStage('listen')}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 font-bold text-white transition hover:bg-cyan-500"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        );

      case 'listen':
        return (
          <div className="space-y-4">
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5">
              <div className="mb-4 text-center">
                <div className="text-7xl font-bold text-indigo-400">
                  {currentLetter.letter}
                </div>

                <p className="mt-2 text-gray-400">
                  Sound: {currentLetter.sound}
                </p>

                <p className="mt-2 text-3xl">
                  {currentLetter.exampleEmoji}
                </p>

                <p className="mt-1 font-semibold text-white">
                  {currentLetter.example}
                </p>
              </div>

              <button
                type="button"
                onClick={speakLetter}
                className="mx-auto flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white transition hover:bg-indigo-500"
              >
                <Volume2 className="h-4 w-4" />
                Hear the Letter
              </button>
            </div>

            <button
              type="button"
              onClick={() => setStage('trace')}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 font-bold text-white transition hover:bg-cyan-500"
            >
              Trace the Letter
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
                    Trace the letter
                  </p>

                  <p className="mt-1 text-sm leading-relaxed text-gray-400">
                    Follow the dotted letter with your finger,
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
                {currentLetter.formationHint}
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
                    Write{' '}
                    <strong className="text-white">
                      {currentLetter.letter}
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
                    Great effort!
                  </p>

                  <p className="mt-1 text-sm leading-relaxed text-gray-400">
                    Compare your letter with the example. Think
                    about its shape, size and where it sits on the
                    writing lines.
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
                onClick={handleRepeat}
                className="flex-1 rounded-xl border border-app-border bg-gray-800 px-4 py-3 font-semibold text-gray-200 transition hover:bg-gray-700"
              >
                Try Again
              </button>

              <button
                type="button"
                onClick={() => setStage('master')}
                className="flex-1 rounded-xl bg-cyan-600 px-4 py-3 font-bold text-white transition hover:bg-cyan-500"
              >
                Continue
              </button>
            </div>
          </div>
        );

      case 'repeat':
        return (
          <div className="space-y-4">
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 text-left">
              <div className="flex items-start gap-3">
                <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />

                <div>
                  <p className="font-bold text-white">
                    Let's improve it
                  </p>

                  <p className="mt-1 text-sm leading-relaxed text-gray-400">
                    Use the formation hint. Move slowly and think
                    about where each stroke begins and ends.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setStage('form');
                redrawCanvas(false);
                setHasWritten(false);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white transition hover:bg-indigo-500"
            >
              Write Again
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        );

      case 'master':
        return (
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-center">
              <CheckCircle className="mx-auto mb-3 h-10 w-10 text-emerald-400" />

              <h3 className="text-xl font-bold text-white">
                Letter practiced!
              </h3>

              <div className="mt-3 text-6xl font-bold text-cyan-400">
                {currentLetter.letter}
              </div>

              <p className="mt-3 text-sm text-gray-400">
                You practiced recognizing, hearing, tracing and
                forming this letter.
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
                  Example
                </p>

                <p className="mt-1 font-bold text-cyan-400">
                  {currentLetter.example}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleNextLetter}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-bold text-white transition hover:bg-purple-500"
            >
              Next Letter
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
            <Pencil className="h-5 w-5 text-cyan-400" />

            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Writing Foundations
            </span>
          </div>

          <h2 className="text-xl font-bold text-white sm:text-2xl">
            Letter Tracing
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Learn the shape, sound and formation of each letter.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          aria-label="Reset letter tracing"
          className="rounded-lg bg-gray-800 p-2 text-gray-300 transition hover:bg-gray-700"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {/* Progress */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-gray-500">
            {stage.charAt(0).toUpperCase() + stage.slice(1)}
          </span>

          <span className="text-gray-500">
            Letter {letterIndex + 1} of {LETTERS.length}
          </span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-gray-800">
          <div
            className="h-full rounded-full bg-cyan-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Letter identity */}
      <div className="mb-5 rounded-xl border border-app-border bg-gray-900/50 p-4">
        <div className="flex items-center justify-center gap-5">
          <div>
            <div className="text-4xl font-bold text-cyan-400">
              {currentLetter.letter}
            </div>

            <div className="text-center text-xs text-gray-500">
              uppercase
            </div>
          </div>

          <div className="h-10 w-px bg-app-border" />

          <div>
            <div className="text-4xl font-bold text-indigo-400">
              {currentLetter.lowercase}
            </div>

            <div className="text-center text-xs text-gray-500">
              lowercase
            </div>
          </div>

          <div className="h-10 w-px bg-app-border" />

          <div className="text-center">
            <div className="text-2xl">
              {currentLetter.exampleEmoji}
            </div>

            <div className="text-xs font-semibold text-gray-400">
              {currentLetter.example}
            </div>
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
          aria-label={`Letter tracing canvas for ${currentLetter.letter}`}
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

              {index < STAGES.length - 1 && <span>→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
