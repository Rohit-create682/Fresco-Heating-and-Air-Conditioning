/* Tiny display helpers shared by the site, admin and emails. */

// The form gives us "2026-11-30". Customers should read "Mon, Nov 30, 2026".
// Parsed by hand instead of `new Date(s)` because the Date constructor treats
// a bare date as UTC midnight, which lands on the previous day in US timezones.
export function formatPreferredDate(s: string): string {
  const parts = s.split("-").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return s;
  const [y, m, d] = parts;
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
