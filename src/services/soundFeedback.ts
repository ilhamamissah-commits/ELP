import { useSettingsStore } from '../store/useSettingsStore';

type SoundKind = 'move' | 'correct' | 'try-again';

let context: AudioContext | undefined;

/** Small Web Audio cues keep the activity offline and avoid shipping audio assets. */
export function playSoundFeedback(kind: SoundKind) {
  if (typeof window === 'undefined' || !window.AudioContext || !useSettingsStore.getState().isSoundEnabled) return;
  const audioContext = context || new window.AudioContext();
  context = audioContext;
  const play = () => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const config = kind === 'correct' ? [660, 0.12] : kind === 'try-again' ? [180, 0.12] : [420, 0.045];
    oscillator.frequency.value = config[0];
    oscillator.type = kind === 'move' ? 'sine' : 'triangle';
    gain.gain.setValueAtTime(0.06, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + config[1]);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + config[1]);
  };
  if (audioContext.state === 'suspended') void audioContext.resume().then(play).catch(() => undefined);
  else play();
}
