/**
 * Marks `html.is-scrolling` while the page (or a framed scroller) is moving.
 * Lets CSS pause marquees, filtered atmosphere glyphs, and backdrop blurs for
 * the wheel/swipe, then resume once inertia settles.
 */
export function bindScrollIdle(root?: HTMLElement | null, settleMs = 160): () => void {
  const html = document.documentElement;
  let timer = 0;

  const onScroll = () => {
    html.classList.add("is-scrolling");
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      html.classList.remove("is-scrolling");
    }, settleMs);
  };

  const target: HTMLElement | Window = root ?? window;
  // Lenis drives window scroll on desktop; also listen for wheel so the first
  // notch yields paint before Lenis applies the scroll position.
  target.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("wheel", onScroll, { passive: true });
  return () => {
    target.removeEventListener("scroll", onScroll);
    window.removeEventListener("wheel", onScroll);
    window.clearTimeout(timer);
    html.classList.remove("is-scrolling");
  };
}
