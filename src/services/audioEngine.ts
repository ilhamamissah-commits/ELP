import { useSettingsStore } from '../store/useSettingsStore';

export interface AudioEngineOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
  /**
   * Set to true only when called directly from a genuine
   * user interaction such as click, tap, or keyboard input.
   */
  userInitiated?: boolean;
}

let audioUnlocked = false;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let voices: SpeechSynthesisVoice[] = [];
let voicesInitialized = false;

/**
 * Used to invalidate previously queued speech sequences.
 *
 * Every new sequence receives a new ID. When an older sequence
 * finishes, it checks whether it is still the active sequence.
 */
let sequenceId = 0;

function getSpeechSynthesis(): SpeechSynthesis | null {
  if (
    typeof window === 'undefined' ||
    !('speechSynthesis' in window)
  ) {
    return null;
  }

  return window.speechSynthesis;
}

function refreshVoices(): void {
  const engine = getSpeechSynthesis();

  if (!engine) {
    voices = [];
    return;
  }

  voices = engine.getVoices();
}

function initializeVoices(): void {
  const engine = getSpeechSynthesis();

  if (!engine || voicesInitialized) {
    return;
  }

  voicesInitialized = true;

  refreshVoices();

  engine.addEventListener('voiceschanged', refreshVoices);
}

function clamp(
  value: number,
  min: number,
  max: number,
): number {
  return Math.min(Math.max(value, min), max);
}

function findBestVoice(
  language: string,
): SpeechSynthesisVoice | undefined {
  if (voices.length === 0) {
    refreshVoices();
  }

  const normalizedLanguage = language.toLowerCase();

  const exactMatch = voices.find(
    (voice) =>
      voice.lang.toLowerCase() === normalizedLanguage,
  );

  if (exactMatch) {
    return exactMatch;
  }

  const baseLanguage = normalizedLanguage.split('-')[0];

  return voices.find(
    (voice) =>
      voice.lang.toLowerCase().split('-')[0] === baseLanguage,
  );
}

/**
 * Initialize the speech engine.
 *
 * This does NOT guarantee that browser autoplay restrictions
 * are bypassed. The browser decides whether speech is allowed.
 */
export function initializeAudio(
  userInitiated = false,
): boolean {
  const engine = getSpeechSynthesis();

  if (!engine) {
    return false;
  }

  initializeVoices();

  if (userInitiated) {
    audioUnlocked = true;
  }

  return true;
}

/**
 * Prime speech synthesis after a genuine user interaction.
 *
 * Call this from a button/tap handler such as:
 *
 * onClick={() => unlockAudio()}
 */
export function unlockAudio(): boolean {
  const engine = getSpeechSynthesis();

  if (!engine) {
    return false;
  }

  initializeAudio(true);

  if (audioUnlocked) {
    return true;
  }

  try {
    const silentUtterance =
      new SpeechSynthesisUtterance('');

    silentUtterance.volume = 0;
    silentUtterance.rate = 10;

    engine.speak(silentUtterance);

    audioUnlocked = true;

    return true;
  } catch (error) {
    console.warn(
      'ELP audio could not be unlocked.',
      error,
    );

    return false;
  }
}

/**
 * Whether speech synthesis is supported by the browser.
 */
export function isAudioSupported(): boolean {
  return getSpeechSynthesis() !== null;
}

/**
 * Whether the ELP speech engine has been initialized
 * through a user interaction.
 */
export function isAudioUnlocked(): boolean {
  return audioUnlocked;
}

/**
 * Speak one piece of text.
 */
