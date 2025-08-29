import React, { useEffect, useRef, useState } from 'react'
import type { Task } from '../types'

type Props = {
  items: Task[]
  canEdit: boolean
  onToggle: (t: Task)=>void
  onReorder: (list: Task[])=>Promise<void>|void
  onDelete: (t: Task)=>void
}

export const TaskColumn: React.FC<Props> = ({ items, canEdit, onToggle, onReorder, onDelete }) => {
  const [list, setList] = useState<Task[]>(items)
  const dragId = useRef<string|null>(null)
  useEffect(()=> setList(items), [items])

  const onDragStart = (e: React.DragEvent, id: string) => { if(!canEdit) return; dragId.current = id; e.dataTransfer.effectAllowed='move' }
  const onDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault(); if(!canEdit) return
    const from = list.findIndex(x=> x.id===dragId.current)
    const to = list.findIndex(x=> x.id===id)
    if(from===to || from<0 || to<0) return
    const clone = [...list]; const [m] = clone.splice(from,1); clone.splice(to,0,m); setList(clone)
  }
  const onDrop = async ()=>{ if(!canEdit) return; dragId.current=null; await onReorder(list) }

  return (
    <div className="flex flex-col gap-2">
      {list.map(t=> (
        <div key={t.id}
             className={`task ${t.done?'done':''}`}
             draggable={canEdit}
             onDragStart={e=> onDragStart(e,t.id)}
             onDragOver={e=> onDragOver(e,t.id)}
             onDrop={onDrop}>
          <span className="handle">↕</span>
          <input type="checkbox" checked={!!t.done} onChange={()=> onToggle(t)} disabled={!canEdit} />
          <div className="flex-1">{t.title}</div>
          {canEdit && <button className="chip" title="Sil" onClick={()=> onDelete(t)}>🗑️</button>}
        </div>
      ))}
      {list.length===0 && <div className="hint">Bu gün için görev yok.</div>}
    </div>
  )
}