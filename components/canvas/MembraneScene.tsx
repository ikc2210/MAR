'use client';

import { useEffect, useRef } from 'react';

type Mode = 'white' | 'purple' | 'blue';

function hashM(n: number) { return Math.sin(n) * 43758.5453 % 1; }
function noise3(x: number, y: number, z: number) {
  const ix=Math.floor(x),iy=Math.floor(y),iz=Math.floor(z);
  const fx=x-ix,fy=y-iy,fz=z-iz;
  const ux=fx*fx*(3-2*fx),uy=fy*fy*(3-2*fy),uz=fz*fz*(3-2*fz);
  const n000=hashM(ix+iy*57+iz*113),n100=hashM(ix+1+iy*57+iz*113);
  const n010=hashM(ix+(iy+1)*57+iz*113),n110=hashM(ix+1+(iy+1)*57+iz*113);
  const n001=hashM(ix+iy*57+(iz+1)*113),n101=hashM(ix+1+iy*57+(iz+1)*113);
  const n011=hashM(ix+(iy+1)*57+(iz+1)*113),n111=hashM(ix+1+(iy+1)*57+(iz+1)*113);
  return n000*(1-ux)*(1-uy)*(1-uz)+n100*ux*(1-uy)*(1-uz)+n010*(1-ux)*uy*(1-uz)+n110*ux*uy*(1-uz)
        +n001*(1-ux)*(1-uy)*uz+n101*ux*(1-uy)*uz+n011*(1-ux)*uy*uz+n111*ux*uy*uz;
}
function fbmM(x: number, y: number, z: number) {
  return noise3(x,y,z)*0.5+noise3(x*2.1,y*2.1,z*2.1)*0.25+noise3(x*4.3,y*4.3,z*4.3)*0.125;
}

const RES = 38;

