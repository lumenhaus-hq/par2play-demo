import { Menu, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { buttonFocus } from "./Cta";

export type SiteMenuItem = {
  slug: string;
  label: string;
  href: string;
  current: boolean;
};

export function SiteMenu({
  items,
  linkClass,
  className = "",
  panelClass = "border-b border-ink/10 bg-paper text-ink shadow-[0_16px_40px_rgb(10_15_11/0.12)]",
}: {
  items: readonly SiteMenuItem[];
  linkClass: string;
  className?: string;
  panelClass?: string;
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const button = buttonRef.current;
    const panel = panelRef.current;
    const focusable = () => {
      const links = panel ? [...panel.querySelectorAll<HTMLElement>("a[href]")] : [];
      return button ? [button, ...links] : links;
    };
    focusable()[1]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        button?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const nodes = focusable();
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (!first || !last) return;
      const active = document.activeElement;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={`inline-flex size-11 shrink-0 items-center justify-center rounded-full ${buttonFocus} ${className}`}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
      </button>
      {open ? (
        <nav
          ref={panelRef}
          id={panelId}
          className={`absolute inset-x-0 top-full z-40 flex flex-col items-start gap-1 px-6 py-3 ${panelClass}`}
          aria-label="Page"
          data-cta-location="menu"
        >
          {items.map((item) => (
            <a
              key={item.slug}
              href={item.href}
              className={linkClass}
              aria-current={item.current ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      ) : null}
    </>
  );
}
