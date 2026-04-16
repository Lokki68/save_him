// src/components/steps/StepDetails.tsx

"use client";

import { Assessment } from "@/types/assessment";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { MapPin, Navigation } from "lucide-react";

interface StepDetailsProps {
  assessment: Assessment;
  onChange: (updates: Partial<Assessment>) => void;
}

// Sous-composant : Checkbox stylisé
function CheckOption({
                       label,
                       sublabel,
                       checked,
                       onChange,
                       critical = false,
                     }: {
  label: string;
  sublabel?: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  critical?: boolean;
}) {
  return (
      <button
          onClick={() => onChange(!checked)}
          className={cn(
              "w-full border-2 rounded-xl px-4 py-3 text-left flex items-center gap-3 transition-all",
              checked
                  ? critical
                      ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                      : "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                  : "border-gray-200 bg-white"
          )}
      >
        <div
            className={cn(
                "w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
                checked
                    ? critical
                        ? "border-red-500 bg-red-500"
                        : "border-blue-500 bg-blue-500"
                    : "border-gray-300"
            )}
        >
          {checked && (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
          )}
        </div>
        <div>
          <p className={cn(
              "font-medium text-sm",
              critical && checked ? "text-red-800" : "text-gray-900"
          )}>
            {label}
          </p>
          {sublabel && (
              <p className="text-xs text-gray-500 mt-0.5">{sublabel}</p>
          )}
        </div>
      </button>
  );
}

