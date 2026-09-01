import { useSettingsStore } from '../store/useSettingsStore';

export interface SpeechOptions {
  rate?: number;
  pitch?: number;
  lang?: string;
  /** Set only from an actual tap/click/keyboard gesture. */
  userInitiated?: boolean;
}

type SavedSpeech = { text: string; options: SpeechOptions };

let voices: SpeechSynthesisVoice[] = [];
let initialized = false;
let interactionUnlocked = false;
let lastSpeech: SavedSpeech | undefined;

const synthesis = () => typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : undefined;

function refreshVoices() {
  voices = synthesis()?.getVoices() || [];
}

/** Initializes voice discovery once. Voice lists load asynchronously on Chrome/Safari. */
export function initializeAudio(userInitiated = false): boolean {
  const engine = synthesis();
  if (!engine) return false;
  if (userInitiated) interactionUnlocked = true;
  if (!initialized) {
    initialized = true;
    refreshVoices();
    engine.onvoiceschanged = refreshVoices;
  }
  return true;
}

export function isSpeechSupported(): boolean { return Boolean(synthesis()); }
export function isAudioUnlocked(): boolean { return interactionUnlocked; }

export function stopSpeech() { synthesis()?.cancel(); }
export function pauseSpeech() { synthesis()?.pause(); }
export function resumeSpeech() { synthesis()?.resume(); }

/**
 * Speaks only when enabled and after a gesture. This avoids mobile autoplay
 * rejections while retaining an explicit, reliable replay interaction.
 */
export function speak(text: string, options: SpeechOptions = {}): boolean {
  const engine = synthesis();
  if (!engine || !useSettingsStore.getState().isSoundEnabled) return false;
  initializeAudio(Boolean(options.userInitiated));
  if (!interactionUnlocked) return false;

  engine.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = options.rate ?? 0.8;
  utterance.pitch = options.pitch ?? 1.1;
  utterance.lang = options.lang ?? 'en-US';
  const voice = voices.find((candidate) => candidate.lang.toLowerCase().startsWith(utterance.lang.toLowerCase()))
    || voices.find((candidate) => candidate.lang.toLowerCase().startsWith('en'));
  if (voice) utterance.voice = voice;
  lastSpeech = { text, options: { ...options, userInitiated: false } };
  engine.resume();
  engine.speak(utterance);
  return true;
}

export function replaySpeech(): boolean {
  return lastSpeech ? speak(lastSpeech.text, { ...lastSpeech.options, userInitiated: true }) : false;
}
