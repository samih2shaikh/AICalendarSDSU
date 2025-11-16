import { useState } from "react";
import { Task } from "@/types/calendar";
import { toast } from "sonner";
import { format } from "date-fns";

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

    // Check for deadline warning
    if (draggedTask.dueDate) {
      const dueDate = new Date(draggedTask.dueDate);
      if (newDate > dueDate) {
        toast.error("⚠️ Deadline Warning!", {
          description: `Moving "${draggedTask.title}" to ${format(newDate, "MMM d 'at' h:mm a")} is past its deadline of ${format(dueDate, "MMM d, yyyy")}. Consider rescheduling earlier!`,
          duration: 5000,
        });
      }
    }

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
