import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Eye,
  Lightbulb,
  Pencil,
  RotateCcw,
  Volume2,
} from 'lucide-react';

type TracingStage =
  | 'observe'
  | 'trace'
  | 'form'
  | 'check'
  | 'improve'
  | 'master';

type LetterData = {
  letter: string;
  lowercase: string;
  sound: string;
  word: string;
  emoji: string;
  formationHint: string;
};

const LETTERS: LetterData[] = [
  {
    letter: 'A',
    lowercase: 'a',
    sound: '/æ/',
    word: 'apple',
    emoji: '🍎',
    formationHint:
      'Start at the top, make the two slanting lines, then add the middle line.',
  },
  {
    letter: 'B',
    lowercase: 'b',
    sound: '/b/',
    word: 'ball',
    emoji: '⚽',
    formationHint:
      'Start at the top, draw down, then make two rounded curves.',
  },
  {
    letter: 'C',
    lowercase: 'c',
    sound: '/k/',
    word: 'cat',
    emoji: '🐱',
    formationHint:
      'Start near the top and make one smooth curve around to the bottom.',
  },
  {
    letter: 'D',
    lowercase: 'd',
    sound: '/d/',
    word: 'dog',
    emoji: '🐶',
    formationHint:
      'Draw the curved part first, then make the tall straight line.',
  },
  {
    letter: 'E',
    lowercase: 'e',
    sound: '/e/',
    word: 'egg',
    emoji: '🥚',
    formationHint:
      'Start at the top, draw across, down, and add the middle and bottom lines.',
  },
  {
    letter: 'F',
    lowercase: 'f',
    sound: '/f/',
    word: 'fish',
    emoji: '🐟',
    formationHint:
      'Start near the top, curve down, then add the middle line.',
  },
  {
    letter: 'G',
    lowercase: 'g',
    sound: '/g/',
    word: 'goat',
    emoji: '🐐',
    formationHint:
      'Begin like C, curve around, then add the small inward stroke.',
  },
  {
    letter: 'H',
    lowercase: 'h',
    sound: '/h/',
    word: 'hat',
    emoji: '🎩',
    formationHint:
      'Draw two straight lines and connect them with a middle line.',
  },
  {
    letter: 'I',
    lowercase: 'i',
    sound: '/ɪ/',
    word: 'igloo',
    emoji: '🏠',
    formationHint:
      'Draw a straight line and add the small dot above it.',
  },
  {
    letter: 'J',
    lowercase: 'j',
    sound: '/dʒ/',
    word: 'jam',
    emoji: '🍓',
    formationHint:
      'Start at the top, move down, curve around, and add the dot.',
  },
];

const STAGE_ORDER: TracingStage[] = [
  'observe',
  'trace',
  'form',
  'check',
  'improve',
  'master',
];

const STAGE_LABELS: Record<TracingStage, string> = {
  observe: 'Observe',
  trace: 'Trace',
  form: 'Form',
  check: 'Check',
  improve: 'Improve',
  master: 'Master',
};

