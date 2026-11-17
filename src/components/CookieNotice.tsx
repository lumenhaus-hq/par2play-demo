import { useEffect, useState, useSyncExternalStore } from "react";
import { buttonFocus } from "./Cta";
import { applyStoredConsent, updateConsent } from "../analytics/tags";
import {
  clearTrackingStorage,
  closeCookieBanner,
  cookieBannerMode,
  cookieChoice,
  openCookieSettings,
  saveConsent,
  subscribeConsent,
} from "../analytics/consent";
import { pageHref } from "../data/routes";

function subscribe(listener: () => void) {
  return subscribeConsent(listener);
}

function snapshot() {
  return cookieBannerMode();
}

export function CookieNotice() {
  // Prerendered HTML always starts with the banner, independent of visitor storage.
  const mode = useSyncExternalStore(subscribe, snapshot, () => "banner" as const);
  const stored = cookieChoice();
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    applyStoredConsent();
  }, []);

  useEffect(() => {
    if (mode !== "settings") return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCookieBanner();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode]);

  useEffect(() => {
    if (mode !== "settings") return;
    const choice = cookieChoice();
    setAnalytics(choice?.analytics ?? false);
    setMarketing(choice?.marketing ?? false);
  }, [mode]);

  if (mode === "closed") return null;

  const commit = (choice: { analytics: boolean; marketing: boolean }, downgrade: boolean) => {
    saveConsent(choice, false);
    updateConsent(choice);
    if (downgrade) {
      clearTrackingStorage();
      window.location.reload();
      return;
    }
  };

  const previous = stored ?? { analytics: false, marketing: false };
  const downgrade = (choice: { analytics: boolean; marketing: boolean }) =>
    (previous.analytics && !choice.analytics) || (previous.marketing && !choice.marketing);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center p-3 @3xl:p-6">
      {mode === "banner" ? (
        <div className="pointer-events-auto w-full max-w-3xl rounded-2xl border border-ink/15 bg-paper px-4 py-3 text-ink shadow-[0_12px_40px_color-mix(in_srgb,var(--ink)_18%,transparent)]">
          <p className="text-base font-semibold">Cookies at Par2Play</p>
          <p className="mt-1 text-sm leading-snug">
            {`We use cookies to keep this site working. With your OK, we’d also like to use analytics cookies to see how the site is used, and marketing cookies to measure our ads on Google, Facebook and Instagram. Non-essential cookies stay off unless you turn them on. You can change your mind anytime in “Cookie settings” at the bottom of the page. `}
            <a className={`underline decoration-2 underline-offset-4 ${buttonFocus}`} href={pageHref("privacy-policy")}>
              Privacy Policy
            </a>
          </p>
          <div className="mt-3 grid grid-cols-1 gap-2 @3xl:grid-cols-3">
            <BannerButton onClick={() => commit({ analytics: true, marketing: true }, false)}>Accept all</BannerButton>
            <BannerButton onClick={() => commit({ analytics: false, marketing: false }, downgrade({ analytics: false, marketing: false }))}>
              Reject non-essential
            </BannerButton>
            <BannerButton onClick={openCookieSettings}>Settings</BannerButton>
          </div>
        </div>
      ) : null}
      {mode === "settings" ? (
        <div
          role="dialog"
          aria-labelledby="cookie-settings-title"
          className="pointer-events-auto max-h-[70vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-ink/15 bg-paper px-4 py-3 text-ink shadow-[0_12px_40px_color-mix(in_srgb,var(--ink)_18%,transparent)]"
        >
          <p id="cookie-settings-title" className="text-base font-semibold">
            Cookie settings
          </p>
          <p className="mt-1 text-sm leading-snug">
            Choose which cookies we can use. Necessary cookies are always on because the site needs them. Your choice applies to this
            browser on par2play.com.
          </p>
          <ul className="mt-3 grid gap-3">
            <Category
              title="Necessary"
              locked
              on={true}
              text="These keep the site working and remember your cookie choices. They don’t track you for analytics or ads."
            />
            <Category
              title="Analytics"
              on={analytics}
              onChange={setAnalytics}
              text="These help us understand how people use the site: which pages they visit and which buttons they click. That shows us what to improve. Tools: Google Analytics (via Google Tag Manager) and Microsoft Clarity, which records clicks and scrolling to make page heatmaps and session replays. Cookies: _ga, _ga_W5W5LHTPF1, _clck, _clsk."
            />
            <Category
              title="Marketing"
              on={marketing}
              onChange={setMarketing}
              text="These show whether our ads on Google, Facebook and Instagram lead to calls, bookings or sign-ups, and let those platforms show you relevant Par2Play ads. Tools: Google Ads and Meta Pixel. Cookies: _gcl_au, _gcl_aw, _fbp, _fbc, plus campaign cookies (gclid, utm_*)."
            />
          </ul>
          <p className="mt-3 text-sm leading-snug">
            Booking and checkout happen on par2play.oclock.app (GolfClock), which has its own cookies and privacy policy. More detail is in
            our{" "}
            <a className={`underline decoration-2 underline-offset-4 ${buttonFocus}`} href={pageHref("privacy-policy")}>
              Privacy Policy
            </a>
            .
          </p>
          <div className="mt-3 grid grid-cols-1 gap-2 @3xl:grid-cols-3">
            <BannerButton
              onClick={() => {
                const choice = { analytics, marketing };
                commit(choice, downgrade(choice));
              }}
            >
              Save my choices
            </BannerButton>
            <BannerButton onClick={() => commit({ analytics: true, marketing: true }, false)}>Accept all</BannerButton>
            <BannerButton onClick={() => commit({ analytics: false, marketing: false }, downgrade({ analytics: false, marketing: false }))}>
              Reject non-essential
            </BannerButton>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function BannerButton({ children, onClick }: { children: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className={`min-h-11 rounded-full border-2 border-ink bg-white px-4 text-base font-semibold text-ink ${buttonFocus}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Category({
  title,
  text,
  on,
  locked = false,
  onChange,
}: {
  title: string;
  text: string;
  on: boolean;
  locked?: boolean;
  onChange?: (value: boolean) => void;
}) {
  return (
    <li className="rounded-xl border border-ink/10 bg-white px-3 py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-base font-semibold">{title}</p>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          disabled={locked}
          className={`min-h-11 min-w-16 rounded-full px-3 text-sm font-semibold ${on ? "bg-accent text-ink" : "bg-[#e6eee8] text-ink"} ${locked ? "opacity-70" : ""} ${buttonFocus}`}
          onClick={() => onChange?.(!on)}
        >
          {locked ? "Always on" : on ? "On" : "Off"}
        </button>
      </div>
      <p className="mt-1 text-sm leading-snug">{text}</p>
    </li>
  );
}
