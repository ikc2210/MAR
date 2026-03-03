interface Metric {
  label: string;
  value: string;
}

interface DataPanelProps {
  side: 'left' | 'right';
  title: string;
  metrics: Metric[];
  logLines?: string[];
}

function MiniSparkline() {
  const points = [4, 7, 3, 9, 5, 8, 6, 10, 4, 8];
  const w = 80;
  const h = 24;
  const max = Math.max(...points);
  const coords = points
    .map((v, i) => `${(i / (points.length - 1)) * w},${h - (v / max) * h}`)
    .join(' ');

  return (
    <svg width={w} height={h} aria-hidden="true" className="opacity-40">
      <polyline
        points={coords}
        fill="none"
        stroke="#b89aff"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DataPanel({ side, title, metrics, logLines }: DataPanelProps) {
  return (
    <div
      className={`glass rounded-lg p-4 w-52 text-xs font-mono glow-purple ${
        side === 'left' ? 'border-l-2 border-l-accent-cyan/40' : 'border-r-2 border-r-accent-pink/40'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
        <span className="text-accent-cyan tracking-wider text-[10px] uppercase">{title}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse-slow" />
      </div>

      {/* Metrics */}
      <div className="flex flex-col gap-1.5 mb-3">
        {metrics.map((m) => (
          <div key={m.label} className="flex items-center justify-between gap-3">
            <span className="text-white/30 truncate">{m.label}</span>
            <span className="text-white/80 shrink-0">{m.value}</span>
          </div>
        ))}
      </div>

      {/* Sparkline */}
      <div className="mb-3">
        <MiniSparkline />
      </div>

      {/* Log lines */}
      {logLines && logLines.length > 0 && (
        <div className="flex flex-col gap-1 border-t border-white/5 pt-2">
          {logLines.map((line, i) => (
            <span key={i} className="text-white/20 text-[10px] leading-relaxed">
              {line}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
