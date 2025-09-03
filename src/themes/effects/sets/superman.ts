import type { Effect } from "../types"
import { rnd } from "../util"
let puffs:any[]=[]
export const superman: Effect = { fps:40, init:()=>{puffs=[]}, frame:(ctx,w,h,t)=>{
  if (puffs.length<8) puffs.push({x:-30,y:rnd(20,h*0.5),vx:rnd(0.6,1.2),s:rnd(18,30),life:600})
  ctx.fillStyle="rgba(255,255,255,0.5)"
  for(let i=puffs.length-1;i>=0;i--){ const p=puffs[i]; p.x+=p.vx; ctx.beginPath(); ctx.arc(p.x,p.y,p.s*0.5+Math.sin(t+p.x)*1.2,0,Math.PI*2); ctx.fill(); p.life--; if(p.x>w+40||p.life<=0) puffs.splice(i,1) }
}}
