import { EventTypeIcon } from "./EventTypeIcons";
import { EVENT_TYPES } from "../data/events";

export function EventTypeList() {
  const count = EVENT_TYPES.length;
  const columns = count === 3 ? "grid-cols-3 gap-x-2 @3xl:grid-cols-3" : "grid-cols-2 @3xl:grid-cols-4";

  return (
    <ul className={`grid gap-x-4 gap-y-4 ${columns}`}>
      {EVENT_TYPES.map((item) => (
        <li key={item.id} className="flex items-start gap-2">
          <EventTypeIcon id={item.id} />
          <div className="min-w-0">
            <p className="text-base font-semibold leading-tight text-ink">{item.label}</p>
            <p className="mt-1 text-base leading-snug text-ink">{item.line}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
