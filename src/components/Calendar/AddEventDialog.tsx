import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { CalendarIcon, Plus, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { z } from "zod";

const eventSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  type: z.enum(["assignment", "study", "project", "exam", "meeting", "sleep", "gym", "movie", "travel"]),
  dueDate: z.date({ required_error: "Due date is required" }),
  priority: z.enum(["low", "medium", "high"]),
  estimatedHours: z.number().min(0.5, "Minimum 0.5 hours").max(24, "Maximum 24 hours"),
  recurrence: z.enum(["none", "daily", "weekly", "monthly"]).optional(),
  category: z.enum(["work", "personal"]).optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

interface SubTask {
  title: string;
  duration: number;
  order: number;
}

const taskTemplates: Record<string, SubTask[]> = {
  assignment: [
    { title: "Research & Gather Resources", duration: 1, order: 1 },
    { title: "Create Outline", duration: 0.5, order: 2 },
    { title: "Write First Draft", duration: 2, order: 3 },
    { title: "Review & Edit", duration: 1, order: 4 },
    { title: "Final Review & Submit", duration: 0.5, order: 5 },
  ],
  study: [
    { title: "Review Lecture Notes", duration: 1, order: 1 },
    { title: "Read Course Material", duration: 1.5, order: 2 },
    { title: "Practice Problems", duration: 2, order: 3 },
    { title: "Create Summary Notes", duration: 1, order: 4 },
    { title: "Self-Assessment Quiz", duration: 0.5, order: 5 },
  ],
  project: [
    { title: "Project Planning & Requirements", duration: 1, order: 1 },
    { title: "Research & Design", duration: 2, order: 2 },
    { title: "Implementation Phase 1", duration: 3, order: 3 },
    { title: "Implementation Phase 2", duration: 3, order: 4 },
    { title: "Testing & Debugging", duration: 2, order: 5 },
    { title: "Documentation", duration: 1, order: 6 },
    { title: "Final Review", duration: 1, order: 7 },
  ],
  exam: [
    { title: "Review All Materials", duration: 2, order: 1 },
    { title: "Practice Past Exams", duration: 2, order: 2 },
    { title: "Focus on Weak Areas", duration: 2, order: 3 },
    { title: "Create Cheat Sheet/Summary", duration: 1, order: 4 },
    { title: "Final Review Session", duration: 1.5, order: 5 },
  ],
  meeting: [
    { title: "Prepare Agenda", duration: 0.5, order: 1 },
    { title: "Review Materials", duration: 0.5, order: 2 },
    { title: "Actual Meeting", duration: 1, order: 3 },
    { title: "Follow-up Actions", duration: 0.5, order: 4 },
  ],
  sleep: [],
  gym: [],
  movie: [],
  travel: [],
};

interface AddEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddEvent: (event: EventFormData, subtasks: SubTask[]) => void;
}

export const AddEventDialog = ({ open, onOpenChange, onAddEvent }: AddEventDialogProps) => {
  const [formData, setFormData] = useState<Partial<EventFormData>>({
    priority: "medium",
    estimatedHours: 5,
    recurrence: "none",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = () => {
    try {
      const validated = eventSchema.parse(formData);
      const subtasks = taskTemplates[validated.type] || [];
      
      onAddEvent(validated, subtasks);
      toast.success("Event created!", {
        description: `"${validated.title}" has been broken down into ${subtasks.length} tasks and added to your calendar.`,
      });
      
      // Reset form
      setFormData({ priority: "medium", estimatedHours: 5, recurrence: "none" });
      setErrors({});
      setShowPreview(false);
      onOpenChange(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
        toast.error("Please fix the errors in the form");
      }
    }
  };

  const getSubtaskPreview = () => {
    if (!formData.type) return null;
    return taskTemplates[formData.type] || [];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Plus className="h-5 w-5 text-primary" />
            Add New Event
          </DialogTitle>
          <DialogDescription>
            Enter event details and we'll automatically break it down into manageable tasks
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              placeholder="e.g., CS 101 Final Project"
              value={formData.title || ""}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                setErrors({ ...errors, title: "" });
              }}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Event Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => {
                  setFormData({ ...formData, type: value as EventFormData["type"] });
                  setErrors({ ...errors, type: "" });
                  setShowPreview(true);
                }}
              >
                <SelectTrigger className={errors.type ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="assignment">📝 Assignment</SelectItem>
                  <SelectItem value="study">📚 Study Block</SelectItem>
                  <SelectItem value="project">🚀 Project</SelectItem>
                  <SelectItem value="exam">📖 Exam Prep</SelectItem>
                  <SelectItem value="meeting">👥 Meeting</SelectItem>
                  <SelectItem value="sleep">😴 Sleep</SelectItem>
                  <SelectItem value="gym">💪 Gym</SelectItem>
                  <SelectItem value="movie">🎬 Movie</SelectItem>
                  <SelectItem value="travel">✈️ Travel</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-destructive">{errors.type}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData({ ...formData, priority: value as EventFormData["priority"] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">🟢 Low</SelectItem>
                  <SelectItem value="medium">🟡 Medium</SelectItem>
                  <SelectItem value="high">🔴 High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Due Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      errors.dueDate ? "border-destructive" : ""
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dueDate ? (
                      format(formData.dueDate, "PPP")
                    ) : (
                      <span className="text-muted-foreground">Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.dueDate}
                    onSelect={(date) => {
                      setFormData({ ...formData, dueDate: date });
                      setErrors({ ...errors, dueDate: "" });
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.dueDate && (
                <p className="text-sm text-destructive">{errors.dueDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours">Estimated Hours *</Label>
              <Input
                id="hours"
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                value={formData.estimatedHours || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimatedHours: parseFloat(e.target.value),
                  })
                }
                className={errors.estimatedHours ? "border-destructive" : ""}
              />
              {errors.estimatedHours && (
                <p className="text-sm text-destructive">{errors.estimatedHours}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recurrence">Repeat</Label>
            <Select
              value={formData.recurrence || "none"}
              onValueChange={(value) =>
                setFormData({ ...formData, recurrence: value as EventFormData["recurrence"] })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">🚫 None</SelectItem>
                <SelectItem value="daily">📅 Daily</SelectItem>
                <SelectItem value="weekly">📆 Weekly</SelectItem>
                <SelectItem value="monthly">🗓️ Monthly</SelectItem>
              </SelectContent>
            </Select>
            {formData.recurrence && formData.recurrence !== "none" && (
              <p className="text-xs text-muted-foreground mt-1">
                This event will repeat {formData.recurrence}
              </p>
            )}
          </div>

          {showPreview && formData.type && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <h4 className="font-semibold text-foreground">
                  {getSubtaskPreview().length > 0 ? "AI Task Breakdown Preview" : "Event Preview"}
                </h4>
              </div>
              {getSubtaskPreview().length > 0 ? (
                <>
                  <p className="text-sm text-muted-foreground mb-3">
                    This event will be automatically divided into the following subtasks:
                  </p>
                  <div className="space-y-2">
                    {getSubtaskPreview().map((subtask, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-card rounded border border-border"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                            {subtask.order}
                          </span>
                          <span className="text-sm text-foreground">{subtask.title}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ~{subtask.duration}h
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  This personal event will be added as a single {formData.estimatedHours}-hour block to your calendar.
                  {formData.recurrence && formData.recurrence !== "none" && (
                    <span className="block mt-2 text-primary font-medium">
                      ✨ Will repeat {formData.recurrence}
                    </span>
                  )}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Sparkles className="mr-2 h-4 w-4" />
            Create & Break Down
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
