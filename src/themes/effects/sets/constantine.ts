import type { Effect } from "../types"
import { rnd } from "../util"
let sparks:any[]=[]
export const constantine: Effect = { fps:60, init:()=>{sparks=[]}, frame:(ctx,w,h,t)=>{
  if (sparks.length<40) sparks.push({x:rnd(w*0.3,w*0.7),y:rnd(h*0.4,h*0.7),vx:rnd(-0.5,0.5),vy:rnd(-0.5,-1.2),life:80})
  ctx.globalCompositeOperation="lighter"
  for(let i=sparks.length-1;i>=0;i--){ const s=sparks[i]; s.x+=s.vx; s.y+=s.vy; s.life--; const a=Math.max(0,s.life/80);
    ctx.fillStyle=`rgba(255,196,86,${0.6*a})`; ctx.beginPath(); ctx.arc(s.x,s.y,2,0,Math.PI*2); ctx.fill(); if(s.life<=0) sparks.splice(i,1) }
  ctx.globalCompositeOperation="source-over"
}}
