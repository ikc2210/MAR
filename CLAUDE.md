# Personal Portfolio Site

## Goal
A visually striking personal portfolio with 3D animations inspired by 
data-visualization aesthetics — flowing particle meshes, dark backgrounds, 
glowing gradients (pink/blue/purple), and clean typographic data panels.

## Tech Stack
- Next.js 14 (App Router)
- Three.js for 3D canvas animations
- Tailwind CSS for styling
- MDX for project case study content
- Deployed on Netlify

## Design Direction
- Dark background (#0a0a0f or similar near-black)
- Hero section: full-screen Three.js particle/wave animation
- Glowing color palette: electric blue, purple, pink highlights
- Clean sans-serif typography with monospace accents for data/stats
- Panels and cards with subtle frosted-glass effect (backdrop-blur)
- Reference aesthetic: flowing 3D mesh surfaces, layered waveforms, 
  particle terrain, dense data readout panels flanking visualizations

## Code Style
- TypeScript throughout
- Named exports preferred
- Components stay under 150 lines — split if larger
- No inline styles — Tailwind only
- Animations in /components/canvas/ folder
- Content (projects, bio) lives in /content/ as MDX files

## Project Structure
```
/app
  /page.tsx          ← homepage
  /projects/[slug]   ← individual project pages
/components
  /canvas/           ← all Three.js animation components
  /ui/               ← buttons, cards, nav, etc.
/content
  /projects/         ← MDX files for each project
/public
  /images/
```

## Commands
- `npm run dev` to start
- `npm run build` to build
- `netlify deploy --prod` to ship

## Deployment
- Netlify hosting
- netlify.toml must exist in project root configured for Next.js
- Use @netlify/plugin-nextjs

## Rules
- Never use inline styles — Tailwind only
- Never use default exports — named exports only
- Always use TypeScript, never plain JS
- Keep Three.js logic self-contained in /components/canvas/
- New projects are added as MDX files in /content/projects/ — 
  no code changes needed to add content