"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  baseAlpha: number;
  phase: number;
  speed: number;
  vy: number;
}

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) {
      return;
    }
    const context = canvasElement.getContext("2d");
    if (!context) {
      return;
    }

    // 收窄后赋给非空类型常量，保证闭包内类型安全
    const canvas: HTMLCanvasElement = canvasElement;
    const ctx: CanvasRenderingContext2D = context;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let raf = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function initStars() {
      const area = width * height;
      const count = Math.min(240, Math.floor(area / 6000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.2 + 0.3,
        baseAlpha: Math.random() * 0.6 + 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.0006 + 0.0002,
        vy: Math.random() * 0.02 + 0.005,
      }));
    }

    function resize() {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars();
    }

    function draw(timestamp: number) {
      ctx.clearRect(0, 0, width, height);
      for (const star of stars) {
        if (!reduced) {
          star.y += star.vy;
          if (star.y > height) {
            star.y = 0;
            star.x = Math.random() * width;
          }
        }
        const twinkle = reduced
          ? 1
          : 0.5 + 0.5 * Math.sin(timestamp * star.speed * 1000 + star.phase);
        const alpha = star.baseAlpha * twinkle;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(226, 235, 255, ${alpha})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }

    function onVisibilityChange() {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        raf = requestAnimationFrame(draw);
      }
    }

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
