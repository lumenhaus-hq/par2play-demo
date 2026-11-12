import { BG_LOOP } from "../data/media";

const STORAGE_KEY = "par2play-sound";
const FADE_SECONDS = 1;
const GESTURES = ["pointerdown", "keydown", "touchstart", "scroll"] as const;

type Snapshot = {
  enabled: boolean;
  live: boolean;
};

type Listener = () => void;

let suppressAuto = readStoredChoice() === "off";
let enabled = !suppressAuto;
let live = false;
let heroInView = true;
let video: HTMLVideoElement | null = null;
let ctx: AudioContext | null = null;
let bgGain: GainNode | null = null;
let bgSource: AudioBufferSourceNode | null = null;
let buffer: AudioBuffer | null = null;
let loading: Promise<void> | null = null;
let videoFade = 0;
let bootToken = 0;
let attemptStarted = false;
let armed = false;
const listeners = new Set<Listener>();

function readStoredChoice(): "on" | "off" | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === "on" || value === "off") return value;
    return null;
  } catch {
    return null;
  }
}

function emit() {
  for (const listener of listeners) listener();
}

function remember(next: boolean) {
  enabled = next;
  suppressAuto = !next;
  try {
    localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
  } catch {
    /* Private mode can block storage. The button still works for this visit. */
  }
  emit();
}

export function getSoundSnapshot(): Snapshot {
  return { enabled, live };
}

export function subscribeSound(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function isSoundControl(event: Event) {
  const target = event.target;
  if (!(target instanceof Node)) return false;
  const element = target instanceof Element ? target : target.parentElement;
  return Boolean(element?.closest("[data-sound-toggle]"));
}

function onGesture(event: Event) {
  if (!event.isTrusted || isSoundControl(event)) return;
  if (suppressAuto) {
    disarm();
    return;
  }
  if (live) {
    disarm();
    void ctx?.resume();
    ensureLoop();
    return;
  }
  activateSound();
}

function armGesture() {
  if (armed || suppressAuto) return;
  armed = true;
  for (const type of GESTURES) {
    window.addEventListener(type, onGesture, true);
  }
  emit();
}

function disarm() {
  if (!armed) return;
  armed = false;
  for (const type of GESTURES) {
    window.removeEventListener(type, onGesture, true);
  }
  emit();
}

export function registerHeroVideo(element: HTMLVideoElement | null) {
  video = element;
  if (!element) {
    bootToken += 1;
    if (!live) attemptStarted = false;
    return;
  }
  if (suppressAuto) {
    element.muted = true;
    void element.play().catch(() => undefined);
    return;
  }
  if (live) {
    element.muted = false;
    element.volume = heroInView ? 1 : 0;
    void element.play().catch(() => undefined);
    return;
  }
  if (attemptStarted) return;
  attemptStarted = true;
  void attemptUnmuted(element);
}

export function setHeroInView(inView: boolean) {
  if (heroInView === inView) return;
  heroInView = inView;
  if (live) applyFade();
}

export function bindHeroWatch(id: string, root: Element | null) {
  const hero = document.getElementById(id);
  if (!hero) return () => undefined;
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry) return;
      setHeroInView(entry.isIntersecting);
    },
    { root, threshold: 0 },
  );
  observer.observe(hero);
  return () => observer.disconnect();
}

function syncHeroInView() {
  const element = video;
  if (!element) return;
  const rect = element.getBoundingClientRect();
  const height = window.innerHeight || document.documentElement.clientHeight;
  heroInView = rect.bottom > 0 && rect.top < height;
}

function heroAudible() {
  return live && video !== null && heroInView;
}

function bgAudible() {
  if (!live) return false;
  if (!video) return true;
  return !heroInView;
}

function applyFade() {
  fadeVideo(heroAudible() ? 1 : 0);
  fadeBg(bgAudible() ? 1 : 0);
}

