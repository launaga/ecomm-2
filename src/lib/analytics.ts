/**
 * Lightweight, cookieless-friendly event dispatch (PRD §3, §10).
 *
 * Any element with `data-analytics="<event>"` fires that GA4 event on click,
 * automatically attaching `source_page` and any `data-*` extras
 * (e.g. data-source, data-product-id). No GA library is required for this to
 * run — if gtag isn't present the events are simply queued on dataLayer, so
 * wiring GA4 later is a one-line change (see BaseLayout).
 */
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const RESERVED = new Set(['analytics']);

export function initAnalytics(): void {
  document.addEventListener(
    'click',
    (e) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        '[data-analytics]',
      );
      if (!el) return;

      const event = el.dataset.analytics;
      if (!event) return;

      const params: Record<string, string> = {
        source_page: location.pathname,
      };
      for (const [key, value] of Object.entries(el.dataset)) {
        if (RESERVED.has(key) || value == null) continue;
        params[key] = value;
      }

      if (typeof window.gtag === 'function') {
        window.gtag('event', event, params);
      } else {
        (window.dataLayer ||= []).push({ event, ...params });
      }
    },
    { capture: true },
  );
}

export {};
