// Petit module de navigation partagé par les vues (évite les imports circulaires).

let renderer = null;

export function setRenderer(fn) { renderer = fn; }

// Redessine la page actuelle en gardant la position de défilement.
export function refresh() {
  const y = window.scrollY;
  renderer?.();
  window.scrollTo(0, y);
}

export function go(hash) {
  if (location.hash === hash) refresh();
  else location.hash = hash;
}
