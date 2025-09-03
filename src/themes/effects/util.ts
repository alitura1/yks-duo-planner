export const rnd = (min:number,max:number)=> Math.random()*(max-min)+min
export const rr = (n:number)=> Math.round(Math.random()*n)
export function glow(ctx:CanvasRenderingContext2D,x:number,y:number,r:number,col:string){
  const g = ctx.createRadialGradient(x,y,0,x,y,r)
  g.addColorStop(0,col); g.addColorStop(1,"transparent")
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill()
}
