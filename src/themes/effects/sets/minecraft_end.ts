import type { Effect } from "../types"
import { rnd } from "../util"
let parts:any[]=[]
export const mineEnd: Effect = { fps:50, init:()=>{parts=[]}, frame:(ctx,w,h,t)=>{
  if (parts.length<18) parts.push({x:rnd(0,w),y:rnd(0,h*0.6),vy:rnd(-0.2,0.2),life:700})
  ctx.fillStyle="rgba(180,0,255,0.7)"
  for(let i=parts.length-1;i>=0;i--){ const p=parts[i]; p.y+=p.vy; p.life--; ctx.fillRect(p.x,p.y,3,3); if(p.life<=0) parts.splice(i,1) }
}}
