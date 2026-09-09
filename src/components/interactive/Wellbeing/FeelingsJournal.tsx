import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Heart,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

type MoodId =
  | 'happy'
  | 'sad'
  | 'angry'
  | 'tired'
  | 'worried';

type JournalStage = 'notice' | 'name' | 'reflect' | 'saved';

type Mood = {
  id: MoodId;
  emoji: string;
  label: string;
  description: string;
  prompt: string;
  colorClass: string;
};

const MOODS: Mood[] = [
  {
    id: 'happy',
    emoji: '😊',
    label: 'Happy',
    description: 'You might feel cheerful, excited, or content.',
    prompt: 'What is something that is making you feel happy today?',
    colorClass: 'bg-yellow-500/15 border-yellow-500/50',
  },
  {
    id: 'sad',
    emoji: '😢',
    label: 'Sad',
    description: 'You might feel upset, disappointed, or like you need some comfort.',
    prompt: 'What might help you feel cared for when you are sad?',
    colorClass: 'bg-blue-500/15 border-blue-500/50',
  },
  {
    id: 'angry',
    emoji: '😡',
    label: 'Angry',
    description: 'You might feel frustrated, annoyed, or very upset.',
    prompt: 'What is a safe way you could calm your body when you feel angry?',
    colorClass: 'bg-red-500/15 border-red-500/50',
  },
  {
    id: 'tired',
    emoji: '😴',
    label: 'Tired',
    description: 'Your body or mind might need rest or a quiet moment.',
    prompt: 'What could help your body or mind get some rest?',
    colorClass: 'bg-gray-500/15 border-gray-500/50',
  },
  {
    id: 'worried',
    emoji: '😟',
    label: 'Worried',
    description: 'You might feel nervous, uncertain, or concerned about something.',
    prompt: 'Who could you talk to if something is making you worried?',
    colorClass: 'bg-orange-500/15 border-orange-500/50',
  },
];

const STAGES: JournalStage[] = [
  'notice',
  'name',
  'reflect',
  'saved',
];

const STAGE_LABELS: Record<JournalStage, string> = {
  notice: 'Notice',
  name: 'Name',
  reflect: 'Reflect',
  saved: 'Complete',
};

