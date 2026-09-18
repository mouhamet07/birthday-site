/**
 * Données de l'univers "jumelle".
 * Même schéma exact que copine.js : le moteur ne doit jamais
 * avoir besoin de savoir laquelle des deux est laquelle.
 */
export default {
  id: "jumelle",
  prenom: "Prénom 2",
  tagline: "Placeholder — une phrase d'accroche viendra ici.",

  theme: {
    primary: "#8f7fc9",
    secondary: "#f1ede4",
    accent: "#2b2a2f",
    background: "#f8f6f1",
    surface: "#ffffff",
    text: "#2b2a2f",
    muted: "#9d97ab",
    textOnPrimary: "#ffffff"
  },

  hero: {
    image: "assets/images/jumelle/hero.jpg",
    eyebrow: "Placeholder eyebrow",
    title: "Placeholder titre hero",
    subtitle: "Placeholder sous-titre hero."
  },

  galleryIntro: {
    eyebrow: "Quelques fragments",
    title: "Des moments. Des détails. Des souvenirs.",
    text: "Placeholder — texte d'introduction court de la galerie."
  },

  gallery: [
    {
      type: "photo-large",
      src: "assets/images/jumelle/gallery-01.jpg",
      alt: "Placeholder — description de la photo.",
      caption: "Placeholder légende."
    },
    {
      type: "text",
      eyebrow: "Petit souvenir",
      title: "Placeholder titre du souvenir",
      content: "Placeholder — texte court accompagnant ce souvenir."
    },
    {
      type: "photo-large",
      src: "assets/images/jumelle/gallery-03.webp",
      alt: "Placeholder — description de la photo.",
      caption: "Placeholder légende."
    },
    {
      type: "photo-large",
      src: "assets/images/jumelle/gallery-05.webp",
      alt: "Placeholder — description de la photo.",
      caption: "Placeholder légende."
    },
    {
      type: "video",
      src: "assets/videos/jumelle/video-01.mp4",
      caption: "Placeholder légende vidéo."
    },
    {
      type: "video",
      src: "assets/videos/jumelle/video-02.mp4",
      caption: "Placeholder légende vidéo."
    }
  ],

  letter: {
    title: "Une lettre pour toi.",
    greeting: "Placeholder — formule d'ouverture de la lettre.",
    paragraphs: [
      "Placeholder — premier paragraphe de la lettre.",
      "Placeholder — deuxième paragraphe de la lettre.",
      "Placeholder — troisième paragraphe de la lettre."
    ],
    closing: "Placeholder — phrase de conclusion.",
    signature: "Placeholder — signature.",
    openLabel: "Ouvrir la lettre",
    continueLabel: "Découvrir la suite"
  },

  game: {
    title: "Placeholder titre du jeu",
    intro: "Une petite mission t'attend.",
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
    title: "Placeholder titre final",
    message: "Placeholder — message final, ton chaleureux et sincère.",
    image: "assets/images/final.jpeg",
    imageAlt: "Souvenir d'enfance partagé.",
    decoration: "confetti"
  }
};
