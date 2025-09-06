import type { Effect } from "../types"
import { rnd, glow } from "../util"
let motes:any[]=[]
export const mineEnd: Effect = { fps: 30, init: ()=>{motes=[]}, frame:(ctx,w,h,t)=>{
  if (Math.random()<0.04) motes.push({x:rnd(0,w), y:rnd(0,h), vx:rnd(-6,6), vy:rnd(-6,6), life:rnd(1.6,3), t:0, r:rnd(1,4)})
  for(let i=motes.length-1;i>=0;i--){
    const m=motes[i]; m.x += m.vx*(1/30); m.y += m.vy*(1/30); m.t += 1/30
    const a = Math.max(0,1 - m.t/m.life)
    glow(ctx,m.x,m.y, m.r*3, `rgba(170,120,255,${0.2*a})`)
    if (m.t > m.life) motes.splice(i,1)
  }
}}