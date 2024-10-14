import { useState, useCallback, useRef, useEffect } from "react";

export function useSound(soundPath: string) {
  const [audio] = useState(() =>
    typeof Audio !== "undefined" ? new Audio(soundPath) : null,
  );
  const globalAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (globalAudioRef.current) {
        globalAudioRef.current.pause();
        globalAudioRef.current.currentTime = 0;
      }
    };
  }, []);

  const play = useCallback(() => {
    if (audio) {
      if (globalAudioRef.current && globalAudioRef.current !== audio) {
        globalAudioRef.current.pause();
        globalAudioRef.current.currentTime = 0;
      }
      audio.currentTime = 0;
      audio.play();
      globalAudioRef.current = audio;
    }
  }, [audio]);

  return { play };
}
