import { useSettingsStore } from '../store/useSettingsStore';

// 1. Vocabulary Swapper
export const getVocabWord = (englishWord: string, arabicWord: string): string => {
  const { isIslamicMode } = useSettingsStore.getState();
  return isIslamicMode ? arabicWord : englishWord;
};

// 2. Lesson Title Swapper
export const getLessonTitle = (standardName: string, islamicName: string): string => {
  const { isIslamicMode } = useSettingsStore.getState();
  return isIslamicMode ? islamicName : standardName;
};

// 3. Practical Life Swapper (Wudu vs Hygiene)
export const getPracticalLifeSteps = (): string[] => {
  const { isIslamicMode } = useSettingsStore.getState();
  if (isIslamicMode) {
    return ['1. Wash hands up to the wrists (3x)', '2. Rinse mouth (3x)', '3. Wash face (3x)', '4. Wash arms (3x)', '5. Wipe head and ears', '6. Wash feet (3x)'];
  }
  return ['1. Turn on tap', '2. Apply soap', '3. Scrub for 20 seconds', '4. Rinse off', '5. Dry with towel'];
};