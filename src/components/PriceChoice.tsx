export type PriceOption<T extends string> = {
  value: T;
  label: string;
  price: string;
};

/** Equal-width purchase options. Stacked until the container is wide enough to sit side by side. */
export function PriceChoice<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: readonly PriceOption<T>[];
  onChange: (value: T) => void;
  label: string;
}) {
  const columns = options.length > 1 ? "grid-cols-1 @lg:grid-cols-2" : "grid-cols-1";
  return (
    <div className="@container min-w-0" data-price-options>
      <div role="group" aria-label={label} className={`grid min-w-0 gap-3 ${columns}`}>
        {options.map((option) => {
          const pressed = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={pressed}
              aria-label={`${option.label}, ${option.price}`}
              onClick={() => onChange(option.value)}
              className={`aa-focus-ink flex min-h-12 w-full min-w-0 flex-col items-start justify-center gap-1 rounded-2xl border-2 px-4 py-3 text-left ${
                pressed ? "border-white bg-white text-ink" : "border-white/35 bg-white/5 text-white"
              }`}
            >
              <span className="text-base font-semibold leading-snug">{option.label}</span>
              <span className="font-display text-2xl font-semibold leading-none tabular-nums">{option.price}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
