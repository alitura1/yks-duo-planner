import type { Effect } from "../types"
import { rnd, glow } from "../util"
let rings: any[] = []
const colors = ['#ff8fb3','#ffd1e0','#c3e7ff','#e6ffe6','#ffe5b3']
export const mlp: Effect = { fps: 40, init: ()=>{rings=[]}, frame:(ctx,w,h,t)=>{
  if (Math.random()<0.03) rings.push({x:rnd(0,w), y:rnd(0,h), r:rnd(10,60), life:rnd(0.8,1.6), t:0, color: colors[Math.floor(Math.random()*colors.length)]})
  for(let i=rings.length-1;i>=0;i--){
    const r = rings[i]; const a = Math.max(0,1 - r.t/r.life)
    ctx.beginPath(); ctx.arc(r.x, r.y, r.r*(1-a*0.6), 0, Math.PI*2); ctx.strokeStyle = r.color; ctx.lineWidth = 3*(1-a); ctx.stroke()
    glow(ctx, r.x, r.y, 6*(1-a), r.color)
    r.t += 1/40
    if (r.t > r.life) rings.splice(i,1)
  }
}}