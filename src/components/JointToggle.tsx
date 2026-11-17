type Option<T extends string> = {
  value: T;
  label: string;
};

/**
 * Single segmented control: one track, two options, one active pill.
 * Use on dark pricing heroes (`tone="dark"`) or light membership checkout (`tone="light"`).
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
  return (
    <div className={`joint-toggle joint-toggle--${tone}`} role="group" aria-label={label}>
      {options.map((option) => {
        const pressed = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            className={`joint-toggle__option${tone === "dark" ? " aa-focus-ink" : " aa-focus"}${pressed ? " is-active" : ""}`}
            aria-pressed={pressed}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
