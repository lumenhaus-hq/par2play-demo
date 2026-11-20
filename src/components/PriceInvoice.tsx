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
  const figureClass = was
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
              {index + 1}
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
          ) : (
            totalLabel
          )}
        </p>
      </div>
      {note ? <p className="scorecard__note">{note}</p> : null}
    </div>
  );
}
