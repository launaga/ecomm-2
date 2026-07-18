import { site, type OpeningHour } from '@/config/site';

/**
 * Open/closed computation (PRD F-G5).
 *
 * Shared by the server (initial render) and client (hydration refresh).
 * "now" is injected so the same logic runs in both places and can be tested.
 */

export interface OpenState {
  isOpen: boolean;
  /** e.g. "Buka sekarang" or "Tutup — buka lagi Senin 08:00" */
  label: string;
  /** Short status word for badges */
  short: 'Buka' | 'Tutup';
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Get the wall-clock day-of-week + minutes-of-day for the workshop's timezone.
 * Uses Intl so it is correct regardless of where the build or browser runs.
 */
export function nowInWorkshopTz(now: Date = new Date()): {
  day: number;
  minutes: number;
} {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: site.timezone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now);

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const weekday = parts.find((p) => p.type === 'weekday')?.value ?? 'Sun';
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? '0') % 24;
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? '0');

  return { day: weekdayMap[weekday] ?? 0, minutes: hour * 60 + minute };
}

function hoursFor(day: number): OpeningHour | undefined {
  return site.hours.find((h) => h.day === day);
}

/** Find the next day (searching forward up to a week) that has opening hours. */
function nextOpenDay(fromDay: number): OpeningHour | null {
  for (let i = 1; i <= 7; i++) {
    const d = (fromDay + i) % 7;
    const h = hoursFor(d);
    if (h && h.open) return h;
  }
  return null;
}

export function getOpenState(now: Date = new Date()): OpenState {
  const { day, minutes } = nowInWorkshopTz(now);
  const today = hoursFor(day);

  if (today && today.open && today.close) {
    const open = toMinutes(today.open);
    const close = toMinutes(today.close);
    if (minutes >= open && minutes < close) {
      return { isOpen: true, short: 'Buka', label: 'Buka sekarang' };
    }
    // Before opening today
    if (minutes < open) {
      return {
        isOpen: false,
        short: 'Tutup',
        label: `Tutup — buka lagi ${today.label} ${today.open}`,
      };
    }
  }

  // Closed for the rest of today; find next open day.
  const next = nextOpenDay(day);
  if (next && next.open) {
    return {
      isOpen: false,
      short: 'Tutup',
      label: `Tutup — buka lagi ${next.label} ${next.open}`,
    };
  }

  return { isOpen: false, short: 'Tutup', label: 'Tutup' };
}
