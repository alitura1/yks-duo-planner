import type { Effect } from "../types"
import { rnd } from "../util"
let petals:any[]=[]
export const mineFlowers: Effect = { fps:50, init:()=>{petals=[]}, frame:(ctx,w,h,t)=>{
  if (petals.length<10) petals.push({x:rnd(0,w),y:-10,vy:rnd(0.4,0.9),rot:rnd(0,Math.PI*2),rps:rnd(-0.02,0.02)})
  for(let i=petals.length-1;i>=0;i--){ const p=petals[i]; p.y+=p.vy; p.rot+=p.rps; ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot);
    ctx.fillStyle="rgba(255,255,255,0.8)"; ctx.beginPath(); ctx.ellipse(0,0,4,2,0,0,Math.PI*2); ctx.fill(); ctx.restore(); if(p.y>h+20) petals.splice(i,1) }
}}
