import { useState, useEffect } from "react";
import { CalendarView } from "@/components/Calendar/CalendarView";
import { StressIndicator } from "@/components/Calendar/StressIndicator";
import { ChatInterface } from "@/components/Chat/ChatInterface";
import { OnboardingFlow, UserPreferences } from "@/components/Onboarding/OnboardingFlow";
import { Button } from "@/components/ui/button";
import { Calendar, Settings } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-background">
      {showOnboarding && (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      )}

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
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowOnboarding(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
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
