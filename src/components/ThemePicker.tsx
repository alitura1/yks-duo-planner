import React, { useEffect, useState } from 'react'
import { doc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useUser } from '../contexts/UserContext'

export const ThemePicker: React.FC = () => {
  const { profile } = useUser()
  const [val,setVal] = useState('macera')
  useEffect(()=> setVal(profile?.theme || 'macera'), [profile?.theme])
  const save = async ()=>{
    if(!profile) return
    await updateDoc(doc(db,'users', profile.id), { theme: val })
    await setDoc(doc(db,'meta/themesSync', profile.id), { theme: val }, { merge:true })
  }
  return (
    <div className="flex items-center gap-2">
      <select className="select" value={val} onChange={e=> setVal(e.target.value)}>
        <option value="macera">Macera</option>
        <option value="cicek">Çiçek</option>
        <option value="gece">Gece</option>
        <option value="orman">Orman</option>
        <option value="okyanus">Okyanus</option>
        <option value="retro">Retro</option>
        <option value="minimal">Minimal</option>
        <option value="galaksi">Galaksi</option>
      </select>
      <button className="btn subtle" onClick={save}>Temayı Kaydet</button>
    </div>
  )
}