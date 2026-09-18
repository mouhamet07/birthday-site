/**
 * Rendu data-driven de la galerie narrative.
 *
 * Le moteur est agnostique aux deux univers : il lit uniquement la
 * structure fournie dans universe.gallery et universe.galleryIntro.
 */

const DEFAULTS = {
  galleryIntro: {
    eyebrow: "",
    title: "",
    text: ""
  },
  gallery: []
};

const RENDERERS = {
  "photo-large": renderPhotoLarge,
  "photo-pair": renderPhotoPair,
  text: renderTextBlock,
  video: renderVideoBlock
};

function sanitizeText(value) {
  return typeof value === "string" ? value : "";
}

function createPlaceholder(label) {
  const wrapper = document.createElement("div");
  wrapper.className = "gallery-placeholder";

  const text = document.createElement("span");
  text.textContent = label;
  wrapper.appendChild(text);

  return wrapper;
}

function createVideoFallback(src) {
  const link = document.createElement("a");
  link.className = "gallery-placeholder gallery-media__fallback";
  link.href = src;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = "Ouvrir la vidéo";
  link.setAttribute("aria-label", "Ouvrir la vidéo dans un nouvel onglet");
  return link;
}

function createMediaShell({ isVideo = false } = {}) {
  const shell = document.createElement("div");
  shell.className = "gallery-media";
  if (isVideo) {
    shell.classList.add("gallery-media--video");
  }
  return shell;
}

function createImage({ src, alt, fit, position }) {
  const img = document.createElement("img");
  img.className = "gallery-media__image";
  img.src = src;
  img.alt = sanitizeText(alt) || "Photo de souvenir";
  img.loading = "eager";
  img.decoding = "async";
  if (fit) img.style.objectFit = fit;
  if (position) img.style.objectPosition = position;
  return img;
}

function renderImageBlock(src, alt, caption, fit, position) {
  const wrapper = document.createElement("figure");
  wrapper.className = "gallery-block gallery-block--image";

  const media = createMediaShell();
  if (!src) {
    media.appendChild(createPlaceholder("Image indisponible"));
    wrapper.appendChild(media);
    if (caption) {
      const el = document.createElement("figcaption");
      el.className = "gallery-caption";
      el.textContent = caption;
      wrapper.appendChild(el);
    }
    return wrapper;
  }

  const img = createImage({ src, alt, fit, position });

  img.addEventListener(
    "error",
    () => {
      media.replaceChildren(createPlaceholder("Image indisponible"));
    },
    { once: true }
  );

  media.appendChild(img);
  wrapper.appendChild(media);

  if (caption) {
    const figcaption = document.createElement("figcaption");
    figcaption.className = "gallery-caption";
    figcaption.textContent = caption;
    wrapper.appendChild(figcaption);
  }

  return wrapper;
}

function renderPhotoLarge(block) {
  const item = block || {};
  return renderImageBlock(item.src, item.alt, item.caption, item.fit, item.position);
}

function renderTextBlock(block) {
  const item = block || {};
  const article = document.createElement("article");
  article.className = "gallery-block gallery-block--text";

  if (item.eyebrow) {
    const eyebrow = document.createElement("p");
    eyebrow.className = "gallery-block__eyebrow";
    eyebrow.textContent = item.eyebrow;
    article.appendChild(eyebrow);
  }

  if (item.title) {
    const title = document.createElement("h3");
    title.className = "gallery-block__title";
    title.textContent = item.title;
    article.appendChild(title);
  }

  if (item.content) {
    const content = document.createElement("p");
    content.className = "gallery-block__content";
    content.textContent = item.content;
    article.appendChild(content);
  }

  return article;
}

function renderVideoBlock(block) {
  const item = block || {};
  const wrapper = document.createElement("figure");
  wrapper.className = "gallery-block gallery-block--video";

  const media = createMediaShell({ isVideo: true });
  if (!item.src) {
    media.appendChild(createPlaceholder("Vidéo indisponible"));
    wrapper.appendChild(media);
    if (item.caption) {
      const figcaption = document.createElement("figcaption");
      figcaption.className = "gallery-caption";
      figcaption.textContent = item.caption;
      wrapper.appendChild(figcaption);
    }
    return wrapper;
  }

  const video = document.createElement("video");
  video.className = "gallery-media__video";
  if (item.fit) video.style.objectFit = item.fit;
  if (item.position) video.style.objectPosition = item.position;
  video.src = item.src;
  video.controls = true;
  video.playsInline = true;
  video.preload = "metadata";
  video.setAttribute("playsinline", "true");
  video.setAttribute("controls", "controls");

  if (item.poster) {
    video.poster = item.poster;
  }

  video.addEventListener(
    "error",
    () => {
      media.replaceChildren(createVideoFallback(item.src));
    },
    { once: true }
  );

  media.appendChild(video);
  wrapper.appendChild(media);

  if (item.caption) {
    const figcaption = document.createElement("figcaption");
    figcaption.className = "gallery-caption";
    figcaption.textContent = item.caption;
    wrapper.appendChild(figcaption);
  }

  return wrapper;
}

function renderPhotoPair(block) {
  const item = block || {};
  const items = Array.isArray(item.items) ? item.items : [];
  const wrapper = document.createElement("figure");
  wrapper.className = "gallery-block gallery-block--photo-pair";

  items.forEach((entry) => {
    const pairItem = document.createElement("div");
    pairItem.className = "gallery-photo-pair__item";
    pairItem.appendChild(
      renderImageBlock(entry.src, entry.alt, entry.caption, entry.fit, entry.position)
    );
    wrapper.appendChild(pairItem);
  });

  return wrapper;
}

function renderGalleryIntro(universe) {
  const intro = universe?.galleryIntro || DEFAULTS.galleryIntro;
  const container = document.createElement("div");
  container.className = "gallery-intro";

  const eyebrow = sanitizeText(intro.eyebrow);
  const title = sanitizeText(intro.title);
  const text = sanitizeText(intro.text);

  if (eyebrow) {
    const eyebrowEl = document.createElement("p");
    eyebrowEl.className = "gallery-intro__eyebrow";
    eyebrowEl.textContent = eyebrow;
    container.appendChild(eyebrowEl);
  }

  if (title) {
    const titleEl = document.createElement("h2");
    titleEl.className = "gallery-intro__title";
    titleEl.textContent = title;
    container.appendChild(titleEl);
  }

  if (text) {
    const textEl = document.createElement("p");
    textEl.className = "gallery-intro__text";
    textEl.textContent = text;
    container.appendChild(textEl);
  }

  return container;
}

function renderGallery(universe, container) {
  if (!universe || !container) return;

  container.replaceChildren();

  const intro = renderGalleryIntro(universe);
  container.appendChild(intro);

  const galleryItems = Array.isArray(universe.gallery) ? universe.gallery : DEFAULTS.gallery;

  if (!galleryItems.length) {
    const placeholder = document.createElement("div");
    placeholder.className = "gallery-placeholder";
    placeholder.textContent = "Aucun souvenir disponible pour le moment.";
    container.appendChild(placeholder);
    return;
  }

  galleryItems.forEach((item) => {
    const type = item && typeof item.type === "string" ? item.type : "text";
    const renderer = RENDERERS[type] || RENDERERS.text;
    const element = renderer(item);
    if (element) {
      container.appendChild(element);
    }
  });
}

export { renderGallery };
