export function onReady(doThis: () => void) {
  //todo replace with utility function
  document.readyState === "complete" || document.readyState === "interactive"
    ? doThis()
    : document.addEventListener("DOMContentLoaded", () => {
        doThis();
      });
}
