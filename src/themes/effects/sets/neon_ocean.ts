import type { Effect } from "../types"
import { rnd } from "../util"
let phase = 0
export const neonOcean: Effect = { fps: 40,
  init: ()=>{ phase = 0 },
  frame: (ctx,w,h,t)=>{
    phase += 0.02
    ctx.lineWidth = 1.2
    for(let i=0;i<3;i++){
      ctx.beginPath()
      const amp = 6 + i*3
      const y0 = h*0.6 + i*10
      for(let x=0;x<=w;x+=6){
        const y = y0 + Math.sin((x*0.02) + phase + i) * amp
        if (x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y)
      }
      ctx.strokeStyle = `rgba(0,210,255,${0.12 + i*0.06})`
      ctx.stroke()
    }
  }
}
