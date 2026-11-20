import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import type { BookingOffer } from "../data/business";
import {
  addDays,
  dayChip,
  formatClock,
  handoffUrl,
  reservePlan,
  slotStarts,
  todayIso,
  type DurationChoice,
} from "../data/reserveCheckout";

const LOAD_MS = 750;

function motionReduced(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.documentElement.classList.contains("motion-paused")
  );
}

function Dots() {
  return (
    <span className="reserve-dots" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

export default function ReservePanel({ offer }: { offer: BookingOffer }) {
  const plan = reservePlan(offer);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [ready, setReady] = useState(motionReduced);
  const [date, setDate] = useState(() => todayIso());
  const [duration, setDuration] = useState<DurationChoice>(
    plan.kind === "slots" ? plan.durations[0]! : { id: "", label: "", minutes: 0 },
  );
  const [party, setParty] = useState(1);
  const [start, setStart] = useState<number | null>(null);
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const baseId = useId();
  const today = todayIso();
  const chips = [0, 1, 2, 3, 4].map((offset) => addDays(today, offset));

  useEffect(() => {
    headingRef.current?.focus();
  }, [ready]);

  useEffect(() => {
    if (motionReduced()) return;
    const timer = window.setTimeout(() => setReady(true), LOAD_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const namesReady = first.trim().length > 0 && last.trim().length > 0;
  const choiceReady = plan.kind === "start" ? date >= today : start != null && date >= today;
  const complete = namesReady && choiceReady;
  const href = complete
    ? handoffUrl(offer, { date, startMinutes: start ?? undefined, duration: plan.kind === "slots" ? duration : undefined })
    : undefined;
  const starts = plan.kind === "slots" ? slotStarts(plan.step, duration.minutes) : [];

  const onDateKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
    const backward = event.key === "ArrowLeft" || event.key === "ArrowUp";
    if (!forward && !backward) return;
    event.preventDefault();
    const nextIndex = (index + (forward ? 1 : chips.length - 1)) % chips.length;
    const next = chips[nextIndex];
    if (!next) return;
    setDate(next);
    const buttons = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("button");
    buttons?.[nextIndex]?.focus();
  };

  return (
    <div className="reserve-panel" data-reserve-panel>
      <h3 ref={headingRef} tabIndex={-1} className="reserve-panel__title">
        Reserve time & day
      </h3>
      {ready ? null : (
        <p className="reserve-panel__loading" role="status" aria-live="polite">
          <Dots />
          Loading available times
        </p>
      )}
      {ready ? (
        <div className="reserve-panel__form">
          {plan.kind === "slots" ? (
            <>
              <div className="reserve-dates" role="radiogroup" aria-label="Choose a date">
                {chips.map((iso, index) => {
                  const chip = dayChip(iso);
                  const selected = iso === date;
                  return (
                    <button
                      key={iso}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      className={`reserve-dates__day${selected ? " is-selected" : ""}`}
                      tabIndex={selected ? 0 : -1}
                      onClick={() => setDate(iso)}
                      onKeyDown={(event) => onDateKey(event, index)}
                    >
                      <span>{chip.weekday}</span>
                      <strong>{chip.day}</strong>
                    </button>
                  );
                })}
              </div>
              <label className="reserve-field" htmlFor={`${baseId}-date`}>
                Choose a date
                <input
                  id={`${baseId}-date`}
                  type="date"
                  min={today}
                  value={date}
                  onChange={(event) => {
                    setDate(event.target.value);
                    setStart(null);
                  }}
                />
              </label>
              {plan.durations.length > 1 ? (
                <label className="reserve-field" htmlFor={`${baseId}-duration`}>
                  Duration
                  <select
                    id={`${baseId}-duration`}
                    value={duration.id}
                    onChange={(event) => {
                      const next = plan.durations.find((item) => item.id === event.target.value) ?? plan.durations[0]!;
                      setDuration(next);
                      setStart(null);
                    }}
                  >
                    {plan.durations.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <p className="reserve-fixed">
                  Duration <strong>{duration.label}</strong>
                </p>
              )}
              <label className="reserve-field" htmlFor={`${baseId}-party`}>
                Party size
                <select id={`${baseId}-party`} value={party} onChange={(event) => setParty(Number(event.target.value))}>
                  {Array.from({ length: plan.partyMax }, (_, index) => index + 1).map((count) => (
                    <option key={count} value={count}>
                      {count} {count === 1 ? "player" : "players"}
                    </option>
                  ))}
                </select>
              </label>
              <div className="reserve-slots" role="radiogroup" aria-label="Select a time slot">
                {starts.map((minute) => {
                  const selected = start === minute;
                  return (
                    <button
                      key={minute}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      className={`reserve-slots__time${selected ? " is-selected" : ""}`}
                      onClick={() => setStart(minute)}
                    >
                      {formatClock(minute)}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <label className="reserve-field" htmlFor={`${baseId}-start`}>
              Start date
              <input
                id={`${baseId}-start`}
                type="date"
                min={today}
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </label>
          )}
          <p className="reserve-note">{plan.note}</p>
          <label className="reserve-field" htmlFor={`${baseId}-first`}>
            First name
            <input
              id={`${baseId}-first`}
              name="given-name"
              autoComplete="given-name"
              value={first}
              onChange={(event) => setFirst(event.target.value)}
            />
          </label>
          <label className="reserve-field" htmlFor={`${baseId}-last`}>
            Last name
            <input
              id={`${baseId}-last`}
              name="family-name"
              autoComplete="family-name"
              value={last}
              onChange={(event) => setLast(event.target.value)}
            />
          </label>
          {complete && href ? (
            <a className="cta-shell cta-brand aa-focus reserve-purchase" href={href} data-offer={offer}>
              <span className="cta-fill" aria-hidden="true" />
              <span className="cta-label">Complete Purchase</span>
            </a>
          ) : (
            <button type="button" className="cta-shell cta-brand aa-focus reserve-purchase" disabled>
              <span className="cta-label">Complete Purchase</span>
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}
