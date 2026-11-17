import { useEffect, useRef, type CSSProperties, type RefObject } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const iconBase = `${import.meta.env.BASE_URL}media/membership-icons`;

/** Sparse margin placements — stay out of the main reading column. */
const FLOATERS: readonly {
  file: string;
  top: string;
  left?: string;
  right?: string;
  size: string;
  drift: string;
  delay: string;
  rotate: string;
}[] = [
  { file: "bag.png", top: "12%", left: "3%", size: "4.5rem", drift: "18s", delay: "0s", rotate: "-8deg" },
  { file: "swing.png", top: "28%", right: "4%", size: "3.8rem", drift: "22s", delay: "-4s", rotate: "6deg" },
  { file: "ball.png", top: "48%", left: "6%", size: "2.6rem", drift: "16s", delay: "-9s", rotate: "0deg" },
  { file: "flag.png", top: "62%", right: "5%", size: "3.4rem", drift: "20s", delay: "-2s", rotate: "4deg" },
  { file: "crossed-clubs.png", top: "78%", left: "4%", size: "4rem", drift: "24s", delay: "-11s", rotate: "-4deg" },
  { file: "cart.png", top: "88%", right: "7%", size: "3.6rem", drift: "19s", delay: "-6s", rotate: "8deg" },
  { file: "putter.png", top: "38%", left: "2%", size: "3rem", drift: "21s", delay: "-14s", rotate: "-12deg" },
  { file: "grass.png", top: "70%", right: "2%", size: "3.2rem", drift: "17s", delay: "-7s", rotate: "2deg" },
];

/**
 * Decorative index atmosphere: floating golf glyphs + scroll-linked washes.
 * taste-skill-ignore: owner asked for floating icons and scroll-linked grounds;
 * kept behind content, non-interactive, low opacity so body ink stays ≥7:1.
 */
export function PageAtmosphere({
  scrollRoot,
}: {
  /** Mobile phone-frame scroller; omit on desktop so window scroll drives progress. */
  scrollRoot?: RefObject<HTMLElement | null>;
}) {
  const reduce = usePrefersReducedMotion();
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const root = scrollRoot?.current ?? null;
    const readProgress = () => {
      if (root) {
        const max = Math.max(1, root.scrollHeight - root.clientHeight);
        return Math.min(1, Math.max(0, root.scrollTop / max));
      }
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      return Math.min(1, Math.max(0, window.scrollY / max));
    };

    let frame = 0;
    const paint = () => {
      frame = 0;
      const progress = readProgress();
      const host = layer.closest(".page-grid") ?? layer;
      if (host instanceof HTMLElement) {
        host.style.setProperty("--scroll-progress", progress.toFixed(4));
        host.style.setProperty("--scroll-x", `${(progress * 100).toFixed(2)}%`);
        host.style.setProperty("--scroll-y", `${(12 + progress * 70).toFixed(2)}%`);
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(paint);
    };

    paint();
    const target: HTMLElement | Window = root ?? window;
    target.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      target.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [scrollRoot]);

  return (
    <div
      ref={layerRef}
      className={`page-atmosphere${reduce ? " page-atmosphere--still" : ""}`}
      aria-hidden="true"
    >
      <div className="page-atmosphere__wash" />
      <ul className="page-atmosphere__floaters">
        {FLOATERS.map((item) => (
          <li
            key={item.file}
            className="page-atmosphere__floater"
            style={
              {
                top: item.top,
                left: item.left,
                right: item.right,
                width: item.size,
                "--drift": item.drift,
                "--delay": item.delay,
                "--tilt": item.rotate,
              } as CSSProperties
            }
          >
            <img src={`${iconBase}/${item.file}`} alt="" decoding="async" loading="lazy" width={72} height={56} />
          </li>
        ))}
      </ul>
    </div>
  );
}
