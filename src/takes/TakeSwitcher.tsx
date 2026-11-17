import { TAKES, type TakeId } from "../data/takes";
import { applyTake, storeTake, syncTakeParam } from "./applyTake";

export function TakeSwitcher({
  value,
  onChange,
}: {
  value: TakeId;
  onChange: (id: TakeId) => void;
}) {
  return (
    <div className="flex max-w-full flex-wrap items-center justify-center gap-2" role="group" aria-label="Homepage take">
      {TAKES.map((take) => {
        const on = take.id === value;
        return (
          <button
            key={take.id}
            type="button"
            className={`aa-focus min-h-11 rounded-full border-2 px-3 text-sm font-semibold transition-colors ${
              on
                ? "border-slate-950 bg-[#14d45e] text-slate-950"
                : "border-slate-300 bg-white text-slate-950 hover:border-slate-950"
            }`}
            aria-pressed={on}
            title={take.blurb}
            onClick={() => {
              applyTake(take.id);
              storeTake(take.id);
              syncTakeParam(take.id);
              onChange(take.id);
            }}
          >
            {take.label}
          </button>
        );
      })}
    </div>
  );
}
