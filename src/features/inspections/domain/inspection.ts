import type { RecordId } from "@/shared/types"

/** Inspection type, shaped toward the future `aw_inspection` choice column. */
export type InspectionType = "Scheduled" | "AdHoc"

/** Inspection lifecycle status. */
export type InspectionStatus = "Scheduled" | "InProgress" | "Completed" | "Cancelled"

/** Outcome recorded when an inspection completes. */
export type InspectionOutcome = "Pass" | "PassWithFindings" | "Fail"

/** Inspection record, shaped toward the future `aw_inspection` Dataverse table. */
export interface Inspection {
  id: RecordId
  title: string
  /** Lookup to `aw_asset`. */
  assetId: RecordId
  assetName: string
  inspectionType: InspectionType
  status: InspectionStatus
  /** ISO date the inspection is due. */
  dueDate: string
  /** ISO date the inspection completed, when status is Completed. */
  completedDate?: string
  outcome?: InspectionOutcome
  inspector: string
}

/**
 * An inspection is overdue when it is still open (Scheduled or InProgress)
 * and its due date is strictly before the start of the current day.
 */
export function isInspectionOverdue(inspection: Inspection, now: Date): boolean {
  if (inspection.status === "Completed" || inspection.status === "Cancelled") {
    return false
  }
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return new Date(inspection.dueDate).getTime() < startOfToday.getTime()
}
