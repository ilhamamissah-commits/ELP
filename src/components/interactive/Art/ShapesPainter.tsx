import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RotateCcw,
  Trash2,
  Undo2,
  CheckCircle2,
  Sparkles,
  Shapes,
  Volume2,
} from 'lucide-react';

import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

type ShapeType = 'circle' | 'square' | 'triangle' | 'star';

interface ShapeDefinition {
  id: number;
  name: string;
  emoji: string;
  type: ShapeType;
}

interface PlacedShape {
  id: number;
  shape: ShapeDefinition;
  color: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

const SHAPES: ShapeDefinition[] = [
  {
    id: 1,
    name: 'Circle',
    emoji: '🔴',
    type: 'circle',
  },
  {
    id: 2,
    name: 'Square',
    emoji: '🟥',
    type: 'square',
  },
  {
    id: 3,
    name: 'Triangle',
    emoji: '🔺',
    type: 'triangle',
  },
  {
    id: 4,
    name: 'Star',
    emoji: '⭐',
    type: 'star',
  },
];

const COLORS = [
  { name: 'Red', value: '#EF4444' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#22C55E' },
  { name: 'Yellow', value: '#F59E0B' },
  { name: 'Purple', value: '#A855F7' },
  { name: 'Pink', value: '#EC4899' },
];

const MAX_SHAPES = 30;

const ShapeVisual: React.FC<{
  shape: ShapeDefinition;
  color: string;
}> = ({ shape, color }) => {
  switch (shape.type) {
    case 'circle':
      return (
        <div
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full"
          style={{ backgroundColor: color }}
        />
      );

    case 'square':
      return (
        <div
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-md"
          style={{ backgroundColor: color }}
        />
      );

    case 'triangle':
      return (
        <div
          className="w-0 h-0 border-l-[28px] sm:border-l-[32px] border-r-[28px] sm:border-r-[32px] border-b-[50px] sm:border-b-[56px]"
          style={{
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: color,
          }}
        />
      );

    case 'star':
      return (
        <div
          className="text-6xl leading-none select-none"
          style={{ color }}
        >
          ★
        </div>
      );

    default:
      return null;
  }
};

export const ShapesPainter: React.FC = () => {
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const { speak, stopSpeaking } = useReadAloud();

  const [selectedShape, setSelectedShape] =
    useState<ShapeDefinition>(SHAPES[0]);

  const [selectedColor, setSelectedColor] =
    useState(COLORS[0].value);

  const [placedShapes, setPlacedShapes] =
    useState<PlacedShape[]>([]);

  const [completed, setCompleted] = useState(false);

  /* =======================================================
     AUTO-READ — one-time intro on mount
  ======================================================= */

  useEffect(() => {
    if (!autoReadEnabled) return;

    const timer = window.setTimeout(() => {
      speak(
        'Shapes painter. Choose a shape and a colour, then tap anywhere on the canvas to place it.'
      );
    }, 500);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =======================================================
     COMPLETION NARRATION — fires once on `completed`
  ======================================================= */

  useEffect(() => {
    if (!completed) return;

    speak(
      `Wonderful artwork! You used ${placedShapes.length} ${
        placedShapes.length === 1 ? 'shape' : 'shapes'
      } to create your picture. Great creativity.`
    );
  }, [completed, placedShapes.length, speak]);

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

  const handleCanvasClick = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (completed) return;

    if (placedShapes.length >= MAX_SHAPES) return;

    // Stop any narration when the child starts placing shapes.
    stopSpeaking();

    const rect = e.currentTarget.getBoundingClientRect();

    const x =
      ((e.clientX - rect.left) / rect.width) * 100;

    const y =
      ((e.clientY - rect.top) / rect.height) * 100;

    const newShape: PlacedShape = {
      id: Date.now() + Math.random(),
      shape: selectedShape,
      color: selectedColor,
      x,
      y,
      rotation: Math.floor(Math.random() * 11) - 5,
      scale: 1,
    };

    setPlacedShapes((previous) => [
      ...previous,
      newShape,
    ]);

    setCompleted(false);
  };

  const undo = () => {
    if (placedShapes.length === 0) return;

    setPlacedShapes((previous) =>
      previous.slice(0, -1)
    );

    setCompleted(false);

    speak('Undo.');
  };

  const clear = () => {
    stopSpeaking();
    setPlacedShapes([]);
    setCompleted(false);
  };

  const selectShape = (shape: ShapeDefinition) => {
    setSelectedShape(shape);
    setCompleted(false);

    // Speak the shape name — this is what the child is picking,
    // not an answer to any puzzle.
    speak(shape.name);
  };

  const selectColor = (colorValue: string) => {
    setSelectedColor(colorValue);
    setCompleted(false);

    const colorData = COLORS.find(
      (color) => color.value === colorValue
    );
    if (colorData) {
      speak(colorData.name);
    }
  };

  const shapeCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    placedShapes.forEach((item) => {
      counts[item.shape.name] =
        (counts[item.shape.name] || 0) + 1;
    });

    return counts;
  }, [placedShapes]);

  const checkArtwork = () => {
    if (placedShapes.length < 3) return;

    setCompleted(true);
    // Narration handled by the completion effect above.
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-app-card rounded-3xl border border-app-border shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="px-5 sm:px-7 pt-6 pb-5">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 flex items-center justify-center">
                <Shapes className="w-6 h-6 text-indigo-400" />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Shapes Painter
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Create a picture using shapes!
                </p>
              </div>

            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={toggleSound}
                aria-label="Toggle sound"
                className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors flex items-center justify-center"
              >
                <Volume2
                  className={`w-4 h-4 ${soundEnabled ? 'text-amber-300' : 'text-gray-500'}`}
                />
              </button>

              <button
                onClick={clear}
                disabled={placedShapes.length === 0}
                aria-label="Clear canvas"
                className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 flex items-center justify-center disabled:opacity-30"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* INSTRUCTION */}
        <div className="px-5 sm:px-7 pb-5">

          <div className="rounded-2xl bg-indigo-500/10 border border-indigo-500/20 p-4">

            <div className="flex items-start gap-3">

              <span className="text-2xl">
                💡
              </span>

              <div>
                <p className="text-white font-bold text-sm">
                  Let's create!
                </p>

                <p className="text-gray-400 text-xs mt-1">
                  Choose a shape and a colour,
                  then tap anywhere on the canvas.
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* SHAPE SELECTOR */}
        <div className="px-5 sm:px-7 pb-5">

          <p className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-3">
            Choose a shape
          </p>

          <div className="grid grid-cols-4 gap-2">

            {SHAPES.map((shape) => (

              <motion.button
                key={shape.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => selectShape(shape)}
                aria-label={`Choose ${shape.name}`}
                className={`rounded-2xl p-3 border-2 transition ${
                  selectedShape.id === shape.id
                    ? 'bg-indigo-500/20 border-indigo-400 shadow-lg'
                    : 'bg-gray-900 border-gray-800 hover:border-gray-600'
                }`}
              >

                <div className="text-3xl">
                  {shape.emoji}
                </div>

                <div className="text-[11px] text-gray-400 mt-1">
                  {shape.name}
                </div>

              </motion.button>

            ))}

          </div>

        </div>

        {/* COLOUR SELECTOR */}
        <div className="px-5 sm:px-7 pb-5">

          <p className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-3">
            Pick a colour
          </p>

          <div className="flex flex-wrap gap-3">

            {COLORS.map((color) => (

              <motion.button
                key={color.value}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => selectColor(color.value)}
                aria-label={`Choose ${color.name}`}
                className={`w-10 h-10 rounded-full border-4 transition ${
                  selectedColor === color.value
                    ? 'border-white scale-110 shadow-lg'
                    : 'border-transparent'
                }`}
                style={{
                  backgroundColor: color.value,
                }}
              />

            ))}

