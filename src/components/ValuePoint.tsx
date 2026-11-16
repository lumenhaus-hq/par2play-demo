import type { LucideIcon } from "lucide-react";

export function ValuePoint({
  icon: Icon,
  label,
  line,
}: {
  icon: LucideIcon;
  label: string;
  line: string;
}) {
  return (
    <div className="flex gap-3">
      <Icon aria-hidden="true" strokeWidth={1.5} className="mt-0.5 size-6 shrink-0 text-ink" />
      <div>
        <p className="text-base font-semibold">{label}</p>
        <p className="text-base leading-snug">{line}</p>
      </div>
    </div>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <p>
      <span className="block font-display text-4xl font-semibold leading-none">{value}</span>
      <span className="mt-1 block text-base">{label}</span>
    </p>
  );
}
