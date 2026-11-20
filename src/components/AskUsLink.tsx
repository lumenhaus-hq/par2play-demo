import { trackAnchor } from "../analytics/track";
import { buttonFocusOnInk } from "./Cta";
import { NAP } from "../data/business";

/** Quiet phone line under a pricing CTA. The whole line is the tel link. */
export function AskUsLink({ className = "" }: { className?: string }) {
  return (
    <a
      className={`ask-link ${buttonFocusOnInk} ${className}`}
      href={NAP.phoneTel}
      data-ask-us=""
      onClick={(event) => trackAnchor(event.currentTarget)}
    >
      Questions? Ask us anything <span className="ask-link__number">{NAP.phoneDisplay}</span>
    </a>
  );
}
