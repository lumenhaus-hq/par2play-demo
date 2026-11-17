import { Banknote, CalendarDays, Clock3, Layers3 } from "lucide-react";

export type PriceFact = {
  label: string;
  value: string;
  icon: "price" | "calendar" | "clock" | "sessions";
};

const icons = { price: Banknote, calendar: CalendarDays, clock: Clock3, sessions: Layers3 };

/** Numeric pricing and time facts, without benefit or outcome claims. */
export function PriceFacts({ items, dark = false, className = "" }: { items: readonly PriceFact[]; dark?: boolean; className?: string }) {
  return (
    <dl className={`grid grid-cols-2 gap-3 ${className}`}>
      {items.map(({ label, value, icon }) => {
        const Icon = icons[icon];
        return (
          <div key={label} className={`min-w-0 rounded-2xl border p-3 ${dark ? "border-white/10 bg-white/5" : "border-ink/10 bg-[#F2F5F1]"}`}>
            <dt className={`flex items-center gap-2 text-xs font-semibold leading-snug ${dark ? "text-[#C5D2C9]" : "text-[#4B5563]"}`}>
              <Icon aria-hidden="true" className={`size-4 shrink-0 ${dark ? "text-mint" : "text-[#17743B]"}`} strokeWidth={1.7} />
              {label}
            </dt>
            <dd className={`mt-3 font-display text-2xl font-semibold leading-tight tracking-tight tabular-nums ${dark ? "text-white" : "text-ink"}`}>{value}</dd>
          </div>
        );
      })}
    </dl>
  );
}