          </div>

        </div>

        {/* CANVAS */}
        <div className="px-5 sm:px-7">

          <div
            className="relative w-full h-72 sm:h-80 bg-gray-950 rounded-2xl border-2 border-dashed border-gray-700 overflow-hidden cursor-crosshair select-none"
            onClick={handleCanvasClick}
            role="application"
            aria-label="Shape drawing canvas"
          >

            {/* Empty state */}
            {placedShapes.length === 0 && (

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">

                <div className="text-4xl mb-3">
                  🎨
                </div>

                <p className="text-gray-500 text-sm font-semibold">
                  Tap here to place a shape
                </p>

                <p className="text-gray-600 text-xs mt-1">
                  Make your own picture!
                </p>

              </div>

            )}

            {/* Shapes */}
            <AnimatePresence>

              {placedShapes.map((item) => (

                <motion.div
                  key={item.id}
                  initial={{
                    opacity: 0,
                    scale: 0.3,
                  }}
                  animate={{
                    opacity: 1,
                    scale: item.scale,
                    rotate: item.rotation,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                  }}
                >

                  <ShapeVisual
                    shape={item.shape}
                    color={item.color}
                  />

                </motion.div>

              ))}

            </AnimatePresence>

          </div>

        </div>

        {/* CANVAS INFO */}
        <div className="px-5 sm:px-7 pt-3">

