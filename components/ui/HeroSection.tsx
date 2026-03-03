'use client';

import Link from 'next/link';
import { useState } from 'react';
import { EntityScene, type ColorMode } from '@/components/canvas/EntityScene';

const COLOR_OPTIONS: { mode: ColorMode; label: string; swatch: string }[] = [
  { mode: 'purple', label: 'PURPLE', swatch: '#b89aff' },
  { mode: 'white',  label: 'WHITE',  swatch: '#ffffff' },
  { mode: 'blue',   label: 'BLUE',   swatch: '#64c8ff' },
];

export function HeroSection() {
  const [mode, setMode] = useState<ColorMode>('purple');

  return (
    <section className="relative h-screen w-full flex bg-black overflow-hidden">
      {/* Left — text */}
      <div className="relative z-10 flex flex-col justify-center px-12 md:px-16 lg:px-24 w-full md:w-1/2 shrink-0">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-none tracking-tight mb-3">
          INA CHUN
        </h1>
        <p className="text-white/50 text-sm leading-relaxed max-w-xs mb-10">
          Hi, I&apos;m Ina, a software engineer specializing in systems,
          machine learning, and high-performance applications.
        </p>
        <Link
          href="/projects"
          className="self-start border border-white/40 text-white/80 text-xs tracking-[0.2em] uppercase px-6 py-3 hover:border-white hover:text-white transition-colors"
        >
          View My Work
        </Link>
      </div>

      {/* Right — animation */}
      <div className="absolute inset-y-0 right-0 w-full md:w-3/5">
        <EntityScene mode={mode} />

        {/* Colour buttons — stacked on right edge */}
        <div className="absolute right-5 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
          {COLOR_OPTIONS.map(opt => (
            <button
              key={opt.mode}
              onClick={() => setMode(opt.mode)}
              aria-label={opt.label}
              className="relative flex items-center justify-center w-4 h-4 rounded-full transition-all"
              style={{
                boxShadow: mode === opt.mode
                  ? `0 0 8px 3px ${opt.swatch}99, 0 0 18px 6px ${opt.swatch}33`
                  : `0 0 4px 1px ${opt.swatch}44`,
                opacity: mode === opt.mode ? 1 : 0.35,
              }}
            >
              {/* Outer soft ring */}
              <span
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: `${opt.swatch}18` }}
              />
              {/* Core dot */}
              <span
                className="relative w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: opt.swatch }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Fade left edge of mesh into black on md+ */}
      <div className="hidden md:block absolute inset-y-0 left-[35%] w-48 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
    </section>
  );
}
