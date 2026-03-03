'use client';

import { useEffect, useRef } from 'react';

export type ColorMode = 'purple' | 'white' | 'blue';

// ── Noise helpers ─────────────────────────────────────────────────
function h(n: number) { return ((Math.sin(n * 127.1 + 311.7) * 43758.5453) % 1 + 1) % 1; }
function fade(t: number) { return t * t * (3 - 2 * t); }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function vnoise(x: number, y: number, z: number) {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
  const fx = fade(x - ix), fy = fade(y - iy), fz = fade(z - iz);
  return lerp(
    lerp(lerp(h(ix+iy*57+iz*113),h(ix+1+iy*57+iz*113),fx), lerp(h(ix+(iy+1)*57+iz*113),h(ix+1+(iy+1)*57+iz*113),fx),fy),
    lerp(lerp(h(ix+iy*57+(iz+1)*113),h(ix+1+iy*57+(iz+1)*113),fx), lerp(h(ix+(iy+1)*57+(iz+1)*113),h(ix+1+(iy+1)*57+(iz+1)*113),fx),fy),
    fz);
}
function fbm(x: number, y: number, z: number) {
  return vnoise(x,y,z)*0.5 + vnoise(x*2.1+3.7,y*2.1,z*2.1)*0.25 + vnoise(x*4.2,y*4.2+1.3,z*4.2)*0.125;
}

function getPulse(T: number) {
  return 0.82+(Math.sin(T*0.95)*0.5+0.5)*0.22+Math.sin(T*2.1+0.8)*0.12+Math.sin(T*0.31)*0.07;
}
function getRipple(theta: number, phi: number, T: number) {
  return Math.sin(theta*2.8+T*1.4)*0.09+Math.cos(phi*1.6+T*1.1)*0.07+Math.sin(theta*1.2-phi*0.9+T*0.8)*0.055;
}
function getBodyDrift(T: number) {
  return {
    x: Math.sin(T*0.34)*0.06+Math.sin(T*0.71)*0.03,
    y: Math.cos(T*0.27)*0.05+Math.cos(T*0.58)*0.025,
    z: Math.sin(T*0.19)*0.04,
  };
}

class Particle {
  theta: number; phi: number; baseR: number; size: number;
  noiseOff: number; driftSpeed: number; personalPhase: number;
  x=0; y=0; z=0; currentR: number; rx=0; ry2=0;
  constructor() {
    this.theta = Math.acos(2*Math.random()-1);
    this.phi   = Math.random()*Math.PI*2;
    this.baseR = 0.68+Math.random()*0.42;
    this.size  = 0.7+Math.random()*1.5;
    this.noiseOff = Math.random()*100;
    this.driftSpeed = 0.0005+Math.random()*0.0004;
    this.personalPhase = Math.random()*Math.PI*2;
    this.currentR = this.baseR;
  }
  update(T: number) {
    const nx = fbm(this.theta*1.3+this.noiseOff, this.phi*0.9, T*0.18);
    const ny = fbm(this.phi*1.1+this.noiseOff*0.5, T*0.15, this.theta);
    this.theta += (nx-0.5)*this.driftSpeed*2.5;
    this.phi   += (ny-0.5)*this.driftSpeed*3.2;
    this.theta  = Math.max(0.04, Math.min(Math.PI-0.04, this.theta));
    const pulse  = getPulse(T+this.personalPhase*0.04);
    const ripple = getRipple(this.theta, this.phi, T);
    const warp   = (fbm(this.theta*2+this.noiseOff, this.phi*1.5, T*0.09)-0.5)*0.28;
    const targetR = (this.baseR+warp)*pulse+ripple;
    this.currentR += (targetR-this.currentR)*0.18;
    const drift = getBodyDrift(T);
    this.x = this.currentR*Math.sin(this.theta)*Math.cos(this.phi)+drift.x;
    this.y = this.currentR*Math.cos(this.theta)*0.80+drift.y;
    this.z = this.currentR*Math.sin(this.theta)*Math.sin(this.phi)+drift.z;
    this.rx *= 0.72; this.ry2 *= 0.72;
  }
  project(t: number, W: number, H: number, CX: number, CY: number) {
    const ry = t*0.00065+Math.sin(t*0.00028)*0.15;
    const rx = Math.sin(t*0.00029)*0.26+0.17;
    const px  = this.x*Math.cos(ry)-this.z*Math.sin(ry);
    const pz0 = this.x*Math.sin(ry)+this.z*Math.cos(ry);
    const py2 = this.y*Math.cos(rx)-pz0*Math.sin(rx);
    const pz2 = this.y*Math.sin(rx)+pz0*Math.cos(rx);
    const scale = Math.min(W,H)*0.295;
    const s = 3.6/(3.6+pz2+1.3);
    return { sx: CX+px*s*scale+this.rx, sy: CY-py2*s*scale+this.ry2, depth: pz2, sc: s };
  }
}

