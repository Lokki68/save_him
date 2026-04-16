// src/app/page.tsx

"use client";

import { useAssessment } from "@/hooks/useAssessment";
import { EmergencyBanner } from "@/components/shared/EmergencyBanner";
import { StepIndicator } from "@/components/layout/StepIndicator";
import { NavigationButtons } from "@/components/layout/NavigationButtons";
import { StepTransition } from "@/components/layout/StepTransition";
import { StepSituation } from "@/components/steps/StepSituation";
import { StepVictim } from "@/components/steps/StepVictim";
import { StepConsciousness } from "@/components/steps/StepConsciousness";
import { StepBreathing } from "@/components/steps/StepBreathing";
import { StepDetails } from "@/components/steps/StepDetails";
import { StepSummary } from "@/components/steps/StepSummary";
import { HeartPulse } from "lucide-react";

const STEPS_CONFIG = [
  { title: "Situation" },
  { title: "Victime" },
  { title: "Conscience" },
  { title: "Respiration" },
  { title: "Détails" },
  { title: "Résumé" },
];

export default function Home() {
  const {
    currentStep,
    assessment,
    decision,
    updateAssessment,
    nextStep,
    prevStep,
    finalize,
    reset,
    isStepValid,
    TOTAL_STEPS,
  } = useAssessment();

  const isFinalStep = currentStep === TOTAL_STEPS;

  const handleNext = () => {
    if (currentStep === TOTAL_STEPS - 1) {
      finalize();
    } else {
      nextStep();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepSituation assessment={assessment} onChange={updateAssessment} />;
      case 2:
        return <StepVictim assessment={assessment} onChange={updateAssessment} />;
      case 3:
        return <StepConsciousness assessment={assessment} onChange={updateAssessment} />;
      case 4:
        return <StepBreathing assessment={assessment} onChange={updateAssessment} />;
      case 5:
        return <StepDetails assessment={assessment} onChange={updateAssessment} />;
      case 6:
        return <StepSummary assessment={assessment} decision={decision} onReset={reset} />;
      default:
        return null;
    }
  };

  return (
      <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto shadow-xl">
        {/* Bannière urgence */}
        <EmergencyBanner />

        {/* Header app */}
        <div className="px-4 pt-4 pb-2 flex items-center gap-2 bg-white border-b">
          <div className="bg-red-100 p-1.5 rounded-lg">
            <HeartPulse className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-tight">
              SecourGuide
            </h1>
            <p className="text-xs text-gray-500">Guide premiers secours</p>
          </div>
        </div>

        {/* Indicateur d'étapes */}
        {!isFinalStep && (
            <StepIndicator
                currentStep={currentStep}
                totalSteps={TOTAL_STEPS}
                steps={STEPS_CONFIG}
            />
        )}

        {/* Contenu avec transition */}
        <div className="flex-1 px-4 pt-5 pb-28 overflow-y-auto">
          <StepTransition stepKey={currentStep}>
            {renderStep()}
          </StepTransition>
        </div>

        {/* Navigation */}
        {!isFinalStep && (
            <NavigationButtons
                currentStep={currentStep}
                totalSteps={TOTAL_STEPS}
                canProceed={isStepValid(currentStep)}
                onNext={handleNext}
                onPrev={prevStep}
            />
        )}
      </div>
  );
}
