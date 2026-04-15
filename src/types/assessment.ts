export type ConsciousnessLevel =
  | 'conscious_alert'
  | 'conscious_counfused'
  | 'unconscious'
  | 'unknown'

export type BreathingStatus =
  | 'normal'
  | 'difficult'
  | 'absent'
  | 'unknown'

export type SituationType =
  | 'trauma'
  | 'malaise'
  | 'bleeding'
  | 'burn'
  | 'chocking'
  | 'unknown'

export type UrgencyLevel =
  | 'critical'
  | 'high'
  | 'medium'
  | 'low'

export interface VictimInfo {
  approximateAge?: 'infant' | 'child' | 'adult' | 'elderly'
  gender?: 'male' | 'female' | 'unknown'
  isAlone: boolean
}

export interface Assessment {
  // Situation
  situationType: SituationType | null
  situationDescription: string

  // Victime
  victimInfo: VictimInfo

  // Conscience
  consciousnessLevel: ConsciousnessLevel | null
  respondsToVoice: boolean | null
  respondsToPain: boolean | null

  // Respiration
  breathingStatus: BreathingStatus | null
  breathingRate?: 'slow' | 'normal' | 'fast'

  // Spécifique selon situation
  traumaDetails: {
    headInjury: boolean
    spineInjury: boolean
    fracture: boolean
    location: string
  }

  malaiseDetails: {
    chestPain: boolean
    radiatingPain: boolean
    facialAsymmetry: boolean
    speechDifficulty: boolean
    armWeakness: boolean
    diabetic: boolean | null
  }

  bleedingDetails: {
    isImportant: boolean
    location: string
    isControlled: boolean
  }

  // Environment
  environment: {
    isSafe: boolean
    numberOfVictims: number
    rescuerLocation: string
    nearestAddress: string
  }

  // Résultat calculé
  urgencyLevel: UrgencyLevel | null
  recommendedGestures: string[]
  emergencyMessage: string
}

export interface Step {
  id: number
  title: string
  description: string
  isCompleted: boolean
}

export interface Gesture {
  id: string
  title: string
  description: string
  steps: string[]
  warning?: string
  imageAlt?: string
  urgency: UrgencyLevel[]
}
