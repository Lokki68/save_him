// src/components/steps/StepTrauma.tsx

"use client";

import { Assessment } from "@/types/assessment";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AlertTriangle, Info } from "lucide-react";

interface StepTraumaProps {
  assessment: Assessment;
  onChange: (updates: Partial<Assessment>) => void;
}

// Zones du corps cliquables
const BODY_ZONES = [
  { id: "head", label: "Tête / crâne", emoji: "🤕", critical: true },
  { id: "neck", label: "Cou / nuque", emoji: "😰", critical: true },
  { id: "chest", label: "Thorax / côtes", emoji: "🫁", critical: true },
  { id: "abdomen", label: "Abdomen", emoji: "🫃", critical: true },
  { id: "spine", label: "Dos / colonne", emoji: "🦴", critical: true },
  { id: "arm", label: "Bras / épaule", emoji: "💪", critical: false },
  { id: "leg", label: "Jambe / hanche", emoji: "🦵", critical: false },
  { id: "hand", label: "Main / poignet", emoji: "🤚", critical: false },
  { id: "foot", label: "Pied / cheville", emoji: "🦶", critical: false },
  { id: "face", label: "Visage", emoji: "😮", critical: false },
] as const;

type BodyZoneId = (typeof BODY_ZONES)[number]["id"];

const MECHANISM_OPTIONS = [
  { value: "fall_low", label: "Chute de faible hauteur", sublabel: "< 2 mètres, debout", emoji: "🚶" },
  { value: "fall_high", label: "Chute de hauteur", sublabel: "> 2 mètres, escalier", emoji: "📉", critical: true },
  { value: "car", label: "Accident de voiture", sublabel: "Collision, choc violent", emoji: "🚗", critical: true },
  { value: "bike", label: "Vélo / moto", sublabel: "Chute, collision", emoji: "🚴", critical: true },
  { value: "sport", label: "Accident sportif", sublabel: "Choc, torsion, entorse", emoji: "⚽" },
  { value: "crush", label: "Écrasement", sublabel: "Objet lourd, coincement", emoji: "⚠️", critical: true },
  { value: "hit", label: "Coup / agression", sublabel: "Impact direct", emoji: "👊" },
  { value: "other", label: "Autre mécanisme", sublabel: "", emoji: "❓" },
] as const;

type MechanismValue = (typeof MECHANISM_OPTIONS)[number]["value"];

// Règles d'affichage des alertes
function getTraumaAlerts(
    selectedZones: BodyZoneId[],
    headInjury: boolean,
    spineInjury: boolean,
    mechanism: MechanismValue | null
): { level: "critical" | "warning"; message: string; action: string }[] {
  const alerts = [];

  if (spineInjury || selectedZones.includes("spine") || selectedZones.includes("neck")) {
    alerts.push({
      level: "critical" as const,
      message: "Suspicion de traumatisme rachidien",
      action: "NE PAS mobiliser la victime — maintenir la tête dans l'axe du corps jusqu'à l'arrivée des secours.",
    });
  }

  if (headInjury || selectedZones.includes("head")) {
    alerts.push({
      level: "critical" as const,
      message: "Traumatisme crânien possible",
      action: "Surveiller la conscience — ne pas faire boire, ne pas laisser seul.",
    });
  }

  if (selectedZones.includes("chest") || selectedZones.includes("abdomen")) {
    alerts.push({
      level: "warning" as const,
      message: "Traumatisme thoracique ou abdominal",
      action: "Position demi-assise si douleur thoracique — ne pas mobiliser si douleur abdominale intense.",
    });
  }

  if (
      mechanism === "fall_high" ||
      mechanism === "car" ||
      mechanism === "bike" ||
      mechanism === "crush"
  ) {
    alerts.push({
      level: "warning" as const,
      message: "Mécanisme à haute énergie",
      action: "Présumer un traumatisme du rachis même sans douleur — ne pas mobiliser.",
    });
  }

  return alerts;
}