// Per-mode colour palettes
const PALETTES: Record<ColorMode, {
  particle: (a: number) => string;
  glow0: string; glow1: string;
  line: (a: number) => string;
  halo0: (a: number) => string; halo1: string;
}> = {
  purple: {
    particle: a => `rgba(205,175,255,${a})`,
    glow0: 'rgba(168,128,255,0.09)', glow1: 'rgba(98,68,248,0.03)',
    line: a => `rgba(188,158,255,${a})`,
    halo0: a => `rgba(185,148,255,${a})`, halo1: 'rgba(120,88,255,0)',
  },
  white: {
    particle: a => `rgba(255,255,255,${a})`,
    glow0: 'rgba(255,255,255,0.07)', glow1: 'rgba(210,218,255,0.009)',
    line: a => `rgba(255,255,255,${a})`,
    halo0: a => `rgba(255,255,255,${a})`, halo1: 'rgba(255,255,255,0)',
  },
  blue: {
    particle: a => `rgba(120,195,255,${a})`,
    glow0: 'rgba(60,140,255,0.09)', glow1: 'rgba(30,90,248,0.03)',
    line: a => `rgba(100,180,255,${a})`,
    halo0: a => `rgba(80,170,255,${a})`, halo1: 'rgba(40,100,255,0)',
  },
};

const N = 2000;
const REPULSE_R = 42;
const REPULSE_R_SQ = REPULSE_R * REPULSE_R;

