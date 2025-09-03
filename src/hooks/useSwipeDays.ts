import { useEffect } from "react";

export function useSwipeDays(onLeft:()=>void, onRight:()=>void){
  useEffect(()=>{
    let startX=0, startY=0, touch=false;
    const onTouchStart=(e:TouchEvent)=>{ touch=true; const t=e.touches[0]; startX=t.clientX; startY=t.clientY; };
    const onTouchEnd=(e:TouchEvent)=>{ if(!touch) return; touch=false; };
    const onTouchMove=(e:TouchEvent)=>{
      if(!touch) return;
      const t=e.touches[0];
      const dx=t.clientX-startX, dy=t.clientY-startY;
      if(Math.abs(dx)>60 && Math.abs(dy)<40){
        if(dx<0) onLeft(); else onRight();
        touch=false;
      }
    };
    window.addEventListener("touchstart", onTouchStart, {passive:true});
    window.addEventListener("touchmove", onTouchMove, {passive:true});
    window.addEventListener("touchend", onTouchEnd);
    return ()=>{
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  },[onLeft,onRight]);
}
