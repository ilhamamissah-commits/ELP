import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  Eraser,
  Lightbulb,
  RotateCcw,
  Volume2,
  PenLine,
  ArrowRight,
} from 'lucide-react';

import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';
import { useProfileStore } from '../../../store/useProfileStore';
import { useProgressStore } from '../../../store/useProgressStore';

type WritingStage = 'guide' | 'trace' | 'write';

type Point = { x: number; y: number };

const CANVAS_SIZE = 320;
const SESSION_LENGTH = 5;

const LEVEL_NUMBERS: Record<number, number[]> = {
  1: [0, 1, 2, 3, 4],
  2: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  3: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  4: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  5: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
};

const shuffle = <T,>(items: T[]): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const TracingNumbers: React.FC = () => {
  const profile = useProfileStore(
    (state) => state.profiles[state.currentProfileId]
  );

  const currentLevel = profile?.currentLevel ?? 1;

  const completeActivity = useProgressStore((state) => state.completeActivity);

  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const { speak } = useReadAloud();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const drawingRef = useRef(false);
  const hasDrawingRef = useRef(false);
  const pointsRef = useRef<Point[]>([]);

  const [currentNumber, setCurrentNumber] = useState(0);
  const [stage, setStage] = useState<WritingStage>('guide');
  const [questionNumber, setQuestionNumber] = useState(1);
  const [completedNumbers, setCompletedNumbers] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [coverage, setCoverage] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);

  const availableNumbers = LEVEL_NUMBERS[currentLevel] ?? LEVEL_NUMBERS[1];

  const sessionNumbers = useMemo(
    () => shuffle(availableNumbers).slice(0, SESSION_LENGTH),
    [currentLevel, availableNumbers]
  );

  const [sessionSequence, setSessionSequence] =
    useState<number[]>(sessionNumbers);

  const numberPosition = Math.min(
    questionNumber - 1,
    sessionSequence.length - 1
  );

  const numberToTrace = sessionSequence[numberPosition] ?? currentNumber;

  useEffect(() => {
    setSessionSequence(
      shuffle(LEVEL_NUMBERS[currentLevel] ?? LEVEL_NUMBERS[1]).slice(
        0,
        SESSION_LENGTH
      )
    );
    setQuestionNumber(1);
    setCompletedNumbers(0);
    setCompleted(false);
    setStage('guide');
    setCoverage(0);
    setFeedback('');
    setShowHint(false);
  }, [currentLevel]);

  // Auto-read the number and stage prompt on change
  useEffect(() => {
    if (autoReadEnabled) {
      const readOut =
        stage === 'guide'
          ? `Number ${numberToTrace}. Look at its shape.`
          : stage === 'trace'
            ? `Trace number ${numberToTrace}.`
            : `Write number ${numberToTrace} by yourself.`;
      const timer = window.setTimeout(() => speak(readOut), 350);
      return () => window.clearTimeout(timer);
    }
  }, [numberToTrace, stage, speak, autoReadEnabled]);

  // Read hint when it opens
  useEffect(() => {
    if (showHint) {
      speak(
        'Start at the correct starting point and move slowly. Try to keep your strokes inside the number shape.'
      );
    }
  }, [showHint, speak]);

  // Announce completion
  useEffect(() => {
    if (!completed) return;

    speak(
      `Great job! You practised writing ${completedNumbers} ${
        completedNumbers === 1 ? 'number' : 'numbers'
      }.`
    );
  }, [completed, completedNumbers, speak]);

  const drawTemplate = useCallback(
    (ctx: CanvasRenderingContext2D, num: number, currentStage: WritingStage) => {
      const canvas = ctx.canvas;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.moveTo(35, 245);
      ctx.lineTo(canvas.width - 35, 245);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.moveTo(35, 155);
      ctx.lineTo(canvas.width - 35, 155);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = 'bold 220px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (currentStage === 'guide') {
        ctx.fillStyle = 'rgba(99, 102, 241, 0.10)';
        ctx.fillText(String(num), canvas.width / 2, 155);

        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.setLineDash([7, 7]);
        ctx.strokeText(String(num), canvas.width / 2, 155);
        ctx.setLineDash([]);
      }

      if (currentStage === 'trace') {
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 4;
        ctx.setLineDash([4, 5]);
        ctx.strokeText(String(num), canvas.width / 2, 155);
        ctx.setLineDash([]);
      }

      if (currentStage === 'write') {
        ctx.fillStyle = 'rgba(148, 163, 184, 0.08)';
        ctx.fillText(String(num), canvas.width / 2, 155);
      }
    },
    []
  );

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawTemplate(ctx, numberToTrace, stage);

    if (pointsRef.current.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const first = pointsRef.current[0];
      ctx.moveTo(first.x, first.y);

      pointsRef.current.slice(1).forEach((point) => {
        ctx.lineTo(point.x, point.y);
      });

      ctx.stroke();
    }
  }, [drawTemplate, numberToTrace, stage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const size = Math.min(CANVAS_SIZE, Math.max(260, rect.width));
      const ratio = window.devicePixelRatio || 1;

      canvas.width = size * ratio;
      canvas.height = size * ratio;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      drawTemplate(ctx, numberToTrace, stage);
    };

    resizeCanvas();

    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(container);

    return () => observer.disconnect();
  }, [drawTemplate, numberToTrace, stage]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  const getCanvasPoint = (
    event: React.PointerEvent<HTMLCanvasElement>
  ): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_SIZE / rect.width;
    const scaleY = CANVAS_SIZE / rect.height;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (completed) return;
    event.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.setPointerCapture(event.pointerId);

    const point = getCanvasPoint(event);
    drawingRef.current = true;
    hasDrawingRef.current = true;
    pointsRef.current = [point];

    setCoverage(0);
    setFeedback('');
  };

  const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || completed) return;
    event.preventDefault();

    const point = getCanvasPoint(event);
    const previous = pointsRef.current[pointsRef.current.length - 1];

    if (!previous) {
      pointsRef.current.push(point);
      return;
    }

    const distance = Math.sqrt(
      Math.pow(point.x - previous.x, 2) + Math.pow(point.y - previous.y, 2)
    );

    if (distance < 2) return;

    pointsRef.current.push(point);

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(previous.x, previous.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();

    const estimatedCoverage = Math.min(
      100,
      Math.round(pointsRef.current.length / 8)
    );
    setCoverage(estimatedCoverage);
  };

  const stopDrawing = (event?: React.PointerEvent<HTMLCanvasElement>) => {
    drawingRef.current = false;

    if (event) {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        // Pointer capture may already have been released.
      }
    }
  };

  const clearCanvas = useCallback(() => {
    pointsRef.current = [];
    hasDrawingRef.current = false;

    setCoverage(0);
    setFeedback('');
    setShowHint(false);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawTemplate(ctx, numberToTrace, stage);
  }, [drawTemplate, numberToTrace, stage]);

  const speakNumber = useCallback(() => {
    speak(String(numberToTrace));
  }, [numberToTrace, speak]);

  const beginTracing = () => {
    clearCanvas();
    setStage('trace');
  };

  const beginIndependentWriting = () => {
    clearCanvas();
    setStage('write');
  };

  const finishNumber = () => {
    if (!hasDrawingRef.current) {
      setFeedback('Try writing the number first.');
      return;
    }

    if (coverage < 8) {
      setFeedback('Add a little more writing so we can record your practice.');
      return;
    }

    setFeedback('Great work!');

    window.setTimeout(() => {
      const nextCompleted = completedNumbers + 1;
      setCompletedNumbers(nextCompleted);

      if (questionNumber >= SESSION_LENGTH) {
        const score = Math.min(
          100,
          Math.round((nextCompleted / SESSION_LENGTH) * 100)
        );

        completeActivity({
          id: 'maths-number-writing-lab',
          score,
          academyId: 'maths',
          domain: 'numeracy',
          skillIds: [
            'number-recognition',
            'number-writing',
            'numeral-formation',
            'fine-motor-control',
            'number-sense',
          ],
        });

        setCompleted(true);
        return;
      }

      setQuestionNumber((previous) => previous + 1);
      setStage('guide');
      setFeedback('');
      setCoverage(0);
      setShowHint(false);
      pointsRef.current = [];
      hasDrawingRef.current = false;
    }, 900);
  };

  const restart = () => {
    setSessionSequence(
      shuffle(LEVEL_NUMBERS[currentLevel] ?? LEVEL_NUMBERS[1]).slice(
        0,
        SESSION_LENGTH
      )
    );

    setQuestionNumber(1);
    setCompletedNumbers(0);
    setCompleted(false);
    setStage('guide');
    setFeedback('');
    setCoverage(0);
    setShowHint(false);

    pointsRef.current = [];
    hasDrawingRef.current = false;

    speak("Let's practise writing numbers again!");
  };

  const progress = ((questionNumber - 1) / SESSION_LENGTH) * 100;

  if (completed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto bg-app-card p-6 sm:p-8 rounded-2xl border border-app-border shadow-xl text-center"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/15 flex items-center justify-center">
          <CheckCircle className="w-9 h-9 text-green-400" />
        </div>

        <h3 className="text-2xl font-bold text-white">
          Number Writing Complete
        </h3>

        <p className="text-gray-400 mt-2">
          You practised writing {completedNumbers}{' '}
          {completedNumbers === 1 ? 'number' : 'numbers'}.
        </p>

        <div className="my-6 rounded-2xl bg-gray-900/70 border border-app-border p-5">
          <div className="text-4xl font-black text-white">
            {completedNumbers}/{SESSION_LENGTH}
          </div>
          <div className="text-sm text-gray-400 mt-1">Numbers practised</div>
        </div>

        <button
          type="button"
          onClick={restart}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-white text-gray-900 font-bold py-3 hover:bg-gray-100 transition"
        >
          <RotateCcw className="w-4 h-4" />
          Practise Again
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-app-card p-5 sm:p-7 rounded-2xl border border-app-border shadow-xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <PenLine className="w-6 h-6 text-indigo-400" />
            <h3 className="text-2xl font-bold text-white">
              Number Writing Lab
            </h3>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Learn the formation, trace carefully, then write independently.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="shrink-0 text-right">
            <div className="text-xs uppercase tracking-wider text-gray-500">
              Level
            </div>
            <div className="text-xl font-bold text-white">{currentLevel}</div>
          </div>

          <button
            type="button"
            onClick={toggleSound}
            aria-label="Toggle sound"
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <Volume2
              className={`w-5 h-5 ${soundEnabled ? 'text-amber-300' : 'text-gray-500'}`}
            />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>
            Number {questionNumber} of {SESSION_LENGTH}
          </span>
          <span>{completedNumbers} completed</span>
        </div>

        <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
          <motion.div
            className="h-full bg-indigo-500 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Writing pathway */}
      <div className="flex items-center justify-center gap-2 mb-6 text-xs flex-wrap">
        <span
          className={`px-3 py-1.5 rounded-full ${
            stage === 'guide'
              ? 'bg-indigo-500/20 text-indigo-300'
              : 'bg-gray-800 text-gray-500'
          }`}
        >
          1. Look
        </span>
        <ArrowRight className="w-3 h-3 text-gray-600" />
        <span
          className={`px-3 py-1.5 rounded-full ${
            stage === 'trace'
              ? 'bg-indigo-500/20 text-indigo-300'
              : 'bg-gray-800 text-gray-500'
          }`}
        >
          2. Trace
        </span>
        <ArrowRight className="w-3 h-3 text-gray-600" />
        <span
          className={`px-3 py-1.5 rounded-full ${
            stage === 'write'
              ? 'bg-indigo-500/20 text-indigo-300'
              : 'bg-gray-800 text-gray-500'
          }`}
        >
          3. Write
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${numberToTrace}-${stage}-${questionNumber}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Number prompt */}
          <div className="text-center mb-4">
            <div className="text-5xl font-black text-white">
              {numberToTrace}
            </div>

            <p className="text-gray-400 text-sm mt-2">
              {stage === 'guide' && 'Look at the number and notice its shape.'}
              {stage === 'trace' && 'Follow the dotted path carefully.'}
              {stage === 'write' && 'Now write the number by yourself.'}
            </p>

            <button
              type="button"
              onClick={speakNumber}
              className="mt-2 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
            >
              <Volume2 className="w-4 h-4" />
              Hear the number
            </button>
          </div>

          {/* Canvas */}
          <div ref={containerRef} className="w-full flex justify-center">
            <div className="bg-white p-2 rounded-2xl border-2 border-gray-700 shadow-inner">
              <canvas
                ref={canvasRef}
                aria-label={`Write number ${numberToTrace}`}
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                onPointerCancel={stopDrawing}
                onPointerLeave={stopDrawing}
                className="block rounded-xl touch-none cursor-crosshair max-w-full"
              />
            </div>
          </div>

          {/* Coverage */}
          {stage !== 'guide' && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Practice activity</span>
                <span>{coverage}%</span>
              </div>

              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-indigo-500 rounded-full"
                  animate={{ width: `${Math.min(coverage, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="mt-5 flex justify-center gap-3 flex-wrap">
            {stage === 'guide' && (
              <button
                type="button"
                onClick={beginTracing}
                className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition"
              >
                Start Tracing
              </button>
            )}

            {stage === 'trace' && (
              <>
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-800 text-white font-semibold hover:bg-gray-700 transition"
                >
                  <Eraser className="w-4 h-4" />
                  Clear
                </button>

                <button
                  type="button"
                  onClick={beginIndependentWriting}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition"
                >
                  Write It Myself
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}

            {stage === 'write' && (
              <>
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-800 text-white font-semibold hover:bg-gray-700 transition"
                >
                  <Eraser className="w-4 h-4" />
                  Clear
                </button>

                <button
                  type="button"
                  onClick={finishNumber}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-500 transition"
                >
                  <CheckCircle className="w-4 h-4" />
                  I Finished
                </button>
              </>
            )}
          </div>

          {/* Hint */}
          {stage !== 'guide' && (
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => setShowHint((previous) => !previous)}
                className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300"
              >
                <Lightbulb className="w-4 h-4" />
                {showHint ? 'Hide writing tip' : 'Need a writing tip?'}
              </button>

              {showHint && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 text-sm text-amber-200"
                >
                  Start at the correct starting point and move slowly. Try to
                  keep your strokes inside the number shape.
                </motion.div>
              )}
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 text-center text-sm font-semibold ${
                feedback === 'Great work!' ? 'text-green-400' : 'text-amber-400'
              }`}
            >
              {feedback}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};