import { doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../firebase"
import type { Presence } from "../types"

const ONLINE_TIMEOUT = 60_000 // 1 dk içinde güncellenmezse offline say

export const usePresence = (uid?: string | null) => {
  const [presence, setPresence] = useState<Presence>({
    online: false,
    lastSeen: null,
  })

  useEffect(() => {
    if (!uid) return

    const ref = doc(db, "presence", uid)

    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) {
        setPresence({ online: false, lastSeen: null })
        return
      }

      const data = snap.data() as any
      const lastSeen =
        typeof data.lastSeen === "number"
          ? data.lastSeen
          : data.lastSeen?.toMillis?.() ?? null

      // ✅ Eğer online true ise direkt çevrimiçi kabul et
      // ✅ Eğer online false ama lastSeen çok eski değilse yine çevrimiçi kabul et
      const isOnline =
        data.online === true ||
        (lastSeen !== null && Date.now() - lastSeen < ONLINE_TIMEOUT)

      setPresence({
        online: isOnline,
        lastSeen,
      })
    })

    return () => unsub()
  }, [uid])

  return presence
}
