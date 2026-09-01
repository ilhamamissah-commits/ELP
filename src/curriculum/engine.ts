import { CORE_LESSONS } from './data/coreLessons';
import { Lesson, Subject } from './types';
import { buildCoursePath, presentationProfileForAge } from './progression';

// --- 1. All Lessons ---
export function getAllLessons(): Lesson[] {
  return [...CORE_LESSONS].sort((a, b) => a.title.localeCompare(b.title));
}

// --- 2. Get Lessons by Subject ---
export function getLessonsForSubject(subject: Subject): Lesson[] {
  return CORE_LESSONS.filter((lesson) => lesson.subject === subject);
}

// --- 3. Course Path with Recommendations ---
export function getCoursePath(lessons: Lesson[], skills: Record<string, any>) {
  return buildCoursePath(lessons, skills);
}

// --- 4. Get Lesson by ID ---
export function getObjectiveById(id: string): Lesson | undefined {
  return CORE_LESSONS.find((lesson) => lesson.id === id);
}

// --- 5. Deprecated: Kept for backwards compatibility ---
export function getObjectivesForAge(age: number, subject?: Subject): Lesson[] {
  // We ignore age now, every child sees all lessons
  return getLessonsForSubject(subject || ('english' as Subject));
}

// --- 6. Presentation Profile ---
export function getPresentationProfile(age: number) {
  return presentationProfileForAge(age);
}

// --- 7. Deprecated ---
export function ageToGroup(age: number): string {
  return 'all-levels';
}