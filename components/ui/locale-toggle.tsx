'use client';

// Per 16-EXTRA-PATTERNS.md § Component 13.
// EN/AR toggle in the nav. V1 is UI scaffolding only — clicking AR shows a
// "coming soon" toast and reverts to EN. V2 will swap to next-intl with real
// Arabic content; the toggle structure stays.

import { useState } from 'react';

type Locale = 'en' | 'ar';

export function LocaleToggle() {
  const [locale, setLocale] = useState<Locale>('en');

  const handle = (next: Locale) => {
    if (next === locale) return;
    setLocale(next);
    if (next === 'ar') {
      if (typeof window === 'undefined') return;
      // V1: show inline toast and revert to EN.
      const t = document.createElement('div');
      t.textContent = 'Arabic version coming soon · النسخة العربية قريباً';
      t.className =
        'fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 ' +
        'bg-[var(--color-ink)] text-[var(--color-bone)] ' +
        'font-mono text-xs uppercase tracking-[0.2em] z-[200]';
      t.setAttribute('role', 'status');
      document.body.appendChild(t);
      window.setTimeout(() => {
        t.remove();
        setLocale('en');
      }, 2400);
    }
  };

  return (
    <div className="relative inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em]">
      <button
        type="button"
        data-cursor
        onClick={() => handle('en')}
        className={
          locale === 'en'
            ? 'opacity-100'
            : 'opacity-40 hover:opacity-70 transition-opacity'
        }
        aria-pressed={locale === 'en'}
      >
        EN
      </button>
      <span className="opacity-30">/</span>
      <button
        type="button"
        data-cursor
        onClick={() => handle('ar')}
        className={
          locale === 'ar'
            ? 'opacity-100'
            : 'opacity-40 hover:opacity-70 transition-opacity'
        }
        aria-pressed={locale === 'ar'}
      >
        AR
      </button>
    </div>
  );
}
