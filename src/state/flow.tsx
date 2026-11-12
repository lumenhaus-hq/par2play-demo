import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  type Answers,
  type Cadence,
  type Experience,
  type Intent,
  type Party,
  type Place,
  type PlanId,
  type Product,
  type Term,
  defaultProduct,
  recommendedPlan,
} from "../data/catalog";
import { saveQuizToGolfClock } from "../data/business";
import { type OfferState, type Step } from "../data/journey";
import { smoothScrollTo } from "../motion/smoothScroll";

export type Layout = "mobile" | "web";

type Profile = {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
};

type FlowData = {
  step: Step;
  path: "join" | "visit";
  buyingMembership: boolean;
  planHint: PlanId | null;
  planTouched: boolean;
  productTouched: boolean;
  answers: Answers;
  plan: PlanId | null;
  term: Term;
  foursome: boolean;
  slotId: string;
  product: Product | null;
  acceptPack: boolean;
  profile: Profile;
  cardLast4: string | null;
  layout: Layout;
  notesOpen: boolean;
};

const emptyAnswers = (): Answers => ({
  intent: null,
  experience: null,
  place: null,
  cadence: null,
  party: null,
});

const initial = (): FlowData => ({
  step: "landing",
  path: "join",
  buyingMembership: false,
  planHint: null,
  planTouched: false,
  productTouched: false,
  answers: emptyAnswers(),
  plan: null,
  term: 1,
  foursome: false,
  slotId: "1000",
  product: null,
  acceptPack: false,
  profile: { firstName: "", lastName: "", email: "", mobile: "" },
  cardLast4: null,
  layout: "web",
  notesOpen: false,
});

type FlowApi = FlowData & {
  offerState: OfferState;
  setLayout: (layout: Layout) => void;
  setNotesOpen: (open: boolean) => void;
  startJoin: (hint?: PlanId, choice?: { term: Term; foursome: boolean }) => void;
  startVisit: () => void;
  setIntent: (value: Intent) => void;
  setExperience: (value: Experience) => void;
  setPlace: (value: Place) => void;
  setCadence: (value: Cadence) => void;
  setParty: (value: Party) => void;
  setPlan: (value: PlanId) => void;
  setTerm: (value: Term) => void;
  setFoursome: (value: boolean) => void;
  setProduct: (value: Product) => void;
  setSlot: (value: string) => void;
  setAcceptPack: (value: boolean) => void;
  setProfile: (profile: Profile) => void;
  goNext: () => void;
  goBack: () => void;
  goHome: () => void;
  goClubhouse: () => void;
  goSection: (id: string) => void;
  openMap: () => void;
  closeMap: () => void;
  reset: () => void;
  chooseJoin: () => void;
  chooseGuest: () => void;
  finishHandoff: () => void;
  recordCard: (last4: string, name: string, mobile: string) => void;
};

const FlowContext = createContext<FlowApi | null>(null);

