import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../types";

type Props = {
  task: Task;
  canEdit: boolean;
  onToggle: (t: Task, newDone: boolean) => void;
  onDelete: (t: Task, skipConfirm?: boolean) => void;
};

const SortableItem: React.FC<Props> = ({ task, canEdit, onToggle, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
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

export default SortableItem;
