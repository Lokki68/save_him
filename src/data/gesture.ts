
import { Gesture } from "@/types/assessment";

export const GESTURES: Record<string, Gesture> = {
  call_immediately: {
    id: "call_immediately",
    title: "Appelez les secours immédiatement",
    description: "Composez le 15 (SAMU), 18 (Pompiers) ou 112",
    steps: [
      "Composez le numéro d'urgence",
      "Restez calme et parlez clairement",
      "Donnez votre localisation précise",
      "Décrivez l'état de la victime",
      "Suivez les instructions de l'opérateur",
      "Ne raccrochez pas en premier",
    ],
    urgency: ["critical", "high"],
  },

  cpr: {
    id: "cpr",
    title: "Réanimation Cardio-Pulmonaire (RCP)",
    description: "Massage cardiaque externe + bouche-à-bouche",
    steps: [
      "Allongez la victime sur le dos, surface dure",
      "Placez le talon de votre main au centre de la poitrine",
      "Appuyez fort et vite : 30 compressions (5-6 cm de profondeur)",
      "Rythme : 100-120 compressions par minute",
      "Après 30 compressions : 2 insufflations (bouche-à-bouche)",
      "Continuez jusqu'à l'arrivée des secours ou l'arrivée d'un DAE",
    ],
    warning:
        "⚠️ Si vous ne souhaitez pas faire le bouche-à-bouche, continuez uniquement les compressions thoraciques",
    urgency: ["critical"],
  },

  pls: {
    id: "pls",
    title: "Position Latérale de Sécurité (PLS)",
    description: "Pour une victime inconsciente qui respire",
    steps: [
      "Agenouillez-vous à côté de la victime",
      "Placez le bras le plus proche à angle droit",
      "Amenez l'autre main sur la joue opposée",
      "Soulevez le genou opposé, pied à plat",
      "Faites basculer la victime vers vous doucement",
      "Assurez-vous que les voies aériennes sont libres",
      "Surveillez la respiration jusqu'aux secours",
    ],
    warning: "⚠️ Ne pas effectuer si suspicion de traumatisme rachidien",
    urgency: ["critical", "high"],
  },

  heimlich: {
    id: "heimlich",
    title: "Manœuvre de Heimlich",
    description: "Pour une obstruction totale des voies aériennes",
    steps: [
      "Placez-vous derrière la victime",
      "Penchez-la légèrement en avant",
      "Donnez 5 tapes vigoureuses entre les omoplates",
      "Si inefficace : encerclez sa taille par derrière",
      "Placez un poing fermé au-dessus du nombril",
      "Effectuez 5 compressions abdominales vers le haut",
      "Alternez tapes dans le dos et compressions abdominales",
    ],
    warning: "⚠️ Nourrisson : manœuvre différente, dos sur l'avant-bras",
    urgency: ["critical"],
  },

  avc_position: {
    id: "avc_position",
    title: "Position d'attente AVC",
    description: "Installez confortablement la victime",
    steps: [
      "Allongez la victime, tête et épaules légèrement surélevées",
      "Ne lui donnez rien à boire ou à manger",
      "Desserrez les vêtements (ceinture, col)",
      "Rassurez-la et parlez-lui doucement",
      "Notez l'heure d'apparition des premiers symptômes",
      "Surveillez sa respiration",
    ],
    warning: "⚠️ Chaque minute compte — L'AVC est une urgence absolue",
    urgency: ["critical"],
  },

  cardiac_position: {
    id: "cardiac_position",
    title: "Position d'attente cardiaque",
    description: "Position demi-assise pour faciliter la respiration",
    steps: [
      "Asseyez la victime, dos soutenu (position demi-assise)",
      "Desserrez les vêtements (ceinture, cravate, col)",
      "Rassurez-la, interdisez tout effort",
      "Ne lui donnez rien à boire ou à manger",
      "Gardez-la au chaud",
      "Préparez-vous à débuter la RCP si perte de conscience",
    ],
    urgency: ["critical"],
  },

  compression: {
    id: "compression",
    title: "Compression directe pour arrêter le saignement",
    description: "Technique de base pour contrôler une hémorragie",
    steps: [
      "Protégez-vous avec des gants si disponibles",
      "Appuyez FORT et en CONTINU sur la plaie",
      "Utilisez un tissu propre, compresse ou vêtement",
      "Maintenez la pression sans relâcher (min. 10 min)",
      "Si le tissu se sature, rajoutez par-dessus SANS enlever",
      "Surélevez le membre blessé si possible",
    ],
    warning: "⚠️ Ne jamais retirer le premier tissu, superposez uniquement",
    urgency: ["critical", "high"],
  },

  cool_water: {
    id: "cool_water",
    title: "Refroidissement d'une brûlure",
    description: "Eau fraîche (pas froide) pendant 15 minutes minimum",
    steps: [
      "Refroidissez immédiatement à l'eau fraîche (15-25°C)",
      "Maintenez sous l'eau courante pendant 15 à 20 minutes",
      "N'utilisez jamais de glace, beurre, huile ou dentifrice",
      "Retirez bijoux et vêtements autour de la brûlure (sauf collés)",
      "Couvrez avec un film plastique alimentaire si disponible",
      "Ne percez jamais les cloques",
    ],
    warning: "⚠️ Pas de glace ! Risque d'hypothermie sur grandes surfaces",
    urgency: ["high", "critical"],
  },

  immobilize: {
    id: "immobilize",
    title: "Immobilisation d'un membre fracturé",
    description: "Stabiliser sans réduire la fracture",
    steps: [
      "Ne tentez PAS de remettre l'os en place",
      "Immobilisez le membre dans la position trouvée",
      "Utilisez une attelle de fortune (planche, magazine...)",
      "Immobilisez les articulations au-dessus et en dessous",
      "Appliquez un bandage modérément serré",
      "Vérifiez la sensibilité et la couleur du membre régulièrement",
    ],
    urgency: ["medium"],
  },

  no_move: {
    id: "no_move",
    title: "Ne pas mobiliser la victime",
    description: "Suspicion de traumatisme du rachis — Immobilité totale",
    steps: [
      "NE BOUGEZ PAS la victime sauf danger immédiat",
      "Maintenez la tête dans l'axe si possible",
      "Parlez-lui pour la rassurer et l'empêcher de bouger",
      "Attendez les secours spécialisés",
      "Si vomissements : retournez en bloc avec aide",
    ],
    warning: "⚠️ Toute mobilisation incorrecte peut causer une paralysie définitive",
    urgency: ["critical"],
  },
};
