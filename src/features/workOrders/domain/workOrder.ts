import type { Criticality, RecordId } from "@/shared/types"
import { daysUntil } from "@/shared/utils/dates"

/** Work order kind, shaped toward the future `aw_workorder` choice column. */
export type WorkOrderType = "Corrective" | "Preventive"

/** Work order priority — reuses the shared criticality scale. */
export type WorkOrderPriority = Criticality

/** Work order lifecycle status. */
export type WorkOrderStatus = "Open" | "InProgress" | "Completed" | "Cancelled"

/** Work order record, shaped toward the future `aw_workorder` Dataverse table. */
export interface WorkOrder {
  id: RecordId
  title: string
  workOrderType: WorkOrderType
  priority: WorkOrderPriority
  status: WorkOrderStatus
  /** Lookup to `aw_asset`. */
  assetId: RecordId
  assetName: string
  assignee?: string
  /** ISO date the work is due. */
  dueDate: string
  /** Lookup to the `aw_incident` that triggered this work order, if any. */
  sourceIncidentId?: RecordId
  /** Lookup to the `aw_inspection` that triggered this work order, if any. */
  sourceInspectionId?: RecordId
}

const priorityRank: Record<WorkOrderPriority, number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
}

/** A work order is open while it is Open or InProgress. */
export function isWorkOrderOpen(workOrder: WorkOrder): boolean {
  return workOrder.status === "Open" || workOrder.status === "InProgress"
}

/**
 * Ranks open work orders for a technician's queue: overdue items first, then
 * by priority (Critical → Low), then by earliest due date. Completed and
 * cancelled work orders keep their relative order at the end of the list.
 * Does not mutate the input.
 */
export function rankWorkOrders(workOrders: WorkOrder[], now: Date): WorkOrder[] {
  return [...workOrders].sort((a, b) => {
    const aOpen = isWorkOrderOpen(a)
    const bOpen = isWorkOrderOpen(b)
    if (aOpen !== bOpen) {
      return aOpen ? -1 : 1
    }
    if (!aOpen) {
      return 0
    }
    const aOverdue = daysUntil(a.dueDate, now) < 0
    const bOverdue = daysUntil(b.dueDate, now) < 0
    if (aOverdue !== bOverdue) {
      return aOverdue ? -1 : 1
    }
    const byPriority = priorityRank[a.priority] - priorityRank[b.priority]
    if (byPriority !== 0) {
      return byPriority
    }
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  })
}
