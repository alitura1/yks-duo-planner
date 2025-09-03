import type { Effect } from "../types"
import { rnd } from "../util"
let hearts:any[]=[]
export const kitty: Effect = { fps:50, init:()=>{hearts=[]}, frame:(ctx,w,h,t)=>{
  if (hearts.length<16) hearts.push({x:rnd(10,w-10),y:h+10,vy:rnd(0.6,1.1),s:rnd(6,10)})
  ctx.fillStyle="rgba(255,105,180,0.75)"
  for(let i=hearts.length-1;i>=0;i--){ const he=hearts[i]; he.y-=he.vy;
    ctx.beginPath(); ctx.moveTo(he.x,he.y);
    ctx.bezierCurveTo(he.x-he.s,he.y-he.s,he.x-1.2*he.s,he.y+0.8*he.s,he.x,he.y+1.4*he.s);
    ctx.bezierCurveTo(he.x+1.2*he.s,he.y+0.8*he.s,he.x+he.s,he.y-he.s,he.x,he.y); ctx.fill();
    if(he.y<-20) hearts.splice(i,1) }
}}
