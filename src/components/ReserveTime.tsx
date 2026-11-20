import { lazy, Suspense, useId, useState, type ReactNode } from "react";
import { PrimaryButton } from "./Cta";
import type { BookingOffer } from "../data/business";

const ReservePanel = lazy(() => import("./ReservePanel"));

function LoadingTimes() {
  return (
    <p className="reserve-panel__loading" role="status" aria-live="polite">
      <span className="reserve-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      Loading available times
    </p>
  );
}

/** Opens the GolfClock handoff under the invoice. Collapsed until the visitor asks. */
export function ReserveTime({ offer, beside }: { offer: BookingOffer; beside?: ReactNode }) {
  const panelId = useId();
  const [open, setOpen] = useState(false);

  return (
    <div className="reserve-time">
      <div className={beside ? "reserve-time__row" : undefined}>
        <PrimaryButton
          className="reserve-trigger"
          data-reserve-trigger
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          Reserve time & day
        </PrimaryButton>
        {beside}
      </div>
      {open ? (
        <div id={panelId}>
          <Suspense fallback={<LoadingTimes />}>
            <ReservePanel key={offer} offer={offer} />
          </Suspense>
        </div>
      ) : null}
    </div>
  );
}
