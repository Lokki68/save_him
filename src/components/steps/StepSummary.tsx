
"use client";

import { useState } from "react";
import { Assessment } from "@/types/assessment";
import { DecisionResult } from "@/lib/decision-engine";
import { GESTURES } from "@/data/gesture";
import { GestureCard } from "@/components/shared/GestureCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  Phone,
  Copy,
  CheckCheck,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StepSummaryProps {
  assessment: Assessment;
  decision: DecisionResult | null;
  onReset: () => void;
}

const URGENCY_CONFIG = {
  critical: {
    label: "URGENCE VITALE",
    color: "bg-red-600 text-white",
    border: "border-red-500",
    bg: "bg-red-50",
  },
  high: {
    label: "URGENCE ÉLEVÉE",
    color: "bg-orange-500 text-white",
    border: "border-orange-400",
    bg: "bg-orange-50",
  },
  medium: {
    label: "URGENCE MODÉRÉE",
    color: "bg-yellow-500 text-white",
    border: "border-yellow-400",
    bg: "bg-yellow-50",
  },
  low: {
    label: "SURVEILLANCE",
    color: "bg-blue-500 text-white",
    border: "border-blue-400",
    bg: "bg-blue-50",
  },
};

export function StepSummary({ assessment, decision, onReset }: StepSummaryProps) {
  const [copied, setCopied] = useState(false);
  const urgencyConfig = URGENCY_CONFIG[assessment.urgencyLevel ?? "medium"];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(assessment.emergencyMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const callNumbers = {
    "15": "SAMU",
    "18": "Pompiers",
    "112": "Urgences Européennes",
    "15_18": "SAMU / Pompiers",
  };

  return (
    <div className="space-y-5">
      {/* Badge urgence */}
      <div
        className={cn(
          "rounded-xl p-4 border-2 text-center",
          urgencyConfig.bg,
          urgencyConfig.border
        )}
      >
        <Badge className={cn("text-sm px-4 py-1 mb-2", urgencyConfig.color)}>
          {urgencyConfig.label}
        </Badge>
        {decision?.reasoning.map((r, i) => (
          <p key={i} className="text-sm text-gray-700 mt-1">
            {r}
          </p>
        ))}
      </div>

      {/* Appel d'urgence */}
      <div>
        <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Phone className="h-4 w-4 text-red-600" />
          Appelez maintenant
        </h3>
        <div className="flex gap-2">
          {decision?.callNumber.split("_").map((num) => (
            <a key={num} href={`tel:${num}`} className="flex-1">
              <Button
                variant="destructive"
                className="w-full text-lg font-bold h-14"
              >
                📞 {num}
              </Button>
            </a>
          ))}
        </div>
        <p className="text-xs text-gray-500 text-center mt-1">
          {callNumbers[decision?.callNumber ?? "15"]}
        </p>
      </div>

      <Separator />

      {/* Gestes à effectuer */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">
          Gestes à effectuer dans l&apos;ordre
        </h3>
        <div className="space-y-3">
          {decision?.recommendedGestures
            .filter((id) => GESTURES[id])
            .map((gestureId, index) => (
              <GestureCard
                key={gestureId}
                gesture={GESTURES[gestureId]}
                priority={index + 1}
              />
            ))}
        </div>
      </div>

      <Separator />

      {/* Message à transmettre */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-gray-900">
            Message à transmettre aux secours
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-1"
          >
            {copied ? (
              <>
                <CheckCheck className="h-3.5 w-3.5 text-green-600" />
                <span className="text-green-600 text-xs">Copié !</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span className="text-xs">Copier</span>
              </>
            )}
          </Button>
        </div>
        <Card className="bg-gray-50 border-dashed">
          <CardContent className="p-4">
            <pre className="text-xs text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
              {assessment.emergencyMessage}
            </pre>
          </CardContent>
        </Card>
      </div>

      {/* Reset */}
      <Button
        variant="outline"
        className="w-full gap-2"
        onClick={onReset}
      >
        <RefreshCw className="h-4 w-4" />
        Nouvelle évaluation
      </Button>
    </div>
  );
}
