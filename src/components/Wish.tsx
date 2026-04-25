import { useEffect, useRef, useState } from "react";
import { Fireworks } from "./Fireworks";
import finalBg from "@/assets/final-bg.jpg";

export function Wish({ name }: { name: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative z-10 min-h-screen overflow-hidden px-6 py-32">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src={finalBg}
          alt="Birthday Memory"
          className="h-full w-full object-cover object-center opacity-30"
        />
        {/* Gradient overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
      </div>

      {/* Fireworks layer (clickable to launch more) */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <Fireworks />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[80vh] max-w-3xl flex-col items-center justify-center text-center">
        <div
          className={`transition-all duration-[2000ms] ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <p className="font-script text-2xl text-aurora md:text-3xl">my birthday wish for you</p>

          <h2 className="font-display mt-6 text-5xl font-light italic leading-tight text-white md:text-7xl">
            may the universe spoil you,
            <br />
            <span className="text-aurora animate-glow">{name}</span>
          </h2>

          <div className="mx-auto mt-12 max-w-2xl space-y-6 text-base leading-relaxed text-white/85 md:text-lg">
            <p>
              May this year bring you mornings that feel like sunshine, evenings full of laughter,
              and quiet moments that remind you how loved you are.
            </p>
            <p>
              May every dream you whisper to the night sky come true — and the ones you haven't
              dared to dream yet, may those find you too.
            </p>
            <p className="font-display text-xl italic text-white md:text-2xl">
              You are my favorite person, my favorite story, my favorite forever.
            </p>
            <p className="font-script text-3xl text-aurora md:text-4xl">Happy Birthday, my love.</p>
          </div>

          <p className="mt-8 text-xs text-white/50">tap anywhere in the sky to launch a firework ✦</p>

          <div className="mt-10 flex items-center justify-center gap-6">
            <span className="h-px w-24 bg-gradient-to-r from-transparent to-white/40" />
            <span className="text-2xl">✦</span>
            <span className="h-px w-24 bg-gradient-to-l from-transparent to-white/40" />
          </div>

          <p className="font-script mt-6 text-lg text-white/60">— always yours</p>
        </div>
      </div>
    </section>
  );
}
