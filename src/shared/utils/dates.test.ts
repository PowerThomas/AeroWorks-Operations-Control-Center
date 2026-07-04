import { describe, expect, it } from "vitest"
import { daysUntil, formatDate } from "./dates"

describe("formatDate", () => {
  it("formats an ISO date as a short readable date", () => {
    expect(formatDate("2026-07-04")).toBe("Jul 4, 2026")
  })

  it("returns a placeholder for invalid dates", () => {
    expect(formatDate("not-a-date")).toBe("—")
  })
})

describe("daysUntil", () => {
  const NOW = new Date("2026-07-04T00:00:00Z")

  it("returns positive days for future dates", () => {
    expect(daysUntil("2026-07-10T00:00:00Z", NOW)).toBe(6)
  })

  it("returns zero for the same moment", () => {
    expect(daysUntil("2026-07-04T00:00:00Z", NOW)).toBe(0)
  })

  it("returns negative days for past dates", () => {
    expect(daysUntil("2026-07-01T00:00:00Z", NOW)).toBe(-3)
  })
})
