import { useEffect, useRef, type CSSProperties, type RefObject } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const iconBase = `${import.meta.env.BASE_URL}media/membership-icons`;

export type AtmosphereIntensity = "base" | "strong" | "max";

type FloaterDepth = "far" | "mid" | "near";

/**
 * Viewport-fixed margin placements — a hovering field around the screen,
 * not document-% pins that vanish on long pages.
 * taste-skill-ignore: owner asked for floating icons as a soft space layer.
 */
const FLOATERS: readonly {
  file: string;
  top: string;
  left?: string;
  right?: string;
  size: string;
  depth: FloaterDepth;
  drift: string;
  delay: string;
  rotate: string;
}[] = [
  { file: "bag.png", top: "11%", left: "1.5%", size: "4.25rem", depth: "far", drift: "26s", delay: "0s", rotate: "-8deg" },
  { file: "club-strike.png", top: "9%", right: "2%", size: "3.6rem", depth: "far", drift: "28s", delay: "-12s", rotate: "-6deg" },
  { file: "grass.png", top: "78%", right: "1.5%", size: "3.4rem", depth: "far", drift: "24s", delay: "-7s", rotate: "2deg" },
  { file: "cart.png", top: "86%", left: "2%", size: "3.8rem", depth: "far", drift: "30s", delay: "-6s", rotate: "8deg" },
  { file: "swing.png", top: "28%", right: "1.25%", size: "4.5rem", depth: "mid", drift: "20s", delay: "-4s", rotate: "6deg" },
  { file: "flag.png", top: "58%", right: "2.25%", size: "4rem", depth: "mid", drift: "22s", delay: "-2s", rotate: "4deg" },
  { file: "putter.png", top: "44%", left: "1%", size: "3.8rem", depth: "mid", drift: "21s", delay: "-14s", rotate: "-12deg" },
  { file: "ball.png", top: "36%", left: "3.5%", size: "3rem", depth: "near", drift: "16s", delay: "-9s", rotate: "0deg" },
  { file: "crossed-clubs.png", top: "68%", left: "1.75%", size: "4.75rem", depth: "near", drift: "18s", delay: "-11s", rotate: "-4deg" },
];

const DEPTH_PARALLAX: Record<FloaterDepth, number> = {
  far: 0.22,
  mid: 0.55,
  near: 1,
};

/**
 * Decorative page atmosphere: floating golf glyphs + scroll-linked washes.
 * taste-skill-ignore: owner asked for floating icons and scroll-linked grounds;
 * kept behind content, non-interactive, opacity scaled by intensity so body ink stays ≥7:1.
 */
export function PageAtmosphere({
  scrollRoot,
  intensity = "base",
}: {
  /** Mobile phone-frame scroller; omit on desktop so window scroll drives progress. */
  scrollRoot?: RefObject<HTMLElement | null>;
  intensity?: AtmosphereIntensity;
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
      const progress = reduce ? 0 : readProgress();
      const host = layer.closest(".page-grid") ?? layer;
      if (host instanceof HTMLElement) {
        host.style.setProperty("--scroll-progress", progress.toFixed(4));
        host.style.setProperty("--scroll-x", `${(progress * 100).toFixed(2)}%`);
        host.style.setProperty("--scroll-y", `${(12 + progress * 70).toFixed(2)}%`);
      }
      if (root) {
        layer.style.setProperty("--frame-h", `${root.clientHeight}px`);
      }
      // Depth shift in the hovering field as you scroll.
      layer.style.setProperty(
        "--floater-shift",
        reduce || progress === 0 ? "0rem" : `${(progress * -3.25).toFixed(3)}rem`,
      );
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(paint);
    };

    paint();
    if (reduce) {
      if (root) layer.style.setProperty("--frame-h", `${root.clientHeight}px`);
      return;
    }
    const target: HTMLElement | Window = root ?? window;
    target.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      target.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [scrollRoot, reduce]);

  return (
    <div
      ref={layerRef}
      className={`page-atmosphere page-atmosphere--${intensity}${scrollRoot ? " page-atmosphere--framed" : ""}${reduce ? " page-atmosphere--still" : ""}`}
      aria-hidden="true"
      data-testid="page-atmosphere"
    >
      <div className="page-atmosphere__wash" />
      <ul className="page-atmosphere__floaters">
        {FLOATERS.map((item) => (
          <li
            key={item.file}
            className={`page-atmosphere__floater page-atmosphere__floater--${item.depth}`}
            data-depth={item.depth}
            style={
              {
                top: item.top,
                left: item.left,
                right: item.right,
                width: item.size,
                "--drift": item.drift,
                "--delay": item.delay,
                "--tilt": item.rotate,
                "--parallax": String(DEPTH_PARALLAX[item.depth]),
              } as CSSProperties
            }
          >
            <img
              src={`${iconBase}/${item.file}`}
              alt=""
              decoding="async"
              loading="eager"
              width={72}
              height={56}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
