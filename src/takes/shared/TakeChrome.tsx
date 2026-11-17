import { Mark } from "../../components/Chrome";
import { MembershipLink, BookLink, buttonFocus } from "../../components/Cta";
import { LayoutToggle } from "../../components/LayoutToggle";
import { MotionToggle } from "../../components/MotionToggle";
import { SoundToggle } from "../../components/SoundToggle";
import { ADDRESS_LINE, NAP } from "../../data/business";
import { HOURS_LABEL, INSTAGRAM_URL, MAPS_URL } from "../../data/site";
import { SITE_NAV, pageHref } from "../../data/routes";
import { Magnetic } from "./Magnetic";

export function TakeNav({ light = false }: { light?: boolean }) {
  const tone = light ? "text-white" : "text-current";
  return (
    <header className={`take-nav ${light ? "take-nav--light" : ""}`}>
      <a href={pageHref("")} className={`inline-flex min-h-11 items-center ${buttonFocus}`}>
        <Mark light={light} />
      </a>
      <nav className="hidden items-center gap-5 @3xl:flex" aria-label="Page">
        {SITE_NAV.map((item) => (
          <a key={item.slug} href={pageHref(item.slug)} className={`take-nav__link ${tone} ${buttonFocus}`}>
            {item.label}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <LayoutToggle className={tone} />
        <SoundToggle className={tone} />
        <Magnetic className="hidden @3xl:inline-flex">
          <MembershipLink>Become a Member</MembershipLink>
        </Magnetic>
      </div>
    </header>
  );
}

export function TakeFooter() {
  return (
    <footer className="take-footer">
      <div className="take-footer__grid">
        <div>
          <p className="font-display text-2xl font-semibold tracking-tight">{NAP.name}</p>
          <p className="mt-3 max-w-sm text-base leading-relaxed opacity-80">
            Indoor golf simulators in {NAP.city}, {NAP.region}. Four Full Swing bays, PGA coaching, memberships, and events.
          </p>
        </div>
        <div className="text-base leading-relaxed">
          <p>
            <a className={`underline decoration-2 underline-offset-4 ${buttonFocus}`} href={MAPS_URL} target="_blank" rel="noopener noreferrer">
              {ADDRESS_LINE}
            </a>
          </p>
          <p className="mt-2">
            <a className={`underline decoration-2 underline-offset-4 ${buttonFocus}`} href={NAP.phoneTel}>
              {NAP.phoneDisplay}
            </a>
          </p>
          <p className="mt-2 opacity-80">{HOURS_LABEL}</p>
        </div>
        <div className="flex flex-col items-start gap-2">
          <BookLink offer="bay">Book a bay</BookLink>
          <a className={`min-h-11 inline-flex items-center font-semibold underline decoration-2 underline-offset-4 ${buttonFocus}`} href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <MotionToggle />
        </div>
      </div>
    </footer>
  );
}
