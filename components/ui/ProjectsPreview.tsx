import Link from 'next/link';

const PREVIEW_PROJECTS = [
  {
    slug: 'civiclick',
    label: '001',
    title: 'CiviClick',
    tags: ['CV/ML', 'Python'],
    gradient: 'from-accent-purple/20 via-accent-cyan/10 to-transparent',
  },
  {
    slug: 'neural-prosthetics',
    label: '002',
    title: 'Neural Prosthetics',
    tags: ['Research', 'EEG'],
    gradient: 'from-accent-cyan/20 via-accent-purple/10 to-transparent',
  },
  {
    slug: 'green-gardens',
    label: '003',
    title: 'Green Gardens',
    tags: ['Hardware', 'IoT'],
    gradient: 'from-accent-pink/15 via-accent-purple/10 to-transparent',
  },
];

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 mb-16">
      <div className="flex-1 h-px bg-white/10" />
      <span className="text-white/60 text-xs tracking-[0.3em] uppercase">{label}</span>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );
}

export function ProjectsPreview() {
  return (
    <section className="bg-black py-28 px-8 md:px-16 border-t border-white/5">
      <SectionHeader label="Projects" />

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        {PREVIEW_PROJECTS.map((p) => (
          <Link key={p.slug} href={`/projects/${p.slug}`} className="group block">
            <div className="relative aspect-[4/5] bg-surface-2 border border-white/6 overflow-hidden">
              {/* Gradient placeholder evoking the glowing viz aesthetic */}
              <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient}`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-accent-purple/20 blur-sm" />
                </div>
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <div>
                  <p className="font-mono text-[10px] text-white/40 tracking-widest mb-1">{p.label}</p>
                  <p className="text-white text-sm font-semibold">{p.title}</p>
                  <div className="flex gap-2 mt-1">
                    {p.tags.map((t) => (
                      <span key={t} className="font-mono text-[10px] text-accent-cyan/70">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
              {/* Label always visible top-left */}
              <span className="absolute top-3 left-3 font-mono text-[10px] text-white/30">{p.label}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="max-w-5xl mx-auto mt-10 text-center">
        <Link
          href="/projects"
          className="font-mono text-xs tracking-[0.2em] text-white/30 hover:text-white/60 transition-colors uppercase"
        >
          View All Projects →
        </Link>
      </div>
    </section>
  );
}
