import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { runLandingBoot } from "../motion/landingBoot";

const RADIUS = 10;
const TURN = 2 * Math.PI * RADIUS;

/**
 * Full-viewport plain loader. Covers the home experience until hero film,
 * membership still, and fonts are warm — then unmounts in one shot.
 */
export function LandingBoot({ onReady }: { onReady?: () => void } = {}) {
  const [booting, setBooting] = useState(true);

  // Layout effect so the plate covers the first paint — no flash of unfinished home.
  useLayoutEffect(() => {
    let cancel = false;
    let dispose = () => {};
    void runLandingBoot().then((stop) => {
      dispose = stop;
      if (cancel) return;
      setBooting(false);
      onReady?.();
    });
    return () => {
      cancel = true;
      dispose();
    };
  }, [onReady]);

  if (!booting || typeof document === "undefined") return null;

  return createPortal(
    <div className="landing-boot" data-testid="landing-boot" role="status" aria-live="polite" aria-busy="true">
      <svg className="landing-boot__ring" viewBox="0 0 28 28" focusable="false" aria-hidden="true">
        <circle className="landing-boot__track" cx="14" cy="14" r={RADIUS} />
        <circle
          className="landing-boot__value"
          cx="14"
          cy="14"
          r={RADIUS}
          strokeDasharray={`${TURN} ${TURN}`}
          strokeDashoffset={TURN * 0.72}
        />
      </svg>
      <span className="sr-only">Loading Par2Play</span>
    </div>,
    document.body,
  );
}
