import type { Effect } from "../types"
import { rnd } from "../util"
let sabers:any[]=[], last=0
export const vader: Effect = { fps:60, init:()=>{sabers=[];last=0}, frame:(ctx,w,h,t)=>{
  if (t-last>2.6){ last=t; sabers.push({x:-60,y:rnd(h*0.3,h*0.6),len:rnd(w*0.5,w*0.9),life:180,t:0}) }
  for(let i=sabers.length-1;i>=0;i--){ const s=sabers[i]; s.t+=10; const a=Math.max(0,(s.life-s.t)/s.life); const x2=s.x+s.t*1.6;
    ctx.strokeStyle=`rgba(255,0,50,${0.8*a})`; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(s.x,s.y); ctx.lineTo(x2,s.y); ctx.stroke(); if(s.t>s.life) sabers.splice(i,1) }
}}
