/**
 * Petites fonctions utilitaires génériques, sans dépendance
 * à l'état ni au contenu d'un univers en particulier.
 */

function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

function qsa(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { qs, qsa, prefersReducedMotion };
