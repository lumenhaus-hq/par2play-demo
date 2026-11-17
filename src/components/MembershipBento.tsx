import type { ReactNode } from "react";
import { MembershipLink, BookLink, buttonFocus } from "./Cta";
import { GOOGLE_RATING, GOOGLE_REVIEW_COUNT, GOOGLE_REVIEWS_URL } from "../data/reviews";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const driveBars: readonly { day: string; value: number; highlight?: boolean; tip?: string }[] = [
  { day: "MON", value: 42 },
  { day: "TUE", value: 58 },
  { day: "WED", value: 35 },
  { day: "THU", value: 72 },
  { day: "FRI", value: 64 },
  { day: "TODAY", value: 88, highlight: true, tip: "275" },
];

const golfIconBase = `${import.meta.env.BASE_URL}media/membership-icons`;

const golfIcons = [
  { id: "club-strike", label: "Strike", file: "club-strike.png" },
  { id: "crossed-clubs", label: "Clubs", file: "crossed-clubs.png" },
] as const;

type GolfIconId = (typeof golfIcons)[number]["id"];

function MembershipGolfIcon({
  id,
  className = "",
}: {
  id: GolfIconId;
  className?: string;
}) {
  const icon = golfIcons.find((item) => item.id === id) ?? golfIcons[0];
  return (
    <img
      src={`${golfIconBase}/${icon.file}`}
      alt=""
      aria-hidden="true"
      className={`membership-bento__glyph ${className}`}
      width={48}
      height={38}
      decoding="async"
      loading="lazy"
    />
  );
}

function Tile({
  className = "",
  children,
  label,
}: {
  className?: string;
  children: ReactNode;
  label?: string;
}) {
  return (
    <article className={`membership-bento__tile ${className}`} aria-label={label}>
      {children}
    </article>
  );
}

function SimulatorGauge({ reduce }: { reduce: boolean }) {
  return (
    <div className="membership-bento__gauge" aria-hidden="true">
      <svg viewBox="0 0 120 120" className="size-full">
        <circle cx="60" cy="60" r="46" fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="10" />
        <circle
          className={reduce ? undefined : "membership-bento__gauge-arc"}
          cx="60"
          cy="60"
          r="46"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray="220 289"
          transform="rotate(-90 60 60)"
        />
        <text x="60" y="56" textAnchor="middle" className="membership-bento__gauge-value">
          148
        </text>
        <text x="60" y="74" textAnchor="middle" className="membership-bento__gauge-unit">
          MPH
        </text>
      </svg>
    </div>
  );
}

function ClubStack() {
  return (
    <div className="membership-bento__clubs" aria-hidden="true">
      <div className="membership-bento__club membership-bento__club--back">
        <p className="membership-bento__club-label">Driver</p>
        <p className="membership-bento__club-meta">460cc · Stiff</p>
        <MembershipGolfIcon id="club-strike" className="membership-bento__club-icon" />
      </div>
      <div className="membership-bento__club membership-bento__club--front">
        <p className="membership-bento__club-label">Iron · 7</p>
        <p className="membership-bento__club-meta">Launch · Spin</p>
        <MembershipGolfIcon id="crossed-clubs" className="membership-bento__club-icon" />
      </div>
    </div>
  );
}

function Stars() {
  return (
    <span className="inline-flex gap-0.5 text-[#FBBC04]" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <svg key={index} viewBox="0 0 20 20" className="size-3.5">
          <path
            fill="currentColor"
            d="M10 1.6 12.4 7l5.9.5-4.5 3.8 1.4 5.7L10 14.2 4.8 17l1.4-5.7L1.7 7.5 7.6 7 10 1.6Z"
          />
        </svg>
      ))}
    </span>
  );
}

export function MembershipBento() {
  const reduce = usePrefersReducedMotion();

  return (
    <div className="membership-bento">
      <header className="membership-bento__intro">
        <h2 className="font-display text-4xl font-semibold leading-none tracking-tight">Membership</h2>
        <p className="mt-3 max-w-sm text-base leading-relaxed text-ink/70">
          Bay priority, shot data, and hours that bend around your day — all in one stack.
        </p>
        <div className="mt-5 grid grid-cols-1 gap-3">
          <MembershipLink className="cta-sheen w-full">Become a Member</MembershipLink>
          <BookLink className="w-full" offer="bay" tone="dark">
            Try it out
          </BookLink>
        </div>
      </header>

      <div className="membership-bento__grid" role="list">
        <Tile className="membership-bento__tile--clubs" label="Club lineup">
          <p className="membership-bento__eyebrow">Equipment</p>
          <h3 className="membership-bento__title">Clubs on standby</h3>
          <ClubStack />
        </Tile>

        <Tile className="membership-bento__tile--rating" label="Google reviews">
          <p className="membership-bento__eyebrow">Reviews</p>
          <div className="membership-bento__rating">
            <p className="membership-bento__rating-score">{GOOGLE_RATING.toFixed(1)}</p>
            <Stars />
          </div>
          <a
            className={`membership-bento__rating-note ${buttonFocus}`}
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {`${GOOGLE_REVIEW_COUNT} Google reviews`}
          </a>
        </Tile>

        <Tile className="membership-bento__tile--stats" label="Simulator stats">
          <div className="membership-bento__stats-top">
            <div className="membership-bento__stats-copy">
              <p className="membership-bento__eyebrow">Simulator</p>
              <h3 className="membership-bento__title">Cool session stats</h3>
            </div>
            <SimulatorGauge reduce={reduce} />
          </div>
          <ul className="membership-bento__stat-list">
            <li>
              <span>FIR</span>
              <strong>68%</strong>
            </li>
            <li>
              <span>Birdie rate</span>
              <strong>22%</strong>
            </li>
            <li>
              <span>Handicap</span>
              <strong>8.4</strong>
            </li>
          </ul>
        </Tile>

        <Tile className="membership-bento__tile--chart" label="Driving distance">
          <div className="membership-bento__chart-head">
            <p className="membership-bento__eyebrow">This week</p>
            <p className="membership-bento__chart-value">
              275 <span>YDS</span>
            </p>
          </div>
          <p className="membership-bento__chart-label">Avg drive</p>
          <div className="membership-bento__bars" aria-hidden="true">
            {driveBars.map((bar) => (
              <div key={bar.day} className={`membership-bento__bar-col${bar.highlight ? " is-hot" : ""}`}>
                {bar.tip ? <span className="membership-bento__bar-tip">{bar.tip}</span> : null}
                <span className="membership-bento__bar" style={{ height: `${bar.value}%` }} />
                <span className="membership-bento__bar-day">{bar.day}</span>
              </div>
            ))}
          </div>
        </Tile>
      </div>

      <ul className="membership-bento__benefits">
        <li>
          <p className="membership-bento__eyebrow">01 · Availability</p>
          <p className="membership-bento__benefit-title">Member benefits</p>
          <p className="membership-bento__line">First in line for the times that suit you.</p>
        </li>
        <li>
          <p className="membership-bento__eyebrow">02 · Progress</p>
          <p className="membership-bento__benefit-title">Track your progress</p>
          <p className="membership-bento__line">Carry, ball speed, and spin.</p>
        </li>
        <li>
          <p className="membership-bento__eyebrow">03 · Your day</p>
          <p className="membership-bento__benefit-title">Fit it around your day</p>
          <p className="membership-bento__line">Dentist visits and school pickup.</p>
        </li>
      </ul>
    </div>
  );
}
