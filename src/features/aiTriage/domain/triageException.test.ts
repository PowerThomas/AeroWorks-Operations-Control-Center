import { describe, expect, it } from "vitest"
import {
  prioritizeTriageExceptions,
  type TriageException,
} from "./triageException"

const NOW = new Date("2026-07-04T12:00:00Z")

function makeException(overrides: Partial<TriageException> = {}): TriageException {
  return {
    id: "exc-1",
    title: "Operate with overdue inspection",
    justification: "Peak season capacity requires the asset in service.",
    riskLevel: "Medium",
    status: "Pending",
    assetId: "asset-1",
    assetName: "Jet Bridge A1",
    requestedBy: "T. Berg",
    neededByDate: "2026-07-20",
    ...overrides,
  }
}

describe("prioritizeTriageExceptions", () => {
  it("only includes pending exceptions", () => {
    const result = prioritizeTriageExceptions(
      [
        makeException({ id: "pending", status: "Pending" }),
        makeException({ id: "approved", status: "Approved" }),
        makeException({ id: "rejected", status: "Rejected" }),
        makeException({ id: "escalated", status: "Escalated" }),
      ],
      NOW,
    )
    expect(result.map((r) => r.exception.id)).toEqual(["pending"])
  })

  it("ranks higher risk levels first when urgency is equal", () => {
    const result = prioritizeTriageExceptions(
      [
        makeException({ id: "low", riskLevel: "Low" }),
        makeException({ id: "critical", riskLevel: "Critical" }),
        makeException({ id: "high", riskLevel: "High" }),
      ],
      NOW,
    )
    expect(result.map((r) => r.exception.id)).toEqual(["critical", "high", "low"])
  })

  it("boosts urgency as the needed-by date approaches", () => {
    const result = prioritizeTriageExceptions(
      [
        makeException({ id: "far", neededByDate: "2026-08-30" }),
        makeException({ id: "imminent", neededByDate: "2026-07-05" }),
      ],
      NOW,
    )
    expect(result.map((r) => r.exception.id)).toEqual(["imminent", "far"])
  })

  it("caps urgency at 20 points when the needed-by date has passed", () => {
    const [overdue] = prioritizeTriageExceptions(
      [makeException({ id: "overdue", riskLevel: "Low", neededByDate: "2026-06-01" })],
      NOW,
    )
    expect(overdue.score).toBe(10 + 20)
  })

  it("adds a bonus for exceptions linked to an incident", () => {
    const result = prioritizeTriageExceptions(
      [
        makeException({ id: "no-incident", neededByDate: "2026-08-30" }),
        makeException({ id: "with-incident", neededByDate: "2026-08-30", incidentId: "inc-1" }),
      ],
      NOW,
    )
    expect(result.map((r) => r.exception.id)).toEqual(["with-incident", "no-incident"])
    expect(result[0].score - result[1].score).toBe(5)
  })

  it("breaks score ties by earlier needed-by date", () => {
    const result = prioritizeTriageExceptions(
      [
        makeException({ id: "later", neededByDate: "2026-09-10" }),
        makeException({ id: "earlier", neededByDate: "2026-08-30" }),
      ],
      NOW,
    )
    expect(result.map((r) => r.exception.id)).toEqual(["earlier", "later"])
  })

  it("returns an empty list when nothing is pending", () => {
    expect(prioritizeTriageExceptions([makeException({ status: "Approved" })], NOW)).toEqual([])
  })
})
