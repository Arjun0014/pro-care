'use client';

// Per 16-EXTRA-PATTERNS.md § Component 12.
// Continuously-running DOHA HH:MM:SS in the nav, regardless of user location.
// Mobile: hidden by parent (`<768px` rule on the Nav). Reduced motion is
// inert here — the seconds tick is informational, not animation.

import { useEffect, useState } from 'react';

export function LiveClock() {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      hour:     '2-digit',
      minute:   '2-digit',
      second:   '2-digit',
      hour12:   false,
      timeZone: 'Asia/Qatar',
    });

    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span
      className="font-mono text-[10px] uppercase tracking-[0.2em] tabular-nums opacity-70"
      aria-label={`Current time in Doha, Qatar: ${time}`}
    >
      DOHA {time || '--:--:--'}
    </span>
  );
}
