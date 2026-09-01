import type { SkillLog } from '../store/useProgressStore';
import { Lesson, Subject } from './types';

export type PresentationProfile = 'early-explorer' | 'developing-learner' | 'independent-thinker';
export type CourseLevel = 'Foundation' | 'Level 1' | 'Level 2' | 'Level 3' | 'Level 4' | 'Level 5' | 'Level 6' | 'Advanced';

export interface CoursePathItem {
  lesson: Lesson;
  level: CourseLevel;
  recommended: boolean;
  prerequisiteStatus: 'ready' | 'recommended-review';
}

/** 
 * Determines the learning "style" based on age. 
 * (Used for UI presentation like pacing, not for locking content).
 */
export function presentationProfileForAge(age: number): PresentationProfile {
  if (age <= 4) return 'early-explorer';
  if (age <= 7) return 'developing-learner';
  return 'independent-thinker';
}

/** 
 * Extracts the Level from the lesson's tags. 
 */
export function levelForLesson(lesson: Lesson): CourseLevel {
  const tag = lesson.tags.find((value) => /^(Level [1-6]|Foundation|Advanced)$/i.test(value));
  
  if (tag === 'Level 1' || tag === 'Level 2' || tag === 'Level 3' || tag === 'Level 4' || tag === 'Level 5' || tag === 'Level 6' || tag === 'Foundation' || tag === 'Advanced') return tag;
  
  // Fallback logic for Abacus specifically (if no tags are provided)
  if (lesson.subject === 'abacus') {
    if (lesson.id.includes('level-1')) return 'Level 1';
    if (lesson.id.includes('level-2')) return 'Level 2';
    if (lesson.id.includes('level-3')) return 'Level 3';
    if (lesson.id.includes('level-4')) return 'Level 4';
    if (lesson.id.includes('level-5')) return 'Level 5';
    if (lesson.id.includes('mental')) return 'Level 6';
    return 'Advanced';
  }
  
  return lesson.difficulty === 'sensorial' || lesson.difficulty === 'concrete' ? 'Foundation' : 'Advanced';
}

const levelOrder: Record<CourseLevel, number> = { 
  Foundation: 0, 
  'Level 1': 1, 
  'Level 2': 2, 
  'Level 3': 3, 
  'Level 4': 4, 
  'Level 5': 5, 
  'Level 6': 6, 
  Advanced: 7 
};

/**
 * Returns one complete, universally accessible course path. 
 * Recommendations are deterministic and based on evidence/prerequisites; they never lock a lesson.
 */
export function buildCoursePath(lessons: Lesson[], skills: Record<string, SkillLog>): CoursePathItem[] {
  // 1. Sort by Level, then Alphabetically
  const sorted = [...lessons].sort((a, b) => 
    levelOrder[levelForLesson(a)] - levelOrder[levelForLesson(b)] || a.title.localeCompare(b.title)
  );

  // 2. Find the first lesson that has NOT been completed and whose prerequisites HAVE been met.
  const firstReady = sorted.find((lesson) => 
    !skills[lesson.id]?.completed && 
    (lesson.prerequisites || []).every((id) => skills[id]?.completed)
  );

  // 3. Fallback: if no lesson is perfectly ready, pick the first incomplete one.
  const fallback = sorted.find((lesson) => !skills[lesson.id]?.completed) || sorted[0];

  // 4. Build the path with recommended status.
  return sorted.map((lesson) => ({
    lesson,
    level: levelForLesson(lesson),
    recommended: lesson.id === (firstReady || fallback)?.id,
    prerequisiteStatus: (lesson.prerequisites || []).every((id) => skills[id]?.completed) ? 'ready' : 'recommended-review'
  }));
}

/** 
 * Returns the single most important lesson the child should do next.
 */
export function courseRecommendation(lessons: Lesson[], skills: Record<string, SkillLog>) {
  return buildCoursePath(lessons, skills).find((item) => item.recommended);
}

/** 
 * Type Guard: Checks if a string is a valid Subject.
 */
export function isSubject(subject: string): subject is Subject {
  return ['english', 'maths', 'science', 'abacus', 'practical-life', 'sensorial', 'geography', 'art', 'global-perspectives', 'computing', 'digital-literacy'].includes(subject);
}