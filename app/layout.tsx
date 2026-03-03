import type { Metadata } from 'next';
import { Gothic_A1, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const gothicA1 = Gothic_A1({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-gothic',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Ina Chun — Software Engineer',
  description:
    'Personal portfolio of Ina Chun, CS student at Stanford University. Software engineering internships at Virtu Financial, Apple, and Tesla.',
  keywords: ['Ina Chun', 'Software Engineer', 'Stanford', 'Portfolio', 'CS'],
  authors: [{ name: 'Ina Chun' }],
  openGraph: {
    title: 'Ina Chun — Software Engineer',
    description: 'Building at the intersection of code & craft.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${gothicA1.variable} ${ibmPlexMono.variable} dark`}>
      <body className="bg-base text-white font-sans font-light antialiased">{children}</body>
    </html>
  );
}
