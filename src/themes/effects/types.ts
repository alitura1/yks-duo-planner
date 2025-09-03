export interface Effect { init?: (w:number,h:number)=>void|(()=>void); frame: (ctx:CanvasRenderingContext2D,w:number,h:number,t:number)=>void; fps?:number }
