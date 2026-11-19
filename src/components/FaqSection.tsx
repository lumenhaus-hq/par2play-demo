import { useState } from "react";
import { FAQS } from "../data/schema";
import { buttonFocus } from "./Cta";

export function FaqSection() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="px-6 py-16 @3xl:px-12" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="font-display text-3xl font-semibold tracking-tight @3xl:text-4xl">
        Questions about Par2Play
      </h2>
      <div className="mt-6 max-w-3xl divide-y divide-[#0A0F0B]/15 border-y border-ink/15">
        {FAQS.map((item, index) => {
          const shown = open === index;
          return (
            <div key={item.question}>
              <h3>
                <button
                  type="button"
                  className={`flex min-h-11 w-full items-center justify-between gap-4 py-3 text-left text-lg font-semibold ${buttonFocus}`}
                  aria-expanded={shown}
                  onClick={() => setOpen(shown ? -1 : index)}
                >
                  {item.question}
                  <span aria-hidden="true">{shown ? "–" : "+"}</span>
                </button>
              </h3>
              <p className={`pb-4 text-lg leading-relaxed${shown ? "" : " sr-only"}`} suppressHydrationWarning>
                {item.answer}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
