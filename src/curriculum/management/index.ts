import { CurriculumRepository } from './repository';
import { CURRICULUM_DATASET } from './seed';

/** Application-wide curriculum read model. Replace the dataset source when a CMS/API is introduced. */
export const curriculumRepository = new CurriculumRepository(CURRICULUM_DATASET);

export * from './types';
export { stageForAge } from './repository';
