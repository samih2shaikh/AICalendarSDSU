export interface Task {
  id: string;
  title: string;
  date: Date;
  duration: number;
  stress: "low" | "medium" | "high";
  type: string;
  dueDate?: Date;
}

export interface StressMetrics {
  busyScore: number;
  procrastinationRisk: number;
  dayIntensity: number;
  deadlinePressure: number;
  recommendations: string[];
}

export interface RescheduleWarning {
  type: "conflict" | "deadline" | "overload" | "optimal-time";
  severity: "low" | "medium" | "high";
  message: string;
  affectedTasks: string[];
}

export interface TaskTemplate {
  title: string;
  duration: number;
  order: number;
  dueDate?: Date;
}
