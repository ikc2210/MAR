interface SectionTagProps {
  children: React.ReactNode;
}

export function SectionTag({ children }: SectionTagProps) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-accent-cyan">
      <span className="inline-block w-4 h-px bg-accent-cyan" />
      {children}
    </span>
  );
}
