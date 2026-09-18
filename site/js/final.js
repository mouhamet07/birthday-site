/**
 * Rendu de l'écran "final" : conclusion personnalisée de l'expérience.
 *
 * Générique : ne connaît jamais "copine" ni "jumelle", uniquement la
 * forme de universe.finalScreen (date, title, message, image, imageAlt,
 * decoration). Toute différence entre les deux univers vient
 * exclusivement de data/copine.js et data/jumelle.js.
 *
 * La décoration ("hearts", "stars", ...) n'est jamais choisie par du
 * code conditionnel ici : elle est posée comme attribut data-decoration
 * sur le conteneur, et c'est déjà themes.css qui sait l'interpréter
 * (scaffold posé en Phase 1, jamais branché jusqu'ici).
 *
 * Utilise l'API DOM (createElement / textContent), jamais innerHTML,
 * comme gallery.js et letter.js.
 */

const DEFAULTS = {
  date: "",
  title: "",
  message: "",
  image: "",
  imageAlt: "",
  fit: "",
  position: "",
  decoration: "none"
};

const EMPTY_IMAGE_LABEL = "Photo finale — bientôt ici";

// Léger décalage progressif : décoration → date → titre → message → image.
const STAGGER_STEP_MS = 180;
const CONFETTI_COUNT = 24;

function withDefaults(finalScreen) {
  const safe = finalScreen || {};
  return {
    date: safe.date || DEFAULTS.date,
    title: safe.title || DEFAULTS.title,
    message: safe.message || DEFAULTS.message,
    image: safe.image || DEFAULTS.image,
    imageAlt: safe.imageAlt || DEFAULTS.imageAlt,
    fit: safe.fit || DEFAULTS.fit,
    position: safe.position || DEFAULTS.position,
    decoration: safe.decoration || DEFAULTS.decoration
  };
}

function createRevealEl(tag, className, text, stepIndex) {
  const el = document.createElement(tag);
  el.className = `${className} intro-reveal`;
  el.style.setProperty("--reveal-delay", `${stepIndex * STAGGER_STEP_MS}ms`);
  if (text) el.textContent = text;
  return el;
}

function createConfetti() {
  const container = document.createElement("div");
  container.className = "final-confetti";
  container.setAttribute("aria-hidden", "true");

  for (let index = 0; index < CONFETTI_COUNT; index += 1) {
    const piece = document.createElement("span");
    piece.className = "final-confetti__piece";
    piece.style.setProperty("--confetti-x", `${(index * 37) % 101}%`);
    piece.style.setProperty("--confetti-delay", `${(index % 8) * 70}ms`);
    piece.style.setProperty("--confetti-rotation", `${(index * 47) % 360}deg`);
    container.appendChild(piece);
  }

  return container;
}

/**
 * Même principe de repli discret que gallery.js (placeholder si le
 * fichier n'existe pas encore ou si le chemin est vide) : pas de
 * duplication de tout gallery.js, juste la même logique minimale,
 * réutilisant la classe .gallery-placeholder déjà stylée.
 */
function createFinalImage(src, alt, stepIndex, fit, position) {
  const wrapper = document.createElement("div");
  wrapper.className = "final-image intro-reveal";
  wrapper.style.setProperty("--reveal-delay", `${stepIndex * STAGGER_STEP_MS}ms`);

  const showPlaceholder = () => {
    wrapper.replaceChildren();
    const placeholder = document.createElement("div");
    placeholder.className = "gallery-placeholder";
    const span = document.createElement("span");
    span.textContent = EMPTY_IMAGE_LABEL;
    placeholder.appendChild(span);
    wrapper.appendChild(placeholder);
  };

  if (!src) {
    showPlaceholder();
    return wrapper;
  }

  const img = document.createElement("img");
  img.src = src;
  img.alt = alt || "";
  img.loading = "lazy";
  img.decoding = "async";
  img.className = "final-image__media";
  if (fit) img.style.objectFit = fit;
  if (position) img.style.objectPosition = position;
  img.addEventListener("error", showPlaceholder, { once: true });

  wrapper.appendChild(img);
  return wrapper;
}

/**
 * Construit l'écran final dans le conteneur fourni, à partir de
 * universe.finalScreen. Appelé depuis applyUniverseContent() dans
 * main.js, comme renderGallery()/renderLetter()/renderGame().
 */
function renderFinal(universe, container) {
  if (!universe || !container) return;

  container.replaceChildren();
  const finalScreen = withDefaults(universe.finalScreen);

  container.setAttribute("data-decoration", finalScreen.decoration);

  let step = 0;

  const spark = document.createElement("p");
  spark.className = "final-screen__decoration intro-reveal";
  spark.setAttribute("aria-hidden", "true");
  spark.style.setProperty("--reveal-delay", `${step * STAGGER_STEP_MS}ms`);
  const finalIcon = document.createElement("i");
  finalIcon.className = "bi bi-stars";
  finalIcon.setAttribute("aria-hidden", "true");
  spark.appendChild(finalIcon);
  container.appendChild(spark);
  if (finalScreen.decoration === "confetti") {
    container.appendChild(createConfetti());
  }
  step += 1;

  if (finalScreen.date) {
    container.appendChild(createRevealEl("p", "final-date", finalScreen.date, step));
    step += 1;
  }

  if (finalScreen.title) {
    container.appendChild(createRevealEl("h2", "final-title", finalScreen.title, step));
    step += 1;
  }

  if (finalScreen.message) {
    container.appendChild(createRevealEl("p", "final-message", finalScreen.message, step));
    step += 1;
  }

  container.appendChild(
    createFinalImage(
      finalScreen.image,
      finalScreen.imageAlt,
      step,
      finalScreen.fit,
      finalScreen.position
    )
  );
}

export { renderFinal };
