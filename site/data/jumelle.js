/**
 * Données de l'univers "jumelle".
 * Même structure exacte que copine.js : le moteur ne doit jamais
 * avoir besoin de savoir laquelle des deux est laquelle.
 */
export default {
  id: "jumelle",
  name: "Prénom Jumelle",
  tagline: "Placeholder — une phrase d'accroche viendra ici.",

  theme: {
    primary: "#8f7fc9",
    secondary: "#f1ede4",
    accent: "#2b2a2f",
    background: "#f8f6f1",
    textOnPrimary: "#ffffff"
  },

  hero: {
    image: null
  },

  gallery: [
    { type: "text", content: "Placeholder — premier souvenir." },
    { type: "photo-large", src: null, caption: "Placeholder légende." }
  ],

  letter: {
    content: "Placeholder — le texte de la lettre sera fourni plus tard."
  },

  game: {
    questions: [
      {
        type: "choice",
        question: "Question placeholder 1 ?",
        options: ["Option A", "Option B"],
        answer: 0
      },
      {
        type: "choice",
        question: "Question placeholder 2 ?",
        options: ["Option A", "Option B"],
        answer: 1
      }
    ]
  },

  finalScreen: {
    date: "28.09.2026",
    message: "Placeholder — message final.",
    image: null,
    decoration: "stars"
  }
};
