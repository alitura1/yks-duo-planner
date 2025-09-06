import type { Effect } from "../types"
import { rnd, glow } from "../util"
let pulses: any[] = []
export const vader: Effect = { fps: 35, init: ()=>{pulses=[]}, frame:(ctx,w,h,t)=>{
  if (Math.random()<0.03) pulses.push({x:rnd(w*0.1,w*0.9), y:rnd(h*0.1,h*0.9), r:rnd(6,40), life:rnd(0.6,1.2), t:0})
  for(let i=pulses.length-1;i>=0;i--){
    const p=pulses[i]; const a = Math.max(0,1 - p.t/p.life)
    glow(ctx,p.x,p.y,p.r*(1-a), `rgba(255,40,40,${0.18*a})`)
    p.t += 1/35
    if (p.t > p.life) pulses.splice(i,1)
  }
}}