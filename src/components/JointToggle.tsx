import { useId, type KeyboardEvent } from "react";

type Option<T extends string> = {
  value: T;
  label: string;
  price?: string;
  /** Short callout. Included as the button's accessible description. */
  note?: string;
};

function Spark() {
  return (
    <svg className="joint-toggle__spark" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M8 .7 9.15 6.05 14.7 8 9.15 9.95 8 15.3 6.85 9.95 1.3 8 6.85 6.05Z" />
    </svg>
  );
}

export function JointToggle<T extends string>({
  value,
  options,
  onChange,
  label,
  tone = "dark",
}: {
  value: T;
  options: readonly Option<T>[];
  onChange: (value: T) => void;
  label: string;
  tone?: "dark" | "light";
}) {
  const baseId = useId();
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
    const backward = event.key === "ArrowLeft" || event.key === "ArrowUp";
    if (!forward && !backward && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const last = options.length - 1;
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? last
          : forward
            ? (index + 1) % options.length
            : (index - 1 + options.length) % options.length;
    const next = options[nextIndex];
    if (!next) return;
    onChange(next.value);
    const buttons = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("button");
    buttons?.[nextIndex]?.focus();
  };

  return (
    <div
      className={`joint-toggle joint-toggle--${tone}`}
      role="group"
      aria-label={label}
      data-price-options
      data-count={options.length}
    >
      {options.map((option, index) => {
        const pressed = option.value === value;
        const noteId = option.note ? `${baseId}-${option.value}` : undefined;
        return (
          <button
            key={option.value}
            type="button"
            className={`joint-toggle__option${tone === "dark" ? " aa-focus-ink" : " aa-focus"}${pressed ? " is-active" : ""}${option.note ? " has-note" : ""}`}
            aria-pressed={pressed}
            aria-label={option.price ? `${option.label}, ${option.price}` : option.label}
            aria-describedby={noteId}
            tabIndex={pressed ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {option.note ? (
              <span id={noteId} className="joint-toggle__badge">
                <Spark />
                {option.note}
              </span>
            ) : null}
            <span className="joint-toggle__label">{option.label}</span>
            {option.price ? <span className="joint-toggle__price">{option.price}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
