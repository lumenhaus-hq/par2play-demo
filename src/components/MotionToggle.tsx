import { buttonFocus } from "./Cta";
import { useMotionControl } from "../hooks/usePrefersReducedMotion";

export function MotionToggle({ className = "" }: { className?: string }) {
  const motion = useMotionControl();
  if (!motion.canToggle) return null;

  return (
    <button
      type="button"
      className={`inline-flex min-h-11 items-center text-base font-semibold underline decoration-2 underline-offset-4 ${buttonFocus} ${className}`}
      aria-pressed={motion.userPaused}
      onClick={motion.toggle}
    >
      {motion.userPaused ? "Play motion" : "Pause motion"}
    </button>
  );
}
