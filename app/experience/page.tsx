import { Nav } from '@/components/ui/Nav';
import { ExperienceCard } from '@/components/ui/ExperienceCard';
import { SkillBadge } from '@/components/ui/SkillBadge';
import { SectionTag } from '@/components/ui/SectionTag';
import { FilamentScene } from '@/components/canvas/FilamentScene';

const WORK_EXPERIENCE = [
  {
    company: 'Virtu Financial',
    role: 'Software Development Intern',
    dateRange: 'Jun. 2025 – Aug. 2025',
    location: 'New York, NY',
    bullets: [
      'Implemented core components for proprietary internal systems (details under NDA).',
    ],
  },
  {
    company: 'Apple',
    role: 'Software Engineering Intern',
    dateRange: 'Jul. 2024 – Sep. 2024',
    location: 'San Diego, CA',
    bullets: [
      'Built internal analytics platform to evaluate test performance and identify bottlenecks for engineering managers.',
      'Leveraged predictive insights to anticipate build failures, using historical data to streamline engineering workflows.',
      'Deployed application to SWE managers across CoreOS and Audio & Media Technologies, leading 300+ engineers.',
    ],
  },
  {
    company: 'Tesla',
    role: 'Software Engineering Intern',
    dateRange: 'Mar. 2024 – Jun. 2024',
    location: 'Palo Alto, CA',
    bullets: [
      'Developed a touch-data forwarding system for engineers to remotely connect with vehicle infotainment screens.',
      'Built an automated migration pipeline and versioning system for large binary datasets used by 40+ engineers.',
      'Automated testing workflow for UI bugs, producing a 70% reduction in manual testing time for intern cohort.',
    ],
  },
  {
    company: 'Drones and Autonomous Systems Lab (University of Nevada, Las Vegas)',
    role: 'Research Intern',
    dateRange: 'Sep. 2019 – Jun. 2020',
    location: 'Las Vegas, NV',
    bullets: [
      'Developed software for OpenBCI to control an exoskeleton robot and prosthetic devices with EEG brain signals.',
      'Collected 400+ total data segment samples from human brain, produced 95% classification accuracy of movement.',
      'Published research paper and discussed future applications of brainwave-controlled prosthetics at IEEE 2020.',
    ],
  },
  {
    company: 'US Patent and Trademark Office',
    role: 'Provisional Patent Owner',
    dateRange: 'Apr. 2020 – Nov. 2020',
    location: 'Irvine, CA',
    bullets: [
      'Created a dynamic brain-imaging constructor to track multi-dimensional brainwave changes in epilepsy patients.',
    ],
  },
];

const EDUCATION = {
  institution: 'Stanford University',
  degree: 'Bachelor of Science, Computer Science',
  minor: 'Minor in Art History',
  gpa: '3.93',
  dateRange: 'Sep 2022 – Jun 2026',
  location: 'Stanford, CA',
  coursework: [
    'CS161 (Algorithms)',
    'CS111 (Operating Systems)',
    'CS143 (Compilers)',
    'CS144 (Networking)',
    'CS205L (Mathematical Methods for Machine Learning)',
    'CS224N (NLP with Deep Learning)',
    'CS224R (Mechanistic Interpretability)',
    'CS256 (Algorithmic Fairness)',
  ],
  associations: ['Stanford Alpha Kappa Psi', 'Stanford Consulting', 'ASES', 'BASES', 'Moonshot Club'],
};

const SKILLS = {
  Languages: [
    'Python', 'C', 'C++', 'Swift', 'Java', 'Groovy', 'SQL', 'R',
    'JavaScript', 'TypeScript', 'HTML/CSS', 'Go',
  ],
  'Developer Tools & Technologies': [
    'React', 'REST APIs', 'Node.js', 'SwiftUI', 'Flask', 'MongoDB', 'Firebase',
    'Docker', 'NumPy', 'SciPy', 'Pandas', 'Matplotlib', 'Scikit-learn',
    'PyTorch', 'TensorFlow', 'Git', 'Jenkins', 'Unix/Linux', 'Artifactory', 'Kubernetes',
  ],
  Miscellaneous: [
    'US Computing Olympiad Silver Qualifier',
    'FAA Drone Pilot License',
    "Hershey's Heartwarming Young Heroes",
  ],
};

export const metadata = {
  title: 'Experience — Ina Chun',
  description: 'Work history, education, and skills for Ina Chun.',
};

export default function ExperiencePage() {
  return (
    <main className="bg-base min-h-screen relative">
      {/* Ambient animation — right side, screen blend so only bright parts show */}
      <div className="fixed right-0 top-0 h-screen w-[38vw] pointer-events-none z-0 mix-blend-screen opacity-30">
        <FilamentScene mode="purple" />
      </div>
      <Nav />

      {/* ── PAGE HERO ── */}
      <section className="pt-32 pb-16 px-6 max-w-5xl mx-auto">
        <p className="font-mono text-accent-cyan text-sm tracking-widest uppercase mb-4">
          About me
        </p>
        <h1 className="text-5xl font-bold mb-4">
          Ina Chun
        </h1>
        <p className="font-mono text-white/40 text-lg">
          Stanford CS &apos;26 · inakathleenchun@gmail.com
        </p>
      </section>

      {/* ── WORK EXPERIENCE ── */}
      <section className="py-12 px-6 max-w-5xl mx-auto">
        <SectionTag>Work Experience</SectionTag>
        <h2 className="text-2xl font-bold mt-3 mb-10">Industry Roles</h2>

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-accent-cyan via-accent-purple to-accent-pink opacity-30 hidden md:block" />

          <div className="flex flex-col gap-8">
            {WORK_EXPERIENCE.map((exp, i) => (
              <div key={i} className="md:pl-8">
                <ExperienceCard {...exp} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDUCATION ── */}
      <section className="py-12 px-6 max-w-5xl mx-auto">
        <SectionTag>Education</SectionTag>
        <h2 className="text-2xl font-bold mt-3 mb-10">Academic Background</h2>

        <div className="glass rounded-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">{EDUCATION.institution}</h3>
              <p className="text-accent-cyan mt-1">{EDUCATION.degree}</p>
              <p className="text-white/50 text-sm mt-0.5">{EDUCATION.minor}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-mono text-sm text-white/60">{EDUCATION.dateRange}</p>
              <p className="font-mono text-sm text-white/40 mt-1">{EDUCATION.location}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-3">
                Relevant Coursework
              </p>
              <div className="flex flex-wrap gap-2">
                {EDUCATION.coursework.map((course) => (
                  <span
                    key={course}
                    className="font-mono text-xs px-2 py-1 rounded bg-surface-2 text-white/60 border border-white/5"
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-3">
                Associations
              </p>
              <div className="flex flex-wrap gap-2">
                {EDUCATION.associations.map((assoc) => (
                  <span
                    key={assoc}
                    className="font-mono text-xs px-2 py-1 rounded bg-accent-purple/10 text-accent-purple border border-accent-purple/20"
                  >
                    {assoc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section className="py-12 px-6 max-w-5xl mx-auto pb-32">
        <SectionTag>Skills</SectionTag>
        <h2 className="text-2xl font-bold mt-3 mb-10">Technical Skills</h2>

        <div className="flex flex-col gap-10">
          {Object.entries(SKILLS).map(([category, skills]) => (
            <div key={category}>
              <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-4">
                {category}
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <SkillBadge key={skill} label={skill} />
                ))}
              </div>
            </div>
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
