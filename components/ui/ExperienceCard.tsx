interface ExperienceCardProps {
  company: string;
  role: string;
  dateRange: string;
  location: string;
  bullets: string[];
}

export function ExperienceCard({ company, role, dateRange, location, bullets }: ExperienceCardProps) {
  return (
    <div className="glass rounded-xl p-6 md:p-8 border border-white/5 hover:border-accent-purple/20 transition-colors">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">{company}</h3>
          <p className="text-accent-cyan text-sm mt-0.5">{role}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-mono text-sm text-white/50">{dateRange}</p>
          <p className="font-mono text-xs text-white/30 mt-0.5">{location}</p>
        </div>
      </div>

      <ul className="flex flex-col gap-2">
        {bullets.map((bullet, i) => (
          <li key={i} className="flex gap-3 text-sm text-white/60 leading-relaxed">
            <span className="text-accent-purple/60 mt-1 shrink-0">▸</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
