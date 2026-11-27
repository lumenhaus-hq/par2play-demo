import {
  Button,
  Card,
  Chip,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  ProgressBar,
  Radio,
  RadioGroup,
  Separator,
  TextField,
} from "@heroui/react";
import { useState } from "react";
import { BookLink, CtaPair, MembershipLink } from "../components/Cta";
import { ScreenFrame } from "../components/Chrome";
import { NAP } from "../data/business";
import {
  CANCEL_RULE,
  IMAGES,
  MEMBER_CANCEL,
  PLANS,
  RATES,
  SATURDAY,
  SLOTS,
  membershipCharge,
  membershipLabel,
  money,
  partyCount,
  planById,
  productLabel,
  quote,
  recommendReason,
  recommendedPlan,
  slotById,
  type Party,
  type Product,
} from "../data/catalog";
import { offerDetail, offerName, receipt, resolveOffer, laterNotes } from "../data/journey";
import { useFlow } from "../state/flow";

const pill = "min-h-11 rounded-full px-5 text-base font-semibold";

function OfferCard() {
  const flow = useFlow();
  const offer = resolveOffer(flow.offerState);
  if (!offer.visible) return null;
  const lessonPack = offer.visible === "lesson-series";
  return (
    <Card className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50" data-testid="screen-offer">
      <Card.Header>
        <Chip color="accent" variant="soft">
          <Chip.Label>One offer</Chip.Label>
        </Chip>
        <Card.Title>{offerName(offer.visible)}</Card.Title>
        <Card.Description>{offerDetail(offer.visible, flow.plan)}</Card.Description>
      </Card.Header>
      {lessonPack && (
        <Card.Footer className="gap-2">
          <Button className={pill} variant={flow.acceptPack ? "primary" : "outline"} onPress={() => flow.setAcceptPack(true)}>
            {`Add the 3-lesson pack for ${money(RATES.lessonPack3)}`}
          </Button>
          <Button className={pill} variant={flow.acceptPack ? "outline" : "primary"} onPress={() => flow.setAcceptPack(false)}>
            30-minute lesson is $100
          </Button>
        </Card.Footer>
      )}
    </Card>
  );
}

function QuoteList({ includeVisit, buying = undefined }: { includeVisit: boolean; buying?: boolean }) {
  const flow = useFlow();
  const priced = quote({
    buyingMembership: buying ?? flow.buyingMembership,
    term: flow.term,
    foursome: flow.foursome,
    plan: flow.plan ?? (buying || flow.buyingMembership ? recommendedPlan(flow.answers) : null),
    product: flow.product,
    acceptPack: buying ? false : flow.acceptPack,
    answers: flow.answers,
    includeVisit,
  });
  return (
    <div className="mt-6 rounded-3xl border border-slate-200 p-5">
      <ul className="space-y-3 text-sm">
        {priced.lines.map((line) => (
          <li key={line.label} className="flex items-start justify-between gap-4">
            <span>{line.label}</span>
            <span className="text-right font-semibold">
              {line.pending ? "TBD" : line.against ? `${money(line.amount)} against ${money(line.against)}` : money(line.amount)}
            </span>
          </li>
        ))}
      </ul>
      <Separator className="my-4" />
      <p className="flex justify-between text-base font-semibold">
        <span>Total</span>
        <span>{money(priced.total)}</span>
      </p>
      <p className="mt-3 text-xs leading-relaxed text-slate-500">{CANCEL_RULE}</p>
    </div>
  );
}

