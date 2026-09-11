import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RotateCcw,
  Undo2,
  Eraser,
  Pencil,
  Trash2,
  Check,
  Sparkles,
  Volume2,
} from 'lucide-react';

import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

const COLORS = [
  '#EF4444',
  '#F97316',
  '#F59E0B',
  '#22C55E',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
  '#111827',
];

const PEN_SIZES = [
  { value: 4, label: 'Small' },
  { value: 8, label: 'Medium' },
  { value: 14, label: 'Big' },
];

const COLOR_NAMES: Record<string, string> = {
  '#EF4444': 'Red',
  '#F97316': 'Orange',
  '#F59E0B': 'Yellow',
  '#22C55E': 'Green',
  '#3B82F6': 'Blue',
  '#8B5CF6': 'Purple',
  '#EC4899': 'Pink',
  '#111827': 'Black',
};

type Tool = 'pencil' | 'eraser';

interface DrawingCanvasProps {
  title?: string;
  subtitle?: string;
  onSave?: (imageData: string) => void;
  backgroundColor?: string;
  showGallery?: boolean;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  title = 'My Drawing',
  subtitle = 'Draw, create and have fun!',
  onSave,
  backgroundColor = '#FFFFFF',
  showGallery = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const { speak, stopSpeaking } = useReadAloud();

  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [penSize, setPenSize] = useState(8);
  const [tool, setTool] = useState<Tool>('pencil');

