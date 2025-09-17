// src/components/StatsModal.tsx
import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "../contexts/UserContext";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function StatsModal({ open, onClose }: { open:boolean; onClose:()=>void }) {
  const { profile } = useUser();
  const [data, setData] = useState<any[]>([]);
  useEffect(()=>{
    if (!open || !profile) return;
    (async ()=>{
      const q = query(collection(db,"weekHistory"), where("userId","==",profile.id), orderBy("createdAt","asc"));
      const snap = await getDocs(q);
      const arr: any[] = [];
      snap.forEach(d=>{
        const dd = d.data();
        const label = dd.weekStart || (dd.createdAt? new Date(dd.createdAt.seconds*1000).toISOString().slice(0,10):'');
        arr.push({ name: label, rate: dd.stats?.rate || 0, completed: dd.stats?.completed || 0 });
      });
      setData(arr);
    })();
  },[open, profile]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-4xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">İstatistikler</h3>
          <button onClick={onClose} className="btn">Kapat</button>
        </div>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0,100]} />
              <Tooltip />
              <Line type="monotone" dataKey="rate" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4">
          <strong>Toplam tamamlanan:</strong> {data.reduce((s,d)=>s+(d.completed||0),0)}
        </div>
      </div>
    </div>
  );
}