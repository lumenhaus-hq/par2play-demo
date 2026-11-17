import { useEffect, useState } from "react";
import { currentRoute } from "./data/routes";
import type { StyleId } from "./data/styles";
import type { TakeId } from "./data/takes";
import { CookieNotice } from "./components/CookieNotice";
import { SmoothScroll } from "./components/SmoothScroll";
import { StyleSwitcher } from "./components/StyleSwitcher";
import { Landing } from "./screens/Landing";
import { PrivacyPage } from "./screens/PrivacyPage";
import { CoachingPage, EventsPage, JuniorsPage, MembershipPage, NotFoundPage, TournamentPage } from "./screens/SitePages";
import { Clubhouse } from "./screens/Clubhouse";
import { JourneyMap } from "./screens/JourneyMap";
import {
  BookStep,
  CadenceStep,
  ConfirmStep,
  ExperienceStep,
  GuestChoiceStep,
  IntentStep,
  PartyStep,
  PayStep,
  PlaceStep,
  PlanStep,
  RecommendStep,
  RegisterStep,
  TimeStep,
} from "./screens/FlowScreens";
import { FlowProvider, useFlow } from "./state/flow";
import { applyStyle, resolveInitialStyle } from "./style/applyStyle";
import { applyTake, resolveInitialTake } from "./takes/applyTake";
import { TakeSwitcher } from "./takes/TakeSwitcher";
import { OrbitLanding } from "./takes/OrbitLanding";
import { LedgerLanding } from "./takes/LedgerLanding";
import { StrikeLanding } from "./takes/StrikeLanding";
import "./takes/takes.css";

function HomeTake({ take }: { take: TakeId }) {
  switch (take) {
    case "classic":
      return <Landing />;
    case "orbit":
      return <OrbitLanding />;
    case "ledger":
      return <LedgerLanding />;
    case "strike":
      return <StrikeLanding />;
    default: {
      const exhaustive: never = take;
      return exhaustive;
    }
  }
}

function StepView({ take }: { take: TakeId }) {
  const { step } = useFlow();
  switch (step) {
    case "landing":
      return <HomeTake take={take} />;
    case "clubhouse":
      return <Clubhouse />;
    case "intent":
      return <IntentStep />;
    case "experience":
      return <ExperienceStep />;
    case "place":
    case "visit-place":
      return <PlaceStep />;
    case "cadence":
      return <CadenceStep />;
    case "visit-party":
      return <PartyStep />;
    case "recommend":
      return <RecommendStep />;
    case "register":
      return <RegisterStep />;
    case "plan":
      return <PlanStep />;
    case "book":
      return <BookStep />;
    case "visit-time":
      return <TimeStep />;
    case "guest-choice":
      return <GuestChoiceStep />;
    case "pay":
      return <PayStep />;
    case "confirm":
      return <ConfirmStep />;
    case "journey":
      return <JourneyMap />;
  }
}

function Routed({ take }: { take: TakeId }) {
  const route = currentRoute();
  switch (route) {
    case "home":
      return <StepView take={take} />;
    case "membership":
      return <MembershipPage />;
    case "coaching":
      return <CoachingPage />;
    case "juniors":
      return <JuniorsPage />;
    case "events":
      return <EventsPage />;
    case "tournament":
      return <TournamentPage />;
    case "privacy":
      return <PrivacyPage />;
    case "notfound":
      return <NotFoundPage />;
    default: {
      const exhaustive: never = route;
      return exhaustive;
    }
  }
}

function Shell() {
  const flow = useFlow();
  const [take, setTake] = useState<TakeId>("classic");
  const [style, setStyle] = useState<StyleId>("signal");

  useEffect(() => {
    const initialTake = resolveInitialTake();
    const initialStyle = resolveInitialStyle();
    setTake(initialTake);
    setStyle(initialStyle);
    applyTake(initialTake);
    applyStyle(initialStyle);
  }, []);

  useEffect(() => {
    applyTake(take);
  }, [take]);

  useEffect(() => {
    applyStyle(style);
  }, [style]);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="sticky top-0 z-40 flex flex-col items-center gap-2 bg-white px-4 py-3">
        <TakeSwitcher value={take} onChange={setTake} />
        {take === "classic" ? <StyleSwitcher value={style} onChange={setStyle} /> : null}
      </div>
      {flow.layout === "mobile" ? (
        <div className="flex justify-center px-4 py-6">
          <div
            className="phone-frame relative overflow-hidden rounded-[36px] border-8 border-slate-950 bg-surface shadow-2xl"
            data-testid="layout"
            data-layout="mobile"
            data-take={take}
            data-style={style}
          >
            <div className="h-full overflow-y-auto">
              <Routed take={take} />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-surface" data-testid="layout" data-layout="web" data-take={take} data-style={style}>
          <Routed take={take} />
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <FlowProvider>
      <SmoothScroll />
      <Shell />
      <CookieNotice />
    </FlowProvider>
  );
}
