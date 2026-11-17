import { DEMO_STYLES, type StyleId } from "../data/styles";
import { applyStyle, storeStyle, syncStyleParam } from "../style/applyStyle";

export function StyleSwitcher({
  value,
  onChange,
}: {
  value: StyleId;
  onChange: (id: StyleId) => void;
}) {
  return (
    <div
      className="flex max-w-full flex-wrap items-center justify-center gap-2"
      role="group"
      aria-label="Style variant"
    >
      {DEMO_STYLES.map((style) => {
        const on = style.id === value;
        return (
          <button
            key={style.id}
            type="button"
            className={`aa-focus min-h-11 rounded-full border-2 px-3 text-sm font-semibold transition-colors ${
              on
                ? "border-slate-950 bg-[#14d45e] text-slate-950"
                : "border-slate-300 bg-white text-slate-950 hover:border-slate-950"
            }`}
            aria-pressed={on}
            title={style.blurb}
            onClick={() => {
              applyStyle(style.id);
              storeStyle(style.id);
              syncStyleParam(style.id);
              onChange(style.id);
            }}
          >
            {style.label}
          </button>
        );
      })}
    </div>
  );
}
