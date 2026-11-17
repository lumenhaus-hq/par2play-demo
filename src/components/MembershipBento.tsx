import type { ReactNode } from "react";
import { trackAnchor } from "../analytics/track";
import { BookLink, MembershipLink, buttonFocus } from "./Cta";
import { bookingHref, SIMULATOR_COURSE_COUNT } from "../data/business";
import { GOOGLE_RATING, GOOGLE_REVIEW_COUNT, GOOGLE_REVIEWS_URL, REVIEW_QUOTES } from "../data/reviews";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const partners = REVIEW_QUOTES.slice(0, 3);

const driveBars: readonly { day: string; value: number; highlight?: boolean; tip?: string }[] = [
  { day: "MON", value: 42 },
  { day: "TUE", value: 58 },
  { day: "WED", value: 35 },
  { day: "THU", value: 72 },
  { day: "FRI", value: 64 },
  { day: "TODAY", value: 88, highlight: true, tip: "275" },
];

const dockItems = [
  { id: "bag", label: "Bag" },
  { id: "stats", label: "Stats" },
  { id: "sim", label: "Simulator" },
  { id: "social", label: "Social" },
] as const;

type DockId = (typeof dockItems)[number]["id"];

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

function GolfBagScene() {
  return (
    <svg className="membership-bento__bag" viewBox="0 0 160 220" aria-hidden="true">
      <defs>
        <linearGradient id="bag-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a3d2a" />
          <stop offset="100%" stopColor="#0a1a12" />
        </linearGradient>
        <linearGradient id="club-shaft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d7dde3" />
          <stop offset="100%" stopColor="#8a949e" />
        </linearGradient>
      </defs>
      <ellipse cx="80" cy="208" rx="48" ry="8" fill="rgb(0 0 0 / 0.35)" />
      <path
        fill="url(#bag-body)"
        d="M42 118c0-18 10-34 28-42l6-28h18l4 28c20 6 32 24 32 42v62c0 10-8 18-18 18H60c-10 0-18-8-18-18v-62Z"
      />
      <path fill="var(--accent)" d="M54 148h62v10H54z" opacity="0.9" />
      <path fill="var(--mint)" d="M70 118h30v8H70z" opacity="0.55" />
      <rect x="68" y="28" width="4" height="78" rx="2" fill="url(#club-shaft)" transform="rotate(-12 70 67)" />
      <rect x="78" y="18" width="4" height="92" rx="2" fill="url(#club-shaft)" />
      <rect x="88" y="24" width="4" height="84" rx="2" fill="url(#club-shaft)" transform="rotate(10 90 66)" />
      <path fill="#cfd6dc" d="M54 34c8-10 18-14 22-8 2 4-2 10-10 16-8 6-16 6-18 2-2-3 0-6 6-10Z" />
      <path fill="#b8c0c8" d="M74 22c6-4 14-4 18 2 3 5 0 12-8 16s-16 2-18-4c-2-5 2-10 8-14Z" />
      <path fill="#aeb6be" d="M92 30c8-6 16-4 18 2 2 6-4 12-12 16-8 4-16 2-18-4-2-5 4-10 12-14Z" />
      <circle cx="118" cy="168" r="10" fill="#f4f6f5" />
      <circle cx="118" cy="168" r="3.2" fill="var(--bay)" />
      <circle cx="114.5" cy="164.8" r="1.4" fill="var(--mint)" />
    </svg>
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
        <span className="membership-bento__club-chip" />
      </div>
      <div className="membership-bento__club membership-bento__club--front">
        <p className="membership-bento__club-label">Iron · 7</p>
        <p className="membership-bento__club-meta">Launch · Spin</p>
        <span className="membership-bento__club-chip" />
        <svg className="membership-bento__club-icon" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="currentColor" d="M14 6h5l2 16H16L14 6Z" />
          <path fill="var(--accent)" d="M18 22 30 36l4-3.4L22 18.6 18 22Z" />
          <path fill="currentColor" d="M28 34c4-1.6 9.2 0 11 2.8 1.6 2.4.2 5-3.6 5.8-4.8 1.2-10-.6-11.6-3-1.4-2 .4-4.4 4.2-5.6Z" />
        </svg>
      </div>
    </div>
  );
}

function SpinningBall({ reduce }: { reduce: boolean }) {
  return (
    <span className={`membership-bento__spin ${reduce ? "" : "membership-bento__spin--live"}`} aria-hidden="true">
      <svg viewBox="0 0 32 32" className="size-7">
        <circle cx="16" cy="16" r="13" fill="#f2f5f3" />
        <circle cx="16" cy="16" r="5" fill="var(--mint)" />
        <circle cx="12.2" cy="12.4" r="1.8" fill="var(--bay)" />
        <path
          d="M8 18c3 2 6 3 10 2M18 9c2 2 3 5 2 8"
          fill="none"
          stroke="var(--bay)"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.45"
        />
      </svg>
    </span>
  );
}