export function speakWord(
  text: string,
  options: AudioEngineOptions = {},
): boolean {
  const engine = getSpeechSynthesis();

  if (!engine) {
    console.warn(
      'Speech Synthesis is not supported by this browser.',
    );

    return false;
  }

  if (!useSettingsStore.getState().soundEnabled) {
    return false;
  }

  const cleanText = text.trim();

  if (!cleanText) {
    return false;
  }

  initializeAudio(Boolean(options.userInitiated));

  /*
   * If the browser has not been unlocked through a user
   * interaction, don't attempt to force speech.
   */
  if (!audioUnlocked && !options.userInitiated) {
    return false;
  }

  /*
   * A new individual utterance invalidates any previous
   * sequence.
   */
  sequenceId += 1;

  try {
    engine.cancel();
  } catch {
    // Some browsers may throw while speech is being cancelled.
  }

  const utterance =
    new SpeechSynthesisUtterance(cleanText);

  const language = options.lang ?? 'en-US';

  utterance.rate = clamp(
    options.rate ?? 0.8,
    0.1,
    10,
  );

  utterance.pitch = clamp(
    options.pitch ?? 1.2,
    0,
    2,
  );

  utterance.volume = clamp(
    options.volume ?? 1,
    0,
    1,
  );

  utterance.lang = language;

  const voice = findBestVoice(language);

  if (voice) {
    utterance.voice = voice;
  }

  utterance.onerror = (event) => {
    console.warn(
      'ELP speech error:',
      event.error,
    );

    if (currentUtterance === utterance) {
      currentUtterance = null;
    }
  };

  utterance.onend = () => {
    if (currentUtterance === utterance) {
      currentUtterance = null;
    }
  };

  currentUtterance = utterance;

  try {
    engine.resume();
    engine.speak(utterance);

    return true;
  } catch (error) {
    console.warn(
      'ELP speech could not be started.',
      error,
    );

    currentUtterance = null;

    return false;
  }
}

/**
 * Speak multiple items sequentially.
 *
 * Unlike setTimeout-based implementations, the next item
 * begins only after the previous utterance actually finishes.
 */
export function speakSequence(
  words: string[],
  options: AudioEngineOptions = {},
): boolean {
  const items = words
    .map((word) => word.trim())
    .filter(Boolean);

  if (items.length === 0) {
    return false;
  }

  const engine = getSpeechSynthesis();

  if (!engine) {
    return false;
  }

  if (!useSettingsStore.getState().soundEnabled) {
    return false;
  }

  initializeAudio(Boolean(options.userInitiated));

  if (!audioUnlocked && !options.userInitiated) {
    return false;
  }

  const thisSequenceId = ++sequenceId;

  try {
    engine.cancel();
  } catch {
    // Ignore cancellation errors.
  }

  let index = 0;

  const speakNext = (): void => {
    if (thisSequenceId !== sequenceId) {
      return;
    }

    if (index >= items.length) {
      currentUtterance = null;
      return;
    }

    const text = items[index];
    index += 1;

    const utterance =
      new SpeechSynthesisUtterance(text);

    const language = options.lang ?? 'en-US';

    utterance.rate = clamp(
      options.rate ?? 0.8,
      0.1,
      10,
    );

    utterance.pitch = clamp(
      options.pitch ?? 1.2,
      0,
      2,
    );

    utterance.volume = clamp(
      options.volume ?? 1,
      0,
      1,
    );

    utterance.lang = language;

    const voice = findBestVoice(language);

    if (voice) {
      utterance.voice = voice;
    }

    utterance.onend = () => {
      if (thisSequenceId !== sequenceId) {
        return;
      }

      currentUtterance = null;
      speakNext();
    };

    utterance.onerror = (event) => {
      console.warn(
        'ELP speech sequence error:',
        event.error,
      );

      if (thisSequenceId !== sequenceId) {
        return;
      }

      currentUtterance = null;
    };

    currentUtterance = utterance;

    try {
      engine.resume();
      engine.speak(utterance);
    } catch (error) {
      console.warn(
        'ELP speech sequence could not continue.',
        error,
      );

      currentUtterance = null;
    }
  };

  speakNext();

  return true;
}

/**
 * Stop all speech immediately.
 */
export function stopSpeech(): void {
  sequenceId += 1;

  const engine = getSpeechSynthesis();

  if (!engine) {
    return;
  }

  try {
    engine.cancel();
  } catch {
    // Ignore cancellation errors.
  }

  currentUtterance = null;
}

/**
 * Pause current speech.
 */
export function pauseSpeech(): void {
  getSpeechSynthesis()?.pause();
}

/**
 * Resume paused speech.
 */
export function resumeSpeech(): void {
  const engine = getSpeechSynthesis();

  if (!engine || !audioUnlocked) {
    return;
  }

  engine.resume();
}

/**
 * Reset the local audio-engine state.
 *
 * Useful when leaving the learning session or during testing.
 */
export function resetAudio(): void {
  stopSpeech();

  audioUnlocked = false;
  currentUtterance = null;
}