          <div className="flex items-center justify-between text-xs text-gray-500">

            <span>
              Shapes: {placedShapes.length}/{MAX_SHAPES}
            </span>

            <span>
              {selectedShape.name} ·{' '}
              {
                COLORS.find(
                  (color) =>
                    color.value === selectedColor
                )?.name
              }
            </span>

          </div>

        </div>

        {/* SHAPE SUMMARY */}
        {placedShapes.length > 0 && (

          <div className="px-5 sm:px-7 pt-4">

            <div className="rounded-2xl bg-gray-900 border border-gray-800 p-4">

              <p className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-3">
                My shapes
              </p>

              <div className="flex flex-wrap gap-2">

                {Object.entries(shapeCounts).map(
                  ([name, count]) => (

                    <div
                      key={name}
                      className="px-3 py-1.5 rounded-full bg-gray-800 text-xs text-gray-300"
                    >
                      {name}: {count}
                    </div>

                  )
                )}

              </div>

            </div>

          </div>

        )}

        {/* CONTROLS */}
        <div className="px-5 sm:px-7 pt-5">

          <div className="grid grid-cols-2 gap-3">

            <button
              onClick={undo}
              disabled={placedShapes.length === 0}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold disabled:opacity-30 transition"
            >
              <Undo2 className="w-4 h-4" />
              Undo
            </button>

            <button
              onClick={clear}
              disabled={placedShapes.length === 0}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold disabled:opacity-30 transition"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>

          </div>

        </div>

        {/* CHECK */}
        <div className="p-5 sm:p-7">

          <button
            onClick={checkArtwork}
            disabled={placedShapes.length < 3}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold disabled:opacity-40 transition"
          >
            <CheckCircle2 className="w-5 h-5" />
            Finish My Picture
          </button>

        </div>

        {/* SUCCESS */}
        <AnimatePresence>

          {completed && (

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 10,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              className="mx-5 sm:mx-7 mb-7 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-5 text-center"
            >

              <div className="text-4xl mb-2">
                🎉
              </div>

              <h3 className="text-lg font-bold text-white">
                Wonderful artwork!
              </h3>

              <p className="text-sm text-gray-400 mt-1">
                You used {placedShapes.length} shapes
                to create your picture.
              </p>

              <div className="flex justify-center items-center gap-2 mt-3 text-yellow-400 text-sm font-bold">
                <Sparkles className="w-4 h-4" />
                Great creativity!
              </div>

            </motion.div>

          )}

        </AnimatePresence>

      </div>
    </motion.section>
  );
};