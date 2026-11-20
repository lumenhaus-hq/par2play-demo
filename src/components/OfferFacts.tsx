const ICONS = [Flag, Clock, Spark] as const;

export function OfferFacts({
  heading,
  items,
}: {
  heading: string;
  items: readonly { q: string; a: string }[];
}) {
  const headingId = "offer-facts-heading";
  return (
    <section className="offer-facts" aria-labelledby={headingId}>
      <h2 id={headingId} className="offer-facts__heading">
        {heading}
      </h2>
      <ol className="offer-facts__list">
        {items.map((item, index) => {
          const Icon = ICONS[index % ICONS.length] ?? Flag;
          return (
            <li key={item.q} className="offer-facts__item">
              <span className="offer-facts__mark" aria-hidden="true">
                <Icon />
                <strong>{index + 1}</strong>
              </span>
              <div className="min-w-0">
                <h3 className="offer-facts__title">{item.q}</h3>
                <p className="offer-facts__line">{item.a}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Flag() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6 21V4m0 0h11l-2.2 3.4L17 11H6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function Clock() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="7.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 8.5V12l2.6 1.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function Spark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 3.5 13.6 9.2 19.5 12 13.6 14.8 12 20.5 10.4 14.8 4.5 12 10.4 9.2Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
