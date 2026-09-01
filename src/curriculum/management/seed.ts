import { CORE_LESSONS } from '../data/coreLessons';
import { CurriculumDataset, CurriculumStage, CurriculumSubject, StageId } from './types';
import { stageForAge } from './repository';

export const CURRICULUM_STAGES: CurriculumStage[] = [
  { id: 'ages-2-4', title: 'Early Foundations', minAge: 2, maxAge: 4, sortOrder: 1 },
  { id: 'ages-5-7', title: 'Developing Learner', minAge: 5, maxAge: 7, sortOrder: 2 },
  { id: 'ages-8-10', title: 'Independent Thinker', minAge: 8, maxAge: 10, sortOrder: 3 }
];

export const CURRICULUM_SUBJECTS: CurriculumSubject[] = [
  { id: 'practical-life', title: 'Montessori Practical Life', framework: 'montessori', description: 'Independence, care, and everyday skills.', sortOrder: 1 },
  { id: 'sensorial', title: 'Montessori Sensorial', framework: 'montessori', description: 'Refined sensory perception and classification.', sortOrder: 2 },
  { id: 'english', title: 'English', framework: 'cross-framework', description: 'Language, reading, writing, and communication.', sortOrder: 3 },
  { id: 'maths', title: 'Mathematics', framework: 'cross-framework', description: 'Number, operations, and mathematical reasoning.', sortOrder: 4 },
  { id: 'science', title: 'Science', framework: 'cambridge-primary', description: 'Scientific enquiry and understanding.', sortOrder: 5 },
  { id: 'abacus', title: 'Abacus', framework: 'advanced-abacus', description: 'Soroban skills and mental calculation.', sortOrder: 6 },
  { id: 'computing', title: 'Computing', framework: 'computing-digital-literacy', description: 'Computational thinking and coding concepts.', sortOrder: 7 },
  { id: 'digital-literacy', title: 'Digital Literacy', framework: 'computing-digital-literacy', description: 'Safe, effective digital participation.', sortOrder: 8 },
  { id: 'global-perspectives', title: 'Cambridge Global Perspectives', framework: 'cambridge-global-perspectives', description: 'Research, reflection, collaboration, and action.', sortOrder: 9 }
];

function ageForGroup(group: string): number {
  return Number(group.split('-')[0]);
}

const unitIdFor = (subjectId: string, stageId: StageId) => `${subjectId}-${stageId}`;
const units = [...new Map(CORE_LESSONS.map((lesson) => {
  const stageId = stageForAge(ageForGroup(lesson.ageGroup));
  const id = unitIdFor(lesson.subject, stageId);
  return [id, { id, subjectId: lesson.subject, stageId, title: `${stageId.replace('ages-', 'Ages ')} ${lesson.subject}`, description: `${lesson.subject} learning sequence`, sortOrder: 1 }];
})).values()];

export const CURRICULUM_DATASET: CurriculumDataset = {
  subjects: CURRICULUM_SUBJECTS,
  stages: CURRICULUM_STAGES,
  units,
  lessons: CORE_LESSONS.map((lesson, index) => ({
    id: lesson.id,
    unitId: unitIdFor(lesson.subject, stageForAge(ageForGroup(lesson.ageGroup))),
    title: lesson.title,
    description: lesson.description,
    skill: lesson.skill,
    difficulty: lesson.difficulty,
    framework: lesson.framework,
    tags: lesson.tags,
    prerequisiteLessonIds: lesson.prerequisites || [],
    sortOrder: index,
    published: true
  })),
  activities: CORE_LESSONS.flatMap((lesson) => lesson.activities.map((activity, index) => ({
    id: activity.id,
    lessonId: lesson.id,
    title: lesson.title,
    type: activity.type,
    rendererId: activity.componentId,
    instructions: activity.instructions,
    successCriteria: activity.successCriteria,
    sortOrder: index
  }))),
  assessments: CORE_LESSONS.map((lesson) => ({
    id: `${lesson.id}-assessment`,
    lessonId: lesson.id,
    title: `${lesson.title} assessment`,
    type: lesson.assessment.type,
    masteryScore: lesson.assessment.masteryScore
  }))
};
