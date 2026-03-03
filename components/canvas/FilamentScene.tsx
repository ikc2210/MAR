'use client';

import { useEffect, useRef } from 'react';

type Mode = 'white' | 'purple' | 'blue';

function hn(n: number) { return (Math.sin(n * 127.1 + 311.7) * 43758.5453) % 1; }
function fadeF(t: number) { return t * t * (3 - 2 * t); }
function lerpF(a: number, b: number, t: number) { return a + (b - a) * t; }
function vnoiseF(x: number, y: number, z: number) {
  const ix=Math.floor(x),iy=Math.floor(y),iz=Math.floor(z);
  const fx=fadeF(x-ix),fy=fadeF(y-iy),fz=fadeF(z-iz);
  return lerpF(
    lerpF(lerpF(hn(ix+iy*57+iz*113),hn(ix+1+iy*57+iz*113),fx),lerpF(hn(ix+(iy+1)*57+iz*113),hn(ix+1+(iy+1)*57+iz*113),fx),fy),
    lerpF(lerpF(hn(ix+iy*57+(iz+1)*113),hn(ix+1+iy*57+(iz+1)*113),fx),lerpF(hn(ix+(iy+1)*57+(iz+1)*113),hn(ix+1+(iy+1)*57+(iz+1)*113),fx),fy),
    fz);
}
function fbmF(x: number, y: number, z: number) {
  return vnoiseF(x,y,z)*0.5+vnoiseF(x*2.1+3.7,y*2.1,z*2.1)*0.25+vnoiseF(x*4.2,y*4.2+1.3,z*4.2)*0.125;
}
function sn(x: number, y: number, z: number, T: number) {
  return Math.sin(x*1.6+T*0.31)*Math.cos(y*2.0+T*0.27)+Math.sin(y*1.3+z*1.8+T*0.42)*0.65+Math.cos(z*2.1+x*1.1+T*0.29)*0.55;
}
function curlN(x: number, y: number, z: number, T: number) {
  const e=0.012;
  return {
    x:(sn(x,y+e,z,T)-sn(x,y-e,z,T)-sn(x,y,z+e,T)+sn(x,y,z-e,T))/(2*e),
    y:(sn(x,y,z+e,T)-sn(x,y,z-e,T)-sn(x+e,y,z,T)+sn(x-e,y,z,T))/(2*e),
    z:(sn(x+e,y,z,T)-sn(x-e,y,z,T)-sn(x,y+e,z,T)+sn(x,y-e,z,T))/(2*e),
  };
}

