import React, { useEffect, useRef, useState } from "react";
import m1 from "@/assets/memory-1.jpg";
import m2 from "@/assets/memory-2.jpg";
import m3 from "@/assets/memory-3.jpg";
import m4 from "@/assets/memory-4.jpg";
import m5 from "@/assets/memory-5.jpg";
import m6 from "@/assets/memory-6.jpg";
import m7 from "@/assets/memory-7.jpg";
import m8 from "@/assets/memory-8.jpg";
import m9 from "@/assets/memory-9.jpg";
import m10 from "@/assets/memory-10.jpg";
import m11 from "@/assets/memory-11.jpg";

const memories = [
  { src: m1, caption: "under our sky", note: "the night the stars learned your name" },
  { src: m2, caption: "the way you laugh", note: "my favorite sound in any galaxy" },
  { src: m3, caption: "every little thing", note: "your hand fits mine like fate" },
  { src: m4, caption: "moonlit you", note: "the moon was jealous" },
  { src: m5, caption: "wishes & us", note: "every shooting star, you" },
  { src: m6, caption: "a quiet forever", note: "this is home" },
  { src: m7, caption: "together always", note: "wherever you are is my favorite place" },
  { src: m8, caption: "those little moments", note: "you make everything magical" },
  { src: m9, caption: "just us", note: "lost in our own perfect world" },
  { src: m10, caption: "your smile", note: "brighter than a thousand suns" },
  { src: m11, caption: "endless love", note: "my heart belongs to you" },
];

function MemoryCard({
  src,
  caption,
  note,
  index,
}: {
  src: string;
  caption: string;
  note: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // 3D magnetic tilt
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = innerRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(1000px) rotateY(${px * 14}deg) rotateX(${-py * 14}deg) translateZ(20px) scale(1.03)`;
    card.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
    card.style.setProperty("--my", `${(py + 0.5) * 100}%`);
  };
  const onLeave = () => {
    const card = innerRef.current;
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateY(0) rotateX(0) translateZ(0) scale(1)";
  };

  const offset = index % 3 === 0 ? "md:translate-y-0" : index % 3 === 1 ? "md:translate-y-16" : "md:translate-y-8";

  return (
    <div
      ref={ref}
      className={`group relative ${offset} transition-all duration-1000`}
      style={{
        transitionDelay: `${(index % 3) * 120}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(60px)",
        perspective: "1200px",
      }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        ref={innerRef}
        className="relative overflow-hidden rounded-2xl transition-transform duration-300 ease-out will-change-transform"
        style={{
          boxShadow:
            "0 40px 100px -20px oklch(0.55 0.22 305 / 0.55), 0 0 0 1px oklch(1 0 0 / 0.06)",
          transformStyle: "preserve-3d",
        }}
      >
        <img
          src={src}
          alt={caption}
          loading="lazy"
          className="h-[420px] w-full object-cover transition-transform duration-[1500ms] group-hover:scale-110 md:h-[520px]"
        />
        {/* Light reflection following cursor */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.25), transparent 40%)",
            mixBlendMode: "overlay",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8" style={{ transform: "translateZ(40px)" }}>
          <p className="font-script text-2xl text-aurora md:text-3xl">{caption}</p>
          <p className="font-display mt-2 text-base italic text-white/85 md:text-lg">{note}</p>
        </div>
        {/* Border glow on hover */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ boxShadow: "inset 0 0 60px oklch(0.55 0.22 305 / 0.5)" }}
        />
      </div>
    </div>
  );
}

export function Gallery() {
  return (
    <section className="relative z-10 px-6 py-32 md:py-48">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 text-center md:mb-28">
          <p className="font-script text-xl text-aurora md:text-2xl">our little universe</p>
          <h2 className="font-display mt-3 text-5xl font-light italic text-white md:text-7xl">
            memories that <span className="text-aurora">glow</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-sm text-white/60 md:text-base">
            Every moment with you is a star I keep in my pocket. Hover to feel them tilt.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-3">
          {memories.map((m, i) => (
            <MemoryCard key={i} {...m} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
