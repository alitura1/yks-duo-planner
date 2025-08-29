import React, { useEffect, useState } from "react"
import { TopBar } from "./components/TopBar"
import SettingsModal from "./components/SettingsModal"
import { collection, onSnapshot } from "firebase/firestore"
import { db } from "./firebase"
import { useUser } from "./contexts/UserContext"
import { UserPanel } from "./components/UserPanel"
import { todayKey } from "./utils"
import type { UserProfile } from "./types"
import { useHeartbeat } from "./hooks/useHeartbeat"

const Auth: React.FC = () => {
  const { signInEmail } = useUser()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      await signInEmail(email, password)
    } catch (err: any) {
      setError(err.message || String(err))
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <form className="card w-full max-w-sm" onSubmit={submit}>
        <h2 className="text-lg font-bold">Giriş</h2>
        <div className="mt-2">
          <input
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mt-2">
          <input
            className="input"
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn mt-3" type="submit">
          Giriş Yap
        </button>
        {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
        <div className="hint mt-2">
          Yalnızca Ali, Işıl ve admin++ giriş yapabilir. (Beni Hatırla aktif)
        </div>
      </form>
    </div>
  )
}

export const App: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState(todayKey())
  const { user, profile } = useUser()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [settingsOpen, setSettingsOpen] = useState(false)

  // ✅ online heartbeat
  useHeartbeat()

  // gün ilk açılışta bugünkü olsun
  useEffect(() => setSelectedDay(todayKey()), [])

  // Firestore’dan kullanıcıları izle
  useEffect(
    () =>
      onSnapshot(collection(db, "users"), (s) =>
        setUsers(s.docs.map((d) => ({ id: d.id, ...d.data() } as any)))
      ),
    []
  )

  const leftUser = users.find((u) => u.side === "left")
  const rightUser = users.find((u) => u.side === "right")

  const isAdminPP = profile?.role === "adminpp"

  // kısayol: "n" tuşuna basınca input focus
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "n") {
        const el =
          document.querySelector<HTMLInputElement>("#newTask-left") ||
          document.querySelector<HTMLInputElement>("#newTask-right")
        el?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  if (!user) return <Auth />
  if (!profile) return <div className="p-6">Profil yükleniyor…</div>

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <SettingsModal open={settingsOpen} setOpen={setSettingsOpen} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div id="left">
          <UserPanel
            label="Ali"
            selectedDay={selectedDay}
            targetUser={leftUser}
            canEdit={isAdminPP || profile?.id === leftUser?.id}
            profile={profile}
            side="left"   // ✅ eklendi
          />
        </div>
        <div id="right">
          <UserPanel
            label="Işıl"
            selectedDay={selectedDay}
            targetUser={rightUser}
            canEdit={isAdminPP || profile?.id === rightUser?.id}
            profile={profile}
            side="right"   // ✅ eklendi
          />
        </div>
      </div>

      <div className="p-3 text-xs opacity-70">
        İpucu: N = yeni görev, Enter = ekle, sürükle-bırak ile sırala. Çoklu
        ekleme için satır satır yapıştır.
      </div>
    </div>
  )
}
