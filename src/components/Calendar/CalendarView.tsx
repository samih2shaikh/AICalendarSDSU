import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, GripVertical } from "lucide-react";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { Task } from "@/types/calendar";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";

interface CalendarViewProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onTasksChange?: (tasks: Task[]) => void;
}

export const CalendarView = ({ tasks, onTaskClick, onTasksChange }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const weekStart = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const {
    draggedTask,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    isDragOverSlot,
  } = useDragAndDrop(tasks, onTasksChange || (() => {}));

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getTasksForDateTime = (day: Date, hour: number) => {
    return tasks.filter((task) => {
      const taskHour = task.date.getHours();
      const taskEndHour = taskHour + task.duration;
      // Task should appear in this slot if it starts or spans through this hour
      return isSameDay(task.date, day) && hour >= taskHour && hour < taskEndHour;
    });
  };

  const isTaskStart = (task: Task, hour: number) => {
    return task.date.getHours() === hour;
  };

  const getStressColor = (stress: string) => {
    switch (stress) {
      case "low":
        return "bg-success/20 border-success text-success-foreground hover:bg-success/30";
      case "medium":
        return "bg-warning/20 border-warning text-warning-foreground hover:bg-warning/30";
      case "high":
        return "bg-destructive/20 border-destructive text-destructive-foreground hover:bg-destructive/30";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className="text-2xl font-bold text-foreground">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(addDays(currentDate, -7))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(addDays(currentDate, 7))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="flex-1 overflow-hidden shadow-medium">
        <div className="h-full overflow-auto">
          <div className="grid grid-cols-8 border-b border-border sticky top-0 bg-card z-10">
            <div className="p-3 text-sm font-medium text-muted-foreground border-r border-border">
              Time
            </div>
            {weekDays.map((day) => (
              <div
                key={day.toISOString()}
                className="p-3 text-center border-r border-border last:border-r-0"
              >
                <div className="text-sm font-medium text-foreground">
                  {format(day, "EEE")}
                </div>
                <div
                  className={`text-lg font-bold ${
                    isSameDay(day, new Date())
                      ? "text-primary"
                      : "text-foreground"
                  }`}
                >
                  {format(day, "d")}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-8">
            {hours.map((hour) => (
              <>
                <div
                  key={`hour-${hour}`}
                  className="p-2 text-xs text-muted-foreground border-r border-b border-border text-right"
                >
                  {format(new Date().setHours(hour, 0, 0, 0), "h a")}
                </div>
                {weekDays.map((day) => {
                  const dayTasks = getTasksForDateTime(day, hour);
                  return (
                    <div
                      key={`${day.toISOString()}-${hour}`}
                      className={`min-h-16 p-1 border-r border-b border-border last:border-r-0 transition-colors ${
                        isDragOverSlot(day, hour)
                          ? "bg-primary/10 border-primary"
                          : "hover:bg-muted/50"
                      }`}
                      onDragOver={(e) => handleDragOver(e, day, hour)}
                      onDrop={(e) => handleDrop(e, day, hour)}
                    >
                      {dayTasks.map((task) => {
                        // Only render the task in the slot where it starts
                        if (!isTaskStart(task, hour)) return null;
                        
                        const taskHeight = task.duration * 64; // 64px = min-h-16
                        
                        return (
                          <div
                            key={task.id}
                            draggable={!!onTasksChange}
                            onDragStart={() => handleDragStart(task)}
                            onDragEnd={handleDragEnd}
                            onClick={() => onTaskClick?.(task)}
                            style={{ minHeight: `${taskHeight}px` }}
                            className={`group w-full text-left p-2 rounded-md text-xs font-medium mb-1 border transition-all cursor-pointer ${getStressColor(
                              task.stress
                            )} ${
                              draggedTask?.id === task.id
                                ? "opacity-50 scale-95"
                                : "hover:scale-105 hover:shadow-md animate-fade-in"
                            }`}
                          >
                            <div className="flex items-start gap-1">
                              {onTasksChange && (
                                <GripVertical className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 cursor-move" />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold truncate">
                                  {task.title}
                                </div>
                                <div className="flex items-center gap-1 mt-0.5">
                                  <Badge
                                    variant="secondary"
                                    className="text-[10px] px-1 py-0"
                                  >
                                    {task.duration}h
                                  </Badge>
                                  <span className="text-xs opacity-75">{task.type}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
