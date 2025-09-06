import React, { useEffect, useRef } from "react"
import "../../theme-canvas.css"
import { effectsRegistry, effectKeyFromTheme } from "../effects/registry"

export type EffectFn = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void

interface Props {  }

const CanvasOverlay: React.FC<Props> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const lastTs = useRef(0)
  const acc = useRef(0)

  useEffect(()=>{
    const canvas = canvasRef.current!
    const ctx = canvas.getContext("2d")!
    let dpr = Math.max(1, window.devicePixelRatio || 1)

    function resize(){
      const w = window.innerWidth, h = window.innerHeight
      canvas.style.width = w + "px"
      canvas.style.height = h + "px"
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      // map to CSS pixels so drawing uses CSS pixels coordinates
      ctx.setTransform(dpr,0,0,dpr,0,0)
    }
    resize()
    window.addEventListener("resize", resize)

    function tick(ts:number){
      if (!lastTs.current) lastTs.current = ts
      const delta = (ts - lastTs.current) / 1000
      lastTs.current = ts

      // clear full canvas each frame
      ctx.clearRect(0,0,canvas.width/dpr, canvas.height/dpr)

      // find all panels on the page
      const panels = Array.from(document.querySelectorAll<HTMLElement>(".panel[data-theme]") || [])

      const now = performance.now() / 1000

      panels.forEach((panel)=>{
        const rect = panel.getBoundingClientRect()
        if (rect.width <= 0 || rect.height <= 0) return
        // map rect coords to canvas CSS pixels (ctx already in CSS px because of setTransform)
        const canvasRect = canvas.getBoundingClientRect()
        const x = rect.left - canvasRect.left
        const y = rect.top - canvasRect.top
        const w = rect.width
        const h = rect.height

        // find theme for this panel and corresponding effect
        const theme = panel.getAttribute('data-theme') || ''
        const key = effectKeyFromTheme(theme)
        const effect = effectsRegistry[key] as any

        if (!effect || !effect.frame) return

        // clip to panel and translate so effect draws relative to panel top-left
        ctx.save()
        ctx.beginPath()
        ctx.rect(x, y, w, h)
        ctx.clip()
        ctx.translate(x, y)

        try{
          // call effect frame with panel-local width/height and current time
          effect.frame(ctx as CanvasRenderingContext2D, w, h, now)
        }catch(e){
          // swallow errors so other panels still render
          // console.error(e)
        }

        ctx.restore()
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return ()=>{
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return <div className="theme-canvas-host" aria-hidden><canvas className="theme-canvas" ref={canvasRef} /></div>
}
export default CanvasOverlay
