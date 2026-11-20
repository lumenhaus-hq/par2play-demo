function InvoiceIcon({ index }: { index: number }) {
  const kind = index % 3;
  if (kind === 0) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M6 20V4h11l-2.2 3.5L17 11H6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === 1) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 8.2V12l2.4 1.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 3.2 13.7 9 19.6 12 13.7 15 12 20.8 10.3 15 4.4 12 10.3 9Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export type InvoiceRow = {
  label: string;
  value: string;
};

export function PriceInvoice({
  title,
  rows,
  totalLabel,
  totalCaption = "You pay",
  membersPrice,
  live,
  note,
  was,
  className = "",
}: {
  title: string;
  rows: readonly InvoiceRow[];
  totalLabel: string;
  totalCaption?: string;
  membersPrice?: number;
  live: string;
  note?: string;
  /** Struck-through comparison. Omit when there is no confirmed number. */
  was?: string;
  className?: string;
}) {
  const freeOffer = totalLabel === "FREE";
  const figureClass = was || freeOffer
    ? "scorecard__figure scorecard__figure--coupon"
    : `scorecard__figure${totalLabel.startsWith("$") ? "" : " scorecard__figure--words"}`;
  return (
    <div data-invoice aria-live="polite" aria-atomic="true" className={`scorecard ${className}`}>
      <p className="sr-only">{live}</p>
      <p className="scorecard__title">{title}</p>
      <div className="scorecard__rows">
        {rows.map((row, index) => (
          <div key={row.label} className="scorecard__row">
            <span className="scorecard__hole" aria-hidden="true">
              <InvoiceIcon index={index} />
            </span>
            <span className="scorecard__label">{row.label}</span>
            <span className="scorecard__value">{row.value}</span>
          </div>
        ))}
      </div>
      <div className="scorecard__total">
        <span className="scorecard__total-label">{totalCaption}</span>
        <p key={totalLabel} data-invoice-total data-members-price={membersPrice} className={figureClass}>
          {was ? (
            <>
              <s className="scorecard__was">{was}</s>
              <span className="scorecard__free">{totalLabel}</span>
            </>
          ) : freeOffer ? (
            <span className="scorecard__free">{totalLabel}</span>
          ) : (
            totalLabel
          )}
        </p>
      </div>
      {note ? <p className="scorecard__note">{note}</p> : null}
    </div>
  );
}
