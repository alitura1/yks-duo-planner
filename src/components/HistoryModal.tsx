// src/components/HistoryModal.tsx
import React, { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebase";

export default function HistoryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const exportCSV = (week:any) => {
    if (!week) return;
    const rows = [['Title','Done']].concat((week.tasks||[]).map((t:any)=>[t.title, t.done? '1':'0']));
    const csv = rows.map(r=> r.map(c=> '"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `week-${week.weekStart}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  const { profile } = useUser();
  const [weeks, setWeeks] = useState<any[]>([]);

  useEffect(() => {
    if (!open || !profile) return;
    (async () => {
      const q = query(collection(db, "weekHistory"), where("userId","==",profile.id), orderBy("createdAt","desc"));
      const snap = await getDocs(q);
      const arr: any[] = [];
      snap.forEach(d => arr.push({ id: d.id, ...d.data() }));
      setWeeks(arr);
    })();
  }, [open, profile]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-3xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Haftalık Geçmiş</h3>
          <button onClick={onClose} className="btn">Kapat</button>
        </div>

        {weeks.length===0 && <div>Geçmiş bulunamadı.</div>}

        <div className="space-y-3 max-h-[60vh] overflow-auto">
          {weeks.map(w => (
            <React.Fragment key={w.id}>
              <div className="flex justify-end space-x-2">
                <button className="btn" onClick={()=>exportCSV(w)}>Export CSV</button>
              </div>
              <div className="mt-2"></div>
              <div className="p-3 border rounded">
                <div className="flex justify-between items-center">
                  <div><strong>{w.weekStart}</strong> — {w.stats?.rate || 0}%</div>
                  <div>{w.stats?.completed}/{w.stats?.total} tamamlandı</div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {w.tasks && w.tasks.length>0 ? (
                    <ul className="list-disc ml-5">
                      {w.tasks.map((t:any)=> <li key={t.id}>{t.title} {t.done ? "✓" : ""}</li>)}
                    </ul>
                  ) : <div>Bu hafta için görev yoktu.</div>}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
