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
        {/* Photo placeholder */}
        <div className="shrink-0 w-64 h-80 bg-surface-2 border border-white/8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/10 to-accent-cyan/5" />
          <p className="absolute bottom-3 left-3 font-mono text-[10px] text-white/20 tracking-widest">
            INA CHUN
          </p>
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
