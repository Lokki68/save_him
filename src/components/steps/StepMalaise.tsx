// src/components/steps/StepMalaise.tsx

"use client";

import { Assessment } from "@/types/assessment";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Brain, Heart, Zap, Thermometer, AlertCircle } from "lucide-react";
import { useState } from "react";

interface StepMalaiseProps {
  assessment: Assessment;
  onChange: (updates: Partial<Assessment>) => void;
}

// ── Types locaux ─────────────────────────────────────────────
type MalaiseCategory = "cardiac" | "stroke" | "diabetic" | "other" | null;

const SYMPTOM_CATEGORIES = [
  {
    id: "cardiac" as MalaiseCategory,
    label: "Douleur / gêne thoracique",
    sublabel: "Poitrine, oppression, essoufflement",
    icon: Heart,
    color: "border-red-300 bg-red-50",
    active: "border-red-500 bg-red-100 ring-2 ring-red-300",
    iconColor: "text-red-600",
    emoji: "❤️",
  },
  {
    id: "stroke" as MalaiseCategory,
    label: "Symptômes neurologiques",
    sublabel: "Visage, bras, parole, vision",
    icon: Brain,
    color: "border-purple-300 bg-purple-50",
    active: "border-purple-500 bg-purple-100 ring-2 ring-purple-300",
    iconColor: "text-purple-600",
    emoji: "🧠",
  },
  {
    id: "diabetic" as MalaiseCategory,
    label: "Malaise hypoglycémique",
    sublabel: "Diabétique, tremblements, pâleur",
    icon: Zap,
    color: "border-yellow-300 bg-yellow-50",
    active: "border-yellow-500 bg-yellow-100 ring-2 ring-yellow-300",
    iconColor: "text-yellow-600",
    emoji: "⚡",
  },
  {
    id: "other" as MalaiseCategory,
    label: "Autre malaise",
    sublabel: "Fièvre, douleur, nausées, malaise vagal",
    icon: Thermometer,
    color: "border-blue-300 bg-blue-50",
    active: "border-blue-500 bg-blue-100 ring-2 ring-blue-300",
    iconColor: "text-blue-600",
    emoji: "🤒",
  },
];

// Symptômes détaillés par catégorie
const CARDIAC_SYMPTOMS = [
  {
    key: "chestPain",
    label: "Douleur ou oppression thoracique",
    sublabel: "Serrement, brûlure, lourdeur dans la poitrine",
    critical: true,
  },
  {
    key: "radiatingPain",
    label: "Douleur irradiante",
    sublabel: "Vers bras gauche, épaule, mâchoire ou dos",
    critical: true,
  },
  {
    key: "breathShortness",
    label: "Essoufflement inhabituel",
    sublabel: "Au repos ou effort minime",
    critical: false,
  },
  {
    key: "sweating",
    label: "Sueurs froides",
    sublabel: "Transpiration soudaine sans raison",
    critical: false,
  },
  {
    key: "nausea",
    label: "Nausées / vomissements",
    sublabel: "Sans raison apparente",
    critical: false,
  },
  {
    key: "palpitations",
    label: "Palpitations",
    sublabel: "Cœur qui bat trop vite ou irrégulièrement",
    critical: false,
  },
] as const;

const STROKE_SYMPTOMS = [
  {
    key: "facialAsymmetry",
    label: "Visage asymétrique",
    sublabel: "Un côté du visage tombant — tester le sourire",
    critical: true,
  },
  {
    key: "armWeakness",
    label: "Faiblesse d'un bras",
    sublabel: "Impossible de lever les 2 bras ensemble",
    critical: true,
  },
  {
    key: "speechDifficulty",
    label: "Trouble du langage",
    sublabel: "Mots incompréhensibles, difficulté à parler",
    critical: true,
  },
  {
    key: "visionTrouble",
    label: "Trouble de la vision",
    sublabel: "Vision double, floue ou perte d'un côté",
    critical: true,
  },
  {
    key: "severeHeadache",
    label: "Céphalée brutale intense",
    sublabel: '"Comme un coup de tonnerre" — inhabituelle',
    critical: true,
  },
  {
    key: "dizziness",
    label: "Vertiges / perte d'équilibre",
    sublabel: "Impossible de marcher droit",
    critical: false,
  },
] as const;