export function FlowProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<FlowData>(initial);
  const pendingSection = useRef<string | null>(null);
  const beforeMap = useRef<Step>("landing");

  useEffect(() => {
    if (data.step === "landing" && pendingSection.current) {
      const id = pendingSection.current;
      pendingSection.current = null;
      requestAnimationFrame(() => {
        const node = document.getElementById(id);
        if (node) smoothScrollTo(node);
      });
    }
  }, [data.step]);

  const api = useMemo<FlowApi>(() => {
    const patch = (partial: Partial<FlowData>) => setData((current) => ({ ...current, ...partial }));

    const withParty = (current: FlowData): FlowData => {
      const party = current.answers.party ?? (current.answers.intent === "socialize" ? "2" : "1");
      const plan = current.plan ?? recommendedPlan(current.answers);
      const product = current.productTouched
        ? current.product
        : defaultProduct(current.answers, plan);
      return {
        ...current,
        plan,
        product,
        answers: { ...current.answers, party },
      };
    };

    return {
      ...data,
      offerState: {
        step: data.step,
        buyingMembership: data.buyingMembership,
        billing: data.term === 12 ? "annual" : "monthly",
        term: data.term,
        foursome: data.foursome,
        plan: data.plan,
        product: data.product,
        acceptPack: data.acceptPack,
        answers: data.answers,
        profileFirst: data.profile.firstName,
        slotId: data.slotId,
      },
      setLayout: (layout) => patch({ layout, notesOpen: false }),
      setNotesOpen: (notesOpen) => patch({ notesOpen }),
      startJoin: (hint, choice) =>
        setData((current) => ({
          ...initial(),
          layout: current.layout,
          step: "intent",
          path: "join",
          buyingMembership: true,
          planHint: hint ?? null,
          plan: hint ?? null,
          planTouched: hint != null,
          term: choice?.term ?? 1,
          foursome: false,
        })),
      startVisit: () =>
        setData((current) => ({
          ...initial(),
          layout: current.layout,
          step: "visit-place",
          path: "visit",
          buyingMembership: false,
        })),
      setIntent: (intent) =>
        setData((current) => ({ ...current, answers: { ...current.answers, intent } })),
      setExperience: (experience) =>
        setData((current) => ({ ...current, answers: { ...current.answers, experience } })),
      setPlace: (place) =>
        setData((current) => ({
          ...current,
          product: current.path === "visit" && !current.productTouched ? "simulator" : current.product,
          answers: { ...current.answers, place },
        })),
      setCadence: (cadence) =>
        setData((current) => ({ ...current, answers: { ...current.answers, cadence } })),
      setParty: (party) =>
        setData((current) => ({ ...current, answers: { ...current.answers, party } })),
      setPlan: (plan) =>
        setData((current) => ({
          ...current,
          plan,
          planTouched: true,
          foursome: plan === "junior" || plan === "junior-plus" ? false : current.foursome,
        })),
      setTerm: (term) => patch({ term }),
      setFoursome: (foursome) =>
        setData((current) => ({
          ...current,
          foursome: current.plan === "junior" || current.plan === "junior-plus" ? false : foursome,
        })),
      setProduct: (product) => patch({ product, productTouched: true, acceptPack: false }),
      setSlot: (slotId) => patch({ slotId }),
      setAcceptPack: (acceptPack) => patch({ acceptPack }),
      setProfile: (profile) => patch({ profile }),
      goNext: () =>
        setData((current) => {
          if (current.step === "intent" && current.answers.intent) return { ...current, step: "experience" };
          if (current.step === "experience" && current.answers.experience) return { ...current, step: "place" };
          if (current.step === "place" && current.answers.place) return { ...current, step: "cadence" };
          if (current.step === "cadence" && current.answers.cadence) {
            const plan = current.planTouched ? current.plan : recommendedPlan(current.answers);
            saveQuizToGolfClock({ answers: current.answers, plan });
            return { ...current, step: "recommend", plan };
          }
          if (current.step === "recommend") return { ...current, step: "register" };
          if (current.step === "register") return { ...current, step: "plan" };
          if (current.step === "plan") {
            if (current.path === "visit") return { ...withParty(current), step: "pay" };
            return { ...withParty(current), step: "book" };
          }
          if (current.step === "book" && current.product && current.slotId) return { ...current, step: "pay" };
          if (current.step === "visit-place" && current.answers.place) return { ...current, step: "visit-party" };
          if (current.step === "visit-party" && current.answers.party) return { ...current, step: "visit-time" };
          if (current.step === "visit-time") return { ...current, step: "guest-choice" };
          return current;
        }),
      goBack: () =>
        setData((current) => {
          const back: Partial<Record<Step, Step>> = {
            intent: "landing",
            experience: "intent",
            place: "experience",
            cadence: "place",
            recommend: "cadence",
            register: current.path === "visit" ? "guest-choice" : "recommend",
            plan: "register",
            book: "plan",
            clubhouse: "landing",
            "visit-place": "landing",
            "visit-party": "visit-place",
            "visit-time": "visit-party",
            "guest-choice": "visit-time",
            pay: current.path === "visit" ? (current.buyingMembership ? "plan" : "guest-choice") : "book",
            confirm: "pay",
          };
          const step = back[current.step];
          return step ? { ...current, step } : current;
        }),
      goHome: () => patch({ step: "landing" }),
      goClubhouse: () => patch({ step: "clubhouse", notesOpen: false }),
      goSection: (id) => {
        if (data.step !== "landing") {
          pendingSection.current = id;
          patch({ step: "landing" });
        } else {
          const node = document.getElementById(id);
          if (node) smoothScrollTo(node);
        }
      },
      openMap: () => {
        beforeMap.current = data.step;
        patch({ step: "journey", notesOpen: false });
      },
      closeMap: () => patch({ step: beforeMap.current }),
      reset: () => setData((current) => ({ ...initial(), layout: current.layout })),
      chooseJoin: () =>
        setData((current) => ({
          ...current,
          buyingMembership: true,
          acceptPack: false,
          planTouched: current.planTouched,
          plan: current.planTouched ? current.plan : recommendedPlan(current.answers),
          step: "register",
        })),
      chooseGuest: () => patch({ buyingMembership: false, step: "pay" }),
      finishHandoff: () => patch({ step: "confirm", cardLast4: null }),
      recordCard: (cardLast4, name, mobile) =>
        setData((current) => ({
          ...current,
          cardLast4,
          step: "confirm",
          profile: {
            ...current.profile,
            firstName: current.profile.firstName || name.trim().split(" ")[0] || "there",
            mobile: current.profile.mobile || mobile,
          },
        })),
    };
  }, [data]);

  return <FlowContext.Provider value={api}>{children}</FlowContext.Provider>;
}

export function useFlow(): FlowApi {
  const value = useContext(FlowContext);
  if (!value) throw new Error("useFlow must be used inside FlowProvider");
  return value;
}
