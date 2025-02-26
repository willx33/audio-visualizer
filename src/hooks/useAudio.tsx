import { useState, useEffect, useCallback } from 'react';
import audioContextManager, { AudioContextState, AudioContextConfig } from '../utils/audioContext';

export const useAudio = () => {
  const [audioState, setAudioState] = useState<AudioContextState>(audioContextManager.getState());

  useEffect(() => {
    // Subscribe to audio context updates
    const unsubscribe = audioContextManager.onUpdate((state) => {
      setAudioState(state);
    });
    
    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  const initializeAudio = useCallback(async () => {
    return audioContextManager.initialize();
  }, []);

  const updateConfig = useCallback((config: AudioContextConfig) => {
    audioContextManager.updateAnalyzerConfig(config);
  }, []);

  const cleanupAudio = useCallback(() => {
    audioContextManager.cleanup();
  }, []);

  const getAudioData = useCallback(() => {
    return audioContextManager.getAudioData();
  }, []);

  return {
    audioState,
    initializeAudio,
    updateConfig,
    cleanupAudio,
    getAudioData
  };
};

export default useAudio;