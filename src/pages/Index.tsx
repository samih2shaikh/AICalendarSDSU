import { useState, useEffect } from "react";
import { CalendarView } from "@/components/Calendar/CalendarView";
import { StressIndicator } from "@/components/Calendar/StressIndicator";
import { ChatInterface } from "@/components/Chat/ChatInterface";
import { OnboardingFlow, UserPreferences } from "@/components/Onboarding/OnboardingFlow";
import { AddEventDialog } from "@/components/Calendar/AddEventDialog";
import { Button } from "@/components/ui/button";
import { Calendar, Settings, Plus } from "lucide-react";
import { addDays, addHours, setHours } from "date-fns";
import { toast } from "sonner";

// Sample data for demonstration
const sampleTasks = [
  {
    id: "1",
    title: "CS 101 Assignment",
    date: new Date(2025, 10, 17, 10, 0),
    duration: 2,
    stress: "medium" as const,
    type: "Assignment",
  },
  {
    id: "2",
    title: "Math Midterm Study",
    date: new Date(2025, 10, 17, 14, 0),
    duration: 3,
    stress: "high" as const,
    type: "Study",
  },
  {
    id: "3",
    title: "English Essay Draft",
    date: new Date(2025, 10, 18, 9, 0),
    duration: 2,
    stress: "medium" as const,
    type: "Assignment",
  },
  {
    id: "4",
    title: "Group Project Meeting",
    date: new Date(2025, 10, 18, 15, 0),
    duration: 1,
    stress: "low" as const,
    type: "Meeting",
  },
  {
    id: "5",
    title: "Physics Lab Report",
    date: new Date(2025, 10, 19, 11, 0),
    duration: 2,
    stress: "high" as const,
    type: "Assignment",
  },
];

const Index = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [tasks, setTasks] = useState(sampleTasks);
  const [showAddEvent, setShowAddEvent] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const savedPreferences = localStorage.getItem("userPreferences");
    if (!savedPreferences) {
      setShowOnboarding(true);
    } else {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  const handleOnboardingComplete = (userPreferences: UserPreferences) => {
    setPreferences(userPreferences);
    localStorage.setItem("userPreferences", JSON.stringify(userPreferences));
    setShowOnboarding(false);
  };

  const calculateStressScore = () => {
    const highStressTasks = tasks.filter((t) => t.stress === "high").length;
    const mediumStressTasks = tasks.filter((t) => t.stress === "medium").length;
    return Math.min(
      100,
      highStressTasks * 20 + mediumStressTasks * 10
    );
  };

  const handleAddEvent = (
    event: any,
    subtasks: Array<{ title: string; duration: number; order: number }>
  ) => {
    // Determine stress level based on priority and due date
    const getStressLevel = (priority: string): "low" | "medium" | "high" => {
      if (priority === "high") return "high";
      if (priority === "medium") return "medium";
      return "low";
    };

    // Find available time slots based on user preferences
    const findNextAvailableSlot = (startDate: Date, durationHours: number) => {
      // Start from tomorrow at 9 AM
      let currentSlot = setHours(addDays(new Date(), 1), 9);
      
      // Check if slot conflicts with existing tasks
      const hasConflict = (date: Date, duration: number) => {
        return tasks.some((task) => {
          const taskEnd = addHours(task.date, task.duration);
          const slotEnd = addHours(date, duration);
          return (
            date < taskEnd &&
            slotEnd > task.date &&
            date.toDateString() === task.date.toDateString()
          );
        });
      };

      // Find next available slot
      while (hasConflict(currentSlot, durationHours)) {
        currentSlot = addHours(currentSlot, 1);
        // If we reach end of day (9 PM), move to next day at 9 AM
        if (currentSlot.getHours() >= 21) {
          currentSlot = setHours(addDays(currentSlot, 1), 9);
        }
      }

      return currentSlot;
    };

    // Create tasks from subtasks
    const newTasks = subtasks.map((subtask, index) => {
      const taskDate = findNextAvailableSlot(
        index === 0 ? new Date() : tasks[tasks.length - 1]?.date || new Date(),
        subtask.duration
      );

      return {
        id: `${Date.now()}-${index}`,
        title: `${event.title}: ${subtask.title}`,
        date: taskDate,
        duration: subtask.duration,
        stress: getStressLevel(event.priority),
        type: event.type.charAt(0).toUpperCase() + event.type.slice(1),
      };
    });

    setTasks([...tasks, ...newTasks]);
    
    toast.success("Tasks scheduled!", {
      description: `${newTasks.length} subtasks have been intelligently scheduled based on your calendar availability.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {showOnboarding && (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      )}

      <AddEventDialog
        open={showAddEvent}
        onOpenChange={setShowAddEvent}
        onAddEvent={handleAddEvent}
      />

      <header className="border-b border-border bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  SDSU Smart Calendar
                </h1>
                <p className="text-sm text-muted-foreground">
                  AI-Powered Schedule Management
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowAddEvent(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Event
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowOnboarding(true)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-120px)]">
          <div className="lg:col-span-2 flex flex-col">
            <CalendarView
              tasks={tasks}
              onTaskClick={(task) => console.log("Task clicked:", task)}
            />
          </div>
          <div className="flex flex-col gap-4">
            <StressIndicator
              score={calculateStressScore()}
              totalTasks={tasks.length}
              completedTasks={0}
            />
            <div className="flex-1 min-h-0">
              <ChatInterface
                onSendMessage={(message) =>
                  console.log("Message sent:", message)
                }
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
