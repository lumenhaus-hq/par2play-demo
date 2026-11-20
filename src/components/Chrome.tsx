import { Button } from "@heroui/react";
import { useState, type ReactNode } from "react";
import { MembershipLink, buttonFocus } from "./Cta";
import { PHOTOS } from "../data/photos";
import { useFlow } from "../state/flow";

function altForPhoto(src: string): string {
  for (const photo of Object.values(PHOTOS)) {
    if (src === photo.jpg || src === photo.webp || src === photo.avif) return photo.alt;
  }
  return "Par2Play indoor golf in Somerset, NJ";
}

export function Mark({ light = false }: { light?: boolean }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}brand/logo.png`}
      alt="Par2Play"
      width={209}
      height={167}
      className={light ? "site-header__logo h-11 w-auto @3xl:h-14" : "site-header__logo h-11 w-auto max-w-36 rounded-xl bg-slate-950 px-2 py-1 @3xl:h-14 @3xl:max-w-none"}
    />
  );
}

export function ClubHeader({ light = false }: { light?: boolean }) {
  const flow = useFlow();
  const [open, setOpen] = useState(false);
  const link = `inline-flex min-h-11 items-center text-base font-semibold ${buttonFocus} ${light ? "text-white" : "text-ink"}`;
  const jump = (id?: string) => {
    setOpen(false);
    if (id) flow.goSection(id);
    else flow.goHome();
  };
  return (
    <header className={`relative px-5 py-4 lg:px-8 ${light ? "bg-ink text-white" : "text-ink"}`}>
      <div className="flex items-center justify-between gap-4">
        <Button variant="ghost" className="h-auto min-w-0 bg-transparent px-0" onPress={flow.goHome}>
          <Mark light={light} />
        </Button>
        {flow.layout === "web" ? (
          <nav className="flex items-center gap-6">
            <button className={link} onClick={() => jump()} type="button">
              Home
            </button>
            <button className={link} onClick={() => jump("practice")} type="button">
              Practice
            </button>
            <button className={link} onClick={() => jump("coaching")} type="button">
              Coaching
            </button>
            <button className={link} onClick={() => jump("juniors")} type="button">
              Juniors
            </button>
            <button className={link} onClick={() => jump("venue")} type="button">
              Venue
            </button>
          </nav>
        ) : (
          <Button variant="ghost" className={`min-h-11 px-4 text-base font-semibold ${light ? "text-white" : "text-ink"}`} onPress={() => setOpen((value) => !value)}>
            {open ? "Close" : "Menu"}
          </Button>
        )}
        {flow.layout === "web" && flow.step !== "landing" && (
          <MembershipLink>Become a Member</MembershipLink>
        )}
      </div>
      {flow.layout === "mobile" && open && (
        <nav className={`mt-4 flex flex-col gap-1 text-base font-semibold ${light ? "text-white" : "text-ink"}`}>
          <button className={link} onClick={() => jump()} type="button">Home</button>
          <button className={link} onClick={() => jump("practice")} type="button">Practice</button>
          <button className={link} onClick={() => jump("coaching")} type="button">Coaching</button>
          <button className={link} onClick={() => jump("juniors")} type="button">Juniors</button>
          <button className={link} onClick={() => jump("venue")} type="button">Venue</button>
        </nav>
      )}
    </header>
  );
}

export function ScreenFrame({
  children,
  footer,
  photo,
}: {
  children: ReactNode;
  footer?: ReactNode;
  photo?: string;
}) {
  const { layout } = useFlow();
  if (layout === "mobile") {
    return (
      <div className="flex h-full flex-col bg-white">
        <ClubHeader />
        <div className="flex-1 overflow-y-auto">
          {photo && <img src={photo} alt={altForPhoto(photo)} className="h-36 w-full object-cover object-center" />}
          <div className="px-5 py-6">{children}</div>
        </div>
        {footer && <div className="px-5 py-4">{footer}</div>}
      </div>
    );
  }
  return (
    <div className="bg-white">
      <ClubHeader />
      <div className={`grid min-h-[720px] ${photo ? "grid-cols-2" : "grid-cols-1"}`}>
        <div className="flex flex-col px-10 py-8">
          <div className="flex-1">{children}</div>
          {footer && <div className="pt-8">{footer}</div>}
        </div>
        {photo && <img src={photo} alt={altForPhoto(photo)} className="h-full min-h-[720px] w-full object-cover object-center" />}
      </div>
    </div>
  );
}
