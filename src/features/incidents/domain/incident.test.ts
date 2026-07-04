import { describe, expect, it } from "vitest"
import {
  isIncidentActive,
  sortIncidentsForReview,
  type Incident,
} from "./incident"

function makeIncident(overrides: Partial<Incident> = {}): Incident {
  return {
    id: "inc-1",
    title: "Belt jam",
    description: "Carousel stopped unexpectedly.",
    severity: "Medium",
    status: "Open",
    zoneId: "zone-1",
    zoneName: "Baggage Hall",
    reportedBy: "J. Park",
    reportedAt: "2026-07-01T08:00:00Z",
    ...overrides,
  }
}

describe("isIncidentActive", () => {
  it("returns true for open and investigating incidents", () => {
    expect(isIncidentActive(makeIncident({ status: "Open" }))).toBe(true)
    expect(isIncidentActive(makeIncident({ status: "Investigating" }))).toBe(true)
  })

  it("returns false for resolved and closed incidents", () => {
    expect(isIncidentActive(makeIncident({ status: "Resolved" }))).toBe(false)
    expect(isIncidentActive(makeIncident({ status: "Closed" }))).toBe(false)
  })
})

describe("sortIncidentsForReview", () => {
  it("orders incidents by severity, most severe first", () => {
    const sorted = sortIncidentsForReview([
      makeIncident({ id: "low", severity: "Low" }),
      makeIncident({ id: "critical", severity: "Critical" }),
      makeIncident({ id: "high", severity: "High" }),
      makeIncident({ id: "medium", severity: "Medium" }),
    ])
    expect(sorted.map((i) => i.id)).toEqual(["critical", "high", "medium", "low"])
  })

  it("breaks severity ties by oldest report first", () => {
    const sorted = sortIncidentsForReview([
      makeIncident({ id: "newer", severity: "High", reportedAt: "2026-07-02T10:00:00Z" }),
      makeIncident({ id: "older", severity: "High", reportedAt: "2026-06-28T10:00:00Z" }),
    ])
    expect(sorted.map((i) => i.id)).toEqual(["older", "newer"])
  })

  it("does not mutate the input array", () => {
    const input = [
      makeIncident({ id: "a", severity: "Low" }),
      makeIncident({ id: "b", severity: "Critical" }),
    ]
    sortIncidentsForReview(input)
    expect(input.map((i) => i.id)).toEqual(["a", "b"])
  })
})