function fadeVideo(target: number) {
  const element = video;
  if (!element) return;
  const from = element.volume;
  const started = performance.now();
  const token = ++videoFade;
  const step = (now: number) => {
    if (token !== videoFade || video !== element) return;
    const progress = Math.min(1, (now - started) / (FADE_SECONDS * 1000));
    element.volume = from + (target - from) * progress;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function fadeBg(target: number) {
  if (!ctx || !bgGain) return;
  const now = ctx.currentTime;
  const gain = bgGain.gain;
  gain.cancelScheduledValues(now);
  gain.setValueAtTime(gain.value, now);
  gain.linearRampToValueAtTime(target, now + FADE_SECONDS);
}

function startBg(audio: AudioBuffer) {
  if (!ctx || !bgGain || !live) return;
  if (bgSource) {
    try {
      bgSource.stop();
    } catch {
      /* Already stopped. */
    }
    bgSource = null;
  }
  const source = ctx.createBufferSource();
  source.buffer = audio;
  source.loop = true;
  source.connect(bgGain);
  source.start();
  bgSource = source;
}

async function decodeLoop(context: AudioContext, url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(url);
  const data = await response.arrayBuffer();
  return context.decodeAudioData(data.slice(0));
}

function ensureContext() {
  const AudioCtx = window.AudioContext;
  if (!ctx) ctx = new AudioCtx();
  if (!bgGain) {
    bgGain = ctx.createGain();
    bgGain.gain.value = 0;
    bgGain.connect(ctx.destination);
  }
  bindVisibility();
}

function ensureLoop() {
  if (!ctx || !live) return;
  if (buffer) {
    startBg(buffer);
    applyFade();
    return;
  }
  if (loading) return;
  const context = ctx;
  loading = (async () => {
    try {
      buffer = await decodeLoop(context, BG_LOOP.m4a);
    } catch (error) {
      console.error("Background loop failed to decode", BG_LOOP.m4a, error);
      try {
        buffer = await decodeLoop(context, BG_LOOP.mp3);
      } catch (fallbackError) {
        console.error("Background loop failed to decode", BG_LOOP.mp3, fallbackError);
        throw fallbackError;
      }
    }
    if (!live) return;
    startBg(buffer);
    applyFade();
  })().catch(() => {
    loading = null;
  });
}

function onVisibility() {
  if (!ctx || !live) return;
  if (document.hidden) void ctx.suspend();
  else void ctx.resume();
}

let visibilityBound = false;

function bindVisibility() {
  if (visibilityBound) return;
  visibilityBound = true;
  document.addEventListener("visibilitychange", onVisibility);
}

function commitLive() {
  live = true;
  enabled = true;
  ensureContext();
  void ctx?.resume().then(() => {
    if (!live || suppressAuto) return;
    ensureLoop();
    applyFade();
    if (ctx?.state === "running") disarm();
    else armGesture();
  });
  ensureLoop();
  applyFade();
  emit();
}

/**
 * Try the hero unmuted. If that play() is rejected, fall back to muted
 * playback and wait for the first real gesture.
 */
async function attemptUnmuted(element: HTMLVideoElement) {
  const token = bootToken;
  element.muted = false;
  element.volume = 1;
  try {
    await element.play();
  } catch {
    if (token !== bootToken || video !== element || suppressAuto || live) return;
    element.muted = true;
    try {
      await element.play();
    } catch {
      /* The element can disappear before muted playback starts. */
    }
    if (token !== bootToken || video !== element || suppressAuto || live) return;
    armGesture();
    emit();
    return;
  }
  if (token !== bootToken || video !== element || suppressAuto) return;
  commitLive();
}

/** Reduced motion has no hero video. Still try the background loop. */
export function bootAmbient() {
  if (suppressAuto || live || video || attemptStarted) return;
  attemptStarted = true;
  ensureContext();
  void ctx?.resume().then(() => {
    if (suppressAuto || live) return;
    if (ctx?.state === "running") commitLive();
    else armGesture();
  });
}

/**
 * Starts playback inside one user gesture. Unmute, set the volume, then
 * play() before any await, so the browser still treats it as activation.
 */
export function activateSound() {
  bootToken += 1;
  suppressAuto = false;
  disarm();
  ensureContext();
  void ctx?.resume();
  syncHeroInView();
  live = true;
  const element = video;
  if (element) {
    element.muted = false;
    element.volume = heroInView ? 1 : 0;
    const played = element.play();
    if (played) {
      played.catch((error: unknown) => {
        console.error("Hero sound failed to play", error);
      });
    }
  }
  remember(true);
  applyFade();
  ensureLoop();
}

export function silenceSound() {
  suppressAuto = true;
  bootToken += 1;
  disarm();
  live = false;
  videoFade += 1;
  if (video) {
    video.muted = true;
    video.volume = 0;
  }
  if (bgGain && ctx) {
    const now = ctx.currentTime;
    bgGain.gain.cancelScheduledValues(now);
    bgGain.gain.setValueAtTime(0, now);
  }
  if (bgSource) {
    try {
      bgSource.stop();
    } catch {
      /* Already stopped. */
    }
    bgSource = null;
  }
  void ctx?.suspend();
  remember(false);
}

export function toggleSound() {
  if (!live) activateSound();
  else silenceSound();
}

export type SoundProbe = {
  live: boolean;
  muted: boolean;
  volume: number;
  paused: boolean;
  bgGain: number;
  armed: boolean;
  stored: "on" | "off" | null;
};

declare global {
  interface Window {
    __par2playSound?: () => SoundProbe;
  }
}

function readProbe(): SoundProbe {
  return {
    live,
    muted: video?.muted ?? true,
    volume: video?.volume ?? 0,
    paused: video?.paused ?? true,
    bgGain: bgGain?.gain.value ?? 0,
    armed,
    stored: readStoredChoice(),
  };
}

if (typeof window !== "undefined") {
  window.__par2playSound = readProbe;
}
