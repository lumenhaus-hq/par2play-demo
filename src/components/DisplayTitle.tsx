import { useId } from "react";

type Tag = "h1" | "h2";

/** Hand underline, drawn once. Decorative — the word stays in the accessible name. */
function Swoosh() {
  return (
    <svg className="display-swoosh" viewBox="0 0 120 14" aria-hidden="true" focusable="false">
      <path
        className="display-swoosh__stroke"
        pathLength={1}
        d="M2 9 C 22 2, 48 13, 68 6 S 102 3, 118 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Display lockup: one word in marker with a lime swoosh, like the hero's
 * "all golfers." The full string stays the heading's accessible name.
 */
export function DisplayTitle({
  as,
  id,
  className = "",
  text,
  accent,
}: {
  as: Tag;
  id?: string;
  className?: string;
  text: string;
  accent: string;
}) {
  const TagName = as;
  const labelId = useId();
  const at = text.toLowerCase().indexOf(accent.toLowerCase());
  const before = at >= 0 ? text.slice(0, at) : text;
  const hit = at >= 0 ? text.slice(at, at + accent.length) : "";
  const after = at >= 0 ? text.slice(at + accent.length) : "";

  return (
    <TagName id={id} className={`display-title ${className}`} aria-labelledby={labelId}>
      <span id={labelId} className="sr-only">
        {text}
      </span>
      <span aria-hidden="true">
        {before}
        {hit ? (
          <span className="display-title__accent">
            {hit}
            <Swoosh />
          </span>
        ) : null}
        {after}
      </span>
    </TagName>
  );
}
