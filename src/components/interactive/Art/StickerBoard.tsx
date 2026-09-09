import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RotateCcw,
  Undo2,
  Trash2,
  CheckCircle2,
  Sparkles,
  Volume2,
} from 'lucide-react';

type StickerCategory =
  | 'nature'
  | 'animals'
  | 'objects'
  | 'weather';

interface Sticker {
  id: number;
  name: string;
  emoji: string;
  category: StickerCategory;
  vocabulary: string;
}

interface PlacedSticker {
  id: number;
  sticker: Sticker;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

const STICKERS: Sticker[] = [
  {
    id: 1,
    name: 'Sun',
    emoji: '☀️',
    category: 'weather',
    vocabulary: 'sun',
  },
  {
    id: 2,
    name: 'Cloud',
    emoji: '☁️',
    category: 'weather',
    vocabulary: 'cloud',
  },
  {
    id: 3,
    name: 'Tree',
    emoji: '🌳',
    category: 'nature',
    vocabulary: 'tree',
  },
  {
    id: 4,
    name: 'Flower',
    emoji: '🌸',
    category: 'nature',
    vocabulary: 'flower',
  },
  {
    id: 5,
    name: 'Star',
    emoji: '⭐',
    category: 'nature',
    vocabulary: 'star',
  },
  {
    id: 6,
    name: 'Rainbow',
    emoji: '🌈',
    category: 'weather',
    vocabulary: 'rainbow',
  },
  {
    id: 7,
    name: 'Butterfly',
    emoji: '🦋',
    category: 'animals',
    vocabulary: 'butterfly',
  },
  {
    id: 8,
    name: 'Fish',
    emoji: '🐟',
    category: 'animals',
    vocabulary: 'fish',
  },
  {
    id: 9,
    name: 'Ball',
    emoji: '⚽',
    category: 'objects',
    vocabulary: 'ball',
  },
  {
    id: 10,
    name: 'Bird',
    emoji: '🐦',
    category: 'animals',
    vocabulary: 'bird',
  },
];

const CATEGORIES: {
  id: 'all' | StickerCategory;
  label: string;
  emoji: string;
}[] = [
  { id: 'all', label: 'All', emoji: '✨' },
  { id: 'nature', label: 'Nature', emoji: '🌳' },
  { id: 'animals', label: 'Animals', emoji: '🐾' },
  { id: 'weather', label: 'Weather', emoji: '☀️' },
  { id: 'objects', label: 'Things', emoji: '⚽' },
];

const MAX_STICKERS = 25;

export const StickerBoard: React.FC = () => {
  const [placed, setPlaced] = useState<PlacedSticker[]>([]);
  const [selectedSticker, setSelectedSticker] =
    useState<Sticker>(STICKERS[0]);

  const [category, setCategory] =
    useState<'all' | StickerCategory>('all');

  const [completed, setCompleted] = useState(false);

  const filteredStickers = useMemo(() => {
    if (category === 'all') {
      return STICKERS;
    }

    return STICKERS.filter(
      (sticker) => sticker.category === category
    );
  }, [category]);

  /**
   * Place sticker on board.
   */
  const handleBoardClick = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (completed) return;

    if (placed.length >= MAX_STICKERS) {
      return;
    }

    const rect =
      e.currentTarget.getBoundingClientRect();

    const x =
      ((e.clientX - rect.left) / rect.width) * 100;

    const y =
      ((e.clientY - rect.top) / rect.height) * 100;

    const newSticker: PlacedSticker = {
      id: Date.now() + Math.random(),
      sticker: selectedSticker,
      x,
      y,
      scale: 1,
      rotation: Math.floor(Math.random() * 11) - 5,
    };

    setPlaced((previous) => [
      ...previous,
      newSticker,
    ]);

    setCompleted(false);
  };

  /**
   * Undo last sticker.
   */
  const undo = () => {
    setPlaced((previous) =>
      previous.slice(0, -1)
    );

    setCompleted(false);
  };

