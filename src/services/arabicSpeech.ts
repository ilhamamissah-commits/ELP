export interface ArabicSpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  interrupt?: boolean;
}

export interface SpeechStatus {
  supported: boolean;
  speaking: boolean;
  paused: boolean;
  voiceAvailable: boolean;
}

let arabicVoice: SpeechSynthesisVoice | null = null;
let voicesInitialized = false;

const DEFAULT_RATE = 0.8;
const DEFAULT_PITCH = 1.05;
const DEFAULT_VOLUME = 1;

const isSpeechSupported = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window
  );
};

/**
 * Find the best available Arabic voice.
 *
 * Priority:
 * 1. Arabic voices using Modern Standard Arabic locales
 * 2. Other Arabic voices
 * 3. No voice
 */
const findArabicVoice = (
  voices: SpeechSynthesisVoice[]
): SpeechSynthesisVoice | null => {
  const preferredLocales = [
    'ar',
    'ar-SA',
    'ar-EG',
    'ar-AE',
    'ar-MA',
    'ar-TN',
    'ar-DZ',
  ];

  for (const locale of preferredLocales) {
    const exactMatch = voices.find(
      (voice) =>
        voice.lang.toLowerCase() ===
        locale.toLowerCase()
    );

    if (exactMatch) {
      return exactMatch;
    }
  }

  return (
    voices.find((voice) =>
      voice.lang
        .toLowerCase()
        .startsWith('ar')
    ) ?? null
  );
};

/**
 * Load available system voices.
 *
 * Browser speech voices may load asynchronously,
 * so this function should be called both initially
 * and when voiceschanged fires.
 */
export const loadArabicVoices = (): void => {
  if (!isSpeechSupported()) {
    return;
  }

  const voices =
    window.speechSynthesis.getVoices();

  arabicVoice = findArabicVoice(voices);
  voicesInitialized = true;
};

/**
 * Initialise the speech engine.
 *
 * Safe to call multiple times.
 */
export const initializeArabicSpeech =
  (): void => {
    if (!isSpeechSupported()) {
      return;
    }

    loadArabicVoices();

    window.speechSynthesis.addEventListener(
      'voiceschanged',
      loadArabicVoices
    );
  };

/**
 * Speak Arabic text using the best available
 * Arabic system voice.
 */
export const speakArabic = (
  text: string,
  options: ArabicSpeechOptions = {}
): void => {
  if (!isSpeechSupported()) {
    return;
  }

  const trimmedText = text.trim();

  if (!trimmedText) {
    return;
  }

  const {
    rate = DEFAULT_RATE,
    pitch = DEFAULT_PITCH,
    volume = DEFAULT_VOLUME,
    interrupt = true,
  } = options;

  if (!voicesInitialized) {
    loadArabicVoices();
  }

  if (interrupt) {
    window.speechSynthesis.cancel();
  }

  const utterance =
    new SpeechSynthesisUtterance(
      trimmedText
    );

  /**
   * Arabic is used as the language rather than
   * hard-coding a regional dialect.
   */
  utterance.lang =
    arabicVoice?.lang || 'ar';

  utterance.rate = clamp(
    rate,
    0.1,
    2
  );

  utterance.pitch = clamp(
    pitch,
    0,
    2
  );

  utterance.volume = clamp(
    volume,
    0,
    1
  );

  if (arabicVoice) {
    utterance.voice = arabicVoice;
  }

  window.speechSynthesis.speak(
    utterance
  );
};

/**
 * Stop all current speech.
 */
export const stopArabicSpeech =
  (): void => {
    if (!isSpeechSupported()) {
      return;
    }

    window.speechSynthesis.cancel();
  };

/**
 * Pause current speech.
 */
export const pauseArabicSpeech =
  (): void => {
    if (!isSpeechSupported()) {
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
  };

/**
 * Resume paused speech.
 */
export const resumeArabicSpeech =
  (): void => {
    if (!isSpeechSupported()) {
      return;
    }

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  };

/**
 * Get the current speech engine state.
 */
export const getArabicSpeechStatus =
  (): SpeechStatus => {
    if (!isSpeechSupported()) {
      return {
        supported: false,
        speaking: false,
        paused: false,
        voiceAvailable: false,
      };
    }

    if (!voicesInitialized) {
      loadArabicVoices();
    }

    return {
      supported: true,
      speaking:
        window.speechSynthesis.speaking,
      paused:
        window.speechSynthesis.paused,
      voiceAvailable:
        arabicVoice !== null,
    };
  };

const clamp = (
  value: number,
  min: number,
  max: number
): number => {
  return Math.min(
    max,
    Math.max(min, value)
  );
};
