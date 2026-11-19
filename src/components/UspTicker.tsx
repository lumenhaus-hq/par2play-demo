import { TICKER_CHIPS } from "../data/gallery";

function Chip({ label, webp, jpg }: { label: string; webp: string; jpg: string }) {
  return (
    <li className="flex shrink-0 items-center gap-3 pr-10">
      <picture>
        <source srcSet={webp} type="image/webp" />
        <img src={jpg} alt="" width={44} height={44} className="size-11 rounded-xl object-cover" />
      </picture>
      <span className="text-lg font-semibold text-ink">{label}</span>
    </li>
  );
}

export function UspTicker() {
  return (
    <section aria-label="What Par2Play offers" className="border-y border-ink/10 bg-paper">
      <ul className="usp-static flex flex-wrap gap-x-8 gap-y-3 px-6 py-4 @3xl:px-12">
        {TICKER_CHIPS.map((item) => (
          <Chip key={item.id} label={item.label} webp={item.webp} jpg={item.jpg} />
        ))}
      </ul>
      <div className="usp-marquee overflow-hidden py-4">
        <ul className="sr-only">
          {TICKER_CHIPS.map((item) => (
            <li key={item.id}>{item.label}</li>
          ))}
        </ul>
        <ul aria-hidden="true" className="usp-track flex w-max items-center">
          {TICKER_CHIPS.map((item) => (
            <Chip key={item.id} label={item.label} webp={item.webp} jpg={item.jpg} />
          ))}
          {TICKER_CHIPS.map((item) => (
            <Chip key={`${item.id}-loop`} label={item.label} webp={item.webp} jpg={item.jpg} />
          ))}
        </ul>
      </div>
    </section>
  );
}
