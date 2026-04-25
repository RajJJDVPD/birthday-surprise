import { useEffect, useState } from "react";
import { Countdown } from "./Countdown";

interface HeroProps {
  name: string;
}

export function Hero({ name }: HeroProps) {
  const [mounted, setMounted] = useState(false);
  const [typed, setTyped] = useState("");
  const phrase = "tonight, the universe is yours.";

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(phrase.slice(0, i));
      if (i >= phrase.length) clearInterval(id);
    }, 55);
    return () => clearInterval(id);
  }, [mounted]);

  return (
    <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p
        className="font-script text-2xl text-aurora opacity-0 md:text-3xl"
        style={{ animation: mounted ? "fade-up 1.2s ease-out 0.2s forwards" : undefined }}
      >
        Happy Birthday
      </p>

      <h1
        className="font-display mt-4 text-7xl font-light leading-none tracking-tight text-white opacity-0 sm:text-8xl md:text-[10rem] lg:text-[13rem]"
        style={{ animation: mounted ? "fade-up 1.6s ease-out 0.6s forwards" : undefined }}
      >
        <span className="animate-glow inline-block italic">{name}</span>
      </h1>

      <div
        className="mt-8 flex items-center gap-4 opacity-0"
        style={{ animation: mounted ? "fade-up 1.4s ease-out 1.4s forwards" : undefined }}
      >
        <span className="h-px w-16 bg-gradient-to-r from-transparent to-white/60" />
        <span className="font-script text-lg text-white/80">my whole universe</span>
        <span className="h-px w-16 bg-gradient-to-l from-transparent to-white/60" />
      </div>

      <p
        className="font-display mt-10 min-h-[2em] max-w-xl text-lg italic text-white/80 md:text-xl"
        style={{ opacity: mounted ? 1 : 0, transition: "opacity 1s ease 1.8s" }}
      >
        "{typed}
        <span className="ml-0.5 inline-block w-[2px] animate-pulse bg-white/80 align-middle" style={{ height: "1em" }} />"
      </p>

      {/* Countdown */}
      <div
        className="mt-12 opacity-0"
        style={{ animation: mounted ? "fade-up 1.4s ease-out 2.4s forwards" : undefined }}
      >
        <p className="font-script mb-4 text-sm text-white/50 md:text-base">until your day begins</p>
        <Countdown />
      </div>

      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0"
        style={{ animation: mounted ? "fade-up 1s ease-out 3.2s forwards" : undefined }}
      >
        <div className="flex flex-col items-center gap-2 text-white/50">
          <span className="font-script text-sm">scroll into the stars</span>
          <div className="h-12 w-px animate-pulse bg-gradient-to-b from-white/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}
