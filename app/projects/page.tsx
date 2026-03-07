'use client';

import { useState } from 'react';
import { Nav } from '@/components/ui/Nav';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { SectionTag } from '@/components/ui/SectionTag';
import { MembraneScene } from '@/components/canvas/MembraneScene';

const ALL_PROJECTS = [
  {
    slug: 'synapse',
    title: 'Synapse',
    description:
      'P300 BCI decoder fusing EEG neural signals with a character-level language model prior to reduce flash repetitions needed for accurate character selection.',
    tags: ['Python', 'ML', 'BCI', 'NLP'],
    dateRange: 'Mar 2026 – Present',
    href: '/projects/synapse',
  },
  {
    slug: 'binosailsus',
    title: 'BinoSAILus',
    description:
      'RL-based autonomous sailboat controller that learns navigation strategies from real AIS vessel trajectories and simulation with wind dynamics.',
    tags: ['RL', 'Python', 'ML', 'Simulation'],
    dateRange: 'Dec 2025',
    href: '/projects/binosailsus',
  },
  {
    slug: 'generative-monoculture',
    title: 'Generative Monoculture and Fairness in LLMs',
    description:
      'Investigated how LLM outputs become less diverse than their training data, proposing a group-aware fairness definition to detect disproportionate diversity loss.',
    tags: ['Research', 'ML', 'NLP', 'Fairness'],
    dateRange: 'Dec 2025',
    href: '/projects/generative-monoculture',
  },
];

const FILTER_TAGS = ['All', 'ML', 'RL', 'BCI', 'NLP', 'Research'];

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered =
    activeFilter === 'All'
      ? ALL_PROJECTS
      : ALL_PROJECTS.filter((p) => p.tags.includes(activeFilter));

  return (
    <main className="bg-base min-h-screen relative">
      {/* Ambient animation — vertical center aligned with "Projects" heading, screen blend */}
      <div className="fixed right-0 top-[calc(11.5rem-35vh)] w-[48vw] h-[70vh] pointer-events-none z-0 mix-blend-screen opacity-25">
        <MembraneScene mode="purple" />
      </div>
      <Nav />

      {/* ── PAGE HEADER ── */}
      <section className="pt-32 pb-8 px-6 max-w-6xl mx-auto">
        <div className="flex items-end justify-between">
          <div>
            <SectionTag>Portfolio</SectionTag>
            <h1 className="text-4xl font-bold mt-3">Projects</h1>
          </div>
          <span className="font-mono text-sm text-white/30 mb-1">
            {filtered.length} / {ALL_PROJECTS.length}
          </span>
        </div>
      </section>

      {/* ── FILTER TABS ── */}
      <section className="px-6 max-w-6xl mx-auto mb-12">
        <div className="flex gap-2 flex-wrap">
          {FILTER_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              className={`font-mono text-sm px-4 py-2 rounded-full border transition-all ${
                activeFilter === tag
                  ? 'bg-accent-cyan text-base border-accent-cyan'
                  : 'border-white/10 text-white/50 hover:text-white/80 hover:border-white/20'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* ── PROJECT GRID ── */}
      <section className="px-6 max-w-6xl mx-auto pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <ProjectCard key={p.slug} {...p} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center">
        <p className="font-mono text-xs text-white/20">
          © 2026 Ina Chun · Built with Next.js + Three.js
        </p>
      </footer>
    </main>
  );
}
