"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Pencil, Trash2 } from "lucide-react";

type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  assigneeId?: string | null;
  milestoneId?: string | null;
  assignee?: { id: string; user: { id: string; name: string } } | null;
};

const STATUSES: TaskStatus[] = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];

const STATUS_LABEL: Record<TaskStatus, string> = {
  TODO: "To do",
  IN_PROGRESS: "In progress",
  IN_REVIEW: "In review",
  DONE: "Done",
};

const PRIORITY_TONE: Record<TaskPriority, string> = {
  LOW: "text-muted",
  MEDIUM: "text-ink",
  HIGH: "text-gold",
  URGENT: "text-gold font-semibold",
};

function TaskCard({
  task,
  onEdit,
  onDelete,
}: {
  task: Task;
  onEdit: (t: Task) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group cursor-grab touch-none rounded-lg border border-border bg-white p-3 text-xs shadow-sm active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium text-ink">{task.title}</span>
        {/* stopPropagation on pointerDown so these buttons don't get
            swallowed by the drag listeners spread on the card itself —
            without it, a click on Edit/Delete can be interpreted as the
            start of a drag instead of a click. */}
        <div className="flex shrink-0 items-center gap-1.5 opacity-0 transition group-hover:opacity-100">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onEdit(task)}
            aria-label="Edit task"
            className="text-muted hover:text-ink"
          >
            <Pencil className="h-3 w-3" />
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onDelete(task.id)}
            aria-label="Delete task"
            className="text-muted hover:text-gold"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className={PRIORITY_TONE[task.priority]}>{task.priority}</span>
        {task.assignee && (
          <span className="text-muted">{task.assignee.user.name}</span>
        )}
        {task.dueDate && (
          <span className="text-muted">
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}

function Column({
  status,
  tasks,
  onEdit,
  onDelete,
}: {
  status: TaskStatus;
  tasks: Task[];
  onEdit: (t: Task) => void;
  onDelete: (id: string) => void;
}) {
  // Droppable id = the status itself, so a card dropped on empty column
  // space (not on another card) still resolves to a target status.
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const ids = tasks.map((t) => t.id);

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[140px] w-64 shrink-0 flex-col gap-2 rounded-xl border p-3 transition ${
        isOver ? "border-moss bg-moss/[0.04]" : "border-border bg-paper-dim/40"
      }`}
    >
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-semibold text-ink">{STATUS_LABEL[status]}</h3>
        <span className="text-[11px] text-muted">{tasks.length}</span>
      </div>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {tasks.map((t) => (
            <TaskCard key={t.id} task={t} onEdit={onEdit} onDelete={onDelete} />
          ))}
          {tasks.length === 0 && (
            <p className="px-1 py-2 text-[11px] text-muted">No tasks</p>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export function KanbanBoard({
  tasks,
  onStatusChange,
  onEdit,
  onDelete,
}: {
  tasks: Task[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onEdit: (t: Task) => void;
  onDelete: (id: string) => void;
}) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // distance:4 means a plain click (no meaningful pointer movement)
  // never starts a drag — this is what lets Edit/Delete clicks land
  // normally without fighting the drag sensor.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  const columns = STATUSES.map((s) => ({
    status: s,
    tasks: tasks.filter((t) => t.status === s),
  }));

  function handleDragStart(e: DragStartEvent) {
    setActiveTask(tasks.find((t) => t.id === e.active.id) ?? null);
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = e;
    if (!over) return;

    const dragged = tasks.find((t) => t.id === active.id);
    if (!dragged) return;

    // over.id is either a column's status id (dropped on empty space)
    // or another task's id (dropped on/near a card) — resolve both to
    // a target status the same way.
    const overStatus = STATUSES.includes(over.id as TaskStatus)
      ? (over.id as TaskStatus)
      : tasks.find((t) => t.id === over.id)?.status;

    if (!overStatus || overStatus === dragged.status) return;
    onStatusChange(dragged.id, overStatus);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
        {columns.map((c) => (
          <Column
            key={c.status}
            status={c.status}
            tasks={c.tasks}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask && (
          <div className="w-64 rounded-lg border border-moss bg-white p-3 text-xs shadow-md">
            <span className="font-medium text-ink">{activeTask.title}</span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}