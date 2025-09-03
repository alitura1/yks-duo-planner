import type { Effect } from "../types"
let p=0
export const neonOcean: Effect = { fps:50, init:()=>{p=0}, frame:(ctx,w,h,t)=>{
  p+=0.05; ctx.strokeStyle="rgba(0,255,200,0.25)"; ctx.lineWidth=2; ctx.beginPath();
  for(let x=0;x<=w;x+=12){ const y=h*0.65+Math.sin(x*0.03+p)*8; if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y) } ctx.stroke()
}}
