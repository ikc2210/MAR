import Link from 'next/link';

interface ProjectCardProps {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  dateRange: string;
  href: string;
}

export function ProjectCard({ title, description, tags, dateRange, href }: ProjectCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <div className="h-full glass rounded-xl p-6 flex flex-col gap-4 border border-white/5 transition-all duration-300 hover:border-accent-cyan/30 hover:glow-cyan hover:-translate-y-1">
        {/* Date */}
        <span className="font-mono text-xs text-white/30">{dateRange}</span>

        {/* Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-accent-cyan transition-colors leading-snug">
          {title}
        </h3>

        {/* Description */}
        <p className="text-white/50 text-sm leading-relaxed flex-1">{description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[11px] px-2 py-0.5 rounded bg-surface-2 text-white/40 border border-white/5"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Arrow */}
        <div className="flex items-center justify-end">
          <span className="font-mono text-xs text-white/20 group-hover:text-accent-cyan transition-colors">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
