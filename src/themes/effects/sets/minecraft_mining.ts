import type { Effect } from "../types"
import { rnd } from "../util"
let cubes:any[]=[]
export const mineMining: Effect = { fps:50, init:()=>{cubes=[]}, frame:(ctx,w,h,t)=>{
  if (cubes.length<8) cubes.push({x:rnd(20,w-20),y:-10,vy:rnd(0.5,1.0),life:900})
  ctx.fillStyle="rgba(50,150,50,0.9)"
  for(let i=cubes.length-1;i>=0;i--){ const c=cubes[i]; c.y+=c.vy; c.life--; ctx.fillRect(c.x,c.y,8,8); if(c.y>h+20||c.life<=0) cubes.splice(i,1) }
}}
