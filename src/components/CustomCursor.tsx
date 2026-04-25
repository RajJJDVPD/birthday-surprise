import { useEffect, useState } from "react";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
      
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' || 
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button'
      );
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-[9999] flex items-center justify-center transition-all duration-75 ease-out will-change-transform"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%) scale(${isPointer ? 1.3 : 1})`,
      }}
    >
      <div className="relative flex items-center justify-center">
        {/* Outer ambient glow */}
        <div className="absolute inset-0 animate-pulse rounded-full bg-pink-500/40 blur-[12px]" style={{ transform: 'scale(2.5)' }} />
        {/* Inner intense glow */}
        <div className="absolute inset-0 rounded-full bg-pink-400/60 blur-[6px]" style={{ transform: 'scale(1.5)' }} />
        {/* The heart icon */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="relative h-7 w-7 text-pink-300 drop-shadow-[0_0_10px_rgba(244,114,182,1)]"
          style={{ 
            filter: 'drop-shadow(0 0 8px rgba(244,114,182,0.8)) drop-shadow(0 0 16px rgba(244,114,182,0.6))'
          }}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
    </div>
  );
}
