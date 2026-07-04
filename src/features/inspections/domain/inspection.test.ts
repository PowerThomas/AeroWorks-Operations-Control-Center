import { describe, expect, it } from "vitest"
import { isInspectionOverdue, type Inspection } from "./inspection"

const NOW = new Date("2026-07-04T15:30:00Z")

function makeInspection(overrides: Partial<Inspection> = {}): Inspection {
  return {
    id: "insp-1",
    title: "Quarterly safety check",
    assetId: "asset-1",
    assetName: "Jet Bridge A1",
    inspectionType: "Scheduled",
    status: "Scheduled",
    dueDate: "2026-07-10",
    inspector: "R. Vega",
    ...overrides,
  }
}

describe("isInspectionOverdue", () => {
  it("returns false when the due date is in the future", () => {
    expect(isInspectionOverdue(makeInspection({ dueDate: "2026-07-10" }), NOW)).toBe(false)
  })

  it("returns false when the inspection is due today", () => {
    expect(isInspectionOverdue(makeInspection({ dueDate: "2026-07-04" }), NOW)).toBe(false)
  })

  it("returns true when the due date is before today and the inspection is open", () => {
    expect(isInspectionOverdue(makeInspection({ dueDate: "2026-07-03" }), NOW)).toBe(true)
  })

  it("returns true for in-progress inspections past their due date", () => {
    expect(
      isInspectionOverdue(makeInspection({ status: "InProgress", dueDate: "2026-06-01" }), NOW),
    ).toBe(true)
  })

  it("returns false for completed inspections even when past due", () => {
    expect(
      isInspectionOverdue(
        makeInspection({ status: "Completed", dueDate: "2026-06-01", completedDate: "2026-06-05", outcome: "Pass" }),
        NOW,
      ),
    ).toBe(false)
  })

  it("returns false for cancelled inspections even when past due", () => {
    expect(
      isInspectionOverdue(makeInspection({ status: "Cancelled", dueDate: "2026-06-01" }), NOW),
    ).toBe(false)
  })
})
