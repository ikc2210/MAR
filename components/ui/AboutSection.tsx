import Image from 'next/image';
import bioPic from '@/components/canvas/bio-crop.png';

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 mb-16">
      <div className="flex-1 h-px bg-white/10" />
      <span className="text-white/60 text-xs tracking-[0.3em] uppercase">{label}</span>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );
}

export function AboutSection() {
  return (
    <section className="bg-black py-28 px-8 md:px-16">
      <SectionHeader label="About" />

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 md:gap-20 items-start">
        {/* Bio photo — wrapper so glow isn't clipped */}
        <div className="relative shrink-0 w-64 h-80 rounded-lg p-[1px] glow-frame">
          <div className="absolute inset-[1px] rounded-[7px] overflow-hidden bg-surface-2/40">
            <Image
              src={bioPic}
              alt="Ina Chun"
              fill
              className="object-cover z-0"
              sizes="256px"
              priority
              unoptimized
            />
            <div className="absolute inset-0 z-[1] bg-gradient-to-br from-accent-purple/[0.06] to-accent-cyan/[0.03] pointer-events-none" />
          </div>
        </div>

        {/* Bio + stats */}
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-wide mb-4">INA CHUN</h2>
            <p className="text-white/50 text-sm leading-relaxed max-w-md">
              I&apos;m a software engineer and Stanford CS student graduating June 2026.
              With a passion for systems and applied ML, I&apos;ve built across HFT infrastructure,
              Apple Silicon frameworks, and autonomous robotics — always at the edge of what&apos;s possible.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