export function StepDetails({ assessment, onChange }: StepDetailsProps) {
  const { situationType, traumaDetails, malaiseDetails, bleedingDetails, environment } = assessment;

  return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Informations complémentaires
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Précisez les symptômes et votre localisation
          </p>
        </div>

        {/* ── TRAUMATISME ───────────────────────────────── */}
        {situationType === "trauma" && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Zones touchées / symptômes
              </Label>
              <CheckOption
                  label="Traumatisme crânien"
                  sublabel="Coup à la tête, perte de connaissance momentanée"
                  checked={traumaDetails.headInjury}
                  onChange={(v) => onChange({ traumaDetails: { ...traumaDetails, headInjury: v } })}
                  critical
              />
              <CheckOption
                  label="Suspicion rachis / colonne vertébrale"
                  sublabel="Chute de hauteur, accident de voiture, douleur nuque/dos"
                  checked={traumaDetails.spineInjury}
                  onChange={(v) => onChange({ traumaDetails: { ...traumaDetails, spineInjury: v } })}
                  critical
              />
              <CheckOption
                  label="Fracture suspectée"
                  sublabel="Déformation, douleur intense, impossibilité de bouger"
                  checked={traumaDetails.fracture}
                  onChange={(v) => onChange({ traumaDetails: { ...traumaDetails, fracture: v } })}
              />
              {traumaDetails.fracture && (
                  <div className="pl-4">
                    <Label htmlFor="fracture-location" className="text-sm mb-1 block">
                      Zone de la fracture
                    </Label>
                    <Input
                        id="fracture-location"
                        placeholder="Ex: bras gauche, jambe droite..."
                        value={traumaDetails.location}
                        onChange={(e) =>
                            onChange({ traumaDetails: { ...traumaDetails, location: e.target.value } })
                        }
                    />
                  </div>
              )}
              {traumaDetails.spineInjury && (
                  <div className="bg-red-50 border border-red-400 rounded-xl p-3">
                    <p className="text-sm font-bold text-red-800">
                      ⚠️ NE PAS MOBILISER LA VICTIME
                    </p>
                    <p className="text-xs text-red-700 mt-1">
                      Maintenez la tête dans l&apos;axe. Attendez les secours.
                    </p>
                  </div>
              )}
            </div>
        )}

        {/* ── MALAISE ────────────────────────────────────── */}
        {situationType === "malaise" && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Symptômes observés
              </Label>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
                <p className="text-xs text-blue-800">
                  💡 Cochez tous les symptômes présents — même si vous n&apos;êtes pas sûr
                </p>
              </div>

              <p className="text-sm font-medium text-gray-700 mt-1">
                Signes possibles d&apos;infarctus
              </p>
              <CheckOption
                  label="Douleur dans la poitrine"
                  sublabel="Oppression, serrement, brûlure thoracique"
                  checked={malaiseDetails.chestPain}
                  onChange={(v) => onChange({ malaiseDetails: { ...malaiseDetails, chestPain: v } })}
                  critical
              />
              <CheckOption
                  label="Douleur irradiante"
                  sublabel="Vers le bras gauche, la mâchoire, l'épaule"
                  checked={malaiseDetails.radiatingPain}
                  onChange={(v) => onChange({ malaiseDetails: { ...malaiseDetails, radiatingPain: v } })}
                  critical
              />

              <p className="text-sm font-medium text-gray-700 mt-2">
                Signes possibles d&apos;AVC
              </p>
              <CheckOption
                  label="Visage asymétrique"
                  sublabel="Un côté du visage tombant, sourire de travers"
                  checked={malaiseDetails.facialAsymmetry}
                  onChange={(v) =>
                      onChange({ malaiseDetails: { ...malaiseDetails, facialAsymmetry: v } })
                  }
                  critical
              />
              <CheckOption
                  label="Trouble du langage"
                  sublabel="Parole incompréhensible, difficulté à trouver les mots"
                  checked={malaiseDetails.speechDifficulty}
                  onChange={(v) =>
                      onChange({ malaiseDetails: { ...malaiseDetails, speechDifficulty: v } })
                  }
                  critical
              />
              <CheckOption
                  label="Faiblesse d'un bras"
                  sublabel="Impossible de lever les deux bras ensemble"
                  checked={malaiseDetails.armWeakness}
                  onChange={(v) =>
                      onChange({ malaiseDetails: { ...malaiseDetails, armWeakness: v } })
                  }
                  critical
              />

              {/* Alerte AVC */}
              {(malaiseDetails.facialAsymmetry ||
                  malaiseDetails.speechDifficulty ||
                  malaiseDetails.armWeakness) && (
                  <div className="bg-red-600 text-white rounded-xl p-4">
                    <p className="font-bold">🧠 Suspicion d&apos;AVC</p>
                    <p className="text-sm mt-1 opacity-90">
                      Notez l&apos;heure d&apos;apparition des symptômes.
                      Appelez le 15 immédiatement. Ne donnez rien à manger/boire.
                    </p>
                  </div>
              )}
            </div>
        )}

        {/* ── SAIGNEMENT ─────────────────────────────────── */}
        {situationType === "bleeding" && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Évaluation du saignement
              </Label>
              <CheckOption
                  label="Saignement abondant / important"
                  sublabel="Sang qui coule vite, tissu vite saturé"
                  checked={bleedingDetails.isImportant}
                  onChange={(v) =>
                      onChange({ bleedingDetails: { ...bleedingDetails, isImportant: v } })
                  }
                  critical
              />
              <CheckOption
                  label="Saignement contrôlé / ralenti"
                  sublabel="La compression directe a diminué le saignement"
                  checked={bleedingDetails.isControlled}
                  onChange={(v) =>
                      onChange({ bleedingDetails: { ...bleedingDetails, isControlled: v } })
                  }
              />
              <div>
                <Label htmlFor="bleeding-location" className="text-sm mb-1 block">
                  Zone du saignement
                </Label>
                <Input
                    id="bleeding-location"
                    placeholder="Ex: bras droit, cuisse gauche..."
                    value={bleedingDetails.location}
                    onChange={(e) =>
                        onChange({
                          bleedingDetails: { ...bleedingDetails, location: e.target.value },
                        })
                    }
                />
              </div>
            </div>
        )}

        {/* ── ENVIRONNEMENT (commun à tous) ──────────────── */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <Label className="text-base font-semibold flex items-center gap-2">
            <MapPin className="h-4 w-4 text-red-500" />
            Votre localisation{" "}
            <span className="text-red-500 text-sm">*</span>
          </Label>
          <p className="text-xs text-gray-500">
            Information la plus importante pour les secours
          </p>

          <div className="space-y-3">
            <div>
              <Label htmlFor="address" className="text-sm mb-1 block">
                Adresse / lieu précis
              </Label>
              <Input
                  id="address"
                  placeholder="Ex: 12 rue de la Paix, Paris 75001"
                  value={environment.nearestAddress}
                  onChange={(e) =>
                      onChange({
                        environment: {
                          ...environment,
                          nearestAddress: e.target.value,
                        },
                      })
                  }
              />
            </div>

            <div>
              <Label htmlFor="landmark" className="text-sm mb-1 block">
                Point de repère visible{" "}
                <span className="text-gray-400">(optionnel)</span>
              </Label>
              <Input
                  id="landmark"
                  placeholder="Ex: devant la boulangerie, parking Carrefour..."
                  value={environment.rescuerLocation}
                  onChange={(e) =>
                      onChange({
                        environment: {
                          ...environment,
                          rescuerLocation: e.target.value,
                        },
                      })
                  }
              />
            </div>

            <button
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((pos) => {
                      const { latitude, longitude } = pos.coords;
                      onChange({
                        environment: {
                          ...environment,
                          nearestAddress: `GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
                        },
                      });
                    });
                  }
                }}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-blue-300 rounded-xl py-3 text-blue-600 text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              <Navigation className="h-4 w-4" />
              Utiliser ma position GPS
            </button>
          </div>
        </div>
      </div>
  );
}
