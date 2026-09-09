import { useCallback, useEffect } from 'react';

import {
  type SpeechOptions,
  initializeAudio,
  isSpeechSupported,
  pauseSpeech,
  replaySpeech,
  resumeSpeech,
  speak as speakText,
  stopSpeech,
} from '../services/audio';

export interface UseAudioPromptReturn {
  speak: (text: string, options?: SpeechOptions) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  replay: () => void;
  isSupported: () => boolean;
  initialize: () => void;
}

/**
 * React hook for ELP speech prompts.
 *
 * Responsibilities:
 * - Exposes the educational audio service to React components.
 * - Automatically stops speech when the component unmounts.
 * - Keeps service functions stable between renders.
 *
 * The hook does not decide:
 * - when a learner should hear audio
 * - which content should be spoken
 * - whether a learner has mastered a skill
 *
 * Those decisions belong to the learning/content layers.
 */
export const useAudioPrompt = (): UseAudioPromptReturn => {
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const speak = useCallback(
    (text: string, options: SpeechOptions = {}): void => {
      if (!text.trim()) {
        return;
      }

      speakText(text, options);
    },
    [],
  );

  const stop = useCallback((): void => {
    stopSpeech();
  }, []);

  const pause = useCallback((): void => {
    pauseSpeech();
  }, []);

  const resume = useCallback((): void => {
    resumeSpeech();
  }, []);

  const replay = useCallback((): void => {
    replaySpeech();
  }, []);

  const isSupported = useCallback((): boolean => {
    return isSpeechSupported();
  }, []);

  const initialize = useCallback((): void => {
    initializeAudio();
  }, []);

  return {
    speak,
    stop,
    pause,
    resume,
    replay,
    isSupported,
    initialize,
  };
};
