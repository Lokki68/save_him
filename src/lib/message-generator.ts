
import { Assessment } from "@/types/assessment";
import { DecisionResult } from "./decision-engine";

export function generateEmergencyMessage(
    assessment: Assessment,
    decision: DecisionResult
): string {
  const { victimInfo, environment, situationType } = assessment;
  const lines: string[] = [];

  // Identification
  lines.push(`Bonjour, j'appelle pour signaler une urgence médicale.`);
  lines.push("");

  // Localisation
  lines.push(`📍 LOCALISATION :`);
  if (environment.nearestAddress) {
    lines.push(`Je me trouve ${environment.nearestAddress}.`);
  }
  if (environment.rescuerLocation) {
    lines.push(`Repère : ${environment.rescuerLocation}.`);
  }
  lines.push("");

  // Situation
  lines.push(`🚨 SITUATION :`);
  const situationLabels: Record<string, string> = {
    trauma: "un traumatisme",
    malaise: "un malaise",
    bleeding: "un saignement important",
    burn: "une brûlure",
    choking: "un étouffement",
  };
  lines.push(
      `Il s'agit de ${situationLabels[situationType ?? ""] ?? "une urgence"}.`
  );
  if (assessment.situationDescription) {
    lines.push(`Description : ${assessment.situationDescription}.`);
  }
  lines.push("");

  // Victime
  lines.push(`👤 VICTIME :`);
  const ageLabels: Record<string, string> = {
    infant: "un nourrisson",
    child: "un enfant",
    adult: "un adulte",
    elderly: "une personne âgée",
  };
  lines.push(
      `${ageLabels[victimInfo.approximateAge ?? ""] ?? "Une personne"}, ${
          victimInfo.gender === "male"
              ? "de sexe masculin"
              : victimInfo.gender === "female"
                  ? "de sexe féminin"
                  : ""
      }.`
  );
  lines.push(`Nombre de victimes : ${environment.numberOfVictims}.`);
  lines.push("");

  // État
  lines.push(`🏥 ÉTAT DE LA VICTIME :`);
  const consciousnessLabels: Record<string, string> = {
    conscious_alert: "Consciente et alerte",
    conscious_confused: "Consciente mais confuse",
    unconscious: "Inconsciente",
  };
  lines.push(
      `Conscience : ${
          consciousnessLabels[assessment.consciousnessLevel ?? ""] ?? "Inconnue"
      }.`
  );
  lines.push(
      `Respiration : ${
          assessment.breathingStatus === "normal"
              ? "Normale"
              : assessment.breathingStatus === "difficult"
                  ? "Difficile"
                  : assessment.breathingStatus === "absent"
                      ? "ABSENTE"
                      : "Non évaluée"
      }.`
  );

  // Détails malaise AVC
  if (assessment.situationType === "malaise") {
    const { malaiseDetails } = assessment;
    if (malaiseDetails.facialAsymmetry || malaiseDetails.speechDifficulty) {
      lines.push(`⚠️ Signes d'AVC présents (asymétrie faciale, trouble du langage).`);
    }
    if (malaiseDetails.chestPain) {
      lines.push(`⚠️ Douleur thoracique présente.`);
    }
  }
  lines.push("");

  // Actions en cours
  lines.push(`✅ ACTIONS EN COURS :`);
  if (decision.recommendedGestures.includes("cpr")) {
    lines.push(`- Réanimation cardio-pulmonaire en cours.`);
  }
  if (decision.recommendedGestures.includes("compression")) {
    lines.push(`- Compression de la plaie en cours.`);
  }
  if (decision.recommendedGestures.includes("pls")) {
    lines.push(`- Victime en position latérale de sécurité.`);
  }
  lines.push("");

  // Disponibilité
  lines.push(`📞 Je reste en ligne et disponible pour suivre vos instructions.`);

  return lines.join("\n");
}