export const TracingCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [stage, setStage] = useState<TracingStage>('observe');
  const [isDrawing, setIsDrawing] = useState(false);
  const [userPoints, setUserPoints] = useState<
    { x: number; y: number }[]
  >([]);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [reflection, setReflection] = useState('');

  const currentLetter = LETTERS[currentIndex];

  const stageIndex = STAGE_ORDER.indexOf(stage);

  const progress =
    ((stageIndex + 1) / STAGE_ORDER.length) * 100;

  /**
   * Draw the handwriting guide.
   */
  const drawGuide = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      letter: LetterData,
      showTemplate = true
    ) => {
      const width = 300;
      const height = 300;

      ctx.clearRect(0, 0, width, height);

      /*
       * Writing guide lines.
       */
      ctx.save();

      ctx.strokeStyle = '#dbe4ee';
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(20, 90);
      ctx.lineTo(280, 90);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(20, 150);
      ctx.lineTo(280, 150);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(20, 215);
      ctx.lineTo(280, 215);
      ctx.stroke();

      ctx.restore();

      if (!showTemplate) return;

      /*
       * Dotted letter template.
       */
      ctx.save();

      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.font = '200px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.strokeText(letter.letter, 150, 150);

      ctx.restore();
    },
    []
  );

  /**
   * Draw the template whenever the letter changes
   * or the activity is reset.
   */
  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (ctx) {
      drawGuide(
        ctx,
        currentLetter,
        stage !== 'form'
      );
    }
  }, [currentLetter, stage, drawGuide]);

  /**
   * Convert pointer coordinates into canvas coordinates.
   */
  const getCanvasPoint = (
    event: React.PointerEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return null;
    }

    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  };

  /**
   * Start drawing.
   */
  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (stage !== 'trace' && stage !== 'form') {
        return;
      }

      event.preventDefault();

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      const point = getCanvasPoint(event);

      if (!ctx || !point) {
        return;
      }

      canvas?.setPointerCapture(event.pointerId);

      ctx.beginPath();
      ctx.moveTo(point.x, point.y);

      setIsDrawing(true);

      setUserPoints((previous) => [
        ...previous,
        point,
      ]);

      setFeedback(null);
    },
    [stage]
  );

  /**
   * Continue drawing.
   */
  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing) {
        return;
      }

      event.preventDefault();

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      const point = getCanvasPoint(event);

      if (!ctx || !point) {
        return;
      }

      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#0f172a';

      ctx.lineTo(point.x, point.y);
      ctx.stroke();

      setUserPoints((previous) => [
        ...previous,
        point,
      ]);
    },
    [isDrawing]
  );

  /**
   * Stop drawing.
   */
  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing) {
        return;
      }

      event.preventDefault();

      const canvas = canvasRef.current;

      if (canvas?.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }

      setIsDrawing(false);
    },
    [isDrawing]
  );

  /**
   * Clear learner writing while preserving
   * the template.
   */
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    drawGuide(
      ctx,
      currentLetter,
      stage !== 'form'
    );

    setUserPoints([]);
    setFeedback(null);
  }, [currentLetter, stage, drawGuide]);

  /**
   * Move to the next learning stage.
   */
  const nextStage = () => {
    const currentStageIndex = STAGE_ORDER.indexOf(stage);

    if (currentStageIndex < STAGE_ORDER.length - 1) {
      setFeedback(null);
      setStage(STAGE_ORDER[currentStageIndex + 1]);
    }
  };

  /**
   * Listen to the letter and example word.
   */
  const speakLetter = () => {
    if (
      typeof window === 'undefined' ||
      !('speechSynthesis' in window)
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(
      `${currentLetter.letter}. ${currentLetter.word}.`
    );

    utterance.rate = 0.75;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  /**
   * Check whether the learner actually made an attempt.
   *
   * This intentionally does NOT produce a fake percentage.
   * Real handwriting accuracy requires stroke/trajectory analysis.
   */
  const handleCheck = () => {
    if (userPoints.length < 10) {
      setFeedback(
        'Make a little more of the letter first, then check your work.'
      );
      return;
    }

    setAttempts((previous) => previous + 1);

    setFeedback(
      'Good effort. Look at your letter and compare it with the guide. What could you improve?'
    );

    setStage('improve');
  };

  /**
   * Start another attempt.
   */
  const handleImprove = () => {
    clearCanvas();
    setStage('form');
    setFeedback(null);
  };

  /**
   * Finish the current letter.
   */
  const handleMaster = () => {
    if (userPoints.length < 10) {
      setFeedback(
        'Make one more writing attempt before finishing this letter.'
      );
      return;
    }

    setStage('master');
    setFeedback(null);
  };

  /**
   * Move to the next letter.
   */
  const nextLetter = () => {
    setCurrentIndex(
      (previous) => (previous + 1) % LETTERS.length
    );

    setStage('observe');
    setUserPoints([]);
    setAttempts(0);
    setFeedback(null);
    setReflection('');
  };

  /**
   * Restart the current letter.
   */
  const restartLetter = () => {
    setStage('observe');
    setUserPoints([]);
    setAttempts(0);
    setFeedback(null);
    setReflection('');
  };

  const isLastLetter =
    currentIndex === LETTERS.length - 1;

  return (
    <div className="max-w-3xl mx-auto bg-app-card p-6 md:p-8 rounded-3xl border border-app-border shadow-xl text-white">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
            <Pencil className="w-7 h-7 text-cyan-400" />
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold">
          Letter Tracing
        </h2>

        <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
          Watch the letter, trace its shape, then try forming it
          independently.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>{STAGE_LABELS[stage]}</span>

          <span>
            Letter {currentIndex + 1} of {LETTERS.length}
          </span>
        </div>

        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stage navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-7">
        {STAGE_ORDER.map((item, index) => {
          const active = item === stage;
          const completed = stageIndex > index;

          return (
            <div
              key={item}
              className={`px-3 py-1.5 rounded-full text-xs border ${
                active
                  ? 'bg-cyan-500/10 border-cyan-400/40 text-cyan-300'
                  : completed
                    ? 'bg-green-500/10 border-green-500/30 text-green-300'
                    : 'bg-gray-800/50 border-gray-700 text-gray-500'
              }`}
            >
              {completed ? '✓ ' : ''}
              {STAGE_LABELS[item]}
            </div>
          );
        })}
      </div>

      {/* OBSERVE */}
      {stage === 'observe' && (
        <div className="text-center">
          <Eye className="w-7 h-7 text-cyan-400 mx-auto mb-4" />

          <h3 className="text-xl font-bold mb-2">
            Look carefully
          </h3>

          <p className="text-gray-400 text-sm mb-6">
            Notice the shape before you begin tracing.
          </p>

          <div className="p-6 rounded-2xl bg-[#111827] border border-gray-800">
            <div className="text-8xl font-bold text-white">
              {currentLetter.letter}
            </div>

            <div className="text-3xl text-gray-500 mt-1">
              {currentLetter.lowercase}
            </div>

            <div className="mt-5 flex justify-center items-center gap-3">
              <span className="text-4xl">
                {currentLetter.emoji}
              </span>

              <div className="text-left">
                <p className="font-semibold text-white">
                  {currentLetter.word}
                </p>

                <p className="text-sm text-gray-400">
                  Sound: {currentLetter.sound}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-center gap-3">
            <button
              onClick={speakLetter}
              className="inline-flex items-center gap-2 px-5 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-semibold"
            >
              <Volume2 className="w-5 h-5" />
              Hear it
            </button>

            <button
              onClick={() => setStage('trace')}
              className="inline-flex items-center gap-2 px-5 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-semibold"
            >
              Start tracing
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TRACE / FORM / IMPROVE */}
      {(stage === 'trace' ||
        stage === 'form' ||
        stage === 'improve') && (
        <div>
          <div className="text-center mb-5">
            {stage === 'trace' && (
              <>
                <h3 className="text-xl font-bold">
                  Follow the guide
                </h3>

                <p className="text-gray-400 text-sm mt-2">
                  Trace the dotted letter slowly and carefully.
                </p>
              </>
            )}

            {stage === 'form' && (
              <>
                <h3 className="text-xl font-bold">
                  Now form it yourself
                </h3>

                <p className="text-gray-400 text-sm mt-2">
                  The guide is hidden. Try to write the letter from
                  memory.
                </p>
              </>
            )}

            {stage === 'improve' && (
              <>
                <h3 className="text-xl font-bold">
                  Look, think, improve
                </h3>

                <p className="text-gray-400 text-sm mt-2">
                  Compare your writing with the letter and think
                  about what you can improve.
                </p>
              </>
            )}
          </div>

          {/* Canvas */}
          <div className="relative mx-auto w-[300px] h-[300px] border-2 border-dashed border-gray-700 rounded-2xl overflow-hidden bg-white shadow-inner">
            <canvas
              ref={canvasRef}
              width={300}
              height={300}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className="w-full h-full cursor-crosshair touch-none"
            />
          </div>

          {/* Hint */}
          <div className="mt-5 flex items-start gap-2 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
            <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />

            <div>
              <p className="text-sm font-semibold text-yellow-300">
                Formation hint
              </p>

              <p className="text-sm text-gray-400 mt-1">
                {currentLetter.formationHint}
              </p>
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className="mt-4 p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl text-center text-sm text-gray-300">
              {feedback}
            </div>
          )}

          {/* Controls */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={clearCanvas}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl font-semibold"
            >
              <RotateCcw className="w-4 h-4" />
              Clear
            </button>

            {stage === 'trace' && (
              <button
                onClick={() => {
                  if (userPoints.length < 10) {
                    setFeedback(
                      'Try tracing the whole letter before moving on.'
                    );
                    return;
                  }

                  setStage('form');
                  setFeedback(null);
                  clearCanvas();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-semibold"
              >
                Try it yourself
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {stage === 'form' && (
              <button
                onClick={handleCheck}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 rounded-xl font-semibold"
              >
                <CheckCircle className="w-4 h-4" />
                Check my work
              </button>
            )}

            {stage === 'improve' && (
              <>
                <button
                  onClick={handleImprove}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-semibold"
                >
                  <Pencil className="w-4 h-4" />
                  Try again
                </button>

                <button
                  onClick={handleMaster}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 rounded-xl font-semibold"
                >
                  I am ready
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* MASTER */}
      {stage === 'master' && (
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />

            <h3 className="text-2xl font-bold">
              Letter practice complete
            </h3>

            <div className="mt-6 p-6 rounded-2xl bg-[#111827] border border-gray-800">
              <div className="text-7xl font-bold text-cyan-300">
                {currentLetter.letter}
              </div>

              <div className="text-3xl text-gray-500 mt-1">
                {currentLetter.lowercase}
              </div>

              <div className="mt-4 text-4xl">
                {currentLetter.emoji}
              </div>

              <p className="text-gray-300 mt-3 font-semibold">
                {currentLetter.word}
              </p>
            </div>

            <div className="mt-6 text-left p-4 bg-gray-900/60 border border-gray-800 rounded-xl">
              <p className="text-sm font-semibold text-white mb-3">
                What you practiced
              </p>

              <div className="space-y-2 text-sm text-gray-400">
                <p>✓ Observing letter shape</p>
                <p>✓ Following a tracing guide</p>
                <p>✓ Forming the letter independently</p>
                <p>✓ Checking and improving your writing</p>
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="tracing-reflection"
                className="block text-sm text-gray-400 mb-2"
              >
                What part of the letter was easiest for you?
              </label>

              <textarea
                id="tracing-reflection"
                value={reflection}
                onChange={(event) =>
                  setReflection(event.target.value)
                }
                placeholder="Write a short reflection..."
                className="w-full min-h-[90px] p-3 bg-[#111827] border border-gray-700 rounded-xl text-white placeholder:text-gray-600 resize-none focus:outline-none focus:border-cyan-500"
              />
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Practice attempts: {attempts}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={restartLetter}
                className="inline-flex items-center gap-2 px-5 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-semibold"
              >
                <RotateCcw className="w-4 h-4" />
                Practice again
              </button>

              <button
                onClick={nextLetter}
                className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-semibold"
              >
                {isLastLetter
                  ? 'Start Again'
                  : 'Next Letter'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Learning model */}
      <div className="mt-8 pt-5 border-t border-gray-800">
        <p className="text-center text-xs text-gray-500">
          Learning sequence: Observe → Trace → Form → Check → Improve → Master
        </p>
      </div>

      {/* Accessibility note */}
      <div className="mt-3 text-center">
        <p className="text-[11px] text-gray-600">
          This activity records writing attempts, but does not claim
          handwriting accuracy without dedicated stroke analysis.
        </p>
      </div>
    </div>
  );
};
