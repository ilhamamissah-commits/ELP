import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  RotateCcw,
  ArrowRight,
  CheckCircle,
  Pencil,
  Eye,
  Sparkles,
  Lightbulb,
} from 'lucide-react';

type PracticeStage =
  | 'observe'
  | 'trace'
  | 'write'
  | 'check'
  | 'improve'
  | 'complete';

type PracticeWord = {
  word: string;
  difficulty: 1 | 2 | 3;
  prompt: string;
};

const WORDS: PracticeWord[] = [
  {
    word: 'cat',
    difficulty: 1,
    prompt: 'Trace each letter carefully.',
  },
  {
    word: 'dog',
    difficulty: 1,
    prompt: 'Keep your letters sitting on the line.',
  },
  {
    word: 'sun',
    difficulty: 1,
    prompt: 'Write slowly and carefully.',
  },
  {
    word: 'run',
    difficulty: 2,
    prompt: 'Notice the shape of each letter.',
  },
  {
    word: 'big',
    difficulty: 2,
    prompt: 'Try to keep your letters a similar size.',
  },
];

const STAGE_ORDER: PracticeStage[] = [
  'observe',
  'trace',
  'write',
  'check',
  'improve',
  'complete',
];

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 300;

export const HandwritingPractice: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [wordIndex, setWordIndex] = useState(0);
  const [stage, setStage] = useState<PracticeStage>('observe');
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasWritten, setHasWritten] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentWord = WORDS[wordIndex];

  const stageIndex = STAGE_ORDER.indexOf(stage);

  /**
   * Draw the handwriting guide.
   *
   * The guide uses a simple handwriting baseline rather than
   * pretending that the browser can perfectly judge handwriting.
   */
  const drawGuide = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      word: string,
      showTemplate = true
    ) => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // White writing surface
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Writing lines
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;

      // Top guide
      ctx.beginPath();
      ctx.moveTo(40, 80);
      ctx.lineTo(CANVAS_WIDTH - 40, 80);
      ctx.stroke();

      // Middle guide
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(40, 145);
      ctx.lineTo(CANVAS_WIDTH - 40, 145);
      ctx.stroke();

      // Baseline
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(40, 210);
      ctx.lineTo(CANVAS_WIDTH - 40, 210);
      ctx.stroke();

      // Descender guide
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.moveTo(40, 255);
      ctx.lineTo(CANVAS_WIDTH - 40, 255);
      ctx.stroke();

      ctx.setLineDash([]);

      if (showTemplate) {
        ctx.save();

        ctx.font = '110px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#cbd5e1';

        // Light template behind the child's writing.
        ctx.fillText(word, CANVAS_WIDTH / 2, 155);

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

      drawGuide(ctx, currentWord.word, showTemplate);
    },
    [currentWord.word, drawGuide]
  );

  useEffect(() => {
    redrawCanvas(stage === 'observe' || stage === 'trace');
  }, [redrawCanvas, stage]);

  /**
   * Convert pointer coordinates into canvas coordinates.
   * Pointer events allow mouse, touch and stylus input
   * without maintaining separate mouse/touch handlers.
   */
  const getCanvasPosition = useCallback(
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
      if (stage !== 'trace' && stage !== 'write') return;

      const canvas = canvasRef.current;

      if (!canvas) return;

      canvas.setPointerCapture(event.pointerId);

      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      const { x, y } = getCanvasPosition(event);

      ctx.beginPath();
      ctx.moveTo(x, y);

      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#0f172a';

      setIsDrawing(true);
      setHasWritten(true);
    },
    [getCanvasPosition, stage]
  );

  const draw = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;

      const canvas = canvasRef.current;

      if (!canvas) return;

      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      const { x, y } = getCanvasPosition(event);

      ctx.lineTo(x, y);
      ctx.stroke();
    },
    [getCanvasPosition, isDrawing]
  );

  const stopDrawing = useCallback(
    (event?: React.PointerEvent<HTMLCanvasElement>) => {
      if (event && canvasRef.current?.hasPointerCapture(event.pointerId)) {
        canvasRef.current.releasePointerCapture(event.pointerId);
      }

      setIsDrawing(false);
    },
    []
  );

  const clearWriting = useCallback(() => {
    redrawCanvas(stage === 'trace');

    setHasWritten(false);
    setFeedback(null);
  }, [redrawCanvas, stage]);

  /**
   * We deliberately do not generate a fake handwriting percentage.
   *
   * Browser canvas input can tell us whether the learner wrote
   * something, but reliable handwriting recognition requires a
   * proper handwriting-analysis model.
   */
  const handleCheck = useCallback(() => {
    if (!hasWritten) {
      setFeedback(
        'Start writing first. Take your time and follow the guide.'
      );
      return;
    }

    setAttempts((previous) => previous + 1);

    setFeedback(
      'Nice effort! Look at your letters and compare their size, shape, and position on the writing line.'
    );

    setStage('check');
  }, [hasWritten]);

  const handleImprove = useCallback(() => {
    setFeedback(
      'Try it once more. Focus on starting each letter carefully and keeping the letters on the line.'
    );

    setStage('improve');

    setTimeout(() => {
      redrawCanvas(false);
      setHasWritten(false);
    }, 50);
  }, [redrawCanvas]);

  const handleNext = useCallback(() => {
    if (stage !== 'complete') {
      setStage('complete');
      return;
    }

    const nextIndex = (wordIndex + 1) % WORDS.length;

    setWordIndex(nextIndex);
    setStage('observe');
    setHasWritten(false);
    setFeedback(null);
    setAttempts(0);
  }, [stage, wordIndex]);

  const handleReset = useCallback(() => {
    setStage('observe');
    setHasWritten(false);
    setFeedback(null);
    setAttempts(0);

    setTimeout(() => {
      redrawCanvas(true);
    }, 0);
  }, [redrawCanvas]);

  const renderStageContent = () => {
    switch (stage) {
      case 'observe':
        return (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-left">
              <Eye className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />

              <div>
                <p className="font-semibold text-white">
                  Look carefully
                </p>

                <p className="mt-1 text-sm leading-relaxed text-gray-400">
                  Notice the shape of each letter and where the
                  letters sit on the writing lines.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStage('trace')}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 font-bold text-white transition hover:bg-cyan-500"
            >
              Start Tracing
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        );

      case 'trace':
        return (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-left">
              <Pencil className="mt-0.5 h-5 w-5 shrink-0 text-indigo-400" />

              <div>
                <p className="font-semibold text-white">
                  Trace the word
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  Follow the light letters slowly. Try to stay
                  close to their shapes.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={clearWriting}
                className="flex-1 rounded-xl border border-app-border bg-gray-800 px-4 py-3 font-semibold text-gray-200 transition hover:bg-gray-700"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={() => setStage('write')}
                className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white transition hover:bg-indigo-500"
              >
                Write It Yourself
              </button>
            </div>
          </div>
        );

      case 'write':
        return (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 text-left">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-purple-400" />

              <div>
                <p className="font-semibold text-white">
                  Your turn
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  Write <strong className="text-white">{currentWord.word}</strong>{' '}
                  without tracing over the letters.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={clearWriting}
                className="flex-1 rounded-xl border border-app-border bg-gray-800 px-4 py-3 font-semibold text-gray-200 transition hover:bg-gray-700"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={handleCheck}
                className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 font-bold text-white transition hover:bg-emerald-500"
              >
                Check My Work
              </button>
            </div>
          </div>
        );

      case 'check':
        return (
          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />

                <div>
                  <p className="font-semibold text-white">
                    You made an attempt!
                  </p>

                  <p className="mt-1 text-sm leading-relaxed text-gray-400">
                    Now compare your writing with the example.
                    Look at the letter shapes, size, spacing and
                    position on the line.
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
                onClick={handleImprove}
                className="flex-1 rounded-xl border border-app-border bg-gray-800 px-4 py-3 font-semibold text-gray-200 transition hover:bg-gray-700"
              >
                Try Again
              </button>

              <button
                type="button"
                onClick={() => setStage('complete')}
                className="flex-1 rounded-xl bg-cyan-600 px-4 py-3 font-bold text-white transition hover:bg-cyan-500"
              >
                Finish
              </button>
            </div>
          </div>
        );

      case 'improve':
        return (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-left">
              <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />

              <div>
                <p className="font-semibold text-white">
                  One more careful try
                </p>

                <p className="mt-1 text-sm leading-relaxed text-gray-400">
                  Remember: slow movements can help you control
                  the shape of your letters.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setStage('write');
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

      case 'complete':
        return (
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <CheckCircle className="mx-auto mb-3 h-10 w-10 text-emerald-400" />

              <h3 className="text-lg font-bold text-white">
                Practice complete
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                You practiced forming the word{' '}
                <strong className="text-white">
                  {currentWord.word}
                </strong>
                .
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="rounded-xl border border-app-border bg-gray-900/60 p-3">
                <p className="text-xs text-gray-500">Attempts</p>
                <p className="mt-1 text-lg font-bold text-white">
                  {Math.max(attempts, 1)}
                </p>
              </div>

              <div className="rounded-xl border border-app-border bg-gray-900/60 p-3">
                <p className="text-xs text-gray-500">Skill</p>
                <p className="mt-1 text-sm font-bold text-cyan-400">
                  Letter formation
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-bold text-white transition hover:bg-purple-500"
            >
              Next Word
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        );
    }
  };

  const progress = ((stageIndex + 1) / STAGE_ORDER.length) * 100;

  return (
    <div className="mx-auto w-full max-w-3xl rounded-2xl border border-app-border bg-app-card p-5 shadow-xl sm:p-6">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Pencil className="h-5 w-5 text-cyan-400" />

            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Writing Lab
            </span>
          </div>

          <h2 className="text-xl font-bold text-white sm:text-2xl">
            Handwriting Practice
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Build control, letter formation and handwriting confidence.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          aria-label="Reset handwriting practice"
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
            Word {wordIndex + 1} of {WORDS.length}
          </span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-gray-800">
          <div
            className="h-full rounded-full bg-cyan-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Word target */}
      <div className="mb-5 rounded-xl border border-app-border bg-gray-900/50 p-4 text-center">
        <p className="mb-1 text-xs uppercase tracking-wider text-gray-500">
          Practice word
        </p>

        <p className="text-3xl font-bold tracking-wide text-cyan-400">
          {currentWord.word}
        </p>

        <p className="mt-1 text-xs text-gray-500">
          {currentWord.prompt}
        </p>
      </div>

      {/* Canvas */}
      <div className="mb-5 overflow-hidden rounded-xl border-2 border-dashed border-gray-600 bg-white shadow-inner">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerCancel={stopDrawing}
          onPointerLeave={stopDrawing}
          className="block h-auto w-full touch-none cursor-crosshair"
          aria-label={`Handwriting canvas for the word ${currentWord.word}`}
        />
      </div>

      {/* Stage instruction */}
      {stage !== 'complete' && (
        <div className="mb-5 text-center">
          <p className="text-xs text-gray-500">
            {stage === 'observe' &&
              'Look at the letter shapes before you begin.'}

            {stage === 'trace' &&
              'Follow the light template with your finger, mouse or stylus.'}

            {stage === 'write' &&
              'Write the word yourself using the handwriting lines.'}

            {stage === 'check' &&
              'Compare your writing with the example and think about what you can improve.'}

            {stage === 'improve' &&
              'Use what you noticed to make another careful attempt.'}
          </p>
        </div>
      )}

      {/* Controls */}
      {renderStageContent()}

      {/* Learning model */}
      <div className="mt-6 border-t border-app-border pt-4">
        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-500">
          <span
            className={
              stageIndex >= 0 ? 'text-cyan-400' : ''
            }
          >
            Observe
          </span>

          <span>→</span>

          <span
            className={
              stageIndex >= 1 ? 'text-cyan-400' : ''
            }
          >
            Trace
          </span>

          <span>→</span>

          <span
            className={
              stageIndex >= 2 ? 'text-cyan-400' : ''
            }
          >
            Write
          </span>

          <span>→</span>

          <span
            className={
              stageIndex >= 3 ? 'text-cyan-400' : ''
            }
          >
            Check
          </span>

          <span>→</span>

          <span
            className={
              stageIndex >= 4 ? 'text-cyan-400' : ''
            }
          >
            Improve
          </span>

          <span>→</span>

          <span
            className={
              stageIndex >= 5 ? 'text-cyan-400' : ''
            }
          >
            Reflect
          </span>
        </div>
      </div>
    </div>
  );
};
