import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingDown, TrendingUp, AlertTriangle, Calendar, Target } from "lucide-react";
import { StressMetrics } from "@/types/calendar";

interface StressIndicatorProps {
  score: number;
  totalTasks: number;
  completedTasks: number;
  metrics?: StressMetrics;
}

export const StressIndicator = ({
  score,
  totalTasks,
  completedTasks,
  metrics,
}: StressIndicatorProps) => {
  const getStressLevel = () => {
    if (score <= 30) return { label: "Low Stress", color: "text-success" };
    if (score <= 60)
      return { label: "Moderate Stress", color: "text-warning" };
    return { label: "High Stress", color: "text-destructive" };
  };

  const stressLevel = getStressLevel();
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const getMetricColor = (value: number) => {
    if (value <= 30) return "text-success";
    if (value <= 60) return "text-warning";
    return "text-destructive";
  };

  const getMetricBadge = (value: number) => {
    if (value <= 30) return { variant: "secondary" as const, label: "Good" };
    if (value <= 60) return { variant: "default" as const, label: "Moderate" };
    return { variant: "destructive" as const, label: "High" };
  };

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

        {metrics && (
          <div className="space-y-3 pt-4 border-t border-border">
            <h4 className="text-sm font-semibold text-foreground">Detailed Metrics</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3 bg-background/50">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Busy Level</span>
                  </div>
                  <Badge {...getMetricBadge(metrics.busyScore)}>
                    {getMetricBadge(metrics.busyScore).label}
                  </Badge>
                </div>
                <p className={`text-lg font-bold ${getMetricColor(metrics.busyScore)}`}>
                  {metrics.busyScore.toFixed(0)}%
                </p>
              </Card>

              <Card className="p-3 bg-background/50">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Procrastination</span>
                  </div>
                  <Badge {...getMetricBadge(metrics.procrastinationRisk)}>
                    {getMetricBadge(metrics.procrastinationRisk).label}
                  </Badge>
                </div>
                <p className={`text-lg font-bold ${getMetricColor(metrics.procrastinationRisk)}`}>
                  {metrics.procrastinationRisk.toFixed(0)}%
                </p>
              </Card>

              <Card className="p-3 bg-background/50">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Day Intensity</span>
                  </div>
                  <Badge {...getMetricBadge(metrics.dayIntensity)}>
                    {getMetricBadge(metrics.dayIntensity).label}
                  </Badge>
                </div>
                <p className={`text-lg font-bold ${getMetricColor(metrics.dayIntensity)}`}>
                  {metrics.dayIntensity.toFixed(0)}%
                </p>
              </Card>

              <Card className="p-3 bg-background/50">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    <Target className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Deadline Pressure</span>
                  </div>
                  <Badge {...getMetricBadge(metrics.deadlinePressure)}>
                    {getMetricBadge(metrics.deadlinePressure).label}
                  </Badge>
                </div>
                <p className={`text-lg font-bold ${getMetricColor(metrics.deadlinePressure)}`}>
                  {metrics.deadlinePressure.toFixed(0)}%
                </p>
              </Card>
            </div>

            {metrics.recommendations.length > 0 && (
              <div className="pt-2">
                <h5 className="text-xs font-medium text-muted-foreground mb-2">Recommendations</h5>
                <div className="space-y-1">
                  {metrics.recommendations.map((rec, idx) => (
                    <p key={idx} className="text-xs text-foreground bg-accent/50 p-2 rounded">
                      {rec}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {metrics.workLifeBalance && (
              <div className="pt-3 mt-3 border-t border-border">
                <h5 className="text-xs font-medium text-muted-foreground mb-2">Work-Life Balance</h5>
                <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                  <div className="bg-primary/10 p-2 rounded">
                    <p className="text-muted-foreground">Work</p>
                    <p className="font-semibold text-foreground">{metrics.workLifeBalance.workHours}h</p>
                  </div>
                  <div className="bg-success/10 p-2 rounded">
                    <p className="text-muted-foreground">Personal</p>
                    <p className="font-semibold text-foreground">{metrics.workLifeBalance.personalHours}h</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Balance Score</span>
                    <span className="font-semibold">{Math.round(metrics.workLifeBalance.balanceScore)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all ${
                        metrics.workLifeBalance.balanceScore > 50 
                          ? "bg-success" 
                          : "bg-warning"
                      }`}
                      style={{ width: `${Math.min(100, metrics.workLifeBalance.balanceScore)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground italic mt-1">
                    {metrics.workLifeBalance.suggestion}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
