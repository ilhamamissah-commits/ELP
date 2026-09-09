import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Volume2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle,
  BookOpen,
  Star,
} from 'lucide-react';

import { speakArabic } from '../../../services/arabicSpeech';

interface ProphetStory {
  id: string;
  title: string;
  arabicName?: string;
  emoji: string;
  shortIntroduction: string;
  story: string;
  lessons: string[];
  reflection: string;
}

interface ProphetStoriesProps {
  onComplete?: (score: number) => void;
}

/*
 * IMPORTANT:
 * These are introductory educational summaries.
 * Expand each story with carefully reviewed Islamic source material
 * before using this as a comprehensive Islamic Studies curriculum.
 */

const STORIES: ProphetStory[] = [
  {
    id: 'adam',
    title: 'Prophet Adam (AS)',
    arabicName: 'آدم عليه السلام',
    emoji: '🌿',
    shortIntroduction:
      'Adam (AS) was the first human and the first prophet.',
    story:
      'Allah created Adam (AS), taught him knowledge, and honoured him. Adam and his wife were placed in Paradise and were given guidance from Allah. After they made a mistake, they turned back to Allah and sought His forgiveness. Allah accepted their repentance and guided them.',
    lessons: [
      'Allah created and honoured human beings.',
      'Knowledge is a gift from Allah.',
      'Everyone can make mistakes.',
      'We should sincerely repent and return to Allah.',
    ],
    reflection:
      'What should you do when you make a mistake?',
  },

  {
    id: 'nuh',
    title: 'Prophet Nuh (AS)',
    arabicName: 'نوح عليه السلام',
    emoji: '🚢',
    shortIntroduction:
      'Nuh (AS) called his people to worship Allah alone and remained patient.',
    story:
      'Nuh (AS) called his people to worship Allah and leave false gods. He continued teaching them with patience for a very long time. Allah commanded him to build an ark. When the flood came, Nuh (AS) and the believers entered the ark by Allah’s command. The story teaches us about patience, obedience and trust in Allah.',
    lessons: [
      'Be patient when doing what is right.',
      'Worship Allah alone.',
      'Obey Allah even when something is difficult.',
      'Trust Allah.',
    ],
    reflection:
      'How can you show patience when something is difficult?',
  },

  {
    id: 'ibrahim',
    title: 'Prophet Ibrahim (AS)',
    arabicName: 'إبراهيم عليه السلام',
    emoji: '🕋',
    shortIntroduction:
      'Ibrahim (AS) was a great prophet who strongly believed in Allah.',
    story:
      'Ibrahim (AS) called his people away from the worship of idols and toward the worship of Allah alone. He remained firm in his faith even when his people opposed him. Ibrahim (AS) and his son Ismail (AS) were commanded to build the Kaaba. Their story teaches us about faith, obedience and complete trust in Allah.',
    lessons: [
      'Believe firmly in Allah.',
      'Do not follow wrong actions simply because others do them.',
      'Obey Allah.',
      'Trust Allah completely.',
    ],
    reflection:
      'How can you show strong faith in your everyday life?',
  },

  {
    id: 'musa',
    title: 'Prophet Musa (AS)',
    arabicName: 'موسى عليه السلام',
    emoji: '🌊',
    shortIntroduction:
      'Musa (AS) was sent by Allah to call Pharaoh and his people to the truth.',
    story:
      'Allah chose Musa (AS) as a prophet and gave him signs. Musa (AS) called Pharaoh to worship Allah and to stop oppressing the Children of Israel. When Musa (AS) and the believers reached the sea, Allah commanded him to strike it with his staff. Allah made a way through the sea, and Musa (AS) and the believers crossed safely.',
    lessons: [
      'Speak the truth with courage.',
      'Allah helps His servants.',
      'Do not lose hope when facing difficulty.',
      'Trust Allah.',
    ],
    reflection:
      'What can you do when you feel afraid or worried?',
  },

  {
    id: 'isa',
    title: 'Prophet Isa (AS)',
    arabicName: 'عيسى عليه السلام',
    emoji: '✨',
    shortIntroduction:
      'Isa (AS) was a mighty prophet and messenger of Allah.',
    story:
      'Allah sent Isa (AS) as a messenger to the Children of Israel. Allah gave him signs and miracles by His permission. Isa (AS) called people to worship Allah and follow His guidance. His life teaches believers about faith, obedience, mercy and devotion to Allah.',
    lessons: [
      'Worship Allah alone.',
      'Follow the guidance of Allah.',
      'Show mercy and kindness.',
      'Remember that miracles happen only by Allah’s permission.',
    ],
    reflection:
      'How can you show kindness and mercy to others?',
  },

  {
    id: 'muhammad',
    title: 'Prophet Muhammad (ﷺ)',
    arabicName: 'محمد ﷺ',
    emoji: '🌙',
    shortIntroduction:
      'Muhammad (ﷺ) was the final prophet and messenger of Allah.',
    story:
      'Prophet Muhammad (ﷺ) called people to worship Allah alone and taught them the guidance revealed by Allah. He was known for truthfulness, trustworthiness, patience and mercy. The Quran was revealed to him through Jibril (AS). His life provides believers with an example of faith, character, patience and compassion.',
    lessons: [
      'Worship Allah alone.',
      'Be truthful and trustworthy.',
      'Treat people with mercy.',
      'Be patient when facing difficulty.',
      'Follow the guidance of the Quran and Sunnah.',
    ],
    reflection:
      'Which good character can you practice today?',
  },
];

