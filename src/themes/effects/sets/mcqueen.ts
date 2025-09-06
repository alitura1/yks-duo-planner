import type { Effect } from "../types"
import { rnd, glow } from "../util"

let sparks: any[] = []
export const mcqueen: Effect = {
  fps: 60,
  init: ()=>{ sparks = [] },
  frame: (ctx,w,h,t)=>{
    // spawn occasionally near left area
    if (Math.random() < 0.03){
      sparks.push({x: rnd(0,w*0.6), y: rnd(h*0.3,h*0.9), vx: rnd(20,60), vy: rnd(-20,20), life: rnd(0.6,1.4), t:0})
    }
    for(let i=sparks.length-1;i>=0;i--){
      const s = sparks[i]
      const a = Math.max(0,1 - s.t/s.life)
      ctx.strokeStyle = `rgba(255,180,60,${0.9*a})`
      ctx.lineWidth = 2 + 2*a
      ctx.beginPath()
      ctx.moveTo(s.x, s.y)
      ctx.lineTo(s.x + s.vx * s.t, s.y + s.vy * s.t)
      ctx.stroke()
      glow(ctx, s.x + s.vx * s.t, s.y + s.vy * s.t, 6*a, `rgba(255,210,120,${0.35*a})`)
      s.t += 1/60
      if (s.t > s.life) sparks.splice(i,1)
    }
  }
}
