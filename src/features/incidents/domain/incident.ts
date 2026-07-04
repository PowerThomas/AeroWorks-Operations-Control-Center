import type { Criticality, RecordId } from "@/shared/types"

/** Incident severity — reuses the shared criticality scale. */
export type IncidentSeverity = Criticality

/** Incident lifecycle status, shaped toward the future `aw_incident` table. */
export type IncidentStatus = "Open" | "Investigating" | "Resolved" | "Closed"

/** Incident record, shaped toward the future `aw_incident` Dataverse table. */
export interface Incident {
  id: RecordId
  title: string
  description: string
  severity: IncidentSeverity
  status: IncidentStatus
  /** Lookup to `aw_asset`, when the incident is tied to a specific asset. */
  assetId?: RecordId
  assetName?: string
  /** Lookup to `aw_operationalzone`. */
  zoneId: RecordId
  zoneName: string
  reportedBy: string
  /** ISO date-time the incident was reported. */
  reportedAt: string
}

/** An incident is active while it is Open or Investigating. */
export function isIncidentActive(incident: Incident): boolean {
  return incident.status === "Open" || incident.status === "Investigating"
}

const severityRank: Record<IncidentSeverity, number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
}

/**
 * Sorts incidents for review: highest severity first, and within the same
 * severity the oldest report first. Does not mutate the input.
 */
export function sortIncidentsForReview(incidents: Incident[]): Incident[] {
  return [...incidents].sort((a, b) => {
    const bySeverity = severityRank[a.severity] - severityRank[b.severity]
    if (bySeverity !== 0) {
      return bySeverity
    }
    return new Date(a.reportedAt).getTime() - new Date(b.reportedAt).getTime()
  })
}
