"use client";

import { Assessment, BreathingStatus } from "@/types/assessment";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Wind, AlertOctagon, Activity } from "lucide-react";
import {ElementType} from "react";

interface StepBreathingProps {
  assessment: Assessment;
  onChange: (updates: Partial<Assessment>) => void;
}

const BREATHING_OPTIONS: {
  value: BreathingStatus;
  label: string;
  description: string;
  hint: string;
  icon: ElementType;
  color: string;
  active: string;
  badge: string;
  badgeColor: string;
}[] = [
  {
    value: "normal",
    label: "Respiration normale",
    description: "Poitrine se soulève régulièrement",
    hint: "Rythme normal, pas d'effort visible",
    icon: Wind,
    color: "border-green-300 bg-green-50",
    active: "border-green-500 bg-green-100 ring-2 ring-green-300",
    badge: "Normal",
    badgeColor: "bg-green-100 text-green-700",
  },
  {
    value: "difficult",
    label: "Respiration difficile",
    description: "Respire mais avec effort ou bruit",
    hint: "Sifflements, efforts visibles, lèvres bleues",
    icon: Activity,
    color: "border-orange-300 bg-orange-50",
    active: "border-orange-500 bg-orange-100 ring-2 ring-orange-300",
    badge: "Urgent",
    badgeColor: "bg-orange-100 text-orange-700",
  },
  {
    value: "absent",
    label: "Pas de respiration",
    description: "Aucun mouvement de la poitrine",
    hint: "Vérifiez pendant 10 secondes maximum",
    icon: AlertOctagon,
    color: "border-red-300 bg-red-50",
    active: "border-red-500 bg-red-100 ring-2 ring-red-300",
    badge: "CRITIQUE",
    badgeColor: "bg-red-100 text-red-700",
  },
  {
    value: "unknown",
    label: "Impossible d'évaluer",
    description: "Accès difficile à la victime",
    hint: "",
    icon: Wind,
    color: "border-gray-300 bg-gray-50",
    active: "border-gray-500 bg-gray-100 ring-2 ring-gray-300",
    badge: "Inconnu",
    badgeColor: "bg-gray-100 text-gray-600",
  },
];

export function StepBreathing({ assessment, onChange }: StepBreathingProps) {
  const isUnconscious = assessment.consciousnessLevel === "unconscious";

  return (
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Respiration
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Observez le souffle et le mouvement de la poitrine
          </p>
        </div>

        {/* Guide d'évaluation */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-blue-900 mb-3">
            🔍 Comment évaluer la respiration :
          </p>
          <div className="space-y-2">
            <div className="flex gap-3">
              <span className="text-lg">👁️</span>
              <p className="text-sm text-blue-800">
                <strong>Regardez</strong> si la poitrine se soulève
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-lg">👂</span>
              <p className="text-sm text-blue-800">
                <strong>Écoutez</strong> le bruit du souffle
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-lg">🤚</span>
              <p className="text-sm text-blue-800">
                <strong>Sentez</strong> l&apos;air sur votre joue (penchez-vous)
              </p>
            </div>
            {isUnconscious && (
                <p className="text-xs text-blue-700 mt-2 bg-blue-100 rounded-lg p-2">
                  ⏱️ Évaluez pendant <strong>10 secondes maximum</strong> avant de décider
                </p>
            )}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            Comment respire-t-elle ?
          </Label>
          {BREATHING_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = assessment.breathingStatus === option.value;

            return (
                <button
                    key={option.value}
                    onClick={() => onChange({ breathingStatus: option.value })}
                    className={cn(
                        "w-full border-2 rounded-xl p-4 text-left transition-all flex items-start gap-4",
                        isSelected ? option.active : option.color
                    )}
                >
                  <Icon
                      className={cn(
                          "h-7 w-7 shrink-0 mt-0.5",
                          option.value === "normal" && "text-green-600",
                          option.value === "difficult" && "text-orange-600",
                          option.value === "absent" && "text-red-600",
                          option.value === "unknown" && "text-gray-500"
                      )}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <p className="font-semibold text-gray-900">
                        {option.label}
                      </p>
                      <span
                          className={cn(
                              "text-xs font-semibold px-2 py-0.5 rounded-full shrink-0",
                              option.badgeColor
                          )}
                      >
                    {option.badge}
                  </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {option.description}
                    </p>
                    {option.hint && (
                        <p className="text-xs text-gray-400 mt-1 italic">
                          {option.hint}
                        </p>
                    )}
                  </div>
                </button>
            );
          })}
        </div>

        {/* Alertes contextuelles */}
        {assessment.breathingStatus === "absent" && (
            <div className="bg-red-600 text-white rounded-xl p-4">
              <p className="font-bold text-base">
                🚨 Arrêt respiratoire — RCP immédiate
              </p>
              <ol className="mt-2 space-y-1 text-sm list-decimal list-inside">
                <li>Appelez le 15 ou demandez à quelqu&apos;un d&apos;appeler</li>
                <li>Commencez le massage cardiaque maintenant</li>
                <li>Continuez jusqu&apos;à l&apos;arrivée des secours</li>
              </ol>
            </div>
        )}

        {assessment.breathingStatus === "difficult" && (
            <div className="bg-orange-50 border border-orange-400 rounded-xl p-4">
              <p className="font-bold text-orange-800 text-sm">
                ⚠️ Difficultés respiratoires — Position demi-assise
              </p>
              <p className="text-orange-700 text-sm mt-1">
                Installez la victime en position demi-assise, desserrez les vêtements.
              </p>
            </div>
        )}
      </div>
  );
}
