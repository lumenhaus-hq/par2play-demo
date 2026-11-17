import { HERO_TYPES, type HeroTypeId } from "../data/heroType";

export function HeroTypeSwitcher({
  value,
  onChange,
}: {
  value: HeroTypeId;
  onChange: (id: HeroTypeId) => void;
}) {
  return (
    <div
      className="flex max-w-full flex-wrap items-center justify-center gap-2"
      role="group"
      aria-label="Hero typography"
    >
      {HERO_TYPES.map((item) => {
        const on = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            className={`aa-focus min-h-11 rounded-full border-2 px-3 text-sm font-semibold transition-colors ${
              on
                ? "border-slate-950 bg-[#14d45e] text-slate-950"
                : "border-slate-300 bg-white text-slate-950 hover:border-slate-950"
            }`}
            aria-pressed={on}
            title={item.blurb}
            onClick={() => onChange(item.id)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
