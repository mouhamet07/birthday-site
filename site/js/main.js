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
import { goToStep, goToPreviousStep, initRouter } from "./router.js";
import { selectUniverse, getAllUniverses } from "./univers.js";
import { renderGallery } from "./gallery.js";
import { renderLetter } from "./letter.js";
import { renderGame } from "./game.js";
import { renderFinal } from "./final.js";
import { startAmbientAudio } from "./audio.js";
import { qs, qsa } from "./utils.js";

/**
 * Génère les cartes de l'écran universe-selection à partir des
 * données (copine.js / jumelle.js), sans jamais coder un prénom ou
 * une couleur en dur dans le HTML.
 */
function renderUniverseChoices() {
  const container = qs("[data-content='universe-choices']");
  if (!container) return;

  container.innerHTML = getAllUniverses()
    .map((universe) => {
      const visualStyle = [
        `--universe-swatch: ${universe.theme.primary}`,
        universe.hero.image ? `background-image: url('${universe.hero.image}')` : ""
      ]
        .filter(Boolean)
        .join("; ");

      return `
        <button type="button" class="universe-card" data-action="select-universe" data-universe="${universe.id}">
          <span class="universe-card__visual" style="${visualStyle}"></span>
          <span class="universe-card__prenom">${universe.prenom}</span>
          <span class="universe-card__tagline">${universe.tagline}</span>
        </button>
      `;
    })
    .join("");
}

function applyUniverseContent(universe) {
  if (!universe) return;
  qsa("[data-content='universe-prenom']").forEach((el) => {
    el.textContent = universe.prenom;
  });
  qsa("[data-content='universe-tagline']").forEach((el) => {
    el.textContent = universe.tagline;
  });
  qsa("[data-content='hero-eyebrow']").forEach((el) => {
    el.textContent = universe.hero.eyebrow;
  });
  qsa("[data-content='hero-title']").forEach((el) => {
    el.textContent = universe.hero.title;
  });
  qsa("[data-content='hero-subtitle']").forEach((el) => {
    el.textContent = universe.hero.subtitle;
  });
  qsa("[data-content='hero-visual']").forEach((el) => {
    el.style.backgroundImage = universe.hero.image ? `url('${universe.hero.image}')` : "";
  });

  const galleryContainer = qs("[data-content='gallery-content']");
  if (galleryContainer) {
    renderGallery(universe, galleryContainer);
  }

  const letterContainer = qs("[data-content='letter-content']");
  if (letterContainer) {
    renderLetter(universe, letterContainer, () => goToStep("game-intro"));
  }

  qsa("[data-content='game-intro-text']").forEach((el) => {
    if (universe.game && universe.game.intro) {
      el.textContent = universe.game.intro;
    }
  });

  const gameContainer = qs("[data-content='game-content']");
  if (gameContainer) {
    renderGame(universe, gameContainer, () => goToStep("mission-complete"));
  }

  const finalContainer = qs("[data-content='final-content']");
  if (finalContainer) {
    renderFinal(universe, finalContainer);
  }
}

function bindNavigation() {
  document.addEventListener("click", (event) => {
    startAmbientAudio();

    const trigger = event.target.closest("[data-action]");
    if (!trigger) return;

    const { action } = trigger.dataset;

    if (action === "go-to" && trigger.dataset.step) {
      goToStep(trigger.dataset.step);
    }

    if (action === "go-back") {
      goToPreviousStep();
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

  renderUniverseChoices();

  // Si un univers est déjà présent au chargement (cas futur avec
  // persistance), on réapplique son thème et son contenu.
  const current = getState();
  if (current.universe) {
    applyUniverseContent(selectUniverse(current.universe));
  }

  bindNavigation();
}

document.addEventListener("DOMContentLoaded", init);
