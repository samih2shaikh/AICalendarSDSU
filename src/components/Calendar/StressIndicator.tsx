import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingDown, TrendingUp } from "lucide-react";

interface StressIndicatorProps {
  score: number;
  totalTasks: number;
  completedTasks: number;
}

export const StressIndicator = ({
  score,
  totalTasks,
  completedTasks,
}: StressIndicatorProps) => {
  const getStressLevel = () => {
    if (score <= 30) return { label: "Low Stress", color: "text-success" };
    if (score <= 60)
      return { label: "Moderate Stress", color: "text-warning" };
    return { label: "High Stress", color: "text-destructive" };
  };

  const stressLevel = getStressLevel();
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Card className="p-6 shadow-medium">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Brain className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Stress Score</h3>
          <p className="text-sm text-muted-foreground">Weekly assessment</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className={`text-4xl font-bold ${stressLevel.color}`}>
              {score}
            </span>
            <span className={`text-sm font-medium ${stressLevel.color}`}>
              {stressLevel.label}
            </span>
          </div>
          <Progress value={score} className="h-3" />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <TrendingUp className="h-3 w-3" />
              <span>Total Tasks</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{totalTasks}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <TrendingDown className="h-3 w-3" />
              <span>Completed</span>
            </div>
            <p className="text-2xl font-bold text-success">{completedTasks}</p>
          </div>
        </div>

        <div className="pt-2">
          <div className="text-xs text-muted-foreground mb-1">
            Completion Rate
          </div>
          <Progress value={completionRate} className="h-2" />
          <div className="text-right text-xs text-muted-foreground mt-1">
            {completionRate.toFixed(0)}%
          </div>
        </div>
      </div>
    </Card>
  );
};
