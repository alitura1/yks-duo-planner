import React, { useEffect, useState, useMemo } from "react";
import { getTheme, themes } from "../themes";
import { usePresence } from "../hooks/usePresence";
import { useMinuteTicker } from "../hooks/useMinuteTicker";
import { StatusCard } from "./StatusCard";
import { TaskColumn } from "./TaskColumn";
import {
  onTasks,
  createTask,
  deleteTask,
  setTaskOrder,
  toggleTask,
} from "../api/tasks";
import type { Task, UserProfile } from "../types";
import { useUser } from "../contexts/UserContext";

// 🎁 ödül sistemi
import { GiftButton } from "../features/rewards/GiftButton";
import { rollRewardForUser } from "../features/rewards/api";
import { useRewardSounds } from "../features/rewards/useRewardSounds";

// 🎉 yeni popup sistemi
import RewardPopup from "../features/rewards/RewardPopup";
import { useRewardPopup } from "../features/rewards/useRewardPopup";

// firestore güncelleme için
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

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
  profile: UserProfile | null; // 🔒 null olabilir
  side: "left" | "right";
}> = ({ label, selectedDay, targetUser, canEdit, profile, side }) => {
  // null kontrolü olmazsa `id` hatası veriyor
  const targetUserId = targetUser?.id ?? null;
  const profileId = profile?.id ?? null;

  const pres = usePresence(targetUserId || undefined);
  useMinuteTicker();
  const { theme, isGuest } = useUser();

  const [items, setItems] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  const sfx = useRewardSounds();
  const { reward, showReward } = useRewardPopup();

  // 🔔 Görevleri dinle
  useEffect(() => {
    if (!targetUserId) return;
    return onTasks(targetUserId, selectedDay, setItems);
  }, [targetUserId, selectedDay]);

  // ➕ Görev ekle
  const addTask = async () => {
    if (!canEdit || !targetUserId) return;
    const raw = newTask.trim();
    if (!raw) return;
    const lines = raw.split("\n").map((s) => s.trim()).filter(Boolean);
    for (const line of lines) {
      await createTask(targetUserId, selectedDay, line);
    }
    setNewTask("");
  };

  // ✅ Görev toggle + ödül popup
  async function handleToggleTask(t: Task, newDone: boolean) {
    if (isGuest) return; // misafirler görev oynayamaz
    await toggleTask(t.id, newDone);

    if (newDone && !t.rewardGiven) {
      try {
        const res = await rollRewardForUser(t.ownerUid);
        if (res.won) {
          sfx.won();
          showReward(res.name); // 🎁 popup + ses
        }

        // 🔒 Ödül hakkı tüketilmeli
        await updateDoc(doc(db, "tasks", t.id), { rewardGiven: true });

        // ✅ Optimistik güncelleme
        setItems((prev) =>
          prev.map((it) =>
            it.id === t.id ? { ...it, rewardGiven: true } : it
          )
        );
      } catch (err) {
        console.error("Ödül kontrolü hatası:", err);
      }
    }
  }

  // 🎨 Tema seçimi
  const appliedTheme =
    side === "right" ? targetUser?.theme || "minimal" : theme || "minimal";

  const themeMap = useMemo(
    () => Object.fromEntries(themes.map((t) => [t.value, t])),
    []
  );
  const themeDef = getTheme(appliedTheme);

  return (
    <div className="relative">
      {/* 🎁 Ödül Popup */}
      <RewardPopup reward={reward} themeKey={appliedTheme} />

      <div
        className="panel"
        data-theme={appliedTheme}
        style={{
          ["--theme-bg" as any]: themeDef.colors.bg,
          ["--theme-panel" as any]: themeDef.colors.panel,
          ["--theme-header" as any]: themeDef.colors.header,
          ["--theme-text" as any]: themeDef.colors.text,
          ["--theme-accent" as any]: themeDef.colors.accent,
          ["--theme-border" as any]: themeDef.colors.border,
          ["--theme-input" as any]: themeDef.colors.input,
          backgroundImage: themeDef.backgroundImage,
        }}
      >
        {/* HEADER */}
        <div
          className="panelHeader relative flex items-center gap-3 px-4 py-3 rounded-t-xl overflow-hidden"
          style={{
            backgroundImage: targetUser?.statusGifUrl
              ? `url(${targetUser.statusGifUrl})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {targetUser?.statusGifUrl && (
            <div className="absolute inset-0 bg-[var(--bg)]/50" />
          )}
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
            <div className="flex flex-col text-[var(--text)]">
              <div className="flex items-center gap-2 font-semibold">
                <span
                  className={`presence-dot ${
                    pres.online ? "presence-on" : "presence-off"
                  }`}
                />
                {targetUser?.displayName || label}
              </div>
              <span className="text-xs text-[color:rgba(255,255,255,0.8)]">
                {pres.online
                  ? "Çevrimiçi"
                  : `Son görülme: ${formatLastSeen(pres.lastSeen)}`}
              </span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2 relative z-10">
            <div className="chip bg-white/20 text-[var(--text)]">
              Tema: {appliedTheme}
            </div>
            {profileId && (
              <GiftButton
                currentUserId={profileId}
                viewingUserId={targetUserId || ""}
              />
            )}
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-4 flex flex-col gap-4">
          <StatusCard targetUser={targetUser} canEdit={canEdit} />

          <div className="card bg-[var(--panel)]">
            <div className="flex items-center justify-between">
              <div>
                <strong>{selectedDay}</strong>{" "}
                <span className="chip">
                  {items.filter((i) => i.done).length}/{items.length} tamamlandı
                </span>
              </div>
              <div className="hint">Enter = ekle · Sürükle-bırak</div>
            </div>

            {/* Görev ekleme inputu */}
            <div className="flex gap-2 mt-2">
              <input
                id={`newTask-${side}`}
                className="input"
                placeholder={`${
                  targetUser?.displayName || "Kullanıcı"
                } için görev…`}
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                disabled={!canEdit || isGuest || !targetUserId}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addTask();
                }}
              />
              <button
                className="btn"
                onClick={addTask}
                disabled={!canEdit || isGuest || !targetUserId}
              >
                Ekle
              </button>
            </div>

            <div className="mt-3">
              <TaskColumn
                items={items}
                canEdit={canEdit && !isGuest}
                onToggle={handleToggleTask}
                onReorder={async (ordered) => {
                  for (let i = 0; i < ordered.length; i++) {
                    await setTaskOrder(ordered[i].id, i);
                  }
                }}
                onDelete={(t, skipConfirm = false) => {
                  if (!skipConfirm && !confirm("Görevi silmek istiyor musun?"))
                    return;
                  deleteTask(t.id);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
