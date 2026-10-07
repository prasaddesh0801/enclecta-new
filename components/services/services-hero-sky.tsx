import "./services-hero-sky.css";

/* Clean service-hero sky: pastel atmosphere + soft rounded cloud banks. */
const rng = (seed:number) => { let s=seed>>>0; return () => { s=(s*1664525+1013904223)>>>0; return s/4294967296; }; };
const n1=(n:number)=>Math.round(n*10)/10;
const STARS=(()=>{const r=rng(909);return Array.from({length:150},()=>({x:n1(r()*1600),y:n1(Math.pow(r(),1.4)*700),r:n1(.5+r()*r()*1.3),o:n1(.45+r()*.55),d:n1(r()*8),t:n1(4+r()*4)}));})();
const DOTS=[[980,300],[640,500],[1180,470],[420,250],[790,120],[1500,380]];
const SHOOTERS=[{hx:750,hy:318,tx:880,ty:236,d:0},{hx:952,hy:332,tx:1150,ty:222,d:2.4},{hx:1480,hy:360,tx:1600,ty:288,d:4.6}];
const SPARKLES=[{x:31,y:11,s:1.5,d:0,mx:88,my:5},{x:45,y:15,s:2.1,d:1.6,off:true},{x:54,y:40,s:1.1,d:2.8,off:true},{x:68,y:20,s:.9,d:3.4,off:true},{x:93,y:10,s:1.3,d:.8,mx:8,my:54},{x:46,y:53,s:.9,d:2.2,off:true}];
const star4=(x:number,y:number,s:number)=>`M${x} ${y-s} Q${x+s*.14} ${y-s*.14} ${x+s} ${y} Q${x+s*.14} ${y+s*.14} ${x} ${y+s} Q${x-s*.14} ${y+s*.14} ${x-s} ${y} Q${x-s*.14} ${y-s*.14} ${x} ${y-s}Z`;
const SPARK_PATH=star4(0,0,10);
/* soft fluffy clouds: wide, flat ellipses [cx, cy, rx, ry], heavily feathered so there are no hard bumps or ridges */
const CLOUDS_BACK=[[-300,760,400,200],[1900,790,400,200],[-150,710,400,170],[200,780,380,140],[560,860,380,110],[900,910,420,90],[1300,880,380,120],[1650,800,380,160]];
const CLOUDS_FRONT=[[-260,640,300,200],[1860,720,300,200],[-100,690,230,150],[110,640,210,130],[300,720,230,125],[500,790,230,115],[700,850,220,95],[900,880,230,80],[1100,870,220,90],[1290,830,230,110],[1480,760,230,130],[1680,720,220,140],[40,780,260,150],[250,840,260,120]];

export default function HeroSky(){
 return (
  <div className="sv-hero-bg sky" aria-hidden="true">
  <svg width="0" height="0" style={{position:"absolute"}} focusable="false"><defs>
    <filter id="sky-cloud-soft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="10"/></filter>
    <filter id="sky-cloud-glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="18"/></filter>
    <linearGradient id="sky-cloud-a" gradientUnits="userSpaceOnUse" x1="0" y1="560" x2="0" y2="900"><stop offset="0" style={{stopColor:"var(--sky-cloud-hi)"}}/><stop offset="1" style={{stopColor:"var(--sky-cloud-lo)"}}/></linearGradient><filter id="sky-cloud-edge" x="-20%" y="-30%" width="140%" height="160%"><feGaussianBlur stdDeviation="2"/></filter>
    <linearGradient id="sky-cloud-b" gradientUnits="userSpaceOnUse" x1="0" y1="520" x2="0" y2="900"><stop offset="0" style={{stopColor:"var(--sky-cloud2-hi)"}}/><stop offset="1" style={{stopColor:"var(--sky-cloud2-lo)"}}/></linearGradient>
    {SHOOTERS.map((s,i)=><linearGradient key={i} id={`sky-sh${i}`} gradientUnits="userSpaceOnUse" x1={s.hx} y1={s.hy} x2={s.tx} y2={s.ty}><stop offset="0" stopColor="#fff" stopOpacity=".95"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient>)}
  </defs></svg>

  <div className="sky-fill sky-day"/><div className="sky-fill sky-night"/>

  <svg className="sky-layer sky-day" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" focusable="false">
   {DOTS.map(([x,y],i)=><circle key={i} cx={x} cy={y} r="2.2" fill="#fff" opacity=".8" className="sky-dot" style={{animationDelay:`-${i*1.3}s`}}/>)}
   {SHOOTERS.map((s,i)=><g key={i} className="sky-shooter" style={{animationDelay:`${s.d}s`}}><path d={`M${s.hx} ${s.hy} Q${(s.hx+s.tx)/2-6} ${(s.hy+s.ty)/2-12} ${s.tx} ${s.ty}`} fill="none" stroke={`url(#sky-sh${i})`} strokeWidth="2.4" strokeLinecap="round"/><circle cx={s.hx} cy={s.hy} r="4" fill="#fff"/></g>)}
  </svg>

  <svg className="sky-layer sky-night" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" focusable="false">
   <defs><filter id="sky-neb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="70"/></filter></defs>
   <g filter="url(#sky-neb)"><ellipse cx="1180" cy="330" rx="330" ry="150" fill="#a855f7" opacity=".42"/><ellipse cx="1320" cy="520" rx="260" ry="150" fill="#38bdf8" opacity=".3"/><ellipse cx="900" cy="470" rx="240" ry="120" fill="#ec4899" opacity=".2"/><ellipse cx="300" cy="180" rx="280" ry="130" fill="#4f46e5" opacity=".3"/></g>
   {STARS.map((s,i)=><circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#ece9ff" className="sky-star" style={{"--o":s.o,"--t":`${s.t}s`,"--d":`-${s.d}s`} as React.CSSProperties}/>) }
  </svg>

  {SPARKLES.map((s,i)=><svg key={i} className={`sky-spk${s.off?" sm-off":""}`} viewBox="-11 -11 22 22" focusable="false" style={{"--x":`${s.x}%`,"--y":`${s.y}%`,...(s.mx!=null&&s.my!=null?{"--mx":`${s.mx}%`,"--my":`${s.my}%`}:{}),width:`${s.s}rem`,height:`${s.s}rem`,animationDelay:`-${s.d+1}s`} as React.CSSProperties}><path d={SPARK_PATH}/></svg>)}

  {/* Two smooth, flat cloud banks along the bottom. */}
  <svg className="sky-layer sky-clouds sky-cloud-back" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" focusable="false">
   <g className="sky-drift">
   <g opacity=".75" filter="url(#sky-cloud-edge)">
    {CLOUDS_BACK.map(([cx,cy,rx,ry],i)=><ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#sky-cloud-b)"/>)}
   </g>
     <rect x="-400" y="860" width="2400" height="300" fill="url(#sky-cloud-b)" opacity=".85"/>
   </g>
  </svg>
  <svg className="sky-layer sky-clouds sky-cloud-front" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" focusable="false">
   <g className="sky-drift">
   <g opacity=".95" filter="url(#sky-cloud-edge)">
    {CLOUDS_FRONT.map(([cx,cy,rx,ry],i)=><ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#sky-cloud-a)"/>)}
   </g>
     <rect x="-400" y="870" width="2400" height="300" fill="url(#sky-cloud-a)" opacity=".95"/>
   </g>
  </svg>
  <div className="sky-fill sky-foot"/>
 </div>
 );
}
