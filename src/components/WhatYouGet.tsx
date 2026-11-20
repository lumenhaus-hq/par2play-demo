const iconBase = `${import.meta.env.BASE_URL}media/membership-icons`;

export type GetCard = {
  icon: string;
  title: string;
  line: string;
};

export function WhatYouGet({ items }: { items: readonly [GetCard, GetCard, GetCard, GetCard] }) {
  return (
    <section className="what-you-get" data-what-you-get aria-labelledby="what-you-get-heading">
      <h2 id="what-you-get-heading" className="offer-title text-4xl tracking-tight">
        What you get
      </h2>
      <ul className="what-you-get__grid">
        {items.map((item) => (
          <li key={item.title} className="what-you-get__card">
            <img
              src={`${iconBase}/${item.icon}`}
              alt=""
              aria-hidden="true"
              width={64}
              height={50}
              decoding="async"
              loading="lazy"
              fetchPriority="low"
            />
            <h3 className="what-you-get__title">{item.title}</h3>
            <p className="what-you-get__line">{item.line}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