const DIABETIC_SYMPTOMS = [
  { key: "trembling", label: "Tremblements", sublabel: "Mains, corps qui tremblent", critical: false },
  { key: "sweatingDiabetic", label: "Sueurs froides", sublabel: "Transpiration intense", critical: false },
  { key: "pallor", label: "Pâleur importante", sublabel: "Teint blafard, blanc", critical: false },
  { key: "confusion", label: "Confusion / agressivité", sublabel: "Comportement inhabituel", critical: true },
  { key: "hungry", label: "Faim intense soudaine", sublabel: "Besoin urgent de manger", critical: false },
  { key: "weakness", label: "Faiblesse générale", sublabel: "Jambes qui flanchent, fatigue brutale", critical: false },
] as const;

const OTHER_SYMPTOMS = [
  { key: "highFever", label: "Fièvre élevée", sublabel: "> 39°C, frissons", critical: false },
  { key: "vagal", label: "Malaise vagal", sublabel: "Perte de connaissance brève, yeux qui noircissent", critical: false },
  { key: "allergicReaction", label: "Réaction allergique", sublabel: "Urticaire, gonflement, difficultés à avaler", critical: true },
  { key: "poisoning", label: "Intoxication / empoisonnement", sublabel: "Ingestion substance, médicaments, alcool", critical: true },
  { key: "seizure", label: "Convulsions / épilepsie", sublabel: "Mouvements incontrôlés, morsure de langue", critical: true },
  { key: "generalPain", label: "Douleur intense", sublabel: "Abdominale, lombaire, ou autre localisation", critical: false },
] as const;

// Helper : génère les alertes AVC (test FAST)
function StrokeAlert({ symptoms }: { symptoms: Record<string, boolean> }) {
  const fastScore = [
    symptoms.facialAsymmetry,
    symptoms.armWeakness,
    symptoms.speechDifficulty,
  ].filter(Boolean).length;

  if (fastScore === 0) return null;

  return (
      <div className="bg-red-600 text-white rounded-xl p-4">
        <p className="font-bold text-base flex items-center gap-2">
          <Brain className="h-5 w-5" />
          🚨 Suspicion d&apos;AVC — Test FAST positif
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          {[
            { letter: "F", label: "Face", active: symptoms.facialAsymmetry },
            { letter: "A", label: "Arm", active: symptoms.armWeakness },
            { letter: "S", label: "Speech", active: symptoms.speechDifficulty },
          ].map((item) => (
              <div
                  key={item.letter}
                  className={cn(
                      "rounded-lg p-2",
                      item.active ? "bg-white/20" : "bg-white/10"
                  )}
              >
                <p className={cn("text-xl font-black", item.active ? "text-white" : "text-white/40")}>
                  {item.letter}
                </p>
                <p className="text-xs mt-0.5 text-white/80">{item.label}</p>
              </div>
          ))}
        </div>
        <ul className="mt-3 space-y-1 text-sm opacity-90 list-disc list-inside">
          <li>Appelez le <strong>15</strong> immédiatement</li>
          <li>Notez l&apos;heure exacte d&apos;apparition des symptômes</li>
          <li>Ne donnez rien à boire ni à manger</li>
          <li>Allongez la victime, tête légèrement surélevée</li>
        </ul>
      </div>
  );
}

// Helper : génère l'alerte cardiaque
function CardiacAlert({ symptoms }: { symptoms: Record<string, boolean> }) {
  if (!symptoms.chestPain && !symptoms.radiatingPain) return null;

  return (
      <div className="bg-red-600 text-white rounded-xl p-4">
        <p className="font-bold text-base flex items-center gap-2">
          <Heart className="h-5 w-5" />
          🚨 Suspicion d&apos;infarctus
        </p>
        <ul className="mt-2 space-y-1 text-sm opacity-90 list-disc list-inside">
          <li>Appelez le <strong>15 (SAMU)</strong> immédiatement</li>
          <li>Installez la victime en position demi-assise</li>
          <li>Desserrez les vêtements (ceinture, col)</li>
          <li>Ne laissez pas la victime seule</li>
          <li>Préparez le défibrillateur si disponible</li>
        </ul>
      </div>
  );
}

