import { CORE_LESSONS } from './data/coreLessons';
import { Lesson, Subject } from './types';
import { buildCoursePath, presentationProfileForAge } from './progression';
import { SCIENCE_CURRICULUM } from './strands/science';

// Merge the new 30-lesson Science curriculum into the main list
export const ALL_LESSONS: Lesson[] = [
  ...CORE_LESSONS,
  ...SCIENCE_CURRICULUM
];
// --- 1. All Lessons (Sorted by Level) ---
export function getAllLessons(): Lesson[] {
  return [...CORE_LESSONS].sort((a, b) => a.title.localeCompare(b.title));
}

// --- 2. Get Lessons by Subject (Sorted by Level) ---
export function getLessonsForSubject(subject: Subject): Lesson[] {
  return CORE_LESSONS.filter((lesson) => lesson.subject === subject);
}

// --- 3. Course Path with Recommendations (Uses Progression Engine) ---
export function getCoursePath(lessons: Lesson[], skills: Record<string, any>) {
  return buildCoursePath(lessons, skills);
}

// --- 4. Get Lesson by ID ---
export function getLessonById(id: string): Lesson | undefined {
  return CORE_LESSONS.find((lesson) => lesson.id === id);
}

// --- 5. Presentation Profile ---
export function getPresentationProfile(age: number) {
  return presentationProfileForAge(age);
}

// --- 6. Deprecated (Kept for backwards compatibility) ---
export function ageToGroup(age: number): string {
  return 'all-levels';
}