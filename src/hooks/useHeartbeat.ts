import { useEffect } from "react"
import { db } from "../firebase"
import { doc, setDoc } from "firebase/firestore"
import { useUser } from "../contexts/UserContext"

export const useHeartbeat = () => {
  const { user } = useUser()

  useEffect(() => {
    if (!user) return

    const ref = doc(db, "presence", user.uid)

    // Her 30 saniyede bir online + lastSeen güncelle
    const interval = setInterval(() => {
      setDoc(ref, {
        online: true,
        lastSeen: Date.now()
      }, { merge: true })
    }, 30_000)

    // Sekme kapanınca offline işaretle
    const markOffline = () => {
      setDoc(ref, {
        online: false,
        lastSeen: Date.now()
      }, { merge: true })
    }
    window.addEventListener("beforeunload", markOffline)

    return () => {
      clearInterval(interval)
      markOffline()
      window.removeEventListener("beforeunload", markOffline)
    }
  }, [user])
}