function ChoiceQuestion({
  name,
  eyebrow,
  title,
  progress,
  value,
  onChange,
  options,
  photo,
}: {
  name: string;
  eyebrow: string;
  title: string;
  progress: number;
  value: string | null;
  onChange: (value: string) => void;
  options: { id: string; label: string; detail: string }[];
  photo: string;
}) {
  const flow = useFlow();
  return (
    <ScreenFrame
      photo={photo}
      footer={
        <div className="flex gap-3">
          <Button variant="ghost" onPress={flow.goBack}>Back</Button>
          <Button className={pill} isDisabled={!value} onPress={flow.goNext}>Continue</Button>
        </div>
      }
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">{eyebrow}</p>
      <ProgressBar aria-label="Questions" className="mt-4 max-w-xs" value={progress}>
        <ProgressBar.Track>
          <ProgressBar.Fill />
        </ProgressBar.Track>
      </ProgressBar>
      <h1 className="mt-6 text-4xl font-semibold tracking-tighter text-slate-900">{title}</h1>
      <RadioGroup className="mt-8 gap-3" name={name} value={value} onChange={onChange}>
        {options.map((option) => (
          <Radio key={option.id} value={option.id} className="rounded-3xl border border-slate-200 px-4 py-3 data-[selected=true]:border-emerald-600">
            <Radio.Content>
              <Radio.Control>
                <Radio.Indicator />
              </Radio.Control>
              {option.label}
            </Radio.Content>
            <Description>{option.detail}</Description>
          </Radio>
        ))}
      </RadioGroup>
    </ScreenFrame>
  );
}

export function IntentStep() {
  const flow = useFlow();
  return (
    <ChoiceQuestion
      name="intent"
      eyebrow="Qualify · 1 of 4"
      title="What do you want from the club?"
      progress={25}
      value={flow.answers.intent}
      onChange={(value) => flow.setIntent(value as "play")}
      photo={IMAGES.fairway}
      options={[
        { id: "play", label: "Play", detail: "A round, or a few." },
        { id: "learn", label: "Learn", detail: "Coaching, and a clearer swing." },
        { id: "socialize", label: "Socialize", detail: "Friends, the clubhouse, an event." },
        { id: "compete", label: "Compete", detail: "Tournament prep and a serious plan." },
      ]}
    />
  );
}

export function ExperienceStep() {
  const flow = useFlow();
  return (
    <ChoiceQuestion
      name="experience"
      eyebrow="Qualify · 2 of 4"
      title="How much golf is already in your hands?"
      progress={50}
      value={flow.answers.experience}
      onChange={(value) => flow.setExperience(value as "new")}
      photo={IMAGES.swing}
      options={[
        { id: "new", label: "New", detail: "Never really played." },
        { id: "casual", label: "Casual", detail: "A few rounds, still finding it." },
        { id: "competitive", label: "Competitive", detail: "I keep a handicap." },
      ]}
    />
  );
}

export function PlaceStep() {
  const flow = useFlow();
  const visit = flow.step === "visit-place";
  return (
    <ChoiceQuestion
      name="place"
      eyebrow={visit ? "Reserve a visit · 1 of 3" : "Qualify · 3 of 4"}
      title="Where will you play?"
      progress={visit ? 33 : 75}
      value={flow.answers.place}
      onChange={(value) => flow.setPlace(value as "outdoor")}
      photo={IMAGES.green}
      options={[
        { id: "simulator", label: "A simulator bay", detail: "One session. $70, tax included. Midday is off-peak." },
        { id: "both", label: "Bay and a lesson", detail: "Practice, and time with a PGA professional." },
      ]}
    />
  );
}

export function CadenceStep() {
  const flow = useFlow();
  return (
    <ChoiceQuestion
      name="cadence"
      eyebrow="Qualify · 4 of 4"
      title="How often will you be here?"
      progress={100}
      value={flow.answers.cadence}
      onChange={(value) => flow.setCadence(value as "weekly")}
      photo={IMAGES.clubhouse}
      options={[
        { id: "occasional", label: "Once in a while", detail: "A visit, not a habit." },
        { id: "weekly", label: "Weekly", detail: "A standing part of the week." },
        { id: "live", label: "I live here", detail: "The club is the routine." },
      ]}
    />
  );
}

export function PartyStep() {
  const flow = useFlow();
  return (
    <ChoiceQuestion
      name="party"
      eyebrow="Reserve a visit · 2 of 3"
      title="How many people is this visit?"
      progress={66}
      value={flow.answers.party}
      onChange={(value) => flow.setParty(value as Party)}
      photo={IMAGES.fairway}
      options={[
        { id: "1", label: "Just me", detail: "One player." },
        { id: "2", label: "Two of us", detail: "A member and a guest, if you join." },
        { id: "4", label: "Four of us", detail: "A group in one bay. The session price is not per person." },
      ]}
    />
  );
}

