// components/scroll-backdrop.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import type Lenis from 'lenis';

const TOTAL_FRAMES = 600;
const FRAMES_PER_CLIP = 120;

// V2: smaller initial blocking preload — just enough to cover the hero
const INITIAL_PRELOAD = 20;

// V2: proximity window around the target frame
const WINDOW_BEFORE = 30;
const WINDOW_AFTER = 50;

// V2: LRU cache size — evict oldest when over this
const MAX_CACHE_SIZE = 200;
const EVICTION_BATCH = 30;

// V2: mobile breakpoint and frame step
const MOBILE_BREAKPOINT = 768;
const MOBILE_FRAME_STEP = 4;

type CacheEntry = {
  img: HTMLImageElement;
  lastUsed: number;
};

function frameUrl(globalFrame: number, format: 'avif' | 'webp'): string {
  const clipIndex = Math.floor(globalFrame / FRAMES_PER_CLIP);
  const clipFrame = (globalFrame % FRAMES_PER_CLIP) + 1;
  const clipNum = clipIndex + 1;
  const padded = String(clipFrame).padStart(3, '0');
  return `/frames/clip${clipNum}_${padded}.${format}`;
}

function detectFormat(): 'avif' | 'webp' {
  if (typeof window === 'undefined') return 'webp';
  const canvas = document.createElement('canvas');
  if (canvas.toDataURL('image/avif').startsWith('data:image/avif')) return 'avif';
  return 'webp';
}

// V2: snap a frame index to the mobile-allowed values (multiples of 4)
function snapToStep(frame: number, isMobile: boolean): number {
  if (!isMobile) return Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(frame)));
  const stepped = Math.round(frame / MOBILE_FRAME_STEP) * MOBILE_FRAME_STEP;
  return Math.max(0, Math.min(TOTAL_FRAMES - 1, stepped));
}

// V2: list of frame indices that should be in cache around a target
function getWindowFrames(target: number, isMobile: boolean): number[] {
  const frames: number[] = [];
  const step = isMobile ? MOBILE_FRAME_STEP : 1;
  for (let offset = -WINDOW_BEFORE; offset <= WINDOW_AFTER; offset += step) {
    const idx = snapToStep(target + offset, isMobile);
    if (idx >= 0 && idx < TOTAL_FRAMES) {
      frames.push(idx);
    }
  }
  return Array.from(new Set(frames)).sort((a, b) => a - b);
}

