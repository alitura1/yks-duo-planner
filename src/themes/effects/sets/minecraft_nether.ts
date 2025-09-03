import type { Effect } from "../types"
import { rnd } from "../util"
let embers:any[]=[]
export const mineNether: Effect = { fps:60, init:()=>{embers=[]}, frame:(ctx,w,h,t)=>{
  if (embers.length<22) embers.push({x:rnd(0,w),y:h+10,vy:rnd(0.6,1.2),life:600})
  for(let i=embers.length-1;i>=0;i--){ const e=embers[i]; e.y-=e.vy; e.life--; ctx.fillStyle="rgba(255,80,0,0.8)"; ctx.beginPath(); ctx.arc(e.x,e.y,2,0,Math.PI*2); ctx.fill(); if(e.y<-10||e.life<=0) embers.splice(i,1) }
}}
