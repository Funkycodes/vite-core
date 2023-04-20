// This file set applies certain effects to make certain workarounds like the 100vw full width easier

export function resetViewportWidth() {
  const scrollBarWidth =
    window.innerWidth - document.documentElement.clientWidth;

  document.documentElement.style.setProperty(
    "--scrollbar-width",
    `${scrollBarWidth}px`
  );
}
