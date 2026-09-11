import { useSettingsStore } from '../store/useSettingsStore';

export interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;

  /**
   * Set only when speech is triggered by an actual
   * user interaction such as tap, click, or keyboard input.
   */
  userInitiated?: boolean;
}

interface SavedSpeech {
  text: string;
  options: SpeechOptions;
}

let voices: SpeechSynthesisVoice[] = [];
let initialized = false;
let interactionUnlocked = false;
let lastSpeech: SavedSpeech | undefined;

const DEFAULT_RATE = 0.8;
const DEFAULT_PITCH = 1.1;
const DEFAULT_VOLUME = 1;
const DEFAULT_LANGUAGE = 'en-US';

const getSynthesis = (): SpeechSynthesis | undefined => {
  if (
    typeof window === 'undefined' ||
    !('speechSynthesis' in window)
  ) {
    return undefined;
  }

  return window.speechSynthesis;
};

const clamp = (
  value: number,
  min: number,
  max: number
): number => {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(max, Math.max(min, value));
};

const normalizeLanguage = (
  language: string
): string => {
  return language.trim().toLowerCase();
};

const refreshVoices = (): void => {
  const engine = getSynthesis();

  if (!engine) {
    voices = [];
    return;
  }

  voices = engine.getVoices();
};

/**
 * Finds the closest available voice for the requested
 * language.
 *
 * Priority:
 * 1. Exact locale match
 * 2. Same base language
 * 3. English fallback
 */
const findVoice = (
  language: string
): SpeechSynthesisVoice | undefined => {
  if (voices.length === 0) {
    return undefined;
  }

  const normalizedLanguage =
    normalizeLanguage(language);

  const exactMatch = voices.find(
    (voice) =>
      normalizeLanguage(voice.lang) ===
      normalizedLanguage
  );

  if (exactMatch) {
    return exactMatch;
  }

  const baseLanguage =
    normalizedLanguage.split('-')[0];

  const languageMatch = voices.find(
    (voice) =>
      normalizeLanguage(voice.lang).split('-')[0] ===
      baseLanguage
  );

  if (languageMatch) {
    return languageMatch;
  }

  return voices.find(
    (voice) =>
      normalizeLanguage(voice.lang).startsWith('en')
  );
};

/**
 * Initialise browser speech synthesis and discover
 * available voices.
 *
 * Voice lists can load asynchronously, particularly
 * on Chrome and Safari.
 */
export function initializeAudio(
  userInitiated = false
): boolean {
  const engine = getSynthesis();

  if (!engine) {
    return false;
  }

  if (userInitiated) {
    interactionUnlocked = true;
  }

  if (!initialized) {
    initialized = true;

    refreshVoices();

    engine.addEventListener(
      'voiceschanged',
      refreshVoices
    );
  }

  return true;
}

export function isSpeechSupported(): boolean {
  return Boolean(getSynthesis());
}

export function isAudioUnlocked(): boolean {
  return interactionUnlocked;
}

export function stopSpeech(): void {
  getSynthesis()?.cancel();
}

export function pauseSpeech(): void {
  getSynthesis()?.pause();
}

export function resumeSpeech(): void {
  getSynthesis()?.resume();
}

/**
 * Speaks text only when:
 *
 * 1. Browser speech synthesis is supported.
 * 2. Sound is enabled in ELP settings.
 * 3. Audio has been unlocked by user interaction.
 *
 * Returns true when speech was successfully queued.
 */
export function speak(
  text: string,
  options: SpeechOptions = {}
): boolean {
  const engine = getSynthesis();

  if (
    !engine ||
    !useSettingsStore.getState().soundEnabled
  ) {
    return false;
  }

  const trimmedText = text.trim();

  if (!trimmedText) {
    return false;
  }

  initializeAudio(
    Boolean(options.userInitiated)
  );

  /**
   * Browsers may reject speech that wasn't initiated
   * after a user gesture.
   */
  if (!interactionUnlocked) {
    return false;
  }

  const language =
    options.lang ?? DEFAULT_LANGUAGE;

  const rate = clamp(
    options.rate ?? DEFAULT_RATE,
    0.1,
    2
  );

  const pitch = clamp(
    options.pitch ?? DEFAULT_PITCH,
    0,
    2
  );

  const volume = clamp(
    options.volume ?? DEFAULT_VOLUME,
    0,
    1
  );

  engine.cancel();

  const utterance =
    new SpeechSynthesisUtterance(
      trimmedText
    );

  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = volume;
  utterance.lang = language;

  const voice = findVoice(language);

  if (voice) {
    utterance.voice = voice;
  }

  /**
   * Store a replayable version without the
   * userInitiated flag. Replay explicitly supplies
   * that flag.
   */
  lastSpeech = {
    text: trimmedText,
    options: {
      ...options,
      rate,
      pitch,
      volume,
      lang: language,
      userInitiated: false,
    },
  };

  /**
   * Resume first because some browsers can retain
   * a paused synthesis state.
   */
  engine.resume();
  engine.speak(utterance);

  return true;
}

/**
 * Replay the most recently spoken content.
 *
 * Replay counts as an explicit user interaction.
 */
export function replaySpeech(): boolean {
  if (!lastSpeech) {
    return false;
  }

  return speak(
    lastSpeech.text,
    {
      ...lastSpeech.options,
      userInitiated: true,
    }
  );
}

/**
 * Reset the speech service state.
 *
 * Useful when leaving the application or during
 * testing.
 */
export function resetAudioState(): void {
  stopSpeech();

  interactionUnlocked = false;
  lastSpeech = undefined;
}