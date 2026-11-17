import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/** Word-stagger reveal tied to scroll enter (or immediate on mount). */
export function SplitLine({
  children,
  className = "",
  as: Tag = "p",
  immediate = false,
  stagger = 0.045,
}: {
  children: string;
  className?: string;
  as?: "p" | "h1" | "h2" | "h3" | "span";
  immediate?: boolean;
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  const words = children.trim().split(/\s+/);

  useEffect(() => {
    const root = ref.current;
    if (!root || reduce) return;
    const nodes = root.querySelectorAll<HTMLElement>("[data-word]");
    const tween = gsap.fromTo(
      nodes,
      { yPercent: 110, rotateX: -50, opacity: 0 },
      {
        yPercent: 0,
        rotateX: 0,
        opacity: 1,
        duration: 0.9,
        stagger,
        ease: "power3.out",
        ...(immediate
          ? {}
          : {
              scrollTrigger: {
                trigger: root,
                start: "top 85%",
                once: true,
              },
            }),
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [children, immediate, reduce, stagger]);

  return (
    <Tag ref={ref as never} className={`take-split ${className}`}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="take-split__mask">
          <span data-word className="take-split__word">
            {word}
            {index < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}

export function TakeEyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`take-eyebrow ${className}`}>{children}</p>;
}
