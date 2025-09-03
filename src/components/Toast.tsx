import React, { createContext, useContext, useState } from "react";

type Toast = { id: number; text: string; type?: "ok"|"warn"|"err" };
const Ctx = createContext<{push:(t:Omit<Toast,"id">)=>void}>({push:()=>{}});

export const ToastProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [items,setItems] = useState<Toast[]>([]);
  const push = (t: Omit<Toast,"id">) => {
    const id = Date.now()+Math.random();
    setItems((a)=>[...a,{...t,id}]);
    setTimeout(()=>setItems((a)=>a.filter(x=>x.id!==id)), 3000);
  };
  return (
    <Ctx.Provider value={{push}}>
      {children}
      <div className="fixed right-4 top-4 z-[9999] space-y-2">
        {items.map(i=>(
          <div key={i.id} className={`px-4 py-2 rounded-xl shadow-lg text-sm animate-fade-in-up ${i.type==="err"?"bg-red-500/90":i.type==="warn"?"bg-yellow-500/90":"bg-emerald-500/90"} text-white`}>
            {i.text}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
};
export const useToast = () => useContext(Ctx);
