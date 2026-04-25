import { useEffect, useRef, useState } from "react";

const milestones = [
  {
    date: "the first hello",
    title: "when the universe aligned",
    text: "I didn't know yet that this conversation would change everything. You smiled, and the world quietly tilted.",
  },
  {
    date: "our first date",
    title: "the night I knew",
    text: "Hours felt like minutes. You told me about your dreams and I started rearranging mine to make room for you.",
  },
  {
    date: "the first 'I love you'",
    title: "three small, infinite words",
    text: "It came out softer than I planned, and you said it back without hesitation. I've replayed that moment a thousand times.",
  },
  {
    date: "the trip we took",
    title: "us, against the world",
    text: "Strange cities, shared headphones, late-night laughter. Anywhere with you is the most beautiful place on earth.",
  },
  {
    date: "every day since",
    title: "a love that just keeps growing",
    text: "Through quiet mornings and loud adventures, you've been my favorite constant. You make ordinary feel sacred.",
  },
  {
    date: "today — your day",
    title: "the universe celebrates you",
    text: "Today the stars line up just for you. I hope this year holds every dream you whisper to the night sky.",
  },
];

function TimelineItem({
  m,
  index,
}: {
  m: (typeof milestones)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const isLeft = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`relative flex w-full items-center ${
        isLeft ? "md:justify-start" : "md:justify-end"
      }`}
    >
      <div className="absolute left-8 top-8 z-10 -translate-x-1/2 md:left-1/2 md:top-1/2 md:-translate-y-1/2">
        <div className="relative">
          <div
            className={`h-5 w-5 rounded-full bg-white transition-all duration-1000 ${
              visible ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
            style={{
              boxShadow:
                "0 0 30px oklch(0.96 0.04 95 / 1), 0 0 60px oklch(0.55 0.22 305 / 0.9), 0 0 90px oklch(0.78 0.16 200 / 0.5)",
            }}
          />
          <div
            className={`absolute inset-0 h-5 w-5 animate-ping rounded-full bg-white/40 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </div>

      <div
        className={`ml-20 w-full transition-all duration-1000 md:ml-0 md:w-[44%] ${
          visible
            ? "translate-x-0 opacity-100"
            : isLeft
            ? "-translate-x-12 opacity-0"
            : "translate-x-12 opacity-0"
        }`}
        style={{ transitionDelay: "200ms" }}
      >
        <div
          className="relative overflow-hidden rounded-2xl border border-white/10 p-7 backdrop-blur-md transition-transform duration-500 hover:-translate-y-1 md:p-9"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.18 0.08 285 / 0.65), oklch(0.10 0.05 275 / 0.45))",
            boxShadow:
              "0 25px 70px -10px oklch(0.08 0.04 270 / 0.7), inset 0 1px 0 oklch(1 0 0 / 0.08)",
          }}
        >
          <div
            className="absolute -right-12 -top-12 h-32 w-32 rounded-full blur-2xl"
            style={{ background: "oklch(0.55 0.22 305 / 0.35)" }}
          />
          <p className="font-script text-aurora text-xl">{m.date}</p>
          <h3 className="font-display mt-2 text-3xl font-light italic text-white md:text-4xl">
            {m.title}
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-white/75 md:text-base">{m.text}</p>
        </div>
      </div>
    </div>
  );
}

export function Timeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const passed = Math.max(0, Math.min(total, vh - rect.top));
      setProgress(passed / total);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10 px-6 py-32 md:py-48">
      <div className="mx-auto max-w-6xl">
        <div className="mb-24 text-center">
          <p className="font-script text-xl text-aurora md:text-2xl">a story written in stars</p>
          <h2 className="font-display mt-3 text-5xl font-light italic text-white md:text-7xl">
            the timeline of <span className="text-aurora">us</span>
          </h2>
        </div>

        <div className="relative">
          {/* Center dim line */}
          <div
            className="absolute left-8 top-0 h-full w-px md:left-1/2 md:-translate-x-1/2"
            style={{
              background:
                "linear-gradient(180deg, transparent, oklch(1 0 0 / 0.1), oklch(1 0 0 / 0.1), transparent)",
            }}
          />
          {/* Animated progress line */}
          <div
            className="absolute left-8 top-0 w-px md:left-1/2 md:-translate-x-1/2"
            style={{
              height: `${Math.min(100, progress * 100)}%`,
              background:
                "linear-gradient(180deg, oklch(0.78 0.16 200 / 0.9), oklch(0.55 0.22 305), oklch(0.78 0.14 15 / 0.9))",
              boxShadow: "0 0 16px oklch(0.55 0.22 305 / 0.7)",
              transition: "height 0.1s linear",
            }}
          />

          <div className="space-y-20 md:space-y-32">
            {milestones.map((m, i) => (
              <TimelineItem key={i} m={m} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
