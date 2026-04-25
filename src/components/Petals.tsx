import { useEffect, useRef } from "react";

/** Floating cosmic petals/sparkles drifting upward — pure canvas, lightweight. */
export function Petals() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    type P = { x: number; y: number; vy: number; vx: number; r: number; rot: number; vr: number; hue: number; alpha: number };
    const particles: P[] = Array.from({ length: 40 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vy: -0.2 - Math.random() * 0.6,
      vx: (Math.random() - 0.5) * 0.4,
      r: 2 + Math.random() * 4,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.02,
      hue: Math.random() < 0.5 ? 305 : 200,
      alpha: 0.3 + Math.random() * 0.5,
    }));

    let raf = 0;
    const render = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx + Math.sin(p.y * 0.01) * 0.3;
        p.y += p.vy;
        p.rot += p.vr;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        const color = p.hue === 305 ? `rgba(220,170,255,${p.alpha})` : `rgba(170,220,255,${p.alpha})`;
        ctx.fillStyle = color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = color;
        // 4-point sparkle
        ctx.beginPath();
        ctx.moveTo(0, -p.r);
        ctx.lineTo(p.r * 0.3, 0);
        ctx.lineTo(0, p.r);
        ctx.lineTo(-p.r * 0.3, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-[5]" />;
}
