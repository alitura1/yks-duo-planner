import type { Effect } from "../types"
import { rnd } from "../util"
let petals:any[]=[]
export const mineFlowers: Effect = { fps: 30, init: ()=>{petals=[]}, frame:(ctx,w,h,t)=>{
  if (Math.random()<0.06) petals.push({x:rnd(0,w), y:h+10, vy:rnd(-10,-40), life:rnd(1.5,3), t:0, s:rnd(6,12)})
  ctx.globalCompositeOperation = 'lighter'
  for(let i=petals.length-1;i>=0;i--){
    const p=petals[i]; p.y += p.vy*(1/30); p.t += 1/30
    ctx.fillStyle = 'rgba(255,200,180,0.9)'
    ctx.beginPath(); ctx.ellipse(p.x, p.y, p.s, p.s*0.6, Math.sin(p.t*2), 0, Math.PI*2); ctx.fill()
    if (p.t > p.life) petals.splice(i,1)
  }
  ctx.globalCompositeOperation = 'source-over'
}}