function DockGlyph({ id }: { id: DockId }) {
  switch (id) {
    case "bag":
      return (
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
          <path fill="currentColor" d="M8 10h8l1 10H7L8 10Z" />
          <path fill="var(--accent)" d="M10 4h4l1 6h-6L10 4Z" />
        </svg>
      );
    case "stats":
      return (
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
          <rect x="4" y="13" width="3.5" height="7" rx="1" fill="currentColor" />
          <rect x="10.2" y="9" width="3.5" height="11" rx="1" fill="var(--accent)" />
          <rect x="16.4" y="5" width="3.5" height="15" rx="1" fill="currentColor" />
        </svg>
      );
    case "sim":
      return (
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
          <rect x="3" y="5" width="18" height="12" rx="2" fill="currentColor" />
          <path fill="var(--accent)" d="M8 19h8v2H8z" />
          <circle cx="12" cy="11" r="2.4" fill="var(--accent)" />
        </svg>
      );
    case "social":
      return (
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
          <circle cx="9" cy="9" r="3" fill="currentColor" />
          <circle cx="16" cy="10" r="2.4" fill="var(--accent)" />
          <path fill="currentColor" d="M4 19c.5-3 2.8-4.6 5-4.6s4.5 1.6 5 4.6H4Z" />
        </svg>
      );
    default: {
      const exhaustive: never = id;
      return exhaustive;
    }
  }
}

function Stars() {
  return (
    <span className="inline-flex gap-0.5 text-white" aria-hidden="true">
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
        <Tile className="membership-bento__tile--hero" label="Member profile">
          <div className="membership-bento__hero-copy">
            <p className="membership-bento__eyebrow">Your bag</p>
            <h3 className="membership-bento__title">Meet the member kit</h3>
            <p className="membership-bento__line">Top brand clubs ready in the bay when you walk in.</p>
          </div>
          <div className="membership-bento__hero-media">
            <GolfBagScene />
            <div className="membership-bento__hero-chips">
              <span>Open till 10pm</span>
              <span>{`${SIMULATOR_COURSE_COUNT}+ courses`}</span>
            </div>
          </div>
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

        <Tile className="membership-bento__tile--brand" label="Par2Play">
          <p className="membership-bento__brand-mark">PAR2</p>
          <p className="membership-bento__brand-sub">PLAY</p>
          <span className="membership-bento__brand-ball">
            <SpinningBall reduce={reduce} />
          </span>
        </Tile>

        <Tile className="membership-bento__tile--clubs" label="Club lineup">
          <p className="membership-bento__eyebrow">Equipment</p>
          <h3 className="membership-bento__title">Clubs on standby</h3>
          <ClubStack />
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

        <Tile className="membership-bento__tile--social" label="Playing partners and reviews">
          <div className="membership-bento__social-row">
            <ul className="membership-bento__avatars">
              {partners.map((partner, index) => (
                <li key={partner.id} style={{ zIndex: partners.length - index }}>
                  <span aria-hidden="true">{partner.name.slice(0, 1)}</span>
                  <span className="sr-only">{partner.name}</span>
                </li>
              ))}
            </ul>
            <a
              className={`membership-bento__plus ${buttonFocus}`}
              href={bookingHref("bay")}
              target="_blank"
              rel="noopener noreferrer"
              data-offer="bay"
              aria-label="Book a bay"
              onClick={(event) => trackAnchor(event.currentTarget)}
            >
              <span aria-hidden="true">+</span>
            </a>
          </div>
          <div className="membership-bento__rating">
            <Stars />
            <p className="membership-bento__rating-score">{GOOGLE_RATING.toFixed(1)}</p>
          </div>
          <a
            className={`membership-bento__rating-note ${buttonFocus}`}
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {`Based on ${GOOGLE_REVIEW_COUNT} Google reviews`}
          </a>
        </Tile>

        <Tile className="membership-bento__tile--dock" label="Member shortcuts">
          <ul className="membership-bento__dock">
            {dockItems.map((item) => (
              <li key={item.id}>
                <span className={`membership-bento__dock-icon${item.id === "sim" ? " membership-bento__dock-icon--ball" : ""}`}>
                  {item.id === "sim" ? <SpinningBall reduce={reduce} /> : <DockGlyph id={item.id} />}
                </span>
                <span className="sr-only">{item.label}</span>
              </li>
            ))}
          </ul>
        </Tile>
      </div>
    </div>
  );
}
