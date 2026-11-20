export type InvoiceRow = {
  label: string;
  value: string;
};

export function PriceInvoice({
  title,
  rows,
  totalLabel,
  totalCaption = "On the card",
  membersPrice,
  live,
  note,
  className = "",
}: {
  title: string;
  rows: readonly InvoiceRow[];
  totalLabel: string;
  totalCaption?: string;
  membersPrice?: number;
  live: string;
  note?: string;
  className?: string;
}) {
  return (
    <div data-invoice aria-live="polite" aria-atomic="true" className={`scorecard ${className}`}>
      <p className="sr-only">{live}</p>
      <p className="scorecard__kicker">Scorecard</p>
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
        <p key={totalLabel} data-invoice-total data-members-price={membersPrice} className="scorecard__figure">
          {totalLabel}
        </p>
      </div>
      {note ? <p className="scorecard__note">{note}</p> : null}
    </div>
  );
}
