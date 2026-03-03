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
    <section className="relative h-screen w-full flex justify-center items-center bg-black overflow-hidden px-6 sm:px-8">
      {/* Centered group: text + animation */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-10 lg:gap-14 w-full max-w-5xl">
        {/* Text block — pushed toward center on desktop */}
        <div className="flex flex-col justify-center text-center md:text-left md:min-w-[280px] md:ml-16 lg:ml-24">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-none tracking-tight mb-2 whitespace-nowrap">
            HI, I&apos;M INA
          </h1>
          <p className="text-white/50 text-sm leading-relaxed max-w-xs mb-5 mx-auto md:mx-0">
            I&apos;m a Stanford grad specializing in systems, machine-learning, and high-performance applications.
          </p>
          <Link
            href="/projects"
            className="self-center md:self-start border border-white/40 text-white/80 text-xs tracking-[0.2em] uppercase px-6 py-3 hover:border-white hover:text-white transition-colors"
          >
            View My Work
          </Link>
        </div>

        {/* Animation */}
        <div className="relative w-full max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl aspect-square md:aspect-auto md:h-[85vh] md:min-h-[480px] shrink-0">
          <EntityScene mode={mode} />

          {/* Colour buttons — stacked on right edge of animation */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
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
                <span
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: `${opt.swatch}18` }}
                />
                <span
                  className="relative w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: opt.swatch }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
