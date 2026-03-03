'use client';

import { useState } from 'react';
import { Nav } from '@/components/ui/Nav';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { SectionTag } from '@/components/ui/SectionTag';
import { MembraneScene } from '@/components/canvas/MembraneScene';

const ALL_PROJECTS = [
  {
    slug: 'civiclick',
    title: 'CiviClick',
    description:
      'Civic issue reporter leveraging YOLO object detection and geolocation to automatically categorize and route community complaints to local government departments.',
    tags: ['CV/ML', 'Python', 'TypeScript', 'YOLO'],
    dateRange: 'Oct 2024 – Jan 2025',
    href: '/projects/civiclick',
  },
  {
    slug: 'green-gardens',
    title: 'Green Gardens',
    description:
      'IoT carbon footprint sensor network using Raspberry Pi units distributed across community gardens to monitor and visualize CO₂ sequestration in real time.',
    tags: ['Hardware', 'Python', 'IoT', 'Raspberry Pi'],
    dateRange: 'Jun 2020 – Jun 2022',
    href: '/projects/green-gardens',
  },
  {
    slug: 'neural-prosthetics',
    title: 'Neural Prosthetics Interface',
    description:
      'EEG signal processing pipeline for controlling prosthetic limbs via brainwave classification. Developed at UNLV Drones & Autonomous Systems Lab.',
    tags: ['Research', 'Python', 'ML', 'EEG'],
    dateRange: '2019 – 2020',
    href: '/projects/neural-prosthetics',
  },
  {
    slug: 'data-viz-engine',
    title: 'DataViz Engine',
    description:
      'High-performance 3D data visualization library built on WebGL and Three.js. Renders millions of data points in real time with customizable shaders and interaction models.',
    tags: ['Web', 'TypeScript', 'Three.js', 'WebGL'],
    dateRange: 'Sep 2024 – Dec 2024',
    href: '/projects/data-viz-engine',
  },
  {
    slug: 'llm-pipeline',
    title: 'LLM Fine-Tuning Pipeline',
    description:
      'End-to-end distributed fine-tuning pipeline for large language models using LoRA adapters. Supports multi-node GPU training with automatic checkpoint management.',
    tags: ['CV/ML', 'Python', 'PyTorch', 'Distributed'],
    dateRange: 'Jan 2025 – Mar 2025',
    href: '/projects/llm-pipeline',
  },
  {
    slug: 'infra-monitor',
    title: 'Infra Monitor',
    description:
      'Distributed infrastructure monitoring tool with anomaly detection. Aggregates metrics from Kubernetes clusters and surfaces actionable alerts with root-cause analysis.',
    tags: ['Web', 'Go', 'Kubernetes', 'Prometheus'],
    dateRange: 'Apr 2024 – Jul 2024',
    href: '/projects/infra-monitor',
  },
];

const FILTER_TAGS = ['All', 'CV/ML', 'Web', 'Hardware', 'Research'];

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered =
    activeFilter === 'All'
      ? ALL_PROJECTS
      : ALL_PROJECTS.filter((p) => p.tags.includes(activeFilter));

  return (
    <main className="bg-base min-h-screen relative">
      {/* Ambient animation — left side, screen blend so only bright parts show */}
      <div className="fixed left-0 top-0 h-screen w-[38vw] pointer-events-none z-0 mix-blend-screen opacity-25">
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
