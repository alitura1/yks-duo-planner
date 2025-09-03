import type { Effect } from "../types"
import { rnd } from "../util"
let bats:any[]=[], last=0
export const batman: Effect = { fps:50, init:()=>{bats=[];last=0}, frame:(ctx,w,h,t)=>{
  if (t-last>1.5 && bats.length<10){ last=t; bats.push({x:-40,y:rnd(40,h*0.7),vx:rnd(1.2,2.2),vy:rnd(-0.3,0.3),s:rnd(10,18),t:0,life:560}) }
  ctx.globalAlpha=0.9
  for(let i=bats.length-1;i>=0;i--){ const b=bats[i]; b.x+=b.vx; b.y+=b.vy+Math.sin(b.t*0.15)*0.3; b.t+=1;
    ctx.fillStyle="rgba(0,0,0,0.65)"; ctx.beginPath(); ctx.ellipse(b.x,b.y,b.s,b.s*0.6,0,0,Math.PI*2); ctx.fill();
    ctx.fillRect(b.x-b.s*0.2,b.y-b.s*0.15,b.s*0.4,b.s*0.3);
    if(b.x>w+40||b.t>b.life) bats.splice(i,1)
  }
}}
