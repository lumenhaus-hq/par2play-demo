type Tag = "h1" | "h2";

/**
 * One Archivo line. The heading's only text node is the full title, so the
 * accessible name matches what is on screen.
 */
export function DisplayTitle({
  as,
  id,
  className = "",
  text,
}: {
  as: Tag;
  id?: string;
  className?: string;
  text: string;
}) {
  const TagName = as;
  return (
    <TagName id={id} className={`display-title ${className}`}>
      {text}
    </TagName>
  );
}
