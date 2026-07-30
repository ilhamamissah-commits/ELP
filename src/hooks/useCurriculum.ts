import { useMemo } from 'react';
import { useProgressStore } from '../store/useProgressStore';
import { getObjectivesForAge, getObjectiveById } from '../curriculum/engine';

export const useCurriculum = (subject?: string) => {
  const { childAge, skills } = useProgressStore();

  const availableLessons = useMemo(() => {
    // 1. Get all lessons for this age
    const lessons = getObjectivesForAge(childAge, subject as any);
    
    // 2. Filter out lessons that have already been 'mastered' 
    // (Optional logic: If mastered 3 times, don't show it again)
    return lessons.filter(lesson => {
      const progress = skills[lesson.id];
      // If they have attempted it less than 3 times, or score is below 80%, show it.
      return !progress || progress.attempts < 3 || progress.bestScore < 80;
    });
  }, [childAge, subject, skills]);

  const getLessonById = (id: string) => {
    return getObjectiveById(id);
  };

  return { availableLessons, getLessonById };
};