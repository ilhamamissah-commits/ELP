import type { AbacusLevelId } from './academy';

export type OrientationStepId =
  | 'welcome'
  | 'frame'
  | 'rod'
  | 'beam'
  | 'heaven'
  | 'earth'
  | 'bead-values'
  | 'make-five'
  | 'make-six'
  | 'make-nine'
  | 'place-value'
  | 'guided-check';

export type OrientationStepKind =
  | 'teach'
  | 'identify'
  | 'guided-action'
  | 'practice';

export interface OrientationStep {
  id: OrientationStepId;
  levelId: AbacusLevelId;
  kind: OrientationStepKind;

  title: string;
  subtitle: string;

  explanation: string;

  instruction?: string;

  /**
   * What part of the Soroban should receive visual emphasis.
   */
  focus:
    | 'all'
    | 'frame'
    | 'rod'
    | 'beam'
    | 'heaven'
    | 'earth'
    | 'value'
    | 'place-value';

  /**
   * Expected Soroban state when the step requires
   * the learner to physically manipulate the beads.
   *
   * `undefined` means the step is explanatory only.
   */
  targetState?: {
    upper: 0 | 1;
    lower: 0 | 1 | 2 | 3 | 4;
  };

  /**
   * Optional numeric value represented on the rod.
   */
  targetValue?: number;

  /**
   * Short child-facing feedback after success.
   */
  successMessage?: string;

  /**
   * Optional hint.
   */
  hint?: string;

  /**
   * Whether the learner must physically manipulate
   * the Soroban before proceeding.
   */
  requiresInteraction: boolean;
}

