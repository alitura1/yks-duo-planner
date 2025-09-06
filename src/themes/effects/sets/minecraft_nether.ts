import type { Effect } from "../types"
import { rnd, glow } from "../util"
let embers:any[]=[]
export const mineNether: Effect = { fps: 30, init: ()=>{embers=[]}, frame:(ctx,w,h,t)=>{
  if (Math.random()<0.06) embers.push({x:rnd(0,w), y:h+10, vy:rnd(-30,-60), life:rnd(1.2,2.4), t:0, r:rnd(2,6)})
  for(let i=embers.length-1;i>=0;i--){
    const e=embers[i]; e.y += e.vy*(1/30); e.t += 1/30
    const a = Math.max(0,1 - e.t/e.life)
    glow(ctx,e.x,e.y, e.r*2, `rgba(255,90,20,${0.18*a})`)
    if (e.t > e.life) embers.splice(i,1)
  }
}}