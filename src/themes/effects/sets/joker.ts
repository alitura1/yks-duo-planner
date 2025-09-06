import type { Effect } from "../types"
import { rnd } from "../util"
let parts: any[] = []
export const joker: Effect = { fps: 40, init: ()=>{parts=[]}, frame:(ctx,w,h,t)=>{
  if (Math.random()<0.06) parts.push({x:rnd(0,w), y: -10, vx: rnd(-10,10), vy: rnd(20,60), life: rnd(1.2,2.5), t:0, c: Math.random()<0.5? 'rgba(160,40,200,0.9)':'rgba(80,220,120,0.9)'})
  for(let i=parts.length-1;i>=0;i--){
    const p = parts[i]; p.x += p.vx * (1/40); p.y += p.vy*(1/40); p.t += 1/40
    const a = Math.max(0,1 - p.t/p.life)
    ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, 4, 6)
    if (p.t > p.life || p.y > h+20) parts.splice(i,1)
  }
}}