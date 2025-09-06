import type { Effect } from "../types"
import { rnd } from "../util"
let dust:any[]=[]
export const mineMining: Effect = { fps: 30, init: ()=>{dust=[]}, frame:(ctx,w,h,t)=>{
  if (Math.random()<0.05) dust.push({x:rnd(0,w), y:rnd(0,h), vx:rnd(-10,10), vy:rnd(-20,20), life:rnd(0.6,1.4), t:0})
  for(let i=dust.length-1;i>=0;i--){
    const d=dust[i]; d.x += d.vx*(1/30); d.y += d.vy*(1/30); d.t += 1/30
    const a = Math.max(0,1 - d.t/d.life)
    ctx.fillStyle = `rgba(200,180,140,${0.6*a})`; ctx.fillRect(d.x,d.y,2,2)
    if (d.t > d.life) dust.splice(i,1)
  }
}}