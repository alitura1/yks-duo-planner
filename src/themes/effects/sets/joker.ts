import type { Effect } from "../types"
import { rnd, rr } from "../util"
let pieces:any[]=[]
export const joker: Effect = { fps:50, init:()=>{pieces=[]}, frame:(ctx,w,h,t)=>{
  if (pieces.length<12) pieces.push({x:rnd(0,w),y:-20,vx:rnd(-0.5,0.5),vy:rnd(0.8,1.4),rot:rnd(0,Math.PI*2),rps:rnd(-1,1)*0.02,life: rr(600)+400, suit: rr(3)})
  for(let i=pieces.length-1;i>=0;i--){ const p=pieces[i]; p.x+=p.vx; p.y+=p.vy; p.rot+=p.rps; ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot);
    ctx.fillStyle=["#39ff14","#a100ff","#ff006e","#00f5d4"][p.suit%4]; ctx.fillRect(-6,-9,12,18); ctx.restore(); p.life--; if(p.y>h+30||p.life<=0) pieces.splice(i,1) }
}}
