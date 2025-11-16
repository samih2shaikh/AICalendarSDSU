import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";

interface Task {
  id: string;
  title: string;
  date: Date;
  duration: number;
  stress: "low" | "medium" | "high";
  type: string;
}

interface CalendarViewProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export const CalendarView = ({ tasks, onTaskClick }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const weekStart = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getTasksForDateTime = (day: Date, hour: number) => {
    return tasks.filter((task) => {
      const taskHour = task.date.getHours();
      return isSameDay(task.date, day) && taskHour === hour;
    });
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
                      className="min-h-16 p-1 border-r border-b border-border last:border-r-0 hover:bg-muted/50 transition-colors"
                    >
                      {dayTasks.map((task) => (
                        <button
                          key={task.id}
                          onClick={() => onTaskClick?.(task)}
                          className={`w-full text-left p-2 rounded-md text-xs font-medium mb-1 border transition-all ${getStressColor(
                            task.stress
                          )}`}
                        >
                          <div className="font-semibold truncate">
                            {task.title}
                          </div>
                          <div className="text-xs opacity-75">{task.type}</div>
                        </button>
                      ))}
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
