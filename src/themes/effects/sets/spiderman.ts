import type { Effect } from "../types"
import { rnd } from "../util"
let webs: any[] = []
export const spiderman: Effect = { fps: 40, init: ()=>{webs=[]}, frame:(ctx,w,h,t)=>{
  if (Math.random()<0.02) webs.push({x: rnd(0,w), y: rnd(0,h), life: rnd(0.6,1.2), t:0})
  ctx.strokeStyle='rgba(255,255,255,0.06)'; ctx.lineWidth=1
  for(let i=webs.length-1;i>=0;i--){
    const wv = webs[i]; const a = Math.max(0,1 - wv.t/wv.life)
    for(let j=0;j<6;j++){
      ctx.beginPath()
      ctx.moveTo(wv.x,wv.y)
      const ang = j*(Math.PI*2/6)
      ctx.lineTo(wv.x + Math.cos(ang)* (30*(1-a)), wv.y + Math.sin(ang)*(30*(1-a)))
      ctx.stroke()
    }
    wv.t += 1/40
    if (wv.t > wv.life) webs.splice(i,1)
  }
}}