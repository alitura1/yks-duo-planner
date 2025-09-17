// src/components/Badges.tsx
import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "../contexts/UserContext";

export default function Badges() {
  const { profile } = useUser();
  const [badges, setBadges] = useState<string[]>([]);
  useEffect(()=>{
    if (!profile) return;
    (async ()=>{
      const q = query(collection(db,"weekHistory"), where("userId","==",profile.id), orderBy("createdAt","desc"));
      const snap = await getDocs(q);
      const weeks: any[] = [];
      snap.forEach(d=> weeks.push(d.data()));
      const earned: string[] = [];
      // Most basic rules
      const last = weeks[0];
      if (last && last.stats && last.stats.rate >= 70) earned.push("Haftalık Başarı");
      // consecutive weeks >=70
      let cons = 0;
      for (let w of weeks) {
        if (w.stats && w.stats.rate >=70) cons++; else break;
      }
      if (cons >= 4) earned.push("İstikrarlı (4 hafta)");
      setBadges(earned);
    })();
  },[profile]);
  if (!profile) return null;
  return (
    <div className="flex items-center space-x-2">
      {badges.length===0 && <div className="text-sm text-muted-foreground">Rozet yok</div>}
      {badges.map(b=> <div key={b} className="px-2 py-1 bg-yellow-100 dark:bg-yellow-800 rounded">{b}</div>)}
    </div>
  );
}