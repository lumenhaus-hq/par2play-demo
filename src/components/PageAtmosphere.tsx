import { useEffect, useRef, type CSSProperties, type RefObject } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { prefersNativeScroll } from "../motion/nativeScroll";

const iconBase = `${import.meta.env.BASE_URL}media/membership-icons`;

export type AtmosphereIntensity = "base" | "strong" | "max";

type FloaterDepth = "far" | "mid" | "near";

/** Viewport-scattered field (~25% denser than the original 9). taste-skill-ignore */
const FLOATERS: readonly {
  file: string;
  top: string;
  left: string;
  size: string;
  depth: FloaterDepth;
  drift: string;
  delay: string;
  rotate: string;
  spin: string;
}[] = [
  { file: "bag.png", top: "7%", left: "6%", size: "4.8rem", depth: "far", drift: "26s", delay: "0s", rotate: "-8deg", spin: "1" },
  { file: "club-strike.png", top: "10%", left: "78%", size: "4.2rem", depth: "far", drift: "28s", delay: "-12s", rotate: "-6deg", spin: "-0.8" },
  { file: "swing.png", top: "24%", left: "46%", size: "5.1rem", depth: "mid", drift: "20s", delay: "-4s", rotate: "6deg", spin: "1.2" },
  { file: "ball.png", top: "34%", left: "22%", size: "3.6rem", depth: "near", drift: "16s", delay: "-9s", rotate: "0deg", spin: "1.6" },
  { file: "putter.png", top: "48%", left: "68%", size: "4.4rem", depth: "mid", drift: "21s", delay: "-14s", rotate: "-12deg", spin: "-1.1" },
  { file: "flag.png", top: "52%", left: "8%", size: "4.6rem", depth: "mid", drift: "22s", delay: "-2s", rotate: "4deg", spin: "0.9" },
  { file: "crossed-clubs.png", top: "64%", left: "38%", size: "5.3rem", depth: "near", drift: "18s", delay: "-11s", rotate: "-4deg", spin: "-1.4" },
  { file: "grass.png", top: "76%", left: "84%", size: "4rem", depth: "far", drift: "24s", delay: "-7s", rotate: "2deg", spin: "0.7" },
  { file: "cart.png", top: "84%", left: "18%", size: "4.5rem", depth: "far", drift: "30s", delay: "-6s", rotate: "8deg", spin: "-0.6" },
  { file: "ball.png", top: "18%", left: "62%", size: "3.3rem", depth: "mid", drift: "19s", delay: "-15s", rotate: "10deg", spin: "1.3" },
  { file: "flag.png", top: "40%", left: "90%", size: "3.9rem", depth: "far", drift: "25s", delay: "-3s", rotate: "-10deg", spin: "-0.9" },
  { file: "club-strike.png", top: "70%", left: "52%", size: "4.1rem", depth: "near", drift: "17s", delay: "-8s", rotate: "14deg", spin: "1.5" },
];

const DEPTH_PARALLAX: Record<FloaterDepth, number> = {
  far: 0.22,
  mid: 0.55,
  near: 1,
};

/** Floating golf glyphs + scroll-linked washes. taste-skill-ignore */
export function PageAtmosphere({
  scrollRoot,
  intensity = "base",
}: {
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
      // Idle drift on the glyph is enough. Scroll-linked shift/spin restyles
      // every multi-shadow mask on each wheel tick and fights Lenis on desktop.
      layer.style.setProperty("--floater-shift", "0rem");
      layer.style.setProperty("--floater-spin", "0deg");
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(paint);
    };

    paint();
    // Phones / coarse pointers skip scroll listeners entirely. Desktop only
    // refreshes the wash after the wheel settles (see is-scrolling gate).
    const quiet = reduce || prefersNativeScroll() || window.matchMedia("(max-width: 767px)").matches;
    if (quiet) {
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
      style={{ overflow: "hidden" }}
      aria-hidden="true"
      data-testid="page-atmosphere"
    >
      <div className="page-atmosphere__wash" />
      <ul className="page-atmosphere__floaters">
        {FLOATERS.map((item, index) => (
          <li
            key={`${item.file}-${item.top}-${item.left}-${index}`}
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
                "--spin": item.spin,
                "--parallax": String(DEPTH_PARALLAX[item.depth]),
              } as CSSProperties
            }
          >
            <span
              className="page-atmosphere__glyph"
              style={
                {
                  "--glyph-url": `url("${iconBase}/${item.file}")`,
                } as CSSProperties
              }
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
