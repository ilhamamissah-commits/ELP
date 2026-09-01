import { useCallback, useEffect } from 'react';
import { SpeechOptions, initializeAudio, isSpeechSupported, pauseSpeech, replaySpeech, resumeSpeech, speak as speakText, stopSpeech } from '../services/audio';

export const useAudioPrompt = () => {
  useEffect(() => () => stopSpeech(), []);
  const speak = useCallback((text: string, options: SpeechOptions = {}) => speakText(text, options), []);

  return { speak, stop: stopSpeech, pause: pauseSpeech, resume: resumeSpeech, replay: replaySpeech, isSupported: isSpeechSupported, initialize: initializeAudio };
};
