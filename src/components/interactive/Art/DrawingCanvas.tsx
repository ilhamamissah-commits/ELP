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
} from 'lucide-react';

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

  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [penSize, setPenSize] = useState(8);
  const [tool, setTool] = useState<Tool>('pencil');

  const [history, setHistory] = useState<ImageData[]>([]);
  const [drawingCount, setDrawingCount] = useState(0);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  /**
   * Configure the canvas for high-DPI screens.
   * This prevents blurry drawings on phones/tablets.
   */
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

  /**
   * Initial canvas setup.
   */
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

  /**
   * Get pointer coordinates relative to canvas.
   */
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

  /**
   * Save the current canvas state for undo.
   */
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

      // Keep memory usage reasonable.
      return next.slice(-20);
    });
  }, []);

  /**
   * Start drawing.
   */
  const startDrawing = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      event.preventDefault();

      // Allows drawing with finger/stylus without scrolling.
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
    ]
  );

  /**
   * Draw while pointer moves.
   */
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

  /**
   * Stop drawing.
   */
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

  /**
   * Undo the previous stroke.
   */
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
  }, [history]);

  /**
   * Clear the entire canvas.
   */
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
  }, [backgroundColor]);

  /**
   * Save drawing to the gallery.
   */
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
  }, [hasDrawing, onSave]);

  /**
   * Reset tool state.
   */
  const selectPencil = () => {
    setTool('pencil');
  };

  const selectEraser = () => {
    setTool('eraser');
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
                  onClick={() => {
                    setSelectedColor(color);
                    setTool('pencil');
                  }}
                  aria-label={`Choose ${color}`}
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
                  onClick={() => setPenSize(size.value)}
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
