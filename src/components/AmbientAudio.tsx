import { useEffect, useRef, useState } from "react";

/**
 * Ambient background music player.
 * Plays a real audio file and remembers the playback position across page reloads.
 */
export function AmbientAudio() {
  const [on, setOn] = useState(false);
  const [hinted, setHinted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setHinted(true), 1500);
    
    // Initialize audio element
    const audio = new Audio("/music.mp3");
    audio.loop = true;
    
    // Restore previous playback time
    const savedTime = localStorage.getItem("birthday_music_time");
    if (savedTime) {
      audio.currentTime = parseFloat(savedTime);
    }

    // Save time continuously while playing
    const handleTimeUpdate = () => {
      localStorage.setItem("birthday_music_time", audio.currentTime.toString());
    };
    audio.addEventListener("timeupdate", handleTimeUpdate);

    audioRef.current = audio;

    return () => {
      clearTimeout(t);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.pause();
      audio.src = "";
    };
  }, []);

  const toggle = () => {
    setHinted(false);
    if (!audioRef.current) return;

    if (on) {
      audioRef.current.pause();
      setOn(false);
    } else {
      audioRef.current.play().catch((e) => {
        console.error("Audio playback failed:", e);
      });
      setOn(true);
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={on ? "Pause music" : "Play music"}
      className="group fixed right-5 top-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 backdrop-blur-md transition-all hover:scale-110 hover:bg-white/10"
      style={{ boxShadow: "0 0 30px oklch(0.55 0.22 305 / 0.35)" }}
    >
      {hinted && !on && (
        <span className="font-script absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap text-sm text-white/80 animate-pulse">
          turn on the music ✦
        </span>
      )}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={`h-5 w-5 text-white transition-transform ${on ? "animate-pulse" : ""}`}>
        {on ? (
          <>
            <path d="M9 18V6l10-2v12" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="16" cy="16" r="3" />
          </>
        ) : (
          <>
            <path d="M9 18V6l10-2v12" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="16" cy="16" r="3" />
            <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.6" />
          </>
        )}
      </svg>
    </button>
  );
}
