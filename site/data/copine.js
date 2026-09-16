/**
 * Données de l'univers "copine".
 * Aucune logique ici : uniquement du contenu.
 * Le moteur (univers.js, gallery.js, letter.js, game.js) lit cette
 * structure sans jamais connaître le nom "copine" en dur.
 */
export default {
  id: "copine",
  name: "Prénom Copine",
  tagline: "Placeholder — une phrase d'accroche viendra ici.",

  theme: {
    primary: "#d98a8a",
    secondary: "#f4ece4",
    accent: "#2f2b28",
    background: "#faf6f2",
    textOnPrimary: "#ffffff"
  },

  hero: {
    image: null // ex: "assets/images/copine/hero.jpg"
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
    decoration: "hearts"
  }
};
