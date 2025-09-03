import React, { useEffect, useRef } from "react"
import "../../theme-canvas.css"

export type EffectFn = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void

interface Props { effect: { init?: (w:number,h:number)=>void|(()=>void); frame: EffectFn; fps?: number } }

const CanvasOverlay: React.FC<Props> = ({ effect }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const lastTs = useRef(0)
  const acc = useRef(0)
  const cleanupRef = useRef<null | (()=>void)>(null)

  useEffect(()=>{
    const canvas = canvasRef.current!
    const ctx = canvas.getContext("2d", { alpha: true })!
    const dpr = Math.max(1, window.devicePixelRatio || 1)
    const fps = effect.fps ?? 60
    const frameTime = 1000 / fps

    const resize = () => {
      const w = canvas.clientWidth * dpr
      const h = canvas.clientHeight * dpr
      canvas.width = w; canvas.height = h
      ctx.setTransform(1,0,0,1,0,0)
      ctx.scale(dpr, dpr)
      if (cleanupRef.current) cleanupRef.current()
      if (effect.init){
        const r = effect.init(w/dpr, h/dpr)
        if (typeof r === "function") cleanupRef.current = r
      }
    }
    resize()
    window.addEventListener("resize", resize)

    const tick = (ts:number)=>{
      if (!lastTs.current) lastTs.current = ts
      const delta = ts - lastTs.current
      lastTs.current = ts
      acc.current += delta
      if (acc.current >= frameTime){
        acc.current = acc.current % frameTime
        const w = canvas.width / dpr, h = canvas.height / dpr
        ctx.clearRect(0,0,w,h)
        effect.frame(ctx, w, h, ts/1000)
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return ()=>{
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", resize)
      if (cleanupRef.current) cleanupRef.current()
    }
  }, [effect])

  return <div className="theme-canvas-host" aria-hidden><canvas className="theme-canvas" ref={canvasRef} /></div>
}
export default CanvasOverlay
