const SOUND_FILES = {
  ambient: "assets/audio/birthday-ambient.mp3",
  envelope: "assets/audio/envelope-opened.m4a",
  success: "assets/audio/success-chime.mp3"
};

let ambientAudio = null;
let muted = false;

function canPlayAudio() {
  return typeof window !== "undefined" && typeof window.Audio !== "undefined";
}

function createAudio(src, { loop = false, volume = 0.5 } = {}) {
  const audio = new Audio(src);
  audio.preload = "auto";
  audio.loop = loop;
  audio.volume = volume;
  audio.muted = false;
  return audio;
}

function ensureAmbientAudio() {
  if (!canPlayAudio()) return null;
  if (!ambientAudio) {
    ambientAudio = createAudio(SOUND_FILES.ambient, { loop: true, volume: 0.35 });
  }
  return ambientAudio;
}

function setMuted(value) {
  muted = Boolean(value);
  if (ambientAudio) {
    ambientAudio.muted = muted;
  }
  return muted;
}

function toggleMute() {
  return setMuted(!muted);
}

function startAmbientAudio() {
  if (!canPlayAudio()) return false;
  const audio = ensureAmbientAudio();
  if (!audio || muted) return false;

  audio.muted = false;
  audio.play().catch(() => {
    // An autoplay restriction is normal on mobile; the experience remains usable.
  });

  return true;
}

function pauseAmbientAudio() {
  if (ambientAudio) {
    ambientAudio.pause();
  }
}

function resumeAmbientAudio() {
  if (!canPlayAudio() || muted) return false;
  const audio = ensureAmbientAudio();
  if (!audio) return false;

  audio.muted = false;
  audio.play().catch(() => {
    // Audio is optional, do not block the experience.
  });

  return true;
}

function stopAmbientAudio() {
  if (ambientAudio) {
    ambientAudio.pause();
    ambientAudio.currentTime = 0;
  }
}

function playSoundOnce(src, volume = 0.75) {
  if (!canPlayAudio() || muted) return false;

  const audio = new Audio(src);
  audio.preload = "auto";
  audio.volume = volume;

  const cleanup = () => {
    audio.removeEventListener("ended", cleanup);
    audio.removeEventListener("error", cleanup);
  };

  audio.addEventListener("ended", cleanup, { once: true });
  audio.addEventListener("error", cleanup, { once: true });
  audio.play().catch(() => {
    cleanup();
    // Audio is optional, do not block the experience.
  });

  return true;
}

function playEnvelopeSound() {
  return playSoundOnce(SOUND_FILES.envelope, 0.7);
}

function playSuccessChime() {
  return playSoundOnce(SOUND_FILES.success, 0.8);
}

export {
  startAmbientAudio,
  pauseAmbientAudio,
  resumeAmbientAudio,
  stopAmbientAudio,
  playEnvelopeSound,
  playSuccessChime,
  setMuted,
  toggleMute
};
