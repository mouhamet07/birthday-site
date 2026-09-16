/**
 * Point d'entrée. Ne contient aucune logique métier :
 * il branche le router, l'état et les univers ensemble,
 * et écoute les boutons de démonstration temporaires.
 *
 * Les boutons de nav utilisent des data-attributes génériques :
 *   data-action="go-to" data-step="gallery"
 *   data-action="select-universe" data-universe="copine"
 * Aucun handler ne doit connaître "copine" ou "jumelle" en dur ;
 * la valeur vient toujours de l'attribut HTML.
 */

import { subscribe, setState, getState } from "./state.js";
import { goToStep, initRouter } from "./router.js";
import { selectUniverse } from "./univers.js";
import { qs, qsa } from "./utils.js";

function applyUniverseContent(universe) {
  if (!universe) return;
  qsa("[data-content='universe-name']").forEach((el) => {
    el.textContent = universe.name;
  });
  qsa("[data-content='universe-tagline']").forEach((el) => {
    el.textContent = universe.tagline;
  });
}

function bindNavigation() {
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-action]");
    if (!trigger) return;

    const { action } = trigger.dataset;

    if (action === "go-to" && trigger.dataset.step) {
      goToStep(trigger.dataset.step);
    }

    if (action === "select-universe" && trigger.dataset.universe) {
      const universe = selectUniverse(trigger.dataset.universe);
      if (!universe) return;
      setState({ universe: universe.id });
      applyUniverseContent(universe);
      goToStep("universe-intro");
    }
  });
}

function init() {
  const onStateChange = initRouter();
  subscribe(onStateChange);

  // Si un univers est déjà présent au chargement (cas futur avec
  // persistance), on réapplique son thème et son contenu.
  const current = getState();
  if (current.universe) {
    applyUniverseContent(selectUniverse(current.universe));
  }

  bindNavigation();
}

document.addEventListener("DOMContentLoaded", init);
