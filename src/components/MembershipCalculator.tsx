import { useState } from "react";
import { OfferSheet } from "./OfferSheet";
import { PriceInvoice } from "./PriceInvoice";
import { PRICES } from "../data/business";
import { membersPrice, money, type MembersPeriod } from "../data/membershipEstimate";

export function MembershipCalculator() {
  const [period, setPeriod] = useState<MembersPeriod>("month");
  const yearly = period === "year";
  const amount = membersPrice(period);
  const figure = yearly ? `${money(amount)}/yr` : `${money(amount)}/mo`;
  const monthly = `${money(PRICES.unlimitedMonthly)}/mo`;
  const live = yearly
    ? `Unlimited Practice. Members price ${figure}. Twelve months at ${monthly}.`
    : `Unlimited Practice. Members price ${figure}. Up to 1 hour a day.`;

  return (
    <OfferSheet
      id="why-membership"
      toggleLabel="Membership term"
      value={period}
      onChange={setPeriod}
      offer="practice-unlimited"
      options={[
        { value: "month", label: "Monthly", price: monthly },
        { value: "year", label: "Year", price: `${money(membersPrice("year"))}/yr` },
      ]}
      invoice={
        <PriceInvoice
          title="Unlimited Practice"
          rows={[
            { label: "Offer", value: yearly ? "Practice Unlimited" : "Practice Unlimited (monthly)" },
            { label: "Access", value: "Up to 1 hour a day" },
            { label: "Billing", value: yearly ? "Twelve months" : "Monthly" },
          ]}
          totalLabel={figure}
          totalCaption="Members price"
          membersPrice={amount}
          orderRef="ord_p2p_practice_unlimited"
          live={live}
          note={yearly ? `Twelve months at ${monthly}.` : "One plan. A bay hour, every day."}
        />
      }
    />
  );
}
