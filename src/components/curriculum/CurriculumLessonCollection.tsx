import React from 'react';
import { ChevronRight, Lock } from 'lucide-react';
import { LessonBundle } from '../../curriculum/management';

interface CurriculumLessonCollectionProps {
  lessons: LessonBundle[];
  onSelect: (lesson: LessonBundle) => void;
  isLocked?: (lesson: LessonBundle) => boolean;
  emptyMessage?: string;
}

/** Reusable lesson list for a subject, stage, unit, assignment, or recommendation. */
export function CurriculumLessonCollection({ lessons, onSelect, isLocked = () => false, emptyMessage = 'No lessons are available yet.' }: CurriculumLessonCollectionProps) {
  if (lessons.length === 0) return <p className="text-sm text-gray-400">{emptyMessage}</p>;
  return (
    <div className="space-y-4">
      {lessons.map((bundle) => {
        const locked = isLocked(bundle);
        return (
          <button
            key={bundle.lesson.id}
            disabled={locked}
            onClick={() => onSelect(bundle)}
            className="w-full rounded-2xl border border-app-border bg-app-card p-4 text-left transition hover:border-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-base font-bold text-white">{bundle.lesson.title}</p>
                <p className="mt-0.5 text-xs text-gray-400">{bundle.lesson.description}</p>
                <span className="mt-2 inline-block rounded border border-indigo-500 px-2 py-0.5 text-[10px] font-bold text-indigo-300">{bundle.subject.title}</span>
              </div>
              {locked ? <Lock className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-5 w-5 text-gray-500" />}
            </div>
          </button>
        );
      })}
    </div>
  );
}
