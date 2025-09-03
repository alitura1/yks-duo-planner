import { themes } from "../themes"
import React, { useEffect, useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

export const StatusCard: React.FC<{ targetUser: any, canEdit: boolean }> = ({ targetUser, canEdit }) => {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState('')
  const [gif, setGif] = useState('')
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setNote(targetUser?.statusNote || '')
    setGif(targetUser?.statusGifUrl || '')
    setDirty(false)
  }, [targetUser?.id, targetUser?.statusNote, targetUser?.statusGifUrl])

  const save = async () => {
    if (!canEdit || !targetUser?.id) return
    try {
      setSaving(true)
      await updateDoc(doc(db, 'users', targetUser.id), {
        statusNote: note,
        statusGifUrl: gif
      })
      setDirty(false)
      setOpen(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="card bg-[var(--panel)]">
      <div className="flex items-center justify-between">
        <strong>Durum</strong>
        <button className="btn text-sm px-2 py-1" onClick={() => setOpen(!open)}>
          {open ? 'Kapat' : 'Düzenle'}
        </button>
      </div>

      {!open && (
        <div className="mt-2">
          {note ? (
            <p className="text-sm text-[color:rgba(255,255,255,0.8)] whitespace-pre-wrap">{note}</p>
          ) : (
            <p className="text-sm text-gray-500 italic">Henüz bir durum mesajı yok.</p>
          )}
          {gif ? <p className="text-xs text-gray-400 mt-1">Profil banner: aktif</p> : null}
        </div>
      )}

      {open && (
        <div className="mt-2 space-y-2">
          <textarea
            className="textarea w-full"
            placeholder="Bugünkü hedef / ruh hali…"
            value={note}
            onChange={e => { setNote(e.target.value); setDirty(true) }}
            disabled={!canEdit}
          />
          <div className="flex items-center gap-2">
            <input
              className="input flex-1"
              placeholder="Profil banner GIF URL (Giphy/Tenor)"
              value={gif}
              onChange={e => { setGif(e.target.value); setDirty(true) }}
              disabled={!canEdit}
            />
            <button className="btn" onClick={save} disabled={!canEdit || saving || !dirty}>
              {saving ? 'Kaydediliyor…' : (dirty ? 'Kaydet' : 'Kaydedildi')}
            </button>
          </div>

          {gif && (
            <div className="flex items-center gap-2">
              <img
                src={gif}
                alt="banner preview"
                className="h-12 w-20 object-cover rounded-lg border border-white/10"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
              <span className="text-xs text-gray-400">Bu görsel panel üstünde banner olarak görünür.</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
