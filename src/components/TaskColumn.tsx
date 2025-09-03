import React, { useEffect, useRef, useState } from 'react'
import type { Task } from '../types'

type Props = {
  items: Task[]
  canEdit: boolean
  onToggle: (t: Task) => void
  onReorder: (list: Task[]) => Promise<void> | void
  onDelete: (t: Task, skipConfirm?: boolean) => void
}

export const TaskColumn: React.FC<Props> = ({ items, canEdit, onToggle, onReorder, onDelete }) => {
  const [list, setList] = useState<Task[]>(items)
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const dragId = useRef<string | null>(null)

  useEffect(() => setList(items), [items])

  const onDragStart = (e: React.DragEvent, id: string) => {
    if (!canEdit) return
    dragId.current = id
    e.dataTransfer.effectAllowed = 'move'
  }
  const onDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault()
    if (!canEdit) return
    const from = list.findIndex(x => x.id === dragId.current)
    const to = list.findIndex(x => x.id === id)
    if (from === to || from < 0 || to < 0) return
    const clone = [...list]
    const [m] = clone.splice(from, 1)
    clone.splice(to, 0, m)
    setList(clone)
  }
  const onDrop = async () => {
    if (!canEdit) return
    dragId.current = null
    await onReorder(list)
  }

  const toggleSelect = (taskId: string) => {
    setSelectedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    )
  }

  const handleDeleteSelected = () => {
    selectedTasks.forEach(id => {
      const task = list.find(t => t.id === id)
      if (task) onDelete(task, true) // confirm atlaması için true
    })
    setSelectedTasks([])
  }

  const handleDeleteAll = () => {
    if (confirm('Tüm görevleri silmek istediğine emin misin?')) {
      list.forEach(task => onDelete(task, true))
      setSelectedTasks([])
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 mb-2">
        {selectedTasks.length > 0 && (
          <button
            onClick={handleDeleteSelected}
            className="chip bg-red-500 text-white"
          >
            Seçilenleri Sil ({selectedTasks.length})
          </button>
        )}
        {list.length > 0 && (
          <button
            onClick={handleDeleteAll}
            className="chip bg-red-700 text-white"
          >
            Tümünü Sil
          </button>
        )}
      </div>

      {list.map(t => (
        <div key={t.id}
             className={`task ${t.done ? 'done' : ''}`}
             draggable={canEdit}
             onDragStart={e => onDragStart(e, t.id)}
             onDragOver={e => onDragOver(e, t.id)}
             onDrop={onDrop}>
          {canEdit && (
            <input
              type="checkbox"
              checked={selectedTasks.includes(t.id)}
              onChange={() => toggleSelect(t.id)}
              title="Görev seç"
            />
          )}
          <span className="handle">↕</span>
          <input
            type="checkbox"
            checked={!!t.done}
            onChange={() => onToggle(t)}
            disabled={!canEdit}
          />
          <div className="flex-1">{t.title}</div>
          {canEdit && (
            <button
              className="chip"
              title="Sil"
              onClick={() => onDelete(t)}
            >
              🗑️
            </button>
          )}
        </div>
      ))}

      {list.length === 0 && <div className="hint">Bu gün için görev yok.</div>}
    </div>
  )
}
