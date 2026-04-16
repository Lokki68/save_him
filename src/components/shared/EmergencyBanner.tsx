import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

export function EmergencyBanner() {
  return (
    <div className="bg-red-600 text-white px-4 py-2 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Phone className="h-4 w-4 animate-pulse" />
        <span>Urgence vitale immédiate ?</span>
      </div>
      <div className="flex gap-2">
        {["15", "18", "112"].map((num) => (
          <a key={num} href={`tel:${num}`}>
            <Button
              size="sm"
              variant="outline"
              className="bg-white text-red-600 hover:bg-red-50 border-white font-bold h-8 px-3"
            >
              {num}
            </Button>
          </a>
        ))}
      </div>
    </div>
  );
}
