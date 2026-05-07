// components/scroll-backdrop.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import type Lenis from 'lenis';

const TOTAL_FRAMES = 600;
const FRAMES_PER_CLIP = 120;

// Eager-load strategy (R2.5 follow-up): drop V2's proximity-window +
// LRU-evict scheme entirely. The "smart" loader meant fast scrollers
// would hit blank canvas mid-page when the loader couldn't keep up.
//
// Now: small blocking preload to get the canvas painting quickly, then
// fire EVERY remaining frame in the background with bounded concurrency.
// After ~10-30s on a normal connection the entire 600-frame timelapse is
// in memory and the experience is bulletproof regardless of scroll speed.
//
// Cache grows monotonically — no eviction, no maintenance loop. With WebP
// at ~50-100 KB/frame this peaks at ~30-60 MB resident memory; well under
// the budget for a marketing-site canvas where the visual IS the product.
const INITIAL_PRELOAD = 12;          // blocking — canvas can paint after this
const BACKGROUND_PARALLELISM = 8;    // concurrent fetches in the background

// Mobile breakpoint and frame step (every-4th-frame on mobile cuts the
// payload from 600 → 150 frames, ~7-15 MB).
const MOBILE_BREAKPOINT = 768;
const MOBILE_FRAME_STEP = 4;

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

// Snap a frame index to the mobile-allowed values (multiples of 4)
function snapToStep(frame: number, isMobile: boolean): number {
  if (!isMobile) return Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(frame)));
  const stepped = Math.round(frame / MOBILE_FRAME_STEP) * MOBILE_FRAME_STEP;
  return Math.max(0, Math.min(TOTAL_FRAMES - 1, stepped));
}

export function ScrollBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
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

  // Single-frame loader with WebP fallback on AVIF failure.
  // Resolves to the loaded HTMLImageElement, or null on hard failure.
  const loadFrame = (index: number): Promise<HTMLImageElement | null> => {
    const cache = cacheRef.current;
    const cached = cache.get(index);
    if (cached) return Promise.resolve(cached);
    if (inFlightRef.current.has(index)) {
      // Another caller already requested it; poll the cache until it lands.
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          const c = cache.get(index);
          if (c) {
            clearInterval(checkInterval);
            resolve(c);
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
        cache.set(index, img);
        inFlightRef.current.delete(index);
        resolve(img);
      };
      img.onerror = () => {
        if (formatRef.current === 'avif') {
          // AVIF detection said we should use AVIF but the URL 404'd —
          // try WebP for this single frame.
          const fallback = new Image();
          fallback.onload = () => {
            cache.set(index, fallback);
            inFlightRef.current.delete(index);
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

  // Build the full list of frames we want to load (respects mobile step).
  function buildFrameList(isMobile: boolean): number[] {
    const list: number[] = [];
    const step = isMobile ? MOBILE_FRAME_STEP : 1;
    for (let i = 0; i < TOTAL_FRAMES; i += step) list.push(i);
    return list;
  }

  // Initial blocking preload + background full-load.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (reducedMotion) {
      // Reduced motion: load only the last frame statically.
      loadFrame(TOTAL_FRAMES - 1).then(() => setReady(true));
      return;
    }

    let cancelled = false;

    async function bootstrap() {
      const isMobile = isMobileRef.current;
      const allFrames = buildFrameList(isMobile);
      const step = isMobile ? MOBILE_FRAME_STEP : 1;

      // 1) Blocking preload — first INITIAL_PRELOAD frames in parallel.
      //    On mobile this is INITIAL_PRELOAD / step frames (e.g. 12 → 3 actual).
      const initialBatch: Promise<HTMLImageElement | null>[] = [];
      for (let i = 0; i < INITIAL_PRELOAD; i += step) {
        if (i >= TOTAL_FRAMES) break;
        initialBatch.push(loadFrame(i));
      }
      await Promise.all(initialBatch);
      if (cancelled) return;
      setReady(true);

      // 2) Background full-load — fetch every remaining frame, bounded
      //    concurrency. Sequential through the timeline so frames the
      //    user is most likely to scroll to next are cached first.
      const remaining = allFrames.filter((idx) => !cacheRef.current.has(idx));
      let cursor = 0;

      async function worker() {
        while (!cancelled && cursor < remaining.length) {
          const idx = remaining[cursor++];
          // remaining indices were captured at start; might already
          // be cached (e.g. if a worker raced ahead). loadFrame dedupes.
          await loadFrame(idx);
        }
      }

      const workers: Promise<void>[] = [];
      for (let w = 0; w < BACKGROUND_PARALLELISM; w++) workers.push(worker());
      await Promise.all(workers);
    }

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, [reducedMotion]);

  // Canvas resize handling
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

  // Draw — adds nearest-frame fallback for missing frames (still useful
  // during the brief window between INITIAL_PRELOAD finishing and the
  // background load completing).
  const drawFrame = (rawIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const index = snapToStep(rawIndex, isMobileRef.current);
    const cache = cacheRef.current;
    let img = cache.get(index);
    if (!img) {
      // Find nearest loaded frame within ±60
      for (let offset = 1; offset < 60; offset++) {
        const lo = cache.get(index - offset);
        if (lo) { img = lo; break; }
        const hi = cache.get(index + offset);
        if (hi) { img = hi; break; }
      }
      if (!img) return;
    }
    drawImageCover(ctx, img, canvas);
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

  // Scroll listener + lerp animation
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