export function StepMalaise({ assessment, onChange }: StepMalaiseProps) {
  const { malaiseDetails } = assessment;

  const [category, setCategory] = useState<MalaiseCategory>(null);

  // Symptômes locaux étendus
  const extendedSymptoms: Record<string, boolean> =
      (malaiseDetails as any).extendedSymptoms ?? {};

  const toggleSymptom = (key: string) => {
    const next = { ...extendedSymptoms, [key]: !extendedSymptoms[key] };

    // Sync avec les champs officiels de malaiseDetails
    onChange({
      malaiseDetails: {
        ...malaiseDetails,
        chestPain: next.chestPain ?? malaiseDetails.chestPain,
        radiatingPain: next.radiatingPain ?? malaiseDetails.radiatingPain,
        facialAsymmetry: next.facialAsymmetry ?? malaiseDetails.facialAsymmetry,
        speechDifficulty: next.speechDifficulty ?? malaiseDetails.speechDifficulty,
        armWeakness: next.armWeakness ?? malaiseDetails.armWeakness,
        extendedSymptoms: next,
      } as any,
    });
  };

  const renderSymptomList = (
      symptoms: readonly { key: string; label: string; sublabel: string; critical: boolean }[]
  ) => (
      <div className="space-y-2">
        {symptoms.map((s) => {
          const isChecked = extendedSymptoms[s.key] ?? false;
          return (
              <button
                  key={s.key}
                  onClick={() => toggleSymptom(s.key)}
                  className={cn(
                      "w-full border-2 rounded-xl px-4 py-3 text-left flex items-center gap-3 transition-all",
                      isChecked
                          ? s.critical
                              ? "border-red-500 bg-red-50 ring-2 ring-red-100"
                              : "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                          : "border-gray-200 bg-white"
                  )}
              >
                {/* Checkbox */}
                <div
                    className={cn(
                        "w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0",
                        isChecked
                            ? s.critical
                                ? "border-red-500 bg-red-500"
                                : "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                    )}
                >
                  {isChecked && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                  )}
                </div>

                <div className="flex-1">
                  <p className={cn(
                      "font-medium text-sm leading-tight",
                      isChecked && s.critical ? "text-red-800" : "text-gray-900"
                  )}>
                    {s.label}
                    {s.critical && (
                        <span className="ml-2 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-normal">
                    critique
                  </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.sublabel}</p>
                </div>
              </button>
          );
        })}
      </div>
  );

  return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Malaise</h2>
          <p className="text-gray-500 text-sm mt-1">
            Identifiez le type de malaise pour orienter les secours
          </p>
        </div>

        {/* ── Sélection catégorie ─────────────────────────────── */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            Quel type de symptômes ?
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {SYMPTOM_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.id;
              return (
                  <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={cn(
                          "border-2 rounded-xl p-4 text-left flex flex-col gap-2 transition-all",
                          isSelected ? cat.active : cat.color
                      )}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={cn("h-5 w-5", cat.iconColor)} />
                      <span className="text-lg">{cat.emoji}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900 leading-tight">
                        {cat.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{cat.sublabel}</p>
                    </div>
                  </button>
              );
            })}
          </div>
        </div>

        {/* ── Symptômes détaillés selon catégorie ─────────────── */}
        {category === "cardiac" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-600" />
                <Label className="text-base font-semibold text-red-800">
                  Symptômes cardiaques
                </Label>
              </div>
              <CardiacAlert symptoms={extendedSymptoms} />
              {renderSymptomList(CARDIAC_SYMPTOMS)}
            </div>
        )}

        {category === "stroke" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <Label className="text-base font-semibold text-purple-800">
                  Symptômes AVC — Test FAST
                </Label>
              </div>

              {/* Explication FAST */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-purple-900 mb-2">
                  Le test FAST en 3 secondes :
                </p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { letter: "F", label: "Face", desc: "Sourire asymétrique ?" },
                    { letter: "A", label: "Arm", desc: "Un bras qui tombe ?" },
                    { letter: "S", label: "Speech", desc: "Parole incompréhensible ?" },
                  ].map((item) => (
                      <div key={item.letter} className="bg-white rounded-lg p-2 border border-purple-200">
                        <p className="text-2xl font-black text-purple-600">{item.letter}</p>
                        <p className="text-xs font-semibold text-purple-800">{item.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-tight">{item.desc}</p>
                      </div>
                  ))}
                </div>
              </div>

              <StrokeAlert symptoms={extendedSymptoms} />
              {renderSymptomList(STROKE_SYMPTOMS)}
            </div>
        )}

        {category === "diabetic" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                <Label className="text-base font-semibold text-yellow-800">
                  Symptômes hypoglycémie
                </Label>
              </div>

              {/* Diabétique connu ? */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  La victime est-elle diabétique connue ?
                </Label>
                <div className="flex gap-3">
                  {[
                    { value: true, label: "Oui", emoji: "✅" },
                    { value: false, label: "Non", emoji: "❌" },
                    { value: null, label: "Inconnu", emoji: "❓" },
                  ].map((opt) => (
                      <button
                          key={String(opt.value)}
                          onClick={() =>
                              onChange({ malaiseDetails: { ...malaiseDetails, diabetic: opt.value } })
                          }
                          className={cn(
                              "flex-1 border-2 rounded-xl py-2 text-center transition-all",
                              malaiseDetails.diabetic === opt.value
                                  ? "border-yellow-500 bg-yellow-50 ring-2 ring-yellow-200"
                                  : "border-gray-200 bg-white"
                          )}
                      >
                        <p className="text-lg">{opt.emoji}</p>
                        <p className="text-xs font-medium text-gray-800">{opt.label}</p>
                      </button>
                  ))}
                </div>
              </div>

              {/* Alerte sucre */}
              {malaiseDetails.diabetic === true && (
                  <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4">
                    <p className="font-bold text-yellow-800 text-sm">
                      🍭 Diabétique conscient — Donner du sucre
                    </p>
                    <ul className="mt-2 space-y-1 text-xs text-yellow-700 list-disc list-inside">
                      <li>3 morceaux de sucre, jus de fruit ou soda (pas light)</li>
                      <li>Si inconscient : ne rien donner par la bouche</li>
                      <li>Appeler le 15 si pas d&apos;amélioration en 10 minutes</li>
                    </ul>
                  </div>
              )}

              {renderSymptomList(DIABETIC_SYMPTOMS)}
            </div>
        )}

        {category === "other" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-blue-600" />
                <Label className="text-base font-semibold text-blue-800">
                  Autres symptômes
                </Label>
              </div>
              {renderSymptomList(OTHER_SYMPTOMS)}

              {/* Alerte allergie */}
              {extendedSymptoms.allergicReaction && (
                  <div className="bg-red-50 border-2 border-red-400 rounded-xl p-4">
                    <p className="font-bold text-red-800 text-sm">
                      🚨 Réaction allergique sévère possible (anaphylaxie)
                    </p>
                    <ul className="mt-2 space-y-1 text-xs text-red-700 list-disc list-inside">
                      <li>Appelez le 15 immédiatement</li>
                      <li>Cherchez si la victime a un stylo auto-injecteur (Épipen)</li>
                      <li>Allongez la victime, jambes surélevées si pas d&apos;essoufflement</li>
                    </ul>
                  </div>
              )}

              {/* Alerte convulsions */}
              {extendedSymptoms.seizure && (
                  <div className="bg-red-50 border-2 border-red-400 rounded-xl p-4">
                    <p className="font-bold text-red-800 text-sm">
                      ⚡ Convulsions en cours
                    </p>
                    <ul className="mt-2 space-y-1 text-xs text-red-700 list-disc list-inside">
                      <li>Écartez les objets dangereux autour de la victime</li>
                      <li>Ne maintenez pas la victime de force</li>
                      <li>Protégez la tête avec quelque chose de souple</li>
                      <li>Chronométrez la durée — plus de 5 min : appelez le 15</li>
                      <li>En fin de crise : position latérale de sécurité</li>
                    </ul>
                  </div>
              )}
            </div>
        )}

        {/* ── Contexte / description libre ───────────────────── */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <Label className="text-sm font-semibold">
            Contexte ou précisions{" "}
            <span className="text-gray-400 font-normal">(optionnel)</span>
          </Label>
          <textarea
              className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-blue-400 transition-colors"
              rows={3}
              placeholder="Ex: a pris des médicaments ce matin, se plaint depuis 20 minutes, antécédents cardiaques..."
              value={assessment.situationDescription}
              onChange={(e) => onChange({ situationDescription: e.target.value })}
          />
        </div>
      </div>
  );
}
