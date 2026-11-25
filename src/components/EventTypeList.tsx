import { EventTypeIcon } from "./EventTypeIcons";
import { EVENT_TYPES } from "../data/events";

export function EventTypeList() {
  const count = EVENT_TYPES.length;
  const columns = count === 3 ? "grid-cols-3 gap-x-2 @3xl:grid-cols-3" : "grid-cols-2 @3xl:grid-cols-4";

  return (
    <ul className={`grid gap-x-4 gap-y-4 ${columns}`}>
      {EVENT_TYPES.map((item) => (
        <li key={item.id} className="events-band__item flex items-start gap-3">
          <EventTypeIcon id={item.id} />
          <div className="min-w-0">
            <p className="events-band__item-title text-lg font-semibold leading-tight">{item.label}</p>
            <p className="events-band__item-line mt-1 text-base font-medium leading-snug">{item.line}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