export function StepTrauma({ assessment, onChange }: StepTraumaProps) {
  const { traumaDetails } = assessment;

  // On étend traumaDetails pour stocker les zones et le mécanisme
  // (à ajouter au type Assessment si besoin)
  const selectedZones: BodyZoneId[] =
      (traumaDetails as any).selectedZones ?? [];
  const mechanism: MechanismValue | null =
      (traumaDetails as any).mechanism ?? null;

  const toggleZone = (zone: BodyZoneId) => {
    const next = selectedZones.includes(zone)
        ? selectedZones.filter((z) => z !== zone)
        : [...selectedZones, zone];

    const hasHead = next.includes("head");
    const hasSpine = next.includes("spine") || next.includes("neck");

    onChange({
      traumaDetails: {
        ...traumaDetails,
        headInjury: hasHead,
        spineInjury: hasSpine,
        selectedZones: next,
      } as any,
    });
  };

  const setMechanism = (value: MechanismValue) => {
    onChange({
      traumaDetails: {
        ...traumaDetails,
        mechanism: value,
      } as any,
    });
  };

  const alerts = getTraumaAlerts(
      selectedZones,
      traumaDetails.headInjury,
      traumaDetails.spineInjury,
      mechanism
  );

  return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Traumatisme</h2>
          <p className="text-gray-500 text-sm mt-1">
            Précisez les zones touchées et le mécanisme de l&apos;accident
          </p>
        </div>

        {/* ── Alertes dynamiques ─────────────────────────────── */}
        {alerts.length > 0 && (
            <div className="space-y-2">
              {alerts.map((alert, i) => (
                  <div
                      key={i}
                      className={cn(
                          "rounded-xl p-4 border-2",
                          alert.level === "critical"
                              ? "bg-red-50 border-red-400"
                              : "bg-orange-50 border-orange-300"
                      )}
                  >
                    <p
                        className={cn(
                            "font-bold text-sm flex items-center gap-2",
                            alert.level === "critical"
                                ? "text-red-800"
                                : "text-orange-800"
                        )}
                    >
                      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                      {alert.message}
                    </p>
                    <p
                        className={cn(
                            "text-sm mt-1",
                            alert.level === "critical"
                                ? "text-red-700"
                                : "text-orange-700"
                        )}
                    >
                      {alert.action}
                    </p>
                  </div>
              ))}
            </div>
        )}

        {/* ── Mécanisme de l'accident ─────────────────────────── */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            Comment s&apos;est produit l&apos;accident ?
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {MECHANISM_OPTIONS.map((option) => {
              const isSelected = mechanism === option.value;
              const isCritical = (option as any).critical;
              return (
                  <button
                      key={option.value}
                      onClick={() => setMechanism(option.value)}
                      className={cn(
                          "border-2 rounded-xl p-3 text-left flex items-start gap-2 transition-all",
                          isSelected
                              ? isCritical
                                  ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                                  : "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                              : "border-gray-200 bg-white"
                      )}
                  >
                    <span className="text-xl flex-shrink-0">{option.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 leading-tight">
                        {option.label}
                      </p>
                      {option.sublabel && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {option.sublabel}
                          </p>
                      )}
                    </div>
                  </button>
              );
            })}
          </div>
        </div>

        {/* ── Zones touchées ──────────────────────────────────── */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            Zones du corps touchées
          </Label>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
            <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800">
              Sélectionnez toutes les zones concernées — même si la douleur est légère
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {BODY_ZONES.map((zone) => {
              const isSelected = selectedZones.includes(zone.id);
              return (
                  <button
                      key={zone.id}
                      onClick={() => toggleZone(zone.id)}
                      className={cn(
                          "border-2 rounded-xl px-3 py-3 flex items-center gap-3 transition-all text-left",
                          isSelected
                              ? zone.critical
                                  ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                                  : "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                              : "border-gray-200 bg-white"
                      )}
                  >
                    <span className="text-2xl flex-shrink-0">{zone.emoji}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 leading-tight">
                        {zone.label}
                      </p>
                      {zone.critical && isSelected && (
                          <p className="text-xs text-red-600 font-medium mt-0.5">
                            Zone critique
                          </p>
                      )}
                    </div>
                    {/* Checkbox visuel */}
                    <div
                        className={cn(
                            "w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0",
                            isSelected
                                ? zone.critical
                                    ? "border-red-500 bg-red-500"
                                    : "border-blue-500 bg-blue-500"
                                : "border-gray-300"
                        )}
                    >
                      {isSelected && (
                          <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                          >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                            />
                          </svg>
                      )}
                    </div>
                  </button>
              );
            })}
          </div>
        </div>

        {/* ── Fracture ────────────────────────────────────────── */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            Suspicion de fracture ?
          </Label>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-gray-600">
              Signes : déformation visible, douleur intense à la pression,
              craquement entendu, impossibilité de bouger le membre
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
                onClick={() =>
                    onChange({ traumaDetails: { ...traumaDetails, fracture: true } })
                }
                className={cn(
                    "border-2 rounded-xl py-3 px-4 text-center transition-all",
                    traumaDetails.fracture
                        ? "border-orange-500 bg-orange-50 ring-2 ring-orange-200"
                        : "border-gray-200 bg-white"
                )}
            >
              <p className="text-2xl mb-1">🦴</p>
              <p className="text-sm font-semibold text-gray-900">Oui</p>
            </button>
            <button
                onClick={() =>
                    onChange({ traumaDetails: { ...traumaDetails, fracture: false } })
                }
                className={cn(
                    "border-2 rounded-xl py-3 px-4 text-center transition-all",
                    traumaDetails.fracture === false
                        ? "border-green-500 bg-green-50 ring-2 ring-green-200"
                        : "border-gray-200 bg-white"
                )}
            >
              <p className="text-2xl mb-1">✅</p>
              <p className="text-sm font-semibold text-gray-900">Non / incertain</p>
            </button>
          </div>

          {traumaDetails.fracture && (
              <div className="space-y-2">
                <Input
                    placeholder="Localisation ex: avant-bras droit, tibia gauche..."
                    value={traumaDetails.location}
                    onChange={(e) =>
                        onChange({
                          traumaDetails: { ...traumaDetails, location: e.target.value },
                        })
                    }
                    className="h-11"
                />
                <div className="bg-orange-50 border border-orange-300 rounded-lg p-3">
                  <p className="text-sm font-semibold text-orange-800">
                    ⚠️ Gestes immédiats
                  </p>
                  <ul className="mt-1 space-y-0.5 text-xs text-orange-700 list-disc list-inside">
                    <li>Immobilisez le membre dans la position trouvée</li>
                    <li>Ne tentez pas de remettre en place</li>
                    <li>Attelle avec ce que vous avez (vêtement, magazine...)</li>
                    <li>Surélevez si possible (sauf colonne)</li>
                  </ul>
                </div>
              </div>
          )}
        </div>

        {/* ── Description libre ───────────────────────────────── */}
        <div className="space-y-2">
          <Label className="text-base font-semibold">
            Description complémentaire{" "}
            <span className="text-gray-400 font-normal text-sm">(optionnel)</span>
          </Label>
          <textarea
              className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-blue-400 transition-colors"
              rows={3}
              placeholder="Ex: douleur qui augmente, victime ne peut plus bouger la jambe..."
              value={assessment.situationDescription}
              onChange={(e) =>
                  onChange({ situationDescription: e.target.value })
              }
          />
        </div>
      </div>
  );
}
