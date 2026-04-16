// src/components/shared/GestureCard.tsx

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Gesture } from "@/types/assessment";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface GestureCardProps {
  gesture: Gesture;
  priority?: number;
}

export function GestureCard({ gesture, priority }: GestureCardProps) {
  const [isExpanded, setIsExpanded] = useState(priority === 1);

  return (
    <Card
      className={cn(
        "border-l-4 transition-all",
        gesture.urgency.includes("critical")
          ? "border-l-red-500"
          : gesture.urgency.includes("high")
          ? "border-l-orange-500"
          : "border-l-blue-500"
      )}
    >
      <CardHeader
        className="pb-2 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {priority && (
              <span className="bg-gray-800 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                {priority}
              </span>
            )}
            <CardTitle className="text-base">{gesture.title}</CardTitle>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-500 shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500 shrink-0" />
          )}
        </div>
        <p className="text-sm text-gray-500 ml-8">{gesture.description}</p>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <ol className="space-y-2 mb-3">
            {gesture.steps.map((step, index) => (
              <li key={index} className="flex gap-3 text-sm">
                <span className="bg-blue-100 text-blue-700 font-semibold w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs">
                  {index + 1}
                </span>
                <span className="leading-6">{step}</span>
              </li>
            ))}
          </ol>
          {gesture.warning && (
            <div className="flex gap-2 bg-amber-50 border border-amber-200 rounded-md p-3 mt-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">{gesture.warning}</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
