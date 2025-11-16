import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Task } from "@/types/calendar";
import { Clock, Play, ArrowRight } from "lucide-react";
import { formatDistanceToNow, isPast, isFuture, addHours } from "date-fns";

interface UpcomingTasksProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export const UpcomingTasks = ({ tasks, onTaskClick }: UpcomingTasksProps) => {
  const now = new Date();
  
  // Get current and upcoming tasks
  const currentTasks = tasks.filter(task => {
    const taskStart = task.date;
    const taskEnd = addHours(task.date, task.duration);
    return taskStart <= now && taskEnd >= now;
  });

  const upcomingTasks = tasks
    .filter(task => isFuture(task.date))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Tasks Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          {currentTasks.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Play className="h-4 w-4 text-success animate-pulse" />
                <span className="text-sm font-semibold text-success">Currently Doing</span>
              </div>
              {currentTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onTaskClick?.(task)}
                  className="bg-success/10 border border-success/30 rounded-lg p-3 mb-2 cursor-pointer hover:bg-success/20 transition-colors"
                >
                  <div className="font-medium text-sm">{task.title}</div>
                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Ends in {formatDistanceToNow(addHours(task.date, task.duration))}
                  </div>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {task.type}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {upcomingTasks.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ArrowRight className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Upcoming</span>
              </div>
              {upcomingTasks.map((task, index) => (
                <div
                  key={task.id}
                  onClick={() => onTaskClick?.(task)}
                  className="border border-border rounded-lg p-3 mb-2 cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div className="font-medium text-sm">{task.title}</div>
                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Starts in {formatDistanceToNow(task.date)}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {task.type}
                    </Badge>
                    {task.stress === "high" && (
                      <Badge variant="destructive" className="text-xs">
                        High Priority
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentTasks.length === 0 && upcomingTasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No upcoming tasks scheduled</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
