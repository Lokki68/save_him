import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: { title: string }[];
}

export function StepIndicator({
  currentStep,
  totalSteps,
  steps,
}: StepIndicatorProps) {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="px-4 py-3 bg-white border-b">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-600">
          Étape {currentStep} sur {totalSteps}
        </span>
        <span className="text-sm text-gray-500">
          {steps[currentStep - 1]?.title}
        </span>
      </div>
      <Progress value={progress} className="h-2" />

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-3">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div
              key={index}
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all",
                isCompleted && "bg-green-500 text-white",
                isCurrent && "bg-blue-600 text-white ring-2 ring-blue-200",
                !isCompleted && !isCurrent && "bg-gray-200 text-gray-500"
              )}
            >
              {isCompleted ? <Check className="h-3.5 w-3.5" /> : stepNumber}
            </div>
          );
        })}
      </div>
    </div>
  );
}