export function MembraneScene({ mode = 'purple' }: { mode?: Mode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef<Mode>(mode);
  useEffect(() => { modeRef.current = mode; }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const c = ctx;

    let W=0, H=0, CX=0, CY=0, t=0;
    const resize = () => { W=canvas.width=canvas.offsetWidth; H=canvas.height=canvas.offsetHeight; CX=W/2; CY=H/2; };
    resize();

    // Build parametric surface
    type SurfacePt = {u:number;v:number;bx:number;by:number;bz:number};
    const surface: SurfacePt[][] = [];
    for(let i=0;i<RES;i++){surface.push([]);for(let j=0;j<RES;j++){const u=(i/(RES-1))*Math.PI*2,v=(j/(RES-1))*Math.PI*2,R=0.7+0.25*Math.cos(v*1.5);surface[i].push({u,v,bx:R*Math.cos(u)*(1.2+0.3*Math.cos(v)),by:R*Math.sin(u)*0.75,bz:R*Math.sin(v)*(0.9+0.2*Math.cos(u*2))});}}

    function project(x:number,y:number,z:number){
      const ry=t*0.00085,rx=Math.sin(t*0.00038)*0.28+0.2;
      const px=x*Math.cos(ry)-z*Math.sin(ry),pz0=x*Math.sin(ry)+z*Math.cos(ry);
      const py2=y*Math.cos(rx)-pz0*Math.sin(rx),pz2=y*Math.sin(rx)+pz0*Math.cos(rx);
      const scale=Math.min(W,H)*0.29,s=3.8/(3.8+pz2+1.4);
      return{sx:CX+px*s*scale,sy:CY-py2*s*scale,depth:pz2,sc:s};
    }
    function getSP(i:number,j:number,T:number){
      const p=surface[i][j],nS=1.4,tS=0.18;
      const disp=(fbmM(p.bx*nS+T*tS,p.by*nS+T*tS*0.7,p.bz*nS+T*tS*0.9)-0.5)*0.45;
      const warp=Math.sin(p.u*2.1+T*0.4)*Math.cos(p.v*1.7+T*0.3)*0.18;
      const len=Math.sqrt(p.bx*p.bx+p.by*p.by+p.bz*p.bz)+0.001;
      return{x:p.bx+(p.bx/len)*(disp+warp),y:p.by+(p.by/len)*(disp+warp),z:p.bz+(p.bz/len)*(disp+warp)};
    }

    type Proj = {sx:number;sy:number;depth:number;sc:number};
    class SurfaceVein {
      i=0;j=0;di=0;dj=0;mL=0;life=0;pts:Proj[]=[]; op=0;
      constructor(stagger:boolean){this.reset(stagger);}
      reset(stagger:boolean){this.i=Math.random()*(RES-1);this.j=Math.random()*(RES-1);this.di=(Math.random()-0.5)*0.12;this.dj=(Math.random()-0.5)*0.18;this.mL=300+Math.random()*250;this.life=stagger?Math.floor(Math.random()*this.mL):0;this.pts=[];this.op=0;}
      update(T:number){
        this.life++;const p=this.life/this.mL;
        this.op=p<0.05?p/0.05:p>0.7?(1-p)/0.3:1;
        if(this.life>this.mL){this.reset(false);return;}
        const ni=Math.floor(this.i)%RES,nj=Math.floor(this.j)%RES;
        const p3=getSP(ni,nj,T),n=fbmM(p3.x*2+T*0.1,p3.y*2,p3.z*2);
        this.di+=(n-0.5)*0.008;this.dj+=(n-0.5)*0.006;this.di*=0.97;this.dj*=0.97;
        this.i=((this.i+this.di)%RES+RES)%RES;this.j=((this.j+this.dj)%RES+RES)%RES;
        this.pts.push(project(p3.x,p3.y,p3.z));if(this.pts.length>80)this.pts.shift();
      }
      draw(){
        const len=this.pts.length;if(len<3)return;
        const m=modeRef.current;
        for(let k=1;k<len;k++){const a=this.pts[k-1],b=this.pts[k],dx=b.sx-a.sx,dy=b.sy-a.sy;if(dx*dx+dy*dy>25000)continue;const alpha=this.op*(k/len)*(0.4+b.sc*0.6),br=0.6+b.depth*0.18;c.strokeStyle=m==='white'?`rgba(255,255,255,${(alpha*br*0.95).toFixed(3)})`:m==='blue'?`rgba(140,210,255,${(alpha*br*0.95).toFixed(3)})`:`rgba(215,185,255,${(alpha*br*0.95).toFixed(3)})`;c.beginPath();c.moveTo(a.sx,a.sy);c.lineTo(b.sx,b.sy);c.lineWidth=0.7;c.stroke();}
      }
    }

    const veins=Array.from({length:18},()=>new SurfaceVein(true));
    let animId: number;

    function draw(){
      animId=requestAnimationFrame(draw);
      const T=t*0.001,m=modeRef.current;
      c.fillStyle='rgba(0,0,0,0.22)';c.fillRect(0,0,W,H);
      // Translucency glow
      const breathe=1+Math.sin(T*1.1)*0.07,ox=Math.sin(T*0.55)*W*0.025,oy=Math.cos(T*0.43)*H*0.02;
      const gr=c.createRadialGradient(CX+ox,CY+oy,0,CX+ox,CY+oy,Math.min(W,H)*0.26*breathe);
      gr.addColorStop(0,m==='white'?'rgba(255,255,255,0.055)':m==='blue'?'rgba(80,160,255,0.07)':'rgba(170,130,255,0.07)');
      gr.addColorStop(0.4,m==='white'?'rgba(230,235,255,0.025)':m==='blue'?'rgba(40,100,255,0.03)':'rgba(110,80,255,0.03)');
      gr.addColorStop(1,'rgba(0,0,0,0)');
      c.fillStyle=gr;c.fillRect(0,0,W,H);
      // Membrane grid
      const pts:Proj[][]=[];
      for(let i=0;i<RES;i++){pts.push([]);for(let j=0;j<RES;j++){const p3=getSP(i,j,T);pts[i].push(project(p3.x,p3.y,p3.z));}}
      const lineCol=(alpha:number)=>m==='white'?`rgba(255,255,255,${alpha.toFixed(3)})`:m==='blue'?`rgba(140,200,255,${alpha.toFixed(3)})`:`rgba(180,145,255,${alpha.toFixed(3)})`;
      for(let i=0;i<RES;i+=2){let sum=0;for(let j=0;j<RES;j++)sum+=pts[i][j].depth;const alpha=Math.max(0,0.55-(sum/RES)*0.35);if(alpha<=0)continue;c.beginPath();let s=false;for(let j=0;j<RES;j++){const p=pts[i][j];if(!s){c.moveTo(p.sx,p.sy);s=true;}else c.lineTo(p.sx,p.sy);}c.lineTo(pts[i][0].sx,pts[i][0].sy);c.strokeStyle=lineCol(alpha);c.lineWidth=0.5;c.stroke();}
      for(let j=0;j<RES;j+=2){let sum=0;for(let i=0;i<RES;i++)sum+=pts[i][j].depth;const alpha=Math.max(0,0.42-(sum/RES)*0.28);if(alpha<=0)continue;c.beginPath();let s=false;for(let i=0;i<RES;i++){const p=pts[i][j];if(!s){c.moveTo(p.sx,p.sy);s=true;}else c.lineTo(p.sx,p.sy);}c.lineTo(pts[0][j].sx,pts[0][j].sy);c.strokeStyle=lineCol(alpha);c.lineWidth=0.4;c.stroke();}
      veins.forEach(v=>{v.update(T);v.draw();});
      t++;
    }
    draw();
    const ro=new ResizeObserver(resize);ro.observe(canvas);
    return()=>{cancelAnimationFrame(animId);ro.disconnect();};
  },[]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
