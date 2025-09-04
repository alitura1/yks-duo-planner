import { useEffect, useMemo, useState } from "react";
import { GiftModal } from "./GiftModal";
import { useRewardSounds } from "./useRewardSounds";
import { onRewards } from "./api";
import type { Reward } from "../../types";

export function GiftButton({
  currentUserId,
  viewingUserId,
}: {
  currentUserId: string;
  viewingUserId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const sfx = useRewardSounds();

  const ownerId = viewingUserId ?? currentUserId;

  // 🔔 Ödülleri anlık dinle
  useEffect(() => {
    const unsub = onRewards(ownerId, (rewards: Reward[]) => {
      setCount(rewards.filter((r) => !r.used).length);
    });
    return () => unsub();
  }, [ownerId]);

  const title = useMemo(
    () =>
      ownerId === currentUserId ? "Hediyelerim" : "Diğer kişinin hediyeleri",
    [ownerId, currentUserId]
  );

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen(true);
          sfx.open();
        }}
        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 
          shadow-md hover:shadow-lg bg-green-400/90 backdrop-blur border
          transition-transform duration-200 ease-out
          hover:-translate-y-0.5 active:scale-95"
        aria-label="Hediyeler"
      >
        <span className="text-lg">🎁</span>
        {count > 0 && (
          <span className="flex items-center justify-center w-6 h-6 
                          rounded-full bg-white text-pink-600 font-bold 
                          text-xs border-2 border-pink-600">
            {count}
          </span>
        )}
      </button>

      {/* Modal */}
      <GiftModal
        open={open}
        onClose={() => setOpen(false)}
        ownerId={ownerId}
        canUse={ownerId === currentUserId}
        title={title}
      />
    </div>
  );
}
