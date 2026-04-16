import { useState, useCallback } from "react";
import { Assessment } from "@/types/assessment";
import { analyzeAssessment, DecisionResult } from "@/lib/decision-engine";
import { generateEmergencyMessage } from "@/lib/message-generator";

export const TOTAL_STEPS = 6;

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

export function useAssessment() {
  const [currentStep, setCurrentStep] = useState(1);
  const [assessment, setAssessment] = useState<Assessment>(INITIAL_ASSESSMENT);
  const [decision, setDecision] = useState<DecisionResult | null>(null);

  const updateAssessment = useCallback((updates: Partial<Assessment>) => {
    setAssessment((prev) => ({
      ...prev,
      ...updates,
      // Deep merge pour les objets imbriqués
      victimInfo: updates.victimInfo
          ? { ...prev.victimInfo, ...updates.victimInfo }
          : prev.victimInfo,
      traumaDetails: updates.traumaDetails
          ? { ...prev.traumaDetails, ...updates.traumaDetails }
          : prev.traumaDetails,
      malaiseDetails: updates.malaiseDetails
          ? { ...prev.malaiseDetails, ...updates.malaiseDetails }
          : prev.malaiseDetails,
      bleedingDetails: updates.bleedingDetails
          ? { ...prev.bleedingDetails, ...updates.bleedingDetails }
          : prev.bleedingDetails,
      environment: updates.environment
          ? { ...prev.environment, ...updates.environment }
          : prev.environment,
    }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.min(Math.max(step, 1), TOTAL_STEPS));
  }, []);

  const finalize = useCallback(() => {
    const result = analyzeAssessment(assessment);
    const message = generateEmergencyMessage(assessment, result);

    const finalAssessment = {
      ...assessment,
      urgencyLevel: result.urgencyLevel,
      recommendedGestures: result.recommendedGestures,
      emergencyMessage: message,
    };

    setAssessment(finalAssessment);
    setDecision(result);
    setCurrentStep(TOTAL_STEPS);
  }, [assessment]);

  const reset = useCallback(() => {
    setAssessment(INITIAL_ASSESSMENT);
    setDecision(null);
    setCurrentStep(1);
  }, []);

  // Calcul de la validité de chaque étape
  const isStepValid = useCallback(
      (step: number): boolean => {
        switch (step) {
          case 1:
            return assessment.situationType !== null;
          case 2:
            return (
                assessment.victimInfo.approximateAge !== undefined &&
                assessment.victimInfo.gender !== undefined
            );
          case 3:
            return assessment.consciousnessLevel !== null;
          case 4:
            return assessment.breathingStatus !== null;
          case 5:
            return assessment.environment.nearestAddress.trim().length > 0;
          default:
            return true;
        }
      },
      [assessment]
  );

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
    isStepValid,
    TOTAL_STEPS,
  };
}
