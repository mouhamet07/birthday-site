/**
 * Données de l'univers "copine".
 * Aucune logique ici : uniquement du contenu.
 * Le moteur (univers.js, gallery.js, letter.js, game.js) lit cette
 * structure sans jamais connaître le nom "copine" en dur.
 *
 * Schéma partagé avec data/jumelle.js — mêmes clés, mêmes niveaux
 * de nesting, seules les valeurs changent.
 */
export default {
  id: "copine",
  prenom: "Prénom 1",
  tagline: "Placeholder — une phrase d'accroche viendra ici.",

  theme: {
    primary: "#d98a8a",
    secondary: "#f4ece4",
    accent: "#2f2b28",
    background: "#faf6f2",
    surface: "#ffffff",
    text: "#2f2b28",
    muted: "#a89a92",
    textOnPrimary: "#ffffff"
  },

  hero: {
    image: "assets/images/copine/hero.webp",
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
      src: "assets/images/copine/gallery-01.webp",
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
      src: "assets/images/copine/gallery-03.webp",
      alt: "Placeholder — description de la photo.",
      caption: "Placeholder légende."
    },
    {
      type: "photo-large",
      src: "assets/images/copine/gallery-04.jpg",
      alt: "Placeholder — description de la photo.",
      caption: "Placeholder légende."
    },
    {
      type: "photo-large",
      src: "assets/images/copine/gallery-05.webp",
      alt: "Placeholder — description de la photo.",
      caption: "Placeholder légende."
    },
    {
      type: "photo-large",
      src: "assets/images/copine/gallery-06.jpg",
      alt: "Placeholder — description de la photo.",
      caption: "Placeholder légende."
    },
    {
      type: "photo-large",
      src: "assets/images/copine/gallery-07.jpg",
      alt: "Placeholder — description de la photo.",
      caption: "Placeholder légende."
    },
    {
      type: "photo-large",
      src: "assets/images/copine/gallery-08.webp",
      alt: "Placeholder — description de la photo.",
      caption: "Placeholder légende."
    },
    {
      type: "photo-large",
      src: "assets/images/copine/gallery-10.jpg",
      alt: "Placeholder — description de la photo.",
      caption: "Placeholder légende."
    },
    {
      type: "video",
      src: "assets/videos/copine/video-01.mp4",
      caption: "Placeholder légende vidéo."
    },
    {
      type: "video",
      src: "assets/videos/copine/video-02.mp4",
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
    message: "Placeholder — message final, ton plus intime et romantique.",
    image: "assets/images/final.jpeg",
    imageAlt: "Placeholder — description de la photo finale.",
    decoration: "hearts"
  }
};