export function EntityScene({ mode = 'purple' }: { mode?: ColorMode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Use a ref so colour changes take effect immediately without restarting the loop
  const modeRef = useRef<ColorMode>(mode);
  useEffect(() => { modeRef.current = mode; }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const c = ctx; // non-null alias for use inside closures

    let W = 0, H = 0, CX = 0, CY = 0, t = 0;
    const mouse = { x: null as number | null, y: null as number | null, active: false, vx: 0, vy: 0 };

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      CX = W/2; CY = H/2;
    };
    resize();

    const particles = Array.from({ length: N }, () => new Particle());
    for (let i = 0; i < 80; i++) { const TT = i*0.001; particles.forEach(p => p.update(TT)); }

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX-rect.left, cy = e.clientY-rect.top;
      mouse.vx = cx-(mouse.x ?? cx); mouse.vy = cy-(mouse.y ?? cy);
      mouse.x = cx; mouse.y = cy; mouse.active = true;
    };
    const onMouseLeave = () => { mouse.active = false; };
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let animId: number;

    function draw() {
      animId = requestAnimationFrame(draw);
      const T = t*0.001;
      const pal = PALETTES[modeRef.current];

      const projected = particles.map(p => { p.update(T); return p.project(t, W, H, CX, CY); });

      // Mouse repulsion — organic (radius varies by direction via noise)
      if (mouse.active && mouse.x !== null) {
        const speed = Math.sqrt(mouse.vx*mouse.vx+mouse.vy*mouse.vy);
        for (let i = 0; i < N; i++) {
          const p = particles[i], proj = projected[i];
          const dx = proj.sx-mouse.x!, dy = proj.sy-mouse.y!;
          const dSq = dx*dx+dy*dy;
          if (dSq > REPULSE_R_SQ * 2.2 || dSq < 0.1) continue; // broad cull
          const dirAngle = Math.atan2(dy, dx);
          // Organic radius: varies by direction + slow time drift
          const organicR = REPULSE_R * (0.55 + 0.9 * fbm(dirAngle*0.8+T*0.2, p.noiseOff*0.01, T*0.1));
          const dist = Math.sqrt(dSq);
          if (dist > organicR) continue;
          const falloff = Math.pow(1-dist/organicR, 1.8);
          const scatterAngle = dirAngle + (fbm(p.theta*2, p.phi*1.5, T*0.3)-0.5)*0.8;
          const impulse = falloff*(18+speed*0.4);
          p.rx += Math.cos(scatterAngle)*impulse; p.ry2 += Math.sin(scatterAngle)*impulse;
        }
      }

      c.fillStyle='rgba(0,0,0,0.28)'; c.fillRect(0,0,W,H);

      // Glow
      const pulse=getPulse(T), drift=getBodyDrift(T);
      const ox=drift.x*Math.min(W,H)*0.3, oy=drift.y*Math.min(W,H)*0.3;
      const gr=c.createRadialGradient(CX+ox,CY+oy,0,CX+ox,CY+oy,Math.min(W,H)*0.31*pulse);
      gr.addColorStop(0,pal.glow0); gr.addColorStop(0.4,pal.glow1); gr.addColorStop(1,'rgba(0,0,0,0)');
      c.fillStyle=gr; c.fillRect(0,0,W,H);

      // Connections
      const MAX_D=26, MAX_D_SQ=MAX_D*MAX_D;
      for (let i=0;i<N;i+=2) {
        const a=projected[i];
        for (let j=i+1;j<N;j+=2) {
          const b=projected[j];
          const dx=b.sx-a.sx, dy=b.sy-a.sy, dSq=dx*dx+dy*dy;
          if (dSq>MAX_D_SQ) continue;
          const alpha=(1-Math.sqrt(dSq)/MAX_D)*Math.max(0,0.52-(a.depth+b.depth)*0.17)*0.52;
          if (alpha<0.012) continue;
          c.beginPath(); c.moveTo(a.sx,a.sy); c.lineTo(b.sx,b.sy);
          c.strokeStyle=pal.line(alpha.toFixed(3) as unknown as number); c.lineWidth=0.32; c.stroke();
        }
      }

      // Particles + halo
      for (let i=0;i<N;i++) {
        const p=projected[i], pt=particles[i];
        const depthFade=Math.max(0,0.85-p.depth*0.42);
        const sz=pt.size*p.sc*depthFade;
        if (sz<0.12) continue;
        const lum=depthFade*(0.55+p.sc*0.45);
        c.beginPath(); c.arc(p.sx,p.sy,sz*0.65,0,Math.PI*2);
        c.fillStyle=pal.particle((lum*0.92).toFixed(3) as unknown as number); c.fill();
        if (lum>0.4) {
          const g2=c.createRadialGradient(p.sx,p.sy,0,p.sx,p.sy,sz*2.8);
          g2.addColorStop(0,pal.halo0((lum*0.26).toFixed(3) as unknown as number)); g2.addColorStop(1,pal.halo1);
          c.beginPath(); c.arc(p.sx,p.sy,sz*2.8,0,Math.PI*2); c.fillStyle=g2; c.fill();
        }
      }

      t++;
    }
    draw();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      ro.disconnect();
    };
  }, []); // run once — mode changes are picked up via modeRef

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full bg-black" />;
}
