
import { SituationType, Assessment } from "@/types/assessment";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Zap,
  Heart,
  Droplets,
  Flame,
  Wind,
  HelpCircle,
} from "lucide-react";

interface StepSituationProps {
  assessment: Assessment;
  onChange: (updates: Partial<Assessment>) => void;
}

const SITUATIONS = [
  {
    value: "trauma" as SituationType,
    label: "Traumatisme",
    description: "Chute, accident, choc violent",
    icon: Zap,
    color: "border-orange-400 bg-orange-50",
    activeColor: "border-orange-500 bg-orange-100 ring-2 ring-orange-300",
  },
  {
    value: "malaise" as SituationType,
    label: "Malaise",
    description: "Douleur poitrine, AVC, perte de connaissance",
    icon: Heart,
    color: "border-red-300 bg-red-50",
    activeColor: "border-red-500 bg-red-100 ring-2 ring-red-300",
  },
  {
    value: "bleeding" as SituationType,
    label: "Saignement",
    description: "Plaie avec perte de sang importante",
    icon: Droplets,
    color: "border-rose-400 bg-rose-50",
    activeColor: "border-rose-500 bg-rose-100 ring-2 ring-rose-300",
  },
  {
    value: "burn" as SituationType,
    label: "Brûlure",
    description: "Contact avec chaleur, flamme, produit",
    icon: Flame,
    color: "border-yellow-400 bg-yellow-50",
    activeColor: "border-yellow-500 bg-yellow-100 ring-2 ring-yellow-300",
  },
  {
    value: "choking" as SituationType,
    label: "Étouffement",
    description: "Corps étranger dans la gorge",
    icon: Wind,
    color: "border-purple-400 bg-purple-50",
    activeColor: "border-purple-500 bg-purple-100 ring-2 ring-purple-300",
  },
  {
    value: "unknown" as SituationType,
    label: "Je ne sais pas",
    description: "Situation inconnue ou autre",
    icon: HelpCircle,
    color: "border-gray-300 bg-gray-50",
    activeColor: "border-gray-500 bg-gray-100 ring-2 ring-gray-300",
  },
];

export function StepSituation({ assessment, onChange }: StepSituationProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Quelle est la situation ?
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Sélectionnez ce qui décrit le mieux ce que vous observez
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {SITUATIONS.map((situation) => {
          const Icon = situation.icon;
          const isSelected = assessment.situationType === situation.value;

          return (
            <button
              key={situation.value}
              onClick={() => onChange({ situationType: situation.value })}
              className={cn(
                "border-2 rounded-xl p-3 text-left transition-all",
                isSelected ? situation.activeColor : situation.color
              )}
            >
              <Icon className="h-6 w-6 mb-1 text-gray-700" />
              <p className="font-semibold text-sm text-gray-900">
                {situation.label}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 leading-tight">
                {situation.description}
              </p>
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          Décrivez brièvement ce qui s&apos;est passé{" "}
          <span className="text-gray-400">(optionnel)</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Ex: La personne a chuté d'une échelle d'environ 2 mètres..."
          value={assessment.situationDescription}
          onChange={(e) =>
            onChange({ situationDescription: e.target.value })
          }
          className="resize-none"
          rows={3}
        />
      </div>
    </div>
  );
}
