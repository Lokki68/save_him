// src/components/layout/NavigationButtons.tsx

"use client";

import { ChevronLeft, ChevronRight, Siren } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  onNext: () => void;
  onPrev: () => void;
}

export function NavigationButtons({
                                    currentStep,
                                    totalSteps,
                                    canProceed,
                                    onNext,
                                    onPrev,
                                  }: NavigationButtonsProps) {
  const isFinalAction = currentStep === totalSteps - 1;

  return (
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur border-t px-4 py-3 flex gap-3 safe-area-pb">
        <Button
            variant="outline"
            className="flex-1 gap-1 h-12"
            onClick={onPrev}
            disabled={currentStep === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Retour
        </Button>
        <Button
            className={cn(
                "flex-2 gap-2 h-12 font-semibold transition-all",
                isFinalAction
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700"
            )}
            onClick={onNext}
            disabled={!canProceed}
        >
          {isFinalAction ? (
              <>
                <Siren className="h-4 w-4" />
                Voir les gestes & alerte
              </>
          ) : (
              <>
                Continuer
                <ChevronRight className="h-4 w-4" />
              </>
          )}
        </Button>
      </div>
  );
}
