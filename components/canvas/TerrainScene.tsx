'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  baseY: number;
  phase: number;
  speed: number;
  size: number;
  alpha: number;
}

function mountainProfile(nx: number): number {
  // Primary Gaussian peak centered at 0.5
  const centered = (nx - 0.5) * 4;
  const primary = Math.exp(-2.5 * centered * centered);
  // Secondary smaller bumps
  const left = 0.25 * Math.exp(-8 * ((nx - 0.28) ** 2));
  const right = 0.2 * Math.exp(-10 * ((nx - 0.72) ** 2));
  return primary + left + right;
}

export function TerrainScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const PARTICLE_COUNT = 8000;
    const particles: Particle[] = [];

    const buildParticles = (w: number, h: number) => {
      particles.length = 0;
      const cols = 200;
      const perCol = Math.floor(PARTICLE_COUNT / cols);

      for (let c = 0; c < cols; c++) {
        const nx = c / (cols - 1);
        const profileH = mountainProfile(nx);
        const x = nx * w;
        const maxY = h * 0.85;
        const minY = maxY - profileH * h * 0.65;

        for (let j = 0; j < perCol; j++) {
          const t = j / perCol;
          const baseY = minY + t * (maxY - minY);
          particles.push({
            x,
            y: baseY,
            baseY,
            phase: Math.random() * Math.PI * 2,
            speed: 0.4 + Math.random() * 0.6,
            size: 0.5 + Math.random() * 1.0,
            alpha: 0.3 + (1 - t) * 0.5,
          });
        }
      }
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      buildParticles(canvas.width, canvas.height);
    };

    resize();

    let animId: number;
    let time = 0;

    const draw = () => {
      animId = requestAnimationFrame(draw);
      time += 0.012;

      // Fade trail
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        const offset = Math.sin(time * p.speed + p.phase) * 1.4;
        p.y = p.baseY + offset;

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    };

    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full bg-black"
      aria-hidden="true"
    />
  );
}
