import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Brush,
  Calendar,
  CheckCircle,
  Eye,
  Image as ImageIcon,
  Lightbulb,
  Pencil,
  Plus,
  Sparkles,
  Star,
  X,
  Volume2,
} from 'lucide-react';

import { useReadAloud } from '../../../hooks/useReadAloud';
import { useSettingsStore } from '../../../store/useSettingsStore';

type ArtworkType =
  | 'drawing'
  | 'painting'
  | 'collage'
  | 'pattern'
  | 'design'
  | 'other';

interface Artwork {
  id: string;
  title: string;
  image: string;
  type: ArtworkType;
  createdAt: string;
  description?: string;
  reflection?: string;
}

const ARTWORK_TYPES: { id: ArtworkType; label: string }[] = [
  { id: 'drawing', label: 'Drawing' },
  { id: 'painting', label: 'Painting' },
  { id: 'collage', label: 'Collage' },
  { id: 'pattern', label: 'Pattern' },
  { id: 'design', label: 'Design' },
  { id: 'other', label: 'Other' },
];

type GalleryStage = 'gallery' | 'view' | 'reflect';

export const ArtGallery: React.FC = () => {
  const autoReadEnabled = useSettingsStore((s) => s.autoReadEnabled);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const { speak, stopSpeaking } = useReadAloud();

  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [stage, setStage] = useState<GalleryStage>('gallery');
  const [reflection, setReflection] = useState('');
  const [showCreatePrompt, setShowCreatePrompt] = useState(false);
  const lastSpokenReflectionRef = useRef<string | null>(null);

  const artworkCount = artworks.length;

  const sortedArtworks = useMemo(
    () =>
      [...artworks].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      ),
    [artworks]
  );

  /* =======================================================
     AUTO-READ — stage prompts
     Fires when the stage changes. Each prompt is short and
     orientation-only. Never reads reflection content.
  ======================================================= */

  useEffect(() => {
    if (!autoReadEnabled) return;

    const timer = window.setTimeout(() => {
      if (stage === 'gallery') {
        if (artworkCount === 0) {
          speak(
            'Your gallery is waiting. Create your first artwork and save it here. Your gallery will become a record of your creative journey.'
          );
        } else {
          speak(
            `Your art gallery contains ${artworkCount} ${
              artworkCount === 1 ? 'piece' : 'pieces'
            }. Click an artwork to explore it.`
          );
        }
      } else if (stage === 'view' && selectedArtwork) {
        speak(
          `${selectedArtwork.title}, a ${getArtworkTypeLabel(
            selectedArtwork.type
          ).toLowerCase()}. Think about what you made and the choices you made while creating it.`
        );
      } else if (stage === 'reflect' && selectedArtwork) {
        speak(
          'Think like an artist. There is no single right answer. Tell us about your creative choices. What do you like about your artwork?'
        );
      }
    }, 450);

    return () => window.clearTimeout(timer);
  }, [
    stage,
    selectedArtwork,
    artworkCount,
    autoReadEnabled,
    speak,
  ]);

  /* =======================================================
     CREATE PROMPT MODAL
     Fires when the modal opens.
  ======================================================= */

  useEffect(() => {
    if (!showCreatePrompt) return;
    if (!autoReadEnabled) return;

    const timer = window.setTimeout(() => {
      speak(
        'Create something. Choose where to begin: Drawing Canvas, Colour Exploration, Pattern Studio, or Creative Challenge.'
      );
    }, 350);

    return () => window.clearTimeout(timer);
  }, [showCreatePrompt, autoReadEnabled, speak]);

  /* =======================================================
     SAVE REFLECTION CONFIRMATION
     Fires when a reflection is saved (and the stage returns
     to 'view'). Uses a ref to fire only when the reflection
     actually changes on save.
  ======================================================= */

  useEffect(() => {
    if (stage !== 'view') return;
    if (!selectedArtwork) return;
    if (!selectedArtwork.reflection) return;

    // Only speak when the reflection was just saved, not on
    // every render of the view stage. Track with a ref.
    if (lastSpokenReflectionRef.current === selectedArtwork.reflection) {
      return;
    }
    lastSpokenReflectionRef.current = selectedArtwork.reflection;

    const timer = window.setTimeout(() => {
      speak(
        'Reflection saved. Thank you for thinking about your creative choices.'
      );
    }, 450);

    return () => window.clearTimeout(timer);
  }, [stage, selectedArtwork, speak]);

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

  const openArtwork = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setReflection(artwork.reflection ?? '');
    setStage('view');
  };

  const closeArtwork = () => {
    stopSpeaking();
    setSelectedArtwork(null);
    setReflection('');
    setStage('gallery');
  };

  const beginReflection = () => {
    setStage('reflect');
  };

  const saveReflection = () => {
    if (!selectedArtwork) return;

    setArtworks((previous) =>
      previous.map((artwork) =>
        artwork.id === selectedArtwork.id
          ? {
              ...artwork,
              reflection: reflection.trim(),
            }
          : artwork
      )
    );

    setSelectedArtwork((previous) =>
      previous
        ? {
            ...previous,
            reflection: reflection.trim(),
          }
        : previous
    );

    setStage('view');
  };

  const getArtworkTypeLabel = (type: ArtworkType) =>
    ARTWORK_TYPES.find((item) => item.id === type)?.label ?? 'Artwork';

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-app-card rounded-3xl border border-app-border shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-app-border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold mb-1">
                <Brush className="w-4 h-4" />
                Creative Arts
              </div>

              <h2 className="text-2xl font-bold text-white">
                Art Gallery
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                A place to keep, explore, and reflect on your creative work.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-gray-900 border border-gray-800">
                <p className="text-xs text-gray-500">Portfolio</p>
                <p className="text-lg font-bold text-white">
                  {artworkCount}
                  <span className="text-xs text-gray-500 ml-1">
                    {artworkCount === 1 ? 'piece' : 'pieces'}
                  </span>
                </p>
              </div>

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
                onClick={() => setShowCreatePrompt(true)}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold inline-flex items-center gap-2 transition"
              >
                <Plus className="w-4 h-4" />
                Create Art
              </button>
            </div>
          </div>

          {/* Learning progression */}
          <div className="flex flex-wrap gap-2 mt-5">
            {[
              'Explore',
              'Observe',
              'Create',
              'Experiment',
              'Express',
              'Reflect',
              'Curate',
              'Showcase',
            ].map((step, index) => (
              <div
                key={step}
                className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs"
              >
                {index + 1}. {step}
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* GALLERY */}
            {stage === 'gallery' && (
              <motion.div
                key="gallery"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {sortedArtworks.length === 0 ? (
                  <div className="text-center py-14">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-24 h-24 mx-auto rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center"
                    >
                      <Sparkles className="w-12 h-12 text-indigo-400" />
                    </motion.div>

                    <h3 className="text-xl font-bold text-white mt-6">
                      Your gallery is waiting
                    </h3>

                    <p className="text-gray-400 text-sm max-w-md mx-auto mt-2">
                      Create your first artwork and save it here. Your gallery
                      will become a record of your creative journey.
                    </p>

                    <button
                      type="button"
                      onClick={() => setShowCreatePrompt(true)}
                      className="mt-6 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold inline-flex items-center gap-2"
                    >
                      <Brush className="w-4 h-4" />
                      Start Creating
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          My Portfolio
                        </h3>

                        <p className="text-sm text-gray-500">
                          Click an artwork to explore it.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <ImageIcon className="w-4 h-4" />
                        {artworkCount}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {sortedArtworks.map((artwork, index) => (
                        <motion.button
                          key={artwork.id}
                          type="button"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ y: -4 }}
                          onClick={() => openArtwork(artwork)}
                          className="text-left bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-indigo-500/40 transition group"
                        >
                          <div className="aspect-square bg-white overflow-hidden">
                            <img
                              src={artwork.image}
                              alt={artwork.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            />
                          </div>

                          <div className="p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h4 className="text-white font-semibold">
                                  {artwork.title}
                                </h4>

                                <p className="text-xs text-indigo-400 mt-1">
                                  {getArtworkTypeLabel(artwork.type)}
                                </p>
                              </div>

                              <Eye className="w-4 h-4 text-gray-600 group-hover:text-indigo-400 transition" />
                            </div>

                            <div className="flex items-center gap-2 text-xs text-gray-600 mt-3">
                              <Calendar className="w-3.5 h-3.5" />

                              {new Date(artwork.createdAt).toLocaleDateString(
                                undefined,
                                {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                }
                              )}
                            </div>

                            {artwork.reflection && (
                              <div className="mt-3 flex items-center gap-2 text-xs text-green-400">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Reflection added
                              </div>
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* VIEW ARTWORK */}
            {stage === 'view' && selectedArtwork && (
              <motion.div
                key="view"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <button
                  type="button"
                  onClick={closeArtwork}
                  className="mb-5 text-gray-400 hover:text-white inline-flex items-center gap-2 text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Gallery
                </button>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Artwork */}
                  <div>
                    <div className="rounded-2xl overflow-hidden bg-white border border-gray-800">
                      <img
                        src={selectedArtwork.image}
                        alt={selectedArtwork.title}
                        className="w-full aspect-square object-contain"
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div>
                    <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold">
                      <Star className="w-4 h-4" />
                      Portfolio Piece
                    </div>

                    <h3 className="text-3xl font-bold text-white mt-2">
                      {selectedArtwork.title}
                    </h3>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="px-3 py-1 rounded-full bg-gray-900 border border-gray-800 text-sm text-gray-300">
                        {getArtworkTypeLabel(selectedArtwork.type)}
                      </span>

                      <span className="px-3 py-1 rounded-full bg-gray-900 border border-gray-800 text-sm text-gray-400">
                        {new Date(
                          selectedArtwork.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    {selectedArtwork.description && (
                      <div className="mt-6">
                        <p className="text-xs uppercase tracking-wider text-gray-600">
                          About this artwork
                        </p>

                        <p className="text-gray-300 mt-2 leading-relaxed">
                          {selectedArtwork.description}
                        </p>
                      </div>
                    )}

                    <div className="mt-7 p-5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />

                        <div>
                          <p className="font-semibold text-white">
                            Artist Reflection
                          </p>

                          <p className="text-sm text-gray-400 mt-1">
                            Think about what you made and the choices you
                            made while creating it.
                          </p>
                        </div>
                      </div>

                      {selectedArtwork.reflection ? (
                        <div className="mt-4 p-4 bg-gray-950/60 rounded-xl">
                          <p className="text-gray-300 italic leading-relaxed">
                            “{selectedArtwork.reflection}”
                          </p>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={beginReflection}
                          className="mt-4 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold inline-flex items-center gap-2"
                        >
                          <Pencil className="w-4 h-4" />
                          Add Reflection
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* REFLECTION */}
            {stage === 'reflect' && selectedArtwork && (
              <motion.div
                key="reflect"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-2xl mx-auto"
              >
                <button
                  type="button"
                  onClick={() => setStage('view')}
                  className="mb-5 text-gray-400 hover:text-white inline-flex items-center gap-2 text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <div className="text-center">
                  <Sparkles className="w-9 h-9 text-indigo-400 mx-auto" />

                  <h3 className="text-2xl font-bold text-white mt-3">
                    Think like an artist
                  </h3>

                  <p className="text-gray-400 text-sm mt-2">
                    There is no single right answer. Tell us about your
                    creative choices.
                  </p>
                </div>

                <div className="mt-7 flex gap-4 items-center p-4 bg-gray-900 rounded-2xl border border-gray-800">
                  <img
                    src={selectedArtwork.image}
                    alt=""
                    className="w-20 h-20 rounded-xl object-cover bg-white"
                  />

                  <div>
                    <p className="text-white font-semibold">
                      {selectedArtwork.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {getArtworkTypeLabel(selectedArtwork.type)}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <label
                    htmlFor="art-reflection"
                    className="block text-sm font-semibold text-gray-300 mb-2"
                  >
                    What do you like about your artwork?
                  </label>

                  <textarea
                    id="art-reflection"
                    value={reflection}
                    onChange={(event) =>
                      setReflection(event.target.value)
                    }
                    placeholder="I like..."
                    className="w-full min-h-[130px] bg-gray-950 border border-gray-800 rounded-xl p-4 text-white placeholder:text-gray-600 resize-none outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="mt-5">
                  <label
                    htmlFor="art-next"
                    className="block text-sm font-semibold text-gray-300 mb-2"
                  >
                    What would you like to try next?
                  </label>

                  <div
                    id="art-next"
                    className="grid grid-cols-2 sm:grid-cols-4 gap-2"
                  >
                    {[
                      'New colours',
                      'New shapes',
                      'New patterns',
                      'Something new',
                    ].map((choice) => (
                      <button
                        key={choice}
                        type="button"
                        onClick={() => speak(choice)}
                        className="p-3 rounded-xl bg-gray-900 border border-gray-800 hover:border-indigo-500/40 text-gray-300 text-sm transition"
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={saveReflection}
                  className="w-full mt-7 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold inline-flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Save Reflection
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Learning framework */}
      <div className="mt-5 p-5 bg-app-card border border-app-border rounded-2xl">
        <div className="flex items-start gap-3">
          <Brush className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />

          <div>
            <p className="text-sm font-semibold text-white">
              Art learning progression
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Explore → Observe → Create → Experiment → Express → Reflect →
              Curate → Showcase
            </p>

            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              Art activities develop observation, fine-motor coordination,
              visual awareness, creativity, decision-making, communication,
              and reflection. The goal is expression and exploration rather
              than producing one “correct” artwork.
            </p>
          </div>
        </div>
      </div>

      {/* Create prompt */}
      <AnimatePresence>
        {showCreatePrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowCreatePrompt(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-md bg-app-card border border-app-border rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                    <Brush className="w-6 h-6 text-indigo-400" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Create something
                    </h3>

                    <p className="text-xs text-gray-500">
                      Choose where to begin
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCreatePrompt(false)}
                  className="p-2 text-gray-500 hover:text-white"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  {
                    title: 'Drawing Canvas',
                    description: 'Draw freely using lines, shapes, and colours.',
                    icon: '✏️',
                  },
                  {
                    title: 'Colour Exploration',
                    description: 'Explore colour combinations and visual choices.',
                    icon: '🎨',
                  },
                  {
                    title: 'Pattern Studio',
                    description: 'Create repeating patterns and visual sequences.',
                    icon: '🔷',
                  },
                  {
                    title: 'Creative Challenge',
                    description: 'Start with an idea and make it your own.',
                    icon: '✨',
                  },
                ].map((option) => (
                  <button
                    key={option.title}
                    type="button"
                    onClick={() => setShowCreatePrompt(false)}
                    className="w-full p-4 rounded-xl bg-gray-900 border border-gray-800 hover:border-indigo-500/40 text-left transition flex items-center gap-4"
                  >
                    <span className="text-2xl">{option.icon}</span>

                    <span>
                      <span className="block text-white font-semibold">
                        {option.title}
                      </span>

                      <span className="block text-xs text-gray-500 mt-1">
                        {option.description}
                      </span>
                    </span>
                  </button>
                ))}
              </div>

              <p className="text-xs text-gray-600 mt-5 text-center">
                Connect these options to your actual Art activities as they
                are implemented.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};