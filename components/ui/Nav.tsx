'use client';

import Link from 'next/link';

const NAV_LINKS = [
  { href: '/experience', label: 'ABOUT' },
  { href: '/projects', label: 'PROJECTS' },
  { href: '/#contact', label: 'CONTACT' },
];

export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 bg-black">
      {/* Logo */}
      <Link href="/" className="flex flex-col gap-0.5">
        <span className="text-white font-bold text-sm tracking-[0.2em] uppercase">
          INA CHUN
        </span>
        <span className="block h-px w-full bg-accent-cyan" />
      </Link>

      {/* Links with dash separators */}
      <div className="hidden md:flex items-center gap-3 text-white/60 text-xs tracking-[0.2em]">
        {NAV_LINKS.map((link, i) => (
          <span key={link.href} className="flex items-center gap-3">
            {i > 0 && <span className="text-white/20">—</span>}
            <Link href={link.href} className="hover:text-white transition-colors">
              {link.label}
            </Link>
          </span>
        ))}
        <span className="text-white/20 ml-2">—</span>
      </div>
    </nav>
  );
}
