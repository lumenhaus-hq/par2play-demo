import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { useFinePointer } from "./useFinePointer";

type CursorKind = "crosshair" | "blob" | "trail";

/**
 * Demo cursor for takes. Fine pointer + motion only.
 * crosshair → Orbit, blob → Ledger, trail → Strike.
 */
export function TakeCursor({ kind }: { kind: CursorKind }) {
  const root = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const fine = useFinePointer();

  useEffect(() => {
    if (!fine || reduce) return;
    const el = root.current;
    if (!el) return;
    document.documentElement.classList.add("take-cursor-on");
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let x = mx;
    let y = my;
    let hover = false;
    let raf = 0;

    const onMove = (event: MouseEvent) => {
      mx = event.clientX;
      my = event.clientY;
    };
    const onOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      hover = Boolean(target?.closest("a, button, [data-magnetic], [data-cursor-grow]"));
      el.dataset.hover = hover ? "1" : "0";
    };

    const tick = () => {
      const ease = kind === "trail" ? 0.18 : kind === "blob" ? 0.12 : 0.22;
      x += (mx - x) * ease;
      y += (my - y) * ease;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (kind === "trail") {
        const dx = mx - x;
        const dy = my - y;
        const dist = Math.min(48, Math.hypot(dx, dy));
        el.style.setProperty("--trail", `${dist}px`);
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.classList.remove("take-cursor-on");
    };
  }, [fine, reduce, kind]);

  if (!fine || reduce) return null;

  return (
    <div ref={root} className={`take-cursor take-cursor--${kind}`} aria-hidden="true">
      <span className="take-cursor__core" />
      {kind === "trail" ? <span className="take-cursor__wake" /> : null}
      {kind === "crosshair" ? (
        <>
          <span className="take-cursor__arm take-cursor__arm--h" />
          <span className="take-cursor__arm take-cursor__arm--v" />
        </>
      ) : null}
    </div>
  );
}
