import type { Effect } from "../types"
import { rnd, glow } from "../util"
let stars: any[] = []
export const superman: Effect = { fps: 40, init: ()=>{stars=[]}, frame:(ctx,w,h,t)=>{
  if (Math.random()<0.04) stars.push({x:rnd(0,w), y:rnd(0,h*0.6), life:rnd(0.8,1.6), t:0, r:rnd(1,3)})
  for(let i=stars.length-1;i>=0;i--){
    const s=stars[i]; const a = Math.max(0,1 - s.t/s.life)
    glow(ctx,s.x,s.y,4*s.r, `rgba(255,250,200,${0.25*a})`)
    s.t += 1/40
    if (s.t > s.life) stars.splice(i,1)
  }
}}