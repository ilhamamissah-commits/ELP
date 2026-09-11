import { useSettingsStore } from '../store/useSettingsStore';

export type SoundKind =
  | 'move'
  | 'correct'
  | 'try-again';

interface SoundConfig {
  frequency: number;
  duration: number;
  type: OscillatorType;
  volume: number;
}

const SOUND_CONFIG: Record<SoundKind, SoundConfig> = {
  move: {
    frequency: 420,
    duration: 0.045,
    type: 'sine',
    volume: 0.04,
  },

  correct: {
    frequency: 660,
    duration: 0.12,
    type: 'triangle',
    volume: 0.07,
  },

  'try-again': {
    frequency: 180,
    duration: 0.12,
    type: 'triangle',
    volume: 0.06,
  },
};

let audioContext: AudioContext | undefined;

/**
 * Lazily creates the shared Web Audio context.
 */
function getAudioContext(): AudioContext | null {
  if (
    typeof window === 'undefined' ||
    !window.AudioContext
  ) {
    return null;
  }

  if (!audioContext) {
    audioContext = new window.AudioContext();
  }

  return audioContext;
}

/**
 * Generate and play one feedback tone.
 */
function playTone(
  context: AudioContext,
  config: SoundConfig,
): void {
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  const startTime = context.currentTime;
  const endTime = startTime + config.duration;

  oscillator.type = config.type;

  oscillator.frequency.setValueAtTime(
    config.frequency,
    startTime,
  );

  /*
   * Smooth attack and release prevent clicking/popping.
   */
  gain.gain.setValueAtTime(0.001, startTime);

  gain.gain.exponentialRampToValueAtTime(
    config.volume,
    startTime + 0.008,
  );

  gain.gain.exponentialRampToValueAtTime(
    0.001,
    endTime,
  );

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start(startTime);
  oscillator.stop(endTime);

  oscillator.addEventListener(
    'ended',
    () => {
      oscillator.disconnect();
      gain.disconnect();
    },
    { once: true },
  );
}

/**
 * Play a short ELP feedback sound.
 *
 * These sounds are generated locally with Web Audio,
 * so they work without shipping audio files.
 */
export function playSoundFeedback(
  kind: SoundKind,
): void {
  if (
    typeof window === 'undefined' ||
    !useSettingsStore.getState().soundEnabled
  ) {
    return;
  }

  const config = SOUND_CONFIG[kind];

  if (!config) {
    return;
  }

  const context = getAudioContext();

  if (!context) {
    return;
  }

  /*
   * A closed AudioContext cannot be resumed.
   * Do not attempt to force it back to life.
   */
  if (context.state === 'closed') {
    return;
  }

  /*
   * Browsers commonly create/suspend AudioContexts until
   * the user interacts with the page.
   */
  if (context.state === 'suspended') {
    void context
      .resume()
      .then(() => {
        playTone(context, config);
      })
      .catch(() => {
        // Browser audio policy prevented playback.
      });

    return;
  }

  playTone(context, config);
}

/**
 * Unlock/resume Web Audio after a genuine user interaction.
 *
 * Example:
 *
 * onClick={() => {
 *   void unlockSoundFeedback();
 * }}
 */
export async function unlockSoundFeedback(): Promise<boolean> {
  const context = getAudioContext();

  if (!context) {
    return false;
  }

  if (context.state === 'closed') {
    return false;
  }

  /*
   * resume() is asynchronous. Once it resolves successfully,
   * the browser has accepted the resume request.
   *
   * We intentionally do not compare the resulting state with
   * "running", avoiding TypeScript DOM typing differences.
   */
  try {
    await context.resume();
    return true;
  } catch {
    return false;
  }
}

/**
 * Dispose of the Web Audio context.
 *
 * Primarily useful for cleanup and testing.
 */
export async function resetSoundFeedback(): Promise<void> {
  if (!audioContext) {
    return;
  }

  const context = audioContext;
  audioContext = undefined;

  try {
    await context.close();
  } catch {
    // Ignore cleanup errors.
  }
}
