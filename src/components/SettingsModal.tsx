import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { auth, db } from "../firebase"
import { updatePassword } from "firebase/auth"
import { doc, updateDoc, arrayUnion } from "firebase/firestore"
import { useUser } from "../contexts/UserContext"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

interface SettingsModalProps {
  open: boolean
  setOpen: (v: boolean) => void
}

const themes = [
  { value: "macera", label: "Macera" },
  { value: "cicek", label: "Çiçek" },
  { value: "gece", label: "Gece" },
  { value: "orman", label: "Orman" },
  { value: "okyanus", label: "Okyanus" },
  { value: "retro", label: "Retro" },
  { value: "minimal", label: "Minimal" },
  { value: "galaksi", label: "Galaksi" },
]

export default function SettingsModal({ open, setOpen }: SettingsModalProps) {
  const { user, profile } = useUser()
  const [newPass, setNewPass] = useState("")
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(profile?.photoURL || "")
  const [theme, setTheme] = useState(profile?.theme || "macera")

  // 🔑 Şifre değiştirme
  const handlePasswordChange = async () => {
    if (!auth.currentUser) return
    try {
      setLoading(true)
      await updatePassword(auth.currentUser, newPass)
      alert("Şifre başarıyla değiştirildi!")
      setNewPass("")
    } catch (err: any) {
      alert("Hata: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  // 📷 Fotoğraf yükleme (Dosya seç - ImgBB ile)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user || !profile) return

    try {
      setLoading(true)

      const apiKey = "c70e5660431e628e53354bfeb10137af" // 🔑 Senin ImgBB API key’in

      // File -> Base64 çevir
      const toBase64 = (file: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = (error) => reject(error)
        })

      const base64Image = await toBase64(file)

      // ImgBB API’ye gönder
      const formData = new FormData()
      formData.append("image", base64Image.split(",")[1])

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      if (!data.success) throw new Error("ImgBB yükleme başarısız!")

      const url = data.data.url

      // Firestore’a kaydet
      await updateDoc(doc(db, "users", profile.id), {
        photoURL: url,
        photoHistory: arrayUnion(url),
      })

      setImageUrl(url)
      alert("Profil resmi güncellendi!")
    } catch (err: any) {
      alert("Hata: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  // 🌐 URL ile fotoğraf kaydetme
  const handleImageUrlSave = async () => {
    if (!user || !profile || !imageUrl) return
    try {
      await updateDoc(doc(db, "users", profile.id), {
        photoURL: imageUrl,
        photoHistory: arrayUnion(imageUrl),
      })
      alert("Profil resmi/gif güncellendi!")
    } catch (err: any) {
      alert("Hata: " + err.message)
    }
  }

  // 🎨 Tema güncelleme
  const handleThemeChange = async (value: string) => {
    if (!user || !profile) return
    try {
      setTheme(value)
      await updateDoc(doc(db, "users", profile.id), { theme: value })
    } catch (err: any) {
      alert("Hata: " + err.message)
    }
  }

  // ↩️ Fotoğrafı geri alma
  const handleRevertPhoto = async (oldUrl: string) => {
    if (!user || !profile) return
    try {
      await updateDoc(doc(db, "users", profile.id), { photoURL: oldUrl })
      setImageUrl(oldUrl)
      alert("Eski fotoğraf geri yüklendi!")
    } catch (err: any) {
      alert("Hata: " + err.message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Ayarlar</DialogTitle>
        </DialogHeader>

        {/* Profil resmi/gif */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Profil Resmi/Gif</label>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Profil"
              className="w-16 h-16 rounded-full object-cover mb-2"
            />
          )}
          <Input
            placeholder="Resim veya GIF URL'si"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <div className="flex gap-2 mt-2">
            <Button onClick={handleImageUrlSave} disabled={loading}>
              URL Kaydet
            </Button>
            <label className="cursor-pointer">
              <span className="px-3 py-2 border rounded-md bg-muted hover:bg-muted/70">
                Dosya Seç
              </span>
              <input
                type="file"
                accept="image/*,image/gif"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Fotoğraf geçmişi */}
          {profile?.photoHistory?.length > 0 && (
            <div className="mt-3">
              <p className="text-sm mb-1">Fotoğraf Geçmişi</p>
              <div className="flex gap-2 flex-wrap">
                {profile.photoHistory.map((url: string, i: number) => (
                  <img
                    key={i}
                    src={url}
                    alt="history"
                    className="w-12 h-12 rounded cursor-pointer border hover:scale-105 transition"
                    onClick={() => handleRevertPhoto(url)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tema seçimi */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Tema</label>
          <Select value={theme} onValueChange={handleThemeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Tema seç" />
            </SelectTrigger>
            <SelectContent>
              {themes.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Şifre değiştirme */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Yeni Şifre</label>
          <Input
            type="password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            placeholder="Yeni şifrenizi girin"
          />
          <Button
            className="mt-2"
            onClick={handlePasswordChange}
            disabled={loading || !newPass}
          >
            Şifreyi Değiştir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
