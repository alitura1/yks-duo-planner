import type { Effect } from "../types"
import { rnd, glow } from "../util"
let pulses: any[] = []
export const batman: Effect = { fps: 45, init: ()=>{pulses=[]}, frame:(ctx,w,h,t)=>{
  // vignette
  const g = ctx.createLinearGradient(0,0,0,h)
  g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(1,'rgba(0,0,0,0.35)')
  ctx.fillStyle = g; ctx.fillRect(0,0,w,h)
  // occasional yellow pulse
  if (Math.random()<0.01) pulses.push({x: rnd(w*0.2,w*0.8), y: rnd(h*0.1,h*0.4), r: rnd(20,60), life: rnd(0.6,1.2), t:0})
  for(let i=pulses.length-1;i>=0;i--){
    const p = pulses[i]; const a = Math.max(0,1 - p.t/p.life)
    glow(ctx,p.x,p.y,p.r * a, `rgba(255,220,80,${0.25*a})`)
    p.t += 1/45
    if (p.t > p.life) pulses.splice(i,1)
  }
}}