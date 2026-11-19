import { openCookieSettings } from "../analytics/consent";
import { NAP } from "../data/business";
import { pageHref } from "../data/routes";
import { HOURS_LABEL, INSTAGRAM_URL, MAPS_URL } from "../data/site";
import { PhoneLink, buttonFocus } from "./Cta";

const link = `underline decoration-2 underline-offset-4 ${buttonFocus}`;

/** Visible name, address, phone, and hours. Prerendered with the page, not an image. */
export function VisitLine() {
  return (
    <div>
      <p className="text-lg leading-relaxed">
        {`${NAP.name} · ${NAP.street}, ${NAP.city}, ${NAP.region} ${NAP.postalCode} · `}
        <PhoneLink className={link}>{NAP.phoneDisplay}</PhoneLink>
        {` · `}
        <a className={link} href={`mailto:${NAP.email}`}>
          {NAP.email}
        </a>
      </p>
      <p className="mt-2 text-lg">
        {`Open ${HOURS_LABEL}. `}
        <a className={link} href={MAPS_URL}>
          Directions
        </a>
      </p>
      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-lg">
        <a className={link} href={INSTAGRAM_URL}>
          Instagram
        </a>
        <a className={link} href={pageHref("privacy-policy")}>
          Privacy policy
        </a>
        <button type="button" className={link} onClick={openCookieSettings}>
          Cookie settings
        </button>
      </p>
    </div>
  );
}
