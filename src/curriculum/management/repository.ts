import { Subject } from '../types';
import { CurriculumDataset, LessonBundle, LessonQuery, ManagedActivity, ManagedLesson, ManagedAssessment, StageId } from './types';

/**
 * In-memory read model over a normalized dataset. It keeps lookup indexes so the
 * same API remains responsive when content grows from dozens to thousands of lessons.
 */
export class CurriculumRepository {
  private readonly subjects = new Map(this.data.subjects.map((subject) => [subject.id, subject]));
  private readonly stages = new Map(this.data.stages.map((stage) => [stage.id, stage]));
  private readonly units = new Map(this.data.units.map((unit) => [unit.id, unit]));
  private readonly lessons = new Map(this.data.lessons.map((lesson) => [lesson.id, lesson]));
  private readonly activitiesByLesson = this.groupBy(this.data.activities, (activity) => activity.lessonId);
  private readonly assessmentByLesson = new Map(this.data.assessments.map((assessment) => [assessment.lessonId, assessment]));
  private readonly lessonIdsByUnit = this.groupBy(this.data.lessons, (lesson) => lesson.unitId);
  private readonly unitIdsBySubjectStage = this.groupBy(this.data.units, (unit) => `${unit.subjectId}:${unit.stageId}`);

  constructor(private readonly data: CurriculumDataset) {}

  getLessonBundle(lessonId: string): LessonBundle | undefined {
    const lesson = this.lessons.get(lessonId);
    if (!lesson) return undefined;
    const unit = this.units.get(lesson.unitId);
    if (!unit) return undefined;
    const subject = this.subjects.get(unit.subjectId);
    const stage = this.stages.get(unit.stageId);
    if (!subject || !stage) return undefined;
    return { lesson, unit, subject, stage, activities: this.activitiesByLesson.get(lesson.id) || [], assessment: this.assessmentByLesson.get(lesson.id) };
  }

  queryLessons(query: LessonQuery = {}): LessonBundle[] {
    let lessonIds: string[];
    if (query.unitId) lessonIds = (this.lessonIdsByUnit.get(query.unitId) || []).map((lesson) => lesson.id);
    else if (query.subjectId && query.stageId) lessonIds = (this.unitIdsBySubjectStage.get(`${query.subjectId}:${query.stageId}`) || []).flatMap((unit) => (this.lessonIdsByUnit.get(unit.id) || []).map((lesson) => lesson.id));
    else lessonIds = [...this.lessons.keys()];

    const offset = query.offset || 0;
    const limit = query.limit ?? Number.POSITIVE_INFINITY;
    return lessonIds
      .map((id) => this.getLessonBundle(id))
      .filter((bundle): bundle is LessonBundle => Boolean(bundle))
      .filter((bundle) => !query.subjectId || bundle.subject.id === query.subjectId)
      .filter((bundle) => !query.stageId || bundle.stage.id === query.stageId)
      .filter((bundle) => !query.publishedOnly || bundle.lesson.published)
      .sort((a, b) => a.unit.sortOrder - b.unit.sortOrder || a.lesson.sortOrder - b.lesson.sortOrder)
      .slice(offset, offset + limit);
  }

  getActivities(lessonId: string): ManagedActivity[] { return this.activitiesByLesson.get(lessonId) || []; }
  getAssessment(lessonId: string): ManagedAssessment | undefined { return this.assessmentByLesson.get(lessonId); }
  getStagesForSubject(subjectId: Subject) { return this.data.stages.filter((stage) => (this.unitIdsBySubjectStage.get(`${subjectId}:${stage.id}`) || []).length > 0); }

  private groupBy<T>(items: T[], getKey: (item: T) => string): Map<string, T[]> {
    return items.reduce((groups, item) => {
      const key = getKey(item);
      groups.set(key, [...(groups.get(key) || []), item]);
      return groups;
    }, new Map<string, T[]>());
  }
}

export function stageForAge(age: number): StageId {
  if (age <= 4) return 'ages-2-4';
  if (age <= 7) return 'ages-5-7';
  return 'ages-8-10';
}
