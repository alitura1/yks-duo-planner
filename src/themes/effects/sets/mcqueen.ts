import type { Effect } from "../types"
import { rnd, glow } from "../util"
let bolts:any[] = [], last=0
export const mcqueen: Effect = {
  fps:60,
  init:()=>{bolts=[];last=0},
  frame:(ctx,w,h,t)=>{
    if (t-last>1.2+Math.random()*0.8){
      last=t
      const y=rnd(h*0.25,h*0.75)
      const len=w*rnd(0.6,0.9)
      bolts.push({x:-w*0.1,y,dx:len,dy:len*Math.tan(rnd(-0.12,0.12)),life:220,t:0})
    }
    glow(ctx,w*0.5,h*0.6,Math.min(w,h)*0.35,"rgba(255,170,60,0.06)")
    ctx.lineCap="round"
    for(let i=bolts.length-1;i>=0;i--){
      const b=bolts[i]
      const a=Math.max(0,(b.life-b.t)/b.life)
      ctx.strokeStyle=`rgba(255,158,28,${0.9*a})`
      ctx.lineWidth=2+2*a
      ctx.beginPath()
      ctx.moveTo(b.x+b.t*0.4,b.y)
      ctx.lineTo(b.x+b.dx+b.t*0.4,b.y+b.dy)
      ctx.stroke()
      glow(ctx,b.x+b.dx*0.7,b.y+b.dy*0.7,6,"rgba(255,210,120,0.35)")
      b.t+=18; if(b.t>b.life) bolts.splice(i,1)
    }
  }
}
