import React, { useEffect, useState } from "react";
import { usePresence } from "../hooks/usePresence";
import { useMinuteTicker } from "../hooks/useMinuteTicker";
import { StatusCard } from "./StatusCard";
import { TaskColumn } from "./TaskColumn";
import { onTasks, createTask, deleteTask, setTaskOrder, toggleTask } from "../api/tasks";
import type { Task, UserProfile } from "../types";
import { useUser } from "../contexts/UserContext";

function formatLastSeen(ts?: number | null) {
  if (!ts) return "Bilinmiyor";
  const diff = Date.now() - ts;
  if (diff < 0) return "az önce";
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "az önce";
  if (mins < 60) return `${mins} dk önce`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} saat önce`;
  const days = Math.floor(hrs / 24);
  return `${days} gün önce`;
}

export const UserPanel: React.FC<{
  label: string;
  selectedDay: string;
  targetUser: UserProfile | undefined;
  canEdit: boolean;
  profile: UserProfile;
  side: "left" | "right";
}> = ({ label, selectedDay, targetUser, canEdit, profile, side }) => {
  const pres = usePresence(targetUser?.id);
  useMinuteTicker();
  const { theme } = useUser(); // kendi kullanıcı teması (sol panelde kullanılacak)

  const [items, setItems] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  // 🔔 Görevleri dinle
  useEffect(() => {
    if (!targetUser?.id) return;
    return onTasks(targetUser.id, selectedDay, setItems);
  }, [targetUser?.id, selectedDay]);

  // ➕ Görev ekle
  const addTask = async () => {
    if (!canEdit) return;
    const raw = newTask.trim();
    if (!raw) return;
    const lines = raw.split("\n").map((s) => s.trim()).filter(Boolean);
    for (const line of lines) {
      await createTask(targetUser!.id, selectedDay, line);
    }
    setNewTask("");
  };

  // 🎨 Tema seçimi
  const appliedTheme =
    side === "right"
      ? targetUser?.theme || "minimal" // sağ panel → karşı tarafın teması
      : theme || "minimal";            // sol panel → kendi seçtiğimiz tema

  return (
    <div className={`panel theme-${appliedTheme}`}>
      {/* HEADER */}
      <div
        className="panelHeader relative flex items-center gap-3 px-4 py-3 rounded-t-xl overflow-hidden"
        style={{
          backgroundImage: targetUser?.statusGifUrl ? `url(${targetUser.statusGifUrl})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {targetUser?.statusGifUrl && <div className="absolute inset-0 bg-black/50" />}
        <div className="relative flex items-center gap-3 z-10">
          <img
            src={
              targetUser?.photoURL ||
              (targetUser as any)?.photoUrl ||
              (targetUser as any)?.photourl ||
              (targetUser as any)?.avatar ||
              "/default-avatar.png"
            }
            alt={targetUser?.displayName || "avatar"}
            title={targetUser?.displayName || label}
            className="w-14 h-14 rounded-full object-cover border-2 border-white"
          />
          <div className="flex flex-col text-white">
            <div className="flex items-center gap-2 font-semibold">
              <span className={`presence-dot ${pres.online ? "presence-on" : "presence-off"}`} />
              {targetUser?.displayName || label}
            </div>
            <span className="text-xs text-gray-200">
              {pres.online ? "Çevrimiçi" : `Son görülme: ${formatLastSeen(pres.lastSeen)}`}
            </span>
          </div>
        </div>
        <div className="ml-auto relative z-10 chip bg-white/20 text-white">
          Tema: {appliedTheme}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col gap-4">
        <StatusCard targetUser={targetUser} canEdit={canEdit} />

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <strong>{selectedDay}</strong>{" "}
              <span className="chip">
                {items.filter((i) => i.done).length}/{items.length} tamamlandı
              </span>
            </div>
            <div className="hint">Enter = ekle · Sürükle-bırak</div>
          </div>

          <div className="flex gap-2 mt-2">
            <input
              id={`newTask-${side}`}
              className="input"
              placeholder={`${targetUser?.displayName || "Kullanıcı"} için görev…`}
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              disabled={!canEdit}
              onKeyDown={(e) => {
                if (e.key === "Enter") addTask();
              }}
            />
            <button className="btn" onClick={addTask} disabled={!canEdit}>
              Ekle
            </button>
          </div>

          <div className="mt-3">
            <TaskColumn
              items={items}
              canEdit={canEdit}
              onToggle={(t) => toggleTask(t.id, !t.done)}
              onReorder={async (ordered) => {
                for (let i = 0; i < ordered.length; i++) {
                  await setTaskOrder(ordered[i].id, Date.now() + i);
                }
              }}
              onDelete={(t) => {
                if (confirm("Görevi silmek istiyor musun?")) deleteTask(t.id);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
