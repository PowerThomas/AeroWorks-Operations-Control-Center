import type { Criticality, RecordId } from "@/shared/types"
import { daysUntil } from "@/shared/utils/dates"

/** Exception request status, shaped toward the future `aw_exceptionrequest` table. */
export type TriageExceptionStatus = "Pending" | "Approved" | "Rejected" | "Escalated"

/** Risk level — reuses the shared criticality scale. */
export type TriageRiskLevel = Criticality

/**
 * High-risk exception request, shaped toward the future `aw_exceptionrequest`
 * Dataverse table. Drives the AI triage feature.
 */
export interface TriageException {
  id: RecordId
  title: string
  justification: string
  riskLevel: TriageRiskLevel
  status: TriageExceptionStatus
  /** Lookup to `aw_asset`. */
  assetId: RecordId
  assetName: string
  /** Lookup to the related `aw_incident`, if any. */
  incidentId?: RecordId
  requestedBy: string
  /** ISO date the operational exception would need to start. */
  neededByDate: string
}

const riskRank: Record<TriageRiskLevel, number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
}

/** Result of prioritizing a pending exception for review. */
export interface PrioritizedTriageException {
  exception: TriageException
  /** Higher scores need attention sooner. */
  score: number
}

/**
 * Prioritizes *pending* exception requests for reviewer attention.
 *
 * Scoring: risk contributes most (Critical 40 … Low 10), urgency adds up to
 * 20 points as the needed-by date approaches (deadline passed = 20), and a
 * linked incident adds 5. Result is sorted by descending score; ties keep
 * the earlier needed-by date first.
 */
export function prioritizeTriageExceptions(
  exceptions: TriageException[],
  now: Date,
): PrioritizedTriageException[] {
  return exceptions
    .filter((exception) => exception.status === "Pending")
    .map((exception) => {
      const riskScore = (4 - riskRank[exception.riskLevel]) * 10
      const days = daysUntil(exception.neededByDate, now)
      const urgencyScore = days <= 0 ? 20 : Math.max(0, 20 - days * 2)
      const incidentScore = exception.incidentId ? 5 : 0
      return { exception, score: riskScore + urgencyScore + incidentScore }
    })
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score
      }
      return (
        new Date(a.exception.neededByDate).getTime() -
        new Date(b.exception.neededByDate).getTime()
      )
    })
}
