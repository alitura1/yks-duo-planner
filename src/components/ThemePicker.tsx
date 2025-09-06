import React, { useEffect, useState } from 'react'
import { doc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useUser } from '../contexts/UserContext'
import { themes } from '../themes'

export const ThemePicker: React.FC = () => {
  const { profile, isGuest } = useUser()
  const [val, setVal] = useState('macera')

  useEffect(() => {
    setVal(profile?.theme || 'macera')
  }, [profile?.theme])

  const save = async () => {
    if (!profile?.id || isGuest) return
    await updateDoc(doc(db, 'users', profile.id), { theme: val })
    await setDoc(doc(db, 'meta/themesSync', profile.id), { theme: val }, { merge: true })
  }

  return (
    <div className="flex items-center gap-2">
      <select className="select" disabled={isGuest} value={val} onChange={e => setVal(e.target.value)}>
        {themes.map(t => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>
      <button className="btn subtle" onClick={!isGuest ? save : undefined} disabled={isGuest} title={isGuest ? "Misafir modunda değiştirilemez" : "Kaydet"}>Temayı Kaydet</button>
    </div>
  )
}
