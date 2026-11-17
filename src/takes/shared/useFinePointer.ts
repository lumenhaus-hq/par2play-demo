import { useSyncExternalStore } from "react";

function fineNow(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

let cached = false;
const listeners = new Set<() => void>();
let bound = false;

function emit() {
  const next = fineNow();
  if (next === cached) return;
  cached = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  if (!bound && typeof window !== "undefined") {
    bound = true;
    cached = fineNow();
    window.matchMedia("(hover: hover) and (pointer: fine)").addEventListener("change", emit);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** True when a precise mouse/trackpad is available (skip custom cursors on touch). */
export function useFinePointer(): boolean {
  return useSyncExternalStore(subscribe, () => cached, () => false);
}
