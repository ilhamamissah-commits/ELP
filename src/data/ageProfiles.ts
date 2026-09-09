export interface AgeProfile {
  age: number;
  label: string;
  description: string;
  developmentalFocus: string[];
}

/**
 * Age is contextual information only.
 *
 * IMPORTANT:
 * ELP does not use age to determine curriculum access,
 * placement, mastery, or progression.
 *
 * The Learning Engine uses demonstrated competency.
 */
export const AGE_PROFILES: readonly AgeProfile[] = [
  {
    age: 2,
    label: 'Explorer',
    description: 'Early exploration through sensory interaction, language and movement.',
    developmentalFocus: [
      'sensory exploration',
      'early communication',
      'movement',
      'object recognition',
      'simple routines',
    ],
  },
  {
    age: 3,
    label: 'Discoverer',
    description: 'Growing vocabulary, recognition, independence and simple relationships.',
    developmentalFocus: [
      'vocabulary',
      'classification',
      'early counting',
      'self-expression',
      'practical life',
    ],
  },
  {
    age: 4,
    label: 'Builder',
    description: 'Developing early reasoning, symbolic understanding and structured play.',
    developmentalFocus: [
      'phonological awareness',
      'number sense',
      'patterns',
      'fine motor skills',
      'simple reasoning',
    ],
  },
  {
    age: 5,
    label: 'Thinker',
    description: 'Developing early literacy, mathematical thinking and explanation.',
    developmentalFocus: [
      'early reading',
      'writing readiness',
      'mathematical reasoning',
      'observation',
      'problem solving',
    ],
  },
  {
    age: 6,
    label: 'Creator',
    description: 'Applying foundational knowledge through language, mathematics and creativity.',
    developmentalFocus: [
      'reading',
      'writing',
      'number operations',
      'creative expression',
      'scientific observation',
    ],
  },
  {
    age: 7,
    label: 'Scholar',
    description: 'Building independent learning habits and connecting ideas across subjects.',
    developmentalFocus: [
      'reading comprehension',
      'mathematical fluency',
      'scientific inquiry',
      'research',
      'communication',
    ],
  },
  {
    age: 8,
    label: 'Analyst',
    description: 'Developing deeper reasoning, comparison, explanation and evidence-based thinking.',
    developmentalFocus: [
      'analysis',
      'problem solving',
      'evidence',
      'independent reading',
      'multi-step reasoning',
    ],
  },
  {
    age: 9,
    label: 'Expert',
    description: 'Applying knowledge independently across increasingly complex contexts.',
    developmentalFocus: [
      'critical thinking',
      'complex problem solving',
      'independent research',
      'extended writing',
      'scientific reasoning',
    ],
  },
  {
    age: 10,
    label: 'Master',
    description: 'Developing advanced independence, transfer and higher-order thinking.',
    developmentalFocus: [
      'synthesis',
      'evaluation',
      'independent projects',
      'advanced reasoning',
      'knowledge transfer',
    ],
  },
] as const;

export function getAgeProfile(age: number): AgeProfile | undefined {
  if (!Number.isFinite(age)) {
    return undefined;
  }

  return AGE_PROFILES.find((profile) => profile.age === Math.floor(age));
}