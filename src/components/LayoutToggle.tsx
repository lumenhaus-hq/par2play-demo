import { Monitor, Smartphone } from "lucide-react";
import { buttonFocus } from "./Cta";
import { useFlow } from "../state/flow";

/**
 * Demo chrome: swap the phone-frame preview vs full desktop layout.
 * Lives in the site toolbar (icon only) instead of a sticky tab bar.
 */
export function LayoutToggle({ className = "" }: { className?: string }) {
  const flow = useFlow();
  const mobile = flow.layout === "mobile";
  const label = mobile ? "Show desktop layout" : "Show mobile layout";

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={mobile}
      data-layout-toggle=""
      onClick={() => flow.setLayout(mobile ? "web" : "mobile")}
      className={`inline-flex size-11 items-center justify-center rounded-full ${buttonFocus} ${className}`}
    >
      {mobile ? <Monitor className="size-[1.125rem]" aria-hidden="true" /> : <Smartphone className="size-[1.125rem]" aria-hidden="true" />}
    </button>
  );
}
