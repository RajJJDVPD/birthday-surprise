import { useEffect, useRef, useState } from "react";

/**
 * Background music player.
 * Plays from the beginning on load, stops when app is in background, and auto-starts on first interaction if blocked.
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
    audioRef.current = audio;

    // Attempt automatic playback immediately
    audio.play().then(() => {
      setOn(true);
    }).catch(() => {
      // Autoplay blocked by browser, wait for interaction
      const handleFirstInteraction = () => {
        if (audioRef.current && audioRef.current.paused) {
          audioRef.current.play().then(() => {
            setOn(true);
          }).catch((e) => console.error("Autoplay prevented:", e));
        }
        document.removeEventListener("click", handleFirstInteraction);
        document.removeEventListener("touchstart", handleFirstInteraction);
      };

      document.addEventListener("click", handleFirstInteraction);
      document.addEventListener("touchstart", handleFirstInteraction);
    });

    // Pause audio when app is minimized or sent to background (Recent Apps)
    const handleVisibilityChange = () => {
      if (!audioRef.current) return;
      if (document.hidden) {
        audioRef.current.pause();
      } else {
        // Resume if it was turned on
        if (on) {
          audioRef.current.play().catch(() => {});
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimeout(t);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      audio.pause();
      audio.src = "";
    };
  }, [on]); // Added 'on' to dependency array so visibility handler knows current state

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
      onClick={(e) => {
        e.stopPropagation(); // Prevent triggering the document-level interaction twice
        toggle();
      }}
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
