/**
 * Point d'entrée unique vers le contenu des univers.
 *
 * Ce module ne contient AUCUNE logique spécifique à "copine" ou
 * "jumelle" : il reçoit un id, va chercher la donnée correspondante,
 * et applique le thème. Toute différence entre les deux univers doit
 * venir de data/copine.js et data/jumelle.js, jamais d'ici.
 */

import copine from "../data/copine.js";
import jumelle from "../data/jumelle.js";

const UNIVERSES = {
  copine,
  jumelle
};

function getUniverse(id) {
  const universe = UNIVERSES[id];
  if (!universe) {
    console.warn(`[univers.js] Univers inconnu : "${id}"`);
    return null;
  }
  return universe;
}

function applyTheme(universe) {
  if (!universe) return;

  const root = document.documentElement;
  root.setAttribute("data-univers", universe.id);

  Object.entries(universe.theme).forEach(([key, value]) => {
    root.style.setProperty(`--theme-${key}`, value);
  });
}

/**
 * Sélectionne un univers : applique son thème et retourne ses données.
 * Ne touche pas au DOM au-delà de la classe/attribut de thème —
 * l'affichage du contenu (prénom, tagline, etc.) est la responsabilité
 * des modules d'écran (gallery.js, letter.js, game.js, etc.).
 */
function selectUniverse(id) {
  const universe = getUniverse(id);
  applyTheme(universe);
  return universe;
}

export { getUniverse, applyTheme, selectUniverse };
