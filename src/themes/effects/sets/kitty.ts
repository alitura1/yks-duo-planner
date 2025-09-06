import type { Effect } from "../types"
import { rnd, glow } from "../util"
let hearts: any[] = []
export const kitty: Effect = { fps: 40, init: ()=>{hearts=[]}, frame:(ctx,w,h,t)=>{
  if (Math.random()<0.05) hearts.push({x:rnd(0,w), y:h+10, vy:rnd(-30,-60), life:rnd(1.2,2.2), t:0, s:rnd(6,14)})
  for(let i=hearts.length-1;i>=0;i--){
    const hrt = hearts[i]; hrt.y += hrt.vy*(1/40); hrt.t += 1/40
    const a = Math.max(0,1 - hrt.t/hrt.life)
    // draw simple heart via two circles and triangle
    ctx.save(); ctx.translate(hrt.x, hrt.y); ctx.scale(hrt.s/10, hrt.s/10)
    ctx.fillStyle = `rgba(255,120,180,${a})`
    ctx.beginPath(); ctx.arc(-3,0,4,0,Math.PI*2); ctx.arc(3,0,4,0,Math.PI*2); ctx.moveTo(-7,4); ctx.lineTo(0,12); ctx.lineTo(7,4); ctx.closePath(); ctx.fill()
    ctx.restore()
    if (hrt.t > hrt.life) hearts.splice(i,1)
  }
}}