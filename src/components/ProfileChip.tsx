import React from 'react'
import { usePresence } from '../hooks/usePresence'
import { fmtRelative } from '../utils'

export const ProfileChip: React.FC<{ user: any }> = ({ user }) => {
  const pres = usePresence(user?.id)
  return (
    <div className="flex items-center gap-2" title={pres.lastSeen? new Date(pres.lastSeen).toLocaleString('tr-TR'):''}>
      <span className={`presence-dot ${pres.online?'presence-on':'presence-off'}`}></span>
      {user?.photoURL ? <img src={user.photoURL} alt={user.displayName||'user'} className="w-8 h-8 rounded-full object-cover border shadow-soft" /> : <div className="w-8 h-8 rounded-full bg-neutral-200" />}
      <div className="text-xs">
        <div className="font-semibold">{user?.displayName||'Kullanıcı'}</div>
        <div className="opacity-70">{pres.lastSeen? `Son aktif: ${fmtRelative(pres.lastSeen)}`:'—'}</div>
      </div>
    </div>
  )
}