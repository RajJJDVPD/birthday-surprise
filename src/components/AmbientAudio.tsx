import { useEffect, useRef, useState } from "react";

/**
 * Ambient cosmic music toggle. Generates a soft pad with WebAudio (no asset needed)
 * — slow detuned sines + filtered noise for a celestial soundscape.
 */
export function AmbientAudio() {
  const [on, setOn] = useState(false);
  const [hinted, setHinted] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setHinted(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const start = async () => {
    if (ctxRef.current) return;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;
    master.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 2);
    master.connect(ctx.destination);

    // Soft pad — three detuned sines
    const freqs = [110, 164.81, 220];
    const oscs = freqs.map((f) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0.25;
      // gentle LFO
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.05 + Math.random() * 0.1;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.08;
      lfo.connect(lfoGain).connect(g.gain);
      lfo.start();
      o.connect(g).connect(master);
      o.start();
      return { o, lfo };
    });

    // shimmer high tone
    const shimmer = ctx.createOscillator();
    shimmer.type = "triangle";
    shimmer.frequency.value = 880;
    const shimGain = ctx.createGain();
    shimGain.gain.value = 0.04;
    const shimLfo = ctx.createOscillator();
    shimLfo.frequency.value = 0.2;
    const shimLfoGain = ctx.createGain();
    shimLfoGain.gain.value = 0.03;
    shimLfo.connect(shimLfoGain).connect(shimGain.gain);
    shimLfo.start();
    shimmer.connect(shimGain).connect(master);
    shimmer.start();

    nodesRef.current = {
      stop: () => {
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
        setTimeout(() => {
          oscs.forEach(({ o, lfo }) => { o.stop(); lfo.stop(); });
          shimmer.stop();
          shimLfo.stop();
          ctx.close();
          ctxRef.current = null;
          nodesRef.current = null;
        }, 1100);
      },
    };
  };

  const toggle = async () => {
    setHinted(false);
    if (on) {
      nodesRef.current?.stop();
      setOn(false);
    } else {
      await start();
      setOn(true);
    }
  };

  useEffect(() => () => { nodesRef.current?.stop(); }, []);

  return (
    <button
      onClick={toggle}
      aria-label={on ? "Mute ambient music" : "Play ambient music"}
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
