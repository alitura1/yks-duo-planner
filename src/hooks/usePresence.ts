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
      if (snap.exists()) {
        const data = snap.data() as any
        const lastSeen =
          typeof data.lastSeen === "number"
            ? data.lastSeen
            : data.lastSeen?.toMillis?.() ?? null

        // online bilgisini lastSeen + timeout'a göre hesapla
        const isOnline =
          Boolean(data.online) &&
          lastSeen !== null &&
          Date.now() - lastSeen < ONLINE_TIMEOUT

        setPresence({
          online: isOnline,
          lastSeen,
        })
      } else {
        setPresence({ online: false, lastSeen: null })
      }
    })

    return () => unsub()
  }, [uid])

  return presence
}
