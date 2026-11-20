import type { ReactNode } from "react";
import { AskUsLink } from "./AskUsLink";
import { JointToggle } from "./JointToggle";
import { ReserveTime } from "./ReserveTime";
import type { BookingOffer } from "../data/business";

const icon = (file: string) => `${import.meta.env.BASE_URL}media/membership-icons/${file}`;

type Choice<T extends string> = {
  value: T;
  label: string;
  price?: string;
  note?: string;
  noteIcon?: "spark" | "gift";
};

export function OfferSheet<T extends string>({
  id,
  toggleLabel,
  value,
  options,
  onChange,
  invoice,
  offer,
}: {
  id: string;
  toggleLabel: string;
  value: T;
  options: readonly Choice<T>[];
  onChange: (value: T) => void;
  invoice: ReactNode;
  offer: BookingOffer;
}) {
  return (
    <section id={id} className="play-sheet" aria-label={toggleLabel}>
      <img
        className="play-sheet__glyph play-sheet__glyph--a"
        src={icon("flag.png")}
        alt=""
        aria-hidden="true"
        width={64}
        height={50}
        decoding="async"
        fetchPriority="low"
      />
      <img
        className="play-sheet__glyph play-sheet__glyph--b"
        src={icon("ball.png")}
        alt=""
        aria-hidden="true"
        width={64}
        height={50}
        decoding="async"
        fetchPriority="low"
      />
      <div className="play-sheet__body">
        <JointToggle value={value} options={options} onChange={onChange} label={toggleLabel} tone="dark" />
        {invoice}
        <ReserveTime offer={offer} />
        <AskUsLink />
      </div>
    </section>
  );
}
