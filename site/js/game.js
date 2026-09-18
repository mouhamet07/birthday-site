/**
 * Rendu et comportement de l'écran "game" : mini-jeu personnalisé de
 * quelques questions à choix.
 *
 * Générique : ne connaît jamais "copine" ni "jumelle", uniquement la
 * forme de universe.game (title, intro, questions[]). Toute différence
 * entre les deux univers vient exclusivement de data/copine.js et
 * data/jumelle.js.
 *
 * L'état de la partie (question courante, score, réponses données,
 * complétion) vit dans state.js — source de vérité unique — et n'est
 * jamais dupliqué localement ici.
 *
 * Utilise l'API DOM (createElement / textContent), jamais innerHTML,
 * et uniquement de vrais <button> pour rester utilisable au clavier.
 *
 * game.js ne connaît pas le router : `onComplete` (fourni par main.js)
 * est le seul point de sortie vers l'écran suivant.
 */

import { getState, setState, resetGame } from "./state.js";
import { playSuccessChime } from "./audio.js";
import { prefersReducedMotion } from "./utils.js";

const DEFAULTS = {
  title: "Petite mission",
  questions: []
};

// Messages génériques du moteur (pas de contenu personnel) : le même
// texte s'applique aux deux univers, la personnalisation vient
// uniquement des questions elles-mêmes.
const CORRECT_FEEDBACK = "Bien joué.";
const EMPTY_STATE_MESSAGE = "Cette mission arrive bientôt.";

// Laisse le temps de voir le feedback avant de passer à la question
// suivante ; quasi instantané si l'utilisateur préfère moins de mouvement.
const FEEDBACK_DELAY_MS = 900;
const FEEDBACK_DELAY_REDUCED_MS = 120;

function withDefaults(game) {
  const safe = game || {};
  return {
    title: safe.title || DEFAULTS.title,
    questions: Array.isArray(safe.questions) ? safe.questions : DEFAULTS.questions
  };
}

function createProgress(current, total) {
  const progress = document.createElement("p");
  progress.className = "game-progress";
  progress.textContent = `Question ${current + 1} / ${total}`;
  return progress;
}

function createHeader(title) {
  const header = document.createElement("div");
  header.className = "game-header";

  const heading = document.createElement("h2");
  heading.className = "game-title";
  heading.textContent = title;
  header.appendChild(heading);

  return header;
}

function createOptionButton(label, index, onSelect) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "game-option";
  button.textContent = label;
  button.addEventListener("click", () => onSelect(index, button), { once: true });
  return button;
}

/**
 * Construit et affiche une question. Rappelée pour chaque question
 * suivante plutôt que de garder un état local : l'index courant est
 * toujours lu depuis state.js.
 */
function renderQuestion(game, container, onComplete) {
  const { currentQuestion } = getState().game;
  const question = game.questions[currentQuestion];

  // Filet de sécurité : ne devrait pas arriver en usage normal, mais
  // évite tout plantage si l'index dépasse le nombre de questions.
  if (!question) {
    finishGame(onComplete);
    return;
  }

  container.replaceChildren();

  const screen = document.createElement("div");
  screen.className = "game-container";

  screen.appendChild(createHeader(game.title));
  screen.appendChild(createProgress(currentQuestion, game.questions.length));

  const questionEl = document.createElement("p");
  questionEl.className = "game-question";
  questionEl.textContent = question.question || "";
  screen.appendChild(questionEl);

  const optionsList = document.createElement("div");
  optionsList.className = "game-options";
  optionsList.setAttribute("role", "group");
  if (question.question) {
    optionsList.setAttribute("aria-label", question.question);
  }

  const feedback = document.createElement("p");
  feedback.className = "game-feedback";
  feedback.setAttribute("aria-live", "polite");

  const options = Array.isArray(question.options) ? question.options : [];
  const buttons = options.map((option, index) => {
    const button = createOptionButton(
      option,
      index,
      (selectedIndex, selectedButton) =>
        handleAnswer(game, container, onComplete, question, selectedIndex, selectedButton, buttons, feedback)
    );
    optionsList.appendChild(button);
    return button;
  });

  screen.appendChild(optionsList);
  screen.appendChild(feedback);
  container.appendChild(screen);
}

/**
 * Traite le choix : chaque réponse est valide dans cette expérience
 * symbolique. Les options sont verrouillées, puis la question suivante
 * est affichée.
 */
function handleAnswer(game, container, onComplete, question, selectedIndex, selectedButton, buttons, feedback) {
  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === selectedIndex) {
      button.classList.add("is-correct");
      button.classList.add("is-selected");
    }
  });

  feedback.replaceChildren();
  const feedbackIcon = document.createElement("span");
  feedbackIcon.className = "game-feedback__icon bi bi-check-circle";
  feedbackIcon.setAttribute("aria-hidden", "true");
  feedback.appendChild(feedbackIcon);
  feedback.append(CORRECT_FEEDBACK);

  const current = getState().game;
  setState({
    game: {
      ...current,
      score: current.score + 1,
      answers: [...current.answers, selectedIndex]
    }
  });

  const delay = prefersReducedMotion() ? FEEDBACK_DELAY_REDUCED_MS : FEEDBACK_DELAY_MS;

  window.setTimeout(() => {
    advance(game, container, onComplete);
  }, delay);
}

function advance(game, container, onComplete) {
  const current = getState().game;
  const nextIndex = current.currentQuestion + 1;

  if (nextIndex >= game.questions.length) {
    finishGame(onComplete);
    return;
  }

  setState({ game: { ...current, currentQuestion: nextIndex } });
  renderQuestion(game, container, onComplete);
}

function finishGame(onComplete) {
  const current = getState().game;
  if (current.completed) return;

  setState({ game: { ...current, completed: true } });
  playSuccessChime();
  if (typeof onComplete === "function") {
    onComplete();
  }
}

function renderEmptyState(container, onComplete) {
  container.replaceChildren();

  const screen = document.createElement("div");
  screen.className = "game-container";

  const message = document.createElement("p");
  message.className = "game-question";
  message.textContent = EMPTY_STATE_MESSAGE;
  screen.appendChild(message);

  const continueButton = document.createElement("button");
  continueButton.type = "button";
  continueButton.className = "btn";
  continueButton.textContent = "Continuer";
  continueButton.addEventListener("click", () => finishGame(onComplete), { once: true });
  screen.appendChild(continueButton);

  container.appendChild(screen);
}

/**
 * Construit l'écran de jeu dans le conteneur fourni, à partir de
 * universe.game. Réinitialise la partie (state.game) à chaque appel :
 * comme renderGallery()/renderLetter(), c'est appelé une fois par
 * sélection d'univers, donc au bon moment pour repartir de zéro.
 * `onComplete` est appelé une fois la dernière question passée
 * (navigation gérée par main.js).
 */
function renderGame(universe, container, onComplete) {
  if (!universe || !container) return;

  const game = withDefaults(universe.game);
  resetGame();

  if (!game.questions.length) {
    renderEmptyState(container, onComplete);
    return;
  }

  renderQuestion(game, container, onComplete);
}

export { renderGame };