  /**
   * Clear board.
   */
  const clearBoard = () => {
    setPlaced([]);
    setCompleted(false);
  };

  /**
   * Select sticker.
   */
  const selectSticker = (sticker: Sticker) => {
    setSelectedSticker(sticker);
    setCompleted(false);
  };

  /**
   * Change category.
   */
  const selectCategory = (
    newCategory: 'all' | StickerCategory
  ) => {
    setCategory(newCategory);
  };

  /**
   * Simple scene completion.
   *
   * This can later be replaced by
   * a curriculum-specific assessment.
   */
  const finishScene = () => {
    if (placed.length < 3) return;

    setCompleted(true);
  };

  /**
   * Count categories used.
   */
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    placed.forEach((item) => {
      counts[item.sticker.category] =
        (counts[item.sticker.category] || 0) + 1;
    });

    return counts;
  }, [placed]);

  /**
   * Speak selected vocabulary word.
   *
   * This can later connect to the ELP
   * multilingual speech engine.
   */
  const speakWord = () => {
    if (
      typeof window === 'undefined' ||
      !('speechSynthesis' in window)
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(
        selectedSticker.vocabulary
      );

    utterance.rate = 0.75;
    utterance.pitch = 1.1;

    window.speechSynthesis.speak(
      utterance
    );
  };

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-app-card rounded-3xl border border-app-border shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="px-5 sm:px-7 pt-6 pb-5">

          <div className="flex items-center justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 flex items-center justify-center">
                <span className="text-2xl">
                  🧩
                </span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Sticker Story
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Build your own scene!
                </p>
              </div>

            </div>

            <button
              onClick={clearBoard}
              disabled={placed.length === 0}
              aria-label="Clear scene"
              className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 flex items-center justify-center disabled:opacity-30 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

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
                  Create a story!
                </p>

                <p className="text-gray-400 text-xs mt-1">
                  Choose stickers and place them
                  anywhere to make your own scene.
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* CATEGORY FILTER */}
        <div className="px-5 sm:px-7 pb-5">

          <p className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-3">
            Explore
          </p>

          <div className="flex gap-2 overflow-x-auto pb-1">

            {CATEGORIES.map((item) => (

              <button
                key={item.id}
                onClick={() =>
                  selectCategory(item.id)
                }
                className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition ${
                  category === item.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {item.emoji} {item.label}
              </button>

            ))}

          </div>

        </div>

        {/* STICKER SELECTOR */}
        <div className="px-5 sm:px-7 pb-5">

          <div className="grid grid-cols-5 gap-2">

            {filteredStickers.map((sticker) => (

              <motion.button
                key={sticker.id}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  selectSticker(sticker)
                }
                aria-label={`Choose ${sticker.name}`}
                className={`rounded-2xl p-2 border-2 transition ${
                  selectedSticker.id === sticker.id
                    ? 'bg-indigo-500/20 border-indigo-400 shadow-lg'
                    : 'bg-gray-900 border-gray-800 hover:border-gray-600'
                }`}
              >

                <div className="text-3xl">
                  {sticker.emoji}
                </div>

                <div className="text-[10px] text-gray-500 mt-1">
                  {sticker.name}
                </div>

              </motion.button>

            ))}

          </div>

        </div>

        {/* SELECTED WORD */}
        <div className="px-5 sm:px-7 pb-5">

          <div className="flex items-center justify-between rounded-xl bg-gray-900 border border-gray-800 px-4 py-3">

            <div className="flex items-center gap-3">

              <span className="text-2xl">
                {selectedSticker.emoji}
              </span>

              <div>
                <p className="text-xs text-gray-500">
                  New word
                </p>

                <p className="text-white font-bold">
                  {selectedSticker.name}
                </p>
              </div>

            </div>

            <button
              onClick={speakWord}
              aria-label={`Hear the word ${selectedSticker.name}`}
              className="w-9 h-9 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center hover:bg-indigo-500/25"
            >
              <Volume2 className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* BOARD */}
        <div className="px-5 sm:px-7">

          <div
            onClick={handleBoardClick}
            role="application"
            aria-label="Sticker scene board"
            className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden border-2 border-dashed border-gray-700 cursor-crosshair select-none"
            style={{
              background:
                'linear-gradient(180deg, #dbeafe 0%, #bfdbfe 60%, #86efac 60%, #4ade80 100%)',
            }}
          >

            {/* Sunlight */}
            <div className="absolute top-4 right-5 text-5xl opacity-20 pointer-events-none">
              ☀️
            </div>

            {/* Empty state */}
            {placed.length === 0 && (

              <div className="absolute inset-0 flex items-center justify-center">

                <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl px-5 py-4">

                  <div className="text-3xl mb-2">
                    🏡
                  </div>

                  <p className="text-gray-700 font-bold text-sm">
                    Build your scene
                  </p>

                  <p className="text-gray-500 text-xs mt-1">
                    Tap anywhere to place a sticker
                  </p>

                </div>

              </div>

            )}

            {/* Placed stickers */}
            <AnimatePresence>

              {placed.map((item) => (

                <motion.div
                  key={item.id}
                  initial={{
                    opacity: 0,
                    scale: 0.2,
                  }}
                  animate={{
                    opacity: 1,
                    scale: item.scale,
                    rotate: item.rotation,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 text-4xl sm:text-5xl pointer-events-none"
                  style={{
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                  }}
                >
                  {item.sticker.emoji}
                </motion.div>

              ))}

            </AnimatePresence>

          </div>

        </div>

        {/* BOARD STATS */}
        <div className="px-5 sm:px-7 pt-3">

          <div className="flex justify-between text-xs text-gray-500">

            <span>
              Stickers: {placed.length}/{MAX_STICKERS}
            </span>

            <span>
              {selectedSticker.name} selected
            </span>

          </div>

        </div>

        {/* CATEGORY SUMMARY */}
        {placed.length > 0 && (

          <div className="px-5 sm:px-7 pt-4">

            <div className="rounded-2xl bg-gray-900 border border-gray-800 p-4">

              <p className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-3">
                My scene
              </p>

              <div className="flex flex-wrap gap-2">

                {Object.entries(
                  categoryCounts
                ).map(([name, count]) => (

                  <div
                    key={name}
                    className="px-3 py-1.5 rounded-full bg-gray-800 text-xs text-gray-300 capitalize"
                  >
                    {name}: {count}
                  </div>

                ))}

              </div>

            </div>

          </div>

        )}

        {/* CONTROLS */}
        <div className="px-5 sm:px-7 pt-5">

          <div className="grid grid-cols-2 gap-3">

            <button
              onClick={undo}
              disabled={placed.length === 0}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold disabled:opacity-30 transition"
            >
              <Undo2 className="w-4 h-4" />
              Undo
            </button>

            <button
              onClick={clearBoard}
              disabled={placed.length === 0}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold disabled:opacity-30 transition"
            >
              <Trash2 className="w-4 h-4" />
              Start Again
            </button>

          </div>

        </div>

        {/* FINISH */}
        <div className="p-5 sm:p-7">

          <button
            onClick={finishScene}
            disabled={placed.length < 3}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold disabled:opacity-40 transition"
          >
            <CheckCircle2 className="w-5 h-5" />
            Finish My Scene
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
                Amazing scene!
              </h3>

              <p className="text-sm text-gray-400 mt-1">
                You used {placed.length} stickers
                to create your world.
              </p>

              <div className="flex justify-center items-center gap-2 mt-3 text-yellow-400 text-sm font-bold">
                <Sparkles className="w-4 h-4" />
                Now tell me about your picture!
              </div>

            </motion.div>

          )}

        </AnimatePresence>

      </div>
    </motion.section>
  );
};
