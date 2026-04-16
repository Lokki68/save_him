// src/components/steps/StepConsciousness.tsx

"use client";

import { Assessment, ConsciousnessLevel } from "@/types/assessment";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Brain, AlertCircle, XCircle, HelpCircle } from "lucide-react";
import {ElementType} from "react";

interface StepConsciousnessProps {
  assessment: Assessment;
  onChange: (updates: Partial<Assessment>) => void;
}

const CONSCIOUSNESS_OPTIONS: {
  value: ConsciousnessLevel;
  label: string;
  description: string;
  hint: string;
  icon: ElementType;
  color: string;
  active: string;
  urgency: string;
}[] = [
  {
    value: "conscious_alert",
    label: "Consciente et alerte",
    description: "Répond aux questions, cohérente",
    hint: "Elle sait où elle est, quel jour on est",
    icon: Brain,
    color: "border-green-300 bg-green-50",
    active: "border-green-500 bg-green-100 ring-2 ring-green-300",
    urgency: "✅ Bon signe",
  },
  {
    value: "conscious_confused",
    label: "Consciente mais confuse",
    description: "Répond mais de façon désorganisée",
    hint: "Elle parle mais ne sait pas ce qui se passe",
    icon: AlertCircle,
    color: "border-yellow-300 bg-yellow-50",
    active: "border-yellow-500 bg-yellow-100 ring-2 ring-yellow-300",
    urgency: "⚠️ À surveiller",
  },
  {
    value: "unconscious",
    label: "Inconsciente",
    description: "Ne répond à aucune stimulation",
    hint: "Ni à la voix, ni à la douleur (pincement)",
    icon: XCircle,
    color: "border-red-300 bg-red-50",
    active: "border-red-500 bg-red-100 ring-2 ring-red-300",
    urgency: "🚨 Urgence vitale",
  },
  {
    value: "unknown",
    label: "Je ne sais pas",
    description: "Impossible d'évaluer",
    hint: "Accès difficile ou situation confuse",
    icon: HelpCircle,
    color: "border-gray-300 bg-gray-50",
    active: "border-gray-500 bg-gray-100 ring-2 ring-gray-300",
    urgency: "",
  },
];

// Questions d'aide pour évaluer la conscience
const HOW_TO_TEST = [
  { step: "1", text: 'Appelez fort : "Est-ce que vous m\'entendez ?"' },
  { step: "2", text: "Si pas de réponse : tapotez les épaules fermement" },
  { step: "3", text: "Si toujours rien : pincez le haut du bras" },
];

export function StepConsciousness({ assessment, onChange }: StepConsciousnessProps) {
  return (
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            État de conscience
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Évaluez si la victime réagit à votre présence
          </p>
        </div>

        {/* Guide d'évaluation */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-blue-900 mb-3">
            🔍 Comment tester la conscience :
          </p>
          <div className="space-y-2">
            {HOW_TO_TEST.map((item) => (
                <div key={item.step} className="flex gap-3 items-start">
              <span className="bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                {item.step}
              </span>
                  <p className="text-sm text-blue-800">{item.text}</p>
                </div>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            Quel est son état ?
          </Label>
          {CONSCIOUSNESS_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = assessment.consciousnessLevel === option.value;

            return (
                <button
                    key={option.value}
                    onClick={() => onChange({ consciousnessLevel: option.value })}
                    className={cn(
                        "w-full border-2 rounded-xl p-4 text-left transition-all flex items-start gap-4",
                        isSelected ? option.active : option.color
                    )}
                >
                  <Icon
                      className={cn(
                          "h-7 w-7 shrink-0 mt-0.5",
                          option.value === "conscious_alert" && "text-green-600",
                          option.value === "conscious_confused" && "text-yellow-600",
                          option.value === "unconscious" && "text-red-600",
                          option.value === "unknown" && "text-gray-500"
                      )}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-gray-900">
                        {option.label}
                      </p>
                      {option.urgency && (
                          <span className="text-xs ml-2 shrink-0">
                      {option.urgency}
                    </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {option.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 italic">
                      {option.hint}
                    </p>
                  </div>
                </button>
            );
          })}
        </div>

        {/* Alerte si inconscient */}
        {assessment.consciousnessLevel === "unconscious" && (
            <div className="bg-red-50 border-2 border-red-400 rounded-xl p-4 animate-pulse">
              <p className="font-bold text-red-800 text-sm">
                🚨 Situation critique détectée
              </p>
              <p className="text-red-700 text-sm mt-1">
                À l&apos;étape suivante, nous évaluerons la respiration pour
                déterminer si une RCP est nécessaire.
              </p>
            </div>
        )}
      </div>
  );
}
