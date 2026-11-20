import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const driveBars: readonly { day: string; value: number; highlight?: boolean; tip?: string }[] = [
  { day: "MON", value: 42 },
  { day: "TUE", value: 58 },
  { day: "WED", value: 35 },
  { day: "THU", value: 72 },
  { day: "FRI", value: 64 },
  { day: "TODAY", value: 88, highlight: true, tip: "275" },
];

const preferredSlots: readonly { when: string; note: string; hot?: boolean }[] = [
  { when: "Sat 9am", note: "Your usual", hot: true },
  { when: "Tue 7pm", note: "After work" },
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
    <article className={`membership-bento__tile ${className}`} role="listitem" aria-label={label}>
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

export function MembershipBento() {
  const reduce = usePrefersReducedMotion();

  return (
    <div className="membership-bento__grid" role="list">
      <Tile className="membership-bento__tile--clubs" label="Club lineup">
        <p className="membership-bento__eyebrow">Equipment</p>
        <h3 className="membership-bento__title">Clubs on standby</h3>
        <ClubStack />
      </Tile>

      <Tile className="membership-bento__tile--availability" label="Preferred availability">
        <p className="membership-bento__eyebrow">Availability</p>
        <h3 className="membership-bento__title">Your times, held</h3>
        <ul className="membership-bento__slots">
          {preferredSlots.map((slot) => (
            <li key={slot.when} className={slot.hot ? "is-hot" : undefined}>
              <span className="membership-bento__slot-when">{slot.when}</span>
              <span className="membership-bento__slot-note">{slot.note}</span>
            </li>
          ))}
        </ul>
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

      <Tile className="membership-bento__tile--chart" label="Progress">
        <div className="membership-bento__chart-head">
          <p className="membership-bento__eyebrow">Progress</p>
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
  );
}
