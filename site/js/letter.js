import { playEnvelopeSound } from "./audio.js";

/**
 * Rendu et comportement de l'écran "letter" : enveloppe fermée,
 * ouverture déclenchée par l'utilisateur, révélation progressive du
 * contenu de la lettre.
 *
 * Générique : ne connaît jamais "copine" ni "jumelle", uniquement la
 * forme de universe.letter. Aucune donnée manquante ne doit provoquer
 * d'erreur — des valeurs de repli raisonnables sont utilisées.
 *
 * Utilise l'API DOM (createElement / textContent), jamais innerHTML,
 * pour ne jamais interpréter le contenu des données comme du HTML.
 */

const DEFAULTS = {
  title: "Une lettre pour toi.",
  greeting: "",
  paragraphs: [],
  closing: "",
  signature: "",
  openLabel: "Ouvrir la lettre",
  continueLabel: "Continuer"
};

// Léger décalage progressif entre les éléments de la lettre lors de
// sa révélation, plafonné pour rester émotionnel sans être frustrant.
const STAGGER_STEP_MS = 220;
const MAX_STAGGER_MS = 1100;

function withDefaults(letter) {
  const safe = letter || {};
  return {
    title: safe.title || DEFAULTS.title,
    greeting: safe.greeting || DEFAULTS.greeting,
    paragraphs: Array.isArray(safe.paragraphs) && safe.paragraphs.length
      ? safe.paragraphs
      : DEFAULTS.paragraphs,
    closing: safe.closing || DEFAULTS.closing,
    signature: safe.signature || DEFAULTS.signature,
    openLabel: safe.openLabel || DEFAULTS.openLabel,
    continueLabel: safe.continueLabel || DEFAULTS.continueLabel
  };
}

function createEnvelope(openLabel, onOpen) {
  const envelope = document.createElement("div");
  envelope.className = "envelope";

  const body = document.createElement("div");
  body.className = "envelope__body";
  body.setAttribute("aria-hidden", "true");

  const flap = document.createElement("div");
  flap.className = "envelope__flap";
  body.appendChild(flap);

  const seal = document.createElement("div");
  seal.className = "envelope__seal";
  const sealIcon = document.createElement("i");
  sealIcon.className = "bi bi-envelope-heart";
  sealIcon.setAttribute("aria-hidden", "true");
  seal.appendChild(sealIcon);
  body.appendChild(seal);

  const button = document.createElement("button");
  button.type = "button";
  button.className = "envelope__button";
  button.textContent = openLabel;
  button.addEventListener("click", () => onOpen(envelope, button), { once: true });

  envelope.appendChild(body);
  envelope.appendChild(button);

  return envelope;
}

function createParagraph(text, className, stepIndex) {
  const p = document.createElement("p");
  p.className = `${className} intro-reveal`;
  p.style.setProperty("--reveal-delay", `${Math.min(stepIndex * STAGGER_STEP_MS, MAX_STAGGER_MS)}ms`);
  p.textContent = text;
  return p;
}

function createLetterPaper(letter, onContinue) {
  const paper = document.createElement("div");
  paper.className = "letter-paper";
  paper.hidden = true;
  paper.setAttribute("aria-hidden", "true");

  let step = 0;

  const title = document.createElement("h2");
  title.className = "letter-title intro-reveal";
  title.style.setProperty("--reveal-delay", `${step * STAGGER_STEP_MS}ms`);
  title.textContent = letter.title;
  title.tabIndex = -1;
  paper.appendChild(title);
  step += 1;

  if (letter.greeting) {
    paper.appendChild(createParagraph(letter.greeting, "letter-greeting", step));
    step += 1;
  }

  letter.paragraphs.forEach((paragraph) => {
    paper.appendChild(createParagraph(paragraph, "letter-paragraph", step));
    step += 1;
  });

  if (letter.closing) {
    paper.appendChild(createParagraph(letter.closing, "letter-closing", step));
    step += 1;
  }

  if (letter.signature) {
    paper.appendChild(createParagraph(letter.signature, "letter-signature", step));
    step += 1;
  }

  const continueButton = document.createElement("button");
  continueButton.type = "button";
  continueButton.className = "btn letter-continue intro-reveal";
  continueButton.style.setProperty("--reveal-delay", `${step * STAGGER_STEP_MS}ms`);
  continueButton.textContent = letter.continueLabel;
  continueButton.addEventListener("click", onContinue);
  paper.appendChild(continueButton);

  return paper;
}

/**
 * Ouvre l'enveloppe : déclenche la transition CSS, puis bascule
 * l'affichage vers la lettre une fois la transition terminée (avec un
 * filet de sécurité si "transitionend" ne se déclenche pas, par
 * exemple sous prefers-reduced-motion où la durée est proche de 0).
 */
function openEnvelope(envelope, button, paper) {
  button.disabled = true;
  playEnvelopeSound();
  envelope.classList.add("is-open");

  let revealed = false;
  const reveal = () => {
    if (revealed) return;
    revealed = true;
    envelope.hidden = true;
    paper.hidden = false;
    paper.removeAttribute("aria-hidden");
    const title = paper.querySelector(".letter-title");
    if (title) title.focus({ preventScroll: false });
  };

  envelope.addEventListener(
    "transitionend",
    (event) => {
      if (event.target === envelope && event.propertyName === "opacity") {
        reveal();
      }
    },
    { once: true }
  );

  // Filet de sécurité : si aucune transition ne se déclenche
  // (reduced motion, navigateur particulier), on révèle quand même.
  window.setTimeout(reveal, 900);
}

/**
 * Construit l'écran lettre (enveloppe + papier) dans le conteneur
 * fourni, à partir de universe.letter. `onContinue` est appelé quand
 * la personne clique sur le CTA final (navigation gérée par main.js).
 */
function renderLetter(universe, container, onContinue) {
  if (!universe || !container) return;

  container.replaceChildren();

  const letter = withDefaults(universe.letter);
  const paper = createLetterPaper(letter, onContinue);
  const envelope = createEnvelope(letter.openLabel, (envelopeEl, buttonEl) =>
    openEnvelope(envelopeEl, buttonEl, paper)
  );

  container.appendChild(envelope);
  container.appendChild(paper);
}

export { renderLetter };
