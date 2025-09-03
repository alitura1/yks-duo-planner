import { useEffect, useState } from "react"
import { Sun, Moon, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { useUser } from "../contexts/UserContext"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase"
import { themes } from "../themes"

interface TopbarProps {
  onOpenSettings: () => void
  selectedDay: string
  setSelectedDay: (day: string) => void
}


const days = [
  { key: "Pazartesi", label: "Pzt" },
  { key: "Salı", label: "Sal" },
  { key: "Çarşamba", label: "Çar" },
  { key: "Perşembe", label: "Per" },
  { key: "Cuma", label: "Cum" },
  { key: "Cumartesi", label: "Cmt" },
  { key: "Pazar", label: "Paz" },
]

const dayKeys = days.map((d) => d.key)

export function TopBar({ onOpenSettings, selectedDay, setSelectedDay }: TopbarProps) {
  const { user, profile, signOutNow } = useUser()
  const [theme, setTheme] = useState(profile?.theme || "macera")
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("darkMode")
    if (saved !== null) return saved === "true"
    return window.matchMedia("(prefers-color-scheme: dark)").matches
  })

  // Gün seçimini localStorage’dan oku, 6 saatten eskiyse bugüne ayarla
  useEffect(() => {
    const savedDay = localStorage.getItem("selectedDay")
    const savedTs = localStorage.getItem("selectedDayTimestamp")
    const now = Date.now()
    const sixHours = 6 * 60 * 60 * 1000

    if (savedDay && savedTs) {
      const diff = now - parseInt(savedTs, 10)
      if (diff < sixHours && dayKeys.includes(savedDay)) {
        setSelectedDay(savedDay)
        return
      }
    }

    const idx = new Date().getDay() // 0=Pazar,1=Pzt,...
    const todayKey = days[idx === 0 ? 6 : idx - 1].key
    setSelectedDay(todayKey)
    localStorage.setItem("selectedDay", todayKey)
    localStorage.setItem("selectedDayTimestamp", String(now))
  }, [setSelectedDay])

  // selectedDay değişince localStorage’a yaz
  useEffect(() => {
    if (dayKeys.includes(selectedDay)) {
      localStorage.setItem("selectedDay", selectedDay)
      localStorage.setItem("selectedDayTimestamp", String(Date.now()))
    }
  }, [selectedDay])

  // darkMode toggle
  useEffect(() => {
    localStorage.setItem("darkMode", String(darkMode))
    if (darkMode) document.body.classList.add("dark")
    else document.body.classList.remove("dark")
  }, [darkMode])

  // tema değiştir (sadece kendi profilini güncelle)
  const handleThemeChange = async (val: string) => {
    setTheme(val)
    if (user) {
      await updateDoc(doc(db, "users", user.uid), { theme: val })
    }
  }

  // profil güncellenirse state yenile
  useEffect(() => {
    if (profile?.theme) {
      setTheme(profile.theme)
    }
  }, [profile?.theme])

  return (
    <div className="w-full flex flex-col border-b bg-[var(--panel)] sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-[var(--panel)]/80">
      {/* Üst Satır */}
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-lg font-semibold" style={{ color: "var(--fg)" }}>
          YKS Duo
        </h1>

        <div className="flex items-center gap-3">
          {/* Çıkış */}
          <Button variant="secondary" onClick={signOutNow} title="Hesaptan çık">
            <LogOut className="w-4 h-4 mr-2" /> Çıkış
          </Button>
          {/* Tema seçici */}
          <Select value={theme} onValueChange={handleThemeChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Tema seç" />
            </SelectTrigger>
            <SelectContent>
              {themes.map(t => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Dark/Light */}
          <Button variant="outline" size="icon" onClick={() => setDarkMode((d) => !d)}>
            {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>

          {/* Ayarlar */}
          <Button variant="outline" size="icon" onClick={onOpenSettings}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Alt Satır: Gün Seçici */}
      <div className="flex justify-center gap-2 px-4 pb-3">
        {days.map((d) => (
          <button
            key={d.key}
            onClick={() => setSelectedDay(d.key)}
            className={`px-3 py-1 rounded-md text-sm transition ${
              selectedDay === d.key
                ? "bg-blue-500 text-[var(--text)]"
                : "bg-[var(--bg)] text-[var(--fg)] hover:bg-[var(--hover)]"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>
    </div>
  )
}
