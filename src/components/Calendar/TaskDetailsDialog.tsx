import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/types/calendar";
import { format } from "date-fns";
import { Calendar, Clock, AlertCircle, Repeat, Briefcase, User } from "lucide-react";

interface TaskDetailsDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TaskDetailsDialog = ({ task, open, onOpenChange }: TaskDetailsDialogProps) => {
  if (!task) return null;

  const getStressColor = (stress: string) => {
    switch (stress) {
      case "low":
        return "bg-success/20 text-success-foreground border-success";
      case "medium":
        return "bg-warning/20 text-warning-foreground border-warning";
      case "high":
        return "bg-destructive/20 text-destructive-foreground border-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{task.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getStressColor(task.stress)}>
              {task.stress.toUpperCase()} Priority
            </Badge>
            <Badge variant="secondary">{task.type}</Badge>
            {task.category && (
              <Badge variant="outline" className="gap-1">
                {task.category === "work" ? (
                  <Briefcase className="h-3 w-3" />
                ) : (
                  <User className="h-3 w-3" />
                )}
                {task.category}
              </Badge>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Scheduled:</span>
              <span>{format(task.date, "EEEE, MMMM d, yyyy 'at' h:mm a")}</span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Duration:</span>
              <span>{task.duration} hour{task.duration !== 1 ? 's' : ''}</span>
            </div>

            {task.dueDate && (
              <div className="flex items-center gap-3 text-sm">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Due Date:</span>
                <span className={
                  new Date(task.dueDate) < new Date() 
                    ? "text-destructive font-semibold" 
                    : ""
                }>
                  {format(new Date(task.dueDate), "EEEE, MMMM d, yyyy")}
                </span>
              </div>
            )}

            {task.recurrence && (
              <div className="flex items-center gap-3 text-sm">
                <Repeat className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Recurrence:</span>
                <span className="capitalize">{task.recurrence.frequency}</span>
                {task.recurrence.endDate && (
                  <span className="text-muted-foreground">
                    until {format(new Date(task.recurrence.endDate), "MMM d, yyyy")}
                  </span>
                )}
              </div>
            )}

            {task.parentTaskTitle && (
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Subtask of:</p>
                <p className="font-medium">{task.parentTaskTitle}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
