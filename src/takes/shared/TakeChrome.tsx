import { Mark } from "../../components/Chrome";
import { MembershipLink, buttonFocus } from "../../components/Cta";
import { LayoutToggle } from "../../components/LayoutToggle";
import { SiteFooter } from "../../components/SiteChrome";
import { SiteMenu } from "../../components/SiteMenu";
import { SoundToggle } from "../../components/SoundToggle";
import { showDemoChrome } from "../../data/site";
import { SITE_NAV, pageHref } from "../../data/routes";
import { Magnetic } from "./Magnetic";

export function TakeNav({ light = false }: { light?: boolean }) {
  const tone = light ? "text-white" : "text-current";
  return (
    <header className={`take-nav relative ${light ? "take-nav--light" : ""}`}>
      <a href={pageHref("")} className={`inline-flex min-h-11 items-center ${buttonFocus}`}>
        <Mark light={light} />
      </a>
      <div className="flex items-center gap-2">
        {showDemoChrome() ? <LayoutToggle className={tone} /> : null}
        <SoundToggle className={tone} />
        <SiteMenu
          className={tone}
          linkClass={`take-nav__link ${tone} ${buttonFocus}`}
          panelClass={light ? "bg-ink text-white" : "border-b border-ink/10 bg-paper text-ink shadow-[0_16px_40px_rgb(10_15_11/0.12)]"}
          items={SITE_NAV.map((item) => ({
            slug: item.slug,
            label: item.label,
            href: pageHref(item.slug),
            current: false,
          }))}
        />
        <Magnetic className="hidden @3xl:inline-flex">
          <MembershipLink>Become a Member</MembershipLink>
        </Magnetic>
      </div>
    </header>
  );
}

export function TakeFooter() {
  return <SiteFooter />;
}
