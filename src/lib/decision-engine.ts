import { Assessment, UrgencyLevel } from "@/types/assessment";
import {GESTURES} from "@/data/gesture";

export interface DecisionResult {
  urgencyLevel: UrgencyLevel
  recommendedGestures: string[]
  callNumber: '15' | '18' | '112' | '15_18'
  reasoning: string[]
}

export function analyzeAssessment(assessment: Assessment): DecisionResult {
  const reasoning: string[] = [];
  let urgencyLevel: UrgencyLevel = 'medium'
  const recommendedGestures: string[] = []
  let callNumber: DecisionResult['callNumber'] = '15'

  // ----- Critique - Inconscient qui ne respire pas
  if (
      assessment.consciousnessLevel === 'unconscious' &&
      assessment.breathingStatus === 'absent'
  ) {
    urgencyLevel = 'critical'
    recommendedGestures.push('call_immediately', 'cpr', 'aed')
    callNumber = '15'
    reasoning.push('Arrêt cardio-respiratoire suspecté - RCP immédiate requise')

    return {
      urgencyLevel, recommendedGestures, callNumber, reasoning
    }
  }

  // ----- Critique - Inconscient qui respire
  if (
      assessment.consciousnessLevel === 'unconscious' &&
      assessment.breathingStatus !== 'absent'
  ) {
    urgencyLevel = 'critical'
    recommendedGestures.push('call_immediately', 'pls')
    callNumber = '15'
    reasoning.push('Victime inconsciente - Position Latérale de Sécurité')

    return {
      urgencyLevel, recommendedGestures, callNumber, reasoning
    }
  }

  // ----- Etouffement
  if (
      assessment.situationType === 'chocking'
  ) {
    urgencyLevel = 'critical'
    recommendedGestures.push('call_immediately', 'heimlich')
    callNumber = '15'
    reasoning.push('Obstruction des voies aériennes - Manoeuvre de Heimlich')

    return {
      urgencyLevel, recommendedGestures, callNumber, reasoning
    }
  }

  // ----- Malaise
  if (
      assessment.situationType === 'malaise'
  ) {
  const {malaiseDetails} = assessment

    // Suspicion AVC
    if (
        malaiseDetails.facialAsymmetry ||
        malaiseDetails.speechDifficulty ||
        malaiseDetails.armWeakness
    ) {
      urgencyLevel = 'critical'
      recommendedGestures.push('call_immediately', 'avc_position', 'avc_monitor')
      callNumber = '15'
      reasoning.push("Signe d'AVC détectés - Appel immédiat SAMU")

      return {
        urgencyLevel, recommendedGestures, callNumber, reasoning
      }
    }

    // Suspicion infarctus
    else if (
        malaiseDetails.chestPain ||
        malaiseDetails.radiatingPain
    ) {
      urgencyLevel = 'critical'
      recommendedGestures.push('call_immediately', 'cardiac_position', 'aspirin_info')
      callNumber = '15'
      reasoning.push("Douleur thoracique suspect - Possible infarctus")

      return {
        urgencyLevel, recommendedGestures, callNumber, reasoning
      }
    }

    // Malaise Général
    else {
      urgencyLevel = 'high'
      recommendedGestures.push('call_immediately', 'confort_position', 'monitor')
      callNumber = '15'
      reasoning.push("Malaise - Surveillance et appel SAMU")

      return {
        urgencyLevel, recommendedGestures, callNumber, reasoning
      }
    }
  }

  // ----- Traumatisme
  if (assessment.situationType === 'trauma') {
    const {traumaDetails} = assessment

    if (traumaDetails.spineInjury) {
      urgencyLevel = 'critical'
      recommendedGestures.push('call_immediately', 'no_move', 'spine_stabilize')
      callNumber = '15'
      reasoning.push("Suspicion traumatisme du rachis - Ne pas mobiliser")

      return {
        urgencyLevel, recommendedGestures, callNumber, reasoning
      }
    } else if (traumaDetails.headInjury) {
      urgencyLevel = 'high'
      recommendedGestures.push('call_immediately', 'head_monitor', 'lateral_position')
      callNumber = '15'
      reasoning.push("Traumatisme cranien - Surveillance neurologique")

      return {
        urgencyLevel, recommendedGestures, callNumber, reasoning
      }
    } else if (traumaDetails.fracture) {
      urgencyLevel = 'medium'
      recommendedGestures.push('immobilize', 'confort_position')
      callNumber = '15'
      reasoning.push("Fracture suspectée - Immobilisation")

      return {
        urgencyLevel, recommendedGestures, callNumber, reasoning
      }
    }
  }

  // ----- Saignement
  if (assessment.situationType === 'bleeding') {
    const {bleedingDetails} = assessment

    if (bleedingDetails.isImportant && !bleedingDetails.isControlled) {
      urgencyLevel = 'critical'
      recommendedGestures.push('call_immediately', 'compression', 'tourniquet_info')
      callNumber = '15'
      reasoning.push("Hémorragie importante - Compression direct immédiate")

      return {
        urgencyLevel, recommendedGestures, callNumber, reasoning
      }
    } else {
      urgencyLevel = 'medium'
      recommendedGestures.push('compression', 'elevate')
      callNumber = '15'
      reasoning.push("Saignement - Compression et Surveillance")

      return {
        urgencyLevel, recommendedGestures, callNumber, reasoning
      }
    }
  }

  // ----- Brulure
  if (assessment.situationType === 'burn') {
    urgencyLevel = 'high'
    recommendedGestures.push('call_immediately', 'cool_water', 'no_cover_wrong')
    callNumber = '15'
    reasoning.push("Brûlure - Refroidissment à l'eau")

    return {
      urgencyLevel, recommendedGestures, callNumber, reasoning
    }
  }

  // Pompier si accident de la route
  if (assessment.environment.numberOfVictims > 1) {
    callNumber = '112'
    reasoning.push('Plusieurs victimes - Appel 112 recommandé')

    return {
      urgencyLevel, recommendedGestures, callNumber, reasoning
    }
  }
}
