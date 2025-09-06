import { useState, useEffect, useRef, useCallback } from "react";

export function useRewardPopup(options?: { duration?: number; gap?: number }) {
  const duration = options?.duration ?? 3000; // gösterim süresi (ms)
  const gap = options?.gap ?? 350; // iki popup arasındaki minimum aralık (ms)

  const [queue, setQueue] = useState<string[]>([]);
  const [active, setActive] = useState<string | null>(null);

  const lastShownRef = useRef<number>(0);
  const retryTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);

  const showReward = useCallback((msg: string) => {
    setQueue((q) => [...q, msg]);
  }, []);

  // Kuyruğu yönet: active === null iken kuyruktan alıp göster
  useEffect(() => {
    if (active !== null) return; // zaten gösterimde
    if (queue.length === 0) return;

    const now = Date.now();
    const elapsed = now - lastShownRef.current;

    if (elapsed < gap) {
      // gap dolana kadar bekle, sonra göster
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
      retryTimerRef.current = window.setTimeout(() => {
        setActive(queue[0]);
        setQueue((q) => q.slice(1));
        lastShownRef.current = Date.now();
        retryTimerRef.current = null;
      }, gap - elapsed);
      return () => {
        if (retryTimerRef.current) {
          clearTimeout(retryTimerRef.current);
          retryTimerRef.current = null;
        }
      };
    } else {
      setActive(queue[0]);
      setQueue((q) => q.slice(1));
      lastShownRef.current = Date.now();
    }
  }, [active, queue, gap]);

  // Active olduğu sürece hide timer kur
  useEffect(() => {
    if (active === null) return;
    // temizle varsa önceki timer
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    hideTimerRef.current = window.setTimeout(() => {
      setActive(null);
      hideTimerRef.current = null;
    }, duration);

    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
  }, [active, duration]);

  // component unmount temizliği
  useEffect(() => {
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
  }, []);

  return { reward: active, showReward };
}

export default useRewardPopup;
