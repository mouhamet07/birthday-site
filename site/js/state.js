/**
 * Source de vérité unique pour tout le site.
 * Aucun autre module ne doit garder sa propre copie de l'état.
 *
 * Étapes possibles (currentStep) :
 *   landing -> concept -> universe-selection -> universe-intro
 *   -> gallery -> letter -> game-intro -> game -> mission-complete -> final
 */

const STEPS = [
  "landing",
  "concept",
  "universe-selection",
  "universe-intro",
  "gallery",
  "letter",
  "game-intro",
  "game",
  "mission-complete",
  "final"
];

let state = {
  universe: null, // "copine" | "jumelle" | null
  currentStep: STEPS[0],
  game: {
    currentQuestion: 0,
    completed: false
  }
};

const listeners = new Set();

function getState() {
  // copie superficielle pour éviter les mutations directes de l'extérieur
  return { ...state, game: { ...state.game } };
}

function setState(partial) {
  state = {
    ...state,
    ...partial,
    game: { ...state.game, ...(partial.game || {}) }
  };
  listeners.forEach((listener) => listener(getState()));
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function resetGame() {
  setState({ game: { currentQuestion: 0, completed: false } });
}

function reset() {
  state = {
    universe: null,
    currentStep: STEPS[0],
    game: { currentQuestion: 0, completed: false }
  };
  listeners.forEach((listener) => listener(getState()));
}

export { STEPS, getState, setState, subscribe, resetGame, reset };
