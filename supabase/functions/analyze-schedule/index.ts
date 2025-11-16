import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Task {
  id: string;
  title: string;
  date: string;
  duration: number;
  stress: "low" | "medium" | "high";
  dueDate?: string;
}

interface StressMetrics {
  busyScore: number;
  procrastinationRisk: number;
  dayIntensity: number;
  deadlinePressure: number;
  recommendations: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { tasks, preferences } = await req.json();

    // Calculate busy score
    const totalHours = tasks.reduce((sum: number, t: Task) => sum + t.duration, 0);
    const workingDaysPerWeek = 7;
    const optimalHoursPerDay = preferences?.workHoursPerDay || 6;
    const availableHours = workingDaysPerWeek * optimalHoursPerDay;
    const busyScore = Math.min(100, (totalHours / availableHours) * 100);

    // Calculate procrastination risk
    const now = new Date();
    const procrastinationTasks = tasks.filter((t: Task) => {
      if (!t.dueDate) return false;
      const dueDate = new Date(t.dueDate);
      const timeUntilDue = dueDate.getTime() - now.getTime();
      const daysUntilDue = timeUntilDue / (1000 * 60 * 60 * 24);
      return daysUntilDue < 3 && t.stress === "high";
    });
    const procrastinationRisk = Math.min(100, (procrastinationTasks.length / tasks.length) * 100);

    // Calculate day intensity
    const tasksByDay = tasks.reduce((acc: Record<string, number>, t: Task) => {
      const dateKey = new Date(t.date).toDateString();
      acc[dateKey] = (acc[dateKey] || 0) + t.duration;
      return acc;
    }, {});
    const maxDayHours = Math.max(...(Object.values(tasksByDay) as number[]), 0);
    const dayIntensity = Math.min(100, (maxDayHours / optimalHoursPerDay) * 100);

    // Calculate deadline pressure
    const highPriorityUpcoming = tasks.filter((t: Task) => {
      if (!t.dueDate) return false;
      const dueDate = new Date(t.dueDate);
      const daysUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      return daysUntilDue <= 7 && t.stress === "high";
    });
    const deadlinePressure = Math.min(100, (highPriorityUpcoming.length / Math.max(tasks.length, 1)) * 100);

    // Generate recommendations
    const recommendations: string[] = [];
    if (procrastinationRisk > 60) {
      recommendations.push(`High procrastination risk - ${procrastinationTasks.length} tasks due soon`);
    }
    if (dayIntensity > 80) {
      const overloadedDay = Object.entries(tasksByDay).find(([_, hours]) => (hours as number) > optimalHoursPerDay * 1.3);
      if (overloadedDay) {
        recommendations.push(`${new Date(overloadedDay[0]).toLocaleDateString()} is overloaded - consider rescheduling`);
      }
    }
    if (deadlinePressure < 30 && busyScore < 50) {
      recommendations.push("Great job! Your workload is well-balanced");
    }
    if (busyScore > 80) {
      recommendations.push("Schedule is packed - prioritize high-impact tasks");
    }

    const metrics: StressMetrics = {
      busyScore,
      procrastinationRisk,
      dayIntensity,
      deadlinePressure,
      recommendations,
    };

    return new Response(JSON.stringify(metrics), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Analysis error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