export function ScrollBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cacheRef = useRef<Map<number, CacheEntry>>(new Map());
  const inFlightRef = useRef<Set<number>>(new Set());
  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const formatRef = useRef<'avif' | 'webp'>('webp');
  const isMobileRef = useRef<boolean>(false);
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Detect environment on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    formatRef.current = detectFormat();
    isMobileRef.current = window.innerWidth < MOBILE_BREAKPOINT;
  }, []);

  // Single-frame loader with WebP fallback on AVIF failure
  const loadFrame = (index: number): Promise<HTMLImageElement | null> => {
    const cache = cacheRef.current;
    const cached = cache.get(index);
    if (cached) {
      cached.lastUsed = performance.now();
      return Promise.resolve(cached.img);
    }
    if (inFlightRef.current.has(index)) {
      // Already requested; resolve when it lands
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          const c = cache.get(index);
          if (c) {
            clearInterval(checkInterval);
            resolve(c.img);
          } else if (!inFlightRef.current.has(index)) {
            clearInterval(checkInterval);
            resolve(null);
          }
        }, 50);
      });
    }

    inFlightRef.current.add(index);
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        cache.set(index, { img, lastUsed: performance.now() });
        inFlightRef.current.delete(index);
        // V2: trigger LRU eviction if over budget
        if (cache.size > MAX_CACHE_SIZE) evictOldest();
        resolve(img);
      };
      img.onerror = () => {
        if (formatRef.current === 'avif') {
          const fallback = new Image();
          fallback.onload = () => {
            cache.set(index, { img: fallback, lastUsed: performance.now() });
            inFlightRef.current.delete(index);
            if (cache.size > MAX_CACHE_SIZE) evictOldest();
            resolve(fallback);
          };
          fallback.onerror = () => {
            inFlightRef.current.delete(index);
            resolve(null);
          };
          fallback.src = frameUrl(index, 'webp');
        } else {
          inFlightRef.current.delete(index);
          resolve(null);
        }
      };
      img.src = frameUrl(index, formatRef.current);
    });
  };

  // V2: LRU eviction — drop oldest entries when over budget, keep current frame
  const evictOldest = () => {
    const cache = cacheRef.current;
    if (cache.size <= MAX_CACHE_SIZE) return;
    const protectedFrame = Math.round(currentFrameRef.current);
    const entries = Array.from(cache.entries())
      .filter(([idx]) => idx !== protectedFrame)
      .sort((a, b) => a[1].lastUsed - b[1].lastUsed);
    const toEvict = entries.slice(0, EVICTION_BATCH);
    for (const [idx] of toEvict) cache.delete(idx);
  };

  // V2: load frames in the proximity window around the target
  const loadWindow = async () => {
    const target = Math.round(targetFrameRef.current);
    const want = getWindowFrames(target, isMobileRef.current);
    // Prioritize frames closest to target first
    want.sort((a, b) => Math.abs(a - target) - Math.abs(b - target));
    // Fire all loads (loadFrame dedupes via inFlight set)
    await Promise.all(want.map((i) => loadFrame(i)));
  };

  // Initial preload + idle window maintenance
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (reducedMotion) {
      // Reduced motion: load only the last frame statically
      loadFrame(TOTAL_FRAMES - 1).then(() => setReady(true));
      return;
    }

    let cancelled = false;
    let idleHandle: number | null = null;

    async function bootstrap() {
      const isMobile = isMobileRef.current;
      const step = isMobile ? MOBILE_FRAME_STEP : 1;
      // V2: blocking preload of first 20 frames (or first 5 mobile frames = indices 0,4,8,12,16)
      const initial: Promise<HTMLImageElement | null>[] = [];
      for (let i = 0; i < INITIAL_PRELOAD; i += step) {
        if (i >= TOTAL_FRAMES) break;
        initial.push(loadFrame(i));
      }
      await Promise.all(initial);
      if (cancelled) return;
      setReady(true);
    }

    bootstrap();

    // V2: maintain window on idle ticks
    const scheduleWindowMaintenance = () => {
      if (cancelled) return;
      const run = () => {
        if (cancelled) return;
        loadWindow().finally(() => {
          if (!cancelled) {
            idleHandle = (window as Window & {
              requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
            }).requestIdleCallback
              ? (window as unknown as { requestIdleCallback: (cb: () => void, opts: { timeout: number }) => number })
                  .requestIdleCallback(scheduleWindowMaintenance, { timeout: 800 })
              : (setTimeout(scheduleWindowMaintenance, 200) as unknown as number);
          }
        });
      };
      run();
    };
    scheduleWindowMaintenance();

    return () => {
      cancelled = true;
      if (idleHandle !== null) {
        const w = window as Window & { cancelIdleCallback?: (h: number) => void };
        if (w.cancelIdleCallback) w.cancelIdleCallback(idleHandle);
        else clearTimeout(idleHandle as unknown as number);
      }
    };
  }, [reducedMotion]);

  // Canvas resize handling — unchanged from V1
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
      drawFrame(currentFrameRef.current);
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [ready]);

  // Draw — adds nearest-frame fallback for missing frames
  const drawFrame = (rawIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const index = snapToStep(rawIndex, isMobileRef.current);
    const cache = cacheRef.current;
    let entry = cache.get(index);
    if (!entry) {
      // Find nearest loaded frame within ±60
      for (let offset = 1; offset < 60; offset++) {
        if (cache.has(index - offset)) {
          entry = cache.get(index - offset);
          break;
        }
        if (cache.has(index + offset)) {
          entry = cache.get(index + offset);
          break;
        }
      }
      if (!entry) return;
    } else {
      entry.lastUsed = performance.now();
    }
    drawImageCover(ctx, entry.img, canvas);
  };

  const drawImageCover = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    canvas: HTMLCanvasElement,
  ) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = canvas.width / dpr;
    const ch = canvas.height / dpr;
    const ir = img.width / img.height;
    const cr = cw / ch;

    let dw, dh, dx, dy;
    if (ir > cr) {
      dh = ch;
      dw = ch * ir;
      dx = (cw - dw) / 2;
      dy = 0;
    } else {
      dw = cw;
      dh = cw / ir;
      dx = 0;
      dy = (ch - dh) / 2;
    }
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  };

  // Scroll listener + lerp animation — unchanged from V1
  useEffect(() => {
    if (!ready) return;
    if (reducedMotion) {
      drawFrame(TOTAL_FRAMES - 1);
      return;
    }

    let raf = 0;
    const tick = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.1) {
        currentFrameRef.current += diff * 0.18;
        drawFrame(currentFrameRef.current);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
      const target = progress * (TOTAL_FRAMES - 1);
      targetFrameRef.current = snapToStep(target, isMobileRef.current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    const lenis = (window as Window & { __lenis?: Lenis }).__lenis;
    if (lenis) lenis.on('scroll', handleScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', handleScroll);
      if (lenis) lenis.off('scroll', handleScroll);
    };
  }, [ready, reducedMotion]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
      {!ready && (
        <div
          className="absolute inset-0 bg-[--color-ink]"
          style={{
            backgroundImage: 'url(/frames/clip1_poster.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
    </div>
  );
}
