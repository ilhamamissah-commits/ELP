import { useSettingsStore } from '../store/useSettingsStore';

/**
 * Returns the appropriate vocabulary term based on
 * the learner's selected content mode.
 *
 * Islamic Mode is a content/personalization layer.
 * It does not control access to the Islamic Studies academy.
 */
export function getVocabWord(
  englishWord: string,
  arabicWord: string,
): string {
  const { isIslamicMode } = useSettingsStore.getState();

  return isIslamicMode ? arabicWord : englishWord;
}

/**
 * Returns the appropriate lesson title based on
 * the learner's selected content mode.
 */
export function getLessonTitle(
  standardName: string,
  islamicName: string,
): string {
  const { isIslamicMode } = useSettingsStore.getState();

  return isIslamicMode ? islamicName : standardName;
}

/**
 * A single practical-life step.
 */
export interface PracticalLifeStep {
  id: string;
  text: string;
}

/**
 * Returns practical-life lesson steps appropriate to
 * the selected ELP content mode.
 *
 * Standard Mode:
 * General hygiene and practical-life skills.
 *
 * Islamic Mode:
 * Wudu-oriented practical-life learning.
 */
export function getPracticalLifeSteps(): PracticalLifeStep[] {
  const { isIslamicMode } = useSettingsStore.getState();

  if (isIslamicMode) {
    return [
      {
        id: 'wash-hands',
        text: 'Wash hands up to the wrists three times',
      },
      {
        id: 'rinse-mouth',
        text: 'Rinse the mouth three times',
      },
      {
        id: 'wash-face',
        text: 'Wash the face three times',
      },
      {
        id: 'wash-arms',
        text: 'Wash the arms three times',
      },
      {
        id: 'wipe-head-ears',
        text: 'Wipe the head and ears',
      },
      {
        id: 'wash-feet',
        text: 'Wash the feet three times',
      },
    ];
  }

  return [
    {
      id: 'turn-on-tap',
      text: 'Turn on the tap',
    },
    {
      id: 'apply-soap',
      text: 'Apply soap',
    },
    {
      id: 'scrub',
      text: 'Scrub for 20 seconds',
    },
    {
      id: 'rinse',
      text: 'Rinse off',
    },
    {
      id: 'dry',
      text: 'Dry with a towel',
    },
  ];
}

/**
 * Convenience helper for interfaces that need numbered
 * display strings.
 */
export function getNumberedPracticalLifeSteps(): string[] {
  return getPracticalLifeSteps().map(
    (step, index) => `${index + 1}. ${step.text}`,
  );
}

/**
 * Returns whether Islamic Mode is currently enabled.
 */
export function isIslamicContentMode(): boolean {
  return useSettingsStore.getState().isIslamicMode;
}
