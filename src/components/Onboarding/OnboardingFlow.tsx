import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar, CheckCircle2, Brain } from "lucide-react";

interface OnboardingFlowProps {
  onComplete: (preferences: UserPreferences) => void;
}

export interface UserPreferences {
  taskDistribution: "focused" | "mixed";
  workStyle: "morning" | "afternoon" | "evening" | "flexible";
  breakFrequency: "frequent" | "moderate" | "minimal";
}

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({});

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(preferences as UserPreferences);
    }
  };

  const isStepComplete = () => {
    switch (step) {
      case 1:
        return !!preferences.taskDistribution;
      case 2:
        return !!preferences.workStyle;
      case 3:
        return !!preferences.breakFrequency;
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl p-8 shadow-strong animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Let's Personalize Your Experience
              </h2>
              <p className="text-muted-foreground">
                Step {step} of 3 - Help us understand your work style
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-all ${
                  i <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mb-8 min-h-64">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-primary" />
                <Label className="text-lg font-semibold">
                  How do you prefer to organize your tasks?
                </Label>
              </div>
              <RadioGroup
                value={preferences.taskDistribution}
                onValueChange={(value) =>
                  setPreferences({
                    ...preferences,
                    taskDistribution: value as "focused" | "mixed",
                  })
                }
                className="space-y-3"
              >
                <Label
                  htmlFor="focused"
                  className="flex items-start space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary cursor-pointer transition-all"
                >
                  <RadioGroupItem value="focused" id="focused" />
                  <div className="flex-1">
                    <div className="font-medium text-foreground">
                      One topic at a time (Focused)
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Complete all tasks for one subject before moving to the
                      next. Great for deep work and avoiding context switching.
                    </p>
                  </div>
                </Label>
                <Label
                  htmlFor="mixed"
                  className="flex items-start space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary cursor-pointer transition-all"
                >
                  <RadioGroupItem value="mixed" id="mixed" />
                  <div className="flex-1">
                    <div className="font-medium text-foreground">
                      Mix different tasks (Variety)
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Alternate between different subjects throughout the day.
                      Keeps things interesting and maintains energy.
                    </p>
                  </div>
                </Label>
              </RadioGroup>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-primary" />
                <Label className="text-lg font-semibold">
                  When are you most productive?
                </Label>
              </div>
              <RadioGroup
                value={preferences.workStyle}
                onValueChange={(value) =>
                  setPreferences({
                    ...preferences,
                    workStyle: value as UserPreferences["workStyle"],
                  })
                }
                className="space-y-3"
              >
                {[
                  {
                    value: "morning",
                    label: "Morning Person (6 AM - 12 PM)",
                    desc: "I'm most alert and focused in the morning hours",
                  },
                  {
                    value: "afternoon",
                    label: "Afternoon Focus (12 PM - 6 PM)",
                    desc: "I hit my stride in the afternoon",
                  },
                  {
                    value: "evening",
                    label: "Night Owl (6 PM - 12 AM)",
                    desc: "I work best in the evening and night",
                  },
                  {
                    value: "flexible",
                    label: "Flexible Schedule",
                    desc: "My productivity varies throughout the day",
                  },
                ].map((option) => (
                  <Label
                    key={option.value}
                    htmlFor={option.value}
                    className="flex items-start space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary cursor-pointer transition-all"
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <div className="flex-1">
                      <div className="font-medium text-foreground">
                        {option.label}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {option.desc}
                      </p>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-primary" />
                <Label className="text-lg font-semibold">
                  How often do you prefer breaks?
                </Label>
              </div>
              <RadioGroup
                value={preferences.breakFrequency}
                onValueChange={(value) =>
                  setPreferences({
                    ...preferences,
                    breakFrequency: value as UserPreferences["breakFrequency"],
                  })
                }
                className="space-y-3"
              >
                {[
                  {
                    value: "frequent",
                    label: "Frequent Breaks",
                    desc: "Short 5-10 minute breaks every 25-30 minutes (Pomodoro style)",
                  },
                  {
                    value: "moderate",
                    label: "Moderate Breaks",
                    desc: "15-20 minute breaks every 60-90 minutes",
                  },
                  {
                    value: "minimal",
                    label: "Minimal Breaks",
                    desc: "Longer breaks every 2-3 hours. I prefer extended focus sessions",
                  },
                ].map((option) => (
                  <Label
                    key={option.value}
                    htmlFor={option.value}
                    className="flex items-start space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary cursor-pointer transition-all"
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <div className="flex-1">
                      <div className="font-medium text-foreground">
                        {option.label}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {option.desc}
                      </p>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!isStepComplete()}
            className="ml-auto"
          >
            {step === 3 ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Complete Setup
              </>
            ) : (
              "Next"
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};
