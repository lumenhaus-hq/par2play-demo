import { Button } from "@heroui/react";
import { useEffect, useState } from "react";
import { currentRoute } from "./data/routes";
import type { StyleId } from "./data/styles";
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

function StepView() {
  const { step } = useFlow();
  switch (step) {
    case "landing":
      return <Landing />;
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

function Routed() {
  const route = currentRoute();
  switch (route) {
    case "home":
      return <StepView />;
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
  // Prerender always bakes Fairway; sync from ?style= / storage after mount.
  const [style, setStyle] = useState<StyleId>("fairway");

  useEffect(() => {
    const initial = resolveInitialStyle();
    setStyle(initial);
    applyStyle(initial);
  }, []);

  useEffect(() => {
    applyStyle(style);
  }, [style]);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="sticky top-0 z-40 flex flex-col items-center gap-3 bg-white px-4 py-3">
        <div className="flex items-center justify-center gap-2">
          <Button className="min-h-11 px-5 text-base font-semibold" variant={flow.layout === "mobile" ? "primary" : "outline"} onPress={() => flow.setLayout("mobile")}>
            Mobile
          </Button>
          <Button className="min-h-11 px-5 text-base font-semibold" variant={flow.layout === "web" ? "primary" : "outline"} onPress={() => flow.setLayout("web")}>
            Desktop
          </Button>
        </div>
        <StyleSwitcher value={style} onChange={setStyle} />
      </div>
      {flow.layout === "mobile" ? (
        <div className="flex justify-center px-4 py-6">
          <div
            className="phone-frame relative overflow-hidden rounded-[36px] border-8 border-slate-950 bg-surface shadow-2xl"
            data-testid="layout"
            data-layout="mobile"
            data-style={style}
          >
            <div className="h-full">
              <Routed />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-surface" data-testid="layout" data-layout="web" data-style={style}>
          <Routed />
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
