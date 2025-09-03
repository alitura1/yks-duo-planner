import React from "react";

export const BottomNav: React.FC<{active:string,onChange:(k:string)=>void}> = ({active,onChange}) => {
  const items = [
    {k:"tasks", label:"Görevler", icon:"📋"},
    {k:"photos",label:"Fotoğraflar", icon:"🖼️"},
    {k:"settings",label:"Ayarlar", icon:"⚙️"},
    {k:"profile",label:"Profil", icon:"🙂"},
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden bg-[color:rgba(17,24,39,.85)] backdrop-blur border-t border-white/10 flex justify-around py-2 z-50">
      {items.map(it=>(
        <button key={it.k} onClick={()=>onChange(it.k)} className={`px-3 py-1 rounded-xl ${active===it.k?"bg-white/10":""}`}>
          <div className="text-lg">{it.icon}</div>
          <div className="text-[10px] opacity-80">{it.label}</div>
        </button>
      ))}
    </div>
  );
};
