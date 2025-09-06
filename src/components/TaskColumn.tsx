import React, { useEffect, useState } from "react";
import type { Task } from "../types";
import { useAuth } from "../contexts/AuthContext";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  items: Task[];
  canEdit: boolean;
  onToggle: (t: Task, newDone: boolean) => void;
  onReorder: (list: Task[]) => Promise<void> | void;
  onDelete: (t: Task, skipConfirm?: boolean) => void;
};

export const TaskColumn: React.FC<Props> = (props) => {
  const { isGuest } = useAuth();

  // ✅ props'a dokunmadan canEdit'i override ediyoruz
  const effectiveCanEdit = !isGuest && props.canEdit;

  return <TaskColumnOrig {...props} canEdit={effectiveCanEdit} />;
};

// ---------------- Original ----------------
const TaskColumnOrig: React.FC<Props> = ({
  items,
  canEdit,
  onToggle,
  onReorder,
  onDelete,
}) => {
  const [list, setList] = useState<Task[]>(items);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  useEffect(() => setList(items), [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = list.findIndex((t) => t.id === active.id);
    const newIndex = list.findIndex((t) => t.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const newList = arrayMove(list, oldIndex, newIndex);
    setList(newList);
    onReorder(newList);
  };

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

      {list.length === 0 && <div className="hint">Bu gün için görev yok.</div>}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={list.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {list.map((t) => (
            <SortableTaskItem
              key={t.id}
              task={t}
              canEdit={canEdit}
              selected={selectedTasks.includes(t.id)}
              toggleSelect={toggleSelect}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

type ItemProps = {
  task: Task;
  canEdit: boolean;
  selected: boolean;
  toggleSelect: (id: string) => void;
  onToggle: (t: Task, newDone: boolean) => void;
  onDelete: (t: Task, skipConfirm?: boolean) => void;
};

const SortableTaskItem: React.FC<ItemProps> = ({
  task,
  canEdit,
  selected,
  toggleSelect,
  onToggle,
  onDelete,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`task flex items-center gap-2 p-2 rounded-md border bg-[var(--theme-bg)] ${
        task.done ? "opacity-70 line-through" : ""
      }`}
    >
      {canEdit && (
        <input
          type="checkbox"
          checked={selected}
          onChange={() => toggleSelect(task.id)}
          title="Görev seç"
        />
      )}
      <span className="cursor-grab select-none">↕</span>
      <input
        type="checkbox"
        checked={!!task.done}
        onChange={(e) => onToggle(task, e.target.checked)}
        disabled={!canEdit}
      />
      <div className="flex-1">{task.title}</div>
      {canEdit && (
        <button
          className="chip text-red-600 hover:text-red-800"
          title="Sil"
          onClick={() => onDelete(task)}
        >
          ❌
        </button>
      )}
    </div>
  );
};
