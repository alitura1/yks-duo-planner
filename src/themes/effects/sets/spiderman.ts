import type { Effect } from "../types"
import { rnd } from "../util"
let strands:any[]=[], last=0
export const spiderman: Effect = { fps:50, init:()=>{strands=[];last=0}, frame:(ctx,w,h,t)=>{
  if (t-last>2.2 && strands.length<6){ last=t; strands.push({x:rnd(20,w-20),y:-20,len:rnd(60,120),t:0,life:260}) }
  ctx.strokeStyle="rgba(230,230,230,0.7)"; ctx.lineWidth=1
  for(let i=strands.length-1;i>=0;i--){ const s=strands[i]; s.t+=1.5; const y2=s.y+Math.min(s.len,s.t);
    ctx.beginPath(); ctx.moveTo(s.x,s.y); ctx.quadraticCurveTo(s.x+10,s.y+(y2-s.y)/2,s.x,y2); ctx.stroke();
    if (y2>=s.y+s.len){ s.life-=2; if(s.life<=0) strands.splice(i,1) }
  }
}}