type LearningMode = 'story' | 'listen' | 'reflection';

export const ProphetStories: React.FC<ProphetStoriesProps> = ({
  onComplete,
}) => {
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<LearningMode>('story');

  const [readStories, setReadStories] = useState<string[]>([]);
  const [reflectedStories, setReflectedStories] = useState<string[]>([]);

  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const current = STORIES[index];

  const progressPercentage = useMemo(() => {
    if (!STORIES.length) return 0;

    return Math.round(
      ((index + 1) / STORIES.length) * 100
    );
  }, [index]);

  const completedCount = readStories.length;

  /*
   * Automatically introduce the current story with audio.
   * This uses the existing speech service and does not introduce AI.
   */

  useEffect(() => {
    if (!current || mode !== 'listen' || isComplete) return;

    const timer = window.setTimeout(() => {
      speakStory();
    }, 400);

    return () => window.clearTimeout(timer);
  }, [index, mode, current, isComplete]);

  /*
   * Read story
   */

  const handleReadStory = () => {
    if (!readStories.includes(current.id)) {
      setReadStories(previous => [
        ...previous,
        current.id,
      ]);

      setScore(previous => previous + 10);
    }

    setMode('story');
  };

  /*
   * Listen to the story
   */

  function speakStory() {
    if (!current) return;

    /*
     * Arabic speech service is primarily designed for Arabic.
     * We therefore speak the Arabic name when available.
     * Full English narration can be connected later to a dedicated
     * English TTS service.
     */

    if (current.arabicName) {
      speakArabic(current.arabicName);
    }
  }

  /*
   * Reflection
   */

  const handleReflection = () => {
    if (!reflectedStories.includes(current.id)) {
      setReflectedStories(previous => [
        ...previous,
        current.id,
      ]);

      setScore(previous => previous + 5);
    }

    setMode('reflection');
  };

  /*
   * Next story
   */

  const handleNext = () => {
    if (index < STORIES.length - 1) {
      setIndex(previous => previous + 1);
      setMode('story');
      return;
    }

    setIsComplete(true);
  };

  /*
   * Previous story
   */

  const handlePrevious = () => {
    if (index > 0) {
      setIndex(previous => previous - 1);
      setMode('story');
    }
  };

  /*
   * Finish the module.
   *
   * Protected against duplicate onComplete calls.
   */

  const finishAndMoveUp = () => {
    if (hasFinished) return;

    setHasFinished(true);

    if (onComplete) {
      onComplete(score);
    }
  };

  /*
   * Reset
   */

  const handleReset = () => {
    setIndex(0);
    setMode('story');

    setReadStories([]);
    setReflectedStories([]);

    setScore(0);

    setIsComplete(false);
    setHasFinished(false);
  };

  /*
   * Completion screen
   */

  if (isComplete) {
    return (
      <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-7xl mb-4"
        >
          🌙
        </motion.div>

        <p className="text-2xl font-bold text-emerald-400 mb-2">
          Masha'Allah!
        </p>

        <p className="text-gray-300 mb-6">
          You completed the Prophet Stories lesson.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gray-900 rounded-xl p-4">
            <BookOpen className="w-5 h-5 mx-auto mb-2 text-emerald-400" />

            <div className="text-2xl font-bold text-white">
              {completedCount}
            </div>

            <div className="text-xs text-gray-500">
              Stories Read
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-4">
            <Star className="w-5 h-5 mx-auto mb-2 text-yellow-400" />

            <div className="text-2xl font-bold text-white">
              {score}
            </div>

            <div className="text-xs text-gray-500">
              Learning Score
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-4 mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Lesson Progress</span>
            <span>100%</span>
          </div>

          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              className="h-full bg-emerald-500 rounded-full"
            />
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-4 mb-6 text-left">
          <p className="text-sm font-semibold text-white mb-3">
            What you explored
          </p>

          <ul className="text-xs text-gray-400 space-y-2">
            <li>• Stories of Allah's prophets</li>
            <li>• Faith and obedience</li>
            <li>• Patience and trust in Allah</li>
            <li>• Good character</li>
            <li>• Reflection and personal application</li>
          </ul>
        </div>

        <button
          onClick={handleReset}
          className="w-full px-6 py-3 bg-emerald-600 rounded-xl text-white font-bold hover:bg-emerald-500 mb-3 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Learn Again
        </button>

        <button
          onClick={finishAndMoveUp}
          disabled={hasFinished}
          className="w-full px-6 py-3 bg-indigo-600 rounded-xl text-white font-bold hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {hasFinished
            ? 'Completed'
            : 'Finish & Move Up'}
        </button>
      </div>
    );
  }

  /*
   * Main interface
   */

  return (
    <div className="max-w-md mx-auto bg-app-card p-6 rounded-2xl border border-app-border shadow-xl text-center">
      {/* Header */}

      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-2xl font-bold text-white">
            Prophet Stories
          </h3>

          <p className="text-xs text-gray-500 mt-1">
            Islamic Studies • Stories & Character
          </p>
        </div>

        <button
          onClick={handleReset}
          aria-label="Reset lesson"
          className="p-2 bg-gray-800 rounded-lg text-gray-300 hover:text-white"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <p className="text-gray-400 text-sm mb-5">
        Learn from the stories of Allah's prophets and discover
        the character lessons within them.
      </p>

      {/* Progress */}

      <div className="mb-5">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>
            Story {index + 1} / {STORIES.length}
          </span>

          <span>
            {completedCount} completed
          </span>
        </div>

        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-emerald-500 rounded-full"
            animate={{
              width: `${progressPercentage}%`,
            }}
          />
        </div>
      </div>

      {/* Learning modes */}

      <div className="grid grid-cols-3 gap-2 mb-5">
        <button
          onClick={() => setMode('story')}
          className={`px-2 py-2 rounded-lg text-xs font-semibold ${
            mode === 'story'
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-900 text-gray-400'
          }`}
        >
          Story
        </button>

        <button
          onClick={() => setMode('listen')}
          className={`px-2 py-2 rounded-lg text-xs font-semibold ${
            mode === 'listen'
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-900 text-gray-400'
          }`}
        >
          Listen
        </button>

        <button
          onClick={handleReflection}
          className={`px-2 py-2 rounded-lg text-xs font-semibold ${
            mode === 'reflection'
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-900 text-gray-400'
          }`}
        >
          Reflect
        </button>
      </div>

      {/* Story card */}

      <motion.div
        key={index}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 mb-5"
      >
        <div className="text-6xl mb-3">
          {current.emoji}
        </div>

        <h4 className="text-white font-bold text-xl mb-1">
          {current.title}
        </h4>

        {current.arabicName && (
          <div
            dir="rtl"
            lang="ar"
            className="text-emerald-400 text-lg mb-3"
          >
            {current.arabicName}
          </div>
        )}

        {mode === 'story' && (
          <>
            <p className="text-gray-400 text-sm mb-5">
              {current.shortIntroduction}
            </p>

            <div className="text-left bg-gray-900 rounded-xl p-4">
              <p className="text-gray-300 text-sm leading-7">
                {current.story}
              </p>
            </div>
          </>
        )}

        {mode === 'listen' && (
          <div className="py-5">
            <Volume2 className="w-10 h-10 mx-auto mb-3 text-emerald-400" />

            <p className="text-gray-300 text-sm mb-4">
              Listen to the Arabic name of the Prophet.
            </p>

            <button
              onClick={speakStory}
              className="px-5 py-3 bg-emerald-600 rounded-xl text-white font-bold flex items-center gap-2 mx-auto hover:bg-emerald-500"
            >
              <Volume2 className="w-5 h-5" />
              Hear Name
            </button>
          </div>
        )}

        {mode === 'reflection' && (
          <div className="text-left">
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mb-4">
              <p className="text-xs text-indigo-400 font-semibold mb-2">
                THINK ABOUT IT
              </p>

              <p className="text-gray-200 text-sm leading-6">
                {current.reflection}
              </p>
            </div>

            <p className="text-gray-400 text-xs">
              Think about your answer. There is no need to rush.
              The goal is to connect the lesson to your own actions.
            </p>
          </div>
        )}
      </motion.div>

      {/* Lessons */}

      {mode === 'story' && (
        <div className="text-left bg-gray-900 rounded-xl p-4 mb-5">
          <p className="text-sm font-semibold text-white mb-3">
            Lessons from this story
          </p>

          <ul className="space-y-2">
            {current.lessons.map((lesson, lessonIndex) => (
              <li
                key={`${current.id}-lesson-${lessonIndex}`}
                className="flex gap-2 text-xs text-gray-400"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />

                <span>{lesson}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Read / reflection actions */}

      {mode === 'story' && (
        <button
          onClick={handleReadStory}
          className="w-full px-4 py-3 bg-emerald-600 rounded-xl text-white font-bold mb-4 hover:bg-emerald-500"
        >
          <BookOpen className="w-4 h-4 inline mr-2" />
          Mark Story Read
        </button>
      )}

      {mode === 'reflection' && (
        <button
          onClick={handleReflection}
          className="w-full px-4 py-3 bg-indigo-600 rounded-xl text-white font-bold mb-4 hover:bg-indigo-500"
        >
          <CheckCircle className="w-4 h-4 inline mr-2" />
          Complete Reflection
        </button>
      )}

      {/* Navigation */}

      <div className="flex gap-3">
        <button
          onClick={handlePrevious}
          disabled={index === 0}
          className="px-4 py-3 bg-gray-800 rounded-xl text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous story"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <button
          onClick={handleNext}
          className="flex-1 px-4 py-3 bg-indigo-600 rounded-xl text-white font-bold hover:bg-indigo-500 flex items-center justify-center gap-2"
        >
          {index < STORIES.length - 1
            ? 'Next Story'
            : 'Complete Lesson'}

          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Learn • Listen • Reflect • Practice Good Character
      </p>
    </div>
  );
};
