import { useSyncExternalStore } from "react";

const STORAGE_KEY = "par2play-motion";

type MotionSnapshot = {
  osReduce: boolean;
  userPaused: boolean;
  /** OS reduced-motion or the visitor paused motion. */
  reduce: boolean;
};

const listeners = new Set<() => void>();
const serverSnapshot: MotionSnapshot = { osReduce: false, userPaused: false, reduce: false };
let cached: MotionSnapshot = serverSnapshot;

function readUserPaused(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "paused";
  } catch {
    return false;
  }
}

function writeUserPaused(paused: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, paused ? "paused" : "live");
  } catch {
    /* private mode */
  }
}

function osReduceNow(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function compute(): MotionSnapshot {
  const osReduce = osReduceNow();
  const userPaused = readUserPaused();
  return { osReduce, userPaused, reduce: osReduce || userPaused };
}

function syncDocumentClass(next: MotionSnapshot) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("motion-paused", next.userPaused && !next.osReduce);
}

function same(a: MotionSnapshot, b: MotionSnapshot) {
  return a.osReduce === b.osReduce && a.userPaused === b.userPaused && a.reduce === b.reduce;
}

function getSnapshot(): MotionSnapshot {
  const next = compute();
  if (same(cached, next)) return cached;
  cached = next;
  return cached;
}

function emit() {
  const next = compute();
  if (!same(cached, next)) cached = next;
  syncDocumentClass(cached);
  for (const listener of listeners) listener();
}

let mediaBound = false;

function bindMedia() {
  if (mediaBound || typeof window === "undefined") return;
  mediaBound = true;
  cached = compute();
  syncDocumentClass(cached);
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", emit);
}

function subscribe(listener: () => void) {
  bindMedia();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Effective reduced motion: OS preference or the visitor's Pause motion control. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, () => getSnapshot().reduce, () => serverSnapshot.reduce);
}

export function useMotionControl(): {
  osReduce: boolean;
  userPaused: boolean;
  reduce: boolean;
  canToggle: boolean;
  toggle: () => void;
} {
  const state = useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);
  return {
    osReduce: state.osReduce,
    userPaused: state.userPaused,
    reduce: state.reduce,
    canToggle: !state.osReduce,
    toggle: () => {
      if (osReduceNow()) return;
      writeUserPaused(!readUserPaused());
      emit();
    },
  };
}
