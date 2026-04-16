// src/components/steps/StepEnvironment.tsx

"use client";

import { Assessment } from "@/types/assessment";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Navigation,
  Shield,
  ShieldAlert,
  Users,
  User,
  Loader2,
} from "lucide-react";
import { useState } from "react";

interface StepEnvironmentProps {
  assessment: Assessment;
  onChange: (updates: Partial<Assessment>) => void;
}

const LOCATION_TYPES = [
  { value: "home", label: "Domicile", emoji: "🏠" },
  { value: "street", label: "Voie publique", emoji: "🛣️" },
  { value: "workplace", label: "Lieu de travail", emoji: "🏢" },
  { value: "school", label: "École / sport", emoji: "🏫" },
  { value: "vehicle", label: "Véhicule", emoji: "🚗" },
  { value: "other", label: "Autre", emoji: "📍" },
] as const;

type LocationType = (typeof LOCATION_TYPES)[number]["value"];

export function StepEnvironment({ assessment, onChange }: StepEnvironmentProps) {
  const { environment } = assessment;
  const [locationType, setLocationType] = useState<LocationType | null>(null);
  const [isLoadingGps, setIsLoadingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const handleGps = () => {
    if (!navigator.geolocation) {
      setGpsError("GPS non disponible sur cet appareil");
      return;
    }

    setIsLoadingGps(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          onChange({
            environment: {
              ...environment,
              nearestAddress: `GPS: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            },
          });
          setIsLoadingGps(false);
        },
        (err) => {
          setGpsError("Impossible d'obtenir votre position");
          setIsLoadingGps(false);
        },
        { timeout: 8000, enableHighAccuracy: true }
    );
  };

  return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Environnement</h2>
          <p className="text-gray-500 text-sm mt-1">
            Évaluez la sécurité et précisez votre localisation
          </p>
        </div>

        {/* ── Sécurité de la zone ─────────────────────────────── */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            La zone est-elle sécurisée ?
          </Label>
          <p className="text-xs text-gray-500 -mt-1">
            Danger présent : trafic, feu, produits chimiques, agressivité...
          </p>

          <div className="grid grid-cols-2 gap-3">
            {/* Sécurisée */}
            <button
                onClick={() =>
                    onChange({ environment: { ...environment, isSafe: true } })
                }
                className={cn(
                    "border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all",
                    environment.isSafe
                        ? "border-green-500 bg-green-50 ring-2 ring-green-200"
                        : "border-gray-200 bg-white"
                )}
            >
              <Shield
                  className={cn(
                      "h-8 w-8",
                      environment.isSafe ? "text-green-600" : "text-gray-400"
                  )}
              />
              <div className="text-center">
                <p className="font-semibold text-sm text-gray-900">Oui, sécurisée</p>
                <p className="text-xs text-gray-500 mt-0.5">Pas de danger visible</p>
              </div>
            </button>

            {/* Non sécurisée */}
            <button
                onClick={() =>
                    onChange({ environment: { ...environment, isSafe: false } })
                }
                className={cn(
                    "border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all",
                    environment.isSafe === false
                        ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                        : "border-gray-200 bg-white"
                )}
            >
              <ShieldAlert
                  className={cn(
                      "h-8 w-8",
                      environment.isSafe === false ? "text-red-600" : "text-gray-400"
                  )}
              />
              <div className="text-center">
                <p className="font-semibold text-sm text-gray-900">Non, danger</p>
                <p className="text-xs text-gray-500 mt-0.5">Risque présent</p>
              </div>
            </button>
          </div>

          {/* Alerte danger */}
          {environment.isSafe === false && (
              <div className="bg-red-50 border-2 border-red-400 rounded-xl p-4">
                <p className="font-bold text-red-800 text-sm">
                  🚨 Ne vous mettez pas en danger
                </p>
                <ul className="mt-2 space-y-1 text-sm text-red-700 list-disc list-inside">
                  <li>N&apos;approchez pas si risque électrique, chimique ou feu</li>
                  <li>Appelez les secours et décrivez le danger</li>
                  <li>Éloignez les autres témoins de la zone</li>
                  <li>Attendez les secours spécialisés à distance</li>
                </ul>
              </div>
          )}
        </div>

        {/* ── Nombre de victimes ──────────────────────────────── */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Nombre de victimes</Label>

          <div className="flex items-center gap-4 bg-white border-2 border-gray-200 rounded-xl p-4">
            <button
                onClick={() =>
                    onChange({
                      environment: {
                        ...environment,
                        numberOfVictims: Math.max(1, environment.numberOfVictims - 1),
                      },
                    })
                }
                className="w-11 h-11 rounded-full border-2 border-gray-300 text-xl font-bold text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors flex items-center justify-center flex-shrink-0"
            >
              −
            </button>

            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-2">
                {environment.numberOfVictims === 1 ? (
                    <User className="h-5 w-5 text-gray-500" />
                ) : (
                    <Users className="h-5 w-5 text-orange-500" />
                )}
                <span className="text-4xl font-bold text-gray-900">
                {environment.numberOfVictims}
              </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {environment.numberOfVictims === 1 ? "victime" : "victimes"}
              </p>
            </div>

            <button
                onClick={() =>
                    onChange({
                      environment: {
                        ...environment,
                        numberOfVictims: Math.min(99, environment.numberOfVictims + 1),
                      },
                    })
                }
                className="w-11 h-11 rounded-full border-2 border-gray-300 text-xl font-bold text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors flex items-center justify-center flex-shrink-0"
            >
              +
            </button>
          </div>

          {environment.numberOfVictims > 1 && (
              <div className="bg-orange-50 border border-orange-300 rounded-xl p-3 flex gap-2">
                <span className="text-lg flex-shrink-0">⚠️</span>
                <div>
                  <p className="font-semibold text-orange-800 text-sm">
                    Accident à victimes multiples
                  </p>
                  <p className="text-orange-700 text-xs mt-0.5">
                    Appelez le <strong>112</strong> en priorité — mentionnez le
                    nombre exact de victimes.
                  </p>
                </div>
              </div>
          )}
        </div>

        {/* ── Type de lieu ────────────────────────────────────── */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Type de lieu</Label>
          <div className="grid grid-cols-3 gap-2">
            {LOCATION_TYPES.map((type) => (
                <button
                    key={type.value}
                    onClick={() => setLocationType(type.value)}
                    className={cn(
                        "border-2 rounded-xl p-3 flex flex-col items-center gap-1 transition-all",
                        locationType === type.value
                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                            : "border-gray-200 bg-white"
                    )}
                >
                  <span className="text-2xl">{type.emoji}</span>
                  <p className="text-xs font-medium text-gray-700 text-center leading-tight">
                    {type.label}
                  </p>
                </button>
            ))}
          </div>
        </div>

        {/* ── Localisation ────────────────────────────────────── */}
        <div className="space-y-3">
          <Label className="text-base font-semibold flex items-center gap-2">
            <MapPin className="h-4 w-4 text-red-500" />
            Adresse / localisation
            <span className="text-red-500">*</span>
          </Label>
          <p className="text-xs text-gray-500 -mt-2">
            Information la plus importante pour envoyer les secours
          </p>

          <Input
              placeholder="Ex: 12 rue de la Paix, Paris — ou lieu-dit..."
              value={environment.nearestAddress}
              onChange={(e) =>
                  onChange({
                    environment: { ...environment, nearestAddress: e.target.value },
                  })
              }
              className="h-12 text-base"
          />

          <Input
              placeholder="Point de repère : devant boulangerie, parking..."
              value={environment.rescuerLocation}
              onChange={(e) =>
                  onChange({
                    environment: {
                      ...environment,
                      rescuerLocation: e.target.value,
                    },
                  })
              }
              className="h-11"
          />

          {/* Bouton GPS */}
          <button
              onClick={handleGps}
              disabled={isLoadingGps}
              className={cn(
                  "w-full flex items-center justify-center gap-2 border-2 border-dashed rounded-xl py-3 text-sm font-medium transition-colors",
                  isLoadingGps
                      ? "border-gray-200 text-gray-400 cursor-not-allowed"
                      : "border-blue-300 text-blue-600 hover:bg-blue-50 active:bg-blue-100"
              )}
          >
            {isLoadingGps ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Localisation en cours...
                </>
            ) : (
                <>
                  <Navigation className="h-4 w-4" />
                  Utiliser ma position GPS
                </>
            )}
          </button>

          {gpsError && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <span>⚠️</span> {gpsError}
              </p>
          )}

          {environment.nearestAddress.startsWith("GPS:") && (
              <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex items-center gap-2">
                ✅ Position GPS enregistrée — sera transmise aux secours
              </p>
          )}
        </div>
      </div>
  );
}
