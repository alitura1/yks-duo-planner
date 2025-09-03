import type { Effect } from "../types"
import { rnd } from "../util"
let stars:any[]=[]
export const mlp: Effect = { fps:50, init:()=>{stars=[]}, frame:(ctx,w,h,t)=>{
  if (stars.length<25) stars.push({x:rnd(0,w),y:rnd(0,h*0.6),vx:rnd(-0.2,0.2),vy:rnd(-0.1,0.1),r:rnd(1,2.5)})
  for(let i=0;i<stars.length;i++){ const s=stars[i]; s.x+=s.vx; s.y+=s.vy; ctx.fillStyle="rgba(255,200,255,0.8)"; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
    if(s.x<-10||s.x>w+10||s.y<-10||s.y>h*0.8){ stars.splice(i,1); i-- } }
}}
