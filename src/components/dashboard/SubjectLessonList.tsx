import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Lock,
  ChevronRight,
  Sparkles,
  Trophy,
  Target,
  Volume2,
} from 'lucide-react';
import { Card } from '../UI/Card';
import { useReadAloud } from '../../hooks/useReadAloud';

export interface LessonItem {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  tag: string;
  tagColor: string;

  status: 'complete' | 'available' | 'locked';

  componentId: string;

  recommended?: boolean;
  prerequisiteNote?: string;
  level?: number;
  domain?: string;
  mastery?: number;
}

interface SubjectLessonListProps {
  subjectName: string;
  lessons: LessonItem[];
  onSelectLesson: (lesson: LessonItem) => void;
  onBack: () => void;
  currentLevel?: number;
}

const LEVEL_NAMES: Record<number, string> = {
  1: 'Foundation Explorer',
  2: 'Early Explorer',
  3: 'Confident Learner',
  4: 'Independent Thinker',
  5: 'Primary Scholar',
};

const getLevelName = (level?: number) => {
  if (!level) return undefined;
  return LEVEL_NAMES[level] || `Level ${level}`;
};

export const SubjectLessonList: React.FC<SubjectLessonListProps> = ({
  subjectName,
  lessons,
  onSelectLesson,
  onBack,
  currentLevel = 1,
}) => {
  // ✅ Read Aloud hook INSIDE the component
  const { speak } = useReadAloud();

  // ✅ Read the entire list aloud
  const handleReadAll = () => {
    const lessonNames = lessons.map((l) => l.title).join('. ');
    speak(`${subjectName}. ${lessons.length} lessons available. ${lessonNames}.`);
  };

  const orderedLessons = [...lessons].sort((a, b) => {
    if (Boolean(a.recommended) !== Boolean(b.recommended)) {
      return Number(b.recommended) - Number(a.recommended);
    }
    const statusOrder = { available: 0, complete: 1, locked: 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  const recommendedLessons = orderedLessons.filter(
    (lesson) => lesson.recommended && lesson.status !== 'complete'
  );
  const availableLessons = orderedLessons.filter(
    (lesson) => !lesson.recommended && lesson.status === 'available'
  );
  const completedLessons = orderedLessons.filter(
    (lesson) => lesson.status === 'complete'
  );
  const lockedLessons = orderedLessons.filter(
    (lesson) => lesson.status === 'locked'
  );

  const renderLesson = (lesson: LessonItem, index: number) => {
    const isLocked = lesson.status === 'locked';
    const isComplete = lesson.status === 'complete';
    const isAvailable = lesson.status === 'available';

    const mastery =
      typeof lesson.mastery === 'number'
        ? Math.min(100, Math.max(0, lesson.mastery))
        : undefined;

    // ✅ Handles both opening the lesson and speaking its title
    const handleCardClick = () => {
      if (isLocked) return;
      speak(`${lesson.title}. ${lesson.description}`);
      onSelectLesson(lesson);
    };

    return (
      <motion.div
        key={lesson.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.06 }}
        onClick={handleCardClick}
        role={isLocked ? undefined : 'button'}
        tabIndex={isLocked ? -1 : 0}
        onKeyDown={(event) => {
          if (!isLocked && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            handleCardClick();
          }
        }}
        className={`
          group bg-app-card border rounded-2xl p-4
          flex items-center gap-4 transition-all w-full
          ${
            isLocked
              ? 'border-gray-700/70 opacity-65 cursor-not-allowed'
              : isComplete
              ? 'border-emerald-500/20 hover:border-emerald-500/40 cursor-pointer'
              : lesson.recommended
              ? 'border-emerald-500/40 bg-emerald-500/[0.03] hover:border-emerald-400/60 cursor-pointer'
              : 'border-app-border hover:border-indigo-500/50 cursor-pointer'
          }
        `}
      >
        {/* Status icon */}
        <div
          className={`
            flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center border
            ${
              isComplete
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : lesson.recommended
                ? 'bg-emerald-500/10 border-emerald-400/40'
                : 'bg-[#1a1a1a] border-gray-700'
            }
          `}
        >
          {isComplete && <CheckCircle className="w-6 h-6 text-emerald-400" />}
          {isAvailable && !lesson.recommended && (
            <Target className="w-5 h-5 text-indigo-300" />
          )}
          {isAvailable && lesson.recommended && (
            <Sparkles className="w-5 h-5 text-emerald-300" />
          )}
          {isLocked && <Lock className="w-4 h-4 text-gray-500" />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className="text-white font-bold text-base">
                {lesson.title}
              </h4>
              <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">
                {lesson.description}
              </p>
            </div>

            {lesson.level && (
              <span className="flex-shrink-0 text-[10px] text-gray-500 border border-gray-700 rounded-full px-2 py-0.5">
                L{lesson.level}
              </span>
            )}
          </div>

          {lesson.recommended && !isComplete && (
            <div className="mt-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-300" />
              <span className="text-xs font-bold text-emerald-300">
                Recommended next
              </span>
            </div>
          )}

          {isComplete && (
            <div className="mt-1.5 flex items-center gap-1">
              <Trophy className="w-3 h-3 text-emerald-400" />
              <span className="text-xs text-emerald-300">Completed</span>
              {mastery !== undefined && (
                <span className="text-xs text-gray-500">
                  · {mastery}% mastery
                </span>
              )}
            </div>
          )}

          {lesson.prerequisiteNote && (
            <p
              className={`mt-1 text-xs ${
                isLocked ? 'text-gray-500' : 'text-amber-200'
              }`}
            >
              {lesson.prerequisiteNote}
            </p>
          )}

          {lesson.domain && (
            <p className="mt-1 text-[10px] text-gray-600">{lesson.domain}</p>
          )}

          <div
            className={`
              mt-2 inline-block px-2 py-0.5 rounded border text-[10px] font-bold
              ${lesson.tagColor}
            `}
          >
            {lesson.tag}
          </div>

          {mastery !== undefined && (
            <div className="mt-2 max-w-xs">
              <div className="flex justify-between text-[9px] text-gray-500 mb-1">
                <span>Mastery</span>
                <span>{mastery}%</span>
              </div>
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    mastery >= 80
                      ? 'bg-emerald-400'
                      : mastery >= 50
                      ? 'bg-amber-400'
                      : 'bg-gray-600'
                  }`}
                  style={{ width: `${mastery}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ✅ READ ALOUD BUTTON (only on unlocked lessons) */}
        {!isLocked && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              speak(`${lesson.title}. ${lesson.description}`);
            }}
            className="flex-shrink-0 p-2 rounded-full bg-gray-800 hover:bg-emerald-600 text-gray-400 hover:text-white transition"
            aria-label={`Read ${lesson.title} aloud`}
            title="Read aloud"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        )}

        {/* Arrow */}
        {!isLocked && (
          <ChevronRight
            className={`
              w-5 h-5 flex-shrink-0 transition-transform group-hover:translate-x-0.5
              ${lesson.recommended ? 'text-emerald-400' : 'text-gray-500'}
            `}
          />
        )}
      </motion.div>
    );
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-app-bg relative pt-4">
      {/* Back */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-20 text-gray-400 hover:text-white text-sm flex items-center gap-1 transition"
      >
        ← Subjects
      </button>

      {/* Header */}
      <div className="w-full max-w-lg mx-auto px-4 mt-2 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            {/* ✅ Header title with a Read All button */}
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{subjectName}</h2>

              <button
                type="button"
                onClick={handleReadAll}
                className="p-1.5 rounded-full bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 transition"
                aria-label="Read all lessons aloud"
                title="Read all lessons aloud"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-1">
              Personalized learning pathway
            </p>
          </div>

          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-gray-600">
              Current level
            </div>
            <div className="text-sm font-bold text-emerald-300">
              Level {currentLevel}
            </div>
            <div className="text-[9px] text-gray-600">
              {getLevelName(currentLevel)}
            </div>
          </div>
        </div>
      </div>

      {/* Lessons */}
      <div className="w-full max-w-lg mx-auto px-4 pb-10">
        {recommendedLessons.length > 0 && (
          <section className="mb-7">
            <div className="flex items-center gap-2 mb-3 px-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Current learning
              </p>
            </div>
            <div className="space-y-3">
              {recommendedLessons.map((lesson, index) =>
                renderLesson(lesson, index)
              )}
            </div>
          </section>
        )}

        {availableLessons.length > 0 && (
          <section className="mb-7">
            <div className="flex items-center gap-2 mb-3 px-1">
              <Target className="w-3.5 h-3.5 text-indigo-300" />
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Explore learning
              </p>
            </div>
            <div className="space-y-3">
              {availableLessons.map((lesson, index) =>
                renderLesson(lesson, index + recommendedLessons.length)
              )}
            </div>
          </section>
        )}

        {completedLessons.length > 0 && (
          <section className="mb-7">
            <div className="flex items-center gap-2 mb-3 px-1">
              <CheckCircle className="w-3.5 h-3.5 text-gray-500" />
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Completed
              </p>
            </div>
            <div className="space-y-3">
              {completedLessons.map((lesson, index) =>
                renderLesson(
                  lesson,
                  index + recommendedLessons.length + availableLessons.length
                )
              )}
            </div>
          </section>
        )}

        {lockedLessons.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3 px-1">
              <Lock className="w-3.5 h-3.5 text-gray-600" />
              <p className="text-xs font-bold uppercase tracking-wider text-gray-600">
                Upcoming
              </p>
            </div>
            <div className="space-y-3">
              {lockedLessons.map((lesson, index) =>
                renderLesson(
                  lesson,
                  index +
                    recommendedLessons.length +
                    availableLessons.length +
                    completedLessons.length
                )
              )}
            </div>
          </section>
        )}

        {orderedLessons.length === 0 && (
          <Card className="p-6 text-center">
            <Target className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-gray-300">
              Learning pathway coming soon
            </h4>
            <p className="text-xs text-gray-600 mt-1">
              Lessons for this subject have not been added yet.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};