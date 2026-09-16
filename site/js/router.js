/**
 * Router minimal pour une expérience linéaire à écran unique.
 *
 * Il ne fait que 3 choses :
 *  1. afficher l'écran correspondant à state.currentStep,
 *  2. masquer tous les autres,
 *  3. refuser une transition qui n'a pas de sens (ex: aller à "letter"
 *     sans univers sélectionné).
 *
 * Pas d'historique navigateur, pas d'URL par étape : ce n'est pas
 * nécessaire pour une expérience à vivre en un seul passage.
 */

import { STEPS, getState, setState } from "./state.js";
import { qsa } from "./utils.js";

// Étapes qui nécessitent qu'un univers ait déjà été choisi.
const STEPS_REQUIRING_UNIVERSE = new Set(
  STEPS.slice(STEPS.indexOf("universe-intro"))
);

function isTransitionAllowed(step) {
  if (!STEPS.includes(step)) {
    console.warn(`[router.js] Étape inconnue : "${step}"`);
    return false;
  }
  if (STEPS_REQUIRING_UNIVERSE.has(step) && !getState().universe) {
    console.warn(
      `[router.js] Transition refusée vers "${step}" : aucun univers sélectionné.`
    );
    return false;
  }
  return true;
}

function renderScreen(step) {
  qsa("[data-screen]").forEach((section) => {
    const isActive = section.dataset.screen === step;
    section.hidden = !isActive;
    section.classList.toggle("is-active", isActive);
  });
}

/**
 * Tente de naviguer vers une étape. Retourne true si la navigation
 * a eu lieu, false si elle a été refusée.
 */
function goToStep(step) {
  if (!isTransitionAllowed(step)) return false;
  setState({ currentStep: step });
  return true;
}

/**
 * Initialise le router : rend l'écran courant et se met à jour à
 * chaque changement d'état.
 */
function initRouter() {
  renderScreen(getState().currentStep);
  return (state) => renderScreen(state.currentStep);
}

export { goToStep, initRouter, isTransitionAllowed };
