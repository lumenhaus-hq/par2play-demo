import type { KeyboardEvent } from "react";

type Option<T extends string> = {
  value: T;
  label: string;
  price?: string;
};

/**
 * One track, two options. Arrow keys move the selection.
 * Dark tone sits on the scorecard sheet.
 */
export function JointToggle<T extends string>({
  value,
  options,
  onChange,
  label,
  tone = "dark",
}: {
  value: T;
  options: readonly [Option<T>, Option<T>];
  onChange: (value: T) => void;
  label: string;
  tone?: "dark" | "light";
}) {
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
    <div className={`joint-toggle joint-toggle--${tone}`} role="group" aria-label={label} data-price-options>
      {options.map((option, index) => {
        const pressed = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            className={`joint-toggle__option${tone === "dark" ? " aa-focus-ink" : " aa-focus"}${pressed ? " is-active" : ""}`}
            aria-pressed={pressed}
            aria-label={option.price ? `${option.label}, ${option.price}` : option.label}
            tabIndex={pressed ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            <span className="joint-toggle__label">{option.label}</span>
            {option.price ? <span className="joint-toggle__price">{option.price}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