export function RecommendStep() {
  const flow = useFlow();
  const planId = flow.plan ?? recommendedPlan(flow.answers);
  const plan = planById(planId);
  return (
    <ScreenFrame
      photo={IMAGES.green}
      footer={
        <div className="flex gap-3">
          <Button variant="ghost" onPress={flow.goBack}>Back</Button>
          <Button className={pill} onPress={flow.goNext}>Save this plan</Button>
        </div>
      }
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">Recommend</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tighter" data-testid="recommend-plan">{plan.name}</h1>
      <p className="mt-4 max-w-md leading-relaxed text-slate-600">{recommendReason(flow.answers, planId, flow.planHint)}</p>
      <ul className="mt-6 space-y-2 text-sm text-slate-700">
        {plan.includes.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-slate-500">{money(plan.monthly)} a month, tax included. No minimum term.</p>
      <p className="mt-3 max-w-md text-sm text-slate-500">
        Your answers are stored in this browser.
      </p>
      <OfferCard />
    </ScreenFrame>
  );
}

export function RegisterStep() {
  const flow = useFlow();
  const [profile, setProfile] = useState(flow.profile);
  return (
    <ScreenFrame
      photo={IMAGES.clubhouse}
      footer={<Button variant="ghost" onPress={flow.goBack}>Back</Button>}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">Commit · registration</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tighter">Save this plan.</h1>
      <p className="mt-3 max-w-md text-slate-600">The card is later. The first visit stays attached.</p>
      <Form
        className="mt-8 flex max-w-md flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          flow.setProfile(profile);
          flow.goNext();
        }}
      >
        <TextField isRequired name="firstName" value={profile.firstName} onChange={(value) => setProfile({ ...profile, firstName: value })}>
          <Label>First name</Label>
          <Input />
          <FieldError />
        </TextField>
        <TextField isRequired name="lastName" value={profile.lastName} onChange={(value) => setProfile({ ...profile, lastName: value })}>
          <Label>Last name</Label>
          <Input />
          <FieldError />
        </TextField>
        <TextField isRequired name="email" type="email" value={profile.email} onChange={(value) => setProfile({ ...profile, email: value })}>
          <Label>Email</Label>
          <Input />
          <FieldError />
        </TextField>
        <TextField
          isRequired
          name="mobile"
          value={profile.mobile}
          validate={(value) => (value.replace(/\D/g, "").length >= 7 ? null : "Enter a mobile number.")}
          onChange={(value) => setProfile({ ...profile, mobile: value })}
        >
          <Label>Mobile</Label>
          <Input />
          <FieldError />
        </TextField>
        <Button type="submit" className={pill}>Continue</Button>
      </Form>
      <OfferCard />
    </ScreenFrame>
  );
}

