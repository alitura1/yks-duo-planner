import React, { useEffect, useState } from 'react'

type Mode = 'light'|'dark'|'system'

export const ThemeToggle: React.FC = () => {
  const [mode, setMode] = useState<Mode>(()=> (localStorage.getItem('mode') as Mode) || 'system')

  useEffect(()=>{
    const root = document.documentElement
    const sysDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const useDark = mode==='dark' || (mode==='system' && sysDark)
    root.classList.toggle('dark', useDark)
    localStorage.setItem('mode', mode)
  }, [mode])

  return (
    <div className="flex items-center gap-2">
      <select className="select" value={mode} onChange={e=> setMode(e.target.value as Mode)}>
        <option value="light">Açık</option>
        <option value="dark">Koyu</option>
        <option value="system">Sistem</option>
      </select>
    </div>
  )
}