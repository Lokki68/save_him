"use client";

import { Assessment } from "@/types/assessment";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Baby, User, Users, PersonStanding } from "lucide-react";

interface StepVictimProps {
  assessment: Assessment;
  onChange: (updates: Partial<Assessment>) => void;
}

const AGE_OPTIONS = [
  {
    value: "infant" as const,
    label: "Nourrisson",
    sublabel: "< 1 an",
    icon: Baby,
    color: "border-pink-300 bg-pink-50",
    active: "border-pink-500 bg-pink-100 ring-2 ring-pink-300",
  },
  {
    value: "child" as const,
    label: "Enfant",
    sublabel: "1 — 14 ans",
    icon: PersonStanding,
    color: "border-purple-300 bg-purple-50",
    active: "border-purple-500 bg-purple-100 ring-2 ring-purple-300",
  },
  {
    value: "adult" as const,
    label: "Adulte",
    sublabel: "15 — 64 ans",
    icon: User,
    color: "border-blue-300 bg-blue-50",
    active: "border-blue-500 bg-blue-100 ring-2 ring-blue-300",
  },
  {
    value: "elderly" as const,
    label: "Senior",
    sublabel: "65 ans et +",
    icon: Users,
    color: "border-green-300 bg-green-50",
    active: "border-green-500 bg-green-100 ring-2 ring-green-300",
  },
];

const GENDER_OPTIONS = [
  {
    value: "male" as const,
    label: "Homme",
    emoji: "👨",
  },
  {
    value: "female" as const,
    label: "Femme",
    emoji: "👩",
  },
  {
    value: "unknown" as const,
    label: "Inconnu",
    emoji: "🧑",
  },
];

export function StepVictim({ assessment, onChange }: StepVictimProps) {
  const { victimInfo, environment } = assessment;

  return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            La victime
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Ces informations seront transmises aux secours
          </p>
        </div>

        {/* Tranche d'âge */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            Tranche d&apos;âge approximative
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {AGE_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = victimInfo.approximateAge === option.value;
              return (
                  <button
                      key={option.value}
                      onClick={() =>
                          onChange({
                            victimInfo: { ...victimInfo, approximateAge: option.value },
                          })
                      }
                      className={cn(
                          "border-2 rounded-xl p-4 text-left transition-all flex items-center gap-3",
                          isSelected ? option.active : option.color
                      )}
                  >
                    <Icon className="h-8 w-8 text-gray-600 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm text-gray-900">
                        {option.label}
                      </p>
                      <p className="text-xs text-gray-500">{option.sublabel}</p>
                    </div>
                  </button>
              );
            })}
          </div>
        </div>

        {/* Genre */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Genre</Label>
          <div className="flex gap-3">
            {GENDER_OPTIONS.map((option) => {
              const isSelected = victimInfo.gender === option.value;
              return (
                  <button
                      key={option.value}
                      onClick={() =>
                          onChange({
                            victimInfo: { ...victimInfo, gender: option.value },
                          })
                      }
                      className={cn(
                          "flex-1 border-2 rounded-xl py-3 px-2 text-center transition-all",
                          isSelected
                              ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                              : "border-gray-200 bg-white"
                      )}
                  >
                    <div className="text-2xl mb-1">{option.emoji}</div>
                    <p className="text-sm font-medium text-gray-800">
                      {option.label}
                    </p>
                  </button>
              );
            })}
          </div>
        </div>

        {/* Nombre de victimes */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            Nombre de victimes
          </Label>
          <div className="flex items-center gap-4">
            <button
                onClick={() =>
                    onChange({
                      environment: {
                        ...environment,
                        numberOfVictims: Math.max(1, environment.numberOfVictims - 1),
                      },
                    })
                }
                className="w-12 h-12 rounded-full border-2 border-gray-300 text-xl font-bold text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              −
            </button>
            <div className="flex-1 text-center">
            <span className="text-4xl font-bold text-gray-900">
              {environment.numberOfVictims}
            </span>
              <p className="text-xs text-gray-500 mt-1">
                {environment.numberOfVictims > 1
                    ? "Alertez le 112"
                    : "victime"}
              </p>
            </div>
            <button
                onClick={() =>
                    onChange({
                      environment: {
                        ...environment,
                        numberOfVictims: Math.min(20, environment.numberOfVictims + 1),
                      },
                    })
                }
                className="w-12 h-12 rounded-full border-2 border-gray-300 text-xl font-bold text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              +
            </button>
          </div>
          {environment.numberOfVictims > 1 && (
              <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 text-sm text-amber-800 flex items-center gap-2">
                ⚠️ Plusieurs victimes — Appelez le <strong>112</strong> en priorité
              </div>
          )}
        </div>

        {/* Seul ? */}
        <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl border border-gray-200">
          <div>
            <p className="font-medium text-gray-900 text-sm">
              Êtes-vous seul sur place ?
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              D&apos;autres personnes peuvent-elles appeler les secours ?
            </p>
          </div>
          <Switch
              checked={victimInfo.isAlone}
              onCheckedChange={(checked) =>
                  onChange({ victimInfo: { ...victimInfo, isAlone: checked } })
              }
          />
        </div>
        {victimInfo.isAlone && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
              💡 Si vous êtes seul, appelez les secours en premier avant de
              prodiguer les gestes, sauf arrêt cardiaque — lancez la RCP
              immédiatement.
            </p>
        )}
      </div>
  );
}
