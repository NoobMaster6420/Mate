import { useState, useEffect, useRef } from 'react';

interface BackgroundMusicProps {
  src: string;
  autoPlay?: boolean;
  loop?: boolean;
  volume?: number;
}

export default function BackgroundMusic({ 
  src, 
  autoPlay = true,
  loop = true,
  volume = 0.3
}: BackgroundMusicProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Inicializar audio cuando el componente monta
  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = loop;
    audio.volume = volume;
    audioRef.current = audio;
    
    // Limpieza al desmontar
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [src, loop, volume]);
  
  // Gestionar reproducción/pausa
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (hasInteracted) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, hasInteracted]);
  
  // Autoplay después de interacción
  useEffect(() => {
    if (hasInteracted && autoPlay && audioRef.current) {
      setIsPlaying(true);
      audioRef.current.play().catch(e => console.error("Error playing audio:", e));
    }
  }, [hasInteracted, autoPlay]);
  
  // Detectar interacción del usuario
  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
      }
    };
    
    // Eventos que indican interacción
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [hasInteracted]);
  
  return (
    <button
      onClick={() => setIsPlaying(!isPlaying)}
      aria-label={isPlaying ? "Pausar música de fondo" : "Reproducir música de fondo"}
      className="fixed bottom-5 right-5 w-10 h-10 rounded-full bg-[#151F30] flex items-center justify-center text-cyan-400 hover:bg-[#232B3D] transition-colors z-50"
    >
      {isPlaying ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"/>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
        </svg>
      )}
    </button>
  );
}