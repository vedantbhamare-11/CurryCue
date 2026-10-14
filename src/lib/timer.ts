// Countdown maths for the cooking timer. A timer is an end time on the real clock, not a number that a
// setInterval keeps subtracting from: browsers throttle or fully suspend timers in background tabs and on locked
// phones, so a ticking counter falls behind while the clock does not. Pure (no React, no Date.now inside) for tests.

// Whole seconds left, rounded up so "0:01" shows until the very end and 0 means really finished. Never negative.
export function remainingSeconds(endAt: number, now: number): number {
  const ms = endAt - now;
  return Number.isFinite(ms) && ms > 0 ? Math.ceil(ms / 1000) : 0;
}
