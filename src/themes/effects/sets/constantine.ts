import type { Effect } from "../types"
import { rnd, glow } from "../util"
let rings: any[] = []
export const constantine: Effect = { fps: 40, init: ()=>{rings=[]}, frame:(ctx,w,h,t)=>{
  if (Math.random()<0.02) rings.push({x:rnd(w*0.2,w*0.8), y:rnd(h*0.2,h*0.8), r:rnd(10,60), life:rnd(0.8,1.6), t:0})
  for(let i=rings.length-1;i>=0;i--){
    const r = rings[i]; const a = Math.max(0,1 - r.t/r.life)
    ctx.beginPath(); ctx.arc(r.x, r.y, r.r*(1-a*0.6), 0, Math.PI*2); ctx.strokeStyle = `rgba(255,200,120,${0.25*a})`; ctx.lineWidth = 2; ctx.stroke()
    glow(ctx, r.x, r.y, 8*(1-a), `rgba(255,200,120,${0.18*a})`)
    r.t += 1/40
    if (r.t > r.life) rings.splice(i,1)
  }
}}