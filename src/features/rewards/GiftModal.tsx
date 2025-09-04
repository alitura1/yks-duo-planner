import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { listRewards, markRewardUsed } from "./api";
import type { Reward } from "../../types";
import { useRewardSounds } from "./useRewardSounds";

export function GiftModal({
  open,
  onClose,
  ownerId,
  canUse,
  title,
}: {
  open: boolean;
  onClose: () => void;
  ownerId: string;
  canUse: boolean;
  title: string;
}) {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(false);
  const sfx = useRewardSounds();

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    listRewards(ownerId).then(setRewards).finally(() => setLoading(false));
  }, [open, ownerId]);

  async function onUse(id: string) {
    await markRewardUsed(id);
    sfx.used();
    const updated = await listRewards(ownerId);
    setRewards(updated);
  }

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Arka plan karartma */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal kutusu */}
      <div
        className="relative w-full max-w-lg mx-auto rounded-2xl shadow-2xl 
                   p-6 z-10 bg-[var(--theme-panel)] text-[var(--theme-text)] 
                   border border-[var(--theme-border)]"
      >
        {/* Başlık */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">🎁 {title}</h2>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-xl border border-[var(--theme-border)] 
                       hover:bg-[var(--theme-accent)] hover:text-white transition"
          >
            ✖
          </button>
        </div>

        {/* İçerik */}
        {loading ? (
          <div className="text-center opacity-70">Yükleniyor…</div>
        ) : rewards.length === 0 ? (
          <div className="text-center opacity-70 text-lg">🎁 Henüz ödül yok</div>
        ) : (
          <ul className="space-y-3">
            {rewards.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between p-4 rounded-xl 
                           border border-[var(--theme-border)] bg-[var(--theme-bg)] shadow-soft"
              >
                <div className="flex flex-col">
                  <span className="font-semibold">{r.name}</span>
                  <span className="text-xs opacity-70">
                    {r.used ? "✅ Kullanıldı" : "⏳ Kullanılmadı"}
                  </span>
                </div>
                {canUse ? (
                  <button
                    disabled={r.used}
                    onClick={() => onUse(r.id)}
                    className="px-3 py-1 rounded-xl bg-[var(--theme-accent)] text-white font-medium 
                               disabled:opacity-40 hover:scale-105 transition"
                  >
                    Kullan
                  </button>
                ) : (
                  <span className="text-xs opacity-50">Sadece sahibi</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>,
    document.body
  );
}