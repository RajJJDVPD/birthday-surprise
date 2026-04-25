import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  r: number;
  baseAlpha: number;
  twinkle: number;
  hue: number;
}

interface Comet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

/**
 * Canvas-based 3D parallax star field.
 * - Multi-depth stars with mouse + scroll parallax
 * - Drifting nebula clouds (CSS layer below)
 * - Random comets / shooting stars
 * - Subtle warp toward cursor (gravitational pull illusion)
 */
export function StarField({ density = 1 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const scrollRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = window.innerWidth;
    let h = window.innerHeight;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const starCount = Math.floor((w * h) / 4500) * density;
    const stars: Star[] = Array.from({ length: starCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h * 2.5,
      z: Math.random() * 0.9 + 0.1,
      r: Math.random() * 1.4 + 0.2,
      baseAlpha: Math.random() * 0.6 + 0.3,
      twinkle: Math.random() * Math.PI * 2,
      hue: Math.random() < 0.85 ? 0 : Math.random() < 0.5 ? 280 : 200,
    }));

    const comets: Comet[] = [];
    const spawnComet = () => {
      const fromLeft = Math.random() < 0.5;
      comets.push({
        x: fromLeft ? -50 : w + 50,
        y: Math.random() * h * 0.6,
        vx: (fromLeft ? 1 : -1) * (8 + Math.random() * 6),
        vy: 3 + Math.random() * 3,
        life: 0,
        maxLife: 80 + Math.random() * 40,
      });
    };

    const onMouse = (e: MouseEvent) => {
      mouseRef.current.tx = (e.clientX / w - 0.5) * 2;
      mouseRef.current.ty = (e.clientY / h - 0.5) * 2;
    };
    const onScroll = () => {
      scrollRef.current = window.scrollY;
    };
    const onResize = () => resize();

    window.addEventListener("mousemove", onMouse);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    let frame = 0;
    let raf = 0;
    const cometInterval = window.setInterval(() => {
      if (Math.random() < 0.7) spawnComet();
    }, 2200);

    const render = () => {
      frame++;
      // ease mouse
      mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, w, h);

      // soft cosmic gradient overlay
      const grad = ctx.createRadialGradient(
        w / 2 + mouseRef.current.x * 80,
        h / 2 + mouseRef.current.y * 80,
        0,
        w / 2,
        h / 2,
        Math.max(w, h) * 0.8
      );
      grad.addColorStop(0, "rgba(255, 160, 210, 0.20)");
      grad.addColorStop(0.5, "rgba(180, 70, 140, 0.10)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const scroll = scrollRef.current;

      // stars
      for (const s of stars) {
        const parallaxX = mouseRef.current.x * 30 * s.z;
        const parallaxY = mouseRef.current.y * 30 * s.z + scroll * 0.15 * s.z;
        let x = s.x + parallaxX;
        let y = s.y - parallaxY;
        // wrap
        y = ((y % (h * 2.5)) + h * 2.5) % (h * 2.5);
        if (y > h + 20) continue;

        const tw = Math.sin(frame * 0.04 + s.twinkle) * 0.4 + 0.6;
        const alpha = s.baseAlpha * tw;
        const radius = s.r * (0.7 + s.z * 0.6);

        if (s.hue === 0) {
          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        } else if (s.hue === 280) {
          ctx.fillStyle = `rgba(255,190,225,${alpha})`;
        } else {
          ctx.fillStyle = `rgba(255,215,200,${alpha})`;
        }
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // glow halo for big stars
        if (s.r > 1.1 && s.z > 0.6) {
          ctx.fillStyle = `rgba(255,255,255,${alpha * 0.15})`;
          ctx.beginPath();
          ctx.arc(x, y, radius * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // comets
      for (let i = comets.length - 1; i >= 0; i--) {
        const c = comets[i];
        c.x += c.vx;
        c.y += c.vy;
        c.life++;
        const t = c.life / c.maxLife;
        const alpha = Math.sin(t * Math.PI);
        const tailLen = 180;
        const tx = c.x - (c.vx / Math.hypot(c.vx, c.vy)) * tailLen;
        const ty = c.y - (c.vy / Math.hypot(c.vx, c.vy)) * tailLen;
        const tg = ctx.createLinearGradient(c.x, c.y, tx, ty);
        tg.addColorStop(0, `rgba(255,255,255,${alpha})`);
        tg.addColorStop(0.4, `rgba(200,170,255,${alpha * 0.5})`);
        tg.addColorStop(1, "rgba(255,255,255,0)");
        ctx.strokeStyle = tg;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        // head
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
        if (c.life >= c.maxLife || c.x < -200 || c.x > w + 200) {
          comets.splice(i, 1);
        }
      }

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(cometInterval);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [density]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 cosmos-bg" />
      {/* Drifting nebula glows */}
      <div
        className="absolute -left-32 top-10 h-[60vh] w-[60vw] rounded-full blur-3xl animate-nebula"
        style={{
          background:
            "radial-gradient(circle, oklch(0.72 0.22 350 / 0.55), transparent 70%)",
        }}
      />
      <div
        className="absolute right-0 top-1/3 h-[55vh] w-[55vw] rounded-full blur-3xl animate-nebula"
        style={{
          background:
            "radial-gradient(circle, oklch(0.78 0.18 25 / 0.45), transparent 70%)",
          animationDelay: "4s",
        }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[55vh] w-[60vw] rounded-full blur-3xl animate-nebula"
        style={{
          background:
            "radial-gradient(circle, oklch(0.80 0.16 320 / 0.45), transparent 70%)",
          animationDelay: "8s",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0" />
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, oklch(0.10 0.06 350 / 0.7) 100%)",
        }}
      />
    </div>
  );
}
