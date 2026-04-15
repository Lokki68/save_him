
import { useState, useCallback } from "react";
import { Assessment, UrgencyLevel } from "@/types/assessment";
import { analyzeAssessment, DecisionResult } from "@/lib/decision-engine";
import { generateEmergencyMessage } from "@/lib/message-generator";

const INITIAL_ASSESSMENT: Assessment = {
  situationType: null,
  situationDescription: "",
  victimInfo: {
    approximateAge: undefined,
    gender: undefined,
    isAlone: true,
  },
  consciousnessLevel: null,
  respondsToVoice: null,
  respondsToPain: null,
  breathingStatus: null,
  breathingRate: undefined,
  traumaDetails: {
    headInjury: false,
    spineInjury: false,
    fracture: false,
    location: "",
  },
  malaiseDetails: {
    chestPain: false,
    radiatingPain: false,
    facialAsymmetry: false,
    speechDifficulty: false,
    armWeakness: false,
    diabetic: null,
  },
  bleedingDetails: {
    isImportant: false,
    location: "",
    isControlled: false,
  },
  environment: {
    isSafe: true,
    numberOfVictims: 1,
    rescuerLocation: "",
    nearestAddress: "",
  },
  urgencyLevel: null,
  recommendedGestures: [],
  emergencyMessage: "",
};

export const TOTAL_STEPS = 6;

export function useAssessment() {
  const [currentStep, setCurrentStep] = useState(1);
  const [assessment, setAssessment] = useState<Assessment>(INITIAL_ASSESSMENT);
  const [decision, setDecision] = useState<DecisionResult | null>(null);

  const updateAssessment = useCallback(
      (updates: Partial<Assessment>) => {
        setAssessment((prev) => ({ ...prev, ...updates }));
      },
      []
  );

  const nextStep = useCallback(() => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const finalize = useCallback(() => {
    const result = analyzeAssessment(assessment);
    const message = generateEmergencyMessage(assessment, result);

    setDecision(result);
    setAssessment((prev) => ({
      ...prev,
      urgencyLevel: result.urgencyLevel,
      recommendedGestures: result.recommendedGestures,
      emergencyMessage: message,
    }));
    setCurrentStep(TOTAL_STEPS);
  }, [assessment]);

  const reset = useCallback(() => {
    setAssessment(INITIAL_ASSESSMENT);
    setDecision(null);
    setCurrentStep(1);
  }, []);

  return {
    currentStep,
    assessment,
    decision,
    updateAssessment,
    nextStep,
    prevStep,
    goToStep,
    finalize,
    reset,
  };
}
