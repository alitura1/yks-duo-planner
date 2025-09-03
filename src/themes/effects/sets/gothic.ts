import type { Effect } from "../types"
let phase=0
export const gothic: Effect = { fps:40, init:()=>{phase=0}, frame:(ctx,w,h,t)=>{
  phase+=0.02
  const g=ctx.createRadialGradient(w*0.5,h*0.7,10,w*0.5,h*0.7,Math.min(w,h)*0.6)
  g.addColorStop(0,"rgba(200,200,200,0.06)"); g.addColorStop(1,"transparent")
  ctx.fillStyle=g; ctx.fillRect(0,0,w,h)
  ctx.globalAlpha=0.14+Math.sin(phase)*0.04; ctx.beginPath(); ctx.arc(60,80,26,0,Math.PI*2); ctx.fillStyle="#fff"; ctx.fill(); ctx.globalAlpha=1
}}
