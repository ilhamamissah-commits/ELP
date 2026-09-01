import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Lock, ChevronRight } from 'lucide-react';

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
}

interface SubjectLessonListProps {
  subjectName: string;
  lessons: LessonItem[];
  onSelectLesson: (lesson: LessonItem) => void;
  onBack: () => void;
}

export const SubjectLessonList: React.FC<SubjectLessonListProps> = ({ 
  subjectName, 
  lessons, 
  onSelectLesson, 
  onBack 
}) => {
  const orderedLessons = [...lessons].sort((a, b) => Number(b.recommended) - Number(a.recommended));
  return (
    // 1. min-h-screen ensures it takes full height.
    // 2. flex-col ensures we can stack elements vertically.
    // 3. relative allows us to position back button absolutely.
    <div className="w-full min-h-screen flex flex-col items-center bg-app-bg relative pt-4">
      
      {/* ABSOLUTE BACK BUTTON: Sticks to top-left, doesn't take up vertical space */}
      <button 
        onClick={onBack}
        className="absolute top-4 left-4 z-20 text-gray-400 hover:text-white text-sm flex items-center gap-1 transition"
      >
        ← Subjects
      </button>

      {/* TITLE: Centered, sticks near the top */}
      <h2 className="text-xl font-bold text-white mt-2 mb-6">
        {subjectName}
      </h2>

      {/* FLEX-1 SPACER: This invisible div pushes the lesson cards DOWN to the middle, 
          but since we want them at the top, we add a very small margin. */}
      <div className="flex-1 w-full max-w-lg">
        {/* The Lesson Cards: No external padding needed since the spacer handles the flow */}
        <div className="space-y-4 w-full px-4 pb-8">
          {orderedLessons.map((lesson, index) => (
            <React.Fragment key={lesson.id}>
            {index === 0 && lesson.recommended && <p className="px-1 text-xs font-bold uppercase tracking-wider text-emerald-300">Current learning</p>}
            {index > 0 && orderedLessons[index - 1].recommended && <p className="px-1 pt-3 text-xs font-bold uppercase tracking-wider text-indigo-300">Explore levels</p>}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                if (lesson.status !== 'locked') onSelectLesson(lesson);
              }}
              className={`bg-app-card border rounded-2xl p-4 flex items-center gap-4 transition-all w-full
                ${lesson.status === 'locked' ? 'border-gray-700 opacity-70 cursor-not-allowed' : 'border-app-border hover:border-indigo-500/50 cursor-pointer'}
              `}
            >
              {/* Status Icon */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-[#1a1a1a] border border-gray-700">
                {lesson.status === 'complete' && <CheckCircle className="w-6 h-6 text-green-400 fill-green-400/20" />}
                {lesson.status === 'available' && <div className="w-4 h-4 rounded-full border-2 border-white" />}
                {lesson.status === 'locked' && <Lock className="w-4 h-4 text-gray-500" />}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h4 className="text-white font-bold text-base">{lesson.title}</h4>
                <p className="text-gray-400 text-xs mt-0.5">{lesson.description}</p>
                {lesson.recommended && <p className="mt-1 text-xs font-bold text-emerald-300">Recommended next</p>}
                {lesson.prerequisiteNote && <p className="mt-1 text-xs text-amber-200">{lesson.prerequisiteNote}</p>}
                <div className={`mt-2 inline-block px-2 py-0.5 rounded border text-[10px] font-bold ${lesson.tagColor}`}>
                  {lesson.tag}
                </div>
              </div>

              {/* Right Arrow */}
              {lesson.status === 'available' && (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </motion.div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
