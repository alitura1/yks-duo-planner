import React, { useEffect, useRef, useState } from "react";
import type { Task } from "../types";

type Props = {
  items: Task[];
  canEdit: boolean;
  onToggle: (t: Task, newDone: boolean) => void; // ✅ yeni parametre
  onReorder: (list: Task[]) => Promise<void> | void;
  onDelete: (t: Task, skipConfirm?: boolean) => void;
};

export const TaskColumn: React.FC<Props> = ({
  items,
  canEdit,
  onToggle,
  onReorder,
  onDelete,
}) => {
  const [list, setList] = useState<Task[]>(items);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const dragId = useRef<string | null>(null);

  // Liste güncellenince state'i eşitle
  useEffect(() => setList(items), [items]);

  // Drag & drop
  const onDragStart = (e: React.DragEvent, id: string) => {
    if (!canEdit) return;
    dragId.current = id;
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (!canEdit) return;
    const from = list.findIndex((x) => x.id === dragId.current);
    const to = list.findIndex((x) => x.id === id);
    if (from === to || from < 0 || to < 0) return;
    const clone = [...list];
    const [m] = clone.splice(from, 1);
    clone.splice(to, 0, m);
    setList(clone);
  };
  const onDrop = async () => {
    if (!canEdit) return;
    dragId.current = null;
    await onReorder(list);
  };

  // Çoklu seçim
  const toggleSelect = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleDeleteSelected = () => {
    selectedTasks.forEach((id) => {
      const task = list.find((t) => t.id === id);
      if (task) onDelete(task, true);
    });
    setSelectedTasks([]);
  };

  const handleDeleteAll = () => {
    if (confirm("Tüm görevleri silmek istediğine emin misin?")) {
      list.forEach((task) => onDelete(task, true));
      setSelectedTasks([]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Top bar: seçim/temizleme */}
      <div className="flex gap-2 mb-2">
        {selectedTasks.length > 0 && (
          <button
            onClick={handleDeleteSelected}
            className="chip bg-red-500 text-white hover:bg-red-600"
          >
            Seçilenleri Sil ({selectedTasks.length})
          </button>
        )}
        {list.length > 0 && (
          <button
            onClick={handleDeleteAll}
            className="chip bg-red-700 text-white hover:bg-red-800"
          >
            Tümünü Sil
          </button>
        )}
      </div>

      {/* Görev listesi */}
      {list.map((t) => (
        <div
          key={t.id}
          className={`task flex items-center gap-2 p-2 rounded-md border ${
            t.done ? "opacity-70 line-through" : ""
          }`}
          draggable={canEdit}
          onDragStart={(e) => onDragStart(e, t.id)}
          onDragOver={(e) => onDragOver(e, t.id)}
          onDrop={onDrop}
        >
          {canEdit && (
            <input
              type="checkbox"
              checked={selectedTasks.includes(t.id)}
              onChange={() => toggleSelect(t.id)}
              title="Görev seç"
            />
          )}
          <span className="handle cursor-move">↕</span>
          <input
            type="checkbox"
            checked={!!t.done}
            onChange={(e) => onToggle(t, e.target.checked)} // ✅ ödül entegrasyonu burada
            disabled={!canEdit}
          />
          <div className="flex-1">{t.title}</div>
          {canEdit && (
            <button
              className="chip text-red-600 hover:text-red-800"
              title="Sil"
              onClick={() => onDelete(t)}
            >
              ❌
            </button>
          )}
        </div>
      ))}

      {/* Boş mesaj */}
      {list.length === 0 && <div className="hint">Bu gün için görev yok.</div>}
    </div>
  );
};
