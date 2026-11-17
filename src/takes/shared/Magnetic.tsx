import {
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { useFinePointer } from "./useFinePointer";

/**
 * Pulls toward the pointer on hover. Strength is a fraction of the offset.
 * Disabled for reduced motion and coarse pointers.
 */
export function Magnetic({
  children,
  className = "",
  strength = 0.32,
  as: Tag = "div",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: "div" | "span";
} & Omit<HTMLAttributes<HTMLElement>, "children" | "className" | "onMouseMove" | "onMouseLeave">) {
  const ref = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  const fine = useFinePointer();
  const live = fine && !reduce;

  const onMove = (event: MouseEvent<HTMLElement>) => {
    if (!live || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    const x = event.clientX - box.left - box.width / 2;
    const y = event.clientY - box.top - box.height / 2;
    ref.current.style.setProperty("--mx", `${x * strength}px`);
    ref.current.style.setProperty("--my", `${y * strength}px`);
  };

  const onLeave = () => {
    if (!ref.current) return;
    ref.current.style.setProperty("--mx", "0px");
    ref.current.style.setProperty("--my", "0px");
  };

  return (
    <Tag
      ref={ref as never}
      className={`take-magnetic ${className}`}
      style={{ "--mx": "0px", "--my": "0px" } as CSSProperties}
      data-magnetic=""
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...rest}
    >
      {children}
    </Tag>
  );
}