export const FeelingsJournal: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<MoodId | null>(null);
  const [stage, setStage] = useState<JournalStage>('notice');
  const [reflection, setReflection] = useState('');

  const mood = useMemo(
    () => MOODS.find((item) => item.id === selectedMood) ?? null,
    [selectedMood]
  );

  const stageProgress =
    ((STAGES.indexOf(stage) + 1) / STAGES.length) * 100;

  const selectMood = (moodId: MoodId) => {
    setSelectedMood(moodId);
    setReflection('');
    setStage('name');
  };

  const continueToReflection = () => {
    if (selectedMood !== null) {
      setStage('reflect');
    }
  };

  const saveFeeling = () => {
    if (selectedMood !== null) {
      setStage('saved');
    }
  };

  const resetJournal = () => {
    setSelectedMood(null);
    setReflection('');
    setStage('notice');
  };

  if (stage === 'saved' && mood) {
    return (
      <div className="max-w-2xl mx-auto bg-app-card p-6 md:p-8 rounded-3xl border border-app-border shadow-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>

          <h3 className="text-3xl font-bold text-white mb-2">
            Feeling Recorded
          </h3>

          <p className="text-gray-400 mb-6">
            You noticed and named how you are feeling.
          </p>

          <div className="rounded-2xl bg-black/20 border border-gray-800 p-6 mb-5">
            <div className="text-6xl mb-3">{mood.emoji}</div>

            <p className="text-white text-xl font-bold mb-2">
              {mood.label}
            </p>

            <p className="text-gray-400 text-sm">
              {mood.description}
            </p>
          </div>

          {reflection.trim() && (
            <div className="text-left rounded-2xl bg-indigo-500/10 border border-indigo-500/20 p-5 mb-5">
              <p className="text-xs uppercase tracking-wider text-indigo-300 font-bold mb-2">
                My reflection
              </p>

              <p className="text-gray-300 text-sm leading-relaxed">
                {reflection}
              </p>
            </div>
          )}

          <div className="rounded-2xl bg-pink-500/10 border border-pink-500/20 p-4 mb-6">
            <div className="flex items-start gap-3 text-left">
              <Heart className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />

              <p className="text-pink-200 text-sm leading-relaxed">
                All feelings are okay to notice. You do not have to hide
                your feelings, and you can always talk to a trusted adult
                when you need help.
              </p>
            </div>
          </div>

          <button
            onClick={resetJournal}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors"
          >
            <RotateCcw className="w-4 h-4 inline mr-2" />
            Check In Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-app-card p-5 md:p-7 rounded-3xl border border-app-border shadow-xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center">
              <Heart className="w-5 h-5 text-indigo-400" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white">
                Feelings Journal
              </h3>

              <p className="text-xs text-gray-500">
                Notice • Name • Reflect
              </p>
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-500">
            {STAGE_LABELS[stage]}
          </p>

          <p className="text-sm font-bold text-white">
            {Math.round(stageProgress)}%
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-6">
        <motion.div
          className="h-full bg-indigo-500 rounded-full"
          animate={{ width: `${stageProgress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* NOTICE */}
      {stage === 'notice' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="rounded-2xl bg-indigo-500/10 border border-indigo-500/20 p-5 mb-5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />

              <p className="text-indigo-200 font-bold">
                How are you feeling right now?
              </p>
            </div>

            <p className="text-gray-400 text-sm">
              Take a quiet moment. There is no right or wrong feeling.
              Choose the one that feels closest to how you feel.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {MOODS.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => selectMood(item.id)}
                className="p-3 rounded-2xl border border-gray-700 bg-black/20 hover:border-indigo-500/50 transition-all"
              >
                <span className="text-4xl block mb-2">
                  {item.emoji}
                </span>

                <span className="text-xs font-semibold text-gray-300">
                  {item.label}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* NAME */}
      {stage === 'name' && mood && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div
            className={`rounded-2xl border-2 p-6 text-center mb-5 ${mood.colorClass}`}
          >
            <div className="text-7xl mb-3">
              {mood.emoji}
            </div>

            <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">
              You named it
            </p>

            <h4 className="text-2xl font-bold text-white mb-2">
              {mood.label}
            </h4>

            <p className="text-gray-400 text-sm max-w-md mx-auto">
              {mood.description}
            </p>
          </div>

          <button
            onClick={continueToReflection}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors"
          >
            Think About It
          </button>
        </motion.div>
      )}

      {/* REFLECT */}
      {stage === 'reflect' && mood && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="rounded-2xl bg-indigo-500/10 border border-indigo-500/20 p-5 mb-5">
            <p className="text-xs uppercase tracking-wider text-indigo-300 font-bold mb-2">
              Reflection
            </p>

            <p className="text-white font-semibold leading-relaxed">
              {mood.prompt}
            </p>
          </div>

          <textarea
            value={reflection}
            onChange={(event) => setReflection(event.target.value)}
            placeholder="Write or type your thoughts here..."
            rows={5}
            className="w-full resize-none rounded-2xl border border-gray-700 bg-black/20 text-white placeholder:text-gray-600 p-4 outline-none focus:border-indigo-500 transition-colors mb-4"
          />

          <p className="text-xs text-gray-500 mb-5">
            You can write a few words, a sentence, or leave this blank if
            you would rather just think about it.
          </p>

          <button
            onClick={saveFeeling}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors"
          >
            <CheckCircle className="w-4 h-4 inline mr-2" />
            Save My Check-In
          </button>
        </motion.div>
      )}
    </div>
  );
};
