import type { ReactNode } from "react";

/** Title across the top. Price card, then the story. Two columns from 1024px of the page. */
export function OfferLayout({
  title,
  buy,
  story,
}: {
  title: ReactNode;
  buy: ReactNode;
  story: ReactNode;
}) {
  return (
    <div className="offer-layout">
      <div className="offer-layout__title">{title}</div>
      <div className="offer-layout__buy">{buy}</div>
      <div className="offer-layout__story">{story}</div>
    </div>
  );
}
