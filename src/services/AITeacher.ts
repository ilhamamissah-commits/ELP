export type LearnerEmotion =
  | 'happy'
  | 'tired'
  | 'frustrated'
  | 'neutral';

export type LessonTheme =
  | 'calm-mode'
  | 'bright-mode'
  | 'gentle-mode'
  | 'default';

export interface LessonModifiers {
  questionCount: number;
  theme: LessonTheme;
  bonusSticker?: boolean;
  autoHint?: boolean;
}

const AI_PRAISE = [
  'Brilliant!',
  "You're a star!",
  'I knew you could do it!',
  'Wow, so clever!',
  'Amazing work!',
  "You're on fire today!",
] as const;

const AI_ENCOURAGE = [
  'Oops, try again.',
  'I believe in you!',
  "Let's read it once more.",
  'Almost! Try that one again.',
  "Don't worry, everyone makes mistakes!",
  "That was a good try! Let's look at it together.",
] as const;

let currentEmotion: LearnerEmotion = 'neutral';

let lastPraiseIndex = -1;
let lastEncouragementIndex = -1;

/**
 * Selects a feedback message without immediately repeating
 * the previous message.
 */
function selectMessage(
  messages: readonly string[],
  previousIndex: number,
): {
  message: string;
  index: number;
} {
  if (messages.length === 0) {
    return {
      message: '',
      index: -1,
    };
  }

  if (messages.length === 1) {
    return {
      message: messages[0],
      index: 0,
    };
  }

  let index = Math.floor(
    Math.random() * messages.length,
  );

  while (index === previousIndex) {
    index = Math.floor(
      Math.random() * messages.length,
    );
  }

  return {
    message: messages[index],
    index,
  };
}

/**
 * Returns encouraging feedback after an activity attempt.
 */
export function getAIFeedback(
  isCorrect: boolean,
): string {
  if (isCorrect) {
    const result = selectMessage(
      AI_PRAISE,
      lastPraiseIndex,
    );

    lastPraiseIndex = result.index;

    return result.message;
  }

  const result = selectMessage(
    AI_ENCOURAGE,
    lastEncouragementIndex,
  );

  lastEncouragementIndex = result.index;

  return result.message;
}

/**
 * Set the learner's current emotional state.
 *
 * This is intentionally kept as a service-level state for now.
 * It can later be migrated to learner/profile state.
 */
export function setEmotion(
  emotion: LearnerEmotion,
): void {
  currentEmotion = emotion;
}

/**
 * Get the learner's current emotional state.
 */
export function getEmotion(): LearnerEmotion {
  return currentEmotion;
}

/**
 * Convert the learner's current emotional state into
 * presentation/adaptive-learning modifiers.
 *
 * These modifiers should never replace competency,
 * mastery, prerequisite, or placement decisions.
 */
export function getLessonModifiers(): LessonModifiers {
  switch (currentEmotion) {
    case 'tired':
      return {
        questionCount: 3,
        theme: 'calm-mode',
      };

    case 'happy':
      return {
        questionCount: 10,
        theme: 'bright-mode',
        bonusSticker: true,
      };

    case 'frustrated':
      return {
        questionCount: 5,
        theme: 'gentle-mode',
        autoHint: true,
      };

    case 'neutral':
    default:
      return {
        questionCount: 7,
        theme: 'default',
      };
  }
}

/**
 * Reset the temporary emotion state.
 */
export function resetEmotion(): void {
  currentEmotion = 'neutral';
}
