import { useState, useEffect, useRef, useCallback } from 'react';

export function useSoundtrack(soundtrackUrl: string | null) {
  const [volume, setVolume] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const initAudio = useCallback(() => {
    if (!soundtrackUrl) return;

    console.log('Initializing audio with URL:', soundtrackUrl);
    audioRef.current = new Audio(soundtrackUrl);
    audioRef.current.loop = true;
    audioRef.current.volume = 0;

    audioRef.current.addEventListener('canplaythrough', () => {
      console.log('Audio is ready to play');
      setIsReady(true);
    });

    audioRef.current.addEventListener('error', (e) => {
      console.error('Audio error:', e);
    });

    return () => {
      if (audioRef.current) {
        console.log('Cleaning up audio');
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, [soundtrackUrl]);

  useEffect(() => {
    const cleanup = initAudio();
    return cleanup;
  }, [initAudio]);

  const play = useCallback(() => {
    if (audioRef.current && isReady) {
      console.log('Attempting to play audio');
      audioRef.current.play()
        .then(() => {
          console.log('Audio started playing');
          setIsPlaying(true);
          const fadeInInterval = setInterval(() => {
            setVolume((prevVolume) => {
              const newVolume = Math.min(prevVolume + 0.05, 1);
              if (audioRef.current) {
                audioRef.current.volume = newVolume;
              }
              if (newVolume >= 1) {
                clearInterval(fadeInInterval);
              }
              return newVolume;
            });
          }, 100);
        })
        .catch((error) => {
          console.error('Error playing audio:', error);
        });
    } else {
      console.log('Audio not ready or ref not set');
    }
  }, [isReady]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      console.log('Pausing audio');
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggle = useCallback(() => {
    console.log('Toggling audio playback');
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  return { volume, isPlaying, isReady, play, pause, toggle };
}

