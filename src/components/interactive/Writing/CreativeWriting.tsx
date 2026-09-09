import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Sparkles,
  MapPin,
  User,
  Zap,
  Pencil,
  Volume2,
  RotateCcw,
  CheckCircle,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';

type WritingStage =
  | 'imagine'
  | 'choose'
  | 'build'
  | 'read'
  | 'extend'
  | 'create'
  | 'reflect'
  | 'complete';

interface StoryOption {
  id: number;
  name: string;
  emoji: string;
}

const CHARACTERS: StoryOption[] = [
  { id: 1, name: 'a brave knight', emoji: '🛡️' },
  { id: 2, name: 'a curious cat', emoji: '🐱' },
  { id: 3, name: 'a flying dragon', emoji: '🐉' },
  { id: 4, name: 'a curious astronaut', emoji: '👨‍🚀' },
];

const PLACES: StoryOption[] = [
  { id: 1, name: 'in the forest', emoji: '🌲' },
  { id: 2, name: 'at the beach', emoji: '🏖️' },
  { id: 3, name: 'on the moon', emoji: '🌙' },
  { id: 4, name: 'at a castle', emoji: '🏰' },
];

const ACTIONS: StoryOption[] = [
  { id: 1, name: 'was looking for treasure', emoji: '💰' },
  { id: 2, name: 'was making a sandcastle', emoji: '🏰' },
  { id: 3, name: 'was dancing happily', emoji: '💃' },
  { id: 4, name: 'was flying toward the stars', emoji: '✨' },
];

const STORY_OPENINGS = [
  'Once upon a time,',
  'One bright morning,',
  'Long ago,',
  'On a very special day,',
];

const STAGE_ORDER: WritingStage[] = [
  'imagine',
  'choose',
  'build',
  'read',
  'extend',
  'create',
  'reflect',
  'complete',
];

const STAGE_LABELS: Record<WritingStage, string> = {
  imagine: 'Imagine',
  choose: 'Choose',
  build: 'Build',
  read: 'Read',
  extend: 'Extend',
  create: 'Create',
  reflect: 'Reflect',
  complete: 'Complete',
};

