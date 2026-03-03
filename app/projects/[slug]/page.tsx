import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Nav } from '@/components/ui/Nav';
import { SectionTag } from '@/components/ui/SectionTag';
import { SkillBadge } from '@/components/ui/SkillBadge';
import { getAllProjectSlugs, getProjectBySlug } from '@/lib/mdx';

export async function generateStaticParams() {
  const slugs = getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const { meta } = getProjectBySlug(params.slug);
    return {
      title: `${meta.title} — Ina Chun`,
      description: meta.description,
    };
  } catch {
    return { title: 'Project — Ina Chun' };
  }
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  let project;
  try {
    project = getProjectBySlug(params.slug);
  } catch {
    notFound();
  }

  const { meta, content } = project;

  return (
    <main className="bg-base min-h-screen">
      <Nav />

      {/* ── PAGE HEADER ── */}
      <section className="pt-32 pb-12 px-6 max-w-4xl mx-auto">
        <Link
          href="/projects"
          className="font-mono text-sm text-white/40 hover:text-white/70 transition-colors mb-8 inline-block"
        >
          ← All Projects
        </Link>

        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <SectionTag>Project</SectionTag>
            <h1 className="text-4xl font-bold mt-3 mb-2">{meta.title}</h1>
            <p className="text-white/50 max-w-2xl">{meta.description}</p>
          </div>
          {meta.status && (
            <span className="font-mono text-xs px-3 py-1 rounded-full border border-accent-cyan/30 text-accent-cyan shrink-0">
              {meta.status}
            </span>
          )}
        </div>

        <div className="flex items-center gap-6 mt-6 flex-wrap">
          <span className="font-mono text-sm text-white/30">{meta.dateRange}</span>
          <div className="flex gap-2 flex-wrap">
            {meta.tags.map((tag) => (
              <SkillBadge key={tag} label={tag} />
            ))}
          </div>
        </div>
      </section>

      {/* ── MDX CONTENT ── */}
      <article className="px-6 max-w-4xl mx-auto pb-32 prose prose-invert prose-p:text-white/70 prose-headings:text-white prose-a:text-accent-cyan prose-code:text-accent-cyan prose-code:bg-surface-2 prose-pre:bg-surface-2 prose-strong:text-white max-w-none">
        <MDXRemote source={content} />
      </article>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center">
        <p className="font-mono text-xs text-white/20">
          © 2026 Ina Chun · Built with Next.js + Three.js
        </p>
      </footer>
    </main>
  );
}
