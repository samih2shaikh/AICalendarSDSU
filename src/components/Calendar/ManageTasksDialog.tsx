import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { Task, RescheduleWarning } from "@/types/calendar";

interface ManageTasksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tasks: Task[];
  onReschedule: (taskIds: string[], newDate: Date) => void;
}

export const ManageTasksDialog = ({
  open,
  onOpenChange,
  tasks,
  onReschedule,
}: ManageTasksDialogProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<RescheduleWarning[]>([]);

  const tasksOnDate = tasks.filter(
    (task) =>
      selectedDate &&
      task.date.toDateString() === selectedDate.toDateString()
  );

  const handleTaskSelect = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const analyzeReschedule = () => {
    const newWarnings: RescheduleWarning[] = [];
    
    selectedTasks.forEach((taskId) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      // Check deadline proximity
      if (task.dueDate) {
        const daysUntilDue = Math.floor(
          (task.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysUntilDue <= 2) {
          newWarnings.push({
            type: "deadline",
            severity: "high",
            message: `${task.title} is due in ${daysUntilDue} days`,
            affectedTasks: [taskId],
          });
        }
      }

      // Check for high stress tasks
      if (task.stress === "high") {
        newWarnings.push({
          type: "optimal-time",
          severity: "medium",
          message: `${task.title} is high priority - reschedule carefully`,
          affectedTasks: [taskId],
        });
      }
    });

    setWarnings(newWarnings);
  };

  const handleConfirmReschedule = () => {
    if (!selectedDate || selectedTasks.length === 0) return;
    onReschedule(selectedTasks, selectedDate);
    onOpenChange(false);
    setSelectedTasks([]);
    setWarnings([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Manage Tasks
          </DialogTitle>
          <DialogDescription>
            Select tasks from a busy day to reschedule them to a better time
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3">Select Date</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-3">
                Tasks on {selectedDate && format(selectedDate, "MMM d, yyyy")}
              </h3>
              {tasksOnDate.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No tasks scheduled for this day
                </p>
              ) : (
                <div className="space-y-2">
                  {tasksOnDate.map((task) => (
                    <Card
                      key={task.id}
                      className={`p-3 cursor-pointer transition-colors ${
                        selectedTasks.includes(task.id)
                          ? "bg-primary/10 border-primary"
                          : "hover:bg-accent"
                      }`}
                      onClick={() => handleTaskSelect(task.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{task.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {format(task.date, "h:mm a")} ({task.duration}h)
                            </span>
                          </div>
                        </div>
                        <Badge
                          variant={
                            task.stress === "high"
                              ? "destructive"
                              : task.stress === "medium"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {task.stress}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {selectedTasks.length > 0 && (
              <div>
                <Button
                  onClick={analyzeReschedule}
                  variant="outline"
                  className="w-full"
                >
                  Preview Reschedule
                </Button>
              </div>
            )}

            {warnings.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  Warnings
                </h4>
                {warnings.map((warning, idx) => (
                  <Card
                    key={idx}
                    className={`p-3 ${
                      warning.severity === "high"
                        ? "border-destructive"
                        : warning.severity === "medium"
                        ? "border-warning"
                        : "border-border"
                    }`}
                  >
                    <p className="text-sm">{warning.message}</p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmReschedule}
            disabled={selectedTasks.length === 0}
          >
            Reschedule {selectedTasks.length} Task(s)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
