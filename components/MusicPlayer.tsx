'use client';

import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface Props {
  src: string;
}

export default function MusicPlayer({ src }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [needsInteraction, setNeedsInteraction] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = true;
    audio.volume = 0.4;

    const tryPlay = async () => {
      try {
        audio.muted = false;
        await audio.play();
        setPlaying(true);
        setMuted(false);
      } catch {
        // Unmuted autoplay blocked — try muted
        try {
          audio.muted = true;
          await audio.play();
          setPlaying(true);
          setMuted(true);
          setNeedsInteraction(false);
        } catch {
          // All autoplay blocked — wait for user tap
          setNeedsInteraction(true);
        }
      }
    };

    if (audio.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
      tryPlay();
    } else {
      audio.addEventListener('canplaythrough', tryPlay, { once: true });
      return () => audio.removeEventListener('canplaythrough', tryPlay);
    }
  }, [src]);

  const handleClick = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (needsInteraction || !playing) {
      audio.muted = false;
      setMuted(false);
      try {
        await audio.play();
        setPlaying(true);
        setNeedsInteraction(false);
      } catch {}
      return;
    }

    // If playing muted, unmute
    if (muted) {
      audio.muted = false;
      setMuted(false);
    } else {
      audio.muted = true;
      setMuted(true);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={src} preload="auto" />
      <button
        onClick={handleClick}
        className="fixed bottom-20 right-4 z-50 w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-all shadow-lg"
        title={needsInteraction || !playing ? 'Αναπαραγωγή μουσικής' : muted ? 'Ενεργοποίηση ήχου' : 'Σίγαση'}
      >
        {needsInteraction || !playing ? (
          <Music size={17} />
        ) : muted ? (
          <VolumeX size={17} />
        ) : (
          <Volume2 size={17} />
        )}
      </button>
    </>
  );
}
