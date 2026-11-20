export type InvoiceRow = {
  label: string;
  value: string;
};

/**
 * Itemised price summary. Lives in the pricing section and announces
 * selection changes through a polite live region.
 */
export function PriceInvoice({
  title,
  rows,
  totalLabel,
  orderRef,
  live,
  note,
  className = "",
}: {
  title: string;
  rows: readonly InvoiceRow[];
  totalLabel: string;
  orderRef?: string;
  live: string;
  note?: string;
  className?: string;
}) {
  return (
    <div
      data-invoice
      aria-live="polite"
      aria-atomic="true"
      className={`min-w-0 rounded-2xl border border-white/15 bg-white/5 px-4 py-4 @3xl:px-5 ${className}`}
    >
      <p className="sr-only">{live}</p>
      <p className="text-lg font-bold text-white">{title}</p>
      <div className="mt-3 divide-y divide-white/15">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-3 py-2 text-base">
            <span className="shrink-0 text-white/70">{row.label}</span>
            <span className="min-w-0 text-right font-semibold text-white">{row.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3 border-t border-white/20 pt-3">
        <span className="text-base font-bold text-white">Total</span>
        <p
          data-invoice-total
          className="max-w-full font-display text-4xl font-semibold leading-none tracking-tight text-white tabular-nums @3xl:text-5xl"
        >
          {totalLabel}
        </p>
      </div>
      {note ? <p className="mt-3 text-base font-semibold text-white/85">{note}</p> : null}
      {orderRef ? <p className="mt-3 break-all text-right font-mono text-xs text-white/75">{orderRef}</p> : null}
    </div>
  );
}
