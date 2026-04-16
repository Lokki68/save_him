
"use client";

import { useAssessment, TOTAL_STEPS } from "@/hooks/useAssessment";
import { EmergencyBanner } from "@/components/shared/EmergencyBanner";
import { StepIndicator } from "@/components/layout/StepIndicator";
import { StepSituation } from "@/components/steps/StepSituation";
import { StepVictim } from "@/components/steps/StepVictim";
import { StepConsciousness } from "@/components/steps/StepConsciousness";
import { StepBreathing } from "@/components/steps/StepBreathing";
import { StepDetails } from "@/components/steps/StepDetails";
import { StepSummary } from "@/components/steps/StepSummary";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

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
  } = useAssessment();

  const isFinalStep = currentStep === TOTAL_STEPS;
  const canProceed = (() => {
    if (currentStep === 1) return assessment.situationType !== null;
    if (currentStep === 3) return assessment.consciousnessLevel !== null;
    if (currentStep === 4) return assessment.breathingStatus !== null;
    return true;
  })();

  const handleNext = () => {
    if (currentStep === TOTAL_STEPS - 1) {
      finalize();
    } else {
      nextStep();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">
      {/* Bannière urgence */}
      <EmergencyBanner />

      {/* Indicateur d'étapes */}
      {!isFinalStep && (
        <StepIndicator
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          steps={STEPS_CONFIG}
        />
      )}

      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <h1 className="text-lg font-bold text-gray-900">
            Guide Premiers Secours
          </h1>
        </div>
      </div>

      {/* Contenu */}
      <div className="flex-1 px-4 pb-24 overflow-y-auto">
        {currentStep === 1 && (
          <StepSituation assessment={assessment} onChange={updateAssessment} />
        )}
        {currentStep === 2 && (
          <StepVictim assessment={assessment} onChange={updateAssessment} />
        )}
        {currentStep === 3 && (
          <StepConsciousness
            assessment={assessment}
            onChange={updateAssessment}
          />
        )}
        {currentStep === 4 && (
          <StepBreathing assessment={assessment} onChange={updateAssessment} />
        )}
        {currentStep === 5 && (
          <StepDetails assessment={assessment} onChange={updateAssessment} />
        )}
        {currentStep === 6 && (
          <StepSummary
            assessment={assessment}
            decision={decision}
            onReset={reset}
          />
        )}
      </div>

      {/* Navigation fixe en bas */}
      {!isFinalStep && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t px-4 py-3 flex gap-3">
          <Button
            variant="outline"
            className="flex-1 gap-1"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Retour
          </Button>
          <Button
            className={cn(
              "flex-[2] gap-1",
              currentStep === TOTAL_STEPS - 1 && "bg-red-600 hover:bg-red-700"
            )}
            onClick={handleNext}
            disabled={!canProceed}
          >
            {currentStep === TOTAL_STEPS - 1
              ? "Voir les gestes & message"
              : "Continuer"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