export const CreativeWriting: React.FC = () => {
  const [stage, setStage] = useState<WritingStage>('imagine');

  const [character, setCharacter] = useState<StoryOption | null>(null);
  const [place, setPlace] = useState<StoryOption | null>(null);
  const [action, setAction] = useState<StoryOption | null>(null);

  const [opening, setOpening] = useState(STORY_OPENINGS[0]);
  const [extension, setExtension] = useState('');
  const [reflection, setReflection] = useState('');
  const [saved, setSaved] = useState(false);

  const currentStageIndex = STAGE_ORDER.indexOf(stage);

  const story = useMemo(() => {
    if (!character || !place || !action) return '';

    return `${opening} ${character.name} ${action.name} ${place.name}.`;
  }, [character, place, action, opening]);

  const fullStory = useMemo(() => {
    if (!story) return '';

    if (!extension.trim()) {
      return `${story} It was a magical adventure!`;
    }

    return `${story} ${extension.trim()}`;
  }, [story, extension]);

  const goNext = () => {
    const nextIndex = currentStageIndex + 1;

    if (nextIndex < STAGE_ORDER.length) {
      setStage(STAGE_ORDER[nextIndex]);
    }
  };

  const resetActivity = () => {
    setStage('imagine');
    setCharacter(null);
    setPlace(null);
    setAction(null);
    setOpening(STORY_OPENINGS[0]);
    setExtension('');
    setReflection('');
    setSaved(false);
  };

  const selectCharacter = (item: StoryOption) => {
    setCharacter(item);
    setSaved(false);
  };

  const selectPlace = (item: StoryOption) => {
    setPlace(item);
    setSaved(false);
  };

  const selectAction = (item: StoryOption) => {
    setAction(item);
    setSaved(false);
  };

  const speakStory = () => {
    if (
      typeof window === 'undefined' ||
      !('speechSynthesis' in window) ||
      !fullStory
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(fullStory);
    utterance.rate = 0.8;
    utterance.pitch = 1.05;

    window.speechSynthesis.speak(utterance);
  };

  const handleSave = () => {
    setSaved(true);
  };

  const canBuild =
    character !== null &&
    place !== null &&
    action !== null;

  return (
    <div className="max-w-2xl mx-auto bg-app-card rounded-3xl border border-app-border shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-app-border">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />

              <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400">
                Writing • Storytelling
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white">
              Creative Writing
            </h3>

            <p className="text-sm text-gray-400 mt-1">
              Imagine, build and create your own story.
            </p>
          </div>

          <button
            onClick={resetActivity}
            className="p-2 rounded-lg border border-app-border text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Reset writing activity"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Progress */}
        <div className="mt-5">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>{STAGE_LABELS[stage]}</span>
            <span>
              {currentStageIndex + 1} / {STAGE_ORDER.length}
            </span>
          </div>

          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-cyan-400"
              animate={{
                width: `${
                  ((currentStageIndex + 1) / STAGE_ORDER.length) * 100
                }%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Learning model */}
      <div className="px-6 pt-5">
        <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />

            <div>
              <p className="text-sm font-semibold text-cyan-300">
                Writing pathway
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Imagine → Choose → Build → Read → Extend → Create → Reflect
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* IMAGINE */}
      {stage === 'imagine' && (
        <div className="p-6">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-20 h-20 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center"
            >
              <Lightbulb className="w-9 h-9 text-cyan-400" />
            </motion.div>

            <h4 className="text-xl font-bold text-white mt-5">
              Let's imagine
            </h4>

            <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto leading-relaxed">
              Every story begins with an idea. Think of someone, somewhere,
              and something happening there.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-app-border text-center">
              <User className="w-5 h-5 text-cyan-400 mx-auto" />
              <p className="text-xs text-gray-500 mt-2">Who?</p>
              <p className="text-sm text-white font-semibold mt-1">
                Character
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-app-border text-center">
              <MapPin className="w-5 h-5 text-cyan-400 mx-auto" />
              <p className="text-xs text-gray-500 mt-2">Where?</p>
              <p className="text-sm text-white font-semibold mt-1">
                Place
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-app-border text-center">
              <Zap className="w-5 h-5 text-cyan-400 mx-auto" />
              <p className="text-xs text-gray-500 mt-2">What?</p>
              <p className="text-sm text-white font-semibold mt-1">
                Action
              </p>
            </div>
          </div>

          <button
            onClick={goNext}
            className="w-full mt-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2"
          >
            Start building
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* CHOOSE */}
      {stage === 'choose' && (
        <div className="p-6 space-y-6">
          {/* Character */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-semibold text-white">
                Who is in your story?
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CHARACTERS.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => selectCharacter(item)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    character?.id === item.id
                      ? 'bg-cyan-500/10 border-cyan-400'
                      : 'bg-white/[0.03] border-app-border hover:border-white/20'
                  }`}
                >
                  <span className="text-3xl block mb-2">
                    {item.emoji}
                  </span>

                  <span className="text-xs text-white">
                    {item.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </section>

          {/* Place */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-semibold text-white">
                Where does the story happen?
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PLACES.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => selectPlace(item)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    place?.id === item.id
                      ? 'bg-cyan-500/10 border-cyan-400'
                      : 'bg-white/[0.03] border-app-border hover:border-white/20'
                  }`}
                >
                  <span className="text-3xl block mb-2">
                    {item.emoji}
                  </span>

                  <span className="text-xs text-white">
                    {item.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </section>

          {/* Action */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-semibold text-white">
                What is happening?
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ACTIONS.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => selectAction(item)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    action?.id === item.id
                      ? 'bg-cyan-500/10 border-cyan-400'
                      : 'bg-white/[0.03] border-app-border hover:border-white/20'
                  }`}
                >
                  <span className="text-3xl block mb-2">
                    {item.emoji}
                  </span>

                  <span className="text-xs text-white">
                    {item.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </section>

          <button
            onClick={goNext}
            disabled={!canBuild}
            className="w-full py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Build my sentence
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* BUILD */}
      {stage === 'build' && (
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Pencil className="w-4 h-4 text-cyan-400" />
            <h4 className="font-semibold text-white">
              Build your opening sentence
            </h4>
          </div>

          <p className="text-xs text-gray-500 mb-4">
            Choose how your story begins.
          </p>

          <div className="space-y-2">
            {STORY_OPENINGS.map((item) => (
              <button
                key={item}
                onClick={() => setOpening(item)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  opening === item
                    ? 'bg-cyan-500/10 border-cyan-400'
                    : 'bg-white/[0.03] border-app-border hover:border-white/20'
                }`}
              >
                <span className="text-sm text-white">
                  {item}
                </span>
              </button>
            ))}
          </div>

          {story && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 p-5 rounded-xl bg-white/[0.03] border border-app-border"
            >
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                Your sentence
              </p>

              <p className="text-lg text-white leading-relaxed">
                {story}
              </p>
            </motion.div>
          )}

          <button
            onClick={goNext}
            disabled={!story}
            className="w-full mt-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold disabled:opacity-30 flex items-center justify-center gap-2"
          >
            Read my sentence
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* READ */}
      {stage === 'read' && (
        <div className="p-6">
          <div className="text-center">
            <BookOpen className="w-8 h-8 text-cyan-400 mx-auto" />

            <h4 className="text-xl font-bold text-white mt-3">
              Read your story
            </h4>

            <p className="text-sm text-gray-400 mt-1">
              Read it slowly. Listen to how the words fit together.
            </p>
          </div>

          <div className="mt-6 p-6 rounded-2xl bg-white/[0.03] border border-app-border">
            <AnimatePresence mode="wait">
              <motion.p
                key={story}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl text-white leading-relaxed text-center"
              >
                {story}
              </motion.p>
            </AnimatePresence>
          </div>

          <button
            onClick={speakStory}
            className="w-full mt-4 py-3 rounded-xl border border-app-border text-gray-300 hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
          >
            <Volume2 className="w-4 h-4" />
            Hear the sentence
          </button>

          <div className="mt-5 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
            <p className="text-xs text-cyan-300 font-semibold">
              Writer's check
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Can you find the character, the place and the action in your
              sentence?
            </p>
          </div>

          <button
            onClick={goNext}
            className="w-full mt-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold flex items-center justify-center gap-2"
          >
            Make the story longer
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* EXTEND */}
      {stage === 'extend' && (
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h4 className="font-semibold text-white">
              Add another idea
            </h4>
          </div>

          <p className="text-sm text-gray-400 leading-relaxed">
            A good story can grow. What happened next?
          </p>

          <div className="mt-5 p-4 rounded-xl bg-white/[0.03] border border-app-border">
            <p className="text-xs text-gray-500">Your opening</p>

            <p className="text-sm text-white mt-2 leading-relaxed">
              {story}
            </p>
          </div>

          <textarea
            value={extension}
            onChange={(event) => {
              setExtension(event.target.value);
              setSaved(false);
            }}
            placeholder="Then..."
            className="w-full min-h-[130px] mt-4 rounded-xl bg-white/[0.03] border border-app-border p-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-400 resize-none"
          />

          <div className="mt-4 p-4 rounded-xl bg-white/[0.03] border border-app-border">
            <p className="text-xs text-gray-500 mb-2">
              Story starter ideas
            </p>

            <div className="flex flex-wrap gap-2">
              {[
                'Suddenly...',
                'Then...',
                'After that...',
                'To their surprise...',
              ].map((starter) => (
                <button
                  key={starter}
                  onClick={() =>
                    setExtension((current) =>
                      current
                        ? `${starter} ${current}`
                        : `${starter} `
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-gray-300 hover:bg-white/10"
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={goNext}
            disabled={!extension.trim()}
            className="w-full mt-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold disabled:opacity-30 flex items-center justify-center gap-2"
          >
            Continue writing
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* CREATE */}
      {stage === 'create' && (
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Pencil className="w-4 h-4 text-cyan-400" />
            <h4 className="font-semibold text-white">
              Create your final story
            </h4>
          </div>

          <p className="text-sm text-gray-400 leading-relaxed">
            Now read your complete story. You are the author.
          </p>

          <div className="mt-5 p-6 rounded-2xl bg-white/[0.03] border border-app-border">
            <p className="text-lg text-white leading-relaxed">
              {fullStory}
            </p>
          </div>

          <button
            onClick={speakStory}
            className="w-full mt-4 py-3 rounded-xl border border-app-border text-gray-300 hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
          >
            <Volume2 className="w-4 h-4" />
            Hear my story
          </button>

          <div className="mt-5 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
            <p className="text-xs text-cyan-300 font-semibold">
              Author's checklist
            </p>

            <ul className="mt-2 space-y-1 text-xs text-gray-400">
              <li>✓ My story has a character.</li>
              <li>✓ My story has a place.</li>
              <li>✓ Something happens.</li>
              <li>✓ I added my own idea.</li>
            </ul>
          </div>

          <button
            onClick={goNext}
            className="w-full mt-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold flex items-center justify-center gap-2"
          >
            Reflect on my writing
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* REFLECT */}
      {stage === 'reflect' && (
        <div className="p-6">
          <div className="text-center">
            <Sparkles className="w-8 h-8 text-cyan-400 mx-auto" />

            <h4 className="text-xl font-bold text-white mt-3">
              Think like a writer
            </h4>

            <p className="text-sm text-gray-400 mt-2">
              What part of your story do you like most?
            </p>
          </div>

          <textarea
            value={reflection}
            onChange={(event) => setReflection(event.target.value)}
            placeholder="I like..."
            className="w-full min-h-[120px] mt-6 rounded-xl bg-white/[0.03] border border-app-border p-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-400 resize-none"
          />

          <button
            onClick={goNext}
            className="w-full mt-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold flex items-center justify-center gap-2"
          >
            Finish
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* COMPLETE */}
      {stage === 'complete' && (
        <div className="p-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center"
          >
            <CheckCircle className="w-8 h-8 text-cyan-400" />
          </motion.div>

          <h4 className="text-xl font-bold text-white mt-5">
            You created a story!
          </h4>

          <p className="text-sm text-gray-400 mt-2 leading-relaxed">
            You practised turning ideas into sentences and expanding them
            into a story.
          </p>

          <div className="mt-6 p-5 rounded-2xl bg-white/[0.03] border border-app-border text-left">
            <p className="text-lg text-white leading-relaxed">
              {fullStory}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5 text-left">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-app-border">
              <p className="text-xs text-gray-500">
                Practised
              </p>
              <p className="text-sm text-white font-semibold mt-1">
                Vocabulary
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-app-border">
              <p className="text-xs text-gray-500">
                Practised
              </p>
              <p className="text-sm text-white font-semibold mt-1">
                Sentence building
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-app-border">
              <p className="text-xs text-gray-500">
                Practised
              </p>
              <p className="text-sm text-white font-semibold mt-1">
                Story sequencing
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-app-border">
              <p className="text-xs text-gray-500">
                Practised
              </p>
              <p className="text-sm text-white font-semibold mt-1">
                Creative expression
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full mt-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition-colors"
          >
            {saved ? '✓ Story Saved' : 'Save My Story'}
          </button>

          <button
            onClick={resetActivity}
            className="w-full mt-3 py-3 rounded-xl border border-app-border text-gray-300 hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Write Another Story
          </button>
        </div>
      )}
    </div>
  );
};