  const [history, setHistory] = useState<ImageData[]>([]);
  const [drawingCount, setDrawingCount] = useState(0);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  /* =======================================================
     Configure the canvas for high-DPI screens.
  ======================================================= */

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    const width = Math.max(300, rect.width);
    const height = Math.max(280, Math.min(width * 0.78, 480));

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    ctx.scale(dpr, dpr);

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [backgroundColor]);

  useEffect(() => {
    setupCanvas();

    const handleResize = () => {
      // We intentionally do not automatically resize an existing drawing.
      // This prevents children from losing their work while rotating/resizing.
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setupCanvas]);

  /* =======================================================
     AUTO-READ — one-time intro on mount
     Fires only once. After that, the canvas is quiet by
     default to let the child draw without interruption.
     Manual "Hear this" toggle in header can re-read.
  ======================================================= */

  useEffect(() => {
    if (!autoReadEnabled) return;

    const timer = window.setTimeout(() => {
      speak(
        `${title}. ${subtitle} Pick a colour and a pencil size, then draw with your finger, mouse, or stylus.`
      );
    }, 500);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =======================================================
     CLEANUP
  ======================================================= */

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  /* =======================================================
     POINTER HANDLING
     Suspends any in-flight narration on first touch so the
     child isn't talked over while drawing.
  ======================================================= */

  const getPointerPosition = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;

      if (!canvas) {
        return { x: 0, y: 0 };
      }

      const rect = canvas.getBoundingClientRect();

      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    },
    []
  );

  const saveHistory = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const imageData = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );

    setHistory((previous) => {
      const next = [...previous, imageData];

      return next.slice(-20);
    });
  }, []);

  const startDrawing = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      event.preventDefault();

      // Stop any narration as soon as drawing begins.
      stopSpeaking();

      canvas.setPointerCapture(event.pointerId);

      saveHistory();

      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      const { x, y } = getPointerPosition(event);

      setIsDrawing(true);
      setHasDrawing(true);

      ctx.beginPath();
      ctx.moveTo(x, y);

      ctx.lineWidth = penSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = selectedColor;
      }
    },
    [
      getPointerPosition,
      penSize,
      saveHistory,
      selectedColor,
      tool,
      stopSpeaking,
    ]
  );

  const draw = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;

      const canvas = canvasRef.current;

      if (!canvas) return;

      event.preventDefault();

      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      const { x, y } = getPointerPosition(event);

      ctx.lineWidth = penSize;

      ctx.lineTo(x, y);
      ctx.stroke();
    },
    [getPointerPosition, isDrawing, penSize]
  );

  const stopDrawing = useCallback(
    (event?: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;

      if (event && canvas?.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }

      setIsDrawing(false);

      const ctx = canvas?.getContext('2d');

      if (ctx) {
        ctx.closePath();
        ctx.globalCompositeOperation = 'source-over';
      }
    },
    []
  );

  /* =======================================================
     UNDO — narrates the action
  ======================================================= */

  const undo = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas || history.length === 0) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const previous = history[history.length - 1];

    ctx.putImageData(previous, 0, 0);

    setHistory((items) => items.slice(0, -1));

    if (history.length === 1) {
      setHasDrawing(false);
    }

    speak('Undo.');
  }, [history, speak]);

  /* =======================================================
     CLEAR — narrates the action, only if drawing exists.
     No confirmation dialog; the brief says preserve
     everything, and the original has none.
  ======================================================= */

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, rect.width, rect.height);

    setHistory([]);
    setHasDrawing(false);

    speak('Canvas cleared. Start a new drawing.');
  }, [backgroundColor, speak]);

  /* =======================================================
     SAVE — narrates success after the message displays.
     Never reads the image data aloud (obviously).
  ======================================================= */

  const addToGallery = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas || !hasDrawing) return;

    const dataUrl = canvas.toDataURL('image/png');

    onSave?.(dataUrl);

    setDrawingCount((count) => count + 1);

    setShowSavedMessage(true);

    setTimeout(() => {
      setShowSavedMessage(false);
    }, 2200);

    speak('Saved to your gallery. Wonderful creating.');
  }, [hasDrawing, onSave, speak]);

  /* =======================================================
     TOOL SELECTION — narrates the tool and current colour
  ======================================================= */

  const selectPencil = () => {
    setTool('pencil');
    speak(`Pencil, ${COLOR_NAMES[selectedColor] ?? 'this colour'}.`);
  };

  const selectEraser = () => {
    setTool('eraser');
    speak('Eraser.');
  };

  const selectColor = (color: string) => {
    setSelectedColor(color);
    setTool('pencil');

    const colorName = COLOR_NAMES[color] ?? 'a new colour';
    speak(colorName);
  };

  const selectPenSize = (size: number, label: string) => {
    setPenSize(size);
    speak(`${label} pencil.`);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-app-card rounded-3xl border border-app-border shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-5 sm:px-7 pt-6 pb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 flex items-center justify-center">
                <span className="text-2xl">🎨</span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {title}
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  {subtitle}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleSound}
                aria-label="Toggle sound"
                className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors flex items-center justify-center"
              >
                <Volume2
                  className={`w-4 h-4 ${soundEnabled ? 'text-amber-300' : 'text-gray-500'}`}
                />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={clearCanvas}
                disabled={!hasDrawing}
                aria-label="Clear drawing"
                className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Drawing tools */}
        <div className="px-5 sm:px-7 pb-4 space-y-4">
          {/* Tool selection */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={selectPencil}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition ${
                  tool === 'pencil'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                <Pencil className="w-4 h-4" />
                Pencil
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={selectEraser}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition ${
                  tool === 'eraser'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                <Eraser className="w-4 h-4" />
                Eraser
              </motion.button>
            </div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={undo}
              disabled={history.length === 0}
              aria-label="Undo"
              className="w-10 h-10 rounded-xl bg-gray-800 text-gray-300 flex items-center justify-center disabled:opacity-30"
            >
              <Undo2 className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Color palette */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Pick a colour
            </p>

            <div className="flex flex-wrap gap-2.5">
              {COLORS.map((color) => (
                <motion.button
                  key={color}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => selectColor(color)}
                  aria-label={`Choose ${COLOR_NAMES[color] ?? color}`}
                  className={`w-9 h-9 rounded-full border-4 transition ${
                    selectedColor === color && tool === 'pencil'
                      ? 'border-white scale-110 shadow-lg'
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Brush size */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Pencil size
            </p>

            <div className="flex gap-2">
              {PEN_SIZES.map((size) => (
                <button
                  key={size.value}
                  onClick={() => selectPenSize(size.value, size.label)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition ${
                    penSize === size.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <span
                    className="inline-block rounded-full bg-current mr-2 align-middle"
                    style={{
                      width: Math.min(size.value + 3, 15),
                      height: Math.min(size.value + 3, 15),
                    }}
                  />
                  {size.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="px-5 sm:px-7">
          <div
            ref={containerRef}
            className="relative rounded-2xl overflow-hidden border-4 border-indigo-500/20 bg-white shadow-inner"
          >
            <canvas
              ref={canvasRef}
              onPointerDown={startDrawing}
              onPointerMove={draw}
              onPointerUp={stopDrawing}
              onPointerCancel={stopDrawing}
              onPointerLeave={stopDrawing}
              className={`block w-full touch-none ${
                tool === 'eraser'
                  ? 'cursor-cell'
                  : 'cursor-crosshair'
              }`}
              aria-label="Drawing canvas"
            />

            {/* Empty state */}
            <AnimatePresence>
              {!hasDrawing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="pointer-events-none absolute inset-0 flex items-center justify-center"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">✏️</div>
                    <p className="text-gray-400 font-semibold text-sm">
                      Start drawing here!
                    </p>
                    <p className="text-gray-300 text-xs mt-1">
                      Use your finger, mouse or stylus
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Encouragement */}
        <div className="px-5 sm:px-7 pt-4">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <Sparkles className="w-4 h-4 text-yellow-400" />

            <span>
              {hasDrawing
                ? 'Wonderful! Keep creating! 🌟'
                : 'There are no wrong drawings — just have fun! 💛'}
            </span>
          </div>
        </div>

        {/* Save */}
        {showGallery && (
          <div className="p-5 sm:p-7">
            <motion.button
              whileHover={{ scale: hasDrawing ? 1.02 : 1 }}
              whileTap={{ scale: hasDrawing ? 0.98 : 1 }}
              onClick={addToGallery}
              disabled={!hasDrawing}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              {showSavedMessage ? (
                <>
                  <Check className="w-5 h-5" />
                  Saved to My Gallery! 🎉
                </>
              ) : (
                <>
                  <span className="text-lg">💾</span>
                  Save My Drawing
                  {drawingCount > 0 && ` (${drawingCount})`}
                </>
              )}
            </motion.button>
          </div>
        )}
      </div>
    </motion.section>
  );
};