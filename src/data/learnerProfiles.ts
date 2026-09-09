/**
 * Developmental learner profiles for ELP.
 *
 * IMPORTANT:
 * Age is contextual information only.
 * It must never determine curriculum level, lesson access,
 * mastery, placement, or progression.
 */

export type DevelopmentalStage =
  | 'early-explorer'
  | 'early-learner'
  | 'developing-learner'
  | 'independent-learner'
  | 'advanced-learner';

export interface AgeProfile {
  readonly age: number;
  readonly label: string;
  readonly stage: DevelopmentalStage;
  readonly description: string;
  readonly icon: string;
}

export const AGE_PROFILES: readonly AgeProfile[] = [
  {
    age: 2,
    label: 'Explorer',
    stage: 'early-explorer',
    description: 'Explores language, movement, sounds, objects and simple patterns.',
    icon: '🐥',
  },
  {
    age: 3,
    label: 'Discoverer',
    stage: 'early-explorer',
    description: 'Builds vocabulary, recognition, counting and early independence.',
    icon: '🌱',
  },
  {
    age: 4,
    label: 'Builder',
    stage: 'early-learner',
    description: 'Develops early literacy, numeracy, reasoning and practical skills.',
    icon: '🧱',
  },
  {
    age: 5,
    label: 'Thinker',
    stage: 'early-learner',
    description: 'Connects ideas through language, mathematics, exploration and reasoning.',
    icon: '🤔',
  },
  {
    age: 6,
    label: 'Creator',
    stage: 'developing-learner',
    description: 'Applies emerging skills through reading, writing, problem-solving and creativity.',
    icon: '✏️',
  },
  {
    age: 7,
    label: 'Scholar',
    stage: 'developing-learner',
    description: 'Strengthens independent learning across academic domains.',
    icon: '📚',
  },
  {
    age: 8,
    label: 'Analyst',
    stage: 'independent-learner',
    description: 'Develops deeper reasoning, comprehension, investigation and application.',
    icon: '🔍',
  },
  {
    age: 9,
    label: 'Expert',
    stage: 'independent-learner',
    description: 'Applies knowledge independently and tackles increasingly complex challenges.',
    icon: '🎯',
  },
  {
    age: 10,
    label: 'Master',
    stage: 'advanced-learner',
    description: 'Builds advanced primary skills, independence and higher-order thinking.',
    icon: '🏆',
  },
] as const;

export const getAgeProfile = (age: number): AgeProfile | undefined =>
  AGE_PROFILES.find((profile) => profile.age === age);
