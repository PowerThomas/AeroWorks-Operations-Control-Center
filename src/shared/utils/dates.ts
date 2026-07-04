/** Formats an ISO date string as a short human-readable date (e.g. "Jul 4, 2026"). */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) {
    return "—"
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

/** Returns the whole number of days from `from` until `to` (negative if past). */
export function daysUntil(isoDate: string, now: Date): number {
  const target = new Date(isoDate)
  const msPerDay = 24 * 60 * 60 * 1000
  return Math.floor((target.getTime() - now.getTime()) / msPerDay)
}
