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
      <dl className="offer-facts__list">
        {items.map((item) => (
          <div key={item.q} className="offer-facts__item">
            <dt>{item.q}</dt>
            <dd>{item.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
