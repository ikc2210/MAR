interface SkillBadgeProps {
  label: string;
  variant?: 'default' | 'purple' | 'pink' | 'cyan';
}

const VARIANT_CLASSES = {
  default: 'bg-surface-2 text-white/60 border-white/8',
  purple: 'bg-accent-purple/10 text-accent-purple border-accent-purple/20',
  pink: 'bg-accent-pink/10 text-accent-pink border-accent-pink/20',
  cyan: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20',
};

export function SkillBadge({ label, variant = 'default' }: SkillBadgeProps) {
  return (
    <span
      className={`inline-block font-mono text-xs px-3 py-1 rounded border transition-colors ${VARIANT_CLASSES[variant]}`}
    >
      {label}
    </span>
  );
}