export const SOROBAN_ORIENTATION_STEPS: readonly OrientationStep[] = [
  {
    id: 'welcome',
    levelId: 'abacus-orientation',
    kind: 'teach',
    title: 'Meet Your Soroban',
    subtitle: 'Your first look at the counting instrument',
    explanation:
      'A Soroban is a special counting tool. Each part has a job, and the beads help us see numbers clearly.',
    focus: 'all',
    successMessage: 'Welcome to your Soroban!',
    requiresInteraction: false,
  },

  {
    id: 'frame',
    levelId: 'abacus-orientation',
    kind: 'teach',
    title: 'The Frame',
    subtitle: 'The frame holds everything together',
    explanation:
      'The outer frame is the strong border around the Soroban. It keeps the rods and beads in place.',
    focus: 'frame',
    requiresInteraction: false,
  },

  {
    id: 'rod',
    levelId: 'abacus-orientation',
    kind: 'teach',
    title: 'The Rod',
    subtitle: 'A rod is a number column',
    explanation:
      'The vertical bars are called rods. Beads move along a rod to show a number.',
    instruction: 'Look at one vertical rod. This is where we build a number.',
    focus: 'rod',
    requiresInteraction: false,
  },

  {
    id: 'beam',
    levelId: 'abacus-orientation',
    kind: 'teach',
    title: 'The Beam',
    subtitle: 'The middle bar separates the beads',
    explanation:
      'The horizontal bar in the middle is called the beam. The Heaven bead is above it, while the Earth beads are below it.',
    focus: 'beam',
    requiresInteraction: false,
  },

  {
    id: 'heaven',
    levelId: 'abacus-orientation',
    kind: 'teach',
    title: 'The Heaven Bead',
    subtitle: 'One bead worth five',
    explanation:
      'There is one bead above the beam. It is called the Heaven bead. When it touches the beam, it represents 5.',
    instruction: 'Move the Heaven bead down until it touches the beam.',
    focus: 'heaven',
    targetState: {
      upper: 1,
      lower: 0,
    },
    targetValue: 5,
    successMessage: 'Excellent! The Heaven bead represents 5.',
    hint: 'The single bead above the beam moves toward the middle.',
    requiresInteraction: true,
  },

  {
    id: 'earth',
    levelId: 'abacus-orientation',
    kind: 'teach',
    title: 'The Earth Beads',
    subtitle: 'Each Earth bead is worth one',
    explanation:
      'Below the beam are four Earth beads. Each Earth bead is worth 1 when it touches the beam.',
    instruction: 'Move one Earth bead up to the beam.',
    focus: 'earth',
    targetState: {
      upper: 0,
      lower: 1,
    },
    targetValue: 1,
    successMessage: 'Great! One Earth bead represents 1.',
    hint: 'Move one of the lower beads upward toward the beam.',
    requiresInteraction: true,
  },

  {
    id: 'bead-values',
    levelId: 'abacus-orientation',
    kind: 'teach',
    title: 'Bead Values',
    subtitle: '5 above, 1 below',
    explanation:
      'Remember the basic rule: the Heaven bead is worth 5, and each Earth bead is worth 1.',
    instruction: 'Try making 4 using only Earth beads.',
    focus: 'value',
    targetState: {
      upper: 0,
      lower: 4,
    },
    targetValue: 4,
    successMessage: 'You made 4 using four Earth beads!',
    hint: 'There are four Earth beads. Each one is worth 1.',
    requiresInteraction: true,
  },

  {
    id: 'make-five',
    levelId: 'abacus-orientation',
    kind: 'guided-action',
    title: 'Make 5',
    subtitle: 'Use the Heaven bead',
    explanation:
      'Five is special on the Soroban. Instead of using five Earth beads, we use the single Heaven bead.',
    instruction: 'Clear the rod, then move the Heaven bead to the beam.',
    focus: 'heaven',
    targetState: {
      upper: 1,
      lower: 0,
    },
    targetValue: 5,
    successMessage: 'Wonderful! You made 5.',
    hint: 'Five is shown by the Heaven bead.',
    requiresInteraction: true,
  },

  {
    id: 'make-six',
    levelId: 'abacus-orientation',
    kind: 'guided-action',
    title: 'Make 6',
    subtitle: 'Five plus one',
    explanation:
      'Six is 5 + 1. Use the Heaven bead for 5 and one Earth bead for 1.',
    instruction: 'Make 6 on the rod.',
    focus: 'value',
    targetState: {
      upper: 1,
      lower: 1,
    },
    targetValue: 6,
    successMessage: 'Excellent! 6 is 5 + 1.',
    hint: 'Start with the Heaven bead for 5, then add one Earth bead.',
    requiresInteraction: true,
  },

  {
    id: 'make-nine',
    levelId: 'abacus-orientation',
    kind: 'guided-action',
    title: 'Make 9',
    subtitle: 'Five plus four',
    explanation:
      'Nine is 5 + 4. Use the Heaven bead and all four Earth beads.',
    instruction: 'Make 9 on the rod.',
    focus: 'value',
    targetState: {
      upper: 1,
      lower: 4,
    },
    targetValue: 9,
    successMessage: 'Fantastic! You made 9.',
    hint: 'Use the Heaven bead and all four Earth beads.',
    requiresInteraction: true,
  },

  {
    id: 'place-value',
    levelId: 'abacus-orientation',
    kind: 'teach',
    title: 'Every Rod Has a Place',
    subtitle: 'Ones, tens and hundreds',
    explanation:
      'A Soroban can show much bigger numbers. The rod on the right represents ones. Moving left, the rods represent tens, hundreds and higher places.',
    instruction:
      'Think of the rightmost rod as the Ones rod. The next rod to the left is the Tens rod.',
    focus: 'place-value',
    requiresInteraction: false,
  },

  {
    id: 'guided-check',
    levelId: 'abacus-orientation',
    kind: 'practice',
    title: 'Show Me 9',
    subtitle: 'Your first Soroban check',
    explanation:
      'Now show that you understand the Heaven and Earth beads.',
    instruction: 'Make 9 on the Soroban.',
    focus: 'value',
    targetState: {
      upper: 1,
      lower: 4,
    },
    targetValue: 9,
    successMessage: 'You understand the basic parts of the Soroban!',
    hint: '9 = 5 + 4.',
    requiresInteraction: true,
  },
] as const;

export const getOrientationStep = (
  stepId: OrientationStepId,
): OrientationStep | undefined =>
  SOROBAN_ORIENTATION_STEPS.find(step => step.id === stepId);

export const getOrientationStepIndex = (
  stepId: OrientationStepId,
): number =>
  SOROBAN_ORIENTATION_STEPS.findIndex(step => step.id === stepId);

export const isOrientationStepComplete = (
  rods: {
    upper: 0 | 1;
    lower: 0 | 1 | 2 | 3 | 4;
  },
  step: OrientationStep,
): boolean => {
  if (!step.requiresInteraction || !step.targetState) {
    return true;
  }

  return (
    rods.upper === step.targetState.upper &&
    rods.lower === step.targetState.lower
  );
};