export function PlanStep() {
  const flow = useFlow();
  const selected = flow.plan ?? recommendedPlan(flow.answers);
  const plan = planById(selected);
  return (
    <ScreenFrame
      footer={
        <div className="flex gap-3">
          <Button variant="ghost" onPress={flow.goBack}>Back</Button>
          <Button className={pill} onPress={flow.goNext}>Continue to the visit</Button>
        </div>
      }
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">Commit · billing</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tighter">Month to month.</h1>
      <p className="mt-3 max-w-xl text-slate-600" data-testid="annual-price">
        {membershipLabel(plan, flow.term, flow.foursome)} is {money(membershipCharge(plan, flow.term, flow.foursome).amount)}, tax included. No minimum term.
      </p>
      <div className={`mt-6 grid gap-4 ${flow.layout === "web" ? "grid-cols-2" : ""}`}>
        {PLANS.map((item) => {
          const charge = membershipCharge(item, flow.term, flow.foursome);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => flow.setPlan(item.id)}
              className={`rounded-3xl border p-5 text-left ${selected === item.id ? "border-emerald-600" : "border-slate-200"}`}
            >
              <span className="text-base font-semibold text-ink">{item.name}</span>
              {item.id === recommendedPlan(flow.answers) && (
                <Chip className="ml-2" color="accent" variant="soft">
                  <Chip.Label>Match</Chip.Label>
                </Chip>
              )}
              <p className="mt-3 text-3xl font-semibold tracking-tight">{money(charge.amount)}</p>
              {charge.against && <p className="text-sm text-slate-500">against {money(charge.against)}</p>}
              <ul className="mt-4 space-y-1 text-sm text-slate-600">
                {item.includes.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-slate-500">{MEMBER_CANCEL}</p>
      <OfferCard />
    </ScreenFrame>
  );
}

const PRODUCTS: { id: Product; label: string; detail: string }[] = [
  { id: "simulator", label: "Bay session", detail: `${money(RATES.baySession)} tax included.` },
  { id: "coaching", label: "Lesson", detail: `30 minutes with a PGA professional. $100.` },
];

export function BookStep() {
  const flow = useFlow();
  const party = String(partyCount(flow.answers)) as Party;
  return (
    <ScreenFrame
      photo={IMAGES.fairway}
      footer={
        <div className="flex gap-3">
          <Button variant="ghost" onPress={flow.goBack}>Back</Button>
          <Button className={pill} isDisabled={!flow.product} onPress={flow.goNext}>Continue to pay</Button>
        </div>
      }
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">Book · {SATURDAY}</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tighter">The first visit.</h1>
      <p className="mt-3 text-slate-600">The time is held on this screen. It is not reserved until the card step is recorded.</p>
      <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Visit</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {PRODUCTS.map((item) => (
          <Button key={item.id} className={pill} variant={flow.product === item.id ? "primary" : "outline"} onPress={() => flow.setProduct(item.id)}>
            {item.label}
          </Button>
        ))}
      </div>
      <p className="mt-2 text-sm text-slate-500">{PRODUCTS.find((item) => item.id === flow.product)?.detail}</p>
      <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">People</p>
      <div className="mt-3 flex gap-2">
        {(["1", "2", "4"] as Party[]).map((size) => (
          <Button key={size} className="min-h-11 min-w-11 px-5 text-base font-semibold" variant={party === size ? "primary" : "outline"} onPress={() => flow.setParty(size)}>
            {size}
          </Button>
        ))}
      </div>
      <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Time</p>
      <RadioGroup className="mt-3" name="slot" value={flow.slotId} onChange={flow.setSlot}>
        {SLOTS.map((slot) => (
          <Radio key={slot.id} value={slot.id}>
            <Radio.Content>
              <Radio.Control>
                <Radio.Indicator />
              </Radio.Control>
              {slot.time}
            </Radio.Content>
            <Description>{slot.note}</Description>
          </Radio>
        ))}
      </RadioGroup>
      <OfferCard />
      <QuoteList includeVisit />
    </ScreenFrame>
  );
}

export function TimeStep() {
  const flow = useFlow();
  return (
    <ScreenFrame
      photo={IMAGES.green}
      footer={
        <div className="flex gap-3">
          <Button variant="ghost" onPress={flow.goBack}>Back</Button>
          <Button className={pill} onPress={flow.goNext}>Continue</Button>
        </div>
      }
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">Book · {SATURDAY}</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tighter">{productLabel(flow.product ?? "round")}</h1>
      <p className="mt-3 text-slate-600">{partyCount(flow.answers)} {partyCount(flow.answers) === 1 ? "person" : "people"}. Pick a time.</p>
      <RadioGroup className="mt-6" name="slot" value={flow.slotId} onChange={flow.setSlot}>
        {SLOTS.map((slot) => (
          <Radio key={slot.id} value={slot.id}>
            <Radio.Content>
              <Radio.Control>
                <Radio.Indicator />
              </Radio.Control>
              {slot.time}
            </Radio.Content>
            <Description>{slot.note}</Description>
          </Radio>
        ))}
      </RadioGroup>
      <OfferCard />
      <QuoteList includeVisit buying={false} />
    </ScreenFrame>
  );
}

export function GuestChoiceStep() {
  const flow = useFlow();
  const plan = planById(flow.plan ?? recommendedPlan(flow.answers));
  return (
    <ScreenFrame
      photo={IMAGES.clubhouse}
      footer={<Button variant="ghost" onPress={flow.goBack}>Back</Button>}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">Recommend</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tighter">Guest, or {plan.name}.</h1>
      <p className="mt-3 max-w-md text-slate-600">
        {SATURDAY} at {slotById(flow.slotId).time}. Pay the guest total, or join and this visit reprices.
      </p>
      <OfferCard />
      <div className={`mt-6 grid gap-4 ${flow.layout === "web" ? "grid-cols-2" : ""}`}>
        <div>
          <p className="text-sm font-semibold">Pay as a guest</p>
          <QuoteList includeVisit buying={false} />
          <Button className={`mt-4 ${pill}`} variant="outline" onPress={flow.chooseGuest}>Pay as a guest</Button>
        </div>
        <div>
          <p className="text-sm font-semibold">Join {plan.name}</p>
          <QuoteList includeVisit buying />
          <Button className={`mt-4 ${pill}`} onPress={flow.chooseJoin}>Join and reprice</Button>
        </div>
      </div>
    </ScreenFrame>
  );
}

export function PayStep() {
  const flow = useFlow();
  return (
    <ScreenFrame
      footer={<Button variant="ghost" onPress={flow.goBack}>Back</Button>}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">Pay</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tighter">Continue to checkout</h1>
      <p className="mt-3 max-w-md text-slate-600">
        Complete payment on the booking site. For help, call {NAP.phoneDisplay}.
      </p>
      <QuoteList includeVisit />
      <OfferCard />
      <CtaPair className="mt-8">
        {flow.buyingMembership ? (
          <MembershipLink className="w-full">Continue to membership</MembershipLink>
        ) : (
          <BookLink className="w-full" offer={flow.product === "coaching" ? "lesson" : "bay"}>
            Continue to booking
          </BookLink>
        )}
        <Button className={`w-full ${pill}`} variant="outline" onPress={flow.finishHandoff}>
          Show the confirmation copy
        </Button>
      </CtaPair>
    </ScreenFrame>
  );
}

export function ConfirmStep() {
  const flow = useFlow();
  const priced = quote({
    buyingMembership: flow.buyingMembership,
    term: flow.term,
    foursome: flow.foursome,
    plan: flow.plan,
    product: flow.product,
    acceptPack: flow.acceptPack,
    answers: flow.answers,
    includeVisit: true,
  });
  const note = receipt(flow.offerState, priced.total, flow.cardLast4);
  const later = laterNotes(flow.offerState);
  const slot = slotById(flow.slotId);
  return (
    <ScreenFrame photo={IMAGES.hero}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">Confirm</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tighter">You're booked at Par2Play.</h1>
      <p className="mt-3 max-w-md text-sm text-slate-500">
        Payment is handled by our booking site.
      </p>
      <p className="mt-3 text-slate-600">
        {flow.profile.firstName || "Guest"} · {SATURDAY} at {slot.time} · {productLabel(flow.product ?? "round")} · {money(priced.total)}
        {flow.cardLast4 ? ` · card ending ${flow.cardLast4}` : ""}
      </p>
      <QuoteList includeVisit />
      <div className="mt-8 max-w-xl space-y-4">
        <article className="rounded-3xl border border-slate-200 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">Email · receipt</p>
          <p className="mt-2 text-sm leading-relaxed">{note.email}</p>
        </article>
        <article className="rounded-3xl border border-slate-200 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">SMS · receipt</p>
          <p className="mt-2 text-sm leading-relaxed">{note.sms}</p>
        </article>
      </div>
      <h2 className="mt-10 text-2xl font-semibold tracking-tight">What happens next</h2>
      <div className="mt-4 space-y-4" data-testid="later-messages">
        {later.map((item) => (
          <article key={item.id} className="rounded-3xl bg-slate-50 p-5">
            <p className="text-sm font-semibold">{item.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.email}</p>
            <p className="mt-2 text-sm text-slate-500">{item.sms}</p>
          </article>
        ))}
      </div>
      <div className="mt-8 flex gap-3">
        <Button className={pill} onPress={flow.goHome}>Back to Par2Play</Button>
      </div>
    </ScreenFrame>
  );
}
