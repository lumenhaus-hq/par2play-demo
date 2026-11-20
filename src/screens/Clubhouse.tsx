import { Button, Card, Chip } from "@heroui/react";
import { useState, type FormEvent } from "react";
import { BookLink, CtaPair, buttonFocus, buttonFocusOnInk } from "../components/Cta";
import { Mark } from "../components/Chrome";
import { IMAGES } from "../data/catalog";
import { useFlow } from "../state/flow";

type Role = "All" | "Maestro" | "Regular" | "Rookie";

const BOARD = [
  { name: "Sam", role: "Maestro" as const, note: "Brought two people who booked their own hour" },
  { name: "Priya", role: "Regular" as const, note: "Paid her own Tuesday and brought a Rookie" },
  { name: "Jonah", role: "Rookie" as const, note: "First night. Books his own hour within 7 days" },
  { name: "Elena", role: "Regular" as const, note: "Four visits. The $200 plan is hers to take" },
  { name: "Chris", role: "Maestro" as const, note: "Confirms the roster and picks the hole" },
  { name: "Noor", role: "Rookie" as const, note: "Came with a friend. The screen keeps the score" },
];

export function Clubhouse() {
  const flow = useFlow();
  const [menu, setMenu] = useState(false);
  const [role, setRole] = useState<Role>("All");
  const [seat, setSeat] = useState<{ name: string } | null>(null);
  const [error, setError] = useState("");
  const lightNav = `inline-flex min-h-11 items-center text-base font-semibold text-white ${buttonFocus}`;
  const here = `inline-flex min-h-11 items-center text-base font-semibold text-accent ${buttonFocus}`;
  const rows = BOARD.filter((row) => role === "All" || row.role === role);

  function claim(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const mobile = String(data.get("mobile") ?? "").replace(/\D/g, "");
    if (name.length < 2 || mobile.length !== 10) {
      setError("Name and a 10-digit mobile. Then a host can text the seat.");
      setSeat(null);
      return;
    }
    setError("");
    setSeat({ name });
  }

  return (
    <div className={flow.layout === "mobile" ? "h-full overflow-y-auto bg-white" : "bg-white"}>
      <section className={`relative flex flex-col overflow-hidden bg-slate-900 text-white ${flow.layout === "web" ? "min-h-[760px]" : "min-h-[640px]"}`}>
        <img src={IMAGES.clubhouse} alt="A group of players and coaches posing in front of a Par2Play simulator" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
        <div className="relative z-10 flex items-center justify-between bg-ink px-5 py-4 lg:px-12">
          <Button variant="ghost" className="h-auto min-w-0 bg-transparent px-0" onPress={flow.goHome}>
            <Mark light />
          </Button>
          {flow.layout === "web" ? (
            <nav className="flex items-center gap-8">
              <button className={lightNav} type="button" onClick={flow.goHome}>Home</button>
              <button className={here} type="button" aria-current="page">Leagues</button>
              <button className={lightNav} type="button" onClick={() => flow.goSection("practice")}>Practice</button>
              <button className={lightNav} type="button" onClick={() => flow.goSection("coaching")}>Coaching</button>
              <button className={lightNav} type="button" onClick={() => flow.goSection("juniors")}>Juniors</button>
              <button className={lightNav} type="button" onClick={() => flow.goSection("venue")}>Venue</button>
              <BookLink offer="bay" tone="line">
                Reserve a bay
              </BookLink>
            </nav>
          ) : (
            <Button variant="ghost" className="min-h-11 px-4 text-base font-semibold text-white" onPress={() => setMenu((open) => !open)}>
              {menu ? "Close" : "Menu"}
            </Button>
          )}
        </div>
        {menu && flow.layout === "mobile" && (
          <nav className="relative z-10 flex flex-col items-start gap-1 bg-ink px-5 py-3 text-base font-semibold text-white">
            <button className={lightNav} type="button" onClick={() => { setMenu(false); flow.goHome(); }}>Home</button>
            <button className={here} type="button" aria-current="page">Leagues</button>
            <button className={lightNav} type="button" onClick={() => { setMenu(false); flow.goSection("practice"); }}>Practice</button>
            <button className={lightNav} type="button" onClick={() => { setMenu(false); flow.goSection("coaching"); }}>Coaching</button>
            <button className={lightNav} type="button" onClick={() => { setMenu(false); flow.goSection("juniors"); }}>Juniors</button>
            <button className={lightNav} type="button" onClick={() => { setMenu(false); flow.goSection("venue"); }}>Venue</button>
          </nav>
        )}
        <div className={`relative z-10 flex flex-1 flex-col justify-end px-6 pb-12 ${flow.layout === "web" ? "lg:px-12" : ""}`}>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/80">Par2Play Clubhouse · Somerset</p>
          <h1 className="mt-4 max-w-xl font-semibold tracking-tighter text-3xl lg:text-5xl">
            February league is coming.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/90">
            Format, dates, and price are not set. The board below is an example of a night, not a live roster and not an open signup.
          </p>
          <CtaPair className="mt-6">
            <a
              href="#seat"
              className={`inline-flex min-h-11 w-full items-center justify-center rounded-full bg-white px-5 text-base font-semibold text-ink ${buttonFocus}`}
            >
              Claim a seat
            </a>
            <BookLink className="w-full" offer="bay" tone="line">
              Reserve a bay
            </BookLink>
          </CtaPair>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-16">
        <p className="mb-8 max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950">
          The February league is not open. Format, dates, and price are TODO. The roster below is an example, not a live board.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-slate-200 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700">
            Somerset · 695 Hamilton Street, Suite G · (732) 448-2769
          </span>
          <span className="rounded-full border border-emerald-700 bg-emerald-700 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
            February · coming soon
          </span>
        </div>
        <div className={`mt-8 grid items-start gap-6 ${flow.layout === "web" ? "grid-cols-[1.4fr_0.8fr]" : ""}`}>
          <figure className="overflow-hidden rounded-2xl bg-slate-900">
            <img src={IMAGES.green} alt="A Full Swing bay at Par2Play" className="h-80 w-full object-cover" />
            <figcaption className="flex justify-between px-4 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-white/80">
              <span>One hole · screen on</span>
              <span>Team score</span>
            </figcaption>
          </figure>
          <div className="grid gap-3">
            {[
              ["The night", "Six players, clubs in the bay, one hole. Food is not served. Saturday stays on the rack."],
              ["The season", "Every other Tuesday. A host texts the hole and the time. No pitch during the swing."],
              ["Open seat", "A Rookie books their own hour within a week. Four visits, and the $200 plan is offered."],
            ].map(([title, copy]) => (
              <Card key={title} className="rounded-3xl border border-slate-200 bg-white shadow-none">
                <Card.Content className="p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">{title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{copy}</p>
                </Card.Content>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-[1100px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Example board</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tighter">Who is in the room</h2>
          <p className="mt-4 max-w-lg text-slate-500">Names below are examples, so the roles are easy to see. They are not live members.</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {(["All", "Maestro", "Regular", "Rookie"] as Role[]).map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={role === item}
                className={`inline-flex min-h-11 items-center rounded-full border-2 px-5 text-base font-semibold ${role === item ? `border-ink bg-ink text-white ${buttonFocusOnInk}` : `border-[#4b5563] bg-white text-ink ${buttonFocus}`}`}
                onClick={() => setRole(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <ul className="mt-6 divide-y divide-slate-200 overflow-hidden rounded-3xl border border-slate-200 bg-white">
            {rows.map((row) => (
              <li key={row.name} className="flex items-center justify-between gap-4 px-5 py-4">
                <div>
                  <p className="font-semibold text-slate-900">{row.name}</p>
                  <p className="text-sm text-slate-500">{row.note}</p>
                </div>
                <Chip className="bg-emerald-50 text-emerald-800" size="sm" variant="soft">
                  <Chip.Label>{row.role}</Chip.Label>
                </Chip>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`mx-auto grid max-w-[1400px] gap-5 px-6 py-20 ${flow.layout === "web" ? "grid-cols-2" : ""}`}>
        <Card className="rounded-3xl border border-slate-200 shadow-none">
          <Card.Content className="p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">New to the screen</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tighter">Come as a Rookie</h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              Your job that week is to book your own hour. Handicap stays off the card. The screen still scores the hole.
            </p>
          </Card.Content>
        </Card>
        <Card className="rounded-3xl border border-slate-200 shadow-none">
          <Card.Content className="p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Already paying</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tighter">Come as a Regular</h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              The $70 hour or the $200 month is the golf you already buy. What you cannot buy is Maestro: people you brought who came back.
            </p>
          </Card.Content>
        </Card>
      </section>

      <section className="bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-[1100px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400">Points</p>
          <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-tighter">Spend them on the next thing you already wanted</h2>
          <div className={`mt-10 grid gap-4 ${flow.layout === "web" ? "grid-cols-3" : ""}`}>
            {[
              ["Weekday guest hour", "A quiet hour for someone you bring. Saturday stays full price."],
              ["A lesson", "A 50-minute swing evaluation is $100, tax included. A 30-minute lesson is $100. The night itself stays about the hole."],
              ["Bay time", "Use points toward another hour on the simulator when you want more reps."],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-2xl border border-white/10 p-6">
                <p className="text-lg font-semibold">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="seat" className="scroll-mt-6 px-6 py-20">
        <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Open seat</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tighter">Tell a host you are coming</h2>
            <p className="mt-4 text-slate-500">This form stays in the browser and does not send. Call (732) 448-2769 about the February league.</p>
          </div>
          {seat ? (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
              <p className="text-lg font-semibold text-slate-900">{seat.name}, you're on the Tuesday list.</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">A host texts the hole and the time. No card tonight.</p>
            </div>
          ) : (
            <form className="space-y-3" onSubmit={claim}>
              <input name="name" required placeholder="Name" aria-label="Name" className="w-full rounded-full border border-slate-200 px-4 py-3 text-sm" />
              <input name="mobile" required inputMode="tel" placeholder="Mobile" aria-label="Mobile" className="w-full rounded-full border border-slate-200 px-4 py-3 text-sm" />
              <fieldset className="flex flex-wrap gap-4 px-2 text-sm text-slate-600">
                <label className="flex items-center gap-2">
                  <input type="radio" name="kind" value="new" defaultChecked /> I'm new
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="kind" value="bringing" /> I'm bringing someone
                </label>
              </fieldset>
              <Button type="submit" className="min-h-11 rounded-full px-5 text-base font-semibold">
                Claim a seat
              </Button>
              {error && <p className="text-sm text-red-700">{error}</p>}
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
