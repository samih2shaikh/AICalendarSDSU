import { useState } from "react";
import { Task } from "@/types/calendar";

export const useDragAndDrop = (tasks: Task[], onTasksChange: (tasks: Task[]) => void) => {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<{ date: Date; hour: number } | null>(null);

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverSlot(null);
  };

  const handleDragOver = (e: React.DragEvent, date: Date, hour: number) => {
    e.preventDefault();
    setDragOverSlot({ date, hour });
  };

  const handleDrop = (e: React.DragEvent, date: Date, hour: number) => {
    e.preventDefault();
    
    if (!draggedTask) return;

    const newDate = new Date(date);
    newDate.setHours(hour, 0, 0, 0);

    const updatedTasks = tasks.map((task) =>
      task.id === draggedTask.id
        ? { ...task, date: newDate }
        : task
    );

    onTasksChange(updatedTasks);
    setDraggedTask(null);
    setDragOverSlot(null);
  };

  const isDragOverSlot = (date: Date, hour: number) => {
    if (!dragOverSlot) return false;
    return (
      dragOverSlot.date.toDateString() === date.toDateString() &&
      dragOverSlot.hour === hour
    );
  };

  return {
    draggedTask,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    isDragOverSlot,
  };
};
