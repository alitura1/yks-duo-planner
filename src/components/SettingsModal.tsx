import { useState, useEffect } from "react"
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
import { themes } from "../themes"
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

export default function SettingsModal({ open, setOpen }: SettingsModalProps) {
  const { user, profile } = useUser()
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false)

  const strength = (p: string) => {
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[a-z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s; // 0-5
  };

  const [imageUrl, setImageUrl] = useState(profile?.photoURL || "")
  const [theme, setTheme] = useState(profile?.theme || "macera")
  
  // Profile değişince alanları senkronize et
  useEffect(() => {
    setTheme(profile?.theme || "macera")
    setImageUrl(profile?.photoURL || "")
  }, [profile?.theme, profile?.photoURL])

  // 🔑 Şifre değiştirme
  const handlePasswordChange = async () => {
    if (newPass !== confirmPass) { alert("Şifreler uyuşmuyor."); return; }
    if (strength(newPass) < 3) { alert("Daha güçlü bir şifre seçin (en az 8 karakter, harf + rakam)."); return; }
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
      const apiKey = "c70e5660431e628e53354bfeb10137af"

      const toBase64 = (file: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = (error) => reject(error)
        })

      const base64Image = await toBase64(file)

      const formData = new FormData()
      formData.append("image", base64Image.split(",")[1])

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      if (!data.success) throw new Error("ImgBB yükleme başarısız!")

      const url = data.data.url

      await updateDoc(doc(db, "users", profile?.id), {
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
      await updateDoc(doc(db, "users", profile?.id), {
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
      await updateDoc(doc(db, "users", profile?.id), { theme: value })
    } catch (err: any) {
      alert("Hata: " + err.message)
    }
  }

  // ↩️ Fotoğrafı geri alma
  const handleRevertPhoto = async (oldUrl: string) => {
    if (!user || !profile) return
    try {
      await updateDoc(doc(db, "users", profile?.id), { photoURL: oldUrl })
      setImageUrl(oldUrl)
      alert("Eski fotoğraf geri yüklendi!")
    } catch (err: any) {
      alert("Hata: " + err.message)
    }
  }

  if (!profile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Ayarlar</DialogTitle>
          </DialogHeader>
          <p className="text-center text-sm text-muted-foreground">Profil yükleniyor...</p>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Ayarlar</DialogTitle>
        </DialogHeader>

        {/* Tema Seçimi */}
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

          {profile?.photoHistory?.length > 0 && (
            <div className="mt-3">
              <p className="text-sm mb-1">Fotoğraf Geçmişi</p>
              <div className="flex gap-2 flex-wrap">
                {(profile?.photoHistory ?? []).map((url: string, i: number) => (
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

        {/* Şifre değiştirme */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Yeni Şifre</label>
          <Input
            type="password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            placeholder="Yeni şifrenizi girin"
          />
          <div className="mt-2">
            <input className="input" type="password" value={confirmPass} onChange={(e)=>setConfirmPass(e.target.value)} placeholder="Yeni şifre (tekrar)" />
            <div className="text-xs mt-1 opacity-70">Güç: {["Zayıf","Zayıf","Orta","İyi","Güçlü","Çok güçlü"][strength(newPass)]}</div>
          </div>
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