export function FilamentScene({ mode = 'purple' }: { mode?: Mode }) {
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

    const NUM_ANCHORS = 5;
    const anchors = Array.from({length:NUM_ANCHORS},(_,i)=>{
      const a=(i/NUM_ANCHORS)*Math.PI*2;
      return {x:Math.cos(a)*0.3,y:Math.sin(a)*0.2,z:(Math.random()-0.5)*0.3,phase:Math.random()*Math.PI*2,speed:0.0004+Math.random()*0.0003,radius:0.25+Math.random()*0.3};
    });
    function getAP(anchor: typeof anchors[0], T: number) {
      const b=1+Math.sin(T*0.8)*0.12;
      return {x:Math.cos(T*anchor.speed*7+anchor.phase)*anchor.radius*b,y:Math.sin(T*anchor.speed*5+anchor.phase*1.3)*anchor.radius*0.6*b,z:Math.sin(T*anchor.speed*6+anchor.phase*0.7)*anchor.radius*0.5};
    }

    type Pt = {sx:number;sy:number;depth:number;sc:number};
    class Filament {
      ai=Math.floor(Math.random()*NUM_ANCHORS); x=0; y=0; z=0; mL=0; life=0; spd=0; pts:Pt[]=[]; op=0; w=0;
      constructor(stagger:boolean){this.reset(stagger);}
      reset(stagger:boolean){
        const T=t*0.001, a=getAP(anchors[this.ai],T);
        this.x=a.x+(Math.random()-0.5)*0.08; this.y=a.y+(Math.random()-0.5)*0.08; this.z=a.z+(Math.random()-0.5)*0.08;
        this.mL=280+Math.random()*200; this.life=stagger?Math.floor(Math.random()*this.mL):0;
        this.spd=0.008+Math.random()*0.006; this.pts=[]; this.op=0; this.w=0.35+Math.random()*0.3;
        this.ai=Math.floor(Math.random()*NUM_ANCHORS);
      }
      update(){
        this.life++;
        const p=this.life/this.mL;
        this.op=p<0.06?p/0.06:p>0.65?(1-p)/0.35:1;
        if(this.life>this.mL){this.reset(false);return;}
        const T=t*0.001, cv=curlN(this.x,this.y,this.z,T), pull=0.018;
        this.x+=cv.x*this.spd+(0-this.x)*pull*this.spd;
        this.y+=cv.y*this.spd+(0-this.y)*pull*this.spd;
        this.z+=cv.z*this.spd+(0-this.z)*pull*this.spd;
        const ry=t*0.001,rx=Math.sin(t*0.00045)*0.22+0.18;
        const px=this.x*Math.cos(ry)-this.z*Math.sin(ry),pz0=this.x*Math.sin(ry)+this.z*Math.cos(ry);
        const py2=this.y*Math.cos(rx)-pz0*Math.sin(rx),pz2=this.y*Math.sin(rx)+pz0*Math.cos(rx);
        const sc=Math.min(W,H)*0.3,s=3.5/(3.5+pz2+1.2);
        this.pts.push({sx:CX+px*s*sc,sy:CY-py2*s*sc,depth:pz2,sc:s});
        if(this.pts.length>100)this.pts.shift();
      }
      draw(){
        const len=this.pts.length; if(len<3)return;
        const m=modeRef.current;
        for(let i=1;i<len;i++){
          const a=this.pts[i-1],b=this.pts[i],dx=b.sx-a.sx,dy=b.sy-a.sy;
          if(dx*dx+dy*dy>30000)continue;
          const alpha=this.op*(i/len)*(0.35+b.sc*0.65),br=0.55+b.depth*0.2;
          const col=m==='white'?`rgba(${Math.floor(Math.max(155,Math.min(255,br*265)))},${Math.floor(Math.max(155,Math.min(255,br*265)))},${Math.floor(Math.max(155,Math.min(255,br*265)))},${(alpha*0.78).toFixed(3)})`
            :m==='blue'?`rgba(${Math.floor(80+br*80)},${Math.floor(160+br*60)},255,${(alpha*0.84).toFixed(3)})`
            :`rgba(${Math.floor(140+br*80)},${Math.floor(75+br*60)},255,${(alpha*0.84).toFixed(3)})`;
          c.beginPath();c.moveTo(a.sx,a.sy);c.lineTo(b.sx,b.sy);c.strokeStyle=col;c.lineWidth=this.w;c.stroke();
        }
        const tip=this.pts[len-1];
        if(this.op>0.25){
          const gr=c.createRadialGradient(tip.sx,tip.sy,0,tip.sx,tip.sy,5);
          const m=modeRef.current;
          gr.addColorStop(0,m==='white'?`rgba(255,255,255,${(this.op*0.7).toFixed(3)})`:m==='blue'?`rgba(120,200,255,${(this.op*0.75).toFixed(3)})`:`rgba(190,150,255,${(this.op*0.75).toFixed(3)})`);
          gr.addColorStop(1,m==='blue'?'rgba(60,120,255,0)':'rgba(120,80,255,0)');
          c.beginPath();c.arc(tip.sx,tip.sy,5,0,Math.PI*2);c.fillStyle=gr;c.fill();
        }
      }
    }

    const filaments=Array.from({length:70},()=>new Filament(true));
    let animId: number;

    function draw(){
      animId=requestAnimationFrame(draw);
      const T=t*0.001,m=modeRef.current;
      c.fillStyle='rgba(0,0,0,0.11)';c.fillRect(0,0,W,H);
      const breathe=1+Math.sin(T*0.9)*0.08,ox=Math.sin(T*0.7)*W*0.03,oy=Math.cos(T*0.55)*H*0.03;
      const gr=c.createRadialGradient(CX+ox,CY+oy,0,CX+ox,CY+oy,Math.min(W,H)*0.38*breathe);
      gr.addColorStop(0,m==='white'?'rgba(255,255,255,0.038)':m==='blue'?'rgba(60,140,255,0.065)':'rgba(120,75,255,0.065)');
      gr.addColorStop(0.45,m==='white'?'rgba(220,225,255,0.012)':m==='blue'?'rgba(30,80,200,0.022)':'rgba(60,35,200,0.022)');
      gr.addColorStop(1,'rgba(0,0,0,0)');
      c.fillStyle=gr;c.fillRect(0,0,W,H);
      const ry=t*0.001,rx=Math.sin(t*0.00045)*0.22+0.18,scale=Math.min(W,H)*0.3;
      const proj=anchors.map(a=>{const pos=getAP(a,T),px=pos.x*Math.cos(ry)-pos.z*Math.sin(ry),pz0=pos.x*Math.sin(ry)+pos.z*Math.cos(ry),py2=pos.y*Math.cos(rx)-pz0*Math.sin(rx),pz2=pos.y*Math.sin(rx)+pz0*Math.cos(rx),s=3.5/(3.5+pz2+1.2);return{sx:CX+px*s*scale,sy:CY-py2*s*scale};});
      const pulse=0.5+Math.sin(T*1.2)*0.5;c.lineWidth=0.3;
      for(let i=0;i<proj.length;i++)for(let j=i+1;j<proj.length;j++){const a=proj[i],b=proj[j],dist=Math.sqrt((b.sx-a.sx)**2+(b.sy-a.sy)**2);if(dist>scale*0.9)continue;const alpha=(1-dist/(scale*0.9))*0.06*pulse;c.beginPath();c.moveTo(a.sx,a.sy);c.lineTo(b.sx,b.sy);c.strokeStyle=m==='white'?`rgba(255,255,255,${alpha.toFixed(3)})`:m==='blue'?`rgba(120,180,255,${alpha.toFixed(3)})`:`rgba(160,120,255,${alpha.toFixed(3)})`;c.stroke();}
      filaments.forEach(f=>{f.update();f.draw();});
      t++;
    }
    draw();
    const ro=new ResizeObserver(resize);ro.observe(canvas);
    return()=>{cancelAnimationFrame(animId);ro.disconnect();};
  },[]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
