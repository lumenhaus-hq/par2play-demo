import { useEffect, useRef, type CSSProperties, type RefObject } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const iconBase = `${import.meta.env.BASE_URL}media/membership-icons`;

export type AtmosphereIntensity = "base" | "strong" | "max";

type FloaterDepth = "far" | "mid" | "near";

/**
 * Viewport-scattered field — glyphs across width + height (not edge gutters only).
 * taste-skill-ignore: owner asked for a hovering space layer over the whole page.
 */
const FLOATERS: readonly {
  file: string;
  top: string;
  left: string;
  size: string;
  depth: FloaterDepth;
  drift: string;
  delay: string;
  rotate: string;
}[] = [
  { file: "bag.png", top: "7%", left: "6%", size: "4.1rem", depth: "far", drift: "26s", delay: "0s", rotate: "-8deg" },
  { file: "club-strike.png", top: "10%", left: "78%", size: "3.5rem", depth: "far", drift: "28s", delay: "-12s", rotate: "-6deg" },
  { file: "swing.png", top: "24%", left: "46%", size: "4.4rem", depth: "mid", drift: "20s", delay: "-4s", rotate: "6deg" },
  { file: "ball.png", top: "34%", left: "22%", size: "2.9rem", depth: "near", drift: "16s", delay: "-9s", rotate: "0deg" },
  { file: "putter.png", top: "48%", left: "68%", size: "3.7rem", depth: "mid", drift: "21s", delay: "-14s", rotate: "-12deg" },
  { file: "flag.png", top: "52%", left: "8%", size: "3.9rem", depth: "mid", drift: "22s", delay: "-2s", rotate: "4deg" },
  { file: "crossed-clubs.png", top: "64%", left: "38%", size: "4.6rem", depth: "near", drift: "18s", delay: "-11s", rotate: "-4deg" },
  { file: "grass.png", top: "76%", left: "84%", size: "3.3rem", depth: "far", drift: "24s", delay: "-7s", rotate: "2deg" },
  { file: "cart.png", top: "84%", left: "18%", size: "3.8rem", depth: "far", drift: "30s", delay: "-6s", rotate: "8deg" },
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
