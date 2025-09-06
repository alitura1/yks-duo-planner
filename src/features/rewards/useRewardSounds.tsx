import { useEffect, useMemo, useRef } from "react";

function createAudioElement(src: string, volume = 0.75): HTMLAudioElement | null {
  try {
    const a = new Audio(src);
    a.preload = "auto";
    a.volume = volume;
    a.addEventListener("error", (ev) => {
      console.warn("[useRewardSounds] audio error:", src, ev);
    });
    return a;
  } catch {
    return null;
  }
}

async function safePlay(audio: HTMLAudioElement | null) {
  if (!audio) return;
  try {
    audio.currentTime = 0;
    const p = audio.play();
    if (p && typeof p.then === "function") {
      await p;
    }
  } catch (e) {
    console.warn("[useRewardSounds] play error:", e);
  }
}

/**
 * useRewardSounds
 * Tüm sesler public/sounds/*.wav altında
 */
export function useRewardSounds() {
  const audiosRef = useRef<Record<string, HTMLAudioElement | null>>({
    win: null,
    open: null,
    click: null,
    fail: null,
    taskComplete: null,
    taskDelete: null,
  });

  useEffect(() => {
    const bases: Record<string, string> = {
      win: "/sounds/reward-win.wav",
      open: "/sounds/reward-open.wav",
      click: "/sounds/reward-click.wav",
      fail: "/sounds/reward-fail.wav",
      taskComplete: "/sounds/task-complete.wav",
      taskDelete: "/sounds/task-delete.wav",
    };

    for (const [key, src] of Object.entries(bases)) {
      const vol = key === "win" ? 0.9 : 0.75;
      audiosRef.current[key] = createAudioElement(src, vol);
    }

    // 🔓 Autoplay unlock
    let unlocked = false;
    function tryUnlock() {
      if (unlocked) return;
      unlocked = true;
      try {
        const c = audiosRef.current.click;
        if (c) {
          c.muted = true;
          c.play().finally(() => {
            c.pause();
            c.muted = false;
          });
        }
      } catch {}
      document.removeEventListener("pointerdown", tryUnlock);
      document.removeEventListener("keydown", tryUnlock);
    }

    document.addEventListener("pointerdown", tryUnlock, { once: true });
    document.addEventListener("keydown", tryUnlock, { once: true });

    return () => {
      document.removeEventListener("pointerdown", tryUnlock);
      document.removeEventListener("keydown", tryUnlock);
    };
  }, []);

  return useMemo(
    () => ({
      won: () => safePlay(audiosRef.current.win),
      win: () => safePlay(audiosRef.current.win),
      open: () => safePlay(audiosRef.current.open),
      click: () => safePlay(audiosRef.current.click),
      fail: () => safePlay(audiosRef.current.fail),
      taskComplete: () => safePlay(audiosRef.current.taskComplete),
      taskDelete: () => safePlay(audiosRef.current.taskDelete),
    }),
    []
  );
}

export default useRewardSounds;
