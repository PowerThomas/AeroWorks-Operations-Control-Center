import type { Asset } from "@/features/assets/domain/asset"
import { computeAssetHealthStatus } from "@/features/assets/domain/asset"
import type { Incident } from "@/features/incidents/domain/incident"
import { isIncidentActive } from "@/features/incidents/domain/incident"
import type { Inspection } from "@/features/inspections/domain/inspection"
import { isInspectionOverdue } from "@/features/inspections/domain/inspection"
import type { TriageException } from "@/features/aiTriage/domain/triageException"
import type { WorkOrder } from "@/features/workOrders/domain/workOrder"
import { isWorkOrderOpen } from "@/features/workOrders/domain/workOrder"

/** Cross-feature KPI summary shown on the dashboard. */
export interface DashboardSummary {
  totalAssets: number
  criticalAssets: number
  overdueInspections: number
  activeIncidents: number
  openWorkOrders: number
  pendingExceptions: number
}

interface DashboardInput {
  assets: Asset[]
  inspections: Inspection[]
  incidents: Incident[]
  workOrders: WorkOrder[]
  exceptions: TriageException[]
}

/** Computes the dashboard KPI summary from each feature's records. */
export function computeDashboardSummary(input: DashboardInput, now: Date): DashboardSummary {
  return {
    totalAssets: input.assets.length,
    criticalAssets: input.assets.filter(
      (asset) => computeAssetHealthStatus(asset) === "Critical",
    ).length,
    overdueInspections: input.inspections.filter((inspection) =>
      isInspectionOverdue(inspection, now),
    ).length,
    activeIncidents: input.incidents.filter(isIncidentActive).length,
    openWorkOrders: input.workOrders.filter(isWorkOrderOpen).length,
    pendingExceptions: input.exceptions.filter((exception) => exception.status === "Pending")
      .length,
  }
}
